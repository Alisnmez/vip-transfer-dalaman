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
          reference shown after submitting your transfer request.
        </p>
        <p className="mb-8 rounded-lg border border-outline bg-white p-5 text-on-surface-variant">
          For your privacy, a booking reference alone cannot be used to display
          passenger names, contact details or journey information. A secure
          verification process is required before online lookup is enabled.
        </p>
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
