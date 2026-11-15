import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { PublicNavbar } from './PublicNavbar'

const quickLinks = ['Terms of Service', 'Privacy Policy', 'Insurance Coverage']
const supportLinks = ['Trust & Safety', 'Contact Support', 'Corporate Accounts']

export function BookingPassengerPage() {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [countryCode, setCountryCode] = useState('+90')
  const [email, setEmail] = useState('')
  const [countryOfResidence, setCountryOfResidence] = useState('')
  const [transferAddress, setTransferAddress] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')
  const [error, setError] = useState('')

  function handleSubmit() {
    setError('')
    const savedTransferInfo = localStorage.getItem('bookingTransferInfo')
    if (!savedTransferInfo) {
      setError('Please fill transfer information first.')
      return
    }
    if (!firstName.trim() || !lastName.trim() || !phoneNumber.trim() || !email.trim()) {
      setError('Please complete your name, phone number and email address.')
      return
    }
    if (phoneNumber.replace(/\D/g, '').length !== (countryCode === '+90' ? 10 : phoneNumber.replace(/\D/g, '').length) || phoneNumber.replace(/\D/g, '').length < 7 || phoneNumber.replace(/\D/g, '').length > 15 - countryCode.length + 1) {
      setError('Please enter a valid phone number (7–15 digits internationally; 10 digits for Turkey).')
      return
    }
    const transferInfo = JSON.parse(savedTransferInfo)
    if (!transferInfo.pickUpDate || !transferInfo.pickUpTime || !transferInfo.pickUpLocation || !transferInfo.dropOffLocation) {
      setError('Please complete the transfer details first.')
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
    localStorage.setItem('bookingPassengerInfo', JSON.stringify({
      customerName: `${firstName.trim()} ${lastName.trim()}`,
      phoneNumber: `${countryCode}${phoneNumber.replace(/\D/g, '')}`,
      email: email.trim(),
      countryOfResidence,
      transferAddress: transferAddress.trim(),
      specialRequests: specialRequests.trim(),
    }))
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

              <form className="space-y-stack-md" onSubmit={(event) => event.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                  <FormField
                    label="First Name"
                    placeholder="e.g. Alexander"
                    value={firstName}
                    onChange={setFirstName}
                  />
                  <FormField
                    label="Last Name"
                    placeholder="e.g. Hamilton"
                    value={lastName}
                    onChange={setLastName}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                  <div className="flex flex-col gap-2">
                    <label className="font-label-sm text-label-sm text-on-surface-variant">
                      Phone Number
                    </label>
                    <div className="flex">
                      <select aria-label="Country dialing code" className="border border-r-0 border-outline-variant bg-slate-100 rounded-l-lg px-2 text-sm" value={countryCode} onChange={(event) => { setCountryCode(event.target.value); setPhoneNumber('') }}>
                        <option value="+90">🇹🇷 +90</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+49">🇩🇪 +49</option>
                        <option value="+33">🇫🇷 +33</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+370">🇱🇹 +370</option>
                      </select>
                      <input
                        className="w-full border-outline-variant rounded-r-lg p-3 font-body-md text-body-md focus:border-admin-primary focus:ring-0 form-input-shadow transition-all"
                        onChange={(event) => setPhoneNumber(event.target.value.replace(/\D/g, '').slice(0, countryCode === '+90' ? 10 : 15 - countryCode.replace(/\D/g, '').length))}
                        placeholder={countryCode === '+90' ? '5551234567' : 'Phone number'}
                        inputMode="numeric"
                        maxLength={countryCode === '+90' ? 10 : 15 - countryCode.replace(/\D/g, '').length}
                        type="tel"
                        value={phoneNumber}
                      />
                    </div>
                  </div>
                  <FormField
                    label="Email Address"
                    onChange={setEmail}
                    placeholder="name@example.com"
                    type="email"
                    value={email}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="country-of-residence" className="font-label-sm text-label-sm text-on-surface-variant">Country of Residence *</label>
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
                    {JSON.parse(localStorage.getItem('bookingTransferInfo') || '{}').pickUpLocation === 'Dalaman Airport' ? 'Drop-off Address in Turkey' : 'Pickup Address in Turkey'} *
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
                  <label className="font-label-sm text-label-sm text-on-surface-variant">
                    Special Requests
                  </label>
                  <textarea
                    className="w-full border-outline-variant rounded-lg p-3 font-body-md text-body-md focus:border-admin-primary focus:ring-0 form-input-shadow transition-all resize-none"
                    placeholder="Flight number, child seat requirements, extra luggage details..."
                    rows={4}
                    value={specialRequests}
                    onChange={(event) => setSpecialRequests(event.target.value)}
                  />
                </div>
              </form>

              {error && (
                <div className="mt-6 rounded-lg border border-error/30 bg-error-container p-4 text-error">
                  {error}
                </div>
              )}

              <div className="mt-12 flex justify-between items-center border-t border-outline-variant pt-8">
                <Link
                  className="flex items-center gap-2 px-6 py-3 border border-outline-variant rounded-lg font-label-sm text-label-sm text-on-surface-variant hover:bg-slate-100 transition-colors active:scale-95"
                  to="/booking"
                >
                  <span className="material-symbols-outlined text-base">
                    arrow_back
                  </span>
                  Back
                </Link>
                <button
                  className="flex items-center gap-2 px-8 py-3 bg-admin-primary text-on-primary rounded-lg font-label-sm text-label-sm hover:opacity-90 shadow-md transition-all active:scale-95"
                  onClick={handleSubmit}
                  type="button"
                >
                  Continue to Confirmation
                  <span className="material-symbols-outlined text-base">
                    arrow_forward
                  </span>
                </button>
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
          <span className="material-symbols-outlined text-base">check</span>
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
}: {
  label: string
  onChange?: (value: string) => void
  placeholder: string
  type?: string
  value?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-label-sm text-label-sm text-on-surface-variant">
        {label}
      </label>
      <input
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
  const transfer = JSON.parse(localStorage.getItem('bookingTransferInfo') || '{}')
  const price = typeof transfer.price === 'number' ? `£${transfer.price.toFixed(2)}` : 'Price to be confirmed'
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
                <span className="material-symbols-outlined text-sm">
                  directions_car
                </span>
                <span className="font-label-sm text-label-sm">
                  {transfer.vehicleName || 'Not selected'}
                </span>
              </div>
            </div>
            <div className="space-y-4 border-t border-white/10 pt-4">
              <SummaryPoint
                icon="location_on"
                label="Pickup"
                meta={`${transfer.pickUpDate || ""} ${transfer.pickUpTime || ""}`}
                value={transfer.pickUpLocation || "Not selected"}
              />
              <SummaryPoint
                icon="near_me"
                label="Drop-off"
                value={transfer.dropOffLocation || "Not selected"}
              />
            </div>
            <div className="bg-white/5 rounded-lg p-4 space-y-2">
              <PriceLine label="Base Fare" value={price} />
              <PriceLine label="Meet & Greet" value="FREE" />
              <div className="flex justify-between items-center pt-2 border-t border-white/10">
                <span className="font-title-md text-title-md">Total</span>
                <span className="font-title-md text-title-md text-secondary-fixed">
                  {price}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-status-closed bg-white/5 p-3 rounded-lg">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified_user
              </span>
              <span className="font-label-sm text-label-sm">
                All-inclusive price. Taxes and fees included.
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-100 border border-outline-variant p-6 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-admin-primary">
            <span className="material-symbols-outlined">headset_mic</span>
          </div>
          <div>
            <p className="font-label-sm text-label-sm text-admin-primary font-bold">
              Need Assistance?
            </p>
            <p className="font-label-xs text-label-xs text-on-surface-variant">
              Our support team is available 24/7
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
      <span className="material-symbols-outlined text-primary-fixed-dim">
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
    <footer className="w-full py-12 bg-slate-200 border-t border-outline-variant">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter-grid px-margin-page max-w-7xl mx-auto">
        <div>
          <div className="font-title-md text-title-md font-bold text-admin-primary mb-4">
            VIP Transfer Dalaman
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Reliable airport transfers and professional chauffeur services.
          </p>
        </div>
        <FooterColumn title="Quick Links" items={quickLinks} />
        <FooterColumn title="Support" items={supportLinks} />
        <div>
          <h4 className="font-label-sm text-label-sm font-bold text-on-surface mb-4">
            Newsletter
          </h4>
          <p className="font-label-xs text-label-xs text-on-surface-variant mb-4">
            Get route updates and service announcements.
          </p>
          <div className="flex gap-2">
            <input
              className="bg-white border-outline-variant rounded px-3 py-2 text-sm w-full"
              placeholder="Email"
              type="email"
            />
            <button className="bg-admin-primary text-white p-2 rounded">
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </div>
        </div>
      </div>
      <div className="mt-12 border-t border-outline-variant pt-8 px-margin-page text-center">
        <p className="font-body-md text-body-md text-on-surface-variant">
          © 2024 VIP Transfer Dalaman. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

function FooterColumn({ items, title }: { items: string[]; title: string }) {
  return (
    <div>
      <h4 className="font-label-sm text-label-sm font-bold text-on-surface mb-4">
        {title}
      </h4>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item}>
            <a
              className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors"
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
