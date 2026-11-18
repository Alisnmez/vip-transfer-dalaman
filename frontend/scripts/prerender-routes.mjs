import { destinationRoutes } from './destination-routes.mjs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const site = (process.env.VITE_PUBLIC_SITE_URL ?? '').trim().replace(/\/$/, '')
const production = /^https:\/\/[a-z0-9.-]+$/i.test(site) && !/onrender\.com|localhost|127\.0\.0\.1/i.test(site)
const pages = destinationRoutes.map(({ slug, name, intro }) => [slug, name, intro])
const template = await readFile('dist/index.html', 'utf8')
for (const [slug, name, intro] of pages) {
  const title = `Dalaman Airport to ${name} Private Transfer | DalamanWay`
  const description = `Plan a private Dalaman Airport to ${name} transfer. Compare available vehicles and request a one-way or return journey.`
  const canonical = production ? `<link rel="canonical" href="${site}/routes/${slug}" />` : ''
  const robots = production ? 'index,follow' : 'noindex,nofollow'
  const html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${description}" />`)
    .replace(/<meta name="robots" content="[^"]*"\s*\/>/, `<meta name="robots" content="${robots}" />`)
    .replace('</head>', `${canonical}</head>`)
    .replace('<div id="root"></div>', `<div id="root"><main data-prerender-fallback><h1>${title}</h1><p>${intro}</p><p>Compare available vehicle options and request a transfer from Dalaman Airport to ${name}.</p><a href="/booking">Request a transfer</a> <a href="/routes">Compare routes and prices</a></main></div>`)
  const folder = join('dist', 'routes', slug)
  await mkdir(folder, { recursive: true })
  await writeFile(join(folder, 'index.html'), html)
}
console.log(`Generated ${pages.length} static route HTML pages (${production ? 'production' : 'noindex staging'})`)

// Generate crawlable initial HTML for the public landing pages.
// These pages remain client-rendered after JavaScript loads.
const landingPages = [
  { path: '', title: 'Dalaman Airport Transfers | DalamanWay', description: 'Private Dalaman Airport transfers to Marmaris, Fethiye, Oludeniz, Gocek and Icmeler.', heading: 'Private Dalaman Airport Transfers', body: 'Explore private airport transfers and choose your destination.', links: '<a href="/routes">Explore transfer routes</a> <a href="/booking">Request a transfer</a>' },
  { path: 'vehicles', title: 'Airport Transfer Vehicles | DalamanWay', description: 'Explore vehicle categories for private Dalaman airport transfers and request the right option for your passengers and luggage.', heading: 'Private Airport Transfer Vehicles', body: 'Choose a vehicle category based on passenger count and luggage needs. Vehicle availability and details will be confirmed before travel.', links: '<a href="/booking">Choose a vehicle</a>' },
  { path: 'services', title: 'Private Dalaman Airport Transfer Services | DalamanWay', description: 'Arrange airport pickup, hotel transfers and return journeys from Dalaman Airport to nearby holiday destinations.', heading: 'Dalaman Airport Transfer Services', body: 'Request airport pickup, hotel transfers and return journeys. Add flight details and accommodation information in the booking form.', links: '<a href="/booking">Request a transfer</a>' },
  { path: 'contact', title: 'Contact DalamanWay | Airport Transfer Support', description: 'Contact DalamanWay about airport transfer booking requests, changes and cancellations.', heading: 'Contact DalamanWay', body: 'For new transfer requests use the booking form. For changes or cancellations, contact us with your booking reference.', links: '<a href="/booking">Make a booking request</a>' },
  { path: 'faq', title: 'Dalaman Airport Transfer FAQ | DalamanWay', description: 'Answers about Dalaman airport transfer bookings, return trips, flight details, child seats and changes.', heading: 'Frequently Asked Questions', body: '<h2>How do I book a transfer?</h2><p>Choose your route, travel date, vehicle category and passenger details in the online booking form.</p><h2>Can I book a return transfer?</h2><p>Yes. Select Round Trip and enter your return date and time.</p><h2>What if my flight is delayed?</h2><p>Include your flight number and contact us if your travel details change. Pickup arrangements will be confirmed by the operator.</p><h2>Can I request a child seat?</h2><p>Yes. Select baby seats in the booking form. Availability will be confirmed with your booking.</p><h2>How can I change or cancel my booking?</h2><p>Contact us with your booking reference. Any applicable terms will be confirmed by the operator.</p><h2>How will I know my booking is confirmed?</h2><p>Keep your booking reference. The operator will confirm the details separately.</p>', links: '<a href="/booking">Book a transfer</a> <a href="/contact">Contact us</a>' },
  { path: 'reviews', title: 'Customer Reviews | DalamanWay', description: 'Read customer feedback and learn how to share your experience with DalamanWay.', heading: 'Customer Reviews', body: 'Share feedback about your Dalaman airport transfer experience. Genuine reviews are published with permission.', links: '<a href="/contact">Contact us</a> <a href="/booking">Book a transfer</a>' },
  { path: 'routes', title: 'Dalaman Airport Transfer Routes | DalamanWay', description: 'Explore private transfers from Dalaman Airport to Marmaris, Fethiye, Oludeniz, Gocek and Icmeler.', heading: 'Dalaman Airport Transfer Routes', body: 'Explore popular destinations from Dalaman Airport.', links: destinationRoutes.map(({ slug, name }) => `<a href="/routes/${slug}">${name}</a>`).join(' ') },
]
for (const page of landingPages) {
  const canonical = production ? `<link rel="canonical" href="${site}/${page.path}" />` : ''
  const robots = production ? 'index,follow' : 'noindex,nofollow'
  const html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${page.title}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${page.description}" />`)
    .replace(/<meta name="robots" content="[^"]*"\s*\/>/, `<meta name="robots" content="${robots}" />`)
    .replace('</head>', `${canonical}</head>`)
    .replace('<div id="root"></div>', `<div id="root"><main data-prerender-fallback><h1>${page.heading}</h1><section>${page.body}</section>${page.links}</main></div>`)
  const folder = join('dist', page.path)
  await mkdir(folder, { recursive: true })
  await writeFile(join(folder, 'index.html'), html)
}
console.log(`Generated ${landingPages.length} landing HTML pages`)
