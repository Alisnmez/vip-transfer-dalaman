package com.viptransfer.booking.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class BookingManagementRequestDto {
    @NotBlank
    @Pattern(regexp = "(?i)[A-Z0-9]{7}")
    private String bookingReference;

    @NotBlank
    @Email
    @Size(max = 255)
    private String email;

    @NotBlank
    @Pattern(regexp = "CHANGE|CANCEL")
    private String requestType;

    @NotBlank
    @Size(max = 2000)
    private String message;

    public String getBookingReference() { return bookingReference; }
    public void setBookingReference(String bookingReference) { this.bookingReference = bookingReference; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRequestType() { return requestType; }
    public void setRequestType(String requestType) { this.requestType = requestType; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
