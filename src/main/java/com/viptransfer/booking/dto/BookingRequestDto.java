package com.viptransfer.booking.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BookingRequestDto {
    @NotBlank private String customerName;
    @NotNull @Min(1) private Integer passengerCount;
    @NotBlank private String pickUpLocation;
    @NotBlank private String dropOffLocation;
    @NotNull @Future private LocalDateTime transferDateTime;
    @NotNull @DecimalMin("0.0") private BigDecimal price;

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String value) { customerName = value; }
    public Integer getPassengerCount() { return passengerCount; }
    public void setPassengerCount(Integer value) { passengerCount = value; }
    public String getPickUpLocation() { return pickUpLocation; }
    public void setPickUpLocation(String value) { pickUpLocation = value; }
    public String getDropOffLocation() { return dropOffLocation; }
    public void setDropOffLocation(String value) { dropOffLocation = value; }
    public LocalDateTime getTransferDateTime() { return transferDateTime; }
    public void setTransferDateTime(LocalDateTime value) { transferDateTime = value; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal value) { price = value; }
}
