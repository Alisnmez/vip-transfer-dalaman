package com.viptransfer.email;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.transaction.PlatformTransactionManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.Instant;
import java.sql.Timestamp;
import java.util.UUID;

/** Claim and commit before delivery. Interrupted SENDING entries require review, never blind resend. */
@Service
@ConditionalOnProperty(name = "app.email.enabled", havingValue = "true")
public class EmailDispatcher {
    private static final Logger log = LoggerFactory.getLogger(EmailDispatcher.class);
    private final JdbcTemplate jdbc;
    private final EmailGateway gateway;
    private final TransactionTemplate transactions;

    public EmailDispatcher(JdbcTemplate jdbc, EmailGateway gateway, PlatformTransactionManager manager) {
        this.jdbc = jdbc; this.gateway = gateway; this.transactions = new TransactionTemplate(manager);
    }

    @Scheduled(fixedDelayString = "${app.email.poll-ms:15000}", initialDelayString = "${app.email.initial-delay-ms:15000}")
    public void dispatch() {
        for (int i = 0; i < 5; i++) {
            Pending pending = transactions.execute(transaction -> claimOne());
            if (pending == null) break;
            if (!pending.expires().isAfter(Instant.now())) { fail(pending, "EXPIRED"); continue; }
            try {
                String providerId = gateway.send(pending.id().toString(), pending.payload());
                jdbc.update("UPDATE booking_email_outbox SET status='ACCEPTED', provider_message_id=?, last_error=null WHERE id=?", providerId, pending.id());
                log.info("Booking email event {} accepted by email provider", pending.id());
            } catch (EmailGateway.DeliveryFailure failure) {
                int attempt = pending.attempts() + 1;
                if (!failure.retryable || attempt >= 6) fail(pending, failure.getMessage());
                else {
                    jdbc.update("UPDATE booking_email_outbox SET status='PENDING', next_attempt_at=?, last_error=? WHERE id=?",
                            Timestamp.from(Instant.now().plusSeconds(60L << (attempt - 1))), failure.getMessage(), pending.id());
                    log.warn("Booking email event {} will retry ({})", pending.id(), failure.getMessage());
                }
            } catch (RuntimeException unexpected) {
                // The SMTP send outcome may be unknown; never retry automatically.
                fail(pending, "DISPATCH_UNEXPECTED");
                log.error("Booking email event {} encountered unexpected delivery error", pending.id(), unexpected);
            }
        }
    }

    private Pending claimOne() {
        var rows = jdbc.query("""
                SELECT id, payload, attempts, expires_at FROM booking_email_outbox
                WHERE status = 'PENDING' AND next_attempt_at <= now()
                ORDER BY created_at, id LIMIT 1 FOR UPDATE SKIP LOCKED
                """, (rs, row) -> new Pending(rs.getObject("id", UUID.class), rs.getString("payload"),
                rs.getInt("attempts"), rs.getTimestamp("expires_at").toInstant()));
        if (rows.isEmpty()) return null;
        Pending pending = rows.getFirst();
        jdbc.update("UPDATE booking_email_outbox SET status='SENDING', attempts=attempts+1 WHERE id=?", pending.id());
        return pending;
    }
    private void fail(Pending pending, String code) {
        jdbc.update("UPDATE booking_email_outbox SET status='FAILED', last_error=? WHERE id=?", code, pending.id());
        log.error("Booking email event {} requires operator review ({})", pending.id(), code);
    }
    private record Pending(UUID id, String payload, int attempts, Instant expires) { }
}
