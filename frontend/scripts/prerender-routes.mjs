import { fleetCatalogue } from '../src/features/vehicle-type/fleetCatalogue.ts'
import { destinationRoutes } from './destination-routes.mjs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import airportArrivalNotes from '../src/features/route-price/airport-arrival-notes.json' with { type: 'json' }
import { isLocalizedRoute, localizedRouteCopy, routeAlternates, routeLanguageLabels, routeLanguagePath, routeLanguages } from '../src/shared/localization/route-locales.ts'
import { travelGuides } from '../src/content/guides/index.ts'

const site = (process.env.VITE_PUBLIC_SITE_URL ?? '').trim().replace(/\/$/, '')
const production = /^https:\/\/[a-z0-9.-]+$/i.test(site) && !/onrender\.com|localhost|127\.0\.0\.1/i.test(site)
const pages = destinationRoutes.map(({ slug, name, intro }) => [slug, name, intro])
const template = await readFile('dist/index.html', 'utf8')

// Render's SPA fallback uses this shell for non-prerendered paths.
// Keep the same app entry point without the homepage's indexing metadata.
const appShell = template
  .replace(/<title>[^<]*<\/title>/, '<title>DalamanWay</title>')
  .replace(/<meta name="robots" content="[^"]*"\s*\/>/, '<meta name="robots" content="noindex,nofollow" />')
  .replace(/<meta name="description"[^>]*>/, '')
  .replace(/<link rel="canonical"[^>]*>|<meta (?:property="og:[^"]+"|name="twitter:[^"]+")[^>]*>/g, '')
await writeFile('dist/app-shell.html', appShell)

for (const [slug, name, intro] of pages) {
  const pilot = isLocalizedRoute(slug) ? localizedRouteCopy[slug] : undefined
  const alternates = production && pilot
    ? routeAlternates(slug).map(({ language, path }) => `<link rel="alternate" hreflang="${language}" href="${site}${path}" />`).join('')
    : ''
  const languageLinks = pilot ? routeLanguages.map(language =>
    `<a href="${routeLanguagePath(slug, language)}" lang="${language}" hreflang="${language}">${routeLanguageLabels[language].name}</a>`,
  ).join(' ') : ''
  const robots = production ? 'index,follow' : 'noindex,nofollow'
  for (const language of pilot ? routeLanguages : ['en']) {
    const copy = language === 'en' ? undefined : pilot[language]
    const heading = copy?.heading ?? `Dalaman Airport to ${name} Private Transfer`
    const title = `${heading} | DalamanWay`
    const description = copy?.intro ?? `Plan a private Dalaman Airport to ${name} transfer. Compare available vehicles and request a one-way or return journey.`
    const path = routeLanguagePath(slug, language)
    const canonical = production ? `<link rel="canonical" href="${site}${path}" />` : ''
    const labels = routeLanguageLabels[language]
    const vehicleRows = fleetCatalogue.map(vehicle =>
      `<tr><th scope="row">${vehicle.name}</th><td>${vehicle.maxPassengers}</td><td>${vehicle.luggage}</td></tr>`,
    ).join('')
    const fleet = `<section><h2>${labels.fleet}</h2><table><thead><tr><th scope="col">${labels.vehicle}</th><th scope="col">${labels.passengers}</th><th scope="col">${labels.luggage}</th></tr></thead><tbody>${vehicleRows}</tbody></table><a href="/routes">${labels.fare}</a></section>`
    const booking = pilot ? `/booking?destination=${encodeURIComponent(pilot.destination)}` : '/booking'
    const routeLink = language === 'en' ? ' <a href="/routes">Compare routes and prices</a>' : ''
    const html = template
      .replace('<html lang="en">', `<html lang="${language}">`)
      .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
      .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${description}" />`)
      .replace(/<meta name="robots" content="[^"]*"\s*\/>/, `<meta name="robots" content="${robots}" />`)
      .replace('</head>', `${canonical}${alternates}<meta property="og:type" content="website" /><meta property="og:title" content="${title}" /><meta property="og:description" content="${description}" />${production ? `<meta property="og:url" content="${site}${path}" />` : ''}<meta name="twitter:card" content="summary" /></head>`)
      .replace('<div id="root"></div>', `<div id="root"><main data-prerender-fallback><h1>${heading}</h1><p>${copy?.intro ?? intro}</p><h2>${labels.arrival}</h2><p>${airportArrivalNotes[slug][language]}</p>${fleet}<a href="${booking}">${labels.booking}</a>${routeLink} ${languageLinks}</main></div>`)
    const folder = join('dist', path.slice(1))
    await mkdir(folder, { recursive: true })
    await writeFile(join(folder, 'index.html'), html)
  }
}
console.log(`Generated static route HTML pages (${production ? 'production' : 'noindex staging'})`)

// Generate crawlable initial HTML for the public landing pages.
// These pages remain client-rendered after JavaScript loads.
const destinationLinks = destinationRoutes
  .map(({ slug, name }) => `<a href="/routes/${slug}">${name}</a>`)
  .join(' ')
const guideLinks = '<a href="/guides">Explore local travel guides</a>'
const landingPages = [
  { path: '', title: 'Dalaman Airport Transfers | DalamanWay', description: 'Private Dalaman Airport transfers to Marmaris, Fethiye, Oludeniz, Gocek, Icmeler, Dalyan and Sarigerme.', heading: 'Private Dalaman Airport Transfers', body: 'Explore private airport transfers and choose your destination.', links: `${destinationLinks} ${guideLinks} <a href="/routes">Explore all transfer routes</a> <a href="/booking">Request a transfer</a>` },
  { path: 'guides', title: 'Travel Guides for the Turquoise Coast | DalamanWay', description: 'Explore original ideas for Marmaris, Fethiye, Kayaköy, Ölüdeniz and Dalyan, then plan a private airport pickup.', heading: 'Travel Guides for your time on the Turquoise Coast', body: 'Original ideas for history, coast and local character. Choose a place to explore, then plan your private airport pickup around the trip you want to have.', links: travelGuides.map(guide => `<a href="${guide.path}">${guide.title}</a>`).join(' ') + ' <a href="/booking">Plan your pickup</a>' },
  { path: 'vehicles', title: 'Airport Transfer Vehicles | DalamanWay', description: 'Explore vehicle categories for private Dalaman airport transfers and request the right option for your passengers and luggage.', heading: 'Private Airport Transfer Vehicles', body: 'Choose a vehicle category based on passenger count and luggage needs. Vehicle availability and details will be confirmed before travel.', links: '<a href="/booking">Choose a vehicle</a>' },
  { path: 'services', title: 'Private Dalaman Airport Transfer Services | DalamanWay', description: 'Arrange airport pickup, hotel transfers and return journeys from Dalaman Airport to nearby holiday destinations.', heading: 'Dalaman Airport Transfer Services', body: 'Request airport pickup, hotel transfers and return journeys. Add flight details and accommodation information in the booking form.', links: '<a href="/booking">Request a transfer</a>' },
  { path: 'contact', title: 'Contact DalamanWay | Airport Transfer Support', description: 'Contact DalamanWay about airport transfer booking requests, changes and cancellations.', heading: 'Contact DalamanWay', body: 'For new transfer requests use the booking form. For changes or cancellations, contact us with your booking reference.', links: '<a href="/booking">Make a booking request</a>' },
  { path: 'faq', title: 'Dalaman Airport Transfer FAQ | DalamanWay', description: 'Answers about Dalaman airport transfer bookings, return trips, flight details, child seats and changes.', heading: 'Frequently Asked Questions', body: '<h2>How do I book a transfer?</h2><p>Choose your route, travel date, vehicle category and passenger details in the online booking form.</p><h2>Can I book a return transfer?</h2><p>Yes. Select Round Trip and enter your return date and time.</p><h2>What if my flight is delayed?</h2><p>Include your flight number and contact us if your travel details change. Pickup arrangements will be confirmed by the operator.</p><h2>Can I request a child seat?</h2><p>Yes. Select baby seats in the booking form. Availability will be confirmed with your booking.</p><h2>How can I change or cancel my booking?</h2><p>Contact us with your booking reference. Any applicable terms will be confirmed by the operator.</p><h2>How will I know my booking is confirmed?</h2><p>Keep your booking reference. The operator will confirm the details separately.</p>', links: '<a href="/booking">Book a transfer</a> <a href="/contact">Contact us</a>' },
  { path: 'reviews', title: 'Customer Reviews | DalamanWay', description: 'Read customer feedback and learn how to share your experience with DalamanWay.', heading: 'Customer Reviews', body: 'Share feedback about your Dalaman airport transfer experience. Genuine reviews are published with permission.', links: '<a href="/contact">Contact us</a> <a href="/booking">Book a transfer</a>' },
  { path: 'routes', title: 'Dalaman Airport Transfer Routes | DalamanWay', description: 'Explore private transfers from Dalaman Airport to Marmaris, Fethiye, Oludeniz, Gocek, Icmeler, Dalyan and Sarigerme.', heading: 'Dalaman Airport Transfer Routes', body: 'Explore popular destinations from Dalaman Airport.', links: destinationLinks },
]
for (const page of landingPages) {
  const canonical = production ? `<link rel="canonical" href="${site}/${page.path}" />` : ''
  const robots = production ? 'index,follow' : 'noindex,nofollow'
  const organization = production && page.path === ''
    ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', name: 'DalamanWay', url: `${site}/` })}</script>`
    : ''
  const html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${page.title}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${page.description}" />`)
    .replace(/<meta name="robots" content="[^"]*"\s*\/>/, `<meta name="robots" content="${robots}" />`)
    .replace('</head>', `${canonical}<meta property="og:type" content="website" /><meta property="og:title" content="${page.title}" /><meta property="og:description" content="${page.description}" />${production ? `<meta property="og:url" content="${site}/${page.path}" />` : ''}<meta name="twitter:card" content="summary" />${organization}</head>`)
    .replace('<div id="root"></div>', `<div id="root"><main data-prerender-fallback><h1>${page.heading}</h1><section>${page.body}</section>${page.links}</main></div>`)
  const folder = join('dist', page.path)
  await mkdir(folder, { recursive: true })
  await writeFile(join(folder, 'index.html'), html)
}
console.log(`Generated ${landingPages.length} landing HTML pages`)

const escapeHtml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;')
for (const guide of travelGuides) {
  const guideSections = guide.sections.map((section) => {
    let content = `<h2>${escapeHtml(section.heading)}</h2>`
    if ('paragraphs' in section) content += section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')
    if ('bullets' in section) content += `<ul>${section.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
    if ('faqs' in section) content += section.faqs.map((faq) => `<div><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></div>`).join('')
    return `<section>${content}</section>`
  }).join('')
  const guideTitle = `${guide.title} | DalamanWay`
  const guideCanonical = production ? `<link rel="canonical" href="${site}${guide.path}" />` : ''
  const guideRobots = production ? 'index,follow' : 'noindex,nofollow'
  const guideSources = guide.sources.map((source) => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`).join('')
  const guideBody = `<main data-prerender-fallback><article><nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/guides">Travel Guides</a> / ${escapeHtml(guide.destination)}</nav><p>${escapeHtml(guide.category)}</p><h1>${escapeHtml(guide.title)}</h1><p>${escapeHtml(guide.intro)}</p><p>Updated: ${escapeHtml(guide.reviewed)} · Check current opening information and local notices before visiting.</p>${guideSections}<aside><h2>Make more time for your ${escapeHtml(guide.destination)} plans</h2><p>Arrange a private Dalaman Airport pickup and plan your first day around the places you want to see.</p><a href="/routes/${guide.destinationSlug}">View private transfers to ${escapeHtml(guide.transferDestination)}</a> <a href="/booking?destination=${encodeURIComponent(guide.transferDestination)}">Plan your pickup</a></aside><section><h2>Further reading</h2><ul>${guideSources}</ul></section><nav aria-label="Related pages"><a href="/guides">Explore all travel guides</a> <a href="/routes/${guide.destinationSlug}">${escapeHtml(guide.transferDestination)} transfer details</a> <a href="/vehicles">Compare private vehicles</a></nav></article></main>`
  const guideHtml = template
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(guideTitle)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeHtml(guide.description)}" />`)
    .replace(/<meta name="robots" content="[^"]*"\s*\/>/, `<meta name="robots" content="${guideRobots}" />`)
    .replace('</head>', `${guideCanonical}<meta property="og:type" content="article" /><meta property="og:title" content="${escapeHtml(guideTitle)}" /><meta property="og:description" content="${escapeHtml(guide.description)}" />${production ? `<meta property="og:url" content="${site}${guide.path}" />` : ''}<meta name="twitter:card" content="summary" /></head>`)
    .replace('<div id="root"></div>', `<div id="root">${guideBody}</div>`)
  const guideFolder = join('dist', guide.path.slice(1))
  await mkdir(guideFolder, { recursive: true })
  await writeFile(join(guideFolder, 'index.html'), guideHtml)
}
console.log(`Generated ${travelGuides.length} travel guide pages (${production ? 'indexable production' : 'noindex staging'})`)
