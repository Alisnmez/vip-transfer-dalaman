import assert from 'node:assert/strict'
import test from 'node:test'
import { getClassroomReviews } from '../src/features/reviews/classroomReviews.ts'
import { isReviewDemoPreview } from '../src/features/reviews/demoPreview.ts'

test('classroom review demos are confined to the Render test host', (context) => {
  const previousWindow = globalThis.window
  context.after(() => { globalThis.window = previousWindow })

  globalThis.window = { location: { hostname: 'dalamanway.com' } }
  assert.equal(isReviewDemoPreview(''), false)
  assert.equal(isReviewDemoPreview('?demo-reviews=1'), false)
  globalThis.window.location.hostname = 'vip-transfer-dalaman-test.onrender.com'
  assert.equal(isReviewDemoPreview(''), true)
  assert.equal(isReviewDemoPreview('?demo-reviews=1'), true)
  assert.equal(isReviewDemoPreview('?demo-reviews=0'), false)
})

test('the demo fixture covers 162 distinct reviews across seventeen pages', () => {
  const pages = Array.from({ length: 17 }, (_, page) => getClassroomReviews(page))
  assert.deepEqual(pages.map(page => page.content.length), [...Array(16).fill(10), 2])
  assert.ok(pages.every(page => page.totalPages === 17 && page.totalElements === 162))
  const reviews = pages.flatMap(page => page.content)
  assert.equal(new Set(reviews.map(review => review.id)).size, 162)
  assert.equal(new Set(reviews.map(review => review.name)).size, 162)
  const normalizedComments = reviews.map(review => review.comment.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim())
  assert.equal(new Set(normalizedComments).size, 162)
  assert.ok(reviews.every(review => review.rating === 5))
  const timestamps = reviews.map(review => Date.parse(review.createdAt))
  assert.ok(timestamps.every(Number.isFinite))
  assert.ok(timestamps.slice(1).every((timestamp, index) => timestamp < timestamps[index]))
  assert.match(reviews[0].createdAt, /^2026-09-/)
  assert.match(reviews.at(-1).createdAt, /^2023-05-/)
  for (const review of reviews) {
    assert.match(review.createdAt, /^(?:2026-0[4-9]|202[3-5]-0[5-9])-/)
    assert.doesNotMatch(review.comment, /[→↔]/)
  }
  const lastNames = reviews.slice(-10).map(review => review.name)
  assert.ok(lastNames.includes("Miriam Fischer"))
  assert.ok(lastNames.includes("Дмитрий Волков"))
})
