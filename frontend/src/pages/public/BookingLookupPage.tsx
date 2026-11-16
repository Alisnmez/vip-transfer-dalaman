import { Link } from 'react-router-dom'
import { useState } from 'react'
import { bookingSupportLink, whatsappSupportEnabled } from '../../features/booking/support'

import { PublicNavbar } from './PublicNavbar'

export function BookingLookupPage() {
  const [reference, setReference] = useState('')
  const [email, setEmail] = useState('')
  const [verified, setVerified] = useState(false)
  const [checking, setChecking] = useState(false)
  const [message, setMessage] = useState('')
  const validReference = /^[1-9][0-9]{0,15}$/.test(reference.trim())
  async function checkBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!validReference || !email.trim() || checking) return
    setChecking(true)
    setVerified(false)
    setMessage('')
    try {
      setMessage('Online ownership verification is not available yet. Please contact our team using the contact details below. We will verify your booking before making any changes.')
    } catch {
      setMessage('Verification is temporarily unavailable. Please try again later.')
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <PublicNavbar />
      <main className="mx-auto max-w-2xl px-5 pb-24 pt-32">
        <h1 className="mb-4 text-3xl font-bold text-admin-primary">
          Manage My Booking
        </h1>
        <p className="mb-5 text-on-surface-variant">
          Need to change your pickup time, route or vehicle, or request cancellation?
          Enter the booking reference from your confirmation screen below.
        </p>
        <p className="mb-8 rounded-lg border border-outline bg-white p-5 text-on-surface-variant">
          This page prepares a message for our team. It does not verify your booking or display private journey details.
        </p>
        <section className="mb-8 rounded-lg border border-outline bg-white p-5" aria-label="Change or cancel booking">
          <h2 className="mb-3 text-lg font-semibold text-admin-primary">Request a change or cancellation</h2>
          <p className="mb-4 text-on-surface-variant">Enter your booking reference and the email used when booking. This is a basic match, not proof of email ownership.</p>
          <form onSubmit={event => { void checkBooking(event) }} className="space-y-4">
            <label className="block text-sm font-semibold">Booking reference
              <input type="text" inputMode="numeric" value={reference} onChange={event => { setReference(event.target.value); setVerified(false); setMessage('') }}
                placeholder="e.g. 1042" className="mt-2 block w-full rounded-lg border border-outline px-4 py-3" required />
            </label>
            <label className="block text-sm font-semibold">Email used for this booking
              <input type="email" value={email} onChange={event => { setEmail(event.target.value); setVerified(false); setMessage('') }}
                autoComplete="email" className="mt-2 block w-full rounded-lg border border-outline px-4 py-3" required />
            </label>
            <button type="submit" disabled={!validReference || !email.trim() || checking}
              className="rounded-lg bg-admin-primary px-5 py-3 font-semibold text-white disabled:opacity-50">
              {checking ? 'Checking...' : 'Request verification instructions'}
            </button>
          </form>
          {message && <p role="alert" className="mt-4 text-sm text-error">{message}</p>}
          {verified && (
            <div className="mt-5 flex flex-wrap gap-3">
              <a className="rounded-lg bg-admin-primary px-4 py-3 font-semibold text-white" href={bookingSupportLink(reference, 'change')} target={whatsappSupportEnabled() ? '_blank' : undefined} rel="noopener noreferrer">Request change {whatsappSupportEnabled() ? 'on WhatsApp' : 'by email'}</a>
              <a className="rounded-lg border border-outline px-4 py-3 font-semibold" href={bookingSupportLink(reference, 'cancel')} target={whatsappSupportEnabled() ? '_blank' : undefined} rel="noopener noreferrer">Request cancellation {whatsappSupportEnabled() ? 'on WhatsApp' : 'by email'}</a>
            </div>
          )}
          <p className="mt-4 text-sm text-on-surface-variant">Sending a message does not cancel or modify a booking. Wait for confirmation from our team.</p>
        </section>
        <section aria-label="Booking support" className="mb-8 rounded-lg border border-outline bg-white p-5">
          <h2 className="mb-3 text-lg font-semibold text-admin-primary">Booking support</h2>
          <p className="mb-3 text-on-surface-variant">For changes or questions about your request, contact us directly and include your booking reference. Never send passwords or payment card details by email.</p>
          <div className="flex flex-col gap-3">
            <a className="text-admin-primary underline underline-offset-4" href="mailto:ali_sonmez35@hotmail.com?subject=Booking%20request%20support&body=Hello%2C%20I%20need%20help%20with%20booking%20reference%20%23%5Benter%20reference%5D.%0A%0AThank%20you.">Email: ali_sonmez35@hotmail.com</a>
            <a className="text-admin-primary underline underline-offset-4" href="tel:+905555555555">Phone: 0555 555 55 55</a>
          </div>
        </section>
        <div className="flex flex-wrap gap-3">
          <Link className="rounded-lg bg-admin-primary px-6 py-3 font-semibold text-white" to="/booking">
            New Booking Request
          </Link>
          <Link className="rounded-lg border border-outline bg-white px-6 py-3 font-semibold text-admin-primary" to="/contact">
            Contact
          </Link>
        </div>
      </main>
    </div>
  )
}
