# Branch inventory and cleanup candidates — 2026-11-21

> **Inventory only. This document does not authorize branch deletion.**
> Refreshed against GitHub on 2026-11-21. There are 65 repository branches. Comparisons below use `feature/booking-integration` (HEAD `8b4b5dc7bfffb6ab10319aecf6bdddd434b91054`) as the current integration baseline. Branch tips and deployment references can change; recheck immediately before any cleanup.

## Summary

- **10 strong archival candidates:** each has 0 commits ahead of the current integration baseline. Their reachable work is already in that baseline.
- **1 protected backup:** `backup/main-before-booking-integration-2026-11-17` also has 0 commits ahead, but is a recovery snapshot and is excluded from cleanup candidates.
- **54 other branches:** each has one or more commits not reachable from the integration baseline, or is an active/protected branch. They need separate review; being old or far behind does not make them redundant.
- **No branches were deleted, merged, or changed as part of this inventory.**

## Strong archival candidates — no unique commits vs integration

These branch refs have 0 ahead commits. Prior PR records show the related work was merged or the review-removal PRs were merged. They appear redundant as Git history pointers, subject to confirming no external workflow or collaborator still uses them.

| Branch | Ahead / behind | PR / context |
| --- | ---: | --- |
| `feat/fleet-reference-content-20261118` | 0 / 134 | Previously merged feature work (PR #5) |
| `feature/booking-email-and-admin-dates` | 0 / 195 | Previously merged feature work (PR #9) |
| `fix/admin-review-pagination-20261118` | 0 / 141 | Previously merged fix (PR #11) |
| `fix/all-vehicle-filters-20261118` | 0 / 126 | Previously merged fix (PR #12) |
| `fix/booking-fleet-options-20261118` | 0 / 129 | Previously merged fix (PR #13) |
| `fix/fleet-cards-and-buttons-20261118` | 0 / 132 | Previously merged fix (PR #14) |
| `fix/home-photo-credit-placement-20261118` | 0 / 124 | Previously merged fix (PR #15) |
| `release/booking-integration-safe-merge` | 0 / 262 | Old release/integration branch; PR #2 is no longer open |
| `codex/remove-test-reviews-20261121` | 0 / 1 | Review-removal change is reachable from integration; PR #53 merged |
| `codex/review-demo-disable-test-20261120` | 0 / 5 | Review-demo change is reachable from integration; PR #51 merged |

“Archival candidate” means the branch has no unique commit relative to integration. Before deleting a specific ref, confirm no deployment, automation, release process, or collaborator still depends on its name. Do not bulk-delete by prefix.

## Keep — active, open PR, or recovery references

| Branch | Reason |
| --- | --- |
| `feature/booking-integration` | Current integration baseline; also configured as the source branch for production and test services |
| `main` | Default branch; diverges from integration and has 22 commits ahead / 6 behind |
| `codex/form-validation-review-presentation` | Open PR #42; form-validation and presentation work |
| `docs/uk-competitor-deep-research-20261120` | Open draft PR #28; documentation and research |
| `fix/session-booking-privacy-20261119` | Open draft PR #22; booking privacy changes awaiting verification |
| `fix/privacy-transfer-storage-consistency-20261119` | Open draft PR #26; privacy follow-up to PR #22 |
| `integration/safe-main-work-20261119` | Open draft PR #16; isolated integration of main-only changes |
| `backup/main-before-booking-integration-2026-11-17` | Recovery snapshot; preserve under the current backup policy |
| `release/candidate-verified-staging-20261119` | Release-candidate reference; verify deployment/recovery use before considering archival |
| `safety/*` | Recovery snapshots; retain until backup policy and branch-specific use are reviewed |

The four open PRs (#16, #22, #26, #28, #42) have live head branches and must not be treated as cleanup candidates. PR #16 uses `main` as its head and targets `integration/safe-main-work-20261119`.

## Needs a unique-work and purpose review

### SEO branches

| Branch | Ahead / behind | Current diff summary |
| --- | ---: | --- |
| `feature/seo-audit-checks-20261119` | 1 / 71 | `HomeReviewStrip.tsx` |
| `feature/seo-localized-route-pilot-20261119` | 1 / 63 | `HomeReviewStrip.tsx` |
| `feature/seo-route-content-20261119` | 1 / 67 | `HomeReviewStrip.tsx` |
| `feature/seo-route-expansion-20261119` | 1 / 66 | `HomeReviewStrip.tsx` |

These were previously documented as zero-ahead, but current comparisons show one unique commit each. They are **not confirmed redundant**. Inspect the actual patch and whether the same change is already represented elsewhere before classifying them.

### Review, presentation, and homepage branches

The following branches still have unique commits relative to integration and should not be deleted solely because demo-review files are absent from the checked heads:

`codex/classroom-review-voice`, `codex/classroom-reviews-demo`, `codex/default-staging-review-examples`, `codex/expand-review-cards-and-fixtures`, `codex/home-fleet-photos`, `codex/input-review-current-20261120`, `codex/localized-classroom-reviews`, `codex/restore-test-reviews-20261121`, `codex/review-card-timestamps`, `codex/review-db-transfer-20261120`, `codex/review-demo-disable-20261120`, `codex/review-form-jump`, `codex/run-review-smoke-in-ci`, `codex/seasonal-review-dates`, `codex/sync-homepage-review-feed`, `feature/home-review-card-parity-20261120`, `feature/presentation-sample-reviews-20261120`, `feature/vehicle-photo-cards-20261120`, `fix/home-vehicle-hover-20261120`, `fix/review-card-tests-20261120`.

The review fixture/preview files were absent in the sampled branch heads checked on 2026-11-21. That spot-check does not establish that every branch’s unique commits are safe to discard.

### Other unique branches

Preserve pending patch, PR, and purpose review:

- Booking privacy and terms: `fix/booking-session-privacy-20261119`, `fix/booking-terms-and-notifications-20261120`, `fix/uk-upgrades-booking-session-privacy-20261120`, `test/booking-session-privacy-e2e-20261119`, `refactor/shared-booking-storage`.
- Main integration: `codex/main-sync-candidate-20261120`.
- Email/performance: `perf/email-dispatch-20261118`.
- Test/diagnostic work: `diagnostics/production-readonly-capacity-20261118`, `test/admin-menu-verification-20261118`, `test/automated-build-20261115`, `test/isolated-booking-capacity-20261118`, `test/production-capacity-20261118`.
- SEO route work: `research/international-seo-four-markets-20261119`, `seo/complete-seven-route-locales`, `seo/fethiye-oludeniz-routing`, `seo/route-vehicle-capacity`.
- Documentation: `docs/branch-inventory-20261119`, `docs/project-documentation-hub-20261121`.

## Verification limits and next cleanup steps

- Render production and test frontend/API services were last checked with `feature/booking-integration` as their source branch. The inventory branch itself is not a deployment source.
- The `docs/branch-inventory-20261119` ref also has an unrelated unique `HomeReviewStrip.tsx` change compared with integration. This document is updated on that existing ref; do not open or merge the branch without reviewing that unrelated change.
- This pass compares all 65 branch refs with the integration baseline and checks current open PR heads. It does not establish whether a GitHub Action, external deployment, local clone, or collaborator depends on a candidate branch name.
- Before deletion: refresh branch HEADs, inspect each unique patch, confirm no PR/deployment/workflow dependency, retain any required recovery pointer, then approve a specific deletion list.
- Do not delete branches as a group or infer deletability from age/behind-count alone.

**Status:** updated inventory only; no branch deletion, merge, or deployment performed.
