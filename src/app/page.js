import PortfolioMotion from '@/components/PortfolioMotion'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Journey from '@/components/Journey'
import Projects from '@/components/Projects'
import Skills from '@/components/Skills'
import Certifications from '@/components/Certifications'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <Navbar />
    <main id="main" tabIndex={-1}>
      <PortfolioMotion /><Hero /><About /><Journey /><Projects /><Skills /><Certifications /><Contact />
    </main>
    <Footer />
  </>
}
