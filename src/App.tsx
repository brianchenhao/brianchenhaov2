import { Nav } from './components/Nav'
import { Hero } from './components/Hero/Hero'
import { About } from './components/About'
import { Skills } from './components/Skills'
import { Projects } from './components/Projects'
import { Experience } from './components/Experience'
import { Certifications } from './components/Certifications'
import { Extracurriculars } from './components/Extracurriculars'
import { References } from './components/References'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Certifications />
        <Extracurriculars />
        <References />
      </main>
      <Footer />
    </>
  )
}
