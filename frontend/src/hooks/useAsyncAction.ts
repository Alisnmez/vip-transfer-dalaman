import { useCallback, useRef, useState } from 'react'

import { createActionLock } from './createActionLock'

/** Shared processing state and immediate click protection for async buttons. */
export function useAsyncAction() {
  const lock = useRef<ReturnType<typeof createActionLock> | null>(null)
  if (lock.current === null) lock.current = createActionLock()
  const [processing, setProcessing] = useState(false)

  const run = useCallback(async (action: () => Promise<void>) => {
    const currentLock = lock.current!
    if (currentLock.locked) return
    await currentLock.run(async () => {
      setProcessing(true)
      try {
        await action()
      } finally {
        setProcessing(false)
      }
    })
  }, [])

  return { processing, run }
}
