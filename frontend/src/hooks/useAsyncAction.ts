import { useCallback, useRef, useState } from 'react'

/** A shared synchronous click guard for async actions. The ref locks immediately,
 * before React can render the disabled/loading button. */
export function useAsyncAction() {
  const locked = useRef(false)
  const [processing, setProcessing] = useState(false)

  const run = useCallback(async (action: () => Promise<void>) => {
    if (locked.current) return
    locked.current = true
    setProcessing(true)
    try {
      await action()
    } finally {
      locked.current = false
      setProcessing(false)
    }
  }, [])

  return { processing, run }
}
