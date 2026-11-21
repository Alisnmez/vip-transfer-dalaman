# DalamanWay — Birleşik Krallık rekabet ve dönüşüm araştırması

**Araştırma tarihi** 20 Kasım 2026. **Kod tabanı** `feature/booking-integration`, `f06ac1c`. **Kapsam** Kamuya açık veriler, canlı ve Render test ortamında salt okunur inceleme, geliştirme önerileri.

## 1. Yönetici özeti

DalamanWay’in belirgin avantajı, UK müşterisinin özel araç fiyatını GBP olarak görebilmesi. Marmaris için VIP Vito canlı ve test formunda **£47,50 tek yön, £95 gidiş-dönüş** gösterdi. Canlı API’de 59 farklı destinasyon ve 531 fiyat kaydı vardı. Tarifeyi işletmenin marj maliyeti ve koşullarıyla doğrulamadan genel fiyat indirimi önerilmiyor.

Yerel rakiplerin öne çıktığı yer, müşterinin **tam olarak ne satın aldığını** anlatma biçimi. Dalaman Travel tek bir rota sayfasında fiyatı, valizi, karşılama ve uçuş gecikmesi koşullarını birleştiriyor. Marmaris Transfers fotoğraflı terminal buluşma rehberi sunuyor. Airports Transfer Turkey ulaşıma ilişkin karar verdiren özgün rehberleri fiyat formuyla birleştiriyor. Bazı rakiplerde açık sayfalar arasında koşullar çelişebiliyor. DalamanWay için fırsat, bütün temas noktalarında aynı doğrulanmış koşulları sunmak. [Dalaman Travel](https://www.dalamantravel.com/en/dalaman-airport-to-marmaris-transfer) · [Marmaris Transfers](https://www.marmaris-transfers.com/dalaman-airport-pick-up-procedures/) · [Airports Transfer Turkey](https://www.airportstransferturkey.com/guides/dalaman-airport-to-marmaris-icmeler)

**İlk karar** Mevcut rezervasyon güvenilirliği ve veri saklama riskini kapat. Ardından GBP fiyat kapsamı, talep/onay ayrımı, karşılama ve iptal koşullarını rezervasyon kararının alındığı yerlere taşı. Trafik yatırımı için ilk pilot Marmaris, Fethiye ve Ölüdeniz. Pilot sırası ticari uygunluk ve gözlenen içerik rekabetine dayanıyor. UK arama hacmiyle yeniden önceliklendirilecek.

## 2. Yöntem ve sınırlamalar

- 12 İngilizce sorgu ayrı ayrı çalıştırıldı. Hedeflenen UK oturumu doğrulanamadığı için aşağıdaki sonuçlar **arama aracı keşif örneklemi**. Google UK organik sıra, harita sonucu veya reklam gösterimi ölçümü olarak kullanılmaz.
- On alan adı, tekrarlı keşif, Dalaman rotasına doğrudan hizmet ve kıyas değeriyle seçildi. Öncelik sırası, ayrı işletme sahipliği veya pazar payı iddiası taşımaz.
- Kamuya açık ana sayfa, rota, fiyat, araç, yardım, iletişim veya koşul sayfaları incelendi. Rakip vaatlerinin sitede yazdığı doğrulandı. Operasyonun gerçekleştiği, lisansın geçerliliği ve yorum sahibinin transfer aldığı bu çalışmanın kanıt kapsamı dışında.
- Canlı ve test HTTP/HTML ayrı tarandı. Canlı rezervasyonun ilk ekranı 390 px’de açıldı. Canlı ve test Marmaris fiyatı tarayıcıda seçilerek okundu. Formun sonraki adımlarına, gönderimine ve kişisel verilere ilişkin bulgular kaynak kodu ve kamuya açık HTTP yanıtlarıyla etiketlendi.
- Rakiplerde sipariş, ödeme ve iletişim gönderimi yapılmadı. Kontrol edilen rakip sayfalarında son fiyat, mobil saha performansı ve satış sonrası operasyon sonuca bağlanmış kabul edilmedi.

## 3. Google UK sorgu kapsaması

20 Kasım 2026 arama aracı örneği. Her satır bir görünür sonuç örneği. UK konumu, cihaz, gerçek sıra ve reklam durumu kontrol edilemedi.

| İngilizce sorgu | Örnekte görülen kaynak | Sonucun rolü |
|---|---|---|
| dalaman airport transfers | [Dalaman Travel](https://www.dalamantravel.com/en/dalaman-airport-transfer) | Rota ve fiyat merkezi |
| dalaman airport private transfer | [Sunshuttle](https://www.antalyataxis.com/airports/dalaman) | Operatör adayı. Açma denemesi 404 |
| dalaman to marmaris transfer | [Airports Transfer Turkey](https://www.airportstransferturkey.com/guides/dalaman-airport-to-marmaris-icmeler) | Ticari rehber |
| dalaman to fethiye transfer | [SooTransfer](https://www.sootransfer.com/en/t/dalaman-fethiye-transfer/) | Ticari rota |
| dalaman to oludeniz transfer | [SooTransfer](https://www.sootransfer.com/en/t/dalaman-oludeniz-transfer/) | Ticari rota |
| dalaman to gocek transfer | [Airports Transfer Turkey](https://www.airportstransferturkey.com/guides/dalaman-airport-to-gocek) | Ticari rehber |
| dalaman airport taxi | [YDA Dalaman](https://www.dalamanairport.aero/en/passengers/taxi) | Resmî havalimanı taksi bilgisi |
| cheap dalaman transfers | [DM Transfers](https://www.dmtransfer.com/) | Operatör adayı. Sayfa metni okunamadı |
| dalaman vip transfer | [DalamanAirport.com.tr](https://dalamanairport.com.tr/hizmet-bolgelerimiz/) | Türkçe hizmet sayfası |
| dalaman airport transfers to icmeler | [Dalaman Travel](https://www.dalamantravel.com/en/dalaman-airport-to-icmeler-transfer) | Ticari rota |
| dalaman airport transfers to sarigerme | [Sarigerme.co.uk](https://www.sarigerme.co.uk/location) | Bilgi kaynağı |
| book dalaman airport transfer | [Dalaman Transport](https://www.dalamantransport.com/help/) | Rezervasyon yardım sayfası |

Bu örneklemde Dalaman Travel, SooTransfer ve Airports Transfer Turkey **ikişer farklı sorguda** göründü. Harita, reklam ve ölçülmüş organik sıra için veri yok. [Tripadvisor](https://www.tripadvisor.com/AttractionProductReview-g811172-d16677803-Private_Transfer_from_Dalaman_Airport_DLM_to_Marmaris_Fethiye_Oludeniz-Dalaman_Mug.html) ayrıca bir aracı yorum/satış sayfası örneği olarak görüldü. Gelecek UK ölçümünde ülke, tarih, konum, cihaz, organik konum, reklam ve harita türü ayrı alanlarla kaydedilmeli. Başlangıçta genel sorgu, Marmaris ve Fethiye için London, Manchester ve Birmingham kontrolü yeterli bir tekrar örneklemi oluşturur.

## 4. On rakip profili

| Kimlik | Marka ve konumlandırma | İncelenen sayfalar ve güçlü taraf | Açık nokta / DalamanWay fırsatı |
|---|---|---|---|
| DT | Dalaman Travel · yerel özel transfer · EN/TR/RU | [Ana sayfa](https://www.dalamantravel.com/en), [rotalar](https://www.dalamantravel.com/en/dalaman-airport-transfer), [Marmaris](https://www.dalamantravel.com/en/dalaman-airport-to-marmaris-transfer), [SSS](https://www.dalamantravel.com/en/faq), [rezervasyon](https://www.dalamantravel.com/en/booking). Fethiye, Marmaris, Ölüdeniz, Göcek, Dalyan, Sarıgerme ve İçmeler. Rota bazlı GBP ve açıklama | Formun HTML çıktısında yükleme ekranı görüldü. Koşulları rota ile formda aynı metriklerle gösterme fırsatı |
| ATT | Airports Transfer Turkey · çok havalimanlı acente | [Ana sayfa](https://www.airportstransferturkey.com/), [Marmaris rehberi](https://www.airportstransferturkey.com/guides/dalaman-airport-to-marmaris-icmeler), [Göcek rehberi](https://www.airportstransferturkey.com/guides/dalaman-airport-to-gocek), [iletişim](https://www.airportstransferturkey.com/help/contact-us). Ulaşım alternatifleri, harita/rota bağlamı, arama formu | İncelenen farklı rehberlerde başlangıç rakamları farklı. DalamanWay aynı katalogdan çektiği araç fiyatını anlaşılır biçimde gösterebilir |
| ST | SooTransfer · Mercedes kategorileri ve WhatsApp odaklı doğrudan talep | [Fethiye](https://www.sootransfer.com/en/t/dalaman-fethiye-transfer/), [Ölüdeniz](https://www.sootransfer.com/en/t/dalaman-oludeniz-transfer/), [filo](https://www.sootransfer.com/en/vehicles/). Araç kapasitesi, rota fiyatı ve konaklama bağlantıları | Nihai teklif ve WhatsApp sonrası adımlar gözlenmedi. DalamanWay’in site içi çok adımlı talep akışı ölçülebilir |
| MT | Marmaris Transfers · Marmaris/İçmeler özel taksi ve minibüs | [Ana sayfa](https://www.marmaris-transfers.com/), [SSS](https://www.marmaris-transfers.com/faq/), [fotoğraflı buluşma rehberi](https://www.marmaris-transfers.com/dalaman-airport-pick-up-procedures/). Tek yön/dönüş arama ve açık iptal iddiası | Gerçek form fiyatı doğrulanmadı. Güncel, kendi fotoğraflarımızla terminal rehberi üretilebilir |
| DAT | Dalaman Airport Transfers / Without Error · çok dilli yerel acente | [Ana sayfa](https://dalamanairport-transfers.com/), [gizlilik](https://dalamanairport-transfers.com/agreements/privacy-policy), [iptal](https://dalamanairport-transfers.com/agreements/reservation-cancellation-policy). Harita ve koşul bağlantıları, Marmaris/Fethiye/Göcek/Ölüdeniz | Örnek ana sayfada doğrudan HTTP HTML’i `noindex, nofollow` döndürdü. Marka diğer sayfalarda sıralanabilir. Fiyat/koşul sunumu için kıyas, SEO sıralaması için kanıt sınırlı |
| DTP | Dalaman Transport / IAMVIP · Marmaris merkezli hizmet | [Ana sayfa](https://www.dalamantransport.com/), [yardım](https://www.dalamantransport.com/help/), [filo](https://www.dalamantransport.com/our-vehicles/), [yorumlar](https://www.dalamantransport.com/customer-reviews/), [iletişim](https://www.dalamantransport.com/contact/). Adres, filo, süreç | Yardım sayfası ön ödeme ile sürücüye ödeme ifadelerini birlikte kullanıyor. Şeffaflık fırsatı |
| DGT | Dalaman Go Transfer · sabit fiyat, çok havalimanı · EN/TR/DE/RU, GBP seçimi | [Ana sayfa](https://dalamangotransfer.com/en), [filo](https://dalamangotransfer.com/en/vehicles). Yaş grupları, valiz, gidiş-dönüş, bekleme, sürücü bilgisi ve otel partneri | İletişim numarası örnek numara görünümünde. Çalışırlığı doğrulanmadı. Gerçek operasyon kanalı, doğrulanmış standart ve gerçek fotoğraf DalamanWay’i ayırt edebilir |
| VDT | VIP Dalaman Transfers · VIP minivan, Maybach ve minibüs · GBP | [Ana sayfa](https://www.vipdalamantransfers.com/), [tarife](https://www.vipdalamantransfers.com/pricelist/), [rezervasyon](https://www.vipdalamantransfers.com/booknow/), [SSS](https://www.vipdalamantransfers.com/faq/). Uzun araç/destinasyon tablosu, ödeme ve çocuk koltuğu açıklaması | Geniş tablo mobil erişim açısından test edilmeli. Satın alınabilir üç-dört seçenekle daha düzenli mobil fiyat karşılaştırması mümkün |
| WP | Welcome Pickups · uluslararası sürücü ağı | [Dalaman rezervasyon sayfası](https://www.welcomepickups.com/dalaman/airport-transfer-book/). İngilizce konuşan sürücü, buluşma bilgisi ve iade oranı ilanı | Dalaman’a ait ayrı yorum sayısı, araç/valiz toplamı ve kesin fiyat doğrulanmadı. Rekabet odağı yerel rota bilgisi |
| SUN | Suntransfers · uluslararası rezervasyon platformu | [Dalaman sayfası](https://www.suntransfers.com/dalaman-airport). Tek form, özel veya paylaşımlı seçenek, araç grupları, bagaj/özel istekler, uçuş ve iptal açıklaması | Nihai Dalaman fiyatı bu araştırmada doğrulanmadı. Global ölçek, yerel rakibin karşılaması gereken reklam bütçesi hakkında ölçü vermez |

**Alan adı ve işletme ayrımı:** VDT ve DTP’nin açılan iletişim sayfaları aynı adresi ve telefon numarasını gösteriyor. Bağımsız rakip sayısı, mülkiyet veya firma bağlantısı belgelenmeden iki ayrı işletme olarak sayılmamalı. [VDT iletişim](https://www.vipdalamantransfers.com/contact/) · [DTP iletişim](https://www.dalamantransport.com/contact/)

## 5. Rakip özellik matrisi

**D** kamuya açık sayfa/metinde doğrulandı. **B** incelenen kaynaklarda bulunamadı veya iddianın kapsamı doğrulanamadı. **İ** etkileşim/teklif alanı bu incelemede erişilemedi ya da test edilmedi. Kaynaklar §4’te marka satırındadır.

| Rakip | Rezervasyon girişi | Fiyat ilk aşamada | Araç başı açıklama | Tek/dönüş | Araç listesi | Yolcu kapasitesi | Valiz bilgisi | Çocuk koltuğu | Uçuş numarası | Ek durak kuralı |
|---|---|---|---|---|---|---|---|---|---|---|
| DT | D | D, rota | D | İ | D | D | D | D | D | B |
| ATT | D | D, sonraki adım iddiası | D | D | D, rehber | D | D | B | B | B |
| ST | D, WhatsApp | D, rota | D | İ | D | D | D | D | B | B |
| MT | D | İ | D | D | D, SSS bağlantısı | B | B | B | D | D |
| DAT | D | D, fiyat CTA’sı | B | İ | D, karşılaştırma beyanı | D, bilgi istenir | D | B | D | B |
| DTP | D | D, arama sonrası beyan | D | B | D | D | B | B | D | B |
| DGT | D | D, rota örnekleri | D | D | D | D | D | D | D | B |
| VDT | D | D, tarife | D | D | D | D | D | D | B | B |
| WP | D, tarif edilen | İ | B | İ | B | B | B | B | B | B |
| SUN | D | D, fiyat akışı beyanı | B | İ | D | D | D | D | B | B |

| Rakip | Uçuş gecikmesi | Buluşma | Sayısal bekleme | İptal şartı | Ödeme bilgisi | Şirket/iletişim | Yorum görünümü | Gizlilik belgesi | Rota içeriği | Mobil son adım |
|---|---|---|---|---|---|---|---|---|---|---|
| DT | D | D | B | D, SSS | D | D | B | B | D | İ |
| ATT | D | D | B | D, 24 saat | D, ön ödeme yok | D | D, site beyanı | B | D | İ |
| ST | D | D | B | B | B | D, lisans beyanı/WhatsApp | B | B | D | İ |
| MT | D | D, fotoğraflı | B, üst sınır verilmemiş | D, 8 saat | D | D | B | B | D | İ |
| DAT | B | D | B | D, ayrı belge | D, varışta | D | B | D | D | İ |
| DTP | D, yardım | D | B | D, yardım | D, çelişkili | D | D, site sayfası | B | D | İ |
| DGT | D | D | D, 60 dk beyan | B | D | D, numara doğrulanmadı | D, sayfa bağlantısı | B | D | İ |
| VDT | D | D | D, 1 saat beyan | B, değişiklik gösteriliyor | D, nakit | D | D, sayfa bağlantısı | B | D | İ |
| WP | D | D | B | D, 24 saat/80% beyan | D, ön ödeme | D | D, platform geneli | B | D | İ |
| SUN | D | D | B | D, 48 saat | D, kart ücreti beyanı | D | D, site görünümü | B | D | İ |

Marmaris Transfers’te gecikme için belirtilen ücretsiz bekleme sayısal bir üst sınır vermiyor. Bu hücrede doğrulanan şey **sınır koymadan bekleme beyanı**. Diğer rakiplerde benzer ifadeler karşılaştırılırken iniş saati, planlanan saat ve bagaj için verilen süre ayrı ayrı okunmalı.

## 6. Aylık trafik ve görünürlük

| Alan adı | Araç/dönem | Global ziyaret tahmini | UK ve kanal bilgisi |
|---|---|---:|---|
| suntransfers.com | Semrush, Tem/Eyl 2026, tüm cihazlar | Tem 689.050, Ağu 549.300, Eyl 530.450 | Eyl UK 239.900 ve %45,23. UK tahminindeki mobil pay %86,94. Masaüstü trafik yolculuğu bölümünde doğrudan %49,18 |
| suntransfers.com | Similarweb, Eki 2026 etiketli panel | 350.500 | Masaüstünde UK en üst ülke, doğrudan %45,07. Organik ve ücretli arama ikinci ve üçüncü sırada |
| welcomepickups.com | Similarweb, Eki 2026 etiketli panel | 450.700 | Masaüstü ülke tablosunda ABD, Meksika, UK. UK %9,13 ve doğrudan %34,41. Ücretli ve organik arama ikinci ve üçüncü sırada |
| dalamantravel.com | Kamuya açık Similarweb sayfası ve domain araması | Veri bulunamadı | Veri bulunamadı |
| airportstransferturkey.com | Aynı yöntem | Veri bulunamadı | Veri bulunamadı |
| sootransfer.com | Aynı yöntem | Veri bulunamadı | Veri bulunamadı |
| marmaris-transfers.com | Aynı yöntem | Veri bulunamadı | Veri bulunamadı |
| dalamanairport-transfers.com | Aynı yöntem | Veri bulunamadı | Veri bulunamadı |
| dalamantransport.com | Aynı yöntem | Veri bulunamadı | Veri bulunamadı |
| dalamangotransfer.com | Aynı yöntem | Veri bulunamadı | Veri bulunamadı |
| vipdalamantransfers.com | Aynı yöntem | Veri bulunamadı | Veri bulunamadı |

20 Kasım erişimi. Similarweb sayılarının her biri kendi alan adı kıyas panelinde. Alttaki ülke ve kanal değerleri masaüstüne ait olduğu için global ziyaretle çarparak UK ziyaret sayısı türetilmedi. Similarweb ile Semrush farklı dönemler/model kullanıyor. Semrush’ın Suntransfers için **80.210 organik ve 948 ücretli arama** tahmini ayrı SEO metrikleri. Yetki puanı **42**, tahmini referans alan adı **2.920**, bağlantı **2,02 milyon**. Semrush UK anahtar kelime panelindeki ilk sorguların çoğu marka sorgusu. Rakip doğrudan/referral mutlak sayı, Dalaman alt sayfa trafiği ve 6–12 aylık tam seri bulunamadı. Trafik tahmini oturum benzeri ziyaret metrikleri sunar. Tekil kullanıcı, sayfa görüntüleme, rezervasyon veya gerçek GA4 sayısıyla aynı birim değildir. [Semrush Suntransfers](https://www.semrush.com/website/suntransfers.com/overview/) · [Similarweb Suntransfers](https://www.similarweb.com/website/suntransfers.com/) · [Similarweb Welcome Pickups](https://www.similarweb.com/website/welcomepickups.com/)

**Pazar göstergesi.** CAA Tablo 12.1’deki 22 Dalaman satırının toplamı 2025’te **2.421.918**, 2024’te **2.580.665** yolcu hareketi, yaklaşık **%6,2 düşüş**. 2025 örnekleri Manchester 482.975, Gatwick 445.664 ve Birmingham 237.396. CAA her iki yönün raporlanan trafiğini ölçüyor. Sayılar tekil turistleri, yalnızca varışları, VIP talebini veya Google hacmini temsil etmiyor. [CAA 2025 / 2024, Tablo 12.1](https://www.caa.co.uk/Documents/Download/24007/87fb7670-4e10-4aeb-942d-509238aa25a1/17511)

## 7. UK anahtar kelime araştırması

Bu bölümdeki 54 İngilizce adayın **UK ortalama aylık hacmi, tarihsel seri, organik zorluk, Ads rekabeti ve CPC alanları veri bulunamadı** durumunda. Niyet ve sayfa eşlemesi editoryal değerlendirme. “Taxi” bir bölümde hemen havalimanı taksisi arayanları da çekebilir. “Marmaris airport transfer” rota belirsizliğini DLM vurgusuyla çözmeli. Arama hacmi ay sırası henüz doğrulanmadı. Google Trends endeksi 0–100 göreli ve örneklem temelli, sayı veya CPC göstermez. Google Keyword Planner için hesap erişimi gerekiyor. [Keyword Planner](https://support.google.com/google-ads/answer/3022575?hl=en) · [Trends yöntemi](https://support.google.com/trends/answer/4365533?hl=en)

| Grup | Niyet | Hedef | İngilizce adaylar |
|---|---|---|---|
| Genel | Ticari / işlem | Ana sayfa | `dalaman airport transfers` |
| Genel | Ticari / işlem | Ana sayfa | `dalaman airport transfer` |
| Genel | Ticari / işlem | Ana sayfa | `dalaman airport private transfer` |
| Genel | Ticari / işlem | Ana sayfa | `private transfers dalaman airport` |
| Genel | Ticari / işlem | Ana sayfa | `book dalaman airport transfer` |
| Genel | Ticari / işlem | Ana sayfa | `dalaman airport taxi` |
| Genel | Ticari / işlem | Ana sayfa | `dalaman airport pickup` |
| Genel | Ticari / işlem | Ana sayfa | `dalaman airport return transfer` |
| Genel | Ticari / işlem | Ana sayfa | `dalaman airport hotel transfer` |
| Marmaris ve İçmeler | İşlem | Marmaris / İçmeler rotaları | `dalaman to marmaris transfer` |
| Marmaris ve İçmeler | İşlem | Marmaris / İçmeler rotaları | `dalaman to marmaris taxi` |
| Marmaris ve İçmeler | İşlem | Marmaris / İçmeler rotaları | `marmaris airport transfers` |
| Marmaris ve İçmeler | İşlem | Marmaris / İçmeler rotaları | `marmaris to dalaman airport transfer` |
| Marmaris ve İçmeler | İşlem | Marmaris / İçmeler rotaları | `dalaman airport transfers to icmeler` |
| Marmaris ve İçmeler | İşlem | Marmaris / İçmeler rotaları | `dalaman to icmeler private transfer` |
| Marmaris ve İçmeler | İşlem | Marmaris / İçmeler rotaları | `dalaman airport to marmaris hotel transfer` |
| Marmaris ve İçmeler | İşlem | Marmaris / İçmeler rotaları | `dalaman marmaris return transfer` |
| Marmaris ve İçmeler | İşlem | Marmaris / İçmeler rotaları | `marmaris private airport taxi` |
| Fethiye ve Ölüdeniz | İşlem | Fethiye / Ölüdeniz rotaları | `dalaman to fethiye transfer` |
| Fethiye ve Ölüdeniz | İşlem | Fethiye / Ölüdeniz rotaları | `dalaman to fethiye taxi` |
| Fethiye ve Ölüdeniz | İşlem | Fethiye / Ölüdeniz rotaları | `fethiye airport transfers` |
| Fethiye ve Ölüdeniz | İşlem | Fethiye / Ölüdeniz rotaları | `fethiye to dalaman airport transfer` |
| Fethiye ve Ölüdeniz | İşlem | Fethiye / Ölüdeniz rotaları | `dalaman to oludeniz transfer` |
| Fethiye ve Ölüdeniz | İşlem | Fethiye / Ölüdeniz rotaları | `oludeniz airport transfers` |
| Fethiye ve Ölüdeniz | İşlem | Fethiye / Ölüdeniz rotaları | `dalaman to oludeniz private transfer` |
| Fethiye ve Ölüdeniz | İşlem | Fethiye / Ölüdeniz rotaları | `dalaman to hisaronu transfer` |
| Fethiye ve Ölüdeniz | İşlem | Fethiye / Ölüdeniz rotaları | `dalaman airport to ovacik transfer` |
| Diğer destinasyonlar | İşlem | Mevcut rotalar ve doğrulanmış kapsam | `dalaman to gocek transfer` |
| Diğer destinasyonlar | İşlem | Mevcut rotalar ve doğrulanmış kapsam | `gocek airport transfer` |
| Diğer destinasyonlar | İşlem | Mevcut rotalar ve doğrulanmış kapsam | `dalaman airport to gocek marina transfer` |
| Diğer destinasyonlar | İşlem | Mevcut rotalar ve doğrulanmış kapsam | `dalaman to dalyan transfer` |
| Diğer destinasyonlar | İşlem | Mevcut rotalar ve doğrulanmış kapsam | `dalyan airport transfers` |
| Diğer destinasyonlar | İşlem | Mevcut rotalar ve doğrulanmış kapsam | `dalaman airport transfers to sarigerme` |
| Diğer destinasyonlar | İşlem | Mevcut rotalar ve doğrulanmış kapsam | `dalaman airport to sarigerme taxi` |
| Diğer destinasyonlar | İşlem | Mevcut rotalar ve doğrulanmış kapsam | `dalaman airport to calis beach transfer` |
| Diğer destinasyonlar | İşlem | Mevcut rotalar ve doğrulanmış kapsam | `dalaman airport to kalkan private transfer` |
| VIP / grup / aile | Ticari / işlem | Araçlar + uygun rotalar | `dalaman vip transfer` |
| VIP / grup / aile | Ticari / işlem | Araçlar + uygun rotalar | `dalaman luxury airport transfer` |
| VIP / grup / aile | Ticari / işlem | Araçlar + uygun rotalar | `mercedes vito transfer dalaman airport` |
| VIP / grup / aile | Ticari / işlem | Araçlar + uygun rotalar | `dalaman airport minibus transfer` |
| VIP / grup / aile | Ticari / işlem | Araçlar + uygun rotalar | `dalaman airport transfer for 8 passengers` |
| VIP / grup / aile | Ticari / işlem | Araçlar + uygun rotalar | `dalaman airport transfer with child seat` |
| VIP / grup / aile | Ticari / işlem | Araçlar + uygun rotalar | `family airport transfers dalaman` |
| VIP / grup / aile | Ticari / işlem | Araçlar + uygun rotalar | `private group transfer dalaman airport` |
| VIP / grup / aile | Ticari / işlem | Araçlar + uygun rotalar | `dalaman airport transfer with luggage` |
| Fiyat ve rehber | Ticari / bilgi | Rotalar, fiyat ve SSS | `cheap dalaman transfers` |
| Fiyat ve rehber | Ticari / bilgi | Rotalar, fiyat ve SSS | `dalaman airport transfer prices` |
| Fiyat ve rehber | Ticari / bilgi | Rotalar, fiyat ve SSS | `dalaman to marmaris transfer cost` |
| Fiyat ve rehber | Ticari / bilgi | Rotalar, fiyat ve SSS | `dalaman to fethiye taxi price` |
| Fiyat ve rehber | Ticari / bilgi | Rotalar, fiyat ve SSS | `dalaman airport taxi vs private transfer` |
| Fiyat ve rehber | Ticari / bilgi | Rotalar, fiyat ve SSS | `how to get from dalaman airport to marmaris` |
| Fiyat ve rehber | Ticari / bilgi | Rotalar, fiyat ve SSS | `how to get from dalaman airport to oludeniz` |
| Fiyat ve rehber | Ticari / bilgi | Rotalar, fiyat ve SSS | `where to meet transfer driver at dalaman airport` |
| Fiyat ve rehber | Ticari / bilgi | Rotalar, fiyat ve SSS | `dalaman airport transfer flight delay` |

## 8. DalamanWay site denetimi

| Alan | Canlı gözlem | Render test gözlemi | Kod / açıklık |
|---|---|---|---|
| Ana sayfa | HTTP 200, tek H1, İngilizce statik metin, canonical | HTTP 200, `noindex,nofollow` | EN/DE/RU dil seçimi. Türkçe katalog veya URL bu kapsamda bulunmadı |
| Filo | HTTP 200, index ve self-canonical. Rezervasyonda dört araç ve yolcu/valiz sınırı göründü | HTTP 200, test noindex | VIP Vito, Ultra VIP Vito, Sprinter, Ultra Sprinter. Üç markalı dış görsel yerel. Diğer dış ve bazı iç görseller harici |
| Transfer adımı | 390 px’de yatay taşma yok. Tek yön, dönüş, uçuş numarası, çocuk koltuğu sayacı ve özet mevcut. Marmaris fiyatı görüntülendi | Form açıldı. Aynı Marmaris fiyatı görüntülendi | Araç kapasitesi ve katalog doğrulaması mevcut. Gerçek uçuş takibi garantisi bu kapsamda doğrulanmadı |
| Yolcu ve son adım | Adresler 200/noindex. İlgili akış kişisel veri girilmeden incelendi | Adresler 200/noindex | Yolcu alanlarında ad, telefon, e-posta ve adres. `bookingPassengerInfo` kalıcı `localStorage` kullanıyor. Talep, operatör yanıtı ve onay akışı mevcut |
| Rotalar | Yedi İngilizce rota ve Almanca/Rusça alternatifleri mevcut | Marmaris üç dilde 200/noindex | Rota ve fiyat sayfaları var. Henüz özgün rehberi olmayan katalog satırları için seri sayfa üretimi öncelikli değil |
| İletişim / SSS / hizmetler | 200. İletişimde e-posta ve rezervasyon referansıyla destek talimatı görüldü | Aynı sayfa türleri 200 | FAQ değişiklik ve uçuş gecikmesi konusunda temel metin sağlıyor. Kesin bekleme ve yanıt süresi doğrulanmadı |
| Hakkımızda / şartlar / gizlilik | `/about`, `/terms`, `/privacy` 404. Rezervasyonun gözlenen ekranında ilgili politika bağlantısı bulunmadı. Analytics tercih düğmesi var | Aynı örnek yollar 404 | Özel şartlar/gizlilik rotası router listesinde bulunmadı. Öneri işletmece onaylanmış metin ve görünür bağlantı |
| Yorumlar / rezervasyon yönetimi | `/reviews` 200. `/booking/lookup` 200/noindex | İkisi de 200 | Yorum sayfası ve değişiklik/iptal talep yolu mevcut. E-posta teslimi, doğrulanmış müşteri etiketi ve self-servis otomasyon ayrıca değerlendirilir |
| Analitik | UK GA4 ve Search Console verisi alınamadı | Ölçüm doğrulaması ayrıca gerekli | Rızaya bağlı sayfa ve rezervasyon olayları kodda zaten mevcut. Yeni olay eklemeden önce mevcut olay zinciri doğrulanmalı |

**Kanıt bağlantıları:** [Canlı](https://dalamanway.com/) · [Canlı booking](https://dalamanway.com/booking) · [Test booking](https://vip-transfer-dalaman-test.onrender.com/booking) · [Fiyat API’si](https://dalamanway-api-prod.onrender.com/route-prices) · [Sabitlenmiş yolcu kaynak kodu](https://github.com/Alisnmez/vip-transfer-dalaman/blob/f06ac1c10cdb54a1e44a8e60535607bc72fad2d0/frontend/src/pages/public/BookingPassengerPage.tsx) · [Router](https://github.com/Alisnmez/vip-transfer-dalaman/blob/f06ac1c10cdb54a1e44a8e60535607bc72fad2d0/frontend/src/app/router.tsx) · [Analitik kodu](https://github.com/Alisnmez/vip-transfer-dalaman/blob/f06ac1c10cdb54a1e44a8e60535607bc72fad2d0/frontend/src/features/analytics/analytics.ts)

## 9. Teknik SEO karşılaştırması

- **Canlı:** [Sitemap](https://dalamanway.com/sitemap.xml) içindeki 28/28 benzersiz URL HTTP 200, self-canonical, meta açıklama ve tek ilk-HTML H1 döndürdü. 21 rota dil URL’sinin her birinde `en`, `de`, `ru`, `x-default` alternatifleri karşılıklı eşleşti. Ana sayfada bir JSON-LD bloğu görüldü. Örnek Marmaris rota sayfalarında JSON-LD bloğu yoktu. Bu bulgu tek başına eksiklik veya zengin sonuç önerisi yaratmaz. [Canlı robots](https://dalamanway.com/robots.txt) admin taramasını engelliyor. Dört rezervasyon yolu sitemap dışında ve noindex.
- **Test:** [Robots](https://vip-transfer-dalaman-test.onrender.com/robots.txt) tüm taramayı engelliyor. [Sitemap](https://vip-transfer-dalaman-test.onrender.com/sitemap.xml) boş. Örnek sayfalar noindex ve production canonical taşımıyor. [Google çok dilli sayfalar](https://developers.google.com/search/docs/specialty/international/localized-versions)
- **Rakip ilk HTML örneği:** DT rota merkezi EN/TR/RU ve dört JSON-LD bloğu, ATT rehberi sekiz dil ve üç blok, ST örnek rotası sekiz dil ve iki blok, SUN Dalaman sayfası çok sayıda dil alternatifi ve iki blok, DGT EN sayfası dört dil ve bir blok. WP örnek rezervasyon sayfası EN/FR ve üç blok. DTP yardım sayfasında meta açıklama bulunmadı. VDT fiyat sayfasında birden çok H1 görüldü. MT ana sayfası ilk HTML’de H1 içermiyordu. DAT örnek ana sayfasında noindex görüldü. HTML gözlemleri §4 URL’lerine aittir. Bunlar indeks veya sıralama verisi değildir.
- **İndeks:** Search Console’da güncel URL denetimi, UK gösterimleri ve tıklamalar bu çalışma sırasında alınamadı. Teknik olarak indekslenebilir olmak, Google indeksine kabul edilme veya ilk sayfa anlamına gelmez. [Search Console performans raporu](https://support.google.com/webmasters/answer/7576553?hl=en)
- **Performans:** Canlı ana sayfa için mobil PageSpeed API isteği HTTP 429 `RESOURCE_EXHAUSTED` döndürdü. Başarılı laboratuvar LCP/CLS ölçümü veya CrUX saha LCP/CLS/INP verisi alınmadı. Mobil taşma kontrolü hız ölçümü değildir. Bir sonraki karşılaştırmada ana sayfa, Marmaris ve booking için aynı ağ/cihazla ayrı ayrı üç laboratuvar koşusu. Uygun veri varsa CrUX ile 75. yüzdelik LCP/INP/CLS ayrı. [PageSpeed Insights veri türleri](https://developers.google.com/speed/docs/insights/v5/about)
- **Kopya ve iç link:** Yedi mevcut rota üzerinde önce farklılaştırılmış yerel bilgi ve iç bağlantı derinliği artırılabilir. Fiyat kataloğundaki her otel için benzer metinli sayfa açmak ertelenmeli. Özgün rota/ulaşım kararlarına ve ilgili rezervasyon bağlantılarına öncelik verilmeli. [Google spam ve doorway politikası](https://developers.google.com/search/docs/essentials/spam-policies)
- **Yerel SEO:** Google Business Profile’ın varlığı ve hak sahipliği doğrulanmadı. Gerçek işletme türü ve Türkiye’deki hizmet alanı uygunluğunu kontrol et. UK hedeflemesi için UK’de karşılanabilir işletme adresi iddiası kullanılmamalı. [Google Business Profile kuralları](https://support.google.com/business/answer/3038177?hl=en)

## 10. UX ve rezervasyon dönüşümü

1. **Trafiği yolcu formuna girme oranıyla izle.** Mobil rezervasyon ekranında önce rota/tarih, ardından dört araç, kapasite sayaçları ve en altta özet geliyor. Rota seçildiğinde “Estimated Total” görünür, ancak kapsamı ve işletme onayının ne zaman gerektiği aynı noktada daha açık hale getirilebilir. Mobilde kısa fiyat/ilerleme özeti ve aşağıya atlama bağlantısı küçük örneklemle test edilir.
2. **Güveni iki kritik noktada göster.** Rota sayfasında fiyatın yanında araç başı toplam, ödeme zamanı ve karşılama. Gönderimden hemen önce onaylı iptal koşulu, gizlilik bildirimi ve talep/onay farkı. Ana sayfanın üstünü rozet yığınına çevirmeye gerek yok.
3. **Mevcut akışı küçültmeden doğrula.** Zaten tarih, dönüş, uçuş, araç, yolcu, bagaj, çocuk koltuğu, özel istek ve rezervasyon özeti var. Bunlar yeniden geliştirme listesine girmemeli. Ayrı iş, kritik etiketlerin ve fiyatın aynı anlamı taşıması ve mobil ekranda erişilebilir kalması.
4. **Kişisel veri riski P0.** Paylaşılan cihazda önceki yolcunun verisi kalabilir. Üretim üzerinde kişisel veriyle yeniden üretim yapılmadı. Kod kanıtına dayanarak oturum kapsamı, eski anahtar temizliği, geri/yenileme ve başarısız gönderim senaryoları test listesine girer.
5. **Dönüşümün ticari karşılığı.** Rezervasyon talebi, operatör onayı ve tamamlanan transfer ayrı sayılmalı. Organik analiz için Search Console tıklamaları, davranış için rızalı site olayları, ticari ölçüm için kişisel veri içermeyen toplu operasyon sayıları.

## 11. Fiyat ve güven karşılaştırması

**Karşılaştırma şablonu:** Dalaman Havalimanı → Marmaris merkez otel, dört yolcu, dört büyük valiz, özel minivan, biri tek yön biri aynı gidiş ve dönüş. Tam tarihli teklif aşamasında örnek 10 Haziran 2027, 15.00 yerel ve dönüş 17 Haziran, 10.00. Aşağıdaki fiyatlar katalog/halka açık rotadan. Verilen tarihte kapasite ve nihai rezervasyon teklifi doğrulanmadı.

| Marka ve araç | Tek yön | Dönüş | Kapsam |
|---|---:|---:|---|
| DalamanWay VIP Vito, Marmaris | £47,50 | £95 | 5 yolcu / 5 bagaj. Canlı ve test formunda görüldü. Son işletme koşulları ayrıca doğrulanmalı |
| VIP Dalaman Transfers Private VIP Minivan | £50 | £100 | 5 yolcu / 6 bagaj tablosu. Sedan £45 satırı farklı kapasite |
| Dalaman Travel Vito | £65 | Veri bulunamadı | Rota sayfası 1–4 yolcu, kişi başına bir büyük ve bir el bagajı beyanı |
| Airports Transfer Turkey Mercedes Vito | €96’dan | Veri bulunamadı | Marmaris rehberindeki başlangıç fiyatı, 6 yolcuya kadar. Farklı rehberde başka başlangıç fiyatı görülüyor |
| Dalaman Go Transfer | €67 örnek rota | Veri bulunamadı | Araç sınıfına göre kesin dört yolcu/dört valiz teklifi doğrulanmadı |
| Marmaris Transfers, DAT, SooTransfer, DTP, SUN ve WP | Eşdeğer teklif doğrulanmadı | Eşdeğer teklif doğrulanmadı | Örnek farklı para birimi, farklı rota, dinamik arama veya eksik araç eşlemesi |

Kaynaklar §4, §8 ve [VDT fiyat tablosu](https://www.vipdalamantransfers.com/pricelist/). Aynı katalog segmentinde DalamanWay’in £47,50 fiyatı VDT’nin £50 fiyatından £2,50 düşük. Bu fiyat farkı, yolculuk koşulları veya kâr farkı hakkında veri vermez. EUR ve TRY rakamları tarihli nihai GBP teklifi olmadan çarpıştırılmadı.

## 12. Eksikler ve fırsatlar

Öncelik ve süreler uzman tahmini. Efor kişi-gün ve işletme karar süresini kapsamıyor. **D** bir fark doğrudan gözlendi, **K** kod / dış doğrulama gerekiyor, **H** fırsat hipotezi. Kaynak kimlikleri §4’teki bağlantılara karşılık gelir. DW kanıtları §8–11’de. Fiyat, ödeme ve vaatlerde işletme kararı şart.

| ID / öncelik | İyileştirme ve mevcut kanıt | Müşteri / işletme faydası | Efor / bağımlılık | Başarı ölçüsü ve kabul |
|---|---|---|---|---|
| 01 P0 | Yolcu taslağı ve eski anahtar temizliği · DW kod, K | Ortak cihazda mahremiyet / veri riskini azaltma | 1–2, saklama kararı | 0 kalıcı yolcu PII. Geri, yenileme, sekme, hata ve başarı testi |
| 02 P0 | Görünür, onaylı gizlilik metni · DAT/DW 404, D | Veri kullanımını anlama / destek ve uyum | 1–2, işletme ve metin onayı | Formdan ve alt menüden 200. Üç dilde içerik ve klavye kontrolü |
| 03 P0 | İptal/değişim metni ve bağlantısı · DAT/DT/SUN, D | Beklentiyi anlama / anlaşmazlık azaltma | 1, işletme kuralı | Aynı süre ve koşul, rota/form/e-posta metinlerinde |
| 04 P0 | Tarife ve ücret kapsamı onayı · DT/VDT/DW, D | Sürpriz ücret azalır / fiyat hatası önlenir | 1–2, operasyon hesabı | Örnek rotalarda form, API ve onay e-postası aynı GBP tutarı |
| 05 P0 | E-posta teslimini staging’de kanıtla · VDT/DW kod, K | Talebi izleme / kayıp müşteri azaltma | 1–2, test alıcıları | Alındı ve onay e-postası ayrı. Tek gönderim ve başarısızlık kaydı doğrulanır |
| 06 P0 | Filo medyası izin, kaynak ve süreklilik · ST/DW, K | Araç güveni / kırık görsel azalır | 1–2, kaynak araçlar | Her kullanılan görsel için izin kaydı, Chrome ve mobil başarılı yükleme |
| 07 P1 | GBP araç başı ve dahil olanlar satırı · DT/VDT, D | Fiyatı anlamlandırır / fiyat sorusu azalır | 0,5–1, 04 | 390 px’de fiyatla beraber görülebilir. Ölçüm fiyat→sonraki adım |
| 08 P1 | Talep alındı ve kesin onay metni · WP/VDT/DW, K | Seyahat durumunu anlar / yanlış beklenti azalır | 0,5–1, 05 ve operasyon | Form ve test e-postasında doğru durum, tarih ve referans eşleşir |
| 09 P1 | Fotoğraflı terminal buluşma rehberi · MT, D | Havalimanında yön bulma / daha az arama | 1–2, kendi terminal fotoğrafları | Doğru terminal, ad tabelası ve ulaşılabilir kanal. Destek talepleri izlenir |
| 10 P1 | Uçuş gecikmesi ve bekleme süresi · DGT/DT, D | Belirsizlik azalır / gecikme yönetimi | 0,5–1, gerçek prosedür | Onaylı süre, başlangıç ve ek ücret kuralı. Erken/geç uçuş senaryosu |
| 11 P1 | Ödeme zamanı ve para birimi açıklığı · VDT/DT, D | Yanında doğru ödeme yöntemi / tahsilat | 0,5, işletme onayı | Nakit/kart ve GBP politikası her temas noktasında tutarlı |
| 12 P1 | Şirket ve yerel destek kimliği · DAT/DTP, D | Kime ulaşıldığı belli / güven artışı | 1, doğrulanmış işletme verisi | Gerçek kanala mobilde tek tık ve iş saatleri |
| 13 P1 | Mobilde kısa toplam ve sonraki adım · SUN/DGT/DW, H | Aşağı kaydırma azalır / adım geçişi artabilir | 1–2, yön/taşma kontrolü | 320/390/768 px, klavye ve çakışmayan düğmeler. Adım oranı izlenir |
| 14 P1 | Araç başına açıklamalı bagaj örneği · ST/DT, D | Araç uyumu / son dakika araç değişimi azalır | 0,5–1, doğrulanmış fiziksel ölçü | Araç ve form aynı kapasite. Fazla bagajda net yönlendirme |
| 15 P1 | Çocuk koltuğu tiplerinin açıklaması · DGT/SUN, D | Aile hazırlığı / operasyona net talep | 1–2, stok/ücret kararı | Koltuk tipi, sayı, onay ve gerekiyorsa ücret açık |
| 16 P1 | Doğrulanabilir yorum kaynağı ve izinli galeri · SUN/WP/DW, K | Güven / kaliteli sosyal kanıt | 1, kaynak ve izin | Kaynak bağlantısı. Uydurma puan veya yorum eklenmez |
| 17 P1 | Onay sayfası ve e-postada kısa transfer özeti · VDT/WP, K | Uçuş ve araç hatası erken fark edilir / daha az düzeltme | 1–2, 05 | Rezervasyon referansı, tarih, fiyat ve destek aynı |
| 18 P1 | Rota başında fiyat + booking CTA · DT/ATT, D | Rota kararı kolay / daha çok CTA | 1, dinamik fiyat bağlantısı | Marmaris/Fethiye/Ölüdeniz CTA doğru rotayı seçer |
| 19 P1 | Mevcut rızalı huniyi doğrulama · DW kod, K | Daha az sürtünme / doğru yatırım kararı | 1–2, GA4 erişimi | İzin yokken olay yok. Gönderim bir kez ve PII olmadan ölçülür |
| 20 P1 | GSC UK başlangıç kayıtları · DW, K | İlgili sayfa / görünürlük takibi | 0,5, dışa aktarım | UK sayfa+sorgu trendi ve indeks durumunun tarihli kaydı |
| 21 P2 | Marmaris/Fethiye/Ölüdeniz karar rehberi · ATT/ST, D | Otobüs, taksi, özel kıyasına cevap / organik giriş | 2–4, güncel yerel bilgi | Üç özgün sayfa, güncelleme tarihi ve doğru iç linkler |
| 22 P2 | İçmeler, Dalyan, Göcek, Sarıgerme yerel içerik · DT/ATT, D | Buluşma/rota bilgisi / long-tail | 2–4, GSC verisi | Her sayfada kendine özgü bilgiler, şablon kopyası az |
| 23 P2 | Rezervasyona otel/marina önerisi · DGT/DAT, D | Daha az adres hatası / dispatch verimi | 2–4, veri/harita maliyeti | Manuel adres alternatifi ve yanlış eşleşme testi |
| 24 P2 | Ek durak veya büyük bagaj teklif yolu · MT/SUN, D | Özel ihtiyaç çözülür / nitelikli talep | 1–2, fiyat ve hizmet alanı | Sabit fiyat gibi gösterilmeden talep oluşur, testte operasyona ulaşır |
| 25 P2 | Dönüş ayağını ayrı operasyon listesinde ele alma · DW kod, H | Dönüş unutulmaz / takip kolay | 2–3, veri modeli ve kapsam | Gidiş/dönüş aynı referansla doğru gün ve sırada, çift sayım yok |
| 26 P2 | Mobil performans başlangıç ölçümü · PSI 429, K | Daha hızlı gezinme / kaybın ölçümü | 1–2, cihaz ve saha veri erişimi | Üç URL için tekrar ölçüm, laboratuvar ve saha ayrı |
| 27 P2 | Google Business Profile uygunluğu · Google/DW, K | Yerel doğrulama / ilgili görünürlük | 0,5–1, işletme yetkisi | Yetkili gerçek hizmet alanı, tutarlı bilgi. Uygunluk teyidi |
| 28 P2 | Küçük UK arama reklamı pilotu · §7, H | Doğru sorgudan doğru rota / edinme maliyeti | 1–2 + onaylı bütçe, 19/20 | Ölçülmüş onaylı rezervasyon maliyeti ve durdurma eşiği |
| 29 P3 | Otel/villa iş ortaklığı pilotu · DGT/WP, D | Kolay rezervasyon / kaynak çeşitliliği | 3–5, ticari anlaşma | Birkaç doğrulanmış partner ve atfedilebilir tamamlanan transferler |
| 30 P3 | Sürücü/karşılama bildirim otomasyonu · DGT/WP, D | Buluşma güveni / daha az manuel mesaj | 3–5, izin ve dispatch süreci | Testte yanlış alıcıya görünüm yok, teslim durumu ve yedek kanal |

## 13. Öncelikli geliştirme listesi

İlk on işin sırası, **güvenilirlik riski + rezervasyona yakınlık + düşük efor** üzerinden. Tahmini dönüşüm artışı yüzdesi verilmedi.

| Sıra | İş | Kabul göstergesi |
|---:|---|---|
| 1 | 01 Yolcu taslağı | Kalıcı yolcu verisi yok, akış ve eski kayıt temizliği testli |
| 2 | 04 ve 07 Fiyat kapsamı | Üç pilot rotada site, form ve toplam GBP eşleşir. Kapsam fiyatın yanında |
| 3 | 03 ve 11 İptal ve ödeme özeti | Doğrulanmış koşul formda ve destek içeriğinde aynı |
| 4 | 05 ve 08 Talep/onay iletişimi | Durumlar doğru ve staging e-posta teslimi geçer |
| 5 | 02 Gizlilik bildirimi | Rezervasyon ekranından üç dilde erişilebilir |
| 6 | 09 ve 10 Karşılama ve gecikme | Gerçek fotoğraf, işlem adımları ve onaylı süre |
| 7 | 12 İşletme kimliği | Gerçek iletişim kanalı ve sorumlu işletme belli |
| 8 | 13 Mobil fiyat ve devam | 390 px’de taşma yok, fiyat daha erken görülebilir |
| 9 | 18 Rota CTA ve fiyat | Üç rotada rezervasyon hedefi doğru |
| 10 | 19 ve 20 Ölçüm | UK başlangıç ölçümü ve rızalı, PII’siz huni |

## 14. 30 / 60 / 90 günlük plan

| Zaman | Çalışma | Ölçülebilir çıkış |
|---|---|---|
| İlk 7–14 gün | P0 taslak, izin/koşul ve e-posta doğrulaması. Örnek GBP fiyat ve operasyon şartları onayı | 0 kalıcı yolcu PII. Testte iki e-posta durumu. Fiyat, iptal ve ödeme metni aynı |
| 15–30. gün | Fiyat kapsamı, geliş/karşılama, mobil CTA ve işletme bilgisi. UK Search Console başlangıç ölçümü | Üç pilot rota ve mobil akış doğrulandı. UK 28 günlük temel metrikler kayıtlı |
| 31–60. gün | Birinci pilot rotalara özgün ulaşım seçenekleri ve yerel SSS. Mobil hız tekrar ölçümü. Yerel görünürlük uygunluk kontrolü | Üç sayfa iç linkli ve indeks denetimi tamam. Hızın ölçüm kaynağı belli |
| 61–90. gün | İkinci rota grubunu UK sorgularına göre seç. Ölçüm geçerse onaylı küçük Ads pilotu ve bir partner denemesi | UK sorgu/sayfa performans karşılaştırması. Talep, onay ve maliyet ayrı. Düşük katkılı pilot durur |
| Sonra | Otomasyon, daha gelişmiş ödeme/partner sistemi ve analitik | Destek yükü, tekrar rezervasyon ve katkı kârı ölçülebiliyorsa iş gerekçesi oluşturulur |

Her uygulama ayrı dal/PR → CI → Render test → kullanıcı incelemesi ve açık onay → canlı. Bu işlem rapor güncellemesi.

## 15. Pazarlama ve müşteri edinimi

- **Konumlandırma:** İngilizce konuşan müşteriye, Dalaman’dan iyi açıklanmış özel transfer. GBP araç başı fiyat, gerçek kapasite ve net yerel karşılama. Ucuzluk, her müşteri için tek başına karar nedeni varsayılmamalı. Standart VIP ile Ultra kategorinin farkı satın almadan önce açıklanmalı.
- **Organik:** Önce Marmaris, Fethiye ve Ölüdeniz. Aynı sorgu kümesini sahiplenen iki sayfa açmak yerine mevcut rota sayfasına özgün bilgi ve CTA ekle. Taksi/otobüs rehberleri yüksek satın alma niyetli rota sayfalarına bağlantı versin.
- **Ads adayları:** `[dalaman to marmaris transfer]`, `[dalaman to fethiye transfer]`, `[dalaman to oludeniz transfer]`; doğrulanmış veriye göre özel transfer ve VIP varyantı. Rota başına eşleşen sayfa. Sadece taksi durağı veya iş ilanı gibi hizmet dışı niyetleri arama terimleri raporundan izle. Kampanya ve harcama kullanıcı onayıyla değerlendirilir.
- **Ekonomi:** Adedi bilinmeyen dönüşüm oranına göre bütçe çıkarma. Örnek senaryo, **varsayım** olarak £0,80 tıklama, %4 talep ve taleplerin %50’si onaylıysa, onaylı rezervasyon edinme maliyeti £40. Bu bir pazar CPC’si veya öngörü değildir. Eşik, komisyon/indirim/iade ve araç maliyetlerinden sonraki transfer katkı kârına göre belirlenmeli. Mobil/masaüstü ve UK ülke düzeyini ayır.
- **Toplanacak:** Search Console UK 28/90 gün, erişilebilir UK Keyword Planner tarihsel CSV, gerçek teyit/iptal/toplam sayıları ve rotaya göre katkı maliyeti. Rakip site geneli trafik bu girdilerin yerine geçmez.

## 16. Riskler, varsayımlar ve doğrulanmamış iddialar

- Gerçek coğrafi UK Google SERP, reklam ve harita verisi eksik.
- Keyword Planner erişimi, UK hacim/CPC, organik zorluk ve arama mevsimselliği eksik. Google Trends ziyaret sayısı değildir.
- Sekiz yerel/bölgesel rakipte kamuya açık trafik sayısı bulunamadı. İki platform tahmini Dalaman ya da VIP alt pazar büyüklüğünü açıklamaz.
- Rakip nihai teklif, ödeme ve satış sonrası akış yok. Açık sayfadaki iade, lisans, ücretsiz ekipman veya gecikme vaatleri işletme bazında ayrıca doğrulanmalı.
- PSI kota engeli, mobil laboratuvar ve CrUX verisi eksik. Rakip mobil etkileşimlerinin tamamı test edilmedi.
- DalamanWay’in dönemsel dönüşüm, ticari marj ve e-posta teslim sonuçları bu denetimde bağımsız olarak ölçülmedi.
- CAA yıllık yolcu hareketleri UK ulaşım göstergesidir. Tekil turist veya transfer müşterisi olarak okunmaz.

## 17. Kaynak ve kanıt dizini

Tüm yeni kaynaklar **20 Kasım 2026** tarihinde incelendi. Alan adı profillerinin birincil bağlantıları §4, trafik araçları §6, HTTP ve kod adresleri §8–9’dadır. Önceki iç araştırmalar [yayın sonrası plan](CANLI_YAYIN_SONRASI_GELISTIRMELER.md), [eksik ve yayın kapıları](EKSIKLERIMIZ.md) ve [dört pazar SEO eki](SEO_FOUR_MARKETS_RESEARCH_2026-11-19.md) ile izlenir.

Ek yöntem kaynakları: [Google Ads Keyword Planner](https://support.google.com/google-ads/answer/3022575?hl=en) · [Google Trends](https://support.google.com/trends/answer/4365533?hl=en) · [Google Search Console](https://support.google.com/webmasters/answer/7576553?hl=en) · [Google uluslararası SEO](https://developers.google.com/search/docs/specialty/international/localized-versions) · [Google PSI](https://developers.google.com/speed/docs/insights/v5/about) · [Google işletme profili](https://support.google.com/business/answer/3038177?hl=en) · [CAA ulaşım](https://www.caa.co.uk/Documents/Download/24007/87fb7670-4e10-4aeb-942d-509238aa25a1/17511).

## 18. Nihai öneri

1. **Rakipler nerede daha iyi?** DT fiyat kapsamını rota sayfasında anlatıyor, MT gerçek buluşma sorusuna fotoğraflarla cevap veriyor, ATT ulaşım seçeneklerini karşılaştırıyor, büyük platformlar onay ve iptal akışını daha erken açıklıyor. Filo, GBP katalog ve teknik rota yerelleştirmesi DalamanWay’de zaten var.
2. **İlk on iş hangileri?** §13’teki sıra. İlk teslimatta saklama güvenliği, onaylı GBP fiyat kapsamı, rezervasyon koşulları ve test e-posta senaryosu öne çıkıyor. Sonra güven ve mobil dönüşüm.
3. **90 gün sırası ne?** Güven ve doğru teklif → mobil rezervasyon ölçümü → üç özgün rota → Search Console ve maliyet verisiyle kontrollü edinim. Daha fazla destinasyon, ödeme sağlayıcısı ve otomasyon ancak mevcut akıştan gelen veri ihtiyacı gösterirse.
