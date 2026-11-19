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
| SEO-05 | Production HTTP/indexability denetimi | `/`, `/robots.txt`, `/sitemap.xml`, örnek rotalar | PLANLANDI | Gerçek HTTP 200, canonical, robots ve yönlendirme doğrula |
| SEO-06 | Dört dil için kalıcı URL ve geçiş stratejisi | `/en-gb/`, `/de/`, `/ru/`, `/tr/` ve rota varyantları | PLANLANDI | Mevcut React router/i18n kontrolü, 301 ve eski URL koruması |
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

### Şu an tam olarak neredeyiz?
**Son kodlanan görev: SEO-04.** **Bir sonraki teknik görev: SEO-05**, ardından SEO-06/07. SEO-02/03/04 için güncel branch'in testleri ve staging doğrulaması açık. **Hiçbiri bu kayıt itibarıyla production'a yayınlanmadı.** PR #17 ve #18 ayrı tutuldu; Work Mode'un yaptığı değişiklikler birleştirilmeden önce diff ve çakışma kontrolü yapılmalı.

---

## Kaynaklar
- https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites
- https://developers.google.com/search/docs/specialty/international/localized-versions
- Rakip URL'leri yukarıda.
