import { expect, test } from '@playwright/test'

const site = process.env.STAGING_FRONTEND_URL ?? 'http://127.0.0.1:4173'
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
  await page.goto(site)

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
