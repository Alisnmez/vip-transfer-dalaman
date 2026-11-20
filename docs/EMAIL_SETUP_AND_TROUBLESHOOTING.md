# Transactional email setup and troubleshooting — VIP Transfer Dalaman

**Status: IMPLEMENTED ON FEATURE BRANCH — PRODUCTION NOT ENABLED.** Customer/operator email code and tests are prepared. Provider DNS verification, secret configuration, deployment and an actual recipient inbox test remain required.

## Goal and scope

Send transactional messages for (1) booking request received, (2) admin confirmation, and (3) cancellation, with optional operator notification. Never claim a booking is confirmed before the admin confirms it. Do not send promotional emails without separate consent.

Recommended first evaluation: Resend transactional email API. **Provider, current free quota, domain and prices must be rechecked on the official site before activation.** Alternative providers can be evaluated if delivery, cost or account eligibility differs.

## Step-by-step setup (first-time operator)

1. Own and control the production domain; decide on a sender such as `booking@<our-domain>` and a monitored reply-to inbox. A verified sender address does **not** automatically create an inbox.
2. Create the email provider account using the business owner account; enable MFA and configure billing/usage alerts. Keep ownership and recovery details with the operator.
3. Add the domain in the provider dashboard. Copy the **exact DNS records displayed by that provider** (typically SPF and DKIM; DMARC should also be planned) into the domain registrar's DNS panel. Never guess record values.
4. Wait for DNS propagation and confirm domain verification in the provider dashboard. Check that SPF/DKIM align with the From domain; configure DMARC progressively, observing reports before enforcing a strict policy.
5. Generate a restricted sending API key. Store it in the **Render backend environment** (e.g. `EMAIL_API_KEY`), never in frontend code, Git, logs or this chat. Use separate staging and production credentials if supported.
6. Configure sender, reply-to and environment flag on the backend. Keep sending **disabled by default** until verification and tests pass.
7. Implement a small email gateway/service with templates. The booking database transaction must commit independently of email delivery. Do not make a customer retry the booking merely because sending failed.
8. Prevent duplicate emails for repeated POST/idempotent status changes: persist an email event keyed by booking ID + event type (and relevant transition/version). Implement bounded retries for transient failures; keep an auditable delivery status without storing unnecessary personal data.
9. Send test messages to authorized test addresses in staging using synthetic booking data. Check inbox, spam folder, mobile formatting, links, correct status wording, and that customer details are not exposed to other recipients.
10. Test provider 401/403, 429 quota/rate limit, 5xx, timeout, invalid address, retry and duplicate webhook/event handling. Add backend automated tests with a fake email gateway; CI must not send real messages.
11. After approval, enable production credentials and perform a limited, monitored production smoke test. Track provider message IDs and delivery/bounce events safely, then monitor quota and failure rates.

## Failure diagnosis

| Symptom | Likely cause | Safe investigation and fix |
| --- | --- | --- |
| Domain verification pending | Wrong DNS host/value or propagation delay | Compare DNS record name/type/value with provider dashboard; verify authoritative DNS; allow propagation |
| SPF/DKIM/DMARC failure | Misconfigured or unaligned authentication | Review provider's DNS instructions, From domain alignment, and DNS records; do not invent SPF values or add conflicting SPF TXT records |
| 401/403 from API | Invalid/revoked key or domain not authorized | Check Render env key presence, scope, provider account and domain status; rotate compromised keys |
| 429 rate limit | Daily/monthly quota or burst exceeded | Respect Retry-After, queue and retry with backoff; never endlessly loop or send duplicates |
| 5xx / timeout | Provider outage or network issue | Mark event pending/unknown, retry safely using event deduplication, inspect provider dashboard |
| Email accepted but not received | Spam filtering, bounce, suppression or wrong address | Check provider delivery/bounce logs and recipient spam; verify DNS; do not assume API 200 means delivered |
| Two emails for one booking | Event triggered twice or retry not idempotent | Check unique event key and state transition; add regression test and durable outbox |
| Booking fails when email fails | Email coupled to booking transaction | Separate booking commit from asynchronous delivery; surface booking success correctly |
| Reply-to does not work | Sender domain verified but no mailbox | Set up a real monitored mailbox or forwarding and test replies |
| Personal data in logs | Overly verbose payload logging | Redact email/body/phone; restrict access and retention |

## Privacy, security and release criteria

- Transactional content only: booking reference, essential journey details and accurate status; minimize personal information.
- Check GDPR/privacy notice, processor terms and retention settings before production.
- API secrets are backend-only; restrict access and rotate after exposure.
- Do not include customer data in CI fixtures or public GitHub issues.
- The first live version may launch with **manual customer support** if the operator explicitly accepts that workflow. Never display “confirmation email sent” unless delivery has been attempted and accurately recorded.
- Release gate: verified domain, working reply-to, green fake-provider integration tests, staging inbox tests, duplicate prevention, retries and monitoring, explicit operator approval.

## Project-specific integration points to inspect before coding

- Spring Boot booking create and admin status transitions; email events must be emitted **after successful DB commit**.
- Booking idempotency key and status transitions; avoid duplicate notifications on repeat requests.
- Render backend environment variables; no email provider secret in Vite frontend.
- Existing docs: `docs/EKSIKLERIMIZ.md`, `docs/DEPLOYMENT_WORKFLOW.md`, `docs/POSTGRES_MIGRATION_PLAN.md`.

**Open tasks:** choose/verify provider and domain; implement backend gateway and templates; add persistent outbox/retry mechanism; run staging tests; configure real production credentials; verify operator and customer delivery.

## Prepared implementation — 18 November 2026

Implementation is on `feature/booking-email-and-admin-dates`; production sending is not yet enabled.

- Resend free account created by the owner. Sending domain: `notify.dalamanway.com`, Ireland (`eu-west-1`).
- Exact Resend DKIM TXT and two Forge CNAME records added in Porkbun; verification must show verified before activation. Root web, MX and SPF records preserved.
- Environment reference: `.env.email.example`. The owner enters `EMAIL_API_KEY` directly in Render; never share it in chat or Git.
- V2 adds `booking_email_outbox` and an index; it does not rewrite existing bookings. Booking creation and notification queueing share a database transaction. A scheduled worker sends only committed entries.
- Received, confirmed, cancelled and reopened-pending notifications use accurate status wording. Customer and operator are separate recipients. Repeated booking/status requests do not queue another notification. Status writes lock the booking row to prevent concurrent duplicate transitions.
- Provider retries use the same stored JSON payload and idempotency key. Retry 429, network failures, concurrent-request conflicts and 5xx with backoff. Permanent errors fail immediately, transient errors stop after six attempts, and events expire after 23 hours to stay inside Resend's 24-hour deduplication window.
- Provider acceptance is recorded as `ACCEPTED`, not delivered. Delivery, bounces and inbox/spam checks require the Resend dashboard; webhook delivery tracking is not implemented.
- Test recipients ending `.invalid` do not generate customer or operator mail. No historical bookings are backfilled.

### Deployment and recovery

1. Keep `EMAIL_ENABLED=false`. Review V2 and run CI plus Flyway/Hibernate validation against a disposable database.
2. Verify DNS; use a domain-scoped sending key. Keep separate staging credentials and recipients; do not enable Flyway on the existing staging database without its separate migration review.
3. Apply the additive V2 migration in a reviewed release. Set sender, monitored reply-to and optional operator address. Enable `EMAIL_ENABLED=true` only after provider verification and an authorized inbox test.
4. After backend activation succeeds, set frontend `VITE_EMAIL_NOTIFICATIONS_ENABLED=true` and rebuild. Do not claim an email was delivered merely because the booking succeeded.
5. Inspect counts with `SELECT status, count(*) FROM booking_email_outbox GROUP BY status;` using authorized database access. Logs contain event IDs and safe error codes, not recipient addresses or message bodies. Review `FAILED` rows rather than replaying them blindly.
6. Emergency stop: set `EMAIL_ENABLED=false` and redeploy. Keep V2's table in place; do not roll back by dropping data. Old application code can run with the added table present.
7. Free plan limits checked on https://resend.com/pricing on 18 November 2026: 3,000/month, 100/day. Each customer and operator notification consumes one email. No paid plan or automatic paid overage was enabled.

**Pending:** DNS verified status, owner key saved in Render, CI, reviewed deployment, actual provider acceptance and recipient inbox/reply test. Until these pass, automatic production email delivery is not established.

## Current owner choice — Gmail sender (18 November 2026)

The owner selected `dalamanway.booking@gmail.com` as the actual sender and support mailbox. The earlier Resend domain setup remains optional; it cannot send as `gmail.com`.

- Backend: `EMAIL_PROVIDER=gmail`, `EMAIL_FROM=DalamanWay <dalamanway.booking@gmail.com>`, `EMAIL_REPLY_TO=dalamanway.booking@gmail.com`, `EMAIL_OPERATOR=dalamanway.booking@gmail.com`.
- Frontend: `VITE_SUPPORT_EMAIL=dalamanway.booking@gmail.com`; contact, receipt and booking support links share this setting.
- Gmail uses authenticated `smtp.gmail.com:587`, required STARTTLS, server identity checks, and finite timeouts. The production backend uses paid Render compute; free instances block SMTP ports.
- The owner enables Google 2-Step Verification if needed, generates a dedicated app password, and enters it directly as backend `EMAIL_GMAIL_APP_PASSWORD`. Never use the normal Google password or paste credentials into chat, source files or frontend configuration.
- The From address is enforced as the selected Gmail account. Replies and operator notifications use the same mailbox. Enable after an authorized recipient test.
- SMTP does not provide an idempotency API. The worker commits `SENDING` before network delivery. A process interruption leaves `SENDING` for review; ambiguous SMTP errors become `FAILED` with `SMTP_UNKNOWN` and are not automatically resent. This prevents blind duplicate sends but requires operator review of uncertain events. Resend's known transient failures retain bounded retries.
- Acceptance is not proof of inbox delivery. Verify Gmail Sent, recipient inbox/spam and a reply. Existing queued messages are not rewritten automatically.

Official references checked 18 November 2026:
https://support.google.com/mail/answer/185833
https://developers.google.com/workspace/gmail/imap/imap-smtp
https://render.com/changelog/free-web-services-will-no-longer-allow-outbound-traffic-to-smtp-ports
