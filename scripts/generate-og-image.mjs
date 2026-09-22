import sharp from 'sharp'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outPath = join(__dirname, '..', 'public', 'og-image.png')

const W = 1200
const H = 630

const gridLines = []
for (let x = 0; x <= W; x += 48) {
  gridLines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="#1e293b" stroke-width="1" />`)
}
for (let y = 0; y <= H; y += 48) {
  gridLines.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#1e293b" stroke-width="1" />`)
}

const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="fade" cx="50%" cy="0%" r="75%">
      <stop offset="40%" stop-color="black" stop-opacity="1" />
      <stop offset="100%" stop-color="black" stop-opacity="0" />
    </radialGradient>
    <mask id="gridMask">
      <rect width="${W}" height="${H}" fill="url(#fade)" />
    </mask>
    <radialGradient id="blobCyan" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#22d3ee" stop-opacity="0.30" />
      <stop offset="100%" stop-color="#22d3ee" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="blobViolet" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#a78bfa" stop-opacity="0.28" />
      <stop offset="100%" stop-color="#a78bfa" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="accentLine" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#22d3ee" />
      <stop offset="100%" stop-color="#a78bfa" />
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="#060a14" />
  <g mask="url(#gridMask)">${gridLines.join('')}</g>
  <circle cx="150" cy="60" r="260" fill="url(#blobCyan)" />
  <circle cx="1080" cy="520" r="260" fill="url(#blobViolet)" />

  <rect x="0" y="0" width="${W}" height="6" fill="url(#accentLine)" />

  <circle cx="1000" cy="175" r="88" fill="#101828" stroke="#22d3ee" stroke-width="3" />
  <text x="1000" y="196" font-family="Space Grotesk, Arial, sans-serif" font-size="52" font-weight="700" fill="#22d3ee" text-anchor="middle">MS</text>

  <rect x="90" y="120" width="392" height="40" rx="20" fill="none" stroke="#1e293b" stroke-width="1.5" />
  <circle cx="115" cy="140" r="5" fill="#22d3ee" />
  <text x="132" y="146" font-family="JetBrains Mono, monospace" font-size="16" fill="#8b98ac">Bristol, UK &#183; Open to relocation</text>

  <text x="88" y="270" font-family="Space Grotesk, Arial, sans-serif" font-size="74" font-weight="700" fill="#e2e8f0">Muhammad Suhaib</text>
  <text x="90" y="320" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="500" fill="#8b98ac">Software Engineer</text>

  <text x="90" y="380" font-family="JetBrains Mono, monospace" font-size="20" fill="#57667c">$ building &#8594; <tspan fill="#22d3ee">Python &#183; Django &#183; Azure &#183; AWS &#183; Kubernetes</tspan></text>

  <text x="90" y="560" font-family="Inter, Arial, sans-serif" font-size="22" fill="#57667c" letter-spacing="1">muhammadsuhaib.com</text>
</svg>
`

mkdirSync(dirname(outPath), { recursive: true })

await sharp(Buffer.from(svg)).png().toFile(outPath)

console.log('Wrote', outPath)
