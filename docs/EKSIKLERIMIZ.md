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

**Genel durum:** TAMAMLANDI — kullanıcı 2026-11-16 tarihinde dört alanı içeren gerçek rezervasyonu oluşturduğunu ve başarılı olduğunu doğruladı. Görev 1 migration/production güvenlik kontrolleri ayrı takip ediliyor.

| No | Alt iş | Durum | Kanıt | Sonraki adım |
|---|---|---|---|---|
| 2.1 | Uçuş numarası | TAMAMLANDI | DTO/entity/service/test (`388a448`) CI başarılı (`43847834472`); React form → localStorage → confirmation → POST bağlandı (`f9b9df8`, `ab8129c`) | Kullanıcının 2026-11-16 canlı rezervasyon doğrulaması alındı; ileride regresyonda yeniden kontrol et |
| 2.2 | Otel bilgisi | TAMAMLANDI | Opsiyonel hotelName (120 karakter) frontend/backend ve entegrasyon testinde mevcut; CI 43850774232 başarılı. | Kullanıcı 2026-11-16 gerçek rezervasyonun başarılı olduğunu bildirdi; bağımsız DB sorgusu yapılmadı |
| 2.3 | Bagaj bilgisi | TAMAMLANDI | Genel sınır 0–8; araç bazlı kapasite API create/update tarafında uygulanıyor, CI 43860943209 başarılı. | Kullanıcı 2026-11-16 gerçek rezervasyonun başarılı olduğunu bildirdi; bağımsız DB sorgusu yapılmadı |
| 2.4 | Çocuk koltuğu | TAMAMLANDI | babySeatCount DTO/entity/frontend payload'da mevcut; güncel sınır 0–2, CI 43860943209 başarılı. | Kullanıcı 2026-11-16 gerçek rezervasyonun başarılı olduğunu bildirdi; bağımsız DB sorgusu yapılmadı |

**Doğrulama sınırı:** Başarı bilgisi kullanıcının gerçek rezervasyon denemesine dayanır. Bağımsız veritabanı sorgusu veya otomatik E2E çalıştırıldığı iddia edilmez.

### 3. Gerçek fiyat, ödeme ve iptal kuralları

**Genel durum:** DEVAM EDİYOR — 2026-11-16 kod denetimi yapıldı; ticari koşullar doğrulanmadan fiyatlar değiştirilmez.

| No | Alt iş | Durum | Kanıt | Sonraki adım |
|---|---|---|---|---|
| 3.1 | Fiyatın sunucuda hesaplanması | TAMAMLANDI | `BookingService` fiyatı `TransferPricingService.calculatePrice` ile sunucudaki `transfer-prices.json` dosyasından hesaplıyor; istemci fiyatına güvenilmiyor. Önceki fiyat testleri CI'da geçti. | Ticari fiyat onayı ayrı 3.2'de |
| 3.2 | Gerçek tarife ve rakip karşılaştırması | BLOKE | Fiyat kataloğu mevcut, fakat işletme maliyetleri ve güncel Petunia Travel fiyatları doğrulanmış değil. | Kaynak fiyatlar, tarih, rota, araç sınıfı, para birimi ve minimum kârı doğrula; ardından tek yön -£2,50 / gidiş-dönüş -£5 hedefini değerlendir |
| 3.3 | Ödeme yöntemi ve tahsilat açıklaması | DEVAM EDİYOR | Yalnızca nakit kararı alındı; son onay ekranı güncellendi (`6f990011`). | Tahsilat zamanı ve kabul edilen nakit para birimi **logo/metin/son rötuşlar aşamasında** kullanıcıdan alınacak; şimdi sorulmayacak |
| 3.4 | İptal ve iade koşulları | DEVAM EDİYOR | Hizmet ve iletişim sayfalarında rezervasyon referansıyla iptal/değişiklik talebi için iletişim yönlendirmesi eklendi (`efe66482`); hiçbir iade garantisi veya süre uydurulmadı. | İptal/iade koşullarının nihai metni **son rötuşlar** aşamasında işletme onayıyla eklenecek |

### 4. İşletme rezervasyon takibi ve admin erişimi

**Genel durum:** DEVAM EDİYOR — API bağlantısı var, ancak erişim güvenliği ve canlı veri görünürlüğü henüz kanıtlanmadı.

| No | Alt iş | Durum | Kanıt | Sonraki adım |
|---|---|---|---|---|
| 4.1 | Admin rezervasyon listesi | TEST BEKLİYOR | Gerçek `getBookings()` verisi ve müşteri/rota/referans araması (`2d0a180a`); manuel yenileme eklendi (`fd14367`). | Yetkili admin oturumunda yeni kayıtların yenilemeyle geldiğini doğrula |
| 4.2 | Admin rezervasyon detayı | TEST BEKLİYOR | Detay ve düzenleme mevcut; serbest metin rota/araç alanları katalog seçimine çevrildi, fiyatı olmayan kombinasyon kayıttan önce engelleniyor (`c551bb5`). | CI ve canlı admin düzenleme senaryosunda doğrula |
| 4.4 | Admin dashboard gerçek veriler | TEST BEKLİYOR | Uydurma istatistikler kaldırıldı (`86b2d9b8`); iptal edilenler planlanan taleplerden çıkarıldı (`278d4be`), PENDING dahil onaylanmamış talepler açık etiketlendi (`cc54ea6`). | CI ve gerçek DB ile doğrula; İstanbul saat dilimi ve tarihlerini test et |
| 4.3 | Admin API erişim güvenliği | TEST BEKLİYOR | `SecurityConfig` POST dışında `/bookings/**` için ADMIN rolü ve HTTP Basic istiyor; boş ADMIN_PASSWORD admini kilitliyor. Admin girişi artık müşteri listesini indirmeden korumalı `GET /admin/auth-check` (204 boş yanıt) çağırıyor (`739de66`, `f3b202e`, `d1dfa17`, `9714160`); parolayı yalnızca bellekte tutuyor. Önceki CI `43952884744` başarılı, yeni değişiklikler için CI bekleniyor. | Canlı HTTPS, Render ADMIN_PASSWORD ve auth-check için yetkisiz 401 / yetkili 204 doğrulansın; uzun vadede sunucu tarafı oturum/CSRF koruması değerlendirilsin |

### 5–12. Diğer ana maddeler

**Durum:** BEKLİYOR.

## 2026-11-17 — Admin rezervasyon düzenlemede fiyat bulunamaması
- **Aktif madde:** 4.2 — admin rezervasyon detaylarını düzenleme.
- **Hata:** Kullanıcı `Error while saving details: No price found for the selected destination and vehicle.` bildirdi. Backend `TransferPricingService` katalogdaki `destination` ve `vehicleId` değerleriyle birebir eşleşme istiyor; admin formu bunları serbest metin olarak alıyordu.
- **Düzeltme:** Pickup/destination ve araç alanları mevcut `transferPrices` / `transferVehicles` listesinden seçilir hale getirildi. Save öncesinde bir tarafın Dalaman Airport olması ve rota/araç fiyat kaydının bulunması kontrol ediliyor (`c551bb5`). Backend fiyat güvenliği gevşetilmedi.
- **Test:** Commit edildi; yeni CI ve canlı düzenleme testi bekleniyor. **TEST BEKLİYOR.**
- **Kaldığımız yer:** CI sonucu ve admin düzenleme formunda geçerli rota/araçla kayıt; geçmiş veya artık katalogda bulunmayan rotalar için ayrıca uyumluluk değerlendirmesi.

## 2026-11-17 — Admin girişinde kişisel veri indirmeyi kaldırma
- **Aktif madde:** 4.3 — admin erişim güvenliği.
- **Sorun ve kanıt:** Admin giriş formu `getBookings()` ile tüm müşteri ad/telefon/e-posta/adres bilgilerini indiriyordu. Kullanıcı DevTools Network Response'da bunu gösterdi. Yetkili adminin Network verisini görmesi tek başına yetkisiz sızıntı değildir.
- **Düzeltme:** Spring Security `ADMIN` korumalı `GET /admin/auth-check` endpoint'i (204 No Content), ilgili CORS kaydı ve frontend `checkAdminAccess()` eklendi. Giriş bu endpoint'i kullanıyor; giriş kontrolü 20 saniye timeout'a sahip (`739de66`, `f3b202e`, `d1dfa17`, `9714160`).
- **Test ve sonuç:** GitHub'a commit edildi. Yeni CI, Render deploy ve canlı yetkisiz 401 / yetkili 204 doğrulaması bekleniyor; **TEST BEKLİYOR**.
- **Sonraki adım:** CI/Render kontrolü; girişte artık kişisel veri response'u olmadığını, girişten sonra rezervasyonların yetkili erişimde yüklendiğini doğrula.

## 2026-11-17 — Admin rezervasyon listesini elle yenileme
- **Aktif madde:** 4.1 — işletme rezervasyon listesi.
- **Sorun ve kanıt:** `BookingListPage.tsx` listeyi yalnızca ilk açılışta yüklediği için sayfa açıkken gelen yeni rezervasyonlar görünmüyordu; v1.0'da otomatik e-posta/bildirim yok.
- **Düzeltme:** `Refresh bookings` butonu eklendi; bekleme ve hata durumları gösteriliyor, yenileme sırasında çift tıklama engelleniyor (`fd14367`). Mevcut arama filtresi korunuyor.
- **Test:** Kod commit edildi; CI ve gerçek admin verisiyle yenileme testi henüz yapılmadı. **Durum: TEST BEKLİYOR.**
- **Kaldığımız yer:** CI sonucunu kontrol et; yetkili admin oturumunda liste, detay, durum değiştirme ve manuel yenilemeyi gerçek kayıtla doğrula.

## 2026-11-16 — Admin dashboard talepler ile onaylı transferlerin ayrılması
- **Aktif madde:** 4.4.
- **Sorun ve kanıt:** `PENDING` taleplerin 'scheduled transfers' olarak sunulması onaylanmış transfer izlenimi veriyordu.
- **Düzeltme:** Başlıklar 'booking requests' olarak netleştirildi, her yaklaşan talebin gerçek durumu ve bekleyen talep sayısı gösterildi (`cc54ea6`). İptal edilenler hariç tutuluyor; toplam geçmiş talep sayısı korunuyor.
- **Test:** GitHub'a commit edildi; CI ve gerçek admin verisi doğrulaması henüz bekleniyor. **Durum: TEST BEKLİYOR.**
- **Sonraki adım:** CI sonucunu kontrol et, canlı admin giriş/liste/detay/durum değişikliği testini yap.

## 2026-11-16 — Admin dashboard iptal edilen transferleri saymama
- **Aktif madde:** 4.4 — dashboard gerçek veri doğruluğu.
- **Sorun ve kanıt:** `DashboardPage.tsx` bugünkü/yaklaşan transferleri tüm rezervasyonlardan hesapladığı için `CANCELLED` kayıtlar operasyon listesine giriyordu.
- **Yapılan değişiklik:** `activeBookings` filtresi eklendi; iptal edilenler planlanan transferlerden çıkarıldı, toplam rezervasyon talebi sayısı tarihçe olarak korundu (`278d4be`).
- **Test ve sonuç:** Kaynak kodu kontrol edildi; CI ve canlı admin verisi doğrulaması bekleniyor. Bu yüzden 4.4 durumu **TEST BEKLİYOR** olarak kalır.
- **Kaldığımız yer:** GitHub Actions sonucunu kontrol et; yetkili admin girişinde gerçek kayıtların listesi, detay ve durum değişikliklerini doğrula.
- **Yeni risk / karar:** `PENDING` kayıtları planlanan talepler olarak listelenmeye devam eder; kesin onaylı transfer olarak sunulmamalıdır.

### Her çalışma sonunda zorunlu kayıt şablonu

- **Aktif madde:** ör. 1.3
- **Sorun ve kanıt:** hangi davranış/hata görüldü?
- **Yapılan değişiklik:** dosyalar, gerekçe, commit/PR
- **Test ve sonuç:** komut/CI bağlantısı, geçti/kaldı/çalıştırılmadı
- **Durum:** BEKLİYOR / DEVAM EDİYOR / TEST BEKLİYOR / BLOKE / TAMAMLANDI
- **Kaldığımız yer:** tek cümle, bir sonraki uygulanabilir adım
- **Yeni risk / karar:** varsa ve gerekçesi

---

## 2026-11-16 — Kod standardı ve global yardımcılar denetimi
- **Bulgu:** Dashboard ve rezervasyon listesi tarihleri farklı biçimde hesaplıyordu; `new Date(LocalDateTime)` kullanımı tarayıcı saat dilimine göre yanlış gösterim yapabilirdi. Listede gerçek status yerine sabit Pending, detayda eksik müşteri iletişimi vardı.
- **Düzeltme:** Ortak `features/booking/formatters.ts` içindeki `turkeyNowLocal`, `formatTransferDateTime`, `bookingStatus` yardımcıları kullanıldı (`516ce1be`, `b7830671`, `3809573d`, `73740beb`). Backend alanlarına göre Booking tipi genişletildi (`195e86e7`).
- **CI bulgusu:** Dashboard ilk sürümünde React `react-hooks/set-state-in-effect` hatası (run `43953350971`); asenkron effect ile düzeltildi (`9aca93d3`). Son CI bekleniyor.
- **Açık teknik borç:** Admin layout içinde örnek/işlevsiz kontroller ve diğer admin sayfalarında sahte içerik olabilir; bütün sayfalar ayrıca denetlenmeli. Güvenlik ve E2E testi henüz tamamlanmadı.

## 2026-11-16 — Admin dashboard gerçek veriye geçiş
- **Sorun:** Dashboard gerçek veri yerine sahte müşteri isimleri, sürücüler, EUR ciro ve rezervasyon sayıları gösteriyordu. Operasyonel kararları yanıltıyordu.
- **Düzeltme:** Gerçek `getBookings()` üzerinden toplam talepler, Türkiye saatine göre bugünkü transferler, yaklaşan transferler ve detay bağlantıları eklendi (`86b2d9b8`). Uydurma ciro ve atama bilgileri kaldırıldı.
- **Test:** Commit sonrası CI ve canlı veri testi bekleniyor. API erişimi doğrulanmadan tamamlandı sayılmaz.

## 2026-11-16 — Admin CI düzeltmesi ve ilk yayın değerlendirmesi
- **Sorun:** `AdminLayout` içindeki `useLocation` koşullu çağrıldığı için React lint kırıldı (run `43952560910`).
- **Düzeltme:** Hook bileşenin başına taşındı (`a497030a`).
- **Test:** GitHub Actions `43952884744` React ve Spring Boot/PostgreSQL işlerinin ikisi de başarılı.
- **Kalan kritik işler:** Yetkisiz/yetkili admin canlı erişim testi, gerçek rezervasyon listesi/detayı, staging E2E, fiyat ve işletme koşulları onayı, iletişim/legal/SEO yayın kontrolü. CI başarısı canlı yayına hazır olunduğunu tek başına kanıtlamaz.

## 2026-11-16 — Görev 4 admin kimlik doğrulama
- **Sorun:** Backend ADMIN rolü gerektirse de admin React API çağrılarında Authorization yoktu; admin sayfaları giriş olmadan açılıyordu.
- **Düzeltme:** Sadece admin çağrılarında HTTP Basic Authorization, bellek içi kimlik bilgileri, korumalı GET ile giriş doğrulaması, çıkış (`987b0c3e`, `0d020a72`, `4815e434`). Public POST anonim kaldı.
- **Güvenlik:** Kullanıcı/parola Vite env, bundle, localStorage veya sessionStorage içine kaydedilmiyor. TLS zorunlu. Bu ilk sürüm çözümü, tam sunucu oturum altyapısının yerine geçmez.
- **Test:** CI ve gerçek yetkisiz/yetkili API denemeleri bekleniyor; tamamlandı sayılmaz.

## 2026-11-16 — Görev 4 admin ilk bağlantı ve CI
- **Sorun:** Admin rezervasyon ekranı sahte müşteri, EUR fiyat, işlevsiz buton ve uydurma sayfalama içeriyordu; detay sayfası boştu.
- **Düzeltme:** Gerçek API listesi üzerinde arama, GBP fiyat ve detay sayfası (`2d0a180a`, `5698437a`).
- **Test:** GitHub Actions `43951815776` React/TypeScript ve Spring Boot/PostgreSQL işlerinin ikisi de başarılı. Canlı admin giriş/doğrulama testi yapılmadı.
- **Risk:** `getBookings` istemcisi kimlik doğrulama göndermiyor; backend koruması kontrol edilmeden admin hazır sayılmaz. Kişisel verileri halka açık GET ile göstermeyin.
- **Sonraki adım:** Backend controller/security konfigürasyonu ve admin kimlik doğrulama akışını denetle; gerekirse güvenli sunucu tarafı oturum mimarisi kur.

## 2026-11-16 — Görev 3.3/3.4 yayın öncesi son rötuş ayrımı
- **Karar:** Ödeme tahsilat zamanı ve iptal/iade politikasının nihai ayrıntıları kullanıcı tarafından logo ve metinlerin son kez düzenleneceği aşamada verilecek; şimdi tekrar sorulmayacak.
- **Kod:** Onay ekranında yalnızca nakit olduğu açıklandı (`6f990011`); hizmet ve iletişim sayfalarında iptal/değişiklik talebi için rezervasyon referansıyla iletişim yönlendirmesi eklendi (`efe66482`).
- **Sınır:** Süre, ücret, iade garantisi veya ödeme zamanı uydurulmadı. Canlı yayın öncesinde gerçek şartlar mutlaka onaylanacak.
- **Test:** Değişiklikler GitHub'a kaydedildi; yeni CI sonucu henüz doğrulanmadı.

## 2026-11-16 — Görev 3.3 yalnızca nakit kararı
- **Karar:** Kullanıcı ilk sürümde yalnızca nakit ödeme kabul edileceğini belirtti. Online ödeme ve kart tahsilatı sunulmayacak.
- **Sınır:** Ödemenin transfer öncesi, araçta veya transfer sonunda alınacağı ayrıca teyit edilmeli; zamanlama henüz varsayılmıyor.
- **Sonraki adım:** Ödeme zamanını netleştirip müşteriye gösterilen metni güncelle ve test et. İptal koşulları hâlâ açık.

## 2026-11-16 — Görev 3.3 ödeme kapsamı kararı
- **Karar:** Kullanıcı başlangıç sürümünde online ödeme istemiyor. Ödeme sağlayıcısı, ödeme sayfası veya kart tahsilatı kodu eklenmeyecek.
- **Kanıt:** Kullanıcının 2026-11-16 tarihli açık kararı; mevcut rezervasyon akışı talep kaydediyor.
- **Açık nokta:** Tahsilatın araçta mı yapılacağı ve nakit/kart kabulü henüz belirtilmedi. Bu netleşmeden sitede ödeme yöntemi vaadi gösterilmeyecek.
- **Test:** Belge güncellemesi; kod veya ödeme entegrasyonu değiştirilmedi.

## 2026-11-16 — Görev 2 kullanıcı kabul testi
- **Problem:** 2.1–2.4 alanlarının gerçek rezervasyonda çalıştığının teyidi bekleniyordu.
- **Kanıt:** Kullanıcı 2026-11-16 tarihinde bu alanlarla gerçek rezervasyonu az önce oluşturduğunu ve başarılı olduğunu açıkça bildirdi.
- **Neden:** Önceki otomatik testler canlı kullanıcı akışını tek başına kanıtlamıyordu.
- **Düzeltme:** 2.1–2.4 kullanıcı kabulüne dayanarak TAMAMLANDI olarak işaretlendi; kod değiştirilmedi.
- **Test:** Kullanıcı tarafından canlı rezervasyon akışı denendi; bağımsız DB sorgusu ve yeni otomatik test bu adımda yapılmadı.
- **Yeni risk:** Gelecekteki sürümlerde regresyon ve Görev 1 üretim güvenliği kontrolleri ayrı izlenecek.
- **Sonuç:** Görev 2 kapatıldı, Görev 3 fiyat/ödeme/iptal işleri açık.

## 2026-11-16 — Görev 3'e geçiş ve kod denetimi
- **Problem:** 1 ve 2'deki mevcut kodu tekrar yazmadan 3. maddeye geçmek; fiyat, ödeme ve iptal alanlarının gerçekten uygulanıp uygulanmadığını ayırmak.
- **Kanıt:** `BookingService` sunucu fiyatını katalogdan hesaplıyor; `TransferPricingService` havalimanı güzergâhı, araç ve yolcu kapasitesini denetliyor. `frontend/src/pages/public/InfoPages.tsx` iletişim bilgilerini gösteriyor, ancak onaylı ödeme/iptal şartları burada bulunmuyor. Katalog fiyatları ticari olarak henüz doğrulanmış değil.
- **Neden:** Teknik fiyat hesaplama doğruluğu, gerçek piyasa fiyatı ve işletme politikasının doğruluğuyla aynı şey değil.
- **Düzeltme:** 3.1–3.4 alt görevleri açıldı; hiçbir fiyat veya ödeme vaadi tahminle değiştirilmedi. Önceki `.gitignore` güvenlik değişikliği `f801e5b` burada geriye dönük kaydedildi.
- **Test:** Bu adım yalnızca kaynak kodu incelemesidir; yeni test veya canlı fiyat doğrulaması çalıştırılmadı.
- **Sonuç:** 3.1 mevcut kod/test kanıtıyla tamam; 3.2 ticari doğrulama bekliyor, 3.3–3.4 işletme kararı bekliyor. 1.3/1.5 ve 2.1–2.4 son canlı E2E testleri kapanmış sayılmadı.

## İlk yayın odağı (2026-11-16)
- Kullanıcı isteğiyle MVP yayın önceliğine geçildi: `docs/ILK_YAYIN_KONTROL_LISTESI.md` GO/NO-GO kontrol listesi. 1.5 canlı rezervasyon smoke, doğrulanmış fiyat/iletişim/yasal metinler ve CI yayın blokajı; 5–12 ileri özellikler uygun oldukça ilk yayın sonrasına ertelenebilir. Otomatik e-posta olmadığı açıkça belirtilir.
- Hata sınıfının Node test runner uyumsuzluğu `84e01a95` ile giderildi; yanlış kesin fiyat ifadesi `28bfddbd` ile düzeltildi. CI sonucu bekleniyor.

## 2026-11-16 — İlk yayın: belirsiz başarılı HTTP yanıtı
- Son CI `43924136949` başarılı. Backend HTTP 2xx döndürse bile yanıt JSON'u bozuksa veya geçerli rezervasyon ID yoksa rezervasyon kaydedilmiş olabilir; frontend artık bunu `uncertain` olarak işaretliyor ve kullanıcıyı yeni kayıt açmadan önce destekle görüşmeye yönlendiriyor (`08f24e5e`, `b3c8cb66`).
- Otomatik regresyon testi eklendi (`3b2f59c0`). Gerçek ağ kesintisi / canlı DB E2E hâlâ açık. Telefon numarası kullanıcı talebiyle geçici olarak korunuyor; canlı yayından önce değiştirilecek. Admin'e dokunulmadı.

## 2026-11-16 — MVP: sunucu hata yanıtları ve bozuk taslak ayrımı
- Confirmation sayfasında yerel taslak JSON ayrıştırma hatası ayrı ele alındı; API hatası artık yanlışlıkla taslak bozuk diye gösterilmiyor (`2dfd93c9`).
- HTTP 5xx sunucu cevabında veritabanı işlemi tamamlanmış olabilir; `uncertain=true` ile aynı idempotency key korunuyor. HTTP 4xx kesin ret olarak kalıyor (`68ee62da`, `91943e6b`).
- Canlı E2E ve fiyat doğrulama açık. Geçici telefon numarası kullanıcı kararıyla korunuyor; admin kapsam dışı.

## 2026-11-16 — MVP: yanlış varsayılan bagaj/çocuk koltuğu
- Önceki CI `43924685605` başarılı. Yeni rezervasyon açıldığında form kullanıcı seçimi olmadan 1 çocuk koltuğu ve 3 bagaj atıyordu. Yeni form varsayılanları 0/0 yapıldı (`9a642c5b`, `4a991a68`); mevcut taslakta kullanıcının daha önce seçtiği sayılar korunur.
- Canlı tarayıcı smoke testi ve fiyatların işletme tarafından doğrulanması bekliyor. Geçici telefon numarası kullanıcı isteğiyle korundu; admin'e dokunulmadı.

## 2026-11-16 — MVP: tarih ve yolcu varsayılanları
- Önceki CI `43925874660` başarılı. Dönüş tarihinin minimumu UTC takvim tarihinden değil Türkiye yerel gününden hesaplanıyor (`e6d68f03`); özellikle Türkiye'de gece yarısına yakın yanlış tarih seçimini önler.
- Yeni rezervasyon varsayılan yolcu sayısı 4 yerine 1 (`58a21c26`); eski taslakta seçilmiş yolcu sayısı korunur. Yeni CI ve canlı tarayıcı testi bekleniyor.
- Kullanıcı isteğiyle geçici telefon numarası korundu; admin paneli kapsam dışı.

## 2026-11-16 — CI derleme hatası düzeltildi
- `4686d979` için CI `43929270545` başarısız: frontend TypeScript TS18048 (opsiyonel `passengerCount` karşılaştırması); backend PostgreSQL testleri başarılı. Nullish fallback ile düzeltildi (`e9512c07`); yeni CI sonucunu beklemeden başarılı denmeyecek.
- Gerçek tarayıcı rezervasyon E2E, fiyat onayı ve canlı yayın öncesi gerçek telefon numarası değişimi açık. Admin kapsam dışı.

## 2026-11-16 — MVP kapsamlı doğrulama ve fiyat kataloğu testleri
- Önceki CI `43929639328` başarılı. Rezervasyon onayında ortak `validateTransferSelection` doğrulayıcısı eklendi (`453df8fe`, `52bf2979`): Dalaman Havalimanı güzergâhı, yayınlanmış araç/fiyat, yolcu, bagaj ve çocuk koltuğu sınırları yeniden denetleniyor.
- Fiyat kataloğunda yinelenen güzergâh/araç kombinasyonları, bilinmeyen araçlar, sıfır/negatif fiyatlar ve gidiş/dönüş fiyat bulma eşleşmeleri için otomatik testler; ters yön, geçersiz güzergâh ve kapasite senaryoları eklendi (`afec831e`). Node testlerinde TS uzantısı düzeltildi (`37748b11`).
- **Not:** Otomatik test kataloğun iç tutarlılığını ölçer, gerçek ticari fiyatları doğrulamaz. CI ve canlı E2E sonuçları ayrıca izlenecek. Admin kapsam dışı, geçici telefon numarası korunuyor.

## 2026-11-16 — MVP: yolcu adımında erken kontrol ve son onay güvenliği
- CI `43930076465` başarılı; ortak seçim ve fiyat kataloğu testleri geçiyor.
- Yolcu bilgileri ekranında eski/bozuk transfer taslağı, geçersiz güzergâh, araç kapasitesi, geçmiş Türkiye saati ve hatalı dönüş tarihi artık son adıma geçmeden reddediliyor (`271722e4`).
- Yolcu adı, konaklama adresi, otel adı ve özel istek alanlarına kaydetme öncesi uzunluk kontrolü eklendi (`2553a2d0`); son onayda kayıtlı metin uzunlukları yeniden denetleniyor (`269387df`).
- Tarayıcı depolaması engellendiğinde yolcu ekranı anlaşılır hata gösteriyor (`f61b1582`). Yeni CI ve gerçek canlı E2E henüz doğrulanmadı.
- Admin kapsam dışı; geçici telefon numarası kullanıcı isteğiyle korunuyor.

## 2026-11-16 — MVP: araç görselleri ve ortak doğrulama
- Önceki tüm son CI kontrolleri başarılı (`43931186409`). Araç seçim kartlarında yanlış araç modelini temsil edebilen üçüncü taraf fotoğraflar kaldırıldı; araç kategorisine uygun nötr ikonlar kullanılıyor (`d07d529e`). Gerçek filo fotoğrafları doğrulanınca eklenebilir.
- İlk transfer adımı da yolcu ve son onay ekranlarının kullandığı `validateTransferSelection` fonksiyonuna bağlandı (`4aacb9a7`); kapasite ve güzergâh kuralları tek yerden yönetiliyor.
- Yeni CI ve gerçek tarayıcı uçtan uca rezervasyon doğrulaması açık; admin kapsam dışı, geçici telefon numarası korunuyor.

## 2026-11-16 — Görev 1.3/1.5 ve 2: ortak Türkiye saati doğrulaması
- Önceki booking validation regresyon testleri ve PostgreSQL CI **başarılı** (run `43933399460`).
- `validateTransferSchedule.ts` ortak tarih kontrolü eklendi (`7ef5f077`); transfer, yolcu ve son onay ekranları aynı kurala bağlandı (`043dd258`, `cc1c5871`, `3d6b0c81`).
- Geçersiz takvim tarihi, geçmiş transfer, eşit/erken dönüş ve geçerli dönüş için otomatik testler eklendi (`3837f6e5`). Yeni CI sonuçları bekleniyor; gerçek canlı tarayıcı/DB uçtan uca test hâlâ açık.
- Admin kapsam dışı; geçici iletişim numarası kullanıcı isteğiyle korundu.

## Sıra
1. Backend derlemesi, PostgreSQL bağlantısı, rezervasyon güvenilirliği
2. Uçuş numarası, otel, bagaj ve çocuk koltuğu alanları
3. Gerçek fiyat, ödeme ve iptal kuralları
4. Gerçek iletişim ve işletme bilgileri
5. Rezervasyon e-postası ve durum bildirimleri — **BEKLİYOR:** Rezervasyon kaydedilince müşterinin verdiği e-posta adresine referans, güzergâh, tarih/saat ve *onay bekliyor* durumu içeren otomatik alındı e-postası gönder; aynı anda işletme adresi `ali_sonmez35@hotmail.com` adresine yeni rezervasyon bildirimi gönder. Güvenilir e-posta sağlayıcısı/SMTP yapılandırması, gönderim hatası ve tekrar deneme, çift mail önleme, gizli anahtar yönetimi ve teslimat testleri yapılmadan tamamlandı sayma.
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


## 2026-11-16 — Çift gönderim ve belirsiz bağlantı sonucu
- CI: ef999dc5 run 43862248176, 74751397 run 43862212511 ve 263ac895 run 43862162411 completed/success; yolcu formu doğrulama/mobil değişiklikleri geçti.
- BookingConfirmationPage: React state güncellemesi beklenmeden useRef ile senkron gönderim kilidi, hızlı çift tıklamada ikinci POST'un başlamasını engeller (b6799bfa). Backend Idempotency-Key kontrolü korunur.
- Bağlantı kesintisi/zaman aşımı: Sonucun belirsiz olabileceğini açıklayan durum mesajı, aynı sayfadan tekrar deneme yönlendirmesi; mevcut idempotency anahtarı saklanır (4f2056aa). Sunucuya ulaşıp ulaşmadığı kanıtlanmadıkça rezervasyon başarısı iddia edilmez.
- Bozuk localStorage JSON için kullanıcıya anlaşılır hata mesajı (8de11e34). Son üç commit CI sonucu bekleniyor; gerçek browser E2E ve live DB doğrulaması açık. Admin koduna dokunulmadı.


## 2026-11-16 — Rezervasyon sonucunun sayfa yenilemede korunması
- Önceki CI doğrulaması: c59a48a9 run 43862457679, 8de11e34 run 43862423872, 4f2056aa run 43862393643 ve b6799bfa run 43862371697 completed/success.
- BookingConfirmationPage: başarılı POST cevabından sonra yalnızca referans, müşteri adı, pickup/destination ve saatten oluşan kısa makbuz sessionStorage'a kaydediliyor; aynı sekmede yenilemede tekrar gösteriliyor, yeniden POST gönderilmiyor (18026d49). SessionStorage devre dışıysa makbuz yalnızca mevcut render'da gösterilir.
- BookingFormPage: yeni geçerli transfer bilgileri kaydedilirken eski makbuz siliniyor, önceki rezervasyonun sonucu yeni rezervasyonla karışmıyor (67a80d73).
- Confirmation receipt: yenileme sonrası transfer formu localStorage'dan silindiği için fiyat, bagaj ve çocuk koltuğu gibi kaydedilmemiş alanlar makbuzda artık gösterilmiyor; doğrulanmış kısa özet korunuyor (36f1ba0b).
- Bu üç commit için CI sonucu bekleniyor. Tarayıcı E2E ve canlı DB kontrolü ayrı açık işler. Admin koduna dokunulmadı.


## 2026-11-16 — Yolcu formuna geri dönüş ve tarayıcı depolama
- Önceki CI: 87cba80b run 43862599743, 36f1ba0b run 43862570262, 67a80d73 run 43862547221, 18026d49 run 43862530968 completed/success.
- BookingPassengerPage: confirmation adımından geri dönüldüğünde daha önce kaydedilmiş ad/soyad, ülke kodu/telefon, e-posta, ikamet ülkesi, transfer adresi, otel ve özel istekler yeniden dolduruluyor (dfea5315). Telefon kodu bilinen seçenekler üzerinden ayrıştırılıyor.
- BookingPassengerPage: render sırasında korumasız localStorage JSON.parse kaldırıldı; bozuk veride sayfa açılışında çökme önlendi (dfea5315).
- BookingPassengerPage: localStorage yazma hatası kullanıcıya açıklanıyor, kayıt başarısızsa confirmation sayfasına yönlendirme yapılmıyor (ac198006).
- Son iki commit CI sonucu henüz kontrol edilmeli. Browser E2E, backend e-posta bildirimleri ve güvenli sorgulama hâlâ açık. Admin koduna dokunulmadı.


## 2026-11-16 — Transfer formuna geri dönüş ve depolama hatası
- Önceki CI: d337ae0d run 43862918778, ac198006 run 43862898401, dfea5315 run 43862869383 completed/success.
- BookingFormPage: kayıtlı transfer bilgileri (tripType, vehicleId, pickup/dropoff, tarih/saat, flightNumber, return, passenger/luggage/baby seats) geri dönüldüğünde veya yenilemede geri yükleniyor; bozuk JSON için güvenli varsayılanlar var (c93e1c48).
- BookingFormPage: localStorage.setItem başarısızsa Link navigasyonu iptal edilip kullanıcıya hata gösteriliyor. Eski receipt ancak yeni transfer verileri başarıyla kaydedildikten sonra temizleniyor (2f26452c).
- Yeni commit CI sonuçları bekleniyor. Gerçek browser E2E, canlı API kontrolü ve e-posta bildirimleri hâlâ açık. Admin koduna dokunulmadı.


## 2026-11-16 — Confirm Booking sonrası yenilemede 3. adıma dönüş
- Kullanıcı bildirimi: Confirm Booking başarı ekranından sonra sayfa yenilemede 3. adım yeniden görünüyor.
- BookingConfirmationPage: başarı makbuzu sessionStorage ve localStorage'a kaydediliyor, okuma sırasında iki depo sırayla deneniyor. Makbuz 24 saat sonra geçersiz; başarı ekranı korunurken yeniden POST gönderilmiyor (7a2c117e).
- BookingFormPage: yeni geçerli rezervasyon başlatılırken her iki makbuz deposu bağımsız temizleniyor (258605ec, 16fefd3c).
- Dikkat: Bu değişiklik yalnızca yeni sürümle başarıyla tamamlanan rezervasyonları korur; eski sürümde hiç kaydedilmeyen sonuç geri getirilemez. Canlı Render deployment ve gerçek tarayıcı yenileme senaryosu henüz doğrulanmadı. Admin koduna dokunulmadı.


## 2026-11-16 — Rezervasyon yenileme ve araç kapasitesi savunması
- Önceki CI: ab825871 run 43863771536, 16fefd3c run 43863727907, 258605ec run 43863706584, 7a2c117e run 43863682110 completed/success.
- BookingConfirmationPage: sessionStorage/localStorage property erişimi dahi SecurityError verebildiği için storage erişimi try içine alındı; blocked storage durumunda sayfa render'ı korunur (440c3d2e).
- BookingFormPage: yeni rezervasyon sırasında receipt temizleme storage erişimi bağımsız try bloklarında (5c28dd48).
- BookingFormPage: geri yüklenmiş veya bozuk yolcu/bagaj/çocuk koltuğu sayıları tam sayı ve araç kapasitesine uygun olmalı; validasyonla UI sınırları aynı maxAllowedPassengers/maxAllowedLuggage değerlerini kullanır (0958d19c).
- Bu üç commit CI sonucu bekleniyor. Gerçek browser E2E, migration güvenliği ve canlı rezervasyon kontrolü açık. Admin paneli değiştirilmedi.


## 2026-11-16 — Kaydedilmiş rezervasyon taslaklarının tip güvenliği
- Önceki CI: 979de62f run 43864141989, 0958d19c run 43864103791, 5c28dd48 run 43864068794, 440c3d2e run 43864050359 completed/success.
- BookingFormPage: localStorage taslağında yalnızca beklenen string alanlar ve tam sayı sayımlar geri yükleniyor; bozuk/array/null veri varsayılana dönüyor (a63a2587).
- BookingPassengerPage: kayıtlı yolcu taslağının alan tipleri doğrulanıyor; beklenmeyen türler formu bozamıyor (7c4747a7).
- BookingConfirmationPage: kaydedilen JSON'un nesne olduğu kontrol ediliyor, geçersiz taslakla POST yapılmıyor; makbuz validasyondan geçen değerlerden üretiliyor (ced7bf06, 16fd0c37).
- Yeni CI henüz tamamlanmadı; gerçek tarayıcı E2E, canlı veri doğrulaması ve migration güvenliği açık. Admin paneline dokunulmadı.


## 2026-11-16 — Confirmation başarı sonrası cleanup ve POST alan tipleri
- Önceki CI: 60d78767 run 43906375587 ve 16fd0c37 run 43906307457 completed/success. Ara commit ced7bf06 run 43906267421 failure; sonraki commit düzeltmesi başarılı.
- BookingConfirmationPage: localStorage.getItem işlemleri try içine alındı; başarılı POST sonrası localStorage.removeItem hata verirse başarılı rezervasyon yanlışlıkla hata olarak gösterilmiyor (a0aaa3f3).
- BookingConfirmationPage: API çağrısından önce zorunlu alanların string/tam sayı ve tripType tipleri doğrulanıyor (982354af).
- Yeni CI sonucu bekleniyor. Gerçek tarayıcı E2E ve canlı Render smoke test açık. Admin koduna dokunulmadı.


## 2026-11-16 — Final confirmation validasyonları
- Önceki CI: 08e659b5 run 43906868643, 982354af run 43906821792 ve a0aaa3f3 run 43906791499 completed/success.
- BookingConfirmationPage: isteğe bağlı flightNumber, luggageCount, babySeatCount, hotelName, countryOfResidence, specialRequests alanlarının tip/sınırları API POST öncesi doğrulanıyor (4d099cf5).
- BookingConfirmationPage: ilk form doldurulduktan sonra zaman geçmiş olabileceği için pickup tarihinin hâlâ gelecekte olduğu ve dönüşün gidişten sonra olduğu final confirmation sırasında yeniden doğrulanıyor (74274c55).
- Yeni CI testleri bekleniyor. Gerçek tarayıcı E2E, Render canlı smoke, migration güvenliği, bildirimler açık. Admin koduna dokunulmadı.


## 2026-11-16 — Booking form ticari vaat ve iletişim temizliği
- BookingFormPage rezervasyon özeti: doğrulanmamış ücretsiz meet-and-greet, vergi/bahşiş dahil, gizli ücret yok ve 24 saat ücretsiz iptal vaatleri kaldırıldı; fiyat ve koşulların işletme onayına tabi olduğu açıklandı (8d2703d2).
- Aynı sayfanın footer'ında sahte acil telefon, doğrulanmamış e-posta, href=# boş politika bağlantıları, 2024 tarihi ve GBP fiyatlarıyla çelişen EUR etiketi kaldırıldı.
- Bu, gerçek ödeme/iptal/iletişim kurallarının tanımlanması görevlerini tamamlamaz. Yeni CI ve canlı UI testi bekleniyor. Admin kapsam dışı.


## 2026-11-16 — Geçici iletişim bilgileri
- Kullanıcı talebiyle BookingFormPage footer'ına geçici iletişim bilgileri eklendi: 05555555555 (tel:+905555555555) ve ali_sonmez35@hotmail.com (mailto:). Commit 1f8ec017.
- Bu bilgiler kullanıcının talebiyle geçicidir; ileride güncellenecek. Diğer sayfalarda iletişim bilgileri tutarlılığı ayrıca kontrol edilmeli. Admin kapsam dışı.


## 2026-11-16 — Geçici iletişim bilgileri site genelinde
- Contact Us sayfasına 05555555555 ve ali_sonmez35@hotmail.com tıklanabilir bağlantıları eklendi (ffe19e0c).
- Ana sayfa footer'ına aynı geçici iletişim bağlantıları eklendi (433f00bc).
- Booking form footer'ında önceki commit 1f8ec017 ile zaten mevcut. Kullanıcı istediğinde gerçek işletme iletişim bilgileriyle değiştirilecek. Admin kapsam dışı; CI ve canlı görünüm doğrulaması bekleniyor.


## 2026-11-16 — Rezervasyon sonrası müşteri desteği
- BookingLookupPage: güvenli sorgulama henüz aktif olmadığı açıkça belirtilerek geçici telefon ve e-posta üzerinden destek bağlantıları eklendi (e8447993).
- BookingConfirmationPage: başarılı rezervasyon ekranında referans kopyalama ve konu satırında referans içeren e-posta bağlantısı eklendi (83457aa4).
- Bu özellikler otomatik e-posta gönderimi veya güvenli lookup değildir; ilgili 5 ve 6 numaralı işler açık. CI ve canlı tarayıcı doğrulaması bekleniyor. Admin kapsam dışı.


## 2026-11-16 — Booking lookup metni ve confirmation veri doğrulaması
- BookingLookupPage: önceki commit'te JSX metninde yanlışlıkla düz yazı olarak görünen `\\n` karakterleri gerçek satır sonlarıyla değiştirildi (2a948588).
- BookingConfirmationPage: final POST öncesinde yolcu sayısı 1–16 ve e-posta biçimi kontrolü eklendi (2ca6d8e2); bagaj sınırı araç bazlı kontrol ile çakışmaması için genel yolcu+2 kontrolü kaldırıldı (99924633).
- Yeni CI ve gerçek tarayıcı E2E bekleniyor. Admin kapsam dışı.


## 2026-11-16 — Kritik confirmation e-posta regex düzeltmesi
- BookingConfirmationPage final e-posta regex'inde `\\\\s` ve `\\\\.` çift escape nedeniyle geçerli adresler reddedilebiliyordu; JavaScript regex literal içinde doğru `\\s` ve `\\.` kullanıldı (a7e12833).
- Önceki altı CI run'ı success olsa da CI yalnızca lint/build çalıştırdığı için davranışsal regresyonu yakalamadı. E2E / birim testleri kritik açık olarak sürüyor. Yeni CI bekleniyor. Admin kapsam dışı.


## 2026-11-16 — Final rezervasyon tarih kontrolü
- Confirmation POST öncesi pickup ve round-trip return tarih/saat biçimleri `YYYY-MM-DD`, `HH:mm` olarak doğrulanıyor (e5faed37).
- JavaScript Date nesnesinin 31 Şubat gibi tarihleri normalize ederek kabul etmesi engellendi; seçilen takvim günüyle parse edilen gün karşılaştırılıyor (2c6ee709).
- Tarih/saatin Türkiye saat dilimi yerine tarayıcı yerel saat diliminde yorumlanması ayrı açık risk; E2E ve timezone testleri hâlâ gerekli. Admin kapsam dışı.


## 2026-11-16 — Confirmation tarih regex ve Türkiye saat dilimi
- Son onay tarih/saat regex'lerindeki yanlış çift escape düzeltildi; önceki CI lint/build bu davranış hatasını yakalayamamıştı (`ce14a1b8`).
- Final rezervasyon POST öncesi pickup ve return saatleri artık tarayıcının yerel saat dilimi yerine Türkiye yerel saati (UTC+03:00) olarak doğrulanıyor; takvim günü ve gidiş-dönüş sıralaması korunuyor (`63329b28`).
- Frontend ilk adımın `today` ve tarih kontrolleri ayrıca Türkiye saatine göre hizalanmalı; gerçek tarayıcı E2E ve farklı saat dilimi testleri açık. Admin kapsam dışı.


## 2026-11-16 — Booking form Türkiye saat dilimi uyumu
- BookingFormPage tarih seçicisinin minimum günü artık ziyaretçinin bilgisayarındaki gün değil `Europe/Istanbul` yerel günü (`f23c5485`).
- İlk adımda pickup ve return zamanları Türkiye UTC+03:00 üzerinden doğrulanıyor, geçersiz takvim tarihleri reddediliyor (`77f0d6e7`). Confirmation ile aynı zaman yorumu hedefleniyor.
- Otomatik birim/E2E testleri, tarayıcı saat dilimi varyasyonları ve canlı UI kontrolü hâlâ açık. Admin kapsam dışı.


## 2026-11-16 — Ortak Türkiye saat modülü
- `frontend/src/features/booking/turkeyTime.ts` oluşturuldu: `parseTurkeyDateTime` ve `turkeyToday` ortak fonksiyonları (`b5de4eda`). `turkeyToday`, tarayıcı locale formatına güvenmeden `formatToParts` ile ISO günü oluşturuyor.
- BookingFormPage aynı modülü kullanıyor (`4b031074`), BookingConfirmationPage aynı parser'ı kullanıyor (`8d069896`). Böylece tarih doğrulama kodu tek yerde tutuluyor.
- Otomatik tarih/saat birim testleri ve farklı timezone E2E testleri henüz yazılmadı; ilgili 1.5 ve 12. madde açık. Admin kapsam dışı.


## 2026-11-16 — Ortak fonksiyon ve otomatik test standardı
- Çok yerde kullanılan iş kuralları sayfalarda kopyalanmayacak; `features/booking` gibi ilgili özellik modüllerinde tek kaynak olarak tutulacak. Tüm kodu tek global dosyaya toplamak yerine alan bazlı modüller kullanılacak.
- `frontend/tests/turkeyTime.test.mjs` ile UTC+03:00 dönüşümü, hatalı takvim günleri/saatler, artık yıl ve Türkiye gece yarısı senaryoları eklendi (`4ee4f7bd`).
- Node 22 yerleşik test çalıştırıcısı `npm test` ile çağrılıyor (`ab29a1c9`), CI frontend job'u lint ile build arasında testleri çalıştırıyor (`fb5d151b`).
- Bu testler saf fonksiyon davranışını doğrular; gerçek tarayıcı rezervasyon POST, çift tıklama ve receipt kalıcılığı E2E testleri hâlâ açık.


## 2026-11-16 — Rezervasyon referansı kalıcılığı için test
- `features/booking/receipt.ts` ortak modülü eklendi: makbuzun biçimi/24 saatlik geçerliliği, storage fallback ve başarısız storage yazımının rezervasyon başarısını etkilememesi (`7e75eeea`).
- Confirmation sayfası bu ortak fonksiyonları kullanıyor (`443177df`).
- `frontend/tests/receipt.test.mjs` ile yeniden yükleme simülasyonu, localStorage fallback, geçersiz/eski/gelecek zamanlı veri ve engellenmiş storage durumları test kapsamına alındı (`2c7e477b`).
- Bu testler browser otomasyonu değildir; gerçek çift POST, ağ kopması ve tarayıcı E2E testi hâlâ açık. Admin kapsam dışı.


## 2026-11-16 — Aynı anda iki rezervasyon POST'unu önleme
- Frontend API `createBooking`, aynı JSON payload için eşzamanlı çağrıları `inFlightBookings` Promise haritasında birleştiriyor (`b432843f`). İki çağrı aynı backend POST'unun sonucunu bekliyor; başarısız istekte map temizleniyor ve sessionStorage'daki idempotency key tekrar denemeye kalıyor.
- Backend `Idempotency-Key` ve PostgreSQL benzersizlik koruması ayrı güvenlik katmanı olarak korunuyor.
- Gerçek browser çift tıklama testi, ağ kopması ve backend eşzamanlı DB testi CI ile birlikte yeniden doğrulanmalı. Admin kapsam dışı.


## 2026-11-16 — Çift gönderim koruması için otomatik test
- `features/booking/singleFlight.ts` ortak modülü eşzamanlı aynı anahtarlı Promise'leri birleştiriyor; başarı veya hatadan sonra kilidi kaldırıyor (`4ecf9688`).
- `api/index.ts` `createBooking` bu modülü kullanıyor; backend idempotency anahtarı ve başarısız ağ isteğinden sonra retry davranışı korunuyor (`566f62be`).
- `tests/singleFlight.test.mjs`: aynı rezervasyonun tek çağrı olması, farklı rezervasyonların bağımsızlığı ve başarısız istekten sonra tekrar deneme (`4544cf73`). CI sonucu ayrıca doğrulanmalı; browser E2E ve gerçek ağ kopması senaryoları açık.


## 2026-11-16 — Retry anahtarı ortak modülü ve testler
- `features/booking/retryKeys.ts` aynı payload için idempotency anahtarını bellekte/sessionStorage'da koruyan, başarıda temizleyen ve engellenmiş storage'da çalışan ortak modül (`a6be9a1a`).
- Booking API tekrar deneme anahtarı için ortak modülü kullanıyor (`9b85d9e7`).
- `tests/retryKeys.test.mjs` ile anahtarın yeniden kullanımı, sayfa yenileme simülasyonu ve storage erişimi engeli test edildi (`caf47f75`).
- Gerçek browser E2E, timeout sonrası backend kaydını doğrulama ve güvenli yeniden deneme UI testleri açık; admin kapsam dışı.


## 2026-11-16 — Belirsiz gönderim ve makbuz kopyalama mesajları
- Son onay ekranında bağlantı hatası sonrası kullanıcıya aynı düğmeyle retry yapılabileceği ve aynı idempotency anahtarının yeniden kullanılacağı daha açık anlatılıyor (`1a9d28ec`).
- Başarılı rezervasyon ekranındaki kopyalama hatası `role=alert` ile görünür kılındı; önceki durumda hata state'e yazılıyor ancak success UI'da gösterilmiyordu.
- E2E browser, ağ kesintisi ve gerçek rezervasyon senaryoları hâlâ açık. Admin kapsam dışı.


## 2026-11-16 — API hata sınıflandırması
- `features/booking/api/errors.ts`: HTTP durum kodu, ağ/timeout belirsizliği ve normal hata durumlarını `BookingApiError` ile ayıran ortak fonksiyonlar (`7339e9b0`).
- API istekleri ortak sınıflandırmayı kullanıyor (`b34ee91c`); confirmation ekranı kırılgan hata metni regex'i yerine `uncertain` alanına bakıyor (`664bb121`).
- `tests/bookingErrors.test.mjs`: 409/503 HTTP, ağ TypeError, timeout AbortError ve normal SyntaxError senaryoları (`258f95e5`). Gerçek browser/ağ kopması E2E testleri hâlâ açık. Admin kapsam dışı.
