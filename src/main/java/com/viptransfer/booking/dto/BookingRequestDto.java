package com.viptransfer.booking.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BookingRequestDto {

    @NotBlank(message = "Customer name is required.")
    private String customerName;

    @NotNull(message = "Passenger count is required.")
    @Min(value = 1, message = "Passenger count must be at least 1.")
    private Integer passengerCount;

    @NotBlank(message = "Pick-up location is required.")
    private String pickUpLocation;

    @NotBlank(message = "Drop-off location is required.")
    private String dropOffLocation;

    @NotNull(message = "Transfer date and time is required.")
    private LocalDateTime transferDateTime;

    @NotNull(message = "Price is required.")
    private BigDecimal price;

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

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}