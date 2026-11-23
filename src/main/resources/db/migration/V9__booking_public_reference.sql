-- Existing booking rows retain their historical ID-derived public references.
-- Newly created bookings persist cryptographically random public references.
ALTER TABLE booking ADD COLUMN IF NOT EXISTS reference varchar(7);
CREATE UNIQUE INDEX IF NOT EXISTS uq_booking_public_reference ON booking (reference);
