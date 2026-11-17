import { useCallback, useEffect, useState } from 'react'
import { getPendingReviews, moderateReview } from '../../features/reviews/api'
import type { PendingReview } from '../../features/reviews/api'

export function ReviewModerationPage() {
  const [reviews, setReviews] = useState<PendingReview[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<number | null>(null)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setReviews(await getPendingReviews())
    } catch {
      setError('Unable to load pending reviews. Please retry.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void refresh() }, [refresh])

  async function moderate(id: number, status: 'APPROVED' | 'REJECTED') {
    if (busyId !== null) return
    setBusyId(id)
    setError('')
    try {
      await moderateReview(id, status)
      setReviews(current => current.filter(review => review.id !== id))
    } catch {
      setError('Unable to update review. Please retry.')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <section className="w-full max-w-5xl p-4 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-bold text-admin-primary">Customer review moderation</h1><p className="text-on-surface-variant">Only approved reviews appear on the public website.</p></div>
        <button type="button" onClick={() => { void refresh() }} disabled={loading || busyId !== null} className="rounded-lg border bg-white px-4 py-2 font-semibold disabled:opacity-50">Refresh</button>
      </div>
      {error && <p role="alert" className="mb-4 text-red-700">{error}</p>}
      {loading ? <p>Loading pending reviews...</p> : reviews.length === 0 ? <p>No reviews awaiting approval.</p> : (
        <div className="space-y-4">{reviews.map(review => (
          <article key={review.id} className="rounded-xl border border-outline-variant bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-bold text-admin-primary">{review.customerName}</h2><span className="text-sm text-on-surface-variant">{review.rating} / 5 stars</span></div>
            <p className="mt-3 whitespace-pre-wrap break-words">{review.comment}</p>
            <p className="mt-2 text-xs text-on-surface-variant">{review.createdAt ? new Date(review.createdAt).toLocaleString() : ''}</p>
            <div className="mt-5 flex gap-3">
              <button type="button" disabled={busyId !== null} onClick={() => { void moderate(review.id, 'APPROVED') }} className="rounded-lg bg-admin-primary px-4 py-2 font-semibold text-white disabled:opacity-50">Approve</button>
              <button type="button" disabled={busyId !== null} onClick={() => { void moderate(review.id, 'REJECTED') }} className="rounded-lg border px-4 py-2 font-semibold disabled:opacity-50">Reject</button>
            </div>
          </article>
        ))}</div>
      )}
    </section>
  )
}
