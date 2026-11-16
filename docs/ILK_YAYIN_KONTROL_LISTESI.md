# İlk yayın — MVP kontrol listesi

Amaç: müşteri rezervasyon talebi gönderebilsin, işletme talebi takip edebilsin, kullanıcıya doğrulanmamış vaat sunulmasın.

**Güncel kapsam kararı (2026-11-16):** Kullanıcı hızlı bir **operasyona hazır v1.0** istiyor: gerçek rezervasyon alınabilsin ve işletme rezervasyonları güvenli biçimde takip edip müşteriye dönüş yapabilsin. Önceki genişletilmiş ilk yayın kapsamı artık zorunlu yayın kapsamı değildir; geliştirmeler `docs/CANLI_YAYIN_SONRASI_GELISTIRMELER.md` dosyasında izlenir. Ancak güvenlik, doğru fiyat/iletişim, yasal gereklilikler ve çalışır operasyon ertelenemez. Online ödeme v1.0'da yok; yalnızca nakit kabul edilecek, kartla ödeme olmayacak. Tahsilat zamanı henüz netleşmedi.

**Yayın kararı:** İlk yayın için rezervasyon talebi + referans, yetkili işletme erişimi (mevcut güvenli API veya uygulanmış panel), rezervasyonların günlük takip edilmesi, gerçek iletişim kanalı, doğru fiyat/koşullar, temel mobil akış ve üretim güvenliği yeterli. Otomatik e-posta ve gelişmiş panel gibi ek özellikler yoksa sitede varmış gibi sunulmaz. Yayın kararı ancak aşağıdaki kontroller doğrulanınca GO olabilir.

## Yayın öncesi son rötuşlar — logo, metinler ve işletme detayları

**Zamanlama:** Teknik rezervasyon ve güvenli işletme takibi çalıştıktan sonra, **canlıya almadan hemen önce** birlikte yapılacak son içerik/marka kontrolü. Kullanıcı bu bilgileri o aşamada verecek; şimdi tekrar sorulmayacak.

- [ ] Logo, favicon ve marka görsellerini son haliyle ekle.
- [ ] Ana sayfa, rezervasyon, onay, iletişim ve SSS metinlerini son kez gözden geçir; doğrulanmamış vaatleri çıkar.
- [ ] Geçici `05555555555` numarasını kullanıcının vereceği gerçek numarayla değiştir; e-posta ve iletişim bağlantılarını doğrula.
- [ ] **Ödeme metni:** İlk sürüm yalnızca nakit, online/kart ödeme yok. **Nakit tahsilatın tam zamanı** kullanıcıdan yalnızca bu son rötuş aşamasında alınacak; o zamana kadar ödeme zamanı varsayılmayacak.
- [ ] İşletmenin onayladığı iptal/değişiklik şartlarını ve gerekli yasal metinleri doğru yerlere yerleştir.
- [ ] Son mobil/masaüstü görünüm, yazım, bağlantılar ve gerçek rezervasyon akışı kontrolünü tamamla.

**Yayın engeli:** Yukarıdaki maddeler onaylanmadan ve doğrulanmadan canlıya çıkış GO olarak işaretlenmez.

## Yayın öncesi zorunlu (GO / NO-GO)

- [ ] Güncel GitHub Actions frontend lint + unit tests + build ve backend PostgreSQL testleri **yeşil**.
- [ ] Render frontend/backend deploy **live**, API URL ve CORS doğru; canlı site açılıyor.
- [ ] **Gerçek uçtan uca rezervasyon:** Dalaman → desteklenen destinasyon, tarih/saat Türkiye yerel saati, yolcu, bagaj, bebek koltuğu, uçuş ve otel alanları; POST sonucu referans numarası; backend/DB kaydı kontrolü.
- [ ] **Yenileme:** Başarı ekranını yenileyince referans korunuyor; yeni rezervasyon başlatılınca eski referans temizleniyor.
- [ ] **Çift gönderim:** Aynı talep iki kez tıklandığında yalnızca tek kayıt oluşuyor; backend idempotency kontrolü doğrulanıyor.
- [ ] **Hata akışı:** API erişilemezse veya geçersiz rezervasyon ID döndürürse kullanıcıya yanlışlıkla 'başarılı' denmiyor; belirsiz gönderimde destek iletişimi gösteriliyor. Kod koruması `f319d0e8`; canlı smoke bekliyor.
- [ ] **Gerçek fiyat ve kapasite:** Fiyat kataloğu işletme tarafından doğrulanmış; geçersiz araç/rota ve aşırı kapasite reddediliyor.
- [ ] **İletişim bilgileri:** Kullanıcı kararıyla `05555555555` geçici telefon numarası geliştirme/test ortamında korunuyor (`fce3c968`, `d3a2c0a6`, `4cd9a47a`). **Gerçek canlı yayından hemen önce mutlaka değiştirilecek.** İleride admin panelinden iletişim numarasını düzenleme alanı eklenecek; admin şu an kapsam dışı. `ali_sonmez35@hotmail.com` adresinin aktif takip edildiği doğrulanmalı.
- [ ] **Nakit tahsilat bilgisi:** Kullanıcı yalnızca nakit kabulünü onayladı; tahsilat zamanını yukarıdaki **son rötuşlar** aşamasında teyit et ve rezervasyon ekranındaki açıklamayı test et. Kart/online ödeme seçeneği gösterme.
- [ ] **İşletme bilgileri ve yasal metinler:** İptal, ödeme, KVKK/gizlilik ve işletme kimliği doğrulanmış; bilinmeyen şartlar vaat edilmiyor.
- [ ] **Mobil smoke:** Ana sayfa → rezervasyon 1/2/3 → başarı, iPhone/Android dar ekran ve masaüstü; kritik linkler çalışıyor.
- [ ] **Gizli anahtarlar:** Render env secrets GitHub'a yazılmamış; DB erişimi kısıtlı; gerçek kullanıcı verileri testlerde kullanılmıyor.
- [ ] **Operasyon:** Rezervasyonları kimin/ne sıklıkla takip edeceği belirlenmiş; otomatik e-posta henüz yoksa aşağıdaki manuel takip prosedürü gerçek kayıtla denenmiş.

## v1.0 — Minimum rezervasyon operasyon prosedürü

**Amaç:** İlk müşteri talebi kaybolmadan işletme tarafından ele alınsın. Otomatik e-posta ve gelişmiş admin paneli şart değil, ancak güvenli ve gerçekten çalışan bir takip kanalı şart.

1. **Talep alma:** Müşteri rezervasyon formunu gönderir, sistem rezervasyon referansı ve **PENDING / onay bekliyor** durumu gösterir. Talep alındı ifadesi kesin transfer onayı değildir.
2. **Güvenli takip:** İşletme, yalnızca yetkili erişimle yeni rezervasyonları listeler veya sorgular. Mevcut backend `GET /bookings` uç noktası var; bunun işletmeci tarafından gerçekten kullanılabildiği henüz doğrulanmadı. Veritabanını herkese açık yapma, yönetici şifresini tarayıcıya gömme.
3. **Kontrol sıklığı:** Sorumlu kişi ve kontrol aralığı ilk yayından önce belirlenecek. Bildirim otomasyonu yoksa düzenli manuel kontrol zorunlu.
4. **Müşteriye dönüş:** İşletme, formdaki iletişim bilgileriyle müşteriye ulaşıp güzergâh, tarih, uçuş, araç, fiyat ve ödeme koşullarını teyit eder. İletişim yöntemi ve yanıt süresi doğrulanmadan garanti verilmez.
5. **Durum ve kayıt:** Talebin işleme alındığı ve müşteriye dönüş yapıldığı işletme tarafında takip edilir; yanlışlıkla tekrar transfer atanmaz. Mevcut sistemde güvenli durum güncelleme arayüzü varsa doğrulanır, yoksa ilk yayın için kontrollü manuel kayıt yöntemi belirlenir.
6. **Yayın provası:** Yetkili işletmeci gerçek bir test rezervasyonunu bulur, bilgilerini okur ve müşteriyle iletişim akışını prova eder. Bu adım doğrulanmadan operasyon hazır sayılmaz.

**Şu anki engel:** Rezervasyon oluşturma kullanıcı tarafından başarılı olarak bildirildi; ancak işletmenin rezervasyonu güvenli şekilde görüp takip edebildiğine ilişkin bağımsız doğrulama yok. Önce bu kanal test edilecek.

## Yayın sonrası geliştirmeler (v1.0 için zorunlu değil; ayrı yol haritasında izlenir)

- [ ] Gelişmiş admin paneli: rezervasyon listeleme/detay/durum ve iletişim ayarları. **Not:** v1.0 için güvenli temel rezervasyon erişimi ve takibi zorunludur; yalnızca gelişmiş arayüz ertelenebilir.
- [ ] E-posta doğrulama yaklaşımı ve otomatik müşteri alındı + işletme bildirimleri; hata/tekrar gönderim/çift e-posta koruması.
- [ ] WhatsApp iletişim bağlantısı; gerçek numara ve doğru mesaj akışı.
- [ ] Özgün logo, favicon ve tutarlı marka uygulaması.
- [ ] Müşteri rezervasyon sorgulama: yalnızca referans numarasıyla kişisel veri gösterme; e-posta sahipliği doğrulaması veya tek kullanımlık erişim bağlantısı.
- [ ] SEO: indeksleme, metadata, canonical, sitemap, robots, rota sayfaları, schema ve performans.
- [ ] FAQ: gerçek işletme kurallarıyla uyumlu yanıtlar.
- [ ] Yalnızca gerçek/doğrulanabilir müşteri yorumları; uydurma yorumlar gerçek müşteri yorumu gibi yayımlanmaz.
- [ ] Gerçek filo/araç kategorisiyle eşleşen, kullanım izni bulunan araç fotoğrafları.
- [ ] Rakip Petunia Travel fiyatlarıyla hedef karşılaştırması: tek yön -£2,50 ve gidiş-dönüş -£5 yalnızca işletme maliyeti ve güncel kaynak fiyatı doğrulanırsa uygulanır.

## Kapsam notu — önceki kararların yerine geçer

- Otomatik müşteri/işletme e-postaları (backlog 5) yayın sonrasına alınabilir; **çalışmadan sitede varmış gibi gösterilmez**.
- Güvenli self-servis rezervasyon sorgulama (6) yayın sonrasına alınabilir; rezervasyon değişiklik talepleri daha sonraya bırakılabilir.
- Uçuş gecikmesi/karşılama otomasyonu (7), çoklu dil (10) ve analitik (12) sonraya bırakılabilir; temel indeksleme ve doğru içerik kontrolü korunur; gelişmiş SEO ve gerçek yorum modülleri yayın sonrasına alınabilir.
- Kapsamlı tarayıcı E2E otomasyonu; ancak yukarıdaki manuel gerçek rezervasyon testi atlanamaz.

**Durum:** Bu belge bir kontrol listesidir, testlerin yapıldığına dair kanıt değildir. İşaretlenmemiş maddeler doğrulanmamıştır.

## 2026-11-16 — Operasyonel yayın denetimi
- **Sorun:** Başarılı rezervasyon POST'u, işletmenin yeni talebi görüp işleyebildiğini tek başına kanıtlamıyor.
- **Kanıt:** `BookingController` içinde `GET /bookings` mevcut. Ancak işletme arayüzünün ve günlük takip iş akışının çalıştığı bu incelemede doğrulanmadı.
- **Çözüm:** Minimum 6 adımlı manuel operasyon prosedürü ve gerçek kayıtla yayın provası kontrol listesine eklendi.
- **Test:** GitHub kaynak kodu incelendi; canlı yönetici oturumu/rezervasyon listeleme testi yapılmadı. **GO** işaretlenmedi.
- **Sonraki işlem:** İşletmeci erişimini ve rezervasyonların güvenli görüntülenmesini doğrula; sonra iletişim ve fiyat/yasal bilgiler için yayın kapılarını kapat.

## 2026-11-16 — Hızlı yayın kapsamı kararı
- **Problem:** Genişletilmiş kapsam, rezervasyon alabilen ilk sürümün yayınını geciktiriyordu.
- **Karar:** Operasyonel rezervasyon alma ve takip için zorunlu kontroller korunacak; online ödeme, otomatik bildirimler, gelişmiş panel/SEO/analitik ve diğer geliştirmeler sürüm yol haritasına alınacak.
- **Sınır:** Canlı müşteri verisi, doğrulanmamış fiyat, geçici telefon, eksik işletme/yasal bilgiler ve güvenlik sorunları ertelenemez.
- **Test:** Bu değişiklik yalnızca dokümantasyon/kapsam güncellemesidir; canlı yayın testi değildir.

## 2026-11-16 durum kontrolü
- GitHub Actions `43923429251` **success** (önceki değişiklikler).
- `f319d0e8`: API'den geçerli pozitif tam sayı rezervasyon ID gelmeden başarı makbuzu oluşturulması engellendi; yeni commit CI ve canlı smoke bekliyor.
- Render servislerini bağımsız doğrulama henüz yapılmadı (workspace seçimi gerekli); deploy durumunu varsayma.
