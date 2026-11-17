import { useCallback, useEffect, useRef, useState } from 'react'

import { getDashboardSummary } from './api'
import { bookingErrorMessage } from './api/errors'
import type { DashboardSummary } from './api'

const POLL_INTERVAL_MS = 30_000

/** Keep dashboard data current without overlapping requests or background-tab polling. */
export function useDashboardSummary() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const inFlight = useRef(false)
  const generation = useRef(0)
  const hasData = useRef(false)

  const fetchSummary = useCallback(async (manual = false) => {
    if (inFlight.current) return
    inFlight.current = true
    const requestGeneration = generation.current
    if (manual) {
      setRefreshing(true)
      setError('')
    }

    try {
      const data = await getDashboardSummary()
      if (requestGeneration !== generation.current) return
      hasData.current = true
      setSummary(data)
      setError('')
    } catch (err) {
      if (requestGeneration === generation.current && (manual || !hasData.current)) {
        setError(bookingErrorMessage(err, 'read'))
      }
    } finally {
      if (requestGeneration === generation.current) {
        inFlight.current = false
        setLoading(false)
        setRefreshing(false)
      }
    }
  }, [])

  useEffect(() => {
    // Initial fetch only updates React state after the network request settles.
    const requestGeneration = generation.current
    inFlight.current = true
    void getDashboardSummary()
      .then(data => {
        if (requestGeneration !== generation.current) return
        hasData.current = true
        setSummary(data)
        setError('')
      })
      .catch(err => {
        if (requestGeneration === generation.current) {
          setError(bookingErrorMessage(err, 'read'))
        }
      })
      .finally(() => {
        if (requestGeneration === generation.current) {
          inFlight.current = false
          setLoading(false)
        }
      })
    const poll = () => {
      if (document.visibilityState === 'visible') void fetchSummary()
    }
    const timer = window.setInterval(poll, POLL_INTERVAL_MS)
    document.addEventListener('visibilitychange', poll)
    return () => {
      generation.current += 1
      inFlight.current = false
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', poll)
    }
  }, [fetchSummary])

  return { summary, loading, refreshing, error, refresh: fetchSummary }
}
