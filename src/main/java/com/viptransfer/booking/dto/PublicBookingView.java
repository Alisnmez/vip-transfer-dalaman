package com.viptransfer.booking.dto;

import com.viptransfer.booking.Booking;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PublicBookingView(
        String reference, String status, String customerName, int passengerCount,
        String pickUpLocation, String dropOffLocation, LocalDateTime transferDateTime,
        LocalDateTime returnDateTime, String vehicleId, String tripType,
        BigDecimal price, String flightNumber, Integer luggageCount,
        Integer babySeatCount, String hotelName, String transferAddress) {
    public static PublicBookingView from(Booking b) {
        return new PublicBookingView(b.getReference(), b.getStatus(), b.getCustomerName(),
                b.getPassengerCount(), b.getPickUpLocation(), b.getDropOffLocation(),
                b.getTransferDateTime(), b.getReturnDateTime(), b.getVehicleId(), b.getTripType(),
                b.getPrice(), b.getFlightNumber(), b.getLuggageCount(),
                b.getBabySeatCount(), b.getHotelName(), b.getTransferAddress());
    }
}
