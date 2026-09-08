import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { WhatsAppFloat } from '../components/layout/WhatsAppFloat'
import { BackToTop, ScrollProgressBar } from '../components/layout/ScrollChrome'
import { Hero } from '../components/sections/Hero/Hero'
import { TechStrip } from '../components/sections/TechStrip'
import { About } from '../components/sections/About/About'
import { usePrerenderReady } from '../hooks/usePrerenderReady'

export function Home() {
  usePrerenderReady()

  return (
    <>
      <ScrollProgressBar />
      <Header />
      <main>
        <Hero />
        <TechStrip />
        <About />
      </main>
      <Footer />
      <WhatsAppFloat />
      <BackToTop />
    </>
  )
}
