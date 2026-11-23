import { Link } from 'react-router-dom'
import { useLanguage } from '../../shared/localization/language'
import { PublicNavbar } from './PublicNavbar'

const policy = {
  en: {
    title: 'Changes, cancellations and refunds',
    intro: 'We want you to know what happens when travel plans change. The time limit below is measured from each affected pickup time in Türkiye local time.',
    freeTitle: 'At least 24 hours before pickup',
    free: 'You may request a cancellation or change without a DalamanWay service fee. A change is subject to vehicle and driver availability. If the change affects the quoted fare, we will tell you the difference and get your approval before updating the booking.',
    lateTitle: 'Less than 24 hours before pickup',
    late: 'You can still submit a request. Contact us as soon as possible, especially for a same-day transfer. The team will check whether it can be accommodated and explain any applicable cost before you decide. A request does not change or cancel the booking; wait for written confirmation.',
    returnsTitle: 'Return journeys and flight changes',
    returns: 'The 24-hour period is assessed separately for each affected pickup, including a return transfer. If your airline changes or cancels a flight, contact us promptly with your booking reference and updated flight details so the team can review the options.',
    paymentTitle: 'Payment and refunds',
    payment: 'The online form collects a transfer request and does not take payment. Pay the driver in cash at the end of your journey. If a payment has been collected, any refund will be handled under the terms disclosed for that payment and applicable consumer rights.',
    confirmationTitle: 'How to request a change or cancellation',
    confirmation: 'Open Manage My Booking and enter the booking reference plus the email address saved on the booking. We record the request for the operations team. The original booking remains in place until we confirm the result in writing.',
    rights: 'This operational policy does not limit any mandatory rights that apply under consumer law.',
    manage: 'Manage My Booking', book: 'Make a booking',
  },
  de: {
    title: 'Änderungen, Stornierungen und Erstattungen',
    intro: 'Wir möchten klar erklären, was bei geänderten Reiseplänen passiert. Die Frist wird ab der jeweils betroffenen Abholzeit nach Ortszeit in Türkiye berechnet.',
    freeTitle: 'Mindestens 24 Stunden vor der Abholung',
    free: 'Sie können eine Änderung oder Stornierung ohne DalamanWay-Servicegebühr anfragen. Änderungen hängen von der Verfügbarkeit von Fahrzeug und Fahrer ab. Wenn sich der Richtpreis ändert, nennen wir Ihnen die Differenz und holen Ihre Zustimmung ein, bevor wir die Buchung aktualisieren.',
    lateTitle: 'Weniger als 24 Stunden vor der Abholung',
    late: 'Sie können weiterhin eine Anfrage senden. Kontaktieren Sie uns so bald wie möglich, besonders bei einer Fahrt am selben Tag. Unser Team prüft die Umsetzbarkeit und nennt mögliche Kosten, bevor Sie entscheiden. Die Anfrage allein ändert oder storniert die Buchung nicht; warten Sie auf die schriftliche Bestätigung.',
    returnsTitle: 'Rückfahrten und Flugänderungen',
    returns: 'Die 24-Stunden-Frist gilt separat für jede betroffene Abholung, auch bei einer Rückfahrt. Wenn die Fluggesellschaft Ihren Flug ändert oder annulliert, kontaktieren Sie uns bitte zeitnah mit Buchungsnummer und aktualisierten Flugdaten.',
    paymentTitle: 'Zahlung und Erstattung',
    payment: 'Das Online-Formular nimmt nur Transferanfragen an und erhebt keine Zahlung. Bezahlen Sie den Fahrer am Ende der Fahrt in bar. Falls eine Zahlung eingegangen ist, erfolgt eine Erstattung gemäß den für diese Zahlung mitgeteilten Bedingungen und den anwendbaren Verbraucherrechten.',
    confirmationTitle: 'So beantragen Sie eine Änderung oder Stornierung',
    confirmation: 'Öffnen Sie „Meine Buchung verwalten“ und geben Sie Buchungsnummer sowie die bei der Buchung gespeicherte E-Mail-Adresse ein. Wir speichern die Anfrage für unser Team. Die ursprüngliche Buchung bleibt bestehen, bis wir das Ergebnis schriftlich bestätigen.',
    rights: 'Diese Betriebsrichtlinie schränkt keine zwingenden Verbraucherrechte ein.',
    manage: 'Meine Buchung verwalten', book: 'Transfer anfragen',
  },
  ru: {
    title: 'Изменение, отмена и возврат средств',
    intro: 'Мы заранее объясняем порядок действий при изменении планов. Срок рассчитывается отдельно от времени каждой затронутой подачи автомобиля по местному времени Турции.',
    freeTitle: 'Не позднее чем за 24 часа до подачи',
    free: 'Вы можете запросить изменение или отмену без сервисного сбора DalamanWay. Изменение зависит от наличия автомобиля и водителя. Если изменится расчётная стоимость, мы сообщим разницу и получим ваше согласие до обновления бронирования.',
    lateTitle: 'Менее чем за 24 часа до подачи',
    late: 'Запрос всё равно можно отправить. Свяжитесь с нами как можно скорее, особенно если поездка сегодня. Команда проверит возможность и заранее сообщит о возможной оплате. Сам запрос не меняет и не отменяет бронирование — дождитесь письменного подтверждения.',
    returnsTitle: 'Обратные поездки и изменения рейса',
    returns: 'Срок в 24 часа рассчитывается отдельно для каждой затронутой подачи, включая обратную поездку. Если авиакомпания изменила или отменила рейс, как можно скорее сообщите номер бронирования и новые данные рейса.',
    paymentTitle: 'Оплата и возвраты',
    payment: 'Онлайн-форма принимает заявку на трансфер, но не списывает оплату. Оплатите поездку водителю наличными в конце поездки. Если оплата была получена, возврат оформляется по условиям, сообщённым при оплате, и с учётом применимых прав потребителя.',
    confirmationTitle: 'Как запросить изменение или отмену',
    confirmation: 'Откройте раздел управления бронированием и введите номер бронирования и адрес электронной почты, сохранённый в заявке. Мы зарегистрируем запрос для операционной команды. Исходное бронирование остаётся без изменений до письменного подтверждения результата.',
    rights: 'Эти правила не ограничивают обязательные права потребителей, предусмотренные применимым законодательством.',
    manage: 'Управление бронированием', book: 'Заказать трансфер',
  },
}

export function BookingPolicyPage() {
  const { language } = useLanguage()
  const text = policy[language]
  const sections = [
    [text.freeTitle, text.free],
    [text.lateTitle, text.late],
    [text.returnsTitle, text.returns],
    [text.paymentTitle, text.payment],
    [text.confirmationTitle, text.confirmation],
  ]

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <PublicNavbar />
      <main className="mx-auto max-w-3xl px-5 pb-24 pt-32">
        <h1 className="mb-4 text-3xl font-bold text-admin-primary">{text.title}</h1>
        <p className="mb-8 text-on-surface-variant">{text.intro}</p>
        <div className="space-y-5">
          {sections.map(([heading, body]) => (
            <section key={heading} className="rounded-lg border border-outline bg-white p-5 sm:p-6">
              <h2 className="text-lg font-bold text-admin-primary">{heading}</h2>
              <p className="mt-2 leading-7 text-on-surface-variant">{body}</p>
            </section>
          ))}
        </div>
        <p className="mt-5 text-sm text-on-surface-variant">{text.rights}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/booking/lookup" className="rounded-lg bg-admin-primary px-5 py-3 font-semibold text-white">{text.manage}</Link>
          <Link to="/booking" className="rounded-lg border border-outline bg-white px-5 py-3 font-semibold text-admin-primary">{text.book}</Link>
        </div>
      </main>
    </div>
  )
}
