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

test('admin booking pages require sign-in before displaying private data', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))

  for (const route of ['/admin', '/admin/bookings', '/admin/bookings/123']) {
    const response = await page.goto(`http://127.0.0.1:4173${route}`)
    expect(response?.status(), `HTTP status for ${route}`).toBeLessThan(400)
    await expect(page.getByRole('heading', { name: 'Admin sign in' })).toBeVisible()
    await expect(page.getByLabel('Username')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign out' })).toHaveCount(0)
  }

  expect(errors, 'Uncaught admin browser errors').toEqual([])
})

test('mobile booking and admin routes render at common phone widths', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))

  for (const width of [320, 375, 390]) {
    await page.setViewportSize({ width, height: 812 })
    for (const route of ['/', '/booking', '/booking/passenger']) {
      const response = await page.goto(`http://127.0.0.1:4173${route}`)
      expect(response?.status(), `HTTP status for ${route} at ${width}px`).toBeLessThan(400)
      await expect(page.locator('body')).toBeVisible()
      await expect(page.locator('body')).not.toBeEmpty()
      const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)
      const overflowingElements = horizontalOverflow ? await page.evaluate(() => [...document.querySelectorAll('body *')].filter(element => element.getBoundingClientRect().right > window.innerWidth + 1 && getComputedStyle(element).position !== 'fixed').slice(0, 8).map(element => `${element.tagName.toLowerCase()}.${String(element.className).slice(0, 100)}`)) : []
      expect(horizontalOverflow, `Unexpected horizontal overflow on ${route} at ${width}px: ${overflowingElements.join(', ')}`).toBe(false)
    }
    await page.goto('http://127.0.0.1:4173/admin/bookings')
    await expect(page.getByRole('heading', { name: 'Admin sign in' })).toBeVisible()
    await expect(page.getByLabel('Username')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
    const adminHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)
    expect(adminHorizontalOverflow, `Unexpected horizontal overflow on admin sign-in at ${width}px`).toBe(false)
  }
  expect(errors, 'Uncaught mobile browser errors').toEqual([])
})

test('incomplete transfer cannot proceed to passenger details', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('http://127.0.0.1:4173/booking')
  await expect(page.getByRole('heading', { name: 'Transfer Information' })).toBeVisible()
  await page.getByRole('link', { name: 'Next: Passenger Details' }).click()
  await expect(page).toHaveURL(/\/booking(?:\?.*)?$/)
  await expect(page.getByRole('alert')).toContainText('Please enter pickup, destination, date and time')
  expect(errors, 'Uncaught errors during transfer validation').toEqual([])
})

test('malformed stored transfer draft does not crash the booking page', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.addInitScript(() => {
    localStorage.setItem('bookingTransferInfo', '{invalid json')
  })
  await page.goto('http://127.0.0.1:4173/booking')
  await expect(page.getByRole('heading', { name: 'Transfer Information' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Next: Passenger Details' })).toBeVisible()
  expect(errors, 'Uncaught errors with malformed stored draft').toEqual([])
})
