# UK SEO content plan — 21 November 2026

## Starting point

Search Console's latest available baseline showed no measurable impressions or clicks yet. That means query demand, UK rankings and conversion potential have not been verified for this site. The query ideas below are hypotheses based on the service and visible search intent, not keyword-volume claims.

The site already has destination and booking pages. Supporting guides should answer travel-planning questions, then link naturally to the matching route and booking flow. A blog is useful only when each page helps a traveller make a decision; publishing many near-identical pages for SEO would add little value.

## What experienced SEO teams do from a cold start

1. **Build a small topic map around the service.** Separate booking intent (airport transfer to a destination) from research intent (bus, taxi, stops, baggage, late arrival). Route pages serve the first group; guides answer the second.
2. **Study the search results and real customer questions.** Look at the formats and details Google already surfaces; use Search Console queries once impressions begin. Do not treat a competitor's fare, journey time or promise as verified for DalamanWay.
3. **Publish genuinely useful pages with evidence.** Include who the page helps, checked/updated dates, official references, practical decision points and information that is not obvious from a generic rewrite. Keep facts current.
4. **Link the journey through the site.** Home or destination page → guide → route/vehicle information → booking request. Use descriptive links and give a reader a next step that matches their question.
5. **Earn relevant mentions.** Offer accurate visitor information to UK travel publishers, accommodation providers, local tourism pages and travel-planning communities. Ask for editorial inclusion when useful; avoid paid or automated backlink schemes.
6. **Measure the right outcomes.** Track UK impressions, clicks, CTR and average position by query and page in Search Console. Track qualified booking starts/submissions separately in analytics. Review after enough data accrues; do not promise a position or traffic increase.

Google's own guidance prioritises helpful, reliable, original, people-first content, and recommends clear page titles and crawlable descriptive links. It cautions against making content primarily to manipulate rankings or mass-producing pages without added value.

**SERP/competitor review:** GET4S and intransfers both publish Dalaman destination guides; GET4S structures its guide around distance, transport choices, late arrivals and FAQs, then connects the reader to booking. This supports the usefulness of a practical comparison format. Their exact prices, travel times, and operational claims are competitor-specific and were not copied or treated as verified DalamanWay facts.

## First article implemented

**URL:** `/guides/dalaman-airport-to-marmaris`

**Title:** “Dalaman Airport to Marmaris: Bus, Taxi or Private Transfer?”

**Reader intent:** A UK visitor arriving at Dalaman who is deciding how to continue to Marmaris.

**Content included:** comparison of shuttle, taxi, private transfer and rental car; current-info checks; accommodation drop-off planning; flight-arrival checklist; FAQs; links to official airport/HAVAŞ/MUTTAŞ information; contextual links to Marmaris route, vehicles, FAQ and booking.

No fixed fare, journey duration, service guarantee or keyword-volume claim is made. The official airport says HAVAŞ and MUTTAŞ serve Dalaman Airport and Marmaris city centre, and directs passengers to the operators for current times/fares. The article asks readers to recheck those details before travel.

## Second article implemented

**URL:** `/guides/dalaman-airport-to-fethiye`

**Title:** “Dalaman Airport to Fethiye: Shuttle Stops and Your Final Journey”

**Reader intent:** A visitor deciding whether an airport shuttle will reach their Fethiye accommodation or whether they need an onward ride.

**Content included:** official MUTTAŞ route 48-25 details and named stops, HAVAŞ as an option to verify, Fethiye Otogar as the MUTTAŞ airport route endpoint, practical last-leg planning for Fethiye town, Göcek, Çalış and Ölüdeniz, a travel checklist and FAQs. It distinguishes the published direction-specific stops and directs readers to current operator pages.

No fare or fixed journey-time estimate is stated. The guide uses official operator and airport sources and tells visitors to recheck schedules, stops and payment details before travel. Production and staging builds, metadata, canonical, one-H1 output, homepage link and sitemap inclusion passed locally. Staging and production are now deployed and checked: staging is `noindex,nofollow` with no canonical and an empty sitemap; production is `index,follow` with the exact self-canonical URL and both guides in the homepage and sitemap. The Render rewrite serves the nested article path directly.

## Suggested next pages

Prioritise one at a time, after reviewing real Search Console questions and business facts:

1. Dalaman Airport to Ölüdeniz: planning the last leg from Fethiye or other connection points.
2. How to choose an airport transfer vehicle for passengers and luggage — only using the verified live fleet capacity.
3. Late-night or delayed arrival planning at Dalaman Airport — only after pickup, waiting and contingency policies are confirmed by the operator.
4. Marmaris or İçmeler drop-off planning — only after exact service coverage and pickup/drop-off policy are confirmed.

Do not publish pages 3–5 until the underlying business details are verified. Avoid translating the guide mechanically for DE/RU; prepare native-quality versions with language-specific search intent and accurate local facts.

## Technical release checks

- The guide is registered in the React router and shared SEO metadata.
- Both guides are registered in the React router and shared SEO metadata.
- The homepage links to both guides in English, and the production sitemap generator includes both.
- Build-time prerendering emits each complete article in the first HTML response with one H1, title, description, canonical and production `index,follow`.
- Preview builds should remain `noindex,nofollow` and have no canonical.
- Render must serve each nested guide URL as its generated `/index.html` before the general app-shell rewrite. Verify each actual staging response before live publication.

## Release record — Fethiye guide

- Pull request #56 was merged on 21 November 2026.
- All 88 frontend tests passed; ESLint passed; production and staging builds passed.
- Staging route verified at `https://vip-transfer-dalaman-test.onrender.com/guides/dalaman-airport-to-fethiye` with `noindex,nofollow`, no canonical, one H1, and the expected shuttle content. The staging sitemap stayed empty.
- Production route verified at `https://dalamanway.com/guides/dalaman-airport-to-fethiye` with `index,follow`, a self-canonical, one H1, the booking link and the expected content. The production sitemap contains both guides, and the homepage links to both.
- Live Render deploy: `dep-dc0h0dec6qcc73eb61og`.

## Sources

- Google, helpful and reliable people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- YDA Dalaman Airport, public transport: https://www.dalamanairport.aero/en/passengers/public-transport/
- DHMİ Dalaman Airport, transport: https://www.dhmi.gov.tr/Sayfalar/Havalimani/Dalaman/Ulasim.aspx
- HAVAŞ services: https://www.havas.net/otobus-hizmetleri
- MUTTAŞ airport services: https://www.muttas.com.tr/sayfa/havalimani-seferleri
- Render redirects and rewrites: https://render.com/docs/redirects-rewrites
