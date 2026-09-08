import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { WhatsAppFloat } from '../components/layout/WhatsAppFloat'
import { BackToTop, ScrollProgressBar } from '../components/layout/ScrollChrome'
import { Hero } from '../components/sections/Hero/Hero'
import { TechStrip } from '../components/sections/TechStrip'
import { About } from '../components/sections/About/About'
import { CaseStudies } from '../components/sections/CaseStudies/CaseStudies'
import { BlogSection } from '../components/sections/Blog/BlogSection'
import { usePrerenderReady } from '../hooks/usePrerenderReady'
import { useScrollToHash } from '../hooks/useScrollToHash'

export function Home() {
  usePrerenderReady()
  useScrollToHash()

  return (
    <>
      <ScrollProgressBar />
      <Header />
      <main>
        <Hero />
        <TechStrip />
        <About />
        <CaseStudies />
        <BlogSection />
      </main>
      <Footer />
      <WhatsAppFloat />
      <BackToTop />
    </>
  )
}
