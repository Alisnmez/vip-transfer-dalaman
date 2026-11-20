import { isBookingLive } from '../liveBooking'

export function LiveBookingBadge({ status, transferDateTime, nowMs }: { status?: string | null; transferDateTime?: string | null; nowMs: number }) {
  if (!isBookingLive(status, transferDateTime, nowMs)) return null
  return <span title="Confirmed transfer has reached its scheduled pickup time and is not yet completed" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700 ring-1 ring-red-200">
    <span aria-hidden="true" className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-600" />
    LIVE
  </span>
}
