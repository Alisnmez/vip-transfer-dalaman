import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { bookingVehicles } from '../../features/booking/bookingVehicles'
import { useLanguage } from '../../shared/localization/language'
import { routeLanguagePath } from '../../shared/localization/route-locales'
import { PublicNavbar } from './PublicNavbar'
import { useTransferPrices } from '../../features/booking/useTransferPrices'

const featuredDestinations = [
  { name: 'Marmaris', slug: 'marmaris', minutes: '90–115' },
  { name: 'Fethiye', slug: 'fethiye', minutes: '50' },
  { name: 'Oludeniz', slug: 'oludeniz', minutes: '65–75' },
  { name: 'Gocek', slug: 'gocek', minutes: '30' },
  { name: 'Icmeler', slug: 'icmeler', minutes: '95–115' },
  { name: 'Dalyan', slug: 'dalyan', minutes: '35–45' },
  { name: 'Sarigerme', slug: 'sarigerme', minutes: '20–30' },
]
function priceLabel(price: number) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2 }).format(price)
}

const routesCopy = {
  en: {
    loading: "Updating route prices",
    loadError: "Unable to load current prices. Please refresh and try again.",
    refresh: "Refresh prices",
    eyebrow: "PRIVATE AIRPORT TRANSFERS",
    title: "Your journey from Dalaman starts here.",
    intro: "Explore private transfers between Dalaman Airport and the Turkish Riviera. Compare transparent, per-vehicle prices and plan your arrival or return journey.",
    book: "Book your transfer",
    explore: "Explore routes",
    coast: "EXPLORE THE COAST",
    popular: "Popular destinations",
    starting: "Starting one-way prices per vehicle. Night transfers, parking and road tolls included.",
    private: "Private transfer",
    airport: "Dalaman Airport",
    drive: "Approx. drive",
    from: "From",
    compare: "Compare prices for",
    plan: "PLAN YOUR TRANSFER",
    find: "Find your route & price",
    findDetails: "Choose a vehicle and journey type to compare prices from the same list used by our booking form.",
    destination: "Destination",
    search: "Search destinations",
    vehicle: "Vehicle",
    journey: "Journey type",
    oneWay: "One way",
    roundTrip: "Round trip",
    found: "destinations found · Prices in GBP, per vehicle",
    bookNow: "Book now",
    empty: "No matching destinations. Try a different search.",
    comfort: "TRAVEL IN COMFORT",
    ready: "Ready for a smooth arrival?",
    readyDetails: "Select your travel details and find the right private transfer for your journey.",
    start: "Start your booking",
  },
  de: {
    loading: "Streckenpreise werden aktualisiert",
    loadError: "Die aktuellen Preise konnten nicht geladen werden. Bitte versuchen Sie es erneut.",
    refresh: "Preise aktualisieren",
    eyebrow: "PRIVATE FLUGHAFENTRANSFERS",
    title: "Ihre Reise ab Dalaman beginnt hier.",
    intro: "Entdecken Sie private Transfers zwischen dem Flughafen Dalaman und der Türkischen Riviera. Vergleichen Sie Preise pro Fahrzeug und planen Sie Ihre An- oder Rückreise.",
    book: "Transfer buchen",
    explore: "Strecken entdecken",
    coast: "DIE KÜSTE ENTDECKEN",
    popular: "Beliebte Ziele",
    starting: "Einfache Fahrt zum Einstiegspreis pro Fahrzeug. Nachttransfers, Park- und Mautgebühren inklusive.",
    private: "Privater Transfer",
    airport: "Flughafen Dalaman",
    drive: "Fahrzeit ca.",
    from: "Ab",
    compare: "Preise vergleichen für",
    plan: "TRANSFER PLANEN",
    find: "Strecke und Preis finden",
    findDetails: "Wählen Sie Fahrzeug und Fahrtart aus, um die Preise aus dem Buchungsformular zu vergleichen.",
    destination: "Ziel",
    search: "Ziele suchen",
    vehicle: "Fahrzeug",
    journey: "Fahrtart",
    oneWay: "Einfache Fahrt",
    roundTrip: "Hin- und Rückfahrt",
    found: "Ziele gefunden · Preise in GBP pro Fahrzeug",
    bookNow: "Jetzt buchen",
    empty: "Keine passenden Ziele gefunden. Ändern Sie Ihre Suche.",
    comfort: "KOMFORTABEL REISEN",
    ready: "Bereit für eine entspannte Ankunft?",
    readyDetails: "Geben Sie Ihre Reisedaten ein und finden Sie den passenden privaten Transfer.",
    start: "Buchung starten",
  },
  ru: {
    loading: "Обновляем цены на маршруты",
    loadError: "Не удалось загрузить актуальные цены. Попробуйте ещё раз.",
    refresh: "Обновить цены",
    eyebrow: "ИНДИВИДУАЛЬНЫЕ ТРАНСФЕРЫ",
    title: "Ваша поездка из Даламана начинается здесь.",
    intro: "Посмотрите варианты индивидуального трансфера между аэропортом Даламан и Турецкой Ривьерой. Сравните цены за автомобиль и спланируйте поездку.",
    book: "Забронировать трансфер",
    explore: "Смотреть маршруты",
    coast: "ОТКРОЙТЕ ПОБЕРЕЖЬЕ",
    popular: "Популярные направления",
    starting: "Начальные цены за автомобиль в одну сторону. Ночные трансферы, парковка и платные дороги включены.",
    private: "Индивидуальный трансфер",
    airport: "Аэропорт Даламан",
    drive: "Время в пути ≈",
    from: "От",
    compare: "Сравнить цены по направлению",
    plan: "СПЛАНИРУЙТЕ ТРАНСФЕР",
    find: "Найти маршрут и цену",
    findDetails: "Выберите автомобиль и тип поездки, чтобы сравнить цены из формы бронирования.",
    destination: "Пункт назначения",
    search: "Поиск направлений",
    vehicle: "Автомобиль",
    journey: "Тип поездки",
    oneWay: "В одну сторону",
    roundTrip: "Туда и обратно",
    found: "— число направлений · Цены в фунтах за автомобиль",
    bookNow: "Забронировать",
    empty: "Подходящих направлений нет. Попробуйте другой запрос.",
    comfort: "ПУТЕШЕСТВУЙТЕ С КОМФОРТОМ",
    ready: "Готовы к комфортному прибытию?",
    readyDetails: "Укажите данные о поездке и подберите подходящий индивидуальный трансфер.",
    start: "Начать бронирование",
  },
}

export function RoutesPage() {
  const { language } = useLanguage()
  const copy = routesCopy[language]
  const { prices: transferPrices, loading, error, refresh } = useTransferPrices()
  const featuredRoutes = useMemo(() => {
    const minimums = new Map<string, number>()
    for (const price of transferPrices.filter(row => bookingVehicles.some(vehicle => vehicle.id === row.vehicleId))) minimums.set(price.destination, Math.min(minimums.get(price.destination) ?? Infinity, price.oneWay))
    return featuredDestinations.map(({ name, slug, minutes }) => {
      const match = [...minimums].find(([destination]) => destination.toLowerCase().includes(name.toLowerCase()))
      return match ? { destination: match[0], from: match[1], slug, minutes } : null
    }).filter((route): route is NonNullable<typeof route> => route !== null)
  }, [transferPrices])

  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(() => searchParams.get('destination') ?? '')
  const [selectedVehicle, setSelectedVehicle] = useState<string>(bookingVehicles[0].id)
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way')

  const routes = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('en')
    return transferPrices
      .filter((route) => route.vehicleId === selectedVehicle && route.destination.toLocaleLowerCase('en').includes(query))
      .sort((a, b) => a.destination.localeCompare(b.destination))
  }, [search, selectedVehicle, transferPrices])

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <PublicNavbar />
      <main>
        {loading && <span className="sr-only" role="status">{copy.loading}</span>}
        {error && <div role="alert" className="pt-24 px-4">{copy.loadError} <button type="button" onClick={refresh}>{copy.refresh}</button></div>}
        <section className="relative overflow-hidden bg-admin-primary px-4 pb-16 pt-32 text-white sm:px-8 sm:pb-20 sm:pt-40">
          <div className="pointer-events-none absolute -right-28 -top-24 h-80 w-80 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-52 right-12 h-96 w-96 rounded-full border border-white/10" />
          <div className="relative mx-auto max-w-7xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-secondary-fixed">{copy.eyebrow}</p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {copy.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
              {copy.intro}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="inline-flex min-h-12 items-center justify-center rounded-lg bg-secondary px-7 py-3 text-base font-bold text-on-secondary transition-colors hover:bg-on-secondary-fixed-variant" to="/booking">
                {copy.book} <span translate="no" aria-hidden="true" className="material-symbols-outlined ml-2 text-xl">arrow_forward</span>
              </Link>
              <a className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/40 px-7 py-3 font-semibold text-white transition-colors hover:bg-white/10" href="#all-routes">
                {copy.explore}
              </a>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-8 sm:py-20" aria-labelledby="popular-routes-heading">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-secondary">{copy.coast}</p>
              <h2 className="text-2xl font-bold tracking-tight text-admin-primary sm:text-3xl" id="popular-routes-heading">{copy.popular}</h2>
              <p className="mt-2 text-sm text-on-surface-variant">{copy.starting}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredRoutes.map((route, index) => (
              <article className="group flex min-h-48 flex-col justify-between rounded-2xl border border-outline-variant bg-white p-6 shadow-sm transition-shadow hover:shadow-lg" key={route.destination}>
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-admin-primary/5 text-admin-primary">
                    <span translate="no" aria-hidden="true" className="material-symbols-outlined">{index % 2 === 0 ? 'location_on' : 'explore'}</span>
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800">{copy.private}</span>
                </div>
                <div className="mt-8 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-admin-primary">{route.destination}</h3>
                    <p className="mt-1 text-xs text-on-surface-variant">{copy.airport} · {copy.from} {priceLabel(route.from)}</p>
                    <p className="mt-1 text-sm text-on-surface-variant">{copy.drive} {route.minutes} {language === 'ru' ? 'мин' : 'min'}</p>
                  </div>
                  <Link className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant text-admin-primary transition-colors hover:bg-surface-container-low" to={routeLanguagePath(route.slug, language)} aria-label={`${copy.compare} ${route.destination}`}>
                    <span translate="no" aria-hidden="true" className="material-symbols-outlined">arrow_forward</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-surface-container-low px-4 py-14 sm:px-8 sm:py-20" id="all-routes" aria-labelledby="all-routes-heading">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-secondary">{copy.plan}</p>
              <h2 className="text-2xl font-bold tracking-tight text-admin-primary sm:text-3xl" id="all-routes-heading">{copy.find}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-on-surface-variant">{copy.findDetails}</p>
            </div>
            <div className="rounded-2xl border border-outline-variant bg-white p-4 shadow-sm sm:p-6">
              <div className="grid gap-4 md:grid-cols-3">
                <label className="space-y-2 text-sm font-semibold text-admin-primary">
                  <span className="block">{copy.destination}</span>
                  <input className="min-h-12 w-full min-w-0 rounded-lg border border-outline-variant bg-white px-4 text-base font-normal text-on-surface outline-offset-2" onChange={(event) => setSearch(event.target.value)} placeholder={copy.search} type="search" value={search} />
                </label>
                <label className="space-y-2 text-sm font-semibold text-admin-primary">
                  <span className="block">{copy.vehicle}</span>
                  <select aria-label={copy.vehicle} className="min-h-12 w-full min-w-0 rounded-lg border border-outline-variant bg-white px-4 text-base font-normal text-on-surface" onChange={(event) => setSelectedVehicle(event.target.value)} value={selectedVehicle}>
                    {bookingVehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.name}</option>)}
                  </select>
                </label>
                <label className="space-y-2 text-sm font-semibold text-admin-primary">
                  <span className="block">{copy.journey}</span>
                  <select aria-label={copy.journey} className="min-h-12 w-full min-w-0 rounded-lg border border-outline-variant bg-white px-4 text-base font-normal text-on-surface" onChange={(event) => setTripType(event.target.value as 'one-way' | 'round-trip')} value={tripType}>
                    <option value="one-way">{copy.oneWay}</option>
                    <option value="round-trip">{copy.roundTrip}</option>
                  </select>
                </label>
              </div>
              <p aria-live="polite" className="mt-5 text-sm text-on-surface-variant">{routes.length} {copy.found}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {routes.map((route) => (
                  <article className="flex flex-col justify-between gap-4 rounded-xl border border-outline-variant bg-background p-4 sm:p-5" key={route.destination}>
                    <div>
                      <p className="text-xs text-on-surface-variant">{copy.airport} ↔</p>
                      <h3 className="mt-1 font-semibold text-admin-primary">{route.destination}</h3>
                    </div>
                    <div className="flex items-center justify-between gap-3 border-t border-outline-variant pt-4">
                      <div>
                        <p className="text-xs text-on-surface-variant">{tripType === 'one-way' ? copy.oneWay : copy.roundTrip}</p>
                        <p className="text-xl font-bold tabular-nums text-admin-primary">{priceLabel(tripType === 'one-way' ? route.oneWay : route.roundTrip)}</p>
                      </div>
                      <Link className="inline-flex min-h-11 items-center rounded-lg bg-admin-primary px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90" to={`/booking?${new URLSearchParams({ destination: route.destination, vehicle: selectedVehicle, tripType })}`}>{copy.bookNow}</Link>
                    </div>
                  </article>
                ))}
              </div>
              {routes.length === 0 && <p className="py-12 text-center text-on-surface-variant">{copy.empty}</p>}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-8 sm:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">{copy.comfort}</p>
          <h2 className="mx-auto mt-3 max-w-2xl text-2xl font-bold text-admin-primary sm:text-3xl">{copy.ready}</h2>
          <p className="mx-auto mt-4 max-w-xl text-on-surface-variant">{copy.readyDetails}</p>
          <Link className="mt-7 inline-flex min-h-12 items-center justify-center rounded-lg bg-admin-primary px-8 py-3 font-bold text-white transition-opacity hover:opacity-90" to="/booking">{copy.start}</Link>
        </section>
      </main>
    </div>
  )
}
