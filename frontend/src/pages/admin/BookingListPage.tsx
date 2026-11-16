import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { getBookings } from '../../features/booking/api'
import { bookingStatus, formatTransferDateTime } from '../../features/booking/formatters'
import type { Booking } from '../../features/booking/types'

export function BookingListPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  async function refresh() {
    if (refreshing || loading) return
    setRefreshing(true)
    setError('')
    try {
      setBookings(await getBookings())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load bookings')
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    let active = true
    getBookings()
      .then(data => { if (active) setBookings(data) })
      .catch(err => { if (active) setError(err instanceof Error ? err.message : 'Unable to load bookings') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const query = search.trim().toLowerCase()
  const visibleBookings = bookings
    .filter(booking =>
      `${booking.id} ${booking.customerName} ${booking.pickUpLocation} ${booking.dropOffLocation}`
        .toLowerCase().includes(query),
    )
    .sort((a, b) => b.id - a.id)

  return (
    <main className="flex min-h-0 flex-1 flex-col bg-surface">
      <header className="border-b border-outline-variant bg-white p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-admin-primary">Booking management</h1>
            <p className="text-on-surface-variant">{visibleBookings.length} of {bookings.length} requests</p>
          </div>
          <button type="button" onClick={() => { void refresh() }} disabled={loading || refreshing}
            className="rounded-lg border border-outline-variant bg-white px-4 py-2 font-semibold disabled:opacity-50">
            {refreshing ? 'Refreshing...' : 'Refresh bookings'}
          </button>
        </div>
      </header>
      <section className="border-b border-outline-variant bg-white p-6">
        <label className="block max-w-lg text-sm font-semibold">
          Search bookings
          <input type="search" value={search} onChange={event => setSearch(event.target.value)}
            placeholder="Customer, route or booking ID"
            className="mt-2 w-full rounded-lg border border-outline-variant px-4 py-3" />
        </label>
      </section>
      <section className="min-w-0 flex-1 p-4 sm:overflow-auto sm:p-6">
        {loading && <p>Loading booking requests...</p>}
        {error && <p role="alert" className="text-error">Unable to load bookings: {error}</p>}
        {!loading && !error && visibleBookings.length === 0 && <p>No booking requests found.</p>}
        {!loading && !error && visibleBookings.length > 0 && (
          <><div className="space-y-3 md:hidden">{visibleBookings.map(booking => (
            <article key={booking.id} className="min-w-0 rounded-xl border border-outline-variant bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-xs text-on-surface-variant">Booking #{booking.id}</p><h2 className="break-words font-bold">{booking.customerName}</h2></div><span className="shrink-0 rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-950">{bookingStatus(booking.status)}</span></div>
              <p className="mt-3 break-words text-sm">{booking.pickUpLocation} → {booking.dropOffLocation}</p>
              <p className="mt-2 text-sm text-on-surface-variant">{formatTransferDateTime(booking.transferDateTime)} · {booking.passengerCount} passengers</p>
              <p className="mt-1 text-xs text-on-surface-variant">Received: {booking.createdAt ? new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Istanbul', dateStyle: 'medium', timeStyle: 'short' }).format(new Date(booking.createdAt)) : 'Not recorded'}</p>
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-outline-variant pt-3"><strong>£{Number(booking.price).toFixed(2)}</strong><Link className="rounded-lg bg-admin-primary px-4 py-2 text-sm font-semibold text-white" to={`/admin/bookings/${booking.id}`}>View details</Link></div>
            </article>
          ))}</div><div className="hidden max-w-full overflow-x-auto md:block"><table className="w-full min-w-[760px] border-collapse bg-white text-left">
            <thead>
              <tr className="border-b border-outline-variant">
                {['ID', 'Customer', 'Route', 'Transfer time (Turkey)', 'Price (GBP)', 'Status', 'Details'].map(header =>
                  <th key={header} scope="col" className="p-4 text-sm font-semibold">{header}</th>,
                )}
              </tr>
            </thead>
            <tbody>
              {visibleBookings.map(booking => (
                <tr key={booking.id} className="border-b border-outline-variant">
                  <td className="p-4 font-semibold">#{booking.id}</td>
                  <td className="p-4">
                    <span className="block font-semibold">{booking.customerName}</span>
                    <span className="text-sm text-on-surface-variant">{booking.passengerCount} passengers</span>
                  </td>
                  <td className="p-4">{booking.pickUpLocation} → {booking.dropOffLocation}</td>
                  <td className="p-4">{formatTransferDateTime(booking.transferDateTime)}</td>
                  <td className="p-4 font-semibold">£{Number(booking.price).toFixed(2)}</td>
                  <td className="p-4"><span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-950">{bookingStatus(booking.status)}</span></td>
                  <td className="p-4">
                    <Link className="text-admin-primary underline" to={`/admin/bookings/${booking.id}`}>View details</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div></>
        )}
      </section>
    </main>
  )
}
