import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiGrid, FiPackage, FiGift, FiMessageSquare, FiImage, FiHelpCircle, FiUser, FiHome, FiLogOut, FiStar, FiSettings, FiMenu, FiX, FiNavigation, FiMapPin, FiAlertTriangle } from 'react-icons/fi'
import { useData } from '../../context/DataContext'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: FiGrid },
  { label: 'Hero', href: '/admin/hero', icon: FiHome },
  { label: 'Navbar', href: '/admin/navbar', icon: FiNavigation },
  { label: 'Produk', href: '/admin/produk', icon: FiPackage },
  { label: 'Promo', href: '/admin/promo', icon: FiGift },
  { label: 'Testimoni', href: '/admin/testimoni', icon: FiMessageSquare },
  { label: 'Galeri', href: '/admin/galeri', icon: FiImage },
  { label: 'FAQ', href: '/admin/faq', icon: FiHelpCircle },
  { label: 'Profil Sales', href: '/admin/profil', icon: FiUser },
  { label: 'Keunggulan', href: '/admin/keunggulan', icon: FiStar },
  { label: 'Kontak', href: '/admin/kontak', icon: FiMapPin },
]

const mobileNavItems = navItems.slice(0, 6)

export default function AdminLayout({ children }) {
  const location = useLocation()
  const [showSidebar, setShowSidebar] = useState(false)

  const { saveError } = useData()

  const isActive = (href) => {
    if (href === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 lg:translate-x-0 lg:relative lg:flex flex-col ${
        showSidebar ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-honda-red rounded-lg flex items-center justify-center">
              <FiSettings className="text-white" size={16} />
            </div>
            <span className="font-poppins font-bold text-gray-900 dark:text-white">CMS Panel</span>
          </Link>
          <button onClick={() => setShowSidebar(false)} className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <FiX size={18} className="text-gray-500" />
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setShowSidebar(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive(item.href)
                  ? 'bg-honda-red/10 text-honda-red'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <Link
            to="/"
            onClick={() => setShowSidebar(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          >
            <FiLogOut size={18} />
            Kembali ke Website
          </Link>
        </div>
      </aside>

      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 lg:ml-0 pb-16 lg:pb-0">
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSidebar(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Buka menu"
              >
                <FiMenu size={20} className="text-gray-600 dark:text-gray-300" />
              </button>
              <h1 className="font-poppins font-bold text-base sm:text-lg text-gray-900 dark:text-white truncate">
                {navItems.find(n => isActive(n.href))?.label || 'Dashboard'}
              </h1>
            </div>
            <Link
              to="/"
              className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-honda-red transition-colors flex-shrink-0"
            >
              Lihat Website &rarr;
            </Link>
          </div>
        </header>

        {saveError && (
          <div className="bg-red-500 text-white text-xs sm:text-sm px-4 sm:px-6 py-2.5 flex items-center gap-2">
            <FiAlertTriangle size={14} className="flex-shrink-0" />
            <span>{saveError}</span>
          </div>
        )}
        <main className="flex-1 p-3 sm:p-4 md:p-6 pb-20 lg:pb-6">
          {children}
        </main>

        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-1 safe-area-bottom">
          <div className="flex items-center justify-around max-w-lg mx-auto">
            {mobileNavItems.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex flex-col items-center py-2 px-2 min-w-0 ${
                    active ? 'text-honda-red' : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  <item.icon size={20} />
                  <span className={`text-[10px] mt-0.5 truncate max-w-full ${active ? 'font-semibold' : ''}`}>
                    {item.label}
                  </span>
                </Link>
              )
            })}
            <button
              onClick={() => setShowSidebar(true)}
              className="flex flex-col items-center py-2 px-2 text-gray-400 dark:text-gray-500"
            >
              <FiMenu size={20} />
              <span className="text-[10px] mt-0.5">Lainnya</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  )
}
