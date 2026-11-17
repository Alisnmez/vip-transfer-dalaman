import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const site = (process.env.VITE_PUBLIC_SITE_URL ?? '').trim().replace(/\/$/, '')
const production = /^https:\/\/[a-z0-9.-]+$/i.test(site) && !/onrender\.com|localhost|127\.0\.0\.1/i.test(site)
const pages = [
  ['marmaris', 'Marmaris', 'Marmaris is a coastal resort town with hotels, a marina and a lively waterfront.'],
  ['fethiye', 'Fethiye', 'Fethiye offers a harbour, town centre and access to the surrounding coast.'],
  ['oludeniz', 'Oludeniz', 'Oludeniz is known for its lagoon and beach area.'],
  ['gocek', 'Gocek', 'Gocek is a marina destination on the Gulf of Fethiye.'],
  ['icmeler', 'Icmeler', 'Icmeler is a resort area near Marmaris.'],
]
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
