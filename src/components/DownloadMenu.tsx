import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FiAlertCircle, FiChevronDown, FiDownload, FiLoader } from 'react-icons/fi'
import { cvOptions, downloadCv, type CvVariant } from '../cv/generate'

export function useCvDownload() {
  const [busy, setBusy] = useState<CvVariant | null>(null)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(async (variant: CvVariant) => {
    setBusy(variant)
    setError(null)
    try {
      await downloadCv(variant)
    } catch (e) {
      console.error(e)
      setError('Could not generate the PDF. Please try again.')
    } finally {
      setBusy(null)
    }
  }, [])

  return { busy, error, run }
}

export function DownloadMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { busy, error, run } = useCvDownload()

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-mono text-[13px] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
        style={{ borderColor: open ? 'var(--accent)' : 'var(--border)', color: open ? 'var(--accent)' : 'var(--text-muted)' }}
      >
        <FiDownload size={13} /> CV
        <FiChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl border p-1.5"
            style={{ borderColor: 'var(--border-strong)', background: 'var(--bg-elevated)', boxShadow: '0 24px 60px -18px rgba(0,0,0,0.55)' }}
          >
            <p className="px-3 pb-1 pt-2 font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>
              Download CV (PDF)
            </p>
            {cvOptions.map((o) => (
              <button
                key={o.id}
                type="button"
                role="menuitem"
                disabled={busy !== null}
                onClick={() => run(o.id)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-[var(--accent-soft)] disabled:opacity-60"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium" style={{ color: 'var(--text)' }}>
                    {o.label}
                  </span>
                  <span className="block text-xs" style={{ color: 'var(--text-faint)' }}>
                    {o.description}
                  </span>
                </span>
                {busy === o.id ? (
                  <FiLoader size={15} className="animate-spin" style={{ color: 'var(--accent)' }} />
                ) : (
                  <FiDownload size={15} style={{ color: 'var(--text-faint)' }} />
                )}
              </button>
            ))}
            {error && (
              <p className="flex items-center gap-2 px-3 py-2 text-xs" style={{ color: '#fb7185' }}>
                <FiAlertCircle size={13} /> {error}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function DownloadList({ onDone }: { onDone?: () => void }) {
  const { busy, error, run } = useCvDownload()
  return (
    <div className="mt-1 flex flex-col gap-1 border-t pt-2" style={{ borderColor: 'var(--border)' }}>
      <p className="px-3 font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>
        Download CV (PDF)
      </p>
      {cvOptions.map((o) => (
        <button
          key={o.id}
          type="button"
          disabled={busy !== null}
          onClick={async () => {
            await run(o.id)
            onDone?.()
          }}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-left font-mono text-sm disabled:opacity-60"
          style={{ color: 'var(--text-muted)' }}
        >
          {busy === o.id ? <FiLoader size={13} className="animate-spin" /> : <FiDownload size={13} />}
          {o.label}
        </button>
      ))}
      {error && (
        <p className="px-3 py-1 text-xs" style={{ color: '#fb7185' }}>
          {error}
        </p>
      )}
    </div>
  )
}
