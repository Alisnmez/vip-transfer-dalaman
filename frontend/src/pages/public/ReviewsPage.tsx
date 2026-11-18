import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PublicNavbar } from './PublicNavbar'
import { getPublishedReviews, submitReview, reviewErrorMessage } from '../../features/reviews/api'
import type { PublicReview } from '../../features/reviews/api'

export function ReviewsPage() {
  const [name, setName] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [permission, setPermission] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | null>(null)
  const [reviews, setReviews] = useState<PublicReview[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  useEffect(() => {
    getPublishedReviews(page).then(result => { setReviews(result.content); setTotalPages(result.totalPages) }).catch(() => {
      setFeedbackType('error')
      setFeedback(reviewErrorMessage(undefined, 'load'))
    })
  }, [page])

  async function submitFeedback(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!permission || !name.trim() || !rating || comment.trim().length < 10 || submitting) return
    setSubmitting(true)
    setFeedback('')
    setFeedbackType(null)
    try {
      await submitReview({ name: name.trim(), rating, comment: comment.trim(), publicationConsent: permission })
      setFeedbackType('success')
      setFeedback('Thank you! Your review was received successfully and is awaiting approval before publication.')
      setName('')
      setRating(0)
      setComment('')
      setPermission(false)
    } catch (error) {
      setFeedbackType('error')
      setFeedback(reviewErrorMessage(error, 'submit'))
    } finally {
      setSubmitting(false)
    }
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
        {reviews.length > 0 && <section aria-label="Published customer reviews" className="mt-8 grid gap-4 md:grid-cols-2">{reviews.map(review => <article key={review.id} className="rounded-2xl border border-outline-variant bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><div aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 font-bold text-amber-900">{review.name.trim().charAt(0).toUpperCase()}</div><div><h2 className="font-semibold text-admin-primary">{review.name}</h2>{review.createdAt && !Number.isNaN(Date.parse(review.createdAt)) && <time dateTime={review.createdAt} className="text-xs text-on-surface-variant">{new Date(review.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</time>}</div></div><p aria-label={`${review.rating} out of 5 stars`} className="mt-4 text-lg tracking-wider text-amber-500">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p><p className="mt-3 whitespace-pre-wrap break-words leading-relaxed text-on-surface-variant">{review.comment}</p></article>)}</section>}
        {totalPages > 1 && <nav aria-label="Review pages" className="mt-6 flex items-center justify-center gap-4"><button type="button" disabled={page === 0} onClick={() => setPage(p => p - 1)} className="rounded-lg border px-4 py-2 disabled:opacity-40">Previous</button><span>Page {page + 1} of {totalPages}</span><button type="button" disabled={page + 1 >= totalPages} onClick={() => setPage(p => p + 1)} className="rounded-lg border px-4 py-2 disabled:opacity-40">Next</button></nav>}
        <section aria-label="Share a review" className="mt-10 rounded-xl border border-outline-variant bg-white p-8">
          <h2 className="mb-2 text-xl font-semibold text-admin-primary">Share your experience</h2>
          <p className="mb-6 text-on-surface-variant">
            Tell us about your journey. Your review will be checked by our team before publication.
          </p>
          <form className="grid max-w-xl gap-5" onSubmit={submitFeedback}>
            <label className="grid gap-2 font-semibold text-admin-primary" htmlFor="review-name">
              Your name <span className="text-sm font-normal text-red-600">* required</span>
              <input className="rounded-lg border border-outline-variant p-3 font-normal text-on-surface" id="review-name" maxLength={80} onChange={(event) => setName(event.target.value)} required type="text" value={name} />
            </label>
            <fieldset className="grid gap-2">
              <legend className="font-semibold text-admin-primary">Your rating <span className="text-sm font-normal text-red-600">* required</span></legend>
              <div className="flex items-center gap-1" aria-label="Choose a rating from 1 to 5 stars">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button key={value} type="button"
                    aria-label={value + (value === 1 ? ' star' : ' stars')}
                    aria-pressed={rating === value}
                    className={'rounded-md p-2 text-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-admin-primary ' + (value <= rating ? 'text-amber-500' : 'text-slate-300 hover:text-amber-400')}
                    onClick={() => setRating(value)}>
                    <span aria-hidden="true">{value <= rating ? '★' : '☆'}</span>
                  </button>
                ))}
              </div>
              <p aria-live="polite" className="text-sm text-on-surface-variant">{rating ? rating + ' out of 5 stars selected' : 'Select a star rating'}</p>
            </fieldset>
            <label className="grid gap-2 font-semibold text-admin-primary" htmlFor="review-comment">
              Your review <span className="text-sm font-normal text-red-600">* required</span>
              <textarea className="min-h-32 rounded-lg border border-outline-variant p-3 font-normal text-on-surface" id="review-comment" maxLength={1500} minLength={10} onChange={(event) => setComment(event.target.value)} required value={comment} />
            </label>
            <label className="flex items-start gap-3 text-sm text-on-surface-variant">
              <input checked={permission} className="mt-1" onChange={(event) => setPermission(event.target.checked)} required type="checkbox" />
              I agree that my name and review may be published on this website after moderation.
            </label>
            <button className="rounded-lg bg-admin-primary px-6 py-3 font-semibold text-white disabled:opacity-50" disabled={!permission || !rating || submitting} type="submit">{submitting ? "Submitting..." : "Submit Review"}</button>
          </form>
          {feedback && <p role={feedbackType === 'error' ? 'alert' : 'status'} className={'mt-5 rounded-lg border p-4 text-sm font-medium ' + (feedbackType === 'success' ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800')}>{feedback}</p>}
          <Link className="mt-5 inline-block text-admin-primary underline" to="/booking">Book Your Transfer</Link>
        </section>
      </main>
    </div>
  )
}
