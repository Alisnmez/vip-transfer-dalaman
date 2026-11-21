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
    delayedAnswer: "Please include your flight number if you have one and contact us if your travel details change. Pickup arrangements will be confirmed by the operator.",
    seat: "Can I request a child seat?",
    seatAnswer: "Yes. Select the number of baby seats in the booking form. Availability will be confirmed with your booking.",
    cancelFaq: "How can I change or cancel my booking?",
    cancelAnswer: "Use Manage Booking with your booking reference and booking email. Requests made at least 24 hours before the affected pickup (Türkiye local time) have no DalamanWay service fee. Requests within 24 hours are still reviewed, with any applicable cost confirmed before you decide. The booking is unchanged until we confirm in writing.",
    confirmed: "How will I know my booking is confirmed?",
    confirmedAnswer: "After submitting your request, keep the booking reference. The operator will confirm the booking details separately.",
    book: "Book Your Transfer",
    bookVehicle: "Book a Transfer",
    fleet: "Our Vehicles",
    fleetTitle: "Professional Transfer Vehicles",
    fleetIntro: "Explore our vehicle categories and choose the right option for your transfer. Models are examples; a similar vehicle may be assigned. Equipment, availability and luggage space are confirmed before travel. Luggage limits depend on the selected vehicle.",
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
    delayedAnswer: "Geben Sie nach Möglichkeit Ihre Flugnummer an und kontaktieren Sie uns bei Änderungen. Der Anbieter bestätigt die Einzelheiten der Abholung.",
    seat: "Kann ich einen Kindersitz anfragen?",
    seatAnswer: "Ja. Wählen Sie die Anzahl der Kindersitze im Buchungsformular. Die Verfügbarkeit wird mit der Buchung bestätigt.",
    cancelFaq: "Wie kann ich meine Buchung ändern oder stornieren?",
    cancelAnswer: "Nutzen Sie „Buchung verwalten“ mit Buchungsnummer und Buchungs-E-Mail. Anfragen mindestens 24 Stunden vor der betroffenen Abholung (Ortszeit Türkiye) sind ohne DalamanWay-Servicegebühr möglich. Anfragen innerhalb von 24 Stunden prüfen wir weiterhin und nennen mögliche Kosten, bevor Sie entscheiden. Die Buchung bleibt bis zu unserer schriftlichen Bestätigung unverändert.",
    confirmed: "Woran erkenne ich, dass meine Buchung bestätigt wurde?",
    confirmedAnswer: "Bewahren Sie nach dem Absenden Ihre Buchungsnummer auf. Der Anbieter bestätigt die Buchungsdaten separat.",
    book: "Transfer buchen",
    bookVehicle: "Transfer buchen",
    fleet: "Unsere Fahrzeuge",
    fleetTitle: "Fahrzeuge für professionelle Transfers",
    fleetIntro: "Entdecken Sie unsere Fahrzeugkategorien und wählen Sie das passende Fahrzeug. Die Modelle dienen als Beispiele, ein vergleichbares Fahrzeug kann eingesetzt werden. Ausstattung, Verfügbarkeit und Gepäckraum werden vor Reiseantritt bestätigt. Die Gepäckgrenze hängt vom Fahrzeug ab.",
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
    delayedAnswer: "Укажите номер рейса, если он известен, и свяжитесь с нами, если планы изменятся. Оператор подтвердит условия встречи.",
    seat: "Можно ли заказать детское кресло?",
    seatAnswer: "Да. Укажите количество детских кресел в форме. Наличие подтвердят при бронировании.",
    cancelFaq: "Как изменить или отменить бронирование?",
    cancelAnswer: "Откройте управление бронированием и укажите номер бронирования и электронную почту из заказа. Запросы не позднее чем за 24 часа до затронутой подачи (местное время Турции) принимаются без сервисного сбора DalamanWay. Запросы менее чем за 24 часа также рассматриваются; возможную стоимость сообщим до вашего решения. Бронирование не отменено, пока мы письменно это не подтвердим.",
    confirmed: "Как узнать, что бронирование подтверждено?",
    confirmedAnswer: "После отправки заявки сохраните номер бронирования. Оператор подтвердит детали отдельно.",
    book: "Забронировать трансфер",
    bookVehicle: "Забронировать трансфер",
    fleet: "Наши автомобили",
    fleetTitle: "Автомобили для трансфера",
    fleetIntro: "Выберите подходящую категорию автомобиля. Модели приведены в качестве примера, возможна подача аналогичного автомобиля. Комплектацию, наличие и багажное пространство подтвердят до поездки. Норма багажа зависит от автомобиля.",
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
    'vip-minivan': {
      feature: 'Mercedes-Benz Vito mit VIP-Standardausstattung für Familien und kleine Gruppen.',
      amenities: ['Bequeme VIP-Sitze', 'Offener Innenraum ohne Fahrertrennwand', 'Klimaanlage', 'WLAN und Wasser nach Bestätigung'],
    },
    maybach: {
      feature: 'Mercedes-Benz Vito mit Innenraum im Maybach-Stil und zusätzlicher Privatsphäre.',
      amenities: ['Premiumsitze und Ambientebeleuchtung', 'Fahrertrennwand', 'TV, Kühlschrank und Multimedia nach Bestätigung', 'WLAN und Erfrischungen nach Bestätigung'],
    },
    'minibus-long': {
      feature: 'Mercedes-Benz Sprinter mit viel Platz für Familien und Gruppen.',
      amenities: ['VIP-Standardausstattung und bequeme Sitze', 'Offener Innenraum ohne Fahrertrennwand', 'Klimaanlage', 'Gepäckmaße vor der Reise mit dem Anbieter klären'],
    },
    'vip-minibus': {
      feature: 'Mercedes-Benz Sprinter mit gehobener VIP-Ausstattung für kleinere Gruppen.',
      amenities: ['Premiumsitze und Fahrertrennwand', 'Zwei Bildschirme und PlayStation nach Bestätigung', 'WLAN und Erfrischungen nach Bestätigung', 'Gepäckmaße vor der Reise mit dem Anbieter klären'],
    },
  },
  ru: {
    'vip-minivan': {
      feature: 'Mercedes-Benz Vito со стандартным VIP-салоном для семей и небольших групп.',
      amenities: ['Удобные VIP-кресла', 'Открытый салон без перегородки', 'Кондиционер', 'Wi-Fi и вода после подтверждения'],
    },
    maybach: {
      feature: 'Mercedes-Benz Vito с салоном в стиле Maybach и повышенной приватностью.',
      amenities: ['Премиальные кресла и подсветка', 'Перегородка между салоном и водителем', 'Телевизор, холодильник и мультимедиа после подтверждения', 'Wi-Fi и напитки после подтверждения'],
    },
    'minibus-long': {
      feature: 'Просторный микроавтобус Mercedes-Benz Sprinter для семей и групп.',
      amenities: ['Стандартный VIP-салон и удобные сиденья', 'Открытый салон без перегородки', 'Кондиционер', 'Уточните размеры багажа у оператора до поездки'],
    },
    'vip-minibus': {
      feature: 'Mercedes-Benz Sprinter с улучшенным VIP-салоном для небольших групп.',
      amenities: ['Премиальные кресла и перегородка', 'Два экрана и PlayStation после подтверждения', 'Wi-Fi и напитки после подтверждения', 'Уточните размеры багажа у оператора до поездки'],
    },
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
            const details = language === 'en' ? vehicle : fleetCopy[language][vehicle.bookingVehicleId]
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
                  <ul className="space-y-2 text-sm text-on-surface-variant">
                    {details.amenities.map((amenity) => (
                      <li className="flex items-center gap-2" key={amenity}>
                        <span className="material-symbols-outlined text-base text-secondary">check_circle</span>
                        {amenity}
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
