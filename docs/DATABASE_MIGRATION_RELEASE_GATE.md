# Production database migration and release gate

## Current state
- Hibernate schema mode defaults to `update`; production must set `HIBERNATE_DDL_AUTO=validate`.
- **No Flyway baseline or migrations are installed yet.** Setting `validate` alone does not provide migration management.
- Never run `baseline`, `repair`, or a schema-changing migration against an existing customer database before inventory, tested backup and explicit release approval.

## Before introducing Flyway
1. Export a schema-only dump of the existing **staging** database and inspect every table, index, foreign key and constraint.
2. Inventory all JPA entities and compare their expected schema with the dump. Resolve mismatches explicitly.
3. Create an initial SQL migration from the **verified actual schema**, not a guessed model. Test it against an empty PostgreSQL 16 database.
4. Restore a staging backup into an isolated disposable database. Check table counts, keys, representative records and application queries.
5. Test the baseline procedure on the isolated restored database, then enable Flyway on staging with a rollback plan.
6. Only after a successful staging rehearsal, schedule a production backup, migration window, post-migration smoke tests and rollback decision.

## Booking E2E acceptance gate
Use only explicitly labeled synthetic test data and an isolated staging database.
- Create a booking through the real frontend with a unique idempotency key.
- Verify the persisted booking through a permitted API/admin view.
- Retry the same request/key and verify no duplicate booking is created.
- Change booking status through the admin UI, refresh and verify persistence.
- Verify invalid transitions are rejected without corrupting state.
- Verify review moderation, date/status filters and safe user-facing errors.
- Never use an existing customer booking for testing.

## Automated backup test scope
The `postgres-backup-restore.yml` workflow verifies `pg_dump`/`pg_restore` on a **disposable synthetic PostgreSQL 16 database**. It is not evidence that a backup of the real staging or production database exists, nor that a real customer database can be restored.

## Production go/no-go
Production remains **NO-GO** until the real E2E, schema inventory, backup/restore rehearsal, security audit, admin authorization review, email delivery, privacy/legal content and production infrastructure are verified. Paid resources and production changes require explicit approval.
