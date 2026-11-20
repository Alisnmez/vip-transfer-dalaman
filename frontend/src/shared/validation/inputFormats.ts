const nameCharacters = /[^\p{L}\p{M}\p{Zs}.'’ʼ\-‐‑·]/gu
const emailPattern = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/

export function cleanPersonName(value: string) {
  return value.replace(nameCharacters, '')
}

export function isPersonName(value: string, maxLength: number) {
  return value.length <= maxLength && /\p{L}/u.test(value) && cleanPersonName(value) === value
}

export function isEmailAddress(value: string) {
  const email = value.trim()
  return email.length <= 254 && emailPattern.test(email)
}

export function isFlightNumber(value: string) {
  return /^[A-Za-z0-9 -]{1,20}$/.test(value)
}

export function digitsOnly(value: string) {
  return value.replace(/\D/g, '')
}
