import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { PublicReview } from '../../features/reviews/api'
import { isReviewDemoPreview, isReviewTestHost } from '../../features/reviews/demoPreview'
import { loadReviewPage } from '../../features/reviews/reviewFeed'
import { useLanguage } from '../../shared/localization/language'
import './HomeReviewStrip.css'

const reviewCopy = {
  en: { heading: 'Customer Reviews', all: 'Read all reviews', pause: 'Pause reviews', resume: 'Resume reviews', more: 'Read full review', less: 'Show less', rating: (value: number) => `${value} out of 5 stars` },
  de: { heading: 'Kundenbewertungen', all: 'Alle Bewertungen lesen', pause: 'Bewertungen anhalten', resume: 'Bewertungen fortsetzen', more: 'Bewertung ganz lesen', less: 'Weniger anzeigen', rating: (value: number) => `${value} von 5 Sternen` },
  ru: { heading: 'Отзывы клиентов', all: 'Читать все отзывы', pause: 'Приостановить прокрутку', resume: 'Продолжить прокрутку', more: 'Читать весь отзыв', less: 'Свернуть отзыв', rating: (value: number) => `${value} из 5 звёзд` },
}

export function HomeReviewStrip() {
  const { search } = useLocation()
  const demo = isReviewDemoPreview(search)
  return <ReviewStrip key={String(demo)} demo={demo} />
}

function ReviewStrip({ demo }: { demo: boolean }) {
  const { language } = useLanguage()
  const copy = reviewCopy[language]
  const locale = language === 'en' ? 'en-GB' : language
  const [reviews, setReviews] = useState<PublicReview[]>([])
  const [paused, setPaused] = useState(false)
  const [expandedReview, setExpandedReview] = useState<number | null>(null)
  useEffect(() => {
    let active = true
    loadReviewPage(0, demo).then(result => {
      if (active) setReviews(result.content)
    }).catch(() => {
      // Reviews are optional on the home page. The reviews page reports API errors.
    })
    return () => { active = false }
  }, [demo])

  if (!reviews.length) return null

  const canScroll = reviews.length > 1
  const copies = canScroll ? [false, true] : [false]

  return (
    <section className="bg-background py-stack-lg" aria-labelledby="home-review-heading">
      <div className="mx-auto max-w-container-max px-gutter">
        <div className="mb-stack-md flex flex-wrap items-center justify-between gap-3">
          <h2 id="home-review-heading" className="font-headline-lg text-headline-lg">{copy.heading}</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Link to={demo ? "/reviews?demo-reviews=1" : isReviewTestHost() ? "/reviews?demo-reviews=0" : "/reviews"} className="font-semibold underline underline-offset-4">{copy.all}</Link>
            {canScroll && (
              <button type="button" className="home-review-pause rounded-lg border border-outline px-3 py-2" onClick={() => setPaused(value => !value)}>
                {paused ? copy.resume : copy.pause}
              </button>
            )}
          </div>
        </div>
        <div className="home-review-viewport" data-motion={canScroll && !paused} data-review-expanded={expandedReview !== null}>
          <div className="home-review-track">
            {copies.map(duplicate => (
              <ul key={String(duplicate)} aria-hidden={duplicate || undefined} className="home-review-group">
                {reviews.map(review => (
                  <li key={review.id} data-expanded={expandedReview === review.id} className="home-review-card rounded-2xl border border-outline-variant bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 font-bold text-amber-900">{review.name.trim().charAt(0).toUpperCase()}</div>
                      <div className="min-w-0">
                        <h3 dir="auto" translate="no" className="break-words font-semibold text-admin-primary">{review.name}</h3>
                        {review.createdAt && !Number.isNaN(Date.parse(review.createdAt)) && <time dateTime={review.createdAt} className="text-xs text-on-surface-variant">{new Date(review.createdAt).toLocaleString(locale, { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</time>}
                      </div>
                    </div>
                    <p aria-label={copy.rating(review.rating)} className="mt-4 text-lg tracking-wider text-amber-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
                    <p dir="auto" translate="no" className="home-review-comment mt-3 whitespace-pre-wrap break-words leading-relaxed text-on-surface-variant">{review.comment}</p>
                    {!duplicate && (
                      <button type="button" aria-expanded={expandedReview === review.id}
                        aria-label={`${expandedReview === review.id ? copy.less : copy.more}: ${review.name}`}
                        className="mt-2 min-h-11 text-left text-sm font-semibold underline underline-offset-4"
                        onClick={() => setExpandedReview(current => current === review.id ? null : review.id)}>
                        {expandedReview === review.id ? copy.less : copy.more}
                      </button>
                    )}
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
