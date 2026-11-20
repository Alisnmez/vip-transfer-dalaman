import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(new URL('../src/pages/public/BookingPassengerPage.tsx', import.meta.url), 'utf8')

test('passenger submit button explicitly targets the passenger form', () => {
  assert.match(source, /<form\s+id="passenger-details-form"/)
  assert.match(source, /<ProcessingButton[\s\S]*?type="submit"[\s\S]*?form="passenger-details-form"/)
})

test('passenger validation runs in React rather than silently blocking form submission', () => {
  assert.match(source, /<form\s+id="passenger-details-form"\s+noValidate/)
  assert.match(source, /onSubmit=\{\(event\) => \{/)
  assert.match(source, /handleSubmit\(\)/)
})
