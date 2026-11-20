import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const page = readFileSync(new URL('../src/pages/public/ReviewsPage.tsx', import.meta.url), 'utf8')

test('review rating uses five accessible star buttons instead of a select', () => {
  assert.match(page, /\[1, 2, 3, 4, 5\]\.map/)
  assert.match(page, /aria-pressed=\{rating === value\}/)
  assert.match(page, /aria-label=\{value \+/)
  assert.doesNotMatch(page, /<select/)
})

test('review submission gives visible success and failure feedback', () => {
  assert.match(page, /await submitReview/)
  assert.match(page, /setFeedbackType\('success'\)/)
  assert.match(page, /awaiting approval before publication/)
  assert.match(page, /setFeedbackType\('error'\)/)
  assert.match(page, /role=\{feedbackType === 'error' \? 'alert' : 'status'\}/)
  assert.match(page, /disabled=\{!permission \|\| !rating \|\| submitting\}/)
})
