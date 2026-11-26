import { readdir, stat, unlink, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { fleetCatalogue } from '../src/features/vehicle-type/fleetCatalogue.ts'

const variants = {}
const directory = 'public/images/vehicles'
const files = (await readdir(directory)).filter(name => /-(exterior|interior)\.webp$/.test(name))
const originals = fleetCatalogue.flatMap(vehicle => [
  [vehicle.exteriorPhoto.split('/').pop(), vehicle.exteriorWidth],
  [vehicle.interiorPhoto.split('/').pop(), vehicle.interiorWidth],
])
if (files.length !== 14 || originals.some(([file]) => !files.includes(file))) {
  throw new Error('Fleet image inventory does not match original photos')
}
for (const [file, originalWidth] of originals) {
  const source = join(directory, file)
  const candidates = []
  variants['/images/vehicles/' + file] = candidates
  const originalSize = (await stat(source)).size
  for (const width of [480, 800]) {
    const target = source.replace(/\.webp$/, '-' + width + '.webp')
    await unlink(target).catch(error => { if (error.code !== 'ENOENT') throw error })
    if (width >= originalWidth) continue
    const result = spawnSync('cwebp', ['-quiet', '-q', '82', '-resize', String(width), '0', source, '-o', target], { stdio: 'inherit' })
    if (result.error) throw result.error
    if (result.status !== 0) throw new Error('Image conversion failed: ' + source)
    const size = (await stat(target)).size
    if (size >= originalSize) {
      await unlink(target)
      continue
    }
    candidates.push({ src: '/images/vehicles/' + target.split('/').pop(), width })
    console.log(target, size, 'bytes; original:', originalSize)
  }
}

await writeFile('src/features/vehicle-type/imageVariants.json', JSON.stringify(variants, null, 2) + '\n')
