# EKSİKLERİMİZ — Uygulama ve öğrenme günlüğü

Bu dosya projenin tek ilerleme kaydıdır. Her görevde: problem → kanıt → neden → düzeltme → test → ortaya çıkan yeni sorun → sonuç yazılır. Doğrulanmadan "tamamlandı" denmez.

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
