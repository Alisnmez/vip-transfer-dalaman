# SEO implementation standard (v1)

## Single source of truth
- All public route titles, descriptions and indexability live in `frontend/src/shared/seo/config.ts`.
- `usePageSeo.ts` is the only code that writes document metadata.
- Never hardcode the eventual business name or domain in individual pages.
- New public pages must have an explicit entry in `seoPages`; unknown paths default to `noindex`.
- Booking, passenger, confirmation, lookup and all admin pages must not appear in XML sitemaps.
- Do not invent prices, reviews, business addresses, journey times or structured-data claims.

## Configuration
- `VITE_SITE_NAME`: approved public brand (optional until chosen).
- `VITE_PUBLIC_SITE_URL`: final canonical origin, e.g. `https://your-final-domain.example` (leave unset for preview).
- Do not set `VITE_PUBLIC_SITE_URL` to the Render preview domain.
- The preview build is deliberately `noindex,nofollow`.

## Launch checklist (historical; reconcile with current audit below)
1. Select domain and verify ownership; configure host redirects to one HTTPS origin.
2. Implement static prerendering/SSG for all indexable public routes. Client-only metadata is not enough as a launch standard.
3. Render each page's title, description, canonical, robots and structured data in the **initial HTML** (not only after React mounts). Replace preview `noindex` at build time for approved production pages.
4. Generate sitemap.xml from the same public route registry and the final `VITE_PUBLIC_SITE_URL`; add robots.txt pointing to it. Exclude private pages.
5. Add route-specific pages with verified content and proper internal links.
6. Add localized URLs and reciprocal hreflang only after real translations exist.
7. Test built HTML with JavaScript disabled; run Lighthouse, Search Console URL Inspection and verify canonical/indexing.
8. Validate live booking and API before launch.

## Editorial requirements
- One clear H1 per indexable page.
- Unique, accurate titles and descriptions, with natural UK English.
- GBP prices must come from the booking pricing source, never copied into SEO metadata as hardcoded claims.
- Helpful original route content, no keyword stuffing or near-duplicate city templates.
- Use descriptive internal anchor text and meaningful image alt attributes.
- Avoid unsupported promises such as guaranteed ranking or travel duration.

## Domain migration
Keep public URL paths stable. When changing domains, update the canonical origin, sitemap, internal URLs and server-side 301 redirects. Follow Google's Search Console site-move procedure.

## Current implementation audit — 2026-11-18

**Scope:** Source review of the Render deployment branch `feature/booking-integration`; not a verified live crawl, Search Console inspection or Lighthouse run. The site is already publicly deployed at `https://dalamanway-prod.onrender.com`. Do not describe it as awaiting first publication.

### Implemented in repository
- [x] Central SEO metadata registry (`src/shared/seo/config.ts`) and client-side metadata updates (`usePageSeo.ts`).
- [x] Build-time robots.txt and sitemap.xml generator (`scripts/generate-seo.mjs`), including private route exclusions.
- [x] Build-time static HTML fallback generation for five destination pages and seven landing pages (`scripts/prerender-routes.mjs`).
- [x] Automated SEO generator tests (`tests/seo.test.mjs`) covering preview blocking and production sitemap content. **Test existence is confirmed; latest execution result is not confirmed.**
- [x] Preview-domain indexing safeguards in the generator.

### Open gaps / discrepancies (prioritized)
- [ ] **P0 — Confirm desired indexing policy and canonical domain.** The current generator deliberately emits `Disallow: /` and an empty sitemap when `VITE_PUBLIC_SITE_URL` is missing or uses `onrender.com`. Render is currently the public site; determine whether this hostname should be indexed or whether a custom domain will be used. Do not enable indexing on a temporary hostname by accident.
- [ ] **P0 — Verify actual deployed output.** Fetch production `/robots.txt`, `/sitemap.xml`, root HTML and representative `/routes/marmaris` HTML, including response codes, robots tags and canonical tags. Source-code inspection alone does not establish deployed behavior.
- [ ] **P0 — Align canonical configuration.** Generator/prerender scripts use `VITE_PUBLIC_SITE_URL`, whereas React SEO config uses `VITE_PUBLIC_SITE_URL`. Unify on one canonical origin, document the required Render build environment variable, and add a consistency test.
- [ ] **P1 — Expand central page registry.** `seoPages` explicitly covers only `/`, `/routes`, `/vehicles`, `/services`, `/contact` and private `/booking`. The `/faq`, `/reviews` and `/routes/:slug` pages are generated as indexable static HTML but fall back to `noindex` when React mounts. Add explicit entries or a validated route matcher, and keep HTML and client metadata consistent.
- [ ] **P1 — Test all generated initial HTML.** Validate one H1, unique titles/descriptions, canonical and robots in initial HTML for each indexable route; verify actual host rewrite/serving behavior for nested paths.
- [ ] **P1 — Verify Search Console ownership and indexing.** Record verified property, submitted sitemap, indexed/excluded pages, impressions, clicks, queries and crawl errors. None of these metrics have been independently verified in this audit.
- [ ] **P1 — Performance audit.** Run mobile Lighthouse and Core Web Vitals on actual production URLs; inspect JavaScript payload, render blocking assets and images. No score is claimed yet.
- [ ] **P2 — Editorial review.** Expand original route-specific information, useful internal links and accurate FAQs. Avoid invented travel times, prices, testimonials or unsupported claims.
- [ ] **P2 — Structured data and localization.** Add only factually supported schema; add localized URLs and hreflang only after verified translations.
- [ ] **P2 — Domain migration controls.** If switching away from Render hostname, establish one canonical HTTPS host and redirects, then update sitemap and Search Console.

### Current status and next action
**Status: LIVE website, SEO code partially implemented, production indexability unverified.** The static build includes metadata and prerender logic, but its real deployment behavior and Google visibility require direct checks. The active engineering priority remains pricing/database integration, followed by mobile, analytics and accounting. SEO checks can be performed in parallel without altering the working booking flow. Do not mark the SEO audit complete until deployed HTTP responses and Google Search Console are verified.


## Competitive SEO strategy — 2026-11-19

### Research and positioning
- Competitors reviewed: Suntransfers, Mavi Transfer, DriveOnPort, Dalamantransport, intransfers. Their useful patterns include route-specific landing pages, transparent per-vehicle pricing, service details, vehicle options, and genuine customer trust signals. Competitor marketing claims are not evidence for our own business.
- Primary commercial intent: `dalaman airport transfer`, `dalaman airport private transfer`, `dalaman airport taxi` (only if our service matches the query).
- Route intent: `dalaman airport to marmaris transfer`, `dalaman airport to fethiye transfer`, `dalaman airport to oludeniz transfer`, `dalaman airport to gocek transfer`, `dalaman airport to icmeler transfer`.
- Supporting intent: `dalaman airport transfer prices`, `dalaman airport transfer vehicles`, `dalaman airport transfer with child seat` (only with accurate availability wording).
- Prioritize booking-intent route pages before broad travel blogs. Build original destination-specific help: actual drop-off zones, pickup instructions, luggage constraints, booking process and links to vehicle selection; avoid near-duplicate text or unverified durations.
- Show prices dynamically from the existing pricing source; never hardcode competitor prices or claim guarantees, rankings, ratings, licensed operations or amenities without verification.
- Internal linking: homepage → routes → each destination → booking with preselected destination; link relevant FAQs and vehicles pages using descriptive anchor text.
- Do not publish fake reviews, FAQ rich-result promises, mass-generated doorway pages, or unsupported LocalBusiness data. Google Business Profile only if eligibility and real-world business facts are verified.

### Technical work completed in source on 2026-11-19
- Canonical configuration in React now reads `VITE_PUBLIC_SITE_URL`, matching sitemap and prerender scripts; `VITE_PUBLIC_SITE_URL` should no longer be configured separately.
- Added React SEO registry entries for FAQ, Reviews and the five currently supported destination detail pages, so hydration does not switch those pages to default noindex.
- Render preview and localhost origins are rejected as canonical origins in the client SEO helper.
- These changes are **source commits only** until CI and deployed HTML are independently verified. Do not claim ranking, indexing or Search Console metrics.

### Next execution priorities
1. Confirm final custom domain and correct Render environment configuration. Keep preview hosts noindex. Do not submit preview to Search Console.
2. Audit production HTTP robots, sitemap, initial HTML, nested route status and canonical/robots with JavaScript disabled; reconcile any Render rewrite behavior.
3. Ensure generated prerender metadata and client registry use matching titles/descriptions and canonical tags; add automated parity tests.
4. Expand each route page with verified original information and practical FAQs; include real pricing and booking CTA. Preserve natural English and accessibility.
5. Connect Google Search Console and submit sitemap once canonical domain is live. Baseline impressions, clicks, CTR, positions and indexed URLs; review monthly.
6. Run mobile Lighthouse and real-user Core Web Vitals; fix LCP images, CLS and excess JavaScript based on measured evidence.
7. Pursue legitimate local tourism/hotel partnerships and citations; do not buy spam backlinks. Measure bookings and qualified leads, not traffic alone.

### Sources
- Google Search Central SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google Search Essentials: https://developers.google.com/search/docs/essentials
- Google helpful, reliable content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Competitive examples: https://www.suntransfers.com/dalaman-airport ; https://mavitransfer.com/en ; https://driveonport.com/dalaman-airport-dlm/ ; https://www.dalamantransport.com/destination/airports/dalaman-airport-transfers/

## Additional SERP research and implementation — 2026-11-19

### Evidence versus assumptions
- Search results for Dalaman-to-Marmaris show competitors targeting destination-specific transfer intent with route-level prices, transfer types and traveller information (e.g. Dalaman Go Transfer, GET4S, Airport Transfers Turkey). This is qualitative SERP evidence, **not** verified keyword volume, domain authority or ranking positions.
- Google's SEO Starter Guide and developer guide recommend descriptive titles, accessible text, descriptive internal links, unique helpful content, canonical URLs, and crawlable HTML. Avoid making up Google ranking guarantees.
- Our initial destination pages currently have short descriptions; add practical, accurate destination-specific content once business pickup policy and route information are verified. Do not imitate competitors' unverified claims about flight tracking, waiting time or guaranteed prices.

### Implemented
- Destination pages now link contextually to vehicle capacity, booking FAQs and the route-price comparison, in addition to the existing destination-prefilled booking CTA. This improves user navigation and provides crawlable descriptive anchors.

### Priority backlog, measurable acceptance criteria
1. **Indexability:** once the final domain is approved, verify 200 status, correct canonical, index/follow and unique HTML title/description on every sitemap URL. Preview must remain noindex.
2. **HTML parity:** generate route and landing page head tags from a single shared metadata source; add a test that checks all 12 pages and confirms no duplicate canonicals or H1 headings after hydration.
3. **Route value:** for each of the five destination pages, add verified hotel/area drop-off guidance, realistic luggage guidance and clear price-per-vehicle display sourced from pricing data; ensure the booking CTA preselects the destination.
4. **Trust:** publish only real operator contact details, cancellation policies, permitted guest images and verified testimonials. No fabricated star-rating schema.
5. **Performance:** capture mobile Lighthouse and Core Web Vitals on real URLs, then optimize measured LCP/INP/CLS bottlenecks.
6. **Measurement:** establish Search Console baseline by page and query; track organic impressions, clicks, CTR and qualified booking enquiries. Review changes over 4–8 weeks; avoid claiming guaranteed positions.
7. **Authority:** seek editorial links from relevant accommodations and local tourism partners; no purchased or automated link schemes.

### Additional sources
- Google Search Central: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google developer SEO: https://developers.google.com/search/docs/fundamentals/get-started-developers
- Route SERP examples: https://dalamangotransfer.com/en/dalaman-airport-to-marmaris-transfer ; https://www.get4s.com/en/blog/dalaman-to-marmaris-transfer ; https://www.airportstransferturkey.com/guides/dalaman-airport-to-marmaris-icmeler

**Verification:** Direct retrieval of the production robots.txt and sitemap.xml was attempted but unavailable through the public web retrieval tool; production indexability remains unverified. Do not mark this checklist completed based on repository inspection alone.
