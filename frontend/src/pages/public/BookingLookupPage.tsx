import { useState } from 'react'
import { Link } from 'react-router-dom'

import { bookingSupportLink, whatsappSupportEnabled } from '../../features/booking/support'
import { useLanguage } from '../../shared/localization/language'
import { PublicNavbar } from './PublicNavbar'

const lookupCopy = {
  en: {
    title: "Manage My Booking",
    intro: "Need to change or cancel your transfer? Enter your booking reference to contact our team.",
    support: "Booking support request",
    reference: "Booking reference",
    example: "e.g. 1042",
    identity: "Your reference is included in the message. We will verify your identity using the contact details saved with the booking before making any changes.",
    change: "Request Change via",
    cancel: "Request Cancellation via",
    invalid: "Enter a valid booking reference to continue.",
    confirmation: "Sending a message does not change or cancel your booking. Wait for written confirmation from our team.",
    security: "Do not share passwords, payment card details or verification codes in messages.",
    newBooking: "New Booking Request",
    contact: "Contact",
    email: "Email",
  },
  de: {
    title: "Meine Buchung verwalten",
    intro: "Möchten Sie Ihren Transfer ändern oder stornieren? Geben Sie Ihre Buchungsnummer ein, um unser Team zu kontaktieren.",
    support: "Anfrage zu einer Buchung",
    reference: "Buchungsnummer",
    example: "z. B. 1042",
    identity: "Ihre Buchungsnummer wird in die Nachricht übernommen. Vor einer Änderung bestätigen wir Ihre Identität anhand der bei der Buchung gespeicherten Kontaktdaten.",
    change: "Änderung anfragen per",
    cancel: "Stornierung anfragen per",
    invalid: "Geben Sie eine gültige Buchungsnummer ein, um fortzufahren.",
    confirmation: "Ihre Buchung wird durch das Senden der Nachricht weder geändert noch storniert. Warten Sie auf die schriftliche Bestätigung unseres Teams.",
    security: "Senden Sie keine Passwörter, Kartendaten oder Bestätigungscodes in Nachrichten.",
    newBooking: "Neue Buchungsanfrage",
    contact: "Kontakt",
    email: "E-Mail",
  },
  ru: {
    title: "Управление бронированием",
    intro: "Хотите изменить или отменить трансфер? Введите номер бронирования, чтобы связаться с нашей командой.",
    support: "Запрос в службу поддержки",
    reference: "Номер бронирования",
    example: "например, 1042",
    identity: "Номер бронирования будет указан в сообщении. Перед внесением изменений мы подтвердим вашу личность по контактным данным, указанным при бронировании.",
    change: "Запросить изменение через",
    cancel: "Запросить отмену через",
    invalid: "Введите действительный номер бронирования, чтобы продолжить.",
    confirmation: "Отправка сообщения сама по себе не изменяет и не отменяет бронирование. Дождитесь письменного подтверждения от нашей команды.",
    security: "Не отправляйте пароли, данные банковских карт или коды подтверждения в сообщениях.",
    newBooking: "Новая заявка на бронирование",
    contact: "Контакты",
    email: "электронную почту",
  },
}

export function BookingLookupPage() {
  const { language } = useLanguage()
  const copy = lookupCopy[language]
  const [reference, setReference] = useState('')
  const validReference = /^[1-9][0-9]{0,15}$/.test(reference.trim())
  const contactMethod = whatsappSupportEnabled() ? 'WhatsApp' : copy.email

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <PublicNavbar />
      <main className="mx-auto max-w-2xl px-5 pb-24 pt-32">
        <h1 className="mb-4 text-3xl font-bold text-admin-primary">{copy.title}</h1>
        <p className="mb-8 text-on-surface-variant">
          {copy.intro}
        </p>
        <section className="rounded-lg border border-outline bg-white p-6" aria-label={copy.support}>
          <label htmlFor="booking-reference" className="block text-sm font-semibold">
            {copy.reference}
          </label>
          <input
            id="booking-reference"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={reference}
            onChange={event => setReference(event.target.value)}
            placeholder={copy.example}
            className="mt-2 block w-full rounded-lg border border-outline px-4 py-3"
          />
          <p className="mt-3 text-sm text-on-surface-variant">
            {copy.identity}
          </p>
          {validReference ? (
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={bookingSupportLink(reference, 'change')}
                target={whatsappSupportEnabled() ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="rounded-lg bg-admin-primary px-5 py-3 font-semibold text-white">
                {copy.change} {contactMethod}
              </a>
              <a href={bookingSupportLink(reference, 'cancel')}
                target={whatsappSupportEnabled() ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="rounded-lg border border-outline px-5 py-3 font-semibold text-admin-primary">
                {copy.cancel} {contactMethod}
              </a>
            </div>
          ) : (
            <p className="mt-5 text-sm text-on-surface-variant">
              {copy.invalid}
            </p>
          )}
          <p className="mt-5 text-sm text-on-surface-variant">
            {copy.confirmation}
          </p>
        </section>
        <p className="mt-6 text-sm text-on-surface-variant">
          {copy.security}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="rounded-lg bg-admin-primary px-6 py-3 font-semibold text-white"
            to="/booking">{copy.newBooking}</Link>
          <Link className="rounded-lg border border-outline bg-white px-6 py-3 font-semibold text-admin-primary"
            to="/contact">{copy.contact}</Link>
        </div>
      </main>
    </div>
  )
}
