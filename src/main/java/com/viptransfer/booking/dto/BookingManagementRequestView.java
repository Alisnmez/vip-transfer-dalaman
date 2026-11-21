package com.viptransfer.booking.dto;

import java.time.Instant;

public record BookingManagementRequestView(
        long id,
        long bookingId,
        String requestType,
        String message,
        String status,
        String adminNote,
        Instant createdAt,
        Instant updatedAt,
        String customerName,
        String customerEmail,
        String pickup,
        String destination,
        java.time.LocalDateTime transferDateTime,
        java.time.LocalDateTime returnDateTime,
        String bookingStatus
) { }
