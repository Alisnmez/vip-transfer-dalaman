// Admin credentials stay in memory only: never bundle, persist or log them.
let adminAuthorization: string | null = null

export function encodeBasicAuthorization(username: string, password: string): string {
  const bytes = new TextEncoder().encode(`${username}:${password}`)
  return `Basic ${btoa(Array.from(bytes, byte => String.fromCharCode(byte)).join(''))}`
}

export function setAdminCredentials(username: string, password: string) {
  adminAuthorization = encodeBasicAuthorization(username, password)
}

export function clearAdminCredentials() {
  adminAuthorization = null
}

export function getAdminAuthorization() {
  return adminAuthorization
}
