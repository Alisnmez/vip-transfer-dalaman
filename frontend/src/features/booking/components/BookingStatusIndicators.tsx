import { BookingStatusBadge } from './BookingStatusBadge'
import { LiveBookingBadge } from './LiveBookingBadge'

type Props = {
  status?: string | null
  transferDateTime?: string | null
  nowMs: number
}

export function BookingStatusIndicators({ status, transferDateTime, nowMs }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <LiveBookingBadge status={status} transferDateTime={transferDateTime} nowMs={nowMs} />
      <BookingStatusBadge status={status} />
    </div>
  )
}
