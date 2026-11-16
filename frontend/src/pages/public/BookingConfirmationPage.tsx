import { useState } from 'react'

import { PublicNavbar } from './PublicNavbar'
import { createBooking } from '../../features/booking/api'

type TransferDetails = {
  pickUpLocation?: string
  dropOffLocation?: string
  pickUpDate?: string
  pickUpTime?: string
  returnDate?: string
  returnTime?: string
  passengerCount?: number
  vehicleId?: string
  vehicleName?: string
  vehicleType?: string
  vehicleClass?: string
  tripType?: 'one-way' | 'round-trip'
  price?: number
}

type PassengerDetails = {
  customerName?: string
  phoneNumber?: string
  email?: string
  hotelName?: string
  countryOfResidence?: string
  transferAddress?: string
  specialRequests?: string
}

function readSavedDetails<T>(key: string): T {
  try {
    return JSON.parse(localStorage.getItem(key) || '{}') as T
  } catch {
    return {} as T
  }
}

const informationLinks = ['Insurance Coverage', 'Trust & Safety']
const legalLinks = ['Terms of Service', 'Privacy Policy']

export function BookingConfirmationPage() {
  const [confirmed, setConfirmed] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [completed, setCompleted] = useState(false)

  const [error, setError] = useState('')
  const [bookingId, setBookingId] = useState<number | null>(null)

  const [transfer] = useState<TransferDetails>(() => readSavedDetails<TransferDetails>('bookingTransferInfo'))
  const [passenger] = useState<PassengerDetails>(() => readSavedDetails<PassengerDetails>('bookingPassengerInfo'))
  const display = (v: unknown) => v == null || v === '' ? 'Not provided' : String(v)
  const price = Number.isFinite(Number(transfer.price)) && transfer.price != null ? '£' + Number(transfer.price).toFixed(2) : 'Price to be confirmed'
  const schedule = transfer.pickUpDate && transfer.pickUpTime ? transfer.pickUpDate + ' ' + transfer.pickUpTime : 'Not provided'
  const returnSchedule = transfer.returnDate && transfer.returnTime ? transfer.returnDate + ' ' + transfer.returnTime : 'Not provided'

  async function handleConfirm() {
    if (!confirmed || processing || completed) return
    setError('')
    const savedTransfer = localStorage.getItem('bookingTransferInfo')
    const savedPassenger = localStorage.getItem('bookingPassengerInfo')
    if (!savedTransfer || !savedPassenger) {
      setError('Your booking information is missing. Please start the booking again.')
      return
    }

    try {
      const transfer = JSON.parse(savedTransfer)
      const passenger = JSON.parse(savedPassenger)
      if (!passenger.customerName || !passenger.phoneNumber || !passenger.email ||
          !transfer.passengerCount || !transfer.pickUpLocation || !transfer.dropOffLocation ||
          !transfer.pickUpDate || !transfer.pickUpTime || !transfer.vehicleId || !transfer.tripType ||
          (transfer.tripType === 'round-trip' && (!transfer.returnDate || !transfer.returnTime)) || !passenger.transferAddress) {
        setError('Please complete all required booking details.')
        return
      }
      setProcessing(true)
      const booking = await createBooking({
        customerName: passenger.customerName,
        passengerCount: transfer.passengerCount,
        pickUpLocation: transfer.pickUpLocation,
        dropOffLocation: transfer.dropOffLocation,
        transferDateTime: `${transfer.pickUpDate}T${transfer.pickUpTime}:00`,
        ...(transfer.tripType === 'round-trip' ? { returnDateTime: `${transfer.returnDate}T${transfer.returnTime}:00` } : {}),
        phoneNumber: passenger.phoneNumber,
        email: passenger.email,
        vehicleId: transfer.vehicleId,
        countryOfResidence: passenger.countryOfResidence || '',
        transferAddress: passenger.transferAddress || '',
        specialRequests: passenger.specialRequests || '',
        tripType: transfer.tripType,
      })
      setBookingId(booking.id)
      setCompleted(true)
      localStorage.removeItem('bookingTransferInfo')
      localStorage.removeItem('bookingPassengerInfo')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking could not be created.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <PublicNavbar />

      <main className="pt-32 pb-24 px-margin-page max-w-6xl mx-auto">
        {completed && bookingId !== null ? (
          <section role="status" className="mx-auto max-w-2xl rounded-2xl border border-green-200 bg-white p-10 text-center shadow-lg">
            <div className="mb-5 text-6xl text-green-600" aria-hidden="true">✓</div>
            <h1 className="text-3xl font-bold text-admin-primary mb-3">Your Booking Request Was Received!</h1>
            <p className="mb-6 text-on-surface-variant">Your transfer request is pending confirmation. Please save your booking reference.</p>
            <p className="text-sm uppercase tracking-wide">Booking Reference</p>
            <p className="text-4xl font-bold text-admin-primary mb-8">#{bookingId}</p>
            <div className="rounded-xl bg-slate-100 p-5 text-left space-y-2">
              <p><strong>Passenger:</strong> {display(passenger.customerName)}</p>
              <p><strong>Pickup:</strong> {display(transfer.pickUpLocation)}</p>
              <p><strong>Destination:</strong> {display(transfer.dropOffLocation)}</p>
              {transfer.tripType === 'round-trip' && <p><strong>Return:</strong> {returnSchedule} ({display(transfer.dropOffLocation)} → {display(transfer.pickUpLocation)})</p>}
              <p><strong>Schedule:</strong> {schedule}</p>
              <p><strong>Price:</strong> {price}</p>
            </div>
            <a href="/" className="mt-8 inline-block rounded-full bg-admin-primary px-8 py-3 text-white">Back to Home</a>
          </section>
        ) : (
          <>
        <ConfirmationStepper />

        <header className="text-center mb-12">
          <h1 className="font-title-lg text-title-lg text-admin-primary mb-2">
            Final Confirmation
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Please review your booking details before confirming your transfer.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter-grid">
          <section className="md:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl p-container-padding card-soft-shadow transition-standard hover:border-primary-fixed-dim">
            <div className="flex items-center gap-3 mb-6 border-b border-outline-variant pb-4">
              <span translate="no" className="material-symbols-outlined text-admin-primary">
                directions_car
              </span>
              <h2 className="font-title-md text-title-md text-on-surface">
                Transfer Summary
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex flex-col gap-4">
                <SummaryBlock
                  icon="flight_takeoff"
                  label="Pickup Location"
                  value={display(transfer.pickUpLocation)}
                />
                <SummaryBlock
                  icon="location_on"
                  label="Destination"
                  value={display(transfer.dropOffLocation)}
                />
              </div>
              <div className="flex flex-col gap-4">
                <SummaryBlock
                  icon="calendar_today"
                  label="Outbound Pickup"
                  value={schedule}
                />
                {transfer.tripType === 'round-trip' && (
                  <>
                    <SummaryBlock
                      icon="event"
                      label="Return Pickup"
                      value={returnSchedule}
                    />
                    <SummaryBlock
                      icon="sync_alt"
                      label="Return Route"
                      value={display(transfer.dropOffLocation) + ' → ' + display(transfer.pickUpLocation)}
                    />
                  </>
                )}
                <SummaryBlock
                  icon="airport_shuttle"
                  label="Vehicle Class"
                  value={display(transfer.vehicleName ?? transfer.vehicleType ?? transfer.vehicleClass)}
                />
              </div>
            </div>
          </section>

          <aside className="md:col-span-4 bg-primary-container text-on-primary-container rounded-xl p-container-padding flex flex-col justify-between shadow-lg">
            <div>
              <h3 className="font-title-md text-title-md text-primary-fixed-dim mb-2">
                Price Details
              </h3>
              <p className="font-label-xs text-label-xs opacity-70 mb-4 uppercase">
                Fixed Airport Rate
              </p>
            </div>
            <div className="py-6 border-y border-on-primary-container/20">
              <div className="flex justify-between items-baseline">
                <span className="font-body-md text-body-md">Estimated Price</span>
                <span className="font-title-lg text-title-lg text-white">{price}</span>
              </div>
              <p className="font-label-xs text-label-xs text-primary-fixed-dim mt-2">
                All taxes, parking, and tolls included.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span translate="no" className="material-symbols-outlined text-sm">info</span>
              <span className="font-label-sm text-label-sm">
                Final price may vary by luggage volume.
              </span>
            </div>
          </aside>

          <section className="md:col-span-6 bg-surface-container-lowest border border-outline-variant rounded-xl p-container-padding card-soft-shadow">
            <div className="flex items-center gap-3 mb-6">
              <span translate="no" className="material-symbols-outlined text-admin-primary">
                person
              </span>
              <h2 className="font-title-md text-title-md">Customer Details</h2>
            </div>
            <div className="space-y-4">
              <DetailRow label="Full Name" value={display(passenger.customerName)} />
              <DetailRow label="Phone" value={display(passenger.phoneNumber)} />
              <DetailRow label="Email" value={display(passenger.email)} />
              <DetailRow label="Country of Residence" value={display(passenger.countryOfResidence)} />
              <DetailRow label="Transfer Address in Turkey" value={display(passenger.transferAddress)} />
              {passenger.specialRequests && <DetailRow label="Special Requests" value={passenger.specialRequests} />}
            </div>
          </section>

          <section className="md:col-span-6 bg-surface-container-lowest border border-outline-variant rounded-xl p-container-padding card-soft-shadow flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <span translate="no" className="material-symbols-outlined text-secondary">
                payments
              </span>
              <h2 className="font-title-md text-title-md">Payment Policy</h2>
            </div>
            <div className="flex-grow space-y-4">
              <div className="p-4 bg-secondary-container/20 rounded-lg border border-secondary-container">
                <p className="font-body-md text-on-secondary-container">
                  Payment is made on the day of your transfer directly to your
                  driver. We accept cash payments in EUR, GBP, USD and TRY.
                </p>
              </div>
              <div>
                <p className="font-label-sm text-on-surface-variant mb-2">
                  Accepted Currencies:
                </p>
                <div className="flex flex-wrap gap-2">
                  {['€ EUR', '$ USD', '£ GBP', '₺ TRY'].map((currency) => (
                    <span
                      className="px-3 py-1 rounded bg-slate-100 text-on-surface-variant font-bold"
                      key={currency}
                    >
                      {currency}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-admin-primary font-semibold">
                <span translate="no"
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified_user
                </span>
                <span className="font-label-sm">
                  Secure Booking: Your reservation is safely stored and
                  submitted for confirmation.
                </span>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-12 bg-white border border-outline-variant rounded-xl p-8 card-soft-shadow text-center max-w-2xl mx-auto">
          <div className="flex flex-col items-center gap-6">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                checked={confirmed}
                className="w-6 h-6 rounded border-outline-variant text-admin-primary focus:ring-admin-primary transition-standard"
                onChange={(event) => setConfirmed(event.target.checked)}
                type="checkbox"
              />
              <span className="font-body-md text-on-surface-variant group-hover:text-on-surface">
                I confirm that all information provided is correct.
              </span>
            </label>
            {error && <p role="alert" className="text-error">{error}</p>}
            {bookingId !== null && <p role="status">Booking reference: #{bookingId}</p>}
            <button
              className="w-full md:w-auto px-12 py-5 bg-admin-primary text-on-primary font-title-md text-title-md rounded-full shadow-lg hover:shadow-xl transition-standard active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!confirmed || processing || completed}
              onClick={handleConfirm}
              type="button"
            >
              {completed
                ? 'REQUEST RECEIVED'
                : processing
                  ? 'PROCESSING...'
                  : 'CONFIRM BOOKING'}
            </button>
            <p className="font-label-xs text-label-xs text-outline">
              By clicking confirm, you agree to our Terms of Service and Privacy
              Policy.
            </p>
          </div>
        </section>
          </>
        )}
      </main>

      <ConfirmationFooter />
    </div>
  )
}

function ConfirmationStepper() {
  return (
    <section className="mb-12">
      <div className="flex justify-between items-center max-w-3xl mx-auto relative">
        <StepperItem complete label="Transfer" />
        <StepperItem complete label="Passenger" />
        <StepperItem active label="Confirmation" />
      </div>
    </section>
  )
}

function StepperItem({
  active = false,
  complete = false,
  label,
}: {
  active?: boolean
  complete?: boolean
  label: string
}) {
  return (
    <div
      className={`confirmation-step flex flex-col items-center gap-2 ${
        complete ? 'is-complete' : ''
      }`}
    >
      <div
        className={`rounded-full flex items-center justify-center ${
          active
            ? 'w-12 h-12 border-4 border-admin-primary bg-white shadow-lg -translate-y-1'
            : 'w-10 h-10 bg-admin-primary text-on-primary'
        }`}
      >
        <span
          className={`material-symbols-outlined ${active ? 'text-admin-primary' : ''}`}
          style={{ fontVariationSettings: complete ? "'FILL' 1" : "'FILL' 0" }}
        >
          {active ? 'fact_check' : 'check'}
        </span>
      </div>
      <span className="font-label-sm text-label-sm text-admin-primary font-bold">
        {label}
      </span>
    </div>
  )
}

function SummaryBlock({
  icon,
  label,
  value,
}: {
  icon: string
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="p-2 rounded bg-slate-100 text-admin-primary">
        <span translate="no" className="material-symbols-outlined text-[20px]">{icon}</span>
      </div>
      <div>
        <p className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider">
          {label}
        </p>
        <p className="font-title-md text-title-md">{value}</p>
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center gap-4 p-3 rounded-lg bg-slate-100">
      <span className="font-label-sm text-on-surface-variant">{label}</span>
      <span className="font-body-md font-semibold text-right">{value}</span>
    </div>
  )
}

function ConfirmationFooter() {
  return (
    <footer className="w-full py-12 bg-slate-200 border-t border-outline-variant">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter-grid px-margin-page max-w-7xl mx-auto">
        <div className="flex flex-col gap-4">
          <span className="font-title-md text-title-md font-bold text-admin-primary">
            VIP Transfer Dalaman
          </span>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Professional airport transfer services specialized in Dalaman routes.
          </p>
        </div>
        <FooterColumn title="Information" items={informationLinks} />
        <FooterColumn title="Legal" items={legalLinks} />
        <div className="flex flex-col gap-2">
          <p className="font-label-sm font-bold text-on-surface">Support</p>
          <a
            className="font-body-md text-body-md text-on-surface-variant hover:text-admin-primary"
            href="#"
          >
            Contact Support
          </a>
          <p className="font-label-sm text-on-surface-variant mt-2">
            Available 24/7 via WhatsApp
          </p>
        </div>
      </div>
      <div className="mt-12 px-margin-page text-center border-t border-outline-variant/30 pt-8">
        <p className="font-body-md text-body-md text-on-surface-variant">
          © 2024 VIP Transfer Dalaman. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

function FooterColumn({ items, title }: { items: string[]; title: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-label-sm font-bold text-on-surface">{title}</p>
      {items.map((item) => (
        <a
          className="font-body-md text-body-md text-on-surface-variant hover:text-admin-primary"
          href="#"
          key={item}
        >
          {item}
        </a>
      ))}
    </div>
  )
}
