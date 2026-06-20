import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { useData } from '../../context/DataContext'
import SectionTitle from '../ui/SectionTitle'

export default function Testimoni() {
  const { data } = useData()
  const testimonials = data.testimonials || []
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    if (testimonials.length === 0) return
    const interval = setInterval(() => {
      setDirection(1)
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  const goTo = (index) => {
    setDirection(index > current ? 1 : -1)
    setCurrent(index)
  }

  const goNext = () => {
    setDirection(1)
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }

  const goPrev = () => {
    setDirection(-1)
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
  }

  return (
    <section id="testimoni" className="py-20 lg:py-28 bg-light dark:bg-gray-900 transition-colors duration-500 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="TESTIMONI"
          title="Apa Kata Konsumen Kami"
          description="Pengalaman nyata dari konsumen yang telah membeli mobil Honda melalui kami"
        />

          <div className="relative max-w-4xl mx-auto">
            {testimonials.length === 0 ? (
              <div className="text-center py-16 text-gray-400 dark:text-gray-500">
                <p className="text-sm">Belum ada testimoni</p>
              </div>
            ) : (
              <>
            <div className="min-h-[280px] flex items-center justify-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="w-full px-4"
              >
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
                  <div className="flex-shrink-0">
                    <img
                      src={testimonials[current]?.photo || 'https://placehold.co/160x160?text=User'}
                      alt={testimonials[current]?.name || 'Testimoni'}
                      className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover ring-4 ring-honda-red/20 shadow-lg"
                      onError={(e) => { if (e.target.src !== 'https://placehold.co/160x160?text=User') e.target.src = 'https://placehold.co/160x160?text=User' }}
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex justify-center md:justify-start gap-1 mb-3">
                      {testimonials[current]?.rating ? [...Array(Number(testimonials[current].rating))].map((_, i) => (
                        <FiStar key={i} className="text-yellow-400 fill-yellow-400" size={18} />
                      )) : null}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg italic leading-relaxed mb-4">
                      &ldquo;{testimonials[current]?.text || ''}&rdquo;
                    </p>
                    <div>
                      <h4 className="font-poppins font-semibold text-gray-900 dark:text-white">{testimonials[current]?.name}</h4>
                      <p className="text-sm text-honda-red font-medium">{testimonials[current]?.car}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            </div>
            <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={goPrev} className="p-3 rounded-full bg-white dark:bg-gray-800 shadow hover:shadow-lg transition-shadow">
              <FiChevronLeft size={18} className="text-gray-600 dark:text-gray-300" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`w-3 h-3 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
                    i === current ? 'bg-honda-red w-6 sm:w-6' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
            <button onClick={goNext} className="p-3 rounded-full bg-white dark:bg-gray-800 shadow hover:shadow-lg transition-shadow">
              <FiChevronRight size={18} className="text-gray-600 dark:text-gray-300" />
            </button>
          </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
