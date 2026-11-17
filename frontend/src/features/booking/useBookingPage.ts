import { useEffect, useState } from 'react'

import { getBookingPage } from './api'
import type { BookingPage } from './api'

/** Keep pagination and request lifecycle separate from the booking list UI. */
export function useBookingPage() {
  const [page, setPage] = useState(0)
  const [revision, setRevision] = useState(0)
  const [result, setResult] = useState<BookingPage | null>(null)
  const [loadedKey, setLoadedKey] = useState('')
  const [error, setError] = useState('')
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null)

  const requestKey = `${page}:${revision}`
  const loading = loadedKey !== requestKey

  useEffect(() => {
    let active = true
    getBookingPage(page)
      .then(data => {
        if (!active) return
        setResult(data)
        setLastUpdatedAt(Date.now())
        setError('')
        setLoadedKey(requestKey)
      })
      .catch(err => {
        if (!active) return
        setResult(null)
        setError(err instanceof Error ? err.message : 'Unable to load bookings')
        setLoadedKey(requestKey)
      })
    return () => { active = false }
  }, [page, requestKey])

  function refresh() {
    if (!loading) setRevision(value => value + 1)
  }

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') setRevision(value => value + 1)
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [])

  function changePage(nextPage: number) {
    if (loading || nextPage < 0 || (result && nextPage >= result.totalPages)) return
    setError('')
    setPage(nextPage)
  }

  return {
    bookings: result?.content ?? [],
    totalPages: result?.totalPages ?? 0,
    totalElements: result?.totalElements ?? 0,
    page,
    loading,
    error,
    lastUpdatedAt,
    refresh,
    changePage,
  }
}
