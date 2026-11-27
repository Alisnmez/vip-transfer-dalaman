import { DispatchDetails } from './DispatchPanel'
import { bookingVehicles, vehicleLabel } from '../../features/booking/bookingVehicles'
import { useEffect, useState } from 'react'
import { useAsyncAction } from '../../hooks/useAsyncAction'
import { Link, useLocation, useParams } from 'react-router-dom'
import { ProcessingButton } from '../../components/ProcessingButton'

import { getBooking, getBookingEmailStatuses, updateBooking, updateBookingStatus } from '../../features/booking/api'
import type { BookingEmailStatus } from '../../features/booking/api'
import { adminBookingStatusLabel, bookingStatus, formatBookingReceivedAt, formatTransferDateTime } from '../../features/booking/formatters'
import { bookingErrorMessage } from '../../features/booking/api/errors'
import type { Booking, BookingRequest } from '../../features/booking/types'
import { transferPrices } from '../../features/booking/pricing'
import { useTransferPrices } from '../../features/booking/useTransferPrices'
import { validateAdminSchedule } from '../../features/booking/validateAdminSchedule'
import { validateTransferSelection } from '../../features/booking/validateTransferSelection'

const pricedDestinations = [...new Set(transferPrices.map(price => price.destination))]
const airport = 'Dalaman Airport'
const nextStatuses: Record<string, string[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PENDING', 'COMPLETED', 'CANCELLED'],
  COMPLETED: ['CONFIRMED', 'PENDING'],
  CANCELLED: [],
}

export function BookingDetailPage() {
  const location = useLocation()
  const { bookingId } = useParams()
  const { prices: currentPrices } = useTransferPrices()
  const id = Number(bookingId)
  const [booking, setBooking] = useState<Booking | null>(null)
  const [emailStatuses, setEmailStatuses] = useState<BookingEmailStatus[] | null>(null)
  const [emailError, setEmailError] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)
  const [error, setError] = useState('')
  const [errorAction, setErrorAction] = useState('loading booking')
  const [notice, setNotice] = useState('')
  const { processing: saving, run: runSaving } = useAsyncAction()
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

  async function refreshEmailStatuses() {
    if (!Number.isSafeInteger(id) || id < 1) return
    setEmailLoading(true); setEmailError('')
    try { setEmailStatuses(await getBookingEmailStatuses(id)) }
    catch (error) { setEmailError(error instanceof Error ? error.message : 'Could not load email history.') }
    finally { setEmailLoading(false) }
  }

  async function changeStatus(status: string) {
    if (!booking || status === bookingStatus(booking.status)) return
    if (bookingStatus(booking.status) === 'CONFIRMED' && status === 'PENDING' && !window.confirm('Move this confirmed booking back to New Request? No status email will be sent.')) return
    if (status === 'COMPLETED' && !window.confirm('Mark this transfer as completed? A thank-you email will be queued for the customer.')) return
    if (status === 'CANCELLED' && !window.confirm('Cancel this booking request?')) return
    if (bookingStatus(booking.status) === 'COMPLETED' && !window.confirm(`Reopen this completed booking as ${adminBookingStatusLabel(status)}? Only do this to correct an incorrectly completed booking.`)) return
    await runSaving(async () => {
      setError(''); setNotice('')
      try { setBooking(await updateBookingStatus(booking.id, status)); setNotice('Status updated successfully.'); window.dispatchEvent(new Event('dispatch-updated')) }
      catch (err) { setError(bookingErrorMessage(err, 'status')); setErrorAction('updating status') }
    })
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

  const destination = draft ? (draft.pickUpLocation === airport ? draft.dropOffLocation : draft.pickUpLocation) : ''
  const routeValid = !!draft && (draft.pickUpLocation === airport) !== (draft.dropOffLocation === airport)
  const selectedPrice = draft && routeValid
    ? currentPrices.find(price => price.destination === destination && price.vehicleId === draft.vehicleId)
    : undefined
  const capacityValid = !!draft && validateTransferSelection(draft, booking?.vehicleId) === null
  const previewFare = selectedPrice && draft && capacityValid
    ? (draft.tripType === 'round-trip' ? selectedPrice.roundTrip : selectedPrice.oneWay)
    : null

  async function saveDetails(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!draft || !booking) return
    const scheduleError = validateAdminSchedule(draft, booking)
    if (scheduleError) { setError(scheduleError); setErrorAction('saving details'); return }
    const destination = draft.pickUpLocation === airport ? draft.dropOffLocation : draft.pickUpLocation
    const validRoute = (draft.pickUpLocation === airport) !== (draft.dropOffLocation === airport)
    const priced = transferPrices.some(price => price.destination === destination && price.vehicleId === draft.vehicleId)
    const fareChanged = draft.pickUpLocation !== booking.pickUpLocation
      || draft.dropOffLocation !== booking.dropOffLocation
      || draft.vehicleId !== booking.vehicleId
      || draft.tripType !== booking.tripType
      || draft.passengerCount !== booking.passengerCount
    if (fareChanged && !['PENDING', 'CONFIRMED', 'COMPLETED'].includes(bookingStatus(booking.status))) {
      setError('This booking is already ' + bookingStatus(booking.status) + '. Fare-changing edits are not allowed for cancelled bookings.')
      setErrorAction('saving details')
      return
    }
    if (fareChanged && (!validRoute || !priced)) {
      setError('Choose an airport route and a vehicle from the price list before saving.')
      setErrorAction('saving details')
      return
    }
    if (fareChanged && (previewFare === null || !capacityValid)) { setError('Select a valid route, vehicle and passenger/luggage capacity to calculate the new fare.'); setErrorAction('saving details'); return }
    if (fareChanged && !window.confirm(`Update booking fare from £${Number(booking.price).toFixed(2)} to £${previewFare?.toFixed(2)}?${bookingStatus(booking.status) === 'COMPLETED' ? ' This trip is already completed; this will correct its historical fare.' : ' Confirm the new price with the customer before saving.'}`)) return
    await runSaving(async () => {
      setError(''); setNotice('')
      try { setBooking(await updateBooking(booking.id, draft)); setEditing(false); setNotice('Booking details saved.') }
      catch (err) { setError(bookingErrorMessage(err, 'edit')); setErrorAction('saving details') }
    })
  }

  return (
    <section className="min-w-0 max-w-4xl p-4 sm:p-8">
      <Link className="text-admin-primary underline" to={{pathname:'/admin/bookings',search:location.state?.dispatchQuery || ''}}>Back to bookings</Link>
      <h1 className="mt-6 mb-5 text-2xl font-bold">Booking request #{bookingId}</h1>
      {(!Number.isSafeInteger(id) || id < 1) && <p role="alert">Invalid booking reference.</p>}
      {loading && Number.isSafeInteger(id) && id > 0 && <p>Loading booking...</p>}
      {error && <p role="alert" className="text-error">Error while {errorAction}: {error}</p>}
      {notice && <p role="status" className="mb-4 text-green-800">{notice}</p>}
      {booking && <div className="mb-5 flex flex-wrap items-end gap-3 rounded-xl border border-outline-variant bg-white p-4">
        <label className="text-sm font-semibold">Booking status
          <select aria-label="Booking status" disabled={saving} value={bookingStatus(booking.status)} onChange={event => { void changeStatus(event.target.value) }} className="mt-2 block rounded-lg border border-outline-variant bg-white px-4 py-3 text-gray-900">
            {[bookingStatus(booking.status), ...(nextStatuses[bookingStatus(booking.status)] ?? [])].map(status => <option key={status} value={status}>{status === 'CONFIRMED' ? 'Driver Assigned' : adminBookingStatusLabel(status)}</option>)}
          </select>
        </label>
        {booking.phoneNumber && <a className="rounded-lg border p-3" href={`tel:${booking.phoneNumber}`}>Call customer</a>}
        {booking.email && <a className="rounded-lg border p-3" href={`mailto:${booking.email}`}>Email customer</a>}
        <button type="button" className="rounded-lg border p-3" onClick={async () => {
          try { await navigator.clipboard.writeText([booking.reference, booking.customerName, booking.pickUpLocation+' → '+booking.dropOffLocation, formatTransferDateTime(booking.transferDateTime), booking.returnDateTime && 'Return '+formatTransferDateTime(booking.returnDateTime), booking.passengerCount+' passengers'].filter(Boolean).join('\n')); setNotice('Trip details copied.') }
          catch { setNotice('Clipboard unavailable in this browser.') }
        }}>Copy trip details</button>
        <button type="button" disabled={saving} onClick={editing ? () => setEditing(false) : beginEdit} className="rounded-lg border border-outline-variant bg-white px-4 py-3 font-semibold text-gray-900">{editing ? 'Cancel editing' : 'Edit booking details'}</button>
      </div>}
      {booking && <DispatchDetails key={booking.id} id={booking.id} readNoticeLeg={location.state?.readNoticeLeg} />}
      {editing && draft && <form onSubmit={event => { void saveDetails(event) }} className="mb-6 grid grid-cols-1 gap-4 rounded-xl border border-outline-variant bg-white p-4 sm:grid-cols-2 sm:p-6">
        {([
          ['customerName', 'Customer name', 'text'], ['countryOfResidence', 'Country of residence', 'text'], ['phoneNumber', 'Phone', 'tel'], ['email', 'Email', 'email'],
          ['transferDateTime', 'Pickup time (Turkey)', 'datetime-local'], ['returnDateTime', 'Return time (Turkey)', 'datetime-local'],
          ['passengerCount', 'Passengers', 'number'], ['luggageCount', 'Luggage', 'number'], ['babySeatCount', 'Baby seats', 'number'],
          ['flightNumber', 'Flight number', 'text'], ['hotelName', 'Hotel', 'text'],
          ['transferAddress', 'Transfer address', 'text'],
        ] as const).map(([key, label, type]) => <label key={key} className="block min-w-0 text-sm font-semibold">{label}
          <input type={type} min={type === 'number' ? (key === 'passengerCount' ? 1 : 0) : undefined} required={['customerName', 'phoneNumber', 'email', 'pickUpLocation', 'dropOffLocation', 'transferDateTime', 'passengerCount', 'transferAddress'].includes(key)}
            value={draft[key] ?? ''} onChange={event => setDraft(current => current ? { ...current, [key]: type === 'number' ? Number(event.target.value) : event.target.value } : current)}
            className="mt-2 block w-full min-w-0 rounded-lg border border-outline-variant bg-white px-3 py-3 text-gray-900" />
        </label>)}
        {(['pickUpLocation', 'dropOffLocation'] as const).map(key => (
          <label key={key} className="text-sm font-semibold">{key === 'pickUpLocation' ? 'Pickup' : 'Destination'}
            <select required value={draft[key]} onChange={event => setDraft(current => current ? { ...current, [key]: event.target.value } : current)} className="mt-2 block w-full rounded-lg border border-outline-variant bg-white p-3 text-gray-900">
              <option value="">Select location</option>
              {[airport, ...pricedDestinations].map(location => <option key={location} value={location}>{location}</option>)}
            </select>
          </label>
        ))}
        <label className="text-sm font-semibold">Vehicle
          <select aria-label="Vehicle" required value={draft.vehicleId} onChange={event => setDraft(current => current ? { ...current, vehicleId: event.target.value } : current)} className="mt-2 block w-full rounded-lg border border-outline-variant bg-white p-3 text-gray-900">
            <option value="">Select vehicle</option>
            {bookingVehicles.map(vehicle => <option key={vehicle.id} value={vehicle.id}>{vehicle.name}</option>)}
            {booking?.vehicleId && !bookingVehicles.some(vehicle => vehicle.id === booking.vehicleId) && (
              <option value={booking.vehicleId}>{vehicleLabel(booking.vehicleId)} (previous category)</option>
            )}
          </select>
        </label>
        <label className="text-sm font-semibold">Trip type<select value={draft.tripType} onChange={event => setDraft(current => current ? { ...current, tripType: event.target.value as BookingRequest['tripType'], returnDateTime: event.target.value === 'one-way' ? undefined : current.returnDateTime } : current)} className="mt-2 block w-full rounded-lg border border-outline-variant bg-white p-3 text-gray-900"><option value="one-way">One-way</option><option value="round-trip">Round-trip</option></select></label>
        <label className="sm:col-span-2 text-sm font-semibold">Special requests<textarea value={draft.specialRequests} onChange={event => setDraft(current => current ? { ...current, specialRequests: event.target.value } : current)} className="mt-2 block w-full rounded-lg border border-outline-variant bg-white p-3 text-gray-900" /></label>
        <div className="sm:col-span-2 rounded-lg border border-outline-variant bg-gray-50 p-4" aria-live="polite">
          <p className="text-sm text-on-surface-variant">Current saved fare</p>
          <p className="text-lg font-bold">£{Number(booking?.price ?? 0).toFixed(2)}</p>
          <p className="mt-2 text-sm text-on-surface-variant">New fare for selected destination, vehicle and trip type</p>
          <p className="text-xl font-bold">{previewFare === null ? 'Unavailable — check route and capacity' : `£${previewFare.toFixed(2)}`}</p>
          <p className="mt-1 text-xs text-on-surface-variant">Preview from the published price list; the server recalculates the final amount on save.</p>
        </div>
        <div className="sm:col-span-2"><p className="mb-3 text-sm text-on-surface-variant">Contact and flight edits keep the original fare. Changing route, vehicle, trip type or passenger count recalculates the fare; changing dates requires a future pickup.</p><ProcessingButton type="submit" processing={saving} processingLabel="Saving booking..." className="rounded-lg bg-admin-primary px-5 py-3 font-semibold text-white disabled:opacity-50">Save booking details</ProcessingButton></div>
      </form>}
      {booking && !editing && (
        <dl className="grid min-w-0 grid-cols-1 gap-5 rounded-xl border border-outline-variant bg-white p-4 sm:grid-cols-2 sm:p-6">
          {[
            ['Received at (Turkey)', formatBookingReceivedAt(booking.createdAt)],
            ['Customer', booking.customerName],
            ['Passengers', booking.passengerCount],
            ['Pickup', booking.pickUpLocation],
            ['Destination', booking.dropOffLocation],
            ['Pickup time (Turkey)', formatTransferDateTime(booking.transferDateTime)],
            ['Return time (Turkey)', booking.returnDateTime ? formatTransferDateTime(booking.returnDateTime) : 'One-way'],
            ['Flight', booking.flightNumber || 'Not provided'],
            ['Status', adminBookingStatusLabel(booking.status)],
            ['Email', booking.email || 'Not provided'],
            ['Phone', booking.phoneNumber || 'Not provided'],
            ['Hotel', booking.hotelName || 'Not provided'],
            ['Transfer address', booking.transferAddress || 'Not provided'],
            ['Special requests', booking.specialRequests || 'None'],
            ['Vehicle category', vehicleLabel(booking.vehicleId)],
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
      {booking && <section aria-label="Booking email history" className="mt-6 rounded-xl border border-outline-variant bg-white p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h2 className="text-lg font-bold">Email delivery history</h2><p className="text-sm text-on-surface-variant">Provider acceptance is not proof of inbox delivery. No messages are resent from this screen.</p></div>
          <button type="button" disabled={emailLoading} onClick={() => { void refreshEmailStatuses() }} className="rounded-lg bg-admin-primary px-4 py-2 font-semibold text-white disabled:opacity-50">{emailLoading ? 'Checking...' : 'Check email status'}</button>
        </div>
        {emailError && <p role="alert" className="mt-3 text-error">{emailError}</p>}
        {emailStatuses && <div className="mt-4 space-y-3" aria-live="polite">
          {emailStatuses.length === 0 && <p>No queued emails were found for this booking. Check whether email was enabled when it was created.</p>}
          {emailStatuses.map(item => <article key={item.id} className="rounded-lg border border-outline-variant bg-gray-50 p-3 text-sm">
            <div className="flex flex-wrap justify-between gap-2"><strong>{item.recipientRole === 'CUSTOMER' ? 'Customer' : 'Operator / other'} · {item.eventType}</strong><strong>{item.status}</strong></div>
            <p>Attempts: {item.attempts} · Created: {new Date(item.createdAt).toLocaleString()}</p>
            <p>Accepted by provider: {item.providerAccepted ? 'Yes (not delivery confirmation)' : 'No / unknown'}</p>
            {item.lastError && <p className="text-error">Last error: {item.lastError}</p>}
            {item.status === 'FAILED' && <p className="font-semibold text-amber-800">Requires manual review. Do not resend without checking the mailbox first.</p>}
          </article>)}
        </div>}
      </section>}
      <p className="mt-6 text-sm text-on-surface-variant">Status changes and customer detail edits are separate. Editing details only recalculates the fare when pricing inputs change. Verify the new fare with the customer before confirming.</p>
    </section>
  )
}
