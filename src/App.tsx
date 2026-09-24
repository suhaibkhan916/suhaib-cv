import { useEffect } from 'react'
import { About } from './components/About'
import { Background } from './components/Background'
import { CommandPalette } from './components/CommandPalette'
import { Contact } from './components/Contact'
import { Education } from './components/Education'
import { Experience } from './components/Experience'
import { Hero } from './components/Hero'
import { Nav } from './components/Nav'
import { Publications } from './components/Publications'
import { ScrollProgress } from './components/ScrollProgress'
import { Skills } from './components/Skills'
import { TechMarquee } from './components/TechMarquee'

function App() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const card = (e.target as HTMLElement | null)?.closest<HTMLElement>('.spotlight')
      if (!card) return
      const rect = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`)
      card.style.setProperty('--my', `${e.clientY - rect.top}px`)
    }
    document.addEventListener('pointermove', onMove)
    return () => document.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <>
      <div className="grain no-print" aria-hidden="true" />
      <CommandPalette />
      <Background />
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <TechMarquee />
        <About />
        <Skills />
        <Experience />
        <Publications />
        <Education />
        <Contact />
      </main>
    </>
  )
}

export default App
