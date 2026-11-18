-- Additive only: existing booking amounts and legacy price rows are preserved.
ALTER TABLE route_prices ADD COLUMN IF NOT EXISTS round_trip_price numeric(12,2);
ALTER TABLE route_prices ADD COLUMN IF NOT EXISTS version bigint NOT NULL DEFAULT 0;
ALTER TABLE route_prices ALTER COLUMN currency SET DEFAULT 'GBP';
