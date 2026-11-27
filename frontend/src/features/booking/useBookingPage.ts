import { useEffect, useState } from 'react'

import { getBookingPage } from './api'
import { bookingErrorMessage } from './api/errors'
import type { BookingFilters, BookingPage } from './api'

/** Keep pagination and request lifecycle separate from the booking list UI. */
export function useBookingPage(filters: BookingFilters = {}) {
  const [page, setPage] = useState(0)
  const [revision, setRevision] = useState(0)
  const [result, setResult] = useState<BookingPage | null>(null)
  const [loadedKey, setLoadedKey] = useState('')
  const [error, setError] = useState('')
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const { sort = 'newest', status = '', from = '', to = '', search = '' } = filters
  const filterKey = `${sort}:${status}:${from}:${to}:${search}`
  const requestKey = `${page}:${revision}:${filterKey}`
  const loading = loadedKey !== requestKey

  useEffect(() => {
    let active = true
    getBookingPage(page, 25, { sort, status, from, to, search })
      .then(data => {
        if (!active) return
        setResult(data)
        setLastUpdatedAt(Date.now())
        setError('')
        setLoadedKey(requestKey)
        setRefreshing(false)
      })
      .catch(err => {
        if (!active) return
        setResult(null)
        setError(bookingErrorMessage(err, 'read'))
        setLoadedKey(requestKey)
        setRefreshing(false)
      })
    return () => { active = false }
  }, [page, requestKey, sort, status, from, to, search])

  function refresh() {
    if (loading) return
    setRefreshing(true)
    setRevision(value => value + 1)
  }

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') setRevision(value => value + 1)
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [])

  function resetPage() { setPage(0) }

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
    refreshing,
    refresh,
    changePage,
    resetPage,
  }
}
