# DalamanWay — 4-Pazar SEO Araştırması ve Uygulama Eki

Tarih: 2026-11-19 | Durum: Araştırma ve uygulama talimatı; canlıya alınmadı.

> Mevcut SEO MD dosyasının konumu henüz doğrulanamadı. Bu belge mevcut planı **değiştirmez**; UK SEO araştırma tablosundaki rota/içerik ilkeleri ve mevcut frontend SEO scriptleri esas alınarak hazırlanmış tamamlayıcı bir uygulama ekidir. Arama hacmi, rekabet puanı veya sıralama garantisi uydurulmamıştır. Uygulamadan önce mevcut ana SEO MD ile karşılaştır.

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

## Kaynaklar
- https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites
- https://developers.google.com/search/docs/specialty/international/localized-versions
- Rakip URL'leri yukarıda.
