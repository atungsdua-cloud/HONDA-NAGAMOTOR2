import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { products as defaultProducts, promotions as defaultPromotions, testimonials as defaultTestimonials, gallery as defaultGallery, faqs as defaultFaqs, advantages as defaultAdvantages } from '../data'

const API_ENDPOINT = '/api/data'
const STORAGE_KEY = 'honda-cms-data'

const defaultData = {
  products: defaultProducts,
  promotions: defaultPromotions,
  testimonials: defaultTestimonials,
  gallery: defaultGallery,
  faqs: defaultFaqs,
  advantages: defaultAdvantages,
  profile: {
    name: 'Ahmad Rizky',
    title: 'Sales Executive Honda Nagamotor',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    experience: '10 Tahun Pengalaman',
    description: 'Sejak 2015 saya bergabung dengan Honda Nagamotor dan telah membantu ratusan konsumen menemukan mobil Honda impian mereka.',
    stats: [
      { icon: 'FiAward', value: '500+', label: 'Unit Terjual' },
      { icon: 'FiUsers', value: '1000+', label: 'Pelanggan' },
      { icon: 'FiStar', value: '4.9', label: 'Rating' },
    ],
  },
  hero: {
    title: 'Temukan Honda Impian Anda Hari Ini Bersama Saya Aldi Nagamotor',
    subtitle: 'Promo terbaik, DP ringan, proses cepat, dan pelayanan profesional dari sales berpengalaman.',
    salesPhoto: '',
    stats: [
      { value: 500, suffix: '+', label: 'Unit Terjual' },
      { value: 1000, suffix: '+', label: 'Konsumen Puas' },
      { value: 10, suffix: '+', label: 'Tahun Pengalaman' },
    ],
  },
  navbar: {
    logoImage: '',
    logoText: 'HONDA',
    logoSubtext: 'Nagamotor',
    ctaText: 'Hubungi Saya',
    ctaUrl: '',
    menuItems: [
      { label: 'Beranda', section: '' },
      { label: 'Produk', section: 'produk' },
      { label: 'Promo', section: 'promo' },
      { label: 'Testimoni', section: 'testimoni' },
      { label: 'Tentang', section: 'tentang' },
      { label: 'Kontak', section: 'kontak' },
    ],
  },
  loading: {
    title: 'HONDA',
    subtext: 'NAGAMOTOR',
    tagline: 'Dealer Resmi Honda',
  },
  contact: {
    phone: '+62 812 3456 7890',
    email: 'sales@hondanagamotor.com',
    address: 'Jakarta Selatan, Indonesia',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.0!2d106.8!3d-6.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTInMDAuMCJTIDEwNsKwNDgnMDAuMCJF!5e0!3m2!1sid!2sid!4v1',
    socialMedia: [
      { platform: 'Instagram', url: '#', icon: 'FaInstagram' },
      { platform: 'Facebook', url: '#', icon: 'FaFacebook' },
      { platform: 'TikTok', url: '#', icon: 'FaTiktok' },
    ],
  },
}

function mergeArray(defaults, saved, deleted, idKey = 'id') {
  const savedArr = saved || []
  const deletedSet = new Set((deleted || []).map(d => d.id))
  const merged = defaults
    .filter(d => !deletedSet.has(d[idKey]))
    .map(d => {
      const existing = savedArr.find(s => s[idKey] === d[idKey])
      return existing ? { ...d, ...existing } : d
    })
  savedArr.forEach(s => {
    if (!merged.find(m => m[idKey] === s[idKey])) {
      merged.push(s)
    }
  })
  return merged
}

function mergeData(saved) {
  if (!saved) return defaultData
  const deleted = saved._deleted || []
  const merged = { ...defaultData, ...saved, _deleted: deleted }
  if (merged.navbar?.menuItems) {
    merged.navbar.menuItems = merged.navbar.menuItems.filter(
      item => !/kredit/i.test(item.label) && !/kredit/i.test(item.section || '')
    )
  }
  merged.products = mergeArray(defaultData.products, saved.products, deleted)
  merged.promotions = mergeArray(defaultData.promotions, saved.promotions, deleted)
  merged.testimonials = mergeArray(defaultData.testimonials, saved.testimonials, deleted)
  merged.gallery = mergeArray(defaultData.gallery, saved.gallery, deleted)
  merged.faqs = mergeArray(defaultData.faqs, saved.faqs, deleted)
  merged.advantages = mergeArray(defaultData.advantages, saved.advantages, deleted)
  return merged
}

function loadLocal() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return mergeData(JSON.parse(saved))
  } catch {}
  return defaultData
}

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [data, setData] = useState(defaultData)
  const [lastUpdate, setLastUpdate] = useState(Date.now())
  const [saveError, setSaveError] = useState(null)
  const [loading, setLoading] = useState(true)
  const saveTimer = useRef(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    ;(async () => {
      try {
        const res = await fetch(API_ENDPOINT)
        if (res.ok) {
          const saved = await res.json()
          if (saved && Object.keys(saved).length > 0) {
            setData(mergeData(saved))
            setLoading(false)
            return
          }
        }
      } catch {}
      setData(loadLocal())
      setLoading(false)
    })()
  }, [])

  useEffect(() => {
    if (loading) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {}
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (res.ok) {
          if (saveError) setSaveError(null)
        } else {
          setSaveError('Gagal menyimpan ke server.')
        }
      } catch {
        setSaveError('Server tidak tersedia. Data disimpan di browser saja.')
      }
    }, 1000)
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current) }
  }, [data, loading])

  const getByType = useCallback((type) => data[type] || [], [data])

  const getByTypeAndId = useCallback((type, id) => {
    const items = data[type] || []
    return items.find(item => item.id === id)
  }, [data])

  const add = useCallback((type, item) => {
    setData(prev => {
      const items = prev[type] || []
      const newItem = { ...item, id: item.id || `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` }
      return { ...prev, [type]: [...items, newItem] }
    })
    setLastUpdate(Date.now())
  }, [])

  const update = useCallback((type, id, updates) => {
    setData(prev => {
      const items = prev[type] || []
      return {
        ...prev,
        [type]: items.map(item => item.id === id ? { ...item, ...updates } : item),
      }
    })
    setLastUpdate(Date.now())
  }, [])

  const remove = useCallback((type, id) => {
    setData(prev => {
      const items = prev[type] || []
      const isDefault = defaultData[type]?.some(d => String(d.id) === String(id))
      const deleted = prev._deleted || []
      return {
        ...prev,
        [type]: items.filter(item => item.id !== id),
        _deleted: isDefault ? [...deleted.filter(d => !(d.type === type && String(d.id) === String(id))), { type, id }] : deleted,
      }
    })
    setLastUpdate(Date.now())
  }, [])

  const resetType = useCallback((type) => {
    setData(prev => ({
      ...prev,
      [type]: defaultData[type] || [],
      _deleted: (prev._deleted || []).filter(d => d.type !== type),
    }))
    setLastUpdate(Date.now())
  }, [])

  const resetAll = useCallback(() => {
    setData({ ...defaultData, _deleted: [] })
    setLastUpdate(Date.now())
  }, [])

  const exportData = useCallback(() => JSON.stringify(data, null, 2), [data])

  const importData = useCallback((jsonStr) => {
    try {
      const parsed = JSON.parse(jsonStr)
      setData(prev => ({ ...prev, ...parsed }))
      setLastUpdate(Date.now())
      return true
    } catch { return false }
  }, [])

  const updateProfile = useCallback((updates) => {
    setData(prev => ({ ...prev, profile: { ...prev.profile, ...updates } }))
    setLastUpdate(Date.now())
  }, [])

  const updateHero = useCallback((updates) => {
    setData(prev => ({ ...prev, hero: { ...prev.hero, ...updates } }))
    setLastUpdate(Date.now())
  }, [])

  const updateNavbar = useCallback((updates) => {
    const { loading, ...navbarUpdates } = updates
    setData(prev => ({ ...prev, navbar: { ...prev.navbar, ...navbarUpdates }, loading: { ...prev.loading, ...loading } }))
    setLastUpdate(Date.now())
  }, [])

  const updateContact = useCallback((updates) => {
    setData(prev => ({ ...prev, contact: { ...prev.contact, ...updates } }))
    setLastUpdate(Date.now())
  }, [])

  return (
    <DataContext.Provider value={{
      data,
      loading,
      lastUpdate,
      saveError,
      getByType,
      getByTypeAndId,
      add,
      update,
      remove,
      resetType,
      resetAll,
      exportData,
      importData,
      updateProfile,
      updateHero,
      updateNavbar,
      updateContact,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
