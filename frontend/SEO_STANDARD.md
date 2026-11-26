# DalamanWay — Merkezi SEO yönetim ve araştırma dosyası

26 Kasım 2026 — Birleştirme kaydı. Bu belge ana SEO çalışma kaydıdır. Aşağıdaki tarihsel kaynaklar aynen korunmuştur; eski durum, tahmin ve görevler güncel canlı doğrulama sayılmaz. Çelişkilerde yeni tarihli doğrulanmış kanıt esas alınmalı; yayın veya silme bu işlem kapsamında değildir. Göreli kaynak bağlantıları eski konumlarına göre yazılmış olabilir.

## Ayrıntılı SEO çalışma listesi — 26 Kasım 2026

**Takip kuralı (26 Kasım):** Her V2 maddesinin altında tarih, kısa geliştirme, commit, test sonucu ve ortam (geliştiriliyor / test sunucusunda / canlıda) tutulur. Canlıya alınan geliştirme kapatılır; maddeye ait kalan denetim veya ölçüm varsa ayrı açık alt görev olarak belirtilir. Araştırma görevleri kanıt ve kabul ölçütüyle kapanır. Canlı dağıtım için kullanıcı onayı gerekir. Küçük paketlerle ilerle: madde bazında değişiklik, CI, test sunucusu doğrulaması, kullanıcı onayı, canlı dağıtım ve canlı doğrulama. Ücretli araç satın alınmaz; ücretsiz kaynaklar önceliklidir.

Önceki planda 13 SEO kodu, V2 planında 17 görev kodu vardır. Bazı kodlar aynı işi farklı tarihlerde ele alır. Aşağıdaki 17 satır V2 uygulama listesidir. Sonraki 10 başlık yönetim özetidir. 25 Kasım tarihli kabul ölçütleri ve özgün araştırmalar aşağıda korunur.

1. **V2-SEO-01 UK rakip ön araştırması — önceki sohbet kaynak listesi kaydedildi; tam SERP analizi ayrı.**
   - Ön araştırma kaynakları kayıtlı. Güncel ilk 10 karşılaştırması 05’te.

2. **V2-SEO-02 DE/RU rakip ön araştırması — kaynak adayları kaydedildi.**
   - DE/RU kaynak adayları kayıtlı. Pazar bazında performansı ayrıca ölç.

3. **V2-SEO-03 Üç dilde aday anahtar kelimeler — sayfa niyetine göre ayrıldı; hacim doğrulanmadı.**
   - Üç dil için adaylar ayrıldı. Hacim ölçümü 04’te.

4. **V2-SEO-04 Gerçek hacim ve rekabet ölçümü — veri erişimi bekleniyor.**
   - **26 Kasım 2026 | Araştırma yapıldı, yayın gerektirmeyen dokümantasyon hazırlığı:** Ahrefs bağlantısı doğrulandı. API abonelik bilgisi `Free, billed monthly`; workspace API birim limiti `0`. `keywords-explorer-overview` ile GB için `dalaman airport transfer` ve `dalaman airport to marmaris transfer` sorgularının hacim/KD/CPC ölçümü denendi, **Insufficient plan** hatası döndü. Dolayısıyla UK/DE/RU için **doğrulanmış hacim, KD ve CPC yoktur**; sayı tahmin edilmez. Ahrefs bağlantısı tek başına veri yetkisi anlamına gelmez. Ahrefs erişimi veya eşdeğer güvenilir ölçüm kaynağı sağlanınca 04 tamamlanacak.
   - **Ölçüm protokolü:** Önce GB (ülke GB), sonra DE ve RU. Kaynak ve erişim tarihi, arama terimi, arama dili, ülke, son 12 ay ortalama aylık arama hacmi, mümkünse ay bazında sezon dağılımı, Ahrefs KD (organik), CPC (reklam; USD), kullanıcı niyeti, hedef URL ve mevcut GSC gösterimi kaydedilecek. GSC gösterimi piyasa arama hacmi değildir. Google Ads reklam rekabeti organik KD yerine kullanılmaz. Veri yoksa **veri yok** yazılır.
   - **İlk UK sorgu kümesi (ticari niyet):** `dalaman airport transfers`, `dalaman airport private transfer`, `dalaman airport transfer prices`, `dalaman airport to marmaris transfer`, `dalaman to fethiye transfer`, `dalaman to oludeniz transfer`, `dalaman to dalyan transfer`, `dalaman to gocek transfer`, `dalaman to icmeler transfer`. Bilgi niyeti ayrı: `airport for fethiye`, `oludeniz airport`. Sorguların ilgili rota URL'lerine eşleşmesi 03'teki mevcut haritayla kontrol edilecek; doğrulanmadan yeni rota yayınlanmayacak.
   - **DE/RU sonraki adım:** Var olan gerçek çevirilerden arama ifadesi adayları çıkar, ülke bazlı ölç. Otomatik tercümeyi kanıtlanmış anahtar kelime hacmi olarak sayma. Rusya pazarına yönelik erişim/araç kapsamı sınırlıysa bunu açıkça not et.
   - **Kabul ve kapanış kriteri:** Üç hedef ülkede en az birer ölçülmüş sorgu kümesi; tarihlenmiş kaynağı, hacmi, rekabet metriği, niyet ve hedef URL'si; sıralama için ilk üç uygulanabilir fırsat. **Durum: AÇIK / ölçüm erişimi bekleniyor. Test sunucusu: uygulanmaz (araştırma). Canlı: uygulanmaz (araştırma).**

5. **V2-SEO-05 UK ilk 10 organik sonuç analizi.**
   - Bekliyor. Önce Marmaris’te UK ilk 10 organik sonucu tarih ve cihazla kaydet; fiyat, karşılama, güven ve rezervasyon akışını karşılaştır.

6. **V2-SEO-06 Güncel GSC başlangıç ölçümü.**
   - Kısmi. 18–24 Kasım UK 64 gösterim, 0 tıklama. UK + rota + sorgu ve cihaz kırılımını tamamla; TR/LT’yi dışarıda tut.
   - 26 Kasım GSC açık raporu, 18–24 Kasım, web, GB/DE/US filtresi: GB 64 gösterim, konum 61,4; DE 4, konum 45,8; US 1, konum 47,0; toplam 69, konum 60,3, tıklama 0. RU bu filtrede yok.

7. **V2-SEO-07 Canlı commit, indeksleme, canonical, sitemap, robots, hreflang.**
   - Kısmi. Ana sayfa indeksli, yeniden tarama talebi kabul edildi. Güncel sitemap listesini çıkarıp her URL’de HTTP, ilk HTML, canonical ve dil bağlantılarını denetle.
   - 26 Kasım — GSC sitemap son okuma 25 Kasım, başarılı, 34 keşfedilen URL. Ana sayfa indeksli, HTTP 200, tarama ve indeksleme izinli, Google canonical ana sayfa. 25 Kasım 17:50 UTC tarihli akıllı telefon Googlebot kaydında 33/41 kaynak yüklenemedi: Wikimedia Ölüdeniz görseli robots.txt engeli; diğer görseller, fontlar ve reviews API için diğer hata. Bu eski tarama güncel canlı hata kanıtı değildir. Yeni canlı URL testi ve kaynak HTTP doğrulaması açık; kod değişmedi.

8. **V2-SEO-08 Ana sayfa tam denetimi (metin kısmı yapıldı).**
   - Kısmi. Ana sayfa metni incelendi. Mobil görünüm, performans ve rezervasyona geçişi ölç.

9. **V2-SEO-09 Routes & Prices.**
   - Denetim açık. Rota, araç, tek/çift yön seçimi ve formdaki GBP fiyatının tutarlılığını doğrula.

10. **V2-SEO-10 Vehicles.**
   - Denetim açık. Yedi aracın görsellerini, açıklamalarını, kapasite ve bagaj bilgisini mobilde ve üç dilde kontrol et.

11. **V2-SEO-11 Marmaris pilotu.**
   - Kısmi. Marmaris fiyat ve karşılama güncellemesi canlı. UK verisini yayın öncesiyle karşılaştır.

12. **V2-SEO-12 Fethiye ve Ölüdeniz; diğer rotalar da envanterde.**
   - 26 Kasım — **Canlıda (geliştirme yayını tamamlandı):** Fethiye ve Ölüdeniz DLM ve otel bölgesi açıklamaları `02483ff`; `b5afe85` bu commit'in devamı (3 commit ileride, rota kodu değişmemiş). Render test ve üretim frontend dağıtımları başarılı. Üretim deploy `dep-dc413gjl550s73fslu80`, 11:02:46 UTC. GitHub CI üç grup başarılı. Açık alt görev: canlı URL/rezervasyon bağlantısı bağımsız kontrolü ve UK performans ölçümü (17).

13. **V2-SEO-13 Rehberler, services, reviews, FAQ, contact, booking/lookup, yasal sayfalar, tüm dil varyantları.**
   - Denetim açık. Rehberlerden ilgili rotaya bağlantıyı, destek sayfalarının doğruluğunu ve özel sayfaların noindex durumunu URL bazında kontrol et.

14. **V2-SEO-14 Backlink ve otorite.**
   - Bekliyor. Mevcut bağlantıları ölç, ilgili otel ve seyahat yayınlarını belirle; kazanılan yönlendirmeleri kaydet.
   - 26 Kasım Ahrefs Free dashboard (project 10771467): DR 0, referring domains 304, tahmini organik trafik ve tespit edilen organik kelime 0; Health Score henüz taranmamış. Alan adlarının kalitesi doğrulanmadı; spam veya kazanılmış kaliteli backlink olarak sınıflandırma. Referring domains raporu ve GSC Links karşılaştırması açık.

15. **V2-SEO-15 EN/DE/RU metin ve bağlantılar.**
   - Denetim açık. İngilizce, Almanca ve Rusça karşılıkların metinlerini ve karşılıklı bağlantılarını rota bazında doğrula.

16. **V2-SEO-16 Onay, mevcut uygun branch, lint/unit/build/browser smoke, staging ve kontrollü canlı doğrulama.**
   - 26 Kasım — PR #78, dört CI grubu başarılı (build, booking smoke, comprehensive quality gate, dependency security). Merge `0e3d7518c5750724af859094c931c23fa5f0a2d8`; staging `dep-dc41cf0473hc738usf40` canlı 11:21:49 UTC; production `dep-dc41flqjnfac73b7fsog` canlı 11:28:40 UTC. Yalnız SEO_STANDARD.md değişti. Yayın tamamlandı; bağımsız URL denetimi açık.
   - 26 Kasım — `b5afe85` test ve canlı frontend dağıtımı başarılı. Frontend lint/test/build, backend PostgreSQL ve booking browser smoke başarılı (Actions 45806561261 ve 45806561313). Canlı URL bağımsız kontrolü henüz yapılmadı. Her yayın için tekrarlanır.

17. **V2-SEO-17 7/28 günlük ölçüm ve 30/60/90 gün hedef değerlendirmesi.**
   - Bekliyor. Eşit dönemlerde UK sorgu ve sayfa sonuçlarını ve organik rezervasyonları karşılaştır; 30/60/90 gün hedeflerini gerçekleşen değerlerle değerlendir.

## 26 Kasım 2026 — Yönetim özeti (10 başlık)

24 Kasım planındaki **10 ana madde** aynı sırayla izlenir. **1 tamamlandı, 7 kısmen tamamlandı, 2 bekliyor.** Arşivde tekrarlanan listeler bu sayıya eklenmez.

1. **Plan ve çalışma dalı — Tamamlandı**
   - Yapılan ve yöntem: Çalışma kaydı bu dosyada birleştirildi. Aktif dal `feature/booking-integration`. Branch temizliği ayrı iş olarak izleniyor.
   - Sonraki adım: Her SEO değişikliğinin tarihini, ilgili URL’yi ve doğrulamasını bu listeye ekle.

2. **Teknik SEO ve indeksleme — Kısmen tamamlandı**
   - Yapılan ve yöntem: 96×96 PNG favicon canlıda. Search Console ana sayfanın dizinde olduğunu gösterdi ve 26 Kasım’da yeniden tarama talebini kabul etti.
   - Sonraki adım: Canlı sitemap URL’lerinde HTTP 200, canonical, hreflang ve ilk HTML’i kontrol et. Özel sayfaların sitemap dışında ve noindex olduğunu doğrula. Mobil LCP, INP ve CLS sonuçlarını veri varsa kaydet.

3. **Hedef pazar başlangıç ölçümü — Kısmen tamamlandı**
   - Yapılan ve yöntem: 18–24 Kasım GSC ülke verisi kaydedildi. Türkiye ve Litvanya hariç 69 gösterim ve 0 tıklama. İngiltere 64 gösterim, 0 tıklama, konum 61,4.
   - Sonraki adım: Aynı tarih aralığı için İngiltere + rota URL’si filtreleriyle sorgu ve cihaz kırılımlarını kaydet. Almanya ve Rusya’yı ayrı izle.

4. **İngiltere rakip karşılaştırması — Kısmen tamamlandı**
   - Yapılan ve yöntem: Önceki araştırmada rakiplerin rota fiyatları, buluşma açıklamaları ve güven unsurları karşılaştırıldı. Araştırma bu dosyanın arşivinde.
   - Sonraki adım: Marmaris için İngiltere arama sonuçlarından güncel bir örneklem al. Sorguyu, tarihi ve örnek URL’leri kaydet. Yolcunun hangi sorularına daha iyi yanıt verdiklerini belirle.

5. **Rota sayfalarını iyileştirme — Kısmen tamamlandı**
   - Yapılan ve yöntem: Marmaris ücret ve karşılama güncellemesi 25 Kasım’da canlıya çıktı. Fethiye ve Ölüdeniz için DLM ve otel bölgesi açıklamaları 26 Kasım’da test sunucusuna alındı (`02483ff`).
   - Sonraki adım: Fethiye ve Ölüdeniz metinlerini mobilde kontrol et. Test ve onay sonrası yayınla. Sonraki rota için Dalyan’ın İngiltere verisini incele.

6. **Ana sayfa, güven ve rezervasyon — Kısmen tamamlandı**
   - Yapılan ve yöntem: Transfer adımları ve rezervasyon yönetimi yayında. Referans, e-posta ve 24 saat politikası müşteri ekranında kontrol edildi.
   - Sonraki adım: Mobilde rota seçiminden talep onayına kadar akışı test verisiyle dene. E-posta ve admin kaydını doğrula. Yalnız doğrulanmış olanakları ve iletişim bilgilerini kullan.

7. **Rehberler ve iç bağlantılar — Kısmen tamamlandı**
   - Yapılan ve yöntem: Sitede seyahat rehberleri ve ana sayfadan rehberlere erişim bulunuyor.
   - Sonraki adım: Her İngilizce rehber için ilgili rota bağlantısını ve rezervasyondaki hedef seçimini kontrol et. Aynı soruyu tekrarlayan içerikleri belirle.

8. **İşletme görünürlüğü ve turizm ortaklıkları — Bekliyor**
   - Yapılan ve yöntem: Önceki araştırmada aday kanallar belirlendi. Doğrulanmış yeni ortaklık veya kazanılmış bağlantı kaydı bulunmuyor.
   - Sonraki adım: Uygun işletme profillerini ve ilgili otel/turizm ortaklarını listele. Kazanılan bağlantının URL’sini ve yönlendirdiği sayfayı kaydet.

9. **Organik rezervasyon ve dönem karşılaştırması — Bekliyor**
   - Yapılan ve yöntem: Search Console başlangıç değerleri var. Organik ziyaretin rezervasyona dönüşümünü gösteren doğrulanmış ölçüm henüz yok.
   - Sonraki adım: Kişisel veri göndermeden rota→rezervasyon başlangıcı→başarılı talep olaylarını doğrula. Aynı filtrelerle 7 ve 28 günlük değişimi izle; 30/60/90 günde sonuçları değerlendir.

10. **Test, yayın onayı ve canlı kontrol — Kısmen tamamlandı**
   - Yapılan ve yöntem: Son rota içerikleri test ortamında. Arayüz kontrolü başarılı olarak kaydedildi.
   - Sonraki adım: Son sürümün tarayıcı testini doğrula, kullanıcı onayı al, yayınlanan URL’nin ilk HTML’ini ve rezervasyon bağlantısını kontrol edip sonucu buraya yaz.

## Kaynak dizini

- [frontend/SEO_STANDARD.md (feature/booking-integration)](https://github.com/Alisnmez/vip-transfer-dalaman/blob/feature/booking-integration/frontend/SEO_STANDARD.md)
- [docs/SEO_FOUR_MARKETS_RESEARCH_2026-11-19.md (feature/booking-integration)](https://github.com/Alisnmez/vip-transfer-dalaman/blob/feature/booking-integration/docs/SEO_FOUR_MARKETS_RESEARCH_2026-11-19.md)
- [docs/UK_SEO_CONTENT_PLAN_2026-11-21.md (feature/booking-integration)](https://github.com/Alisnmez/vip-transfer-dalaman/blob/feature/booking-integration/docs/UK_SEO_CONTENT_PLAN_2026-11-21.md)
- [docs/UK_SEO_CONTENT_PLAN_2026-11-21.md (codex/uk-seo-fethiye-guide-20261121)](https://github.com/Alisnmez/vip-transfer-dalaman/blob/codex/uk-seo-fethiye-guide-20261121/docs/UK_SEO_CONTENT_PLAN_2026-11-21.md)
- [docs/DALAMANWAY_UK_COMPETITOR_DEEP_RESEARCH.md (feature/booking-integration)](https://github.com/Alisnmez/vip-transfer-dalaman/blob/feature/booking-integration/docs/DALAMANWAY_UK_COMPETITOR_DEEP_RESEARCH.md)
- [docs/BRANCH_WORKFLOW_HANDOFF_2026-11-21.md (feature/booking-integration)](https://github.com/Alisnmez/vip-transfer-dalaman/blob/feature/booking-integration/docs/BRANCH_WORKFLOW_HANDOFF_2026-11-21.md)

---

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


## 2026-11-24 — SEO v2: UK-first, canlı ana sayfa denetimi ve ilerleme kaydı

Bu bölüm önceki uygulama sırasını günceller; tarihsel kayıtlar korunur. V2 görev kodları önceki SEO kodlarıyla karışmaması için V2-SEO öneki taşır. Branch temizliği başka çalışma tarafından yürütülüyor; bu branch aktif dokümantasyon çalışmasıdır, silinmeden önce içeriği korunmalıdır. Yeni branch açma, merge veya silme yok. Performans çalışması şimdilik ertelendi; belirgin sorun kanıtla kaydedilir.

### Pazar ve araştırma
UK birincil, DE ve RU ikincil; önerilen iş yükü 70/15/15, ölçülmüş pazar payı değildir. EN-GB, doğal DE/RU metinler, mevcut dil URL'leri ve hreflang korunur. UK ana sayfa: dalaman airport transfers, private dalaman airport transfers, VIP transfer; fiyat listesi: dalaman airport transfer prices; Marmaris: dalaman airport to marmaris transfer, private transfer dalaman to marmaris, dalaman to marmaris transfer cost; Fethiye ve Oludeniz sonraki pilotlar. DE: Flughafentransfer Dalaman, Privattransfer, Transfer Dalaman Marmaris/Fethiye/Ölüdeniz, Preise. RU: трансфер из аэропорта Даламан, индивидуальный трансфер, Даламан Мармарис/Фетхие/Олюдениз, цена. Rusça kitle ile Rusya coğrafyası ayrı; Yandex araştırılacak.

Ön araştırma notları (önceki sohbetten aktarım; fiyatlar ve gerçek ülke SERP sırası yeniden doğrulanmalı):
- UK: https://www.transfersviadalaman.com/prices ; https://www.transferonly.com/ ; https://www.joytransfer.com/en/transfers ; https://www.dalamantravel.com/en/dalaman-airport-transfer ; https://www.holidayextras.com/dalaman-airport-transfers.html . Karşılaştırılacak fiyat/araç kapasitesi, süre, ödeme, karşılama, gecikme, iptal, güven. Kişi başı ve araç başı fiyatları karıştırma.
- DE: https://www.hieracitytravel.com/de/flughafentransfer/flughafen-dalaman/ ; https://privat-flughafentransfer.com/ziele/ ; https://dalamangotransfer.com/de/reiseziele .
- RU: https://www.dalamanairporttransfer.com/ru/blog/ceny-na-transfer-iz-aeroporta-dalaman-dalaman-transfer ; https://dalamangotransfer.com/ru ; https://www.pac.ru/fru/help/tour/services/private-transfer/tur-dlm/ ; https://vixride.com/ru/dalaman-to-fethiye-transfer .
- Arama hacmi, KD, backlink ve UK konumlu ilk 10 sıralaması doğrulanmadı; tahminleri ölçüm gibi sunma.

### Canlı ana sayfa — 24 Kasım tarayıcı metin denetimi
Canlı sekme title: Dalaman Airport Transfers | Private Airport Taxi & Transfers. H1: Professional Airport Transfers from Dalaman. Dört araçta iç/dış fotoğraf ve yedi olanak, araç bazlı booking bağlantıları; altı aşamalı transfer süreci, 24 saat önce WhatsApp teyidi, uçuş takibi, karşılama, müşteri galerisi, yorumlar, beş rehber, dört filtreli rota fiyat bağlantısı, footer ve dil seçimi mevcut. Önceki eksik olanak ve bağlantı iddiaları geri çekildi. Canlı commit, mobil/desktop görsel, buton işlevleri ve HTML metadata henüz doğrulanmadı. İçerik puanları öznel: navigasyon 85, hero 65, avantajlar 65, araçlar 90, süreç 92, galeri 90, rotalar 80, rehberler 85, yorumlar 85, footer 80.

- [ ] DW-HOME-001: EN/DE/RU H1, title ve meta araştırma sonrası doğrula. Aday EN H1: Dalaman Airport Transfers – Private & VIP; DE: Privater Flughafentransfer Dalaman – VIP-Service; RU: Индивидуальный VIP-трансфер из аэропорта Даламан. Mevcut güçlü title'ı ölçmeden değiştirme. GBP ve gerçek hizmet kapsamı; kesinleşmemiş rezervasyonu onaylanmış gibi sunma.
- [ ] DW-HOME-002: Professional Drivers açıklaması araç seçeneklerini anlatıyor; başlıkla uyumsuz. Aday kartlar Clear Transfer Prices, Flight Tracking, Private VIP Vehicles; doğal üç dilde metin. Doğrulanmamış sabit fiyat, ücretsiz iptal/bekleme, 24/7 destek iddiası yok.
- [ ] DW-HOME-003: /routes?destination=Marmaris#all-routes ve diğer mevcut fiyat bağlantıları korunacak; /routes/marmaris, fethiye, oludeniz, gocek SEO sayfalarına doğal doğrudan bağlantılar değerlendirilecek; DE/RU yerel URL'leri doğrulanacak.
- [ ] DW-HOME-004: /guides/dalaman-airport-to-marmaris ve fethiye URL'leri ile gezi başlıklarının arama niyeti uyumu incelenecek. Mevcut rehberleri silmeden transfer maliyeti, taksi karşılaştırması, aile/çocuk koltuğu ve gece varışı içeriklerini değerlendir; cannibalization kontrolü.
- Korunacak: araç olanakları, kapasiteler, GBP, rezervasyon ön doldurma, gerçek müşteri fotoğrafları/yorumları, transfer süreci, mevcut çok dilli altyapı. Kurumsal WhatsApp numarası onay olmadan eklenmez.

### V2 takip listesi
- [x] V2-SEO-01 UK rakip ön araştırması — önceki sohbet kaynak listesi kaydedildi; tam SERP analizi ayrı.
- [x] V2-SEO-02 DE/RU rakip ön araştırması — kaynak adayları kaydedildi.
- [x] V2-SEO-03 Üç dilde aday anahtar kelimeler — sayfa niyetine göre ayrıldı; hacim doğrulanmadı.
- [ ] V2-SEO-04 Gerçek hacim ve rekabet ölçümü.
- [ ] V2-SEO-05 UK ilk 10 organik sonuç analizi.
- [ ] V2-SEO-06 Güncel GSC başlangıç ölçümü.
- [ ] V2-SEO-07 Canlı commit, indeksleme, canonical, sitemap, robots, hreflang.
- [ ] V2-SEO-08 Ana sayfa tam denetimi (metin kısmı yapıldı).
- [ ] V2-SEO-09 Routes & Prices.
- [ ] V2-SEO-10 Vehicles.
- [ ] V2-SEO-11 Marmaris pilotu.
- [ ] V2-SEO-12 Fethiye ve Ölüdeniz; diğer rotalar da envanterde.
- [ ] V2-SEO-13 Rehberler, services, reviews, FAQ, contact, booking/lookup, yasal sayfalar, tüm dil varyantları.
- [ ] V2-SEO-14 Backlink ve otorite.
- [ ] V2-SEO-15 EN/DE/RU metin ve bağlantılar.
- [ ] V2-SEO-16 Onay, mevcut uygun branch, lint/unit/build/browser smoke, staging ve kontrollü canlı doğrulama.
- [ ] V2-SEO-17 7/28 günlük ölçüm ve 30/60/90 gün hedef değerlendirmesi.

### Tamamlama günlüğü (her görevde zorunlu)
Tarih | görev | durum | kanıt/sorun | çözüm ve dosyalar | test/sonuç | commit/yayın | kalan iş.
2026-11-24 | V2-SEO-01/02/03 | ön araştırma tamamlandı | önceki sohbet kaynak ve kelime adayları | bu MD'ye aktarıldı | doküman kaydı; bağımsız SERP/hacim testi yok | yalnız doküman | V2-SEO-04/05.
2026-11-24 | V2-SEO-08 | kısmi | canlı ana sayfa tarayıcı metni | yanlış eksik özellik iddiaları düzeltildi; DW-HOME-001–004 adayları kaydedildi | görsel/işlevsel test yapılmadı | yalnız doküman | canlı commit ve browser testleri.
Tamamlandı işareti sadece ilgili kabul ölçütü sağlanınca konur; araştırma ve uygulama ayrıdır. Her tamamlanan görevde aynı MD güncellenir; eski kayıtlar silinmez. Kullanıcı onayı olmadan uygulama kodu ve canlı ayarlar değiştirilmez.


### 2026-11-24 — GSC doğrudan tarayıcı kanıtı (V2-SEO-06/07 kısmi)
Kaynak: https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Adalamanway.com&country=gbr&time_granularity=DAY&num_of_days=28&breakdown=page . Açık sekme metnindeki grafik tarihleri 18–22 Kasım, UK, Web: 34 gösterim, 0 tıklama, %0 CTR, 62.7 konum. Sayfa tablosu Marmaris 21/68.3, Fethiye 4/50.5, home 3/62, Dalyan 1/42, Oludeniz 1/64, Icmeler 1/83. Sorgular (gösterim/konum): transfer from dalaman airport to marmaris 6/71.2; private transfer from dalaman airport to marmaris 4/68; dalaman to marmaris transfer 4/69; airport transfers dalaman to marmaris 3/68.3; airport transfer dalaman to fethiye 2/35; transfer from dalaman to marmaris 2/66.5; dalaman transfers 1/42; transfers dalaman airport 1/48; dalaman to marmaris transfer time 1/53. Ayrı 23–24 Kasım UK 24 saat görünümü 2 gösterim/0 tıklama/72 konum; airport for fethiye 2/72. Farklı dönemleri trend olarak kıyaslama. DE/RU ve eşit dönem dışa aktarımı bekliyor.
Ana sayfa URL denetimi: indexed, son tarama 21 Kasım 11:43:18, Googlebot smartphone, crawl/index allowed, fetch successful, declared canonical https://dalamanway.com/, Google-selected inspected URL, HTTPS. Taranan HTML title Dalaman Airport Transfers | Private Airport Taxi & Transfers; description Book private Dalaman Airport transfers to Marmaris, Fethiye, Oludeniz and more. Explore vehicles, routes and transparent GBP prices.; index,follow, Organization JSON-LD, og:locale en_GB. 24 Kasım canlı test HTTP 200, JS console mesaj yok. Genel indeks raporu veri işliyor. Bu bulgu tüm rotaların indekslendiğini kanıtlamaz.
- [ ] DW-TECH-001/P1: 24 Kasım 10:03:58 GMT canlı testte 5/34 kaynak yüklenemedi: Wikimedia Ölüdeniz görseli robots engeli, images.openai.com kaynaklı Ultra Sprinter dış/iç, Sprinter iç, Ultra VIP Vito iç görselleri diğer hata. Normal kullanıcıda bozuk oldukları kanıtlanmadı. Kullanım hakkı ve gerçek araçla uyum doğrulanınca aynı görselleri kendi domaininde sunmayı değerlendir; atıfları koru, staging ve Google canlı testte yeniden doğrula. Görsel erişilebilirliği, genel performans optimizasyonu değil.
2026-11-24 | V2-SEO-06/07 | kısmi | GSC açık sekme ve URL denetimi | UK baseline ve DW-TECH-001 kaydedildi | ana sayfa indeks/canonical/HTTP doğrulandı; 5 kaynak hatası açık | yalnız MD | DE/RU, sitemap, rota URL denetimleri, canlı commit ve çözüm testi bekliyor.


## 2026-11-25 — GSC güncellemesi ve Google Search Central sıralama stratejisi

### Doğrudan GSC kanıtı
Kaynak: https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Adalamanway.com&last_24_hours=true&time_granularity=HOUR&breakdown=query&country=gbr
25 Kasım sabahı açık tarayıcı sekmesi: UK, Web, 24–25 Kasım, son 24 saat, son güncelleme 4 saat önce. 26 gösterim, 0 tıklama, %0 CTR, 59.2 ortalama konum. Aşağıdaki 16 sorgu toplam 25 gösterim içerir; rapor toplamı 26'dır, sorgu tablosu toplamı ile mülk toplamı eşit olmak zorunda değildir.

| Sorgu | Gösterim | Konum |
| --- | ---: | ---: |
| dalaman airport transfers | 6 | 56.3 |
| transfer from dalaman airport | 2 | 56 |
| oludeniz airport | 2 | 59 |
| dalaman to oludeniz transfer | 2 | 71 |
| airport for fethiye | 2 | 72 |
| dalaman transfers | 1 | 16 |
| transfers from dalaman airport | 1 | 36 |
| dalaman airport taxi | 1 | 37 |
| transfers dalaman airport | 1 | 47 |
| fethiye to dalaman airport | 1 | 59 |
| dalaman airport transfer | 1 | 66 |
| taxi from dalaman airport to fethiye | 1 | 67 |
| dalaman to marmaris transfer | 1 | 72 |
| dalaman to marmaris transfers | 1 | 74 |
| dalaman taxi | 1 | 80 |
| airport transfer dalaman | 1 | 82 |

Tüm sorgularda 0 tıklama. Tek gösterimde 16. konum kalıcı sıralama değildir. 18–22 Kasım tüm ülkeler: 49 gösterim, 1 tıklama, %2 CTR, 60 konum; UK 34/0/62.7, TR 12/1/56, DE 3/0/44.7. UK günlük ortalama 6.8 ile son 24 saat 26 arasındaki fark yaklaşık 3.82 kat; farklı dönemler ve geçici veri nedeniyle sürdürülebilir trend kanıtı değildir. Eşit 7/28 günlük dönemlerle ölç.
Sitemap sekmesi: https://search.google.com/search-console/sitemaps?resource_id=sc-domain%3Adalamanway.com ; sitemap.xml başarılı, gönderim 21 Kasım, son okuma 23 Kasım, 34 keşfedilen sayfa. Genel bakışta 15 HTTPS, 0 HTTPS olmayan URL; indeks raporu veri işliyor, CWV verisi yok. Keşif indeksleme değildir.

### Resmi Google kaynaklarına dayalı çalışma standardı
- [Ranking systems](https://developers.google.com/search/docs/appearance/ranking-systems-guide): sayfa düzeyinde ve site genelinde sinyaller; PageRank dahil bağlantı analizi. Tek faktör veya sabit ağırlık varsayma.
- [Helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content): özgün, güvenilir, kullanıcı odaklı içerik; E-E-A-T tek başına sıralama faktörü değildir; zorunlu kelime sayısı yok.
- [SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) ve [Search Essentials](https://developers.google.com/search/docs/essentials): doğal dil, açıklayıcı başlıklar, erişilebilir içerik; her kelime varyasyonu için ayrı sayfa açma.
- [Spam policies](https://developers.google.com/search/docs/essentials/spam-policies): doorway, keyword stuffing, ölçekli düşük değerli içerik ve manipülatif link satın alma yok.
- [JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [crawlable links](https://developers.google.com/search/docs/crawling-indexing/links-crawlable), [localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions): ilk HTML ve hydration tutarlılığı, gerçek href bağlantıları, karşılıklı hreflang.
- [Recrawl](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl): sitemap ve URL denetimi sıralama garantisi değil; tekrar tekrar indeksleme isteme.

### Uygulama sırası (önceki V2 görevleriyle birlikte)
- [ ] V2-SEO-07 / P0: 34 sitemap URL'sini tek tek HTTP, canonical, robots, hreflang, ilk HTML ve GSC indeks durumu açısından doğrula. DW-TECH-001 görsel erişim sorunlarını kullanım hakları ve gerçek araç uyumu doğrulanarak yerel görsellerle çöz; staging ve canlı Google testi. Mobil performansı ölç, veri yoksa başarı iddia etme.
- [ ] V2-SEO-05/08/11/12 / P1: Ana sayfa, Marmaris, Fethiye, Ölüdeniz için UK SERP rakip karşılaştırması; sorgu-sayfa eşleşmesini GSC sayfa kırılımıyla doğrula. Ana sayfa hedefi dalaman airport transfers, dalaman transfers, transfers from dalaman airport, dalaman airport taxi (hizmetle uyumluysa). Rota sayfaları ilgili transfer sorguları; oludeniz airport ve airport for fethiye bilgilendirici rehber niyeti. Mevcut title'ı tek günlük veriyle değiştirme.
- [ ] V2-SEO-11/12 / P1: Her rota için doğrulanmış süre/mesafe, otel ve karşılama bilgisi, araç başına GBP tek/çift yön dinamik fiyat, gerçek kapasite ve bagaj, mevcut rezervasyon ön doldurma, doğru iptal/rötar/çocuk koltuğu bilgisi, tarafsız ulaşım karşılaştırması ve ilgili rehber bağlantıları. Yedi araç fiyat taslağı onaylanmadan canlıya alma. 59 destinasyon için toplu ince sayfa üretme.
- [ ] V2-SEO-13/15 / P1: Ana sayfa -> rota -> ilgili rehber ve rezervasyon; rehber -> ilgili rota; doğal EN-GB, DE/RU metin ve bağlantılar. Mevcut özellikleri koru.
- [ ] V2-SEO-14 / P1: Gerçek otel, villa, seyahat acentesi ve UK seyahat rehberi ortaklıkları; doğal editoryal bağlantılar, gerçek yorumlar, doğrulanmış işletme/izin/iletişim bilgileri. Backlink profili henüz ölçülmedi. WhatsApp Business onayı bekleniyor.
- [ ] V2-SEO-17 / P2: 7/28 günlük eşit dönemlerde ülke, sorgu, sayfa, cihaz, CTR, konum, indeks ve organik rezervasyonları izle. 30 günlük çalışma hedefi UK günlük 50–100 gösterim, 35–50 ortalama konum, 1+ ilk 10 sorgu, 1–3 günlük organik tıklama; 90 günlük hedef 150–400, 20–35, 5+, 5–15. Bunlar doğrulanmış tahmin veya garanti değil; sezon ve örneklemle yeniden değerlendir. İlk organik rezervasyon ticari başarı ölçütü.
- [ ] V2-SEO-16 / P0 yayın kapısı: mevcut branch kullan, kullanıcı onayı, lint/unit/build/browser smoke, staging, kontrollü yayın ve canlı doğrulama; uygulama kodu bu doküman güncellemesinde değişmedi.

### Tamamlama günlüğü
2026-11-25 | V2-SEO-06/07 | kısmi | doğrudan GSC tarayıcı raporları, 16 sorgu ve sitemap | frontend/SEO_STANDARD.md güncellendi | rapor metni doğrulandı; yeni HTTP, indeks URL denetimi, Lighthouse veya kod testi yapılmadı | yalnız dokümantasyon commit'i | eşit dönemler, sayfa kırılımı, DE/RU, 34 URL denetimi açık.
2026-11-25 | V2-SEO-05/11/14/17 | plan güncellendi | önceki sohbet Google resmi kaynak değerlendirmesi ve GSC sinyalleri | öncelikler, kabul ölçütleri, hedefler | yeni rakip SERP/backlink ölçümü veya uygulama testi yok | yalnız dokümantasyon | rakip denetimi ve uygulama bekliyor.


---

# Arşiv eki — frontend/SEO_STANDARD.md (feature/booking-integration)

Kaynak blob: `588f2994e21a0b8beaf3e78c5bb82ad6db08a464`. Tarihsel içerik, yeniden doğrulanmadı.

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


## 21 Kasım 2026 — SEO çalışma devri, PR #54 ve Work modu test/yayın talimatı

**Bu bölüm güncel çalışma notudur.** Önceki tarihli kayıtları silme veya yeni deploy yapılmış gibi yorumlama. Ayrıntılı branch envanteri ve çakışma önleme kuralları: `docs/BRANCH_WORKFLOW_HANDOFF_2026-11-21.md` (SEO branch'inde). İşe başlamadan önce GitHub HEAD'lerini, PR'ları ve Render servislerinin branch/deployed SHA değerlerini **yeniden kontrol et**.

### Gerçekleşen değişiklikler

- Çalışma dalı: `feature/seo-next-steps-20261121`, entegrasyon temeli `feature/booking-integration` (son kontrol edilen SHA `8e29062eee`). `main` ayrışmıştır; eski SEO dalları veya `main` körlemesine merge edilmez.
- Taslak PR: [#54 — SEO: read-only sitemap audit and branch handoff documentation](https://github.com/Alisnmez/vip-transfer-dalaman/pull/54). **Henüz merge edilmedi.**
- `frontend/scripts/audit-live-seo.mjs`: yalnızca GET ile sitemap'teki **28 benzersiz URL'yi** kontrol eder; her URL için HTTP 200, kendi tam URL'siyle eşleşen canonical ve noindex bulunmaması; ayrıca robots.txt HTTP 200, booking/admin noindex, iki geçersiz URL HTTP 404. JSON satırları ve toplam hata sayısı üretir. `SEO_AUDIT_ORIGIN` yalnızca onaylı DalamanWay HTTPS hostları olabilir. Script veri yazmaz, müşteri rezervasyonu göndermez.
- `.github/workflows/live-seo-audit.yml`: manuel, PR değişikliklerinde ve varsayılan branch'e alındığında haftalık planlı çalıştırma için yapılandırıldı. Node 22 `node --check` ve canlı salt-okunur audit çalıştırır. Haftalık zamanlamanın henüz etkin olduğu varsayılmamalıdır.
- `docs/BRANCH_WORKFLOW_HANDOFF_2026-11-21.md`: tüm görülen branch'ler, amaç sınıfları, açık PR'lar, riskler, güvenli çalışma protokolü ve yeni sohbet devri. Belgedeki SHA'lar tarihli snapshot'tır.
- Son test edilen PR commit'i: `d0aa7a22911844ef11e6b13894695b5fc3437173`. **Bu PR frontend runtime, rezervasyon API'si, veritabanı şeması veya canlı site içeriğini değiştirmez.**

### GitHub Actions kanıtı — 21 Kasım 2026

Aşağıdaki beş workflow `d0aa7a2` commit'inde **completed/success** olarak doğrulandı:

| Workflow | Run ID | Durum |
| --- | --- | --- |
| Dependency security audit | `44852316560` | success |
| Live SEO read-only audit | `44852316672` | success; Node syntax ve live GET audit adımları başarılı |
| Comprehensive release quality gate | `44852316568` | success |
| Booking browser smoke test | `44852316562` | success |
| Build checks | `44852316537` | success |

**Kanıt sınırı:** GitHub Actions sonucu doğrulandı; canlı audit'in tek tek URL JSON logları bu kayda kopyalanmadı. Gerekirse `44852316672` run'ının job loglarını açıp `summary`, `failures`, `sitemapUrlsChecked` alanlarını kaydet. Bu test, Google'ın indeksleme durumunu veya gerçek kullanıcı Core Web Vitals verisini ölçmez.

### Render ortamları — önce tekrar doğrula

- Test frontend: `srv-dbt0pg5g1s2s738efhd0`, `https://vip-transfer-dalaman-test.onrender.com`; son kontrolde `feature/booking-integration`, auto-deploy **yes**.
- Canlı frontend: `srv-dbuegc7f3r2c73ar68kg`, `https://dalamanway-prod.onrender.com` / özel alan adı `https://dalamanway.com`; son kontrolde `feature/booking-integration`, auto-deploy **no**.
- Test backend: `srv-dbt0pe7f3r2c73bjqfo0`; canlı backend: `srv-dbueg6mc6qcc73dh282g`. Bu SEO PR'ı için backend deploy gerekli değildir.
- **PR #54 kodu Render test/canlı frontend'e henüz dağıtılmadı.** Render servislerinin kaynak branch'i SEO çalışma dalı değildir. Sırf `trigger_deploy` çağırmak SEO branch'ini dağıtmaz; mevcut `feature/booking-integration` kaynak branch'ini yeniden dağıtabilir.

### Work modu — istenen sıradaki uygulama

1. GitHub'da PR #54 HEAD'ini ve beş workflow sonucunu yeniden doğrula. Branch/PR veya dosya çakışması varsa dur, diff'i incele. `main`, eski SEO dalları, açık diğer PR'lar ve müşteri verilerine dokunma.
2. Bu PR'ın **yalnızca audit script + workflow + iki Markdown belge** değişiklikleri taşıdığını doğrula. SEO_STANDARD bu kayıt nedeniyle dördüncü dosyadır. Audit scriptinin doğru 28 URL'yi kapsadığını loglardan teyit et. Staging domaini için `SEO_AUDIT_ORIGIN` çalıştırırken beklenen sitemap'in boş ve robots'un disallow olması nedeniyle production-audit scriptini aynen staging'e uygulama; staging için ayrı index/noindex ve route smoke kontrolü yap.
3. Test frontend'ini güncellemek için Render'ın branch ayarını izinsiz değiştirme. **Güvenli geçiş yöntemi seç:** PR #54'ü uygun onay ve başarılı CI sonrasında entegrasyon dalına merge etmek testin auto-deploy'unu tetikleyebilir; önce diğer açık PR'larla çakışma ve entegrasyonun güncel SHA'sını kontrol et. Alternatif olarak test servisinde geçici branch kullanacaksan eski branch, auto-deploy ve rewrite ayarlarını kaydet; geri dönüşü doğrula. Her iki yolda da müşteri rezervasyonu veya veritabanı migrasyonu başlatma.
4. Testte deploy edilen **gerçek commit SHA** ve Render deploy ID/status bilgisini kaydet. Frontend build, staging robots `Disallow: /`, boş staging sitemap, rota HTTP yanıtları, EN/DE/RU ilk HTML, canonical/hreflang, booking/admin noindex, yanlış rota 404, mobil görünüm ve rezervasyon sayfasına yönlendirmeyi sentetik/veri yazmayan testlerle doğrula.
5. **Yalnızca test dağıtımı ve tüm smoke kontrolleri başarılıysa** canlı frontend'e kontrollü deploy yap. Canlı frontend'in kaynak branch'i ve deploy commit'i beklenen sürümle eşleşmeli; auto-deploy ayarını değiştirme. Üretim DB/backend deploy etme. Ardından 28 sitemap URL'sini, robots, canonical, hreflang, noindex, 404 ve temel rezervasyon navigasyonunu salt-okunur kontrol et. Hata varsa geri dönüş planını uygula.
6. Test ve canlı için her aşamayı `docs/EKSIKLERIMIZ.md` ve bu SEO standardına **gerçek deploy ID, commit, test sonucu, tarih** ile ekle. Başarısız veya atlanmış testleri başarılı olarak işaretleme. Kullanıcının test başarılıysa canlıya alma talebi vardır; yeni/öngörülmeyen kapsam değişikliği veya risk oluşursa ayrıca onay iste.

### SEO iş listesi — deploy sonrasında

- Google Search Console'da yeni site için 21 Kasım performans CSV'leri boştu; trafik/CTR/sıralama sayısı uydurma. Sitemap keşfi, Google indeksleme ve organik gösterimler ayrı kavramlardır.
- İlk indeksleme kontrolleri: ana sayfa ve EN Marmaris/Göcek dizinde; diğer rota varyantları 19 Kasım denetiminde henüz dizinde değildi. Güncel URL denetim raporları gelmeden durum değişti varsayma.
- Ülke bazlı UK/DE/RU sorgu ve sayfa analizi için veri oluşmasını bekle. O sırada doğrulanmış operasyonel bilgileri içeren özgün rota içeriği, internal linking, mobil performans ve Google'ın seçtiği canonical üzerinde çalış. Fiyat, süre, izin, yorum ve garanti uydurma.
- Yeni SEO içerik kodu yazılacaksa ayrı ve küçük PR aç; bu audit PR'ıyla kapsamı karıştırma. Mevcut tasarım, yorum kartları ve rezervasyon akışını koru.


---

# Arşiv eki — docs/SEO_FOUR_MARKETS_RESEARCH_2026-11-19.md (feature/booking-integration)

Kaynak blob: `9c8900ae3114ac555da7c6ac688adfa4c141b711`. Tarihsel içerik, yeniden doğrulanmadı.

# DalamanWay — 4-Pazar SEO Araştırması ve Uygulama Eki

Tarih: 2026-11-19 | Durum: Araştırma ve uygulama talimatı; canlıya alınmadı.

> Mevcut SEO MD dosyasının konumu henüz doğrulanamadı. Bu belge mevcut planı **değiştirmez**; UK SEO araştırma tablosundaki rota/içerik ilkeleri ve mevcut frontend SEO scriptleri esas alınarak hazırlanmış tamamlayıcı bir uygulama ekidir. Arama hacmi, rekabet puanı veya sıralama garantisi uydurulmamıştır. Uygulamadan önce mevcut ana SEO MD ile karşılaştır.

## DEVİR TESLİM / YENİ SOHBET İÇİN ÖNCE BURAYI OKU

**Bu bölüm gelecekteki bir ChatGPT/Work oturumunun projeyi güvenli şekilde devralması içindir.** Bu dosyayı okumak, önceki işlerin doğrulandığı anlamına gelmez. Önce GitHub'ın güncel branch/commit/PR/CI durumunu sorgula; aşağıdaki snapshot tarihsel kayıttır.

### Son bilinen durum (2026-11-19)
- **Repo:** `Alisnmez/vip-transfer-dalaman`.
- **Production:** `https://dalamanway.com`, Render frontend `srv-dbuegc7f3r2c73ar68kg`, backend `srv-dbueg6mc6qcc73dh282g`; son doğrulanan production SHA `4d150336313dddfd78c45b1a261fc0fbdd91e223`. Bu SEO branch'i production'a dağıtılmadı.
- **Production deploy branch:** `feature/booking-integration`. `main` çok geride/farklıdır; **main'e körlemesine merge yapma**.
- **SEO geliştirme branch'i:** `feature/seo-audit-checks-20261119`. **Bu belgeyi içeren commit:** `4f733d5`. İlk araştırma/test branch'i `research/international-seo-four-markets-20261119`.
- **PR'ler:** #17 araştırma branch'inden `feature/booking-integration` hedefine; #18 SEO audit branch'inden araştırma branch'ine açıldı. Her ikisinin güncel merge/CI durumu yeniden sorgulanmalı. Paralel Work Mode başka değişiklikler yapıyor olabilir.
- **Son tamamlanan kodlama görevi:** SEO-04 (Open Graph/Twitter metadata). **Sonraki plan görevi:** SEO-05 (canlı HTTP/indexability audit). **Önceki görevlerden açık kalite kapısı:** SEO-02, SEO-03, SEO-04'ün **güncel HEAD SHA** üzerinde CI/test/build/staging doğrulaması.
- **Test kanıtı:** `0c074ec` SHA'sı için dört GitHub Actions workflow'u `success` görüldü; bu, sonraki commitleri kapsamaz. `5424274`, `0b57e68`, `aa9828e` ve bu belge commit'i için tüm kontrollerin geçtiği iddia edilmez.
- **Ana SEO MD belirsizliği:** Bu dosya tamamlayıcı belgedir; eski/ana SEO MD'nin konumu kesinleşmedi. Bulunursa mevcut notları silmeden karşılaştır ve ilişkilendir.

### Yeni oturumun yapacağı kesin sıra
1. **Oku:** Bu bölüm + aşağıdaki SEO-01…SEO-13 tablosu ve teknik kayıtlar. Sonra ilgili script ve test dosyalarını incele; tabloyu körü körüne doğru kabul etme.
2. **GitHub doğrula:** production branch HEAD, çalışma branch HEAD, #17/#18, Work Mode değişiklikleri, commit SHA'larına ait Actions job/step/log sonuçları. Başka sohbetin yazdığı dosyayı üzerine ezme; en son SHA ile oku ve optimistic concurrency (blob SHA) kullan.
3. **Kalite kapısı:** `frontend/package.json` içindeki `lint`, `test`, `build` komutları ile browser smoke ve staging HTML/robots/sitemap kontrolünü çalıştır veya sonuçlarını kanıtla. Çalıştıramıyorsan açıkça `TEST BEKLİYOR` yaz; başka SHA'nın sonucunu aktararak `geçti` deme.
4. **SEO-05:** Gerçek production HTTP durum kodları, canonical, robots meta, sitemap ve yönlendirmeleri ölç; bulguları URL + beklenen/gerçek + tarih + kanıt olarak SEO-05'e ekle. Mevcut booking akışını değiştirme.
5. **SEO-06 ve sonrası:** Önce React router/i18n yapısını incele. Dört dil URL'leri, hreflang ve içerikleri tek seferde değil küçük PR'larla ilerlet. Yarım çeviri URL'lerini indexleme.
6. **Her kod adımında:** Değiştirilen dosyalar ve URL'ler, yaklaşım/neden, commit SHA, test komutu ve sonucu, açık sorun, bir sonraki küçük adım bu dosyaya eklenir. Aynı maddede tarihli `İlerleme kaydı` ekle; geçmişi silme.
7. **Deploy:** Kullanıcının daha önce belirttiği güvenli yayın beklentisine uy: güncel HEAD CI + staging + booking smoke geçmeden ve production etkisi kontrol edilmeden yayınlama. Auto-deploy ayarını doğrula; GitHub'a push otomatik deploy tetikleyebilir.

### Çakışma ve yanlış devam etmeyi önleme protokolü
- **Tek doğruluk kaynağı:** Bu dosyadaki görev kimlikleri + GitHub'ın güncel SHA/PR/CI kayıtları; eski sohbet metni tek başına yeterli değil.
- **Yazma yöntemi:** Dosyanın güncel blob SHA'sını al; yalnızca ilgili görev satırını ve tarihli ilerleme kaydını güncelle; diğer maddeleri ve önceki kayıtları aynen koru. SHA çakışırsa yeniden oku, iki değişikliği birleştir, tekrar dene. Dosyayı eski kopyayla komple overwrite etme.
- **İş paylaşımı:** Work Mode test yapıyorsa aynı kodu eşzamanlı değiştirme; PR diff'lerini karşılaştır. Ayrı branch'leri doğrulama olmadan birleştirme.
- **Durum disiplini:** `KODLANDI` ≠ `TEST GEÇTİ` ≠ `CANLIDA DOĞRULANDI`. Bir sonraki görev planlanmış olsa da açık test blokajlarını atlama.
- **Sonraki oturuma tek cümlelik devir:** “SEO-04 kodlandı; SEO-02/03/04 için güncel branch testleri açık; önce GitHub/Work değişikliklerini ve CI'yi doğrula, ardından SEO-05 production HTTP denetimine geç; hiçbir SEO değişikliği henüz canlıya alınmadı.”

---

## Doğrulanan mevcut durum
- `frontend/scripts/generate-seo.mjs`: üretim domain'i `VITE_PUBLIC_SITE_URL` ile tanımlandığında sitemap ve robots.txt üretir; diğer ortamlarda indekslemeyi kapatır.
- `frontend/scripts/prerender-routes.mjs`: İngilizce rota ve landing HTML üretir; Almanca/Rusça/Türkçe ayrı statik HTML, dil bazlı canonical ve hreflang üretimi görünmüyor.
- `frontend/index.html` kaynak şablonunda `noindex,nofollow` var; production build çıktısında bu etiketin doğru değiştirildiği, Render ortam değişkenleri ve HTTP yanıtları ayrıca doğrulanmalı.
- UK araştırma dosyası: `Dalaman_UK_SEO_Domain_Research.xlsx`; özgün güzergâh bilgisi, fiyat/doğruluk, kapasite, uçuş/karşılama ve hukuki iddia kontrolü öncelikli.

## Dört pazar: arama niyeti ve örnek sorgular
Bunlar gerçek SERP'lerde görülen terim ve rakip sayfa başlıklarından türetilmiş **aday sorgulardır**, ölçülmüş aylık hacim değildir.

| Pazar | Aday sorgular | Arama niyeti | İçerik/UX önceliği |
|---|---|---|---|
| UK / en-GB | dalaman airport transfers; dalaman to marmaris transfer; dalaman airport to fethiye private transfer; dalaman airport taxi; dalaman return transfer | Önceden rezervasyon, araç başına GBP fiyat, uçuş gecikmesi, çocuk koltuğu, iade koşulları | GBP tutarlılığı, araç/bagaj, net pickup noktası, gerçek iptal şartları, dönüş rezervasyonu |
| DE / de-DE | flughafentransfer dalaman; dalaman flughafen nach fethiye transfer; privattransfer dalaman marmaris; dalaman transfer festpreis | Sabit toplam fiyat, kapıdan kapıya hizmet, güvenilirlik, araç kapasitesi | Akıcı Almanca, doğrulanmış toplam fiyat ve koşullar, ödeme/iptal açıklığı |
| RU / ru-RU | трансфер из аэропорта Даламан; Даламан Мармарис трансфер; индивидуальный трансфер Даламан Фетхие; заказать трансфер Даламан | Rusça rezervasyon, otel kapısına transfer, ödeme şekli, karşılanma | Tam Kiril metin, uçuş numarası, otel adresi, ödeme ve iletişim seçenekleri |
| TR / tr-TR | dalaman havalimanı transfer; dalaman marmaris vip transfer; dalaman fethiye özel transfer; dalaman havalimanı araç transfer | Yerel fiyat, VIP/özel araç, telefon/WhatsApp, güven | Türkçe özgün sayfa, gerçek işletme bilgileri, doğru TL/para birimi ve net ücret |

## Rakip SERP gözlemleri (örneklem, sıralama veya pazar payı ölçümü değil)
- EN: https://intransfers.com/transfers/turkey/dalaman-airport-dlm/ — destinasyon ve şirket karşılaştırması, ödeme para birimi, pickup avantajları.
- DE: https://www.fethiyetours.com/de/fethiye-airport-transfer/ ve https://www.get4s.com/de/transfers/dalaman-transfer — Almanca güzergâh odaklı başlıklar, araç başı fiyat, karşılanma ve transfer detayları.
- RU: https://dalamanairport-transfers.com/ru — Rusça rota başlıkları, uçuş ve otel transferi, güven unsurları.
- TR: https://monarchtransfer.com/ ve https://gettotransfer.com/tr/ — rota kartları, fiyat/karşılama bilgileri, yerel hizmet dili.
- Rakip vaatlerini (7/24, ücretsiz iptal, lisans, sigorta, uçuş takibi, ücretsiz bekleme) doğrulanmadan DalamanWay'e kopyalama.

## Teknik uygulama (P0)
1. Production domain `https://dalamanway.com` için gerçek HTTP `/`, `/robots.txt`, `/sitemap.xml`, rota URL'leri, response code, canonical, robots meta, yönlendirme ve indexability denetimi yap. Sadece kaynak koduna bakarak indeksleniyor deme.
2. Mevcut route/booking davranışını koruyarak kalıcı URL'ler ekle: `/en-gb/`, `/de/`, `/ru/`, `/tr/` ve eşdeğer rota sayfaları. Mevcut İngilizce URL'leri taşımadan önce 301/canonical geçiş planı hazırla. Boş/yarım çeviri sayfasını indeksleme.
3. Her çevrilmiş sayfada kendi dilinde title, description, tek H1, gerçek çevrilmiş ana içerik, HTML `lang`, **self-canonical**, aynı içeriğin karşılıklı `hreflang` bağlantıları (`en-GB`, `de-DE`, `ru-RU`, `tr-TR`, uygun `x-default`). `en-UK` kullanma.
4. Sitemap'e sadece 200 dönen, canonical ve indekslenebilir URL'leri ekle; dil varyantları için karşılıklı hreflang testi yap. Booking/admin/kişisel bilgi URL'lerini indeksleme.
5. Static prerender veya SSR çıktısında gerçek dilde görünür içerik bulunmalı; yalnızca JS dil anahtarıyla çevrilmiş tek URL'ye güvenme. Googlebot'un JS olmadan aldığı HTML'i test et.
6. Web Vitals, mobil layout, font yükleme, resim boyutu/lazy load, kırık iç link ve schema markup (yalnızca doğru doğrulanmış `Organization`/`LocalBusiness` verisi) kontrol et.

## İçerik planı (P1)
- İlk rota kümesi: Marmaris, Fethiye, Ölüdeniz, İçmeler, Göcek, Dalyan, Sarıgerme; rota gerçekten sunuluyorsa Hisarönü/Ovacık, Kalkan/Kaş.
- Her dil/rota için **özgün** ulaşım rehberi: havalimanı buluşma, varış bölgesi ve otel erişimi, araç/bagaj kapasitesi, bebek koltuğu, gece/erken uçuş, gidiş-dönüş, rezervasyon ve iptal; doğrulanmamış mesafe/süre/fiyat verme.
- Örnek EN title: `Dalaman Airport to Marmaris Private Transfer | DalamanWay`.
- Örnek DE title: `Flughafen Dalaman nach Marmaris – Privater Transfer | DalamanWay`.
- Örnek RU title: `Трансфер Даламан — Мармарис | DalamanWay`.
- Örnek TR title: `Dalaman Havalimanı Marmaris Özel Transfer | DalamanWay`.
- Landing -> rota -> araç -> rezervasyon ve ilgili rota/SSS bağlantılarını dil içinde kur; sayfalar arası yanlış dil geçişlerini önle.

## Ölçüm, kanıt ve öncelik (P2)
- Search Console: ülke, sorgu, sayfa, gösterim, tıklama, CTR ve ortalama konumu 28/90 günlük karşılaştır. GA4 dönüşüm olayları yalnızca izin ve veri minimizasyonuyla.
- Google Keyword Planner (UK/DE/TR) ve erişilebilir Rusça sorgu kaynaklarından **konum/dil/cihaz/tarih etiketli** hacim ve rekabet verilerini topla. Araç erişimi olmadan kesin hacim ve keyword difficulty yazma.
- P0 kabul: 4 dilde örnek ana sayfa + 3 rota HTML, 200, self-canonical, reciprocal hreflang, sitemap, indekslenebilirlik, dil geçişi, mobil ve booking smoke testleri.
- P1 kabul: Her dil için en az 7 özgün rota sayfası, doğrulanmış operasyon bilgisi, iç link ve CTA.
- P2 kabul: Search Console baseline ve 30/60/90 gün raporları. İlk sayfa/ilk sıra garantisi yok.

## Yayın güvenliği
- Sadece izole feature branch -> PR -> CI (lint, test, build, browser smoke) -> staging crawl + mobil -> onaylı production deploy.
- `main`, `feature/booking-integration`, mevcut entegrasyon PR #16 ve production otomatik değiştirilmesin. Paralel Work geliştirmeleriyle çakışma kontrolü yap.

## Uygulama takip defteri — numaralı görevler ve karar günlüğü

**Güncelleme:** 2026-11-19. **Çalışma branch'i:** `feature/seo-audit-checks-20261119`. **Canlı sürüm:** `4d15033` (bu listedeki değişiklikler canlıya alınmadı). Bu belge **tamamlayıcı SEO MD**; repodaki asıl SEO MD'nin yolu henüz doğrulanamadı. Asıl dosya bulunduğunda iki belge uzlaştırılmalı. **Tamamlandı = kod commit edildi; test geçti veya production'da yayınlandı anlamına gelmez.**

### Takip kuralları
- Her görevde **durum**, **kapsam/URL**, **değiştirilen dosya**, **uygulama yaklaşımı**, **commit/PR**, **test kanıtı**, **eksik kalanlar** ve **sonraki adım** kaydedilir.
- Durumlar: `PLANLANDI`, `DEVAM EDİYOR`, `KODLANDI / TEST BEKLİYOR`, `TEST GEÇTİ`, `CANLIDA DOĞRULANDI`, `BLOKE`. Her test koşusu için ilgili commit SHA yazılmalı; başka commit'in başarısı otomatik aktarılmaz.
- Bir görev ancak testler ve ilgili üretim kontrolü doğrulanınca `CANLIDA DOĞRULANDI` olur. Yeni bir bulgu çıkarsa aynı maddeye tarihli not eklenir, geçmiş silinmez.

| No | İş paketi | Hedef URL/sayfa | Durum | Kanıt / sıradaki işlem |
|---|---|---|---|---|
| SEO-01 | Mevcut altyapı ve 4 pazar araştırması | Genel; EN/DE/RU/TR | KODLANDI / TEST BEKLİYOR (belge) | `224251e`; ana SEO MD dosyasını bulup karşılaştır |
| SEO-02 | Sitemap ve robots indeksleme testleri | `/robots.txt`, `/sitemap.xml` | KODLANDI / TEST BEKLİYOR | `5424274`; yeni commit CI doğrulaması |
| SEO-03 | Prerender title, description, canonical ve noindex regresyon testi | `/routes/marmaris`, `/faq` | KODLANDI / TEST BEKLİYOR | `0c074ec`; test kapsamı genişletildi, mevcut branch'in son SHA'sında yeniden koşulmalı |
| SEO-04 | Open Graph ve Twitter meta etiketleri | `/routes/:slug`, `/`, `/vehicles`, `/services`, `/contact`, `/faq`, `/reviews`, `/routes` | KODLANDI / TEST BEKLİYOR | `0b57e68`, test `aa9828e`; gerçek HTML ve sosyal paylaşım önizlemesi kontrol edilmeli |
| SEO-05 | Production HTTP/indexability denetimi | `/`, `/robots.txt`, `/sitemap.xml`, örnek rotalar | BLOKE (erişim) | 2026-11-19 HTTP denemeleri erişim engeline takıldı; dış erişimi olan Work/CI ortamından doğrula |
| SEO-06 | Dört dil için kalıcı URL ve geçiş stratejisi | `/en-gb/`, `/de/`, `/ru/`, `/tr/` ve rota varyantları | DEVAM EDİYOR (mimari keşif) | Router ve JS SEO davranışı incelendi; LanguageProvider/URL stratejisi sırada |
| SEO-07 | Dil bazlı HTML, title, H1, canonical ve hreflang | SEO-06 URL'leri | PLANLANDI | Karşılıklı hreflang ve self-canonical testleri |
| SEO-08 | Lokalize sitemap ve JS'siz prerender | SEO-06 URL'leri ve sitemap | PLANLANDI | Yalnızca tam çevrilmiş, 200/indexlenebilir URL'leri ekle |
| SEO-09 | Özgün rota içerikleri | Marmaris, Fethiye, Ölüdeniz, İçmeler, Göcek, Dalyan, Sarıgerme; 4 dil | PLANLANDI | Operasyonel doğrulama, çeviri ve iç bağlantı |
| SEO-10 | Mobil performans ve teknik kalite | Ana sayfa, rota, araç ve rezervasyon | PLANLANDI | CWV, resimler, fontlar, mobil ve booking smoke |
| SEO-11 | Yapılandırılmış veri ve güven bilgileri | Kurumsal ve ilgili herkese açık sayfalar | PLANLANDI | Sadece doğrulanmış işletme verisiyle schema |
| SEO-12 | Search Console ve 30/60/90 gün ölçümü | Ülke, sorgu, URL bazında | PLANLANDI | Ölçüm erişimi, başlangıç verisi, CTR ve dönüşüm izlemesi |
| SEO-13 | Son CI/staging doğrulaması ve kontrollü canlı yayın | Bütün değişen URL'ler | PLANLANDI | Lint, unit, build, browser smoke, staging; sonra deploy ve canlı HTTP doğrulama |

### Yapılan işlerin teknik kaydı

**SEO-01 — Araştırma (2026-11-19).** UK, DE, RU, TR için aday arama niyetleri, rakip örnekleri ve mevcut `generate-seo.mjs`/`prerender-routes.mjs` mimarisi incelendi. **Dosya:** `docs/SEO_FOUR_MARKETS_RESEARCH_2026-11-19.md`. **Yaklaşım:** doğrulanmamış arama hacmi/sıralama vaadi yazılmadı; mevcut üretim koduna dokunulmadan ayrı araştırma branch'i açıldı. **Commit:** `224251e`. **Kalan:** asıl SEO MD dosyasının yerini bulup görevleri eşleştirmek.

**SEO-02 — İndeksleme güvenlik testleri (2026-11-19).** **Dosya:** `frontend/tests/seo-indexing-safety.test.mjs`. **Hedef:** `/robots.txt` ve `/sitemap.xml`. **Yaklaşım:** script'i geçici klasörde farklı `VITE_PUBLIC_SITE_URL` değerleriyle çalıştıran Node testleri; localhost/Render ortamında `Disallow: /`, production'da canonical URL ve booking/admin/token sızıntısı yokluğu kontrolü. **Commit:** `5424274`; **PR:** #18. **Durum:** kod eklendi, bu commit için başarılı test sonucu doğrulanmadı. **Kalan:** CI ve gerçek üretim çıktısı.

**SEO-03 — Prerender regresyonu (2026-11-19).** **Dosya:** `frontend/tests/prerender-seo.test.mjs`. **Hedef:** `/routes/marmaris`, `/faq`. **Yaklaşım:** sahte HTML şablonu ile Node prerender script'ini çalıştırıp title, canonical, robots ve HTML fallback varlığını doğrulayan testler; staging'de noindex kontrolü. **Commit:** `0c074ec`; **PR:** #17. Bu SHA için GitHub Actions'da build checks, booking browser smoke, comprehensive release quality gate ve dependency security audit **success** görüldü; testlerin bireysel adımları/logları ayrıca incelenmedi. **Kalan:** güncel branch SHA'sında yeniden CI, gerekirse test beklentisi düzeltmesi.

**SEO-04 — Sosyal meta etiketleri (2026-11-19).** **Dosya:** `frontend/scripts/prerender-routes.mjs`; test güncellemesi `frontend/tests/prerender-seo.test.mjs`. **Hedef:** prerender edilen 5 rota ve 7 landing sayfası. **Yaklaşım:** her sayfaya `og:type`, `og:title`, `og:description`, `twitter:card`; yalnızca production'da `og:url` eklenerek staging URL paylaşımı önlendi. **Commitler:** `0b57e68` ve `aa9828e`. **Durum:** kodlandı, son SHA için test ve gerçek HTML doğrulaması bekliyor. **Kalan:** sayfa bazında meta değerleri, URL normalizasyonu, sosyal önizleme ve build testi.

### SEO-05 — Canlı HTTP denetimi ilerleme kaydı (2026-11-19)

**Kapsam:** `https://dalamanway.com/`, `/robots.txt`, `/sitemap.xml`, `/routes/marmaris`.

**Yapılan işlem:** Her dört URL'ye web erişim aracıyla doğrudan GET denendi; ana sayfa için `DisabledError`, diğerleri için erişilemez sonucu alındı. Ayrı çalışma ortamında Python `requests.get` ile dört URL tekrar denendi; hepsi `NameResolutionError` (DNS çözümlenemedi) nedeniyle başarısız oldu. **Bu bir sitenin kapalı olduğu veya SEO'nun bozuk olduğu kanıtı değildir; kullanılan çalışma ortamının dış erişim kısıtıdır.** HTTP status, canonical, robots, yönlendirme ve gerçek sitemap içeriği **doğrulanamadı**.

**Karar:** Üretim ayarlarına veya DNS'e körlemesine müdahale edilmedi; siteye deploy yapılmadı. SEO-05 durumu `BLOKE (erişim)` olarak tutuldu. **Sonraki uygulama:** Work Mode'un erişebildiği tarayıcıda veya ağ erişimi olan GitHub Actions runner'ında dört URL için status, final URL, HTML meta robots, canonical, sitemap/robots içerik ve yönlendirme zincirini kaydet; çıktıyı bu maddeye ekle. Gerekirse `curl -IL https://dalamanway.com/`, `curl -fsSL https://dalamanway.com/robots.txt`, `curl -fsSL https://dalamanway.com/sitemap.xml` ve rota HTML denetimi yap. Başarı ancak gerçek yanıtla yazılır.

**Devam noktası:** SEO-05 canlı ölçümü açık; buna paralel SEO-06 için mevcut React router ve i18n dosyalarını yalnızca okuyarak mimari inceleme yapılabilir. Work Mode test sonuçları gelince son commit SHA'sına göre yeniden doğrula.

### SEO-06 — Router/i18n mimari inceleme (2026-11-19, kod değişikliği yok)

**İncelenen dosyalar:** `frontend/src/App.tsx`, `frontend/src/app/providers.tsx`, `frontend/src/app/router.tsx`, `frontend/src/main.tsx`, `frontend/package.json`.

**Somut bulgular:** Uygulama `react-router-dom` v7 `createBrowserRouter` kullanıyor. Public route'lar `/`, `/routes`, `/routes/:slug`, `/vehicles`, `/services`, `/contact`, `/faq`, `/reviews`, `/booking` ve rezervasyon alt sayfaları; `/admin` ayrı. Public layout `LanguageProvider` ile sarılıyor, ancak router'da `/en-gb`, `/de`, `/ru`, `/tr` eşleşmesi **yok**. Bilinmeyen yollar wildcard ile `/` adresine yönlendiriliyor. Bu nedenle yalnızca statik dil URL'leri üretmek kullanıcıyı ana sayfaya düşürebilir; önce router uyarlaması şart.

**SEO riski:** `ScrollToTop` `pathname` değiştiğinde robots, title, description ve canonical'ı JS tarafında yeniden yazıyor. Indexlenebilir yol listesi yalnızca İngilizce mevcut URL'leri kapsıyor. Dil URL'leri eklenirse bu liste ve metadata eşlemesi güncellenmeden tarayıcıda `noindex` kalabilir; prerender edilmiş head ile JS metadata çelişebilir. Ayrıca `/booking` ve `/admin` noindex davranışı korunmalı.

**Karar / çözüm sırası:** (1) `LanguageProvider` ve dil anahtarı bileşenlerinin URL senkronizasyonunu incele; (2) geriye uyumlu dil-prefiksli router tasarımı ve mevcut İngilizce URL'ler için canonical/redirect stratejisi çıkar; (3) route/SEO metadata tek kaynaktan beslensin; (4) statik prerender, sitemap, reciprocal hreflang ve tarayıcı yönlendirmesini birlikte test et. **Henüz yeni dil URL'si yayınlanmadı veya kodlanmadı.**

**Devam noktası:** `frontend/src/shared/localization/LanguageProvider` ve dil seçim bileşenlerini oku; eski URL'lerin booking navigasyonuna etkisini test planına ekle. Bu mimari inceleme SEO-06'nın yalnızca keşif alt adımıdır; görev hâlâ `DEVAM EDİYOR`.

### SEO-06 — Dil durumunun URL ile ilişkisi, ikinci inceleme (2026-11-19)

**İncelenen dosya:** `frontend/src/shared/localization/LanguageProvider.tsx` (blob `425a594`).

**Bulgu:** Dil durumu `useState(savedLanguage)` ile `localStorage` üzerinden başlatılıyor. `useEffect`, `document.documentElement.lang` ve `localStorage` değerini güncelliyor. Bu provider'da URL path'ini okuma veya değiştirme yok. Bu yüzden aynı `/routes/marmaris` adresi tarayıcıdaki önceki dil seçimine göre farklı dillerde görünebilir; arama motoruna tutarlı dil bazlı URL/HTML üretimi için yeterli değil.

**Güvenli çözüm taslağı:** Önce `language.ts`, çeviri sözlüğü ve dil seçicisini incele; `en`/`de`/`ru`/`tr` tiplerinin gerçekten desteklendiğini doğrula. Mevcut İngilizce rotaları ve booking URL'lerini koru. Public içerik için URL'den dil seçen ve mevcut seçiciyle uyumlu bir katman tasarla; booking/admin'a otomatik dil-prefiksi ekleme. Ardından React router, prerender HTML `lang`, metadata, canonical, sitemap ve reciprocal hreflang'ı aynı URL tablosuna bağla. Her dilde içerik ve navigasyon tam doğrulanmadan indexleme açma.

**Değişiklik kapsamı:** Bu adım yalnızca inceleme ve devir kaydıdır; frontend davranışı değiştirilmedi. **SEO-06 devam ediyor.** Sonraki dosyalar: `frontend/src/shared/localization/language.ts` ve dil seçim UI'sı.

### Şu an tam olarak neredeyiz?
**Son kodlanan görev: SEO-04.** **SEO-05 canlı HTTP erişimi nedeniyle bloke; SEO-06 router ve LanguageProvider incelemesi sürüyor.** Ardından SEO-07. SEO-02/03/04 için güncel branch'in testleri ve staging doğrulaması açık. **Hiçbiri bu kayıt itibarıyla production'a yayınlanmadı.** PR #17 ve #18 ayrı tutuldu; Work Mode'un yaptığı değişiklikler birleştirilmeden önce diff ve çakışma kontrolü yapılmalı.

---

## Kaynaklar
- https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites
- https://developers.google.com/search/docs/specialty/international/localized-versions
- Rakip URL'leri yukarıda.

### 19 Kasım 2026 — SEO-05 yeniden ölçüm ve SEO-02/03/04 doğrulaması

Önceki HTTP erişim engeli aşıldı. Canlı 12 adresin ilk HTML ve test ortamı sonuçları, branch karşılaştırması, yerel test sonucu ve açık `/booking` bulgusu [ana SEO standardına](../frontend/SEO_STANDARD.md) eklendi. Google Search Console ve dil bazlı indexlenebilir URL'ler ayrı doğrulama bekliyor.

### 21 Kasım 2026 — Search Console tekrar kontrolü ve indeks keşif desteği

Search Console'da `sc-domain:dalamanway.com` mülkünde sitemap yeniden gönderildi. Google gönderimi **başarılı** kabul etti; gönderim tarihi 21 Kasım, ekrandaki son okuma tarihi 19 Kasım ve keşfedilen sayfa sayısı 28 olarak kaldı. Canlı `sitemap.xml` HTTP 200 verdi, 28 URL içerdi ve İngilizce/Almanca/Rusça Sarıgerme adreslerinin üçünü de içerdi. URL Denetimi'nde Sarıgerme için ilk sonuç “URL Google tarafından bilinmiyor / yönlendiren sitemap algılanmadı” olsa da tekrar gönderim sonrasında İçmeler, Dalyan ve diğer bazı sayfalarda `https://dalamanway.com/sitemap.xml` görünmeye başladı. Google raporunun sitemap güncellemesini işlemesi bekleniyor.

Öncelikli URL'ler için Search Console'da “Dizine eklenmesi istendi” onayı alındı: `/routes/sarigerme`, `/routes/fethiye`, `/routes/oludeniz`, `/routes/icmeler`, `/routes/dalyan`, `/de/routes/fethiye`, `/ru/routes/fethiye`, `/de/routes/marmaris`, `/ru/routes/marmaris`. Bu, öncelikli tarama sırasına alındıklarını gösterir; indekslenme garantisi değildir. Kontrol anında bu URL'lerde yeni bir son tarama tarihi görünmüyordu.

### 21 Kasım 2026 — Ana sayfadan rota bağlantıları

GSC örnekleminde birçok rota keşfedilmiş fakat Googlebot tarafından henüz taranmamış olduğundan, JS öncesi ana sayfa HTML'si ve `/routes` dizini yedi İngilizce rotanın tümüne doğrudan bağlantı verecek şekilde güncellendi. Ana sayfa ve rota dizini açıklamalarına Dalyan ile Sarıgerme de eklendi; yeni fiyat veya hizmet iddiası eklenmedi.

- **Değişen dosyalar:** `frontend/scripts/prerender-routes.mjs`, `frontend/tests/prerenderSeo.test.mjs`.
- **Testler:** 87/87 frontend testi geçti, ESLint geçti, `VITE_PUBLIC_SITE_URL=https://dalamanway.com npm run build` geçti.
- **Durum:** `CANLIDA DOĞRULANDI` — commit `55a45c6` (tam SHA `55a45c62ff24a78d96a3f6116521148ed9abfdf1`).
- **Staging:** Render dağıtımı başarılı. `/` ve `/routes` HTTP 200, yedi rotaya doğrudan link; staging `noindex`, `Disallow: /` ve boş sitemap korundu.
- **Production:** Render frontend deploy'u başarılı. `/` ve `/routes` HTTP 200, yedi rotaya doğrudan link, canonical ve `index,follow`; `robots.txt` üretim kurallarını koruyor. Sitemap HTTP 200, 28 URL ve EN/DE/RU Sarıgerme URL'leri doğrulandı. Backend/API deploy edilmedi.
- **Sonraki takip:** Search Console'da gönderilen dokuz indeks isteğinin tarama/indeks sonuçlarını yeniden denetle. Sıralama veya gösterim artışını henüz iddia etme; performans raporu şu an 0 gösterim/tıklama gösteriyor.


---

# Arşiv eki — docs/UK_SEO_CONTENT_PLAN_2026-11-21.md (feature/booking-integration)

Kaynak blob: `e4a9a5d4ae570c689a2d91115d858105ae0a931b`. Tarihsel içerik, yeniden doğrulanmadı.

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
- Render rewrite rules for `/guides` and all four nested guide URLs now point to the generated `/index.html` files. The rules were saved in both staging and production.
- Staging verification: the hub, all four guide URLs, and the mobile navigation link opened successfully on 21 November 2026. Each guide links onward to its matching private-transfer route and booking flow.
- Production release: commit `00b0922345e7241cbf16a278d8f39aafdf40f581` is live on 21 November 2026 (Render deploy `dep-dc0hbqjm8hqs73ehcrj0`). The hub and all four article URLs were opened directly; the Travel Guides link appears in navigation.
- Local verification: all 88 frontend tests passed, ESLint passed, and both production and staging builds passed. Production pages emit self-canonicals and `index,follow`; staging remains `noindex,nofollow` without canonicals.
- Search Console follow-up: monitor indexing, UK query impressions/clicks, and qualified booking enquiries. No traffic increase is claimed until those data appear.

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


---

# Arşiv eki — docs/UK_SEO_CONTENT_PLAN_2026-11-21.md (codex/uk-seo-fethiye-guide-20261121)

Kaynak blob: `922ab33c7e56bc1d94d7a4978e684b6117297ecb`. Tarihsel içerik, yeniden doğrulanmadı.

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

No fare or fixed journey-time estimate is stated. The guide uses official operator and airport sources and tells visitors to recheck schedules, stops and payment details before travel. Production build, metadata, canonical, one-H1 output, homepage link and sitemap inclusion have passed locally; staging and production release verification are still pending.

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

## Sources

- Google, helpful and reliable people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- YDA Dalaman Airport, public transport: https://www.dalamanairport.aero/en/passengers/public-transport/
- DHMİ Dalaman Airport, transport: https://www.dhmi.gov.tr/Sayfalar/Havalimani/Dalaman/Ulasim.aspx
- HAVAŞ services: https://www.havas.net/otobus-hizmetleri
- MUTTAŞ airport services: https://www.muttas.com.tr/sayfa/havalimani-seferleri
- Render redirects and rewrites: https://render.com/docs/redirects-rewrites


---

# Arşiv eki — docs/DALAMANWAY_UK_COMPETITOR_DEEP_RESEARCH.md (feature/booking-integration)

Kaynak blob: `3d394c28125604633a2cb6987036e4788a9d23a0`. Tarihsel içerik, yeniden doğrulanmadı.

# DalamanWay — Birleşik Krallık rekabet ve dönüşüm araştırması

**Araştırma tarihi** 20 Kasım 2026. **Kod tabanı** `feature/booking-integration`, `f06ac1c`. **Kapsam** Kamuya açık veriler, canlı ve Render test ortamında salt okunur inceleme, geliştirme önerileri.

## 1. Yönetici özeti

DalamanWay’in belirgin avantajı, UK müşterisinin özel araç fiyatını GBP olarak görebilmesi. Marmaris için VIP Vito canlı ve test formunda **£47,50 tek yön, £95 gidiş-dönüş** gösterdi. Canlı API’de 59 farklı destinasyon ve 531 fiyat kaydı vardı. Tarifeyi işletmenin marj maliyeti ve koşullarıyla doğrulamadan genel fiyat indirimi önerilmiyor.

Yerel rakiplerin öne çıktığı yer, müşterinin **tam olarak ne satın aldığını** anlatma biçimi. Dalaman Travel tek bir rota sayfasında fiyatı, valizi, karşılama ve uçuş gecikmesi koşullarını birleştiriyor. Marmaris Transfers fotoğraflı terminal buluşma rehberi sunuyor. Airports Transfer Turkey ulaşıma ilişkin karar verdiren özgün rehberleri fiyat formuyla birleştiriyor. Bazı rakiplerde açık sayfalar arasında koşullar çelişebiliyor. DalamanWay için fırsat, bütün temas noktalarında aynı doğrulanmış koşulları sunmak. [Dalaman Travel](https://www.dalamantravel.com/en/dalaman-airport-to-marmaris-transfer) · [Marmaris Transfers](https://www.marmaris-transfers.com/dalaman-airport-pick-up-procedures/) · [Airports Transfer Turkey](https://www.airportstransferturkey.com/guides/dalaman-airport-to-marmaris-icmeler)

**İlk karar** Mevcut rezervasyon güvenilirliği ve veri saklama riskini kapat. Ardından GBP fiyat kapsamı, talep/onay ayrımı, karşılama ve iptal koşullarını rezervasyon kararının alındığı yerlere taşı. Trafik yatırımı için ilk pilot Marmaris, Fethiye ve Ölüdeniz. Pilot sırası ticari uygunluk ve gözlenen içerik rekabetine dayanıyor. UK arama hacmiyle yeniden önceliklendirilecek.

## 2. Yöntem ve sınırlamalar

- 12 İngilizce sorgu ayrı ayrı çalıştırıldı. Hedeflenen UK oturumu doğrulanamadığı için aşağıdaki sonuçlar **arama aracı keşif örneklemi**. Google UK organik sıra, harita sonucu veya reklam gösterimi ölçümü olarak kullanılmaz.
- On alan adı, tekrarlı keşif, Dalaman rotasına doğrudan hizmet ve kıyas değeriyle seçildi. Öncelik sırası, ayrı işletme sahipliği veya pazar payı iddiası taşımaz.
- Kamuya açık ana sayfa, rota, fiyat, araç, yardım, iletişim veya koşul sayfaları incelendi. Rakip vaatlerinin sitede yazdığı doğrulandı. Operasyonun gerçekleştiği, lisansın geçerliliği ve yorum sahibinin transfer aldığı bu çalışmanın kanıt kapsamı dışında.
- Canlı ve test HTTP/HTML ayrı tarandı. Canlı rezervasyonun ilk ekranı 390 px’de açıldı. Canlı ve test Marmaris fiyatı tarayıcıda seçilerek okundu. Formun sonraki adımlarına, gönderimine ve kişisel verilere ilişkin bulgular kaynak kodu ve kamuya açık HTTP yanıtlarıyla etiketlendi.
- Rakiplerde sipariş, ödeme ve iletişim gönderimi yapılmadı. Kontrol edilen rakip sayfalarında son fiyat, mobil saha performansı ve satış sonrası operasyon sonuca bağlanmış kabul edilmedi.

## 3. Google UK sorgu kapsaması

20 Kasım 2026 arama aracı örneği. Her satır bir görünür sonuç örneği. UK konumu, cihaz, gerçek sıra ve reklam durumu kontrol edilemedi.

| İngilizce sorgu | Örnekte görülen kaynak | Sonucun rolü |
|---|---|---|
| dalaman airport transfers | [Dalaman Travel](https://www.dalamantravel.com/en/dalaman-airport-transfer) | Rota ve fiyat merkezi |
| dalaman airport private transfer | [Sunshuttle](https://www.antalyataxis.com/airports/dalaman) | Operatör adayı. Açma denemesi 404 |
| dalaman to marmaris transfer | [Airports Transfer Turkey](https://www.airportstransferturkey.com/guides/dalaman-airport-to-marmaris-icmeler) | Ticari rehber |
| dalaman to fethiye transfer | [SooTransfer](https://www.sootransfer.com/en/t/dalaman-fethiye-transfer/) | Ticari rota |
| dalaman to oludeniz transfer | [SooTransfer](https://www.sootransfer.com/en/t/dalaman-oludeniz-transfer/) | Ticari rota |
| dalaman to gocek transfer | [Airports Transfer Turkey](https://www.airportstransferturkey.com/guides/dalaman-airport-to-gocek) | Ticari rehber |
| dalaman airport taxi | [YDA Dalaman](https://www.dalamanairport.aero/en/passengers/taxi) | Resmî havalimanı taksi bilgisi |
| cheap dalaman transfers | [DM Transfers](https://www.dmtransfer.com/) | Operatör adayı. Sayfa metni okunamadı |
| dalaman vip transfer | [DalamanAirport.com.tr](https://dalamanairport.com.tr/hizmet-bolgelerimiz/) | Türkçe hizmet sayfası |
| dalaman airport transfers to icmeler | [Dalaman Travel](https://www.dalamantravel.com/en/dalaman-airport-to-icmeler-transfer) | Ticari rota |
| dalaman airport transfers to sarigerme | [Sarigerme.co.uk](https://www.sarigerme.co.uk/location) | Bilgi kaynağı |
| book dalaman airport transfer | [Dalaman Transport](https://www.dalamantransport.com/help/) | Rezervasyon yardım sayfası |

Bu örneklemde Dalaman Travel, SooTransfer ve Airports Transfer Turkey **ikişer farklı sorguda** göründü. Harita, reklam ve ölçülmüş organik sıra için veri yok. [Tripadvisor](https://www.tripadvisor.com/AttractionProductReview-g811172-d16677803-Private_Transfer_from_Dalaman_Airport_DLM_to_Marmaris_Fethiye_Oludeniz-Dalaman_Mug.html) ayrıca bir aracı yorum/satış sayfası örneği olarak görüldü. Gelecek UK ölçümünde ülke, tarih, konum, cihaz, organik konum, reklam ve harita türü ayrı alanlarla kaydedilmeli. Başlangıçta genel sorgu, Marmaris ve Fethiye için London, Manchester ve Birmingham kontrolü yeterli bir tekrar örneklemi oluşturur.

## 4. On rakip profili

| Kimlik | Marka ve konumlandırma | İncelenen sayfalar ve güçlü taraf | Açık nokta / DalamanWay fırsatı |
|---|---|---|---|
| DT | Dalaman Travel · yerel özel transfer · EN/TR/RU | [Ana sayfa](https://www.dalamantravel.com/en), [rotalar](https://www.dalamantravel.com/en/dalaman-airport-transfer), [Marmaris](https://www.dalamantravel.com/en/dalaman-airport-to-marmaris-transfer), [SSS](https://www.dalamantravel.com/en/faq), [rezervasyon](https://www.dalamantravel.com/en/booking). Fethiye, Marmaris, Ölüdeniz, Göcek, Dalyan, Sarıgerme ve İçmeler. Rota bazlı GBP ve açıklama | Formun HTML çıktısında yükleme ekranı görüldü. Koşulları rota ile formda aynı metriklerle gösterme fırsatı |
| ATT | Airports Transfer Turkey · çok havalimanlı acente | [Ana sayfa](https://www.airportstransferturkey.com/), [Marmaris rehberi](https://www.airportstransferturkey.com/guides/dalaman-airport-to-marmaris-icmeler), [Göcek rehberi](https://www.airportstransferturkey.com/guides/dalaman-airport-to-gocek), [iletişim](https://www.airportstransferturkey.com/help/contact-us). Ulaşım alternatifleri, harita/rota bağlamı, arama formu | İncelenen farklı rehberlerde başlangıç rakamları farklı. DalamanWay aynı katalogdan çektiği araç fiyatını anlaşılır biçimde gösterebilir |
| ST | SooTransfer · Mercedes kategorileri ve WhatsApp odaklı doğrudan talep | [Fethiye](https://www.sootransfer.com/en/t/dalaman-fethiye-transfer/), [Ölüdeniz](https://www.sootransfer.com/en/t/dalaman-oludeniz-transfer/), [filo](https://www.sootransfer.com/en/vehicles/). Araç kapasitesi, rota fiyatı ve konaklama bağlantıları | Nihai teklif ve WhatsApp sonrası adımlar gözlenmedi. DalamanWay’in site içi çok adımlı talep akışı ölçülebilir |
| MT | Marmaris Transfers · Marmaris/İçmeler özel taksi ve minibüs | [Ana sayfa](https://www.marmaris-transfers.com/), [SSS](https://www.marmaris-transfers.com/faq/), [fotoğraflı buluşma rehberi](https://www.marmaris-transfers.com/dalaman-airport-pick-up-procedures/). Tek yön/dönüş arama ve açık iptal iddiası | Gerçek form fiyatı doğrulanmadı. Güncel, kendi fotoğraflarımızla terminal rehberi üretilebilir |
| DAT | Dalaman Airport Transfers / Without Error · çok dilli yerel acente | [Ana sayfa](https://dalamanairport-transfers.com/), [gizlilik](https://dalamanairport-transfers.com/agreements/privacy-policy), [iptal](https://dalamanairport-transfers.com/agreements/reservation-cancellation-policy). Harita ve koşul bağlantıları, Marmaris/Fethiye/Göcek/Ölüdeniz | Örnek ana sayfada doğrudan HTTP HTML’i `noindex, nofollow` döndürdü. Marka diğer sayfalarda sıralanabilir. Fiyat/koşul sunumu için kıyas, SEO sıralaması için kanıt sınırlı |
| DTP | Dalaman Transport / IAMVIP · Marmaris merkezli hizmet | [Ana sayfa](https://www.dalamantransport.com/), [yardım](https://www.dalamantransport.com/help/), [filo](https://www.dalamantransport.com/our-vehicles/), [yorumlar](https://www.dalamantransport.com/customer-reviews/), [iletişim](https://www.dalamantransport.com/contact/). Adres, filo, süreç | Yardım sayfası ön ödeme ile sürücüye ödeme ifadelerini birlikte kullanıyor. Şeffaflık fırsatı |
| DGT | Dalaman Go Transfer · sabit fiyat, çok havalimanı · EN/TR/DE/RU, GBP seçimi | [Ana sayfa](https://dalamangotransfer.com/en), [filo](https://dalamangotransfer.com/en/vehicles). Yaş grupları, valiz, gidiş-dönüş, bekleme, sürücü bilgisi ve otel partneri | İletişim numarası örnek numara görünümünde. Çalışırlığı doğrulanmadı. Gerçek operasyon kanalı, doğrulanmış standart ve gerçek fotoğraf DalamanWay’i ayırt edebilir |
| VDT | VIP Dalaman Transfers · VIP minivan, Maybach ve minibüs · GBP | [Ana sayfa](https://www.vipdalamantransfers.com/), [tarife](https://www.vipdalamantransfers.com/pricelist/), [rezervasyon](https://www.vipdalamantransfers.com/booknow/), [SSS](https://www.vipdalamantransfers.com/faq/). Uzun araç/destinasyon tablosu, ödeme ve çocuk koltuğu açıklaması | Geniş tablo mobil erişim açısından test edilmeli. Satın alınabilir üç-dört seçenekle daha düzenli mobil fiyat karşılaştırması mümkün |
| WP | Welcome Pickups · uluslararası sürücü ağı | [Dalaman rezervasyon sayfası](https://www.welcomepickups.com/dalaman/airport-transfer-book/). İngilizce konuşan sürücü, buluşma bilgisi ve iade oranı ilanı | Dalaman’a ait ayrı yorum sayısı, araç/valiz toplamı ve kesin fiyat doğrulanmadı. Rekabet odağı yerel rota bilgisi |
| SUN | Suntransfers · uluslararası rezervasyon platformu | [Dalaman sayfası](https://www.suntransfers.com/dalaman-airport). Tek form, özel veya paylaşımlı seçenek, araç grupları, bagaj/özel istekler, uçuş ve iptal açıklaması | Nihai Dalaman fiyatı bu araştırmada doğrulanmadı. Global ölçek, yerel rakibin karşılaması gereken reklam bütçesi hakkında ölçü vermez |

**Alan adı ve işletme ayrımı:** VDT ve DTP’nin açılan iletişim sayfaları aynı adresi ve telefon numarasını gösteriyor. Bağımsız rakip sayısı, mülkiyet veya firma bağlantısı belgelenmeden iki ayrı işletme olarak sayılmamalı. [VDT iletişim](https://www.vipdalamantransfers.com/contact/) · [DTP iletişim](https://www.dalamantransport.com/contact/)

## 5. Rakip özellik matrisi

**D** kamuya açık sayfa/metinde doğrulandı. **B** incelenen kaynaklarda bulunamadı veya iddianın kapsamı doğrulanamadı. **İ** etkileşim/teklif alanı bu incelemede erişilemedi ya da test edilmedi. Kaynaklar §4’te marka satırındadır.

| Rakip | Rezervasyon girişi | Fiyat ilk aşamada | Araç başı açıklama | Tek/dönüş | Araç listesi | Yolcu kapasitesi | Valiz bilgisi | Çocuk koltuğu | Uçuş numarası | Ek durak kuralı |
|---|---|---|---|---|---|---|---|---|---|---|
| DT | D | D, rota | D | İ | D | D | D | D | D | B |
| ATT | D | D, sonraki adım iddiası | D | D | D, rehber | D | D | B | B | B |
| ST | D, WhatsApp | D, rota | D | İ | D | D | D | D | B | B |
| MT | D | İ | D | D | D, SSS bağlantısı | B | B | B | D | D |
| DAT | D | D, fiyat CTA’sı | B | İ | D, karşılaştırma beyanı | D, bilgi istenir | D | B | D | B |
| DTP | D | D, arama sonrası beyan | D | B | D | D | B | B | D | B |
| DGT | D | D, rota örnekleri | D | D | D | D | D | D | D | B |
| VDT | D | D, tarife | D | D | D | D | D | D | B | B |
| WP | D, tarif edilen | İ | B | İ | B | B | B | B | B | B |
| SUN | D | D, fiyat akışı beyanı | B | İ | D | D | D | D | B | B |

| Rakip | Uçuş gecikmesi | Buluşma | Sayısal bekleme | İptal şartı | Ödeme bilgisi | Şirket/iletişim | Yorum görünümü | Gizlilik belgesi | Rota içeriği | Mobil son adım |
|---|---|---|---|---|---|---|---|---|---|---|
| DT | D | D | B | D, SSS | D | D | B | B | D | İ |
| ATT | D | D | B | D, 24 saat | D, ön ödeme yok | D | D, site beyanı | B | D | İ |
| ST | D | D | B | B | B | D, lisans beyanı/WhatsApp | B | B | D | İ |
| MT | D | D, fotoğraflı | B, üst sınır verilmemiş | D, 8 saat | D | D | B | B | D | İ |
| DAT | B | D | B | D, ayrı belge | D, varışta | D | B | D | D | İ |
| DTP | D, yardım | D | B | D, yardım | D, çelişkili | D | D, site sayfası | B | D | İ |
| DGT | D | D | D, 60 dk beyan | B | D | D, numara doğrulanmadı | D, sayfa bağlantısı | B | D | İ |
| VDT | D | D | D, 1 saat beyan | B, değişiklik gösteriliyor | D, nakit | D | D, sayfa bağlantısı | B | D | İ |
| WP | D | D | B | D, 24 saat/80% beyan | D, ön ödeme | D | D, platform geneli | B | D | İ |
| SUN | D | D | B | D, 48 saat | D, kart ücreti beyanı | D | D, site görünümü | B | D | İ |

Marmaris Transfers’te gecikme için belirtilen ücretsiz bekleme sayısal bir üst sınır vermiyor. Bu hücrede doğrulanan şey **sınır koymadan bekleme beyanı**. Diğer rakiplerde benzer ifadeler karşılaştırılırken iniş saati, planlanan saat ve bagaj için verilen süre ayrı ayrı okunmalı.

## 6. Aylık trafik ve görünürlük

| Alan adı | Araç/dönem | Global ziyaret tahmini | UK ve kanal bilgisi |
|---|---|---:|---|
| suntransfers.com | Semrush, Tem/Eyl 2026, tüm cihazlar | Tem 689.050, Ağu 549.300, Eyl 530.450 | Eyl UK 239.900 ve %45,23. UK tahminindeki mobil pay %86,94. Masaüstü trafik yolculuğu bölümünde doğrudan %49,18 |
| suntransfers.com | Similarweb, Eki 2026 etiketli panel | 350.500 | Masaüstünde UK en üst ülke, doğrudan %45,07. Organik ve ücretli arama ikinci ve üçüncü sırada |
| welcomepickups.com | Similarweb, Eki 2026 etiketli panel | 450.700 | Masaüstü ülke tablosunda ABD, Meksika, UK. UK %9,13 ve doğrudan %34,41. Ücretli ve organik arama ikinci ve üçüncü sırada |
| dalamantravel.com | Kamuya açık Similarweb sayfası ve domain araması | Veri bulunamadı | Veri bulunamadı |
| airportstransferturkey.com | Aynı yöntem | Veri bulunamadı | Veri bulunamadı |
| sootransfer.com | Aynı yöntem | Veri bulunamadı | Veri bulunamadı |
| marmaris-transfers.com | Aynı yöntem | Veri bulunamadı | Veri bulunamadı |
| dalamanairport-transfers.com | Aynı yöntem | Veri bulunamadı | Veri bulunamadı |
| dalamantransport.com | Aynı yöntem | Veri bulunamadı | Veri bulunamadı |
| dalamangotransfer.com | Aynı yöntem | Veri bulunamadı | Veri bulunamadı |
| vipdalamantransfers.com | Aynı yöntem | Veri bulunamadı | Veri bulunamadı |

20 Kasım erişimi. Similarweb sayılarının her biri kendi alan adı kıyas panelinde. Alttaki ülke ve kanal değerleri masaüstüne ait olduğu için global ziyaretle çarparak UK ziyaret sayısı türetilmedi. Similarweb ile Semrush farklı dönemler/model kullanıyor. Semrush’ın Suntransfers için **80.210 organik ve 948 ücretli arama** tahmini ayrı SEO metrikleri. Yetki puanı **42**, tahmini referans alan adı **2.920**, bağlantı **2,02 milyon**. Semrush UK anahtar kelime panelindeki ilk sorguların çoğu marka sorgusu. Rakip doğrudan/referral mutlak sayı, Dalaman alt sayfa trafiği ve 6–12 aylık tam seri bulunamadı. Trafik tahmini oturum benzeri ziyaret metrikleri sunar. Tekil kullanıcı, sayfa görüntüleme, rezervasyon veya gerçek GA4 sayısıyla aynı birim değildir. [Semrush Suntransfers](https://www.semrush.com/website/suntransfers.com/overview/) · [Similarweb Suntransfers](https://www.similarweb.com/website/suntransfers.com/) · [Similarweb Welcome Pickups](https://www.similarweb.com/website/welcomepickups.com/)

**Pazar göstergesi.** CAA Tablo 12.1’deki 22 Dalaman satırının toplamı 2025’te **2.421.918**, 2024’te **2.580.665** yolcu hareketi, yaklaşık **%6,2 düşüş**. 2025 örnekleri Manchester 482.975, Gatwick 445.664 ve Birmingham 237.396. CAA her iki yönün raporlanan trafiğini ölçüyor. Sayılar tekil turistleri, yalnızca varışları, VIP talebini veya Google hacmini temsil etmiyor. [CAA 2025 / 2024, Tablo 12.1](https://www.caa.co.uk/Documents/Download/24007/87fb7670-4e10-4aeb-942d-509238aa25a1/17511)

## 7. UK anahtar kelime araştırması

Bu bölümdeki 54 İngilizce adayın **UK ortalama aylık hacmi, tarihsel seri, organik zorluk, Ads rekabeti ve CPC alanları veri bulunamadı** durumunda. Niyet ve sayfa eşlemesi editoryal değerlendirme. “Taxi” bir bölümde hemen havalimanı taksisi arayanları da çekebilir. “Marmaris airport transfer” rota belirsizliğini DLM vurgusuyla çözmeli. Arama hacmi ay sırası henüz doğrulanmadı. Google Trends endeksi 0–100 göreli ve örneklem temelli, sayı veya CPC göstermez. Google Keyword Planner için hesap erişimi gerekiyor. [Keyword Planner](https://support.google.com/google-ads/answer/3022575?hl=en) · [Trends yöntemi](https://support.google.com/trends/answer/4365533?hl=en)

| Grup | Niyet | Hedef | İngilizce adaylar |
|---|---|---|---|
| Genel | Ticari / işlem | Ana sayfa | `dalaman airport transfers` |
| Genel | Ticari / işlem | Ana sayfa | `dalaman airport transfer` |
| Genel | Ticari / işlem | Ana sayfa | `dalaman airport private transfer` |
| Genel | Ticari / işlem | Ana sayfa | `private transfers dalaman airport` |
| Genel | Ticari / işlem | Ana sayfa | `book dalaman airport transfer` |
| Genel | Ticari / işlem | Ana sayfa | `dalaman airport taxi` |
| Genel | Ticari / işlem | Ana sayfa | `dalaman airport pickup` |
| Genel | Ticari / işlem | Ana sayfa | `dalaman airport return transfer` |
| Genel | Ticari / işlem | Ana sayfa | `dalaman airport hotel transfer` |
| Marmaris ve İçmeler | İşlem | Marmaris / İçmeler rotaları | `dalaman to marmaris transfer` |
| Marmaris ve İçmeler | İşlem | Marmaris / İçmeler rotaları | `dalaman to marmaris taxi` |
| Marmaris ve İçmeler | İşlem | Marmaris / İçmeler rotaları | `marmaris airport transfers` |
| Marmaris ve İçmeler | İşlem | Marmaris / İçmeler rotaları | `marmaris to dalaman airport transfer` |
| Marmaris ve İçmeler | İşlem | Marmaris / İçmeler rotaları | `dalaman airport transfers to icmeler` |
| Marmaris ve İçmeler | İşlem | Marmaris / İçmeler rotaları | `dalaman to icmeler private transfer` |
| Marmaris ve İçmeler | İşlem | Marmaris / İçmeler rotaları | `dalaman airport to marmaris hotel transfer` |
| Marmaris ve İçmeler | İşlem | Marmaris / İçmeler rotaları | `dalaman marmaris return transfer` |
| Marmaris ve İçmeler | İşlem | Marmaris / İçmeler rotaları | `marmaris private airport taxi` |
| Fethiye ve Ölüdeniz | İşlem | Fethiye / Ölüdeniz rotaları | `dalaman to fethiye transfer` |
| Fethiye ve Ölüdeniz | İşlem | Fethiye / Ölüdeniz rotaları | `dalaman to fethiye taxi` |
| Fethiye ve Ölüdeniz | İşlem | Fethiye / Ölüdeniz rotaları | `fethiye airport transfers` |
| Fethiye ve Ölüdeniz | İşlem | Fethiye / Ölüdeniz rotaları | `fethiye to dalaman airport transfer` |
| Fethiye ve Ölüdeniz | İşlem | Fethiye / Ölüdeniz rotaları | `dalaman to oludeniz transfer` |
| Fethiye ve Ölüdeniz | İşlem | Fethiye / Ölüdeniz rotaları | `oludeniz airport transfers` |
| Fethiye ve Ölüdeniz | İşlem | Fethiye / Ölüdeniz rotaları | `dalaman to oludeniz private transfer` |
| Fethiye ve Ölüdeniz | İşlem | Fethiye / Ölüdeniz rotaları | `dalaman to hisaronu transfer` |
| Fethiye ve Ölüdeniz | İşlem | Fethiye / Ölüdeniz rotaları | `dalaman airport to ovacik transfer` |
| Diğer destinasyonlar | İşlem | Mevcut rotalar ve doğrulanmış kapsam | `dalaman to gocek transfer` |
| Diğer destinasyonlar | İşlem | Mevcut rotalar ve doğrulanmış kapsam | `gocek airport transfer` |
| Diğer destinasyonlar | İşlem | Mevcut rotalar ve doğrulanmış kapsam | `dalaman airport to gocek marina transfer` |
| Diğer destinasyonlar | İşlem | Mevcut rotalar ve doğrulanmış kapsam | `dalaman to dalyan transfer` |
| Diğer destinasyonlar | İşlem | Mevcut rotalar ve doğrulanmış kapsam | `dalyan airport transfers` |
| Diğer destinasyonlar | İşlem | Mevcut rotalar ve doğrulanmış kapsam | `dalaman airport transfers to sarigerme` |
| Diğer destinasyonlar | İşlem | Mevcut rotalar ve doğrulanmış kapsam | `dalaman airport to sarigerme taxi` |
| Diğer destinasyonlar | İşlem | Mevcut rotalar ve doğrulanmış kapsam | `dalaman airport to calis beach transfer` |
| Diğer destinasyonlar | İşlem | Mevcut rotalar ve doğrulanmış kapsam | `dalaman airport to kalkan private transfer` |
| VIP / grup / aile | Ticari / işlem | Araçlar + uygun rotalar | `dalaman vip transfer` |
| VIP / grup / aile | Ticari / işlem | Araçlar + uygun rotalar | `dalaman luxury airport transfer` |
| VIP / grup / aile | Ticari / işlem | Araçlar + uygun rotalar | `mercedes vito transfer dalaman airport` |
| VIP / grup / aile | Ticari / işlem | Araçlar + uygun rotalar | `dalaman airport minibus transfer` |
| VIP / grup / aile | Ticari / işlem | Araçlar + uygun rotalar | `dalaman airport transfer for 8 passengers` |
| VIP / grup / aile | Ticari / işlem | Araçlar + uygun rotalar | `dalaman airport transfer with child seat` |
| VIP / grup / aile | Ticari / işlem | Araçlar + uygun rotalar | `family airport transfers dalaman` |
| VIP / grup / aile | Ticari / işlem | Araçlar + uygun rotalar | `private group transfer dalaman airport` |
| VIP / grup / aile | Ticari / işlem | Araçlar + uygun rotalar | `dalaman airport transfer with luggage` |
| Fiyat ve rehber | Ticari / bilgi | Rotalar, fiyat ve SSS | `cheap dalaman transfers` |
| Fiyat ve rehber | Ticari / bilgi | Rotalar, fiyat ve SSS | `dalaman airport transfer prices` |
| Fiyat ve rehber | Ticari / bilgi | Rotalar, fiyat ve SSS | `dalaman to marmaris transfer cost` |
| Fiyat ve rehber | Ticari / bilgi | Rotalar, fiyat ve SSS | `dalaman to fethiye taxi price` |
| Fiyat ve rehber | Ticari / bilgi | Rotalar, fiyat ve SSS | `dalaman airport taxi vs private transfer` |
| Fiyat ve rehber | Ticari / bilgi | Rotalar, fiyat ve SSS | `how to get from dalaman airport to marmaris` |
| Fiyat ve rehber | Ticari / bilgi | Rotalar, fiyat ve SSS | `how to get from dalaman airport to oludeniz` |
| Fiyat ve rehber | Ticari / bilgi | Rotalar, fiyat ve SSS | `where to meet transfer driver at dalaman airport` |
| Fiyat ve rehber | Ticari / bilgi | Rotalar, fiyat ve SSS | `dalaman airport transfer flight delay` |

## 8. DalamanWay site denetimi

| Alan | Canlı gözlem | Render test gözlemi | Kod / açıklık |
|---|---|---|---|
| Ana sayfa | HTTP 200, tek H1, İngilizce statik metin, canonical | HTTP 200, `noindex,nofollow` | EN/DE/RU dil seçimi. Türkçe katalog veya URL bu kapsamda bulunmadı |
| Filo | HTTP 200, index ve self-canonical. Rezervasyonda dört araç ve yolcu/valiz sınırı göründü | HTTP 200, test noindex | VIP Vito, Ultra VIP Vito, Sprinter, Ultra Sprinter. Üç markalı dış görsel yerel. Diğer dış ve bazı iç görseller harici |
| Transfer adımı | 390 px’de yatay taşma yok. Tek yön, dönüş, uçuş numarası, çocuk koltuğu sayacı ve özet mevcut. Marmaris fiyatı görüntülendi | Form açıldı. Aynı Marmaris fiyatı görüntülendi | Araç kapasitesi ve katalog doğrulaması mevcut. Gerçek uçuş takibi garantisi bu kapsamda doğrulanmadı |
| Yolcu ve son adım | Adresler 200/noindex. İlgili akış kişisel veri girilmeden incelendi | Adresler 200/noindex | Yolcu alanlarında ad, telefon, e-posta ve adres. `bookingPassengerInfo` kalıcı `localStorage` kullanıyor. Talep, operatör yanıtı ve onay akışı mevcut |
| Rotalar | Yedi İngilizce rota ve Almanca/Rusça alternatifleri mevcut | Marmaris üç dilde 200/noindex | Rota ve fiyat sayfaları var. Henüz özgün rehberi olmayan katalog satırları için seri sayfa üretimi öncelikli değil |
| İletişim / SSS / hizmetler | 200. İletişimde e-posta ve rezervasyon referansıyla destek talimatı görüldü | Aynı sayfa türleri 200 | FAQ değişiklik ve uçuş gecikmesi konusunda temel metin sağlıyor. Kesin bekleme ve yanıt süresi doğrulanmadı |
| Hakkımızda / şartlar / gizlilik | `/about`, `/terms`, `/privacy` 404. Rezervasyonun gözlenen ekranında ilgili politika bağlantısı bulunmadı. Analytics tercih düğmesi var | Aynı örnek yollar 404 | Özel şartlar/gizlilik rotası router listesinde bulunmadı. Öneri işletmece onaylanmış metin ve görünür bağlantı |
| Yorumlar / rezervasyon yönetimi | `/reviews` 200. `/booking/lookup` 200/noindex | İkisi de 200 | Yorum sayfası ve değişiklik/iptal talep yolu mevcut. E-posta teslimi, doğrulanmış müşteri etiketi ve self-servis otomasyon ayrıca değerlendirilir |
| Analitik | UK GA4 ve Search Console verisi alınamadı | Ölçüm doğrulaması ayrıca gerekli | Rızaya bağlı sayfa ve rezervasyon olayları kodda zaten mevcut. Yeni olay eklemeden önce mevcut olay zinciri doğrulanmalı |

**Kanıt bağlantıları:** [Canlı](https://dalamanway.com/) · [Canlı booking](https://dalamanway.com/booking) · [Test booking](https://vip-transfer-dalaman-test.onrender.com/booking) · [Fiyat API’si](https://dalamanway-api-prod.onrender.com/route-prices) · [Sabitlenmiş yolcu kaynak kodu](https://github.com/Alisnmez/vip-transfer-dalaman/blob/f06ac1c10cdb54a1e44a8e60535607bc72fad2d0/frontend/src/pages/public/BookingPassengerPage.tsx) · [Router](https://github.com/Alisnmez/vip-transfer-dalaman/blob/f06ac1c10cdb54a1e44a8e60535607bc72fad2d0/frontend/src/app/router.tsx) · [Analitik kodu](https://github.com/Alisnmez/vip-transfer-dalaman/blob/f06ac1c10cdb54a1e44a8e60535607bc72fad2d0/frontend/src/features/analytics/analytics.ts)

## 9. Teknik SEO karşılaştırması

- **Canlı:** [Sitemap](https://dalamanway.com/sitemap.xml) içindeki 28/28 benzersiz URL HTTP 200, self-canonical, meta açıklama ve tek ilk-HTML H1 döndürdü. 21 rota dil URL’sinin her birinde `en`, `de`, `ru`, `x-default` alternatifleri karşılıklı eşleşti. Ana sayfada bir JSON-LD bloğu görüldü. Örnek Marmaris rota sayfalarında JSON-LD bloğu yoktu. Bu bulgu tek başına eksiklik veya zengin sonuç önerisi yaratmaz. [Canlı robots](https://dalamanway.com/robots.txt) admin taramasını engelliyor. Dört rezervasyon yolu sitemap dışında ve noindex.
- **Test:** [Robots](https://vip-transfer-dalaman-test.onrender.com/robots.txt) tüm taramayı engelliyor. [Sitemap](https://vip-transfer-dalaman-test.onrender.com/sitemap.xml) boş. Örnek sayfalar noindex ve production canonical taşımıyor. [Google çok dilli sayfalar](https://developers.google.com/search/docs/specialty/international/localized-versions)
- **Rakip ilk HTML örneği:** DT rota merkezi EN/TR/RU ve dört JSON-LD bloğu, ATT rehberi sekiz dil ve üç blok, ST örnek rotası sekiz dil ve iki blok, SUN Dalaman sayfası çok sayıda dil alternatifi ve iki blok, DGT EN sayfası dört dil ve bir blok. WP örnek rezervasyon sayfası EN/FR ve üç blok. DTP yardım sayfasında meta açıklama bulunmadı. VDT fiyat sayfasında birden çok H1 görüldü. MT ana sayfası ilk HTML’de H1 içermiyordu. DAT örnek ana sayfasında noindex görüldü. HTML gözlemleri §4 URL’lerine aittir. Bunlar indeks veya sıralama verisi değildir.
- **İndeks:** Search Console’da güncel URL denetimi, UK gösterimleri ve tıklamalar bu çalışma sırasında alınamadı. Teknik olarak indekslenebilir olmak, Google indeksine kabul edilme veya ilk sayfa anlamına gelmez. [Search Console performans raporu](https://support.google.com/webmasters/answer/7576553?hl=en)
- **Performans:** Canlı ana sayfa için mobil PageSpeed API isteği HTTP 429 `RESOURCE_EXHAUSTED` döndürdü. Başarılı laboratuvar LCP/CLS ölçümü veya CrUX saha LCP/CLS/INP verisi alınmadı. Mobil taşma kontrolü hız ölçümü değildir. Bir sonraki karşılaştırmada ana sayfa, Marmaris ve booking için aynı ağ/cihazla ayrı ayrı üç laboratuvar koşusu. Uygun veri varsa CrUX ile 75. yüzdelik LCP/INP/CLS ayrı. [PageSpeed Insights veri türleri](https://developers.google.com/speed/docs/insights/v5/about)
- **Kopya ve iç link:** Yedi mevcut rota üzerinde önce farklılaştırılmış yerel bilgi ve iç bağlantı derinliği artırılabilir. Fiyat kataloğundaki her otel için benzer metinli sayfa açmak ertelenmeli. Özgün rota/ulaşım kararlarına ve ilgili rezervasyon bağlantılarına öncelik verilmeli. [Google spam ve doorway politikası](https://developers.google.com/search/docs/essentials/spam-policies)
- **Yerel SEO:** Google Business Profile’ın varlığı ve hak sahipliği doğrulanmadı. Gerçek işletme türü ve Türkiye’deki hizmet alanı uygunluğunu kontrol et. UK hedeflemesi için UK’de karşılanabilir işletme adresi iddiası kullanılmamalı. [Google Business Profile kuralları](https://support.google.com/business/answer/3038177?hl=en)

## 10. UX ve rezervasyon dönüşümü

1. **Trafiği yolcu formuna girme oranıyla izle.** Mobil rezervasyon ekranında önce rota/tarih, ardından dört araç, kapasite sayaçları ve en altta özet geliyor. Rota seçildiğinde “Estimated Total” görünür, ancak kapsamı ve işletme onayının ne zaman gerektiği aynı noktada daha açık hale getirilebilir. Mobilde kısa fiyat/ilerleme özeti ve aşağıya atlama bağlantısı küçük örneklemle test edilir.
2. **Güveni iki kritik noktada göster.** Rota sayfasında fiyatın yanında araç başı toplam, ödeme zamanı ve karşılama. Gönderimden hemen önce onaylı iptal koşulu, gizlilik bildirimi ve talep/onay farkı. Ana sayfanın üstünü rozet yığınına çevirmeye gerek yok.
3. **Mevcut akışı küçültmeden doğrula.** Zaten tarih, dönüş, uçuş, araç, yolcu, bagaj, çocuk koltuğu, özel istek ve rezervasyon özeti var. Bunlar yeniden geliştirme listesine girmemeli. Ayrı iş, kritik etiketlerin ve fiyatın aynı anlamı taşıması ve mobil ekranda erişilebilir kalması.
4. **Kişisel veri riski P0.** Paylaşılan cihazda önceki yolcunun verisi kalabilir. Üretim üzerinde kişisel veriyle yeniden üretim yapılmadı. Kod kanıtına dayanarak oturum kapsamı, eski anahtar temizliği, geri/yenileme ve başarısız gönderim senaryoları test listesine girer.
5. **Dönüşümün ticari karşılığı.** Rezervasyon talebi, operatör onayı ve tamamlanan transfer ayrı sayılmalı. Organik analiz için Search Console tıklamaları, davranış için rızalı site olayları, ticari ölçüm için kişisel veri içermeyen toplu operasyon sayıları.

## 11. Fiyat ve güven karşılaştırması

**Karşılaştırma şablonu:** Dalaman Havalimanı → Marmaris merkez otel, dört yolcu, dört büyük valiz, özel minivan, biri tek yön biri aynı gidiş ve dönüş. Tam tarihli teklif aşamasında örnek 10 Haziran 2027, 15.00 yerel ve dönüş 17 Haziran, 10.00. Aşağıdaki fiyatlar katalog/halka açık rotadan. Verilen tarihte kapasite ve nihai rezervasyon teklifi doğrulanmadı.

| Marka ve araç | Tek yön | Dönüş | Kapsam |
|---|---:|---:|---|
| DalamanWay VIP Vito, Marmaris | £47,50 | £95 | 5 yolcu / 5 bagaj. Canlı ve test formunda görüldü. Son işletme koşulları ayrıca doğrulanmalı |
| VIP Dalaman Transfers Private VIP Minivan | £50 | £100 | 5 yolcu / 6 bagaj tablosu. Sedan £45 satırı farklı kapasite |
| Dalaman Travel Vito | £65 | Veri bulunamadı | Rota sayfası 1–4 yolcu, kişi başına bir büyük ve bir el bagajı beyanı |
| Airports Transfer Turkey Mercedes Vito | €96’dan | Veri bulunamadı | Marmaris rehberindeki başlangıç fiyatı, 6 yolcuya kadar. Farklı rehberde başka başlangıç fiyatı görülüyor |
| Dalaman Go Transfer | €67 örnek rota | Veri bulunamadı | Araç sınıfına göre kesin dört yolcu/dört valiz teklifi doğrulanmadı |
| Marmaris Transfers, DAT, SooTransfer, DTP, SUN ve WP | Eşdeğer teklif doğrulanmadı | Eşdeğer teklif doğrulanmadı | Örnek farklı para birimi, farklı rota, dinamik arama veya eksik araç eşlemesi |

Kaynaklar §4, §8 ve [VDT fiyat tablosu](https://www.vipdalamantransfers.com/pricelist/). Aynı katalog segmentinde DalamanWay’in £47,50 fiyatı VDT’nin £50 fiyatından £2,50 düşük. Bu fiyat farkı, yolculuk koşulları veya kâr farkı hakkında veri vermez. EUR ve TRY rakamları tarihli nihai GBP teklifi olmadan çarpıştırılmadı.

## 12. Eksikler ve fırsatlar

Öncelik ve süreler uzman tahmini. Efor kişi-gün ve işletme karar süresini kapsamıyor. **D** bir fark doğrudan gözlendi, **K** kod / dış doğrulama gerekiyor, **H** fırsat hipotezi. Kaynak kimlikleri §4’teki bağlantılara karşılık gelir. DW kanıtları §8–11’de. Fiyat, ödeme ve vaatlerde işletme kararı şart.

| ID / öncelik | İyileştirme ve mevcut kanıt | Müşteri / işletme faydası | Efor / bağımlılık | Başarı ölçüsü ve kabul |
|---|---|---|---|---|
| 01 P0 | Yolcu taslağı ve eski anahtar temizliği · DW kod, K | Ortak cihazda mahremiyet / veri riskini azaltma | 1–2, saklama kararı | 0 kalıcı yolcu PII. Geri, yenileme, sekme, hata ve başarı testi |
| 02 P0 | Görünür, onaylı gizlilik metni · DAT/DW 404, D | Veri kullanımını anlama / destek ve uyum | 1–2, işletme ve metin onayı | Formdan ve alt menüden 200. Üç dilde içerik ve klavye kontrolü |
| 03 P0 | İptal/değişim metni ve bağlantısı · DAT/DT/SUN, D | Beklentiyi anlama / anlaşmazlık azaltma | 1, işletme kuralı | Aynı süre ve koşul, rota/form/e-posta metinlerinde |
| 04 P0 | Tarife ve ücret kapsamı onayı · DT/VDT/DW, D | Sürpriz ücret azalır / fiyat hatası önlenir | 1–2, operasyon hesabı | Örnek rotalarda form, API ve onay e-postası aynı GBP tutarı |
| 05 P0 | E-posta teslimini staging’de kanıtla · VDT/DW kod, K | Talebi izleme / kayıp müşteri azaltma | 1–2, test alıcıları | Alındı ve onay e-postası ayrı. Tek gönderim ve başarısızlık kaydı doğrulanır |
| 06 P0 | Filo medyası izin, kaynak ve süreklilik · ST/DW, K | Araç güveni / kırık görsel azalır | 1–2, kaynak araçlar | Her kullanılan görsel için izin kaydı, Chrome ve mobil başarılı yükleme |
| 07 P1 | GBP araç başı ve dahil olanlar satırı · DT/VDT, D | Fiyatı anlamlandırır / fiyat sorusu azalır | 0,5–1, 04 | 390 px’de fiyatla beraber görülebilir. Ölçüm fiyat→sonraki adım |
| 08 P1 | Talep alındı ve kesin onay metni · WP/VDT/DW, K | Seyahat durumunu anlar / yanlış beklenti azalır | 0,5–1, 05 ve operasyon | Form ve test e-postasında doğru durum, tarih ve referans eşleşir |
| 09 P1 | Fotoğraflı terminal buluşma rehberi · MT, D | Havalimanında yön bulma / daha az arama | 1–2, kendi terminal fotoğrafları | Doğru terminal, ad tabelası ve ulaşılabilir kanal. Destek talepleri izlenir |
| 10 P1 | Uçuş gecikmesi ve bekleme süresi · DGT/DT, D | Belirsizlik azalır / gecikme yönetimi | 0,5–1, gerçek prosedür | Onaylı süre, başlangıç ve ek ücret kuralı. Erken/geç uçuş senaryosu |
| 11 P1 | Ödeme zamanı ve para birimi açıklığı · VDT/DT, D | Yanında doğru ödeme yöntemi / tahsilat | 0,5, işletme onayı | Nakit/kart ve GBP politikası her temas noktasında tutarlı |
| 12 P1 | Şirket ve yerel destek kimliği · DAT/DTP, D | Kime ulaşıldığı belli / güven artışı | 1, doğrulanmış işletme verisi | Gerçek kanala mobilde tek tık ve iş saatleri |
| 13 P1 | Mobilde kısa toplam ve sonraki adım · SUN/DGT/DW, H | Aşağı kaydırma azalır / adım geçişi artabilir | 1–2, yön/taşma kontrolü | 320/390/768 px, klavye ve çakışmayan düğmeler. Adım oranı izlenir |
| 14 P1 | Araç başına açıklamalı bagaj örneği · ST/DT, D | Araç uyumu / son dakika araç değişimi azalır | 0,5–1, doğrulanmış fiziksel ölçü | Araç ve form aynı kapasite. Fazla bagajda net yönlendirme |
| 15 P1 | Çocuk koltuğu tiplerinin açıklaması · DGT/SUN, D | Aile hazırlığı / operasyona net talep | 1–2, stok/ücret kararı | Koltuk tipi, sayı, onay ve gerekiyorsa ücret açık |
| 16 P1 | Doğrulanabilir yorum kaynağı ve izinli galeri · SUN/WP/DW, K | Güven / kaliteli sosyal kanıt | 1, kaynak ve izin | Kaynak bağlantısı. Uydurma puan veya yorum eklenmez |
| 17 P1 | Onay sayfası ve e-postada kısa transfer özeti · VDT/WP, K | Uçuş ve araç hatası erken fark edilir / daha az düzeltme | 1–2, 05 | Rezervasyon referansı, tarih, fiyat ve destek aynı |
| 18 P1 | Rota başında fiyat + booking CTA · DT/ATT, D | Rota kararı kolay / daha çok CTA | 1, dinamik fiyat bağlantısı | Marmaris/Fethiye/Ölüdeniz CTA doğru rotayı seçer |
| 19 P1 | Mevcut rızalı huniyi doğrulama · DW kod, K | Daha az sürtünme / doğru yatırım kararı | 1–2, GA4 erişimi | İzin yokken olay yok. Gönderim bir kez ve PII olmadan ölçülür |
| 20 P1 | GSC UK başlangıç kayıtları · DW, K | İlgili sayfa / görünürlük takibi | 0,5, dışa aktarım | UK sayfa+sorgu trendi ve indeks durumunun tarihli kaydı |
| 21 P2 | Marmaris/Fethiye/Ölüdeniz karar rehberi · ATT/ST, D | Otobüs, taksi, özel kıyasına cevap / organik giriş | 2–4, güncel yerel bilgi | Üç özgün sayfa, güncelleme tarihi ve doğru iç linkler |
| 22 P2 | İçmeler, Dalyan, Göcek, Sarıgerme yerel içerik · DT/ATT, D | Buluşma/rota bilgisi / long-tail | 2–4, GSC verisi | Her sayfada kendine özgü bilgiler, şablon kopyası az |
| 23 P2 | Rezervasyona otel/marina önerisi · DGT/DAT, D | Daha az adres hatası / dispatch verimi | 2–4, veri/harita maliyeti | Manuel adres alternatifi ve yanlış eşleşme testi |
| 24 P2 | Ek durak veya büyük bagaj teklif yolu · MT/SUN, D | Özel ihtiyaç çözülür / nitelikli talep | 1–2, fiyat ve hizmet alanı | Sabit fiyat gibi gösterilmeden talep oluşur, testte operasyona ulaşır |
| 25 P2 | Dönüş ayağını ayrı operasyon listesinde ele alma · DW kod, H | Dönüş unutulmaz / takip kolay | 2–3, veri modeli ve kapsam | Gidiş/dönüş aynı referansla doğru gün ve sırada, çift sayım yok |
| 26 P2 | Mobil performans başlangıç ölçümü · PSI 429, K | Daha hızlı gezinme / kaybın ölçümü | 1–2, cihaz ve saha veri erişimi | Üç URL için tekrar ölçüm, laboratuvar ve saha ayrı |
| 27 P2 | Google Business Profile uygunluğu · Google/DW, K | Yerel doğrulama / ilgili görünürlük | 0,5–1, işletme yetkisi | Yetkili gerçek hizmet alanı, tutarlı bilgi. Uygunluk teyidi |
| 28 P2 | Küçük UK arama reklamı pilotu · §7, H | Doğru sorgudan doğru rota / edinme maliyeti | 1–2 + onaylı bütçe, 19/20 | Ölçülmüş onaylı rezervasyon maliyeti ve durdurma eşiği |
| 29 P3 | Otel/villa iş ortaklığı pilotu · DGT/WP, D | Kolay rezervasyon / kaynak çeşitliliği | 3–5, ticari anlaşma | Birkaç doğrulanmış partner ve atfedilebilir tamamlanan transferler |
| 30 P3 | Sürücü/karşılama bildirim otomasyonu · DGT/WP, D | Buluşma güveni / daha az manuel mesaj | 3–5, izin ve dispatch süreci | Testte yanlış alıcıya görünüm yok, teslim durumu ve yedek kanal |

## 13. Öncelikli geliştirme listesi

İlk on işin sırası, **güvenilirlik riski + rezervasyona yakınlık + düşük efor** üzerinden. Tahmini dönüşüm artışı yüzdesi verilmedi.

| Sıra | İş | Kabul göstergesi |
|---:|---|---|
| 1 | 01 Yolcu taslağı | Kalıcı yolcu verisi yok, akış ve eski kayıt temizliği testli |
| 2 | 04 ve 07 Fiyat kapsamı | Üç pilot rotada site, form ve toplam GBP eşleşir. Kapsam fiyatın yanında |
| 3 | 03 ve 11 İptal ve ödeme özeti | Doğrulanmış koşul formda ve destek içeriğinde aynı |
| 4 | 05 ve 08 Talep/onay iletişimi | Durumlar doğru ve staging e-posta teslimi geçer |
| 5 | 02 Gizlilik bildirimi | Rezervasyon ekranından üç dilde erişilebilir |
| 6 | 09 ve 10 Karşılama ve gecikme | Gerçek fotoğraf, işlem adımları ve onaylı süre |
| 7 | 12 İşletme kimliği | Gerçek iletişim kanalı ve sorumlu işletme belli |
| 8 | 13 Mobil fiyat ve devam | 390 px’de taşma yok, fiyat daha erken görülebilir |
| 9 | 18 Rota CTA ve fiyat | Üç rotada rezervasyon hedefi doğru |
| 10 | 19 ve 20 Ölçüm | UK başlangıç ölçümü ve rızalı, PII’siz huni |

## 14. 30 / 60 / 90 günlük plan

| Zaman | Çalışma | Ölçülebilir çıkış |
|---|---|---|
| İlk 7–14 gün | P0 taslak, izin/koşul ve e-posta doğrulaması. Örnek GBP fiyat ve operasyon şartları onayı | 0 kalıcı yolcu PII. Testte iki e-posta durumu. Fiyat, iptal ve ödeme metni aynı |
| 15–30. gün | Fiyat kapsamı, geliş/karşılama, mobil CTA ve işletme bilgisi. UK Search Console başlangıç ölçümü | Üç pilot rota ve mobil akış doğrulandı. UK 28 günlük temel metrikler kayıtlı |
| 31–60. gün | Birinci pilot rotalara özgün ulaşım seçenekleri ve yerel SSS. Mobil hız tekrar ölçümü. Yerel görünürlük uygunluk kontrolü | Üç sayfa iç linkli ve indeks denetimi tamam. Hızın ölçüm kaynağı belli |
| 61–90. gün | İkinci rota grubunu UK sorgularına göre seç. Ölçüm geçerse onaylı küçük Ads pilotu ve bir partner denemesi | UK sorgu/sayfa performans karşılaştırması. Talep, onay ve maliyet ayrı. Düşük katkılı pilot durur |
| Sonra | Otomasyon, daha gelişmiş ödeme/partner sistemi ve analitik | Destek yükü, tekrar rezervasyon ve katkı kârı ölçülebiliyorsa iş gerekçesi oluşturulur |

Her uygulama ayrı dal/PR → CI → Render test → kullanıcı incelemesi ve açık onay → canlı. Bu işlem rapor güncellemesi.

## 15. Pazarlama ve müşteri edinimi

- **Konumlandırma:** İngilizce konuşan müşteriye, Dalaman’dan iyi açıklanmış özel transfer. GBP araç başı fiyat, gerçek kapasite ve net yerel karşılama. Ucuzluk, her müşteri için tek başına karar nedeni varsayılmamalı. Standart VIP ile Ultra kategorinin farkı satın almadan önce açıklanmalı.
- **Organik:** Önce Marmaris, Fethiye ve Ölüdeniz. Aynı sorgu kümesini sahiplenen iki sayfa açmak yerine mevcut rota sayfasına özgün bilgi ve CTA ekle. Taksi/otobüs rehberleri yüksek satın alma niyetli rota sayfalarına bağlantı versin.
- **Ads adayları:** `[dalaman to marmaris transfer]`, `[dalaman to fethiye transfer]`, `[dalaman to oludeniz transfer]`; doğrulanmış veriye göre özel transfer ve VIP varyantı. Rota başına eşleşen sayfa. Sadece taksi durağı veya iş ilanı gibi hizmet dışı niyetleri arama terimleri raporundan izle. Kampanya ve harcama kullanıcı onayıyla değerlendirilir.
- **Ekonomi:** Adedi bilinmeyen dönüşüm oranına göre bütçe çıkarma. Örnek senaryo, **varsayım** olarak £0,80 tıklama, %4 talep ve taleplerin %50’si onaylıysa, onaylı rezervasyon edinme maliyeti £40. Bu bir pazar CPC’si veya öngörü değildir. Eşik, komisyon/indirim/iade ve araç maliyetlerinden sonraki transfer katkı kârına göre belirlenmeli. Mobil/masaüstü ve UK ülke düzeyini ayır.
- **Toplanacak:** Search Console UK 28/90 gün, erişilebilir UK Keyword Planner tarihsel CSV, gerçek teyit/iptal/toplam sayıları ve rotaya göre katkı maliyeti. Rakip site geneli trafik bu girdilerin yerine geçmez.

## 16. Riskler, varsayımlar ve doğrulanmamış iddialar

- Gerçek coğrafi UK Google SERP, reklam ve harita verisi eksik.
- Keyword Planner erişimi, UK hacim/CPC, organik zorluk ve arama mevsimselliği eksik. Google Trends ziyaret sayısı değildir.
- Sekiz yerel/bölgesel rakipte kamuya açık trafik sayısı bulunamadı. İki platform tahmini Dalaman ya da VIP alt pazar büyüklüğünü açıklamaz.
- Rakip nihai teklif, ödeme ve satış sonrası akış yok. Açık sayfadaki iade, lisans, ücretsiz ekipman veya gecikme vaatleri işletme bazında ayrıca doğrulanmalı.
- PSI kota engeli, mobil laboratuvar ve CrUX verisi eksik. Rakip mobil etkileşimlerinin tamamı test edilmedi.
- DalamanWay’in dönemsel dönüşüm, ticari marj ve e-posta teslim sonuçları bu denetimde bağımsız olarak ölçülmedi.
- CAA yıllık yolcu hareketleri UK ulaşım göstergesidir. Tekil turist veya transfer müşterisi olarak okunmaz.

## 17. Kaynak ve kanıt dizini

Tüm yeni kaynaklar **20 Kasım 2026** tarihinde incelendi. Alan adı profillerinin birincil bağlantıları §4, trafik araçları §6, HTTP ve kod adresleri §8–9’dadır. Önceki iç araştırmalar [yayın sonrası plan](CANLI_YAYIN_SONRASI_GELISTIRMELER.md), [eksik ve yayın kapıları](EKSIKLERIMIZ.md) ve [dört pazar SEO eki](SEO_FOUR_MARKETS_RESEARCH_2026-11-19.md) ile izlenir.

Ek yöntem kaynakları: [Google Ads Keyword Planner](https://support.google.com/google-ads/answer/3022575?hl=en) · [Google Trends](https://support.google.com/trends/answer/4365533?hl=en) · [Google Search Console](https://support.google.com/webmasters/answer/7576553?hl=en) · [Google uluslararası SEO](https://developers.google.com/search/docs/specialty/international/localized-versions) · [Google PSI](https://developers.google.com/speed/docs/insights/v5/about) · [Google işletme profili](https://support.google.com/business/answer/3038177?hl=en) · [CAA ulaşım](https://www.caa.co.uk/Documents/Download/24007/87fb7670-4e10-4aeb-942d-509238aa25a1/17511).

## 18. Nihai öneri

1. **Rakipler nerede daha iyi?** DT fiyat kapsamını rota sayfasında anlatıyor, MT gerçek buluşma sorusuna fotoğraflarla cevap veriyor, ATT ulaşım seçeneklerini karşılaştırıyor, büyük platformlar onay ve iptal akışını daha erken açıklıyor. Filo, GBP katalog ve teknik rota yerelleştirmesi DalamanWay’de zaten var.
2. **İlk on iş hangileri?** §13’teki sıra. İlk teslimatta saklama güvenliği, onaylı GBP fiyat kapsamı, rezervasyon koşulları ve test e-posta senaryosu öne çıkıyor. Sonra güven ve mobil dönüşüm.
3. **90 gün sırası ne?** Güven ve doğru teklif → mobil rezervasyon ölçümü → üç özgün rota → Search Console ve maliyet verisiyle kontrollü edinim. Daha fazla destinasyon, ödeme sağlayıcısı ve otomasyon ancak mevcut akıştan gelen veri ihtiyacı gösterirse.


---

# Arşiv eki — docs/BRANCH_WORKFLOW_HANDOFF_2026-11-21.md (feature/booking-integration)

Kaynak blob: `41ba82942ee660658e1b836a18e1016a4a66a067`. Tarihsel içerik, yeniden doğrulanmadı.

# DalamanWay — Branch Haritası, Çakışma Güvenliği ve Sohbet Devri

**Tarih:** 2026-11-21. **Depo:** `Alisnmez/vip-transfer-dalaman`. **Kapsam:** GitHub'da görülen 57 branch, 5 açık PR. **Bu belge bir anlık görüntüdür; işlemden önce GitHub/Render tekrar okunmalı.** Hiçbir branch silinmedi, birleştirilmedi veya yeniden adlandırılmadı.

## Yeni sohbete verilecek talimat

> Önce `docs/BRANCH_WORKFLOW_HANDOFF_2026-11-21.md` ve `frontend/SEO_STANDARD.md` dosyalarını GitHub'da **güncel branch'lerinden** oku. Tüm branch HEAD'lerini, açık PR'ları, Render servislerinin source branch ve deployed commit'lerini yeniden doğrula. `main` ile `feature/booking-integration` ayrışmış; eski SEO branch'lerini doğrudan merge etme. Mevcut dosyaları eski kopyalarla overwrite etme. Her iş için güncel entegrasyon temelinden izole branch/PR ve test/staging kullan. İlgili branch'teki benzersiz değişiklikleri diff ile incele, sonra devam et. Bu belgeyi yeni tarihli kanıtla güncelle; eski kayıtları koru.

## 1. Doğrulanmış aktif durum

- Entegrasyon temeli: `feature/booking-integration` — `8e29062eee`.
- SEO çalışma dalı: `feature/seo-next-steps-20261121` — `508a594fb3`; entegrasyona göre **3 ahead / 0 behind**. Değişen dosyalar yalnızca `frontend/scripts/audit-live-seo.mjs` ve `.github/workflows/live-seo-audit.yml`.
- SEO commitleri: `230f457` (ilk salt-okunur audit), `9f2d914` (regex düzeltmesi), `508a594` (manuel/haftalık workflow). **Workflow çalışması ve canlı HTTP başarı sonucu henüz doğrulanmadı.** Varsayılan branch'te olmayan zamanlanmış workflow otomatik çalışıyor varsayılmamalı.
- `feature/private-review-import-20261121` entegrasyonla aynı HEAD; geçmiş yorum aktarımıyla ilgili. SEO için tekrar import yapılmaz.
- `main` entegrasyona göre **22 ahead / 7 behind**; `main` → entegrasyon körlemesine merge edilmez.
- Eski `feature/seo-audit-checks-20261119` entegrasyona göre **1 ahead / 72 behind** ve farkında `frontend/src/pages/public/HomeReviewStrip.tsx` var. SEO isimli dalın yalnızca SEO dosyaları içerdiği varsayılmamalı.
- `docs/uk-competitor-deep-research-20261120` **2 ahead / 41 behind**; araştırma yanında `HomeReviewStrip.tsx` farkı da var. PR #28 doğrudan merge edilmemeli.
- `docs/project-documentation-hub-20261121` **1 ahead / 1 behind**; dokümantasyon merkezi ayrı dalda, entegrasyonla otomatik eşit değil.
- Daha eski branch incelemesi: `docs/BRANCH_CLEANUP_INVENTORY_2026-11-19.md` (`docs/branch-inventory-20261119` dalında). Oradaki 65 branch karşılaştırması eski HEAD'e aittir; hiçbir silme önerisi otomatik uygulanmaz.

## 2. Açık PR'lar — dokunmadan önce kontrol et

| PR | Kaynak | Hedef | Konu |
|---|---|---|---|
| #42 | `codex/form-validation-review-presentation` | `feature/booking-integration` | Share form validation and add a labeled review presentation |
| #28 | `docs/uk-competitor-deep-research-20261120` | `feature/booking-integration` | docs: DalamanWay UK rakip analizi ve 90 günlük yol haritası |
| #26 | `fix/privacy-transfer-storage-consistency-20261119` | `fix/session-booking-privacy-20261119` | fix(privacy): use sessionStorage consistently for transfer draft |
| #22 | `fix/session-booking-privacy-20261119` | `feature/booking-integration` | fix(privacy): session-scoped booking drafts and receipt |
| #16 | `main` | `integration/safe-main-work-20261119` | WIP: safely integrate main-only changes into verified production baseline |

Bu PR'lar açıktır; eşzamanlı Work/Codex değişikliklerini takip et. PR #16'nın hedefi `integration/safe-main-work-20261119`; doğrudan entegrasyon dalı değildir.

## 3. Tüm branch'ler ve amaçları

**Önemli:** Branch adı bir amaç ipucudur, doğrulanmış kod kapsamı değildir. Aşağıdaki her SHA 21 Kasım 2026 snapshot'ıdır. Herhangi bir branch'ten kod taşımadan önce `compare_commits`, ilgili commit diff'i ve PR/CI kontrolü zorunlu.

### Aktif ve korunan temeller (4)
- `feature/booking-integration` — `8e29062eee` — Güncel entegrasyon ve Render kaynak dalı.
- `feature/private-review-import-20261121` — `8e29062eee` — Geçmiş yorum aktarımı; entegrasyonla aynı commit.
- `feature/seo-next-steps-20261121` — `508a594fb3` — Aktif SEO çalışma dalı; yalnızca SEO audit betiği ve GitHub Actions iş akışı.
- `main` — `7cfec8738e` — Varsayılan dal; entegrasyonla ayrışmış; **AÇIK PR #16** → `integration/safe-main-work-20261119`.

### SEO ve pazar araştırması (9)
- `docs/uk-competitor-deep-research-20261120` — `9598590d45` — Adından anlaşılan kapsam: uk competitor deep research (içerik ayrıca doğrulanmalı); **AÇIK PR #28** → `feature/booking-integration`.
- `feature/seo-audit-checks-20261119` — `0011a7f52e` — Adından anlaşılan kapsam: seo audit checks (içerik ayrıca doğrulanmalı).
- `feature/seo-localized-route-pilot-20261119` — `7247ebfa28` — Adından anlaşılan kapsam: seo localized route pilot (içerik ayrıca doğrulanmalı).
- `feature/seo-route-content-20261119` — `1ead078363` — Adından anlaşılan kapsam: seo route content (içerik ayrıca doğrulanmalı).
- `feature/seo-route-expansion-20261119` — `5f70e34d71` — Adından anlaşılan kapsam: seo route expansion (içerik ayrıca doğrulanmalı).
- `research/international-seo-four-markets-20261119` — `734e6a4713` — Adından anlaşılan kapsam: international seo four markets (içerik ayrıca doğrulanmalı).
- `seo/complete-seven-route-locales` — `3ea4dc003b` — Adından anlaşılan kapsam: complete seven route locales (içerik ayrıca doğrulanmalı).
- `seo/fethiye-oludeniz-routing` — `35a41af0b6` — Adından anlaşılan kapsam: fethiye oludeniz routing (içerik ayrıca doğrulanmalı).
- `seo/route-vehicle-capacity` — `4a31e3c288` — Adından anlaşılan kapsam: route vehicle capacity (içerik ayrıca doğrulanmalı).

### Yorumlar, sunum ve ana sayfa (21)
- `codex/classroom-review-voice` — `79d78c86cc` — Adından anlaşılan kapsam: classroom review voice (içerik ayrıca doğrulanmalı).
- `codex/classroom-reviews-demo` — `4234076228` — Adından anlaşılan kapsam: classroom reviews demo (içerik ayrıca doğrulanmalı).
- `codex/default-staging-review-examples` — `9a680e818f` — Adından anlaşılan kapsam: default staging review examples (içerik ayrıca doğrulanmalı).
- `codex/expand-review-cards-and-fixtures` — `84d8c64904` — Adından anlaşılan kapsam: expand review cards and fixtures (içerik ayrıca doğrulanmalı).
- `codex/form-validation-review-presentation` — `c3064846e3` — Adından anlaşılan kapsam: form validation review presentation (içerik ayrıca doğrulanmalı); **AÇIK PR #42** → `feature/booking-integration`.
- `codex/home-fleet-photos` — `29c3117ec5` — Adından anlaşılan kapsam: home fleet photos (içerik ayrıca doğrulanmalı).
- `codex/input-review-current-20261120` — `2456599399` — Adından anlaşılan kapsam: input review current (içerik ayrıca doğrulanmalı).
- `codex/localized-classroom-reviews` — `7ca3b0ea87` — Adından anlaşılan kapsam: localized classroom reviews (içerik ayrıca doğrulanmalı).
- `codex/restore-test-reviews-20261121` — `2119cc3d13` — Adından anlaşılan kapsam: restore test reviews (içerik ayrıca doğrulanmalı).
- `codex/review-card-timestamps` — `bdfc0443dc` — Adından anlaşılan kapsam: review card timestamps (içerik ayrıca doğrulanmalı).
- `codex/review-db-transfer-20261120` — `961d9a1e1a` — Adından anlaşılan kapsam: review db transfer (içerik ayrıca doğrulanmalı).
- `codex/review-demo-disable-20261120` — `fff28548fc` — Adından anlaşılan kapsam: review demo disable (içerik ayrıca doğrulanmalı).
- `codex/review-form-jump` — `58449179e3` — Adından anlaşılan kapsam: review form jump (içerik ayrıca doğrulanmalı).
- `codex/run-review-smoke-in-ci` — `c70c685763` — Adından anlaşılan kapsam: run review smoke in ci (içerik ayrıca doğrulanmalı).
- `codex/seasonal-review-dates` — `ed1ba190b0` — Adından anlaşılan kapsam: seasonal review dates (içerik ayrıca doğrulanmalı).
- `codex/sync-homepage-review-feed` — `acb4c9b574` — Adından anlaşılan kapsam: sync homepage review feed (içerik ayrıca doğrulanmalı).
- `feature/home-review-card-parity-20261120` — `f7690e00e5` — Adından anlaşılan kapsam: home review card parity (içerik ayrıca doğrulanmalı).
- `feature/presentation-sample-reviews-20261120` — `2a2fb26b9c` — Adından anlaşılan kapsam: presentation sample reviews (içerik ayrıca doğrulanmalı).
- `feature/vehicle-photo-cards-20261120` — `362bdad91f` — Adından anlaşılan kapsam: vehicle photo cards (içerik ayrıca doğrulanmalı).
- `fix/home-vehicle-hover-20261120` — `1e0ed85f82` — Adından anlaşılan kapsam: home vehicle hover (içerik ayrıca doğrulanmalı).
- `fix/review-card-tests-20261120` — `39b6c7df24` — Adından anlaşılan kapsam: review card tests (içerik ayrıca doğrulanmalı).

### Rezervasyon, gizlilik ve e-posta (8)
- `fix/booking-session-privacy-20261119` — `713b68dd2b` — Adından anlaşılan kapsam: booking session privacy (içerik ayrıca doğrulanmalı).
- `fix/booking-terms-and-notifications-20261120` — `9d2fe0e02a` — Adından anlaşılan kapsam: booking terms and notifications (içerik ayrıca doğrulanmalı).
- `fix/privacy-transfer-storage-consistency-20261119` — `9f6e042b0f` — Adından anlaşılan kapsam: privacy transfer storage consistency (içerik ayrıca doğrulanmalı); **AÇIK PR #26** → `fix/session-booking-privacy-20261119`.
- `fix/session-booking-privacy-20261119` — `9997a3f0f0` — Adından anlaşılan kapsam: session booking privacy (içerik ayrıca doğrulanmalı); **AÇIK PR #22** → `feature/booking-integration`.
- `fix/uk-upgrades-booking-session-privacy-20261120` — `62febcbf0e` — Adından anlaşılan kapsam: uk upgrades booking session privacy (içerik ayrıca doğrulanmalı).
- `perf/email-dispatch-20261118` — `8c1323a05e` — Adından anlaşılan kapsam: email dispatch (içerik ayrıca doğrulanmalı).
- `refactor/shared-booking-storage` — `eacbac79a8` — Adından anlaşılan kapsam: shared booking storage (içerik ayrıca doğrulanmalı).
- `test/booking-session-privacy-e2e-20261119` — `75c0e7def9` — Adından anlaşılan kapsam: booking session privacy e2e (içerik ayrıca doğrulanmalı).

### Test ve tanılama (5)
- `diagnostics/production-readonly-capacity-20261118` — `69c1c81317` — Adından anlaşılan kapsam: production readonly capacity (içerik ayrıca doğrulanmalı).
- `test/admin-menu-verification-20261118` — `d01662ac59` — Adından anlaşılan kapsam: admin menu verification (içerik ayrıca doğrulanmalı).
- `test/automated-build-20261115` — `3762a56dfa` — Adından anlaşılan kapsam: automated build (içerik ayrıca doğrulanmalı).
- `test/isolated-booking-capacity-20261118` — `62c9a176e7` — Adından anlaşılan kapsam: isolated booking capacity (içerik ayrıca doğrulanmalı).
- `test/production-capacity-20261118` — `3caf77ab25` — Adından anlaşılan kapsam: production capacity (içerik ayrıca doğrulanmalı).

### Dokümantasyon, entegrasyon ve yayın (5)
- `codex/main-sync-candidate-20261120` — `7d33758908` — Adından anlaşılan kapsam: main sync candidate (içerik ayrıca doğrulanmalı).
- `docs/branch-inventory-20261119` — `5e7b3ba2bb` — Adından anlaşılan kapsam: branch inventory (içerik ayrıca doğrulanmalı).
- `docs/project-documentation-hub-20261121` — `c1e448d25b` — Adından anlaşılan kapsam: project documentation hub (içerik ayrıca doğrulanmalı).
- `integration/safe-main-work-20261119` — `e07815fb14` — Adından anlaşılan kapsam: safe main work (içerik ayrıca doğrulanmalı).
- `release/candidate-verified-staging-20261119` — `1116f2d93d` — Adından anlaşılan kapsam: candidate verified staging (içerik ayrıca doğrulanmalı).

### Güvenlik ve yedekler (5)
- `backup/main-before-booking-integration-2026-11-17` — `54cde10f14` — Adından anlaşılan kapsam: main before booking integration 2026 11 17 (içerik ayrıca doğrulanmalı).
- `safety/booking-integration-before-seo-20261119` — `82f6a31a5b` — Adından anlaşılan kapsam: booking integration before seo (içerik ayrıca doğrulanmalı).
- `safety/preserve-booking-integration-20261119` — `fa11c6a479` — Adından anlaşılan kapsam: preserve booking integration (içerik ayrıca doğrulanmalı).
- `safety/preserve-production-api-20261119` — `0694bd136b` — Adından anlaşılan kapsam: preserve production api (içerik ayrıca doğrulanmalı).
- `safety/preserve-production-web-20261119` — `fac9332ea6` — Adından anlaşılan kapsam: preserve production web (içerik ayrıca doğrulanmalı).


## 4. Güvenli çalışma protokolü — asla üstüne yazma

1. **Her oturum başlangıcında** GitHub branch listesi, HEAD SHA'ları, açık PR'lar ve Render deploy kaynaklarını tekrar oku. Bu belgenin SHA'sını güncel kabul etme.
2. Değiştirilecek dosyanın mevcut hedef branch blob SHA'sını al; başka bir dalda aynı dosyaya dokunulmuş mu `compare_commits` ile bak. Çakışan patch'leri elle uzlaştır; eski içerikle dosyayı tamamen değiştirme.
3. İş türüne göre ayrım yap: SEO için `feature/seo-next-steps-20261121` (önce güncelliğini karşılaştır); rezervasyon veya diğer işler için yeni ayrı branch. `main`, Render kaynak dalı ve açık PR head'lerini izinsiz doğrudan düzenleme.
4. Kod değişikliği → test/lint/build → PR diff/CI → staging smoke → kullanıcı onayı → kontrollü production deploy → canlı doğrulama. `KODLANDI`, `TEST GEÇTİ` ve `CANLIDA DOĞRULANDI` ayrı durumlar.
5. Staging verisi sentetik olmalı. Gerçek müşteri yorumlarını, kişisel bilgileri, SQL veri dökümlerini ve anahtarları public GitHub'a koyma. DB migrasyonu/yeniden import/branch silme/deploy işlemlerini açık gerekçe ve güvenlik kontrolü olmadan yapma.
6. Aynı anda başka bir Work oturumu değişiklik yapıyorsa önce son HEAD'i ve PR'ları yeniden oku. Force push, reset, toplu branch silme ve kör merge yapma.
7. Bu devir belgesini yeni tarihli **ek kayıt** ile güncelle; geçmiş kanıtları silme. Güncellemeden önce blob SHA kontrolü yap.

## 5. SEO devri — nerede kaldık?

- Ana SEO standardı: `frontend/SEO_STANDARD.md`. Dört pazar çalışması: `docs/SEO_FOUR_MARKETS_RESEARCH_2026-11-19.md`. UK araştırma PR #28'de.
- Önceki belgelenmiş canlı kontrol: 28 sitemap URL'si, 21 EN/DE/RU rota sayfası, 36/36 HTTP/HTML kontrolü; **tarihli geçmiş kanıt**, bugünkü garanti değil.
- 21 Kasım Search Console performans ZIP'i son 28 günde sorgu/sayfa/ülke/cihaz veri satırı içermiyordu. Site yeni; veri yokluğu indekslenmeme kanıtı değildir.
- Yeni audit workflow yalnızca feature branch'te. **Sonraki işlem:** CI çalıştırma imkânını kontrol et; gerçek production HTTP çıktısını elde et, başarısız URL varsa nedenini ayır. Sonra indeks raporu, içerik ve mobil performansa geç.
- İlk HTML'de canonical, robots, hreflang, sitemap, booking noindex ve 404 kontrolleri korunmalı. Mevcut fiyat/rezervasyon akışına ve review kartlarına SEO gerekçesiyle müdahale etme.

## 6. Devir notunun güvenilirlik sınırı

Bu envanter GitHub branch listesi ve açık PR kayıtlarıyla güncellendi; belirli kritik branch'lerde karşılaştırma yapıldı. **65 branch'in tamamının commit diff'i, CI sonucu, deploy bağımlılığı ve silinebilirliği tek tek doğrulanmış değildir.** Dolayısıyla listedeki amaçların çoğu isim temelli sınıflandırmadır; otomatik merge/silme kararı değildir.


## 7. 21 Kasım 2026 — SEO denetimi genişletme (sonraki çalışma)

- Başlamadan önce `feature/booking-integration` HEAD `8e29062eee`, `main` HEAD `7cfec8738e`, SEO çalışma dalı HEAD `e85ae56282` ve 5 açık PR tekrar kontrol edildi. Temel dallar değişmemişti.
- `frontend/scripts/audit-live-seo.mjs` güncellendi: canlı sitemap XML içinden 28 benzersiz URL'yi toplama; tamamında HTTP 200, **tam URL ile canonical eşleşmesi**, robots noindex olmaması; booking/admin noindex; iki geçersiz URL için HTTP 404; JSON satırları ve toplam hata sayısı.
- Kod commitleri: `89c6205034d94099f305b87fb58930ae0a94506b` ve `caf7741b1bc3885b4704da3bcc6368b2d166f035`.
- **Doğrulama sınırı:** GitHub'daki kaynak dosya yeniden okundu; Node.js syntax testi, GitHub Actions çalışması ve canlı HTTP audit sonucu henüz elde edilmedi. Kodun başarılı çalıştığını varsayma. Bir sonraki iş: Node syntax testi, workflow çalıştırma, gerçek çıktı ve gerekirse hata düzeltmesi.
- Üretim, staging, veritabanı ve diğer branch'lere müdahale edilmedi. Bu kayıt eklendiği için önceki bölümdeki SEO dalı HEAD'i tarihsel anlık görüntüdür; güncel HEAD'i yeniden kontrol et.


## 26 Kasım 2026 — Search Console ölçümü ve ilk rota çalışması

Web araması, alan adı mülkü, tüm ülkeler. Seçim: 3 ay. Grafikte veri bulunan aralık: 18–24 Kasım. 95 gösterim, 4 tıklama, %4,2 TO, ortalama konum 56,4. İngiltere: 64 gösterim, 0 tıklama, konum 61,4. Ana sayfa 4 tıklamanın tamamını aldı.

Marmaris: 27 gösterim / 0 tıklama / 63,2 konum. Dalyan: 12 / 0 / 25,0. Öncelik: İngiltere filtresinde Marmaris URL’sinin sorgularını izle. Tüm ülkelerde “transfer from dalaman airport to marmaris” 6, “dalaman to marmaris transfer” 5 gösterim aldı. 25 Kasım’daki ücret ve karşılama güncellemesi bu veri aralığından sonra yayımlandı. Ölçüm penceresi dolmadan aynı rota metnini yeniden değiştirme. Sonraki karşılaştırmada ülke, sayfa ve sorgu filtrelerini sabit tut; gösterim, tıklama ve konumu birlikte değerlendir.


### 26 Kasım — hedef pazar ölçümü ve ilk içerik denemesi
Türkiye ve Litvanya dışarıda tutulur. 18–24 Kasım: kalan 69 gösterim, 0 tıklama; İngiltere 64 gösterim, 0 tıklama, ortalama konum 61,4. Sayfa ve sorgu toplamlarını ülke filtresi uygulanmadıkça İngiltere'ye atfetmeyin. “airport for fethiye” ve “oludeniz airport” sorgularının işaret ettiği bilgi ihtiyacına göre İngilizce rota sayfalarında Dalaman (DLM) ve doğru otel bölgesini seçme açıklamaları test sürümüne eklendi. Yayın onayından sonra İngiltere + ilgili sayfa filtresiyle gösterim, tıklama ve konumu izleyin.
