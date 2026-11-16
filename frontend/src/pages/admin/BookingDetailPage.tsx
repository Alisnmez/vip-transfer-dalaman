import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getBooking } from '../../features/booking/api'
import { bookingStatus, formatTransferDateTime } from '../../features/booking/formatters'
import type { Booking } from '../../features/booking/types'

export function BookingDetailPage() {
  const { bookingId } = useParams()
  const id = Number(bookingId)
  const [booking, setBooking] = useState<Booking | null>(null)
  const [error, setError] = useState('')
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

  return (
    <section className="p-8 max-w-4xl">
      <Link className="text-admin-primary underline" to="/admin/bookings">Back to bookings</Link>
      <h1 className="mt-6 mb-5 text-2xl font-bold">Booking request #{bookingId}</h1>
      {(!Number.isSafeInteger(id) || id < 1) && <p role="alert">Invalid booking reference.</p>}
      {loading && Number.isSafeInteger(id) && id > 0 && <p>Loading booking...</p>}
      {error && <p role="alert" className="text-error">Could not load booking: {error}</p>}
      {booking && (
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5 rounded-xl bg-white p-6 border border-outline-variant">
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
