import { useState, useRef } from 'react'
import { FiUpload, FiImage, FiX, FiAlertCircle } from 'react-icons/fi'
import { compressImage } from '../../utils/compressImage'

export default function ImageFieldInput({ value, onChange }) {
  const [preview, setPreview] = useState(value || '')
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  const handleFile = async (file) => {
    setError('')
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar.')
      return
    }
    try {
      const dataUrl = await compressImage(file)
      setPreview(dataUrl)
      onChange(dataUrl)
    } catch {
      setError('Gagal memproses gambar.')
    }
  }

  const handleRemove = () => {
    setPreview('')
    setError('')
    onChange('')
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  const isBase64 = preview?.startsWith('data:')

  return (
    <div className="space-y-3">
      {preview && (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 rounded-xl object-cover border border-gray-200 dark:border-gray-600"
            onError={() => setError('Gambar tidak dapat dimuat.')}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow"
          >
            <FiX size={14} />
          </button>
          {isBase64 && (
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-green-500 text-white text-[10px] rounded font-medium shadow">
              lokal
            </span>
          )}
        </div>
      )}

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 sm:p-6 text-center cursor-pointer hover:border-honda-red hover:bg-honda-red/5 transition-all"
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files[0])}
          className="hidden"
        />
        <FiImage className="mx-auto mb-2 text-gray-400" size={24} />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {preview ? 'Klik untuk ganti foto' : 'Klik atau drag & drop foto di sini'}
        </p>
        <p className="text-[10px] text-gray-400 mt-1">JPG, PNG, WebP — Dikompres otomatis</p>
      </div>

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <FiAlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  )
}
