import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { BackToTop } from '../components/layout/ScrollChrome'
import { Hero } from '../components/sections/Hero/Hero'
import { TechStrip } from '../components/sections/TechStrip'
import { About } from '../components/sections/About/About'
import { Services } from '../components/sections/Services/Services'
import { CaseStudies } from '../components/sections/CaseStudies/CaseStudies'
import { Skills } from '../components/sections/Skills/Skills'
import { Experience } from '../components/sections/Experience/Experience'
import { Certifications } from '../components/sections/Certifications/Certifications'
import { BlogSection } from '../components/sections/Blog/BlogSection'
import { Speaking } from '../components/sections/Speaking/Speaking'
import { Testimonials } from '../components/sections/Testimonials/Testimonials'
import { Contact } from '../components/sections/Contact/Contact'
import { usePrerenderReady } from '../hooks/usePrerenderReady'
import { useScrollToHash } from '../hooks/useScrollToHash'

export function Home() {
  usePrerenderReady()
  useScrollToHash()

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <TechStrip />
        <About />
        <Services />
        <CaseStudies />
        <Skills />
        <Experience />
        <Certifications />
        <BlogSection />
        <Speaking />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
