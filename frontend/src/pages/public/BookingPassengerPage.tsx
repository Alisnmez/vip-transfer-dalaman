import { useEffect, useId, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { PublicNavbar } from './PublicNavbar'
import { RequiredFieldNote, RequiredMark } from '../../components/RequiredFieldNote'
import { trackAnalyticsEvent } from '../../features/analytics/analytics'
import { ProcessingButton } from '../../components/ProcessingButton'
import { useAsyncAction } from '../../hooks/useAsyncAction'
import { validateTransferSelection } from '../../features/booking/validateTransferSelection'
import { validateTransferSchedule } from '../../features/booking/validateTransferSchedule'


type SavedPassenger = {
  customerName?: string
  phoneNumber?: string
  email?: string
  countryOfResidence?: string
  transferAddress?: string
  hotelName?: string
  specialRequests?: string
}

function readPassengerDraft(): SavedPassenger {
  try {
    const value: unknown = JSON.parse(localStorage.getItem('bookingPassengerInfo') || '{}')
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
    const raw = value as Record<string, unknown>
    const readString = (key: string) => typeof raw[key] === 'string' ? raw[key] as string : undefined
    return {
      customerName: readString('customerName'),
      phoneNumber: readString('phoneNumber'),
      email: readString('email'),
      countryOfResidence: readString('countryOfResidence'),
      transferAddress: readString('transferAddress'),
      hotelName: readString('hotelName'),
      specialRequests: readString('specialRequests'),
    }
  } catch {
    return {}
  }
}

function isAirportPickup(): boolean {
  try {
    const saved = JSON.parse(localStorage.getItem('bookingTransferInfo') || '{}')
    return saved?.pickUpLocation === 'Dalaman Airport'
  } catch {
    return true
  }
}

export function BookingPassengerPage() {
  useEffect(() => { trackAnalyticsEvent('booking_passenger_step') }, [])
  const navigate = useNavigate()
  const { processing, run } = useAsyncAction()
  const [draft] = useState(readPassengerDraft)
  const [firstName, setFirstName] = useState(() => draft.customerName?.trim().split(/\s+/)[0] ?? '')
  const [lastName, setLastName] = useState(() => draft.customerName?.trim().split(/\s+/).slice(1).join(' ') ?? '')
  const [phoneNumber, setPhoneNumber] = useState(() => {
    const number = draft.phoneNumber ?? ''
    const code = ['+370', '+90', '+44', '+49', '+33', '+1'].find((item) => number.startsWith(item))
    return code ? number.slice(code.length) : ''
  })
  const [countryCode, setCountryCode] = useState(() => ['+370', '+90', '+44', '+49', '+33', '+1'].find((code) => draft.phoneNumber?.startsWith(code)) ?? '+90')
  const [email, setEmail] = useState(draft.email ?? '')
  const [countryOfResidence, setCountryOfResidence] = useState(draft.countryOfResidence ?? '')
  const [transferAddress, setTransferAddress] = useState(draft.transferAddress ?? '')
  const [hotelName, setHotelName] = useState(draft.hotelName ?? '')
  const [specialRequests, setSpecialRequests] = useState(draft.specialRequests ?? '')
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [phoneError, setPhoneError] = useState('')

  function handleSubmit() {
    setError('')
    setEmailError('')
    setPhoneError('')
    let savedTransferInfo: string | null
    try {
      savedTransferInfo = localStorage.getItem('bookingTransferInfo')
    } catch {
      setError('Browser storage is unavailable. Please enable site storage and retry.')
      return
    }
    if (!savedTransferInfo) {
      setError('Please fill transfer information first.')
      return
    }
    if (!firstName.trim() || !lastName.trim() || !phoneNumber.trim() || !email.trim()) {
      setError('Please complete your name, phone number and email address.')
      return
    }
    const digits = phoneNumber.replace(/\D/g, '')
    const countryDigits = countryCode.replace(/\D/g, '').length
    if (((countryCode === '+90' || countryCode === '+1') && digits.length !== 10) || digits.length < 7 || countryDigits + digits.length > 15 || (countryCode === '+90' && !digits.startsWith('5'))) {
      setPhoneError(countryCode === '+90' ? 'Turkish mobile numbers must contain 10 digits and start with 5 (without +90).' : countryCode === '+1' ? 'US and Canadian numbers must contain 10 digits (without +1).' : 'Enter a valid national number: at least 7 digits and no more than 15 digits including the country code.')
      return
    }
    if (email.trim().length > 254 || !/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/.test(email.trim())) {
      setEmailError('Please enter a valid email address.')
      return
    }
    let transferInfo: Record<string, unknown>
    try {
      const parsed: unknown = JSON.parse(savedTransferInfo)
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Invalid transfer draft')
      transferInfo = parsed as Record<string, unknown>
    } catch {
      setError('Transfer details could not be read. Please return to the transfer step.')
      return
    }
    const selectionError = validateTransferSelection({
      pickUpLocation: typeof transferInfo.pickUpLocation === 'string' ? transferInfo.pickUpLocation : undefined,
      dropOffLocation: typeof transferInfo.dropOffLocation === 'string' ? transferInfo.dropOffLocation : undefined,
      vehicleId: typeof transferInfo.vehicleId === 'string' ? transferInfo.vehicleId : undefined,
      tripType: transferInfo.tripType === 'round-trip' ? 'round-trip' : transferInfo.tripType === 'one-way' ? 'one-way' : undefined,
      passengerCount: typeof transferInfo.passengerCount === 'number' ? transferInfo.passengerCount : undefined,
      luggageCount: typeof transferInfo.luggageCount === 'number' ? transferInfo.luggageCount : undefined,
      babySeatCount: typeof transferInfo.babySeatCount === 'number' ? transferInfo.babySeatCount : undefined,
    })
    if (selectionError) {
      setError(selectionError)
      return
    }
    const scheduleError = validateTransferSchedule({
      pickUpDate: typeof transferInfo.pickUpDate === 'string' ? transferInfo.pickUpDate : undefined,
      pickUpTime: typeof transferInfo.pickUpTime === 'string' ? transferInfo.pickUpTime : undefined,
      tripType: transferInfo.tripType === 'round-trip' ? 'round-trip' : 'one-way',
      returnDate: typeof transferInfo.returnDate === 'string' ? transferInfo.returnDate : undefined,
      returnTime: typeof transferInfo.returnTime === 'string' ? transferInfo.returnTime : undefined,
    })
    if (scheduleError) {
      setError(scheduleError)
      return
    }
    if (!countryOfResidence) {
      setError('Please select your country of residence.')
      return
    }
    if (!transferAddress.trim()) {
      setError('Please enter the exact hotel, accommodation or transfer address in Turkey.')
      return
    }
    if (firstName.trim().length > 80 || lastName.trim().length > 80 || transferAddress.trim().length > 250 || hotelName.trim().length > 120 || specialRequests.trim().length > 1000) {
      setError('Please shorten the name, transfer address or special requests before continuing.')
      return
    }
    try {
      localStorage.setItem('bookingPassengerInfo', JSON.stringify({
      customerName: `${firstName.trim()} ${lastName.trim()}`,
      phoneNumber: `${countryCode}${phoneNumber.replace(/\D/g, '')}`,
      email: email.trim().toLowerCase(),
      countryOfResidence,
      transferAddress: transferAddress.trim(),
      hotelName: hotelName.trim(),
      specialRequests: specialRequests.trim(),
      }))
    } catch {
      setError('Your browser could not save the passenger details. Please enable site storage and try again.')
      return
    }
    navigate('/booking/confirmation')
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <PublicNavbar />

      <main className="mt-20 flex-grow px-margin-page py-12 max-w-7xl mx-auto w-full">
        <PassengerStepper />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-grid">
          <div className="lg:col-span-8">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-container-padding shadow-sm">
              <h2 className="font-title-lg text-title-lg text-admin-primary mb-6">
                Customer Details
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-8">
                Please provide your contact information to ensure a smooth pickup
                experience.
              </p>

              <RequiredFieldNote />
              <form id="passenger-details-form" noValidate className="space-y-stack-md" onSubmit={(event) => {
                event.preventDefault()
                void run(async () => {
                  // Let React paint the shared processing state before client-side navigation.
                  await new Promise<void>(resolve => window.requestAnimationFrame(() => resolve()))
                  handleSubmit()
                })
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                  <FormField
                    label="First Name" required
                    placeholder="e.g. Alexander"
                    value={firstName}
                    onChange={setFirstName}
                  />
                  <FormField
                    label="Last Name" required
                    placeholder="e.g. Hamilton"
                    value={lastName}
                    onChange={setLastName}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                  <div className="flex flex-col gap-2">
                    <label className="font-label-sm text-label-sm text-on-surface-variant">
                      Phone Number<RequiredMark />
                    </label>
                    <div className="flex min-w-0">
                      <select aria-label="Country dialing code" className="border border-r-0 border-outline-variant bg-slate-100 rounded-l-lg px-2 text-sm" value={countryCode} onChange={(event) => { setCountryCode(event.target.value); setPhoneNumber(''); setPhoneError('') }}>
                        <option value="+90">🇹🇷 +90</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+49">🇩🇪 +49</option>
                        <option value="+33">🇫🇷 +33</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+370">🇱🇹 +370</option>
                      </select>
                      <input
                        className="min-w-0 flex-1 border-outline-variant rounded-r-lg p-3 font-body-md text-body-md focus:border-admin-primary focus:ring-0 form-input-shadow transition-all"
                        onChange={(event) => { const raw = event.target.value.replace(/\D/g, ''); const national = countryCode === '+90' && raw.length === 11 && raw.startsWith('0') ? raw.slice(1) : raw; setPhoneNumber(national.slice(0, countryCode === '+90' || countryCode === '+1' ? 10 : 15 - countryCode.replace(/\D/g, '').length)); setPhoneError('') }}
                        placeholder={countryCode === '+90' ? '5551234567' : 'Phone number'}
                        autoComplete="tel-national"
                        inputMode="numeric"
                        maxLength={countryCode === '+90' || countryCode === '+1' ? 10 : 15 - countryCode.replace(/\D/g, '').length}
                        type="tel"
                        value={phoneNumber}
                      />
                    </div>
                    {phoneError && <p role="alert" className="text-sm text-error">{phoneError}</p>}
                  </div>
                  <FormField
                    label="Email Address" required
                    onChange={(value) => { setEmail(value); setEmailError('') }}
                    placeholder="name@example.com"
                    type="email"
                    value={email}
                  />
                  {emailError && <p role="alert" className="text-sm text-error">{emailError}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="country-of-residence" className="font-label-sm text-label-sm text-on-surface-variant">Country of Residence<RequiredMark /></label>
                  <select id="country-of-residence" className="w-full border-outline-variant rounded-lg p-3 font-body-md text-body-md bg-white" value={countryOfResidence} onChange={(event) => setCountryOfResidence(event.target.value)} required>
                    <option value="">Select your country</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Russia">Russia</option>
                    <option value="Germany">Germany</option>
                    <option value="Lebanon">Lebanon</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="Denmark">Denmark</option>
                    <option value="Turkey">Turkey</option>
                    <option value="United States">United States</option>
                    <option value="France">France</option>
                    <option value="Belgium">Belgium</option>
                    <option value="Romania">Romania</option>
                    <option value="Sweden">Sweden</option>
                    <option value="Norway">Norway</option>
                    <option value="Australia">Australia</option>
                    <option value="Italy">Italy</option>
                    <option value="Ukraine">Ukraine</option>
                    <option value="Ireland">Ireland</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Cyprus">Cyprus</option>
                    <option value="Finland">Finland</option>
                    <option value="Lithuania">Lithuania</option>
                    <option value="Latvia">Latvia</option>
                    <option value="Estonia">Estonia</option>
                    <option value="Other">Other</option>
                  </select>
                  <p className="text-sm text-on-surface-variant">Your home country, not your transfer address in Turkey.</p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">
                    {isAirportPickup() ? 'Drop-off Address in Turkey' : 'Pickup Address in Turkey'}<RequiredMark />
                  </label>
                  <p className="text-sm text-on-surface-variant">
                    Enter the hotel, villa, apartment or exact street address where the driver should meet you or drop you off. Not your home address abroad.
                  </p>
                  <input
                    className="w-full border-outline-variant rounded-lg p-3 font-body-md text-body-md focus:border-admin-primary focus:ring-0 form-input-shadow transition-all"
                    placeholder="e.g. Green Nature Diamond Hotel, Siteler, Marmaris"
                    type="text"
                    value={transferAddress}
                    onChange={(event) => setTransferAddress(event.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="hotel-name" className="font-label-sm text-label-sm text-on-surface-variant">Hotel or Accommodation Name (optional)</label>
                  <input id="hotel-name" className="w-full border-outline-variant rounded-lg p-3 font-body-md text-body-md" placeholder="e.g. Green Nature Diamond Hotel" maxLength={120} value={hotelName} onChange={(event) => setHotelName(event.target.value)} />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">
                    Special Requests
                  </label>
                  <textarea
                    className="w-full border-outline-variant rounded-lg p-3 font-body-md text-body-md focus:border-admin-primary focus:ring-0 form-input-shadow transition-all resize-none"
                    placeholder="Child seat requirements, extra luggage details, or other pickup instructions..."
                    rows={4}
                    value={specialRequests}
                    onChange={(event) => setSpecialRequests(event.target.value)}
                  />
                </div>
              </form>

              {error && (
                <div role="alert" className="mt-6 rounded-lg border border-error/30 bg-error-container p-4 text-error">
                  {error}
                </div>
              )}

              <div className="mt-12 flex justify-between items-center border-t border-outline-variant pt-8">
                <Link
                  className="flex items-center gap-2 px-6 py-3 border border-outline-variant rounded-lg font-label-sm text-label-sm text-on-surface-variant hover:bg-slate-100 transition-colors active:scale-95"
                  to="/booking"
                >
                  <span translate="no" className="material-symbols-outlined text-base">
                    arrow_back
                  </span>
                  Back
                </Link>
                <ProcessingButton
                  className="flex min-w-0 max-w-full flex-wrap items-center justify-center gap-2 px-4 sm:px-8 py-3 bg-admin-primary text-on-primary rounded-lg font-label-sm text-label-sm text-center hover:opacity-90 shadow-md transition-all disabled:opacity-60"
                  type="submit"
                  form="passenger-details-form"
                  processing={processing}
                  processingLabel="Continuing..."
                >
                  Continue to Confirmation
                  <span translate="no" className="material-symbols-outlined text-base">
                    arrow_forward
                  </span>
                </ProcessingButton>
              </div>
            </div>
          </div>

          <PassengerSummary />
        </div>
      </main>

      <PassengerFooter />
    </div>
  )
}

function PassengerStepper() {
  return (
    <div className="mb-12 max-w-3xl mx-auto">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface-container-high -translate-y-1/2 z-0" />
        <StepperItem complete label="Transfer" />
        <StepperItem active label="Passenger" number="2" />
        <StepperItem label="Confirmation" number="3" />
      </div>
    </div>
  )
}

function StepperItem({
  active = false,
  complete = false,
  label,
  number,
}: {
  active?: boolean
  complete?: boolean
  label: string
  number?: string
}) {
  return (
    <div className="relative z-10 flex flex-col items-center">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
          complete
            ? 'bg-status-closed text-white'
            : active
              ? 'bg-admin-primary text-on-primary border-4 border-surface'
              : 'bg-surface-container-high text-on-surface-variant'
        }`}
      >
        {complete ? (
          <span translate="no" className="material-symbols-outlined text-base">check</span>
        ) : (
          <span className="font-label-sm text-label-sm">{number}</span>
        )}
      </div>
      <span
        className={`mt-2 font-label-sm text-label-sm ${
          active
            ? 'text-admin-primary font-bold'
            : complete
              ? 'text-on-surface'
              : 'text-on-surface-variant'
        }`}
      >
        {label}
      </span>
    </div>
  )
}

function FormField({
  label,
  onChange,
  placeholder,
  type = 'text',
  value,
  required = false,
}: {
  label: string
  required?: boolean
  onChange?: (value: string) => void
  placeholder: string
  type?: string
  value?: string
}) {
  const fieldId = useId()
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={fieldId} className="font-label-sm text-label-sm text-on-surface-variant">
        {label}{required && <RequiredMark />}
      </label>
      <input
        id={fieldId}
        required={required}
        className="w-full border-outline-variant rounded-lg p-3 font-body-md text-body-md focus:border-admin-primary focus:ring-0 form-input-shadow transition-all"
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </div>
  )
}

function PassengerSummary() {
  // Browser storage may be disabled or contain an invalid draft.
  const [transfer] = useState<Record<string, unknown>>(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem('bookingTransferInfo') || '{}')
      return saved && typeof saved === 'object' && !Array.isArray(saved)
        ? saved as Record<string, unknown> : {}
    } catch {
      return {}
    }
  })
  const price = typeof transfer.price === 'number' && Number.isFinite(transfer.price) ? `£${transfer.price.toFixed(2)}` : 'Price to be confirmed'
  return (
    <div className="lg:col-span-4">
      <div className="sticky top-24 space-y-gutter-grid">
        <div className="bg-admin-primary text-on-primary rounded-xl overflow-hidden shadow-lg">
          <div className="relative h-32 w-full">
            <img
              alt=""
              className="w-full h-full object-cover opacity-80"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGPBhSGhtf8CO3saMt1ic1CDnfTL21sBvjDmCYl9FyPdHJCknLr8l2VYJ7fXL_kM7QaH0hW-G5cGdu_sWQ5uqNMpIRHSKS6vHxBbfLuvbV4G0a4VlQljbugKZ1y4Zsmknxych-IU2CbEWleemmZ_gyxPKA21PnFRrCAaeAUvUb1teRT4t-Q0NuHAISG31oOmpgtobvtGvG3wvTA19jKbIWLM9kf4vQIySGGbjr-XTDWM3NovL2NjVBkjTn5T6zqyLGp54oPsYQ55M"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-admin-primary via-transparent to-transparent" />
            <div className="absolute bottom-4 left-6">
              <span className="bg-secondary text-on-secondary px-2 py-1 rounded text-label-xs uppercase tracking-wider">
                Executive Class
              </span>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <h3 className="font-title-md text-title-md mb-2">
                Booking Summary
              </h3>
              <div className="flex items-center gap-2 opacity-80">
                <span translate="no" className="material-symbols-outlined text-sm">
                  directions_car
                </span>
                <span className="font-label-sm text-label-sm">
                  {typeof transfer.vehicleName === 'string' ? transfer.vehicleName : 'Not selected'}
                </span>
              </div>
            </div>
            <div className="space-y-4 border-t border-white/10 pt-4">
              <SummaryPoint
                icon="location_on"
                label="Pickup"
                meta={`${typeof transfer.pickUpDate === 'string' ? transfer.pickUpDate : ''} ${typeof transfer.pickUpTime === 'string' ? transfer.pickUpTime : ''}`}
                value={typeof transfer.pickUpLocation === 'string' ? transfer.pickUpLocation : 'Not selected'}
              />
              <SummaryPoint
                icon="near_me"
                label="Drop-off"
                value={typeof transfer.dropOffLocation === 'string' ? transfer.dropOffLocation : 'Not selected'}
              />
            </div>
            <div className="bg-white/5 rounded-lg p-4 space-y-2">
              <PriceLine label="Base Fare" value={price} />
              
              <div className="flex justify-between items-center pt-2 border-t border-white/10">
                <span className="font-title-md text-title-md">Total</span>
                <span className="font-title-md text-title-md text-secondary-fixed">
                  {price}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-status-closed bg-white/5 p-3 rounded-lg">
              <span translate="no"
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified_user
              </span>
              <span className="font-label-sm text-label-sm">
                Review the price before submitting your request.
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-100 border border-outline-variant p-6 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-admin-primary">
            <span translate="no" className="material-symbols-outlined">headset_mic</span>
          </div>
          <div>
            <p className="font-label-sm text-label-sm text-admin-primary font-bold">
              Need Assistance?
            </p>
            <p className="font-label-xs text-label-xs text-on-surface-variant">
              Use the contact page for transfer questions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryPoint({
  icon,
  label,
  meta,
  value,
}: {
  icon: string
  label: string
  meta?: string
  value: string
}) {
  return (
    <div className="flex items-start gap-4">
      <span translate="no" className="material-symbols-outlined text-primary-fixed-dim">
        {icon}
      </span>
      <div>
        <p className="font-label-xs text-label-xs text-primary-fixed-dim uppercase">
          {label}
        </p>
        <p className="font-body-md text-body-md">{value}</p>
        {meta && <p className="font-label-sm text-label-sm opacity-70">{meta}</p>}
      </div>
    </div>
  )
}

function PriceLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center opacity-80">
      <span className="font-label-sm text-label-sm">{label}</span>
      <span className="font-label-sm text-label-sm">{value}</span>
    </div>
  )
}

function PassengerFooter() {
  return (
    <footer className="w-full border-t border-outline-variant bg-slate-100 px-4 py-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-on-surface-variant">
          © {new Date().getFullYear()} DalamanWay
        </p>
        <div className="flex gap-5 text-sm">
          <Link className="text-admin-primary hover:underline" to="/contact">Contact</Link>
          <Link className="text-admin-primary hover:underline" to="/services">Services</Link>
        </div>
      </div>
    </footer>
  )
}
