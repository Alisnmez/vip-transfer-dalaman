/** Immediate, reusable lock for a single in-flight async operation. */
export function createActionLock() {
  let locked = false

  return {
    get locked() { return locked },
    async run(action: () => Promise<void>): Promise<boolean> {
      if (locked) return false
      locked = true
      try {
        await action()
        return true
      } finally {
        locked = false
      }
    },
  }
}
