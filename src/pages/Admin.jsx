import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiDownload, FiUpload, FiRefreshCw, FiPlus, FiTrash2,
  FiAlertCircle, FiImage, FiEdit2, FiX, FiCheckSquare, FiSquare,
  FiChevronUp, FiChevronDown
} from 'react-icons/fi'
import { FaInstagram, FaFacebook, FaTiktok } from 'react-icons/fa'
import AdminLayout from '../components/admin/AdminLayout'
import CrudManager from '../components/admin/CrudManager'
import ImageFieldInput from '../components/ui/ImageFieldInput'
import { useData } from '../context/DataContext'
import { useToast } from '../context/ToastContext'
import { compressImage } from '../utils/compressImage'

const inputClass = "w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-honda-red transition-all"
const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
const btnPrimary = "px-5 py-2.5 bg-honda-red text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors"

const produkConfig = {
  type: 'products',
  label: 'Produk',
  titleField: 'name',
  fields: [
    { key: 'name', label: 'Nama Mobil', type: 'text', placeholder: 'cth: Honda Civic RS 2025' },
    { key: 'tagline', label: 'Tagline', type: 'text', placeholder: 'cth: Lebih dari sekadar mobil' },
    { key: 'price', label: 'Harga', type: 'text', placeholder: 'cth: Rp 400.000.000' },
    { key: 'type', label: 'Tipe', type: 'text', placeholder: 'cth: Sedan / Hatchback / SUV' },
    { key: 'engine', label: 'Mesin', type: 'text', placeholder: 'cth: 1.5L VTEC Turbo' },
    { key: 'fuel', label: 'Konsumsi BBM', type: 'text', placeholder: 'cth: 18 km/l' },
    { key: 'image', label: 'Foto Utama (thumbnail card)', type: 'image' },
    { key: 'images', label: 'Galeri Gambar (tampilan detail)', type: 'images' },
    { key: 'description', label: 'Deskripsi', type: 'textarea', placeholder: 'Tulis deskripsi mobil...' },
    { key: 'specs', label: 'Spesifikasi', type: 'kv' },
    { key: 'colors', label: 'Warna Tersedia', type: 'colors' },
    { key: 'features', label: 'Fitur Unggulan', type: 'list' },
  ],
}

const promoConfig = {
  type: 'promotions',
  label: 'Promo',
  titleField: 'title',
  fields: [
    { key: 'title', label: 'Judul Promo', type: 'text', placeholder: 'cth: DP 0% Honda Brio' },
    { key: 'description', label: 'Deskripsi', type: 'textarea', placeholder: 'Tulis detail promo...' },
    { key: 'image', label: 'Gambar', type: 'image' },
    { key: 'discount', label: 'Diskon', type: 'text', placeholder: 'cth: DP 0% / Cashback 20jt' },
    { key: 'validUntil', label: 'Berlaku Sampai', type: 'text', placeholder: 'cth: 31 Des 2025' },
    { key: 'color', label: 'Warna Gradient', type: 'gradient' },
  ],
}

const testimoniConfig = {
  type: 'testimonials',
  label: 'Testimoni',
  titleField: 'name',
  fields: [
    { key: 'name', label: 'Nama', type: 'text', placeholder: 'cth: Andi Pratama' },
    { key: 'car', label: 'Mobil Dibeli', type: 'text', placeholder: 'cth: Honda CR-V 2025' },
    { key: 'photo', label: 'Foto', type: 'image' },
    { key: 'text', label: 'Ulasan', type: 'textarea', placeholder: 'Tulis testimoni...' },
    { key: 'rating', label: 'Rating', type: 'number', placeholder: '1 - 5' },
  ],
}

const faqConfig = {
  type: 'faqs',
  label: 'FAQ',
  titleField: 'question',
  fields: [
    { key: 'question', label: 'Pertanyaan', type: 'text', placeholder: 'cth: Apa saja promo terbaru?' },
    { key: 'answer', label: 'Jawaban', type: 'textarea', placeholder: 'Tulis jawaban...' },
  ],
}

const keunggulanConfig = {
  type: 'advantages',
  label: 'Keunggulan',
  titleField: 'title',
  fields: [
    { key: 'icon', label: 'Nama Icon', type: 'text', placeholder: 'cth: BsLightningCharge' },
    { key: 'title', label: 'Judul', type: 'text', placeholder: 'cth: Respon Cepat' },
    { key: 'description', label: 'Deskripsi', type: 'textarea', placeholder: 'Tulis deskripsi keunggulan...' },
  ],
}

function StatsBuilder({ items, onChange }) {
  const addItem = () => onChange([...items, { icon: 'FiStar', value: '', label: '' }])
  const removeItem = (i) => onChange(items.filter((_, idx) => idx !== i))
  const updateItem = (i, key, val) => {
    const next = [...items]
    next[i] = { ...next[i], [key]: val }
    onChange(next)
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
          <input type="text" value={item.icon} onChange={e => updateItem(i, 'icon', e.target.value)}
            placeholder="Icon" className="w-20 px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs font-mono outline-none focus:ring-2 focus:ring-honda-red" />
          <input type="text" value={item.value} onChange={e => updateItem(i, 'value', e.target.value)}
            placeholder="Value (500+)" className="w-24 px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-honda-red" />
          <input type="text" value={item.label} onChange={e => updateItem(i, 'label', e.target.value)}
            placeholder="Label" className="flex-1 px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-honda-red" />
          <button onClick={() => removeItem(i)} className="p-1 text-red-400 hover:text-red-600"><FiX size={16} /></button>
        </div>
      ))}
      <button onClick={addItem} className="text-xs text-honda-red hover:underline flex items-center gap-1">
        <FiPlus size={12} /> Tambah Statistik
      </button>
    </div>
  )
}

function AdminDashboard() {
  const { data, resetAll } = useData()
  const totalItems = data.products.length + data.promotions.length + data.testimonials.length + data.gallery.length + data.faqs.length + data.advantages.length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {[
          { label: 'Produk', count: data.products.length, color: 'bg-blue-500' },
          { label: 'Promo', count: data.promotions.length, color: 'bg-red-500' },
          { label: 'Testimoni', count: data.testimonials.length, color: 'bg-yellow-500' },
          { label: 'Galeri', count: data.gallery.length, color: 'bg-purple-500' },
          { label: 'FAQ', count: data.faqs.length, color: 'bg-green-500' },
          { label: 'Keunggulan', count: data.advantages.length, color: 'bg-indigo-500' },
        ].map((item) => (
          <div key={item.label} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className={`w-3 h-3 rounded-full ${item.color} mb-2`} />
            <div className="text-2xl font-poppins font-bold text-gray-900 dark:text-white">{item.count}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="font-poppins font-bold text-gray-900 dark:text-white mb-4">Informasi</h3>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p>Total konten: <strong>{totalItems}</strong> item</p>
          <p>Semua data disimpan di <strong>localStorage</strong> browser Anda.</p>
          <p className="text-yellow-600 dark:text-yellow-400 flex items-start gap-2">
            <FiAlertCircle className="mt-0.5 flex-shrink-0" size={16} />
            Data bersifat lokal per browser. Gunakan fitur Export/Import untuk backup.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button onClick={() => { if (window.confirm('Reset semua data ke default?')) resetAll() }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <FiRefreshCw size={14} /> Reset Default
          </button>
        </div>
      </div>

      <AdminDataTools />
    </div>
  )
}

function AdminDataTools() {
  const { exportData, importData } = useData()
  const { addToast } = useToast()
  const [importText, setImportText] = useState('')
  const [showImport, setShowImport] = useState(false)

  const handleExport = () => {
    const json = exportData()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `honda-cms-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    addToast('File backup berhasil di-download!', 'success')
  }

  const handleImport = () => {
    if (!importText.trim()) return
    if (importData(importText)) {
      addToast('Data berhasil di-import!', 'success')
      setImportText('')
      setShowImport(false)
    } else {
      addToast('Format JSON tidak valid!', 'error')
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="font-poppins font-bold text-gray-900 dark:text-white mb-4">Tools Data</h3>
      <div className="flex flex-wrap gap-3">
        <button onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 bg-honda-red text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors">
          <FiDownload size={16} /> Export JSON
        </button>
        <button onClick={() => setShowImport(!showImport)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          <FiUpload size={16} /> Import JSON
        </button>
      </div>
      {showImport && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 space-y-3">
          <textarea value={importText} onChange={e => setImportText(e.target.value)}
            placeholder="Tempel JSON di sini..."
            className="w-full h-32 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm font-mono text-gray-900 dark:text-white resize-none outline-none focus:ring-2 focus:ring-honda-red" />
          <button onClick={handleImport} className={btnPrimary}>Import Data</button>
        </motion.div>
      )}
    </div>
  )
}

function AdminHero() {
  const { data, updateHero } = useData()
  const { addToast } = useToast()
  const [form, setForm] = useState({ ...data.hero })

  useEffect(() => { setForm({ ...data.hero }) }, [data.hero])

  const handleSave = () => { updateHero(form); addToast('Hero berhasil diperbarui', 'success') }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
      <div className="space-y-4 max-w-2xl">
        <div>
          <label className={labelClass}>Judul Utama</label>
          <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Sub Judul</label>
          <textarea rows={2} value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} className={`${inputClass} resize-none`} />
        </div>
        <div>
          <label className={labelClass}>Foto Sales (PNG)</label>
          <div className="flex gap-2">
            <input type="text" value={form.salesPhoto || data.profile.photo} onChange={e => setForm({ ...form, salesPhoto: e.target.value })} className={inputClass} placeholder="URL foto sales (kosongkan untuk pakai foto profil)" />
          </div>
          <p className="text-xs text-gray-400 mt-1">Kosongkan untuk menggunakan foto dari Profil Sales</p>
        </div>
        <div>
          <label className={labelClass}>Statistik</label>
          <StatsBuilder items={form.stats || []} onChange={stats => setForm({ ...form, stats })} />
        </div>
        <button onClick={handleSave} className={btnPrimary}>Simpan Hero</button>
      </div>
    </div>
  )
}

function AdminProfile() {
  const { data, updateProfile } = useData()
  const { addToast } = useToast()
  const [form, setForm] = useState({ ...data.profile })

  useEffect(() => { setForm({ ...data.profile }) }, [data.profile])

  const handleSave = () => { updateProfile(form); addToast('Profil berhasil diperbarui', 'success') }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
      <div className="space-y-4 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Nama</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Jabatan</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={inputClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Pengalaman</label>
          <input type="text" value={form.experience || ''} onChange={e => setForm({ ...form, experience: e.target.value })} className={inputClass} placeholder="Contoh: 10 Tahun Pengalaman" />
        </div>
        <div>
          <label className={labelClass}>Foto</label>
          <ImageFieldInput value={form.photo} onChange={val => setForm({ ...form, photo: val })} />
        </div>
        <div>
          <label className={labelClass}>Deskripsi</label>
          <textarea rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={`${inputClass} resize-none`} />
        </div>
        <div>
          <label className={labelClass}>Statistik</label>
          <StatsBuilder items={form.stats || []} onChange={stats => setForm({ ...form, stats })} />
        </div>
        <button onClick={handleSave} className={btnPrimary}>Simpan Profil</button>
      </div>
    </div>
  )
}

function AdminGaleri() {
  const { data, add, remove, update } = useData()
  const { addToast } = useToast()
  const [items, setItems] = useState(data.gallery || [])
  const [editItem, setEditItem] = useState(null)
  const [showEdit, setShowEdit] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [confirmBatchDelete, setConfirmBatchDelete] = useState(false)
  const [selectedIds, setSelectedIds] = useState(new Set())

  useEffect(() => { setItems(data.gallery || []) }, [data.gallery])

  const selectedCount = selectedIds.size

  const clearSelection = () => setSelectedIds(new Set())

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === items.length) clearSelection()
    else setSelectedIds(new Set(items.map(i => i.id)))
  }

  const handleMultiUpload = async (files) => {
    const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (validFiles.length === 0) return
    let loaded = 0
    let failed = 0
    for (const file of validFiles) {
      try {
        const compressed = await compressImage(file)
        add('gallery', { src: compressed, alt: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ') })
        loaded++
      } catch { failed++; addToast(`Gagal memproses ${file.name}`, 'error') }
    }
    if (loaded > 0) addToast(`${loaded} gambar berhasil ditambahkan${failed > 0 ? `, ${failed} gagal` : ''}`, failed > 0 ? 'info' : 'success')
  }

  const handleDrop = (e) => { e.preventDefault(); handleMultiUpload(e.dataTransfer.files) }

  const handleEditSave = (form) => { update('gallery', form.id, form); setShowEdit(false); setEditItem(null); addToast('Gambar berhasil diperbarui', 'success') }
  const handleDelete = (id) => { remove('gallery', id); setConfirmDelete(null); addToast('Gambar berhasil dihapus', 'success') }

  const handleBatchDelete = () => {
    selectedIds.forEach(id => remove('gallery', id))
    const count = selectedIds.size
    clearSelection()
    setConfirmBatchDelete(false)
    addToast(`${count} gambar berhasil dihapus`, 'success')
  }

  return (
    <div className="space-y-6">
      <div onDragOver={e => e.preventDefault()} onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 sm:p-12 text-center cursor-pointer hover:border-honda-red hover:bg-honda-red/5 transition-all">
        <input type="file" multiple accept="image/*" onChange={e => handleMultiUpload(e.target.files)} className="hidden" id="multi-upload" />
        <label htmlFor="multi-upload" className="cursor-pointer">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <FiImage className="text-gray-400" size={28} />
          </div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Klik untuk pilih banyak gambar atau drag & drop</p>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — Dikompres otomatis</p>
        </label>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">{items.length} gambar</p>
          {items.length > 0 && (
            <button onClick={toggleSelectAll} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-honda-red transition-colors">
              {selectedIds.size === items.length ? <FiCheckSquare size={14} className="text-honda-red" /> : <FiSquare size={14} />}
              {selectedIds.size === items.length ? 'Semua' : 'Pilih'}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {items.map((item) => (
          <div key={item.id} className="group relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-square">
            <button onClick={() => toggleSelect(item.id)}
              className={`absolute top-2 left-2 z-10 p-1 rounded-md transition-all ${
                selectedIds.has(item.id)
                  ? 'bg-honda-red text-white'
                  : 'bg-black/40 text-white/70 hover:bg-black/60 opacity-0 group-hover:opacity-100'
              }`}>
              {selectedIds.has(item.id) ? <FiCheckSquare size={16} /> : <FiSquare size={16} />}
            </button>
            <img src={item.src} alt={item.alt} className="w-full h-full object-cover"
              onError={e => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect fill="%23eee" width="400" height="400"/><text x="50%" y="50%" fill="%23999" font-size="16" text-anchor="middle" dy=".3em">Error</text></svg>' }} />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button onClick={() => { setEditItem(item); setShowEdit(true) }}
                className="p-2 bg-white rounded-full text-gray-700 hover:bg-honda-red hover:text-white transition-all"><FiEdit2 size={16} /></button>
              <button onClick={() => setConfirmDelete(item.id)}
                className="p-2 bg-white rounded-full text-gray-700 hover:bg-red-500 hover:text-white transition-all"><FiTrash2 size={16} /></button>
            </div>
            <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-xs text-white truncate">{item.alt}</p>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-400 dark:text-gray-500">
            <FiAlertCircle className="mx-auto mb-2" size={24} />
            <p className="text-sm">Belum ada gambar. Upload gambar di atas.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedCount > 0 && (
          <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
            className="sticky bottom-4 mx-auto w-fit bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl px-5 py-3 flex items-center gap-4">
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
        {showEdit && editItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={e => e.target === e.currentTarget && setShowEdit(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-poppins font-bold text-gray-900 dark:text-white">Edit Gambar</h3>
                <button onClick={() => setShowEdit(false)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <FiX size={18} className="text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                <ImageFieldInput value={editItem.src} onChange={val => setEditItem({ ...editItem, src: val })} />
                <div>
                  <label className={labelClass}>Keterangan</label>
                  <input type="text" value={editItem.alt} onChange={e => setEditItem({ ...editItem, alt: e.target.value })} className={inputClass} />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button onClick={() => setShowEdit(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Batal</button>
                <button onClick={() => handleEditSave(editItem)} className={btnPrimary}>Simpan</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={e => e.target === e.currentTarget && setConfirmDelete(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center">
              <FiAlertCircle className="mx-auto mb-3 text-red-500" size={40} />
              <h3 className="font-poppins font-bold text-gray-900 dark:text-white mb-2">Hapus Gambar?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Tindakan ini tidak bisa dibatalkan.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Batal</button>
                <button onClick={() => handleDelete(confirmDelete)}
                  className="px-5 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors">Hapus</button>
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
              <h3 className="font-poppins font-bold text-gray-900 dark:text-white mb-2">Hapus {selectedCount} Gambar?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Tindakan ini tidak bisa dibatalkan.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setConfirmBatchDelete(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Batal</button>
                <button onClick={handleBatchDelete}
                  className="px-5 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors">Hapus {selectedCount}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function AdminNavbar() {
  const { data, updateNavbar } = useData()
  const { addToast } = useToast()
  const [form, setForm] = useState({ ...data.navbar, loading: { ...data.loading } })

  useEffect(() => { setForm({ ...data.navbar, loading: { ...data.loading } }) }, [data.navbar, data.loading])

  const handleSave = () => {
    const { menuItems, logoImage, logoText, logoSubtext, ctaText, ctaUrl, loading } = form
    updateNavbar({ menuItems, logoImage, logoText, logoSubtext, ctaText, ctaUrl, loading })
    addToast('Berhasil disimpan', 'success')
  }
  const addMenuItem = () => setForm(prev => ({ ...prev, menuItems: [...prev.menuItems, { label: '', section: '' }] }))
  const removeMenuItem = (i) => setForm(prev => ({ ...prev, menuItems: prev.menuItems.filter((_, idx) => idx !== i) }))
  const updateMenuItem = (i, field, value) => setForm(prev => {
    const items = [...prev.menuItems]; items[i] = { ...items[i], [field]: value }; return { ...prev, menuItems: items }
  })
  const moveMenuItem = (i, dir) => setForm(prev => {
    const items = [...prev.menuItems]; const t = i + dir
    if (t < 0 || t >= items.length) return prev
    ;[items[i], items[t]] = [items[t], items[i]]; return { ...prev, menuItems: items }
  })

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="font-poppins font-bold text-gray-900 dark:text-white mb-4">Pengaturan Brand</h3>
        <div className="space-y-4 max-w-2xl">
          <div>
            <label className={labelClass}>Logo Gambar (opsional)</label>
            <ImageFieldInput
              value={form.logoImage || ''}
              onChange={(val) => setForm({ ...form, logoImage: val })}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Logo Teks</label>
              <input type="text" value={form.logoText} onChange={e => setForm({ ...form, logoText: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Subteks Logo</label>
              <input type="text" value={form.logoSubtext} onChange={e => setForm({ ...form, logoSubtext: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Teks Tombol CTA</label>
            <input type="text" value={form.ctaText} onChange={e => setForm({ ...form, ctaText: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>URL Tombol CTA (opsional, default WhatsApp)</label>
            <input type="text" value={form.ctaUrl || ''} onChange={e => setForm({ ...form, ctaUrl: e.target.value })} className={inputClass} placeholder="cth: https://wa.me/62812..." />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="font-poppins font-bold text-gray-900 dark:text-white mb-4">Loading Screen</h3>
        <div className="space-y-4 max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Judul</label>
              <input type="text" value={form.loading?.title || ''} onChange={e => setForm({ ...form, loading: { ...form.loading, title: e.target.value } })} className={inputClass} placeholder="HONDA" />
            </div>
            <div>
              <label className={labelClass}>Subteks</label>
              <input type="text" value={form.loading?.subtext || ''} onChange={e => setForm({ ...form, loading: { ...form.loading, subtext: e.target.value } })} className={inputClass} placeholder="NAGAMOTOR" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Tagline</label>
            <input type="text" value={form.loading?.tagline || ''} onChange={e => setForm({ ...form, loading: { ...form.loading, tagline: e.target.value } })} className={inputClass} placeholder="Dealer Resmi Honda" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-poppins font-bold text-gray-900 dark:text-white">Menu Item</h3>
          <button onClick={addMenuItem} className="flex items-center gap-1.5 px-3 py-1.5 bg-honda-red text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors">
            <FiPlus size={14} /> Tambah
          </button>
        </div>
        <div className="space-y-2">
          {form.menuItems.map((item, i) => (
            <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
              <div className="flex flex-col gap-0.5">
                <button onClick={() => moveMenuItem(i, -1)} disabled={i === 0}
                  className="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"><FiChevronUp size={14} /></button>
                <button onClick={() => moveMenuItem(i, 1)} disabled={i === form.menuItems.length - 1}
                  className="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"><FiChevronDown size={14} /></button>
              </div>
              <input type="text" value={item.label} onChange={e => updateMenuItem(i, 'label', e.target.value)}
                placeholder="Label menu" className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-honda-red" />
              <input type="text" value={item.section} onChange={e => updateMenuItem(i, 'section', e.target.value)}
                placeholder="ID section" className="w-36 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-honda-red" />
              <button onClick={() => removeMenuItem(i)}
                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><FiTrash2 size={16} /></button>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleSave} className={btnPrimary}>Simpan Navbar</button>
    </div>
  )
}

const socialIconOptions = [
  { value: 'FaInstagram', label: 'Instagram', icon: FaInstagram },
  { value: 'FaFacebook', label: 'Facebook', icon: FaFacebook },
  { value: 'FaTiktok', label: 'TikTok', icon: FaTiktok },
]

function AdminContact() {
  const { data, updateContact } = useData()
  const { addToast } = useToast()
  const [form, setForm] = useState({ ...data.contact })

  useEffect(() => { setForm({ ...data.contact }) }, [data.contact])

  const updateField = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const updateSocial = (i, key, value) => {
    setForm(prev => {
      const updated = [...(prev.socialMedia || [])]
      updated[i] = { ...updated[i], [key]: value }
      return { ...prev, socialMedia: updated }
    })
  }

  const addSocial = () => {
    setForm(prev => ({
      ...prev,
      socialMedia: [...(prev.socialMedia || []), { platform: '', url: '', icon: 'FaInstagram' }],
    }))
  }

  const removeSocial = (i) => {
    setForm(prev => ({
      ...prev,
      socialMedia: prev.socialMedia.filter((_, idx) => idx !== i),
    }))
  }

  const handleSave = () => { updateContact(form); addToast('Kontak berhasil diperbarui', 'success') }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h3 className="font-poppins font-semibold text-gray-900 dark:text-white text-lg mb-4">Informasi Kontak</h3>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Nomor Telepon</label>
            <input type="text" value={form.phone || ''} onChange={e => updateField('phone', e.target.value)} placeholder="+62 812 3456 7890" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" value={form.email || ''} onChange={e => updateField('email', e.target.value)} placeholder="sales@hondanagamotor.com" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Alamat</label>
            <input type="text" value={form.address || ''} onChange={e => updateField('address', e.target.value)} placeholder="Jakarta Selatan, Indonesia" className={inputClass} />
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-poppins font-semibold text-gray-900 dark:text-white text-lg mb-4">Peta Lokasi</h3>
        <div>
          <label className={labelClass}>Embed URL Google Maps</label>
          <textarea rows={3} value={form.mapUrl || ''} onChange={e => updateField('mapUrl', e.target.value)} placeholder="https://www.google.com/maps/embed?pb=..." className={inputClass} />
          <p className="text-xs text-gray-400 mt-1.5">Salin URL embed dari Google Maps &mdash; Share &rarr; Embed a map &rarr; Copy HTML, ambil value src</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-poppins font-semibold text-gray-900 dark:text-white text-lg">Media Sosial</h3>
          <button onClick={addSocial} className="flex items-center gap-1.5 px-3 py-1.5 bg-honda-red text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors"><FiPlus size={14} /> Tambah</button>
        </div>
        <div className="space-y-3">
          {(form.socialMedia || []).map((item, i) => (
            <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
              <select value={item.icon || 'FaInstagram'} onChange={e => updateSocial(i, 'icon', e.target.value)}
                className="px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-honda-red">
                {socialIconOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <input type="text" value={item.platform} onChange={e => updateSocial(i, 'platform', e.target.value)}
                placeholder="Nama platform" className="flex-1 min-w-0 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-honda-red" />
              <input type="text" value={item.url} onChange={e => updateSocial(i, 'url', e.target.value)}
                placeholder="URL" className="flex-1 min-w-0 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-honda-red" />
              <button onClick={() => removeSocial(i)}
                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0"><FiTrash2 size={16} /></button>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleSave} className={btnPrimary}>Simpan Kontak</button>
    </div>
  )
}

export default function Admin() {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="hero" element={<AdminHero />} />
        <Route path="navbar" element={<AdminNavbar />} />
        <Route path="produk" element={<CrudManager config={produkConfig} />} />
        <Route path="promo" element={<CrudManager config={promoConfig} />} />
        <Route path="testimoni" element={<CrudManager config={testimoniConfig} />} />
        <Route path="galeri" element={<AdminGaleri />} />
        <Route path="faq" element={<CrudManager config={faqConfig} />} />
        <Route path="keunggulan" element={<CrudManager config={keunggulanConfig} />} />
        <Route path="profil" element={<AdminProfile />} />
        <Route path="kontak" element={<AdminContact />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  )
}
