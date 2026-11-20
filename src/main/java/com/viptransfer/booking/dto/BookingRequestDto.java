package com.viptransfer.booking.dto;

import com.viptransfer.validation.InputFormats;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class BookingRequestDto {

    @jakarta.validation.constraints.Size(max = 120, message = "Customer name must be at most 120 characters.")
    @NotBlank(message = "Customer name is required.")
    @Pattern(regexp = InputFormats.PERSON_NAME, message = "Customer name contains invalid characters.")
    private String customerName;

    @NotNull(message = "Passenger count is required.")
    @Min(value = 1, message = "Passenger count must be at least 1.")
    private Integer passengerCount;

    @jakarta.validation.constraints.Size(max = 255)
    @NotBlank(message = "Pick-up location is required.")
    private String pickUpLocation;

    @jakarta.validation.constraints.Size(max = 255)
    @NotBlank(message = "Drop-off location is required.")
    private String dropOffLocation;

    @NotNull(message = "Transfer date and time is required.")
    private LocalDateTime transferDateTime;
    private LocalDateTime returnDateTime;

    @jakarta.validation.constraints.Size(max = 255)
    @NotBlank(message = "Vehicle is required.")
    private String vehicleId;

    @jakarta.validation.constraints.Size(max = 255)
    @NotBlank(message = "Trip type is required.")
    private String tripType;

    @jakarta.validation.constraints.Size(max = 255)
    @NotBlank(message = "Phone number is required.")
    private String phoneNumber;

    @jakarta.validation.constraints.Size(max = 255)
    @NotBlank(message = "Email is required.")
    @jakarta.validation.constraints.Email(message = "Email must be valid.")
    private String email;
    @jakarta.validation.constraints.Size(max = 255)
    private String countryOfResidence;
    @jakarta.validation.constraints.Size(max = 255, message = "Transfer address must be at most 255 characters.")
    private String transferAddress;
    @jakarta.validation.constraints.Size(max = 120, message = "Hotel name must be at most 120 characters.")
    private String hotelName;
    @jakarta.validation.constraints.Size(max = 2000, message = "Special requests must be at most 2000 characters.")
    private String specialRequests;

    @jakarta.validation.constraints.Size(max = 20, message = "Flight number must be at most 20 characters.")
    @jakarta.validation.constraints.Pattern(regexp = "[A-Za-z0-9 -]*", message = "Flight number contains invalid characters.")
    private String flightNumber;

    @jakarta.validation.constraints.Min(value = 0, message = "Luggage count cannot be negative.")
    @jakarta.validation.constraints.Max(value = 16, message = "Luggage count cannot exceed 16.")
    private Integer luggageCount;

    @jakarta.validation.constraints.Min(value = 0, message = "Baby seat count cannot be negative.")
    @jakarta.validation.constraints.Max(value = 2, message = "Baby seat count cannot exceed 2.")
    private Integer babySeatCount;

    public Integer getLuggageCount() { return luggageCount; }
    public void setLuggageCount(Integer value) { this.luggageCount = value; }
    public Integer getBabySeatCount() { return babySeatCount; }
    public void setBabySeatCount(Integer value) { this.babySeatCount = value; }

    public String getFlightNumber() { return flightNumber; }
    public void setFlightNumber(String flightNumber) { this.flightNumber = flightNumber; }

    public String getHotelName() { return hotelName; }
    public void setHotelName(String hotelName) { this.hotelName = hotelName; }

    public BookingRequestDto() {
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public Integer getPassengerCount() {
        return passengerCount;
    }

    public void setPassengerCount(Integer passengerCount) {
        this.passengerCount = passengerCount;
    }

    public String getPickUpLocation() {
        return pickUpLocation;
    }

    public void setPickUpLocation(String pickUpLocation) {
        this.pickUpLocation = pickUpLocation;
    }

    public String getDropOffLocation() {
        return dropOffLocation;
    }

    public void setDropOffLocation(String dropOffLocation) {
        this.dropOffLocation = dropOffLocation;
    }

    public LocalDateTime getTransferDateTime() {
        return transferDateTime;
    }

    public void setTransferDateTime(LocalDateTime transferDateTime) {
        this.transferDateTime = transferDateTime;
    }

    public LocalDateTime getReturnDateTime() {
        return returnDateTime;
    }

    public void setReturnDateTime(LocalDateTime returnDateTime) {
        this.returnDateTime = returnDateTime;
    }

    public String getCountryOfResidence() {
        return countryOfResidence;
    }

    public void setCountryOfResidence(String countryOfResidence) {
        this.countryOfResidence = countryOfResidence;
    }

    public String getTransferAddress() {
        return transferAddress;
    }

    public void setTransferAddress(String transferAddress) {
        this.transferAddress = transferAddress;
    }

    public String getSpecialRequests() {
        return specialRequests;
    }

    public void setSpecialRequests(String specialRequests) {
        this.specialRequests = specialRequests;
    }

    public String getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(String vehicleId) {
        this.vehicleId = vehicleId;
    }

    public String getTripType() {
        return tripType;
    }

    public void setTripType(String tripType) {
        this.tripType = tripType;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
