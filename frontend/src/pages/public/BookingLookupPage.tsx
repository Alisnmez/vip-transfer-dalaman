import { Link } from 'react-router-dom'

import { PublicNavbar } from './PublicNavbar'

export function BookingLookupPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <PublicNavbar />
      <main className="mx-auto max-w-2xl px-5 pb-24 pt-32">
        <h1 className="mb-4 text-3xl font-bold text-admin-primary">
          Check Your Booking
        </h1>
        <p className="mb-5 text-on-surface-variant">
          Online booking lookup is not available yet. Please save the booking
          reference shown after submitting your transfer request. If you need help
          with an existing request, contact us using the details below and quote
          your booking reference.
        </p>
        <p className="mb-8 rounded-lg border border-outline bg-white p-5 text-on-surface-variant">
          For your privacy, a booking reference alone cannot be used to display
          passenger names, contact details or journey information. A secure
          verification process is required before online lookup is enabled.
        </p>
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
