# Source coverage and owner-authorized tariffs — 2026-11-18

Sources: https://www.vipdalamantransfers.com/pricelist/ and https://www.vipdalamantransfers.com/booknow/ (public embedded form 91186079194971). Retrieved 2026-11-18.

The fixed source table has 25 destination names and 9 vehicle categories. Its booking selector has 55 resort names plus 4 airports. Blank form prices are not evidence of free journeys or a competitor quotation.

## Result

All 55 source resort names are covered (canonical spelling aliases retained). Four legacy names remain valid: Bozburun / Sogut, Angels Marmaris Hotel, Kabak, Faralya. Total: **59 destination names × 9 vehicles = 531 fares**. Only Dalaman-origin and reverse journeys are supported.

- Original 225 fares are unchanged: source one-way minus GBP2.50 and return minus GBP5.00. Historical booking amounts and admin database overrides are not altered.
- Bozburun and Sogut inherit the explicit combined source zone (18 entries).
- Marmaris Cruise Port taxi: verified source GBP45/90; our GBP42.50/85. Eight other vehicles use our existing Marmaris tariff as a same-zone estimate, not a competitor quotation.
- The remaining 31 names × 9 vehicles (279 entries) use the distance method below, authorized by the owner in conversation. These are our calculated tariffs, not verified supplier offers.

## Calculation and limits

`distance-inputs-2026-11-18.json` records approximate published road distances, URLs, retrieval date and proxy flag. Fifteen existing general routes calibrate each vehicle. Faralya and Kabak are excluded because their mountain/access premium is unrepresentative; their existing fares are preserved.

Sort reference routes by km and form a nondecreasing fare envelope. Interpolate between adjacent points. Beyond Datça at 164 km, extrapolate proportionally using its existing fare per km. Round new one-way amounts upward to GBP2.50; return is twice one-way. Do not subtract the discount again: reference fares already include it.

This is a distance-based tariff, not a navigation calculation or proof of profitability. Journey time, difficult access, empty returns, driver hours, tolls and supplier costs have not been independently validated. Long routes extrapolate beyond known tariff coverage. Kaynar uses a Torba-area 198.48 km proxy; exact hotel distance is unverified. Providers use different endpoints/routes. Admin route-price overrides take precedence and remain editable.

Leave-one-out errors measure distance-only consistency on interior reference routes before rounding; they do not validate unknown long-route fares:

| Vehicle | Mean absolute error GBP | Max error GBP |
|---|---:|---:|
| taxi | 4.27 | 10.83 |
| vip-minivan | 4.53 | 10.83 |
| premium-vip-minivan | 5.24 | 13.64 |
| maybach | 12.02 | 25.00 |
| maybach-plus | 17.17 | 35.00 |
| minibus | 15.04 | 43.00 |
| vip-minibus | 11.53 | 34.00 |
| vip-minibus-long | 24.23 | 50.00 |
| minibus-long | 13.39 | 38.26 |

## Calculated resort tariffs

GBP per vehicle. All nine vehicles and provenance are recorded in `generated-fare-audit-2026-11-18.json`.

| Destination | Approx. road km | Taxi one-way | VIP minivan one-way | VIP minivan return |
|---|---:|---:|---:|---:|
| Turunc Kumlubuk | 121 | 70.00 | 75.00 | 150.00 |
| Orhaniye | 121 | 70.00 | 75.00 | 150.00 |
| Marmaris Hisaronu | 114 | 60.00 | 65.00 | 130.00 |
| Antalya City Center | 235.77 | 147.50 | 155.00 | 310.00 |
| Lara | 254 | 160.00 | 167.50 | 335.00 |
| Belek | 276 | 172.50 | 182.50 | 365.00 |
| Side | 305.4 | 192.50 | 202.50 | 405.00 |
| Kemer | 285 | 180.00 | 187.50 | 375.00 |
| Kundu | 271 | 170.00 | 180.00 | 360.00 |
| Manavgat | 315 | 197.50 | 207.50 | 415.00 |
| Muratpasa | 232 | 145.00 | 152.50 | 305.00 |
| Alanya | 380 | 237.50 | 250.00 | 500.00 |
| Avsallar | 342.3 | 215.00 | 225.00 | 450.00 |
| Konyaalti | 263 | 165.00 | 172.50 | 345.00 |
| Mahmutlar | 386 | 242.50 | 255.00 | 510.00 |
| Akyarlar | 239 | 150.00 | 157.50 | 315.00 |
| Bitez | 211 | 132.50 | 140.00 | 280.00 |
| Gulluk | 177 | 112.50 | 117.50 | 235.00 |
| Gumbet | 206 | 130.00 | 137.50 | 275.00 |
| Gundogan | 217 | 137.50 | 142.50 | 285.00 |
| Güvercinlik | 190 | 120.00 | 125.00 | 250.00 |
| Kaynar | 198.48 | 125.00 | 132.50 | 265.00 |
| Konacik | 207 | 130.00 | 137.50 | 275.00 |
| Torba | 201 | 127.50 | 132.50 | 265.00 |
| Turgutreis | 215 | 135.00 | 142.50 | 285.00 |
| Turkbuku | 213 | 135.00 | 140.00 | 280.00 |
| Yalikavak | 222 | 140.00 | 147.50 | 295.00 |
| Yaliciftlik | 204 | 127.50 | 135.00 | 270.00 |
| Oren | 205 | 130.00 | 135.00 | 270.00 |
| Kusadasi | 252 | 157.50 | 167.50 | 335.00 |
| Didim | 228 | 142.50 | 150.00 | 300.00 |

## Reproduce

Run `python3 scripts/pricing/extend-catalogue.py` from the repository. Uses the frozen original catalogue and distance inputs; no network, database, or secrets. Writes backend/frontend catalogues and audit only. Re-running reproduces the same files.

## All source destinations
- Marmaris (Any Hotel)
- Icmeler (Any Hotel)
- Turunc (Any Hotel)
- Oludeniz (Any Hotel)
- Fethiye City Center (Any Hotel/Port)
- Fethiye Liberty Fabay, Liberty Signa
- Fethiye Sensatori Barut, XO Cape Arnna
- Fethiye Kayakoy
- Dalyan
- Gocek
- Sarigerme (Any Hotel)
- Marmaris Netsel Marina
- Marmaris Cruise Port
- Marmaris Albatros Marina
- Marmaris Adakoy / Cook's Club
- Marmaris Yatch Marina
- D Maris Bay
- Kalkan
- Kas
- Akyaka
- Turunc Kumlubuk
- Datca
- Bozburun
- Orhaniye
- Selimiye
- Sogut
- Marmaris Hisaronu
- Antalya City Center
- Lara
- Belek
- Side
- Kemer
- Kundu
- Manavgat
- Muratpasa
- Alanya
- Avsallar
- Konyaalti
- Mahmutlar
- Akyarlar
- Bitez
- Gulluk
- Gumbet
- Gundogan
- Güvercinlik
- Kaynar
- Konacik
- Torba
- Turgutreis
- Turkbuku
- Yalikavak
- Yaliciftlik
- Oren
- Kusadasi
- Didim


## Other airport options

Bodrum (BJV), Izmir (ADB), Antalya (AYT) need separate origin support and tariffs; not imported as resort aliases.
