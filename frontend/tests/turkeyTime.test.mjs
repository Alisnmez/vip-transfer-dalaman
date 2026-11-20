import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parseTurkeyDateTime, turkeyToday } from '../src/features/booking/turkeyTime.ts'

test('Turkey wall-clock time converts to UTC+03:00 regardless of visitor timezone', () => {
  assert.equal(parseTurkeyDateTime('2027-01-15', '12:30'), Date.parse('2027-01-15T09:30:00Z'))
  assert.equal(parseTurkeyDateTime('2027-01-01', '00:15'), Date.parse('2026-12-31T21:15:00Z'))
})

test('invalid calendar dates and time formats are rejected', () => {
  for (const [date, time] of [
    ['2027-02-29', '10:00'], ['2027-04-31', '10:00'], ['2027-13-01', '10:00'],
    ['2027-01-01', '24:00'], ['2027-01-01', '12:60'], ['2027-01-01', '9:00'],
    ['2027/01/01', '09:00'],
  ]) assert.equal(parseTurkeyDateTime(date, time), null, date + ' ' + time)
  assert.equal(parseTurkeyDateTime('2028-02-29', '10:00'), Date.parse('2028-02-29T07:00:00Z'))
})

test('Turkey today is independent of visitor locale and crosses midnight at UTC+03:00', () => {
  assert.equal(turkeyToday(new Date('2027-01-01T20:59:00Z')), '2027-01-01')
  assert.equal(turkeyToday(new Date('2027-01-01T21:00:00Z')), '2027-01-02')
})
