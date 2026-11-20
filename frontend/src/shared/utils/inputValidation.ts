// Shared public-form input rules. Validate again on submit and on the server.
const nameCharacters = /^[\p{L}\p{M}][\p{L}\p{M} '\u2019-]*$/u
export function sanitizePersonName(value: string): string {
  return value.normalize('NFC').replace(/[^\p{L}\p{M} '\u2019-]/gu, '').slice(0, 80)
}
export function isValidPersonName(value: string): boolean {
  const trimmed = value.trim()
  return trimmed.length >= 2 && trimmed.length <= 80 && nameCharacters.test(trimmed) && /\p{L}/u.test(trimmed)
}
export function sanitizePhoneDigits(value: string, limit = 15): string {
  return value.replace(/\D/g, '').slice(0, limit)
}
export function isValidEmail(value: string): boolean {
  const trimmed = value.trim()
  return trimmed.length <= 254 && /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/.test(trimmed)
}
export function normalizeFlightNumber(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12)
}
