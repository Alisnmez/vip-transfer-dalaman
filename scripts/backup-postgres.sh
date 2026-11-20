#!/usr/bin/env bash
# Read-only PostgreSQL backup; never restores into the source database.
set -euo pipefail
: "${DATABASE_URL:?Set DATABASE_URL to a PostgreSQL connection string}"
: "${BACKUP_DIR:?Set BACKUP_DIR to a secure local directory}"
mkdir -p -- "$BACKUP_DIR"
chmod 700 -- "$BACKUP_DIR"
timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
output="$BACKUP_DIR/vip-transfer-$timestamp.dump"
umask 077
pg_dump --format=custom --no-owner --no-acl --file="$output" "$DATABASE_URL"
pg_restore --list "$output" >/dev/null
echo "Backup created and archive validated: $output"
echo "Archive validation is not a restore test. Restore only to a disposable database."
