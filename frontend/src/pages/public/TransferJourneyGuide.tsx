import { Link } from 'react-router-dom'
import { useLanguage } from '../../shared/localization/language'

const copy = {
  en: {
    title: 'What happens after you request a transfer?',
    intro: 'Know what to expect before you travel. We keep your booking details and pickup instructions clear.',
    steps: [
      ['1. Send your request', 'Choose your route, vehicle, pickup time and contact details. A request is not confirmed until our team accepts it.'],
      ['2. Receive confirmation', 'We confirm your transfer details and the applicable price and cancellation terms in writing. Keep your booking reference handy.'],
      ['3. The day before', 'For confirmed transfers, our team plans to contact you via WhatsApp to check your pickup details. Please provide a number that works on WhatsApp.'],
      ['4. On transfer day', 'Your assigned driver or our team will contact you with meeting instructions. Keep your phone available after landing or before hotel pickup.'],
      ['5. Meet your driver', 'Follow the meeting instructions provided for your terminal or accommodation. If you cannot find your driver, contact our team before leaving the pickup area.'],
      ['6. Enjoy your private transfer', 'Travel directly to the destination on your confirmed booking. If your flight or plans change, tell us as soon as possible.'],
    ],
    note: 'WhatsApp messages depend on a valid reachable number and driver assignment. If you do not use WhatsApp, please tell us when booking so we can arrange another contact method. Contact us if you have not received pickup instructions.',
    manage: 'Manage an existing booking',
  },
  de: {
    title: 'Wie läuft Ihr Transfer ab?',
    intro: 'Erfahren Sie schon vor der Reise, wie Buchungsbestätigung und Abholung ablaufen.',
    steps: [
      ['1. Anfrage senden', 'Wählen Sie Strecke, Fahrzeug, Abholzeit und Kontaktdaten. Die Anfrage gilt erst nach Bestätigung durch unser Team als gebucht.'],
      ['2. Bestätigung erhalten', 'Wir bestätigen Transferdaten, Preis und geltende Stornobedingungen schriftlich. Bewahren Sie Ihre Buchungsnummer auf.'],
      ['3. Am Vortag', 'Bei bestätigten Transfers plant unser Team, Sie per WhatsApp zu kontaktieren und die Abholdaten zu prüfen. Geben Sie eine über WhatsApp erreichbare Nummer an.'],
      ['4. Am Transfertag', 'Ihr zugewiesener Fahrer oder unser Team meldet sich mit Informationen zum Treffpunkt. Halten Sie Ihr Telefon nach der Landung oder vor der Hotelabholung bereit.'],
      ['5. Fahrer treffen', 'Folgen Sie den mitgeteilten Anweisungen für Terminal oder Unterkunft. Falls Sie den Fahrer nicht finden, kontaktieren Sie uns, bevor Sie den Treffpunkt verlassen.'],
      ['6. Privattransfer genießen', 'Fahren Sie zu Ihrem bestätigten Ziel. Informieren Sie uns möglichst früh über Flug- oder Planänderungen.'],
    ],
    note: 'WhatsApp-Nachrichten setzen eine erreichbare Nummer und die Fahrerzuweisung voraus. Wenn Sie WhatsApp nicht nutzen, nennen Sie bei der Buchung eine andere Kontaktmöglichkeit. Melden Sie sich, falls Sie keine Abholinformationen erhalten.',
    manage: 'Bestehende Buchung verwalten',
  },
  ru: {
    title: 'Как проходит ваш трансфер?',
    intro: 'Заранее узнайте, как происходит подтверждение заказа и встреча с водителем.',
    steps: [
      ['1. Отправьте заявку', 'Выберите маршрут, автомобиль, время подачи и укажите контакты. Заявка считается подтверждённой только после ответа нашей команды.'],
      ['2. Получите подтверждение', 'Мы письменно подтвердим детали поездки, цену и условия отмены. Сохраните номер бронирования.'],
      ['3. За день до поездки', 'Для подтверждённых трансферов наша команда планирует связаться с вами через WhatsApp, чтобы уточнить детали встречи. Укажите доступный номер WhatsApp.'],
      ['4. В день трансфера', 'Назначенный водитель или наша команда свяжется с вами и сообщит место встречи. Держите телефон включённым после посадки или перед выездом из отеля.'],
      ['5. Встреча с водителем', 'Следуйте полученным инструкциям для терминала или отеля. Если не можете найти водителя, свяжитесь с нами, прежде чем уходить с места встречи.'],
      ['6. Частная поездка', 'Отправляйтесь по подтверждённому маршруту. Если рейс или планы изменились, сообщите нам как можно раньше.'],
    ],
    note: 'Для связи через WhatsApp нужен доступный номер и назначенный водитель. Если вы не используете WhatsApp, укажите другой способ связи при бронировании. Если инструкции по встрече не пришли, свяжитесь с нами.',
    manage: 'Управление бронированием',
  },
} as const

export function TransferJourneyGuide() {
  const { language } = useLanguage()
  const text = copy[language]
  return (
    <section aria-labelledby="transfer-journey-title" className="bg-white py-16 border-y border-outline">
      <div className="mx-auto max-w-container-max px-gutter">
        <h2 id="transfer-journey-title" className="font-headline-lg text-headline-lg text-on-surface">{text.title}</h2>
        <p className="mt-3 max-w-3xl text-on-surface-variant">{text.intro}</p>
        <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {text.steps.map(([heading, detail]) => (
            <li key={heading} className="rounded-xl border border-outline bg-background p-5">
              <h3 className="font-title-md text-on-surface">{heading}</h3>
              <p className="mt-2 text-sm leading-6 text-on-surface-variant">{detail}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 max-w-4xl text-sm text-on-surface-variant">{text.note}</p>
        <Link className="mt-4 inline-block font-semibold text-secondary underline" to="/booking/lookup">{text.manage}</Link>
      </div>
    </section>
  )
}
