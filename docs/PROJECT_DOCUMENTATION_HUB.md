# DalamanWay — Project Documentation Hub

**Date:** 21 November 2026  
**Purpose:** A single entry point that consolidates the project’s recurring decisions, release rules, and documentation ownership.

> **Preservation note:** This hub is additive. The source Markdown files remain unchanged and no files or history have been deleted. Older documents may contain useful evidence, but dated branch, CI, deployment, pricing, or provider statements must be rechecked before acting on them.

## 1. Project and working rules

DalamanWay is a private airport-transfer booking site. The repository uses a React/TypeScript/Vite frontend, a Java/Spring Boot backend, and PostgreSQL.

- Treat GitHub’s current branch, commit, PR, CI, and deployment records as current evidence. Markdown snapshots are historical unless freshly verified.
- The most recently documented working branch is feature/booking-integration. Check the current HEAD and deployment source before editing; main has had separate history and must not be merged or overwritten blindly.
- Keep changes small and reviewable. Use synthetic data for tests. Do not expose customer data, secrets, or raw server errors.
- Work through an isolated change/PR and the test environment. Production release requires verified checks and explicit owner approval.
- Only genuine, permissioned customer reviews and images may be published. Never create fabricated reviews, identities, or ratings.

## 2. Consolidated release and customer-facing requirements

The first release should accept a real booking request and let the operator securely receive and handle it. Do not present unavailable features or unconfirmed business terms as facts.

1. Confirm the operating business, carrier/agency role, required permits, insurance, contact details, and invoice issuer.
2. Confirm real tariffs, vehicle capacities, payment timing, cancellation/refund terms, waiting and flight-delay rules, and customer-support channel with the operator.
3. Publish accurate privacy/KVKK information, terms, cancellation information, and any required consent. Do not use sample legal text as approved policy.
4. Verify the public booking flow, server-side price and capacity validation, duplicate-submit protection, safe error handling, admin authorization, and booking persistence using synthetic data in staging.
5. Verify domain/HTTPS, API/CORS, production database separation, secret handling, backup and isolated restore, monitoring, and rollback.
6. Verify SEO only against the deployed domain: page status, title/description, canonical, robots, sitemap, indexability, mobile behavior, and Search Console ownership. Keep staging and personal/admin pages out of search.
7. Verify the exact deployed commit and its CI, staging smoke, and browser results. Perform a non-destructive production smoke only after approval.

Online card payment is out of the v1.0 scope in the recorded owner decision. The recorded payment method is cash; the time of collection still requires confirmation. Do not infer cancellation or refund promises.

## 3. Database migration and release safety

The project has a V1 Flyway migration file and CI exercises it against a fresh disposable PostgreSQL database. That does **not** prove Flyway has been baselined or run against an existing Render database.

For any existing database:

- First capture a read-only schema inventory and compare it with JPA entities and migrations.
- Produce a verified backup and restore it only to a separate disposable database.
- Reconcile schema differences with reviewed, non-destructive migrations.
- Rehearse the baseline/migration and application validation on the isolated restore.
- Only after a successful staging rehearsal should an approved production migration be planned.

Never run V1 blindly on a populated database, use Hibernate update to hide schema drift, disable TLS, open database access broadly, or restore over production. Keep customer records untouched during tests.

## 4. SEO and market planning

Use frontend/SEO_STANDARD.md as the repository’s primary SEO policy and current audit record. It contains technical requirements and dated observations; recheck live claims before relying on them.

- Use one SEO source of truth for route metadata, canonicals, sitemap, robots, hreflang, prerendered HTML, and indexability.
- Preserve existing booking behavior and URLs unless a tested redirect plan exists.
- Publish only useful, genuinely localized route content and verified operating details. Do not invent search volume, rankings, prices, travel times, reviews, licenses, or promises.
- Measure Search Console and analytics only with authorized access and appropriate consent/data minimization.
- The UK plan and four-market research contain market-specific research and execution details. Their unique still-valid findings should be folded into the primary SEO standard; their dated snapshots are not current status.

## 5. Email and notification decision

The email notes contain an older Resend setup path and a later owner choice of Gmail. Treat Gmail as the recorded selected sender path unless a newer owner decision is verified. Do not assume production delivery is active merely because code or CI exists.

Before enabling customer email, verify provider configuration, sender/reply-to access, secrets in backend environment only, duplicate prevention, failure handling, staging delivery to an authorized test inbox, and actual inbox/reply behavior. Provider acceptance is not proof of inbox delivery. Keep sending disabled until the release gate is satisfied.

## 6. Backlog, evidence, and pricing

- docs/EKSIKLERIMIZ.md is the historical implementation/evidence log and contains a current-task section followed by extensive dated history. Keep new task status concise and evidence-based; do not treat old CI or deployment records as current.
- docs/ILK_YAYIN_KONTROL_LISTESI.md owns the launch GO/NO-GO checklist.
- docs/CANLI_YAYIN_SONRASI_GELISTIRMELER.md owns post-launch ideas and versioned backlog. UK-specific sequencing may be linked from it or kept as a clearly scoped plan, without duplicating generic backlog items.
- docs/pricing/SOURCE_COVERAGE_2026-11-18.md records tariff provenance and calculation limitations. Treat its calculated fares as estimates unless commercially approved; keep the source inputs and generated audit files alongside it.

## 7. Topic ownership map

| Topic | Primary document | Related documents to preserve |
|---|---|---|
| Current implementation status and evidence | docs/EKSIKLERIMIZ.md | PROJECT_HANDOVER.md |
| Launch scope and GO/NO-GO | docs/ILK_YAYIN_KONTROL_LISTESI.md | LAUNCH_LEGAL_CHECKLIST.md on main; docs/DEPLOYMENT_WORKFLOW.md |
| Release workflow and environments | docs/DEPLOYMENT_WORKFLOW.md | docs/DATABASE_MIGRATION_RELEASE_GATE.md |
| PostgreSQL/Flyway migration | docs/POSTGRES_MIGRATION_PLAN.md | docs/FLYWAY_ROLLOUT.md; docs/DATABASE_MIGRATION_RELEASE_GATE.md |
| SEO policy and live audit | frontend/SEO_STANDARD.md | docs/SEO_FOUR_MARKETS_RESEARCH_2026-11-19.md; docs/DALAMANWAY_UK_UPGRADE_PLAN.md |
| Post-launch backlog | docs/CANLI_YAYIN_SONRASI_GELISTIRMELER.md | docs/DALAMANWAY_UK_UPGRADE_PLAN.md |
| Email setup and delivery | docs/EMAIL_SETUP_AND_TROUBLESHOOTING.md | Relevant status in docs/EKSIKLERIMIZ.md |
| Tariff provenance | docs/pricing/SOURCE_COVERAGE_2026-11-18.md | docs/pricing JSON inputs and audit files |
| Learning notes | docs/OGRENME_GUNLUGU.md | — |
| Frontend setup | frontend/README.md | Replace template text with project-specific commands when convenient |

## 8. Known documentation conflicts to resolve

1. The database release gate says no migration is installed, while the Flyway rollout says V1 exists and CI runs it. The safe consolidated interpretation is: a migration script and fresh-database CI exist; an existing Render database cutover is not evidenced.
2. The email document contains Resend instructions, then records Gmail as the owner’s later choice. Keep the current setup instructions aligned to the latest verified choice.
3. The four-market SEO note says the primary SEO document was not found, but frontend/SEO_STANDARD.md exists in the repository. Treat that note as an older, supplementary snapshot.
4. Deployment and SEO notes contain dated branch, URL, CI, and live-indexation claims. Recheck current GitHub, Render, and Search Console state before using them.
5. LAUNCH_LEGAL_CHECKLIST.md is present on main but absent from the inspected feature branch. Do not assume it is available in the active branch until deliberately brought over.

## 9. Documents retained unchanged

This hub does not replace or delete the following existing files: PROJECT_HANDOVER.md; docs/CANLI_YAYIN_SONRASI_GELISTIRMELER.md; docs/DALAMANWAY_UK_UPGRADE_PLAN.md; docs/DATABASE_MIGRATION_RELEASE_GATE.md; docs/DEPLOYMENT_WORKFLOW.md; docs/EKSIKLERIMIZ.md; docs/EMAIL_SETUP_AND_TROUBLESHOOTING.md; docs/FLYWAY_ROLLOUT.md; docs/ILK_YAYIN_KONTROL_LISTESI.md; docs/OGRENME_GUNLUGU.md; docs/POSTGRES_MIGRATION_PLAN.md; docs/SEO_FOUR_MARKETS_RESEARCH_2026-11-19.md; docs/pricing/SOURCE_COVERAGE_2026-11-18.md; docs/render-auto-deploy-check.md; frontend/README.md; frontend/SEO_STANDARD.md.

The separately created branch inventory remains on its own documentation branch and is not part of this consolidation.
