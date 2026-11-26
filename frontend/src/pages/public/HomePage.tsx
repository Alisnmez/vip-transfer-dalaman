import { supportEmail } from '../../features/booking/support'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

import { travelGuides } from '../../content/guides'
import { fleetCatalogue } from '../../features/vehicle-type/fleetCatalogue'
import { useLanguage } from '../../shared/localization/language'
import { GuestPhotos } from './GuestPhotos'
import { PublicNavbar } from './PublicNavbar'
import { HomeReviewStrip } from './HomeReviewStrip'
import { VehiclePhoto } from './VehiclePhoto'
import { TransferJourneyGuide } from './TransferJourneyGuide'

const homeCopy = {
  en: {
    hero: "Professional Airport Transfers from Dalaman",
    intro: "Request a private airport transfer across the Turquoise Coast. Review your route and vehicle options before submitting.",
    book: "Book Now",
    routes: "View Routes & Prices",
    assistance: "Booking Assistance",
    assistanceDetail: "Send your transfer details with your booking request.",
    estimates: "Clear Route Prices",
    estimateDetail: "See the published price for your selected route and vehicle before submitting your request.",
    drivers: "Professional Drivers",
    driversDetail: "Vehicle options for private airport transfers.",
    vehicles: "Our Vehicles",
    vehiclesIntro: "Explore vehicle options for your transfer.",
    allVehicles: "View All Vehicles",
    options: "View Options & Prices",
    popular: "Preferred Routes",
    badge: "DALAMAN ROUTE",
    fethiye: "Dalaman to Fethiye",
    fethiyeDetail: "Request a private transfer to Fethiye and review your route price.",
    viewPrice: "View transfer prices",
    gocek: "Dalaman to Gocek",
    marmaris: "Marmaris",
    oludeniz: "Oludeniz",
    cta: "Ready for a Seamless Journey?",
    ctaDetail: "Send your transfer request online and review the route price before submitting.",
    request: "Request a Transfer",
    contact: "Contact Us",
    homeLabel: "DalamanWay home",
    logo: "DalamanWay — Private Airport Transfers",
    services: "Services",
    fleet: "Vehicles",
    faq: "FAQ",
    reviews: "Customer Reviews",
    rights: "DalamanWay. All rights reserved.",
    tagline: "Private airport transfers from Dalaman to the Turquoise Coast.",
    explore: "Explore",
    help: "Customer support",
    routesLabel: "Routes & Prices",
    guidesLabel: "Travel Guides",
    manage: "Manage Booking",
    booking: "Book a Transfer",
    note: "Your journey, carefully arranged.",
    photo: "Ölüdeniz photo:",
    marinaAlt: "Fethiye Marina",
    gocekAlt: "Gocek",
    lagoonAlt: "Aerial photograph of the Blue Lagoon in Ölüdeniz, Turkey",
  },
  de: {
    hero: "Professionelle Flughafentransfers ab Dalaman",
    intro: "Fragen Sie einen privaten Flughafentransfer an der Türkisküste an. Prüfen Sie Ihre Strecke und Fahrzeugoptionen vor dem Absenden.",
    book: "Jetzt buchen",
    routes: "Strecken und Preise ansehen",
    assistance: "Hilfe bei der Buchung",
    assistanceDetail: "Geben Sie die Transferdetails in Ihrer Buchungsanfrage an.",
    estimates: "Klare Streckenpreise",
    estimateDetail: "Sehen Sie den veröffentlichten Preis für Ihre Strecke und Ihr Fahrzeug, bevor Sie Ihre Anfrage senden.",
    drivers: "Professionelle Fahrer",
    driversDetail: "Fahrzeugoptionen für private Flughafentransfers.",
    vehicles: "Unsere Fahrzeuge",
    vehiclesIntro: "Entdecken Sie die Fahrzeugoptionen für Ihren Transfer.",
    allVehicles: "Alle Fahrzeuge ansehen",
    options: "Optionen und Preise ansehen",
    popular: "Beliebte Strecken",
    badge: "STRECKE AB DALAMAN",
    fethiye: "Von Dalaman nach Fethiye",
    fethiyeDetail: "Fragen Sie einen privaten Transfer nach Fethiye an und prüfen Sie den Preis.",
    viewPrice: "Transferpreise ansehen",
    gocek: "Von Dalaman nach Göcek",
    marmaris: "Marmaris",
    oludeniz: "Ölüdeniz",
    cta: "Bereit für eine entspannte Fahrt?",
    ctaDetail: "Senden Sie Ihre Transferanfrage online. Prüfen Sie den Preis vor dem Absenden.",
    request: "Transfer anfragen",
    contact: "Kontakt",
    homeLabel: "DalamanWay-Startseite",
    logo: "DalamanWay — Private Flughafentransfers",
    services: "Leistungen",
    fleet: "Fahrzeuge",
    faq: "Häufige Fragen",
    reviews: "Kundenbewertungen",
    rights: "DalamanWay. Alle Rechte vorbehalten.",
    tagline: "Private Flughafentransfers von Dalaman an die Türkisküste.",
    explore: "Entdecken",
    help: "Kundenservice",
    routesLabel: "Strecken & Preise",
    guidesLabel: "Reiseführer",
    manage: "Buchung verwalten",
    booking: "Transfer buchen",
    note: "Ihre Fahrt, sorgfältig geplant.",
    photo: "Foto von Ölüdeniz:",
    marinaAlt: "Jachthafen von Fethiye",
    gocekAlt: "Göcek",
    lagoonAlt: "Luftaufnahme der Blauen Lagune in Ölüdeniz, Türkei",
  },
  ru: {
    hero: "Профессиональные трансферы из аэропорта Даламан",
    intro: "Закажите индивидуальный трансфер по Бирюзовому побережью. Проверьте маршрут и варианты автомобилей перед отправкой заявки.",
    book: "Забронировать",
    routes: "Смотреть маршруты и цены",
    assistance: "Помощь с бронированием",
    assistanceDetail: "Укажите детали поездки в заявке на бронирование.",
    estimates: "Цены на маршруты",
    estimateDetail: "Посмотрите опубликованную цену для выбранного маршрута и автомобиля перед отправкой заявки.",
    drivers: "Профессиональные водители",
    driversDetail: "Варианты автомобилей для индивидуального трансфера.",
    vehicles: "Наши автомобили",
    vehiclesIntro: "Посмотрите варианты автомобилей для поездки.",
    allVehicles: "Смотреть все автомобили",
    options: "Смотреть варианты и цены",
    popular: "Популярные маршруты",
    badge: "МАРШРУТ ИЗ ДАЛАМАНА",
    fethiye: "Из Даламана в Фетхие",
    fethiyeDetail: "Закажите индивидуальный трансфер в Фетхие и проверьте цену поездки.",
    viewPrice: "Посмотреть цены трансфера",
    gocek: "Из Даламана в Гёджек",
    marmaris: "Мармарис",
    oludeniz: "Олюдениз",
    cta: "Готовы к комфортной поездке?",
    ctaDetail: "Отправьте заявку на трансфер онлайн. Проверьте цену перед отправкой.",
    request: "Заказать трансфер",
    contact: "Связаться с нами",
    homeLabel: "Главная страница DalamanWay",
    logo: "DalamanWay — Индивидуальные трансферы из аэропорта",
    services: "Услуги",
    fleet: "Автомобили",
    faq: "Частые вопросы",
    reviews: "Отзывы клиентов",
    rights: "DalamanWay. Все права защищены.",
    tagline: "Индивидуальные трансферы из аэропорта Даламан на Бирюзовое побережье.",
    explore: "Узнайте больше",
    help: "Поддержка клиентов",
    routesLabel: "Маршруты и цены",
    guidesLabel: "Путеводители",
    manage: "Управление бронированием",
    booking: "Забронировать трансфер",
    note: "Ваша поездка продумана до мелочей.",
    photo: "Фото Олюдениза:",
    marinaAlt: "Яхтенная гавань Фетхие",
    gocekAlt: "Гёджек",
    lagoonAlt: "Голубая лагуна в Олюденизе, Турция, вид с воздуха",
  },
}

export function HomePage() {
  const { language } = useLanguage()
  const copy = homeCopy[language]
  useEffect(() => {
    const previousTitle = document.title
    const existingMeta = document.querySelector('meta[name="description"]')
    const previousDescription = existingMeta?.getAttribute('content') ?? null
    const meta = existingMeta ?? document.createElement('meta')
    if (!existingMeta) {
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    document.title = 'Dalaman Airport Private Transfers | DalamanWay'
    meta.setAttribute('content', 'Book private transfers from Dalaman Airport to Fethiye, Gocek, Marmaris and Oludeniz. Explore routes and arrange your airport pickup.')
    return () => {
      document.title = previousTitle
      if (!existingMeta) meta.remove()
      else if (previousDescription === null) meta.removeAttribute('content')
      else meta.setAttribute('content', previousDescription)
    }
  }, [])

  return (
    <>
      <PublicNavbar />

      <main>
      <header className="relative min-h-[700px] flex items-center justify-center overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 to-primary" />
        <div className="relative z-10 w-full min-w-0 max-w-container-max mx-auto px-gutter text-center">
          <h1 className="font-display-lg text-display-lg text-white mb-stack-md max-w-4xl mx-auto">
            {copy.hero}
          </h1>
          <p className="font-body-lg text-body-lg text-white/80 mb-stack-lg max-w-2xl mx-auto">
            {copy.intro}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-stack-md">
            <Link
              className="bg-secondary text-on-secondary px-10 py-4 rounded-lg font-bold text-lg shadow-lg hover:opacity-90 transition-opacity"
              to="/booking"
            >
              {copy.book}
            </Link>
            <Link
              className="bg-white/10 border border-white/30 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-white/15 transition-colors"
              to="/routes"
            >
              {copy.routes}
            </Link>
          </div>
        </div>
      </header>

      <section className="py-stack-lg bg-white border-b border-outline">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-lg">
            <div className="flex min-w-0 items-center gap-stack-md group">
              <div className="w-16 h-16 shrink-0 rounded-full bg-background flex items-center justify-center border border-outline group-hover:border-secondary transition-all">
                <span translate="no" className="material-symbols-outlined text-primary text-3xl">
                  support_agent
                </span>
              </div>
              <div>
                <h2 className="font-title-md text-on-surface">{copy.assistance}</h2>
                <p className="font-body-md text-on-surface-variant">
                  {copy.assistanceDetail}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-stack-md group">
              <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center border border-outline group-hover:border-secondary transition-all">
                <span translate="no" className="material-symbols-outlined text-primary text-3xl">
                  payments
                </span>
              </div>
              <div>
                <h2 className="font-title-md text-on-surface">{copy.estimates}</h2>
                <p className="font-body-md text-on-surface-variant">
                  {copy.estimateDetail}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-stack-md group">
              <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center border border-outline group-hover:border-secondary transition-all">
                <span translate="no" className="material-symbols-outlined text-primary text-3xl">
                  verified_user
                </span>
              </div>
              <div>
                <h2 className="font-title-md text-on-surface">
                  {copy.drivers}
                </h2>
                <p className="font-body-md text-on-surface-variant">
                  {copy.driversDetail}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end mb-stack-lg">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">
                {copy.vehicles}
              </h2>
              <p className="text-on-surface-variant mt-2">
                {copy.vehiclesIntro}
              </p>
            </div>
            <Link className="text-secondary font-bold flex items-center gap-2 group self-start shrink-0" to="/vehicles">
              {copy.allVehicles}
              <span translate="no" className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-stack-lg sm:grid-cols-2 lg:grid-cols-4">
            {fleetCatalogue.map((vehicle) => (
              <article key={vehicle.bookingVehicleId} className="professional-card accent-border-left flex min-w-0 flex-col rounded-xl p-6">
                <VehiclePhoto vehicleId={vehicle.bookingVehicleId} name={vehicle.name} className="mb-6 h-36 rounded-lg" />
                <h3 className="mb-4 font-title-md text-on-surface">{vehicle.name}</h3>
                <div className="mb-5 flex flex-wrap gap-2 text-xs text-on-surface-variant" aria-label="Vehicle comfort features">
                  {[
                    ['wifi', 'Wi-Fi'],
                    ['ac_unit', 'A/C'],
                    ['usb', 'USB'],
                    ['water_drop', language === 'de' ? 'Kostenloses Wasser & Getränke' : language === 'ru' ? 'Бесплатная вода и напитки' : 'Complimentary water & drinks'],
                    ['tv', 'TV'],
                    ['airline_seat_recline_extra', 'Leather seats'],
                    ['child_care', 'Child seats on request'],
                  ].map(([icon, label]) => (
                    <span key={label} className="inline-flex items-center gap-1 rounded-md border border-outline-variant bg-white px-2 py-1 text-on-surface-variant">
                      <span aria-hidden="true" className="material-symbols-outlined text-base text-secondary">{icon}</span>{label}
                    </span>
                  ))}
                </div>
                <Link to={`/booking?vehicle=${encodeURIComponent(vehicle.bookingVehicleId)}`} className="mt-auto block w-full rounded-lg bg-primary px-2 py-3 text-center font-bold text-white transition-all hover:opacity-90">
                  {copy.options}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <TransferJourneyGuide />

      <GuestPhotos />

      <section className="py-24 bg-white border-y border-outline" id="routes">
        <div className="max-w-container-max mx-auto px-gutter">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-stack-lg">
            {copy.popular}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-stack-md h-auto md:h-[600px]">
            <div className="md:col-span-2 md:row-span-2 relative rounded-xl overflow-hidden group border border-outline">
              <img
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                alt={copy.marinaAlt}
                loading="lazy"
                decoding="async"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOK1KM9F2Y7leTkTeOhHhnk3VW5SYz7VSpbtXEDc0wp2tByE7Ri26sDHSSF2pw2VMvlqpkHiwYswfRKKIKXYOcZ6oZAL6djRVTXN6hX563nv9I90K-aDDZhqhug7ij3oMrV9SYc_aitmhgiZu2GLn5DxFhE7G3aZBTSwBYeRQNNaoaO1bXa1f3lb27SbvzUZZ1_aGUZVjylaMPe04cScc8j3VEKcLM43VaDaDj_P2lKPwbhgZoiZu-mzXAC_hNdZAoF0wgGzjUVlY"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent" />
              <div className="absolute bottom-0 left-0 p-stack-lg">
                <span className="bg-secondary text-white px-3 py-1 rounded-full text-label-sm font-bold mb-2 inline-block">
                  {copy.badge}
                </span>
                <h3 className="font-display-lg text-3xl text-white mb-2">
                  {copy.fethiye}
                </h3>
                <p className="text-white/80 mb-4">
                  {copy.fethiyeDetail}
                </p>
                <Link className="inline-flex rounded-lg bg-white px-4 py-2 text-sm font-bold text-primary hover:bg-background" to="/routes?destination=Fethiye#all-routes">{copy.viewPrice}</Link>
              </div>
            </div>

            <div className="md:col-span-2 relative rounded-xl overflow-hidden group border border-outline">
              <img
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                alt={copy.gocekAlt}
                loading="lazy"
                decoding="async"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOoevwDWp2dwsb3kyAbOt18NiYyZnU-otp8oMvvN0dAop3O0F7d7R1p5TZ4oVhIn__oejP4s-CbC4cfdF2YENvwyxPgoYrBe16j-mf95TaokOcp1y1ULaDK0GIGCcRvZ7Fi59650xA9EYYj44NFBhopQPjcD6J7iUOqiU6FZZQ4lwAlLB-n7CwE0YKWRbX2wfVtPyUy_SquSFJF_aEI-B-Is7qPe9Xf2PF8lYCAbdYnF6VOacrL5qNgZD9iDZ3_Y0t1j_XPaYmmog"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
              <div className="absolute bottom-0 left-0 p-stack-md">
                <h3 className="font-headline-lg text-2xl text-white mb-1">
                  {copy.gocek}
                </h3>
                <Link className="inline-flex rounded-lg bg-white px-4 py-2 text-sm font-bold text-primary hover:bg-background" to="/routes?destination=Gocek#all-routes">{copy.viewPrice}</Link>
              </div>
            </div>

            <div className="md:col-span-1 relative rounded-xl overflow-hidden group border border-outline">
              <img
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                alt="Marmaris"
                loading="lazy"
                decoding="async"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7Q8VhPQ9vxEnZPMQlxFOH5Bq6VI3ircpXbpY8zDjl1oP6yWyHuIXDvjHdwGEGb-yqm1NG7eOgJVexdTGpecalboFhK83kZuUAkT8GP-Td1bskh-f5Bh9iyy5k_PtJNGSMpq8rdrjnr33ToG3EsT0zQbhhFzzYZuTUIgktHADpsgbw6H7T1CgcvnGrDoJr81uaylbrRxq27QLggC8yoYmnDS8iBkmtKf2t0Eod6filBbv6dFTaw2cnSM2VcaZSXAeu8Igbn3gaZdQ"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
              <div className="absolute bottom-0 left-0 p-stack-md">
                <h3 className="font-title-md text-white mb-1">{copy.marmaris}</h3>
                <Link className="inline-flex rounded-lg bg-white px-4 py-2 text-sm font-bold text-primary hover:bg-background" to="/routes?destination=Marmaris#all-routes">{copy.viewPrice}</Link>
              </div>
            </div>

            <div className="md:col-span-1 relative rounded-xl overflow-hidden group border border-outline">
              <img
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                data-alt="Oludeniz"
                alt={copy.lagoonAlt}
                loading="lazy"
                decoding="async"
                src="https://commons.wikimedia.org/wiki/Special:FilePath/%C3%96l%C3%BCdeniz%2C_Blue_Lagoon.jpg?width=1200"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
              <div className="absolute bottom-0 left-0 p-stack-md">
                <h3 className="font-title-md text-white mb-1">{copy.oludeniz}</h3>
                <Link className="inline-flex rounded-lg bg-white px-4 py-2 text-sm font-bold text-primary hover:bg-background" to="/routes?destination=Oludeniz#all-routes">{copy.viewPrice}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {language === 'en' && (
        <section aria-labelledby="travel-guides-title" className="border-b border-outline bg-background py-16 sm:py-20">
          <div className="mx-auto max-w-container-max px-gutter">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 id="travel-guides-title" className="font-headline-lg text-headline-lg text-on-surface">Dalaman transfer and travel guides</h2>
                <p className="mt-3 max-w-2xl leading-7 text-on-surface-variant">Compare ways to get from Dalaman Airport to Fethiye or Marmaris, or plan a day around Dalyan, Kayaköy and Ölüdeniz.</p>
              </div>
              <Link className="shrink-0 self-start rounded-lg border border-outline bg-white px-5 py-3 font-bold text-primary hover:border-secondary sm:self-auto" to="/guides">
                View all travel guides
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {travelGuides.map((guide) => (
                <article key={guide.path} className="flex min-w-0 flex-col rounded-2xl border border-outline bg-white p-6 shadow-sm">
                  <p className="mb-2 text-sm font-semibold text-secondary">{guide.category}</p>
                  <h3 className="mb-3 text-xl font-bold leading-snug text-on-surface">
                    <Link className="hover:underline focus-visible:underline" to={guide.path}>{guide.title}</Link>
                  </h3>
                  <p className="leading-7 text-on-surface-variant">{guide.cardDescription}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-24 relative bg-background">
        <div className="max-w-container-max mx-auto px-gutter text-center relative z-10">
          <h2 className="font-display-lg text-display-lg text-on-surface mb-stack-md">
            {copy.cta}
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-stack-lg max-w-xl mx-auto">
            {copy.ctaDetail}
          </p>
          <div className="flex flex-col md:flex-row gap-stack-md justify-center">
            <Link to="/booking" className="bg-primary text-white px-12 py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all">
              {copy.request}
            </Link>
            <Link to="/contact" className="bg-white border border-outline text-on-surface px-12 py-4 rounded-lg font-bold text-lg hover:border-secondary transition-all flex items-center justify-center gap-2">
              <span translate="no" className="material-symbols-outlined text-secondary">chat</span>
              {copy.contact}
            </Link>
          </div>
        </div>
      </section>

      <HomeReviewStrip />
      </main>

      <footer className="border-t border-white/10 bg-primary text-white">
        <div className="mx-auto max-w-container-max px-gutter">
          <div className="grid gap-10 py-14 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-5">
              <Link to="/" aria-label={copy.homeLabel} className="inline-flex items-center">
                <img src="/dalamanway-logo-light.svg" alt={copy.logo} className="h-16 w-auto max-w-[270px] object-contain" />
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-7 text-white/75">{copy.tagline}</p>
              <p className="mt-3 text-sm font-medium text-white/90">{copy.note}</p>
            </div>
            <nav aria-label={copy.explore} className="md:col-span-3">
              <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">{copy.explore}</h2>
              <ul className="space-y-3 text-sm text-white/75">
                <li><Link className="hover:text-white focus-visible:underline" to="/routes">{copy.routesLabel}</Link></li>
                <li><Link className="hover:text-white focus-visible:underline" to="/vehicles">{copy.fleet}</Link></li>
                <li><Link className="hover:text-white focus-visible:underline" to="/services">{copy.services}</Link></li>
                <li><Link className="hover:text-white focus-visible:underline" to="/guides">{copy.guidesLabel}</Link></li>
              </ul>
            </nav>
            <nav aria-label={copy.help} className="md:col-span-4">
              <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">{copy.help}</h2>
              <ul className="space-y-3 text-sm text-white/75">
                <li><Link className="hover:text-white focus-visible:underline" to="/booking/lookup">{copy.manage}</Link></li>
                <li><Link className="hover:text-white focus-visible:underline" to="/faq">{copy.faq}</Link></li>
                <li><Link className="hover:text-white focus-visible:underline" to="/reviews">{copy.reviews}</Link></li>
                <li><Link className="hover:text-white focus-visible:underline" to="/contact">{copy.contact}</Link></li>
              </ul>
              <a className="mt-5 inline-block break-all text-sm font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white" href={`mailto:${supportEmail}`}>{supportEmail}</a>
            </nav>
          </div>
          <div className="flex flex-col gap-4 border-t border-white/15 py-6 text-sm text-white/65 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} {copy.rights}</p>
            <Link className="inline-flex w-fit items-center justify-center rounded-md bg-secondary px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" to="/booking">{copy.booking}</Link>
          </div>
        </div>
      </footer>
    </>
  )
}
