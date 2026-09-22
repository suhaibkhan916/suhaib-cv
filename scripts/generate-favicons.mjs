import sharp from 'sharp'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')
const svg = readFileSync(join(publicDir, 'favicon.svg'))

await sharp(svg, { density: 384 }).resize(180, 180).png().toFile(join(publicDir, 'apple-touch-icon.png'))
await sharp(svg, { density: 384 }).resize(32, 32).png().toFile(join(publicDir, 'favicon-32.png'))

console.log('Wrote apple-touch-icon.png and favicon-32.png')
