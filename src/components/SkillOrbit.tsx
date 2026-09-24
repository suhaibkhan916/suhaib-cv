import { tech, type TechKey } from '../data/techIcons'
import { Chip } from './OrbitSystem'
import { Orbits3D, type BodyDef, type OrbitDef } from './Orbits3D'

const orbits: OrbitDef[] = [
  { r: 0.36, tilt: 50, roll: -20, speed: 0.34 },
  { r: 0.56, tilt: 42, roll: 26, speed: -0.24, dashed: true },
  { r: 0.76, tilt: 36, roll: -42, speed: 0.16 },
  { r: 0.94, tilt: 30, roll: 58, speed: -0.11, dashed: true },
]

const layout: [TechKey, number, number][] = [
  ['python', 0, 0],
  ['linux', 0, 3.14],
  ['bash', 1, 1.0],
  ['docker', 1, 3.0],
  ['git', 1, 5.1],
  ['azure', 2, 0.5],
  ['kubernetes', 2, 1.9],
  ['terraform', 2, 3.3],
  ['gcp', 2, 4.7],
  ['react', 3, 0.3],
  ['typescript', 3, 1.4],
  ['django', 3, 2.5],
  ['postgres', 3, 3.6],
  ['claude', 3, 4.6],
  ['tryhackme', 3, 5.6],
]

const bodies: BodyDef[] = layout.map(([key, orbit, phase]) => ({
  key,
  orbit,
  phase,
  size: 0.085,
  node: <Chip t={tech[key]} glow={false} />,
}))

function StarMap() {
  const ticks = Array.from({ length: 72 }, (_, i) => i)
  return (
    <svg viewBox="-100 -100 200 200" className="absolute inset-0 h-full w-full" style={{ animation: 'starmap-spin 420s linear infinite' }}>
      {[98, 84, 68, 50, 32].map((r, i) => (
        <circle
          key={r}
          r={r}
          fill="none"
          stroke="var(--border-strong)"
          strokeWidth="0.35"
          strokeDasharray={i % 2 ? '1 2.4' : undefined}
          opacity="0.7"
        />
      ))}
      {ticks.map((i) => {
        const long = i % 6 === 0
        return (
          <line
            key={i}
            y1={-98}
            y2={long ? -93.5 : -96}
            transform={`rotate(${i * 5})`}
            stroke="var(--text-faint)"
            strokeWidth={long ? 0.5 : 0.3}
            opacity="0.8"
          />
        )
      })}
      <line x1="-98" x2="98" stroke="var(--border-strong)" strokeWidth="0.3" opacity="0.7" />
      <line y1="-98" y2="98" stroke="var(--border-strong)" strokeWidth="0.3" opacity="0.7" />
      {['000', '090', '180', '270'].map((label, i) => (
        <text
          key={label}
          transform={`rotate(${i * 90}) translate(0 -90)`}
          textAnchor="middle"
          fontSize="3"
          fontFamily="var(--font-mono)"
          fill="var(--text-faint)"
        >
          {label}°
        </text>
      ))}
    </svg>
  )
}

export function SkillOrbit() {
  return (
    <div
      className="no-print pointer-events-none absolute"
      style={{
        right: '-24vmin',
        bottom: '-26vmin',
        width: '112vmin',
        height: '112vmin',
        opacity: 0.6,
        maskImage: 'radial-gradient(circle at 50% 50%, black 55%, transparent 78%)',
        WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 55%, transparent 78%)',
      }}
      aria-hidden="true"
    >
      <StarMap />
      <Orbits3D orbits={orbits} bodies={bodies} className="absolute inset-0" ringOpacity={0.3} minOpacity={0.45} />
    </div>
  )
}
