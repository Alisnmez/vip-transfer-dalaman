// Admin credentials stay in memory only: never bundle, persist or log them.
let adminAuthorization: string | null = null

export function setAdminCredentials(username: string, password: string) {
  adminAuthorization = `Basic ${btoa(Array.from(new TextEncoder().encode(`${username}:${password}`), byte => String.fromCharCode(byte)).join(''))}`
}

export function clearAdminCredentials() {
  adminAuthorization = null
}

export function getAdminAuthorization() {
  return adminAuthorization
}
