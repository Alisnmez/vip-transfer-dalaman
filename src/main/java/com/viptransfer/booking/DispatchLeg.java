package com.viptransfer.booking;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "dispatch_leg", uniqueConstraints = @UniqueConstraint(columnNames = {"booking_id", "leg"}))
class DispatchLeg {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) Long id;
    @Column(name = "booking_id", nullable = false) Long bookingId;
    @Column(nullable = false) String leg;
    String driver;
    String phone;
    String plate;
    Integer capacity;
    String stage;
    Instant assignedAt;
    Instant reviewedAt;
    int revision;
}
