# İlk yayın — MVP kontrol listesi

Amaç: müşteri rezervasyon talebi gönderebilsin, işletme talebi takip edebilsin, kullanıcıya doğrulanmamış vaat sunulmasın. Admin paneli bu aşamanın dışında.

## Yayın öncesi zorunlu (GO / NO-GO)

- [ ] Güncel GitHub Actions frontend lint + unit tests + build ve backend PostgreSQL testleri **yeşil**.
- [ ] Render frontend/backend deploy **live**, API URL ve CORS doğru; canlı site açılıyor.
- [ ] **Gerçek uçtan uca rezervasyon:** Dalaman → desteklenen destinasyon, tarih/saat Türkiye yerel saati, yolcu, bagaj, bebek koltuğu, uçuş ve otel alanları; POST sonucu referans numarası; backend/DB kaydı kontrolü.
- [ ] **Yenileme:** Başarı ekranını yenileyince referans korunuyor; yeni rezervasyon başlatılınca eski referans temizleniyor.
- [ ] **Çift gönderim:** Aynı talep iki kez tıklandığında yalnızca tek kayıt oluşuyor; backend idempotency kontrolü doğrulanıyor.
- [ ] **Hata akışı:** API erişilemezse kullanıcıya yanlışlıkla 'başarılı' denmiyor; belirsiz gönderimde destek iletişimi gösteriliyor.
- [ ] **Gerçek fiyat ve kapasite:** Fiyat kataloğu işletme tarafından doğrulanmış; geçersiz araç/rota ve aşırı kapasite reddediliyor.
- [ ] **İletişim bilgileri:** Geçici telefon `05555555555` ve `ali_sonmez35@hotmail.com` yayına çıkmadan işletme tarafından doğrulanmalı/değiştirilmeli; yanlış numarayla yayın yapılmamalı.
- [ ] **İşletme bilgileri ve yasal metinler:** İptal, ödeme, KVKK/gizlilik ve işletme kimliği doğrulanmış; bilinmeyen şartlar vaat edilmiyor.
- [ ] **Mobil smoke:** Ana sayfa → rezervasyon 1/2/3 → başarı, iPhone/Android dar ekran ve masaüstü; kritik linkler çalışıyor.
- [ ] **Gizli anahtarlar:** Render env secrets GitHub'a yazılmamış; DB erişimi kısıtlı; gerçek kullanıcı verileri testlerde kullanılmıyor.
- [ ] **Operasyon:** Rezervasyonları kimin/ne sıklıkla takip edeceği belirlenmiş; otomatik e-posta henüz yoksa manuel kontrol süreci hazır.

## İlk yayından sonraya bırakılabilir

- Otomatik müşteri/işletme e-postaları (backlog 5); **yoksa sitede varmış gibi gösterilmez**.
- Güvenli self-servis rezervasyon sorgulama/değişiklik (6).
- Uçuş gecikmesi/karşılama otomasyonu (7), ileri SEO (9), çoklu dil (10), yorumlar (11), analitik (12).
- Kapsamlı tarayıcı E2E otomasyonu; ancak yukarıdaki manuel gerçek rezervasyon testi atlanamaz.

**Durum:** Bu belge bir kontrol listesidir, testlerin yapıldığına dair kanıt değildir. İşaretlenmemiş maddeler doğrulanmamıştır.
