import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import useSEO from '../hooks/useSEO'

export default function NotFound() {
  useSEO({ title: 'Halaman Tidak Ditemukan', description: 'Halaman yang Anda cari tidak tersedia.' })

  return (
    <div className="min-h-screen flex items-center justify-center bg-light dark:bg-gray-900 px-4">
      <div className="text-center max-w-md">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-8xl sm:text-9xl font-poppins font-black text-honda-red/20 dark:text-honda-red/10 mb-4 select-none"
        >
          404
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl sm:text-3xl font-poppins font-bold text-gray-900 dark:text-white mb-3"
        >
          Halaman Tidak Ditemukan
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mb-8"
        >
          Halaman yang Anda cari mungkin telah dipindahkan atau tidak tersedia.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-honda-red text-white rounded-full font-semibold text-sm hover:bg-red-700 transition-colors shadow-lg shadow-honda-red/30"
          >
            Kembali ke Beranda
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
