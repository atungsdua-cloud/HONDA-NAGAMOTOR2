import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiSend, FiCheck, FiAlertCircle, FiPhone, FiMail, FiMapPin } from 'react-icons/fi'
import { FaInstagram, FaFacebook, FaTiktok } from 'react-icons/fa'
import { useData } from '../../context/DataContext'
import SectionTitle from '../ui/SectionTitle'
import { getWhatsAppLink } from '../../utils/whatsapp'

const iconMap = { FaInstagram, FaFacebook, FaTiktok }

export default function Contact() {
  const { data } = useData()
  const products = data.products || []
  const contact = data.contact || {}
  const [form, setForm] = useState({ name: '', phone: '', product: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [sendError, setSendError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setSendError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) {
        setSendError('Data tidak tersimpan di server, tapi pesan WhatsApp tetap terkirim.')
      } else {
        setSent(true)
        setForm({ name: '', phone: '', product: '', message: '' })
        setTimeout(() => setSent(false), 5000)
      }
    } catch {
      setSendError('Server tidak tersedia, tapi pesan WhatsApp tetap terkirim.')
    }
    const text = `Hallo Kak, saya ${form.name} (${form.phone}), tertarik dengan ${form.product || 'mobil Honda'}. ${form.message ? `Pesan: ${form.message}` : ''}`
    window.open(getWhatsAppLink(text), '_blank')
    setSending(false)
  }

  return (
    <section id="kontak" className="py-14 lg:py-28 bg-white dark:bg-gray-800 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="KONTAK"
          title="Hubungi Saya"
          description="Isi form di bawah atau hubungi langsung melalui kontak yang tersedia"
        />

        <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Masukkan nama Anda"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-honda-red focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nomor HP</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="08xxxxxxxxxx"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-honda-red focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Mobil Diminati</label>
              <select
                value={form.product}
                onChange={(e) => setForm({ ...form, product: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-honda-red focus:border-transparent outline-none transition-all"
              >
                <option value="">Pilih Mobil (Opsional)</option>
                {products.map((p) => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Pesan</label>
              <textarea
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tulis pesan Anda..."
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-honda-red focus:border-transparent outline-none transition-all resize-none"
              />
            </div>

            {sendError && (
              <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl text-xs text-yellow-700 dark:text-yellow-300">
                <FiAlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                <span>{sendError}</span>
              </div>
            )}
            <motion.button
              type="submit"
              disabled={sending}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-honda-red text-white rounded-xl font-semibold text-sm hover:bg-red-700 transition-colors shadow-lg shadow-honda-red/30 disabled:opacity-70"
            >
              {sent ? (
                <><FiCheck size={16} /> Data Terkirim</>
              ) : (
                <><FiSend size={16} /> Kirim Pesan via WhatsApp</>
              )}
            </motion.button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="rounded-2xl overflow-hidden shadow-lg h-48 sm:h-56">
              <iframe
                src={contact.mapUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.0!2d106.8!3d-6.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTInMDAuMCJTIDEwNsKwNDgnMDAuMCJF!5e0!3m2!1sid!2sid!4v1'}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Honda Nagamotor"
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-poppins font-bold text-lg text-gray-900 dark:text-white">Informasi Kontak</h3>
              <div className="space-y-3">
                {[
                  { icon: FiPhone, label: contact.phone, href: contact.phone ? `tel:${contact.phone.replace(/\s/g, '')}` : undefined },
                  { icon: FiMail, label: contact.email, href: contact.email ? `mailto:${contact.email}` : undefined },
                  { icon: FiMapPin, label: contact.address },
                ].map(({ icon: Icon, label, href }) => (
                  <div key={label} className="flex items-center gap-3 text-sm">
                    <div className="w-11 h-11 rounded-xl bg-honda-red/10 dark:bg-honda-red/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="text-honda-red" size={18} />
                    </div>
                    {href ? (
                      <a href={href} className="text-gray-600 dark:text-gray-300 hover:text-honda-red transition-colors">{label}</a>
                    ) : (
                      <span className="text-gray-600 dark:text-gray-300">{label}</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                {(contact.socialMedia || []).map(({ platform, url, icon }) => {
                  const Icon = iconMap[icon]
                  if (!Icon) return null
                  return (
                    <motion.a
                      key={platform}
                      href={url || '#'}
                      whileHover={{ scale: 1.1, y: -2 }}
                      className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-honda-red hover:text-white transition-all duration-300"
                      aria-label={platform}
                    >
                      <Icon size={18} />
                    </motion.a>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
