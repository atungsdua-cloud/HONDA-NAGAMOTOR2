import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function ImageLightbox({ images, index, onClose }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (index === null || index === undefined) return null
  const current = images[index]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors z-10"
          aria-label="Tutup"
        >
          <FiX size={22} className="text-white" />
        </button>

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); onClose('prev') }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors z-10"
              aria-label="Sebelumnya"
            >
              <FiChevronLeft size={22} className="text-white" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onClose('next') }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors z-10"
              aria-label="Selanjutnya"
            >
              <FiChevronRight size={22} className="text-white" />
            </button>
          </>
        )}

        <motion.img
          key={index}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          src={typeof current === 'string' ? current : current?.src || current}
          alt=""
          className="max-w-full max-h-[85vh] object-contain rounded-2xl"
          onClick={(e) => e.stopPropagation()}
        />

        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); onClose(i) }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === index ? 'bg-white w-6' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
