import { destinationRoutes } from './destination-routes.mjs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const site = (process.env.VITE_PUBLIC_SITE_URL ?? '').trim().replace(/\/$/, '')
const production = /^https:\/\/[a-z0-9.-]+$/i.test(site) && !/onrender\.com|localhost|127\.0\.0\.1/i.test(site)
const pages = destinationRoutes.map(({ slug, name, intro }) => [slug, name, intro])
const template = await readFile('dist/index.html', 'utf8')
for (const [slug, name, intro] of pages) {
  const title = `Dalaman Airport to ${name} Private Transfer | VIP Transfer Dalaman`
  const description = `Plan a private Dalaman Airport to ${name} transfer. Compare available vehicles and request a one-way or return journey.`
  const canonical = production ? `<link rel="canonical" href="${site}/routes/${slug}" />` : ''
  const robots = production ? 'index,follow' : 'noindex,nofollow'
  const html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${description}" />`)
    .replace(/<meta name="robots" content="[^"]*"\s*\/>/, `<meta name="robots" content="${robots}" />`)
    .replace('</head>', `${canonical}</head>`)
    .replace('<div id="root"></div>', `<div id="root"><main><h1>${title}</h1><p>${intro}</p><p>Compare available vehicle options and request a transfer from Dalaman Airport to ${name}.</p><a href="/booking">Request a transfer</a> <a href="/routes">Compare routes and prices</a></main></div>`)
  const folder = join('dist', 'routes', slug)
  await mkdir(folder, { recursive: true })
  await writeFile(join(folder, 'index.html'), html)
}
console.log(`Generated ${pages.length} static route HTML pages (${production ? 'production' : 'noindex staging'})`)

// Generate initial HTML for the two public landing pages as well.
// These pages remain client-rendered after JavaScript loads.
const landingPages = [
  { path: '', title: 'Dalaman Airport Transfers | VIP Transfer Dalaman', description: 'Private Dalaman Airport transfers to Marmaris, Fethiye, Oludeniz, Gocek and Icmeler.', heading: 'Private Dalaman Airport Transfers', body: 'Explore private airport transfers and choose your destination.', links: '<a href="/routes">Explore transfer routes</a> <a href="/booking">Request a transfer</a>' },
  { path: 'faq', title: 'Dalaman Airport Transfer FAQ | VIP Transfer Dalaman', description: 'Answers about Dalaman airport transfer bookings, return trips, flight details, child seats and changes.', heading: 'Frequently Asked Questions', body: 'Find answers about private airport transfer bookings, return journeys, flight details and child seats.', links: '<a href="/booking">Book a transfer</a> <a href="/contact">Contact us</a>' },
  { path: 'reviews', title: 'Customer Reviews | VIP Transfer Dalaman', description: 'Read customer feedback and learn how to share your experience with VIP Transfer Dalaman.', heading: 'Customer Reviews', body: 'Share feedback about your Dalaman airport transfer experience. Genuine reviews are published with permission.', links: '<a href="/contact">Contact us</a> <a href="/booking">Book a transfer</a>' },
  { path: 'routes', title: 'Dalaman Airport Transfer Routes | VIP Transfer Dalaman', description: 'Explore private transfers from Dalaman Airport to Marmaris, Fethiye, Oludeniz, Gocek and Icmeler.', heading: 'Dalaman Airport Transfer Routes', body: 'Explore popular destinations from Dalaman Airport.', links: destinationRoutes.map(({ slug, name }) => `<a href="/routes/${slug}">${name}</a>`).join(' ') },
]
for (const page of landingPages) {
  const canonical = production ? `<link rel="canonical" href="${site}/${page.path}" />` : ''
  const robots = production ? 'index,follow' : 'noindex,nofollow'
  const html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${page.title}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${page.description}" />`)
    .replace(/<meta name="robots" content="[^"]*"\s*\/>/, `<meta name="robots" content="${robots}" />`)
    .replace('</head>', `${canonical}</head>`)
    .replace('<div id="root"></div>', `<div id="root"><main><h1>${page.heading}</h1><p>${page.body}</p>${page.links}</main></div>`)
  const folder = join('dist', page.path)
  await mkdir(folder, { recursive: true })
  await writeFile(join(folder, 'index.html'), html)
}
console.log(`Generated ${landingPages.length} landing HTML pages`)
