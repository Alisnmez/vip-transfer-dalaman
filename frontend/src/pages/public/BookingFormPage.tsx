import { Link } from 'react-router-dom'
import { useState } from 'react'

import { PublicNavbar } from './PublicNavbar'
import { findTransferPrice, transferPrices, transferVehicles } from '../../features/booking/pricing'

const vehicleImages = [
  {
    id: 'sedan',
    name: 'Business Sedan',
    description: 'E-Class or similar. Max 3 Pax.',
    price: '€65',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDxdwvuDznRqtCRtw7PnxBCSj6wxhGEaoI2q1xzAqO7u0YCqXgrJ5Fqo72ptVpUO56WWChjXX50u5FP0aPpcKPVukidko2nERfCvWZOIbEuBxJ9WN4LTwe970rDmxkDy-XXZ6qpDKhp1wfShh7cw5yG13y4sLgDzXjuvxgVh_9JADbVkalt2XvrPOb6R8Th8IzZ8eVyxeFUDuB_vubmBcJKbqavJsh4Z53cRXrtX08cA8laOcxhSSlOfl6MzAI01sCP2zFfUk-_a94',
  },
  {
    id: 'van',
    name: 'Business Van',
    description: 'Mercedes Vito. Max 7 Pax.',
    price: '€75',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCYXKoqUQ1kNy1hY4TySwI-5d-8m7fS7I2kq9_-8X6xAnCGX7eevr1Z5GzsCbW_hvk63fzE5i6XZpSHO-p7LjLSf_9SsCxS_lYL_gOcdMRWB-pLBESwApdM2Tla3dVAu1KFTnk8MiuggzjcrNDEXrReMjcndBgtB04D3578lyXrdV_gt4woen569dgjgtvAfMrvZMOMVs5UdeZE-Yq1Vzv5RpLizyp--6vWCfz3oNElBpy_x43WvQ5A3BKwZhtVKy6bhFhN0mx2EVE',
  },
  {
    id: 'first-class',
    name: 'First Class',
    description: 'S-Class or similar. Max 2 Pax.',
    price: '€120',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBumobqgqIXAccWyTYOxr5huM77gHb6bndj58G2jZKu0lnMaPd0ybC-wf7nixisyc2JzKj6kQPXZ3hbAAMm9kcuFdrEqu_zpNVKDI6Gyisrpwz05WCjjiYMfwkPkdeViz2ubhkayez4QA5Sjqy0gEDQ_gk9mFEiaPtQYKm-cAqKYDmfAhpi7vZA06SQCNL3K5Xd8Lj83PmVhHLBl3L-sNIZPsGQ7jXiYPH7Hoevllvd8yPu0KXjbT1zO2aVuqLOO0yzptW-9SFv5gs',
  },
]

export function BookingFormPage() {
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way')
  const [selectedVehicleId, setSelectedVehicleId] = useState('vip-minivan')
  const [pickUpLocation, setPickUpLocation] = useState('Dalaman Airport')
  const [dropOffLocation, setDropOffLocation] = useState('')
  const [pickUpDate, setPickUpDate] = useState('')
  const [pickUpTime, setPickUpTime] = useState('')
  const [passengers, setPassengers] = useState(4)
  const [luggages, setLuggages] = useState(3)
  const [babySeats, setBabySeats] = useState(1)
  const [formError, setFormError] = useState('')

  const selectedVehicle = transferVehicles.find((vehicle) => vehicle.id === selectedVehicleId) ?? transferVehicles[1]
  const destinations = [...new Set(transferPrices.map((price) => price.destination))]
  const destinationGroups = [
    { label: 'MARMARIS DESTINATIONS', names: ['Marmaris(Any Hotel)', 'Icmeler(Any Hotel)', 'Netsel Marina', 'Albatros Marina', 'Yacht Marina', "Cook's Club Adakoy&Adakoy Marina", 'Turunc', 'D Maris Bay', 'Bozburun / Sogut', 'Selimiye', 'Angels Marmaris Hotel'] },
    { label: 'FETHIYE DESTINATIONS', names: ['Fethiye City Center(Any Hotel)', 'Fethiye Liberty Fabay , Liberty Signa', 'Fethiye Sensatori Barut Akra, XO Arnna', 'Oludeniz(Any Hotel)', 'Fethiye Kayakoy', 'Kabak', 'Faralya'] },
    { label: 'DALAMAN & ORTACA DESTINATIONS', names: ['Sarigerme', 'Dalyan'] },
    { label: 'GOCEK DESTINATIONS', names: ['Gocek'] },
    { label: 'KAS & KALKAN DESTINATIONS', names: ['Kalkan', 'Kas'] },
    { label: 'MUGLA & DATCA DESTINATIONS', names: ['Akyaka', 'Datça'] },
  ]
  const groupedDestinationOptions = destinationGroups.map((group) => ({
    ...group,
    names: group.names.filter((name) => destinations.includes(name)),
  }))
  const routeDestination = pickUpLocation === 'Dalaman Airport' ? dropOffLocation : dropOffLocation === 'Dalaman Airport' ? pickUpLocation : ''
  const price = findTransferPrice(routeDestination, selectedVehicleId, tripType)
  const priceLabel = price === null ? 'Price on request' : `£${price.toFixed(2)}`
  const availableDestinations = pickUpLocation === 'Dalaman Airport' ? destinations : ['Dalaman Airport']
  const availableVehicles = transferVehicles.filter((vehicle) => findTransferPrice(routeDestination, vehicle.id, tripType) !== null)
  const effectiveVehicleId = availableVehicles.some((vehicle) => vehicle.id === selectedVehicleId) ? selectedVehicleId : availableVehicles[0]?.id ?? selectedVehicleId

  function saveTransferInfo(event: React.MouseEvent<HTMLAnchorElement>) {
    if (!pickUpLocation.trim() || !dropOffLocation.trim() || !pickUpDate || !pickUpTime) {
      event.preventDefault()
      setFormError('Please enter pickup, destination, date and time before continuing.')
      return
    }
    const selectedDateTime = new Date(pickUpDate + 'T' + pickUpTime)
    if (Number.isNaN(selectedDateTime.getTime()) || selectedDateTime.getTime() <= Date.now()) {
      event.preventDefault()
      setFormError('Please choose a future pickup date and time.')
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
    if (passengers < 1 || passengers > selectedVehicle.maxPassengers || (selectedVehicle.maxLuggage !== null && luggages > selectedVehicle.maxLuggage)) {
      event.preventDefault()
      setFormError('Passenger or luggage count exceeds the selected vehicle capacity.')
      return
    }
    setFormError('')
    localStorage.setItem(
      'bookingTransferInfo',
      JSON.stringify({
        dropOffLocation: dropOffLocation.trim(),
        vehicleName: selectedVehicle.name,
        tripType,
        passengerCount: passengers,
        pickUpDate,
        pickUpLocation: pickUpLocation.trim(),
        pickUpTime,
        price,
        currency: 'GBP',
        vehicleId: selectedVehicleId,
      }),
    )
  }

  return (
    <div className="bg-background text-on-background min-h-screen">
      <PublicNavbar />

      <main className="pt-32 pb-20 px-margin-page max-w-7xl mx-auto">
        <BookingStepper activeStep={1} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-grid items-start">
          <section className="lg:col-span-8 bg-white border border-outline-variant rounded-xl p-8 booking-card">
            <div className="mb-8">
              <h1 className="font-title-lg text-title-lg text-admin-primary mb-2">
                Transfer Information
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Configure your transfer details to see available vehicles.
              </p>
            </div>

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
                  One Way
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
                  Round Trip
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                <div className="space-y-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant block">Pickup Location</label>
                  <select className="w-full px-4 py-3 border border-outline-variant rounded-lg" value={pickUpLocation} onChange={(event) => { const next = event.target.value; setPickUpLocation(next); setDropOffLocation(next === 'Dalaman Airport' ? '' : 'Dalaman Airport'); setFormError('') }}>
                    <option value="Dalaman Airport">Dalaman Airport (DLM)</option>
                    {groupedDestinationOptions.map((group) => (
                      <optgroup key={group.label} label={group.label}>
                        {group.names.map((destination) => <option key={destination} value={destination}>{destination}</option>)}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant block">Destination</label>
                  <select className="w-full px-4 py-3 border border-outline-variant rounded-lg" value={dropOffLocation} onChange={(event) => setDropOffLocation(event.target.value)}>
                    <option value="">Select destination</option>
                    {availableDestinations.includes("Dalaman Airport") && <option value="Dalaman Airport">Dalaman Airport (DLM)</option>}
                    {pickUpLocation === "Dalaman Airport" && groupedDestinationOptions.map((group) => (
                      <optgroup key={group.label} label={group.label}>
                        {group.names.map((destination) => <option key={destination} value={destination}>{destination}</option>)}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md">
                <TextField
                  icon="calendar_today"
                  label="Pickup Date"
                  type="date"
                  min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10)}
                  value={pickUpDate}
                  onChange={setPickUpDate}
                />
                <TextField
                  icon="schedule"
                  label="Pickup Time"
                  type="time"
                  value={pickUpTime}
                  onChange={setPickUpTime}
                />
                <TextField icon="flight_takeoff" label="Flight Number" placeholder="TK1234" />
              </div>

              <div className="space-y-4">
                <label className="font-label-sm text-label-sm text-on-surface-variant block">
                  Select Vehicle Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter-grid">
                  {availableVehicles.map((vehicle) => {
                    const index = transferVehicles.findIndex((item) => item.id === vehicle.id)
                    const isSelected = selectedVehicleId === vehicle.id

                    return (
                      <button
                        className={`relative text-left rounded-xl p-4 cursor-pointer transition-all active:scale-95 ${
                          isSelected
                            ? 'border-2 border-admin-primary bg-primary-fixed/20'
                            : 'border border-outline-variant hover:border-admin-primary bg-white'
                        }`}
                        key={vehicle.id}
                        onClick={() => setSelectedVehicleId(vehicle.id)}
                        type="button"
                      >
                        <div className="h-32 mb-4 bg-white rounded-lg overflow-hidden flex items-center justify-center">
                          <img
                            alt=""
                            className="object-contain w-4/5 h-4/5"
                            src={vehicleImages[index === 0 ? 0 : index >= 5 ? 2 : 1].image}
                          />
                        </div>
                        <h3 className="font-label-sm text-label-sm text-admin-primary mb-1">
                          {vehicle.name}
                        </h3>
                        <p className="text-[11px] text-on-surface-variant mb-3">
                          Max {vehicle.maxPassengers} passengers{vehicle.maxLuggage === null ? '' : `, ${vehicle.maxLuggage} luggage`}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="font-title-md text-title-md text-admin-primary">
                            {findTransferPrice(routeDestination, vehicle.id, tripType) === null ? 'Select destination' : `£${findTransferPrice(routeDestination, vehicle.id, tripType)?.toFixed(2)}`}
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
                  label="Passengers"
                  value={passengers}
                  onChange={setPassengers}
                />
                <CounterField
                  label="Luggages"
                  value={luggages}
                  onChange={setLuggages}
                />
                <CounterField
                  label="Baby Seats"
                  value={babySeats}
                  onChange={setBabySeats}
                />
              </div>

              {formError && <p role="alert" className="text-error">{formError}</p>}
              <div className="pt-8 border-t border-outline-variant flex justify-end">
                <Link
                  className="px-12 py-4 bg-admin-primary text-on-primary font-title-md text-title-md rounded-lg hover:opacity-90 transition-all flex items-center gap-2 group"
                  onClick={saveTransferInfo}
                  to="/booking/passenger"
                >
                  Next: Passenger Details
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </form>
          </section>

          <BookingSummary
            babySeats={babySeats}
            passengers={passengers}
            selectedVehicle={selectedVehicle}
            pickUpLocation={pickUpLocation}
            dropOffLocation={dropOffLocation}
            pickUpDate={pickUpDate}
            pickUpTime={pickUpTime}
            priceLabel={priceLabel}
          />
        </div>
      </main>

      <BookingFooter />
    </div>
  )
}

function BookingStepper({ activeStep }: { activeStep: number }) {
  const steps = ['Transfer', 'Passenger', 'Confirmation']

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
  value,
}: {
  icon: string
  label: string
  onChange?: (value: string) => void
  placeholder?: string
  type?: string
  min?: string
  value?: string
}) {
  return (
    <div className="space-y-2">
      <label className="font-label-sm text-label-sm text-on-surface-variant">
        {label}
      </label>
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
          {icon}
        </span>
        <input
          className="w-full pl-10 pr-4 py-3 border border-outline-variant rounded-lg focus:ring-2 focus:ring-admin-primary focus:border-admin-primary font-body-md text-body-md outline-none"
          onChange={(event) => onChange?.(event.target.value)}
          placeholder={placeholder}
          type={type}
          min={min}
          value={value}
        />
      </div>
    </div>
  )
}

function CounterField({
  label,
  onChange,
  value,
}: {
  label: string
  onChange: (value: number) => void
  value: number
}) {
  return (
    <div className="space-y-2">
      <label className="font-label-sm text-label-sm text-on-surface-variant">
        {label}
      </label>
      <div className="flex items-center border border-outline-variant rounded-lg overflow-hidden">
        <button
          className="px-4 py-3 hover:bg-slate-100 text-admin-primary"
          onClick={() => onChange(Math.max(0, value - 1))}
          type="button"
        >
          <span className="material-symbols-outlined">remove</span>
        </button>
        <input
          className="w-full text-center border-none font-body-md text-body-md focus:ring-0"
          readOnly
          type="text"
          value={value}
        />
        <button
          className="px-4 py-3 hover:bg-slate-100 text-admin-primary"
          onClick={() => onChange(value + 1)}
          type="button"
        >
          <span className="material-symbols-outlined">add</span>
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
  selectedVehicle: (typeof transferVehicles)[number]
  pickUpLocation: string
  dropOffLocation: string
  pickUpDate: string
  pickUpTime: string
  priceLabel: string
}) {
  return (
    <aside className="lg:col-span-4 sticky top-24">
      <div className="bg-white border border-outline-variant rounded-xl overflow-hidden booking-card">
        <div className="bg-admin-primary p-6 text-on-primary">
          <h2 className="font-title-md text-title-md">Booking Summary</h2>
          <p className="font-label-xs text-label-xs opacity-70">
            Review your trip details
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
              <SummaryLocation label="Pickup" value={pickUpLocation} />
              <SummaryLocation
                label="Dropoff"
                value={dropOffLocation || "Select destination"}
              />
            </div>
          </div>

          <hr className="border-outline-variant" />

          <div className="space-y-4">
            <SummaryRow
              icon="directions_car"
              label="Vehicle"
              value={selectedVehicle.name}
            />
            <SummaryRow
              icon="group"
              label="Passengers"
              value={`${passengers} Adults, ${babySeats} Infant`}
            />
            <SummaryRow
              icon="calendar_today"
              label="Date & Time"
              value={pickUpDate && pickUpTime ? `${pickUpDate} ${pickUpTime}` : "Select date and time"}
            />
          </div>

          <hr className="border-outline-variant" />

          <div className="pt-2">
            <div className="flex justify-between items-center mb-2">
              <span className="font-body-md text-body-md text-on-surface-variant">
                Subtotal
              </span>
              <span className="font-label-sm text-label-sm text-admin-primary">
                {priceLabel}
              </span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="font-body-md text-body-md text-on-surface-variant">
                Meet & Greet Service
              </span>
              <span className="font-label-sm text-label-sm text-secondary">
                FREE
              </span>
            </div>
            <div className="flex justify-between items-end bg-slate-100 p-4 rounded-lg">
              <div>
                <span className="font-label-xs text-label-xs text-on-surface-variant uppercase">
                  Estimated Total
                </span>
                <div className="font-title-lg text-title-lg text-admin-primary">
                  {priceLabel}
                </div>
              </div>
              <div className="text-[10px] text-on-surface-variant text-right">
                Includes taxes & gratuity
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-secondary/10 rounded-lg">
            <span
              className="material-symbols-outlined text-secondary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified_user
            </span>
            <span className="text-[12px] text-secondary font-medium leading-tight">
              All-inclusive pricing. No hidden fees. 24h free cancellation.
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
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
        <span className="font-body-md text-body-md">{label}</span>
      </div>
      <span className="font-label-sm text-label-sm text-admin-primary">
        {value}
      </span>
    </div>
  )
}

function BookingFooter() {
  return (
    <footer className="w-full py-12 bg-slate-200 border-t border-outline-variant mt-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter-grid px-margin-page max-w-7xl mx-auto">
        <div>
          <div className="font-title-md text-title-md font-bold text-admin-primary mb-4">
            VIP Transfer Dalaman
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mb-4">
            Private airport transfers and chauffeur services across Dalaman,
            Fethiye, Gocek, Marmaris and nearby routes.
          </p>
        </div>
        <FooterColumn title="Support" items={['Contact Support', 'Trust & Safety', 'FAQ']} />
        <FooterColumn
          title="Company"
          items={['Terms of Service', 'Privacy Policy', 'Insurance Coverage']}
        />
        <div>
          <h4 className="font-label-sm text-label-sm text-admin-primary mb-4">
            Contact
          </h4>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Emergency Hotline: +90 252 000 0000
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Email: booking@viptransferdalaman.com
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-margin-page mt-12 pt-8 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-body-md text-body-md text-on-surface-variant">
          © 2024 VIP Transfer Dalaman. All rights reserved.
        </p>
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-on-surface-variant hover:text-admin-primary cursor-pointer">
            language
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            English - EUR €
          </span>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ items, title }: { items: string[]; title: string }) {
  return (
    <div>
      <h4 className="font-label-sm text-label-sm text-admin-primary mb-4">
        {title}
      </h4>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item}>
            <a
              className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors underline-offset-4 hover:underline"
              href="#"
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
