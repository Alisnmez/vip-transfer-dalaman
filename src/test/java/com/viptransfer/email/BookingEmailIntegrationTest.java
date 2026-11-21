package com.viptransfer.email;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.viptransfer.booking.Booking;
import com.viptransfer.booking.BookingService;
import com.viptransfer.booking.dto.BookingRequestDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@SpringBootTest(properties = {
        "app.email.enabled=true", "app.email.provider=resend", "app.email.api-key=test-key-not-real",
        "app.email.from=DalamanWay <bookings@example.com>", "app.email.reply-to=operator@example.com",
        "app.email.operator=operator@example.com", "app.email.initial-delay-ms=86400000"
})
class BookingEmailIntegrationTest {
    @Autowired BookingService bookings;
    @Autowired JdbcTemplate jdbc;
    @Autowired EmailDispatcher dispatcher;
    @Autowired org.springframework.transaction.PlatformTransactionManager manager;
    @MockitoBean ResendGateway gateway;

    @BeforeEach void cleanQueue() { jdbc.update("DELETE FROM booking_email_outbox"); }

    private BookingRequestDto request() {
        var dto = new BookingRequestDto();
        dto.setCustomerName("Email test"); dto.setEmail("customer@example.com"); dto.setPhoneNumber("+447700900123");
        dto.setPassengerCount(2); dto.setPickUpLocation("Dalaman Airport"); dto.setDropOffLocation("Marmaris(Any Hotel)");
        dto.setVehicleId("vip-minivan"); dto.setTripType("one-way");
        dto.setTransferDateTime(LocalDateTime.now(ZoneId.of("Europe/Istanbul")).plusDays(3));
        return dto;
    }
    private long count(String status) {
        return jdbc.queryForObject("SELECT count(*) FROM booking_email_outbox WHERE status=?", Long.class, status);
    }
    @Test void bookingAndStatusRetriesDoNotQueueDuplicateEmails() {
        var dto = request(); String key = UUID.randomUUID().toString();
        Booking booking = bookings.createBooking(dto, key);
        assertEquals(booking.getId(), bookings.createBooking(dto, key).getId());
        assertEquals(2, count("PENDING")); // Customer and operator, never a shared To list.
        bookings.updateStatus(booking.getId(), "CONFIRMED");
        bookings.updateStatus(booking.getId(), "CONFIRMED");
        assertEquals(4, count("PENDING"));
        bookings.updateStatus(booking.getId(), "CANCELLED");
        assertEquals(6, count("PENDING"));
        verifyNoInteractions(gateway); // No network request in booking transaction.
    }
    @Test void bookingAndQueuedMessagesRollBackTogether() {
        long before = jdbc.queryForObject("SELECT count(*) FROM booking", Long.class);
        assertThrows(IllegalStateException.class, () -> new org.springframework.transaction.support.TransactionTemplate(manager)
                .execute(status -> {
                    bookings.createBooking(request(), UUID.randomUUID().toString());
                    throw new IllegalStateException("test rollback");
                }));
        assertEquals(before, jdbc.queryForObject("SELECT count(*) FROM booking", Long.class));
        assertEquals(0, count("PENDING"));
    }

    @Test void customerReceivesOnePendingAndOneConfirmedMessageForTheSameBooking() throws Exception {
        when(gateway.send(anyString(), anyString())).thenReturn("provider-test-id");
        String key = UUID.randomUUID().toString();
        var dto = request();
        Booking booking = bookings.createBooking(dto, key);
        assertEquals(booking.getId(), bookings.createBooking(dto, key).getId());

        var payloads = org.mockito.ArgumentCaptor.forClass(String.class);
        dispatcher.dispatch();
        verify(gateway, times(2)).send(anyString(), payloads.capture());
        assertEquals("PENDING", bookings.getBooking(booking.getId()).getStatus());
        var mapper = new ObjectMapper();
        var messages = new ArrayList<JsonNode>();
        for (String payload : payloads.getAllValues()) {
            var message = mapper.readTree(payload);
            if (message.path("to").path(0).asText().equals(dto.getEmail())) messages.add(message);
        }
        assertEquals(1, messages.size());
        assertEquals("DalamanWay | We received your transfer request (#" + booking.getId() + ")",
                messages.getFirst().path("subject").asText());
        assertTrue(messages.getFirst().path("text").asText().contains("not yet confirmed"));
        assertTrue(messages.getFirst().path("html").asText().contains("PENDING"));

        bookings.updateStatus(booking.getId(), "CONFIRMED");
        bookings.updateStatus(booking.getId(), "CONFIRMED");
        dispatcher.dispatch();
        var allPayloads = org.mockito.ArgumentCaptor.forClass(String.class);
        verify(gateway, times(4)).send(anyString(), allPayloads.capture());
        for (String payload : allPayloads.getAllValues().subList(2, 4)) {
            var message = mapper.readTree(payload);
            if (message.path("to").path(0).asText().equals(dto.getEmail())) messages.add(message);
        }
        assertEquals(2, messages.size());
        var confirmed = messages.getLast();
        assertEquals("DalamanWay | Your airport transfer is confirmed (#" + booking.getId() + ")",
                confirmed.path("subject").asText());
        assertTrue(confirmed.path("html").asText().contains("CONFIRMED"));
        assertFalse(confirmed.path("text").asText().contains("not yet confirmed"));
        assertEquals(4, count("ACCEPTED"));
    }

    @Test void interruptedDeliveryStaysClaimedAndIsNotBlindlyResent() {
        bookings.createBooking(request(), UUID.randomUUID().toString());
        when(gateway.send(anyString(), anyString())).thenThrow(new IllegalStateException("simulated interruption"));
        dispatcher.dispatch();
        assertEquals(2, count("FAILED"));
        doReturn("provider-id").when(gateway).send(anyString(), anyString());
        dispatcher.dispatch();
        assertEquals(0, count("SENDING")); assertEquals(2, count("FAILED")); assertEquals(0, count("ACCEPTED"));
        verify(gateway, times(2)).send(anyString(), anyString());
    }

    @Test void syntheticInvalidAddressNeverQueuesMailOrOperatorNotification() {
        var dto = request(); dto.setEmail("test@example.invalid");
        bookings.createBooking(dto, UUID.randomUUID().toString());
        assertEquals(0, count("PENDING"));
    }
    @Test void rollbackOfInvalidBookingLeavesNoEmail() {
        var dto = request(); dto.setTransferDateTime(LocalDateTime.now().minusDays(2));
        assertThrows(IllegalArgumentException.class, () -> bookings.createBooking(dto, UUID.randomUUID().toString()));
        assertEquals(0, count("PENDING"));
    }
    @Test void temporaryProviderFailurePreservesBookingAndRetriesSamePayloadAndKey() {
        Booking booking = bookings.createBooking(request(), UUID.randomUUID().toString());
        when(gateway.send(anyString(), anyString())).thenThrow(new ResendGateway.DeliveryFailure("HTTP_429", true));
        dispatcher.dispatch();
        assertEquals(2, count("PENDING")); assertEquals("PENDING", bookings.getBooking(booking.getId()).getStatus());
        var first = org.mockito.ArgumentCaptor.forClass(String.class);
        var payload = org.mockito.ArgumentCaptor.forClass(String.class);
        verify(gateway, times(2)).send(first.capture(), payload.capture());
        doReturn("provider-test-id").when(gateway).send(anyString(), anyString());
        jdbc.update("UPDATE booking_email_outbox SET next_attempt_at=now() - interval '1 second'");
        dispatcher.dispatch();
        assertEquals(2, count("ACCEPTED"));
        verify(gateway, times(2)).send(first.getAllValues().getFirst(), payload.getAllValues().getFirst());
    }
    @Test void permanentFailureAndExpiredEventsStopWithoutRetryingForever() {
        bookings.createBooking(request(), UUID.randomUUID().toString());
        when(gateway.send(anyString(), anyString())).thenThrow(new ResendGateway.DeliveryFailure("HTTP_403", false));
        dispatcher.dispatch(); assertEquals(2, count("FAILED"));
        dispatcher.dispatch(); verify(gateway, times(2)).send(anyString(), anyString());
        jdbc.update("UPDATE booking_email_outbox SET status='PENDING', next_attempt_at=now(), expires_at=now() - interval '1 second'");
        dispatcher.dispatch(); assertEquals(2, count("FAILED"));
        verify(gateway, times(2)).send(anyString(), anyString());
    }
    @Test void transientFailuresStopAfterSixAttempts() {
        bookings.createBooking(request(), UUID.randomUUID().toString());
        when(gateway.send(anyString(), anyString())).thenThrow(new ResendGateway.DeliveryFailure("NETWORK", true));
        jdbc.update("UPDATE booking_email_outbox SET attempts=5");
        dispatcher.dispatch(); assertEquals(2, count("FAILED"));
    }
}
