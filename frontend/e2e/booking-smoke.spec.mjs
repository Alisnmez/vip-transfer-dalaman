import { test, expect } from '@playwright/test'

test('booking transfer and passenger routes render without browser errors', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('http://127.0.0.1:4173/')
  await expect(page.locator('body')).toBeVisible()
  await page.goto('http://127.0.0.1:4173/booking')
  await expect(page).toHaveURL(/\/booking$/)
  await expect(page.locator('body')).toContainText(/Dalaman Airport/i)
  await page.goto('http://127.0.0.1:4173/booking/passenger')
  await expect(page.locator('body')).toBeVisible()
  expect(errors).toEqual([])
})
