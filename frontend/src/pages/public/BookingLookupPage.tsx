import { useState } from 'react'
import { Link } from 'react-router-dom'

import { bookingSupportLink, whatsappSupportEnabled } from '../../features/booking/support'
import { PublicNavbar } from './PublicNavbar'

export function BookingLookupPage() {
  const [reference, setReference] = useState('')
  const validReference = /^[1-9][0-9]{0,15}$/.test(reference.trim())
  const contactMethod = whatsappSupportEnabled() ? 'WhatsApp' : 'Email'

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <PublicNavbar />
      <main className="mx-auto max-w-2xl px-5 pb-24 pt-32">
        <h1 className="mb-4 text-3xl font-bold text-admin-primary">Manage My Booking</h1>
        <p className="mb-8 text-on-surface-variant">
          Need to change or cancel your transfer? Enter your booking reference to contact our team.
        </p>
        <section className="rounded-lg border border-outline bg-white p-6" aria-label="Booking support request">
          <label htmlFor="booking-reference" className="block text-sm font-semibold">
            Booking reference
          </label>
          <input
            id="booking-reference"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={reference}
            onChange={event => setReference(event.target.value)}
            placeholder="e.g. 1042"
            className="mt-2 block w-full rounded-lg border border-outline px-4 py-3"
          />
          <p className="mt-3 text-sm text-on-surface-variant">
            Your reference is included in the message. We will verify your identity using the
            contact details saved with the booking before making any changes.
          </p>
          {validReference ? (
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={bookingSupportLink(reference, 'change')}
                target={whatsappSupportEnabled() ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="rounded-lg bg-admin-primary px-5 py-3 font-semibold text-white">
                Request Change via {contactMethod}
              </a>
              <a href={bookingSupportLink(reference, 'cancel')}
                target={whatsappSupportEnabled() ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="rounded-lg border border-outline px-5 py-3 font-semibold text-admin-primary">
                Request Cancellation via {contactMethod}
              </a>
            </div>
          ) : (
            <p className="mt-5 text-sm text-on-surface-variant">
              Enter a valid booking reference to continue.
            </p>
          )}
          <p className="mt-5 text-sm text-on-surface-variant">
            Sending a message does not change or cancel your booking.
            Wait for written confirmation from our team.
          </p>
        </section>
        <p className="mt-6 text-sm text-on-surface-variant">
          Do not share passwords, payment card details or verification codes in messages.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="rounded-lg bg-admin-primary px-6 py-3 font-semibold text-white"
            to="/booking">New Booking Request</Link>
          <Link className="rounded-lg border border-outline bg-white px-6 py-3 font-semibold text-admin-primary"
            to="/contact">Contact</Link>
        </div>
      </main>
    </div>
  )
}
