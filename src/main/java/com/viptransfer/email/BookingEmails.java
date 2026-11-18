package com.viptransfer.email;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.viptransfer.booking.Booking;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.UUID;

/** Queue inside the booking transaction; delivery never runs on the customer's request thread. */
@Service
public class BookingEmails {
    private final JdbcTemplate jdbc;
    private final ObjectMapper json;
    private final EmailSettings settings;

    public BookingEmails(JdbcTemplate jdbc, ObjectMapper json, EmailSettings settings) {
        this.jdbc = jdbc; this.json = json; this.settings = settings;
    }

    public void queue(Booking booking, String event) {
        if (!settings.enabled()) return;
        // Suppress synthetic/special-use recipients; never send these tests to the operator either.
        String email = booking.getEmail();
        if (email == null || email.isBlank() || email.toLowerCase(java.util.Locale.ROOT).endsWith(".invalid")) return;
        String description = switch (event) {
            case "RECEIVED" -> "Your booking request was received. It is PENDING and is not yet confirmed.";
            case "CONFIRMED" -> "Your transfer booking has been confirmed by the operator.";
            case "CANCELLED" -> "Your booking has been cancelled by the operator.";
            case "PENDING" -> "Your booking is now pending operator confirmation.";
            default -> throw new IllegalArgumentException("Unsupported booking email event.");
        };
        String details = "Booking reference: #" + booking.getId()
                + "\nPickup: " + booking.getPickUpLocation()
                + "\nDestination: " + booking.getDropOffLocation()
                + "\nPickup time (Turkey local time): " + booking.getTransferDateTime()
                + (booking.getReturnDateTime() == null ? "" : "\nReturn time (Turkey local time): " + booking.getReturnDateTime())
                + "\nPassengers: " + booking.getPassengerCount()
                + "\nPublished fare: GBP " + booking.getPrice().toPlainString();
        String text = "DalamanWay\n\n" + description + "\n\n" + details
                + "\n\nNo online payment has been collected. Payment terms are confirmed by the operator."
                + "\nFor questions, reply to this email quoting your booking reference.\nhttps://dalamanway.com";
        enqueue(booking.getId(), event, email, "DalamanWay booking #" + booking.getId() + " — " + event.toLowerCase(java.util.Locale.ROOT), text);
        if (settings.operator() != null && !settings.operator().isBlank()) {
            enqueue(booking.getId(), event, settings.operator(), "[Operator] DalamanWay #" + booking.getId() + " — " + event,
                    description + "\n\n" + details + "\nReview details in the admin panel: https://dalamanway.com/admin/bookings/" + booking.getId());
        }
    }

    private void enqueue(Long bookingId, String event, String recipient, String subject, String text) {
        var payload = new LinkedHashMap<String, Object>();
        payload.put("from", settings.from()); payload.put("to", List.of(recipient));
        payload.put("reply_to", settings.replyTo()); payload.put("subject", subject); payload.put("text", text);
        try {
            Instant now = Instant.now();
            jdbc.update("""
                    INSERT INTO booking_email_outbox
                    (id, booking_id, event_type, payload, status, attempts, created_at, next_attempt_at, expires_at)
                    VALUES (?, ?, ?, ?, 'PENDING', 0, ?, ?, ?)
                    """, UUID.randomUUID(), bookingId, event, json.writeValueAsString(payload),
                    java.sql.Timestamp.from(now), java.sql.Timestamp.from(now), java.sql.Timestamp.from(now.plus(23, ChronoUnit.HOURS)));
        } catch (JsonProcessingException error) {
            throw new IllegalStateException("Could not serialize booking notification.");
        }
    }
}
