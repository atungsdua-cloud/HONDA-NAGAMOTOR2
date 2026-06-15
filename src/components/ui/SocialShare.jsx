import { motion } from 'framer-motion'
import { FiShare2 } from 'react-icons/fi'
import { getProductWhatsApp } from '../../utils/whatsapp'

export default function SocialShare({ productName }) {
  const url = window.location.href
  const text = `Lihat ${productName} di Honda Nagamotor: ${url}`

  return (
    <motion.a
      href={getProductWhatsApp(text)}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors"
      title="Bagikan via WhatsApp"
    >
      <FiShare2 size={16} />
      Bagikan
    </motion.a>
  )
}
