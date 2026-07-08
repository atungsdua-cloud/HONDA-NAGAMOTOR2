import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiClock } from 'react-icons/fi'
import { useData } from '../../context/DataContext'
import SectionTitle from '../ui/SectionTitle'
import { getWhatsAppLink } from '../../utils/whatsapp'

function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculate = () => {
      const diff = new Date(targetDate).getTime() - Date.now()
      if (diff <= 0) return
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }
    calculate()
    const interval = setInterval(calculate, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  return (
    <div className="flex items-center gap-2 text-xs font-medium text-white/80">
      <FiClock size={14} />
      <span>{String(timeLeft.days).padStart(2, '0')}d {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s</span>
    </div>
  )
}

export default function Promo() {
  const { data } = useData()
  const promotions = data.promotions || []
  const contactPhone = data.contact?.phone?.replace(/\D/g, '')
  return (
    <section id="promo" className="py-14 lg:py-28 bg-dark text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-10 parallax hidden lg:block" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.05)_0%,_transparent_70%)] lg:hidden" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-honda-red/10 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="PROMO SPESIAL"
          title="Promo Terbatas!"
          description="Jangan lewatkan promo spesial dari kami. Dapatkan penawaran terbaik sebelum habis!"
          light
        />

        {promotions.length === 0 ? (
          <div className="text-center py-16 text-white/50">
            <p className="text-sm">Belum ada promo saat ini</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {promotions.map((promo, i) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0">
                <img src={promo.image} alt={promo.title} className="w-full h-full object-cover" loading="lazy"
                  onError={(e) => { if (e.target.src !== 'https://placehold.co/800x600?text=Promo') e.target.src = 'https://placehold.co/800x600?text=Promo' }} />
                <div className={`absolute inset-0 bg-gradient-to-r ${promo.color} opacity-80 mix-blend-multiply`} />
              </div>

              <div className="relative p-6 sm:p-8 h-64 sm:h-72 flex flex-col justify-between">
                <div>
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold mb-3">
                    {promo.discount}
                  </span>
                  <h3 className="font-poppins font-bold text-xl sm:text-2xl mb-2">{promo.title}</h3>
                  <p className="text-sm text-white/80 max-w-xs">{promo.description}</p>
                </div>

                <div className="flex items-center justify-between">
                  <CountdownTimer targetDate={promo.validUntil} />
                  <motion.a
                    href={getWhatsAppLink(`Hallo Kak, saya tertarik dengan promo ${promo.title}`, contactPhone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    className="px-5 py-3 bg-white text-gray-900 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Klaim Sekarang
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </div>
    </section>
  )
}
