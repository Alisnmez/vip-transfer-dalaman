# EKSİKLERİMİZ — Uygulama ve öğrenme günlüğü

Bu dosya projenin tek ilerleme kaydıdır. Her görevde: problem → kanıt → neden → düzeltme → test → ortaya çıkan yeni sorun → sonuç yazılır. Doğrulanmadan "tamamlandı" denmez.

## Canlı görev panosu — tek bakışta kaldığımız yer

**Güncelleme kuralı:** Her geliştirme commit'inde önce ilgili alt maddenin durumu, kanıtı, sonraki adımı ve son commit'i güncellenir. Tarihli günlük aşağıda değişmeden korunur. Yalnızca test edilmiş ve doğrulanmış işler **TAMAMLANDI** olur.

**Durum sözlüğü:** BEKLİYOR · DEVAM EDİYOR · TEST BEKLİYOR · BLOKE · TAMAMLANDI. Her alt maddede tek bir durum kullanılır.

### 1. Backend, PostgreSQL ve rezervasyon güvenilirliği

**Genel durum:** DEVAM EDİYOR  
**Şu an üzerinde çalışılan:** **1.3 — Mükerrer rezervasyonları önleme (TEST BEKLİYOR)**  
**Bir sonraki somut işlem:** Gerçek tarayıcı E2E testi, frontend bağımsız rezervasyon yaşam döngüsü ve kontrollü PostgreSQL migration planı.

| No | Alt iş / sorun | Durum | Kanıt / yapılan işlem | Sıradaki işlem |
|---|---|---|---|---|
| 1.1 | Backend derleme hatası | TAMAMLANDI | Fazladan virgül düzeltildi; Render backend canlı doğrulandı. `590f582` | Regresyon halinde yeniden aç |
| 1.2 | PostgreSQL bağlantısı ve mevcut test altyapısı | TAMAMLANDI | Render PostgreSQL bağlantısı ve izole CI PostgreSQL ile 14 başarılı test doğrulandı. `bf60c97`, CI run `43839886864` | Yeni testleri CI'ya ekle |
| 1.3 | Aynı POST'un iki kayıt oluşturabilmesi | TEST BEKLİYOR | Eşzamanlı PostgreSQL testi ve React build **başarılı** (`06c4cfa`, run `43843124407`); sayfa yenileme düzeltmesi **başarılı** (`89240d1`, run `43843263719`) | Gerçek tarayıcı E2E, migration ve bağımsız işlem yaşam döngüsü |
| 1.4 | Frontend → backend → DB gerçek rezervasyon akışı | BEKLİYOR | İzole backend POST/GET testi mevcut; tarayıcı uçtan uca doğrulama yok | Ayrı test ortamında E2E |
| 1.5 | Dağıtım sonrası doğrulama ve üretim güvenliği | BEKLİYOR | Önceki backend deploy doğrulandı; yeni idempotency sürümü henüz yok | CI, deploy, log ve güvenli smoke test |

**Tamamlanma koşulu:** 1.1–1.5 doğrulanmış olmalı; CI yeşil, tekrarlı/eşzamanlı istekler tek kayıt oluşturmalı ve frontend rezervasyonu test ortamında uçtan uca çalışmalı.

### 2–12. Diğer ana maddeler

**Durum:** BEKLİYOR. Görev 1 bitmeden yeni ana maddeye geçilmeyecek; başlanınca aynı biçimde 2.1, 2.2… alt maddeleri açılacak.

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
