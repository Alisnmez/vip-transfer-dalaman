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

  useEffect(() => {
    let active = true
    getBookings()
      .then(data => { if (active) setBookings(data) })
      .catch(err => { if (active) setError(err instanceof Error ? err.message : 'Unable to load bookings') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const query = search.trim().toLowerCase()
  const visibleBookings = bookings.filter(booking =>
    `${booking.id} ${booking.customerName} ${booking.pickUpLocation} ${booking.dropOffLocation}`
      .toLowerCase().includes(query),
  )

  return (
    <main className="flex h-full flex-col overflow-hidden bg-surface">
      <header className="border-b border-outline-variant bg-white p-6">
        <h1 className="text-2xl font-bold text-admin-primary">Booking management</h1>
        <p className="text-on-surface-variant">{visibleBookings.length} of {bookings.length} requests</p>
      </header>
      <section className="border-b border-outline-variant bg-white p-6">
        <label className="block max-w-lg text-sm font-semibold">
          Search bookings
          <input type="search" value={search} onChange={event => setSearch(event.target.value)}
            placeholder="Customer, route or booking ID"
            className="mt-2 w-full rounded-lg border border-outline-variant px-4 py-3" />
        </label>
      </section>
      <section className="flex-1 overflow-auto p-6">
        {loading && <p>Loading booking requests...</p>}
        {error && <p role="alert" className="text-error">Unable to load bookings: {error}</p>}
        {!loading && !error && visibleBookings.length === 0 && <p>No booking requests found.</p>}
        {!loading && !error && visibleBookings.length > 0 && (
          <table className="w-full min-w-[760px] border-collapse bg-white text-left">
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
                  <td className="p-4">{bookingStatus(booking.status)}</td>
                  <td className="p-4">
                    <Link className="text-admin-primary underline" to={`/admin/bookings/${booking.id}`}>View details</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  )
}
