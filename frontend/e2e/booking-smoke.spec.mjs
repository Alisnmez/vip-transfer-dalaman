import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'

const catalogue = JSON.parse(readFileSync(new URL('../../src/main/resources/transfer-prices.json', import.meta.url), 'utf8')).map(item => ({ ...item, version: -1 }))
test.beforeEach(async ({ page }) => {
  await page.route('**/route-prices', route => route.request().method() === 'GET' && !route.request().isNavigationRequest()
    ? route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(catalogue) })
    : route.continue())
})

test('localized route URLs select their language and keep the destination on booking', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.addInitScript(() => localStorage.setItem('dalamanway-language', 'en'))
  await page.goto('http://127.0.0.1:4173/de/routes/marmaris')
  await expect(page.getByRole('heading', { name: 'Privater Transfer vom Flughafen Dalaman nach Marmaris' })).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('lang', 'de')
  await page.getByRole('combobox', { name: 'Sprache der Website' }).selectOption('ru')
  await expect(page).toHaveURL(/\/ru\/routes\/marmaris$/)
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru')
  await page.getByRole('link', { name: 'Заказать трансфер', exact: true }).click()
  await expect(page.getByRole('combobox', { name: 'Пункт назначения', exact: true })).toHaveValue('Marmaris(Any Hotel)')
  await page.goto('http://127.0.0.1:4173/ru/routes/gocek')
  await expect(page.getByRole('heading', { name: 'Индивидуальный трансфер из аэропорта Даламан в Гёджек' })).toBeVisible()
  await page.getByRole('link', { name: 'English', exact: true }).click()
  await expect(page).toHaveURL(/\/routes\/gocek$/)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
})

// Exercise the real admin UI against deterministic, disposable API fixtures.
// PostgreSQL integration tests verify the real API separately.
async function adminFixture(page, { width = 1280, extraDashboardBookings = false } = {}) {
  await page.setViewportSize({ width, height: 900 })
  const turkeyDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit' })
  const day = turkeyDate.format(new Date())
  const tomorrow = turkeyDate.format(new Date(Date.now() + 86_400_000))
  const yesterday = turkeyDate.format(new Date(Date.now() - 86_400_000))
  const booking = { id: 901, customerName: 'Menu test passenger', passengerCount: 2,
    pickUpLocation: 'Dalaman Airport', dropOffLocation: 'Marmaris', transferDateTime: `${day}T15:30:00`,
    price: 50, status: 'PENDING', phoneNumber: '+447700900123', email: 'test@example.invalid',
    transferAddress: 'Test hotel', vehicleId: 'mercedes-vito', tripType: 'one-way' }
  const dashboardBooking = { ...booking, transferDateTime: `${tomorrow}T15:30:00` }
  const later = { ...dashboardBooking, id: 899, customerName: 'Later pickup', transferDateTime: `${tomorrow}T18:30:00` }
  const earlier = { ...dashboardBooking, id: 904, customerName: 'Nearest pickup', transferDateTime: `${tomorrow}T09:00:00`,
    vehicleId: 'vip-minivan', luggageCount: 3, flightNumber: 'LS123', price: 52.5 }
  const started = { ...booking, id: 905, customerName: 'Past scheduled pickup', status: 'CONFIRMED', transferDateTime: `${yesterday}T09:00:00` }
  const reviews = Array.from({ length: 11 }, (_, i) => ({ id: i + 1, customerName: `Review passenger ${i + 1}`,
    rating: 5, comment: 'A punctual and comfortable transfer.', createdAt: '2026-11-18T09:00:00Z', status: 'PENDING' }))
  const requests = []
  const prices = catalogue.map(item => ({ ...item }))
  await page.route('**/*', async route => {
    const req = route.request()
    const url = new URL(req.url())
    const path = url.pathname
    if (!['/route-prices', '/admin/auth-check', '/admin/session/login', '/admin/session/csrf', '/admin/session/logout', '/bookings/dashboard', '/bookings/page', '/bookings/calendar', '/bookings/901', '/bookings/901/status', '/bookings/901/email-status', '/reviews/moderation'].includes(path) && !/^\/reviews\/\d+\/moderation$/.test(path)) return route.continue()
    if (req.isNavigationRequest()) return route.continue()
    requests.push({ path, search: url.search, method: req.method() })
    const reply = body => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) })
    if (path === '/route-prices' && req.method() === 'GET') return reply(prices)
    if (path === '/admin/session/login') {
      expect(req.headers().authorization).toBe(`Basic ${Buffer.from('fixture-admin:fixture-only').toString('base64')}`)
      return route.fulfill({ status: 204, body: '' })
    }
    if (path === '/admin/session/csrf') return reply({ token: 'fixture-csrf-token' })
    if (path === '/admin/session/logout') {
      expect(req.headers()['x-csrf-token']).toBe('fixture-csrf-token')
      return route.fulfill({ status: 204, body: '' })
    }
    if (path === '/admin/auth-check') return route.fulfill({ status: 401, contentType: 'application/json', body: '{}' })
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method())) {
      expect(req.headers()['x-csrf-token']).toBe('fixture-csrf-token')
    }
    if (path === '/route-prices') {
      const edited = req.postDataJSON()
      const row = prices.find(item => item.destination === edited.destination && item.vehicleId === edited.vehicleId)
      if (row.version !== edited.version) return route.fulfill({ status: 409, contentType: 'application/json', body: '{}' })
      Object.assign(row, edited, { version: row.version + 1 })
      return reply(row)
    }
    if (path === '/bookings/dashboard') return reply(extraDashboardBookings
      ? { total: 4, pending: 3, today: 0, upcoming: [later, dashboardBooking, earlier], started: [started] }
      : { total: 1, pending: 1, today: 0, upcoming: [dashboardBooking] })
    if (path === '/bookings/page') return reply({ content: [booking], totalElements: 1, totalPages: 1, number: 0 })
    if (path === '/bookings/calendar') return reply(url.searchParams.get('month') === day.slice(0, 7) ? [booking] : [])
    if (path === '/bookings/901/email-status') return reply([])
    if (path === '/bookings/901/status') { booking.status = req.postDataJSON().status; return reply(booking) }
    if (path === '/bookings/901') return reply(booking)
    if (path === '/reviews/moderation') {
      const filtered = reviews.filter(r => r.status === url.searchParams.get('status'))
      const number = Number(url.searchParams.get('page'))
      return reply({ content: filtered.slice(number * 10, number * 10 + 10), number, totalElements: filtered.length, totalPages: Math.ceil(filtered.length / 10) })
    }
    const review = reviews.find(r => r.id === Number(path.split('/')[2]))
    review.status = req.postDataJSON().status
    return reply({ status: review.status })
  })
  await page.goto('http://127.0.0.1:4173/admin')
  await page.getByLabel('Username', { exact: true }).fill('fixture-admin')
  await page.getByLabel('Password', { exact: true }).fill('fixture-only')
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Booking overview' })).toBeVisible()
  return { requests, booking, prices, reviews }
}

test('admin Dashboard renders API counts, refreshes and opens booking details', async ({ page }) => {
  const { requests } = await adminFixture(page)
  await expect(page.getByText('Total booking requests', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Refresh', exact: true }).click()
  await expect.poll(() => requests.filter(r => r.path === '/bookings/dashboard').length).toBe(2)
  await page.getByRole('link', { name: /#901.*Menu test passenger/ }).click()
  await expect(page.getByRole('heading', { name: 'Booking request #901' })).toBeVisible()
  await page.getByLabel('Booking status', { exact: true }).selectOption('CONFIRMED')
  await expect(page.getByLabel('Booking status', { exact: true })).toHaveValue('CONFIRMED')
  await expect.poll(() => requests.some(r => r.path === '/bookings/901/status' && r.method === 'PATCH')).toBe(true)
})

test('admin Dashboard puts the nearest pickup first on mobile and separates past pickups', async ({ page }) => {
  await adminFixture(page, { width: 390, extraDashboardBookings: true })
  const upcoming = page.getByRole('region', { name: 'Upcoming pickups' })
  await expect(upcoming.getByRole('link')).toHaveText([/Nearest pickup/, /Menu test passenger/, /Later pickup/])
  const first = upcoming.getByRole('link').first()
  await expect(first).toContainText('09:00')
  await expect(first).toContainText('VIP Vito')
  await expect(first).toContainText('LS123')
  await expect(first).toContainText('£52.50')
  await expect(first).toHaveAttribute('href', '/admin/bookings/904')
  await expect(page.getByRole('region', { name: 'Confirmed pickups past their scheduled time' }))
    .toContainText('Past scheduled pickup')
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390)
})

test('admin Bookings combines search, status and date filters and clears them', async ({ page }) => {
  const { requests } = await adminFixture(page)
  await page.getByRole('link', { name: 'Bookings', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Booking management' })).toBeVisible()
  await page.getByLabel('Search all bookings').fill('Menu test')
  await page.getByLabel('Status', { exact: true }).selectOption('PENDING')
  await page.getByLabel('Transfer date from (Turkey)').fill('2026-11-01')
  await page.getByLabel('Transfer date to (Turkey)').fill('2026-11-30')
  await expect.poll(() => requests.some(r => {
    const p = new URLSearchParams(r.search)
    return r.path === '/bookings/page' && p.get('search') === 'Menu test' && p.get('status') === 'PENDING' && p.get('from') === '2026-11-01' && p.get('to') === '2026-11-30'
  })).toBe(true)
  await page.getByRole('button', { name: 'Clear filters' }).click()
  await expect(page.getByLabel('Search all bookings')).toHaveValue('')
  await expect(page.getByLabel('Status', { exact: true })).toHaveValue('all')
  await expect(page.getByLabel('Transfer date from (Turkey)')).toHaveValue('')
})

test('admin Calendar changes views and periods and filters booking status', async ({ page }) => {
  await adminFixture(page)
  await page.getByRole('link', { name: 'Calendar', exact: true }).click()
  for (const view of ['Month', 'Week', 'Day']) {
    await page.getByRole('button', { name: view, exact: true }).click()
    await expect(page.getByRole('button', { name: view, exact: true })).toHaveAttribute('aria-pressed', 'true')
  }
  await page.getByLabel('Booking status', { exact: true }).selectOption('CANCELLED')
  await expect(page.getByRole('link', { name: /Menu test passenger/ })).toHaveCount(0)
  await page.getByLabel('Booking status', { exact: true }).selectOption('ALL')
  await expect(page.getByRole('link', { name: /Menu test passenger/ })).toBeVisible()
  await page.getByRole('button', { name: 'Next period' }).click()
  await page.getByRole('button', { name: 'Today', exact: true }).click()
  await expect(page.getByRole('link', { name: /Menu test passenger/ })).toBeVisible()
})

test('admin Customer Reviews paginates, publishes, archives and restores', async ({ page }) => {
  await adminFixture(page)
  await page.getByRole('link', { name: 'Customer Reviews', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Customer review moderation' })).toBeVisible()
  await page.getByRole('button', { name: 'Next', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Review passenger 11', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Approve', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('Review published.')
  await expect(page.getByRole('heading', { name: 'Review passenger 1', exact: true })).toBeVisible()
  await expect(page.getByText('No pending reviews.', { exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: 'Published', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Review passenger 11', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Archive', exact: true }).click()
  await page.getByRole('button', { name: 'Archived', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Review passenger 11', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Restore and publish', exact: true }).click()
  await page.getByRole('button', { name: 'Published', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Review passenger 11', exact: true })).toBeVisible()
})

test('admin review pagination hides stale rows while the next page loads', async ({ page }) => {
  await adminFixture(page)
  await page.getByRole('link', { name: 'Customer Reviews', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Review passenger 1', exact: true })).toBeVisible()
  let release
  const waiting = new Promise(resolve => { release = resolve })
  await page.route('**/reviews/moderation?*', async route => {
    if (new URL(route.request().url()).searchParams.get('page') === '1') await waiting
    await route.fallback()
  })
  await page.getByRole('button', { name: 'Next', exact: true }).click()
  await expect(page.getByText('Loading reviews...', { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Review passenger 1', exact: true })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeDisabled()
  release()
  await expect(page.getByRole('heading', { name: 'Review passenger 11', exact: true })).toBeVisible()
})

test('admin review refresh recovers when another admin empties the final page', async ({ page }) => {
  const { reviews } = await adminFixture(page)
  await page.getByRole('link', { name: 'Customer Reviews', exact: true }).click()
  await page.getByRole('button', { name: 'Next', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Review passenger 11', exact: true })).toBeVisible()
  reviews[10].status = 'APPROVED'
  await page.getByRole('button', { name: 'Refresh', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Review passenger 1', exact: true })).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Moderation pages', exact: true })).toHaveCount(0)
})

test('admin Route Prices requires sign-in, filters, saves and publishes edited fares', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/admin/route-prices')
  await expect(page.getByRole('heading', { name: 'Admin sign in' })).toBeVisible()
  await expect(page.getByRole('table')).toHaveCount(0)
  const { requests } = await adminFixture(page)
  await page.getByRole('link', { name: 'Route Prices', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Route Prices', exact: true })).toBeVisible()
  await expect(page.getByRole('row')).toHaveCount(26)
  await expect(page.getByLabel('Vehicle', { exact: true }).locator('option')).toHaveText(['All vehicles', 'VIP Vito', 'Ultra VIP Vito', 'Sprinter', 'Ultra Sprinter'])
  await expect(page.getByText('236', { exact: true })).toBeVisible()
  const readsBeforeSearch = requests.filter(r => r.path === '/route-prices').length
  await page.getByLabel('Search route or vehicle').fill('marmaris')
  await expect(page.getByRole('cell', { name: 'Marmaris(Any Hotel)', exact: true }).first()).toBeVisible()
  expect(requests.filter(r => r.path === '/route-prices').length).toBe(readsBeforeSearch)
  await page.getByLabel('Search route or vehicle').fill('')
  await page.getByLabel('Destination', { exact: true }).selectOption({ label: 'Marmaris(Any Hotel)' })
  await expect(page.getByRole('cell', { name: 'Marmaris(Any Hotel)', exact: true }).first()).toBeVisible()
  await expect(page.getByRole('cell', { name: 'Fethiye', exact: true })).toHaveCount(0)
  await page.getByLabel('Vehicle', { exact: true }).selectOption({ label: 'VIP Vito' })
  await page.getByRole('button', { name: 'Edit Marmaris(Any Hotel) VIP Vito', exact: true }).click()
  await page.getByLabel('One-way price (GBP)', { exact: true }).fill('60.25')
  await page.getByLabel('Round-trip price (GBP)', { exact: true }).fill('115.50')
  await page.getByRole('button', { name: 'Save prices', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('Prices saved for Marmaris')
  await page.getByRole('button', { name: 'Refresh prices', exact: true }).click()
  await expect(page.getByRole('cell', { name: '£60.25', exact: true })).toBeVisible()
  await page.getByLabel('Search route or vehicle').fill('no-such-destination')
  await expect(page.getByText('No prices match your filters.')).toBeVisible()
  await page.goto('http://127.0.0.1:4173/routes')
  await page.getByLabel('Vehicle', { exact: true }).selectOption('vip-minivan')
  await page.getByPlaceholder('Search destinations', { exact: true }).fill('Marmaris(Any Hotel)')
  await expect(page.getByText('£60.25', { exact: true })).toBeVisible()
})

test('admin stale price edit shows a useful conflict and reloads current prices', async ({ page }) => {
  const { prices } = await adminFixture(page)
  await page.getByRole('link', { name: 'Route Prices', exact: true }).click()
  await page.getByRole('button', { name: 'Edit Marmaris(Any Hotel) VIP Vito', exact: true }).click()
  await page.getByLabel('One-way price (GBP)', { exact: true }).fill('55.25')
  const current = prices.find(row => row.destination === 'Marmaris(Any Hotel)' && row.vehicleId === 'vip-minivan')
  current.version = 0
  current.oneWay = 60.50
  await page.getByRole('button', { name: 'Save prices', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('changed by another admin')
  await expect(page.getByRole('form', { name: 'Edit route prices' })).toHaveCount(0)
  await expect(page.getByRole('cell', { name: '£60.50', exact: true })).toBeVisible()
})

test('admin mobile navigation opens each menu and signs out', async ({ page }) => {
  await adminFixture(page, { width: 390 })
  for (const menu of ['Calendar', 'Bookings', 'Customer Reviews', 'Route Prices', 'Dashboard']) {
    await page.getByRole('button', { name: 'Open navigation', exact: true }).click()
    await page.locator('#admin-navigation').getByRole('link', { name: menu, exact: true }).click()
    await expect(page.getByRole('button', { name: 'Open navigation', exact: true })).toHaveAttribute('aria-expanded', 'false')
  }
  await page.getByRole('button', { name: 'Open navigation', exact: true }).click()
  await page.getByRole('button', { name: 'Sign out', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Admin sign in' })).toBeVisible()
})

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
    sessionStorage.setItem('bookingTransferInfo', '{invalid json')
  })
  await page.goto('http://127.0.0.1:4173/booking')
  await expect(page.getByRole('heading', { name: 'Transfer Information' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Next: Passenger Details' })).toBeVisible()
  expect(errors, 'Uncaught errors with malformed stored draft').toEqual([])
})

test('legacy persistent booking data is cleared while language preference survives', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('bookingTransferInfo', JSON.stringify({ customerName: 'Legacy Person' }))
    localStorage.setItem('bookingPassengerInfo', JSON.stringify({ email: 'legacy@example.invalid' }))
    localStorage.setItem('lastBookingReceipt', JSON.stringify({ customerName: 'Legacy Person' }))
    localStorage.setItem('dalamanway-language', 'en')
  })
  await page.goto('http://127.0.0.1:4173/booking')
  await expect(page.getByRole('heading', { name: 'Transfer Information' })).toBeVisible()
  const remaining = await page.evaluate(() => ({
    transfer: localStorage.getItem('bookingTransferInfo'),
    passenger: localStorage.getItem('bookingPassengerInfo'),
    receipt: localStorage.getItem('lastBookingReceipt'),
    language: localStorage.getItem('dalamanway-language'),
  }))
  expect(remaining).toEqual({ transfer: null, passenger: null, receipt: null, language: 'en' })
})

test('session booking drafts survive reload but are not persistent or shared with a fresh tab', async ({ page, context }) => {
  await page.goto('http://127.0.0.1:4173/booking')
  await page.evaluate(() => {
    sessionStorage.setItem('bookingTransferInfo', JSON.stringify({ pickUpLocation: 'Dalaman Airport', dropOffLocation: 'Marmaris(Any Hotel)' }))
    sessionStorage.setItem('bookingPassengerInfo', JSON.stringify({ customerName: 'Test Passenger' }))
  })
  await page.reload()
  const sameTab = await page.evaluate(() => ({
    transfer: sessionStorage.getItem('bookingTransferInfo'),
    passenger: sessionStorage.getItem('bookingPassengerInfo'),
    persistentTransfer: localStorage.getItem('bookingTransferInfo'),
    persistentPassenger: localStorage.getItem('bookingPassengerInfo'),
  }))
  expect(JSON.parse(sameTab.transfer).pickUpLocation).toBe('Dalaman Airport')
  expect(JSON.parse(sameTab.passenger).customerName).toBe('Test Passenger')
  expect(sameTab.persistentTransfer).toBeNull()
  expect(sameTab.persistentPassenger).toBeNull()
  const freshTab = await context.newPage()
  await freshTab.goto('http://127.0.0.1:4173/booking')
  const isolated = await freshTab.evaluate(() => ({
    transfer: sessionStorage.getItem('bookingTransferInfo'),
    passenger: sessionStorage.getItem('bookingPassengerInfo'),
  }))
  expect(isolated).toEqual({ transfer: null, passenger: null })
  await freshTab.close()
})

test('successful booking clears both drafts and keeps the receipt in the current tab', async ({ page, context }) => {
  await page.route('**/bookings', async route => {
    expect(route.request().method()).toBe('POST')
    expect(route.request().postDataJSON().email).toBe('booking@example.invalid')
    await route.fulfill({ json: { id: 902 } })
  })
  await page.goto('http://127.0.0.1:4173/booking')
  const tomorrow = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit' })
    .format(new Date(Date.now() + 86_400_000))
  await page.getByLabel('Destination', { exact: true }).selectOption('Marmaris(Any Hotel)')
  await page.getByLabel(/Pickup Date/).fill(tomorrow)
  await page.getByLabel(/Pickup Time/).fill('15:30')
  await page.getByRole('link', { name: 'Next: Passenger Details' }).click()
  await page.getByLabel(/First Name/).fill('Test')
  await page.getByLabel(/Last Name/).fill('Passenger')
  await page.getByLabel('Country dialing code').selectOption('+44')
  await page.getByPlaceholder('Phone number', { exact: true }).fill('7700900123')
  await page.getByLabel(/Email Address/).fill('booking@example.invalid')
  await page.getByLabel(/Country of Residence/).selectOption('United Kingdom')
  await page.getByPlaceholder('e.g. Green Nature Diamond Hotel, Siteler, Marmaris', { exact: true }).fill('Example Hotel, Marmaris')
  const continueButton = page.getByRole('button', { name: 'Continue to Confirmation' })
  await continueButton.click()
  await expect(page.getByRole('heading', { name: 'Review Your Booking Request' })).toBeVisible()
  await page.goBack()
  await expect(page.getByLabel(/Email Address/)).toHaveValue('booking@example.invalid')
  await continueButton.click()
  await page.getByRole('checkbox', { name: 'I confirm that all information provided is correct.' }).check()
  await page.getByRole('button', { name: 'Submit booking request' }).click()
  await expect(page.getByText('#902', { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Your Booking Request Was Received!' })).toBeVisible()
  await expect(page.getByText('Your transfer request is pending confirmation. Please save your booking reference.')).toBeVisible()
  const storage = await page.evaluate(() => ({
    transfer: sessionStorage.getItem('bookingTransferInfo'),
    passenger: sessionStorage.getItem('bookingPassengerInfo'),
    persistent: ['bookingTransferInfo', 'bookingPassengerInfo', 'lastBookingReceipt'].map(key => localStorage.getItem(key)),
  }))
  expect(storage).toEqual({ transfer: null, passenger: null, persistent: [null, null, null] })
  await page.reload()
  await expect(page.getByText('#902', { exact: true })).toBeVisible()
  const freshTab = await context.newPage()
  await freshTab.goto('http://127.0.0.1:4173/booking/confirmation')
  await expect(freshTab.getByRole('heading', { name: 'Review Your Booking Request' })).toBeVisible()
  await expect(freshTab.getByText('#902', { exact: true })).toHaveCount(0)
  await freshTab.close()
})

test('booking terms and data-use summary are available before entering passenger details', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/booking/passenger')
  await page.getByText('How we use your booking details', { exact: true }).click()
  await expect(page.getByText(/We use your name, contact details and journey information/)).toBeVisible()
  await page.getByText('Changes and cancellations', { exact: true }).click()
  await expect(page.getByText(/Wait for written confirmation before treating your transfer/)).toBeVisible()
  await expect(page.locator('details').getByRole('link', { name: 'Manage Booking', exact: true })).toHaveAttribute('href', '/booking/lookup')
  await page.getByRole('combobox', { name: 'Website language' }).selectOption('de')
  await expect(page.getByText('So verwenden wir Ihre Buchungsdaten', { exact: true })).toBeVisible()
  await page.getByRole('combobox', { name: 'Sprache der Website' }).selectOption('ru')
  await expect(page.getByText('Изменение и отмена бронирования', { exact: true })).toBeVisible()
})

test('expanded resorts show all vehicle fares and return prices before booking', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/routes')
  await expect(page.getByText('59 destinations found · Prices in GBP, per vehicle', { exact: true })).toBeVisible()
  await expect(page.getByLabel('Vehicle', { exact: true }).locator('option')).toHaveText(['VIP Vito', 'Ultra VIP Vito', 'Sprinter', 'Ultra Sprinter'])
  await page.getByLabel('Vehicle', { exact: true }).selectOption('vip-minivan')
  await page.getByPlaceholder('Search destinations', { exact: true }).fill('Alanya')
  await expect(page.getByText('£250.00', { exact: true })).toBeVisible()
  await page.getByLabel('Journey type', { exact: true }).selectOption('round-trip')
  await expect(page.getByText('£500.00', { exact: true })).toBeVisible()
  await page.goto('http://127.0.0.1:4173/booking')
  const destination = page.getByRole('combobox', { name: 'Destination', exact: true })
  await expect(destination.locator('optgroup option')).toHaveCount(59)
  for (const name of ['Bozburun', 'Sogut', 'Marmaris Cruise Port', 'Turunc Kumlubuk', 'Alanya', 'Yalikavak', 'Didim']) {
    await destination.selectOption(name)
    await expect(destination).toHaveValue(name)
  }
})

test('booking uses the four public fleet categories with their existing fares and limits', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/booking')
  const vehicleCard = name => page.getByRole('button').filter({ has: page.getByRole('heading', { name, exact: true }) })
  await expect(page.getByRole('button', { pressed: true })).toHaveCount(1)
  for (const name of ['VIP Vito', 'Ultra VIP Vito', 'Sprinter', 'Ultra Sprinter']) {
    await expect(vehicleCard(name)).toBeVisible()
  }
  for (const name of ['PRIVATE TAXI', 'PRIVATE PREMIUM VIP MINIVAN', 'PRIVATE MERCEDES MAYBACH +', 'PRIVATE VIP MINIBUS LONG']) {
    await expect(page.getByRole('heading', { name, exact: true })).toHaveCount(0)
  }
  await page.getByRole('combobox', { name: 'Destination', exact: true }).selectOption('Marmaris(Any Hotel)')
  for (const [name, amount] of [['VIP Vito', '£47.50'], ['Ultra VIP Vito', '£62.50'], ['Sprinter', '£80.50'], ['Ultra Sprinter', '£87.50']]) {
    await vehicleCard(name).click()
    await expect(vehicleCard(name)).toHaveAttribute('aria-pressed', 'true')
    await expect(vehicleCard(name).getByText(amount, { exact: true })).toBeVisible()
  }
  await vehicleCard('Ultra VIP Vito').click()
  for (let i = 0; i < 3; i++) await page.getByRole('button', { name: 'Increase Passengers', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Increase Passengers', exact: true })).toBeDisabled()
  for (let i = 0; i < 4; i++) await page.getByRole('button', { name: 'Increase Luggages', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Increase Luggages', exact: true })).toBeDisabled()
  await vehicleCard('Sprinter').click()
  await page.getByRole('button', { name: 'Round Trip', exact: true }).click()
  await expect(vehicleCard('Sprinter').getByText('£160.00', { exact: true })).toBeVisible()
})


test('admin vehicle editing offers the current fleet and preserves only the saved old category', async ({ page }) => {
  await adminFixture(page)
  await page.getByRole('link', { name: /#901.*Menu test passenger/ }).click()
  await page.getByRole('button', { name: 'Edit booking details', exact: true }).click()
  const vehicle = page.getByRole('combobox', { name: 'Vehicle', exact: true })
  await expect(vehicle).toHaveValue('mercedes-vito')
  await expect(vehicle.locator('option')).toHaveText(['Select vehicle', 'VIP Vito', 'Ultra VIP Vito', 'Sprinter', 'Ultra Sprinter', 'mercedes-vito (previous category)'])
  await vehicle.selectOption('maybach')
  await expect(vehicle).toHaveValue('maybach')
})
