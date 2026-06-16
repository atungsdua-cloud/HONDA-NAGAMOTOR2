import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMapPin, FiPhone, FiMail, FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi'
import { FaTiktok } from 'react-icons/fa'

const quickLinks = [
  { label: 'Beranda', href: '/' },
  { label: 'Produk', href: '/#produk' },
  { label: 'Promo', href: '/#promo' },
  { label: 'Testimoni', href: '/#testimoni' },
]

export default function Footer() {
  return (
    <footer className="relative bg-dark text-white overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 100 30" className="h-8 w-auto" fill="#fff">
                <text x="0" y="22" fontFamily="Poppins" fontWeight="800" fontSize="20" letterSpacing="2">HONDA</text>
              </svg>
              <span className="text-xs tracking-widest uppercase opacity-50">Nagamotor</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Dealer Resmi Honda. Melayani penjualan mobil baru dan konsultasi. 
              Kepuasan pelanggan adalah prioritas utama kami.
            </p>
            <div className="flex gap-3">
              {[
                { icon: FiInstagram, href: '#', label: 'Instagram' },
                { icon: FiFacebook, href: '#', label: 'Facebook' },
                { icon: FiTwitter, href: '#', label: 'Twitter' },
                { icon: FaTiktok, href: '#', label: 'TikTok' },
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:bg-honda-red hover:text-white transition-all duration-300"
                  aria-label={label}
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-poppins font-semibold text-white mb-5">Menu Cepat</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-honda-red transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-poppins font-semibold text-white mb-5">Kontak</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <FiMapPin className="mt-0.5 text-honda-red flex-shrink-0" />
                <span>Jl. Raya Contoh No. 123, Jakarta Selatan</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <FiPhone className="text-honda-red flex-shrink-0" />
                <span>+62 812 3456 7890</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <FiMail className="text-honda-red flex-shrink-0" />
                <span>sales@hondanagamotor.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-poppins font-semibold text-white mb-5">Jam Operasional</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex justify-between">
                <span>Senin - Jumat</span>
                <span>08:00 - 20:00</span>
              </li>
              <li className="flex justify-between">
                <span>Sabtu</span>
                <span>08:00 - 18:00</span>
              </li>
              <li className="flex justify-between">
                <span>Minggu</span>
                <span>09:00 - 16:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} Honda Nagamotor. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <a href="#" className="hover:text-honda-red transition-colors">Kebijakan Privasi</a>
            <a href="#" className="hover:text-honda-red transition-colors">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
