package com.viptransfer.booking;

import com.viptransfer.booking.dto.BookingRequestDto;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class BookingRequestDtoValidationTest {
    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    private BookingRequestDto validRequest() {
        BookingRequestDto request = new BookingRequestDto();
        request.setCustomerName("Test Customer");
        request.setPassengerCount(2);
        request.setPickUpLocation("Dalaman Airport");
        request.setDropOffLocation("Fethiye");
        request.setTransferDateTime(LocalDateTime.now().plusDays(2));
        request.setVehicleId("vip-vito");
        request.setTripType("ONE_WAY");
        request.setPhoneNumber("+905551234567");
        request.setEmail("test@example.com");
        return request;
    }

    @Test
    void acceptsValidFutureBooking() {
        assertTrue(validator.validate(validRequest()).isEmpty());
    }

    @Test
    void rejectsMissingTransferDate() {
        BookingRequestDto request = validRequest();
        request.setTransferDateTime(null);
        assertTrue(validator.validate(request).stream()
                .anyMatch(v -> v.getPropertyPath().toString().equals("transferDateTime")));
    }

    @Test
    void rejectsMissingRequiredFields() {
        BookingRequestDto request = validRequest();
        request.setCustomerName(" ");
        request.setPickUpLocation(null);
        request.setDropOffLocation("");
        assertTrue(validator.validate(request).size() >= 3);
    }

    @Test
    void rejectsInvalidPassengerCountAndEmail() {
        BookingRequestDto request = validRequest();
        request.setPassengerCount(0);
        request.setEmail("not-an-email");
        assertEquals(2, validator.validate(request).size());
    }
}
