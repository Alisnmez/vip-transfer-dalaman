# DalamanWay — yayın öncesi son kontroller (18 Kasım 2026)

> Bu dosya denetim listesidir; hukuki uygunluk veya canlı dağıtım onayı değildir. Gerçek işletme kimliği ve faaliyet modeli doğrulanmadan örnek hukuki metin yayınlanmamalıdır.

## P0 — Türkiye'de yasal faaliyet
- [ ] Hizmeti kimin sattığını belirle: doğrudan yetkili taşımacı mı, acente mi, sadece talep toplayan aracı mı?
- [ ] Ticaret unvanı, vergi bilgisi, tebligat/iletişim adresi, yetkili işletmeci ve fatura kesen tarafı doğrula.
- [ ] Taşıyıcının ilgili Ulaştırma ve Altyapı Bakanlığı yetki belgelerini, araç/sürücü uygunluğunu ve sigortalarını belge bazında doğrula. D2 her transfer için otomatik tek doğru belge değildir; taşıma modeli ve güzergâha göre değişir.
- [ ] Turizm acenteliği faaliyetleri yürütülüyorsa TÜRSAB ve ilgili turizm mevzuatı yönünden izinleri kontrol et.
- [ ] Reklamlarda 'lisanslı', 'sigortalı', 'VIP' vb. iddiaları yalnızca ispatlanabiliyorsa kullan.

## P0 — Müşteri hukuki sayfaları
- [ ] Gizlilik ve KVKK aydınlatma metni: veri sorumlusu, amaç, hukuki sebep, alıcılar, saklama, yurt dışı aktarım, haklar.
- [ ] Çerez bildirimi/tercih yönetimi: zorunlu olmayan analitik/pazarlama çerezleri için uygun rıza.
- [ ] Kullanım ve rezervasyon şartları: taraflar, hizmetin kapsamı, kesin onay anı, gecikme, uçuş takibi, no-show, bagaj, çocuk koltuğu.
- [ ] İptal/iade koşulları ve uygulanabilir tüketici hakları; tarihli hizmetler için istisnaları hukukçu ile değerlendir.
- [ ] Ön bilgilendirme: toplam fiyat, vergiler/ek ücretler, ödeme yöntemi, hizmet tarihi, iptal ve şikâyet iletişimi.
- [ ] Şartların rezervasyon öncesinde erişilebilirliği, sürüm ve onay zamanının kaydı.
- [ ] İletişim/işletme bilgileri, varsa ETBİS yükümlülüğü ve ticari elektronik ileti onayları.

## P0 — Teknik ve müşteri güveni
- [ ] #9 rezervasyonu müşteri e-posta kaydını admin Email Delivery History'de kontrol et; SMTP kabulü gelen kutusuna teslim kanıtı değildir.
- [ ] Gönderim hataları için kontrollü tekrar deneme ve çift bildirim önleme; gerçek müşteriyle uçtan uca test.
- [ ] Backend'de geçmiş tarih/saat rezervasyonunu ve geçmişe düzenlemeyi engelle; saat dilimi testi.
- [ ] Fiyatı backend'de yeniden hesapla; frontend tutarını tek kaynak kabul etme.
- [ ] Rezervasyon iptal/değişiklikleri için audit history, yetki ve idempotency.
- [ ] Veritabanı yedekleme/geri yükleme testi, hata izleme, güvenlik bağımlılık güncellemeleri.
- [ ] Ölüdeniz kartının gerçek fotoğrafını canlı frontend dağıtımı sonrası görsel olarak doğrula.
- [ ] Telefon, işletme e-postası, araç fotoğrafları, fiyatlar, mobil görünüm, SEO ve doğrudan /booking açılışı.

## Uygulama sırası
1. İşletme/taşıma modelini ve zorunlu yetkileri doğrula.
2. Hukuki metinleri gerçek işletme bilgileriyle hazırla, hukukçu kontrolünden geçir.
3. Footer ve rezervasyon onay akışına hukuki bağlantıları, uygun onay kayıtlarını entegre et.
4. E-posta #9 ve tarih/fiyat güvenliği hatalarını kapat.
5. Staging E2E ve güvenlik testlerinden sonra production'a dağıt; canlıda ayrıca doğrula.

Kaynaklar:
- https://www.uab.gov.tr/uploads/legislations/karayolu-tasima-yonetmeligi/karayolu-tasima-yonetmeligi.pdf
- https://tuketici.ticaret.gov.tr/yayinlar/tuketici-bilgi-rehberi/mesafeli-sozlesmeler-hakkinda-bilgilendirme
- https://www.kvkk.gov.tr/
