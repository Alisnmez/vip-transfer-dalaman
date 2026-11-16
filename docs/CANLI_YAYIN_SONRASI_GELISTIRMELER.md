# CANLI YAYIN SONRASI GELİŞTİRME PLANI

Bu dosya, ilk sürüm yayınlandıktan sonra yapılacak iyileştirmeleri ve yeni sürüm fikirlerini toplar. **Mevcut sürümün eksikleri ve doğrulama kayıtları** için `docs/EKSIKLERIMIZ.md`; **yayın öncesi zorunlu kontroller** için `docs/ILK_YAYIN_KONTROL_LISTESI.md` kullanılır. Bu dosyadaki maddeler, aksi açıkça kararlaştırılmadıkça ilk yayın engeli değildir.

## Çalışma yöntemi
- Her fikir için **neden**, **kullanıcıya fayda**, **öncelik**, **bağımlılıklar**, **kabul kriteri**, **durum** ve **sürüm** kaydedilir.
- Önce mevcut kod incelenir; zaten yapılmış özellik ikinci kez yazılmaz.
- Yeni sürümde yapılan işler test ve doğrulama olmadan tamamlandı sayılmaz.
- Gerçek müşteri verileri, işletme fiyatları ve ödeme/iptal vaatleri doğrulanmadan yayınlanmaz.
- Sürüm numaraları aşağıda **öneridir**, kesin yayın tarihi veya taahhüt değildir.

## v1.0 — İlk yayın için alınan kararlar
- [x] **Online ödeme yok.** Kullanıcı kararı: 2026-11-16. Rezervasyon talebi oluşturulur; Stripe/ödeme sağlayıcısı entegrasyonu ilk sürüme eklenmez.
- [ ] **Ödeme şekli ayrıca netleştirilecek.** Araçta ödeme, nakit/kart kabulü ve tahsilat zamanı henüz kullanıcı tarafından onaylanmadı. Bu yüzden sitede doğrulanmamış ödeme vaadi verilmez.
- [ ] **İptal ve iade politikası** işletme tarafından onaylanmalı; bu konu `EKSIKLERIMIZ.md` 3.4 ve ilk yayın kontrol listesinde takip edilir.
- [ ] **Gerçek fiyatların ticari doğrulaması** ilk yayın kontrolüdür; ileri sürüme ertelenmiş sayılmaz.

## v1.1 — Rezervasyon ve ödeme deneyimini geliştirme
| Fikir | Kullanıcıya fayda | Öncelik | Kabul kriteri | Durum |
|---|---|---|---|---|
| Online kartla ödeme (opsiyonel) | Önceden ödeme seçeneği | Karar bekliyor | İşletme onayı, ödeme sağlayıcısı, güvenli ödeme, iade/iptal ve testler | FİKİR |
| Ödeme durumunun rezervasyonda görünmesi | Tahsilat takibi | Orta | Ödeme türü ve durumu doğru, yetkili kişilerce görülebilir | FİKİR |
| Daha açık fiyat dökümü | Sürpriz ücretleri azaltma | Orta | Gerçek onaylı fiyat ve koşullarla tutarlı | FİKİR |
| Daha anlaşılır iptal/değişiklik talebi | Müşterinin destek alması | Orta | İşletme politikasıyla uyumlu ve güvenli kimlik doğrulamalı | FİKİR |
| Rezervasyon sahibini e-posta koduyla doğrulama (OTP) | Başkasının rezervasyonuna ilişkin yetkisiz talep riskini azaltma | Orta | Rezervasyon kodu + kayıtlı e-posta eşleşmesi, tek kullanımlık ve süreli kod, deneme/istek sınırı, güvenli sunucu tarafı yetkilendirme, testler | ERTELENDİ — v1.1 |
| Doğrulanmış değişiklik/iptal talebi kaydı | WhatsApp mesajından bağımsız, izlenebilir talep süreci | Orta | Doğrulanmış müşteri talebi, admin incelemesi, işlem geçmişi; müşteri onayı olmadan otomatik değişiklik/iptal yok | FİKİR |

## v1.2 — İşletme operasyonu
| Fikir | Kullanıcıya fayda | Öncelik | Kabul kriteri | Durum |
|---|---|---|---|---|
| Rezervasyon yönetimi geliştirmeleri | Daha hızlı işlem | Orta | Yetkilendirme ve değişiklik geçmişi testli | FİKİR |
| Raporlama ve rezervasyon istatistikleri | İşletme kararlarına destek | Orta | Doğru veri, gizlilik ve erişim kontrolleri | FİKİR |
| Uçuş gecikmesi/karşılama iş akışı | Daha güvenilir karşılama | Orta | Gerçek operasyonla doğrulanmış kurallar | FİKİR |

## v1.3 — Büyüme ve kalite
| Fikir | Kullanıcıya fayda | Öncelik | Kabul kriteri | Durum |
|---|---|---|---|---|
| Ek dil seçenekleri | Daha çok müşteri | Orta | Doğru çeviri, yerel tarih/para biçimi | FİKİR |
| Dönüşüm ve performans analitiği | Sorunlu adımları tespit | Orta | Gizlilik uyumu, ölçümlerin doğrulanması | FİKİR |
| Rezervasyon akışında A/B iyileştirmeleri | Daha kolay kullanım | Düşük | Ölçülebilir sonuç ve regresyon testi | FİKİR |

## Sürüm günlüğü
### 2026-11-17 — Güvenli self-servis rezervasyon yönetimi ileri sürüme ertelendi
- **İlk yayın kararı:** Müşteri yalnızca rezervasyon referansını girerek hazır WhatsApp mesajıyla değişiklik/iptal talep eder; gerçek WhatsApp numarası henüz ayarlanmadıysa e-posta bağlantısı kullanılır. Bu işlem rezervasyonu otomatik değiştirmez.
- **Güvenlik:** WhatsApp'tan gelen referans rezervasyon sahibinin kanıtı değildir. Admin, işlem öncesinde rezervasyonda kayıtlı iletişim kanalı üzerinden müşteriyi doğrular.
- **v1.1 kapsamı:** E-postaya tek kullanımlık kod (OTP), kötüye kullanım sınırları, sunucuda doğrulanmış destek talebi ve admin onay geçmişi değerlendirilecek. Daha önce denenen OTP kodu ilk sürümden kaldırıldı; yeniden uygulama yapılırken güvenlik ve testler sıfırdan doğrulanacak.
- **Durum:** Planlama kaydı; uygulama kodu bu güncellemede değiştirilmedi.

### 2026-11-16 — Dosya oluşturuldu
- **Neden:** Kullanıcı, ilk yayından sonraki küçük ve düzenli geliştirmeleri mevcut eksik listesinden ayrı bir Markdown dosyasında toplamak istedi.
- **Karar:** İlk sürümde online ödeme olmayacak; ileride opsiyonel özellik olarak değerlendirilebilir.
- **Test:** Yalnızca plan/dokümantasyon değişikliği; uygulama kodu değiştirilmedi.
- **Sonraki adım:** İlk yayın için tahsilat biçimi ve iptal politikasını netleştirirken, yayın sonrası fikirleri bu dosyada biriktirmek.
