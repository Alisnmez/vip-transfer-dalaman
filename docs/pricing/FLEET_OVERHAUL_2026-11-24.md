# Fleet overhaul — 2026-11-24

Status: preparation only; no runtime changes or tests executed.
Baseline main: `7cfec8738e3c9fb211212cb48d350a35dcd4131d`.

## Pricing
For each comparable published GBP competitor fare, calculate independently for one-way and round-trip: floor(reference GBP × 0.95 × 2) / 2. Use exact decimal arithmetic. Initial fares end in .00 or .50. Record source URL, date, route, vehicle capacity, service class and both reference fares. Do not invent missing fares or silently substitute another vehicle class. Admin overrides remain authoritative and are not discounted again. Target: 59 destinations × 7 active categories, subject to verified coverage.

## Fleet
Standard Vito; VIP Vito; VIP Maybach; Standard Sprinter 1–9; Standard Sprinter 1–15; VIP Sprinter 1–9; VIP Sprinter 1–15. Interior/exterior images supplied; binary upload and usage rights remain to be verified. Serve local WebP assets; preserve card layout and photo controls. Confirm actual passenger/luggage limits and amenities before publishing.

## Compatibility and release gates
- Preserve historical vehicle IDs, labels, fares and admin overrides; do not repurpose IDs with changed semantics or capacity without a compatibility plan.
- Keep existing route links, booking preselection, server-side pricing and capacity validation, admin price version checks and operational screens.
- Verify frontend/backend catalogue parity, localized copy, SEO and image HTTP responses.
- Run frontend lint/unit/build, backend PostgreSQL tests and browser booking/admin regression on staging with synthetic data.
- Verify backup/restore and rollback compatibility before any database migration. No production deployment or merge without owner approval.

## Progress
- [x] Dedicated feature branch created from main; baseline verified.
- [x] Owner pricing rule documented.
- [ ] Source-backed complete pricing matrix.
- [ ] Image upload and staging accessibility.
- [ ] Runtime implementation and regression tests.
- [ ] Staging acceptance and explicit production approval.
