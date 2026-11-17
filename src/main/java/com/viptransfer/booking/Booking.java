package com.viptransfer.booking;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.Instant;

@Entity
@jakarta.persistence.Table(indexes = {
    @jakarta.persistence.Index(name = "idx_booking_status_transfer_time", columnList = "status, transfer_date_time"),
    @jakarta.persistence.Index(name = "idx_booking_transfer_time", columnList = "transfer_date_time")
})
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String customerName;
    private Integer passengerCount;
    private String pickUpLocation;
    private String dropOffLocation;
    private LocalDateTime transferDateTime;
    private LocalDateTime returnDateTime;
    private BigDecimal price;
    private String phoneNumber;
    private String email;
    private String countryOfResidence;
    private String transferAddress;
    @jakarta.persistence.Column(length = 120)
    private String hotelName;
    @jakarta.persistence.Column(length = 2000)
    private String specialRequests;

    @jakarta.persistence.Column(length = 20)
    private String flightNumber;
    private Integer luggageCount;
    private Integer babySeatCount;
    private String vehicleId;
    private String tripType;
    private String status = "PENDING";

    @jakarta.persistence.Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @jakarta.persistence.PrePersist
    void setCreationTimestamp() {
        if (createdAt == null) createdAt = Instant.now();
    }

    public Instant getCreatedAt() { return createdAt; }

    @jakarta.persistence.Column(unique = true, length = 64)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private String idempotencyKey;

    @com.fasterxml.jackson.annotation.JsonIgnore
    private String requestFingerprint;

    public Integer getLuggageCount() { return luggageCount; }
    public void setLuggageCount(Integer value) { this.luggageCount = value; }
    public Integer getBabySeatCount() { return babySeatCount; }
    public void setBabySeatCount(Integer value) { this.babySeatCount = value; }

    public String getFlightNumber() { return flightNumber; }
    public void setFlightNumber(String flightNumber) { this.flightNumber = flightNumber; }

    public String getHotelName() { return hotelName; }
    public void setHotelName(String hotelName) { this.hotelName = hotelName; }

    public String getIdempotencyKey() { return idempotencyKey; }
    public void setIdempotencyKey(String value) { this.idempotencyKey = value; }
    public String getRequestFingerprint() { return requestFingerprint; }
    public void setRequestFingerprint(String value) { this.requestFingerprint = value; }

    public Booking() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
