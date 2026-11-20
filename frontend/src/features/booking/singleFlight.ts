/** Coalesce concurrent requests with the same key; allow retries after either outcome. */
export function createSingleFlight<T>() {
  const inFlight = new Map<string, Promise<T>>()
  return function run(key: string, task: () => Promise<T>): Promise<T> {
    const existing = inFlight.get(key)
    if (existing) return existing
    const pending = Promise.resolve().then(task)
    inFlight.set(key, pending)
    void pending.then(
      () => { if (inFlight.get(key) === pending) inFlight.delete(key) },
      () => { if (inFlight.get(key) === pending) inFlight.delete(key) },
    )
    return pending
  }
}
