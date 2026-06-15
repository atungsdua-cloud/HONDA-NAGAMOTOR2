import { useState, useEffect } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

export default function ScrollProgress() {
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      setScrolled(v > 0.01)
    })
    return () => unsubscribe()
  }, [scrollYProgress])

  if (!scrolled) return null

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-honda-red z-[60] origin-left"
      style={{ scaleX }}
    />
  )
}
