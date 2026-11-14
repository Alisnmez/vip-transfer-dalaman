import { useState } from 'react'

import { PublicNavbar } from './PublicNavbar'

const informationLinks = ['Insurance Coverage', 'Trust & Safety']
const legalLinks = ['Terms of Service', 'Privacy Policy']

export function BookingConfirmationPage() {
  const [confirmed, setConfirmed] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [completed, setCompleted] = useState(false)

  function handleConfirm() {
    if (!confirmed || processing) return

    setProcessing(true)
    window.setTimeout(() => {
      setProcessing(false)
      setCompleted(true)
    }, 900)
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <PublicNavbar />

      <main className="pt-32 pb-24 px-margin-page max-w-6xl mx-auto">
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
              <span className="material-symbols-outlined text-admin-primary">
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
                  value="Dalaman Airport (DLM)"
                />
                <SummaryBlock
                  icon="location_on"
                  label="Destination"
                  value="Fethiye Marina / Center"
                />
              </div>
              <div className="flex flex-col gap-4">
                <SummaryBlock
                  icon="calendar_today"
                  label="Schedule"
                  value="15 Oct 2024, 14:30"
                />
                <SummaryBlock
                  icon="airport_shuttle"
                  label="Vehicle Class"
                  value="Mercedes-Benz Vito Premium"
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
                <span className="font-title-lg text-title-lg text-white">€75</span>
              </div>
              <p className="font-label-xs text-label-xs text-primary-fixed-dim mt-2">
                All taxes, parking, and tolls included.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">info</span>
              <span className="font-label-sm text-label-sm">
                Final price may vary by luggage volume.
              </span>
            </div>
          </aside>

          <section className="md:col-span-6 bg-surface-container-lowest border border-outline-variant rounded-xl p-container-padding card-soft-shadow">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-admin-primary">
                person
              </span>
              <h2 className="font-title-md text-title-md">Customer Details</h2>
            </div>
            <div className="space-y-4">
              <DetailRow label="Full Name" value="Julianna Rodriguez" />
              <DetailRow label="Phone" value="+44 7911 123456" />
              <DetailRow label="Email" value="j.rod@example.com" />
              <DetailRow label="Hotel Name" value="The Yacht Classic Hotel" />
            </div>
          </section>

          <section className="md:col-span-6 bg-surface-container-lowest border border-outline-variant rounded-xl p-container-padding card-soft-shadow flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-secondary">
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
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified_user
                </span>
                <span className="font-label-sm">
                  Secure Booking: Your reservation is safely stored and
                  instantly confirmed.
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
            <button
              className="w-full md:w-auto px-12 py-5 bg-admin-primary text-on-primary font-title-md text-title-md rounded-full shadow-lg hover:shadow-xl transition-standard active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!confirmed || processing || completed}
              onClick={handleConfirm}
              type="button"
            >
              {completed
                ? 'BOOKING CONFIRMED'
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
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
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
