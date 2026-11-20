-- Additive only: existing bookings and customer data remain unchanged.
CREATE TABLE booking_email_outbox (
    id uuid PRIMARY KEY,
    booking_id bigint NOT NULL REFERENCES booking(id),
    event_type varchar(32) NOT NULL,
    payload text NOT NULL,
    status varchar(16) NOT NULL DEFAULT 'PENDING',
    attempts integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL,
    next_attempt_at timestamptz NOT NULL,
    expires_at timestamptz NOT NULL,
    provider_message_id varchar(255),
    last_error varchar(64)
);
CREATE INDEX idx_email_outbox_due ON booking_email_outbox(status, next_attempt_at);
