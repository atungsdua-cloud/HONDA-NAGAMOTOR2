import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiCheck, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { useData } from '../context/DataContext'
import { getProductWhatsApp } from '../utils/whatsapp'
import useSEO from '../hooks/useSEO'
import PageTransition from '../components/layout/PageTransition'
import SocialShare from '../components/ui/SocialShare'
import ImageLightbox from '../components/ui/ImageLightbox'
import { ProductJsonLd } from '../components/seo/JsonLd'

export default function ProductDetail() {
  const { id } = useParams()
  const { data } = useData()
  const product = data.products.find((p) => p.id === id)
  const images = (product?.images?.length ? product.images : [product?.image]).filter(Boolean)
  const specs = product?.specs || {}
  const features = product?.features || []
  const colors = product?.colors || []
  const [slideIndex, setSlideIndex] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  useEffect(() => { window.scrollTo(0, 0) }, [id])

  useSEO(
    product ? {
      title: product.name,
      description: product.description?.slice(0, 160),
      image: product.image || product.images?.[0],
    } : { title: 'Produk Tidak Ditemukan' }
  )

  const handleLightbox = (val) => {
    if (val === 'next') {
      setLightboxIndex((prev) => (prev + 1) % images.length)
    } else if (val === 'prev') {
      setLightboxIndex((prev) => (prev - 1 + images.length) % images.length)
    } else if (typeof val === 'number') {
      setLightboxIndex(val)
    } else {
      setLightboxIndex(null)
    }
  }

  if (!product) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center bg-light dark:bg-gray-900">
          <div className="text-center px-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Produk Tidak Ditemukan</h2>
            <Link to="/" className="text-honda-red hover:underline">Kembali ke Beranda</Link>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <ProductJsonLd product={product} />
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-500 pt-20" id="main-content">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-honda-red transition-colors">
              <FiArrowLeft size={16} /> Kembali ke Produk
            </Link>
            <SocialShare productName={product.name} />
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer"
                onClick={() => setLightboxIndex(slideIndex)}
              >
                <img
                  key={images[slideIndex] || 'no-img'}
                  src={images[slideIndex]}
                  alt={product.name}
                  onError={(e) => { if (e.target.src !== 'https://placehold.co/800x600?text=No+Image') e.target.src = 'https://placehold.co/800x600?text=No+Image' }}
                  className="w-full h-72 sm:h-96 object-cover"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSlideIndex((prev) => (prev - 1 + images.length) % images.length) }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                      aria-label="Sebelumnya"
                    >
                      <FiChevronLeft size={18} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSlideIndex((prev) => (prev + 1) % images.length) }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                      aria-label="Selanjutnya"
                    >
                      <FiChevronRight size={18} />
                    </button>
                  </>
                )}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setSlideIndex(i) }}
                      className={`w-3 h-3 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                        i === slideIndex ? 'bg-white w-6 sm:w-6' : 'bg-white/50'
                      }`}
                      aria-label={`Gambar ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSlideIndex(i)}
                    className={`flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      i === slideIndex ? 'border-honda-red' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img key={img} src={img} alt="" className="w-full h-full object-cover" loading="lazy" onError={(e) => { e.target.style.display = 'none' }} />
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <span className="inline-block px-3 py-1 bg-honda-red/10 text-honda-red text-xs font-semibold rounded-full mb-3">
                  {product.type}
                </span>
                <h1 className="font-poppins font-bold text-3xl sm:text-4xl text-gray-900 dark:text-white">
                  {product.name}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">{product.tagline}</p>
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{product.description}</p>

              <div className="text-3xl font-poppins font-bold text-honda-red">
                {product.price}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {Object.entries(specs).map(([key, val]) => (
                  <div key={key} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                    <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{key}</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{val}</div>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="font-poppins font-semibold text-gray-900 dark:text-white mb-3">Fitur Unggulan</h3>
                <div className="grid grid-cols-2 gap-2">
                  {features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <FiCheck className="text-green-500 flex-shrink-0" size={14} /> {f}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-poppins font-semibold text-gray-900 dark:text-white mb-3">Pilihan Warna</h3>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <motion.a
                  href={getProductWhatsApp(product.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  className="flex-1 px-6 py-3.5 bg-green-500 text-white rounded-xl font-semibold text-sm hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Tanya via WhatsApp
                </motion.a>
                <Link to="/#kontak"
                  className="flex-1 px-6 py-3.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                >
                  Jadwal Test Drive
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {lightboxIndex !== null && (
          <ImageLightbox
            images={images}
            index={lightboxIndex}
            onClose={handleLightbox}
          />
        )}
      </div>
    </PageTransition>
  )
}
