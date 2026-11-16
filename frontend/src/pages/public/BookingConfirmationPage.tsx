import { Link } from 'react-router-dom'
import { useState } from 'react'

import { PublicNavbar } from './PublicNavbar'
import { useAsyncAction } from '../../hooks/useAsyncAction'
import { ProcessingButton } from '../../components/ProcessingButton'
import { createBooking } from '../../features/booking/api'
import { BookingApiError } from '../../features/booking/api/errors'
import { findTransferPrice, transferVehicles } from '../../features/booking/pricing'
import { validateBookingDetails } from '../../features/booking/validateBookingDetails'
import type { TransferDetails, PassengerDetails } from '../../features/booking/validateBookingDetails'
import { readReceiptFromStorages, saveReceiptToStorages } from '../../features/booking/receipt'
import type { BookingReceipt, ReceiptStorage } from '../../features/booking/receipt'

function availableReceiptStorages(): ReceiptStorage[] {
  const storages: ReceiptStorage[] = []
  try { storages.push(sessionStorage) } catch { /* Storage may be disabled. */ }
  try { storages.push(localStorage) } catch { /* Storage may be disabled. */ }
  return storages
}

function readReceipt(): BookingReceipt | null {
  return readReceiptFromStorages(availableReceiptStorages())
}

function readSavedDetails<T>(key: string): T {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) || '{}')
    return value && typeof value === 'object' && !Array.isArray(value) ? value as T : {} as T
  } catch {
    return {} as T
  }
}


export function BookingConfirmationPage() {
  const [confirmed, setConfirmed] = useState(false)
  const { processing, run } = useAsyncAction()
  const [receipt, setReceipt] = useState<BookingReceipt | null>(readReceipt)

  const [error, setError] = useState('')
  const [submissionUncertain, setSubmissionUncertain] = useState(false)

  const [transfer] = useState<TransferDetails>(() => readSavedDetails<TransferDetails>('bookingTransferInfo'))
  const [passenger] = useState<PassengerDetails>(() => readSavedDetails<PassengerDetails>('bookingPassengerInfo'))
  const display = (v: unknown) => v == null || v === '' ? 'Not provided' : String(v)
  const routeDestination = transfer.pickUpLocation === 'Dalaman Airport' ? transfer.dropOffLocation : transfer.dropOffLocation === 'Dalaman Airport' ? transfer.pickUpLocation : ''
  const catalogPrice = routeDestination && transfer.vehicleId && transfer.tripType ? findTransferPrice(routeDestination, transfer.vehicleId, transfer.tripType) : null
  const price = catalogPrice === null ? 'Price to be confirmed' : `£${catalogPrice.toFixed(2)}`
  const schedule = transfer.pickUpDate && transfer.pickUpTime ? transfer.pickUpDate + ' ' + transfer.pickUpTime : 'Not provided'
  const returnSchedule = transfer.returnDate && transfer.returnTime ? transfer.returnDate + ' ' + transfer.returnTime : 'Not provided'

  function handleConfirm() {
    if (!confirmed || receipt !== null) return
    void run(async () => {
    setError('')
    setSubmissionUncertain(false)
    try {
      const savedTransfer = localStorage.getItem('bookingTransferInfo')
      const savedPassenger = localStorage.getItem('bookingPassengerInfo')
      if (!savedTransfer || !savedPassenger) {
        setError('Your booking information is missing. Please start the booking again.')
        return
      }
      let transfer: unknown
      let passenger: unknown
      try {
        transfer = JSON.parse(savedTransfer)
        passenger = JSON.parse(savedPassenger)
      } catch {
        setError('Saved booking details are invalid. Please return to the previous steps and enter them again.')
        return
      }
      if (!transfer || typeof transfer !== 'object' || Array.isArray(transfer) ||
          !passenger || typeof passenger !== 'object' || Array.isArray(passenger)) {
        setError('Saved booking details are invalid. Please return to the previous steps.')
        return
      }
      const transferData = transfer as TransferDetails
      const passengerData = passenger as PassengerDetails
      const validationError = validateBookingDetails(transferData, passengerData)
      if (validationError) {
        setError(validationError)
        return
      }
      // TypeScript narrows optional draft fields before constructing the API request.
      if (!transferData.pickUpDate || !transferData.pickUpTime || !transferData.vehicleId ||
          !transferData.pickUpLocation || !transferData.dropOffLocation || !transferData.tripType ||
          transferData.passengerCount === undefined || !passengerData.customerName ||
          !passengerData.phoneNumber || !passengerData.email) {
        setError('Required booking information is missing. Please return to the previous steps.')
        return
      }
      const booking = await createBooking({
        customerName: passengerData.customerName,
        passengerCount: transferData.passengerCount,
        pickUpLocation: transferData.pickUpLocation,
        dropOffLocation: transferData.dropOffLocation,
        transferDateTime: `${transferData.pickUpDate}T${transferData.pickUpTime}:00`,
        ...(transferData.tripType === 'round-trip' ? { returnDateTime: `${transferData.returnDate}T${transferData.returnTime}:00` } : {}),
        phoneNumber: passengerData.phoneNumber,
        email: passengerData.email,
        vehicleId: transferData.vehicleId,
        ...(transferData.flightNumber ? { flightNumber: transferData.flightNumber } : {}),
        ...(typeof transferData.luggageCount === 'number' ? { luggageCount: transferData.luggageCount } : {}),
        ...(typeof transferData.babySeatCount === 'number' ? { babySeatCount: transferData.babySeatCount } : {}),
        countryOfResidence: passengerData.countryOfResidence || '',
        transferAddress: passengerData.transferAddress || '',
        hotelName: passengerData.hotelName || '',
        specialRequests: passengerData.specialRequests || '',
        tripType: transferData.tripType,
      })
      const savedReceipt: BookingReceipt = {
        id: booking.id,
        savedAt: Date.now(),
        customerName: passengerData.customerName,
        pickUpLocation: transferData.pickUpLocation,
        dropOffLocation: transferData.dropOffLocation,
        schedule: `${transferData.pickUpDate} ${transferData.pickUpTime}`,
        ...(transferData.tripType === 'round-trip' ? { returnSchedule: `${transferData.returnDate} ${transferData.returnTime}` } : {}),
      }
      saveReceiptToStorages(savedReceipt, availableReceiptStorages())
      setReceipt(savedReceipt)
      try {
        localStorage.removeItem('bookingTransferInfo')
        localStorage.removeItem('bookingPassengerInfo')
      } catch {
        // Booking succeeded; failure to clean up local drafts must not show an error.
      }
    } catch (err) {
      setSubmissionUncertain(err instanceof BookingApiError && err.uncertain)
      setError(err instanceof Error ? err.message : 'Booking could not be created.')
    }
    })
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <PublicNavbar />

      <main className="pt-32 pb-24 px-margin-page max-w-6xl mx-auto">
        {receipt !== null ? (
          <section role="status" className="mx-auto max-w-2xl rounded-2xl border border-green-200 bg-white p-10 text-center shadow-lg">
            <div className="mb-5 text-6xl text-green-600" aria-hidden="true">✓</div>
            <h1 className="text-3xl font-bold text-admin-primary mb-3">Your Booking Request Was Received!</h1>
            <p className="mb-3 text-on-surface-variant">Your transfer request is pending confirmation. Please save your booking reference.</p>
            <p className="mb-6 text-sm text-on-surface-variant">Automatic confirmation emails are not available yet. Please keep this reference and contact us if you need an update.</p>
            <p className="text-sm uppercase tracking-wide">Booking Reference</p>
            <p className="text-4xl font-bold text-admin-primary mb-8">#{receipt.id}</p>
            <div className="mb-6 flex flex-wrap justify-center gap-3">
              <button
                className="rounded-lg border border-admin-primary px-5 py-2 font-semibold text-admin-primary hover:bg-slate-100"
                onClick={() => {
                  if (navigator.clipboard?.writeText) {
                    void navigator.clipboard.writeText(String(receipt.id)).catch(() => setError('Unable to copy automatically. Please select the booking reference above.'))
                  } else {
                    setError('Automatic copy is unavailable. Please select the booking reference above.')
                  }
                }}
                type="button"
              >
                Copy Booking Reference
              </button>
              <a
                className="rounded-lg bg-admin-primary px-5 py-2 font-semibold text-white"
                href={`mailto:ali_sonmez35@hotmail.com?subject=${encodeURIComponent(`Booking request #${receipt.id}`)}`}
              >
                Contact About This Booking
              </a>
            </div>
            {error && <p role="alert" className="mb-4 text-sm text-error">{error}</p>}
            <div className="rounded-xl bg-slate-100 p-5 text-left space-y-2">
              <p><strong>Passenger:</strong> {display(receipt.customerName)}</p>
              <p><strong>Pickup:</strong> {display(receipt.pickUpLocation)}</p>
              <p><strong>Destination:</strong> {display(receipt.dropOffLocation)}</p>
              {receipt.returnSchedule && <p><strong>Return:</strong> {receipt.returnSchedule} ({receipt.dropOffLocation} → {receipt.pickUpLocation})</p>}
              <p><strong>Schedule:</strong> {receipt.schedule}</p>
              <p className="text-sm text-on-surface-variant">Keep this reference for your records. Your request is awaiting confirmation.</p>
            </div>
            <Link to="/" className="mt-8 inline-block rounded-full bg-admin-primary px-8 py-3 text-white">Back to Home</Link>
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
                {transfer.flightNumber && <SummaryBlock icon="flight_takeoff" label="Flight Number" value={transfer.flightNumber} />}
                <SummaryBlock icon="luggage" label="Luggage" value={display(transfer.luggageCount)} />
                <SummaryBlock icon="child_care" label="Baby Seats" value={display(transfer.babySeatCount)} />
                <SummaryBlock
                  icon="airport_shuttle"
                  label="Vehicle Class"
                  value={display(transferVehicles.find(vehicle => vehicle.id === transfer.vehicleId)?.name)}
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
                Published Route Estimate
              </p>
            </div>
            <div className="py-6 border-y border-on-primary-container/20">
              <div className="flex justify-between items-baseline">
                <span className="font-body-md text-body-md">Estimated Price</span>
                <span className="font-title-lg text-title-lg text-white">{price}</span>
              </div>
              <p className="font-label-xs text-label-xs text-primary-fixed-dim mt-2">
                The final fare and any additional charges will be confirmed before your transfer.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span translate="no" className="material-symbols-outlined text-sm">info</span>
              <span className="font-label-sm text-label-sm">
                Please check your luggage count and special requests before submitting.
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
              {passenger.hotelName && <DetailRow label="Hotel / Accommodation" value={passenger.hotelName} />}
              <DetailRow label="Transfer Address in Turkey" value={display(passenger.transferAddress)} />
              {passenger.specialRequests && <DetailRow label="Special Requests" value={passenger.specialRequests} />}
            </div>
          </section>

          <section className="md:col-span-6 bg-surface-container-lowest border border-outline-variant rounded-xl p-container-padding card-soft-shadow flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <span translate="no" className="material-symbols-outlined text-secondary">
                payments
              </span>
              <h2 className="font-title-md text-title-md">Payment Information</h2>
            </div>
            <div className="flex-grow space-y-4">
              <p className="font-body-md text-on-surface-variant">
                Your request does not collect a payment online. Payment method,
                accepted currencies and any additional charges must be agreed
                with the transfer provider before the journey.
              </p>
              <p className="font-label-sm text-on-surface-variant">
                Submitting a booking request does not mean the transfer has been confirmed.
              </p>
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
            {submissionUncertain && <p role="status" className="max-w-lg text-sm text-on-surface-variant">The request may have reached us. Keep this page open. You can retry using the same button; the booking reference key is reused for this request. If you remain unsure, contact support before starting a new booking.</p>}
            <ProcessingButton
              processing={processing}
              processingLabel="PROCESSING..."
              className="w-full md:w-auto px-12 py-5 bg-admin-primary text-on-primary font-title-md text-title-md rounded-full shadow-lg hover:shadow-xl transition-standard active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!confirmed || processing || receipt !== null}
              onClick={handleConfirm}
              type="button"
            >
              CONFIRM BOOKING
            </ProcessingButton>
            <p className="font-label-xs text-label-xs text-outline">
              By submitting, you confirm the details above are accurate and request a transfer.
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
    <footer className="w-full border-t border-outline-variant bg-slate-100 px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-on-surface-variant">
          © {new Date().getFullYear()} VIP Transfer Dalaman
        </p>
        <div className="flex gap-5 text-sm">
          <Link className="text-admin-primary hover:underline" to="/contact">Contact</Link>
          <Link className="text-admin-primary hover:underline" to="/services">Services</Link>
        </div>
      </div>
    </footer>
  )
}
