package com.viptransfer.booking;

import com.viptransfer.booking.dto.BookingManagementRequestDto;
import com.viptransfer.booking.dto.BookingRequestDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(properties = {"app.email.enabled=false"})
class BookingManagementReferenceIntegrationTest {
    @Autowired BookingService bookings;
    @Autowired BookingManagementRequestService requests;
    @Autowired BookingManagementRequestRepository repository;

    @Test void newPublicReferenceCreatesVisibleChangeRequestAndNumericReferenceIsRejected() {
        BookingRequestDto bookingDto = new BookingRequestDto();
        bookingDto.setCustomerName("Management test");
        bookingDto.setEmail("management@example.com");
        bookingDto.setPhoneNumber("+447700900123");
        bookingDto.setPassengerCount(2);
        bookingDto.setPickUpLocation("Dalaman Airport");
        bookingDto.setDropOffLocation("Marmaris(Any Hotel)");
        bookingDto.setVehicleId("vip-minivan");
        bookingDto.setTripType("one-way");
        bookingDto.setTransferDateTime(LocalDateTime.now(ZoneId.of("Europe/Istanbul")).plusDays(4));
        Booking booking = bookings.createBooking(bookingDto, UUID.randomUUID().toString());

        BookingManagementRequestDto dto = new BookingManagementRequestDto();
        dto.setBookingReference(booking.getReference());
        dto.setEmail("management@example.com");
        dto.setRequestType("CHANGE");
        dto.setMessage("Please change my pickup date.");
        requests.submit(dto, UUID.randomUUID().toString());
        assertTrue(repository.existsByBookingIdAndStatusIn(booking.getId(), java.util.List.of("NEW")));
        assertTrue(requests.list("ALL").stream().anyMatch(r -> r.bookingId() == booking.getId()));

        assertNull(BookingReference.toId("#" + booking.getId()));
        assertNull(BookingReference.toId(String.valueOf(booking.getId())));
    }
}
