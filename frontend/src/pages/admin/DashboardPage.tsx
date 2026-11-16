import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { getBookings } from '../../features/booking/api'
import { formatTransferDateTime, turkeyNowLocal } from '../../features/booking/formatters'
import type { Booking } from '../../features/booking/types'

export function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function refresh() {
    setLoading(true)
    setError('')
    try {
      setBookings(await getBookings())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load bookings')
    } finally {
      setLoading(false)
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

  const now = turkeyNowLocal()
  const today = now.slice(0, 10)
  const todayBookings = bookings.filter(booking => booking.transferDateTime?.startsWith(today))
  const upcoming = [...bookings]
    .filter(booking => booking.transferDateTime && booking.transferDateTime >= now)
    .sort((a, b) => a.transferDateTime.localeCompare(b.transferDateTime))
    .slice(0, 8)

  return (
    <main className="p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-admin-primary">Booking overview</h1>
          <p className="text-on-surface-variant">Live booking requests from the database. Dates use Turkey time.</p>
        </div>
        <button type="button" onClick={() => { void refresh() }} disabled={loading} className="rounded-lg border border-outline-variant bg-white px-4 py-2 disabled:opacity-50">Refresh</button>
      </div>
      {error && <p role="alert" className="rounded-lg border border-error p-4 text-error">Could not load booking data: {error}</p>}
      {loading && <p>Loading bookings...</p>}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-outline-variant bg-white p-6">
              <p className="text-on-surface-variant">Total booking requests</p>
              <p className="text-3xl font-bold text-admin-primary">{bookings.length}</p>
            </div>
            <div className="rounded-xl border border-outline-variant bg-white p-6">
              <p className="text-on-surface-variant">Transfers scheduled today</p>
              <p className="text-3xl font-bold text-admin-primary">{todayBookings.length}</p>
            </div>
          </div>
          <section className="rounded-xl border border-outline-variant bg-white p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="text-xl font-bold">Upcoming transfers</h2>
              <Link className="text-admin-primary underline" to="/admin/bookings">All bookings</Link>
            </div>
            {upcoming.length === 0 ? <p className="text-on-surface-variant">No upcoming transfers found.</p> : (
              <div className="space-y-3">
                {upcoming.map(booking => (
                  <Link key={booking.id} to={`/admin/bookings/${booking.id}`} className="block rounded-lg border border-outline-variant p-4 hover:bg-surface-container-low">
                    <div className="flex flex-wrap justify-between gap-2">
                      <span className="font-semibold">#{booking.id} · {booking.customerName}</span>
                      <span>{formatTransferDateTime(booking.transferDateTime)}</span>
                    </div>
                    <p className="text-sm text-on-surface-variant">{booking.pickUpLocation} → {booking.dropOffLocation}</p>
                  </Link>
                ))}
              </div>
            )}
          </section>
          <p className="text-sm text-on-surface-variant">Booking counts are requests, not confirmed rides or collected revenue. Driver assignments and payment reporting are not available yet.</p>
        </>
      )}
    </main>
  )
}
