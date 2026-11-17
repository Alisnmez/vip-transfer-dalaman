# Deployment workflow — VIP Transfer Dalaman

## MVP launch priorities — updated 2026-11-17

**Goal:** publish a usable booking website quickly, then ship improvements in versions. **CI and SEO are launch priorities**, not optional post-launch extras.

**P0 — before launch (minimal gates):**
1. **CI:** existing frontend lint/unit/build, backend PostgreSQL tests and basic booking-browser smoke must pass on the release commit. Fix failing checks; do not add unrelated test suites or polish.
2. **Booking:** customer can select transfer, enter required details, submit one booking and see confirmation; admin can sign in and view/manage it. Test with synthetic data on staging only.
3. **SEO:** production domain/HTTPS; crawlable public pages; correct title and meta description, canonical URLs, sitemap.xml, robots.txt, mobile usability and Search Console verification/submission. Verify generated HTML and deployed domain; avoid claiming rankings.
4. **Operations:** persistent production PostgreSQL separate from staging, private credentials, basic backup/restore path, working frontend-to-API URL/CORS, real contact details and clear cash-payment/cancellation wording.
5. **Trust and content:** publish a short FAQ, clear company/contact details and authorized vehicle photos. Add a customer photo gallery only with permission; use placeholders or omit unavailable photos. Show only genuine, permissioned customer reviews; never fabricate customer identities, ratings or testimonials.
6. **Release:** deploy verified commit, perform short production smoke without altering real bookings, keep rollback/redeploy path.

**Review submission status (2026-11-17):** `/reviews` now has a name, 1–5 rating, review text and publication-consent form. It opens a prefilled email draft; **this is not an automatic submission, saved review, or admin approval queue**. Before claiming those features work, implement backend storage, a pending/approved status and admin moderation, plus a real submit endpoint. The temporary mailto address must be checked/replaced before launch. Keep review content out of public pages until approved.\n\n**P1 — after launch:** collect and publish verified customer reviews (with consent), expand the authorized customer/vehicle photo gallery, improve FAQ content, and add extensive E2E scenarios, Flyway/Liquibase migration automation (until then no blind schema changes), advanced security hardening, analytics dashboards, competitor price research, extra features and visual refinements. Track them in `docs/EKSIKLERIMIZ.md`.

**Do not mistake a committed change for a passed CI run or a live deployment.** No production deploy or database mutation is authorized by this document.

---

Status: **TARGET PROCESS / NOT YET FULLY CONFIGURED**. This document defines how we will develop and release safely. Do not treat the branch protections, production services, or E2E gates below as already installed.

## Environments

| Environment | Code source | Hosting | Database | Purpose |
| --- | --- | --- | --- | --- |
| Development | `feature/*` | Local / CI | Disposable test PostgreSQL | Implement and unit/integration test |
| Staging | `staging` (planned) | Existing Render test frontend and API | Existing Render test PostgreSQL; separate from production | Browser E2E, smoke, acceptance tests with synthetic data |
| Production | `main` (planned release branch) | Separate production frontend and API | Separate paid PostgreSQL | Real customer bookings |

Current Render test URLs: `https://vip-transfer-dalaman-test.onrender.com` and `https://vip-transfer-dalaman-api-test.onrender.com`. Their current deployment branch is `feature/booking-integration`, **not** `staging`. Switching branches requires deliberate configuration and verification. The existing free test PostgreSQL has a reported expiry of 2026-12-15; verify retention and backups before depending on it.

## Change → release workflow

1. Create a focused `feature/*` branch from the agreed base. Keep changes small and reviewable.
2. Implement code and tests. Run frontend lint, unit tests, TypeScript build, and backend tests with isolated PostgreSQL in CI.
3. Open a pull request, review changes, check dependency/security findings, and require green CI. Configure GitHub branch protection before enforcing this gate.
4. Merge into `staging`. Deploy only to the staging services and staging database. Verify deployed commit SHA.
5. Run smoke and real-browser E2E: booking creation, admin authentication, PENDING → CONFIRMED / CANCELLED, refresh, mobile form, retry/double click, and no sensitive data exposure. Use **synthetic records only**.
6. Obtain explicit release approval; merge the tested release into `main`. Production deployment must be controlled, not an unchecked push from a feature branch.
7. Verify production health, HTTPS/CORS, public pages, admin access, booking flow with safe checks, logs and monitoring. Do not create real-looking customer bookings or mutate real bookings just to test.
8. Record release commit, checks, approver, deploy time, and any rollback actions in the change log.

## Database rules

- Staging must never connect to the production database. Use different database credentials, admin secrets, and API URLs.
- Never commit secrets, customer data, SQL dumps, or connection strings with credentials.
- Current backend uses `spring.jpa.hibernate.ddl-auto=update`. **Do not switch it on the existing database** until schema inventory, verified backup and isolated restore are completed.
- Prepare Flyway migrations against a clean disposable PostgreSQL and a restored copy of staging. Only then consider controlled rollout and Hibernate `validate`.
- Before a production schema change: backup, test restore, review compatibility with old/new app versions, record migration and recovery plan.
- Application rollback does **not** automatically undo a database migration. Prefer backward-compatible schema changes; do not blindly reverse destructive migrations.
- Reference: `docs/POSTGRES_MIGRATION_PLAN.md` and `docs/sql/postgres_booking_readonly_audit.sql`.

## Emergency hotfix

1. Reproduce and classify severity; if customer data or payment/security is affected, contain the issue first.
2. Branch from current production release, make the smallest safe fix, add regression test.
3. Run CI and staging smoke/E2E as far as incident urgency allows; obtain release approval.
4. Deploy to production and verify; merge the fix back into staging/development branches to avoid regression.
5. Document incident and root cause. For DB incidents use the approved backup/restore procedure; never restore over production casually.

## Release checklist

- [ ] Production and staging frontend/backend/DB resources are separate.
- [ ] `main` / `staging` branch protections, PR review and CI gates are configured.
- [ ] Production secrets, CORS origins, HTTPS, admin access and monitoring are checked.
- [ ] Real business prices, vehicle capacities, cash payment and cancellation terms approved.
- [ ] Database schema inventory, backup, isolated restore and migration tests passed.
- [ ] Automated CI and real-browser E2E passed on the **deployed staging SHA**.
- [ ] Mobile, network interruption, idempotency and admin permissions tested.
- [ ] Legal/contact content, production domain, robots/sitemap/canonical and consent tested.
- [ ] Release owner approves deployment; post-deploy checks and rollback instructions ready.

## Known limitations

GitHub Actions green is not proof of real-browser E2E. Existing Render test services and database do not mean a production environment exists. Managed backups and memory requirements must be confirmed against the selected paid Render plans before purchase.
