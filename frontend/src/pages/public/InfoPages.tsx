import { VehiclePhoto } from './VehiclePhoto'
import { fleetCatalogue } from '../../features/vehicle-type/fleetCatalogue'
import { supportEmail } from '../../features/booking/support'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

import { useLanguage } from '../../shared/localization/language'
import { PublicNavbar } from './PublicNavbar'


const infoCopy = {
  en: {
    services: "Services",
    servicesTitle: "Reliable Airport Transfer Services",
    servicesIntro: "Request a private airport transfer and review the published route estimate before submitting.",
    pickup: "Airport Pickup",
    pickupDetails: "Request a pickup from Dalaman Airport and provide your flight details.",
    hotel: "Hotel Transfer",
    hotelDetails: "Provide your hotel or accommodation address in the booking request.",
    returnTrip: "Return Transfer",
    returnDetails: "Schedule your return journey in advance.",
    flight: "Flight Details",
    flightDetails: "Add your flight number when submitting a booking request.",
    change: "Changes and Cancellations",
    changeDetails: "Use Manage Booking with your booking reference and booking email. Request a free change or cancellation at least 24 hours before the affected pickup (Türkiye local time). Within 24 hours, requests are still reviewed; availability and any applicable cost are confirmed before you decide. The booking stays unchanged until written confirmation.",
    contact: "Contact",
    contactTitle: "Contact DalamanWay",
    contactIntro: "Share your route, travel date, passenger count, and flight number through the booking request form.",
    area: "Service Area",
    destinations: "Dalaman, Fethiye, Gocek, Marmaris, Oludeniz",
    requests: "Booking Requests",
    requestDetails: "Use the online booking form to submit your transfer details.",
    existing: "Existing Booking",
    existingDetails: "Use Manage Booking with your booking reference and booking email. Do not submit a duplicate request while we review it.",
    faqTitle: "Frequently Asked Questions",
    faqLabel: "Frequently asked questions",
    faqIntro: "Answers to common questions about booking a Dalaman airport transfer.",
    how: "How do I book a transfer?",
    howAnswer: "Choose your route, travel date, vehicle category and passenger details in the online booking form. Review the details before submitting your request.",
    canReturn: "Can I book a return transfer?",
    canReturnAnswer: "Yes. Select Round Trip and enter your return date and time.",
    delayed: "What if my flight is delayed?",
    delayedAnswer: "We track your flight. If it is delayed, there is no extra charge for the delay. Your driver will wait free of charge for 60 minutes after your actual landing time. Please contact your driver if you need more time.",
    seat: "Can I request a child seat?",
    seatAnswer: "Yes. Child seats are free of charge. Select the number of baby seats in the booking form. Availability will be confirmed with your booking.",
    cancelFaq: "How can I change or cancel my booking?",
    cancelAnswer: "Use Manage Booking with your booking reference and booking email. Requests made at least 24 hours before the affected pickup (Türkiye local time) have no DalamanWay service fee. Requests within 24 hours are still reviewed, with any applicable cost confirmed before you decide. The booking is unchanged until we confirm in writing.",
    confirmed: "How will I know my booking is confirmed?",
    confirmedAnswer: "After submitting your request, keep the booking reference. The operator will confirm the booking details separately.",
    book: "Book Your Transfer",
    bookVehicle: "Book a Transfer",
    fleet: "Our Vehicles",
    fleetTitle: "Professional Transfer Vehicles",
    fleetIntro: "Explore our vehicle categories and choose the right option for your transfer. Models are examples; a similar vehicle may be assigned. Vehicle assignment and luggage space are confirmed before travel. Luggage limits depend on the selected vehicle.",
    category: "Vehicle categories",
    passengers: "passengers",
    bags: "bags",
    contactLabel: "Contact details",
    contactUs: "Contact us",
    email: "Email:",
    home: "Back to Home",
  },
  de: {
    services: "Leistungen",
    servicesTitle: "Zuverlässige Flughafentransfers",
    servicesIntro: "Fragen Sie einen privaten Flughafentransfer an. Prüfen Sie vor dem Absenden den veröffentlichten Richtpreis.",
    pickup: "Abholung am Flughafen",
    pickupDetails: "Buchen Sie die Abholung am Flughafen Dalaman und geben Sie Ihre Flugdaten an.",
    hotel: "Hoteltransfer",
    hotelDetails: "Geben Sie in Ihrer Anfrage die Adresse Ihres Hotels oder Ihrer Unterkunft an.",
    returnTrip: "Rücktransfer",
    returnDetails: "Planen Sie Ihre Rückfahrt im Voraus.",
    flight: "Flugdaten",
    flightDetails: "Geben Sie bei der Buchungsanfrage Ihre Flugnummer an.",
    change: "Änderungen und Stornierungen",
    changeDetails: "Nutzen Sie „Buchung verwalten“ mit Buchungsnummer und Buchungs-E-Mail. Änderungen oder Stornierungen können bis mindestens 24 Stunden vor der betroffenen Abholung (Ortszeit Türkiye) ohne DalamanWay-Servicegebühr angefragt werden. Innerhalb von 24 Stunden prüfen wir die Anfrage und nennen mögliche Kosten, bevor Sie entscheiden. Die Buchung bleibt bis zur schriftlichen Bestätigung unverändert.",
    contact: "Kontakt",
    contactTitle: "Kontakt zu DalamanWay",
    contactIntro: "Teilen Sie uns Strecke, Reisedatum, Anzahl der Fahrgäste und Flugnummer über das Buchungsformular mit.",
    area: "Einsatzgebiet",
    destinations: "Dalaman, Fethiye, Göcek, Marmaris, Ölüdeniz",
    requests: "Buchungsanfragen",
    requestDetails: "Senden Sie Ihre Transferdaten über das Online-Buchungsformular.",
    existing: "Bestehende Buchung",
    existingDetails: "Nutzen Sie „Buchung verwalten“ mit Buchungsnummer und Buchungs-E-Mail. Senden Sie während der Prüfung keine doppelte Anfrage.",
    faqTitle: "Häufig gestellte Fragen",
    faqLabel: "Häufig gestellte Fragen",
    faqIntro: "Antworten auf häufige Fragen zur Buchung eines Transfers am Flughafen Dalaman.",
    how: "Wie buche ich einen Transfer?",
    howAnswer: "Wählen Sie Strecke, Reisedatum und Fahrzeugkategorie und geben Sie die Fahrgastdaten ein. Prüfen Sie alles vor dem Absenden.",
    canReturn: "Kann ich auch die Rückfahrt buchen?",
    canReturnAnswer: "Ja. Wählen Sie Hin- und Rückfahrt und geben Sie Datum und Uhrzeit der Rückfahrt ein.",
    delayed: "Was passiert bei einer Flugverspätung?",
    delayedAnswer: "Wir verfolgen Ihren Flug. Bei einer Flugverspätung entstehen keine zusätzlichen Kosten für die Verspätung. Ihr Fahrer wartet ab der tatsächlichen Landung 60 Minuten kostenlos. Kontaktieren Sie Ihren Fahrer, wenn Sie mehr Zeit benötigen.",
    seat: "Kann ich einen Kindersitz anfragen?",
    seatAnswer: "Ja. Kindersitze sind kostenlos. Wählen Sie die Anzahl der Kindersitze im Buchungsformular. Die Verfügbarkeit wird mit der Buchung bestätigt.",
    cancelFaq: "Wie kann ich meine Buchung ändern oder stornieren?",
    cancelAnswer: "Nutzen Sie „Buchung verwalten“ mit Buchungsnummer und Buchungs-E-Mail. Anfragen mindestens 24 Stunden vor der betroffenen Abholung (Ortszeit Türkiye) sind ohne DalamanWay-Servicegebühr möglich. Anfragen innerhalb von 24 Stunden prüfen wir weiterhin und nennen mögliche Kosten, bevor Sie entscheiden. Die Buchung bleibt bis zu unserer schriftlichen Bestätigung unverändert.",
    confirmed: "Woran erkenne ich, dass meine Buchung bestätigt wurde?",
    confirmedAnswer: "Bewahren Sie nach dem Absenden Ihre Buchungsnummer auf. Der Anbieter bestätigt die Buchungsdaten separat.",
    book: "Transfer buchen",
    bookVehicle: "Transfer buchen",
    fleet: "Unsere Fahrzeuge",
    fleetTitle: "Fahrzeuge für professionelle Transfers",
    fleetIntro: "Entdecken Sie unsere Fahrzeugkategorien und wählen Sie das passende Fahrzeug. Die Modelle dienen als Beispiele, ein vergleichbares Fahrzeug kann eingesetzt werden. Fahrzeugzuweisung und Gepäckraum werden vor Reiseantritt bestätigt. Die Gepäckgrenze hängt vom Fahrzeug ab.",
    category: "Fahrzeugkategorien",
    passengers: "Fahrgäste",
    bags: "Gepäckstücke",
    contactLabel: "Kontaktdaten",
    contactUs: "Kontaktieren Sie uns",
    email: "E-Mail:",
    home: "Zur Startseite",
  },
  ru: {
    services: "Услуги",
    servicesTitle: "Надёжные трансферы из аэропорта",
    servicesIntro: "Отправьте заявку на индивидуальный трансфер. Перед отправкой проверьте опубликованную ориентировочную цену.",
    pickup: "Встреча в аэропорту",
    pickupDetails: "Закажите встречу в аэропорту Даламан и укажите данные рейса.",
    hotel: "Трансфер до отеля",
    hotelDetails: "Укажите в заявке адрес отеля или места проживания.",
    returnTrip: "Обратный трансфер",
    returnDetails: "Спланируйте обратную поездку заранее.",
    flight: "Данные рейса",
    flightDetails: "Добавьте номер рейса в заявку.",
    change: "Изменения и отмена",
    changeDetails: "Откройте управление бронированием и укажите номер бронирования и электронную почту из заказа. Запрос на изменение или отмену можно подать без сервисного сбора DalamanWay не позднее чем за 24 часа до затронутой подачи (местное время Турции). Запросы менее чем за 24 часа также рассматриваются; возможную стоимость сообщим до вашего решения. Бронирование не меняется до письменного подтверждения.",
    contact: "Контакты",
    contactTitle: "Связаться с DalamanWay",
    contactIntro: "Укажите маршрут, дату, количество пассажиров и номер рейса в форме бронирования.",
    area: "Зона обслуживания",
    destinations: "Даламан, Фетхие, Гёджек, Мармарис, Олюдениз",
    requests: "Заявки на бронирование",
    requestDetails: "Отправьте данные поездки через онлайн-форму бронирования.",
    existing: "Действующее бронирование",
    existingDetails: "Откройте управление бронированием и укажите номер бронирования и электронную почту из заказа. Не отправляйте повторный запрос, пока мы рассматриваем первый.",
    faqTitle: "Часто задаваемые вопросы",
    faqLabel: "Часто задаваемые вопросы",
    faqIntro: "Ответы на частые вопросы о бронировании трансфера из аэропорта Даламан.",
    how: "Как забронировать трансфер?",
    howAnswer: "Укажите маршрут, дату, категорию автомобиля и данные пассажиров в онлайн-форме. Проверьте данные перед отправкой.",
    canReturn: "Можно ли заказать обратный трансфер?",
    canReturnAnswer: "Да. Выберите поездку туда и обратно и укажите дату и время обратного трансфера.",
    delayed: "Что делать, если рейс задерживается?",
    delayedAnswer: "Мы отслеживаем ваш рейс. За задержку рейса дополнительная плата не взимается. Водитель бесплатно ждёт 60 минут с момента фактической посадки самолёта. Если вам нужно больше времени, свяжитесь с водителем.",
    seat: "Можно ли заказать детское кресло?",
    seatAnswer: "Да. Детские кресла предоставляются бесплатно. Укажите количество детских кресел в форме. Наличие подтвердят при бронировании.",
    cancelFaq: "Как изменить или отменить бронирование?",
    cancelAnswer: "Откройте управление бронированием и укажите номер бронирования и электронную почту из заказа. Запросы не позднее чем за 24 часа до затронутой подачи (местное время Турции) принимаются без сервисного сбора DalamanWay. Запросы менее чем за 24 часа также рассматриваются; возможную стоимость сообщим до вашего решения. Бронирование не отменено, пока мы письменно это не подтвердим.",
    confirmed: "Как узнать, что бронирование подтверждено?",
    confirmedAnswer: "После отправки заявки сохраните номер бронирования. Оператор подтвердит детали отдельно.",
    book: "Забронировать трансфер",
    bookVehicle: "Забронировать трансфер",
    fleet: "Наши автомобили",
    fleetTitle: "Автомобили для трансфера",
    fleetIntro: "Выберите подходящую категорию автомобиля. Модели приведены в качестве примера, возможна подача аналогичного автомобиля. Назначенный автомобиль и багажное пространство подтвердят до поездки. Норма багажа зависит от автомобиля.",
    category: "Категории автомобилей",
    passengers: "пассажиров",
    bags: "мест багажа",
    contactLabel: "Контактные данные",
    contactUs: "Свяжитесь с нами",
    email: "Эл. почта:",
    home: "На главную",
  },
}

type InfoCopy = typeof infoCopy.en

function pageContent(copy: InfoCopy) {
  return {
    services: {
      eyebrow: copy.services,
      title: copy.servicesTitle,
      description: copy.servicesIntro,
      items: [
        [copy.pickup, copy.pickupDetails],
        [copy.hotel, copy.hotelDetails],
        [copy.returnTrip, copy.returnDetails],
        [copy.flight, copy.flightDetails],
        [copy.change, copy.changeDetails],
      ],
    },
    contact: {
      eyebrow: copy.contact,
      title: copy.contactTitle,
      description: copy.contactIntro,
      items: [
        [copy.area, copy.destinations],
        [copy.requests, copy.requestDetails],
        [copy.existing, copy.existingDetails],
      ],
    },
  }
}

function frequentlyAskedQuestions(copy: InfoCopy) {
  return [
    [copy.how, copy.howAnswer],
    [copy.canReturn, copy.canReturnAnswer],
    [copy.delayed, copy.delayedAnswer],
    [copy.seat, copy.seatAnswer],
    [copy.cancelFaq, copy.cancelAnswer],
    [copy.confirmed, copy.confirmedAnswer],
  ]
}

const fleetCopy = {
  de: {
    feature: (count: number) => `Privater Transfer für bis zu ${count} Fahrgäste.`,
    amenities: ['Klimaanlage', 'Wasser in Flaschen', 'Kindersitze auf Anfrage'],
  },
  ru: {
    feature: (count: number) => `Индивидуальный трансфер до ${count} пассажиров.`,
    amenities: ['Кондиционер', 'Бутилированная вода', 'Детские кресла по запросу'],
  },
}

export function FAQPage() {
  const { language } = useLanguage()
  const copy = infoCopy[language]
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <PublicNavbar />
      <main className="pt-32 pb-20 px-margin-page max-w-4xl mx-auto">
        <h1 className="font-display-lg text-display-lg text-admin-primary mb-4">{copy.faqTitle}</h1>
        <p className="text-on-surface-variant mb-8">{copy.faqIntro}</p>
        <section aria-label={copy.faqLabel} className="space-y-3">
          {frequentlyAskedQuestions(copy).map(([question, answer]) => (
            <details key={question} className="rounded-xl border border-outline-variant bg-white p-5">
              <summary className="cursor-pointer font-semibold text-admin-primary">{question}</summary>
              <p className="mt-3 text-on-surface-variant">{answer}</p>
            </details>
          ))}
        </section>
        <Link className="mt-8 inline-flex rounded-lg bg-admin-primary px-8 py-3 font-bold text-white" to="/booking">{copy.book}</Link>
      </main>
    </div>
  )
}

const confirmedAmenities = {
  en: ['Free Wi-Fi', 'Air conditioning', 'USB charging', 'Complimentary water & drinks', 'TV & entertainment', 'Leather seating', 'Child seats on request'],
  de: ['Kostenloses WLAN', 'Klimaanlage', 'USB-Lademöglichkeit', 'Kostenloses Wasser & Getränke', 'TV & Unterhaltung', 'Ledersitze', 'Kindersitze auf Anfrage'],
  ru: ['Бесплатный Wi-Fi', 'Кондиционер', 'USB-зарядка', 'Бесплатная вода и напитки', 'ТВ и развлечения', 'Кожаные сиденья', 'Детские кресла по запросу'],
} as const

const amenityIcons = ['wifi', 'ac_unit', 'usb', 'water_drop', 'tv', 'airline_seat_recline_extra', 'child_care'] as const

export function VehiclesPage() {
  const { language } = useLanguage()
  const copy = infoCopy[language]
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <PublicNavbar />
      <main className="mx-auto max-w-7xl px-margin-page pb-20 pt-32">
        <header className="mb-10 max-w-3xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-wide text-secondary">{copy.fleet}</p>
          <h1 className="mb-4 font-display-lg text-display-lg text-admin-primary">{copy.fleetTitle}</h1>
          <p className="text-lg text-on-surface-variant">
            {copy.fleetIntro}
          </p>
        </header>
        <section aria-label={copy.category} className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {fleetCatalogue.map((vehicle) => {
            const details = language === 'en' ? vehicle : { feature: fleetCopy[language].feature(vehicle.maxPassengers), amenities: fleetCopy[language].amenities }
            return (
              <article className="flex h-full flex-col overflow-hidden rounded-xl border border-outline-variant bg-white shadow-sm" key={vehicle.name}>
                <VehiclePhoto vehicleId={vehicle.bookingVehicleId} name={vehicle.name} className="h-56 shrink-0" />
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <h2 className="text-xl font-bold text-admin-primary">{vehicle.name}</h2>
                  <div className="flex flex-wrap gap-4 text-sm text-on-surface-variant">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-lg">person</span>{vehicle.passengers} {copy.passengers}</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-lg">luggage</span>{vehicle.luggage} {copy.bags}</span>
                  </div>
                  <p className="text-sm text-on-surface-variant">{details.feature}</p>
                  <ul className="grid grid-cols-1 gap-2 text-sm text-on-surface-variant sm:grid-cols-2">
                    {confirmedAmenities[language].map((amenity, index) => (
                      <li className="flex items-center gap-2" key={amenity}>
                        <span aria-hidden="true" className="material-symbols-outlined text-lg text-secondary">{amenityIcons[index]}</span>
                        <span>{amenity}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to={`/booking?vehicle=${encodeURIComponent(vehicle.bookingVehicleId)}`} className="mt-auto block rounded-lg bg-admin-primary px-5 py-3 text-center font-bold text-white hover:opacity-90">
                    {copy.bookVehicle}
                  </Link>
                </div>
              </article>
            )
          })}
        </section>
      </main>
    </div>
  )
}

export function ServicesPage() {
  const { language } = useLanguage()
  const copy = infoCopy[language]
  return <InfoPage content={pageContent(copy).services} copy={copy} isContact={false} />
}

export function ContactPage() {
  const { language } = useLanguage()
  const copy = infoCopy[language]
  return <InfoPage content={pageContent(copy).contact} copy={copy} isContact={true} />
}

function InfoPage({
  content,
  copy,
  isContact,
}: {
  copy: InfoCopy
  isContact: boolean
  content: {
    description: string
    eyebrow: string
    items: string[][]
    title: string
  }
}) {
  useEffect(() => {
    const previousTitle = document.title
    const description = document.querySelector('meta[name="description"]')
    const previousDescription = description?.getAttribute('content') ?? null
    const meta = description ?? document.createElement('meta')
    if (!description) {
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    document.title = `${content.title} | DalamanWay`
    meta.setAttribute('content', content.description)
    return () => {
      document.title = previousTitle
      if (previousDescription === null) {
        if (!description) meta.remove()
        else meta.removeAttribute('content')
      } else {
        meta.setAttribute('content', previousDescription)
      }
    }
  }, [content.title, content.description])

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <PublicNavbar />
      <main className="pt-32 pb-20 px-margin-page max-w-7xl mx-auto">
        <section className="max-w-3xl mb-12">
          <p className="font-label-sm text-label-sm uppercase text-secondary mb-4">
            {content.eyebrow}
          </p>
          <h1 className="font-display-lg text-display-lg text-admin-primary mb-4">
            {content.title}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            {content.description}
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-gutter-grid">
          {content.items.map(([title, description]) => (
            <article
              className="bg-white border border-outline-variant rounded-xl p-6 card-soft-shadow"
              key={title}
            >
              <h2 className="font-title-md text-title-md text-admin-primary mb-2">
                {title}
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {description}
              </p>
            </article>
          ))}
        </section>

        {isContact && (
          <section aria-label={copy.contactLabel} className="mt-8 rounded-xl border border-outline-variant bg-white p-6">
            <h2 className="font-title-md text-title-md text-admin-primary mb-4">{copy.contactUs}</h2>
            <div className="flex flex-col gap-3">
              <a className="text-admin-primary underline underline-offset-4" href={`mailto:${supportEmail}`}>{copy.email} {supportEmail}</a>
            </div>
          </section>
        )}

        <div className="mt-12 flex flex-col sm:flex-row gap-stack-md">
          <Link
            className="inline-flex justify-center bg-admin-primary text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
            to="/booking"
          >
            {copy.book}
          </Link>
          <Link
            className="inline-flex justify-center bg-white border border-outline-variant text-admin-primary px-8 py-3 rounded-lg font-bold hover:bg-slate-100 transition-colors"
            to="/"
          >
            {copy.home}
          </Link>
        </div>
      </main>
    </div>
  )
}
