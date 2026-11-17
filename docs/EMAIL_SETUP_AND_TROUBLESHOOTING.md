# Transactional email setup and troubleshooting — VIP Transfer Dalaman

**Status: GUIDE ONLY — NOT CONFIGURED.** Customer/operator emails are not currently sent automatically. This is a beginner-friendly deployment runbook, not evidence of working email delivery.

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
