import { Link } from 'react-router-dom'
import { useLanguage } from '../../shared/localization/language'

const copy = {
  en: {
    title: 'Your transfer, from booking to arrival',
    intro: 'From your booking request to airport meet-and-greet and arrival, here is how your private transfer works.',
    steps: [
      ['1. Send your request', 'Choose your route, vehicle, pickup time and contact details. A request is not confirmed until our team accepts it.'],
      ['2. Receive confirmation', 'We confirm your transfer details and the applicable price and cancellation terms in writing. Keep your booking reference handy.'],
      ['3. Confirm your pickup on WhatsApp', 'Around 24 hours before your pickup, we’ll message you on WhatsApp to ask if you’re still travelling as planned. Reply to confirm or let us know if anything has changed.'],
      ['4. Flight tracking and airport pickup', 'For airport pickups, your driver monitors your flight status and prepares for your arrival. Your pickup instructions explain where to meet your driver at the airport.'],
      ['5. Meet your driver', 'Your driver meets you at the airport meeting point stated in your pickup instructions. After landing, contact your driver directly using the provided details if you need help finding the meeting point. For hotel pickups, follow your confirmed pickup instructions.'],
      ['6. Enjoy your private transfer', 'Once you meet your driver, enjoy your private journey to the destination on your confirmed booking. If your flight details or travel plans change, let us know as soon as possible.'],
    ],
    note: 'Need help or haven’t received your pickup instructions? Message our team on WhatsApp. If you don’t use WhatsApp, let us know when booking so we can arrange another way to reach you.',
    manage: 'Manage an existing booking',
  },
  de: {
    title: 'Wie läuft Ihr Transfer ab?',
    intro: 'Von der Buchungsanfrage über die Flughafenbegrüßung bis zur Ankunft: So läuft Ihr Privattransfer ab.',
    steps: [
      ['1. Anfrage senden', 'Wählen Sie Strecke, Fahrzeug, Abholzeit und Kontaktdaten. Die Anfrage gilt erst nach Bestätigung durch unser Team als gebucht.'],
      ['2. Bestätigung erhalten', 'Wir bestätigen Transferdaten, Preis und geltende Stornobedingungen schriftlich. Bewahren Sie Ihre Buchungsnummer auf.'],
      ['3. Abholung per WhatsApp bestätigen', 'Etwa 24 Stunden vor der Abholung fragen wir Sie per WhatsApp, ob Ihre Fahrt wie geplant stattfindet. Antworten Sie kurz zur Bestätigung oder teilen Sie uns Änderungen mit.'],
      ['4. Flugverfolgung und Flughafenabholung', 'Bei Abholungen am Flughafen verfolgt Ihr Fahrer den Flugstatus und bereitet sich auf Ihre Ankunft vor. In Ihren Abholhinweisen steht, wo Sie Ihren Fahrer am Flughafen treffen.'],
      ['5. Fahrer treffen', 'Ihr Fahrer erwartet Sie am in den Abholhinweisen genannten Treffpunkt am Flughafen. Wenn Sie nach der Landung Hilfe brauchen, erreichen Sie ihn direkt über die angegebenen Kontaktdaten. Bei Hotelabholungen gelten die bestätigten Abholhinweise.'],
      ['6. Privattransfer genießen', 'Nach dem Treffen mit Ihrem Fahrer fahren Sie privat zu Ihrem bestätigten Ziel. Informieren Sie uns möglichst früh über Änderungen Ihrer Flugdaten oder Reisepläne.'],
    ],
    note: 'Brauchen Sie Hilfe oder fehlen die Abholhinweise? Schreiben Sie unserem Team per WhatsApp. Wenn Sie WhatsApp nicht nutzen, geben Sie bei der Buchung eine andere Kontaktmöglichkeit an.',
    manage: 'Bestehende Buchung verwalten',
  },
  ru: {
    title: 'Как проходит ваш трансфер?',
    intro: 'От заявки на бронирование до встречи в аэропорту и прибытия: как проходит ваш индивидуальный трансфер.',
    steps: [
      ['1. Отправьте заявку', 'Выберите маршрут, автомобиль, время подачи и укажите контакты. Заявка считается подтверждённой только после ответа нашей команды.'],
      ['2. Получите подтверждение', 'Мы письменно подтвердим детали поездки, цену и условия отмены. Сохраните номер бронирования.'],
      ['3. Подтвердите поездку в WhatsApp', 'Примерно за 24 часа до подачи машины мы напишем вам в WhatsApp и уточним, всё ли в силе. Подтвердите поездку ответным сообщением или сообщите нам об изменениях.'],
      ['4. Отслеживание рейса и встреча в аэропорту', 'При встрече в аэропорту водитель отслеживает статус вашего рейса и готовится к прибытию. Место встречи с водителем указано в инструкции по трансферу.'],
      ['5. Встреча с водителем', 'Водитель встретит вас в указанном в инструкции месте аэропорта. После приземления при необходимости свяжитесь с ним напрямую по предоставленным контактам. При встрече у отеля следуйте подтверждённым инструкциям.'],
      ['6. Частная поездка', 'После встречи с водителем отправляйтесь в индивидуальную поездку по подтверждённому маршруту. Если данные рейса или планы изменились, сообщите нам как можно раньше.'],
    ],
    note: 'Нужна помощь или не получили инструкцию по встрече? Напишите нашей команде в WhatsApp. Если вы не пользуетесь WhatsApp, укажите другой способ связи при бронировании.',
    manage: 'Управление бронированием',
  },
} as const

export function TransferJourneyGuide() {
  const { language } = useLanguage()
  const text = copy[language]
  return (
    <section aria-labelledby="transfer-journey-title" className="border-y border-outline bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-container-max px-gutter">
        <h2 id="transfer-journey-title" className="font-headline-lg text-headline-lg text-on-surface">{text.title}</h2>
        <p className="mt-3 max-w-3xl text-on-surface-variant">{text.intro}</p>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {text.steps.map(([heading, detail]) => (
            <li key={heading} className="rounded-2xl border border-outline bg-white p-6">
              <h3 className="font-title-md text-on-surface">{heading}</h3>
              <p className="mt-2 text-sm leading-6 text-on-surface-variant">{detail}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 max-w-4xl border-l-4 border-secondary pl-4 text-sm leading-6 text-on-surface-variant">{text.note}</p>
        <Link className="mt-4 inline-block font-semibold text-secondary underline" to="/booking/lookup">{text.manage}</Link>
      </div>
    </section>
  )
}
