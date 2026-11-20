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

**Review status (2026-11-17):** The earlier mailto-only description below was superseded by review API, admin moderation, archive/restore and dated public-review changes on `feature/booking-integration`. The latest verified frontend/backend Render deployments both run commit `8fbbd3d6986a79c555f2fa7d00fcef5e03f9a29c`; GitHub CI passed. **Do not interpret this as completed live staging browser E2E**: real booking and review journeys still require synthetic-data verification, including persistence and admin authorization. Never publish fabricated reviews.

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


## Production budget and access decision — 2026-11-17

- Owner's working target: **approximately USD 31/month for backend + database**; total spending target approximately EUR 25–30/month. **Not a purchase authorization.** Confirm official prices, currency conversion, taxes, domain, email mailbox and backup costs before ordering.
- Candidate split to evaluate: Render paid Spring Boot backend with more RAM (indicative USD 25/month) + entry-level managed Render PostgreSQL (indicative USD 6/month). The small DB tier is **not approved for production** until storage, backup/restore, retention, connection and performance limits are checked. React static hosting and free-tier transactional email are separate assumptions, not guaranteed unlimited free services.
- Alternative split: smaller backend + larger managed PostgreSQL; choose only after measuring Java memory/CPU and DB needs under realistic traffic. Avoid treating a 512 MB JVM as production-ready without tests.
- Current confirmed access: GitHub repository and Render workspace `Ali's workspace` (workspace ID `tea-dbt0muvf3r2c73bjjde0`); existing staging frontend, API and test DB visible. Direct read-only SQL query from hosted Render connector **failed** because of database network allowlist/SSL restrictions. Do not weaken DB network rules or expose credentials to solve this.
- Desired phone-driven workflow: requested change → GitHub commit/PR → CI → staging deploy → synthetic E2E → explicit owner production release approval → production deploy and health check. Tool availability and permissions must be verified each session; do not promise unconditional access.
- Production release prerequisites: distinct staging/production secrets and DB, verified backup **and restore**, monitored email provider and reply-to, branch protection, least-privilege credentials, deployment/rollback checklist, and approved customer-facing content.
- **No paid resource, production deployment or database mutation has been performed under this plan.**
