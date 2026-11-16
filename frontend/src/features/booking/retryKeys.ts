/** Keep a stable idempotency key for retries of the same booking payload. */
export function createRetryKeyStore(
  storage: { getItem(key: string): string | null; setItem(key: string, value: string): void; removeItem(key: string): void } | null,
  newKey: () => string,
) {
  const pending = new Map<string, string>()
  return {
    getOrCreate(storageKey: string): string {
      let key = pending.get(storageKey)
      if (!key) {
        try { key = storage?.getItem(storageKey) || undefined } catch { /* Storage blocked. */ }
      }
      if (!key) key = newKey()
      pending.set(storageKey, key)
      try { storage?.setItem(storageKey, key) } catch { /* In-memory fallback. */ }
      return key
    },
    clear(storageKey: string): void {
      pending.delete(storageKey)
      try { storage?.removeItem(storageKey) } catch { /* Storage blocked. */ }
    },
  }
}
