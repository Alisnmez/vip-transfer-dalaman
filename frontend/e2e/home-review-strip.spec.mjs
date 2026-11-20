import { expect, test } from '@playwright/test'

const site = new URL(process.env.STAGING_FRONTEND_URL ?? 'http://127.0.0.1:4173')
site.searchParams.set('demo-reviews', '0')
const reviews = [
  { id: 1, name: 'Testgast', rating: 5, comment: 'Die Abholung war pünktlich.' },
  { id: 2, name: 'Тестовый пассажир', rating: 4, comment: 'Водитель приехал вовремя.' },
]

test('homepage review strip scrolls and preserves original review text', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  let published = reviews
  await page.route('**/reviews?page=0&size=10', route => route.fulfill({
    headers: { 'access-control-allow-origin': '*' },
    json: { content: published, number: 0, totalElements: published.length, totalPages: 1 },
  }))
  await page.goto(site.href)

  const section = page.getByRole('region', { name: 'Customer Reviews' })
  const track = section.locator('.home-review-track')
  await expect(section).toBeVisible()
  await expect.poll(() => page.evaluate(() =>
    document.documentElement.scrollWidth <= window.innerWidth,
  )).toBe(true)
  await expect(section.locator('.home-review-group:not([aria-hidden]) [translate=no]')).toHaveText(
    reviews.flatMap(({ name, comment }) => [name, comment]),
  )
  const transform = () => track.evaluate(element => getComputedStyle(element).transform)
  const initial = await transform()
  await expect.poll(transform).not.toBe(initial)

  await section.getByRole('button', { name: 'Pause reviews' }).click()
  await expect(track).toHaveCSS('animation-name', 'none')
  await section.getByRole('button', { name: 'Resume reviews' }).click()
  await expect(track).toHaveCSS('animation-name', 'home-review-scroll')

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(track).toHaveCSS('animation-name', 'none')

  published = reviews.slice(0, 1)
  await page.reload()
  await expect(section.getByText(reviews[0].comment)).toBeVisible()
  await expect(section.getByText(reviews[1].comment)).toHaveCount(0)
})

test('homepage shows the same ten latest published reviews as the reviews page', async ({ page }) => {
  const latestReviews = Array.from({ length: 10 }, (_, index) => ({
    id: 100 - index,
    name: `Review author ${index + 1}`,
    rating: index === 0 ? 3 : 5,
    comment: `Published transfer feedback ${index + 1}.`,
  }))
  await page.route('**/reviews?page=0&size=10', route => route.fulfill({
    headers: { 'access-control-allow-origin': '*' },
    json: { content: latestReviews, number: 0, totalElements: 12, totalPages: 2 },
  }))

  await page.goto(site.href)
  const strip = page.getByRole('region', { name: 'Customer Reviews' })
  const latestNames = latestReviews.map(review => review.name)
  await expect(strip.locator('.home-review-group:not([aria-hidden]) li > p:first-child')).toHaveText(latestNames)
  await strip.getByRole('link', { name: 'Read all reviews' }).click()
  await expect(page.getByRole('region', { name: 'Published customer reviews' }).getByRole('heading')).toHaveText(latestNames)
  await page.getByRole('link', { name: 'Share your experience' }).click()
  await expect(page).toHaveURL(/#share-review$/)
  await expect(page.getByRole('region', { name: 'Share a review' })).toBeInViewport()
})

test('a long homepage review expands on hover and by button', async ({ page }) => {
  const comment = 'A detailed transfer note about finding the right entrance and fitting the luggage. '.repeat(8).trim()
  await page.route('**/reviews?page=0&size=10', route => route.fulfill({
    headers: { 'access-control-allow-origin': '*' },
    json: { content: [{ id: 20, name: 'Test Traveller', rating: 5, comment }], number: 0, totalElements: 1, totalPages: 1 },
  }))
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(site.href)
  const card = page.getByRole('region', { name: 'Customer Reviews' }).getByRole('listitem')
  const review = card.locator('.home-review-comment')
  const isClipped = () => review.evaluate(element => element.scrollHeight > element.clientHeight)
  await expect.poll(isClipped).toBe(true)
  await card.hover()
  await expect.poll(isClipped).toBe(false)
  await page.mouse.move(0, 0)
  await expect.poll(isClipped).toBe(true)
  const more = card.getByRole('button', { name: 'Read full review: Test Traveller' })
  await more.press('Space')
  const less = card.getByRole('button', { name: 'Show less: Test Traveller' })
  await expect(less).toHaveAttribute('aria-expanded', 'true')
  await expect.poll(isClipped).toBe(false)
  await less.press('Space')
  await expect(more).toHaveAttribute('aria-expanded', 'false')
  await expect.poll(isClipped).toBe(true)
})
