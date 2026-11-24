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


## Canlı site ve rakip karşılaştırması — 19 Kasım 2026

### Canlı HTML ve indekslenebilirlik

Doğrudan HTTPS GET ile ilk HTML incelendi. JavaScript çalıştırılmadı. Gerçek Google indeks durumu ve seçtiği canonical için Search Console verisi gerekli.

| URL ve kontrol | Gözlenen sonuç | Öncelik |
| --- | --- | --- |
| `/` | HTTP 200, tek anasayfa H1, `index,follow` ve `https://dalamanway.com/` canonical | Sağlam |
| `/robots.txt` ve `/sitemap.xml` | HTTP 200. Sitemap 12 canlı domain URL’si listeliyor. Admin ve booking sitemape dahil değil. | Sağlam |
| Sitemapteki 11 alt URL, son eğik çizgisiz | HTTP 200. İlk HTML'de anasayfanın başlığı, H1'i ve canonical adresi geliyor. Buna beş rota, rota listesi, araçlar, hizmetler, iletişim, SSS ve yorumlar dahil. | P0 |
| Aynı 11 URL, son eğik çizgili | HTTP 200 ve her sayfanın kendine ait prerender HTML'i geliyor. Canonical eğik çizgisiz URL'yi gösteriyor. Marmaris'in doğrudan `/routes/marmaris/index.html` adresi de rota HTML'ini döndürüyor. | P0 |
| `/routes/seo-audit-nonexistent` | HTTP 200, ilk yanıtta anasayfa HTML'si. Gerçek 404 davranışı eksik. | P1 |
| `/booking` | İlk HTML anasayfa canonical'i ve `index,follow` içeriyor, robots.txt taramayı engelliyor. Sitemap dışında. Rezervasyon URL'sinin ilk yanıtta noindex politikasını doğrula. | P1 |
| HTTP ve www | Örnek anasayfa istekleri HTTPS www'siz domaine ulaştı. Üretim Render adresi HTTP 200 ve özel domain canonical'i döndürdü. | P2 |
| Staging | Anasayfa ilk HTML'sinde `noindex,nofollow`; robots.txt `Disallow: /`. | Sağlam |

Render üretim frontend'i `frontend/dist` yayınlayan bir Static Site. Son eğik çizgili ve dosya adresli sonuçlar, sayfa dosyalarının yayında bulunduğunu gösteriyor. Sorun, sitemapte tercih edilen URL'nin hangi HTML'i servis ettiği. Mevcut Render kuralları bu denetimde değiştirilmedi. Kaynakta ayrıca prerender scripti, router ve ortak SEO hook'u meta etiketlerini ayrı ayrı yönetiyor. Mevcut üç test dosyasında 11/11 test geçti. Bu testler dosya üretimini doğruluyor, Render'ın bu dosyaları sitemap URL'lerinde servis ettiğini doğrulamıyor.

### İngilizce arama örneklemi ve rakipler

19 Kasım web araması örneği. Sorgular İngilizce, UK müşteri niyeti dikkate alındı. Yerel Google UK mobil ve masaüstü sıralaması, reklam konumu ve Map Pack bu örneklemden teyit edilemez. Gözlemler rakiplerin sayfada gösterdiği bilgileri tanımlar.

| Sorgu / örnek | Sayfadaki somut fark | DalamanWay’de karşılığı |
| --- | --- | --- |
| Dalaman to Fethiye, Marmaris, Ölüdeniz — [Dalaman Travel](https://www.dalamantravel.com/en/dalaman-airport-to-fethiye-transfer) | Ayrı rota sayfaları, süre aralığını etkileyen koşullar, araç başına GBP fiyatı ve araç seçenekleri | Rota sayfası ve rezervasyon bağlantısı var. Fiyat ve araç karşılaştırmasını rota üzerinde gösterme fırsatı var. |
| Dalaman to Fethiye, Marmaris — [Discover Travel](https://www.discovertravelturkey.com/en/airport-transfers/dlm-fethiye/) | Başlangıç fiyatı, ödeme şekli, otel/adres ve uçuş bilgisi, erişilebilir araç seçeneği | Fethiye sayfasında otel/adres hatırlatması ve rezervasyon bağlantısı var. Onaylı koşulları ve fiyatı daha erken göster. |
| Dalaman to Fethiye, Ölüdeniz — [Transfers Via Dalaman](https://www.transfersviadalaman.com/transfers/dalaman-to-fethiye) | GBP fiyatı, yolcu kapasitesi, buluşma bilgisi ve rota SSS'si | VIP Vito için araç ve valiz bilgisi proje verisinde var. Rota bağlamında görünür kıl. Buluşma ve gecikme bilgisini işletme onayına göre ekle. |
| Dalaman to Fethiye — [Agne Tours](https://agnetours.com/dalaman-airport-to-fethiye/) | Araç türleri, fiyat, kapasite ve aynı sayfada rezervasyon akışı | Rota seçili rezervasyon mevcut. Araç seçeneklerini tıklamadan önce göster. |
| Dalaman airport transfer — [Monarch Transfer](https://monarchtransfer.com/en) | Genel servis teklifi içinde yaygın rotalar ve buluşma bilgisi | DalamanWay’de beş rota var. Rota listesinin ilk HTML’ini düzelt ve rota bağlantılarını görünür tut. |
| Dalaman airport transfer prices — [Airport Transfers Turkey](https://www.airportstransferturkey.com/guides/dalaman-airport-transfer-prices) | Bölge bazlı fiyat ve ulaşım alternatifi karşılaştırması | Var olan rota ve fiyat sayfası bu sorgu için aday. Güvenilir fiyat kaynağını ve araç başına ücret bilgisini kullan. |
| Dalaman airport transfers — [Dalamanhavalimani.com](https://www.dalamanhavalimani.com/en/dalaman-airport-transfers/) | Destinasyon süreleri ve ulaşım seçenekleri tablosu | İhtiyaç varsa mevcut rota listesine yalnızca doğrulanmış bilgiler eklenebilir. |

### Sıralı uygulama

1. **P0 / Etki 5, kanıt 5, efor 2, risk 2.** Staging'de 11 eğik çizgisiz URL için kendi `/…/index.html` dosyasına tam yol rewrite kurallarını genel SPA kuralından önce dene. Aynı URL'yi koru. Üretim kabulü: sitemapteki 12 URL'nin her biri ilk yanıtında HTTP 200, tek doğru canonical, doğru H1 ve sayfaya özel title döndürür. Staging noindex kalır. Rezervasyon ve admin doğrudan bağlantılarını smoke test et. Genel SPA kuralını kaldırmak yerine 404 davranışını ayrı iş olarak değerlendir.
2. **P1 / Etki 4, kanıt 5, efor 3, risk 2.** Marmaris ve Fethiye ile pilot başlat. Mevcut fiyat kaynağından araç başına GBP fiyatı, doğrulanmış yolcu ve valiz kapasitesi, otel/adres ve buluşma talimatı ile rota seçili rezervasyon ekle. Başarıyı organik görünümler, tıklamalar ve nitelikli rezervasyon talepleriyle ölç. Pilot seçimi hacim sıralaması iddiası içermez.
3. **P1 / Etki 4, kanıt 5, efor 2, risk 1.** Üretim doğrulamasından sonra Search Console’da sitemap durumunu kontrol et, iki pilot URL'yi incele, Google'ın seçtiği canonical'i ve indeks durumunu kaydet, gerekli URL’ler için yeniden tarama iste. [Google URL Inspection](https://support.google.com/webmasters/answer/9012289/) · [Render rewrite kuralları](https://render.com/docs/redirects-rewrites)
4. **P1 / Etki 3, kanıt 5, efor 3, risk 3.** İlk HTML ve React meta etiketlerini ortak kaynaktan üret. Canonical/robots/title tutarlılığı için canlı HTTP ve tarayıcı regresyon kontrolü ekle. Booking noindex ve geçersiz rota 404 davranışlarını gözden geçir.

Bu güncelleme araştırma ve denetim kaydıdır. Render yönlendirme kuralları veya canlı uygulama bu denetimde değiştirilmedi. Search Console, gerçek Google UK sıra ölçümü, cihaz karşılaştırması ve rakip backlink incelemesi henüz doğrulanmadı.


### P0 test ortamı doğrulaması — 19 Kasım 2026

Render test frontend'inde 11 tam yol rewrite kuralı, genel `/* → /index.html` kuralının önüne eklendi. Her kural `/yol → /yol/index.html` biçiminde ve tarayıcı adresini değiştirmeden mevcut prerender dosyasını sunuyor. Genel kural rezervasyon ve yönetim bağlantıları için listenin sonunda.

- 12/12 genel URL, son eğik çizgi eklemeden HTTP 200 ve benzersiz ilk HTML başlığı döndürdü. Her yanıtta tek H1 bulundu ve eğik çizgili adresle aynı HTML geldi.
- `/booking`, `/booking/lookup`, `/admin` ve `/admin/bookings` HTTP 200 ve uygulama kabuğunu döndürdü. Bu kontrol rezervasyon gönderimi veya yönetici kimlik doğrulaması içermiyor.
- Test ortamında `noindex,nofollow`, canonical etiketinin yokluğu, taramaya kapalı robots.txt ve boş sitemap doğrulandı.
- Üretim ayarları değişmedi. Üretim kabulü için aynı kuralların uygulanmasından sonra 12 sitemap URL'sinde doğru HTML ve kendi canonical adresi doğrulanmalı. Google'ın seçtiği canonical ve indeks durumu Search Console'da ayrıca kontrol edilmeli.

### SEO dalı ve canlı yeniden denetim — 19 Kasım 2026

Canlı ve test frontend sürümü aynı commit'te (`4d15033`). Canlıda site haritasındaki 12 adresin tamamı eğik çizgisiz isteklerde HTTP 200, benzersiz ilk HTML başlığı, kendi canonical adresi ve `index,follow` döndürdü. Önceki genel sayfa rewrite bulgusu bu yeniden denetimde görülmedi. Testte aynı 12 adres HTTP 200 ve `noindex,nofollow` döndürdü, canonical yoktu ve site haritası boştu.

Canlı `/booking` ilk HTML'de hâlâ ana sayfa canonical'i ve `index,follow` döndürüyor. Üretim robots.txt bu yolu taramaya kapatıyor. Bu durum site haritasındaki 12 genel adresten ayrı bir iş. Search Console mülk erişimi, Google'ın seçtiği canonical ve gerçek dizin durumu doğrulanmadı.

Çakışma kontrolünde SEO dalının tabanı aktif teslim dalı (`feature/booking-integration`) ile aynı bulundu. Dört pazar araştırması dalı SEO dalının geçmişinde bulunuyor. `main` ayrışmış; bu çalışma `feature/seo-audit-checks-20261119` dalında yürütüldü. Mevcut dallar ve Render ayarları korundu.

SEO dalındaki prerender testinin sözdizimi düzeltildi. Test, 12 genel adresin tamamında tek canonical ve H1, benzersiz title, Open Graph/Twitter etiketleri ve test ortamının indeksleme sınırlarını doğruluyor. Yerelde 84 test, lint ve üretim ayarlı frontend derlemesi geçti. Bu testler gerçek Google indeks durumu yerine üretilen HTML çıktısını denetler.

Bir sonraki geliştirme için dil seçicisinin mevcut EN/DE/RU davranışı ve İngilizce adresler korunmalı. Ayrı dil URL'leri ve karşılıklı hreflang uygulamadan önce ilgili sayfaların tam çevirileri ve sunucu yönlendirmeleri doğrulanmalı. Önceki araştırma ve karar kaydı [SEO dört pazar araştırmasında](../docs/SEO_FOUR_MARKETS_RESEARCH_2026-11-19.md) bulunuyor.

### Uygulama yolları için noindex — 19 Kasım 2026

Derleme, prerender öncesi Vite girişinden `dist/app-shell.html` üretiyor. Bu dosya uygulamanın JS/CSS bağlantılarını ve React kökünü koruyor. İlk HTML'de `noindex,nofollow` var. Ana sayfanın canonical, açıklama ve sosyal paylaşım etiketleri bu dosyada bulunmuyor.

Uygulama sırası:

1. SEO PR'ı test ortamına dağıtıldıktan sonra `/app-shell.html` adresinin gerçekten yeni dosyayı döndürdüğünü doğrula.
2. Render test frontend'inde 11 tam yol eşleşmesini koru. Listenin sonundaki genel rewrite hedefini `/index.html` yerine `/app-shell.html` yap. Test ortamında `Disallow: /` kalır.
3. Testte rezervasyon, yolcu bilgisi, onay, sorgulama ve admin adreslerinin ilk HTML'ini, JS dosyalarını ve tarayıcı akışını doğrula. Canlı onayından sonra aynı sırayı üretimde uygula ve 12 sitemap URL'sini tekrar kontrol et.
4. Üretimde rezervasyon adreslerinin `noindex` yanıtı doğrulandıktan sonra `Disallow: /booking` kuralını ayrı değişiklik olarak değerlendir. Google, taraması engellenen sayfanın `noindex` etiketini okuyamaz. Admin erişimi uygulama yetkilendirmesiyle korunur. Genel SPA kuralı bilinmeyen adresler için HTTP 200 döndürebilir. Gerçek 404 ayrı çalışmadır.

Yerel sonuç: 85 test, lint ve production derlemesi geçti. Yerel HTTP rewrite simülasyonunda 12 genel URL ve 5 uygulama adresi beklenen ilk HTML'i ve JS girişini döndürdü. Render kuralı henüz değiştirilmedi.

- [Render rewrite kuralları](https://render.com/docs/redirects-rewrites)
- [Google noindex dokümantasyonu](https://developers.google.com/search/docs/crawling-indexing/block-indexing)

### Devam kaydı — 19 Kasım 2026

Bu kayıt, yukarıdaki hazırlık aşaması notlarından sonraki durumu gösterir.

| İş | Durum ve kanıt | Sıradaki adım |
|---|---|---|
| SEO-02, SEO-03, SEO-05 ve ilk SEO-13 yayını | Canlı frontend `ca5812c`. 12 sitemap adresi HTTP 200, kendi canonical'ı ve `index,follow` döndürdü. Beş uygulama adresi `noindex` HTML'i verdi. Üretim `robots.txt` rezervasyon taramasına izin veriyor. Render testte `Disallow: /` korunuyor. Dört CI kontrolü, 85 yerel test ve Göcek rezervasyon ön seçimi doğrulandı. | Sonraki sürüm için aynı kontrolleri yenile. |
| SEO-06–08, dil adresleri | Mevcut dil tercihi tarayıcıda saklanıyor. İngilizce adresler olduğu gibi kalacak. İlk pilot için Almanca ve Rusça Marmaris ve Göcek adresleri ayrı bir değişiklikte değerlendirilecek. | URL'deki dili ilk HTML'de ve React açılışında sabitle. Dil bağlantıları, karşılıklı hreflang, kendi canonical'ı ve Render tam yol kuralları birlikte test edilmeden sitemap'e ekleme. İngilizce adres ve rezervasyon sorgu parametresi için regresyon testi çalıştır. Türkçe, tam çeviri hazır olduğunda ayrı olarak değerlendirilecek. |
| SEO-09, rota içeriği | Marmaris, Fethiye, Ölüdeniz, Göcek ve İçmeler varış notları EN/DE/RU olarak eklendi. İngilizce notlar JS öncesi HTML'de de yer alıyor. 85 yerel test, lint ve üretim derlemesi geçti. | Dalyan ve Sarıgerme için rota içeriği ve yayın kuralları ayrı değişiklikte tamamlanacak. |
| SEO-10, mobil performans | Canlı ana sayfa ve Marmaris ilk HTML'inde aynı 5 JS ve 1 CSS dosyasına referans var. Canlıdan gzip olarak alınan bu 6 dosya toplam 165.285 bayt. Bu ölçüm resimleri, fontları, API isteklerini ve sonradan yüklenen dosyaları kapsamıyor. Lighthouse bağlantı ve sertifika hatası verdi. PageSpeed API kota nedeniyle HTTP 429 döndürdü. | Canlı mobil ölçümü erişebilen bir tarayıcıda tekrarla. LCP, CLS ve yüklenen kaynakları kaydet. |
| SEO-11, yapılandırılmış veri | İşletme bilgileri doğrulanana kadar planlandı. | Görünen işletme bilgilerini karşılaştır ve yalnızca doğrulanabilen alanları işaretle. |
| SEO-12, Search Console | Açık Google hesabında mevcut mülk görünmedi. `dalamanway.com` alan adı formu hazırlandı. Yetkili DNS sunucuları Porkbun'da. | Doğru Google hesabı için sahiplik doğrulaması, sitemap durumu ve başlangıç performans verileri bekliyor. |

İlgili yönlendirmeler: [Google çok dilli site rehberi](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites) · [Search Console sahiplik doğrulaması](https://support.google.com/webmasters/answer/9008080).

**Rota adayı `1905edc` test sonucu:** Dört GitHub Actions kontrolü geçti. Render testinde beş rota adresinin ilk HTML'inde İngilizce not ve `noindex` doğrulandı. Göcek sayfasında dil seçicisiyle İngilizce, Almanca ve Rusça notlar görüldü. Rezervasyon bağlantısı Göcek'i otomatik seçti. Test servisi `4d15033` sürümüne ve commit geldiğinde otomatik dağıtıma döndürüldü. Rota adayı canlıya alınmadı. [PR #19](https://github.com/Alisnmez/vip-transfer-dalaman/pull/19)

**Canlı rota yayını — 19 Kasım 2026:** Onaylanan `1905edc` sürümü Render frontend dağıtımı `dep-dbvg0m6c6qcc73b620hg` ile yayında. Beş rota HTTP 200, kendi canonical adresi ve İngilizce varış notunu ilk HTML'de verdi. 12 genel, 5 uygulama adresi ile robots.txt ve sitemap tekrar doğrulandı. Göcek notu tarayıcıda EN/DE/RU görüldü ve rezervasyon hedefi otomatik seçildi. Test rezervasyonu gönderilmedi.

**Search Console:** Google, `dalamanway.com` için alan adı TXT doğrulamasını hazırladı. Porkbun oturumu açılana kadar doğrulama kaydı eklenmedi. Sahiplik doğrulamasından sonra sitemap ve indeksleme raporları kontrol edilecek.

**Search Console doğrulaması — 19 Kasım 2026:** Porkbun'da kök `dalamanway.com` için Google TXT kaydı eklendi. Search Console alan adı mülkünde sahiplik doğrulandı. `https://dalamanway.com/sitemap.xml` gönderildi, Google 19 Kasım'da okudu ve 12 keşfedilen sayfayla Başarılı durumunu gösterdi. Bu sayı indekslenen sayfa sayısı değildir. Ana sayfanın URL Denetimi ilk kontrolde “URL Google'da yok” ve “URL Google tarafından bilinmiyor” sonucunu verdi. Dizine ekleme talebi kabul edilerek öncelikli tarama sırasına alındı. Performans raporu veri işliyor ve henüz veri göstermiyor. Sonraki kontrol: ana sayfa ve Marmaris/Göcek için indeks durumu ve seçilen canonical; veri oluşunca ülke, sorgu, sayfa ve 28/90 günlük gösterim/tıklama karşılaştırması.

### Rota genişletme ve genel kontrol — 19 Kasım 2026

- Search Console yeniden denetiminde ana sayfa dizinde. Marmaris ve Göcek henüz dizinde görünmedi.
- Dalyan ve Sarıgerme için EN/DE/RU rota içeriği, ilk HTML ve sitemap hazırlandı. Ana sayfaya görünen marka adı ve canonical URL ile sınırlı Organization JSON-LD eklendi.
- Yerelde Java 21 ve PostgreSQL ile 102 backend testi, 85 frontend testi, 18 Playwright senaryosu, lint ve üretim derlemesi geçti. npm audit 0 bulgu döndürdü. 360, 390 ve 430 px mobil genişliklerinde iki yeni rotada yatay taşma görülmedi ve rezervasyon hedefi otomatik seçildi.
- Yerel mobil Lighthouse simülasyonunda Marmaris LCP 1,39 sn ve CLS 0 çıktı. Ana sayfa için toplam skor üretilmedi. Bu ölçüm yerel aday derlemesine aittir ve gerçek kullanıcı verisi değildir.
- Kalan işler: test Render yönlendirmeleri, canlı onayı ve yayımlama. İki yeni yol için `/routes/dalyan → /routes/dalyan/index.html` ve `/routes/sarigerme → /routes/sarigerme/index.html` kuralları genel fallback'in üstünde olmalı. Yayından sonra 14 sitemap adresini tekrar kontrol et.
- Ayrı dil URL'leri, hreflang ve canlı mobil saha ölçümü açık. Rezervasyon taslaklarının tarayıcıda saklanma süresi ayrı gizlilik incelemesinde ele alınacak.

**Render ve Search Console takip kaydı:** Dalyan/Sarıgerme adayı `30d8c67` dört CI kontrolünü geçti. Render testinde 14 genel URL, iki yeni yol ve staging robots/sitemap doğrulandı. Test servisi önceki sürüm, yönlendirme ve otomatik dağıtım ayarlarına döndü. Ana sayfa Google dizininde. Marmaris ve Göcek için ilk dizine ekleme talepleri kabul edildi. Search Console mobil Önemli Web Verileri raporu yeterli saha verisi olmadığını gösterdi. [PR #20](https://github.com/Alisnmez/vip-transfer-dalaman/pull/20)

### Almanca ve Rusça rota pilotu — 19 Kasım 2026

- Marmaris ve Göcek için mevcut İngilizce yollar korundu. Almanca ve Rusça yollar ilk HTML'de doğru dili, çevrilmiş başlığı ve metni verir. Üretimde her varyant kendi canonical adresini taşır. Üç varyant ve `x-default` karşılıklı hreflang ile eşleşir.
- 86 frontend testi, 19 tarayıcı senaryosu, lint ve üretim derlemesi yerelde geçti. Mobil tarayıcı testinde doğrudan Almanca açılış, Rusçaya geçiş, Rusça rezervasyon formunda doğru Marmaris seçimi ve Göcek'in İngilizce adresine dönüş doğrulandı.
- Pilot yayını için `/de/routes/marmaris`, `/ru/routes/marmaris`, `/de/routes/gocek` ve `/ru/routes/gocek` yolları kendi `/index.html` dosyalarına yönlenmeli. Kurallar genel fallback'in üstünde olmalı. Dalyan ve Sarıgerme de aynı adayla yayına alınırsa onların iki kuralı da eklenir.
- Render testinde yeni yolları, noindex sınırını ve canlıdan önce 18 adresi kapsayan sitemap derlemesini doğrula. Pilotu diğer rotalara genişletme ve saha verisi, pilot yayınından sonra ayrı doğrulama bekliyor.

**Pilot test sonucu:** `f3ded1f` dört GitHub Actions iş akışını geçti. Render testinde 18 genel yolun ilk HTML yanıtı, dört yeni dil yolunda doğru `lang`, staging noindex/robots politikası ve boş staging sitemap doğrulandı. Tarayıcıda Göcek’in Almancadan Rusçaya geçişi ve rezervasyon hedefi doğrulandı. Test servisi `4d15033`, asıl rewrite kuralları ve On Commit ayarına döndü. Aday canlıya alınmadı. [PR #21](https://github.com/Alisnmez/vip-transfer-dalaman/pull/21)

**Canlı yayın — 19 Kasım 2026:** `f3ded1f` aday sürümü `dep-dbvgkhe7bikc738i80f0` dağıtımıyla canlı frontend'e alındı. Dalyan ve Sarıgerme ile dört Almanca/Rusça adres için altı tam eşleşme, mevcut 11 tam eşleşmenin ardından ve `/* → /app-shell.html` kuralının üstüne eklendi. Canlı sitemap'teki 18 URL HTTP 200, doğru ilk HTML, tek H1 ve kendi canonical adresini verdi. Marmaris ve Göcek varyantları karşılıklı hreflang ile eşleşti. Ana sayfadaki Organization verisi, robots.txt, JS giriş dosyası ve beş uygulama URL'sinin noindex HTML'i doğrulandı. Göcek'te Almanca → Rusça → rezervasyon ve mevcut İngilizce adrese dönüş tarayıcıda geçti. Test rezervasyonu gönderilmedi. Google'ın yeni URL'leri indeksleme durumu henüz doğrulanmadı.

## 19 Kasım 2026 — Üç hedef pazarda görünürlük

Canlı kontrolde site haritasındaki 18 adresin tamamı HTTP 200, tek H1, kendine ait canonical ve index,follow döndürdü. /booking ilk HTML'de noindex döndürdü. İlgili dokuz SEO testi geçti.

| Hedef pazar | Yayındaki rota sayfaları | Kapsam |
| --- | --- | --- |
| Birleşik Krallık | Yedi İngilizce rota | 7/7 |
| Almanya | Marmaris ve Göcek | 2/7 |
| Rusya | Marmaris ve Göcek | 2/7 |

Üç dilde yedi rota hedefinde 11/21 sayfa yayında (%52). Bu ölçüm içerik kapsamını gösterir. Ülke bazlı sıralama başlangıç değerleri henüz doğrulanmadı.

### Sıradaki işler ve kabul ölçütleri

1. Bilinmeyen rota canlıda HTTP 200 ve noindex dönüyor. Geçersiz adresin HTTP 404, geçerli rota ve doğrudan açılan rezervasyon bağlantısının HTTP 200 döndüğünü önce test ortamında doğrula.
2. Almanca ve Rusça Fethiye ile Ölüdeniz sayfalarını hazırla. Dört yeni adresin her birinde doğru dil, özgün rota bilgisi, kendine ait canonical, karşılıklı hreflang, site haritası kaydı ve doğru destinasyona açılan rezervasyon bağlantısını doğrula. Ardından İçmeler, Dalyan ve Sarıgerme için aynı kontrolü uygula.
3. Rota sayfalarının ilk HTML'ine yolcunun kararını etkileyen, işletmenin doğruladığı araç, bagaj ve buluşma bilgilerini ekle. Fiyat gösteriliyorsa rezervasyon sistemiyle aynı kaynaktan üret.
4. Search Console'da 18 adreslik haritanın son okunma tarihini ve yeni rota adreslerinin indeks durumunu kaydet. Performans raporunda Birleşik Krallık, Almanya ve Rusya'yı ayrı filtrele. Her pazar için markasız rota sorgularını ilgili açılış sayfasıyla eşleştir. Son 28 günü önceki 28 günle gösterim, tıklama, CTR ve ortalama konum üzerinden karşılaştır. Veri azsa tarih aralığı ve gösterim sayısını kaydet. Organik rezervasyon taleplerini ölçüm kurulunca ayrıca izle.

### 19 Kasım — Fethiye ve Ölüdeniz yayını ve HTTP 404 doğrulaması

PR #23, commit `a5c17fc`. Almanca ve Rusça Fethiye ve Ölüdeniz sayfaları yayında. Rota kapsamı EN 7/7, DE 4/7, RU 4/7; toplam 15/21. Üretim site haritası 22 adres içeriyor.

Yerelde 86 frontend testi, lint ve üretim derlemesi geçti. Test servisinde 12 HTTP/HTML kontrolü geçti ve site haritası boş kaldı. Üretimde 22 site haritası adresinin her biri HTTP 200, tek H1, doğru HTML dili, index,follow ve kendi canonical adresini verdi. Altı rezervasyon/yönetim adresi HTTP 200 ve noindex döndü. İki bilinmeyen genel/rota adresi HTTP 404 döndü. Test ve üretim statik servislerinde genel rewrite yerine rezervasyon ve yönetim yollarına özel kurallar ve dört yeni rota için statik HTML kuralları kaydedildi.

Sonraki ölçüm: Search Console'da yeni adreslerin keşif ve indeks durumları, ardından ülke/sorgu/sayfa performansı. HTTP kontrolleri Google indeks durumunu ölçmez.

### Search Console ve pazar örneklemi

19 Kasım'da Google Search Console, yeniden gönderim öncesinde sitemap.xml için “Başarılı”, son okuma 19 Kasım ve 12 keşfedilen sayfa gösterdi. 22 URL içeren aynı harita yeniden gönderildi; Google başarılı gönderimi onayladı. Performans ve indeks kapsamı raporlarında veri işleniyordu. Keşfedilen 12 adresi indeks sayısı olarak kullanmayın.

Almanca Fethiye aramalarında [Fethiye Tours](https://www.fethiyetours.com/de/fethiye-airport-transfer/) araç başına ücretin kapsamını ve buluşma sürecini açıklıyor. Rusça Ölüdeniz örneğinde [Dalaman Airport Transfer](https://www.dalamanairporttransfer.com/ru/peredaca/dalaman-aeroport/oludeniz) araç ve valiz kapasitesini gösteriyor. İngilizce [Hero Transfer](https://www.herotransfer.com/price-list/) Ölüdeniz için tek yön GBP fiyatlarını araç türüyle birlikte listeliyor. Bunlar dil bazlı içerik örnekleridir; ülke bazında Google sırası ölçülmedi. DalamanWay için sonraki içerik önceliği, rezervasyonla tutarlı ve doğrulanmış araç, bagaj, ücret ve buluşma bilgisini ilk HTML'de erişilebilir kılmak.

### Yedi rotanın üç dilde yayını ve Google indeks denetimi

PR #24 ile tüm rota sayfalarının ilk HTML ve React görünümüne rezervasyon filosuyla aynı katalogdan dört aracın yolcu ve bagaj kapasitesi eklendi. Güncel fiyat karşılaştırması GBP ve araç başına ücret açıklamasıyla bağlantılandı. PR #25 ile İçmeler, Dalyan ve Sarıgerme için Almanca ve Rusça içerikler eklendi. Son üretim kodu `a166b6b`. Kapsam 7 EN + 7 DE + 7 RU = 21/21 rota-dil sayfası. Canlı site haritasında 28 adres var. Bu yüzdeler sayfa kapsamını ölçer.

86 frontend testi, lint ve üretim derlemesi geçti. Test ortamında 22 HTTP/HTML kontrolü geçti. Üretimde 28 indekslenebilir URL, altı uygulama adresi ve iki hatalı adres üzerinde toplam 36 HTTP/HTML kontrolü geçti. Rotalarda dört araç kapasitesi ve karşılıklı en/de/ru/x-default eşleşmeleri üretim HTML'inde doğrulandı.

Search Console URL denetiminde İngilizce Marmaris ve Göcek dizinde. İngilizce Fethiye, Ölüdeniz, İçmeler, Dalyan ve Sarıgerme ile Almanca/Rusça Marmaris, Göcek, Fethiye ve Ölüdeniz henüz dizinde görünmedi. Ülke bazlı sıralama ve tıklamalar için performans verisi işleniyor.

28 adreslik harita gönderilirken Google “Site haritası başarıyla gönderildi” onayını verdi. Aynı anda listede önceki okumadan 22 keşfedilen sayfa görünüyordu. Son altı dil adresi için bireysel URL denetimleri doğrulanmadı.

### 19 Kasım 2026 — Son canlı kontrol ve Google URL denetimi

Canlı site haritasındaki 28 benzersiz adresin tamamı doğrudan HTTP 200, tek H1, index,follow ve kendi canonical adresini döndürdü. Yedi rotanın 21 EN/DE/RU sürümünde HTML dili, karşılıklı en/de/ru/x-default hedefleri ve destinasyon parametreli rezervasyon bağlantısı doğrulandı. Dört rezervasyon ve iki yönetim adresi HTTP 200 ve noindex,nofollow döndürdü. İki geçersiz adres HTTP 404 döndürdü. 36/36 adres kontrolü geçti.

Search Console, son okuma tarihi 19 Kasım olan başarılı site haritasında 28 keşfedilen sayfa bildirdi (önceki kayıt 22). Her rota URL'si ayrı denetlendi. İngilizce Marmaris ve Göcek dizinde; diğer beş İngilizce rota ve 14 Almanca/Rusça rota henüz dizinde görünmüyor. Sonuç yalnızca 21 rota URL'sini kapsar. Ülkeler sekmesi henüz etkin değildi ve performans raporu verilerin işlendiğini gösteriyordu. Birleşik Krallık, Almanya ve Rusya için gösterim, tıklama veya konum değeri doğrulanamadı. Bu kontrolde uygulama kodu veya yayın yapılandırması için düzeltme gerekmedi.


## 24 Kasım 2026 — Birleşik SEO çalışma planı (güncel devam noktası)

Bu bölüm eski görev listelerinin önceliklerini günceller; tarihsel kayıtları silmez. Dört pazar araştırması için [araştırma eki](../docs/SEO_FOUR_MARKETS_RESEARCH_2026-11-19.md). UK birincil ölçüm pazarıdır; DE/RU mevcut kapsam korunur. TR ayrı izlenir.

### Başlangıç verisi ve kanıt sınırı

Kullanıcının önceki Search Console aktarımı: UK 32 gösterim, 0 tıklama, 62,7 ortalama konum; TR 8/0/76,4; DE 3/0/44,7. Marmaris 22 gösterim ve 67,9 konum olarak aktarılmıştır; sonraki denetimde UK Marmaris 21, UK toplam 34 bildirilmiştir. Filtre ve tarih aralıkları eşitlenmeden bu sayılar trend olarak karşılaştırılmaz. Orijinal ekran görüntüleri bu oturumda yeniden doğrulanmadı. Marka aramasında kaybolma kullanıcı bildirimi; indeks kaybı henüz kanıtlanmadı. 66. konum geleneksel 10 sonuç düzeninde yaklaşık 7. sayfadır. Yeni siteler için evrensel beşinci gün sıralama standardı yoktur.

### Birleşik görev listesi

- [ ] SEO-05/P0: Güncel production ve staging HTTP, redirect, canonical, robots/noindex, sitemap, hreflang, ilk HTML, JS metadata ve geçersiz URL kontrollerini tekrarla; marka araması kaybını GSC URL denetimi, Google-selected canonical ve son tarama ile araştır. Ana sayfa ve Marmaris öncelikli. Favicon erişimi, HTML linki ve Google yönergelerini doğrula; favicon indeksleme ile aynı sorun değildir.
- [ ] SEO-01/P1: UK hedefli Marmaris ticari sorgularında ilk 10 organik rakibi, tarih/konum/cihaz ve ölçüm yöntemiyle kaydet. Gerçek UK sıralaması doğrulanamıyorsa örneklem olarak etiketle. Fiyat, içerik, güven, araç, karşılama, rezervasyon ve iç bağlantıları karşılaştır.
- [ ] SEO-08/P1: Marmaris özgün rota içeriği, doğrulanmış yolculuk ve otel/buluşma bilgileri, meta açıklaması, SSS ve iç bağlantılar. Fiyatı mevcut fiyat kaynağından göster; sabit kopya veya doğrulanmamış garanti kullanma. Doğrulanmış araç olanaklarını (Wi-Fi, klima, su, USB, TV, deri koltuk, talep üzerine çocuk koltuğu) uygun biçimde sun. Mevcut kapasite ve rezervasyon ön doldurma korunmalı.
- [ ] SEO-11/P1: Güven bilgileri, ana sayfa ve rezervasyon akışı denetimi; yalnızca gerçek işletme verisi. WhatsApp Business hazır olana kadar numara ekleme.
- [ ] SEO-13/P0: Ayrı branch, lint/unit/build/browser smoke, staging HTTP ve rezervasyon testleri; yalnızca başarılı testlerden sonra kontrollü production yayını ve canlı tekrar kontrolü. Başarısızlıkta yayın yok.
- [ ] SEO-12/P2: GSC UK marka/markasız sorgu ve URL bazında eşit 7/28 günlük dönemler; gösterim, tıklama, CTR, konum, indeks ve organik rezervasyon ölçümü. Düşük örneklemde kesin sonuç çıkarma. 30/60/90 gün için ilk 50/30/20 izleme hedefleri, garanti veya tahmin değil.
- [ ] SEO-08/P1: Marmaris sonrası Fethiye, ardından Ölüdeniz ve diğer rotalar; aynı kabul ölçütleriyle. Yeni sayfa açmadan önce mevcut sayfaların niteliği ve indeks durumu değerlendirilsin.

19 Kasım tarihli 21/21 rota-dil kapsamı, 28 sitemap URL'si, 36/36 HTTP kontrolü, kapasite ve ön doldurma önceki doğrulamalardır; eski araştırma dosyasındaki SEO-05/06 ve dil genişletme kayıtları tarihsel kabul edilir. Güncel yeniden ölçüm ayrı görevdir. Bu belge güncellemesi uygulama kodu veya canlı yayın değişikliği değildir.


### Kullanıcı kararı — branch yönetimi (24 Kasım)
Yeni branch açmamak esastır. Önce mevcut branch'ler, main ile farkları, birleşme durumları ve aktif çalışmalar incelenir; uygun mevcut branch yeniden kullanılır. Yeni branch gerçekten zorunluysa gerekçesiyle kullanıcıdan önceden açık onay alınır. Branch silme veya birleştirme körlemesine yapılmaz. Bu doküman güncellemesi mevcut docs/seo-plan-2026-11-24 branch'inde yapılmıştır.

### Sıralı uygulama ve kabul kapıları
1. Branch envanteri ve tek güncel çalışma planı; mevcut değişiklikleri koru.
2. Teknik SEO: production/staging, GSC URL inspection, canonical, robots, sitemap, hreflang, HTTP, prerender, favicon, mobil ve Core Web Vitals (LCP/INP/CLS); geçmiş testleri güncel sonuç sayma.
3. GSC başlangıç ölçümü: aynı tarih/ülke/sorgu/URL/cihaz filtreleri; düşük örneklemde günlük değişiklik yapma.
4. UK ticari sorgularında rakip örneklemi: başlık, içerik, fiyat, rezervasyon, filo, güven, mobil, bağlantılar ve otorite; doğrulanmamış sıralama iddiası yok.
5. Marmaris pilotu, sonra Fethiye ve Ölüdeniz; kalan rotaların sırası talep ve rekabet verisine göre. Mevcut özellikleri eksik sayma; özgün rota içeriği, fiyat kaynağı, karşılama, SSS, iç bağlantı.
6. Ana sayfa, güven ve rezervasyon dönüşümü; doğrulanmış olanaklar, gerçek yorumlar, WhatsApp Business hazır olmadan numara yok.
7. İçerik rehberleri ve iç bağlantılar; mevcut rehberleri denetle, çakışan arama niyetleri ve gereksiz sayfa üretiminden kaçın.
8. Otorite: gerçek işletme profilleri, ilgili turizm ortaklıkları ve doğal bağlantılar; satın alınan spam bağlantılar yok.
9. Ölçüm: organik rezervasyon hunisi, kişisel veri içermeyen olaylar, 7/28 günlük karşılaştırmalar ve 30/60/90 günlük hedef değerlendirmesi.
10. Her uygulamada test/staging kapısı, kontrollü yayın ve canlı doğrulama; kanıt, commit, açık işler aynı MD dosyasında tutulur. Yeni branch için kullanıcı onayı şarttır.
