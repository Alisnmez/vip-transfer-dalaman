import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  cancelBookingFromManagementRequest,
  getBookingManagementRequests,
  updateBookingManagementRequest,
} from '../../features/booking/api'
import type { BookingManagementRequest } from '../../features/booking/types'

const filters = [
  { value: 'NEW', label: 'New' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'DECLINED', label: 'Declined' },
  { value: 'ALL', label: 'All requests' },
]

function pickupTime(value: string | null) {
  if (!value) return 'Not available'
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC',
  }).format(new Date(`${value}Z`)) + ' (Türkiye time)'
}

export function BookingManagementRequestsPage() {
  const [filter, setFilter] = useState('ALL')
  const [requests, setRequests] = useState<BookingManagementRequest[]>([])
  const [notes, setNotes] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [revision, setRevision] = useState(0)

  useEffect(() => {
    let active = true
    getBookingManagementRequests(filter).then(result => {
      if (active) { setRequests(result); setLoading(false) }
    }).catch(() => {
      if (active) { setError('Could not load booking requests. Check the connection and refresh.'); setLoading(false) }
    })
    return () => { active = false }
  }, [filter, revision])

  function refresh() {
    setNotice('')
    setError('')
    setLoading(true)
    setRevision(value => value + 1)
  }

  async function update(request: BookingManagementRequest, status: 'IN_PROGRESS' | 'RESOLVED' | 'DECLINED') {
    if (busyId !== null) return
    setBusyId(request.id); setError(''); setNotice('')
    try {
      await updateBookingManagementRequest(request.id, status, notes[request.id] ?? '')
      setNotice(status === 'IN_PROGRESS' ? 'Request marked in progress.' : status === 'RESOLVED' ? 'Request marked resolved and the customer has been emailed.' : 'Request declined and the customer has been emailed.')
      refresh()
    } catch {
      setError('Could not update this request. It may already have been handled; refresh and try again.')
    } finally { setBusyId(null) }
  }

  async function cancelBooking(request: BookingManagementRequest) {
    if (busyId !== null) return
    const confirmed = window.confirm(`Cancel booking #${request.bookingId} and resolve this request? This sends a cancellation email to the customer.`)
    if (!confirmed) return
    setBusyId(request.id); setError(''); setNotice('')
    try {
      await cancelBookingFromManagementRequest(request.id, notes[request.id] ?? '')
      setNotice(`Booking #${request.bookingId} cancelled and the request resolved. The customer has been emailed.`)
      refresh()
    } catch {
      setError('Could not cancel this booking. It may already be completed or the request may be closed; refresh to check.')
    } finally { setBusyId(null) }
  }

  return (
    <section className="w-full max-w-5xl p-4 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-bold text-admin-primary">Manage Booking Requests</h1><p className="text-on-surface-variant">Review change and cancellation requests submitted by customers.</p></div>
        <button type="button" onClick={refresh} disabled={loading || busyId !== null} className="rounded-lg border bg-white px-4 py-2 font-semibold disabled:opacity-50">Refresh</button>
      </div>
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter booking requests">
        {filters.map(item => <button key={item.value} type="button" aria-pressed={filter === item.value} disabled={busyId !== null} onClick={() => { if (filter !== item.value) { setFilter(item.value); setLoading(true); setError('') } setNotice('') }} className={`rounded-lg border px-4 py-2 font-semibold disabled:opacity-50 ${filter === item.value ? 'bg-admin-primary text-white' : 'bg-white text-admin-primary'}`}>{item.label}</button>)}
      </div>
      {error && <p role="alert" className="mb-4 text-red-700">{error}</p>}
      {notice && <p role="status" className="mb-4 text-green-700">{notice}</p>}
      {loading ? <p role="status">Loading booking requests…</p> : requests.length === 0 ? <p>No {filters.find(item => item.value === filter)?.label.toLowerCase()} booking requests.</p> : (
        <div className="space-y-4">{requests.map(request => {
          const closed = request.status === 'RESOLVED' || request.status === 'DECLINED'
          return <article key={request.id} className="rounded-xl border border-outline-variant bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><h2 className="text-lg font-bold text-admin-primary">{request.requestType === 'CANCEL' ? 'Cancellation request' : 'Change request'} · booking #{request.bookingId}</h2><p className="mt-1 text-sm text-on-surface-variant">Received {new Date(request.createdAt).toLocaleString()} · <span className="font-semibold">{request.status.replace('_', ' ')}</span></p></div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${request.requestType === 'CANCEL' ? 'bg-red-50 text-red-700' : 'bg-sky-50 text-sky-800'}`}>{request.requestType}</span>
            </div>
            <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              <div><dt className="font-semibold">Customer</dt><dd>{request.customerName} · <a className="text-admin-primary underline" href={`mailto:${request.customerEmail}`}>{request.customerEmail}</a></dd></div>
              <div><dt className="font-semibold">Booking status</dt><dd>{request.bookingStatus}</dd></div>
              <div><dt className="font-semibold">Route</dt><dd>{request.pickup} → {request.destination}</dd></div>
              <div><dt className="font-semibold">Pickup</dt><dd>{pickupTime(request.transferDateTime)}</dd></div>
              {request.returnDateTime && <div><dt className="font-semibold">Return pickup</dt><dd>{pickupTime(request.returnDateTime)}</dd></div>}
            </dl>
            <div className="mt-4 rounded-lg bg-slate-50 p-4"><h3 className="text-sm font-bold">Customer message</h3><p className="mt-2 whitespace-pre-wrap break-words text-sm">{request.message}</p></div>
            {request.adminNote && <p className="mt-3 text-sm text-on-surface-variant"><strong>Previous note:</strong> {request.adminNote}</p>}
            {!closed && <>
              <label className="mt-4 block text-sm font-semibold">{request.requestType === 'CANCEL' ? 'Internal note (saved on this request)' : 'Note to customer (included in email when resolved/declined)'}
                <textarea rows={2} maxLength={2000} value={notes[request.id] ?? ''} onChange={event => setNotes(current => ({ ...current, [request.id]: event.target.value }))} className="mt-2 block w-full rounded-lg border border-outline px-3 py-2" />
              </label>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link to={`/admin/bookings/${request.bookingId}`} className="rounded-lg border px-4 py-2 font-semibold text-admin-primary">Open booking</Link>
                {request.status !== 'IN_PROGRESS' && <button type="button" disabled={busyId !== null} onClick={() => { void update(request, 'IN_PROGRESS') }} className="rounded-lg border px-4 py-2 font-semibold disabled:opacity-50">Mark in progress</button>}
                {request.requestType === 'CANCEL' ? <button type="button" disabled={busyId !== null || request.bookingStatus === 'COMPLETED' || request.bookingStatus === 'CANCELLED'} onClick={() => { void cancelBooking(request) }} className="rounded-lg bg-red-700 px-4 py-2 font-semibold text-white disabled:opacity-50">Cancel booking & resolve</button> : <button type="button" disabled={busyId !== null} onClick={() => { void update(request, 'RESOLVED') }} className="rounded-lg bg-admin-primary px-4 py-2 font-semibold text-white disabled:opacity-50">Mark resolved</button>}
                <button type="button" disabled={busyId !== null} onClick={() => { void update(request, 'DECLINED') }} className="rounded-lg border border-red-300 px-4 py-2 font-semibold text-red-700 disabled:opacity-50">Decline</button>
              </div>
            </>}
          </article>
        })}</div>
      )}
    </section>
  )
}
