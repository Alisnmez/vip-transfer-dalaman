import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { GuestPhotos } from './GuestPhotos'
import { PublicNavbar } from './PublicNavbar'
import { getPublishedReviews, submitReview, reviewErrorMessage } from '../../features/reviews/api'
import { useLanguage } from '../../shared/localization/language'
import type { PublicReview } from '../../features/reviews/api'

const reviewsCopy = {
  en: {
    eyebrow: "Your experiences",
    title: "Customer Reviews",
    intro: "We value feedback from our passengers. Genuine customer reviews will be published here as they become available.",
    published: "Published customer reviews",
    pages: "Review pages",
    previous: "Previous",
    page: "Page",
    of: "of",
    next: "Next",
    share: "Share a review",
    experience: "Share your experience",
    guidance: "Tell us about your journey. Your review will be checked by our team before publication.",
    name: "Your name",
    required: "* required",
    rating: "Your rating",
    choose: "Choose a rating from 1 to 5 stars",
    select: "Select a star rating",
    review: "Your review",
    permission: "I agree that my name and review may be published on this website after moderation.",
    submitting: "Submitting...",
    submit: "Submit Review",
    success: "Thank you! Your review was received successfully and is awaiting approval before publication.",
    book: "Book Your Transfer",
    unauthorized: "Your admin session is not authorized. Please sign in again.",
    conflict: "The review status changed. Refresh to see the latest status.",
    limit: "Too many requests. Please wait and try again.",
    invalid: "Review details are invalid. Please check the form.",
    loadError: "Unable to load reviews. Please retry.",
    submitError: "Unable to submit your review. Please try again later.",
  },
  de: {
    eyebrow: "Ihre Erfahrungen",
    title: "Kundenbewertungen",
    intro: "Wir freuen uns über Rückmeldungen unserer Fahrgäste. Echte Kundenbewertungen veröffentlichen wir hier, sobald sie vorliegen.",
    published: "Veröffentlichte Kundenbewertungen",
    pages: "Bewertungsseiten",
    previous: "Zurück",
    page: "Seite",
    of: "von",
    next: "Weiter",
    share: "Bewertung abgeben",
    experience: "Teilen Sie Ihre Erfahrungen",
    guidance: "Erzählen Sie uns von Ihrer Fahrt. Unser Team prüft die Bewertung vor der Veröffentlichung.",
    name: "Ihr Name",
    required: "* Pflichtfeld",
    rating: "Ihre Bewertung",
    choose: "Wählen Sie eine Bewertung von 1 bis 5 Sternen",
    select: "Wählen Sie eine Sternebewertung",
    review: "Ihre Bewertung zur Fahrt",
    permission: "Ich stimme zu, dass mein Name und meine Bewertung nach der Prüfung auf dieser Website veröffentlicht werden dürfen.",
    submitting: "Wird gesendet …",
    submit: "Bewertung senden",
    success: "Vielen Dank! Ihre Bewertung ist eingegangen und wartet vor der Veröffentlichung auf Freigabe.",
    book: "Transfer buchen",
    unauthorized: "Ihre Sitzung ist nicht autorisiert. Bitte melden Sie sich erneut an.",
    conflict: "Der Status der Bewertung hat sich geändert. Aktualisieren Sie die Seite.",
    limit: "Zu viele Anfragen. Warten Sie kurz und versuchen Sie es erneut.",
    invalid: "Die Angaben zur Bewertung sind ungültig. Prüfen Sie das Formular.",
    loadError: "Die Bewertungen konnten nicht geladen werden. Versuchen Sie es erneut.",
    submitError: "Ihre Bewertung konnte nicht gesendet werden. Versuchen Sie es später erneut.",
  },
  ru: {
    eyebrow: "Ваши впечатления",
    title: "Отзывы клиентов",
    intro: "Мы ценим отзывы пассажиров. Здесь публикуются подлинные отзывы клиентов по мере их поступления.",
    published: "Опубликованные отзывы клиентов",
    pages: "Страницы отзывов",
    previous: "Назад",
    page: "Страница",
    of: "из",
    next: "Далее",
    share: "Оставить отзыв",
    experience: "Поделитесь впечатлениями",
    guidance: "Расскажите о поездке. Наша команда проверит отзыв перед публикацией.",
    name: "Ваше имя",
    required: "* обязательно",
    rating: "Ваша оценка",
    choose: "Выберите оценку от 1 до 5 звёзд",
    select: "Выберите оценку",
    review: "Ваш отзыв",
    permission: "Я разрешаю опубликовать моё имя и отзыв на сайте после проверки.",
    submitting: "Отправляем…",
    submit: "Отправить отзыв",
    success: "Спасибо! Ваш отзыв получен и ожидает одобрения перед публикацией.",
    book: "Забронировать трансфер",
    unauthorized: "Сеанс не авторизован. Войдите снова.",
    conflict: "Статус отзыва изменился. Обновите страницу.",
    limit: "Слишком много запросов. Подождите и попробуйте снова.",
    invalid: "Некорректные данные отзыва. Проверьте форму.",
    loadError: "Не удалось загрузить отзывы. Попробуйте ещё раз.",
    submitError: "Не удалось отправить отзыв. Попробуйте позже.",
  },
}

const feedbackKeys: Record<string, keyof typeof reviewsCopy.en> = {
  ["Thank you! Your review was received successfully and is awaiting approval before publication."]: "success",
  ["Your admin session is not authorized. Please sign in again."]: "unauthorized",
  ["The review status changed. Refresh to see the latest status."]: "conflict",
  ["Too many requests. Please wait and try again."]: "limit",
  ["Review details are invalid. Please check the form."]: "invalid",
  ["Unable to load reviews. Please retry."]: "loadError",
  ["Unable to submit your review. Please try again later."]: "submitError",
}

function ratingText(language: 'en' | 'de' | 'ru', value: number) {
  return {
    en: `${value} out of 5 stars`,
    de: `${value} von 5 Sternen`,
    ru: `${value} из 5 звёзд`,
  }[language]
}

function starLabel(language: 'en' | 'de' | 'ru', count: number) {
  const plural = count !== 1
  return {
    en: plural ? ' stars' : ' star',
    de: plural ? ' Sterne' : ' Stern',
    ru: count === 5 ? ' звёзд' : plural ? ' звезды' : ' звезда',
  }[language]
}

export function ReviewsPage() {
  const { language } = useLanguage()
  const copy = reviewsCopy[language]
  const locale = language === 'en' ? 'en-GB' : language
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
      setFeedback(reviewsCopy.en.success)
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
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-secondary">{copy.eyebrow}</p>
        <h1 className="font-display-lg text-display-lg text-admin-primary">{copy.title}</h1>
        <p className="mt-4 max-w-2xl text-on-surface-variant">
          {copy.intro}
        </p>
        {reviews.length > 0 && <section aria-label={copy.published} className="mt-8 grid gap-4 md:grid-cols-2">{reviews.map(review => <article key={review.id} className="rounded-2xl border border-outline-variant bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><div aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 font-bold text-amber-900">{review.name.trim().charAt(0).toUpperCase()}</div><div><h2 className="font-semibold text-admin-primary">{review.name}</h2>{review.createdAt && !Number.isNaN(Date.parse(review.createdAt)) && <time dateTime={review.createdAt} className="text-xs text-on-surface-variant">{new Date(review.createdAt).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })}</time>}</div></div><p aria-label={ratingText(language, review.rating)} className="mt-4 text-lg tracking-wider text-amber-500">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p><p className="mt-3 whitespace-pre-wrap break-words leading-relaxed text-on-surface-variant">{review.comment}</p></article>)}</section>}
        {totalPages > 1 && <nav aria-label={copy.pages} className="mt-6 flex items-center justify-center gap-4"><button type="button" disabled={page === 0} onClick={() => setPage(p => p - 1)} className="rounded-lg border px-4 py-2 disabled:opacity-40">{copy.previous}</button><span>{copy.page} {page + 1} {copy.of} {totalPages}</span><button type="button" disabled={page + 1 >= totalPages} onClick={() => setPage(p => p + 1)} className="rounded-lg border px-4 py-2 disabled:opacity-40">{copy.next}</button></nav>}
        <GuestPhotos gallery />

        <section aria-label={copy.share} className="mt-10 rounded-xl border border-outline-variant bg-white p-8">
          <h2 className="mb-2 text-xl font-semibold text-admin-primary">{copy.experience}</h2>
          <p className="mb-6 text-on-surface-variant">
            {copy.guidance}
          </p>
          <form className="grid max-w-xl gap-5" onSubmit={submitFeedback}>
            <label className="grid gap-2 font-semibold text-admin-primary" htmlFor="review-name">
              {copy.name} <span className="text-sm font-normal text-red-600">{copy.required}</span>
              <input className="rounded-lg border border-outline-variant p-3 font-normal text-on-surface" id="review-name" maxLength={80} onChange={(event) => setName(event.target.value)} required type="text" value={name} />
            </label>
            <fieldset className="grid gap-2">
              <legend className="font-semibold text-admin-primary">{copy.rating} <span className="text-sm font-normal text-red-600">{copy.required}</span></legend>
              <div className="flex items-center gap-1" aria-label={copy.choose}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <button key={value} type="button"
                    aria-label={value + starLabel(language, value)}
                    aria-pressed={rating === value}
                    className={'rounded-md p-2 text-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-admin-primary ' + (value <= rating ? 'text-amber-500' : 'text-slate-300 hover:text-amber-400')}
                    onClick={() => setRating(value)}>
                    <span aria-hidden="true">{value <= rating ? '★' : '☆'}</span>
                  </button>
                ))}
              </div>
              <p aria-live="polite" className="text-sm text-on-surface-variant">{rating ? ratingText(language, rating) : copy.select}</p>
            </fieldset>
            <label className="grid gap-2 font-semibold text-admin-primary" htmlFor="review-comment">
              {copy.review} <span className="text-sm font-normal text-red-600">{copy.required}</span>
              <textarea className="min-h-32 rounded-lg border border-outline-variant p-3 font-normal text-on-surface" id="review-comment" maxLength={1500} minLength={10} onChange={(event) => setComment(event.target.value)} required value={comment} />
            </label>
            <label className="flex items-start gap-3 text-sm text-on-surface-variant">
              <input checked={permission} className="mt-1" onChange={(event) => setPermission(event.target.checked)} required type="checkbox" />
              {copy.permission}
            </label>
            <button className="rounded-lg bg-admin-primary px-6 py-3 font-semibold text-white disabled:opacity-50" disabled={!permission || !rating || submitting} type="submit">{submitting ? copy.submitting : copy.submit}</button>
          </form>
          {feedback && <p role={feedbackType === 'error' ? 'alert' : 'status'} className={'mt-5 rounded-lg border p-4 text-sm font-medium ' + (feedbackType === 'success' ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800')}>{feedbackKeys[feedback] ? copy[feedbackKeys[feedback]] : feedback}</p>}
          <Link className="mt-5 inline-block text-admin-primary underline" to="/booking">{copy.book}</Link>
        </section>
      </main>
    </div>
  )
}
