import { Link } from 'react-router-dom'
import { useState } from 'react'
import { requestBookingSupportCode, verifyBookingSupportCode, submitBookingSupportRequest } from '../../features/booking/api'

import { PublicNavbar } from './PublicNavbar'

export function BookingLookupPage() {
  const [reference, setReference] = useState('')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [sent, setSent] = useState(false)
  const [token, setToken] = useState('')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const validReference = /^[1-9][0-9]{0,15}$/.test(reference.trim())

  async function requestCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!validReference || !email.trim() || busy) return
    setBusy(true)
    setNotice('')
    try {
      const response = await requestBookingSupportCode(reference.trim(), email.trim())
      setSent(true)
      setNotice(response.message)
    } catch {
      setNotice('Verification is currently unavailable. Please contact support below.')
    } finally {
      setBusy(false)
    }
  }

  async function verifyCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!/^[0-9]{6}$/.test(code) || busy) return
    setBusy(true)
    try {
      const response = await verifyBookingSupportCode(reference.trim(), email.trim(), code)
      setToken(response.token || '')
      setNotice(response.verified ? 'Email verified. You can now contact our team.' : 'Invalid or expired code. Please check and try again.')
    } catch {
      setNotice('Could not verify the code. Please try again later.')
    } finally {
      setBusy(false)
    }
  }

  async function submitRequest(type: 'change' | 'cancel') {
    if (!token || busy) return
    setBusy(true)
    try {
      const response = await submitBookingSupportRequest(token, type)
      setToken('')
      setNotice(response.message)
    } catch {
      setToken('')
      setNotice('Request could not be delivered. Please verify again or contact support.')
    } finally {
      setBusy(false)
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
          Verify access to your booking email before preparing a change or cancellation request. No private journey details are displayed.
        </p>
        <section className="mb-8 rounded-lg border border-outline bg-white p-5" aria-label="Change or cancel booking">
          <h2 className="mb-3 text-lg font-semibold text-admin-primary">Request a change or cancellation</h2>
          <p className="mb-4 text-on-surface-variant">Enter your booking reference and the email used when booking. We will send a one-time verification code.</p>
          <form className="space-y-4" onSubmit={event => { void requestCode(event) }}>
            <label className="block text-sm font-semibold">Booking reference
              <input type="text" inputMode="numeric" value={reference} disabled={sent}
                onChange={event => setReference(event.target.value)}
                placeholder="e.g. 1042" className="mt-2 block w-full rounded-lg border border-outline px-4 py-3" required />
            </label>
            <label className="block text-sm font-semibold">Booking email
              <input type="email" value={email} disabled={sent}
                onChange={event => setEmail(event.target.value)}
                className="mt-2 block w-full rounded-lg border border-outline px-4 py-3" required />
            </label>
            {!sent && <button type="submit" disabled={!validReference || busy}
              className="rounded-lg bg-admin-primary px-5 py-3 font-semibold text-white disabled:opacity-50">
              {busy ? 'Sending...' : 'Send verification code'}
            </button>}
          </form>
          {sent && !token && <form className="mt-5 space-y-3" onSubmit={event => { void verifyCode(event) }}>
            <label className="block text-sm font-semibold">6-digit email code
              <input type="text" inputMode="numeric" maxLength={6} value={code}
                onChange={event => setCode(event.target.value.replace(/[^0-9]/g, ''))}
                className="mt-2 block w-full rounded-lg border border-outline px-4 py-3" required />
            </label>
            <button type="submit" disabled={busy || code.length !== 6}
              className="rounded-lg bg-admin-primary px-5 py-3 font-semibold text-white disabled:opacity-50">Verify code</button>
          </form>}
          {notice && <p role="status" className="mt-4 text-sm text-on-surface-variant">{notice}</p>}
          {token && <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" disabled={busy} onClick={() => { void submitRequest('change') }}
              className="rounded-lg bg-admin-primary px-4 py-3 font-semibold text-white disabled:opacity-50">Request change</button>
            <button type="button" disabled={busy} onClick={() => { void submitRequest('cancel') }}
              className="rounded-lg border border-outline px-4 py-3 font-semibold disabled:opacity-50">Request cancellation</button>
          </div>}
          <p className="mt-4 text-sm text-on-surface-variant">A verified request is sent to our team by email. It does not automatically change or cancel your booking.</p>
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
