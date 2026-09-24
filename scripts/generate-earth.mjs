import sharp from 'sharp'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')

const W = 1024
const H = 512

const hash = (x, y, z) => {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 2246822519)
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  h ^= h >>> 16
  return (h >>> 0) / 4294967296
}

const smooth = (t) => t * t * (3 - 2 * t)
const lerp = (a, b, t) => a + (b - a) * t

function vnoise(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z)
  const u = smooth(x - xi), v = smooth(y - yi), w = smooth(z - zi)
  const c = (dx, dy, dz) => hash(xi + dx, yi + dy, zi + dz)
  return lerp(
    lerp(lerp(c(0, 0, 0), c(1, 0, 0), u), lerp(c(0, 1, 0), c(1, 1, 0), u), v),
    lerp(lerp(c(0, 0, 1), c(1, 0, 1), u), lerp(c(0, 1, 1), c(1, 1, 1), u), v),
    w,
  )
}

function fbm(x, y, z, octaves) {
  let amp = 0.5, freq = 1, sum = 0, norm = 0
  for (let i = 0; i < octaves; i++) {
    sum += amp * vnoise(x * freq, y * freq, z * freq)
    norm += amp
    amp *= 0.5
    freq *= 2.03
  }
  return sum / norm
}

const mix = (a, b, t) => a.map((c, i) => c + (b[i] - c) * Math.min(1, Math.max(0, t)))
const hex = (h) => [(h >> 16) & 255, (h >> 8) & 255, h & 255]
const step = (a, b, x) => smooth(Math.min(1, Math.max(0, (x - a) / (b - a))))

const elevation = new Float32Array(W * H)
const coords = new Float32Array(W * H * 3)

for (let j = 0; j < H; j++) {
  const lat = (0.5 - (j + 0.5) / H) * Math.PI
  for (let i = 0; i < W; i++) {
    const lon = ((i + 0.5) / W) * Math.PI * 2 - Math.PI
    const x = Math.cos(lat) * Math.cos(lon)
    const y = Math.sin(lat)
    const z = Math.cos(lat) * Math.sin(lon)
    const idx = j * W + i
    coords[idx * 3] = x
    coords[idx * 3 + 1] = y
    coords[idx * 3 + 2] = z
    const wx = fbm(x * 1.4 + 7.1, y * 1.4, z * 1.4, 3)
    const wy = fbm(x * 1.4, y * 1.4 + 3.3, z * 1.4, 3)
    elevation[idx] = fbm(x * 2.1 + wx * 1.1, y * 2.1 + wy * 1.1, z * 2.1, 6)
  }
}

const sorted = Float32Array.from(elevation).sort()
const sea = sorted[Math.floor(sorted.length * 0.7)]
const maxE = sorted[sorted.length - 1]

const earth = Buffer.alloc(W * H * 3)
const clouds = Buffer.alloc(W * H * 4)

const deep = hex(0x041a44)
const mid = hex(0x0b4a86)
const shallow = hex(0x2aa0b8)
const sand = hex(0xcdb87e)
const grass = hex(0x4e8a3c)
const forest = hex(0x22532a)
const desert = hex(0xc4a262)
const rock = hex(0x7d6f5e)
const snow = hex(0xf2f6f8)

for (let idx = 0; idx < W * H; idx++) {
  const x = coords[idx * 3], y = coords[idx * 3 + 1], z = coords[idx * 3 + 2]
  const e = elevation[idx]
  const lat = Math.asin(y)
  let col

  if (e < sea) {
    const d = (sea - e) / (sea - sorted[0] + 1e-6)
    col = mix(mix(shallow, mid, step(0, 0.35, d)), deep, step(0.3, 0.9, d))
  } else {
    const h = (e - sea) / (maxE - sea + 1e-6)
    const moisture = fbm(x * 3.2 + 11, y * 3.2, z * 3.2, 4)
    const dryness = step(0.42, 0.58, 1 - moisture) * (1 - Math.abs(y) * 0.6)
    let land = mix(forest, grass, step(0.4, 0.6, moisture))
    land = mix(land, desert, dryness)
    land = mix(sand, land, step(0.0, 0.06, h))
    land = mix(land, rock, step(0.55, 0.78, h))
    land = mix(land, snow, step(0.8, 0.95, h))
    col = land
  }

  const ice = step(1.12, 1.3, Math.abs(lat) + (fbm(x * 5, y * 5, z * 5, 3) - 0.5) * 0.35)
  col = mix(col, snow, ice)

  earth[idx * 3] = col[0]
  earth[idx * 3 + 1] = col[1]
  earth[idx * 3 + 2] = col[2]

  const c = fbm(x * 3.1 + 21, y * 3.6, z * 3.1, 5)
  const a = step(0.52, 0.74, c) * 0.9
  clouds[idx * 4] = 255
  clouds[idx * 4 + 1] = 255
  clouds[idx * 4 + 2] = 255
  clouds[idx * 4 + 3] = Math.round(a * 255)
}

await sharp(earth, { raw: { width: W, height: H, channels: 3 } }).webp({ quality: 84 }).toFile(join(publicDir, 'earth.webp'))
await sharp(clouds, { raw: { width: W, height: H, channels: 4 } }).webp({ quality: 80, alphaQuality: 80 }).toFile(join(publicDir, 'clouds.webp'))

console.log('Wrote earth.webp and clouds.webp')
