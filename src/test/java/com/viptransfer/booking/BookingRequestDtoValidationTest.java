package com.viptransfer.booking;

import com.viptransfer.booking.dto.BookingRequestDto;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
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
        request.setPrice(new BigDecimal("50.00"));
        return request;
    }

    @Test
    void acceptsValidFutureBooking() {
        assertTrue(validator.validate(validRequest()).isEmpty());
    }

    @Test
    void rejectsPastPickup() {
        BookingRequestDto request = validRequest();
        request.setTransferDateTime(LocalDateTime.now().minusDays(1));
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
    void rejectsZeroPassengersAndNegativePrice() {
        BookingRequestDto request = validRequest();
        request.setPassengerCount(0);
        request.setPrice(new BigDecimal("-1.00"));
        assertEquals(2, validator.validate(request).size());
    }
}
