import { isValidEmail, isValidPersonName, normalizeFlightNumber, sanitizePersonName, sanitizePhoneDigits } from '../utils/inputValidation'

/** Reuse existing booking input rules; do not silently change production behaviour. */
export { isValidEmail, isValidPersonName, normalizeFlightNumber, sanitizePersonName, sanitizePhoneDigits }

export type FieldKind = 'personName' | 'email' | 'phone' | 'flightNumber' | 'bookingReference' | 'requiredText' | 'address' | 'hotelName' | 'specialRequests' | 'nonNegativeInteger' | 'positiveInteger'
export type FieldErrorCode = 'required' | 'invalid_name' | 'invalid_email' | 'invalid_phone' | 'invalid_flight' | 'invalid_reference' | 'too_long' | 'invalid_integer' | 'below_minimum' | 'above_maximum'
export type FieldOptions = { required?: boolean; maxLength?: number; min?: number; max?: number; countryCode?: string }

export function validateFieldValue(kind: FieldKind, rawValue: string | number | null | undefined, options: FieldOptions = {}): FieldErrorCode | null {
  const value = rawValue === null || rawValue === undefined ? '' : String(rawValue).trim()
  if (!value) return options.required === false ? null : 'required'
  const defaultMax: Partial<Record<FieldKind, number>> = {
    personName: 80, email: 254, phone: 16, flightNumber: 20, address: 250,
    hotelName: 120, specialRequests: 1000,
  }
  const maxLength = options.maxLength ?? defaultMax[kind]
  if (maxLength !== undefined && value.length > maxLength) return 'too_long'
  switch (kind) {
    case 'personName': return isValidPersonName(value) ? null : 'invalid_name'
    case 'email': return isValidEmail(value) ? null : 'invalid_email'
    case 'phone': {
      const code = options.countryCode ?? ''
      if (code && !/^\+\d{1,4}$/.test(code)) return 'invalid_phone'
      const digits = sanitizePhoneDigits(value)
      const countryDigits = sanitizePhoneDigits(code)
      if (digits.length !== value.replace(/[\s()+.-]/g, '').length) return 'invalid_phone'
      const fullLength = digits.length + countryDigits.length
      if (fullLength < 8 || fullLength > 15) return 'invalid_phone'
      if (['+90', '+1', '+7'].includes(code) && digits.length !== 10) return 'invalid_phone'
      if (code === '+90' && !digits.startsWith('5')) return 'invalid_phone'
      return null
    }
    case 'flightNumber': return /^[A-Za-z0-9 -]{1,20}$/.test(value) ? null : 'invalid_flight'
    case 'bookingReference': return /^\d{1,18}$/.test(value) ? null : 'invalid_reference'
    case 'nonNegativeInteger':
    case 'positiveInteger': {
      if (!/^(0|[1-9]\d*)$/.test(value) || !Number.isSafeInteger(Number(value))) return 'invalid_integer'
      const number = Number(value)
      const min = options.min ?? (kind === 'positiveInteger' ? 1 : 0)
      if (number < min) return 'below_minimum'
      if (options.max !== undefined && number > options.max) return 'above_maximum'
      return null
    }
    default: return null
  }
}
