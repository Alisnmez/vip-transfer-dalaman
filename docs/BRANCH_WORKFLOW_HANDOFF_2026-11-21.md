# DalamanWay — Branch Haritası, Çakışma Güvenliği ve Sohbet Devri

**Tarih:** 2026-11-21. **Depo:** `Alisnmez/vip-transfer-dalaman`. **Kapsam:** GitHub'da görülen 57 branch, 5 açık PR. **Bu belge bir anlık görüntüdür; işlemden önce GitHub/Render tekrar okunmalı.** Hiçbir branch silinmedi, birleştirilmedi veya yeniden adlandırılmadı.

## Yeni sohbete verilecek talimat

> Önce `docs/BRANCH_WORKFLOW_HANDOFF_2026-11-21.md` ve `frontend/SEO_STANDARD.md` dosyalarını GitHub'da **güncel branch'lerinden** oku. Tüm branch HEAD'lerini, açık PR'ları, Render servislerinin source branch ve deployed commit'lerini yeniden doğrula. `main` ile `feature/booking-integration` ayrışmış; eski SEO branch'lerini doğrudan merge etme. Mevcut dosyaları eski kopyalarla overwrite etme. Her iş için güncel entegrasyon temelinden izole branch/PR ve test/staging kullan. İlgili branch'teki benzersiz değişiklikleri diff ile incele, sonra devam et. Bu belgeyi yeni tarihli kanıtla güncelle; eski kayıtları koru.

## 1. Doğrulanmış aktif durum

- Entegrasyon temeli: `feature/booking-integration` — `8e29062eee`.
- SEO çalışma dalı: `feature/seo-next-steps-20261121` — `508a594fb3`; entegrasyona göre **3 ahead / 0 behind**. Değişen dosyalar yalnızca `frontend/scripts/audit-live-seo.mjs` ve `.github/workflows/live-seo-audit.yml`.
- SEO commitleri: `230f457` (ilk salt-okunur audit), `9f2d914` (regex düzeltmesi), `508a594` (manuel/haftalık workflow). **Workflow çalışması ve canlı HTTP başarı sonucu henüz doğrulanmadı.** Varsayılan branch'te olmayan zamanlanmış workflow otomatik çalışıyor varsayılmamalı.
- `feature/private-review-import-20261121` entegrasyonla aynı HEAD; geçmiş yorum aktarımıyla ilgili. SEO için tekrar import yapılmaz.
- `main` entegrasyona göre **22 ahead / 7 behind**; `main` → entegrasyon körlemesine merge edilmez.
- Eski `feature/seo-audit-checks-20261119` entegrasyona göre **1 ahead / 72 behind** ve farkında `frontend/src/pages/public/HomeReviewStrip.tsx` var. SEO isimli dalın yalnızca SEO dosyaları içerdiği varsayılmamalı.
- `docs/uk-competitor-deep-research-20261120` **2 ahead / 41 behind**; araştırma yanında `HomeReviewStrip.tsx` farkı da var. PR #28 doğrudan merge edilmemeli.
- `docs/project-documentation-hub-20261121` **1 ahead / 1 behind**; dokümantasyon merkezi ayrı dalda, entegrasyonla otomatik eşit değil.
- Daha eski branch incelemesi: `docs/BRANCH_CLEANUP_INVENTORY_2026-11-19.md` (`docs/branch-inventory-20261119` dalında). Oradaki 65 branch karşılaştırması eski HEAD'e aittir; hiçbir silme önerisi otomatik uygulanmaz.

## 2. Açık PR'lar — dokunmadan önce kontrol et

| PR | Kaynak | Hedef | Konu |
|---|---|---|---|
| #42 | `codex/form-validation-review-presentation` | `feature/booking-integration` | Share form validation and add a labeled review presentation |
| #28 | `docs/uk-competitor-deep-research-20261120` | `feature/booking-integration` | docs: DalamanWay UK rakip analizi ve 90 günlük yol haritası |
| #26 | `fix/privacy-transfer-storage-consistency-20261119` | `fix/session-booking-privacy-20261119` | fix(privacy): use sessionStorage consistently for transfer draft |
| #22 | `fix/session-booking-privacy-20261119` | `feature/booking-integration` | fix(privacy): session-scoped booking drafts and receipt |
| #16 | `main` | `integration/safe-main-work-20261119` | WIP: safely integrate main-only changes into verified production baseline |

Bu PR'lar açıktır; eşzamanlı Work/Codex değişikliklerini takip et. PR #16'nın hedefi `integration/safe-main-work-20261119`; doğrudan entegrasyon dalı değildir.

## 3. Tüm branch'ler ve amaçları

**Önemli:** Branch adı bir amaç ipucudur, doğrulanmış kod kapsamı değildir. Aşağıdaki her SHA 21 Kasım 2026 snapshot'ıdır. Herhangi bir branch'ten kod taşımadan önce `compare_commits`, ilgili commit diff'i ve PR/CI kontrolü zorunlu.

### Aktif ve korunan temeller (4)
- `feature/booking-integration` — `8e29062eee` — Güncel entegrasyon ve Render kaynak dalı.
- `feature/private-review-import-20261121` — `8e29062eee` — Geçmiş yorum aktarımı; entegrasyonla aynı commit.
- `feature/seo-next-steps-20261121` — `508a594fb3` — Aktif SEO çalışma dalı; yalnızca SEO audit betiği ve GitHub Actions iş akışı.
- `main` — `7cfec8738e` — Varsayılan dal; entegrasyonla ayrışmış; **AÇIK PR #16** → `integration/safe-main-work-20261119`.

### SEO ve pazar araştırması (9)
- `docs/uk-competitor-deep-research-20261120` — `9598590d45` — Adından anlaşılan kapsam: uk competitor deep research (içerik ayrıca doğrulanmalı); **AÇIK PR #28** → `feature/booking-integration`.
- `feature/seo-audit-checks-20261119` — `0011a7f52e` — Adından anlaşılan kapsam: seo audit checks (içerik ayrıca doğrulanmalı).
- `feature/seo-localized-route-pilot-20261119` — `7247ebfa28` — Adından anlaşılan kapsam: seo localized route pilot (içerik ayrıca doğrulanmalı).
- `feature/seo-route-content-20261119` — `1ead078363` — Adından anlaşılan kapsam: seo route content (içerik ayrıca doğrulanmalı).
- `feature/seo-route-expansion-20261119` — `5f70e34d71` — Adından anlaşılan kapsam: seo route expansion (içerik ayrıca doğrulanmalı).
- `research/international-seo-four-markets-20261119` — `734e6a4713` — Adından anlaşılan kapsam: international seo four markets (içerik ayrıca doğrulanmalı).
- `seo/complete-seven-route-locales` — `3ea4dc003b` — Adından anlaşılan kapsam: complete seven route locales (içerik ayrıca doğrulanmalı).
- `seo/fethiye-oludeniz-routing` — `35a41af0b6` — Adından anlaşılan kapsam: fethiye oludeniz routing (içerik ayrıca doğrulanmalı).
- `seo/route-vehicle-capacity` — `4a31e3c288` — Adından anlaşılan kapsam: route vehicle capacity (içerik ayrıca doğrulanmalı).

### Yorumlar, sunum ve ana sayfa (21)
- `codex/classroom-review-voice` — `79d78c86cc` — Adından anlaşılan kapsam: classroom review voice (içerik ayrıca doğrulanmalı).
- `codex/classroom-reviews-demo` — `4234076228` — Adından anlaşılan kapsam: classroom reviews demo (içerik ayrıca doğrulanmalı).
- `codex/default-staging-review-examples` — `9a680e818f` — Adından anlaşılan kapsam: default staging review examples (içerik ayrıca doğrulanmalı).
- `codex/expand-review-cards-and-fixtures` — `84d8c64904` — Adından anlaşılan kapsam: expand review cards and fixtures (içerik ayrıca doğrulanmalı).
- `codex/form-validation-review-presentation` — `c3064846e3` — Adından anlaşılan kapsam: form validation review presentation (içerik ayrıca doğrulanmalı); **AÇIK PR #42** → `feature/booking-integration`.
- `codex/home-fleet-photos` — `29c3117ec5` — Adından anlaşılan kapsam: home fleet photos (içerik ayrıca doğrulanmalı).
- `codex/input-review-current-20261120` — `2456599399` — Adından anlaşılan kapsam: input review current (içerik ayrıca doğrulanmalı).
- `codex/localized-classroom-reviews` — `7ca3b0ea87` — Adından anlaşılan kapsam: localized classroom reviews (içerik ayrıca doğrulanmalı).
- `codex/restore-test-reviews-20261121` — `2119cc3d13` — Adından anlaşılan kapsam: restore test reviews (içerik ayrıca doğrulanmalı).
- `codex/review-card-timestamps` — `bdfc0443dc` — Adından anlaşılan kapsam: review card timestamps (içerik ayrıca doğrulanmalı).
- `codex/review-db-transfer-20261120` — `961d9a1e1a` — Adından anlaşılan kapsam: review db transfer (içerik ayrıca doğrulanmalı).
- `codex/review-demo-disable-20261120` — `fff28548fc` — Adından anlaşılan kapsam: review demo disable (içerik ayrıca doğrulanmalı).
- `codex/review-form-jump` — `58449179e3` — Adından anlaşılan kapsam: review form jump (içerik ayrıca doğrulanmalı).
- `codex/run-review-smoke-in-ci` — `c70c685763` — Adından anlaşılan kapsam: run review smoke in ci (içerik ayrıca doğrulanmalı).
- `codex/seasonal-review-dates` — `ed1ba190b0` — Adından anlaşılan kapsam: seasonal review dates (içerik ayrıca doğrulanmalı).
- `codex/sync-homepage-review-feed` — `acb4c9b574` — Adından anlaşılan kapsam: sync homepage review feed (içerik ayrıca doğrulanmalı).
- `feature/home-review-card-parity-20261120` — `f7690e00e5` — Adından anlaşılan kapsam: home review card parity (içerik ayrıca doğrulanmalı).
- `feature/presentation-sample-reviews-20261120` — `2a2fb26b9c` — Adından anlaşılan kapsam: presentation sample reviews (içerik ayrıca doğrulanmalı).
- `feature/vehicle-photo-cards-20261120` — `362bdad91f` — Adından anlaşılan kapsam: vehicle photo cards (içerik ayrıca doğrulanmalı).
- `fix/home-vehicle-hover-20261120` — `1e0ed85f82` — Adından anlaşılan kapsam: home vehicle hover (içerik ayrıca doğrulanmalı).
- `fix/review-card-tests-20261120` — `39b6c7df24` — Adından anlaşılan kapsam: review card tests (içerik ayrıca doğrulanmalı).

### Rezervasyon, gizlilik ve e-posta (8)
- `fix/booking-session-privacy-20261119` — `713b68dd2b` — Adından anlaşılan kapsam: booking session privacy (içerik ayrıca doğrulanmalı).
- `fix/booking-terms-and-notifications-20261120` — `9d2fe0e02a` — Adından anlaşılan kapsam: booking terms and notifications (içerik ayrıca doğrulanmalı).
- `fix/privacy-transfer-storage-consistency-20261119` — `9f6e042b0f` — Adından anlaşılan kapsam: privacy transfer storage consistency (içerik ayrıca doğrulanmalı); **AÇIK PR #26** → `fix/session-booking-privacy-20261119`.
- `fix/session-booking-privacy-20261119` — `9997a3f0f0` — Adından anlaşılan kapsam: session booking privacy (içerik ayrıca doğrulanmalı); **AÇIK PR #22** → `feature/booking-integration`.
- `fix/uk-upgrades-booking-session-privacy-20261120` — `62febcbf0e` — Adından anlaşılan kapsam: uk upgrades booking session privacy (içerik ayrıca doğrulanmalı).
- `perf/email-dispatch-20261118` — `8c1323a05e` — Adından anlaşılan kapsam: email dispatch (içerik ayrıca doğrulanmalı).
- `refactor/shared-booking-storage` — `eacbac79a8` — Adından anlaşılan kapsam: shared booking storage (içerik ayrıca doğrulanmalı).
- `test/booking-session-privacy-e2e-20261119` — `75c0e7def9` — Adından anlaşılan kapsam: booking session privacy e2e (içerik ayrıca doğrulanmalı).

### Test ve tanılama (5)
- `diagnostics/production-readonly-capacity-20261118` — `69c1c81317` — Adından anlaşılan kapsam: production readonly capacity (içerik ayrıca doğrulanmalı).
- `test/admin-menu-verification-20261118` — `d01662ac59` — Adından anlaşılan kapsam: admin menu verification (içerik ayrıca doğrulanmalı).
- `test/automated-build-20261115` — `3762a56dfa` — Adından anlaşılan kapsam: automated build (içerik ayrıca doğrulanmalı).
- `test/isolated-booking-capacity-20261118` — `62c9a176e7` — Adından anlaşılan kapsam: isolated booking capacity (içerik ayrıca doğrulanmalı).
- `test/production-capacity-20261118` — `3caf77ab25` — Adından anlaşılan kapsam: production capacity (içerik ayrıca doğrulanmalı).

### Dokümantasyon, entegrasyon ve yayın (5)
- `codex/main-sync-candidate-20261120` — `7d33758908` — Adından anlaşılan kapsam: main sync candidate (içerik ayrıca doğrulanmalı).
- `docs/branch-inventory-20261119` — `5e7b3ba2bb` — Adından anlaşılan kapsam: branch inventory (içerik ayrıca doğrulanmalı).
- `docs/project-documentation-hub-20261121` — `c1e448d25b` — Adından anlaşılan kapsam: project documentation hub (içerik ayrıca doğrulanmalı).
- `integration/safe-main-work-20261119` — `e07815fb14` — Adından anlaşılan kapsam: safe main work (içerik ayrıca doğrulanmalı).
- `release/candidate-verified-staging-20261119` — `1116f2d93d` — Adından anlaşılan kapsam: candidate verified staging (içerik ayrıca doğrulanmalı).

### Güvenlik ve yedekler (5)
- `backup/main-before-booking-integration-2026-11-17` — `54cde10f14` — Adından anlaşılan kapsam: main before booking integration 2026 11 17 (içerik ayrıca doğrulanmalı).
- `safety/booking-integration-before-seo-20261119` — `82f6a31a5b` — Adından anlaşılan kapsam: booking integration before seo (içerik ayrıca doğrulanmalı).
- `safety/preserve-booking-integration-20261119` — `fa11c6a479` — Adından anlaşılan kapsam: preserve booking integration (içerik ayrıca doğrulanmalı).
- `safety/preserve-production-api-20261119` — `0694bd136b` — Adından anlaşılan kapsam: preserve production api (içerik ayrıca doğrulanmalı).
- `safety/preserve-production-web-20261119` — `fac9332ea6` — Adından anlaşılan kapsam: preserve production web (içerik ayrıca doğrulanmalı).


## 4. Güvenli çalışma protokolü — asla üstüne yazma

1. **Her oturum başlangıcında** GitHub branch listesi, HEAD SHA'ları, açık PR'lar ve Render deploy kaynaklarını tekrar oku. Bu belgenin SHA'sını güncel kabul etme.
2. Değiştirilecek dosyanın mevcut hedef branch blob SHA'sını al; başka bir dalda aynı dosyaya dokunulmuş mu `compare_commits` ile bak. Çakışan patch'leri elle uzlaştır; eski içerikle dosyayı tamamen değiştirme.
3. İş türüne göre ayrım yap: SEO için `feature/seo-next-steps-20261121` (önce güncelliğini karşılaştır); rezervasyon veya diğer işler için yeni ayrı branch. `main`, Render kaynak dalı ve açık PR head'lerini izinsiz doğrudan düzenleme.
4. Kod değişikliği → test/lint/build → PR diff/CI → staging smoke → kullanıcı onayı → kontrollü production deploy → canlı doğrulama. `KODLANDI`, `TEST GEÇTİ` ve `CANLIDA DOĞRULANDI` ayrı durumlar.
5. Staging verisi sentetik olmalı. Gerçek müşteri yorumlarını, kişisel bilgileri, SQL veri dökümlerini ve anahtarları public GitHub'a koyma. DB migrasyonu/yeniden import/branch silme/deploy işlemlerini açık gerekçe ve güvenlik kontrolü olmadan yapma.
6. Aynı anda başka bir Work oturumu değişiklik yapıyorsa önce son HEAD'i ve PR'ları yeniden oku. Force push, reset, toplu branch silme ve kör merge yapma.
7. Bu devir belgesini yeni tarihli **ek kayıt** ile güncelle; geçmiş kanıtları silme. Güncellemeden önce blob SHA kontrolü yap.

## 5. SEO devri — nerede kaldık?

- Ana SEO standardı: `frontend/SEO_STANDARD.md`. Dört pazar çalışması: `docs/SEO_FOUR_MARKETS_RESEARCH_2026-11-19.md`. UK araştırma PR #28'de.
- Önceki belgelenmiş canlı kontrol: 28 sitemap URL'si, 21 EN/DE/RU rota sayfası, 36/36 HTTP/HTML kontrolü; **tarihli geçmiş kanıt**, bugünkü garanti değil.
- 21 Kasım Search Console performans ZIP'i son 28 günde sorgu/sayfa/ülke/cihaz veri satırı içermiyordu. Site yeni; veri yokluğu indekslenmeme kanıtı değildir.
- Yeni audit workflow yalnızca feature branch'te. **Sonraki işlem:** CI çalıştırma imkânını kontrol et; gerçek production HTTP çıktısını elde et, başarısız URL varsa nedenini ayır. Sonra indeks raporu, içerik ve mobil performansa geç.
- İlk HTML'de canonical, robots, hreflang, sitemap, booking noindex ve 404 kontrolleri korunmalı. Mevcut fiyat/rezervasyon akışına ve review kartlarına SEO gerekçesiyle müdahale etme.

## 6. Devir notunun güvenilirlik sınırı

Bu envanter GitHub branch listesi ve açık PR kayıtlarıyla güncellendi; belirli kritik branch'lerde karşılaştırma yapıldı. **65 branch'in tamamının commit diff'i, CI sonucu, deploy bağımlılığı ve silinebilirliği tek tek doğrulanmış değildir.** Dolayısıyla listedeki amaçların çoğu isim temelli sınıflandırmadır; otomatik merge/silme kararı değildir.


## 7. 21 Kasım 2026 — SEO denetimi genişletme (sonraki çalışma)

- Başlamadan önce `feature/booking-integration` HEAD `8e29062eee`, `main` HEAD `7cfec8738e`, SEO çalışma dalı HEAD `e85ae56282` ve 5 açık PR tekrar kontrol edildi. Temel dallar değişmemişti.
- `frontend/scripts/audit-live-seo.mjs` güncellendi: canlı sitemap XML içinden 28 benzersiz URL'yi toplama; tamamında HTTP 200, **tam URL ile canonical eşleşmesi**, robots noindex olmaması; booking/admin noindex; iki geçersiz URL için HTTP 404; JSON satırları ve toplam hata sayısı.
- Kod commitleri: `89c6205034d94099f305b87fb58930ae0a94506b` ve `caf7741b1bc3885b4704da3bcc6368b2d166f035`.
- **Doğrulama sınırı:** GitHub'daki kaynak dosya yeniden okundu; Node.js syntax testi, GitHub Actions çalışması ve canlı HTTP audit sonucu henüz elde edilmedi. Kodun başarılı çalıştığını varsayma. Bir sonraki iş: Node syntax testi, workflow çalıştırma, gerçek çıktı ve gerekirse hata düzeltmesi.
- Üretim, staging, veritabanı ve diğer branch'lere müdahale edilmedi. Bu kayıt eklendiği için önceki bölümdeki SEO dalı HEAD'i tarihsel anlık görüntüdür; güncel HEAD'i yeniden kontrol et.
