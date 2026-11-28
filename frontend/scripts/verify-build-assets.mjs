import { readdir, readFile, stat } from 'node:fs/promises'
import { resolve, relative } from 'node:path'

const root = resolve('dist')
const failures = []
let pages = 0
const assets = new Set()

async function walk(folder) {
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const file = resolve(folder, entry.name)
    if (entry.isDirectory()) await walk(file)
    else if (entry.name.endsWith('.html')) {
      pages++
      const html = await readFile(file, 'utf8')
      for (const match of html.matchAll(/\b(?:src|href)\s*=\s*["'](\/assets\/[^"'?#]+\.(?:js|css))(?:[?#][^"']*)?["']/gi)) {
        const url = match[1]
        assets.add(url)
        try {
          const target = resolve(root, '.' + url)
          if (!target.startsWith(root + '/') || !(await stat(target)).isFile() || (await stat(target)).size === 0) throw new Error('Invalid asset')
        } catch {
          failures.push(relative(root, file) + ': ' + url)
        }
      }
    }
  }
}

await walk(root)
if (!pages || !assets.size || failures.length) {
  throw new Error('Build asset integrity failed: ' + failures.join('\n'))
}
console.log('Verified ' + assets.size + ' JS/CSS assets across ' + pages + ' HTML files')
