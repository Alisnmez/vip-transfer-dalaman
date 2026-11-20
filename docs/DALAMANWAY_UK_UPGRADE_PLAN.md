# DalamanWay — UK geliştirme planı

Kanıt ve rakip karşılaştırması [UK araştırma PR’ında](https://github.com/Alisnmez/vip-transfer-dalaman/pull/28). Öncelik, rezervasyonu güvenli ve anlaşılır hâle getirmek. Marmaris, Fethiye ve Ölüdeniz ilk pilot rotalar. Hacim ve dönüşüm verisi geldikçe sıra yeniden değerlendirilir.

| Sıra | Zaman | Uygulama | Kabul ölçütü |
|---:|---|---|---|
| 1 | İlk hafta | **Rezervasyon taslağı gizliliği.** Transfer, yolcu ve makbuz aynı sekmeyle sınırlı. Eski kalıcı kayıtlar temizlenir. | Aynı sekmede geri ve yenileme çalışır. Yeni sekme verisiz açılır. Başarılı gönderim taslakları temizler. **Kod ve test adayı hazır.** |
| 2 | İlk iki hafta | **Fiyat ve ödeme açıklığı.** Araç başına GBP toplamı, dâhil olanlar, olası ek ücret ve ödeme zamanı. | Üç pilotta rota, form ve test e-postası aynı fiyatı gösterir. Operatör ödeme koşullarını onaylar. |
| 3 | İlk iki hafta | **İptal, değişiklik ve gizlilik.** Bağlantıları form ve alt menüye koy. | Üç dilde tutarlı şartlar. Gizlilik metni işletmece onaylanır. |
| 4 | İlk iki hafta | **Talep alındı ve transfer onaylandı.** Ekran ve e-posta ayrımını doğrula. | Testte iki durum doğru alıcıya ve tek kez ulaşır. |
| 5 | İlk 30 gün | **Fotoğraflı havalimanı karşılama rehberi.** Buluşma noktası, gecikme ve bekleme kuralı. | Gerçek fotoğraf ve işletmenin destek kanalı ile doğrulanır. |
| 6 | İlk 30 gün | **İşletme kimliği ve güven.** Doğrulanabilir iletişim, yorum kaynağı ve izinli araç/galeri görselleri. | Bağlantılar mobilde çalışır. Araç bilgisi form ve katalogla eşleşir. |
| 7 | İlk 30 gün | **Mobil rezervasyon ekranı.** Fiyatı ve sonraki adımı görünür tut, kapasite ve çocuk koltuğu açıklamasını ekle. | 320/390/768 px’de klavye ve taşma testi. Fiyat → yolcu adımı oranı izlenir. |
| 8 | İlk 30 gün | **Ölçüm temeli.** UK Search Console ve rızalı rezervasyon hunisi. | Tıklama, talep, onay ve tamamlanan yolculuk ayrı kaydedilir. Olaylarda yolcu verisi bulunmaz. |
| 9 | 31–60 gün | **Üç mevcut rotayı güçlendir.** Marmaris, Fethiye ve Ölüdeniz için özgün ulaşım bilgisi, fiyat kapsamı ve doğru rezervasyon bağlantısı. | Üç CTA doğru destinasyonu seçer. UK sorgu/sayfa verisi ve indeks durumu kayıt altına alınır. |
| 10 | 61–90 gün | **Veriye bağlı büyüme.** Sonraki rotalar, uygun işletme profili ve gerekirse küçük UK Ads pilotu. | Gerçek katkı kârı ve onaylı rezervasyon başı maliyet belli. Reklam harcaması ayrı onaylı. |

**Yayın akışı:** İzole dal ve PR → CI → Render test ortamı → kullanıcının incelemesi ve açık onayı → canlı. İşletme koşulları doğrulanmadan fiyat, bekleme, ödeme veya iptal vaadi eklenmez.
