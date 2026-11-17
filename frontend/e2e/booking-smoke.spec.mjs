import { test, expect } from '@playwright/test'

test('booking transfer and passenger routes render without browser errors', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))

  for (const route of ['/', '/booking', '/booking/passenger']) {
    const response = await page.goto(`http://127.0.0.1:4173${route}`)
    expect(response?.status(), `HTTP status for ${route}`).toBeLessThan(400)
    await expect(page.locator('body')).toBeVisible()
    await expect(page.locator('body')).not.toBeEmpty()
    await page.screenshot({ path: `test-results/route-${route.replaceAll('/', '-') || 'home'}.png`, fullPage: true })
  }

  expect(errors, 'Uncaught browser errors').toEqual([])
})
