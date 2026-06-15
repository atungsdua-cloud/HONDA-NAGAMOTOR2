import { motion } from 'framer-motion'
import { BsLightningCharge, BsFileEarmarkCheck, BsGift, BsChatDots, BsCarFront, BsTruck } from 'react-icons/bs'
import { useData } from '../../context/DataContext'
import SectionTitle from '../ui/SectionTitle'

const iconMap = {
  BsLightningCharge, BsFileEarmarkCheck, BsGift, BsChatDots, BsCarFront, BsTruck,
}

export default function Keunggulan() {
  const { data } = useData()
  const advantages = data.advantages

  return (
    <section className="py-20 lg:py-28 bg-light dark:bg-gray-900 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="KEUNGGULAN"
          title="Mengapa Memilih Kami?"
          description="Kami berkomitmen memberikan pelayanan terbaik untuk setiap konsumen"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((item, i) => {
            const Icon = iconMap[item.icon] || BsLightningCharge
            return (
              <motion.div
                key={item.id || i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -5 }}
                className="group p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="w-14 h-14 rounded-xl bg-honda-red/10 dark:bg-honda-red/20 flex items-center justify-center mb-4 group-hover:bg-honda-red transition-colors duration-300">
                  <Icon className="text-honda-red group-hover:text-white transition-colors duration-300" size={24} />
                </div>
                <h3 className="font-poppins font-bold text-lg text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
