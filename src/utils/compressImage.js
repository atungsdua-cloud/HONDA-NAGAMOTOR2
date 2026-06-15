const MAX_DIMENSION = 1000
const QUALITY = 0.8

export function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        let { width, height } = img
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        const format = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
        const dataUrl = canvas.toDataURL(format, QUALITY)
        resolve(dataUrl)
      }
      img.onerror = () => reject(new Error('Gagal memuat gambar'))
      img.src = e.target.result
    }
    reader.onerror = () => reject(new Error('Gagal membaca file'))
    reader.readAsDataURL(file)
  })
}
