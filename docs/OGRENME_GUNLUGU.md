# VIP Transfer Dalaman — Öğrenme ve Hata Çözüm Günlüğü

Bu dosyanın amacı projeyi sonradan **sıfırdan kendimiz yazabilecek şekilde** incelemek. `docs/EKSIKLERIMIZ.md` operasyonel iş takibi; bu dosya ise kodun mantığı, nedenleri, hatalar, çözüm yöntemleri ve tekrar sorularıdır.

## Öğrenme yaklaşımı

1. Önce özelliğin iş ihtiyacını ve veri akışını Türkçe açıkla.
2. Sonra ilgili dosyaları ve Controller → Service → Repository → PostgreSQL veya React component → hook → API akışını izle.
3. Kritik satırların söz dizimini ve neden kullanıldığını açıkla; daha basit bir alternatif varsa karşılaştır.
4. Gerçek hata mesajını, nedenini, düzeltmeyi ve bunu yakalayan testi göster.
5. Öğrenciye küçük bir değişikliği kendi yazdır; ardından kod incelemesi ve kısa tekrar soruları yap.
6. Kod kalitesi: aynı sorunu tekrarlayan fonksiyonları tekleştir, ama gereksiz soyutlama ekleme; anlaşılır ve tutarlı stil kullan.

## Öğrenilecek somut vakalar

### 1. Java Spring Boot entegrasyon testi derleme hatası
- **Belirti:** `BookingIntegrationTests.java` içinde `';' expected` derleme hatası.
- **Neden:** `mockMvc.perform(...content(...))` çağrısında bir fazla kapanış parantezi.
- **Çözüm:** Parantez sayısı düzeltildi; sonraki GitHub Actions backend PostgreSQL entegrasyon testleri başarılı oldu.
- **Öğrenme:** İç içe metod çağrıları, parantez eşleme, derleme hatasının satır numarasını okuma.
- **Uygulama:** MockMvc ile bir PATCH status testi yaz.

### 2. React Router regex ve ESLint parse hatası
- **Belirti:** GitHub Actions `43989754176`, frontend `router.tsx:29:69 Parsing error: Expression expected`.
- **Neden:** Otomatik oluşturulan kodda regex için gereğinden fazla ters eğik çizgi kullanılması.
- **Çözüm:** Domain ve rota regex'leri standart JavaScript regex literal biçiminde düzeltildi; commit `46298bb3`.
- **Doğrulama:** GitHub Actions `43990034226` frontend lint/test/build ve backend entegrasyon testleri başarılı.
- **Öğrenme:** Regex literal ile string kaçışları farklıdır; CI'da lint → test → build sırası.

### 3. React liste indeksi ile URL eşleştirme
- **Belirti:** `RoutesPage.tsx` içindeki `featuredDestinations[index]` yaklaşımı sıralama/filtreleme değişirse yanlış link üretebilirdi.
- **Çözüm:** Her featured route nesnesine `slug` eklenerek URL aynı veriden türetildi; commit `0b64f5c9`.
- **Öğrenme:** Dizide index ile ilişki kurmanın riskleri, `map`, `filter`, TypeScript type guard.
- **Uygulama:** Yeni destinasyon ekle ve linkini otomatik üret.

### 4. SEO: SPA, robots, sitemap, canonical ve prerender
- **İhtiyaç:** Google'ın destinasyon sayfalarını ilk HTML yanıtında okuyabilmesi; test ortamının indekslenmemesi.
- **İlk adım:** `frontend/scripts/generate-seo.mjs` sitemap/robots üretimi; `frontend/tests/seo.test.mjs` testleri.
- **Sonraki adım:** `frontend/scripts/prerender-routes.mjs` ile 5 rota için ilk HTML üretimi; `frontend/tests/prerender.test.mjs` testleri.
- **Açık konu:** Render'ın gerçek rota URL'sinde statik HTML döndürdüğü henüz kanıtlanmadı; React içeriği ve build script metinleri iki yerde tutuluyor. Bu bakım riski refactor edilmeli. Diğer public sayfalar, gerçek domain, Search Console, analitik hâlâ açık.
- **Öğrenme:** SPA ile SSR/prerender farkı, `noindex`, robots.txt, sitemap.xml, canonical ve Google'ın ilk HTML'i okuması.
- **Uygulama:** Test domaini ve örnek üretim domaini için oluşan HTML/robots farkını açıkla.

### 5. Rezervasyon güvenilirliği ve idempotency
- **İhtiyaç:** Kullanıcı iki kez gönderirse iki rezervasyon oluşmaması; başarısız isteklerde yanlış başarı mesajı çıkmaması.
- **Kod:** `BookingController`, `BookingService`, frontend booking API ve receipt/retry yardımcıları.
- **Öğrenme:** HTTP POST, `Idempotency-Key`, istek parmak izi, veritabanında unique constraint, transaction, 409 Conflict.
- **Uygulama:** Aynı anahtarla aynı ve farklı gövde gönderilince beklenen yanıtları açıkla.

### 6. Analitik olayları ve kullanıcı gizliliği
- **İhtiyaç:** Rezervasyon başlangıcı, yolcu adımı ve başarıyla API'ye kaydedilen rezervasyon talebini ölçmek.
- **Kod:** `frontend/src/features/analytics/analytics.ts`, `AnalyticsConsent.tsx`; React router ve üç rezervasyon sayfası.
- **Karar:** Google Analytics ölçüm kimliği (`VITE_GA_MEASUREMENT_ID`) yoksa veya kullanıcı izin vermediyse script yüklenmez. Sadece sabit olay adları gönderilir; müşteri adı, telefon, e-posta, rezervasyon ID, form verisi gönderilmez. Sayfa yolu yalnızca genel sayfa allowlist'inden geçerse raporlanır.
- **Kod standardı düzeltmesi:** İlk denemede analytics yan etkisi `useState` initializer içine kondu; React render saf olmalı. Bu nedenle `useEffect` içine taşındı (commit `05dd281d`, `f100e4e5`).
- **Açık:** GA4 ölçüm kimliği ve gizlilik metni henüz onaylanmadı. Rıza geri çekildiğinde önceden oluşmuş Google Analytics çerezlerinin temizlenmesi/Consent Mode uygulaması doğrulanmalı; canlı izleme ve uçtan uca testler henüz yapılmadı.
- **Öğrenme:** `useState` ve `useEffect` farkı, rıza, allowlist, neden analitik olaylarında PII yasak, `import.meta.env`.
- **Uygulama:** İzin vermeyen kullanıcının hangi analitik çağrıları göndermemesi gerektiğini test et.

## Sonraki eğitim oturumu için kontrol soruları
1. Controller, Service ve Repository neden ayrı katmanlar?
2. Java'da iç içe metod çağrısındaki fazla parantezi nasıl bulursun?
3. `featuredDestinations[index]` yerine neden nesnenin `slug` alanını kullandık?
4. CI'da lint, test ve build neyi ayrı ayrı doğrular?
5. `robots.txt` ile `<meta name="robots">` arasındaki fark nedir?
6. `Idempotency-Key` aynı isteğin iki kez kaydedilmesini nasıl önler?

## Kayıt disiplini
Her önemli geliştirmede **amaç → değişen dosyalar → gerçek hata → kök neden → çözüm → test sonucu → commit → öğrenme notu** sırası izlenecek. Test edilmemiş işler açıkça `doğrulama bekliyor` olarak yazılacak. Kullanıcı isterse dosyalar tek tek açılıp satır satır Türkçe öğretilecek.
