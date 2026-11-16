import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { getDashboardSummary } from '../../features/booking/api'
import { ProcessingButton } from '../../components/ProcessingButton'
import type { DashboardSummary } from '../../features/booking/api'
import { bookingStatus, formatTransferDateTime } from '../../features/booking/formatters'

export function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function refresh() {
    setLoading(true)
    setError('')
    try {
      setSummary(await getDashboardSummary())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true
    getDashboardSummary()
      .then(data => { if (active) setSummary(data) })
      .catch(err => { if (active) setError(err instanceof Error ? err.message : 'Unable to load bookings') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const upcoming = summary?.upcoming ?? []

  return (
    <main className="min-w-0 space-y-6 p-4 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-admin-primary">Booking overview</h1>
          <p className="text-on-surface-variant">Live booking requests from the database. Dates use Turkey time.</p>
        </div>
        <ProcessingButton type="button" onClick={() => { void refresh() }} processing={loading} processingLabel="Refreshing..." className="rounded-lg border border-outline-variant bg-white px-4 py-2 disabled:opacity-50">Refresh</ProcessingButton>
      </div>
      {error && <p role="alert" className="rounded-lg border border-error p-4 text-error">Could not load booking data: {error}</p>}
      {loading && <p>Loading bookings...</p>}
      {!loading && !error && summary && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-outline-variant bg-white p-4 sm:p-6">
              <p className="text-on-surface-variant">Total booking requests</p>
              <p className="text-3xl font-bold text-admin-primary">{summary.total}</p>
            </div>
            <div className="rounded-xl border border-outline-variant bg-white p-6">
              <p className="text-on-surface-variant">Open requests for today</p>
              <p className="text-3xl font-bold text-admin-primary">{summary.today}</p>
            </div>
          </div>
          <section className="rounded-xl border border-outline-variant bg-white p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="text-xl font-bold">Upcoming booking requests</h2>
              <Link className="text-admin-primary underline" to="/admin/bookings">All bookings</Link>
            </div>
            {upcoming.length === 0 ? <p className="text-on-surface-variant">No upcoming booking requests found.</p> : (
              <div className="space-y-3">
                {upcoming.map(booking => (
                  <Link key={booking.id} to={`/admin/bookings/${booking.id}`} className="block rounded-lg border border-outline-variant p-4 hover:bg-surface-container-low">
                    <div className="flex flex-wrap justify-between gap-2">
                      <span className="font-semibold">#{booking.id} · {booking.customerName}</span>
                      <span>{formatTransferDateTime(booking.transferDateTime)}</span>
                    </div>
                    <p className="text-sm text-on-surface-variant">{booking.pickUpLocation} → {booking.dropOffLocation} · {bookingStatus(booking.status)}</p>
                  </Link>
                ))}
              </div>
            )}
          </section>
          <p className="text-sm text-on-surface-variant">{summary.pending} requests are pending confirmation. Today's and upcoming counts exclude completed and cancelled requests but may include pending requests; they are not confirmed rides or collected revenue. Driver assignments and payment reporting are not available yet.</p>
        </>
      )}
    </main>
  )
}
