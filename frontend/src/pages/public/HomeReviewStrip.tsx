import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPublishedReviews, type PublicReview } from '../../features/reviews/api'
import { useLanguage } from '../../shared/localization/language'
import './HomeReviewStrip.css'

const reviewCopy = {
  en: { heading: 'Customer Reviews', all: 'Read all reviews', pause: 'Pause reviews', resume: 'Resume reviews', rating: (value: number) => `${value} out of 5 stars` },
  de: { heading: 'Kundenbewertungen', all: 'Alle Bewertungen lesen', pause: 'Bewertungen anhalten', resume: 'Bewertungen fortsetzen', rating: (value: number) => `${value} von 5 Sternen` },
  ru: { heading: 'Отзывы клиентов', all: 'Читать все отзывы', pause: 'Приостановить прокрутку', resume: 'Продолжить прокрутку', rating: (value: number) => `${value} из 5 звёзд` },
}

const demoReviews: PublicReview[] = [
  { id: -1, name: 'English · Demo', rating: 5, comment: 'Our flight was late, but the driver was waiting at the arrivals exit. We reached our hotel in Fethiye without any hassle.' },
  { id: -2, name: 'Deutsch · Demo', rating: 5, comment: 'Der Fahrer hat uns am Ausgang mit einem Namensschild empfangen. Für unsere vier Koffer war im Vito genug Platz.' },
  { id: -3, name: 'Русский · Demo', rating: 4, comment: 'До отеля в Мармарисе доехали комфортно. В аэропорту немного поискали место встречи, но водитель быстро ответил.' },
]

function isDemoPreview() {
  return window.location.hostname === 'vip-transfer-dalaman-test.onrender.com'
    && new URLSearchParams(window.location.search).get('demo-reviews') === '1'
}

export function HomeReviewStrip() {
  const { language } = useLanguage()
  const copy = reviewCopy[language]
  const [reviews, setReviews] = useState<PublicReview[]>([])
  const [paused, setPaused] = useState(false)
  const [demo, setDemo] = useState(false)

  useEffect(() => {
    let active = true
    const feed = isDemoPreview()
      ? Promise.resolve(demoReviews)
      : getPublishedReviews().then(result => result.content)
    feed.then(result => {
      if (!active) return
      const showDemo = isDemoPreview()
        || (window.location.hostname === 'vip-transfer-dalaman-test.onrender.com' && result.length < 2)
      setDemo(showDemo)
      setReviews(showDemo ? demoReviews : result)
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
          <h2 id="home-review-heading" className="font-headline-lg text-headline-lg">{copy.heading}</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/reviews" className="font-semibold underline underline-offset-4">{copy.all}</Link>
            {canScroll && (
              <button type="button" className="home-review-pause rounded-lg border border-outline px-3 py-2" onClick={() => setPaused(value => !value)}>
                {paused ? copy.resume : copy.pause}
              </button>
            )}
          </div>
        </div>
        {demo && <p className="mb-3 text-sm font-semibold">Demo content · Sample reviews for testing</p>}
        <div className="home-review-viewport" data-motion={canScroll && !paused}>
          <div className="home-review-track">
            {copies.map(duplicate => (
              <ul key={String(duplicate)} aria-hidden={duplicate || undefined} className="home-review-group">
                {reviews.map(review => (
                  <li key={review.id} className="home-review-card rounded-xl border border-outline-variant bg-white p-5">
                    <p dir="auto" translate="no" className="break-words font-semibold text-admin-primary">{review.name}</p>
                    <p aria-label={copy.rating(review.rating)} className="text-amber-600">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
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
