import { useCallback, useEffect, useRef, useState } from 'react'

import { getDashboardSummary } from './api'
import type { DashboardSummary } from './api'

/** One dashboard request at a time; poll only while the admin tab is visible. */
export function useDashboardSummary() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const inFlight = useRef(false)
  const mounted = useRef(false)

  const refresh = useCallback(async (manual = false) => {
    if (inFlight.current || !mounted.current) return
    inFlight.current = true
    if (manual) {
      setRefreshing(true)
      setError('')
    }
    try {
      const data = await getDashboardSummary()
      if (mounted.current) {
        setSummary(data)
        setError('')
      }
    } catch (err) {
      if (mounted.current && (manual || loading)) {
        setError(err instanceof Error ? err.message : 'Unable to load bookings')
      }
    } finally {
      inFlight.current = false
      if (mounted.current) {
        setLoading(false)
        setRefreshing(false)
      }
    }
  }, [loading])

  useEffect(() => {
    mounted.current = true
    // Start after the effect has subscribed; avoid synchronous state updates.
    void getDashboardSummary()
      .then(data => { if (mounted.current) { setSummary(data); setError('') } })
      .catch(err => { if (mounted.current) setError(err instanceof Error ? err.message : 'Unable to load bookings') })
      .finally(() => { if (mounted.current) { setLoading(false); inFlight.current = false } })
    inFlight.current = true
    return () => { mounted.current = false }
  }, [])

  useEffect(() => {
    const poll = () => {
      if (document.visibilityState === 'visible') void refresh()
    }
    const timer = window.setInterval(poll, 30000)
    document.addEventListener('visibilitychange', poll)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', poll)
    }
  }, [refresh])

  return { summary, loading, refreshing, error, refresh }
}
