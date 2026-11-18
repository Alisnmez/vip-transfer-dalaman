package com.viptransfer.email;

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
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@SpringBootTest(properties = {
        "app.email.enabled=true", "app.email.provider=resend", "app.email.api-key=test-key-not-real",
        "app.email.from=DalamanWay <bookings@example.com>", "app.email.reply-to=operator@example.com",
        "app.email.operator=operator@example.com", "app.email.initial-delay-ms=86400000",
        // This suite runs only against the disposable CI database. Accommodate tables from earlier suites.
        "spring.flyway.enabled=true", "spring.flyway.baseline-on-migrate=true", "spring.flyway.baseline-version=1"
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

    @Test void interruptedDeliveryStaysClaimedAndIsNotBlindlyResent() {
        bookings.createBooking(request(), UUID.randomUUID().toString());
        when(gateway.send(anyString(), anyString())).thenThrow(new IllegalStateException("simulated interruption"));
        assertThrows(IllegalStateException.class, () -> dispatcher.dispatch());
        assertEquals(1, count("SENDING"));
        doReturn("provider-id").when(gateway).send(anyString(), anyString());
        dispatcher.dispatch();
        assertEquals(1, count("SENDING")); assertEquals(1, count("ACCEPTED"));
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
