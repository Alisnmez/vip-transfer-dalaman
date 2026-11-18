import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPublishedReviews, type PublicReview } from '../../features/reviews/api'
import './HomeReviewStrip.css'

export function HomeReviewStrip() {
  const [reviews, setReviews] = useState<PublicReview[]>([])
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    let active = true
    getPublishedReviews().then(result => {
      if (active) setReviews(result.content)
    }).catch(() => {
      // Reviews are optional on the home page. The reviews page reports API errors.
    })
    return () => { active = false }
  }, [])

  if (!reviews.length) return null

  const canScroll = reviews.length > 1
  const copies = canScroll ? [false, true] : [false]

  return (
    <section className="bg-background py-stack-lg" aria-labelledby="home-review-heading">
      <div className="mx-auto max-w-container-max px-gutter">
        <div className="mb-stack-md flex flex-wrap items-center justify-between gap-3">
          <h2 id="home-review-heading" className="font-headline-lg text-headline-lg">Customer Reviews</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/reviews" className="font-semibold underline underline-offset-4">Read all reviews</Link>
            {canScroll && (
              <button type="button" className="home-review-pause rounded-lg border border-outline px-3 py-2" onClick={() => setPaused(value => !value)}>
                {paused ? 'Resume reviews' : 'Pause reviews'}
              </button>
            )}
          </div>
        </div>
        <div className="home-review-viewport" data-motion={canScroll && !paused}>
          <div className="home-review-track">
            {copies.map(duplicate => (
              <ul key={String(duplicate)} aria-hidden={duplicate || undefined} className="home-review-group">
                {reviews.map(review => (
                  <li key={review.id} className="home-review-card rounded-xl border border-outline-variant bg-white p-5">
                    <p dir="auto" translate="no" className="break-words font-semibold text-admin-primary">{review.name}</p>
                    <p aria-label={`${review.rating} out of 5 stars`} className="text-amber-600">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
                    <p dir="auto" translate="no" className="mt-2 line-clamp-4 whitespace-pre-wrap break-words text-on-surface-variant">{review.comment}</p>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
