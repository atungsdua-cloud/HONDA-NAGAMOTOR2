import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiArrowLeft, FiCheck, FiChevronLeft, FiChevronRight,
  FiCpu, FiZap, FiActivity, FiRepeat,
  FiStar, FiX, FiHeadphones,
} from 'react-icons/fi'
import { useData } from '../context/DataContext'
import { getProductWhatsApp } from '../utils/whatsapp'
import useSEO from '../hooks/useSEO'
import PageTransition from '../components/layout/PageTransition'
import SocialShare from '../components/ui/SocialShare'
import ImageLightbox from '../components/ui/ImageLightbox'
import { ProductJsonLd } from '../components/seo/JsonLd'

const NAV_H = 'top-0 lg:top-[72px]'
const NAV_PT = 'lg:pt-[72px]'

const specIcons = {
  mesin: FiCpu, tenaga: FiZap, torsi: FiActivity, transmisi: FiRepeat,
}
const keySpecKeys = ['mesin', 'tenaga', 'torsi', 'transmisi']

function formatSpecLabel(key) {
  const map = {
    mesin: 'Mesin', tenaga: 'Tenaga', torsi: 'Torsi', transmisi: 'Transmisi',
    panjang: 'Panjang', lebar: 'Lebar', tinggi: 'Tinggi', kapasitas: 'Kapasitas',
  }
  return map[key] || key
}

const defaultTheme = { accent: '#E00000', badge: '', heroSize: 'min-h-[75vh]', heroGrad: 'from-gray-900 via-gray-800 to-black', whyTitle: '', whyItems: [] }

function SpecBadge({ label, value, Icon, accent }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
        {Icon && <Icon size={16} className="text-white" />}
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wider text-gray-400">{label}</div>
        <div className="text-sm font-semibold text-white">{value}</div>
      </div>
    </div>
  )
}

function VariantCard({ variant, index, engine, fuel, accent, productName, variantsCount }) {
  return (
    <div className="relative p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all group">
      <div className="absolute top-3 right-3 px-2 py-1 rounded-md text-[10px] font-bold uppercase"
        style={{ backgroundColor: accent, color: '#000' }}>
        {variantsCount === 1 ? '' : index === 0 ? 'Entry' : index === 1 ? 'Tertinggi' : 'Varian'}
      </div>
      <h3 className="font-poppins font-bold text-lg text-gray-900 dark:text-white">{variant.name}</h3>
      <div className="mt-2">
        <span className="text-2xl font-poppins font-bold" style={{ color: accent }}>{variant.price}</span>
      </div>
      <div className="mt-4 space-y-1.5 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2"><FiCpu size={14} /> {engine}</div>
        <div className="flex items-center gap-2"><FiZap size={14} /> {fuel}</div>
      </div>
      <a href={getProductWhatsApp(`${productName} ${variant.name}`)} target="_blank" rel="noopener noreferrer"
        className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold text-center block transition-all hover:opacity-90"
        style={{ backgroundColor: accent, color: '#000' }}>
        Tanya Varian Ini
      </a>
    </div>
  )
}

function SectionTitle({ children, accent }) {
  return (
    <h2 className="font-poppins font-bold text-2xl text-gray-900 dark:text-white mb-4">
      {children}
    </h2>
  )
}

function FeaturedImage({ images, slideIndex, setSlideIndex, onImageClick }) {
  useEffect(() => {
    if (images.length <= 1) return
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [images.length, setSlideIndex])

  if (!images.length) return null

  return (
    <section className="bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden bg-gray-200 dark:bg-gray-800 cursor-pointer group shadow-xl"
          onClick={() => onImageClick(slideIndex)}
        >
          <img
            key={images[slideIndex] || 'no-img'}
            src={images[slideIndex]}
            alt=""
            className="w-full h-[50vh] sm:h-[60vh] lg:h-[70vh] object-cover transition-transform duration-700 group-hover:scale-105"
            data-fallback="https://placehold.co/1200x800?text=No+Image"
            onError={(e) => { e.target.onerror = null; e.target.src = e.target.dataset.fallback || 'https://placehold.co/1200x800?text=No+Image'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          {images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); setSlideIndex((prev) => (prev - 1 + images.length) % images.length) }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                aria-label="Sebelumnya"><FiChevronLeft size={20} /></button>
              <button onClick={(e) => { e.stopPropagation(); setSlideIndex((prev) => (prev + 1) % images.length) }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                aria-label="Selanjutnya"><FiChevronRight size={20} /></button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button key={i} onClick={(e) => { e.stopPropagation(); setSlideIndex(i) }}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === slideIndex ? 'bg-white w-7' : 'bg-white/50 hover:bg-white/80'}`}
                    aria-label={`Gambar ${i + 1}`} />
                ))}
              </div>
              <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/40 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                {slideIndex + 1} / {images.length}
              </div>
            </>
          )}
        </motion.div>

        {images.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide justify-center">
            {images.map((img, i) => (
              <button key={i} onClick={() => setSlideIndex(i)}
                className={`flex-shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden border-2 transition-all ${
                  i === slideIndex ? 'border-honda-red ring-1 ring-honda-red/30 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'
                }`}>
                <img src={img} alt="" className="w-full h-full object-cover" loading="lazy"
                  data-fallback="https://placehold.co/160x112?text=No+Image"
                  onError={(e) => { e.target.onerror = null; e.target.src = e.target.dataset.fallback || 'https://placehold.co/160x112?text=No+Image'; }} />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function ImageGallery({ images, onImageClick, accent }) {
  if (!images.length) return null
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <SectionTitle accent={accent}>Galeri Foto</SectionTitle>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((img, i) => (
          <button key={i} onClick={() => onImageClick(i)}
            className="relative rounded-2xl overflow-hidden aspect-[4/3] group cursor-pointer bg-gray-100 dark:bg-gray-700">
            <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              data-fallback="https://placehold.co/600x450?text=Foto"
              onError={(e) => { e.target.onerror = null; e.target.src = e.target.dataset.fallback || 'https://placehold.co/600x450?text=Foto'; }} />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
                <FiChevronRight size={18} className="text-gray-900" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  )
}

function HeroLayout({ product, keySpecs, theme }) {
  return (
    <section className={`relative ${theme.heroSize || 'min-h-[75vh]'} flex items-end bg-gradient-to-b ${theme.heroGrad || 'from-gray-900 via-gray-800 to-black'} overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold mb-4">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.accent }} />
            {product.type}{theme.badge ? ` — ${theme.badge}` : ''}
          </div>
          <h1 className="font-poppins font-black text-4xl sm:text-5xl lg:text-7xl text-white leading-[1.1] max-w-4xl">
            {product.name}
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mt-4 max-w-xl">{product.tagline}</p>
          <div className="flex flex-wrap gap-4 sm:gap-8 mt-8">
            {keySpecs.slice(0, 3).map((s) => (
              <SpecBadge key={s.label} {...s} accent={theme.accent} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function FeatureItem({ feature, accent }) {
  return (
    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/40">
      <div className="w-6 h-6 mt-0.5 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${accent}20` }}>
        <FiCheck size={12} style={{ color: accent }} />
      </div>
      <span className="text-sm text-gray-700 dark:text-gray-300 leading-snug">{feature}</span>
    </div>
  )
}

function SpecGrid({ specs, accent }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {Object.entries(specs).map(([key, val]) => (
        <div key={key} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/40">
          <div className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">{formatSpecLabel(key)}</div>
          <div className="text-sm font-semibold text-gray-900 dark:text-white leading-snug">{val}</div>
        </div>
      ))}
    </div>
  )
}

function StickyBar({ product, theme }) {
  return (
    <div className={`sticky ${NAV_H} z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">Mulai dari</span>
          <span className="text-xl sm:text-2xl font-poppins font-bold" style={{ color: theme.accent }}>
            {product.variants?.[0]?.price || product.price}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a href={getProductWhatsApp(product.name)} target="_blank" rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: theme.accent, color: '#000' }}>
            <FiHeadphones size={14} />
            Minta Penawaran
          </a>
        </div>
      </div>
    </div>
  )
}

function Sidebar({ product, theme }) {
  return (
    <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
      <div className="p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60">
        <h3 className="font-poppins font-bold text-lg text-gray-900 dark:text-white mb-4">Ringkasan</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Mulai dari</span>
            <span className="font-bold" style={{ color: theme.accent }}>{product.variants?.[0]?.price || product.price}</span>
          </div>
          {product.variants?.[1] && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Varian tertinggi</span>
              <span className="font-bold text-gray-900 dark:text-white">{product.variants[1].price}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Tipe</span>
            <span className="font-medium text-gray-900 dark:text-white">{product.type}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Mesin</span>
            <span className="font-medium text-gray-900 dark:text-white">{product.engine}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Konsumsi</span>
            <span className="font-medium text-gray-900 dark:text-white">{product.fuel}</span>
          </div>
        </div>
        <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2.5">
          <p className="text-xs text-gray-400">
            Cicilan mulai Rp {(parseInt(String(product.variants?.[0]?.price || product.price || '0').replace(/\D/g, '')) / 60 / 1000000).toFixed(1)} Juta/bln*
          </p>
          <a href={getProductWhatsApp(product.name)} target="_blank" rel="noopener noreferrer"
            className="block w-full py-3 rounded-xl text-sm font-bold text-center transition-all hover:opacity-90"
            style={{ backgroundColor: theme.accent, color: '#000' }}>
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Konsultasi via WhatsApp
            </span>
          </a>
          <Link to="/#kontak"
            className="block w-full py-3 rounded-xl text-sm font-semibold text-center bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all">
            Jadwal Test Drive
          </Link>
        </div>
      </div>
      <div className="p-5 rounded-2xl text-center" style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}88)`, color: '#000' }}>
        <div className="text-xs uppercase tracking-widest font-semibold opacity-70">DP Ringan</div>
        <div className="text-2xl font-poppins font-black mt-1">Mulai 0%</div>
        <div className="text-sm mt-1 opacity-80">Syarat mudah, proses cepat</div>
      </div>
    </div>
  )
}

function WhySection({ theme }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="p-6 sm:p-8 rounded-2xl border-2 border-dashed"
      style={{ borderColor: `${theme.accent}40`, backgroundColor: `${theme.accent}08` }}>
      <SectionTitle accent={theme.accent}>{theme.whyTitle}</SectionTitle>
      <div className="grid sm:grid-cols-2 gap-4">
        {theme.whyItems.map(({ label, desc }, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${theme.accent}20` }}>
              <FiStar size={16} style={{ color: theme.accent }} />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">{label}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function StickyBottomCTA({ product, theme }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-700 px-4 py-3 safe-area-bottom">
      <div className="flex gap-3 max-w-lg mx-auto">
        <a href={getProductWhatsApp(product.name)} target="_blank" rel="noopener noreferrer"
          className="flex-1 px-4 py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-lg"
          style={{ backgroundColor: theme.accent, color: '#000' }}>
          <FiHeadphones size={14} />
          Minta Penawaran
        </a>
        <Link to="/#kontak"
          className="flex-1 px-4 py-3 bg-honda-red text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2">
          Test Drive
        </Link>
      </div>
    </div>
  )
}

function CustomHeroLayout({ product, keySpecs, theme }) {
  return (
    <HeroLayout product={product} keySpecs={keySpecs} theme={theme} />
  )
}

function renderCustomLayout(product, images, specs, features, colors, keySpecs, _detailSpecs, slideIndex, setSlideIndex, lightboxIndex, handleLightbox, related, theme) {

  return (
    <PageTransition>
      <ProductJsonLd product={product} />
      <Link to="/" className="fixed top-4 left-4 z-50 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-lg flex items-center justify-center hover:scale-105 transition-transform">
        <FiArrowLeft size={16} className="text-gray-700 dark:text-gray-300" />
      </Link>

      <CustomHeroLayout product={product} keySpecs={keySpecs} theme={theme} />

      <StickyBar product={product} theme={theme} />

      <FeaturedImage images={images} slideIndex={slideIndex} setSlideIndex={setSlideIndex}
        onImageClick={(i) => handleLightbox(i)} />

      <div className="bg-white dark:bg-gray-900" id="main-content">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">

          <ImageGallery images={images} onImageClick={(i) => handleLightbox(i)} accent={theme.accent} />

          <div className="grid lg:grid-cols-5 gap-10 lg:gap-16">
            <div className="lg:col-span-3 space-y-10">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <SectionTitle accent={theme.accent}>Tentang {product.name}</SectionTitle>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{product.description}</p>
              </motion.div>

              {(product.variants || []).length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <SectionTitle accent={theme.accent}>Pilih Varian</SectionTitle>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {product.variants.map((v, vi) => (
                      <VariantCard key={vi} variant={v} index={vi} variantsCount={product.variants.length}
                        engine={product.engine} fuel={product.fuel} accent={theme.accent} productName={product.name} />
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <SectionTitle accent={theme.accent}>Spesifikasi</SectionTitle>
                <SpecGrid specs={specs} accent={theme.accent} />
              </motion.div>

              {features.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <SectionTitle accent={theme.accent}>
                    <span className="flex items-center gap-2">
                      <FiStar className="text-yellow-500" size={20} />
                      Fitur Unggulan
                    </span>
                  </SectionTitle>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {features.map((f, i) => (
                      <FeatureItem key={i} feature={f} accent={theme.accent} />
                    ))}
                  </div>
                </motion.div>
              )}

              {colors.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <SectionTitle accent={theme.accent}>Pilihan Warna</SectionTitle>
                  <div className="flex flex-wrap gap-4">
                    {colors.map((color, i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 transition-transform hover:scale-110 shadow-md"
                          style={{ backgroundColor: color, '--tw-ring-color': color === '#FFFFFF' ? '#D1D5DB' : color }} />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              <WhySection theme={theme} />
            </div>

            <div className="lg:col-span-2">
              <Sidebar product={product} theme={theme} />
            </div>
          </div>
        </div>
      </div>

      <StickyBottomCTA product={product} theme={theme} />

      {lightboxIndex !== null && (
        <ImageLightbox images={images} index={lightboxIndex} onClose={handleLightbox} />
      )}
    </PageTransition>
  )
}

function renderStandardLayout(product, images, specs, features, colors, keySpecs, detailSpecs, slideIndex, setSlideIndex, lightboxIndex, handleLightbox, related) {
  return (
    <PageTransition>
      <ProductJsonLd product={product} />
      <div className={`min-h-screen bg-white dark:bg-gray-900 transition-colors duration-500 ${NAV_PT}`} id="main-content">
        <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky ${NAV_H} z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-honda-red transition-colors group">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-honda-red/10 transition-colors">
                  <FiArrowLeft size={14} />
                </div>
                <span className="hidden sm:inline">Kembali</span>
              </Link>
              <div className="flex items-center gap-3">
                <nav className="text-xs text-gray-400 hidden sm:flex items-center gap-1.5">
                  <Link to="/" className="hover:text-honda-red transition-colors">Beranda</Link>
                  <span>/</span>
                  <Link to="/#produk" className="hover:text-honda-red transition-colors">Produk</Link>
                  <span>/</span>
                  <span className="text-gray-700 dark:text-gray-200 font-medium">{product.name}</span>
                </nav>
                <SocialShare productName={product.name} />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:sticky lg:top-28 lg:self-start">
              <div className="relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer group"
                onClick={() => setLightboxIndex(slideIndex)}>
                <img key={images[slideIndex] || 'no-img'} src={images[slideIndex]} alt={product.name}
                  data-fallback="https://placehold.co/800x600?text=No+Image"
                  onError={(e) => { e.target.onerror = null; e.target.src = e.target.dataset.fallback || 'https://placehold.co/800x600?text=No+Image'; }}
                  className="w-full h-80 sm:h-[28rem] object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-honda-red" />
                  {product.type}
                </div>
                {images.length > 1 && (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); setSlideIndex((prev) => (prev - 1 + images.length) % images.length) }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                      aria-label="Sebelumnya"><FiChevronLeft size={18} /></button>
                    <button onClick={(e) => { e.stopPropagation(); setSlideIndex((prev) => (prev + 1) % images.length) }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                      aria-label="Selanjutnya"><FiChevronRight size={18} /></button>
                  </>
                )}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, i) => (
                      <button key={i} onClick={(e) => { e.stopPropagation(); setSlideIndex(i) }}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${i === slideIndex ? 'bg-white w-6' : 'bg-white/50'}`}
                        aria-label={`Gambar ${i + 1}`} />
                    ))}
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setSlideIndex(i)}
                      className={`flex-shrink-0 w-[72px] h-[56px] rounded-xl overflow-hidden border-2 transition-all ${
                        i === slideIndex ? 'border-honda-red ring-1 ring-honda-red/30' : 'border-transparent opacity-50 hover:opacity-100'
                      }`}>
                      <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" data-fallback="https://placehold.co/144x112?text=No+Image" onError={(e) => { e.target.onerror = null; e.target.src = e.target.dataset.fallback || 'https://placehold.co/144x112?text=No+Image'; }} />
                    </button>
                  ))}
                </div>
              )}
              {keySpecs.length > 0 && (
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {keySpecs.map(({ key, label, value, Icon }) => (
                    <div key={key} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/50 text-center">
                      <div className="w-9 h-9 mx-auto mb-2 rounded-lg bg-honda-red/10 dark:bg-honda-red/15 flex items-center justify-center">
                        {Icon && <Icon size={16} className="text-honda-red" />}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-0.5">{label}</div>
                      <div className="text-xs font-semibold text-gray-900 dark:text-white leading-tight">{value}</div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div>
                <h1 className="font-poppins font-bold text-3xl sm:text-4xl lg:text-5xl text-gray-900 dark:text-white leading-tight">{product.name}</h1>
                {product.tagline && <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 mt-2">{product.tagline}</p>}
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{product.description}</p>

              <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/80 border border-gray-200 dark:border-gray-700 p-5">
                <h3 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 font-semibold">Harga</h3>
                {(product.variants || []).length > 0 ? (
                  <div className="space-y-2.5">
                    {product.variants.map((v, vi) => (
                      <div key={vi} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{v.name}</span>
                        <div className="text-right">
                          <span className="text-xl sm:text-2xl font-poppins font-bold text-honda-red">{v.price}</span>
                          <div className="text-[10px] text-gray-400 mt-0.5">Cicilan mulai Rp {(parseInt(String(v.price).replace(/\D/g, '')) / 60 / 1000000).toFixed(1)} Juta/bln*</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-3xl sm:text-4xl font-poppins font-bold text-honda-red">{product.price || '-'}</div>
                )}
                <p className="text-[10px] text-gray-400 mt-3">*Estimasi cicilan 5 tahun, DP 30%. Syarat & ketentuan berlaku.</p>
              </div>

              {detailSpecs.length > 0 && (
                <div>
                  <h3 className="font-poppins font-semibold text-lg text-gray-900 dark:text-white mb-4">Spesifikasi Detail</h3>
                  <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden divide-y divide-gray-100 dark:divide-gray-700/50">
                    {detailSpecs.map(([key, val]) => (
                      <div key={key} className="flex items-center justify-between px-5 py-3.5 bg-white dark:bg-gray-800/50">
                        <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">{formatSpecLabel(key)}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {features.length > 0 && (
                <div>
                  <h3 className="font-poppins font-semibold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <FiStar className="text-honda-red" size={18} />
                    Fitur Unggulan
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {features.map((f, i) => (
                      <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/40">
                        <div className="w-6 h-6 mt-0.5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                          <FiCheck className="text-green-600 dark:text-green-400" size={12} />
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 leading-snug">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {colors.length > 0 && (
                <div>
                  <h3 className="font-poppins font-semibold text-lg text-gray-900 dark:text-white mb-4">Pilihan Warna</h3>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((color, i) => (
                      <div key={i} className="flex flex-col items-center gap-1.5">
                        <div className="w-10 h-10 rounded-full ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 transition-transform hover:scale-110"
                          style={{ backgroundColor: color, '--tw-ring-color': color === '#FFFFFF' ? '#D1D5DB' : color }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2 pb-6">
                <motion.a href={getProductWhatsApp(product.name)} target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold text-sm hover:from-green-600 hover:to-green-700 transition-all shadow-lg shadow-green-500/25 flex items-center justify-center gap-2.5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Tanya via WhatsApp
                </motion.a>
                <Link to="/#kontak"
                  className="flex-1 px-6 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-2.5">
                  <FiHeadphones size={18} />
                  Jadwal Test Drive
                </Link>
              </div>
            </motion.div>
          </div>

          {related.length > 0 && (
            <div className="mt-12 lg:mt-20 pt-10 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-xs uppercase tracking-widest text-honda-red font-semibold">Produk Lainnya</span>
                  <h2 className="font-poppins font-bold text-2xl text-gray-900 dark:text-white mt-1">{product.type} Lainnya</h2>
                </div>
                <Link to="/#produk" className="text-sm text-honda-red hover:underline font-medium">Lihat Semua</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {related.map((p) => (
                  <Link key={p.id} to={`/produk/${p.id}`}
                    className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-honda-red/30 transition-all duration-300">
                    <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <img src={p.image || p.images?.[0]} alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                        data-fallback="https://placehold.co/600x400?text=No+Image"
                        onError={(e) => { e.target.onerror = null; e.target.src = e.target.dataset.fallback || 'https://placehold.co/600x400?text=No+Image'; }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm text-gray-900 dark:text-white text-[10px] font-semibold rounded-full">{p.type}</div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-poppins font-bold text-sm text-gray-900 dark:text-white">{p.name}</h3>
                      <p className="text-honda-red font-semibold text-sm mt-1">{p.variants?.[0]?.price || p.price || '-'}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {lightboxIndex !== null && (
          <ImageLightbox images={images} index={lightboxIndex} onClose={handleLightbox} />
        )}

        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-700 px-4 py-3 safe-area-bottom">
          <div className="flex gap-3 max-w-lg mx-auto">
            <a href={getProductWhatsApp(product.name)} target="_blank" rel="noopener noreferrer"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-green-500/25">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Tanya via WhatsApp
            </a>
            <Link to="/#kontak"
              className="flex-1 px-4 py-3 bg-honda-red text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2">
              <FiHeadphones size={16} />
              Test Drive
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

export default function ProductDetail() {
  const { id } = useParams()
  const { data } = useData()
  const products = data.products || []
  const product = products.find((p) => p.id === id)
  const images = (product?.images?.length ? product.images : [product?.image]).filter(Boolean)
  const specs = product?.specs || {}
  const features = product?.features || []
  const colors = product?.colors || []
  const [slideIndex, setSlideIndex] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const related = products
    .filter((p) => p.id !== product?.id && p.type === product?.type)
    .slice(0, 3)

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
        <div className={`min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 ${NAV_PT}`}>
          <div className="text-center px-4">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <FiX size={32} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Produk Tidak Ditemukan</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Mobil yang Anda cari tidak tersedia atau telah dihapus.</p>
            <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-honda-red text-white rounded-full font-semibold text-sm hover:bg-red-700 transition-colors">
              <FiArrowLeft size={16} /> Kembali ke Beranda
            </Link>
          </div>
        </div>
      </PageTransition>
    )
  }

  const keySpecs = keySpecKeys.map((k) => ({ key: k, label: formatSpecLabel(k), value: specs[k], Icon: specIcons[k] })).filter((s) => s.value)
  const detailSpecs = Object.entries(specs).filter(([k]) => !keySpecKeys.includes(k))

  const theme = product.theme
  const hasTheme = theme?.accent != null && theme.accent !== ''
  if (hasTheme) {
    return renderCustomLayout(product, images, specs, features, colors, keySpecs, detailSpecs, slideIndex, setSlideIndex, lightboxIndex, handleLightbox, related, theme)
  }

  return renderStandardLayout(product, images, specs, features, colors, keySpecs, detailSpecs, slideIndex, setSlideIndex, lightboxIndex, handleLightbox, related)
}
