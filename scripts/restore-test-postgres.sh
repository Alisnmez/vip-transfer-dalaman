#!/usr/bin/env bash
# Restore a custom-format backup ONLY into a dedicated disposable PostgreSQL database.
set -euo pipefail
: "${BACKUP_FILE:?Set BACKUP_FILE to a pg_dump custom-format archive}"
: "${RESTORE_DATABASE_URL:?Set RESTORE_DATABASE_URL to a disposable database connection string}"
: "${CONFIRM_DISPOSABLE_RESTORE:?Set CONFIRM_DISPOSABLE_RESTORE=YES to acknowledge data loss}"
if [[ "$CONFIRM_DISPOSABLE_RESTORE" != "YES" ]]; then
  echo "Refusing restore without CONFIRM_DISPOSABLE_RESTORE=YES" >&2
  exit 1
fi
if [[ ! -f "$BACKUP_FILE" ]]; then
  echo "Backup file not found" >&2
  exit 1
fi
# Never use the source database connection as the restore destination.
if [[ -n "${DATABASE_URL:-}" && "$RESTORE_DATABASE_URL" == "$DATABASE_URL" ]]; then
  echo "Refusing to restore into source DATABASE_URL" >&2
  exit 1
fi
# Require a recognizable disposable database name; use a separate instance for testing.
if [[ ! "$RESTORE_DATABASE_URL" =~ /(restore_test|restore-test|disposable)(\\?|$) ]]; then
  echo "Restore URL must name a database containing restore_test, restore-test or disposable" >&2
  exit 1
fi
pg_restore --list "$BACKUP_FILE" >/dev/null
# Destination must already exist and be empty. No --clean, --create, or --if-exists.
table_count="$(psql "$RESTORE_DATABASE_URL" -Atqc "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'")"
if [[ "$table_count" != "0" ]]; then
  echo "Refusing to restore into a nonempty database ($table_count public tables)" >&2
  exit 1
fi
pg_restore --exit-on-error --single-transaction --no-owner --no-acl --dbname="$RESTORE_DATABASE_URL" "$BACKUP_FILE"
psql "$RESTORE_DATABASE_URL" -v ON_ERROR_STOP=1 -Atqc "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'"
echo "Restore completed into disposable database. Inspect application-level data separately."
