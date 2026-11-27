import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { ProcessingButton } from '../../components/ProcessingButton'
import { isValidEmail } from '../../shared/utils/inputValidation'
import { BookingApiError } from '../../features/booking/api/errors'
import { submitBookingManagementRequest, lookupPublicBooking } from '../../features/booking/api'
import { downloadBookingPdf } from '../../features/booking/bookingPdf'
import { vehicleLabel } from '../../features/booking/bookingVehicles'
import type { PublicBookingView } from '../../features/booking/types'
import { useLanguage } from '../../shared/localization/language'
import { PublicNavbar } from './PublicNavbar'

const copy = {
  en: {
    title: 'Manage My Booking',
    intro: 'Request a change or cancellation. Enter the reference and the email address used for the booking so we can verify the request.',
    reference: 'Booking reference', example: 'e.g. T7K2MA8', email: 'Booking email address',
    requestType: 'What do you need?', change: 'Request a change', cancel: 'Request a cancellation',
    message: 'Tell us what you need', changePlaceholder: 'For example: request a different pickup time, update the hotel address, or change the passenger count.',
    cancelPlaceholder: 'Please confirm that you would like to cancel and add any details we should know.',
    sendChange: 'Send change request', sendCancel: 'Send cancellation request', sending: 'Sending request…',
    referenceError: 'Enter your 7-character booking reference (letters and numbers).', emailRequired: 'Enter the email address used for your booking.', emailInvalid: 'Enter a valid email address.', messageError: 'Describe the change or cancellation you are requesting.',
    bookingNotFound: 'No booking matches this reference and email address. Check both details and try again.', bookingUnavailable: 'This booking cannot accept a new request right now. It may already have an open request or the pickup date may have passed.',
    required: 'Complete all fields with the details saved for the booking.',
    successTitle: 'Request submitted',
    success: 'Your request has been recorded. We will email the address on the booking. Your booking remains unchanged until we confirm the outcome in writing.',
    another: 'Submit another request',
    error: 'We could not send the request. Please try again. If the issue continues, email our team with your booking reference.',
    policyTitle: 'Our change and cancellation policy',
    policy: 'Request a free change or cancellation at least 24 hours before the affected pickup time (Türkiye local time). Changes depend on availability; any fare difference will be shown before you approve it. Requests made within 24 hours are still accepted, but availability and any applicable charge must be confirmed by our team. Sending a request does not change or cancel the booking. Wait for written confirmation.',
    policyLink: 'Read the full policy',
    security: 'For your privacy, booking details are shown only when the reference and booking email match. Never share card details, passwords or verification codes.',
    newBooking: 'New booking', contact: 'Contact us',
  },
  de: {
    title: 'Meine Buchung verwalten',
    intro: 'Beantragen Sie eine Änderung oder Stornierung. Geben Sie die Buchungsnummer und die für die Buchung verwendete E-Mail-Adresse ein.',
    reference: 'Buchungsnummer', example: 'z. B. T7K2MA8', email: 'E-Mail-Adresse der Buchung',
    requestType: 'Worum geht es?', change: 'Änderung anfragen', cancel: 'Stornierung anfragen',
    message: 'Was möchten Sie ändern?', changePlaceholder: 'Zum Beispiel: andere Abholzeit, Hoteladresse aktualisieren oder Fahrgastzahl ändern.',
    cancelPlaceholder: 'Bestätigen Sie bitte Ihren Stornierungswunsch und ergänzen Sie wichtige Hinweise.',
    sendChange: 'Änderungsanfrage senden', sendCancel: 'Stornierungsanfrage senden', sending: 'Anfrage wird gesendet…',
    referenceError: 'Geben Sie Ihre 7-stellige Buchungsnummer aus Buchstaben und Ziffern ein.', emailRequired: 'Geben Sie die E-Mail-Adresse Ihrer Buchung ein.', emailInvalid: 'Geben Sie eine gültige E-Mail-Adresse ein.', messageError: 'Beschreiben Sie Ihre Änderungs- oder Stornierungsanfrage.',
    bookingNotFound: 'Keine Buchung stimmt mit dieser Buchungsnummer und E-Mail-Adresse überein. Bitte überprüfen Sie beide Angaben.', bookingUnavailable: 'Für diese Buchung kann derzeit keine neue Anfrage gestellt werden. Möglicherweise liegt bereits eine offene Anfrage vor oder die Abholzeit ist vorbei.',
    required: 'Bitte füllen Sie alle Felder mit den bei der Buchung verwendeten Angaben aus.',
    successTitle: 'Anfrage übermittelt',
    success: 'Ihre Anfrage wurde gespeichert. Wir schreiben an die in der Buchung hinterlegte Adresse. Ihre Buchung bleibt unverändert, bis wir das Ergebnis schriftlich bestätigen.',
    another: 'Weitere Anfrage senden',
    error: 'Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut. Falls das Problem bleibt, schreiben Sie uns mit Ihrer Buchungsnummer.',
    policyTitle: 'Regeln für Änderungen und Stornierungen',
    policy: 'Änderungs- und Stornierungswünsche sind bis mindestens 24 Stunden vor der jeweiligen Abholzeit (Ortszeit Türkiye) kostenlos möglich. Änderungen hängen von der Verfügbarkeit ab; einen möglichen Preisunterschied zeigen wir vor Ihrer Zustimmung. Anfragen innerhalb von 24 Stunden nehmen wir weiterhin an; Verfügbarkeit und mögliche Kosten bestätigt unser Team. Die Anfrage allein ändert oder storniert die Buchung nicht. Warten Sie auf unsere schriftliche Bestätigung.',
    policyLink: 'Vollständige Richtlinie lesen',
    security: 'Zum Schutz Ihrer Daten werden Buchungsdetails nur bei Übereinstimmung von Buchungsnummer und E-Mail-Adresse angezeigt. Senden Sie niemals Kartendaten, Passwörter oder Bestätigungscodes.',
    newBooking: 'Neue Buchung', contact: 'Kontakt',
  },
  ru: {
    title: 'Управление бронированием',
    intro: 'Запросите изменение или отмену. Укажите номер бронирования и адрес электронной почты, использованный при бронировании.',
    reference: 'Номер бронирования', example: 'например, T7K2MA8', email: 'Электронная почта из бронирования',
    requestType: 'Что нужно сделать?', change: 'Запросить изменение', cancel: 'Запросить отмену',
    message: 'Опишите запрос', changePlaceholder: 'Например: изменить время встречи, обновить адрес отеля или число пассажиров.',
    cancelPlaceholder: 'Подтвердите, что хотите отменить поездку, и добавьте важные сведения.',
    sendChange: 'Отправить запрос на изменение', sendCancel: 'Отправить запрос на отмену', sending: 'Отправка запроса…',
    referenceError: 'Введите 7-значный номер бронирования из букв и цифр.', emailRequired: 'Введите адрес электронной почты из бронирования.', emailInvalid: 'Введите действительный адрес электронной почты.', messageError: 'Опишите необходимое изменение или отмену.',
    bookingNotFound: 'Бронирование с таким номером и адресом электронной почты не найдено. Проверьте оба поля.', bookingUnavailable: 'Сейчас нельзя отправить новый запрос для этого бронирования. Возможно, запрос уже открыт или время поездки прошло.',
    required: 'Заполните все поля данными, указанными при бронировании.',
    successTitle: 'Запрос отправлен',
    success: 'Ваш запрос зарегистрирован. Мы напишем на адрес из бронирования. Бронирование не изменится, пока мы письменно не подтвердим результат.',
    another: 'Отправить ещё один запрос',
    error: 'Не удалось отправить запрос. Попробуйте ещё раз. Если проблема повторится, напишите нам и укажите номер бронирования.',
    policyTitle: 'Правила изменения и отмены',
    policy: 'Запрос на бесплатное изменение или отмену нужно отправить не позднее чем за 24 часа до соответствующего времени подачи автомобиля (местное время Турции). Изменения зависят от наличия автомобиля; возможную разницу в цене мы сообщим до вашего согласия. Запросы менее чем за 24 часа также принимаются, но наличие и возможные расходы подтвердит наша команда. Отправка запроса сама по себе не меняет и не отменяет бронирование. Дождитесь письменного подтверждения.',
    policyLink: 'Полные правила',
    security: 'Для защиты данных сведения о поездке отображаются только при совпадении номера бронирования и адреса электронной почты. Не отправляйте данные карты, пароли или коды подтверждения.',
    newBooking: 'Новое бронирование', contact: 'Связаться с нами',
  },
}

function createRequestKey() {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  } catch { /* Use a random fallback for older browsers. */ }
  return `${Date.now()}_${Math.random().toString(36).slice(2)}_${Math.random().toString(36).slice(2)}`
}

export function BookingLookupPage() {
  const { language } = useLanguage()
  const text = copy[language]
  const [bookingReference, setBookingReference] = useState('')
  const [email, setEmail] = useState('')
  const [requestType, setRequestType] = useState<'CHANGE' | 'CANCEL'>('CHANGE')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ reference?: string; email?: string; message?: string }>({})
  const [submitted, setSubmitted] = useState(false)
  const [busy, setBusy] = useState(false)
  const [requestKey, setRequestKey] = useState(createRequestKey)
  const [bookingDetails, setBookingDetails] = useState<PublicBookingView | null>(null)
  const [lookupBusy, setLookupBusy] = useState(false)
  const [lookupError, setLookupError] = useState('')

  async function findBooking() {
    setLookupError('')
    setBookingDetails(null)
    if (!/^[A-Za-z0-9]{7}$/.test(bookingReference.trim()) || !isValidEmail(email.trim())) {
      setLookupError(text.referenceError + ' ' + text.emailInvalid)
      return
    }
    setLookupBusy(true)
    try {
      setBookingDetails(await lookupPublicBooking(bookingReference.trim().toUpperCase(), email.trim()))
    } catch (failure) {
      setLookupError(failure instanceof BookingApiError && failure.status === 404 ? text.bookingNotFound : text.error)
    } finally {
      setLookupBusy(false)
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const nextErrors: { reference?: string; email?: string; message?: string } = {}
    if (!/^[A-Za-z0-9]{7}$/.test(bookingReference.trim())) nextErrors.reference = text.referenceError
    if (!email.trim()) nextErrors.email = text.emailRequired
    else if (!isValidEmail(email)) nextErrors.email = text.emailInvalid
    if (!message.trim()) nextErrors.message = text.messageError
    setFieldErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    setBusy(true)
    try {
      await submitBookingManagementRequest({ bookingReference: bookingReference.trim(), email: email.trim(), requestType, message: message.trim() }, requestKey)
      setSubmitted(true)
      setBookingReference('')
      setEmail('')
      setMessage('')
      setRequestKey(createRequestKey())
    } catch (failure) {
      if (failure instanceof BookingApiError && failure.status === 404) {
        setFieldErrors(previous => ({ ...previous, reference: text.bookingNotFound }))
      } else if (failure instanceof BookingApiError && failure.status === 409) {
        setError(text.bookingUnavailable)
      } else {
        setError(text.error)
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <PublicNavbar />
      <main className="mx-auto max-w-2xl px-5 pb-24 pt-32">
        <h1 className="mb-4 text-3xl font-bold text-admin-primary">{text.title}</h1>
        <p className="mb-8 text-on-surface-variant">{text.intro}</p>

        <section className="mb-6 rounded-lg border border-outline bg-white p-5 sm:p-6" aria-label="View booking">
          <h2 className="text-xl font-bold text-admin-primary">{language === 'de' ? 'Buchung anzeigen und herunterladen' : language === 'ru' ? 'Просмотреть и скачать бронирование' : 'View & Download My Booking'}</h2>
          <p className="mt-2 text-sm text-on-surface-variant">{language === 'de' ? 'Geben Sie Ihre Buchungsnummer und E-Mail-Adresse ein.' : language === 'ru' ? 'Введите номер бронирования и адрес электронной почты.' : 'Enter your booking reference and booking email to securely view your transfer details.'}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-semibold">{text.reference}
              <input type="text" maxLength={7} autoComplete="off" value={bookingReference} onChange={event => { setBookingReference(event.target.value.toUpperCase()); setBookingDetails(null) }} placeholder={text.example} className="mt-2 block w-full rounded-lg border border-outline px-4 py-3" />
            </label>
            <label className="text-sm font-semibold">{text.email}
              <input type="email" autoComplete="email" value={email} onChange={event => { setEmail(event.target.value); setBookingDetails(null) }} className="mt-2 block w-full rounded-lg border border-outline px-4 py-3" />
            </label>
          </div>
          <button type="button" disabled={lookupBusy} onClick={() => { void findBooking() }} className="mt-4 rounded-lg bg-admin-primary px-5 py-3 font-semibold text-white disabled:opacity-50">{lookupBusy ? 'Searching…' : language === 'de' ? 'Buchung suchen' : language === 'ru' ? 'Найти бронирование' : 'Find My Booking'}</button>
          {lookupError && <p role="alert" className="mt-3 text-sm text-error">{lookupError}</p>}
          {bookingDetails && (
            <div className="mt-6 rounded-xl border border-outline-variant bg-slate-50 p-5">
              <h3 className="text-lg font-bold text-admin-primary">Booking {bookingDetails.reference}</h3>
              <p className="mt-1 font-semibold">{bookingDetails.status === 'CONFIRMED' ? 'Confirmed' : bookingDetails.status === 'PENDING' ? 'Pending Confirmation' : bookingDetails.status}</p>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                {([
                  ['Passenger', bookingDetails.customerName],
                  ['Passengers', String(bookingDetails.passengerCount)],
                  ['Pickup', bookingDetails.pickUpLocation],
                  ['Destination', bookingDetails.dropOffLocation],
                  ['Pickup date/time (Türkiye)', bookingDetails.transferDateTime.replace('T', ' ')],
                  ['Return date/time (Türkiye)', bookingDetails.returnDateTime?.replace('T', ' ')],
                  ['Vehicle', bookingDetails.vehicleId ? vehicleLabel(bookingDetails.vehicleId) : undefined],
                  ['Trip', bookingDetails.tripType],
                  ['Price', bookingDetails.price == null ? 'To be confirmed' : '£' + bookingDetails.price.toFixed(2)],
                  ['Flight', bookingDetails.flightNumber],
                  ['Hotel', bookingDetails.hotelName],
                  ['Transfer address', bookingDetails.transferAddress],
                ] as [string, string | null | undefined][]).filter(([, value]) => value != null && value !== '').map(([label, value]) => (
                  <div key={label}><dt className="text-on-surface-variant">{label}</dt><dd className="font-semibold">{value}</dd></div>
                ))}
              </dl>
              <p className="mt-4 text-sm text-on-surface-variant">{bookingDetails.status === 'CONFIRMED' ? 'Your transfer has been confirmed.' : 'Your transfer is not confirmed until our team confirms it in writing.'}</p>
              <button type="button" onClick={() => downloadBookingPdf(bookingDetails)} className="mt-4 rounded-lg bg-admin-primary px-5 py-3 font-semibold text-white">Download Booking PDF</button>
            </div>
          )}
        </section>

        <section className="rounded-lg border border-outline bg-white p-5 sm:p-6" aria-label={text.title}>
          {submitted ? (
            <div role="status" aria-live="polite">
              <h2 className="text-xl font-bold text-admin-primary">{text.successTitle}</h2>
              <p className="mt-3 text-on-surface-variant">{text.success}</p>
              <button type="button" onClick={() => setSubmitted(false)} className="mt-5 rounded-lg border border-outline px-4 py-3 font-semibold text-admin-primary">{text.another}</button>
            </div>
          ) : (
            <form noValidate onSubmit={event => { void submit(event) }} className="space-y-5">
              <label htmlFor="booking-reference" className="block text-sm font-semibold">
                {text.reference}
                <input id="booking-reference" type="text" autoComplete="off" maxLength={7} aria-invalid={Boolean(fieldErrors.reference)} aria-describedby={fieldErrors.reference ? "booking-reference-error" : undefined}
                  pattern="[A-Za-z0-9]{7}" value={bookingReference} onChange={event => { setBookingReference(event.target.value); setFieldErrors(previous => ({ ...previous, reference: undefined })) }}
                  placeholder={text.example} className="mt-2 block w-full rounded-lg border border-outline px-4 py-3" />
                {fieldErrors.reference && <span id="booking-reference-error" role="alert" className="mt-1 block text-sm text-error">{fieldErrors.reference}</span>}
              </label>
              <label htmlFor="booking-email" className="block text-sm font-semibold">
                {text.email}
                <input id="booking-email" type="email" autoComplete="email" maxLength={255} value={email} aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? "booking-email-error" : undefined}
                  onChange={event => { setEmail(event.target.value); setFieldErrors(previous => ({ ...previous, email: undefined })) }} className="mt-2 block w-full rounded-lg border border-outline px-4 py-3" />
                {fieldErrors.email && <span id="booking-email-error" role="alert" className="mt-1 block text-sm text-error">{fieldErrors.email}</span>}
              </label>
              <label htmlFor="request-type" className="block text-sm font-semibold">
                {text.requestType}
                <select id="request-type" value={requestType} onChange={event => setRequestType(event.target.value as 'CHANGE' | 'CANCEL')}
                  className="mt-2 block w-full rounded-lg border border-outline bg-white px-4 py-3">
                  <option value="CHANGE">{text.change}</option>
                  <option value="CANCEL">{text.cancel}</option>
                </select>
              </label>
              <label htmlFor="request-message" className="block text-sm font-semibold">
                {text.message}
                <textarea id="request-message" maxLength={2000} aria-invalid={Boolean(fieldErrors.message)} aria-describedby={fieldErrors.message ? "request-message-error" : undefined} rows={5} value={message}
                  onChange={event => { setMessage(event.target.value); setFieldErrors(previous => ({ ...previous, message: undefined })) }}
                  placeholder={requestType === 'CHANGE' ? text.changePlaceholder : text.cancelPlaceholder}
                  className="mt-2 block w-full rounded-lg border border-outline px-4 py-3" />
                {fieldErrors.message && <span id="request-message-error" role="alert" className="mt-1 block text-sm text-error">{fieldErrors.message}</span>}
              </label>
              <p className="text-sm text-on-surface-variant">{text.required}</p>
              {error && <p role="alert" className="text-sm text-error">{error}</p>}
              <ProcessingButton type="submit" processing={busy} processingLabel={text.sending}
                className="rounded-lg bg-admin-primary px-5 py-3 font-semibold text-white disabled:opacity-50">
                {requestType === 'CHANGE' ? text.sendChange : text.sendCancel}
              </ProcessingButton>
            </form>
          )}
        </section>

        <section className="mt-6 rounded-lg border border-outline-variant bg-slate-50 p-5" aria-label={text.policyTitle}>
          <h2 className="font-bold text-admin-primary">{text.policyTitle}</h2>
          <p className="mt-2 text-sm leading-6 text-on-surface-variant">{text.policy}</p>
          <Link to="/booking-policy" className="mt-3 inline-block font-semibold text-admin-primary underline">{text.policyLink}</Link>
        </section>
        <p className="mt-5 text-sm text-on-surface-variant">{text.security}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="rounded-lg bg-admin-primary px-6 py-3 font-semibold text-white" to="/booking">{text.newBooking}</Link>
          <Link className="rounded-lg border border-outline bg-white px-6 py-3 font-semibold text-admin-primary" to="/contact">{text.contact}</Link>
        </div>
      </main>
    </div>
  )
}
