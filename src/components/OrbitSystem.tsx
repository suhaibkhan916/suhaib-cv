import { tech, type TechIcon, type TechKey } from '../data/techIcons'
import { Orbits3D, type BodyDef, type OrbitDef } from './Orbits3D'

export function Chip({ t, glow = true }: { t: TechIcon; glow?: boolean }) {
  const Icon = t.icon
  return (
    <div
      className="grid h-full w-full place-items-center rounded-full border"
      style={{
        background: 'color-mix(in srgb, var(--bg-elevated) 86%, transparent)',
        borderColor: `color-mix(in srgb, ${t.color} 50%, var(--border))`,
        color: t.color,
        boxShadow: glow ? `0 0 12px -2px ${t.color}88` : undefined,
        backdropFilter: 'blur(2px)',
      }}
      title={t.name}
    >
      <Icon style={{ width: '56%', height: '56%' }} />
    </div>
  )
}

export function Sparkle() {
  return (
    <svg viewBox="-10 -10 20 20" className="h-full w-full" style={{ filter: 'drop-shadow(0 0 3px var(--accent))' }}>
      <path d="M0 -9 L1.6 -1.6 L9 0 L1.6 1.6 L0 9 L-1.6 1.6 L-9 0 L-1.6 -1.6Z" fill="var(--accent-strong)" />
    </svg>
  )
}

export function Earth() {
  return (
    <div className="earth">
      <div className="earth-clouds" />
    </div>
  )
}

const chip = (key: TechKey) => <Chip t={tech[key]} />

const orbits: OrbitDef[] = [
  { r: 0.7, tilt: 19, roll: -16, speed: 0.5 },
  { r: 0.8, tilt: 23, roll: 28, speed: -0.36, dashed: true },
  { r: 0.9, tilt: 17, roll: -46, speed: 0.26 },
  { r: 0.93, tilt: 26, roll: 66, speed: -0.19, dashed: true },
]

const ICON = 0.16

const bodies: BodyDef[] = [
  { key: 'python', orbit: 0, phase: 0, size: ICON, node: chip('python') },
  { key: 'linux', orbit: 0, phase: 3.14, size: ICON, node: chip('linux') },
  { key: 's0', orbit: 0, phase: 1.6, size: 0.07, node: <Sparkle />, hideBelow: 300 },

  { key: 'docker', orbit: 1, phase: 0.4, size: ICON, node: chip('docker') },
  { key: 'k8s', orbit: 1, phase: 2.5, size: ICON, node: chip('kubernetes'), hideBelow: 300 },
  { key: 'azure', orbit: 1, phase: 4.6, size: ICON, node: chip('azure') },
  { key: 's1', orbit: 1, phase: 5.7, size: 0.06, node: <Sparkle /> },

  { key: 'earth', orbit: 2, phase: 1.1, size: 0.25, node: <Earth /> },
  { key: 'moon', orbit: 2, phase: 0, size: 0.06, node: <div className="moon" />, satellite: { parent: 'earth', r: 0.2, speed: 2.4, tilt: 32 } },
  { key: 's2', orbit: 2, phase: 4.1, size: 0.07, node: <Sparkle /> },
  { key: 's3', orbit: 2, phase: 5.5, size: 0.05, node: <Sparkle />, hideBelow: 300 },

  { key: 'react', orbit: 3, phase: 0.2, size: ICON, node: chip('react') },
  { key: 'ts', orbit: 3, phase: 1.9, size: ICON, node: chip('typescript') },
  { key: 'git', orbit: 3, phase: 3.4, size: ICON, node: chip('git'), hideBelow: 300 },
  { key: 'tf', orbit: 3, phase: 4.9, size: ICON, node: chip('terraform'), hideBelow: 300 },
]

export function OrbitSystem() {
  return <Orbits3D orbits={orbits} bodies={bodies} className="absolute -inset-[40%]" ringOpacity={0.4} />
}
