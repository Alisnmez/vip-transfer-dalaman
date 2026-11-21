import { validateFieldValue } from './rules.ts'
import type { FieldKind, FieldOptions, FieldErrorCode } from './rules.ts'
import { validationMessage } from './messages.ts'
import type { ValidationLanguage } from './messages.ts'
export type FieldValidationResult = { valid: true; code: null; message: null } | { valid: false; code: FieldErrorCode; message: string }
export function validateField(kind: FieldKind, value: string | number | null | undefined, options: FieldOptions = {}, language: ValidationLanguage = 'en'): FieldValidationResult {
 const code = validateFieldValue(kind, value, options)
 return code === null ? { valid: true, code: null, message: null } : { valid: false, code, message: validationMessage(code, language) }
}
export function validateFields<T extends string>(values: Record<T, string | number | null | undefined>, schema: Record<T, { kind: FieldKind; options?: FieldOptions }>, language: ValidationLanguage = 'en'): Partial<Record<T, FieldValidationResult>> {
 const errors: Partial<Record<T, FieldValidationResult>> = {}
 for (const key of Object.keys(schema) as T[]) {
  const result = validateField(schema[key].kind, values[key], schema[key].options, language)
  if (!result.valid) errors[key] = result
 }
 return errors
}
