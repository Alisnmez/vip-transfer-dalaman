import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PublicNavbar } from './PublicNavbar'

export function ReviewsPage() {
  const [name, setName] = useState('')
  const [rating, setRating] = useState('5')
  const [comment, setComment] = useState('')
  const [permission, setPermission] = useState(false)

  function prepareFeedback(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!permission || !name.trim() || !comment.trim()) return
    const subject = encodeURIComponent('Customer review for moderation')
    const body = encodeURIComponent(
      `Customer name: ${name.trim()}\nRating: ${rating}/5\nReview:\n${comment.trim()}\n\nPermission to publish after review: Yes`,
    )
    window.location.href = `mailto:ali_sonmez35@hotmail.com?subject=${subject}&body=${body}`
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <PublicNavbar />
      <main className="mx-auto max-w-5xl px-margin-page pb-20 pt-32">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-secondary">Your experiences</p>
        <h1 className="font-display-lg text-display-lg text-admin-primary">Customer Reviews</h1>
        <p className="mt-4 max-w-2xl text-on-surface-variant">
          We value feedback from our passengers. Genuine customer reviews will be published here as they become available.
        </p>
        <section aria-label="Share a review" className="mt-10 rounded-xl border border-outline-variant bg-white p-8">
          <h2 className="mb-2 text-xl font-semibold text-admin-primary">Share your experience</h2>
          <p className="mb-6 text-on-surface-variant">
            Tell us about your journey. For now, this form prepares an email in your email app; please send that email to submit your feedback. Reviews are not published automatically.
          </p>
          <form className="grid max-w-xl gap-5" onSubmit={prepareFeedback}>
            <label className="grid gap-2 font-semibold text-admin-primary" htmlFor="review-name">
              Your name <span className="text-sm font-normal text-red-600">* required</span>
              <input className="rounded-lg border border-outline-variant p-3 font-normal text-on-surface" id="review-name" maxLength={80} onChange={(event) => setName(event.target.value)} required type="text" value={name} />
            </label>
            <label className="grid gap-2 font-semibold text-admin-primary" htmlFor="review-rating">
              Your rating
              <select className="rounded-lg border border-outline-variant p-3 font-normal text-on-surface" id="review-rating" onChange={(event) => setRating(event.target.value)} value={rating}>
                {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} {value === 1 ? 'star' : 'stars'}</option>)}
              </select>
            </label>
            <label className="grid gap-2 font-semibold text-admin-primary" htmlFor="review-comment">
              Your review <span className="text-sm font-normal text-red-600">* required</span>
              <textarea className="min-h-32 rounded-lg border border-outline-variant p-3 font-normal text-on-surface" id="review-comment" maxLength={1500} minLength={10} onChange={(event) => setComment(event.target.value)} required value={comment} />
            </label>
            <label className="flex items-start gap-3 text-sm text-on-surface-variant">
              <input checked={permission} className="mt-1" onChange={(event) => setPermission(event.target.checked)} required type="checkbox" />
              I agree that my name and review may be published on this website after moderation.
            </label>
            <button className="rounded-lg bg-admin-primary px-6 py-3 font-semibold text-white disabled:opacity-50" disabled={!permission} type="submit">Prepare Review Email</button>
          </form>
          <p className="mt-5 text-sm text-on-surface-variant">This does not send your review automatically. Please send the email that opens. Online submission and admin approval are planned for the next update.</p>
          <Link className="mt-5 inline-block text-admin-primary underline" to="/booking">Book Your Transfer</Link>
        </section>
      </main>
    </div>
  )
}
