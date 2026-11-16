# EKSİKLERİMİZ — Uygulama ve öğrenme günlüğü

Bu dosya projenin tek ilerleme kaydıdır. Her görevde: problem → kanıt → neden → düzeltme → test → ortaya çıkan yeni sorun → sonuç yazılır. Doğrulanmadan "tamamlandı" denmez.

## Canlı görev panosu — tek bakışta kaldığımız yer

**Güncelleme kuralı:** Her geliştirme commit'inde önce ilgili alt maddenin durumu, kanıtı, sonraki adımı ve son commit'i güncellenir. Tarihli günlük aşağıda değişmeden korunur. Yalnızca test edilmiş ve doğrulanmış işler **TAMAMLANDI** olur.

**Durum sözlüğü:** BEKLİYOR · DEVAM EDİYOR · TEST BEKLİYOR · BLOKE · TAMAMLANDI. Her alt maddede tek bir durum kullanılır.

### 1. Backend, PostgreSQL ve rezervasyon güvenilirliği

**Genel durum:** DEVAM EDİYOR  
**Şu an üzerinde çalışılan:** **1.3 ve 1.5 — idempotency yaşam döngüsü/migration ve dağıtım güvenliği (TEST BEKLİYOR)**  
**Bir sonraki somut işlem:** Kullanıcının çalıştığını doğruladığı gerçek rezervasyonun aynı anahtarla tekrarı ve DB migration/production güvenliğini doğrula; ardından 1.5'i kapat. Render env ayarları uygulandı ve her iki deploy `live`.

| No | Alt iş / sorun | Durum | Kanıt / yapılan işlem | Sıradaki işlem |
|---|---|---|---|---|
| 1.1 | Backend derleme hatası | TAMAMLANDI | Fazladan virgül düzeltildi; Render backend canlı doğrulandı. `590f582` | Regresyon halinde yeniden aç |
| 1.2 | PostgreSQL bağlantısı ve mevcut test altyapısı | TAMAMLANDI | Render PostgreSQL bağlantısı ve izole CI PostgreSQL ile 14 başarılı test doğrulandı. `bf60c97`, CI run `43839886864` | Yeni testleri CI'ya ekle |
| 1.3 | Aynı POST'un iki kayıt oluşturabilmesi | TEST BEKLİYOR | Eşzamanlı PostgreSQL testi ve React build **başarılı** (`06c4cfa`, run `43843124407`); sayfa yenileme düzeltmesi **başarılı** (`89240d1`, run `43843263719`) | Gerçek tarayıcı E2E, migration ve bağımsız işlem yaşam döngüsü |
| 1.4 | Frontend → backend → DB gerçek rezervasyon akışı | TAMAMLANDI | Kullanıcı 2026-11-16 tarihinde testin çalıştığını bildirdi; Render frontend/backend `69a0576` deployları `live`; API/CORS env değerleri staging'e uygulandı. Bağımsız otomatik E2E kanıtı henüz yok. | Otomatik browser E2E regresyonunu 1.5'e ekle |
| 1.5 | Dağıtım sonrası doğrulama ve üretim güvenliği | TEST BEKLİYOR | Frontend `dep-dbtdcue417fc738g6mu0` ve backend `dep-dbtdcub0pb7s73aiqpt0` `live`; kullanıcı rezervasyonun çalıştığını doğruladı. | CI, smoke, migration, güvenlik ve otomatik E2E regresyonu |

**Tamamlanma koşulu:** 1.1–1.5 doğrulanmış olmalı; CI yeşil, tekrarlı/eşzamanlı istekler tek kayıt oluşturmalı ve frontend rezervasyonu test ortamında uçtan uca çalışmalı.

### 2. Uçuş, otel, bagaj ve çocuk koltuğu

**Genel durum:** DEVAM EDİYOR (kullanıcı talebiyle başlandı; Görev 1 migration/production güvenlik açıkları ayrıca takip ediliyor).

| No | Alt iş | Durum | Kanıt | Sonraki adım |
|---|---|---|---|---|
| 2.1 | Uçuş numarası | TEST BEKLİYOR | DTO/entity/service/test (`388a448`) CI başarılı (`43847834472`); React form → localStorage → confirmation → POST bağlandı (`f9b9df8`, `ab8129c`) | Yeni frontend build ve staging E2E doğrula |
| 2.2 | Otel bilgisi | TEST BEKLİYOR | Opsiyonel hotelName (120 karakter) frontend/backend ve entegrasyon testinde mevcut; CI 43850774232 başarılı. | Gerçek tarayıcı E2E ve DB kaydını doğrula |
| 2.3 | Bagaj bilgisi | TEST BEKLİYOR | Genel sınır 0–8; araç bazlı kapasite API create/update tarafında uygulanıyor, CI 43860943209 başarılı. | Gerçek tarayıcı E2E ve DB kaydını doğrula |
| 2.4 | Çocuk koltuğu | TEST BEKLİYOR | babySeatCount DTO/entity/frontend payload'da mevcut; güncel sınır 0–2, CI 43860943209 başarılı. | Gerçek tarayıcı E2E ve DB kaydını doğrula |

### 3–12. Diğer ana maddeler

**Durum:** BEKLİYOR.

### Her çalışma sonunda zorunlu kayıt şablonu

- **Aktif madde:** ör. 1.3
- **Sorun ve kanıt:** hangi davranış/hata görüldü?
- **Yapılan değişiklik:** dosyalar, gerekçe, commit/PR
- **Test ve sonuç:** komut/CI bağlantısı, geçti/kaldı/çalıştırılmadı
- **Durum:** BEKLİYOR / DEVAM EDİYOR / TEST BEKLİYOR / BLOKE / TAMAMLANDI
- **Kaldığımız yer:** tek cümle, bir sonraki uygulanabilir adım
- **Yeni risk / karar:** varsa ve gerekçesi

---

## Sıra
1. Backend derlemesi, PostgreSQL bağlantısı, rezervasyon güvenilirliği
2. Uçuş numarası, otel, bagaj ve çocuk koltuğu alanları
3. Gerçek fiyat, ödeme ve iptal kuralları
4. Gerçek iletişim ve işletme bilgileri
5. Rezervasyon e-postası ve durum bildirimleri
6. Güvenli rezervasyon sorgulama ve değişiklik talepleri
7. Havalimanı karşılama ve uçuş gecikmesi iş akışı
8. Mobil kullanıcı deneyimi, boş bağlantılar ve işlevsiz butonlar
9. SEO: indekslenebilir HTML, güzergâh sayfaları, sitemap
10. İngilizce içerik ve sonraki yerelleştirmeler
11. Gerçek müşteri yorumları ve ortaklıklar
12. Dönüşüm analitiği ve otomatik kalite kontrolleri

## 2026-11-16 — Görev 1, inceleme
- **Problem:** Render backend deploy `build_failed`.
- **Kanıt:** Maven compiler: `BookingIntegrationTests.java:[45,58] illegal start of expression`.
- **Neden:** `Map.ofEntries` içindeki son `Map.entry` sonrasında fazladan virgül vardı.
- **Düzeltme:** `590f58221e93090d746584b8c427ab675a910e76` commit ile virgül kaldırıldı.
- **Doğrulama:** Render deploy `dep-dbtcjvm7bikc738159ug` durumu `live`; Spring Boot başlatıldı; HikariPool PostgreSQL bağlantısı kurdu; PostgreSQL 16.15 görüldü.
- **Henüz doğrulanmayanlar:** Gerçek POST /bookings isteğinin kaydı, kaydın okunması, fiyatın doğruluğu, mükerrer istekler, tüm JUnit testlerinin çalışması ve frontend uçtan uca rezervasyon.
- **Yeni risk:** Dockerfile `mvn -B -DskipTests package` kullanıyor; bu testleri çalıştırmıyor, sadece derliyor. Testler ayrıca çalıştırılmalı. Üretim veritabanına sahte müşteri kaydı yazmadan önce ayrı test ortamı/stratejisi hazırlanmalı.
- **Sonuç:** Derleme ve DB bağlantısı alt adımları doğrulandı; Görev 1 **devam ediyor**.

## Geliştirme standardı
- Her değişiklik küçük ve tek amaçlı commit.
- Kod açıklamalarında Controller → Service → Repository → PostgreSQL akışı kullanılacak.
- Kod satırları, Java/TypeScript sözdizimi ve hata nedeni başlangıç seviyesinde açıklanacak.
- Önce beklenen davranış ve test, sonra düzeltme, sonra yeniden test.
- Geçici sahte işletme bilgileri ve doğrulanmamış vaatler üretime taşınmayacak.

## 2026-11-16 — Görev 1, fiyat güvenilirliği için test altyapısı
- **İncelenen akış:** `BookingController.createBooking` → `BookingService.createBooking` → `TransferPricingService.calculatePrice` → `BookingRepository.save`.
- **Gözlem:** Backend, fiyatı istemciden kabul etmek yerine sunucudaki `transfer-prices.json` kataloğundan hesaplıyor. Bu doğru güvenlik yaklaşımıdır.
- **Risk:** Fiyat veya araç kapasitesi değişiklikleri ileride yanlış fiyat veya uygunsuz rezervasyon oluşturabilir. Docker derlemesi testleri çalıştırmıyor.
- **Değişiklik:** `bf60c97e1a560e6c7c2b18f984c5f20106b3aec1` commit ile `TransferPricingServiceTests.java` eklendi. Altı test: gidiş, ters güzergâh, gidiş-dönüş fiyatı, fazla yolcu, desteklenmeyen güzergâh, bilinmeyen araç.
- **Doğrulama durumu:** Test dosyası GitHub'a kaydedildi; testlerin çalıştırıldığına dair henüz sonuç yok. Testler PostgreSQL gerektirmeden çalışacak şekilde yazıldı.
- **Sonraki adım:** Testleri Maven ile gerçekten çalıştırıp sonucu kaydetmek; ardından güvenli test ortamında rezervasyon POST/GET akışını ve mükerrer istekleri doğrulamak.
- **Kullanıcı tercihi:** Şimdilik ders veya soru sorulmayacak; geliştirmeye odaklanılacak. Kullanıcı istediğinde kodlar başlangıç seviyesinden ayrıntılı anlatılacak.

## 2026-11-16 — Görev 1, CI testleri çalıştırıldı ve doğrulandı
- **Kaynak:** GitHub Actions run https://github.com/Alisnmez/vip-transfer-dalaman/actions/runs/43839886864 ; commit `b0de1d37aa7a4bf54f633b68ef1ca0aa3dcf249a`.
- **Backend:** `mvn -B test`, GitHub Actions PostgreSQL 16 servis konteyneri ile çalıştı; **14 test geçti, 0 hata, 0 başarısız, 0 atlanan**. Dağılım: `VipTransferDalamanApplicationTests` 1, `BookingIntegrationTests` 7, `TransferPricingServiceTests` 6. Maven sonucu: `BUILD SUCCESS`.
- **Frontend:** `npm ci` ve `npm run build` GitHub Actions üzerinde başarılı.
- **Kapsam sınırı:** Testler GitHub Actions'ın izole PostgreSQL veritabanında çalıştı, Render üretim veritabanında değil. Tarayıcı üzerinden uçtan uca rezervasyon, aynı isteğin tekrarında çift kayıt oluşmaması, e-posta bildirimi ve üretim ödeme akışı henüz doğrulanmadı.
- **Sonuç:** Otomatik derleme ve mevcut 14 test **doğrulandı**; görev 1'in idempotency ve uçtan uca test alt işleri **açık**.

## 2026-11-16 — Geçici eğlence modu: araç kartı
- **İstek:** Our Vehicles sayfasına Porsche Cayenne GTX, £500 fiyatlı geçici demo kartı eklenmesi; sonradan geri alınacak.
- **Değişiklik:** `frontend/src/pages/public/InfoPages.tsx` içinde sadece araçlar sayfasında gösterilen demo kartı eklendi. Commit: `d127a0505b8373ea17555dc82a42d49a6d382242`.
- **Koruma:** Kart gerçek rezervasyona bağlanmadı, backend fiyat kataloğu değiştirilmedi. Açıkça demo ve rezervasyona kapalı olarak etiketlendi.
- **Kontrol sınırı:** Görsel temsili Porsche fotoğrafıdır; Cayenne modelinin doğru görseli henüz doğrulanmadı. Derleme ve canlı görünüm henüz test edilmedi.
- **Geri alma:** İlgili commit geri alınarak demo kartı kaldırılabilir; diğer geliştirmeler korunmalı.

## 2026-11-16 — Eğlence modu, ana sayfa araç kartı
- **İstek:** Ana sayfa Our Vehicles bölümünde Mercedes Vito Executive kartından önce Porsche Cayenne GTX, £500, Select Vehicle görünümü.
- **Değişiklik:** İlk sıraya mevcut araç kartı stiliyle geçici demo eklendi. Commit: 7c68327059d2a32784282bed85bdfc7c70dfc85f.
- **Sınır:** Görsel Porsche spor otomobilinin temsili fotoğrafıdır, Cayenne GTX modeli olarak doğrulanmadı. Gerçek rezervasyon ve fiyat kataloğu değiştirilmedi; buton devre dışı.
- **Doğrulama:** GitHub değişikliği kaydedildi; frontend build ve canlı dağıtım henüz doğrulanmadı.
- **Geri alma:** HomePage.tsx içindeki Temporary fun-mode demo kartı kaldırılabilir.

## 2026-11-16 — Eğlence modu geri alındı
- **İstek:** Geçici Porsche Cayenne GTX (£500) kartlarının kaldırılması ve normal geliştirmeye dönülmesi.
- **Değişiklik:** Ana sayfadaki `Our Vehicles` kartı ve `/vehicles` sayfasındaki demo kartı kaldırıldı. Diğer araçlar, rezervasyon ve fiyatlandırma kodları korundu.
- **Commitler:** `4ec127f9f835746b941345138baf240016061c55` (HomePage), `ee7534d259f9b67668a8156a1555bd2cd05cddc3` (InfoPages).
- **Doğrulama:** GitHub kaynak kodu kontrol edildi; canlı Render dağıtımı ve frontend build sonucu henüz doğrulanmadı.

## 2026-11-16 — Görev 1 yeniden başlatıldı: rezervasyon güvenilirliği analizi
- **Kapsam:** Sıradaki açık alt iş, aynı rezervasyon isteğinin tekrarlanması halinde çift kayıt oluşmasının engellenmesi. Önce mevcut kod incelendi; daha önce geçen 14 CI testi yeniden çalıştırılmış sayılmadı.
- **Kanıt:** `BookingController.createBooking` yalnızca `@RequestBody BookingRequestDto` alıyor; `BookingService.createBooking` her çağrıda yeni `Booking` oluşturup `bookingRepository.save` çağırıyor. `Booking` üzerinde idempotency anahtarı veya benzersiz kısıt yok; `BookingRepository` yalnızca JpaRepository. Aynı HTTP POST tekrarlandığında yeni kayıt oluşturulabilir.
- **İkinci bulgu:** `BookingIntegrationTests` başarılı POST/GET ve validasyonları kapsıyor, fakat aynı anahtarla yinelenen istek, aynı anahtarla farklı içerik, eşzamanlı istek ve DB unique constraint senaryolarını kapsamıyor.
- **Beklenen davranış / test tasarımı:** İstemci her mantıksal rezervasyon için tek bir `Idempotency-Key` üretir; ağ hatasında aynı anahtarı yeniden kullanır. Aynı anahtar ve aynı rezervasyon verisi aynı rezervasyon ID'sini döndürmeli; aynı anahtar ve farklı veri 409 Conflict vermeli; farklı anahtarlar bağımsız rezervasyon oluşturmalı. Eşzamanlı iki istek de veritabanı benzersiz kısıtı sayesinde tek rezervasyona karşılık gelmeli. Anahtarsız eski istemciler için geçiş stratejisi ayrıca kararlaştırılmalı.
- **Güvenlik ve tasarım:** Sadece Java `synchronized` veya `existsBy...` kontrolü yeterli değildir (çoklu Render instance ve yarış durumu). PostgreSQL'de benzersiz kısıt, transaction ve kalıcı istek özeti gerekir. PII içeren ham request verisi idempotency alanında tutulmamalı; aynı anahtarın başka müşterilerce tahmin edilmesi durumunda veri sızıntısı engellenmeli. Anahtar rastgele, yeterince uzun ve tahmin edilemez olmalı.
- **Düzeltme durumu:** Bu adımda üretim kodu değiştirilmedi. Önce test ve DB migration stratejisi netleştirilip küçük, tek amaçlı commitler halinde uygulanacak.
- **Doğrulama:** Mevcut kod ve test dosyaları GitHub üzerinden incelendi. Yeni test, Maven çalışması, Render deploy ve tarayıcıdan uçtan uca doğrulama henüz yapılmadı. Görev 1 **açık**.

## 2026-11-16 — Görev 1: mükerrer rezervasyon testleri eklendi
- **Değişiklik:** `BookingIntegrationTests.java` içine iki regresyon testi eklendi: aynı `Idempotency-Key` ve aynı içerikle yinelenen POST'un aynı booking ID döndürmesi; aynı anahtarla değişen müşteri verisinin HTTP 409 Conflict üretmesi.
- **Commit:** `c50d19a7e38cda869de930e8e954ee77bb895575`.
- **Mevcut durum:** Testler GitHub'a kaydedildi fakat henüz CI/Maven ile çalıştırılmadı. Mevcut Controller anahtarı işlemediğinden testlerin şu an geçmesi beklenmiyor. Üretim kodunda idempotency çözümü henüz uygulanmadı.
- **Sıradaki adım:** PostgreSQL benzersiz kısıtı, sunucu tarafı request fingerprint, güvenli 409 yanıtı ve eşzamanlı istek testini uygulamak. Anahtarı frontend'in tekrar denemelerde koruması da gerekli.

## 2026-11-16 — 1.3 kod uygulaması (güncel kayıt)
- **Durum:** TEST BEKLİYOR. Üstteki görev panosunda 1.3 için yazan önceki durum tarihsel kalmıştır; bu kayıt daha günceldir.
- **Sorun:** Aynı rezervasyon POST isteği tekrarlandığında mükerrer kayıt oluşabilir.
- **Yapılan:** Booking entity içine benzersiz idempotency anahtarı ve JSON'dan gizlenen istek özeti eklendi. Repository araması, Controller'da isteğe bağlı Idempotency-Key başlığı, Service'te SHA-256 özeti ve aynı anahtarla farklı içerik için HTTP 409, transaction ve benzersiz kayıt yarışında yeniden okuma eklendi. CORS başlığa izin veriyor.
- **Commitler:** f26b269 (entity), bd977ec (repository), 383b4bb (controller), 6f11a99 (CORS), 59a85ed (service); regresyon testleri c50d19a.
- **Test durumu:** Son commit için CI/Maven sonucu henüz doğrulanmadı. Eşzamanlılık testi, frontend anahtar gönderimi ve uçtan uca tarayıcı testi henüz yok.
- **Risk:** Mevcut spring.jpa.hibernate.ddl-auto=update üretim için kontrollü migration yerine geçmez; Flyway ve şema değişikliği planlanmalı. Header gönderilmeyen istekler eski davranışı sürdürür.
- **Kaldığımız yer / sonraki adım:** Son commit CI sonucunu kontrol et, başarısız test varsa düzelt; frontend retry anahtarı ve yarış testlerini ekle. 1.3 tamamlandı denmeyecek.

## 2026-11-16 — 1.3 CI ve frontend retry ilerlemesi
- **Doğrulama:** GitHub Actions `43842759471` commit `59a85ed` için **success** sonucu verdi; bu sonuç backend idempotency kodunun derleme/test aşamasını geçtiğini gösterir, eşzamanlı yarış testinin varlığını veya canlı tarayıcı doğrulamasını göstermez. Önceki ara commitlerin CI hataları son Service commit'inde giderildi.
- **Frontend değişikliği:** `frontend/src/features/booking/api/index.ts` içinde `crypto.randomUUID()` ile Idempotency-Key üretildi. Aynı JSON payload için belirsiz ağ hatası sonrası anahtar bellekte tutulup yeniden kullanılır; başarılı yanıt sonrası silinir. Commit `906d60d`.
- **Kalan risk:** Sayfa yenilenince bellek sıfırlanır; aynı detaylarla ikinci bağımsız rezervasyonun anahtarı önceki işlem sürüyorsa paylaşılabilir. Üretimde kontrollü DB migration, eşzamanlılık testi, son frontend CI ve E2E doğrulaması yapılmadı.
- **Kaldığımız yer:** `906d60d` ve sonraki CI sonucunu kontrol et; yarış testini ekle ve frontend retry yaşam döngüsünü işlem bazlı hâle getir. **1.3 TEST BEKLİYOR.**

## 2026-11-16 — 1.3 eşzamanlı istek regresyon testi
- **Problem:** İki HTTP POST aynı anda aynı `Idempotency-Key` ile geldiğinde yalnızca sırayla tekrar testi yeterli değil; DB unique constraint ve transaction yarış koşulunda da doğrulanmalı.
- **Değişiklik:** `BookingIntegrationTests.concurrentRetriesWithSameKeyCreateOnlyOneBooking` eklendi. İki worker ortak latch ile eşzamanlı başlatılır, aynı key ve payload ile POST gönderir; iki HTTP 200 yanıtındaki rezervasyon ID'sinin eşit olması beklenir. Executor 20 saniye sınırıyla kapanır.
- **Commit:** `06c4cfa`.
- **Doğrulama:** Önceki `37179414` commit'i için GitHub Actions run `43842818375` **success**. Frontend `906d60d` ve günlük `5209c3d` için görülen CI çalışmaları sorgulama anında **in_progress** idi; yeni yarış testi henüz doğrulanmadı.
- **Kaldığımız yer:** `06c4cfa` CI sonucunu incele; yarış testi başarısızsa transaction/unique constraint hata yönetimini düzelt. Frontend anahtarının sayfa yenileme/bağımsız rezervasyon yaşam döngüsü ve gerçek tarayıcı E2E hâlâ açık. 1.3 **TEST BEKLİYOR**.

## 2026-11-16 — 1.3 sayfa yenileme retry güvenilirliği
- **Doğrulanan CI:** Frontend idempotency başlığını ekleyen `906d60d` commit'i GitHub Actions `43842980379` ile **success**; sonraki `5209c3d` commit'i `43843005244` ile **success**.
- **Eşzamanlı test durumu:** `06c4cfa` için run `43843124407`, kontrol anında **in_progress**. Başarılı sayılmadı.
- **Sorun:** Önceki frontend retry anahtarı yalnızca JS Map belleğinde tutulduğu için sayfa yenilenince kayboluyordu.
- **Çözüm:** `frontend/src/features/booking/api/index.ts` içinde isteğin SHA-256 özetiyle ilişkilendirilmiş rastgele idempotency anahtarı sessionStorage'da saklanıyor. Aynı sekmede sayfa yenilendikten sonra aynı payload tekrar gönderilirse anahtar korunuyor; başarılı rezervasyondan sonra siliniyor. Storage kullanılamıyorsa belleğe düşüyor. Ham müşteri verisi sessionStorage anahtarında tutulmuyor.
- **Commit:** `89240d1`. **Bu commit'in CI sonucu henüz doğrulanmadı.**
- **Sınır:** Farklı sekme, gizli pencere veya tarayıcıda retry korunmaz. Aynı sekmede aynı payload ile bağımsız yeni rezervasyonun başarıdan önce gönderilmesi aynı işlem olarak değerlendirilir. Gerçek tarayıcı E2E, yarış testi sonucu ve kontrollü DB migration açık.
- **Kaldığımız yer:** Son CI ve eşzamanlı test sonuçlarını incele, ardından E2E testlerini çalıştır. 1.3 **TEST BEKLİYOR**.

## 2026-11-16 — 1.3 eşzamanlı test ve sayfa yenileme CI doğrulandı
- **Eşzamanlı test:** GitHub Actions run `43843124407` (commit `06c4cfa`) **success**. İş detaylarında `Spring Boot PostgreSQL integration tests` işinin `mvn -B test` adımı **success**; `React and TypeScript build` işinin `npm run build` adımı **success**. Bu CI testi gerçek tarayıcı E2E değildir.
- **Sayfa yenileme düzeltmesi:** `89240d1` için run `43843263719` **success**. Son günlük commit'i `442838d` için run `43843288232` **success**.
- **Durum:** 1.3 **TEST BEKLİYOR** (CI aşaması geçti, uçtan uca doğrulama ve DB migration eksik). 1.4 ve 1.5 bekliyor.
- **Kaldığımız yer:** Gerçek tarayıcı üzerinden rezervasyon oluşturma, aynı anahtarla retry, sayfa yenileme, sunucuya kayıt ve üretim dışı ortamda migration doğrulamasını çalıştır. Sadece CI başarılarıyla 1.3 veya 1. madde kapatılmayacak.

## 2026-11-16 — 1.4 gerçek rezervasyon akışı kod denetimi
- **Denetlenen:** `frontend/src/pages/public/BookingPassengerPage.tsx`, `BookingConfirmationPage.tsx`, `features/booking/api/index.ts`.
- **Bulgular:** Yolcu formu `bookingPassengerInfo` ve transfer formu `bookingTransferInfo` olarak localStorage'a yazıyor. Onay sayfası bunlardan DTO oluşturup `createBooking` üzerinden POST `/bookings` çağırıyor; başarılı sonuçta sunucunun döndürdüğü `booking.id` referansını gösterip taslakları siliyor. Bu **kod incelemesi**, gerçek tarayıcı ve canlı DB testi değildir.
- **Sorun ve düzeltme:** Onay sayfasında kayıt yalnızca `PENDING` iken buton metni `BOOKING CONFIRMED` diyordu; kullanıcıyı yanıltmamak için `REQUEST RECEIVED` yapıldı. Commit `b88a76c`. CI sonucu henüz doğrulanmadı.
- **Kanıtlanan test:** `06c4cfa` için GitHub Actions `43843124407` backend PostgreSQL integration test ve React build **success**; `89240d1` için `43843263719` **success**.
- **Kaldığımız yer:** 1.4 gerçek browser E2E hâlâ bekliyor; test ortamında tarayıcıdan POST/response/DB kaydı doğrulanmalı. Üretimde deneme rezervasyonu oluşturmadan önce test ortamı ve veri temizleme prosedürü kullanılmalı. 1.3 E2E ve migration yönünden açık.

## 2026-11-16 — 1.3 bağımsız rezervasyon ve JSON güvenliği testi
- **Problem:** Aynı rezervasyon bilgileriyle iki ayrı gerçek rezervasyon oluşturulabilmeli; ayrıca idempotency anahtarı ve request fingerprint halka açık POST yanıtında görünmemeli.
- **Uygulama:** `BookingIntegrationTests.independentKeysCreateIndependentBookingsWithoutExposingRetryMetadata` eklendi. Aynı payload ile farklı UUID anahtarlarından iki ayrı ID beklenir; yanıtta `idempotencyKey` ve `requestFingerprint` alanları bulunmamalıdır.
- **Commit:** `8247300`. **Yeni testin CI sonucu henüz doğrulanmadı.**
- **Sınır:** Bu test Spring MockMvc + gerçek PostgreSQL CI entegrasyonudur, browser E2E değildir. Gerçek tarayıcı, ayrı test ortamı, kontrollü migration ve üretim dağıtım doğrulaması bekliyor.
- **Kaldığımız yer:** `8247300` CI sonuçlarını doğrula; ardından ayrı test ortamında browser E2E'yi çalıştır. 1.3 TEST BEKLİYOR, 1.4 BEKLİYOR.

## 2026-11-16 — 1.3 bağımsız rezervasyon CI doğrulaması ve 1.4 ortam engeli
- **Doğrulama:** `82473005` bağımsız rezervasyon ve JSON metadata testi için GitHub Actions `43843703562` **success**. Takip eden `4817a124` için `43843720214` **success**. `b88a76cf` buton düzeltmesi için `43843561565` **success**.
- **Kapsam:** Aynı payload + farklı UUID için farklı booking ID, API'de retry metadata gizliliği, PostgreSQL testleri ve frontend derleme CI içinde geçti. Bu gerçek browser E2E değildir.
- **1.4 ortam engeli:** Render servislerini sorgulama girişimi workspace seçimi gerektiği için sonuç vermedi. Hesapta birden fazla workspace olabileceğinden kullanıcı onayı olmadan workspace seçilmeyecek. **Hiçbir Render servisine/deployment'a müdahale edilmedi; canlı veya staging test çalıştırılmadı.**
- **Kaldığımız yer:** Kullanıcının Render workspace seçimini al, uygun staging servisini ve ayrı PostgreSQL DB'yi doğrula; üretim verisine dokunmadan browser E2E çalıştır. 1.3 CI tamam, staging E2E/migration açık; 1.4 BEKLİYOR.

## 2026-11-16 — 1.4 Render workspace onayı ve staging keşfi
- **Kullanıcı onayı:** `Ali's workspace` (`tea-dbt0muvf3r2c73bjjde0`) seçildi.
- **Bulunan servisler:** Statik frontend `vip-transfer-dalaman-test` (`https://vip-transfer-dalaman-test.onrender.com`); backend `vip-transfer-dalaman-api-test` (`https://vip-transfer-dalaman-api-test.onrender.com`). Her ikisi de `feature/booking-integration` branch'ini otomatik deploy ediyor.
- **Veritabanı:** `vip-transfer-dalaman-test-db` (`dpg-dbt0p3l6e07s73b40okg-a`), PostgreSQL 16, `available`, ücretsiz plan; bitiş tarihi 2026-12-15 olarak bildirildi. Bu bir **test** DB'si; başka üretim DB'si olmadığı sonucu çıkarılamaz.
- **Deploy durumu (sorgu anında):** Frontend commit `1c00f65` **live**. Backend aynı commit için **build_in_progress**; bir önceki `62007cf` deploy **live**.
- **Okuma testi engeli:** DB'de `booking` tablo kolonlarını read-only sorgulama girişimi SSL/TLS/harici IP allowlist bağlantı hatasıyla başarısız oldu. Bu, şema hakkında sonuç vermez; DB'ye yazma yapılmadı. IP allowlist'i genişletilmedi.
- **Kaldığımız yer:** API'nin son deploy'unu doğrula, frontend/backend URL ve CORS uyumunu kontrol et. Güvenli staging test rezervasyonu için yetkili erişim ve DB gözlemi yöntemini belirle; gerçek tarayıcı E2E henüz tamamlanmadı. 1.3 ve 1.4 açık.

## 2026-11-16 — 1.4 staging deploy, API URL ve CORS incelemesi
- **Render deploy:** `vip-transfer-dalaman-test` frontend commit `a3c8c5f` için **live**. `vip-transfer-dalaman-api-test` backend aynı commit için **queued**, önceki `1c00f65` için **update_in_progress**; en güncel backend sürümünün live olduğu henüz doğrulanmadı.
- **Frontend yapılandırma:** `features/booking/api/index.ts` `VITE_API_BASE_URL || ''` kullanıyor. Vite geliştirme proxy'si yalnızca localhost:8080'e yönlendiriyor; Render statik sitede proxy çalışmaz. Render frontend build ortamında `VITE_API_BASE_URL=https://vip-transfer-dalaman-api-test.onrender.com` bulunması gerekir; env değeri henüz doğrulanamadı. Yoksa `/bookings` yanlışlıkla statik siteye gider.
- **Backend CORS:** `SecurityConfig` yalnızca `FRONTEND_ORIGIN` ile verilen tek origin'e izin veriyor, varsayılan localhost:5173. Render API ortamında `FRONTEND_ORIGIN=https://vip-transfer-dalaman-test.onrender.com` bulunması gerekir. Header listesinde `Idempotency-Key` var. Değerler henüz doğrulanmadı.
- **Yeni otomatik test:** `BookingIntegrationTests.allowsStagingFrontendBookingPreflightWithIdempotencyHeader` testinde localhost development origin için OPTIONS /bookings preflight ve idempotency header kabulü kontrol ediliyor. Commit `89d58c4`, CI henüz doğrulanmadı. Bu test staging origin'in gerçekten ayarlandığını kanıtlamaz.
- **Açık:** Backend son deploy live kontrolü, iki Render env değerinin doğrulanması, gerçek browser E2E, DB migration. Üretim DB veya Render güvenlik ayarlarına müdahale edilmedi.

## 2026-11-16 — 1.4 staging dağıtımı yeniden doğrulandı
- **Sorun:** Backend son dağıtımının hâlâ güncelleniyor olması; frontend ile aynı commit'te çalıştığı kanıtlanmamıştı.
- **Kanıt:** Render `list_deploys` sorgusunda frontend `dep-dbtd69r2o0lc73eih340` commit `190990d` **live**; backend `dep-dbtd5np9aqoc73alumj0` commit `190990d` **live** (bitiş 09:58:45 UTC). İki servis aynı commit'i çalıştırıyor.
- **Düzeltme:** Kod veya altyapı değiştirilmedi; dağıtım durumu doğrulandı ve görev panosu güncellendi.
- **Test:** Render deploy durumları doğrulandı. Canlı HTTP kontrolü bu çalışma ortamında DNS çözümleme hatası nedeniyle yapılamadı; bu hata sitenin erişilemez olduğunu kanıtlamaz. Gerçek tarayıcı E2E **çalıştırılmadı**.
- **Yeni risk:** Render ortam değişkenlerinin gerçek değerleri hâlâ doğrulanmadı (`VITE_API_BASE_URL`, `FRONTEND_ORIGIN`); build başarılı olsa da tarayıcıdan POST'un doğru API'ye gittiği kanıtlanmadı.
- **Durum:** 1.4 **DEVAM EDİYOR**; 1.3 **TEST BEKLİYOR**.
- **Kaldığımız yer:** Render frontend/backend ortam değişkenlerini güvenli biçimde kontrol et, staging origin için preflight ve API bağlantısını doğrula, sonra izole DB üzerinde kontrollü E2E rezervasyon testi yap.

## 2026-11-16 — 1.4 Render yapılandırma denetimi ve erişim sınırı
- **Sorun:** Frontend'in API adresi ve backend'in izin verdiği CORS origin değerleri doğrulanmadan uçtan uca rezervasyonun çalıştığı söylenemez.
- **Kanıt:** Render `get_service` sonucunda frontend `static_site`, `buildCommand=cd frontend && npm ci && npm run build`, `publishPath=frontend/dist`, otomatik deploy açık; backend `web_service`, Docker runtime, Frankfurt, tek instance, otomatik deploy açık. İkisi de `feature/booking-integration` branch'inde. Bu servis detayları **ortam değişkenlerinin değerlerini göstermiyor**.
- **Kod incelemesi:** `frontend/src/features/booking/api/index.ts` içinde `const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''` ve `BOOKING_URL = `${API_BASE_URL}/bookings``. `VITE_API_BASE_URL` boşsa frontend kendi origin'ine `/bookings` isteği gönderir; bu statik site ile ayrı backend kurulumunda önemli bir yanlış yönlendirme riskidir. Doğru env değeri olup olmadığı mevcut erişimle doğrulanamadı.
- **Test:** Render servis metaverisi incelendi. Çalışma ortamından iki Render URL'sine HTTP GET denemeleri DNS `NameResolutionError` nedeniyle başarısız oldu; bu, sitelerin dışarıdan kapalı olduğunu kanıtlamaz. Gerçek tarayıcı veya CORS preflight testi yapılmadı. DB'ye yazılmadı.
- **Karar:** Ortam değişkeni değerlerini okumaya yarayan Render aracı bu bağlantıda yok. Gizli değişkenleri değiştirmeden veya varsaymadan, Render panelinde frontend `VITE_API_BASE_URL=https://vip-transfer-dalaman-api-test.onrender.com` ve backend izin verilen frontend origin'inin `https://vip-transfer-dalaman-test.onrender.com` olduğunu yetkili erişimle doğrulamak gerekir. Önce var olan ayarlar kontrol edilmeli; gerekmedikçe değişiklik yapılmamalı.
- **Durum:** 1.4 **DEVAM EDİYOR**, browser E2E **BLOKE** (ortam değişkeni ve erişim doğrulaması). 1.3 **TEST BEKLİYOR**.
- **Kaldığımız yer:** Render dashboard'da iki ortam değişkenini doğrula; ardından gerçek tarayıcıdan OPTIONS preflight ve kontrollü POST → DB kaydı testi yap.

## 2026-11-16 — 1.4 Vite proxy ve Spring Security CORS kaynak kodu doğrulaması
- **İncelenen:** `frontend/vite.config.ts`, `frontend/src/features/booking/api/index.ts`, `src/main/resources/application.properties`, `src/main/java/com/viptransfer/SecurityConfig.java`.
- **Kesin bulgu:** Vite proxy `/bookings -> http://localhost:8080` yalnızca geliştirme sunucusunun `server.proxy` ayarıdır; `npm run build` ile Render'a yüklenen statik frontend için proxy oluşturmaz. Frontend `VITE_API_BASE_URL` boşsa `/bookings` çağrısı kendi origin'ine gider.
- **Kesin bulgu:** Backend `FRONTEND_ORIGIN` yoksa `http://localhost:5173` varsayılanını kullanır. Spring Security `CorsConfigurationSource` yalnızca bu tek origin'e izin verir; `Idempotency-Key` ve `Content-Type` başlıkları, `POST` ve `OPTIONS` metotları izin listesinde. `POST /bookings` anonim erişime açık; GET/PUT/DELETE admin rolü gerektirir.
- **Sonuç:** Kodda CORS header/metot eksikliği yok, fakat staging için frontend build-time `VITE_API_BASE_URL` ve backend runtime `FRONTEND_ORIGIN` değerleri doğru ayarlanmış mı **kanıtlanamadı**. Bu ikisi olmadan E2E başarılı kabul edilemez.
- **Önemli ayrım:** Render metadata API mevcut ortam değişkenlerinin değerlerini sunmuyor. `update_environment_variables` yazma işlemidir; mevcut değerleri öğrenmek için kullanılmamalı. Mevcut servisi tahmine dayanarak değiştirmedik.
- **Test durumu:** Kaynak kodu doğrulandı; gerçek browser preflight/POST ve DB kayıt kontrolü henüz çalıştırılmadı. 1.4 **DEVAM EDİYOR**.
- **Kaldığımız yer:** Render panelinde frontend build env `VITE_API_BASE_URL=https://vip-transfer-dalaman-api-test.onrender.com` ve backend env `FRONTEND_ORIGIN=https://vip-transfer-dalaman-test.onrender.com` değerlerini doğrula; frontend env değiştiyse yeniden build gerekir. Sonra gerçek tarayıcı E2E'ye geç.

## 2026-11-16 — 1.4 ortam değişkenleri standardı dosyası
- **Problem:** Local Vite proxy ile Render static-site API adresi farklı davranır; örnek ortam yapılandırması yoktu.
- **Değişiklik:** `frontend/.env.example` oluşturuldu; local `VITE_API_BASE_URL` boş olabilir, Render staging build için tam HTTPS API origin gerekir. `VITE_SITE_NAME`/`VITE_SITE_URL` marka ve domain kararı verilene kadar boş bırakılır. Commit `162d52e`.
- **Güvenlik:** `VITE_` değişkenleri frontend JS içine gömülür; gizli bilgi içeremez. Gerçek Render environment değerleri okunmadı veya değiştirilmedi.
- **Test:** Belge commit'i oluşturuldu; Render'ın yeni frontend build'inin sonucu ve gerçek browser E2E henüz doğrulanmadı. Bu dosya tek başına Render env ayarlarını değiştirmez.
- **Durum:** 1.4 **DEVAM EDİYOR**. **Kaldığımız yer:** Render panelinde iki env değerini kontrol et; sonra yeni build, CORS preflight ve izole DB E2E testini doğrula.

## 2026-11-16 — 1.4 Render staging API/CORS yapılandırması uygulandı
- **Sorun:** Vite statik dağıtımında yerel `/bookings` proxy'si bulunmadığından `VITE_API_BASE_URL` boşsa istek yanlış origin'e gider; backend `FRONTEND_ORIGIN` yanlışsa CORS engeller.
- **Çözüm:** Kullanıcının onayladığı `Ali's workspace` içindeki yalnızca `-test` servislerine Render environment merge (replace=false) uygulandı: frontend `VITE_API_BASE_URL=https://vip-transfer-dalaman-api-test.onrender.com`, backend `FRONTEND_ORIGIN=https://vip-transfer-dalaman-test.onrender.com`. Var olan diğer environment değişkenleri korunmuştur. Bunlar sır değildir; gerçek müşteri verisi veya DB ayarı değiştirilmedi.
- **Kanıt:** Render frontend environment update başarılı ve `dep-dbtdb9rm8hqs73aj7q10` deploy tetiklendi; ilk sorguda **build_in_progress**. Backend update başarılı, `dep-dbtdambji66s73agmbo0` deploy **queued**. İki servis için henüz yeni sürüm `live` doğrulanmadı.
- **Test:** Render API env güncellemeleri kabul etti. Tarayıcıdan CORS preflight, POST ve PostgreSQL kayıt doğrulaması **yapılmadı**; bu adım henüz tamamlanmış sayılmaz.
- **Durum:** 1.4 **DEVAM EDİYOR**.
- **Kaldığımız yer:** İki yeni deploy `live` olana kadar kontrol et; ardından tarayıcı Network sekmesinde OPTIONS/POST ve test DB kaydını doğrula. Test rezervasyonunun gerçek bildirim/dispatch yaratmadığını önceden kontrol et.

## 2026-11-16 — 1.4 kullanıcı onaylı DB görünürlük testi: erişim engeli
- **İstek:** Kullanıcı DBeaver ile yerel bilgisayarından Render PostgreSQL'i izleyecek; test rezervasyonu gönderilip yeni kaydın görülmesini istiyor.
- **Dağıtım:** Backend environment güncellemesi `dep-dbtdambji66s73agmbo0` **live**; takip eden otomatik commit dağıtımı `dep-dbtdbesr5hns73bqpia0` **update_in_progress**. Frontend önceki kontrolde **live**.
- **Test girişimleri:** Bu çalışma ortamından `https://vip-transfer-dalaman-api-test.onrender.com` HTTP erişimi DNS `NameResolutionError` nedeniyle başarısız; web erişimi de başarısız. Render PostgreSQL read-only `SELECT NOW(), COUNT(*) FROM booking` sorgusu SSL/TLS/harici erişim kısıtıyla başarısız. Render PostgreSQL aracı yalnızca read-only sorgu destekliyor, kayıt oluşturamaz.
- **Sonuç:** Gerçek POST gönderilemedi; **yeni rezervasyon oluşturulmadı**, DBeaver'da yeni kayıt görünmesi beklenmemeli. DB veya ağ güvenlik ayarları değiştirilmedi. Başarı iddiası yok.
- **Kaldığımız yer:** Kullanıcı test frontend'inde gerçek rezervasyon isteğini kendisi gönderebilir; DBeaver'da `SELECT id, status, created_at FROM booking ORDER BY id DESC LIMIT 10;` sorgusunu mevcut tablo/kolon adlarıyla uyumluysa çalıştırıp sonucu paylaşmalı. Gerçek POST yanıtı ve DB kaydı eşleştirilince 1.4 doğrulanacak. Müşteriye bildirim/dispatch yan etkileri kontrol edilmeden sahte veri gönderilmemeli.

## 2026-11-16 — Görev 1 kapanış kontrolü (kullanıcı testi)
- **Kullanıcı geri bildirimi:** Test rezervasyon akışı için 'tamam çalışıyor' dedi. Bu, kullanıcı tarafından gerçekleştirilen staging testinin olumlu sonucudur; ekran görüntüsü, booking ID veya otomatik test logu sunulmadı.
- **Render doğrulaması:** Frontend `dep-dbtdcue417fc738g6mu0` **live** (commit `69a0576`), backend `dep-dbtdcub0pb7s73aiqpt0` **live** (aynı commit).
- **Durum kararı:** 1.4 kullanıcı kabul testi temelinde **TAMAMLANDI**; otomatik browser E2E ayrı regresyon olarak 1.5'e eklendi. Görev 1 **henüz bitmedi**: 1.3 idempotency yaşam döngüsü ve kontrollü şema migration testi, 1.5 üretim güvenliği ve smoke test açık.
- **Sonraki işlem:** İdempotency tekrarında tek DB kaydı ve farklı payload 409 doğrulaması, Flyway/Liquibase migration planı ve dağıtım sonrası regresyon kontrolleri.

## 2026-11-16 — 1.3 kontrollü migration hazırlığı
- **Sorun:** `spring.jpa.hibernate.ddl-auto=update` canlı şemayı otomatik değiştiriyor; mevcut booking verisi korunarak sürümlü migration'a geçiş için şema envanteri yok.
- **İnceleme:** `Booking.java`, `BookingService.java`, `BookingIntegrationTests.java`, `pom.xml` kontrol edildi. Unique idempotency anahtarı Java entity'de mevcut; veritabanındaki constraint'in varlığı henüz SQL ile kanıtlanmadı. Tekrarlı istek ve farklı payload için mevcut entegrasyon testleri var.
- **Değişiklik:** `docs/POSTGRES_MIGRATION_PLAN.md` eklendi (commit `86a8678`): DBeaver'da salt-okunur şema/constraint/index ve kayıt sayısı sorguları, yedek ve geri yükleme testi, sürümlü migration'a kontrollü geçiş, kabul kriterleri.
- **Güvenlik kararı:** Canlı/test DB'de `ALTER`, `DROP`, `TRUNCATE` yapılmadı; `ddl-auto` değeri değiştirilmedi. Gerçek şema envanteri olmadan Flyway baseline çalıştırılmayacak.
- **Test:** Dokümantasyon kaydedildi; SQL sorguları bu ortamdan çalıştırılamadı (Render DB dış erişim SSL/TLS engeli). 1.3 **TEST BEKLİYOR**; 1.5 **TEST BEKLİYOR**.
- **Kaldığımız yer:** DBeaver'da planın Phase 0 sorgularını çalıştırıp şema ve unique constraint sonuçlarını doğrula; sonra migration koduna geç.

## 2026-11-16 — 1.3 gerçek PostgreSQL satır sayısı regresyon testleri
- **Değişiklik:** `BookingIntegrationTests.java` içinde tekrar edilen aynı `Idempotency-Key` isteği ve iki eşzamanlı isteğin ardından `bookingRepository.count()` ile **tam olarak bir yeni satır** eklendiği assertion'ları eklendi. Commit `a1efdd4`.
- **Amaç:** Sadece aynı rezervasyon ID'sinin dönmesini değil, PostgreSQL'e gerçekten tek kayıt yazılmasını sınamak.
- **Test durumu:** GitHub Actions otomatik workflow yeni commit için henüz sorgu sonucunda görünmedi; önceki `5a46f61` workflow `43847200039` başarılı, fakat **yeni assertion'ları çalıştırdığı söylenemez**. Yeni run tamamlanmadan 1.3 kapanmayacak.
- **Sıradaki işlem:** `a1efdd4` için GitHub Actions run ID ve test sonucunu doğrula; gerekirse düzelt, sonra migration güvenliğine geç.

## 2026-11-16 — 1.3 PostgreSQL testleri başarıyla çalıştı; 1.5 staging CORS testi
- **Doğrulanan:** `a1efdd4` commit'ine ait GitHub Actions run `43847342749` **success**. PostgreSQL üzerinde Spring Boot testleri: **19 test, 0 failure, 0 error, 0 skipped** (12 BookingIntegrationTests + 6 TransferPricingServiceTests + 1 ApplicationTests). Frontend React/TypeScript build **success**. Tekrarlı ve eşzamanlı isteklerin tek yeni DB satırı oluşturması assertion'ları bu run'da geçti.
- **Yeni test:** `BookingIntegrationTests.java` staging test origin'i `https://vip-transfer-dalaman-test.onrender.com` ile yapılandırıldı; OPTIONS preflight `Access-Control-Allow-Origin` bu değere eşit olmalı. Commit `3fb750c`.
- **Yeni run:** GitHub Actions `43847559002` ilk kontrolde **queued**; sonucu henüz doğrulanmadı.
- **Kalan:** 1.3 migration/şema envanteri ve bağımsız canlı tekrar testi; 1.5 deployment smoke ve güvenlik kontrolleri. Üretim DB değiştirilmedi.

## 2026-11-16 — Görev 2 başladı: uçuş numarası
- **Kullanıcı kararı:** Sıradaki ana maddeye geçilmesi istendi. Görev 1'de migration ve üretim güvenliği hâlâ açık; tamamlandı olarak işaretlenmedi.
- **Kod:** Booking entity'ye opsiyonel `flightNumber` (20 karakter), request DTO'ya uzunluk/karakter validasyonu, create/update service mapping ve frontend TypeScript tipine alan eklendi. Commitler `6c4519f`, `168c82f`, `ac5eb70`, `9bc2bfd`.
- **Test:** `BookingIntegrationTests` içinde geçerli `TK 2552` için kayıt/yanıt, geçersiz `TK/2552` için 400 testi eklendi (`388a448`). CI sonucu henüz doğrulanmadı.
- **Sınır:** React formuna henüz alan eklenmedi; dolayısıyla kullanıcıdan uçuş numarası toplanmıyor. Staging deploy otomatik tetiklenebilir; yeni DB sütunu Hibernate `ddl-auto=update` ile ekleneceğinden mevcut migration riski sürüyor. Herhangi bir verinin korunduğu ayrıca doğrulanmadı.
- **Sonraki adım:** CI'yi doğrula, ardından React formuna opsiyonel uçuş numarası girişini ekle.

## 2026-11-16 — Görev 2.1 uçuş numarası frontend uçtan uca bağlandı
- **Kod:** `BookingFormPage` flightNumber state, kullanıcı girdisi ve 20 karakter doğrulaması; `bookingTransferInfo` localStorage'a yazma; `BookingConfirmationPage` POST payload'ına ekleme, özet ve başarı ekranında gösterme; `BookingPassengerPage` özel istekler placeholder'ından uçuş numarası ifadesini kaldırma. Commitler `f9b9df8`, `ab8129c`, `0efdc99`.
- **Backend testi:** `388a448` CI run `43847834472` başarılı. React değişikliklerinin son CI run'ı `43848189495` ilk kontrolde queued; sonuç bekleniyor.
- **Risk:** Form alanı opsiyonel; canlı tarayıcı üzerinden uçuş numaralı gerçek rezervasyon henüz doğrulanmadı. Staging'de deploy sonrasında E2E gerekir.

## 2026-11-16 — Görev 2.2 otel adı eklendi ve test yazıldı
- **2.3/2.4 CI doğrulandı:** `d7bfc8a6` run `43848683903` **success** (Spring Boot PostgreSQL integration ve React/TypeScript build job'ları başarılı).
- **2.2 Kod:** `BookingPassengerPage` opsiyonel otel/konaklama adı input'u (120 karakter), `BookingConfirmationPage` API payload ve özet, frontend booking type, backend DTO `@Size(max=120)`, Booking entity ve create/update mapping eklendi. Son test commit `351e3ae`.
- **Test:** `savesHotelNameAndRejectsOverlongAccommodationName` entegrasyon testi eklendi; geçerli otel adının yanıtta dönmesi ve 121 karakterin 400 dönmesi bekleniyor. GitHub Actions run `43850774232` ilk kontrolde queued; sonuç doğrulanmadı.
- **Eğitim notu:** Kullanıcı daha sonra `idempotency_key` ve `request_fingerprint` DB sütunlarının amaçlarını ve kod akışını örneklerle satır satır öğrenmek istiyor. Bu eğitim mutlaka ayrıca yapılacak.
- **Risk:** Yeni sütun staging DB'de Hibernate `ddl-auto=update` ile otomatik oluşturulabilir; migration ve backup güvenliği hâlâ tamamlanmadı.


## 2026-11-16 — Yeni sohbet devralma, CI doğrulama ve eğlence modu geri alma
- **Aktif maddeler:** 1.3, 1.5 ve 2.1–2.4. Ana panodaki 2.2–2.4 durumları son kod ve CI ile eşitlendi.
- **Kanıt:** GitHub Actions otel adı testi 43850774232 success; son ortak CI 43850821468 success. Render frontend/backend aynı c0311668 commit'i için live doğrulandı. Bunlar otomatik browser E2E değildir.
- **Eğlence modu:** Ana sayfa Book Now geçici olarak eşşek yapıldı (52c2afa); Render frontend deploy live ve CI 43856521564 success. Ardından normal metin Book Now olarak geri alındı (48fc460). Geri alma deploy ve CI ayrıca kontrol edilecek.
- **Veritabanı sınırı:** Render PostgreSQL salt-okunur MCP sorgusu SSL/TLS/harici bağlantı kısıtıyla başarısız. Şema/unique constraint veya backup doğrulanmış sayılmaz. POSTGRES_MIGRATION_PLAN.md Phase 0 için yetkili DBeaver erişimi gerekir; canlı veride ALTER/DROP yapılmayacak.
- **Eğitim standardı:** Sorun → kanıt → neden → düzeltme → test → sonuç; gerektiğinde idempotency_key ve request_fingerprint satır satır öğretilecek.
- **Kaldığımız yer:** Geri alma deploy/CI kontrolü, ardından güvenli Phase 0 şema envanteri ve browser E2E planı. 1.3/1.5/2.1–2.4 TEST BEKLİYOR.


## 2026-11-16 — Önceki sohbet SEO kararları ve kaynak kod denetimi
- **Aktif sıra:** Görev 1.3/1.5 güvenlik ve migration ile Görev 2.1–2.4 staging E2E hâlâ açık. SEO, 9. ana madde olarak planlanıyor; tamamlandı sayılmıyor.
- **Önceki strateji:** Hedef aramalar Dalaman Airport Transfers, Dalaman Airport Taxi ve Dalaman Airport → destinasyon bazlı sorgular. UK English, gerçek hizmet ve özgün rota içeriği; ana sayfa, routes, vehicles, services, contact ve ileride ayrı destinasyon sayfaları. Reklam yerine başlangıçta organik sosyal medya ve SEO ağırlığı; marka/domain henüz sabitlenmeyecek.
- **Kaynak kod kanıtı:** frontend/src/shared/seo/config.ts içinde sayfa bazlı title/description/indexability kayıtları; usePageSeo.ts ile istemci tarafında meta, robots, canonical ve OG etiketleri; frontend/SEO_STANDARD.md ile kurallar mevcut. frontend/src/app/router.tsx yalnızca genel /routes sayfasını içeriyor, ayrı /dalaman-airport-to-marmaris benzeri rota sayfaları yok. frontend/public altında sitemap.xml ve robots.txt yok. frontend/index.html Vite SPA kabuğu; indekslenebilir sayfalar için prerender/SSG yok.
- **Güvenlik/SEO kuralı:** Preview Render domain'i noindex kalmalı. Booking/passenger/confirmation/lookup ve admin sitemap dışında; bilinmeyen yollar noindex. Onaylı gerçek HTTPS domain seçilmeden VITE_SITE_URL production canonical olarak atanmayacak. Uydurma fiyat, yorum, adres, seyahat süresi veya schema iddiası eklenmeyecek.
- **SEO uygulama sırası:** (1) Domain/marka ve hedef rota/arama niyeti kararı; (2) özgün rota sayfaları ve iç linkler; (3) indekslenebilir public sayfalar için build-time prerender/SSG ve ilk HTML'de title/description/canonical/robots; (4) aynı route registry'den sitemap.xml ve robots.txt; (5) doğrulanmış Schema.org ve Search Console/Lighthouse/JS kapalı test; (6) rezervasyon E2E regresyonu.
- **Önemli teknik risk:** Şu anki usePageSeo.ts meta etiketleri React mount sonrası oluşturuyor; build HTML içeriğini ve ilk yanıtın indexability'sini kanıtlamaz. Prerender çözümü seçilmeden preview indexable yapılmayacak.
- **Kaldığımız yer:** Önce 1.3 Phase 0 salt-okunur PostgreSQL şema envanteri ve 1.5 smoke/E2E; ardından SEO 9 için bağımsız uygulama commitleri. Eğitim günlüğü problem/kanıt/neden/düzeltme/test biçiminde tutulacak.


## 2026-11-16 — 1.3 farklı payload 409 DB satır sayısı regresyonu
- **Sorun:** Aynı Idempotency-Key ile farklı müşteri verisi gönderilince HTTP 409 testi vardı; ancak hatalı retry sonrasında DB'de yeni kayıt oluşmadığı ayrı assertion ile doğrulanmıyordu.
- **Düzeltme:** BookingIntegrationTests.reusedKeyWithDifferentBookingDataReturnsConflict içinde ilk POST öncesi bookingRepository.count() alındı, ilk POST sonrası +1 ve farklı payload 409 sonrası yine +1 beklendi. Commit 4b0c951.
- **Test durumu:** GitHub Actions run 43858026331 completed/success (commit 4b0c951). CI'da PostgreSQL regresyonu başarılı; gerçek Render DB veya browser E2E testi değildir. Test CI izole PostgreSQL üzerinde çalışır, Render staging DB üzerinde işlem yapılmadı.
- **SEO durumu:** 9. madde planı ve mevcut kod denetimi önceki günlükte kayıtlı; indekslenebilir HTML/SSG, sitemap ve destinasyon sayfaları hâlâ açık.
- **Kaldığımız yer:** CI sonucunu doğrula; ardından 1.3 Phase 0 gerçek şema envanteri ve 1.5 browser E2E. PostgreSQL erişim kısıtı nedeniyle canlı migration yapılmadı.


## 2026-11-16 — 1.3 çakışan retry regresyon CI sonucu doğrulandı
- **Kanıt:** GitHub Actions run 43858026331, commit 4b0c95179b1b64d0552a5672ad7cce8ffde3f6fa için completed/success.
- **Sonuç:** Aynı Idempotency-Key farklı rezervasyon içeriğiyle tekrar kullanıldığında HTTP 409 ve tek yeni DB kaydı beklentisini içeren CI başarılı. Bu sadece test ortamındaki doğrulamadır.
- **Durum:** 1.3 TEST BEKLİYOR; migration, staging browser E2E ve gerçek DB şema envanteri tamamlanmadı.
- **Kaldığımız yer:** Phase 0 salt-okunur PostgreSQL envanterine erişim sağlanana kadar 1.5 için güvenli otomatik E2E test altyapısını incele.


## 2026-11-16 — 2.3/2.4 bagaj ve çocuk koltuğu sınır testleri
- **Sorun:** DTO'da luggageCount 0–20 ve babySeatCount 0–5 sınırları mevcut; entegrasyon testi negatif çocuk koltuğunu kontrol ediyor ancak üst sınırları ve negatif bagajı kapsamıyordu.
- **Düzeltme:** BookingIntegrationTests.persistsLuggageAndBabySeatCountsAndRejectsNegativeValues testine babySeatCount=6, luggageCount=-1 ve luggageCount=21 için HTTP 400 assertion'ları eklendi. Commit f5b1b3a.
- **Test:** Yeni commit'in GitHub Actions CI sonucu henüz doğrulanmadı; izole PostgreSQL üzerinde çalışacak. Staging/production DB'ye yazma yapılmadı.
- **Risk:** Önceki 0–20 bagaj sınırı daha sonra kullanıcı kararıyla 0–8 olarak daraltıldı; araç bazlı gerçek kapasite ayrıca kontrol edilir; operasyonel kapasite/koltuk tipi ve yaş gereksinimleri ayrıca kararlaştırılmalı.
- **Durum:** 2.3/2.4 TEST BEKLİYOR; browser E2E ve iş kuralları açık.
- **Kaldığımız yer:** f5b1b3a CI sonucunu doğrula; ardından 1.5 güvenli E2E altyapısını ve 1.3 PostgreSQL Phase 0 envanterini ilerlet.


## 2026-11-16 — 2.3/2.4 kullanıcı kararı: bagaj 0–8, çocuk koltuğu 0–2
- **İstenen kural:** Bagaj maksimum 8, çocuk koltuğu maksimum 2. Negatif sayılar geçersiz. Yolcu en az 1, üst sınır seçilen aracın kapasitesi.
- **Backend:** BookingRequestDto üzerinde luggageCount @Min(0)/@Max(8), babySeatCount @Min(0)/@Max(2). Commit 3a1b016.
- **Frontend:** BookingFormPage CounterField min/max destekli; artı/eksi butonları sınırda disabled, click clamped, continue validasyonu bagaj 0–8, çocuk koltuğu 0–2 ve seçilen araç kapasitesini kontrol ediyor. Commit 1de2cbb.
- **Test:** BookingIntegrationTests sınır 0, bagaj 8, çocuk koltuğu 2 kabul; -1, bagaj 9, çocuk koltuğu 3 için HTTP 400 beklentisi. Commit 5ac89cb. CI sonucu henüz doğrulanmadı.
- **Not:** API'de bagaj/koltuk opsiyonel (null) olabilir; bu kural mevcut kayıtlar ve eski istemciler için geriye dönük uyumluluğu koruyor. Fiyat/araç bazlı bagaj kapasitesi iş kuralları ayrıca incelenecek.
- **Kaldığımız yer:** 5ac89cb GitHub Actions sonuçlarını doğrula; başarılıysa 1.5 E2E ve 1.3 güvenli migration envanterine devam et.


## 2026-11-16 — Kod standardı ve regresyon denetimi
- **Kapsam:** React/TypeScript ESLint ve build, Spring Boot PostgreSQL entegrasyon testleri, hata sözleşmesi, 0–8 bagaj / 0–2 çocuk koltuğu değişiklikleri. Tüm proje mimarisinin eksiksiz denetlendiği iddia edilmez.
- **Tespit 1:** BookingValidationExceptionHandler ve GlobalExceptionHandler aynı IllegalArgumentException için farklı JSON cevapları üretiyordu. Tek GlobalExceptionHandler bırakıldı (commit 4490d7e). HTTP 400 status/message sözleşmesi için entegrasyon assertion'ı eklendi (9ddf1d5). Önceki handler silme commit'i CI success; yeni assertion'ın CI sonucu ayrı doğrulanmalı.
- **Tespit 2:** CI sadece TypeScript build çalıştırıyordu; `npm run lint` eklendi (14d9d7f). İlk lint çalışması 3 hatayı buldu: API'de iki adet preserve-caught-error ve BookingFormPage render sırasında Date.now() (react-hooks/purity).
- **Düzeltme:** Hata nesnelerine `{ cause: error }` eklendi (709029d). Bugünün yerel tarihi render yerine useState lazy initializer'da hesaplanıyor (853e88b). İş mantığı ve kullanıcıya gösterilen hata mesajları korunuyor.
- **Önceki CI kanıtı:** 5ac89cb sınır değer testleri, 1de2cbb frontend build ve 3a1b016 backend limitleri GitHub Actions completed/success. Son değişiklikleri içeren run 43859706766 ilk kontrolde queued; sonucun ayrıca kontrolü gerekli.
- **Bağımlılık riski:** npm ci çıktısında 19 güvenlik uyarısı (10 moderate, 9 high) bildirildi; paket/etki analizi yapılmadan `npm audit fix --force` uygulanmadı.
- **Açık işler:** ESLint+build+PostgreSQL CI yeşil olmadan tamamlandı sayma. Browser E2E, araç bazlı bagaj kapasitesinin backend doğrulaması, PostgreSQL migration envanteri, SEO SSG ve gerçek marka/iletişim verileri açık.


## 2026-11-16 — Kullanıcı rezervasyon akışının çalıştığını bildirdi; negatif yolcu regresyonu
- **Kullanıcı doğrulaması:** Rezervasyonun çalıştığı bildirildi. Bu, asistan tarafından bağımsız tarayıcı E2E ve canlı DB sorgusuyla doğrulanmadığı için bu iki kontrol kapatılmadı.
- **Yeni otomatik test:** BookingIntegrationTests.rejectsZeroAndNegativePassengersWithoutCreatingBookings: passengerCount 0 ve -1 için HTTP 400, tutarlı hata mesajı ve bookingRepository.count() değişmemesi. Commit e274509.
- **Önceki CI:** Kod standardı audit günlüğü commit 498d534 için run 43859747390 completed/success; lint, build ve izole PostgreSQL testleri başarılı.
- **Yeni test CI:** e274509 için GitHub Actions sonucu henüz doğrulanmadı; başarı onaylanana kadar TEST BEKLİYOR.
- **Açık tutarsızlık:** Frontend seçili aracın maxLuggage kapasitesini denetliyor; backend yalnızca genel 0–8 sınırını denetliyor. Özellikle vip-minivan için frontend maxLuggage=6 iken API 8'i kabul ediyor. Bu iş kuralı API seviyesinde eşitlenmeden kapatılmamalı; mevcut testte vip-minivan + 8 bagaj kabul ediliyor.


## 2026-11-16 — Birleşik iyileştirme: kararsız test + araç kapasitesi + regresyon
- **CI kök neden:** e274509 run 43860523383 PostgreSQL testlerinde tek hata `savesIndependentReturnDateAndTime`: beklenen LocalDateTime.toString() saniyeyi atlıyor, JSON saniyeyi `:00` olarak yazıyor. Sabit `yyyy-MM-dd'T'HH:mm:ss` assertion ile düzeltildi (20867017). Uygulamanın tarih davranışı değiştirilmedi.
- **Backend kapasite tutarlılığı:** TransferPricingService.validateLuggageCapacity; taxi=3, vip-minivan/premium=6, maybach*=4, minibus*=8 (genel API sınırı). BookingService.createNewBooking ve updateBooking çağırıyor (ab93010, 7a7da3). Frontend zaten bu araçlara göre sınırlandırıyordu; API bypass kapatıldı.
- **Regresyon:** VIP minivan 6 bagaj kabul/7 bagaj ret, minibus 8 kabul/9 ret, çocuk koltuğu 0–2, negatif yolcu 0/-1 ret ve veritabanında insert olmaması testleri (2541a03). Son run 43860943209 ilk kontrolde in_progress; yeşil sonuç gelmeden tamamlandı olarak işaretlenmeyecek.
- **Uyarı:** Araç kapasitesi rakamları mevcut frontend kataloğundan alınmıştır; fiziksel araç filosuyla doğrulanması ayrıca gereklidir. Live DB E2E ayrı açık görevdir.


## 2026-11-16 — Sonraki işler ve admin kataloğu kararı
- **Kullanıcı kararı:** Araçların yolcu ve bagaj kapasiteleri ile güzergâh/araç fiyatları ileride **admin panelinden değiştirilebilir** olacak. Şu an fiyatlar ve araç özellikleri statik kataloglarda. Admin paneli eklenene kadar bunlar değiştirilemez kabul edilmeli; API doğrulaması istemcinin sunduğu değere güvenmemeli.
- **Plan (ayrı iş):** PostgreSQL'de araç (id, isim, maxPassengers, maxLuggage, aktif) ve fiyat (güzergâh, araç, tek yön/gidiş-dönüş, para birimi) kayıtları; kontrollü Flyway migration ve seed; yalnızca admin yetkili CRUD; değer aralıkları ve negatif fiyat kontrolleri; frontend'in katalog API'sinden veri alması; rezervasyon anındaki fiyatın booking üzerinde snapshot olarak saklanması. Admin değişikliği geçmiş rezervasyonun fiyatını değiştirmemeli.
- **Bu tur:** Araç kapasitesini aşan PUT isteğinin 400 döndürmesini ve kaydedilmiş rezervasyonu değiştirmemesini doğrulayan PostgreSQL entegrasyon testi eklendi (cb5436c). CI sonucu bekleniyor.
- **Doğrulanan önceki CI:** 2541a03 için 43860943209 ve e8b49f5 için 43860993068 completed/success. Daha önceki ara commit 7a7da3ee CI başarısızlığı son sürümün başarısız olduğu anlamına gelmez.
- **Sıra:** (1) yeni test CI, (2) güvenli DB migration/şema envanteri, (3) gerçek browser E2E, (4) gerçek fiyat/iptal kuralları, (5) admin katalog yönetimi. Sahte iletişim bilgileri ve placeholder'lar canlıya taşınmadan değiştirilmelidir.


## 2026-11-16 — Admin dışı eksikler: ana sayfa, iletişim ve rezervasyona yönlendirme
- **Önceki test kanıtı:** d6d063b6 run 43861291507 completed/success; kapasite aşımı nedeniyle reddedilen admin PUT sonrası verinin değişmemesi ve geçerli PUT sonrası kaydın güncellenmesi PostgreSQL CI testlerinde doğrulandı. Bu sadece regresyon testidir; admin UI geliştirilmedi.
- **Görev 8, bozuk bağlantılar:** Ana sayfadaki View All Vehicles, üç araç kartının Select Vehicle butonu, Book Online Now, Contact Us/WhatsApp Support, footer href=# bağlantıları işlevsel React Router Link'lerine dönüştürüldü. Doğrulanmamış sigorta/şartlar/gizlilik bağlantıları gerçek sayfalar oluşana kadar gösterilmiyor. Commit ba8f7ec8.
- **Görev 3/4, yanıltıcı bilgi:** Ana sayfadaki EUR fiyat etiketleri gerçek GBP rezervasyon kataloğuyla tutarsız olduğundan kaldırıldı, kullanıcı rezervasyon fiyatına yönlendiriliyor. Doğrulanmamış 24/7 destek, sürücü vetting, peşin ödeme ve WhatsApp vaadi azaltıldı. Contact sayfasındaki sahte +90 555 000 00 00 ve doğrulanmamış e-posta kaldırıldı; flight tracking vaadi uçuş bilgisi toplama açıklamasına dönüştürüldü. Commit 92643659.
- **Görev 8, araç kartları:** Ana sayfa görünen 7/9 yolcu ve 10 bagaj iddiaları rezervasyon kataloğundaki 5/5 yolcu ve 6 bagaj ile uyumlu hale getirildi (086418ba). Araç kartı model adları ve özellikleri ayrıca gerçek filoyla doğrulanmalı.
- **Kalan:** Gerçek iletişim kanalı kullanıcıdan onaylı bilgi gelene kadar açık; privacy/terms/insurance için doğrulanmış metin/sayfa; SEO prerender; otomatik browser E2E; rezervasyon e-postaları; migration; fiyat/iptal politikası. Bu tur admin koduna dokunulmadı. Son frontend CI sonucu henüz kontrol edilmeli.


## 2026-11-16 — Admin dışı: ödeme iddiaları ve güvenli sorgulama
- CI kontrolü: 6bd4e1ec için GitHub Actions run 43861627066 completed/success; önceki public-site lint/build/PostgreSQL CI işleri geçti.
- Görev 3: BookingConfirmationPage üzerindeki doğrulanmamış sürücüye nakit ödeme, dört para birimi kabulü, vergiler/otopark/otoyol dahil ve bagaja göre fiyat değişimi iddiaları kaldırıldı. Ödeme online alınmadığı, ödeme yönteminin sağlayıcıyla doğrulanması gerektiği yazıldı. Gerçek ödeme ve iptal politikası hâlâ BEKLİYOR. Commit 8265a2b.
- Görev 8: ConfirmationFooter içindeki işlevsiz # legal/sigorta/WhatsApp bağlantıları ve doğrulanmamış 24/7 vaadi kaldırıldı, gerçek Contact/Services rotaları bağlandı. Commit 8265a2b.
- Görev 6: BookingLookupPage placeholder yerine İngilizce güvenli erişim açıklaması ve çalışan yönlendirmeler içeriyor. Referans ID tek başına PII göstermeyecek; doğrulama olmadan public lookup endpoint açılmayacak. Gerçek sorgulama hâlâ BEKLİYOR. Commit 98e8bf2.
- Son iki commit CI sonucu bekleniyor; gerçek tarayıcı E2E hâlâ açık. Admin koduna dokunulmadı.


## 2026-11-16 — Yolcu formu: giriş doğrulama ve mobil düzeltmeler
- Önceki işler için CI: 1abe11f5 run 43861980274, 98e8bf2e run 43861935464 ve 8265a2be run 43861914595 completed/success.
- Yolcu formu: TR telefon tam 10 hane; diğerleri en az 7 hane ve ülke kodu dahil E.164 en fazla 15 hane. Bozuk e-posta istemcide reddediliyor. localStorage transfer JSON hatasında kontrollü mesaj gösteriliyor (263ac895).
- Mobil: telefon input min-w-0/flex-1, adım devam butonları wrap; e-posta lower-case normalize; telefon autoComplete eklendi (74751397).
- Yolcu sayfasındaki işlevsiz newsletter, legal/support # linkleri, 24/7 ve doğrulanmamış ücretsiz Meet & Greet ve tüm vergiler dahil ifadeleri kaldırıldı. Yalnızca gerçek Contact/Services rotaları gösteriliyor (263ac895).
- Son iki commit için CI sonucu henüz doğrulanmadı. Browser E2E, güvenli rezervasyon sorgulama, e-posta bildirimleri ve gerçek ödeme/iptal politikası açık. Admin geliştirmesi yapılmadı.
