# Customer trust, driver contact and cancellation policy research — 2026-11-21

## Branch isolation
- This work is isolated on `feature/customer-journey-trust-20261121`, created from `feature/booking-integration` commit `0bcc17a5268b93c445dda21cd7dfca8f5a547e00`. Do **not** merge into or overwrite `feature/seo-next-steps-20261121` or other active branches. Before PR merge, recompare latest heads and reconcile HomePage conflicts.
- Changes: `frontend/src/pages/public/TransferJourneyGuide.tsx` (EN/DE/RU six-step customer journey), `frontend/src/pages/public/HomePage.tsx` (one import and section insertion). No backend, emails, automated WhatsApp messages or actual driver assignment implementation.
- **The WhatsApp day-before message is an intended operating procedure, not verified automation.** The UI says the team *plans* to contact confirmed bookings; operational owner must confirm it can be fulfilled before production. On transfer day the driver or team will provide instructions. Do not promise guaranteed WhatsApp delivery or an assigned driver name before assignment.
- No deployment or CI verification as of creation of this note.

## Competitor policy findings (checked 2026-11-21)
| Competitor | Public policy | Source |
|---|---|---|
| Dalaman Go Transfer | Free cancellation at least 24 hours before pickup; late cancellation/no-show non-refundable; FAQ describes name-sign pickup, pre-trip WhatsApp/SMS driver details, flight monitoring | https://dalamangotransfer.com/en/legal/cancellation-policy ; https://dalamangotransfer.com/en/faq |
| TransferVIP | Free cancellation up to 24 hours; confirmation email within 12 hours; terminal exit name-sign pickup | https://www.viptransfersdalaman.com/sikca-sorulan-sorular?lang=en |
| Suntransfers (Dalaman landing) | Free cancellation up to 48 hours; meet-and-greet | https://www.suntransfers.com/dalaman-airport |
| Dalamantransfer.com FAQ | Free cancellation or changes up to 24 hours; 50% charge within 24h; no-show full charge; airline flight cancellations treated separately | https://www.dalamantransfer.com/frequently-asked-questions/ |
| DalamanAirportTransfer.com service contract | Full refund >24h; 75% refund 12–24h; 50% refund 1–12h; no refund <1h/no-show | https://www.dalamanairporttransfer.com/en/service-contract |
| Welcome Pickups | Their Dalaman landing advertises 80% refund when cancelling ≥24h; detailed terms say 20% fee; changes subject to cutoff and price changes; driver may contact via WhatsApp | https://www.welcomepickups.com/dalaman/airport-transfer-book/ ; https://www.welcomepickups.com/terms-of-use/ |

**Caution:** Competitor policies differ. Their practices are not automatically DalamanWay policy. Legal review and actual operating capacity are required before binding cancellation/refund/waiting-time promises.

## Proposed DalamanWay policy — NOT APPROVED, DO NOT PUBLISH AS BINDING TERMS
1. Customer can request a change or cancellation via authenticated Manage Booking; request alone does not change booking. Staff sends written decision. Determine the actual support email and hours.
2. Proposed simple rule: **free cancellation until 24h before scheduled pickup**, full refund of *amount paid*; if unpaid, no cancellation charge. Within 24h: review individually, potentially no refund, but publish a clear, lawful rule only after owner approves. Avoid unfair terms and check applicable consumer rules.
3. Proposed change window: free administrative changes up to 24h if vehicle/route/driver capacity allows; price difference quoted and accepted before confirmation. Within 24h best effort, no guarantee.
4. Define exact airport flight delay procedure, grace waiting time (e.g., 60 minutes only if operations agree), no-show contact attempts, customer cannot find driver, driver no-show, refunds, child seats and flight cancellation. **Do not invent free unlimited waiting or flight monitoring if not implemented.**
5. Driver/customer WhatsApp: consent/notice and alternative contact channel; phone number access restricted to assigned driver/operations; do not expose personal data in public pages. Clarify customer communications in privacy notice and follow applicable data protection law.

## Before production
- Check that the booking confirmation email actually communicates a reference, pickup information and confirmed status; do not imply request = confirmed.
- Set operational ownership of **day-before WhatsApp** and **transfer-day driver/team contact**, with fallback if driver is assigned late or WhatsApp fails. Ideally a staff task/reminder for every confirmed booking.
- Review translations and mobile layout; run lint, unit tests, production build, browser smoke; staging deploy and verify no regressions; then production with rollback.
- Add a separate, owner-approved cancellation/changes policy page and link it from booking/confirmation/manage-booking only after approval.
