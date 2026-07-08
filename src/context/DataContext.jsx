import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'

const API_ENDPOINT = '/api/data'
const STORAGE_KEY = 'honda-cms-data'

const defaultData = {}

function mergeData(saved) {
  if (!saved) return defaultData
  const merged = { ...saved, _deleted: saved._deleted || [] }
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
          const errBody = await res.json().catch(() => ({}))
          console.error('Save error:', res.status, errBody)
          setSaveError(errBody.error || `Gagal menyimpan ke server (HTTP ${res.status})`)
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
      return { ...prev, [type]: items.filter(item => item.id !== id) }
    })
    setLastUpdate(Date.now())
  }, [])

  const resetType = useCallback((type) => {
    setData(prev => ({
      ...prev,
      [type]: [],
    }))
    setLastUpdate(Date.now())
  }, [])

  const resetAll = useCallback(() => {
    setData({})
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
    setData(prev => ({ ...prev, navbar: { ...prev.navbar, ...navbarUpdates }, loadingScreen: { ...prev.loadingScreen, ...loading } }))
    setLastUpdate(Date.now())
  }, [])

  const updateContact = useCallback((updates) => {
    setData(prev => ({ ...prev, contact: { ...prev.contact, ...updates } }))
    setLastUpdate(Date.now())
  }, [])

  const saveNow = useCallback(async () => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    try {
      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setSaveError(null)
        return true
      } else {
        const errBody = await res.json().catch(() => ({}))
        console.error('Save error:', res.status, errBody)
        setSaveError(errBody.error || `Gagal menyimpan ke server (HTTP ${res.status})`)
        return false
      }
    } catch {
      setSaveError('Server tidak tersedia. Data disimpan di browser saja.')
      return false
    }
  }, [data])

  return (
    <DataContext.Provider value={{
      data,
      loading,
      lastUpdate,
      saveError,
      saveNow,
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
