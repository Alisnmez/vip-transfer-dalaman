# SEO content plan — 21 November 2026

## Starting point

Search Console's latest available baseline showed no measurable impressions or clicks yet. That means query demand, UK rankings and conversion potential have not been verified for this site. The query ideas below are hypotheses based on the service and visible search intent, not keyword-volume claims.

The site already has destination and booking pages. Supporting guides should help visitors imagine what to do in the region, then link naturally to the matching private-transfer route and booking flow. Use a clearly labelled **Travel Guides** section rather than a generic blog. Do not compare or promote buses, shuttles, taxis or competing transport operators in these guides.

## What experienced SEO teams do from a cold start

1. **Build a small topic map around the service.** Route pages serve booking intent. Travel guides answer destination-planning intent with original itineraries, heritage, coastal scenery and local character, then connect readers to the relevant private transfer.
2. **Study the search results and real customer questions.** Look at the formats and details Google already surfaces; use Search Console queries once impressions begin. Do not treat a competitor's fare, journey time or promise as verified for DalamanWay.
3. **Publish genuinely useful pages with evidence.** Include who the page helps, checked/updated dates, official references, practical decision points and information that is not obvious from a generic rewrite. Keep facts current.
4. **Link the journey through the site.** Home or destination page → guide → route/vehicle information → booking request. Use descriptive links and give a reader a next step that matches their question.
5. **Earn relevant mentions.** Offer accurate visitor information to UK travel publishers, accommodation providers, local tourism pages and travel-planning communities. Ask for editorial inclusion when useful; avoid paid or automated backlink schemes.
6. **Measure the right outcomes.** Track UK impressions, clicks, CTR and average position by query and page in Search Console. Track qualified booking starts/submissions separately in analytics. Review after enough data accrues; do not promise a position or traffic increase.

Google's own guidance prioritises helpful, reliable, original, people-first content, and recommends clear page titles and crawlable descriptive links. It cautions against making content primarily to manipulate rankings or mass-producing pages without added value.

**Content direction:** destination inspiration is the chosen editorial strategy. The guides use official Turkish tourism and museum sources for historical/site facts, add a practical original day-plan angle, and lead to DalamanWay's private-transfer routes. Search demand and booking impact still need to be measured in Search Console and analytics; no traffic lift is assumed.

## Travel Guides hub and articles

**Hub:** `/guides` — linked from the desktop and mobile navigation and from the homepage. Each card explains a distinct trip idea and links to a detailed page.

1. **`/guides/dalaman-airport-to-marmaris` — Marmaris Old Town: Castle, Harbour and a Slower First Day.** A history-first first-day plan around the castle museum, old quarter and harbour.
2. **`/guides/dalaman-airport-to-fethiye` — Fethiye in One Day: Telmessos, Paspatur and the Harbour.** Connects Lycian heritage, the old bazaar quarter and the waterfront.
3. **`/guides/kayakoy-oludeniz-day-plan` — Kayaköy and Ölüdeniz: A Heritage-and-Coast Day from Fethiye.** Pairs the hillside archaeological settlement with the lagoon landscape.
4. **`/guides/dalyan-kaunos-iztuzu` — Dalyan, Kaunos and İztuzu: A Day of River Views and Ancient History.** Explains the river, former harbour city, rock tombs and protected coast.

The first two established URLs were retained so existing links and canonicals continue to work, while their article content and titles were changed to match the new destination-guide strategy. The new guides use official tourism and museum references, original itinerary suggestions, practical comfort/conservation notes and a contextual CTA to the matching DalamanWay private transfer route. There are no public-transport comparisons or shuttle-operator recommendations in the new guide content.

## Technical implementation and checks

- Guides are registered in the router and shared SEO metadata; the index and all four articles are included in sitemap generation.
- The Travel Guides link appears in desktop and mobile navigation. The homepage links to the hub; the hub links to every guide.
- Prerendering emits each full page in the first HTML response with a unique title/description, one H1, self-canonical and production `index,follow`.
- Staging builds remain `noindex,nofollow` without canonicals and an empty sitemap.
- Render needs explicit rewrites for `/guides` and each nested guide path to its generated `/index.html`, before the general app-shell fallback.
- Local verification: all 88 frontend tests passed, ESLint passed, and both production and staging builds passed. Staging and production UI verification is pending for this set of changes.

## Suggested next pages

Prioritise one at a time, after reviewing real Search Console questions and business facts:

1. Gocek's harbours and coastline: a day-plan built around the marina and nearby bays.
2. A family-friendly day in Sarigerme: beach time, shade and easy pacing, based on verified places and access.
3. Fethiye's wider heritage: a separate guide to ancient sites such as Tlos or Pınara, with current official visitor details.

Avoid translating mechanically for DE/RU; prepare language-specific versions only when the underlying editorial review can ensure natural language and accurate local facts.

## Sources

- Google, helpful and reliable people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- GoTürkiye, Marmaris: https://goturkiye.com/digitalnomads/discover-and-work-from-marmaris
- Turkish Museums, Marmaris Museum and Castle: https://muze.gov.tr/muze-detay?DistId=MRK&SectionId=MRM01
- GoTürkiye, Telmessos: https://goturkiye.com/fethiye/telmessos
- GoTürkiye, Ölüdeniz: https://goturkiye.com/tr/fethiye/oludeniz
- Turkish Museums, Kayaköy archaeological site: https://muze.gov.tr/muze-detay?DistId=KYK&SectionId=KYK02
- Turkish Museums, Kaunos archaeological site: https://muze.gov.tr/muze-detay?DistId=KAU&SectionId=KAU02
- GoTürkiye, Caretta caretta season route: https://goturkiye.com/routes/2-day-caretta-caretta-hatching-season-route
- Render redirects and rewrites: https://render.com/docs/redirects-rewrites
