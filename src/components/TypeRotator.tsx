import { useEffect, useState } from 'react'

interface TypeRotatorProps {
  words: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pause?: number
}

export function TypeRotator({ words, typingSpeed = 55, deletingSpeed = 28, pause = 1400 }: TypeRotatorProps) {
  const [wordIndex, setWordIndex] = useState(0)
  const [text, setText] = useState('')
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting'>('typing')

  useEffect(() => {
    const current = words[wordIndex % words.length]

    if (phase === 'typing') {
      if (text.length < current.length) {
        const t = setTimeout(() => setText(current.slice(0, text.length + 1)), typingSpeed)
        return () => clearTimeout(t)
      }
      const t = setTimeout(() => setPhase('pausing'), pause)
      return () => clearTimeout(t)
    }

    if (phase === 'pausing') {
      const t = setTimeout(() => setPhase('deleting'), pause / 3)
      return () => clearTimeout(t)
    }

    if (text.length > 0) {
      const t = setTimeout(() => setText(current.slice(0, text.length - 1)), deletingSpeed)
      return () => clearTimeout(t)
    }
    setPhase('typing')
    setWordIndex((i) => (i + 1) % words.length)
  }, [text, phase, wordIndex, words, typingSpeed, deletingSpeed, pause])

  return (
    <span className="font-mono" style={{ color: 'var(--accent)' }}>
      {text}
      <span className="animate-pulse">_</span>
    </span>
  )
}
