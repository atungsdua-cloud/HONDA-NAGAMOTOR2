import { motion } from 'framer-motion'
import { useData } from '../../context/DataContext'
import SectionTitle from '../ui/SectionTitle'

export default function Galeri() {
  const { data } = useData()
  const gallery = data.gallery
  return (
    <section className="py-20 lg:py-28 bg-white dark:bg-gray-800 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="GALERI"
          title="Momen Serah Terima"
          description="Dokumentasi konsumen yang telah menerima mobil Honda impian mereka"
        />

        {gallery.length === 0 ? (
          <div className="text-center py-16 text-gray-400 dark:text-gray-500">
            <p className="text-sm">Belum ada galeri</p>
          </div>
        ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {gallery.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="break-inside-avoid group relative rounded-2xl overflow-hidden cursor-pointer"
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                onError={(e) => { if (e.target.src !== 'https://placehold.co/600x800?text=No+Image') e.target.src = 'https://placehold.co/600x800?text=No+Image' }}
                className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-white text-sm font-medium">{item.alt}</span>
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </div>
    </section>
  )
}
