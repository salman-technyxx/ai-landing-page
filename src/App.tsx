import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { Contact } from './components/sections/Contact'
import { FeatureTabs } from './components/sections/FeatureTabs'
import { Features } from './components/sections/Features'
import { Hero } from './components/sections/Hero'
import { LogoStrip } from './components/sections/LogoStrip'
import { Pricing } from './components/sections/Pricing'
import { Testimonials } from './components/sections/Testimonials'

function App() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <LogoStrip />
        <Features />
        <FeatureTabs />
        <Testimonials />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
