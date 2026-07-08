import { useEffect } from 'react'
import { useData } from '../context/DataContext'

export default function useSEO({ title, description, image, url } = {}) {
  const { data } = useData()

  useEffect(() => {
    const brand = data?.navbar?.logoText || 'HONDA'
    const tagline = data?.navbar?.logoSubtext || 'Nagamotor'
    const siteName = `${brand} ${tagline}`
    const defaultDesc = data?.hero?.subtitle || data?.profile?.description || 'Dealer Resmi Honda'
    const defaultImage = data?.hero?.images?.[0] || data?.profile?.photo ||
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&q=80'

    const pageTitle = title ? `${title} | ${siteName}` : siteName
    const pageDesc = description || defaultDesc
    const pageImage = image || defaultImage
    const pageUrl = url || window.location.href

    document.title = pageTitle

    const setMeta = (name, content) => {
      let el = document.querySelector(`meta[property="${name}"], meta[name="${name}"]`)
      if (!el) {
        el = document.createElement('meta')
        const attr = name.startsWith('og:') ? 'property' : 'name'
        el.setAttribute(attr, name)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    setMeta('description', pageDesc)
    setMeta('og:title', pageTitle)
    setMeta('og:description', pageDesc)
    setMeta('og:image', pageImage)
    setMeta('og:url', pageUrl)
    setMeta('og:type', title ? 'product' : 'website')
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', pageTitle)
    setMeta('twitter:description', pageDesc)
    setMeta('twitter:image', pageImage)
  }, [title, description, image, url, data])
}
