-- Read-only PostgreSQL booking schema audit.
-- Run against the intended staging database first. No customer row values are returned.
-- Do not run DDL/DML or copy credentials into the report.

BEGIN READ ONLY;

SELECT current_database() AS database_name,
       current_schema() AS schema_name,
       current_user AS connected_role,
       current_setting('server_version') AS postgres_version;

SELECT column_name, data_type, character_maximum_length, is_nullable,
       column_default
FROM information_schema.columns
WHERE table_schema = current_schema() AND table_name = 'booking'
ORDER BY ordinal_position;

SELECT con.conname AS constraint_name,
       con.contype AS constraint_type,
       pg_get_constraintdef(con.oid) AS definition
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
JOIN pg_namespace ns ON ns.oid = rel.relnamespace
WHERE ns.nspname = current_schema() AND rel.relname = 'booking'
ORDER BY con.conname;

SELECT indexname, indexdef
FROM pg_indexes
WHERE schemaname = current_schema() AND tablename = 'booking'
ORDER BY indexname;

SELECT sequence_name, data_type, start_value, increment
FROM information_schema.sequences
WHERE sequence_schema = current_schema()
ORDER BY sequence_name;

-- Verify the named performance indexes and whether PostgreSQL reports them valid/ready.
-- Missing rows are a finding, not permission to create indexes on production.
SELECT expected.index_name,
       actual.indexrelid IS NOT NULL AS exists_in_schema,
       COALESCE(actual.indisvalid, false) AS valid,
       COALESCE(actual.indisready, false) AS ready
FROM (VALUES ('idx_booking_status_transfer_time'),
             ('idx_booking_transfer_time')) AS expected(index_name)
LEFT JOIN (
    SELECT idx.relname AS index_name, i.indexrelid, i.indisvalid, i.indisready
    FROM pg_index i
    JOIN pg_class tbl ON tbl.oid = i.indrelid
    JOIN pg_namespace ns ON ns.oid = tbl.relnamespace
    JOIN pg_class idx ON idx.oid = i.indexrelid
    WHERE ns.nspname = current_schema() AND tbl.relname = 'booking'
) actual USING (index_name)
ORDER BY expected.index_name;

-- Only execute the next statement after confirming the physical column names above.
-- If the table or columns differ, skip it and inspect the actual schema first.
-- SELECT COUNT(*) AS total_rows,
--        COUNT(*) FILTER (WHERE idempotency_key IS NOT NULL) AS rows_with_key,
--        COUNT(DISTINCT idempotency_key) AS distinct_keys
-- FROM booking;

ROLLBACK;
