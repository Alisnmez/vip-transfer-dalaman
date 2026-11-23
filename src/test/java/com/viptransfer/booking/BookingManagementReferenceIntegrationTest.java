package com.viptransfer.booking;

import com.viptransfer.booking.dto.BookingManagementRequestDto;
import com.viptransfer.booking.dto.BookingRequestDto;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
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

    @Test void customerLookupRequiresCorrectEmailAndReturnsOnlyPublicFields() {
        BookingRequestDto dto = new BookingRequestDto();
        dto.setCustomerName("Lookup test");
        dto.setEmail("lookup@example.com");
        dto.setPhoneNumber("+447700900123");
        dto.setPassengerCount(2);
        dto.setPickUpLocation("Dalaman Airport");
        dto.setDropOffLocation("Marmaris(Any Hotel)");
        dto.setVehicleId("vip-minivan");
        dto.setTripType("one-way");
        dto.setTransferDateTime(LocalDateTime.now(ZoneId.of("Europe/Istanbul")).plusDays(4));
        Booking booking = bookings.createBooking(dto, UUID.randomUUID().toString());
        var publicDto = new com.viptransfer.booking.dto.PublicBookingLookupDto(
                booking.getReference().toLowerCase(java.util.Locale.ROOT), "LOOKUP@EXAMPLE.COM");
        var found = bookings.publicLookup(publicDto);
        assertEquals(booking.getReference(), found.reference());
        assertEquals(booking.getCustomerName(), found.customerName());
        assertEquals(booking.getTransferDateTime(), found.transferDateTime());
        assertFalse(java.util.Arrays.stream(found.getClass().getRecordComponents())
                .anyMatch(field -> java.util.Set.of("email", "phoneNumber", "idempotencyKey",
                        "requestFingerprint", "specialRequests").contains(field.getName())));

        var wrongEmail = new com.viptransfer.booking.dto.PublicBookingLookupDto(
                booking.getReference(), "wrong@example.com");
        assertEquals(HttpStatus.NOT_FOUND, assertThrows(ResponseStatusException.class,
                () -> bookings.publicLookup(wrongEmail)).getStatusCode());
        var unknown = new com.viptransfer.booking.dto.PublicBookingLookupDto(
                "ZZZZ999", "lookup@example.com");
        assertEquals(HttpStatus.NOT_FOUND, assertThrows(ResponseStatusException.class,
                () -> bookings.publicLookup(unknown)).getStatusCode());
    }

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

        assertTrue(booking.getReference().matches("[A-Z0-9]{7}"));
        assertFalse(booking.getReference().matches("[A-Z]{4}[0-9]{3}"));
        assertEquals(booking.getReference(), bookings.getBooking(booking.getId()).getReference());
        BookingManagementRequestDto dto = new BookingManagementRequestDto();
        dto.setBookingReference(booking.getReference());
        dto.setEmail("management@example.com");
        dto.setRequestType("CHANGE");
        dto.setMessage("Please change my pickup date.");
        BookingManagementRequestDto mismatched = new BookingManagementRequestDto();
        mismatched.setBookingReference(booking.getReference());
        mismatched.setEmail("wrong@example.com");
        mismatched.setRequestType("CHANGE");
        mismatched.setMessage("Change pickup time.");
        ResponseStatusException mismatch = assertThrows(ResponseStatusException.class,
                () -> requests.submit(mismatched, UUID.randomUUID().toString()));
        assertEquals(HttpStatus.NOT_FOUND, mismatch.getStatusCode());
        assertFalse(repository.existsByBookingIdAndStatusIn(booking.getId(), java.util.List.of("NEW")));

        mismatched.setBookingReference("ZZZZ999");
        ResponseStatusException missing = assertThrows(ResponseStatusException.class,
                () -> requests.submit(mismatched, UUID.randomUUID().toString()));
        assertEquals(HttpStatus.NOT_FOUND, missing.getStatusCode());

        requests.submit(dto, UUID.randomUUID().toString());
        assertTrue(repository.existsByBookingIdAndStatusIn(booking.getId(), java.util.List.of("NEW")));
        assertTrue(requests.list("ALL").stream().anyMatch(r -> r.bookingId() == booking.getId()
                && booking.getReference().equals(r.bookingReference())));
        ResponseStatusException duplicate = assertThrows(ResponseStatusException.class,
                () -> requests.submit(dto, UUID.randomUUID().toString()));
        assertEquals(HttpStatus.CONFLICT, duplicate.getStatusCode());

        assertNull(BookingReference.toId("#" + booking.getId()));
        assertNull(BookingReference.toId(String.valueOf(booking.getId())));
    }
}
