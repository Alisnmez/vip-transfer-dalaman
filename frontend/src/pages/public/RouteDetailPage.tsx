import { Link, useParams } from 'react-router-dom'
import { transferPrices } from '../../features/booking/pricing'
import airportArrivalNotes from '../../features/route-price/airport-arrival-notes.json'
import { useLanguage } from '../../shared/localization/language'
import { PublicNavbar } from './PublicNavbar'

const destinations = [
  { slug: 'marmaris', name: 'Marmaris', match: 'Marmaris(Any Hotel)', russianName: "Мармарис", intro: { en: 'Marmaris is a coastal resort town with hotels, a marina and a lively waterfront. Choose your vehicle before requesting an airport pickup.', de: "Marmaris ist ein Badeort mit Hotels, Jachthafen und belebter Uferpromenade. Wählen Sie Ihr Fahrzeug, bevor Sie die Abholung am Flughafen anfragen.", ru: "Мармарис — курорт с отелями, яхтенной гаванью и оживлённой набережной. Выберите автомобиль перед бронированием трансфера из аэропорта." } },
  { slug: 'fethiye', name: 'Fethiye', match: 'Fethiye City Center(Any Hotel)', russianName: "Фетхие", intro: { en: 'Fethiye offers a harbour, town centre and access to the surrounding coast. Include your hotel or exact address in the booking request.', de: "Fethiye bietet einen Hafen, ein Stadtzentrum und Zugang zur umliegenden Küste. Geben Sie bei der Buchungsanfrage Ihr Hotel oder die genaue Adresse an.", ru: "В Фетхие есть порт, центр города и удобный доступ к побережью. Укажите в заявке отель или точный адрес." } },
  { slug: 'oludeniz', name: 'Oludeniz', match: 'Oludeniz', russianName: "Олюдениз", intro: { en: 'Oludeniz is known for its lagoon and beach area. Share your accommodation details so the transfer team can review your pickup or drop-off.', de: "Ölüdeniz ist für seine Lagune und seinen Strand bekannt. Geben Sie Ihre Unterkunft an, damit das Transferteam die Abholung oder Rückfahrt prüfen kann.", ru: "Олюдениз известен лагуной и пляжем. Укажите адрес проживания, чтобы команда уточнила место посадки или высадки." } },
  { slug: 'gocek', name: 'Gocek', match: 'Gocek', russianName: "Гёджек", intro: { en: 'Gocek is a marina destination on the Gulf of Fethiye. Provide your marina or hotel name when requesting a private transfer.', de: "Göcek liegt am Golf von Fethiye und ist für seine Jachthäfen bekannt. Geben Sie bei der Anfrage den Jachthafen oder das Hotel an.", ru: "Гёджек расположен в заливе Фетхие и известен яхтенными гаванями. Укажите название гавани или отеля в заявке." } },
  { slug: 'icmeler', name: 'Icmeler', match: 'Icmeler(Any Hotel)', russianName: "Ичмелер", intro: { en: 'Icmeler is a resort area near Marmaris. Select your vehicle and confirm your hotel details in the reservation form.', de: "İçmeler ist ein Badeort nahe Marmaris. Wählen Sie im Buchungsformular Ihr Fahrzeug aus und geben Sie Ihre Hotelinformationen an.", ru: "Ичмелер — курорт недалеко от Мармариса. Выберите автомобиль и укажите сведения об отеле в форме бронирования." } },
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

export function RouteDetailPage() {
  const { language } = useLanguage()
  const copy = routeCopy[language]
  const { slug } = useParams()
  const route = destinations.find((item) => item.slug === slug)
  const available = route ? transferPrices.some((price) => price.destination.toLowerCase().includes(route.match.toLowerCase())) : false

  if (!route || !available) {
    return <><title>Route not available | DalamanWay</title><meta name="robots" content="noindex,nofollow" /><PublicNavbar /><main className="mx-auto max-w-4xl px-6 pb-20 pt-36"><h1 className="text-3xl font-bold">{copy.unavailable}</h1><Link className="mt-6 inline-block underline" to="/routes">{copy.available}</Link></main></>
  }

  const heading = {
    en: `Dalaman Airport to ${route.name} private transfer`,
    de: `Privater Transfer vom Flughafen Dalaman nach ${route.name}`,
    ru: `Индивидуальный трансфер из аэропорта Даламан — ${route.russianName}`,
  }[language]
  const title = `Dalaman Airport to ${route.name} Private Transfer | DalamanWay`
  const description = `Plan a private Dalaman Airport to ${route.name} transfer. Compare available vehicles and request a one-way or return journey.`

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <PublicNavbar />
      <main className="mx-auto max-w-5xl px-5 pb-20 pt-36 sm:px-8">
        <nav aria-label={copy.breadcrumb} className="mb-8 text-sm text-on-surface-variant"><Link className="underline" to="/routes">{copy.routes}</Link> / {language === 'ru' ? route.russianName : route.name}</nav>
        <h1 className="max-w-3xl text-4xl font-bold text-admin-primary sm:text-5xl">{heading}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed">{route.intro[language]}</p>
        <section className="mt-8 max-w-3xl">
          <h2 className="text-2xl font-bold text-admin-primary">{copy.arrival}</h2>
          <p className="mt-3 leading-relaxed">{airportArrivalNotes[route.slug][language]}</p>
        </section>
        <section className="mt-12 rounded-2xl border border-outline-variant bg-white p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-admin-primary">{copy.plan}</h2>
          <p className="mt-3 leading-relaxed">{copy.planDetails}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="rounded-lg bg-admin-primary px-6 py-3 font-semibold text-white" to={`/booking?destination=${encodeURIComponent(route.match)}`}>{copy.request}</Link>
            <Link className="rounded-lg border border-outline-variant px-6 py-3 font-semibold text-admin-primary" to="/routes">{copy.compare}</Link>
          </div>
        </section>
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
