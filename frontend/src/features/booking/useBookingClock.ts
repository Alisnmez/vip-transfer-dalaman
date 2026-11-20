import { useEffect, useState } from 'react'

/** Keep time-sensitive booking indicators current without a page refresh. */
export function useBookingClock() {
  const [nowMs, setNowMs] = useState(() => Date.now())
  useEffect(() => {
    const timer = window.setInterval(() => setNowMs(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  return nowMs
}
