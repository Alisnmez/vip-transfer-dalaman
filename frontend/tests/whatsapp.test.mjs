import test from 'node:test'
import assert from 'node:assert/strict'
import { whatsappLink, showFloatingWhatsApp } from '../src/features/booking/whatsapp.ts'

test('valid number and route produce an encoded WhatsApp link', () => {
  const url = new URL(whatsappLink('37063416424', '/routes/marmaris', 'en'))
  assert.equal(url.origin, 'https://wa.me')
  assert.equal(url.pathname, '/37063416424')
  assert.match(url.searchParams.get('text'), /Marmaris/)
})

test('invalid numbers do not create links', () => {
  for (const number of ['', '+37063416424', 'abc', '123']) assert.equal(whatsappLink(number, '/', 'en'), null)
})

test('localized routes and vehicle messages are supported', () => {
  assert.match(new URL(whatsappLink('37063416424', '/de/routes/fethiye', 'de')).searchParams.get('text'), /Hallo.*Fethiye/)
  assert.match(new URL(whatsappLink('37063416424', '/vehicles', 'ru')).searchParams.get('text'), /VIP/)
})

test('booking forms do not show the floating button', () => {
  for (const path of ['/booking', '/booking/passenger', '/booking/confirmation', '/booking/lookup']) assert.equal(showFloatingWhatsApp(path), false)
  assert.equal(showFloatingWhatsApp('/'), true)
  assert.equal(showFloatingWhatsApp('/contact'), true)
})
