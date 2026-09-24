import { FiMoon, FiSun } from 'react-icons/fi'
import { useTheme } from '../hooks/useTheme'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <button
      type="button"
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        toggle({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
      }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="grid h-9 w-9 place-items-center rounded-full border transition-colors hover:border-[var(--accent)]"
      style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
    >
      {theme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
    </button>
  )
}
