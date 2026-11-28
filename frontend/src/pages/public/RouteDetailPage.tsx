import { Link, useLocation, useParams } from 'react-router-dom'
import { travelGuides } from '../../content/guides'
import { fleetCatalogue } from '../../features/vehicle-type/fleetCatalogue'
import { useTransferPrices } from '../../features/booking/useTransferPrices'
import { transferPrices } from '../../features/booking/pricing'
import airportArrivalNotes from '../../features/route-price/airport-arrival-notes.json'
import { useLanguage } from '../../shared/localization/language'
import { PublicNavbar } from './PublicNavbar'
import { matchLocalizedRoute, routeLanguageLabels, routeLanguagePath, routeLanguages } from '../../shared/localization/route-locales'

const destinations = [
  { slug: 'marmaris', name: 'Marmaris', match: 'Marmaris(Any Hotel)', russianName: "Мармарис", intro: { en: 'Marmaris is a coastal resort town with hotels, a marina and a lively waterfront. Choose your vehicle before requesting an airport pickup.', de: "Marmaris ist ein Badeort mit Hotels, Jachthafen und belebter Uferpromenade. Wählen Sie Ihr Fahrzeug, bevor Sie die Abholung am Flughafen anfragen.", ru: "Мармарис — курорт с отелями, яхтенной гаванью и оживлённой набережной. Выберите автомобиль перед бронированием трансфера из аэропорта." } },
  { slug: 'fethiye', name: 'Fethiye', match: 'Fethiye City Center(Any Hotel)', russianName: "Фетхие", intro: { en: 'Fethiye offers a harbour, town centre and access to the surrounding coast. Include your hotel or exact address in the booking request.', de: "Fethiye bietet einen Hafen, ein Stadtzentrum und Zugang zur umliegenden Küste. Geben Sie bei der Buchungsanfrage Ihr Hotel oder die genaue Adresse an.", ru: "В Фетхие есть порт, центр города и удобный доступ к побережью. Укажите в заявке отель или точный адрес." } },
  { slug: 'oludeniz', name: 'Oludeniz', match: 'Oludeniz(Any Hotel)', russianName: "Олюдениз", intro: { en: 'Oludeniz is known for its lagoon and beach area. Share your accommodation details so the transfer team can review your pickup or drop-off.', de: "Ölüdeniz ist für seine Lagune und seinen Strand bekannt. Geben Sie Ihre Unterkunft an, damit das Transferteam die Abholung oder Rückfahrt prüfen kann.", ru: "Олюдениз известен лагуной и пляжем. Укажите адрес проживания, чтобы команда уточнила место посадки или высадки." } },
  { slug: 'gocek', name: 'Gocek', match: 'Gocek', russianName: "Гёджек", intro: { en: 'Gocek is a marina destination on the Gulf of Fethiye. Provide your marina or hotel name when requesting a private transfer.', de: "Göcek liegt am Golf von Fethiye und ist für seine Jachthäfen bekannt. Geben Sie bei der Anfrage den Jachthafen oder das Hotel an.", ru: "Гёджек расположен в заливе Фетхие и известен яхтенными гаванями. Укажите название гавани или отеля в заявке." } },
  { slug: 'icmeler', name: 'Icmeler', match: 'Icmeler(Any Hotel)', russianName: "Ичмелер", intro: { en: 'Icmeler is a resort area near Marmaris. Select your vehicle and confirm your hotel details in the reservation form.', de: "İçmeler ist ein Badeort nahe Marmaris. Wählen Sie im Buchungsformular Ihr Fahrzeug aus und geben Sie Ihre Hotelinformationen an.", ru: "Ичмелер — курорт недалеко от Мармариса. Выберите автомобиль и укажите сведения об отеле в форме бронирования." } },
  { slug: 'dalyan', name: 'Dalyan', match: 'Dalyan', russianName: 'Дальян', intro: { en: 'Dalyan is a riverside destination in Ortaca. Check your accommodation address before booking an airport transfer.', de: 'Dalyan liegt am Fluss im Bezirk Ortaca. Prüfen Sie vor der Anfrage die Adresse Ihrer Unterkunft.', ru: 'Дальян расположен у реки в районе Ортаджа. Проверьте адрес жилья перед оформлением заявки на трансфер.' } },
  { slug: 'sarigerme', name: 'Sarigerme', match: 'Sarigerme', russianName: 'Сарыгерме', intro: { en: 'Sarıgerme is a coastal resort area in Ortaca. Confirm your hotel and drop-off details when requesting an airport transfer.', de: 'Sarıgerme ist ein Badeort im Bezirk Ortaca. Geben Sie bei der Anfrage Ihr Hotel und den gewünschten Ausstiegspunkt an.', ru: 'Сарыгерме — курорт на побережье в районе Ортаджа. Укажите отель и место высадки при оформлении заявки.' } },
] as const

const routeCopy = {
  en: {
    unavailable: "Route not available",
    available: "See available routes",
    breadcrumb: "Breadcrumb",
    routes: "Routes",
    plan: "Plan your journey",
    planDetails: "Compare the available vehicle options and current listed fares on our routes page. You can request a one-way or return transfer; the team will review your request before confirmation.",
    request: "Request a transfer",
    compare: "Compare routes and prices",
    prepare: "Information to prepare",
    arrival: "Where should we drop you off?",
    prepareDetails: "Have your arrival date and time, flight number if applicable, passenger and luggage counts, and your destination hotel or address ready. For return journeys, include your return pickup date and time.",
    vehicles: "Compare private transfer vehicles and luggage capacity",
    faq: "Read our airport transfer booking FAQs",
    compareDalaman: "Compare Dalaman Airport transfer routes and prices",
  },
  de: {
    unavailable: "Strecke nicht verfügbar",
    available: "Verfügbare Strecken ansehen",
    breadcrumb: "Brotkrumennavigation",
    routes: "Strecken",
    plan: "Planen Sie Ihre Fahrt",
    planDetails: "Vergleichen Sie auf unserer Streckenseite die verfügbaren Fahrzeuge und aktuellen Preise. Sie können eine einfache Fahrt oder einen Hin- und Rücktransfer anfragen. Unser Team prüft Ihre Anfrage vor der Bestätigung.",
    request: "Transfer anfragen",
    compare: "Strecken und Preise vergleichen",
    prepare: "Was Sie bereithalten sollten",
    arrival: "Wo sollen wir Sie absetzen?",
    prepareDetails: "Halten Sie Ankunftsdatum und -zeit, gegebenenfalls die Flugnummer, die Anzahl der Fahrgäste und Gepäckstücke sowie Ihr Hotel oder Ihre Zieladresse bereit. Geben Sie bei einer Rückfahrt auch Abholdatum und -zeit an.",
    vehicles: "Fahrzeuge und Gepäckkapazität vergleichen",
    faq: "Häufige Fragen zur Buchung lesen",
    compareDalaman: "Strecken und Preise ab Flughafen Dalaman vergleichen",
  },
  ru: {
    unavailable: "Маршрут недоступен",
    available: "Посмотреть доступные маршруты",
    breadcrumb: "Навигационная цепочка",
    routes: "Маршруты",
    plan: "Планирование поездки",
    planDetails: "Сравните доступные автомобили и актуальные цены на странице маршрутов. Вы можете заказать поездку в одну сторону или туда и обратно. Наша команда проверит заявку перед подтверждением.",
    request: "Заказать трансфер",
    compare: "Сравнить маршруты и цены",
    prepare: "Что нужно подготовить",
    arrival: "Где вас высадить?",
    prepareDetails: "Подготовьте дату и время прибытия, номер рейса при наличии, количество пассажиров и багажа, а также название отеля или точный адрес. Для обратной поездки укажите дату и время подачи автомобиля.",
    vehicles: "Сравнить автомобили и вместимость багажа",
    faq: "Прочитать ответы на вопросы о бронировании",
    compareDalaman: "Сравнить маршруты и цены трансферов из аэропорта Даламан",
  },
}

const airportWaitingCopy = {
  en: '60 min free waiting after landing',
  de: '60 Min. kostenlose Wartezeit nach der Landung',
  ru: '60 мин. бесплатного ожидания после посадки самолёта',
}

const fareCopy = {
  en: { oneWay: 'One way', roundTrip: 'Return', unit: 'Prices in GBP per vehicle', loading: 'Loading current prices…', error: 'Current prices could not be loaded.', missing: 'Unavailable' },
  de: { oneWay: 'Hinfahrt', roundTrip: 'Hin und zurück', unit: 'Preise in GBP pro Fahrzeug', loading: 'Aktuelle Preise werden geladen…', error: 'Aktuelle Preise konnten nicht geladen werden.', missing: 'Nicht verfügbar' },
  ru: { oneWay: 'В одну сторону', roundTrip: 'Туда и обратно', unit: 'Цены в GBP за автомобиль', loading: 'Загружаются актуальные цены…', error: 'Не удалось загрузить актуальные цены.', missing: 'Недоступно' },
}

const destinationFaq: Partial<Record<string, Record<'en' | 'de' | 'ru', [string, string]>>> = {
  "fethiye": {
    "en": [
      "Can I book a transfer to my hotel in Fethiye?",
      "Yes. Enter your hotel or exact address in Fethiye city centre when requesting your transfer."
    ],
    "de": [
      "Kann ich einen Transfer zu meinem Hotel in Fethiye buchen?",
      "Ja. Geben Sie bei der Anfrage Ihr Hotel oder die genaue Adresse im Stadtzentrum von Fethiye an."
    ],
    "ru": [
      "Можно ли заказать трансфер до отеля в Фетхие?",
      "Да. Укажите отель или точный адрес в центре Фетхие при оформлении заявки."
    ]
  },
  "oludeniz": {
    "en": [
      "Can I request a transfer to my accommodation in Ölüdeniz?",
      "Enter your accommodation name and address so our team can confirm the pickup or drop-off location."
    ],
    "de": [
      "Kann ich einen Transfer zu meiner Unterkunft in Ölüdeniz anfragen?",
      "Geben Sie Name und Adresse Ihrer Unterkunft an, damit unser Team den Abhol- oder Zielort bestätigen kann."
    ],
    "ru": [
      "Можно ли заказать трансфер до жилья в Олюденизе?",
      "Укажите название и адрес жилья, чтобы наша команда могла подтвердить место посадки или высадки."
    ]
  },
  "dalyan": {
    "en": [
      "Can I request a private transfer to a villa in Dalyan?",
      "Provide the villa name and exact address so our team can review your requested drop-off."
    ],
    "de": [
      "Kann ich einen privaten Transfer zu einer Villa in Dalyan anfragen?",
      "Geben Sie den Namen und die genaue Adresse der Villa an, damit unser Team den Zielort prüfen kann."
    ],
    "ru": [
      "Можно ли заказать индивидуальный трансфер до виллы в Дальяне?",
      "Укажите название и точный адрес виллы, чтобы наша команда могла проверить место высадки."
    ]
  }
}

const fareFaq = {
  en: ['How much is a private airport transfer?', 'Compare the current one-way and return fares in the table above. Prices are in GBP per vehicle.'],
  de: ['Was kostet ein privater Flughafentransfer?', 'Vergleichen Sie die aktuellen Preise für Hin- und Rückfahrten in der Tabelle oben. Die Preise gelten in GBP pro Fahrzeug.'],
  ru: ['Сколько стоит индивидуальный трансфер из аэропорта?', 'Сравните актуальные цены на поездки в одну сторону и туда и обратно в таблице выше. Цены указаны в GBP за автомобиль.'],
}
const faqHeading = { en: 'Frequently asked questions', de: 'Häufig gestellte Fragen', ru: 'Часто задаваемые вопросы' }

export function RouteDetailPage() {
  const { language, setLanguage } = useLanguage()
  const copy = routeCopy[language]
  const labels = routeLanguageLabels[language]
  const { slug } = useParams()
  const localized = matchLocalizedRoute(useLocation().pathname)
  const route = destinations.find((item) => item.slug === (localized?.slug ?? slug))
  const showFares = !!route && ['marmaris', 'fethiye', 'oludeniz', 'dalyan'].includes(route.slug)
  const { findPrice, loading, error } = useTransferPrices(showFares)
  const fares = fareCopy[language]
  const available = route ? transferPrices.some((price) => price.destination.toLowerCase().includes(route.match.toLowerCase())) : false

  if (!route || !available) {
    return <><title>Route not available | DalamanWay</title><meta name="robots" content="noindex,nofollow" /><PublicNavbar /><main className="mx-auto max-w-4xl px-6 pb-20 pt-36"><h1 className="text-3xl font-bold">{copy.unavailable}</h1><Link className="mt-6 inline-block underline" to="/routes">{copy.available}</Link></main></>
  }

  const heading = localized?.copy?.heading ?? {
    en: `Dalaman Airport to ${route.name} private transfer`,
    de: `Privater Transfer vom Flughafen Dalaman nach ${route.name}`,
    ru: `Индивидуальный трансфер из аэропорта Даламан — ${route.russianName}`,
  }[language]
  const title = `Dalaman Airport to ${route.name} Private Transfer | DalamanWay`
  const description = `Plan a private Dalaman Airport to ${route.name} transfer. Compare available vehicles and request a one-way or return journey.`

  const relatedGuides = travelGuides.filter(guide => guide.destinationSlug === route.slug)
  const relatedGuideHeading = { en: 'Related travel guides', de: 'Passende Reiseführer', ru: 'Путеводители по направлению' }[language]
  const farePath = showFares ? `/routes?destination=${encodeURIComponent(route.name)}#all-routes` : '/routes'
  const oneWayFares = route.slug === 'marmaris' && !loading && !error
    ? fleetCatalogue.map(vehicle => findPrice(route.match, vehicle.bookingVehicleId, 'one-way'))
      .filter((value): value is number => typeof value === 'number' && Number.isFinite(value) && value > 0)
    : []
  const startingFare = oneWayFares.length ? '£' + Math.min(...oneWayFares).toFixed(2) : null
  const fareHeadline = {
    en: `From ${startingFare} per vehicle · One way · Pay on arrival`,
    de: `Ab ${startingFare} pro Fahrzeug · Einfache Fahrt · Zahlung bei Ankunft`,
    ru: `От ${startingFare} за автомобиль · В одну сторону · Оплата по прибытии`,
  }[language]
  const formatFare = (price: number | null) => price === null ? fares.missing : `£${price.toFixed(2)}`

  return (
    <>
      {!localized && <><title>{title}</title><meta name="description" content={description} /></>}
      <PublicNavbar />
      <main className="mx-auto max-w-5xl px-5 pb-20 pt-36 sm:px-8">
        <nav aria-label={copy.breadcrumb} className="mb-8 text-sm text-on-surface-variant"><Link className="underline" to="/routes">{copy.routes}</Link> / {language === 'ru' ? route.russianName : route.name}</nav>
        <h1 className="max-w-3xl text-4xl font-bold text-admin-primary sm:text-5xl">{heading}</h1>
        {startingFare && <div className="mt-5 flex flex-wrap items-center gap-4">
          <p className="text-xl font-bold text-admin-primary">{fareHeadline}</p>
          <Link className="rounded-lg bg-admin-primary px-6 py-3 font-semibold text-white" to={`/booking?destination=${encodeURIComponent(route.match)}`}>{copy.request}</Link>
        </div>}
        <p className="mt-6 max-w-3xl text-lg leading-relaxed">{localized?.copy?.intro ?? route.intro[language]}</p>
        {localized && <nav className="mt-4 flex flex-wrap gap-4 text-sm">
          {routeLanguages.map(option => <Link key={option} lang={option} hrefLang={option}
            className="underline" aria-current={option === language ? 'page' : undefined}
            to={routeLanguagePath(route.slug, option)} onClick={() => setLanguage(option)}>{routeLanguageLabels[option].name}</Link>)}
        </nav>}
        <section className="mt-8 max-w-3xl">
          <h2 className="text-2xl font-bold text-admin-primary">{route.slug === 'marmaris' ? labels.pickupAndDropoff : copy.arrival}</h2>
          <p className="mt-3 leading-relaxed">{airportArrivalNotes[route.slug][language]}</p>
        </section>
        <section className="mt-8 max-w-3xl">
          <h2 className="text-2xl font-bold text-admin-primary">{labels.fleet}</h2>
          {showFares && <p className="mt-2 text-sm">{fares.unit}</p>}
          {showFares && (loading || error) && <p role="status" className="mt-2 text-sm">{loading ? fares.loading : fares.error}</p>}
          <div className="overflow-x-auto">
            <table className="my-4 w-full text-left text-sm">
              <thead><tr>{[labels.vehicle, labels.passengers, labels.luggage, ...(showFares ? [fares.oneWay, fares.roundTrip] : [])].map(label => <th scope="col" className="py-2" key={label}>{label}</th>)}</tr></thead>
              <tbody>{fleetCatalogue.map(vehicle => <tr key={vehicle.bookingVehicleId} className="border-t border-outline-variant">
                <th scope="row" className="py-2">{vehicle.name}</th><td>{vehicle.maxPassengers}</td><td>{vehicle.luggage}</td>
                {showFares && (['one-way', 'round-trip'] as const).map(tripType => (
                  <td key={tripType} className="whitespace-nowrap px-2 tabular-nums">{loading || error ? '—' : formatFare(findPrice(route.match, vehicle.bookingVehicleId, tripType))}</td>
                ))}
              </tr>)}</tbody>
            </table>
          </div>
          <p className="mb-3 flex items-center gap-2 text-sm text-on-surface-variant"><span aria-hidden="true" className="material-symbols-outlined text-lg text-secondary">schedule</span>{airportWaitingCopy[language]}</p>
          <Link className="underline" to={farePath}>{labels.fare}</Link>
        </section>
        <section className="mt-12 rounded-2xl border border-outline-variant bg-white p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-admin-primary">{copy.plan}</h2>
          <p className="mt-3 leading-relaxed">{copy.planDetails}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {!startingFare && <Link className="rounded-lg bg-admin-primary px-6 py-3 font-semibold text-white" to={`/booking?destination=${encodeURIComponent(route.match)}`}>{copy.request}</Link>}
            <Link className="rounded-lg border border-outline-variant px-6 py-3 font-semibold text-admin-primary" to={farePath}>{copy.compare}</Link>
          </div>
        </section>
        {destinationFaq[route.slug] && <section className="mt-12 max-w-3xl">
          <h2 className="text-2xl font-bold text-admin-primary">{faqHeading[language]}</h2>
          {[fareFaq[language], destinationFaq[route.slug]![language]].map(([question, answer]) => <div key={question} className="mt-4">
            <h3 className="font-semibold">{question}</h3>
            <p className="mt-2 leading-relaxed">{answer}</p>
          </div>)}
        </section>}
        {relatedGuides.length > 0 && <section className="mt-12 max-w-3xl">
          <h2 className="text-2xl font-bold text-admin-primary">{relatedGuideHeading}</h2>
          <ul className="mt-4 list-disc space-y-1 pl-5 leading-relaxed">
            {relatedGuides.map(guide => {
              const article = 'translations' in guide ? guide.translations[language] : guide
              return <li key={guide.path}><Link className="font-semibold underline underline-offset-2" to={guide.path}>{article.title}</Link></li>
            })}
          </ul>
        </section>}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-admin-primary">{copy.prepare}</h2>
          <p className="mt-3 leading-relaxed">{copy.prepareDetails}</p>
          <ul className="mt-4 list-disc space-y-1 pl-5 leading-relaxed">
            <li><Link className="font-semibold underline underline-offset-2" to="/vehicles">{copy.vehicles}</Link></li>
            <li><Link className="font-semibold underline underline-offset-2" to="/faq">{copy.faq}</Link></li>
            <li><Link className="font-semibold underline underline-offset-2" to="/routes">{copy.compareDalaman}</Link></li>
          </ul>
        </section>
      </main>
    </>
  )
}
