import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiChevronDown, FiShield, FiZap, FiClock } from 'react-icons/fi'
import { useData } from '../../context/DataContext'
import { getWhatsAppLink } from '../../utils/whatsapp'

export default function Hero() {
  const { data } = useData()
  const heroData = data.hero || {}
  const profile = data.profile || {}
  const stats = heroData.stats || []
  const title = heroData.title || 'Selamat Datang di Honda Nagamotor'
  const subtitle = heroData.subtitle || 'Promo terbaik, DP ringan, proses cepat, dan pelayanan profesional.'
  const heroImages = heroData.images?.length ? heroData.images : [
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1600&q=80',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1600&q=80',
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1600&q=80',
  ]

  const [currentImage, setCurrentImage] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const sectionRef = useRef(null)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.2])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 100])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [heroImages.length])

  useEffect(() => { setLoaded(true) }, [])

  const handleMouseMove = useCallback((e) => {
    if (!sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    })
  }, [])

  const titleLines = title.split(' ').reduce((acc, word, i) => {
    const last = acc[acc.length - 1]
    if (!last || last.length >= 4 || word.length + last.join(' ').length > 18) {
      acc.push([word])
    } else {
      last.push(word)
    }
    return acc
  }, [])

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-dvh flex items-center overflow-hidden bg-gray-950"
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(ellipse at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(228,5,33,0.15) 0%, transparent 60%),
            radial-gradient(ellipse at ${100 - mousePos.x * 100}% ${100 - mousePos.y * 100}%, rgba(59,130,246,0.08) 0%, transparent 50%)
          `,
          transition: 'background 0.8s ease-out',
        }}
      />

      {/* Background slider */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImage}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <motion.img
            src={heroImages[currentImage]}
            alt=""
            className="w-full h-full object-cover"
            style={{ scale: bgScale }}
            onError={(e) => { e.target.style.display = 'none' }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Accent edge light */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-honda-red/40 to-transparent z-10" />

      {/* Overlay layers */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-950/60 via-gray-950/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/40 to-transparent" />

      {/* Content */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-32"
      >
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 lg:gap-16">
          <div className="flex-1 max-w-2xl pt-4 lg:pt-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6 lg:mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-honda-red opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-honda-red" />
              </span>
              <span className="text-white/70 text-[10px] sm:text-xs tracking-[0.2em] uppercase font-medium">
                Dealer Resmi Honda
              </span>
            </motion.div>

            {/* Title with slide-up reveal */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-poppins font-black text-white leading-[1.15] mb-2">
              {titleLines.map((line, i) => (
                <div key={i} className="overflow-hidden mb-1.5">
                  <motion.span
                    initial={{ y: '100%' }}
                    animate={loaded ? { y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="inline-block"
                  >
                    {line.map((word, j) => (
                      <span key={j} className="inline-block mr-[0.3em]">
                        {word.toLowerCase() === 'honda' ? (
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-honda-red via-red-400 to-honda-red">
                            {word}
                          </span>
                        ) : word === 'Impian' ? (
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-orange-400">
                            {word}
                          </span>
                        ) : word === 'Aldi' ? (
                          <span className="text-honda-red">{word}</span>
                        ) : (
                          word
                        )}
                      </span>
                    ))}
                  </motion.span>
                </div>
              ))}
            </h1>

            {/* Animated accent line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={loaded ? { scaleX: 1 } : {}}
              transition={{ duration: 1, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="origin-left h-[3px] w-24 bg-gradient-to-r from-honda-red to-honda-red/20 rounded-full mb-6"
            />

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.9, ease: 'easeOut' }}
              className="text-sm sm:text-base lg:text-lg text-white/50 max-w-xl leading-relaxed mb-8"
            >
              {subtitle}
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.1, ease: 'easeOut' }}
              className="flex flex-wrap gap-3 sm:gap-4"
            >
              <Link
                to="/#promo"
                className="group relative px-6 sm:px-7 py-2.5 sm:py-3 bg-honda-red text-white rounded-full font-semibold text-sm sm:text-base transition-all duration-300 shadow-lg shadow-honda-red/25 hover:shadow-xl hover:shadow-honda-red/40 hover:scale-105 active:scale-95 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative z-10 flex items-center gap-2">
                  Lihat Promo
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </span>
              </Link>
              <motion.a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-6 sm:px-7 py-2.5 sm:py-3 bg-white/5 backdrop-blur-sm border border-white/20 text-white rounded-full font-semibold text-sm sm:text-base hover:bg-white/10 transition-all duration-300 flex items-center gap-2 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <svg className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                <span className="relative z-10">Konsultasi</span>
              </motion.a>
            </motion.div>

            {/* Stats */}
            {stats.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={loaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 1.3, ease: 'easeOut' }}
                className="flex flex-wrap gap-6 sm:gap-10 mt-10 pt-6 border-t border-white/10"
              >
                {stats.map((stat) => (
                  <div key={stat.label} className="group">
                    <div className="text-xl sm:text-2xl lg:text-3xl font-poppins font-bold text-white group-hover:text-honda-red transition-colors duration-300">
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-xs sm:text-sm text-white/40 mt-0.5 group-hover:text-white/60 transition-colors duration-300">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Sales card */}
          <motion.div
            initial={{ opacity: 0, x: 80, y: 30 }}
            animate={loaded ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex-shrink-0 relative w-full max-w-sm"
          >
            <div className="relative bg-white/[0.06] backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              <div className="p-5 sm:p-8">
                <div className="flex flex-col items-center text-center">
                  {/* Photo */}
                  <div className="relative mb-4 sm:mb-5">
                    <div className="rounded-full ring-4 ring-white/10 shadow-2xl">
                      <img
                        src={heroData.salesPhoto || profile.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80'}
                        alt={profile.name || 'Sales'}
                        className="w-36 h-36 sm:w-40 sm:h-40 rounded-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Name & title */}
                  <h3 className="text-white font-semibold text-base sm:text-lg">{profile.name || 'Sales Honda'}</h3>
                  <p className="text-white/50 text-xs sm:text-sm mb-5 sm:mb-6">{profile.title || 'Sales Consultant'}</p>

                  {/* CTA */}
                  <motion.a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-2.5 sm:py-3 bg-honda-red text-white rounded-xl font-semibold text-xs sm:text-sm hover:bg-red-600 transition-all shadow-lg shadow-honda-red/25 hover:shadow-xl hover:shadow-honda-red/30"
                  >
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Hubungi via WhatsApp
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
        {heroImages.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setCurrentImage(i)}
            className="group relative"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
              i === currentImage ? 'w-8 bg-honda-red shadow-lg shadow-honda-red/40' : 'w-1.5 bg-white/30 group-hover:bg-white/50'
            }`} />
          </motion.button>
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={loaded ? { opacity: 1 } : {}}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden md:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-white/30 text-[10px] tracking-[0.2em] uppercase font-medium">Scroll</span>
          <FiChevronDown size={16} className="text-white/40" />
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-950 to-transparent z-10 pointer-events-none" />
    </section>
  )
}

function AnimatedCounter({ value, suffix }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const num = parseInt(String(value).replace(/\D/g, ''), 10) || 0
  useEffect(() => {
    if (!inView || started || num === 0) return
    setStarted(true)
    const duration = 2000
    const steps = 60
    const increment = num / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= num) {
        setCount(num)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [inView, num, started])
  return <span ref={ref}>{count}{suffix}</span>
}
