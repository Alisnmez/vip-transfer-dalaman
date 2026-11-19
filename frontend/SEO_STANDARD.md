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


## Professional SEO operating playbook — 2026-11-19 (research and execution specification)

**Operating assumptions:** DalamanWay is already live, with a custom domain reportedly acquired. Do not confuse production deployment with Google indexation. Confirm the canonical host via live HTTP and Render DNS/configuration before changing production. No ranking, volume, backlinks, Search Console ownership, or conversion figures have been verified here.

### How an experienced SEO team works

1. **Baseline and diagnosis before optimization:** crawl the public domain and export URL, status, title, H1, canonical, meta robots, sitemap membership, internal-link depth, mobile performance and indexation status. Capture Search Console performance by query, page, country and device; GA4 organic landing pages and booking enquiries. Record a dated baseline.
2. **SERP intent and keyword clustering:** group variants by intent rather than creating a page for every phrase. Separate airport transfer service, destination transfer, pricing/comparison and informational queries. Manually inspect search results in target countries and devices before selecting titles.
3. **Information architecture:** one primary landing page per distinct customer need, with supporting useful pages. Use homepage -> routes -> destination -> vehicles/FAQ -> booking. Prefer discoverable HTML anchors, consistent breadcrumbs and stable URLs. Avoid thin city-page duplication and doorway-page networks.
4. **Technical delivery:** one canonical HTTPS hostname, correct HTTP status, crawlable initial HTML, consistent title/description/robots/canonical before and after hydration, production-only sitemap, staging noindex, private booking noindex, correct 404/301 and verified robots directives. Test Render's actual nested-path response.
5. **Content production:** subject-matter verified local information, genuinely useful route-specific details, clear process, fare source and currency, practical luggage/child-seat conditions, relevant internal links and prominent booking CTA. Maintain editorial evidence, review date and content owner. Do not publish fabricated testimonials, prices, driving times or guarantees.
6. **Authority and reputation:** verified business identity/contact/policies, authentic customer feedback, appropriate business directory profiles where eligible, and editorial referrals from legitimate accommodation and travel partners. Avoid paid link schemes and automated mass outreach.
7. **Experimentation and reporting:** prioritize by expected impact × confidence ÷ effort; ship in small releases, check Search Console indexing and organic enquiries, review 28-day trends and seasonal context, iterate based on observed data rather than rank promises.

### DalamanWay keyword-to-URL map (hypotheses; validate in Search Console / keyword tools)

| Cluster | Example searches | Primary URL | Intent | Next improvement |
| --- | --- | --- | --- | --- |
| Airport transfer | dalaman airport transfer; dalaman airport private transfer | / | Book | Clear service proposition, trusted booking process, routes |
| Routes / fares | dalaman airport transfer prices; dalaman transfer prices | /routes | Compare and book | Actual per-vehicle GBP prices from pricing system |
| Marmaris | dalaman airport to marmaris transfer; marmaris airport transfer | /routes/marmaris | Book | Specific pickup/drop-off guidance and fare comparison |
| Fethiye | dalaman airport to fethiye transfer | /routes/fethiye | Book | Local destination detail and pricing |
| Ölüdeniz | dalaman airport to oludeniz transfer; dalaman to ölüdeniz | /routes/oludeniz | Book | Address/hotel guidance, vehicle choices |
| Göcek | dalaman airport to gocek transfer | /routes/gocek | Book | Marina/hotel drop-off guidance when verified |
| İçmeler | dalaman airport to icmeler transfer | /routes/icmeler | Book | Distinguish from Marmaris transfer page |
| Vehicle capacity | dalaman airport private minibus transfer; dalaman vito transfer | /vehicles | Compare | Verified seat/luggage capacities and accessibility |
| Booking questions | dalaman airport transfer return journey; child seat | /faq | Inform | Accurate operator policies; avoid promises |

**Keyword caution:** No monthly search volume, difficulty, CPC or current ranking is asserted. Do not generate near-duplicate pages for singular/plural, taxi/transfer, or transliteration variations unless search intent and useful content differ materially.

### Competitor pattern review (public page observations, not endorsement)

- **Dalaman Go Transfer:** destination directory displays routes, per-vehicle prices and many destination subdivisions; useful inspiration for *discoverability and transparent comparisons*, not a mandate to copy 100+ pages or reuse its claims.
- **Airport Transfers Turkey:** practical guide compares airport coaches, taxis and private transfers for Fethiye/Marmaris/Ölüdeniz/Göcek; useful inspiration for *decision support* and a potential future independently fact-checked comparison guide.
- **intransfers:** directory lists transfer operators and service attributes; highlights the importance of consistent business facts and third-party discovery, but listed claims must not be assumed true for DalamanWay.
- **Our differentiation:** focused airport-to-resort booking UX, transparent vehicle luggage limits, destination-prefilled booking and clearly explained request/confirmation process. Validate every operational claim.

### Route-page editorial template and acceptance gate

For each of the five destination pages:
- Distinct H1 naming Dalaman Airport and destination; original 100–300+ words **only if they add real value**, not arbitrary word-count padding.
- Short answer above the fold: service type, destination, booking CTA and link to actual pricing.
- Explain the *actual* pickup and drop-off information requested, destination-specific accommodation areas when verified, flight number handling, passenger and luggage constraints, and return-transfer steps.
- Use existing pricing data and vehicle limits as the only source for fare and capacity claims; label conditional availability. Do not invent a flat fare, fixed journey time or airport meet-and-greet.
- Link to /routes, /vehicles, /faq and destination-prefilled /booking; include clear breadcrumb navigation and descriptive alt text for real destination imagery.
- Add an FAQ section only when it answers real user questions and the operator confirms the answers. FAQ schema is not a guaranteed rich-result opportunity.
- Pass accessibility, mobile layout, initial HTML, metadata uniqueness and booking-link tests before release.

### Technical QA matrix (run against actual production AND staging)

| Check | Production acceptance | Staging acceptance |
| --- | --- | --- |
| Host | One approved custom HTTPS canonical host; other hostnames 301 if feasible | No production canonical or sitemap indexability |
| /robots.txt | HTTP 200; appropriate crawling rules; sitemap URL | HTTP 200; Disallow: / |
| /sitemap.xml | HTTP 200; valid XML; only 200, canonical, indexable public URLs | No production URLs / empty sitemap |
| Public pages | HTTP 200, unique initial title/description/H1, self canonical, indexable | HTTP 200, noindex |
| /booking, /admin, sensitive paths | Noindex or authentication as appropriate; absent from sitemap | Noindex or authentication |
| Unknown /routes slug | Real HTTP 404 if unsupported; no soft-404 page | Same |
| Rendering | Googlebot-accessible CSS/JS; content useful without JS; no conflicting hydrated meta | Same with noindex |
| Images and UX | Sized/lazy-loaded non-LCP images, responsive formats; real mobile LCP/INP/CLS measurement | Same |
| Structured data | Only accurate Organization/WebSite/BreadcrumbList data where supported; validate rich results | No misleading business claims |
| Domain transition | Canonical, sitemap, redirects and Search Console match | Preview stays blocked |

**Important correction:** robots.txt Disallow is not a reliable substitute for noindex; blocked pages may not be crawled to observe their noindex. Use actual authentication for sensitive content. The production robots configuration must be reviewed for this interaction before any change.

### Measurement and prioritization

- **North-star:** qualified organic booking requests and confirmed bookings (with attribution limitations).
- **Leading indicators:** indexed intended URLs, non-brand impressions/clicks, route-level CTR, top queries, mobile Core Web Vitals, booking CTA clicks and completed requests.
- **Reporting:** baseline on release, weekly technical checks, 28-day Search Console comparisons, monthly conversion review; annotate releases and account for holiday seasonality.
- **First sprint (P0):** verify canonical domain and deployed HTML, robots/sitemap, GSC ownership and all route statuses; fix blocking indexing defects.
- **Second sprint (P1):** unify prerender/client metadata sources, automated 12-page parity and status tests, route content quality and genuine pricing.
- **Third sprint (P1/P2):** performance improvements based on Lighthouse/field metrics, verified business trust signals, original comparison/help articles only where search demand exists.
- **Ongoing:** legitimate partner links, content refreshes and Search Console-driven updates.

### Release gates and responsibilities

- No direct production deployment solely because source commits exist. Require green CI, staging smoke test, noindex safety and production-specific SEO regression checks.
- Do not configure Search Console, Analytics, DNS, Render environment variables or business profiles without verified account access and correct domain/ownership.
- Avoid any claim of first-page results, fixed ranking timelines, keyword volumes or ROI before measurement.

### Research references (checked 2026-11-19)

- Google Search Central SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google technical SEO and indexation: https://developers.google.com/search/docs/fundamentals/get-started
- Google navigation/internal-link structure: https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure
- Competitor destination index: https://dalamangotransfer.com/en/destinations
- Competitor transfer comparison guide: https://www.airportstransferturkey.com/guides/dalaman-airport-to-fethiye-marmaris
- Competitor operator directory: https://intransfers.com/transfers/turkey/dalaman-airport-dlm/

**Evidence boundary:** Competitor observations come from public pages. Keyword clusters and execution priorities are our recommendations. Google guidance is documented above. No live crawl or Search Console analytics are represented as completed in this section.


---

## ChatGPT Work execution brief — 2026-11-19

**Read this section first when operating in ChatGPT Work.** Treat the entire SEO_STANDARD.md as the existing project standard, not as a request to replace architecture. Site: https://dalamanway.com; staging: https://vip-transfer-dalaman-test.onrender.com; repository: Alisnmez/vip-transfer-dalaman; working branch historically feature/booking-integration. Verify current branches, deployment state and credentials rather than assuming historical information is current.

### Mission and definition of success
Increase qualified organic traffic and completed private Dalaman airport transfer booking requests, especially airport-to-Marmaris, Fethiye, Ölüdeniz, Göcek and İçmeler. Rankings are a leading indicator, not a guaranteed outcome. Preserve the existing booking flow and visual design. Use verified, ethical SEO methods and Google Search Central guidance.

### Work mode operating instructions (execute, do not just describe)
1. **Read and reconcile:** read this entire file, repository SEO config, prerender scripts, route content, deployment config, tests and recent commits. Produce a short inventory of implemented, unverified and broken features. Check whether earlier commits are on staging, production, or neither.
2. **Live technical audit first:** inspect actual https://dalamanway.com and representative destination URLs, /robots.txt, /sitemap.xml, HTML source without JavaScript, HTTP status, redirects, canonical, meta robots, title, H1, descriptions, internal links, structured data, mobile usability and 404 behavior. Check www and Render hosts for duplicate indexing. Verify production VITE_PUBLIC_SITE_URL at build time if Render access exists; never reveal secrets. Test staging noindex separately. Record each URL, observation, evidence and severity; do not infer deployed behavior from code alone.
3. **Search Console / analytics:** when connected and authorized, inspect domain ownership, indexing reports, submitted sitemap, URL inspection, queries, pages, countries, devices, CTR and clicks. Compare 28-day and 3-month periods where data exists; note seasonality and small samples. If access is missing, report exactly what cannot be verified and proceed with public audit and code work. Never fabricate search volume or position.
4. **Competitor SERP research:** independently search Google for the keyword clusters below in the actual target customer markets (e.g. UK English and relevant Turkish/international variants), preferably mobile and desktop. Record the *actual observed* top organic results, dates, locale and whether ads/map packs are present. Do not assert a competitor ranks first from one search or from a company's own claim. Study at least 5 directly competing sites and 2 high-quality informational alternatives. Starting candidates to verify: Suntransfers, Mavi Transfer, Dalaman Go Transfer, Dalamantransport, GET4S, Airport Transfers Turkey, and other current SERP leaders. For each observed competitor, capture landing URL, target intent, title/H1, route coverage, original local details, pricing transparency, UX, FAQs, schema, internal linking, trust indicators, mobile speed and relevant legitimate backlinks/citations where verifiable. Do not copy their text or invent backlink counts, traffic, domain authority or ranking causes.
5. **Gap analysis and opportunity scoring:** compare each relevant DalamanWay page against the *currently observed* SERP leaders. Separate observed facts from hypotheses. Score each candidate action 1–5 on business impact, evidence confidence, effort and risk; prioritize blockers first, then high-intent route content, then measured performance and authority. Explain why a competitor might perform better as a hypothesis, not as proven causality.
6. **Implement smallest safe batch:** fix confirmed technical blockers first; align generated initial HTML and hydrated React metadata; retain one central SEO source, unique canonical/title/description/H1, valid sitemap, production indexability, staging noindex, real 404s and descriptive crawlable links. Then improve the five route pages with genuinely useful *verified* destination-specific pickup/drop-off, route and luggage details, actual booking-system prices, FAQs and booking CTAs. No invented travel times, prices, reviews, licensing, promises or spam/doorway pages. Do not add orange visual styling or unrelated design changes.
7. **Quality gates:** run existing frontend/backend CI, SEO tests, initial HTML parity tests for every indexable route, staging smoke tests, booking regression (vehicle preselection, destination preselection, luggage per vehicle), mobile checks, canonical/sitemap/robots checks and staging noindex verification. Fix failures following repository conventions. Do not deploy to production until all required tests pass and the user authorizes production deployment.
8. **Report and iterate:** update this MD with a dated evidence-backed audit, competitor matrix, query-to-URL map, prioritized backlog, changed files, commit SHAs, test results, deployment status and remaining blockers. Report what is actually verified. After release, monitor Search Console indexing, 28-day non-brand impressions/clicks/CTR, organic booking requests and route-level conversion; do not promise top-10 placement.

### Initial keyword/SERP research matrix
| Search intent | Example queries | Our primary page |
| --- | --- | --- |
| Airport transfer booking | dalaman airport transfer; dalaman airport private transfer | / |
| Route comparison and prices | dalaman airport transfer prices; dalaman transfer prices | /routes |
| Marmaris | dalaman airport to marmaris transfer | /routes/marmaris |
| Fethiye | dalaman airport to fethiye transfer | /routes/fethiye |
| Ölüdeniz | dalaman airport to oludeniz transfer | /routes/oludeniz |
| Göcek | dalaman airport to gocek transfer | /routes/gocek |
| İçmeler | dalaman airport to icmeler transfer | /routes/icmeler |
| Group/private vehicle | dalaman airport minibus transfer; dalaman private vito transfer | /vehicles |

### Required deliverables
- **A. Baseline:** live URL-by-URL technical SEO table with verified HTTP/HTML observations and unresolved access limitations.
- **B. Competitor evidence:** dated SERP sample and competitor-by-competitor matrix with source URLs and actionable gaps; distinguish paid placements from organic rankings.
- **C. Prioritized work:** P0/P1/P2 backlog with impact, confidence, effort, risks and explicit acceptance tests.
- **D. Implementation:** minimal code changes and commits on the correct feature branch, with CI and staging results; production only after user authorization.
- **E. Updated standard:** append outcomes to this file without erasing historical findings, noting superseded claims.

### Safety, integrity and operating constraints
- Respect robots/access policies and rate limits; no evasion, scraping behind logins, fake reviews, keyword stuffing, mass-generated location pages, paid-link schemes or fabricated business profiles.
- Do not assume search rankings are stable across country, device or date. Treat competitor practices as examples to test, not guaranteed ranking factors.
- Do not expose API keys, account data, or customer booking details in reports or commits.
- If a required app connection or permission is unavailable, state the blocker precisely; continue independent checks instead of claiming completion.
- Preserve existing project coding standards, production behavior and all approved vehicle capacities; never modify the booking backend solely for SEO.
