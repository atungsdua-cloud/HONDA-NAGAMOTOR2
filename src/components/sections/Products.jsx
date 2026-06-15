import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiChevronRight } from 'react-icons/fi'
import { useData } from '../../context/DataContext'
import { getProductWhatsApp } from '../../utils/whatsapp'
import SectionTitle from '../ui/SectionTitle'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' },
  }),
}

const filterCategories = ['Semua', 'Hatchback', 'Mini SUV', 'SUV 7-Seater', 'Crossover SUV', 'SUV Premium', 'Sedan', 'Sedan Premium', 'Hatchback Premium']

export default function Products() {
  const { data } = useData()
  const products = data.products
  const [activeFilter, setActiveFilter] = useState('Semua')

  const filtered = activeFilter === 'Semua'
    ? products
    : products.filter((p) => p.type === activeFilter)

  return (
    <section id="produk" className="py-20 lg:py-28 bg-light dark:bg-gray-900 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="PRODUK KAMI"
          title="Line-Up Mobil Honda"
          description="Pilih mobil Honda impian Anda dari berbagai pilihan tipe terbaik"
        />

        <div className="flex justify-center mb-12">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory -mx-4 sm:mx-0 px-4 sm:px-0 max-w-full">
            {filterCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`snap-start shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                  activeFilter === cat
                    ? 'bg-honda-red text-white shadow-lg shadow-honda-red/30'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-honda-red/10 hover:text-honda-red dark:hover:bg-honda-red/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative h-52 sm:h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                  key={product.image || product.images?.[0] || 'no-img'}
                  src={product.image || product.images?.[0]}
                  alt={product.name}
                  loading="lazy"
                  onError={(e) => { if (e.target.src !== 'https://placehold.co/600x400?text=No+Image') e.target.src = 'https://placehold.co/600x400?text=No+Image' }}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-3 left-3 px-3 py-1 bg-honda-red/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                  {product.type}
                </div>
              </div>

              <div className="p-4 sm:p-5 space-y-2 sm:space-y-3">
                <h3 className="font-poppins font-bold text-base sm:text-lg text-gray-900 dark:text-white">{product.name}</h3>
                <p className="text-honda-red font-bold text-xs sm:text-sm"> {product.price}</p>

                <div className="grid grid-cols-2 gap-1 sm:gap-2 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-honda-red shrink-0" />{product.engine}</div>
                  <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-honda-red shrink-0" />{product.fuel}</div>
                </div>

                <div className="flex gap-2 pt-1 sm:pt-2">
                  <Link
                    to={`/produk/${product.id}`}
                    className="flex-1 px-3 sm:px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-honda-red hover:text-white text-gray-700 dark:text-gray-300 rounded-xl text-[11px] sm:text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1"
                  >
                    Detail <FiChevronRight size={13} className="sm:hidden" /><FiChevronRight size={14} className="hidden sm:block" />
                  </Link>
                  <a
                    href={getProductWhatsApp(product.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 sm:px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-[11px] sm:text-xs font-semibold transition-all duration-300 flex items-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    <span className="hidden sm:inline">WhatsApp</span>
                    <span className="sm:hidden">WA</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
