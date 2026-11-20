import { Link } from 'react-router-dom'
import { supportEmail } from '../../features/booking/support'
import { useLanguage } from '../../shared/localization/language'

const policyCopy = {
  en: {
    changes: 'Changes and cancellations',
    changesText: 'If you have a booking reference, use Manage Booking to contact us. We verify your request using the contact details on the booking. Wait for written confirmation before treating your transfer as changed or cancelled. Our team will explain any terms that apply to your request.',
    manage: 'Manage Booking',
    privacy: 'How we use your booking details',
    privacyText: 'We use your name, contact details and journey information to review your request, arrange the transfer and contact you about your booking. For questions about your booking data, email us at',
  },
  de: {
    changes: 'Änderungen und Stornierungen',
    changesText: 'Wenn Sie eine Buchungsnummer haben, kontaktieren Sie uns über „Buchung verwalten“. Wir prüfen Ihre Anfrage anhand der Kontaktdaten Ihrer Buchung. Warten Sie auf unsere schriftliche Bestätigung einer Änderung oder Stornierung. Unser Team erläutert Ihnen die geltenden Bedingungen.',
    manage: 'Buchung verwalten',
    privacy: 'So verwenden wir Ihre Buchungsdaten',
    privacyText: 'Wir verwenden Ihren Namen, Ihre Kontaktdaten und Ihre Reisedaten, um Ihre Anfrage zu prüfen, den Transfer zu organisieren und Sie zu Ihrer Buchung zu kontaktieren. Bei Fragen zu Ihren Buchungsdaten schreiben Sie an',
  },
  ru: {
    changes: 'Изменение и отмена бронирования',
    changesText: 'Если у вас есть номер бронирования, свяжитесь с нами через раздел «Управление бронированием». Мы проверим запрос по контактным данным из бронирования. Дождитесь письменного подтверждения изменения или отмены. Наша команда сообщит вам применимые условия.',
    manage: 'Управление бронированием',
    privacy: 'Как мы используем данные бронирования',
    privacyText: 'Мы используем ваше имя, контактные данные и сведения о поездке, чтобы рассмотреть заявку, организовать трансфер и связаться с вами по поводу бронирования. С вопросами об этих данных пишите на',
  },
}

export function BookingPolicyLinks() {
  const { language } = useLanguage()
  const copy = policyCopy[language]

  return (
    <div className="divide-y divide-outline-variant rounded-lg border border-outline-variant bg-slate-50 text-left text-sm text-on-surface-variant">
      <details className="px-4 py-3">
        <summary className="cursor-pointer font-semibold text-admin-primary">{copy.changes}</summary>
        <p className="mt-2">{copy.changesText}</p>
        <Link to="/booking/lookup" className="mt-2 inline-block font-semibold text-admin-primary underline">{copy.manage}</Link>
      </details>
      <details className="px-4 py-3">
        <summary className="cursor-pointer font-semibold text-admin-primary">{copy.privacy}</summary>
        <p className="mt-2">{copy.privacyText} <a href={`mailto:${supportEmail}`} className="break-words font-semibold text-admin-primary underline">{supportEmail}</a>.</p>
      </details>
    </div>
  )
}
