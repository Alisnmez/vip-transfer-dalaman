# VIP Transfer Dalaman — Project handover (2026-11-17)

> This is a living handover, NOT a claim that every past chat message or repository file has been audited. Read this file, inspect the repository and its other Markdown documents, and consult the original ChatGPT project conversation where accessible. Do not infer that another chat automatically has full access to this chat's transcript or its connections.

## Source of truth and continuity
- GitHub: https://github.com/Alisnmez/vip-transfer-dalaman
- Working branch discussed: `feature/booking-integration`.
- Original long-running ChatGPT conversation: the conversation about developing the VIP Transfer Dalaman site, including its decisions, tests, deployments and TODOs. Exact chat title and direct chat URL are not verified here. Ask the user to open/share it if the new chat cannot retrieve it.
- Sources in priority order for implementation facts: current branch code/config, test logs and status, existing project Markdown/TODO documents, then conversation decisions. Preserve distinctions between verified facts, past reports and proposals.
- In a new chat, check that GitHub is connected and authorized; connected apps are not guaranteed to be accessible automatically.

## User's development rules / working agreement (from conversation)
- Use standard, readable, maintainable code and consistent naming. Avoid unusual abstractions and overengineering; explain code in a way the owner can learn.
- Reuse shared helpers/services/components instead of duplicating logic. In particular, centralize user-facing error mapping/notification across screens; do not show raw HTTP errors such as `409 Conflict`.
- Respect clear frontend/backend/database responsibility boundaries; use React/TypeScript, Spring Boot and PostgreSQL architecture as discussed, but inspect actual code before describing precise implementation.
- Security and authorization must be tested, including admin routes and booking access. Never use real customer data for tests.
- Prefer incremental, substantive batches of work with tests, clear commits and honest progress reports. Do not call tests passed without CI evidence.
- Ship a safe MVP without endless polish; keep future improvements in the prioritized backlog. Explain decisions, trade-offs and why they were made.
- Use a staging/test environment, verify changes there, and deploy to production in a controlled fashion. Production hosting/database/provider decisions are still to be investigated/confirmed.
- User wants to continue making changes through ChatGPT after launch, ideally staging-first then production.
- Email delivery to customers is not yet confirmed operational; record it as an outstanding task, including provider and pricing research.
- Admin-configurable contact details were requested; temporary phone/email values should be reviewed and changed before launch.
- Reservation statuses include `canceled` as a discussed requirement; inspect actual code and spelling/transition rules before claiming complete support.

## Recent confirmed/reported development timeline
These results are from the original conversation's reports unless specifically marked verified in this handover:
- `e4d3400`: Playwright setup adjustment.
- `0b93f5f`: CI test-status reporting added.
- `05375bf`: browser CI runner fixed to Ubuntu 24.04 after Chromium installation failure on Ubuntu 26.04.
- `aa3cc02`: improved browser smoke test; original conversation later reported both build and Chromium smoke successful, with three pages and HTTP/JS error checks.
- `e9b9ccf`: PostgreSQL booking integration assertions for persisted booking, customer name, `PENDING` and unauthorized access; original conversation reported successful build/integration CI.
- `f6992b4`: Playwright unauthenticated admin-route smoke tests added (admin home/list/detail redirect/login protection, login fields, JS error checks). **CI result was NOT yet verified in the provided transcript.**
- The latest reported unfinished task: check CI for `f6992b4`, then build a full end-to-end browser scenario: create fake booking in isolated PostgreSQL, sign in as test admin, verify booking in admin list/detail, clean only test data.

## Workflow configuration directly inspected on 2026-11-17
`.github/workflows/booking-browser.yml` on `feature/booking-integration` exists and sets:
- trigger: push to feature branch when `frontend/**` or the workflow changes, plus manual dispatch;
- Ubuntu 24.04; Node 22; Playwright 1.58.2; Chromium installation;
- `npm ci`, frontend build, Vite preview on localhost:4173, `e2e/booking-smoke.spec.mjs`;
- diagnostic artifacts retained 14 days; publish `booking-browser-smoke` commit status with `statuses: write`.
Note: changes solely in backend may not trigger this browser workflow due to the paths filter. Inspect all CI definitions and triggers before relying on coverage.

## Next actions (priority)
1. Read current branch HEAD, complete repository tree, all `.md` files and TODOs; reconcile this handover with actual code and document decisions. Avoid assuming `README.md` exists on the feature branch (direct lookup returned 404).
2. Check latest GitHub Actions runs/statuses and Playwright diagnostics for `f6992b4`; fix failures before marking done.
3. Implement isolated test-data fixture, PostgreSQL setup, test admin auth, full browser booking-to-admin E2E verification and cleanup. Avoid production data.
4. Audit business flows, reservation status transitions including cancellation, validation, centralized errors, access control and mail sending.
5. Produce prioritized MVP checklist, staging/production deployment design, backups, secrets handling, domain/hosting/database/email provider costs, monitoring and rollback.
6. Run all relevant frontend/backend/integration/browser tests; record exact commands, runs, outcomes and remaining gaps.
7. Keep this document updated after substantive changes with dates, branch, commits, verified CI results and outstanding tasks.

## Documentation inventory — still incomplete
A full repository file tree and every Markdown document have NOT yet been inspected. This document must not be called exhaustive until that audit is done. The original conversation is a primary decision source but not guaranteed retrievable verbatim by a new chat. Where evidence is missing, ask or flag uncertainty rather than inventing standards, filenames, features or completed tests.
