package com.viptransfer.email;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Read-only operator diagnostics. Never return payloads, customer addresses,
 * or provider credentials. Protected by the existing /bookings/** ADMIN rule.
 */
@RestController
@RequestMapping("/bookings")
public class BookingEmailDiagnosticsController {
    private final JdbcTemplate jdbc;

    public BookingEmailDiagnosticsController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public record EmailStatus(UUID id, long bookingId, String eventType,
                              String status, int attempts, OffsetDateTime createdAt,
                              OffsetDateTime nextAttemptAt, OffsetDateTime expiresAt,
                              String lastError, boolean providerAccepted) {}

    @GetMapping("/{bookingId:[0-9]+}/email-status")
    public List<EmailStatus> forBooking(@PathVariable long bookingId) {
        return jdbc.query("""
                SELECT id, booking_id, event_type, status, attempts, created_at,
                       next_attempt_at, expires_at, last_error,
                       (provider_message_id IS NOT NULL) AS provider_accepted
                FROM booking_email_outbox
                WHERE booking_id = ?
                ORDER BY created_at DESC, id DESC
                LIMIT 100
                """, (rs, index) -> new EmailStatus(
                rs.getObject("id", UUID.class),
                rs.getLong("booking_id"),
                rs.getString("event_type"),
                rs.getString("status"),
                rs.getInt("attempts"),
                rs.getObject("created_at", OffsetDateTime.class),
                rs.getObject("next_attempt_at", OffsetDateTime.class),
                rs.getObject("expires_at", OffsetDateTime.class),
                rs.getString("last_error"),
                rs.getBoolean("provider_accepted")
        ), bookingId);
    }
}
