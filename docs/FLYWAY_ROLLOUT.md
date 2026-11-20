# Flyway rollout — safe V1 database migration

## Current state
- `db/migration/V1__create_booking_and_reviews.sql` creates tables for **empty** PostgreSQL databases.
- CI runs V1 against a fresh, isolated database with `FLYWAY_ENABLED=true` and `HIBERNATE_DDL_AUTO=validate`.
- Existing staging/production databases must **not** run V1 directly. Flyway is disabled by default. Do not switch existing databases until a schema inventory, backup and disposable restore are verified.

## New empty database
Set `FLYWAY_ENABLED=true`, `HIBERNATE_DDL_AUTO=validate`, `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`. Startup executes V1, then Hibernate checks the mapped schema. If validation fails, stop and fix the migration, never use `ddl-auto=update` to conceal a mismatch.

## Existing populated database — operator-approved cutover
1. Capture a current backup with `scripts/backup-postgres.sh` and verify a restore to a **separate disposable** database. Record table/column/index/constraint inventory of `booking` and `customer_reviews`; compare with V1 and JPA entities. Check existing booking/review counts before and after.
2. Resolve all schema differences with reviewed, non-destructive versioned migrations. Never drop/recreate tables containing customer data.
3. Only after confirming the existing schema is equivalent to V1, establish Flyway history using a **one-time** baseline at version 1 (`spring.flyway.baseline-on-migrate=true` with `spring.flyway.baseline-version=1` on the approved deployment). Baseline **does not execute V1** on that existing database. Do not leave baseline-on-migrate enabled after initial adoption.
4. Start with `FLYWAY_ENABLED=true` and `HIBERNATE_DDL_AUTO=validate`; inspect logs, booking/review counts, admin queries and booking POST flow. Retain the verified backup and rollback plan.

**Important:** CI on a clean DB proves the migration creates a compatible schema; it cannot prove that an existing Render DB has the same structure. Existing staging DB is intentionally untouched until inspected. Production cutover requires explicit approval.
