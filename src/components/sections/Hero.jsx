import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiChevronDown, FiChevronLeft, FiChevronRight, FiShield, FiZap, FiClock } from 'react-icons/fi'
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
  const [isPaused, setIsPaused] = useState(false)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.4])

  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [heroImages.length, isPaused])

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const goNext = useCallback(() => {
    setCurrentImage((prev) => (prev + 1) % heroImages.length)
  }, [heroImages.length])

  const goPrev = useCallback(() => {
    setCurrentImage((prev) => (prev - 1 + heroImages.length) % heroImages.length)
  }, [heroImages.length])

  const titleWords = title.split(' ')

  return (
    <section
      ref={sectionRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative min-h-dvh flex items-center overflow-hidden bg-gray-950"
    >
      {/* Parallax background carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImage}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.4, ease: [0.45, 0, 0.55, 1] }}
          className="absolute inset-0"
        >
          <motion.img
            src={heroImages[currentImage]}
            alt=""
            className="w-full h-full object-cover"
            style={{ scale: bgScale }}
            onError={(e) => { e.target.style.display = 'none' }}
            draggable={false}
          />
        </motion.div>
      </AnimatePresence>

      {/* Premium overlay */}
      <motion.div
        className="absolute inset-0"
        style={{ opacity: overlayOpacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/70 via-gray-950/30 to-gray-950/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-gray-950/10 to-transparent" />
      </motion.div>

      {/* Subtle grain texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc0IiBudW1PY3RhdmVzPSIzIiAvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjZikiIG9wYWNpdHk9IjAiIC8+PC9zdmc+')] pointer-events-none" />

      {/* Carousel nav arrows */}
      <div className="absolute inset-y-0 left-0 z-20 flex items-center">
        <button
          onClick={goPrev}
          className="ml-3 sm:ml-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
          aria-label="Previous image"
        >
          <FiChevronLeft size={20} />
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 z-20 flex items-center">
        <button
          onClick={goNext}
          className="mr-3 sm:mr-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
          aria-label="Next image"
        >
          <FiChevronRight size={20} />
        </button>
      </div>

      {/* Edge accent glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-honda-red/50 to-transparent z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-honda-red/20 to-transparent z-10" />

      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="min-h-dvh flex items-center">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 w-full items-center">
              {/* Left: Text */}
              <div className="py-20 lg:py-28">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={loaded ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 mb-8">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-honda-red opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-honda-red" />
                    </span>
                    <span className="text-white/60 text-[10px] sm:text-xs tracking-[0.25em] uppercase font-medium">
                      Dealer Resmi Honda
                    </span>
                  </div>
                </motion.div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-poppins font-black text-white leading-[1.1] mb-2">
                  {titleWords.map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 40, rotateX: -20 }}
                      animate={loaded ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.2 + i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="inline-block mr-[0.25em]"
                    >
                      {word.toLowerCase() === 'honda' ? (
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-honda-red via-red-300 to-honda-red">
                          {word}
                        </span>
                      ) : (
                        <span className="text-white">{word}</span>
                      )}
                    </motion.span>
                  ))}
                </h1>

                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={loaded ? { scaleX: 1 } : {}}
                  transition={{ duration: 1.2, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="origin-left h-[3px] w-20 bg-gradient-to-r from-honda-red via-red-400 to-transparent rounded-full my-6 lg:my-8"
                />

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={loaded ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.9, ease: 'easeOut' }}
                  className="text-sm sm:text-base lg:text-lg text-white/40 max-w-xl leading-relaxed mb-8 lg:mb-10"
                >
                  {subtitle}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={loaded ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1.1, ease: 'easeOut' }}
                  className="flex flex-wrap gap-3 sm:gap-4"
                >
                  <Link
                    to="/#produk"
                    className="group relative px-7 py-3 bg-honda-red text-white rounded-full font-semibold text-sm sm:text-base shadow-lg shadow-honda-red/25 hover:shadow-xl hover:shadow-honda-red/40 hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <span className="relative z-10 flex items-center gap-2">
                      Lihat Produk
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </span>
                  </Link>
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative px-7 py-3 bg-white/5 backdrop-blur-md border border-white/20 text-white rounded-full font-semibold text-sm sm:text-base hover:bg-white/10 transition-all duration-300 flex items-center gap-2 overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <svg className="w-4 h-5 relative z-10" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    <span className="relative z-10">Konsultasi Sekarang</span>
                  </a>
                </motion.div>

                {/* Stats */}
                {stats.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={loaded ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 1.4, ease: 'easeOut' }}
                    className="flex flex-wrap gap-6 sm:gap-8 mt-12 pt-8 border-t border-white/5"
                  >
                    {stats.map((stat) => (
                      <div key={stat.label} className="group">
                        <div className="text-xl sm:text-2xl lg:text-3xl font-poppins font-bold text-white group-hover:text-honda-red transition-colors duration-300">
                          <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                        </div>
                        <div className="text-xs sm:text-sm text-white/30 mt-0.5 group-hover:text-white/50 transition-colors duration-300">{stat.label}</div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Right: Sales card */}
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={loaded ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="hidden lg:flex justify-center"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-honda-red/10 to-transparent rounded-[2rem] blur-3xl" />
                  <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-[2rem] p-8 shadow-2xl">
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-5">
                        <div className="absolute inset-0 bg-honda-red/20 rounded-full blur-xl" />
                        <img
                          src={heroData.salesPhoto || profile.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80'}
                          alt={profile.name || 'Sales'}
                          className="relative w-40 h-40 rounded-full object-cover ring-2 ring-white/10"
                          draggable={false}
                        />
                        <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-green-500 rounded-full border-4 border-gray-950 flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        </div>
                      </div>
                      <h3 className="text-white font-semibold text-lg mb-1">{profile.name || 'Sales Honda'}</h3>
                      <p className="text-white/40 text-sm mb-5">{profile.title || 'Sales Consultant'}</p>
                      <a
                        href={getWhatsAppLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-honda-red text-white rounded-xl font-semibold text-sm hover:bg-red-600 transition-all shadow-lg shadow-honda-red/25 w-full justify-center"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        Hubungi Saya
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentImage(i)}
            className="group relative"
          >
            <div className={`rounded-full transition-all duration-500 cursor-pointer ${
              i === currentImage
                ? 'w-8 h-1.5 bg-honda-red shadow-lg shadow-honda-red/40'
                : 'w-1.5 h-1.5 bg-white/20 group-hover:bg-white/40'
            }`} />
          </button>
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={loaded ? { opacity: 1 } : {}}
        transition={{ delay: 2.5, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden md:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-white/20 text-[9px] tracking-[0.25em] uppercase font-medium">Scroll</span>
          <FiChevronDown size={14} className="text-white/30" />
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent z-10 pointer-events-none" />
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