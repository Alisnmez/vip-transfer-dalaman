package com.viptransfer.booking.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record PublicBookingLookupDto(
        @NotBlank @Pattern(regexp = "(?i)[A-Z0-9]{7}") String bookingReference,
        @NotBlank @Email @Size(max = 255) String email) {}
