import { Link } from 'react-router-dom'
import { useLanguage } from '../../shared/localization/language'

const copy = {
  en: {
    title: 'Your transfer, from booking to arrival',
    intro: 'Know what to expect before you travel. We keep your booking details and pickup instructions clear.',
    steps: [
      ['1. Send your request', 'Choose your route, vehicle, pickup time and contact details. A request is not confirmed until our team accepts it.'],
      ['2. Receive confirmation', 'We confirm your transfer details and the applicable price and cancellation terms in writing. Keep your booking reference handy.'],
      ['3. Confirm your pickup on WhatsApp', 'Around 24 hours before your pickup, we’ll message you on WhatsApp to ask if you’re still travelling as planned. Reply to confirm or let us know if anything has changed.'],
      ['4. On transfer day', 'Your driver or our team will share where to meet. After landing, use the contact details in your pickup instructions to reach your driver directly if you need help finding them.'],
      ['5. Meet your driver', 'Follow the meeting instructions provided for your terminal or accommodation. If you cannot find your driver, contact our team before leaving the pickup area.'],
      ['6. Enjoy your private transfer', 'Travel directly to the destination on your confirmed booking. If your flight or plans change, tell us as soon as possible.'],
    ],
    note: 'Need help or haven’t received your pickup instructions? Message our team on WhatsApp. If you don’t use WhatsApp, let us know when booking so we can arrange another way to reach you.',
    manage: 'Manage an existing booking',
  },
  de: {
    title: 'Wie läuft Ihr Transfer ab?',
    intro: 'Erfahren Sie schon vor der Reise, wie Buchungsbestätigung und Abholung ablaufen.',
    steps: [
      ['1. Anfrage senden', 'Wählen Sie Strecke, Fahrzeug, Abholzeit und Kontaktdaten. Die Anfrage gilt erst nach Bestätigung durch unser Team als gebucht.'],
      ['2. Bestätigung erhalten', 'Wir bestätigen Transferdaten, Preis und geltende Stornobedingungen schriftlich. Bewahren Sie Ihre Buchungsnummer auf.'],
      ['3. Abholung per WhatsApp bestätigen', 'Etwa 24 Stunden vor der Abholung fragen wir Sie per WhatsApp, ob Ihre Fahrt wie geplant stattfindet. Antworten Sie kurz zur Bestätigung oder teilen Sie uns Änderungen mit.'],
      ['4. Am Transfertag', 'Ihr Fahrer oder unser Team teilt Ihnen den Treffpunkt mit. Wenn Sie nach der Landung Hilfe brauchen, erreichen Sie Ihren Fahrer direkt über die Kontaktdaten in den Abholhinweisen.'],
      ['5. Fahrer treffen', 'Folgen Sie den mitgeteilten Anweisungen für Terminal oder Unterkunft. Falls Sie den Fahrer nicht finden, kontaktieren Sie uns, bevor Sie den Treffpunkt verlassen.'],
      ['6. Privattransfer genießen', 'Fahren Sie zu Ihrem bestätigten Ziel. Informieren Sie uns möglichst früh über Flug- oder Planänderungen.'],
    ],
    note: 'Brauchen Sie Hilfe oder fehlen die Abholhinweise? Schreiben Sie unserem Team per WhatsApp. Wenn Sie WhatsApp nicht nutzen, geben Sie bei der Buchung eine andere Kontaktmöglichkeit an.',
    manage: 'Bestehende Buchung verwalten',
  },
  ru: {
    title: 'Как проходит ваш трансфер?',
    intro: 'Заранее узнайте, как происходит подтверждение заказа и встреча с водителем.',
    steps: [
      ['1. Отправьте заявку', 'Выберите маршрут, автомобиль, время подачи и укажите контакты. Заявка считается подтверждённой только после ответа нашей команды.'],
      ['2. Получите подтверждение', 'Мы письменно подтвердим детали поездки, цену и условия отмены. Сохраните номер бронирования.'],
      ['3. Подтвердите поездку в WhatsApp', 'Примерно за 24 часа до подачи машины мы напишем вам в WhatsApp и уточнить, всё ли в силе. Подтвердите поездку ответным сообщением или сообщите нам об изменениях.'],
      ['4. В день трансфера', 'Ваш водитель или наша команда сообщит место встречи. Если после приземления вам понадобится помощь, свяжитесь напрямую с водителем по контактам в инструкции по встрече.'],
      ['5. Встреча с водителем', 'Следуйте полученным инструкциям для терминала или отеля. Если не можете найти водителя, свяжитесь с нами, прежде чем уходить с места встречи.'],
      ['6. Частная поездка', 'Отправляйтесь по подтверждённому маршруту. Если рейс или планы изменились, сообщите нам как можно раньше.'],
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
