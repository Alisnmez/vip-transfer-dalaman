import { Link } from 'react-router-dom'
import { PublicNavbar } from './PublicNavbar'

export function ReviewsPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <PublicNavbar />
      <main className="mx-auto max-w-5xl px-margin-page pb-20 pt-32">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-secondary">Your experiences</p>
        <h1 className="font-display-lg text-display-lg text-admin-primary">Customer Reviews</h1>
        <p className="mt-4 max-w-2xl text-on-surface-variant">
          We value feedback from our passengers. Genuine customer reviews will be published here as they become available.
        </p>
        <section aria-label="Customer review status" className="mt-10 rounded-xl border border-outline-variant bg-white p-8">
          <h2 className="mb-2 text-xl font-semibold text-admin-primary">Share your experience</h2>
          <p className="mb-6 text-on-surface-variant">
            Have you travelled with us? Contact our team to share your feedback. Reviews are displayed only with the customer's permission.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link className="rounded-lg bg-admin-primary px-6 py-3 font-semibold text-white" to="/contact">Contact Us</Link>
            <Link className="rounded-lg border border-outline-variant px-6 py-3 font-semibold text-admin-primary" to="/booking">Book Your Transfer</Link>
          </div>
        </section>
      </main>
    </div>
  )
}
