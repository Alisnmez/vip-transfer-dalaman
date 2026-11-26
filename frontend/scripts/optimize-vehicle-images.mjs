import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

const directory = 'public/images/vehicles'
const files = (await readdir(directory)).filter(name => /-(exterior|interior)\.webp$/.test(name))
if (files.length !== 14) throw new Error('Expected 14 original fleet photos')
for (const file of files) {
  const source = join(directory, file)
  for (const width of [480, 800]) {
    const target = source.replace(/\.webp$/, '-' + width + '.webp')
    const result = spawnSync('cwebp', ['-quiet', '-q', '82', '-resize', String(width), '0', source, '-o', target], { stdio: 'inherit' })
    if (result.error) throw result.error
    if (result.status !== 0) throw new Error('Image conversion failed: ' + source)
    console.log(target, (await stat(target)).size)
  }
}
