import useSEO from '../hooks/useSEO'
import PageTransition from '../components/layout/PageTransition'
import { useData } from '../context/DataContext'
import { HeroSkeleton, ProductCardSkeleton, TestimoniSkeleton } from '../components/ui/Skeleton'
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
  const { loading } = useData()
  useSEO({
    title: 'Dealer Resmi Honda',
    description: 'Temukan Honda Impian Anda. Promo terbaik, DP ringan, proses cepat, dan pelayanan profesional dari sales berpengalaman.',
  })

  if (loading) {
    return (
      <PageTransition>
        <main id="main-content">
          <HeroSkeleton />
          <section className="py-20 lg:py-28 bg-light dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                {[...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            </div>
          </section>
          <section className="py-20 lg:py-28 bg-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden h-64 sm:h-72 bg-gray-800 animate-pulse" />
                ))}
              </div>
            </div>
          </section>
          <section className="py-20 lg:py-28 bg-light dark:bg-gray-900">
            <div className="max-w-3xl mx-auto px-4">
              <TestimoniSkeleton />
            </div>
          </section>
        </main>
      </PageTransition>
    )
  }

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
