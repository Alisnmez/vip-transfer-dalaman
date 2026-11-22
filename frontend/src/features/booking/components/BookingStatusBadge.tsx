import { bookingStatus } from '../formatters'

const colors: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-950',
  CONFIRMED: 'bg-emerald-100 text-emerald-900',
  COMPLETED: 'bg-slate-200 text-slate-700',
  CANCELLED: 'bg-rose-100 text-rose-900',
}

export function BookingStatusBadge({ status }: { status?: string | null }) {
  const label = bookingStatus(status) === 'PENDING' ? 'New Request' : bookingStatus(status)
  return <span className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-bold ${colors[label] ?? 'bg-slate-100 text-slate-800'}`}>{label}</span>
}
