import { Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { DataProvider } from './context/DataContext'
import { ToastProvider } from './context/ToastContext'
import Navbar from './components/layout/Navbar'
import BottomNav from './components/layout/BottomNav'
import Footer from './components/layout/Footer'
import FloatingWhatsApp from './components/layout/FloatingWhatsApp'
import ScrollToTopBtn from './components/layout/ScrollToTop'
import ScrollProgress from './components/layout/ScrollProgress'
import LoadingScreen from './components/layout/LoadingScreen'
import StructuredData from './components/seo/JsonLd'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import NotFound from './pages/NotFound'

const Admin = lazy(() => import('./pages/Admin'))

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
    <DataProvider>
      <ToastProvider>
        <StructuredData />
        <LoadingScreen />
        {!isAdmin && <ScrollProgress />}
        <Routes>
          <Route path="/admin/*" element={<Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"><div className="w-8 h-8 border-2 border-honda-red border-t-transparent rounded-full animate-spin" /></div>}><Admin /></Suspense>} />
          <Route path="*" element={
            <>
              <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-honda-red focus:text-white focus:rounded-lg focus:text-sm focus:font-semibold">
                Langsung ke konten utama
              </a>
              <Navbar />
              <BottomNav />
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<Home />} />
                  <Route path="/produk/:id" element={<ProductDetail />} />
                  <Route path="*" element={<NotFound />} />
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
  )
}
