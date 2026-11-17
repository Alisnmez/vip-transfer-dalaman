# PostgreSQL schema migration plan — booking service

Status: **PLAN ONLY — not applied to Render database**.

## Why this is needed

`spring.jpa.hibernate.ddl-auto=update` currently modifies schema implicitly at application startup. This is unsuitable as the long-term production schema-change process. The `Booking` entity already contains `idempotencyKey` (unique, length 64) and `requestFingerprint`. Existing data must be preserved.

## Phase 0 — Read-only inventory in DBeaver

**Reusable audit script:** `docs/sql/postgres_booking_readonly_audit.sql`. It uses a read-only transaction and rolls back. It returns schema metadata only. Its optional row-count query is commented out until the actual column names are confirmed. Run it on the intended staging database, not blindly against production.


Run these on the **correct staging database** and save the output (do not paste customer data into issues):

```sql
SELECT current_database(), current_schema(), version();

SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_schema = current_schema() AND table_name = 'booking'
ORDER BY ordinal_position;

SELECT con.conname, pg_get_constraintdef(con.oid) AS definition
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
JOIN pg_namespace ns ON ns.oid = rel.relnamespace
WHERE ns.nspname = current_schema() AND rel.relname = 'booking';

SELECT indexname, indexdef
FROM pg_indexes
WHERE schemaname = current_schema() AND tablename = 'booking';

SELECT COUNT(*) AS total_rows,
       COUNT(*) FILTER (WHERE idempotency_key IS NOT NULL) AS rows_with_key,
       COUNT(DISTINCT idempotency_key) AS distinct_keys
FROM booking;
```

If column names differ, **stop** and inspect actual names first. Never run `DROP TABLE`, `TRUNCATE`, or blind `ALTER` on customer data.

## Phase 1 — Baseline existing schema

1. Take a verified PostgreSQL backup/snapshot and test restore to an isolated database.
2. Capture the current schema (including sequence, constraints, indexes, types, and nullable fields) from staging.
3. Select Flyway or Liquibase; create a **baseline** representing the *actual* schema, not an assumed fresh schema.
4. Verify the baseline on both a clean disposable database and a restored copy of staging.
5. Confirm the unique index/constraint on `idempotency_key` really exists; an annotation alone is not proof.

## Phase 2 — Controlled rollout

1. Add versioned migrations and integration tests that start with a clean PostgreSQL database.
2. Test migration on a restored staging copy containing representative existing bookings.
3. Set Hibernate to `validate` **only after** migrations pass and schema is aligned.
4. Deploy to staging, confirm startup and existing booking reads, then run duplicate-request/concurrent-request tests.
5. Record rollback procedure and backup restore verification before production rollout.

## Acceptance criteria

- Existing booking IDs and customer records are preserved.
- Unique idempotency key is enforced in PostgreSQL, not just Java.
- Repeated same-key same-payload POST returns the original booking ID.
- Same-key different-payload POST returns HTTP 409.
- Concurrent same-key POSTs result in exactly one row.
- A fresh DB can be initialized entirely from versioned migrations.
- Schema drift causes startup/test failure instead of silent mutation.

**Do not flip `ddl-auto` to `validate` or enable Flyway baseline automatically against the current live database before the inventory and backup are complete.**


## 2026-11-17 — Render staging inventory attempt

- Render resource: `vip-transfer-dalaman-test-db` (PostgreSQL 16, Frankfurt, Free plan); status `available` when checked.
- Read-only SQL inventory was **attempted but not executed successfully**: remote connection reported SSL/TLS required and an IP allowlist restriction. No schema facts were obtained from the live database.
- **Do not** disable TLS, open the database to `0.0.0.0/0`, or paste database credentials into chat to work around this.
- Next: connect with an authorized TLS-enabled client from an allowlisted workstation or a secure internal connection, run `docs/sql/postgres_booking_readonly_audit.sql`, and record schema metadata only.
- Before any migration or `ddl-auto` change: verify an actual backup and isolated restore. Free-plan database expiry/backup capabilities must be checked in Render, not assumed.
