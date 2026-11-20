import assert from 'node:assert/strict'
import test from 'node:test'
import { cleanPersonName, digitsOnly, isEmailAddress, isFlightNumber, isPersonName } from '../src/shared/validation/inputFormats.ts'

test('person names keep international letters and punctuation without digits', () => {
  for (const name of ['Anne-Marie', 'Éléonore O’Neill', 'Jürgen Müller', 'Анна', 'Çağla', 'Jose\u0301', 'Martin B.']) {
    assert.equal(cleanPersonName(name), name)
    assert.equal(isPersonName(name, 80), true)
  }
  assert.equal(cleanPersonName('12Анна3'), 'Анна')
  assert.equal(isPersonName('M4rtin', 80), false)
  assert.equal(isPersonName('---', 80), false)
  assert.equal(isPersonName('Long name', 4), false)
})

test('phone, email and flight fields retain their distinct formats', () => {
  assert.equal(digitsOnly(' +49 (123) 456 '), '49123456')
  assert.equal(isEmailAddress(' person+trip@example.com '), true)
  assert.equal(isEmailAddress('person@'), false)
  assert.equal(isFlightNumber('TK 432'), true)
  assert.equal(isFlightNumber('TK/432'), false)
})
