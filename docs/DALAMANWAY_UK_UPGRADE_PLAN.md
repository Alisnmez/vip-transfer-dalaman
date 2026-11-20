# DalamanWay — UK geliştirme planı

Kanıt ve rakip karşılaştırması [UK araştırma PR’ında](https://github.com/Alisnmez/vip-transfer-dalaman/pull/28). Öncelik, rezervasyonu güvenli ve anlaşılır hâle getirmek. Marmaris, Fethiye ve Ölüdeniz ilk pilot rotalar. Hacim ve dönüşüm verisi geldikçe sıra yeniden değerlendirilir.

| Sıra | Zaman | Uygulama | Kabul ölçütü |
|---:|---|---|---|
| 1 | İlk hafta | **Rezervasyon taslağı gizliliği.** Transfer, yolcu ve makbuz aynı sekmeyle sınırlı. Eski kalıcı kayıtlar temizlenir. | Aynı sekmede geri ve yenileme çalışır. Yeni sekme verisiz açılır. Başarılı gönderim taslakları temizler. **Kod ve test adayı hazır.** |
| 2 | İlk iki hafta | **Mevcut otomatik GBP fiyatının kapsamı.** Araç başına tutar rota, araç ve yolculuk türüne göre zaten hesaplanıyor. Kalan iş dâhil olanlar, olası ek ücret ve ödeme zamanı. | Üç pilotta rota, form ve test e-postası aynı fiyatı gösterir. Operatör ödeme koşullarını onaylar. |
| 3 | İlk iki hafta | **İptal, değişiklik ve gizlilik.** Mevcut Manage Booking akışını formdan aç. Kişisel bilgi istenmeden önce veri kullanım özetini göster. | Üç dilde talep ve veri kullanım özeti. Tam politika için işletme kimliği, saklama ve iptal koşulları doğrulanır. |
| 4 | İlk iki hafta | **Talep alındı ve transfer onaylandı.** Mevcut ekranı ve ayrı e-posta olaylarını test et. | Testte iki durum doğru alıcıya ve tek kez ulaşır. |
| 5 | İlk 30 gün | **Fotoğraflı havalimanı karşılama rehberi.** Buluşma noktası, gecikme ve bekleme kuralı. | Gerçek fotoğraf ve işletmenin destek kanalı ile doğrulanır. |
| 6 | İlk 30 gün | **İşletme kimliği ve güven.** Doğrulanabilir iletişim, yorum kaynağı ve izinli araç/galeri görselleri. | Bağlantılar mobilde çalışır. Araç bilgisi form ve katalogla eşleşir. |
| 7 | İlk 30 gün | **Mobil rezervasyon ekranı.** Fiyatı ve sonraki adımı görünür tut, kapasite ve çocuk koltuğu açıklamasını ekle. | 320/390/768 px’de klavye ve taşma testi. Fiyat → yolcu adımı oranı izlenir. |
| 8 | İlk 30 gün | **Ölçüm temeli.** UK Search Console ve rızalı rezervasyon hunisi. | Tıklama, talep, onay ve tamamlanan yolculuk ayrı kaydedilir. Olaylarda yolcu verisi bulunmaz. |
| 9 | 31–60 gün | **Üç mevcut rotayı güçlendir.** Marmaris, Fethiye ve Ölüdeniz için özgün ulaşım bilgisi, fiyat kapsamı ve doğru rezervasyon bağlantısı. | Üç CTA doğru destinasyonu seçer. UK sorgu/sayfa verisi ve indeks durumu kayıt altına alınır. |
| 10 | 61–90 gün | **Veriye bağlı büyüme.** Sonraki rotalar, uygun işletme profili ve gerekirse küçük UK Ads pilotu. | Gerçek katkı kârı ve onaylı rezervasyon başı maliyet belli. Reklam harcaması ayrı onaylı. |

**Yayın akışı:** İzole dal ve PR → CI → Render test ortamı → kullanıcının incelemesi ve açık onayı → canlı. İşletme koşulları doğrulanmadan fiyat, bekleme, ödeme veya iptal vaadi eklenmez.

## 20 Kasım 2026 — Fiyat, iptal ve bildirim yeniden denetimi

- **Otomatik fiyat doğrulandı.** Canlı ve Render test formunda Marmaris VIP Vito seçilince £47,50 tek yön, gidiş-dönüş seçilince £95 otomatik gösterildi. Sıradaki fiyat işi, tutarın kapsadığı hizmetleri ve ödeme zamanını işletme bilgisine dayanarak açıklamak. [Canlı form](https://dalamanway.com/booking) · [Render test](https://vip-transfer-dalaman-test.onrender.com/booking)
- **İptal ve değişiklik mevcut.** Manage Booking referans üzerinden e-posta talebi oluşturuyor. Yazılı onay beklenmesi gerektiği ekranda belirtiliyor. Yeni form bölümü müşteriyi buraya yönlendirir. Talep ile işlem arasındaki fark korunur. Destek numarası olarak kullanılan geçici örnek numara kaldırıldı. [Canlı yönetim](https://dalamanway.com/booking/lookup)
- **Veri kullanım özeti ve tam bildirim.** Formdaki İngilizce, Almanca ve Rusça özet rezervasyon verisinin neden istendiğini ve iletişim yolunu anlatır. Tam bildirim için resmi işletme kimliği, saklama süreleri, alıcı kategorileri, uygulanıyorsa yasal dayanak ve uluslararası aktarım bilgileri teyit edilmeli. [ICO rehberi](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/the-right-to-be-informed/what-privacy-information-should-we-provide/)
- **Bildirim doğrulaması.** İlk ekran bekleyen talebi ve referansı gösterir. Operatör onayı ikinci e-posta olayıdır. CI testinde geçici PostgreSQL ve taklit e-posta sağlayıcısı, aynı müşteriye tek bekleyen talep ve tek kesin onay mesajı üretildiğini kontrol eder. Gerçek gelen kutusu teslimi ve müşteri tarafında canlı durum izleme ayrı kapsamdır.

| Rakip | İptali müşteriye nasıl sunuyor? |
|---|---|
| [Suntransfers](https://www.suntransfers.com/dalaman-airport) | Alıştan 48 saat öncesine kadar ücretsiz değişiklik ve iptal ifadesini Dalaman sayfasında öne çıkarıyor. |
| [Marmaris Transfers](https://www.marmaris-transfers.com/) | Ana sayfada varıştan sekiz saat öncesine kadar ücretsiz iptal belirtiliyor. [SSS](https://www.marmaris-transfers.com/faq/) yakın zamanda telefon, daha önce e-posta ve iptal teyidi öneriyor. |
| [Welcome Pickups](https://www.welcomepickups.com/dalaman/airport-transfer-book/) | Dalaman sayfası alıştan 24 saat önce iptalde %80 iade ve uygulamadan değişiklik/iptal özelliğini belirtiyor. |

**DalamanWay için ticari karar.** Nakit çalışan modelde açık bir ücretsiz iptal eşiği değerlendirilebilir. Örnek seçenek olarak alıştan 24 saat öncesine kadar ücretsiz iptal, daha geç taleplerde ekibin yazılı teyidi. Süre, geç iptal veya gelmeme ücreti ve uçuş aksaklığı istisnası işletme onayı gerektirir. Örnek kural arayüze eklenmedi.
