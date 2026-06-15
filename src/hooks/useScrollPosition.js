import { useState, useEffect } from 'react'

export function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0)
  const [scrollDirection, setScrollDirection] = useState('up')

  useEffect(() => {
    let lastScrollY = window.scrollY
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollDirection(currentScrollY > lastScrollY ? 'down' : 'up')
      setScrollY(currentScrollY)
      lastScrollY = currentScrollY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return { scrollY, scrollDirection }
}
