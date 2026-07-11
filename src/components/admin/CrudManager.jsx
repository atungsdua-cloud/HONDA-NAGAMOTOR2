import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiAlertCircle, FiImage, FiCheckSquare, FiSquare, FiLoader, FiStar } from 'react-icons/fi'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import ImageFieldInput from '../ui/ImageFieldInput'
import { compressImage } from '../../utils/compressImage'

const inputClass = "w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-honda-red transition-all"
const labelClass = "block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1"

const fieldTypes = {
  text: { render: (value) => <span>{value || '-'}</span> },
  textarea: { render: (value) => <span className="line-clamp-2">{value || '-'}</span> },
  number: { render: (value) => <span>{value ?? '-'}</span> },
  image: { render: (value) => value ? <img src={value} alt="" className="w-12 h-12 rounded-lg object-cover" /> : <span className="text-gray-400">-</span> },
  images: { render: (value) => value?.length > 0 ? <div className="flex gap-1">{value.slice(0, 3).map((s, i) => <img key={i} src={s} alt="" className="w-8 h-8 rounded object-cover" />)}{value.length > 3 && <span className="text-xs text-gray-400 ml-1">+{value.length - 3}</span>}</div> : <span className="text-gray-400">-</span> },
  colors: { render: (value) => <div className="flex gap-1">{value?.map((c, i) => <div key={i} className="w-5 h-5 rounded-full border" style={{ backgroundColor: c }} />)}</div> },
  gradient: { render: (value) => value ? <span className="text-xs font-mono text-gray-500 truncate">{value}</span> : <span className="text-gray-400">-</span> },
  list: { render: (value) => <span className="text-xs text-gray-500">{value?.length || 0} item</span> },
  kv: { render: (value) => <span className="text-xs text-gray-500">{value ? Object.keys(value).length : 0} item</span> },
  variants: { render: (value) => value?.length > 0
    ? <span className="text-xs text-gray-500">{value.map(v => v.name).join(', ')}</span>
    : <span className="text-gray-400">-</span> },
}

const gradientPresets = [
  { value: 'from-red-600 to-red-800', label: 'Merah', style: 'linear-gradient(135deg, #dc2626, #991b1b)' },
  { value: 'from-blue-600 to-blue-800', label: 'Biru', style: 'linear-gradient(135deg, #2563eb, #1e40af)' },
  { value: 'from-emerald-600 to-emerald-800', label: 'Hijau', style: 'linear-gradient(135deg, #059669, #065f46)' },
  { value: 'from-orange-600 to-orange-800', label: 'Oranye', style: 'linear-gradient(135deg, #ea580c, #9a3412)' },
  { value: 'from-violet-600 to-violet-800', label: 'Ungu', style: 'linear-gradient(135deg, #7c3aed, #5b21b6)' },
  { value: 'from-gray-800 to-black', label: 'Hitam', style: 'linear-gradient(135deg, #1f2937, #000000)' },
]

function ImagesFieldInput({ value, onChange, fileRef }) {
  const [loading, setLoading] = useState(false)
  const imagesRef = useRef([])
  imagesRef.current = Array.isArray(value) ? value : []
  const images = imagesRef.current
  const handleFiles = async (files) => {
    const valid = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (valid.length === 0) return
    setLoading(true)
    const results = await Promise.allSettled(valid.map(f => compressImage(f)))
    const urls = results.filter(r => r.status === 'fulfilled').map(r => r.value)
    if (fileRef.current) fileRef.current.value = ''
    setLoading(false)
    onChange([...imagesRef.current, ...urls])
  }
  return (
    <div className="space-y-2">
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((url, i) => (
            <div key={i} className="relative group">
              <img src={url} alt="" className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border" />
              <button onClick={() => onChange(images.filter((_, idx) => idx !== i))}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow text-[10px]"><FiX /></button>
            </div>
          ))}
        </div>
      )}
      <div onClick={() => { if (!loading) fileRef.current?.click() }} className={`border-2 border-dashed rounded-xl py-3 text-center cursor-pointer transition-all ${loading ? 'border-honda-red bg-honda-red/5' : 'border-gray-300 dark:border-gray-600 hover:border-honda-red hover:bg-honda-red/5'}`}>
        <input ref={fileRef} type="file" multiple accept="image/*" onChange={e => handleFiles(e.target.files)} className="hidden" />
        {loading ? <FiLoader className="mx-auto mb-0.5 text-honda-red animate-spin" size={18} /> : <FiImage className="mx-auto mb-0.5 text-gray-400" size={18} />}
        <p className="text-[11px] text-gray-400">{loading ? 'Memproses...' : images.length > 0 ? 'Tambah lagi' : 'Upload gambar'}</p>
      </div>
    </div>
  )
}

function FieldInput({ field, value, onChange, autoFocus }) {
  const ref = useRef(null)
  const fileRef = useRef(null)

  useEffect(() => {
    if (autoFocus && ref.current) ref.current.focus()
  }, [autoFocus])

  if (field.type === 'textarea') {
    return <textarea ref={ref} className={`${inputClass} resize-none`} rows={3} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={field.placeholder || ''} />
  }
  if (field.type === 'image') {
    return <ImageFieldInput value={value} onChange={onChange} />
  }
  if (field.type === 'images') {
    return <ImagesFieldInput value={value} onChange={onChange} fileRef={fileRef} />
  }
  if (field.type === 'colors') {
    const colors = Array.isArray(value) ? value : []
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {colors.map((c, i) => (
            <div key={i} className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg px-2 py-1">
              <input type="color" value={c} onChange={e => { const n = [...colors]; n[i] = e.target.value; onChange(n) }}
                className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent" />
              <span className="text-[11px] font-mono text-gray-500">{c}</span>
              <button onClick={() => onChange(colors.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600"><FiX size={13} /></button>
            </div>
          ))}
        </div>
        <button onClick={() => onChange([...colors, '#e5e7eb'])} className="text-[11px] text-honda-red hover:underline flex items-center gap-1"><FiPlus size={12} /> Warna</button>
      </div>
    )
  }
  if (field.type === 'gradient') {
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {gradientPresets.map((g) => (
            <button key={g.value} type="button" onClick={() => onChange(g.value)}
              className={`relative h-14 rounded-xl overflow-hidden ring-2 transition-all hover:scale-105 ${value === g.value ? 'ring-honda-red scale-105 ring-3' : 'ring-transparent hover:ring-gray-300'}`}>
              <div className="absolute inset-0" style={{ background: g.style }} />
              <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-white drop-shadow-md tracking-wide">{g.label}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <input type="text" value={value || ''} onChange={e => onChange(e.target.value)}
            placeholder='Ketik custom gradient (cth: from-red-500 to-red-700)'
            className={`${inputClass} text-xs py-1.5 flex-1`} />
          {value && <span className="text-[10px] text-gray-400 font-mono truncate max-w-[120px]" title={value}>{value}</span>}
        </div>
      </div>
    )
  }
  if (field.type === 'list') {
    const items = Array.isArray(value) ? value : []
    const addItem = () => onChange([...items, ''])
    return (
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex gap-1.5">
            <input type="text" value={item} onChange={e => { const n = [...items]; n[i] = e.target.value; onChange(n) }}
              placeholder={field.placeholder || ''} className={`${inputClass} text-sm py-1.5`}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addItem() } }} />
            <button onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 px-1"><FiX size={15} /></button>
          </div>
        ))}
        <button onClick={addItem} className="text-[11px] text-honda-red hover:underline flex items-center gap-1"><FiPlus size={12} /> Tambah</button>
      </div>
    )
  }
  if (field.type === 'theme') {
    const theme = value || {}
    return (
      <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500"><FiStar size={14} /> Tema Tampilan</div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-gray-400">Warna Aksen</label>
            <div className="flex items-center gap-1.5">
              <input type="color" value={theme.accent || '#e00000'} onChange={e => onChange({ ...theme, accent: e.target.value })}
                className="w-9 h-9 rounded cursor-pointer border-0 bg-transparent" />
              <input type="text" value={theme.accent || '#e00000'} onChange={e => onChange({ ...theme, accent: e.target.value })}
                className="w-24 px-2 py-1.5 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs font-mono outline-none focus:ring-2 focus:ring-honda-red" />
            </div>
          </div>
          <div>
            <label className="text-[11px] text-gray-400">Badge</label>
            <input type="text" value={theme.badge || ''} onChange={e => onChange({ ...theme, badge: e.target.value })}
              placeholder="cth: LCGC / SUV"
              className="w-full px-2 py-1.5 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-honda-red" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-gray-400">Gradient Hero (Tailwind)</label>
            <input type="text" value={theme.heroGrad || ''} onChange={e => onChange({ ...theme, heroGrad: e.target.value })}
              placeholder="from-gray-900 via-gray-800 to-black"
              className="w-full px-2 py-1.5 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs font-mono outline-none focus:ring-2 focus:ring-honda-red" />
          </div>
          <div>
            <label className="text-[11px] text-gray-400">Tinggi Hero (Tailwind)</label>
            <input type="text" value={theme.heroSize || ''} onChange={e => onChange({ ...theme, heroSize: e.target.value })}
              placeholder="min-h-[75vh]"
              className="w-full px-2 py-1.5 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs font-mono outline-none focus:ring-2 focus:ring-honda-red" />
          </div>
        </div>
        <div>
          <label className="text-[11px] text-gray-400">Judul "Kenapa Pilih"</label>
          <input type="text" value={theme.whyTitle || ''} onChange={e => onChange({ ...theme, whyTitle: e.target.value })}
            placeholder="cth: Kenapa Pilih Brio?"
            className="w-full px-2 py-1.5 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-honda-red" />
        </div>
        <div>
          <label className="text-[11px] text-gray-400">Poin Keunggulan (label + deskripsi)</label>
          <div className="space-y-1.5 mt-1">
            {(theme.whyItems || []).map((item, i) => (
              <div key={i} className="flex gap-1">
                <input type="text" value={item.label || ''} onChange={e => {
                  const n = [...(theme.whyItems || [])]
                  n[i] = { ...n[i], label: e.target.value }
                  onChange({ ...theme, whyItems: n })
                }} placeholder="Label" className="w-2/5 px-2 py-1 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-honda-red" />
                <input type="text" value={item.desc || ''} onChange={e => {
                  const n = [...(theme.whyItems || [])]
                  n[i] = { ...n[i], desc: e.target.value }
                  onChange({ ...theme, whyItems: n })
                }} placeholder="Deskripsi" className="flex-1 px-2 py-1 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-honda-red" />
                <button onClick={() => onChange({ ...theme, whyItems: theme.whyItems.filter((_, idx) => idx !== i) })}
                  className="text-red-400 hover:text-red-600 px-1"><FiX size={13} /></button>
              </div>
            ))}
            <button onClick={() => onChange({ ...theme, whyItems: [...(theme.whyItems || []), { label: '', desc: '' }] })}
              className="text-[11px] text-honda-red hover:underline flex items-center gap-1"><FiPlus size={12} /> Tambah Poin</button>
          </div>
        </div>
      </div>
    )
  }

  if (field.type === 'variants') {
    const items = Array.isArray(value) ? value : []
    const addItem = () => onChange([...items, { name: '', price: '' }])
    return (
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex gap-1.5">
            <input type="text" value={item.name} onChange={e => { const n = [...items]; n[i] = { ...n[i], name: e.target.value }; onChange(n) }}
              placeholder="Nama Tipe" className={`${inputClass} w-2/5 text-sm py-1.5`} />
            <input type="text" value={item.price} onChange={e => { const n = [...items]; n[i] = { ...n[i], price: e.target.value }; onChange(n) }}
              placeholder="Harga" className={`${inputClass} flex-1 text-sm py-1.5`} />
            <button onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 px-1"><FiX size={15} /></button>
          </div>
        ))}
        <button onClick={addItem} className="text-[11px] text-honda-red hover:underline flex items-center gap-1"><FiPlus size={12} /> Tambah Varian</button>
      </div>
    )
  }
  if (field.type === 'kv') {
    const obj = value || {}
    const entries = Object.entries(obj)
    const addItem = () => onChange({ ...obj, '': '' })
    return (
      <div className="space-y-1.5">
        {entries.map(([k, v], i) => (
          <div key={i} className="flex gap-1.5">
            <input type="text" value={k} onChange={e => { const n = { ...obj }; delete n[k]; n[e.target.value] = v; onChange(n) }}
              placeholder="Nama" className={`${inputClass} w-2/5 text-sm py-1.5`}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addItem() } }} />
            <input type="text" value={v} onChange={e => onChange({ ...obj, [k]: e.target.value })}
              placeholder="Nilai" className={`${inputClass} flex-1 text-sm py-1.5`} />
            <button onClick={() => { const n = { ...obj }; delete n[k]; onChange(n) }} className="text-red-400 hover:text-red-600 px-1"><FiX size={15} /></button>
          </div>
        ))}
        <button onClick={addItem} className="text-[11px] text-honda-red hover:underline flex items-center gap-1"><FiPlus size={12} /> Tambah</button>
      </div>
    )
  }
  return <input ref={ref} type={field.type || 'text'} className={inputClass} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={field.placeholder || ''} />
}

function EditModal({ config, item, onSave, onClose }) {
  const [form, setForm] = useState({ ...item })
  const isLong = config.fields.length > 6

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        onSave(form); onClose()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [form, onSave, onClose])

  const textFields = config.fields.filter(f => f.type === 'text' || f.type === 'number')
  const otherFields = config.fields.filter(f => f.type !== 'text' && f.type !== 'number')
  const showGrid = textFields.length > 1

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className={`bg-white dark:bg-gray-800 shadow-2xl w-full sm:rounded-2xl mx-0 sm:mx-2 flex flex-col ${isLong ? 'max-w-2xl' : 'max-w-lg'} max-h-screen sm:max-h-[85vh] min-h-screen sm:min-h-0`}>
        <div className="flex-shrink-0 bg-white dark:bg-gray-800 sm:rounded-t-2xl border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 sm:px-6 py-4">
          <h3 className="font-poppins font-bold text-gray-900 dark:text-white">{item.id ? 'Edit' : 'Tambah'} {config.label}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"><FiX size={18} className="text-gray-500" /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-4">
          {showGrid ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                {textFields.map((field, idx) => (
                  <div key={field.key}>
                    <label className={labelClass}>{field.label}</label>
                    <FieldInput field={field} value={form[field.key]} onChange={val => setForm({ ...form, [field.key]: val })} autoFocus={idx === 0} />
                  </div>
                ))}
              </div>
              {otherFields.length > 0 && <div className="border-t border-gray-100 dark:border-gray-700 pt-4" />}
              {otherFields.map(field => (
                <div key={field.key}>
                  <label className={labelClass}>{field.label}</label>
                  <FieldInput field={field} value={form[field.key]} onChange={val => setForm({ ...form, [field.key]: val })} />
                </div>
              ))}
            </>
          ) : (
            config.fields.map((field, idx) => (
              <div key={field.key}>
                <label className={labelClass}>{field.label}</label>
                <FieldInput field={field} value={form[field.key]} onChange={val => setForm({ ...form, [field.key]: val })} autoFocus={idx === 0} />
              </div>
            ))
          )}
        </div>

        <div className="flex-shrink-0 bg-white dark:bg-gray-800 sm:rounded-b-2xl border-t border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 flex justify-end gap-3">
          <span className="text-[11px] text-gray-400 self-center mr-auto hidden sm:block">Ctrl+Enter untuk simpan</span>
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Batal</button>
          <button onClick={() => { onSave(form); onClose() }} className="px-5 py-2.5 bg-honda-red text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"><FiCheck size={16} /> Simpan</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function CardView({ item, config, onEdit, onDelete, selected, onToggle }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border p-4 transition-all ${selected ? 'border-honda-red ring-2 ring-honda-red/20' : 'border-gray-200 dark:border-gray-700 hover:shadow-lg'}`}>
      <div className="flex items-start gap-3">
        <button onClick={() => onToggle(item.id)} className="mt-0.5 flex-shrink-0 text-gray-400 hover:text-honda-red transition-colors">
          {selected ? <FiCheckSquare size={18} className="text-honda-red" /> : <FiSquare size={18} />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-3">
            <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
              {item[config.titleField] || item.title || item.question || `Item #${item.id}`}
            </h4>
            <div className="flex gap-1 flex-shrink-0">
              <button onClick={() => onEdit(item)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-500 transition-colors"><FiEdit2 size={13} /></button>
              <button onClick={() => onDelete(item.id)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 transition-colors"><FiTrash2 size={13} /></button>
            </div>
          </div>
          <div className="space-y-1">
            {config.fields.filter(f => f.showInCard !== false && item[f.key]).slice(0, 3).map(f => (
              <div key={f.key} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="font-medium capitalize">{f.label || f.key}:</span>
                <span className="truncate">{fieldTypes[f.type]?.render(item[f.key])}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CrudManager({ config }) {
  const { data, add, update, remove, saveNow } = useData()
  const { addToast } = useToast()
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [confirmBatchDelete, setConfirmBatchDelete] = useState(false)
  const [selectedIds, setSelectedIds] = useState(new Set())
  const items = data[config.type] || []

  const selectedCount = selectedIds.size

  const clearSelection = useCallback(() => setSelectedIds(new Set()), [])

  const toggleSelect = useCallback((id) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === items.length) clearSelection()
    else setSelectedIds(new Set(items.map(i => i.id)))
  }, [items, selectedIds.size, clearSelection])

  const handleAdd = () => {
    const defaults = {}
    config.fields.forEach(f => {
      if (f.type === 'list' || f.type === 'images') defaults[f.key] = []
      else if (f.type === 'colors') defaults[f.key] = []
      else if (f.type === 'kv') defaults[f.key] = {}
      else if (f.type === 'variants') defaults[f.key] = []
      else defaults[f.key] = ''
    })
    defaults.id = `${config.type}-${Date.now()}${Math.random().toString(36).substr(2, 4)}`
    setEditItem(defaults)
    setShowModal(true)
  }

  const handleSave = (item) => {
    if (item.images && item.images.length > 0 && !item.image) {
      item.image = item.images[0]
    }
    if (item.image && (!item.images || item.images.length === 0)) {
      item.images = [item.image]
    }
    const hasImagesField = config.fields.some(f => f.key === 'images')
    if (hasImagesField && (!item.images || item.images.length === 0)) {
      addToast('Peringatan: Gambar produk kosong', 'error')
    }
    const exists = items.find(i => i.id === item.id)
    if (exists) {
      update(config.type, item.id, item)
      saveNow({ [config.type]: data[config.type].map(i => i.id === item.id ? item : i) })
      addToast(`${config.label} diperbarui`, 'success')
    } else {
      add(config.type, item)
      saveNow({ [config.type]: [...(data[config.type] || []), item] })
      addToast(`${config.label} ditambahkan`, 'success')
    }
  }

  const handleDelete = (id) => {
    remove(config.type, id)
    saveNow({ [config.type]: (data[config.type] || []).filter(i => i.id !== id) })
    setConfirmDelete(null)
    addToast(`${config.label} dihapus`, 'success')
  }

  const handleBatchDelete = () => {
    const ids = new Set(selectedIds)
    saveNow({ [config.type]: (data[config.type] || []).filter(i => !ids.has(i.id)) })
    ids.forEach(id => remove(config.type, id))
    const count = selectedIds.size
    clearSelection()
    setConfirmBatchDelete(false)
    addToast(`${count} ${config.label} dihapus`, 'success')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">{items.length} item</p>
          {items.length > 0 && (
            <button onClick={toggleSelectAll} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-honda-red transition-colors">
              {selectedIds.size === items.length ? <FiCheckSquare size={14} className="text-honda-red" /> : <FiSquare size={14} />}
              {selectedIds.size === items.length ? 'Semua' : 'Pilih'}
            </button>
          )}
        </div>
        <button onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-honda-red text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-honda-red/30">
          <FiPlus size={15} /> Tambah
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
        {items.map(item => (
          <CardView key={item.id} item={item} config={config}
            selected={selectedIds.has(item.id)}
            onToggle={toggleSelect}
            onEdit={(it) => { setEditItem(it); setShowModal(true) }}
            onDelete={id => setConfirmDelete(id)} />
        ))}
        {items.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-400 dark:text-gray-500">
            <FiAlertCircle className="mx-auto mb-2" size={24} />
            <p className="text-sm">Klik "Tambah" untuk memulai.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedCount > 0 && (
          <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
            className="sticky bottom-4 mt-4 mx-auto w-fit bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl px-5 py-3 flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
              <span className="font-semibold">{selectedCount}</span> terpilih
            </span>
            <button onClick={clearSelection}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Batal</button>
            <div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />
            <button onClick={() => setConfirmBatchDelete(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white rounded-xl text-xs font-semibold hover:bg-red-600 transition-colors">
              <FiTrash2 size={13} /> Hapus
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModal && <EditModal config={config} item={editItem} onSave={handleSave} onClose={() => { setShowModal(false); setEditItem(null) }} />}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={e => e.target === e.currentTarget && setConfirmDelete(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center">
              <FiAlertCircle className="mx-auto mb-3 text-red-500" size={40} />
              <h3 className="font-poppins font-bold text-gray-900 dark:text-white mb-2">Hapus {config.label}?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Tindakan ini tidak bisa dibatalkan.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setConfirmDelete(null)} className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Batal</button>
                <button onClick={() => handleDelete(confirmDelete)} className="px-5 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors">Hapus</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmBatchDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={e => e.target === e.currentTarget && setConfirmBatchDelete(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center">
              <FiAlertCircle className="mx-auto mb-3 text-red-500" size={40} />
              <h3 className="font-poppins font-bold text-gray-900 dark:text-white mb-2">Hapus {selectedCount} {config.label}?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Tindakan ini tidak bisa dibatalkan.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setConfirmBatchDelete(false)} className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Batal</button>
                <button onClick={handleBatchDelete} className="px-5 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors">Hapus {selectedCount}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
