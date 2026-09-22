export function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden no-print" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)',
        }}
      />
      <div
        className="absolute -top-40 left-1/2 h-[560px] w-[820px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: 'var(--accent-soft)' }}
      />
      <div
        className="absolute top-[40vh] -right-40 h-[420px] w-[420px] rounded-full blur-3xl"
        style={{ background: 'var(--accent-2-soft)' }}
      />
    </div>
  )
}
