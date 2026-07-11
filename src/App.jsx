import { Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { DataProvider } from './context/DataContext'
import { ToastProvider } from './context/ToastContext'
import ErrorBoundary from './components/ui/ErrorBoundary'
import Navbar from './components/layout/Navbar'
import BottomNav from './components/layout/BottomNav'
import Footer from './components/layout/Footer'
import FloatingWhatsApp from './components/layout/FloatingWhatsApp'
import ScrollToTopBtn from './components/layout/ScrollToTop'
import ScrollProgress from './components/layout/ScrollProgress'
import LoadingScreen from './components/layout/LoadingScreen'
import StructuredData from './components/seo/JsonLd'

const Admin = lazy(() => import('./pages/Admin'))
const Home = lazy(() => import('./pages/Home'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const NotFound = lazy(() => import('./pages/NotFound'))

const pageFallback = (
  <div className="min-h-screen bg-dark flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-honda-red border-t-transparent rounded-full animate-spin" />
  </div>
)

export default function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash
      if (hash) {
        const id = hash.substring(1)
        setTimeout(() => {
          const el = document.getElementById(id)
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    }
    handleHashScroll()
    window.addEventListener('hashchange', handleHashScroll)
    return () => window.removeEventListener('hashchange', handleHashScroll)
  }, [])

  return (
    <ErrorBoundary>
      <DataProvider>
        <ToastProvider>
          <StructuredData />
          <LoadingScreen />
          {!isAdmin && <ScrollProgress />}
          <Routes>
            <Route path="/admin/*" element={<Suspense fallback={pageFallback}><Admin /></Suspense>} />
            <Route path="*" element={
              <>
                <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-honda-red focus:text-white focus:rounded-lg focus:text-sm focus:font-semibold">
                  Langsung ke konten utama
                </a>
                <Navbar />
                <BottomNav />
                <AnimatePresence mode="wait">
                  <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<Suspense fallback={pageFallback}><Home /></Suspense>} />
                    <Route path="/produk/:id" element={<Suspense fallback={pageFallback}><ProductDetail /></Suspense>} />
                    <Route path="*" element={<Suspense fallback={pageFallback}><NotFound /></Suspense>} />
                  </Routes>
                </AnimatePresence>
                <Footer />
                <FloatingWhatsApp />
                <ScrollToTopBtn />
              </>
            } />
          </Routes>
        </ToastProvider>
      </DataProvider>
    </ErrorBoundary>
  )
}
