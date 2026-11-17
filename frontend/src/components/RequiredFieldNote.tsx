/** Accessible required-field marker shared by public booking forms. */
export function RequiredMark() {
  return <span aria-hidden="true" className="ml-1 font-bold text-red-600">*</span>
}

export function RequiredFieldNote() {
  return <p className="mb-5 text-sm text-slate-700">Fields marked with <RequiredMark /> are required to complete your booking.</p>
}
