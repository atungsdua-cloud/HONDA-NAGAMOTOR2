import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenu, HiX } from 'react-icons/hi'
import { FiSun, FiMoon } from 'react-icons/fi'
import { useScrollPosition } from '../../hooks/useScrollPosition'
import { getWhatsAppLink } from '../../utils/whatsapp'
import { useData } from '../../context/DataContext'

export default function Navbar() {
  const { data } = useData()
  const { navbar } = data
  const defaultMenu = [
    { label: 'Beranda', section: '' },
    { label: 'Produk', section: 'produk' },
    { label: 'Promo', section: 'promo' },
    { label: 'Testimoni', section: 'testimoni' },
    { label: 'Kontak', section: 'kontak' },
  ]
  const menuItems = navbar?.menuItems?.length ? navbar.menuItems : defaultMenu
  const logoImage = navbar?.logoImage || ''
  const logoText = navbar?.logoText === '' ? '' : (navbar?.logoText || 'HONDA')
  const logoSubtext = navbar?.logoSubtext === '' ? '' : (navbar?.logoSubtext || 'Nagamotor')
  const ctaText = navbar?.ctaText || 'Hubungi Saya'
  const ctaUrl = navbar?.ctaUrl || getWhatsAppLink()

  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const { scrollY } = useScrollPosition()
  const location = useLocation()
  const navigate = useNavigate()

  const toggleDark = () => {
    document.documentElement.classList.toggle('dark')
    setIsDark(!isDark)
  }

  useEffect(() => {
    setScrolled(scrollY > 50)
  }, [scrollY])

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location])

  const handleNavClick = (e, section) => {
    if (!section) {
      if (location.pathname !== '/') navigate('/')
      return
    }
    e.preventDefault()
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const el = document.getElementById(section)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
      return
    }
    const el = document.getElementById(section)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      className={`hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? isDark
            ? 'bg-gray-900/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
            : 'bg-white/70 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.08)]'
          : 'bg-gradient-to-b from-black/40 to-transparent'
      }`}
    >
      {scrolled && (
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-honda-red/50 to-transparent" />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2"
            >
              {logoImage ? (
                <img
                  src={logoImage}
                  alt={logoText}
                  className="h-10 sm:h-11 w-auto object-contain"
                />
              ) : (
                <div className="relative">
                  <svg viewBox="0 0 40 40" className="w-9 h-9">
                    <defs>
                      <linearGradient id="hondaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#E40521" />
                        <stop offset="100%" stopColor="#ff3344" />
                      </linearGradient>
                      <filter id="logoGlow">
                        <feGaussianBlur stdDeviation="1" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <circle cx="20" cy="20" r="18" fill="none" stroke="url(#hondaGrad)" strokeWidth="1.5" opacity="0.3" />
                    <text x="20" y="20" textAnchor="middle" dominantBaseline="central" fontFamily="Poppins, sans-serif" fontWeight="800" fontSize="7" fill="url(#hondaGrad)" filter="url(#logoGlow)">H</text>
                  </svg>
                </div>
              )}
              <div className="flex flex-col">
                <span className={`text-lg font-black tracking-[0.15em] leading-none transition-colors duration-500 ${
                  scrolled ? (isDark ? 'text-white' : 'text-gray-900') : 'text-white'
                }`}>
                  {logoText}
                </span>
                <span className={`text-[9px] tracking-[0.3em] uppercase leading-tight transition-colors duration-500 ${
                  scrolled ? (isDark ? 'text-gray-400' : 'text-gray-500') : 'text-white/60'
                }`}>
                  {logoSubtext}
                </span>
              </div>
            </motion.div>
          </Link>

          <div className="hidden lg:flex items-center gap-0.5">
            {menuItems.map((item) => {
              const isActive = !item.section
                ? location.pathname === '/'
                : location.hash === `#${item.section}` && location.pathname === '/'
              return (
                <a
                  key={item.label}
                  href={item.section ? `/#${item.section}` : '/'}
                  onClick={(e) => handleNavClick(e, item.section)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 group ${
                    scrolled ? (isDark ? 'text-gray-300' : 'text-gray-600') : 'text-white/90'
                  } ${isActive ? 'text-honda-red' : ''}`}
                >
                  {item.label}
                  <span className={`absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full transition-all duration-300 origin-left ${
                    isActive
                      ? 'bg-honda-red scale-x-100'
                      : 'bg-honda-red/0 scale-x-0 group-hover:scale-x-100 group-hover:bg-honda-red/50'
                  }`} />
                </a>
              )
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleDark}
              className={`p-2.5 rounded-full transition-all duration-300 ${
                scrolled ? (isDark ? 'text-yellow-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100') : 'text-white/80 hover:bg-white/10'
              }`}
              aria-label="Toggle dark mode"
            >
              {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group ${
                scrolled
                  ? 'bg-honda-red text-white hover:bg-red-700'
                  : 'bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20'
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                {ctaText}
              </span>
            </motion.a>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`hidden p-2 rounded-lg transition-colors ${
                scrolled ? (isDark ? 'text-white hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100') : 'text-white/80 hover:bg-white/10'
              }`}
              aria-label="Toggle menu"
            >
              {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`lg:hidden border-t ${
              isDark
                ? 'bg-gray-900/95 backdrop-blur-xl border-gray-800'
                : 'bg-white/95 backdrop-blur-xl border-gray-100'
            }`}
          >
            <div className="px-4 py-6 space-y-1">
              {menuItems.map((item, i) => (
                <motion.a
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={item.label}
                  href={item.section ? `/#${item.section}` : '/'}
                  onClick={(e) => { handleNavClick(e, item.section); setIsOpen(false) }}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isDark
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </motion.a>
              ))}
              <motion.a
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: menuItems.length * 0.05 }}
                href={ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 mt-6 px-5 py-3.5 bg-honda-red text-white rounded-xl text-sm font-semibold shadow-lg hover:bg-red-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                {ctaText}
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
