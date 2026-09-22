import { About } from './components/About'
import { Background } from './components/Background'
import { Contact } from './components/Contact'
import { Education } from './components/Education'
import { Experience } from './components/Experience'
import { Hero } from './components/Hero'
import { Nav } from './components/Nav'
import { Publications } from './components/Publications'
import { ScrollProgress } from './components/ScrollProgress'
import { Skills } from './components/Skills'

function App() {
  return (
    <>
      <Background />
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
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
