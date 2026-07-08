import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useData } from '../../context/DataContext'

export default function LoadingScreen() {
  const { data, loading: dataLoading } = useData()
  const screen = data.loading || {}
  const [isLoading, setIsLoading] = useState(true)
  const dataReady = useRef(false)
  const minElapsed = useRef(false)

  useEffect(() => {
    if (!dataLoading) {
      dataReady.current = true
      if (minElapsed.current) setIsLoading(false)
    }
  }, [dataLoading])

  useEffect(() => {
    const timer = setTimeout(() => {
      minElapsed.current = true
      if (dataReady.current) setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: '-100%' }}
          transition={{ duration: 0.5, ease: [0.45, 0, 0.55, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-dark"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-8"
          >
            <div className="flex flex-col items-center">
              <span className="font-poppins font-black text-honda-red text-3xl sm:text-4xl tracking-[6px] leading-none">
                {screen.title || 'HONDA'}
              </span>
              <span className="font-inter font-medium text-gray-400 text-xs tracking-[8px] mt-1.5">
                {screen.subtext || 'NAGAMOTOR'}
              </span>
            </div>

            <div className="relative w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '400%' }}
                transition={{ duration: 1.4, ease: 'easeInOut', repeat: Infinity }}
                className="absolute inset-0 bg-honda-red rounded-full shadow-lg shadow-honda-red/50"
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-[10px] text-gray-500 tracking-[4px] uppercase"
            >
              {screen.tagline || 'Dealer Resmi Honda'}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
