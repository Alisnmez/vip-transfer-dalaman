import { normalizeFlightNumber } from '../../shared/utils/inputValidation'
import { VehiclePhoto } from './VehiclePhoto'
import { useBookingCopy } from '../../shared/localization/bookingCopy'
import { bookingVehicles, clampVehicleCount } from '../../features/booking/bookingVehicles'
import { supportEmail } from '../../features/booking/support'
import { Link, useSearchParams } from 'react-router-dom'
import { useEffect, useId, useState } from 'react'

import { BookingPolicyLinks } from './BookingPolicyLinks'
import { PublicNavbar } from './PublicNavbar'
import { RequiredFieldNote, RequiredMark } from '../../components/RequiredFieldNote'
import { trackAnalyticsEvent } from '../../features/analytics/analytics'
import { initialTransferRoute } from '../../features/booking/initialTransferRoute'
import { transferPrices } from '../../features/booking/pricing'
import { useTransferPrices } from '../../features/booking/useTransferPrices'
import { turkeyToday } from '../../features/booking/turkeyTime'
import { destinationGroups } from '../../features/booking/destinationGroups'
import { validateTransferSchedule } from '../../features/booking/validateTransferSchedule'
import { validateTransferSelection } from '../../features/booking/validateTransferSelection'

type TransferDraft = {
  tripType?: 'one-way' | 'round-trip'
  vehicleId?: string
  pickUpLocation?: string
  dropOffLocation?: string
  pickUpDate?: string
  pickUpTime?: string
  flightNumber?: string
  returnDate?: string
  returnTime?: string
  passengerCount?: number
  luggageCount?: number
  babySeatCount?: number
}

function readTransferDraft(): TransferDraft {
  try {
    const value: unknown = JSON.parse(sessionStorage.getItem('bookingTransferInfo') || '{}')
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
    const raw = value as Record<string, unknown>
    const readString = (key: string) => typeof raw[key] === 'string' ? raw[key] as string : undefined
    const readCount = (key: string) => typeof raw[key] === 'number' && Number.isInteger(raw[key]) ? raw[key] as number : undefined
    return {
      tripType: raw.tripType === 'round-trip' ? 'round-trip' : 'one-way',
      vehicleId: readString('vehicleId'),
      pickUpLocation: readString('pickUpLocation'),
      dropOffLocation: readString('dropOffLocation'),
      pickUpDate: readString('pickUpDate'),
      pickUpTime: readString('pickUpTime'),
      flightNumber: readString('flightNumber'),
      returnDate: readString('returnDate'),
      returnTime: readString('returnTime'),
      passengerCount: readCount('passengerCount'),
      luggageCount: readCount('luggageCount'),
      babySeatCount: readCount('babySeatCount'),
    }
  } catch {
    return {}
  }
}

export function BookingFormPage() {
  const t = useBookingCopy()
  const { findPrice: findTransferPrice, loading: pricesLoading, error: pricesError, refresh: refreshPrices } = useTransferPrices()
  useEffect(() => { trackAnalyticsEvent('booking_started') }, [])
  const [searchParams] = useSearchParams()
  const [draft] = useState(readTransferDraft)
  const requestedVehicleId = searchParams.get('vehicle')
  const initialRoute = initialTransferRoute(searchParams.get('destination'), draft)
  const initialVehicleId = bookingVehicles.some(vehicle => vehicle.id === requestedVehicleId) ? requestedVehicleId! : draft.vehicleId
  const requestedTripType = searchParams.get('tripType')
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>(
    requestedTripType === 'one-way' || requestedTripType === 'round-trip'
      ? requestedTripType
      : draft.tripType ?? 'one-way',
  )
  const [selectedVehicleId, setSelectedVehicleId] = useState(bookingVehicles.some((vehicle) => vehicle.id === initialVehicleId) ? initialVehicleId! : 'vip-minivan')
  const [pickUpLocation, setPickUpLocation] = useState(initialRoute.pickUpLocation)
  const [dropOffLocation, setDropOffLocation] = useState(initialRoute.dropOffLocation)
  const [pickUpDate, setPickUpDate] = useState(draft.pickUpDate ?? '')
  const [pickUpTime, setPickUpTime] = useState(draft.pickUpTime ?? '')
  const [flightNumber, setFlightNumber] = useState(draft.flightNumber ?? '')
  const [returnDate, setReturnDate] = useState(draft.returnDate ?? '')
  const [returnTime, setReturnTime] = useState(draft.returnTime ?? '')
  const [passengers, setPassengers] = useState(draft.passengerCount ?? 1)
  const [luggages, setLuggages] = useState(draft.luggageCount ?? 0)
  const [babySeats, setBabySeats] = useState(draft.babySeatCount ?? 0)
  const [formError, setFormError] = useState('')
  const [today, setToday] = useState(turkeyToday)
  const refreshToday = () => setToday(turkeyToday())

  const destinations = [...new Set(transferPrices.map((price) => price.destination))]
  const groupedDestinationOptions = destinationGroups.map((group) => ({
    ...group,
    names: group.names.filter((name) => destinations.includes(name)),
  }))
  const routeDestination = pickUpLocation === 'Dalaman Airport' ? dropOffLocation : dropOffLocation === 'Dalaman Airport' ? pickUpLocation : ''
  const availableDestinations = pickUpLocation === 'Dalaman Airport' ? destinations : ['Dalaman Airport']
  const availableVehicles = bookingVehicles.filter((vehicle) => !routeDestination || findTransferPrice(routeDestination, vehicle.id, tripType) !== null)
  const effectiveVehicleId = availableVehicles.some((vehicle) => vehicle.id === selectedVehicleId) ? selectedVehicleId : availableVehicles[0]?.id ?? selectedVehicleId
  const price = findTransferPrice(routeDestination, effectiveVehicleId, tripType)
  const priceLabel = price === null ? t("Price on request") : `£${price.toFixed(2)}`
  const selectedVehicle = bookingVehicles.find((vehicle) => vehicle.id === effectiveVehicleId) ?? bookingVehicles[0]
  const maxAllowedPassengers = selectedVehicle.maxPassengers
  const maxAllowedLuggage = selectedVehicle.maxLuggage
  const safePassengers = clampVehicleCount(passengers, maxAllowedPassengers, 1)
  const safeLuggages = clampVehicleCount(luggages, maxAllowedLuggage)

  function saveTransferInfo(event: React.MouseEvent<HTMLAnchorElement>) {
    if (!pickUpLocation.trim() || !dropOffLocation.trim() || !pickUpDate || !pickUpTime) {
      event.preventDefault()
      setFormError('Please enter pickup, destination, date and time before continuing.')
      return
    }
    if (pricesLoading || pricesError) {
      event.preventDefault(); setFormError(pricesError || 'Please wait while current prices load.'); return
    }
    const scheduleError = validateTransferSchedule({
      pickUpDate, pickUpTime, tripType, returnDate, returnTime,
    })
    if (scheduleError) {
      event.preventDefault()
      setFormError(scheduleError)
      return
    }
    if (pickUpLocation === dropOffLocation) {
      event.preventDefault()
      setFormError('Pickup and destination must be different.')
      return
    }
    if (price === null) {
      event.preventDefault()
      setFormError('This route or vehicle has no published price. Please choose Dalaman Airport as one endpoint and a vehicle with a listed price.')
      return
    }
    const selectionError = validateTransferSelection({
      pickUpLocation, dropOffLocation, vehicleId: effectiveVehicleId, tripType,
      passengerCount: safePassengers, luggageCount: safeLuggages, babySeatCount: babySeats,
    })
    if (selectionError) {
      event.preventDefault()
      setFormError(selectionError)
      return
    }
    if (flightNumber.trim() && !/^[A-Za-z0-9 -]{1,20}$/.test(flightNumber.trim())) {
      event.preventDefault()
      setFormError('Please enter a valid flight number (up to 20 letters, digits, spaces or hyphens).')
      return
    }
    setFormError('')
    try {
      sessionStorage.setItem(
        'bookingTransferInfo',
        JSON.stringify({
        dropOffLocation: dropOffLocation.trim(),
        vehicleName: selectedVehicle.name,
        tripType,
        passengerCount: safePassengers,
        pickUpDate,
        pickUpLocation: pickUpLocation.trim(),
        pickUpTime,
        returnDate: tripType === 'round-trip' ? returnDate : undefined,
        returnTime: tripType === 'round-trip' ? returnTime : undefined,
        price,
        currency: 'GBP',
        vehicleId: effectiveVehicleId,
        flightNumber: flightNumber.trim() || undefined,
        luggageCount: safeLuggages,
        babySeatCount: babySeats,
        }),
      )
    } catch {
      event.preventDefault()
      setFormError('Your browser could not save the transfer details. Please enable site storage and try again.')
      return
    }
    try {
      sessionStorage.removeItem('lastBookingReceipt')
    } catch {
      // Continue when browser storage is unavailable.
    }
  }

  return (
    <div className="bg-background text-on-background min-h-screen">
      <PublicNavbar />

      <main className="pt-32 pb-20 px-margin-page max-w-7xl mx-auto">
        <BookingStepper activeStep={1} />
        {pricesLoading && <p role="status">{t("Loading current prices...")}</p>}
        {pricesError && <div role="alert">{t(pricesError)} <button type="button" onClick={refreshPrices}>{t("Refresh prices")}</button></div>}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-grid items-start">
          <section className="lg:col-span-8 bg-white border border-outline-variant rounded-xl p-8 booking-card">
            <div className="mb-8">
              <h1 className="font-title-lg text-title-lg text-admin-primary mb-2">
                {t("Transfer Information")}
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {t("Configure your transfer details to see available vehicles.")}
              </p>
            </div>

            <RequiredFieldNote />
            <form className="space-y-8" onSubmit={(event) => event.preventDefault()}>
              <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-outline-variant">
                <button
                  className={`px-8 py-2 rounded-md font-label-sm text-label-sm transition-all ${
                    tripType === 'one-way'
                      ? 'bg-admin-primary text-white'
                      : 'text-on-surface-variant hover:bg-white'
                  }`}
                  onClick={() => setTripType('one-way')}
                  type="button"
                >
                  {t("One Way")}
                </button>
                <button
                  className={`px-8 py-2 rounded-md font-label-sm text-label-sm transition-all ${
                    tripType === 'round-trip'
                      ? 'bg-admin-primary text-white'
                      : 'text-on-surface-variant hover:bg-white'
                  }`}
                  onClick={() => setTripType('round-trip')}
                  type="button"
                >
                  {t("Round Trip")}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                <div className="space-y-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant block">{t("Pickup Location")}<RequiredMark /></label>
                  <select aria-label={t("Pickup Location")} className="w-full px-4 py-3 border border-outline-variant rounded-lg" value={pickUpLocation} onChange={(event) => { const next = event.target.value; setPickUpLocation(next); setDropOffLocation(next === 'Dalaman Airport' ? '' : 'Dalaman Airport'); setFormError('') }}>
                    <option value="Dalaman Airport">{t("Dalaman Airport (DLM)")}</option>
                    {groupedDestinationOptions.map((group) => (
                      <optgroup key={group.label} label={group.label}>
                        {group.names.map((destination) => <option key={destination} value={destination}>{destination}</option>)}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant block">{t("Destination")}<RequiredMark /></label>
                  <select aria-label={t("Destination")} className="w-full px-4 py-3 border border-outline-variant rounded-lg" value={dropOffLocation} onChange={(event) => setDropOffLocation(event.target.value)}>
                    <option value="">{t("Select destination")}</option>
                    {availableDestinations.includes("Dalaman Airport") && <option value="Dalaman Airport">{t("Dalaman Airport (DLM)")}</option>}
                    {pickUpLocation === "Dalaman Airport" && groupedDestinationOptions.map((group) => (
                      <optgroup key={group.label} label={group.label}>
                        {group.names.map((destination) => <option key={destination} value={destination}>{destination}</option>)}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
                <span>{t("Published prices cover transfers between Dalaman Airport and the destinations listed above, in either direction.")}</span>
                <button type="button" className="rounded-lg border border-outline-variant px-4 py-2 font-semibold text-admin-primary hover:bg-slate-50" onClick={() => {
                  if (!dropOffLocation) return
                  setPickUpLocation(dropOffLocation)
                  setDropOffLocation(pickUpLocation)
                  setFormError('')
                }}>{t("⇄ Swap pickup and destination")}</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md">
                <TextField
                  icon="calendar_today"
                  label={t("Pickup Date")} required
                  type="date"
                  min={today}
                  value={pickUpDate}
                  onFocus={refreshToday}
                  onChange={(value) => { refreshToday(); if (!value || value >= turkeyToday()) { setPickUpDate(value); setFormError('') } else { setFormError('Please select today or a future date in Turkey.') } }}
                />
                <TextField
                  icon="schedule"
                  label={t("Pickup Time")} required
                  type="time"
                  value={pickUpTime}
                  onChange={setPickUpTime}
                />
                <TextField icon="flight_takeoff" label={t("Flight Number (optional)")} placeholder="TK1234" value={flightNumber} onChange={(value) => setFlightNumber(normalizeFlightNumber(value))} />
              </div>

              {tripType === 'round-trip' && (
                <div className="space-y-3 rounded-lg border border-outline-variant bg-slate-50 p-4">
                  <p className="font-semibold">{t("Return journey:")} {dropOffLocation || t("Destination")} → {pickUpLocation}</p>
                  <p className="text-sm text-slate-600">{t("Choose when you want to travel back. Your return does not have to be on the same day or at the same time.")}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                    <TextField icon="calendar_today" label={t("Return Date")} required type="date" min={pickUpDate && pickUpDate > today ? pickUpDate : today} value={returnDate} onFocus={refreshToday} onChange={(value) => { refreshToday(); if (!value || (value >= turkeyToday() && (!pickUpDate || value >= pickUpDate))) { setReturnDate(value); setFormError('') } else { setFormError('Return date cannot be before pickup date or today.') } }} />
                    <TextField icon="schedule" label={t("Return Time")} required type="time" value={returnTime} onChange={setReturnTime} />
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <label className="font-label-sm text-label-sm text-on-surface-variant block">
                  {t("Select Vehicle Type")}
                </label>
                <p className="text-sm text-on-surface-variant">{t("Luggage allowance changes with your vehicle selection.")}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-grid">
                  {availableVehicles.map((vehicle) => {
                    const isSelected = effectiveVehicleId === vehicle.id

                    return (
                      <button
                        className={`relative min-w-0 text-left rounded-xl p-4 cursor-pointer transition-all active:scale-95 ${
                          isSelected
                            ? 'border-2 border-admin-primary bg-primary-fixed/20'
                            : 'border border-outline-variant hover:border-admin-primary bg-white'
                        }`}
                        key={vehicle.id}
                        onClick={() => setSelectedVehicleId(vehicle.id)}
                        type="button"
                        aria-pressed={isSelected}
                      >
                        <VehiclePhoto vehicleId={vehicle.id} name={vehicle.name} className="h-32 mb-4 rounded-lg" showToggle={false} />
                        <h3 className="font-label-sm text-label-sm text-admin-primary mb-1">
                          {vehicle.name}
                        </h3>
                        <p className="text-[11px] text-on-surface-variant mb-3">
                          {t("Max")} {vehicle.maxPassengers} {t("passengers")}{vehicle.maxLuggage === null ? '' : `, ${vehicle.maxLuggage} ${t("luggage")}`}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="font-title-md text-title-md text-admin-primary">
                            {findTransferPrice(routeDestination, vehicle.id, tripType) === null ? t("Select destination") : `£${findTransferPrice(routeDestination, vehicle.id, tripType)?.toFixed(2)}`}
                          </span>
                          <span
                            className={`material-symbols-outlined text-secondary ${
                              isSelected ? '' : 'opacity-0'
                            }`}
                            style={{
                              fontVariationSettings: isSelected
                                ? "'FILL' 1"
                                : "'FILL' 0",
                            }}
                          >
                            check_circle
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md">
                <CounterField
                  label={t("Passengers")}
                  min={1}
                  max={maxAllowedPassengers}
                  value={safePassengers}
                  onChange={setPassengers}
                />
                <CounterField
                  label={t("Luggages")}
                  min={0}
                  max={maxAllowedLuggage}
                  value={safeLuggages}
                  onChange={setLuggages}
                />
                <CounterField
                  label={t("Baby Seats")}
                  min={0}
                  max={2}
                  value={babySeats}
                  onChange={setBabySeats}
                />
              </div>

              {formError && <p role="alert" className="text-error">{t(formError)}</p>}
              <div className="pt-8 border-t border-outline-variant flex justify-end">
                <Link
                  className="px-12 py-4 bg-admin-primary text-on-primary font-title-md text-title-md rounded-lg hover:opacity-90 transition-all flex items-center gap-2 group"
                  onClick={saveTransferInfo}
                  to="/booking/passenger"
                >
                  {t("Next: Passenger Details")}
                  <span translate="no" className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </form>
          </section>

          <BookingSummary
            babySeats={babySeats}
            passengers={safePassengers}
            selectedVehicle={selectedVehicle}
            pickUpLocation={pickUpLocation}
            dropOffLocation={dropOffLocation}
            pickUpDate={pickUpDate}
            pickUpTime={pickUpTime}
            priceLabel={priceLabel}
          />
        </div>
        <div className="mt-6"><BookingPolicyLinks /></div>
      </main>

      <BookingFooter />
    </div>
  )
}

function BookingStepper({ activeStep }: { activeStep: number }) {
  const t = useBookingCopy()
  const steps = [t("Transfer"), t("Passenger"), t("Confirmation")]

  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === activeStep

          return (
            <div className="flex items-center flex-1 last:flex-none" key={step}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    isActive
                      ? 'bg-admin-primary text-on-primary'
                      : 'bg-slate-200 text-on-surface-variant border border-outline-variant'
                  }`}
                >
                  {stepNumber}
                </div>
                <span
                  className={`font-label-sm text-label-sm ${
                    isActive ? 'text-admin-primary' : 'text-on-surface-variant'
                  }`}
                >
                  {step}
                </span>
              </div>
              {stepNumber < steps.length && (
                <div
                  className={`stepper-line mx-4 ${
                    stepNumber < activeStep ? 'bg-admin-primary' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TextField({
  icon,
  label,
  onChange,
  placeholder,
  type = 'text',
  min,
  onFocus,
  value,
  required = false,
}: {
  icon: string
  label: string
  required?: boolean
  onChange?: (value: string) => void
  placeholder?: string
  type?: string
  min?: string
  onFocus?: () => void
  value?: string
}) {
  const fieldId = useId()
  return (
    <div className="space-y-2">
      <label htmlFor={fieldId} className="font-label-sm text-label-sm text-on-surface-variant">
        {label}{required && <RequiredMark />}
      </label>
      <div className="relative">
        <span translate="no" className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
          {icon}
        </span>
        <input
          id={fieldId}
          required={required}
          className="w-full pl-10 pr-4 py-3 border border-outline-variant rounded-lg focus:ring-2 focus:ring-admin-primary focus:border-admin-primary font-body-md text-body-md outline-none"
          onChange={(event) => onChange?.(event.target.value)}
          placeholder={placeholder}
          type={type}
          min={min}
          onFocus={onFocus}
          value={value}
        />
      </div>
    </div>
  )
}

function CounterField({
  label,
  min,
  max,
  onChange,
  value,
}: {
  label: string
  min: number
  max: number
  onChange: (value: number) => void
  value: number
}) {
  const t = useBookingCopy()
  return (
    <div className="space-y-2">
      <label className="font-label-sm text-label-sm text-on-surface-variant">
        {label}
      </label>
      <div className="flex items-center border border-outline-variant rounded-lg overflow-hidden">
        <button
          className="px-4 py-3 hover:bg-slate-100 text-admin-primary"
          disabled={value <= min}
          aria-label={`${t("Decrease")} ${label}`}
          onClick={() => onChange(Math.max(min, value - 1))}
          type="button"
        >
          <span translate="no" className="material-symbols-outlined">remove</span>
        </button>
        <input
          className="w-full text-center border-none font-body-md text-body-md focus:ring-0"
          readOnly
          type="text"
          value={value}
        />
        <button
          className="px-4 py-3 hover:bg-slate-100 text-admin-primary"
          disabled={value >= max}
          aria-label={`${t("Increase")} ${label}`}
          onClick={() => onChange(Math.min(max, value + 1))}
          type="button"
        >
          <span translate="no" className="material-symbols-outlined">add</span>
        </button>
      </div>
    </div>
  )
}

function BookingSummary({
  babySeats,
  passengers,
  selectedVehicle,
  pickUpLocation,
  dropOffLocation,
  pickUpDate,
  pickUpTime,
  priceLabel,
}: {
  babySeats: number
  passengers: number
  selectedVehicle: (typeof bookingVehicles)[number]
  pickUpLocation: string
  dropOffLocation: string
  pickUpDate: string
  pickUpTime: string
  priceLabel: string
}) {
  const t = useBookingCopy()
  return (
    <aside className="lg:col-span-4 sticky top-24">
      <div className="bg-white border border-outline-variant rounded-xl overflow-hidden booking-card">
        <div className="bg-admin-primary p-6 text-on-primary">
          <h2 className="font-title-md text-title-md">{t("Booking Summary")}</h2>
          <p className="font-label-xs text-label-xs opacity-70">
            {t("Review your trip details")}
          </p>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-1 py-1">
              <div className="w-3 h-3 rounded-full border-2 border-admin-primary bg-white" />
              <div className="w-0.5 flex-1 border-l-2 border-dashed border-outline-variant" />
              <div className="w-3 h-3 rounded-full bg-secondary" />
            </div>
            <div className="flex-1 space-y-4">
              <SummaryLocation label={t("Pickup")} value={t(pickUpLocation)} />
              <SummaryLocation
                label={t("Dropoff")}
                value={dropOffLocation ? t(dropOffLocation) : t("Select destination")}
              />
            </div>
          </div>

          <hr className="border-outline-variant" />

          <div className="space-y-4">
            <SummaryRow
              icon="directions_car"
              label={t("Vehicle")}
              value={selectedVehicle.name}
            />
            <SummaryRow
              icon="group"
              label={t("Passengers")}
              value={`${passengers} Adults, ${babySeats} Infant`}
            />
            <SummaryRow
              icon="calendar_today"
              label={t("Date & Time")}
              value={pickUpDate && pickUpTime ? `${pickUpDate} ${pickUpTime}` : t("Select date and time")}
            />
          </div>

          <hr className="border-outline-variant" />

          <div className="pt-2">
            <div className="flex justify-between items-center mb-2">
              <span className="font-body-md text-body-md text-on-surface-variant">
                {t("Subtotal")}
              </span>
              <span className="font-label-sm text-label-sm text-admin-primary">
                {priceLabel}
              </span>
            </div>

            <div className="flex justify-between items-end bg-slate-100 p-4 rounded-lg">
              <div>
                <span className="font-label-xs text-label-xs text-on-surface-variant uppercase">
                  {t("Estimated Total")}
                </span>
                <div className="font-title-lg text-title-lg text-admin-primary">
                  {priceLabel}
                </div>
              </div>
              <div className="text-[10px] text-on-surface-variant text-right">
                {t("Final terms will be confirmed by the operator")}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-secondary/10 rounded-lg">
            <span translate="no"
              className="material-symbols-outlined text-secondary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified_user
            </span>
            <span className="text-[12px] text-secondary font-medium leading-tight">
              {t("This is a booking request. Cancellation terms will be confirmed by the operator. Payment is made in cash to the driver at the end of the journey.")}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-6">
        <img
          alt=""
          className="h-6 opacity-40 grayscale"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTtYdWvT_DAGPuhBEsSWELdGFgiUSnKFofsHvXY-u8Y6S6yEFbg62MoFIBLlvGJWjPLz05CUuyd-yR48jNWhNNwCUv5JjsXWyuvIT1tkIDsD1qTdhrIdolO8OBxVwb_gIghIV5DA-8YwMOq9PrEMVw5-Ay8C0yoaatvKfrU4yvO_jf-ddqB4KLib5nsF13XkScYbr6x-ilp4ceyXVUjxoXd-qDeKByxneJ8SxYi0K7RuyffPDGOKOCvWiZN8JMtsxtyweL-x0xvXI"
        />
      </div>
    </aside>
  )
}

function SummaryLocation({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider">
        {label}
      </p>
      <p className="font-label-sm text-label-sm text-admin-primary">{value}</p>
    </div>
  )
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: string
  label: string
  value: string
}) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2 text-on-surface-variant">
        <span translate="no" className="material-symbols-outlined text-[20px]">{icon}</span>
        <span className="font-body-md text-body-md">{label}</span>
      </div>
      <span className="font-label-sm text-label-sm text-admin-primary">
        {value}
      </span>
    </div>
  )
}

function BookingFooter() {
  const t = useBookingCopy()
  return (
    <footer className="w-full py-8 bg-slate-200 border-t border-outline-variant mt-12">
      <div className="max-w-7xl mx-auto px-margin-page flex flex-col gap-2">
        <img src="/dalamanway-logo.svg" alt={t("DalamanWay — Private Airport Transfers")} className="h-12 w-auto max-w-[240px] object-contain" />
        <p className="font-body-md text-body-sm text-on-surface-variant">
          {t("Private airport transfer booking requests for Dalaman and nearby destinations.")}
        </p>
        <p className="font-body-md text-body-sm text-on-surface-variant">
          {t("Prices are shown in GBP. Your request is subject to operator confirmation.")}
        </p>
        <p className="font-body-md text-body-sm text-on-surface-variant">
          {t("Contact:")} <a href={`mailto:${supportEmail}`} className="underline">{supportEmail}</a>
        </p>
        <p className="font-body-md text-body-sm text-on-surface-variant">
          © {new Date().getFullYear()} DalamanWay.
        </p>
      </div>
    </footer>
  )
}
