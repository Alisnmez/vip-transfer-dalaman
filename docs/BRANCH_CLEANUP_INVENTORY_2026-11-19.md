# Branch inventory and cleanup candidates — 2026-11-19

> **Documentation only. No branch is authorized for deletion by this file.**
> This inventory reflects GitHub branch/PR comparisons performed on 2026-11-19. Recheck HEADs, open PRs, deployment references, and unmerged commits immediately before any cleanup. A branch being behind another branch does **not** by itself mean it is safe to delete.

## Active / protected — do not delete

| Branch | Reason |
| --- | --- |
| `feature/booking-integration` | Current integration baseline, PR #1 open |
| `main` | Default/release history, diverged from integration |
| `fix/session-booking-privacy-20261119` | Open PR #22, session privacy work not merged |
| `fix/privacy-transfer-storage-consistency-20261119` | Draft PR #26, one-line follow-up to PR #22 |
| `integration/safe-main-work-20261119` | PR #16 integration work |
| `release/booking-integration-safe-merge` | Open PR #2 |
| `release/candidate-verified-staging-20261119` | Release candidate reference; verify deployment use |
| `safety/*`, `backup/*` | Recovery snapshots; retain pending explicit backup policy |

## Potentially redundant SEO branches — review for cleanup

Compared with `feature/booking-integration`, the following were **behind with zero unique commits** at the time of inspection:

| Branch | Comparison | Notes |
| --- | --- | --- |
| `feature/seo-audit-checks-20261119` | 0 ahead / 17 behind | Closed PR #18 |
| `feature/seo-route-content-20261119` | 0 ahead / 13 behind | Closed PR #19 |
| `feature/seo-route-expansion-20261119` | 0 ahead / 12 behind | Closed PR #20 |
| `feature/seo-localized-route-pilot-20261119` | 0 ahead / 9 behind | Closed PR #21 |

These are **candidates**, not deletion approvals. Confirm no active workflows, environments, or collaborators depend on their refs.

## Similar privacy implementations — do not merge blindly

| Branch | Findings | Recommendation |
| --- | --- | --- |
| `fix/booking-session-privacy-20261119` | Diverged: 1 ahead / 9 behind integration; adds `sessionDraft.ts`, not wired into booking screens | Preserve until PR #22/#26 verification; then evaluate for archival |
| `refactor/shared-booking-storage` | Diverged: 7 ahead / 1109 behind integration; helper still uses `localStorage` | Do not cherry-pick without detailed history review; preserve unique work |
| `fix/session-booking-privacy-20261119` | PR #22: 7 ahead / 9 behind integration | Active; **not redundant** |
| `fix/privacy-transfer-storage-consistency-20261119` | 1 commit ahead of PR #22 branch; PR #26 draft | Active; **not redundant** |

## Other branches requiring separate classification

`feat/fleet-reference-content-20261118`, `feature/booking-email-and-admin-dates`, `fix/admin-review-pagination-20261118`, `fix/all-vehicle-filters-20261118`, `fix/booking-fleet-options-20261118`, `fix/fleet-cards-and-buttons-20261118`, `fix/home-photo-credit-placement-20261118`, `perf/email-dispatch-20261118`, `test/admin-menu-verification-20261118`, `test/automated-build-20261115`, `test/isolated-booking-capacity-20261118`, `test/production-capacity-20261118`, `diagnostics/production-readonly-capacity-20261118`, `research/international-seo-four-markets-20261119`, `seo/complete-seven-route-locales`, `seo/fethiye-oludeniz-routing`, `seo/route-vehicle-capacity`.

Some associated PRs are merged; **no complete unique-commit/deployment dependency audit was performed for this group**, so do not delete based on this document.

## Cleanup checklist

1. Refresh branch HEADs and compare each candidate against current integration and main.
2. Confirm merged/closed PR status and preserve links to PRs/commits.
3. Check GitHub Actions, Render deployment references, active worktrees, and collaborator usage.
4. Preserve all unique commits in a named branch/tag or PR before considering deletion.
5. Request explicit approval for a specific deletion list. Never bulk-delete by prefix.
6. Recheck that privacy PR #22 and follow-up PR #26 are tested before changing their lifecycle.

**Status:** inventory only; no deletion, merge, or deployment performed.
