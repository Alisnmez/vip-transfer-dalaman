# DalamanWay — Araç fotoğraf eşleştirmesi

25 Kasım 2026 — Önceki çalışma kaydından aktarım. Numaralar kullanıcının 14 fotoğrafı gönderdiği sırayı ifade eder; dosya adı değildir. Orijinal fotoğraflar bu aktarımda yeniden görsel olarak doğrulanmadı. Hedef yollar mevcut `frontend/src/features/vehicle-type/fleetExpansionDraft.ts` ile uyumludur.

| Araç | Dış fotoğraf no | İç fotoğraf no | Dış dosya adı | İç dosya adı |
| --- | ---: | ---: | --- | --- |
| Standard Vito | 9 | 1 | standard-vito-exterior.webp | standard-vito-interior.webp |
| VIP Vito | 4 | 3 | vip-vito-exterior.webp | vip-vito-interior.webp |
| VIP Maybach | 11 | 2 | maybach-exterior.webp | maybach-interior.webp |
| Standard Sprinter 1–9 | 12 | 13 | standard-sprinter-9-exterior.webp | standard-sprinter-9-interior.webp |
| Standard Sprinter 1–15 | 10 | 14 | standard-sprinter-15-exterior.webp | standard-sprinter-15-interior.webp |
| VIP Sprinter 1–9 | 5 | 6 | vip-sprinter-9-exterior.webp | vip-sprinter-9-interior.webp |
| VIP Sprinter 1–15 | 7 | 8 | vip-sprinter-15-exterior.webp | vip-sprinter-15-interior.webp |

## Görsel kontrol notları
- Fotoğraf 1: iç mekân, siyah kenarları kırp.
- Fotoğraf 4: marina önündeki dış çekim; 3: mavi iç aydınlatma.
- Fotoğraf 2: pembe iç aydınlatma.
- Fotoğraf 6: Klassen logosu; kullanım hakkını kontrol et.
- 1–14 numaralarının her biri tam bir kez kullanılır.
- Hedef public dizini: `frontend/public/images/vehicles/`; URL öneki `/images/vehicles/`.
- Önceki çalışmada WebP paketi hazırlanmıştı (`dalamanway-fleet-webp.zip`); bu commit paketi veya görsel binary dosyalarını içermez. Orijinal yüklemeler veya paket ayrıca temin edilmeli, dosyalar görsel olarak karşılaştırılmalı.
- Gerçek araçla uyumu ve kullanım haklarını doğrula. Mevcut araç kartı tasarımını koru; dış/iç görselleri karıştırma. Kapasite ve bagaj değerlerini fotoğraftan tahmin etme.
- Bu belge bir handoff kaydıdır; aktif katalog, rezervasyon, fiyatlandırma ve canlı site değiştirilmedi. Staging testi ve kullanıcı onayı olmadan canlıya alma.
