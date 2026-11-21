import assert from 'node:assert/strict'
import { test } from 'node:test'
import { validateField, validateFields } from '../src/shared/validation/validateField.ts'

test('shared validation accepts valid names and rejects invalid characters', () => {
  assert.equal(validateField('personName', 'Ali Sönmez').valid, true)
  assert.equal(validateField('personName', 'Ali😊').valid, false)
})

test('shared validation checks email and phone formats', () => {
  assert.equal(validateField('email', 'a@example.com').valid, true)
  assert.equal(validateField('email', 'bad').valid, false)
  assert.equal(validateField('phone', '5551234567', { countryCode: '+90' }).valid, true)
  assert.equal(validateField('phone', '4551234567', { countryCode: '+90' }).valid, false)
})

test('shared validation checks integer bounds and booking references', () => {
  assert.equal(validateField('positiveInteger', 0).code, 'below_minimum')
  assert.equal(validateField('nonNegativeInteger', 3, { max: 2 }).code, 'above_maximum')
  assert.equal(validateField('bookingReference', '1042').valid, true)
  assert.equal(validateField('bookingReference', 'bad').valid, false)
})

test('shared validation localizes messages and collects field errors', () => {
  assert.match(validateField('email', 'bad', {}, 'de').message, /E-Mail/)
  const errors = validateFields(
    { name: 'Ali1', email: 'a@example.com' },
    { name: { kind: 'personName' }, email: { kind: 'email' } },
  )
  assert.equal(errors.name?.code, 'invalid_name')
  assert.equal(errors.email, undefined)
})
