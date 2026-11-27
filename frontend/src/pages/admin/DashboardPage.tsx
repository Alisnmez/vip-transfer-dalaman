import { Link } from 'react-router-dom'

import { ProcessingButton } from '../../components/ProcessingButton'
import { bookingPickupMs, sortBookingsByPriority } from '../../features/booking/bookingPriority'
import { vehicleLabel } from '../../features/booking/bookingVehicles'
import { BookingStatusIndicators } from '../../features/booking/components/BookingStatusIndicators'
import { formatTransferDateTime } from '../../features/booking/formatters'
import { isBookingLive } from '../../features/booking/liveBooking'
import type { Booking } from '../../features/booking/types'
import { useBookingClock } from '../../features/booking/useBookingClock'
import { useDashboardSummary } from '../../features/booking/useDashboardSummary'

const pickupDate = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Istanbul', weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
const pickupTime = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Istanbul', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
const fare = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' })

function TransferList({ bookings, nowMs }: { bookings: Booking[]; nowMs: number }) {
  return (
    <ul className="divide-y divide-outline-variant">
      {bookings.map(booking => {
        const pickup = bookingPickupMs(booking.transferDateTime)
        const details = [
          ['Vehicle', vehicleLabel(booking.vehicleId)],
          ['Passengers', booking.passengerCount],
          ['Bags', booking.luggageCount ?? '—'],
          ['Flight', booking.flightNumber || '—'],
        ]
        return (
          <li key={booking.id}>
            <Link
              to={`/admin/bookings/${booking.id}`}
              className="grid min-w-0 gap-4 px-4 py-5 hover:bg-surface-container-low focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-admin-primary sm:px-6 lg:grid-cols-[9rem_minmax(0,1fr)_auto]"
            >
              <time dateTime={booking.transferDateTime} className="flex flex-wrap items-baseline gap-x-2 lg:block">
                <span className="text-xl font-bold tabular-nums text-admin-primary">{pickupTime.format(pickup)}</span>
                <span className="text-sm text-on-surface-variant lg:block">{pickupDate.format(pickup)}</span>
              </time>
              <div className="min-w-0">
                <p className="break-words font-semibold text-admin-primary">#{booking.id} · {booking.customerName}</p>
                <p className="mt-1 break-words text-sm">{booking.pickUpLocation} <span aria-label="to">→</span> {booking.dropOffLocation}</p>
                <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                  {details.map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-xs text-on-surface-variant">{label}</dt>
                      <dd className="font-medium">{value}</dd>
                    </div>
                  ))}
                  {booking.returnDateTime && (
                    <div>
                      <dt className="text-xs text-on-surface-variant">Return</dt>
                      <dd className="font-medium"><time dateTime={booking.returnDateTime}>{formatTransferDateTime(booking.returnDateTime)}</time></dd>
                    </div>
                  )}
                </dl>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 lg:flex-col lg:items-end lg:justify-start">
                <BookingStatusIndicators status={booking.status} transferDateTime={booking.transferDateTime} nowMs={nowMs} />
                <span className="text-sm font-semibold tabular-nums">{fare.format(booking.price)}</span>
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export function DashboardPage() {
  const nowMs = useBookingClock()
  const { summary, loading, refreshing, error, refresh } = useDashboardSummary()

  // Older responses include started transfers in upcoming until the API is updated.
  const upcoming = sortBookingsByPriority((summary?.upcoming ?? []).filter(booking => {
    const pickup = bookingPickupMs(booking.transferDateTime)
    return Number.isFinite(pickup) && pickup > nowMs
  }), nowMs)
  const started = [...(summary?.started ?? []), ...(summary?.upcoming ?? [])]
    .filter(booking => isBookingLive(booking.status, booking.transferDateTime, nowMs))
    .sort((a, b) => bookingPickupMs(b.transferDateTime) - bookingPickupMs(a.transferDateTime) || a.id - b.id)

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-admin-primary sm:text-3xl">Booking overview</h1>
          <p className="mt-1 text-sm text-on-surface-variant">Pickup and return times are shown in Turkey time.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/bookings?status=PENDING" className="rounded-lg bg-admin-primary px-4 py-3 text-sm font-semibold text-white">New requests{summary && ` (${summary.pending})`}</Link>
          <Link to="/admin/calendar" className="rounded-lg border border-outline-variant bg-white px-4 py-2 text-sm font-semibold text-admin-primary">Open calendar</Link>
          <Link to="/admin/bookings" className="rounded-lg bg-admin-primary px-4 py-2 text-sm font-semibold text-white">All bookings</Link>
          <ProcessingButton type="button" onClick={() => { void refresh(true) }} processing={loading || refreshing} processingLabel="Refreshing..." className="rounded-lg border border-outline-variant bg-white px-4 py-2 text-sm font-semibold text-admin-primary disabled:opacity-50">Refresh</ProcessingButton>
        </div>
      </header>
      {error && <p role="alert" className="rounded-lg border border-error p-4 text-error">Could not load booking data: {error}</p>}
      {loading && <p role="status" className="text-on-surface-variant">Loading bookings…</p>}
      {summary && (
        <>
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            {[
              ['Open pickups today', summary.today],
              ['Pending confirmation', summary.pending],
              ['Total booking requests', summary.total],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-outline-variant bg-white p-4">
                <dt className="text-sm font-medium text-on-surface-variant">{label}</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-admin-primary">{value}</dd>
              </div>
            ))}
          </dl>
          <section aria-labelledby="upcoming-pickups" className="overflow-hidden rounded-xl border border-outline-variant bg-white">
            <header className="border-b border-outline-variant px-4 py-4 sm:px-6">
              <h2 id="upcoming-pickups" className="text-lg font-bold text-admin-primary">Upcoming pickups</h2>
              <p className="text-sm text-on-surface-variant">{upcoming.length} shown · Earliest pickup first</p>
            </header>
            {upcoming.length > 0 ? <TransferList bookings={upcoming} nowMs={nowMs} /> : (
              <p className="p-4 text-sm text-on-surface-variant sm:px-6">No upcoming pickups.</p>
            )}
          </section>
          {started.length > 0 && (
            <section aria-labelledby="started-pickups" className="overflow-hidden rounded-xl border border-outline-variant bg-white">
              <header className="border-b border-outline-variant px-4 py-4 sm:px-6">
                <h2 id="started-pickups" className="text-lg font-bold text-admin-primary">Confirmed pickups past their scheduled time</h2>
                <p className="text-sm text-on-surface-variant">Latest scheduled pickup first. Mark a transfer completed from its booking details.</p>
              </header>
              <TransferList bookings={started} nowMs={nowMs} />
            </section>
          )}
        </>
      )}
    </div>
  )
}
