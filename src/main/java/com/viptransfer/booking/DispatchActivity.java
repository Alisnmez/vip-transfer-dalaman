package com.viptransfer.booking;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(
    name = "dispatch_activity",
    indexes = @Index(name = "idx_dispatch_activity_booking", columnList = "booking_id,id"))
class DispatchActivity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  Long id;

  @Column(name = "booking_id", nullable = false)
  Long bookingId;

  @Column(nullable = false)
  String leg;

  @Column(nullable = false)
  String description;

  @Column(nullable = false)
  Instant occurredAt;
}
