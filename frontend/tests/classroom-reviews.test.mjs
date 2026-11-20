import assert from 'node:assert/strict'
import test from 'node:test'
import { getClassroomReviews } from '../src/features/reviews/classroomReviews.ts'
import { isReviewDemoPreview } from '../src/features/reviews/demoPreview.ts'

test('classroom reviews are available only on the opted-in test host', (context) => {
  const previousWindow = globalThis.window
  context.after(() => { globalThis.window = previousWindow })

  globalThis.window = { location: { hostname: 'dalamanway.com' } }
  assert.equal(isReviewDemoPreview('?demo-reviews=1'), false)
  globalThis.window.location.hostname = 'vip-transfer-dalaman-test.onrender.com'
  assert.equal(isReviewDemoPreview(''), false)
  assert.equal(isReviewDemoPreview('?demo-reviews=1'), true)
})

test('the demo fixture covers 52 unique reviews across six pages', () => {
  const pages = Array.from({ length: 6 }, (_, page) => getClassroomReviews(page))
  assert.deepEqual(pages.map(page => page.content.length), [10, 10, 10, 10, 10, 2])
  assert.ok(pages.every(page => page.totalPages === 6 && page.totalElements === 52))
  const reviews = pages.flatMap(page => page.content)
  assert.equal(new Set(reviews.map(review => review.id)).size, 52)
  assert.ok(reviews.every(review => review.rating === 5))
  const lastNames = reviews.slice(-10).map(review => review.name)
  assert.ok(lastNames.includes("Miriam Fischer"))
  assert.ok(lastNames.includes("Дмитрий Волков"))
})
