# İlk yayın — MVP kontrol listesi

Amaç: müşteri rezervasyon talebi gönderebilsin, işletme talebi takip edebilsin, kullanıcıya doğrulanmamış vaat sunulmasın.

**Kapsam kararı (2026-11-16):** Kullanıcı ilk yayın hedefini genişletti: admin paneli, otomatik müşteri/işletme e-postaları ve e-posta doğrulaması, WhatsApp, logo, güvenli rezervasyon sorgulama, SEO, FAQ, gerçek müşteri yorumları ve gerçek araç görselleri de hedef kapsamda. Aşağıdaki eski MVP listesi teknik yayın kapılarını korur; bu yeni ürün gereksinimleri de bitmeden genişletilmiş kapsam tamamlandı sayılmaz.

## Yayın öncesi zorunlu (GO / NO-GO)

- [ ] Güncel GitHub Actions frontend lint + unit tests + build ve backend PostgreSQL testleri **yeşil**.
- [ ] Render frontend/backend deploy **live**, API URL ve CORS doğru; canlı site açılıyor.
- [ ] **Gerçek uçtan uca rezervasyon:** Dalaman → desteklenen destinasyon, tarih/saat Türkiye yerel saati, yolcu, bagaj, bebek koltuğu, uçuş ve otel alanları; POST sonucu referans numarası; backend/DB kaydı kontrolü.
- [ ] **Yenileme:** Başarı ekranını yenileyince referans korunuyor; yeni rezervasyon başlatılınca eski referans temizleniyor.
- [ ] **Çift gönderim:** Aynı talep iki kez tıklandığında yalnızca tek kayıt oluşuyor; backend idempotency kontrolü doğrulanıyor.
- [ ] **Hata akışı:** API erişilemezse veya geçersiz rezervasyon ID döndürürse kullanıcıya yanlışlıkla 'başarılı' denmiyor; belirsiz gönderimde destek iletişimi gösteriliyor. Kod koruması `f319d0e8`; canlı smoke bekliyor.
- [ ] **Gerçek fiyat ve kapasite:** Fiyat kataloğu işletme tarafından doğrulanmış; geçersiz araç/rota ve aşırı kapasite reddediliyor.
- [ ] **İletişim bilgileri:** Kullanıcı kararıyla `05555555555` geçici telefon numarası geliştirme/test ortamında korunuyor (`fce3c968`, `d3a2c0a6`, `4cd9a47a`). **Gerçek canlı yayından hemen önce mutlaka değiştirilecek.** İleride admin panelinden iletişim numarasını düzenleme alanı eklenecek; admin şu an kapsam dışı. `ali_sonmez35@hotmail.com` adresinin aktif takip edildiği doğrulanmalı.
- [ ] **İşletme bilgileri ve yasal metinler:** İptal, ödeme, KVKK/gizlilik ve işletme kimliği doğrulanmış; bilinmeyen şartlar vaat edilmiyor.
- [ ] **Mobil smoke:** Ana sayfa → rezervasyon 1/2/3 → başarı, iPhone/Android dar ekran ve masaüstü; kritik linkler çalışıyor.
- [ ] **Gizli anahtarlar:** Render env secrets GitHub'a yazılmamış; DB erişimi kısıtlı; gerçek kullanıcı verileri testlerde kullanılmıyor.
- [ ] **Operasyon:** Rezervasyonları kimin/ne sıklıkla takip edeceği belirlenmiş; otomatik e-posta henüz yoksa manuel kontrol süreci hazır.

## Genişletilmiş ilk yayın kapsamı (yeni ürün işleri)

- [ ] Admin paneli: yetkilendirme, rezervasyon listeleme/detay/durum ve iletişim ayarları.
- [ ] E-posta doğrulama yaklaşımı ve otomatik müşteri alındı + işletme bildirimleri; hata/tekrar gönderim/çift e-posta koruması.
- [ ] WhatsApp iletişim bağlantısı; gerçek numara ve doğru mesaj akışı.
- [ ] Özgün logo, favicon ve tutarlı marka uygulaması.
- [ ] Müşteri rezervasyon sorgulama: yalnızca referans numarasıyla kişisel veri gösterme; e-posta sahipliği doğrulaması veya tek kullanımlık erişim bağlantısı.
- [ ] SEO: indeksleme, metadata, canonical, sitemap, robots, rota sayfaları, schema ve performans.
- [ ] FAQ: gerçek işletme kurallarıyla uyumlu yanıtlar.
- [ ] Yalnızca gerçek/doğrulanabilir müşteri yorumları; uydurma yorumlar gerçek müşteri yorumu gibi yayımlanmaz.
- [ ] Gerçek filo/araç kategorisiyle eşleşen, kullanım izni bulunan araç fotoğrafları.
- [ ] Rakip Petunia Travel fiyatlarıyla hedef karşılaştırması: tek yön -£2,50 ve gidiş-dönüş -£5 yalnızca işletme maliyeti ve güncel kaynak fiyatı doğrulanırsa uygulanır.

## Eski MVP için ertelenebilir olarak işaretlenen işler (yeni kapsam kararıyla güncellendi)

- Otomatik müşteri/işletme e-postaları (backlog 5) artık genişletilmiş kapsamda; **çalışmadan sitede varmış gibi gösterilmez**.
- Güvenli self-servis rezervasyon sorgulama (6) artık genişletilmiş kapsamda; rezervasyon değişiklik talepleri daha sonraya bırakılabilir.
- Uçuş gecikmesi/karşılama otomasyonu (7), çoklu dil (10) ve analitik (12) sonraya bırakılabilir; temel SEO ve gerçek yorumlar artık genişletilmiş kapsamda.
- Kapsamlı tarayıcı E2E otomasyonu; ancak yukarıdaki manuel gerçek rezervasyon testi atlanamaz.

**Durum:** Bu belge bir kontrol listesidir, testlerin yapıldığına dair kanıt değildir. İşaretlenmemiş maddeler doğrulanmamıştır.

## 2026-11-16 durum kontrolü
- GitHub Actions `43923429251` **success** (önceki değişiklikler).
- `f319d0e8`: API'den geçerli pozitif tam sayı rezervasyon ID gelmeden başarı makbuzu oluşturulması engellendi; yeni commit CI ve canlı smoke bekliyor.
- Render servislerini bağımsız doğrulama henüz yapılmadı (workspace seçimi gerekli); deploy durumunu varsayma.
