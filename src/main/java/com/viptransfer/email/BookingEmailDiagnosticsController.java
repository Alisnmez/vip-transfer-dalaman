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
                              String status, String recipientRole, int attempts, OffsetDateTime createdAt,
                              OffsetDateTime nextAttemptAt, OffsetDateTime expiresAt,
                              String lastError, boolean providerAccepted) {}

    @GetMapping("/{bookingId:[0-9]+}/email-status")
    public List<EmailStatus> forBooking(@PathVariable long bookingId) {
        return jdbc.query("""
                SELECT o.id, o.booking_id, o.event_type, o.status, o.attempts, o.created_at,
                       o.next_attempt_at, o.expires_at, o.last_error,
                       (o.provider_message_id IS NOT NULL) AS provider_accepted,
                       CASE WHEN lower(o.payload::jsonb -> 'to' ->> 0) = lower(b.email)
                            THEN 'CUSTOMER' ELSE 'OPERATOR_OR_OTHER' END AS recipient_role
                FROM booking_email_outbox o
                JOIN booking b ON b.id = o.booking_id
                WHERE o.booking_id = ?
                ORDER BY o.created_at DESC, o.id DESC
                LIMIT 100
                """, (rs, index) -> new EmailStatus(
                rs.getObject("id", UUID.class),
                rs.getLong("booking_id"),
                rs.getString("event_type"),
                rs.getString("status"),
                rs.getString("recipient_role"),
                rs.getInt("attempts"),
                rs.getObject("created_at", OffsetDateTime.class),
                rs.getObject("next_attempt_at", OffsetDateTime.class),
                rs.getObject("expires_at", OffsetDateTime.class),
                rs.getString("last_error"),
                rs.getBoolean("provider_accepted")
        ), bookingId);
    }
}
