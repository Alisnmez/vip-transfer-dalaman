import { useCallback, useEffect, useState } from 'react'
import { getPendingReviews, moderateReview, reviewErrorMessage } from '../../features/reviews/api'
import type { PendingReview, ReviewStatus } from '../../features/reviews/api'

const tabs: { status: ReviewStatus; label: string }[] = [
  { status: 'PENDING', label: 'Pending' },
  { status: 'APPROVED', label: 'Published' },
  { status: 'REJECTED', label: 'Rejected' },
  { status: 'ARCHIVED', label: 'Archived' },
]

export function ReviewModerationPage() {
  const [status, setStatus] = useState<ReviewStatus>('PENDING')
  const [reviews, setReviews] = useState<PendingReview[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const result = await getPendingReviews(status, page)
      setReviews(result.content)
      setTotalPages(result.totalPages)
    } catch (error) {
      setError(reviewErrorMessage(error, 'load'))
    } finally {
      setLoading(false)
    }
  }, [status, page])

  useEffect(() => {
    let active = true
    getPendingReviews(status, page).then(result => {
      if (active) { setReviews(result.content); setTotalPages(result.totalPages) }
    }).catch(error => {
      if (active) setError(reviewErrorMessage(error, 'load'))
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [status, page])

  async function moderate(id: number, nextStatus: 'APPROVED' | 'REJECTED' | 'ARCHIVED') {
    if (busyId !== null) return
    setBusyId(id)
    setError('')
    setNotice('')
    try {
      await moderateReview(id, nextStatus)
      setReviews(current => current.filter(review => review.id !== id))
      setNotice(nextStatus === 'ARCHIVED' ? 'Review archived. You can restore it from Archived.' : nextStatus === 'APPROVED' ? 'Review published.' : 'Review rejected.')
    } catch (error) {
      setError(reviewErrorMessage(error, 'moderate'))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <section className="w-full max-w-5xl p-4 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-bold text-admin-primary">Customer review moderation</h1><p className="text-on-surface-variant">Manage reviews without permanently deleting customer feedback.</p></div>
        <button type="button" onClick={() => { void refresh() }} disabled={loading || busyId !== null} className="rounded-lg border bg-white px-4 py-2 font-semibold disabled:opacity-50">Refresh</button>
      </div>
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter reviews by status">
        {tabs.map(tab => <button key={tab.status} type="button" aria-pressed={status === tab.status} disabled={busyId !== null} onClick={() => { if (tab.status !== status) { setLoading(true); setError(''); setReviews([]); setStatus(tab.status); setPage(0); setNotice('') } }} className={`rounded-lg border px-4 py-2 font-semibold disabled:opacity-50 ${status === tab.status ? 'bg-admin-primary text-white' : 'bg-white text-admin-primary'}`}>{tab.label}</button>)}
      </div>
      {error && <p role="alert" className="mb-4 text-red-700">{error}</p>}
      {notice && <p role="status" className="mb-4 text-green-700">{notice}</p>}
      {loading ? <p>Loading reviews...</p> : reviews.length === 0 ? <p>No {tabs.find(tab => tab.status === status)?.label.toLowerCase()} reviews.</p> : (
        <div className="space-y-4">{reviews.map(review => (
          <article key={review.id} className="rounded-xl border border-outline-variant bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-bold text-admin-primary">{review.customerName}</h2><span className="text-sm text-on-surface-variant">{review.rating} / 5 stars</span></div>
            <p className="mt-3 whitespace-pre-wrap break-words">{review.comment}</p>
            <p className="mt-2 text-xs text-on-surface-variant">{review.createdAt ? new Date(review.createdAt).toLocaleString() : ''}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {status === 'PENDING' && <>
                <button type="button" disabled={busyId !== null} onClick={() => { void moderate(review.id, 'APPROVED') }} className="rounded-lg bg-admin-primary px-4 py-2 font-semibold text-white disabled:opacity-50">Approve</button>
                <button type="button" disabled={busyId !== null} onClick={() => { void moderate(review.id, 'REJECTED') }} className="rounded-lg border px-4 py-2 font-semibold disabled:opacity-50">Reject</button>
              </>}
              {status !== 'ARCHIVED' && <button type="button" disabled={busyId !== null} onClick={() => { void moderate(review.id, 'ARCHIVED') }} className="rounded-lg border px-4 py-2 font-semibold disabled:opacity-50">Archive</button>}
              {status === 'ARCHIVED' && <button type="button" disabled={busyId !== null} onClick={() => { void moderate(review.id, 'APPROVED') }} className="rounded-lg bg-admin-primary px-4 py-2 font-semibold text-white disabled:opacity-50">Restore and publish</button>}
            </div>
          </article>
        ))}</div>
      )}
      {totalPages > 1 && <nav aria-label="Moderation pages" className="mt-6 flex items-center justify-center gap-4"><button type="button" disabled={loading || page === 0} onClick={() => setPage(p => p - 1)} className="rounded-lg border px-4 py-2 disabled:opacity-40">Previous</button><span>Page {page + 1} of {totalPages}</span><button type="button" disabled={loading || page + 1 >= totalPages} onClick={() => setPage(p => p + 1)} className="rounded-lg border px-4 py-2 disabled:opacity-40">Next</button></nav>}
    </section>
  )
}
