import { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHome, FiGrid, FiTag, FiStar, FiPhone } from 'react-icons/fi'
import { useData } from '../../context/DataContext'

const defaultTabs = [
  { label: 'Beranda', icon: FiHome, section: '' },
  { label: 'Produk', icon: FiGrid, section: 'produk' },
  { label: 'Promo', icon: FiTag, section: 'promo' },
  { label: 'Testimoni', icon: FiStar, section: 'testimoni' },
  { label: 'Kontak', icon: FiPhone, section: 'kontak' },
]

export default function BottomNav() {
  const { data } = useData()
  const { navbar } = data
  const menuItems = navbar?.menuItems || []
  const location = useLocation()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('')

  const isHome = location.pathname === '/'

  const tabs = menuItems.length > 0
    ? [
        { label: 'Beranda', icon: FiHome, section: '' },
        ...menuItems
          .filter(item => item.section)
          .map(item => {
            const iconMap = {
              'produk': FiGrid,
              'promo': FiTag,
              'testimoni': FiStar,
              'kontak': FiPhone,
              'tentang': FiHome,
            }
            return {
              label: item.label,
              icon: iconMap[item.section] || FiGrid,
              section: item.section,
            }
          }),
      ].slice(0, 5)
    : defaultTabs

  const handleTabClick = useCallback((section) => {
    if (!section) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const el = document.getElementById(section)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate(`/#${section}`)
    }
  }, [navigate])

  useEffect(() => {
    if (!isHome) return

    const sections = tabs.filter(t => t.section).map(t => t.section)
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id)
        }
      },
      { threshold: [0.1, 0.3, 0.5], rootMargin: '-80px 0px -40% 0px' }
    )

    sections.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    const handleScroll = () => {
      if (window.scrollY < 100) {
        setActiveSection('')
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isHome, tabs])

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50" />
      <div className="relative flex items-center justify-around pb-[env(safe-area-inset-bottom)]">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = tab.section === activeSection

          return (
            <motion.button
              key={tab.label}
              onClick={() => handleTabClick(tab.section)}
              whileTap={{ scale: 0.9 }}
              className="relative flex flex-col items-center gap-0.5 pt-2 pb-1 px-3 min-w-0 flex-1"
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  className="absolute -top-px left-1/4 right-1/4 h-0.5 bg-honda-red rounded-full"
                />
              )}
              <Icon
                size={20}
                className={`transition-colors duration-200 ${
                  isActive
                    ? 'text-honda-red'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors duration-200 leading-tight ${
                  isActive
                    ? 'text-honda-red'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {tab.label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </nav>
  )
}
