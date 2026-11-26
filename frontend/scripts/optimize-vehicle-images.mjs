import { readdir, stat, unlink, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { fleetCatalogue } from '../src/features/vehicle-type/fleetCatalogue.ts'

const variants = {}
const encoder = spawnSync('cwebp', ['-version'], { encoding: 'utf8' })
let pythonCommand = 'python3'
let python = spawnSync(pythonCommand, ['-c', 'from PIL import Image; assert Image.registered_extensions().get(".webp") == "WEBP"'], { encoding: 'utf8' })
const usePython = Boolean(encoder.error || encoder.status !== 0)
if (usePython && (python.error || python.status !== 0)) {
  const env = '.cache/image-encoder'
  const setup = spawnSync('python3', ['-m', 'venv', env], { stdio: 'inherit' })
  if (setup.status === 0) {
    pythonCommand = join(env, 'bin', 'python')
    const install = spawnSync(pythonCommand, ['-m', 'pip', 'install', '--disable-pip-version-check', 'Pillow==11.3.0'], { stdio: 'inherit' })
    if (install.status === 0) python = spawnSync(pythonCommand, ['-c', 'from PIL import Image; assert Image.registered_extensions().get(".webp") == "WEBP"'])
  }
}
if (usePython && (python.error || python.status !== 0)) {
  console.warn('No WebP encoder available; using original fleet photos')
  await writeFile('src/features/vehicle-type/imageVariants.json', '{}\n')
  process.exit(0)
}
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
    const result = usePython
      ? spawnSync(pythonCommand, ['-c', 'from PIL import Image; import sys; im=Image.open(sys.argv[1]); w=int(sys.argv[3]); im.resize((w, max(1, round(im.height*w/im.width))), Image.Resampling.LANCZOS).save(sys.argv[2], "WEBP", quality=82, method=6)', source, target, String(width)], { stdio: 'inherit' })
      : spawnSync('cwebp', ['-quiet', '-q', '82', '-resize', String(width), '0', source, '-o', target], { stdio: 'inherit' })
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
