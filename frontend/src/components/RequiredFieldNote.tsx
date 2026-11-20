import { useBookingCopy } from '../shared/localization/bookingCopy'
/** Accessible required-field marker shared by public booking forms. */
export function RequiredMark() {
  return <span aria-hidden="true" className="ml-1 font-bold text-red-600">*</span>
}

export function RequiredFieldNote() {
  const t = useBookingCopy()
  return <p className="mb-5 text-sm text-slate-700">{t("Fields marked with")} <RequiredMark /> {t("are required to complete your booking.")}</p>
}
