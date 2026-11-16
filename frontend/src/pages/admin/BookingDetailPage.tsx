import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getBooking, updateBooking, updateBookingStatus } from '../../features/booking/api'
import { bookingStatus, formatTransferDateTime } from '../../features/booking/formatters'
import type { Booking, BookingRequest } from '../../features/booking/types'

export function BookingDetailPage() {
  const { bookingId } = useParams()
  const id = Number(bookingId)
  const [booking, setBooking] = useState<Booking | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<BookingRequest | null>(null)
  const [loading, setLoading] = useState(Number.isSafeInteger(id) && id > 0)

  useEffect(() => {
    if (!Number.isSafeInteger(id) || id < 1) return
    let active = true
    getBooking(id)
      .then(value => { if (active) setBooking(value) })
      .catch((err: Error) => { if (active) setError(err.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id])

  async function changeStatus(status: string) {
    if (!booking || status === bookingStatus(booking.status)) return
    if (status === 'CANCELLED' && !window.confirm('Cancel this booking request?')) return
    setSaving(true); setError(''); setNotice('')
    try { setBooking(await updateBookingStatus(booking.id, status)); setNotice('Status updated successfully.') }
    catch (err) { setError(err instanceof Error ? err.message : 'Status update failed') }
    finally { setSaving(false) }
  }

  function beginEdit() {
    if (!booking) return
    setDraft({
      customerName: booking.customerName, passengerCount: booking.passengerCount,
      pickUpLocation: booking.pickUpLocation, dropOffLocation: booking.dropOffLocation,
      transferDateTime: booking.transferDateTime.slice(0, 16),
      returnDateTime: booking.returnDateTime?.slice(0, 16) || undefined,
      flightNumber: booking.flightNumber || '', luggageCount: booking.luggageCount ?? 0,
      babySeatCount: booking.babySeatCount ?? 0, phoneNumber: booking.phoneNumber || '',
      email: booking.email || '', vehicleId: booking.vehicleId || '',
      countryOfResidence: booking.countryOfResidence || '', transferAddress: booking.transferAddress || '',
      hotelName: booking.hotelName || '', specialRequests: booking.specialRequests || '',
      tripType: booking.tripType === 'round-trip' ? 'round-trip' : 'one-way',
    })
    setEditing(true); setError(''); setNotice('')
  }

  async function saveDetails(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!draft || !booking) return
    setSaving(true); setError(''); setNotice('')
    try { setBooking(await updateBooking(booking.id, draft)); setEditing(false); setNotice('Booking details saved.') }
    catch (err) { setError(err instanceof Error ? err.message : 'Could not save details') }
    finally { setSaving(false) }
  }

  return (
    <section className="min-w-0 max-w-4xl p-4 sm:p-8">
      <Link className="text-admin-primary underline" to="/admin/bookings">Back to bookings</Link>
      <h1 className="mt-6 mb-5 text-2xl font-bold">Booking request #{bookingId}</h1>
      {(!Number.isSafeInteger(id) || id < 1) && <p role="alert">Invalid booking reference.</p>}
      {loading && Number.isSafeInteger(id) && id > 0 && <p>Loading booking...</p>}
      {error && <p role="alert" className="text-error">Could not load booking: {error}</p>}
      {notice && <p role="status" className="mb-4 text-green-800">{notice}</p>}
      {booking && <div className="mb-5 flex flex-wrap items-end gap-3 rounded-xl border border-outline-variant bg-white p-4">
        <label className="text-sm font-semibold">Booking status
          <select aria-label="Booking status" disabled={saving} value={bookingStatus(booking.status)} onChange={event => { void changeStatus(event.target.value) }} className="mt-2 block rounded-lg border border-outline-variant bg-white px-4 py-3 text-gray-900">
            {['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(status => <option key={status} value={status}>{status}</option>)}
          </select>
        </label>
        <button type="button" disabled={saving} onClick={editing ? () => setEditing(false) : beginEdit} className="rounded-lg border border-outline-variant bg-white px-4 py-3 font-semibold text-gray-900">{editing ? 'Cancel editing' : 'Edit booking details'}</button>
      </div>}
      {editing && draft && <form onSubmit={event => { void saveDetails(event) }} className="mb-6 grid grid-cols-1 gap-4 rounded-xl border border-outline-variant bg-white p-4 sm:grid-cols-2 sm:p-6">
        {([
          ['customerName', 'Customer name', 'text'], ['countryOfResidence', 'Country of residence', 'text'], ['phoneNumber', 'Phone', 'tel'], ['email', 'Email', 'email'],
          ['pickUpLocation', 'Pickup', 'text'], ['dropOffLocation', 'Destination', 'text'],
          ['transferDateTime', 'Pickup time (Turkey)', 'datetime-local'], ['returnDateTime', 'Return time (Turkey)', 'datetime-local'],
          ['passengerCount', 'Passengers', 'number'], ['luggageCount', 'Luggage', 'number'], ['babySeatCount', 'Baby seats', 'number'],
          ['flightNumber', 'Flight number', 'text'], ['hotelName', 'Hotel', 'text'],
          ['transferAddress', 'Transfer address', 'text'],
        ] as const).map(([key, label, type]) => <label key={key} className="block min-w-0 text-sm font-semibold">{label}
          <input type={type} min={type === 'number' ? (key === 'passengerCount' ? 1 : 0) : undefined} required={['customerName', 'phoneNumber', 'email', 'pickUpLocation', 'dropOffLocation', 'transferDateTime', 'passengerCount', 'transferAddress'].includes(key)}
            value={draft[key] ?? ''} onChange={event => setDraft(current => current ? { ...current, [key]: type === 'number' ? Number(event.target.value) : event.target.value } : current)}
            className="mt-2 block w-full min-w-0 rounded-lg border border-outline-variant bg-white px-3 py-3 text-gray-900" />
        </label>)}
        <label className="text-sm font-semibold">Trip type<select value={draft.tripType} onChange={event => setDraft(current => current ? { ...current, tripType: event.target.value as BookingRequest['tripType'], returnDateTime: event.target.value === 'one-way' ? undefined : current.returnDateTime } : current)} className="mt-2 block w-full rounded-lg border border-outline-variant bg-white p-3 text-gray-900"><option value="one-way">One-way</option><option value="round-trip">Round-trip</option></select></label>
        <label className="text-sm font-semibold">Vehicle ID<input required value={draft.vehicleId} onChange={event => setDraft(current => current ? { ...current, vehicleId: event.target.value } : current)} className="mt-2 block w-full rounded-lg border border-outline-variant bg-white p-3 text-gray-900" /></label>
        <label className="sm:col-span-2 text-sm font-semibold">Special requests<textarea value={draft.specialRequests} onChange={event => setDraft(current => current ? { ...current, specialRequests: event.target.value } : current)} className="mt-2 block w-full rounded-lg border border-outline-variant bg-white p-3 text-gray-900" /></label>
        <div className="sm:col-span-2"><p className="mb-3 text-sm text-on-surface-variant">Saving details recalculates the fare and requires a future pickup time.</p><button type="submit" disabled={saving} className="rounded-lg bg-admin-primary px-5 py-3 font-semibold text-white disabled:opacity-50">{saving ? 'Saving...' : 'Save booking details'}</button></div>
      </form>}
      {booking && !editing && (
        <dl className="grid min-w-0 grid-cols-1 gap-5 rounded-xl border border-outline-variant bg-white p-4 sm:grid-cols-2 sm:p-6">
          {[
            ['Customer', booking.customerName],
            ['Passengers', booking.passengerCount],
            ['Pickup', booking.pickUpLocation],
            ['Destination', booking.dropOffLocation],
            ['Pickup time (Turkey)', formatTransferDateTime(booking.transferDateTime)],
            ['Return time (Turkey)', booking.returnDateTime ? formatTransferDateTime(booking.returnDateTime) : 'One-way'],
            ['Flight', booking.flightNumber || 'Not provided'],
            ['Status', bookingStatus(booking.status)],
            ['Email', booking.email || 'Not provided'],
            ['Phone', booking.phoneNumber || 'Not provided'],
            ['Hotel', booking.hotelName || 'Not provided'],
            ['Transfer address', booking.transferAddress || 'Not provided'],
            ['Special requests', booking.specialRequests || 'None'],
            ['Vehicle category', booking.vehicleId || 'Not provided'],
            ['Luggage', booking.luggageCount ?? 'Not provided'],
            ['Baby seats', booking.babySeatCount ?? 'Not provided'],
            ['Published fare (GBP)', `£${Number(booking.price).toFixed(2)}`],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-sm text-on-surface-variant">{label}</dt>
              <dd className="font-semibold break-words">{value}</dd>
            </div>
          ))}
        </dl>
      )}
      <p className="mt-6 text-sm text-on-surface-variant">Booking details are read-only. Do not assume a request is confirmed until the operator verifies it.</p>
    </section>
  )
}
