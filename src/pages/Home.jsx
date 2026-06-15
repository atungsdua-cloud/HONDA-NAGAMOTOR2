import useSEO from '../hooks/useSEO'
import PageTransition from '../components/layout/PageTransition'
import Hero from '../components/sections/Hero'
import Products from '../components/sections/Products'
import Promo from '../components/sections/Promo'
import Testimoni from '../components/sections/Testimoni'
import TentangSales from '../components/sections/TentangSales'
import Keunggulan from '../components/sections/Keunggulan'
import Galeri from '../components/sections/Galeri'
import FAQ from '../components/sections/FAQ'
import Contact from '../components/sections/Contact'

export default function Home() {
  useSEO({
    title: 'Dealer Resmi Honda',
    description: 'Temukan Honda Impian Anda. Promo terbaik, DP ringan, proses cepat, dan pelayanan profesional dari sales berpengalaman.',
  })

  return (
    <PageTransition>
      <main id="main-content">
        <Hero />
        <Products />
        <Promo />
        <Keunggulan />
        <Testimoni />
        <TentangSales />
        <Galeri />
        <FAQ />
        <Contact />
      </main>
    </PageTransition>
  )
}
