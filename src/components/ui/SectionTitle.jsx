import { motion } from 'framer-motion'

export default function SectionTitle({ subtitle, title, description, light = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center max-w-2xl mx-auto mb-12 lg:mb-16"
    >
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 ${
        light ? 'bg-white/10 text-white' : 'bg-honda-red/10 text-honda-red'
      }`}>
        {subtitle}
      </span>
      <h2 className={`font-poppins font-bold text-3xl sm:text-4xl lg:text-5xl mb-4 ${
        light ? 'text-white' : 'text-gray-900 dark:text-white'
      }`}>
        {title}
      </h2>
      {description && (
        <p className={`text-sm sm:text-base leading-relaxed ${
          light ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'
        }`}>
          {description}
        </p>
      )}
    </motion.div>
  )
}
