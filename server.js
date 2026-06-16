import express from 'express'
import Database from 'better-sqlite3'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

import { products, promotions, testimonials, gallery, faqs, advantages } from './src/data/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000
const DB_PATH = join(__dirname, 'data.sqlite')

app.use(express.json({ limit: '50mb' }))

const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS sections (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT DEFAULT (datetime('now'))
  )
`)

function seedDatabase() {
  const existing = db.prepare('SELECT COUNT(*) as count FROM sections').get()
  if (existing.count > 0) {
    console.log(`Database sudah memiliki ${existing.count} section, skip seeding`)
    return
  }

  const defaultData = {
    products: JSON.stringify(products),
    promotions: JSON.stringify(promotions),
    testimonials: JSON.stringify(testimonials),
    gallery: JSON.stringify(gallery),
    faqs: JSON.stringify(faqs),
    advantages: JSON.stringify(advantages),
    profile: JSON.stringify({
      name: 'Ahmad Rizky',
      title: 'Sales Executive Honda Nagamotor',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      experience: '10 Tahun Pengalaman',
      description: 'Sejak 2015 saya bergabung dengan Honda Nagamotor dan telah membantu ratusan konsumen menemukan mobil Honda impian mereka.',
      stats: [
        { icon: 'FiAward', value: '500+', label: 'Unit Terjual' },
        { icon: 'FiUsers', value: '1000+', label: 'Pelanggan' },
        { icon: 'FiStar', value: '4.9', label: 'Rating' },
      ],
    }),
    hero: JSON.stringify({
      title: 'Temukan Honda Impian Anda Hari Ini Bersama Saya Aldi Nagamotor',
      subtitle: 'Promo terbaik, DP ringan, proses cepat, dan pelayanan profesional dari sales berpengalaman.',
      salesPhoto: '',
      images: [
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1600&q=80',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1600&q=80',
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1600&q=80',
      ],
      stats: [
        { value: 500, suffix: '+', label: 'Unit Terjual' },
        { value: 1000, suffix: '+', label: 'Konsumen Puas' },
        { value: 10, suffix: '+', label: 'Tahun Pengalaman' },
      ],
    }),
    navbar: JSON.stringify({
      logoImage: '',
      logoText: 'HONDA',
      logoSubtext: 'Nagamotor',
      ctaText: 'Hubungi Saya',
      ctaUrl: '',
      menuItems: [
        { label: 'Beranda', section: '' },
        { label: 'Produk', section: 'produk' },
        { label: 'Promo', section: 'promo' },
        { label: 'Testimoni', section: 'testimoni' },
        { label: 'Tentang', section: 'tentang' },
        { label: 'Kontak', section: 'kontak' },
      ],
    }),
    loading: JSON.stringify({
      title: 'HONDA',
      subtext: 'NAGAMOTOR',
      tagline: 'Dealer Resmi Honda',
    }),
    contact: JSON.stringify({
      phone: '+62 812 3456 7890',
      email: 'sales@hondanagamotor.com',
      address: 'Jakarta Selatan, Indonesia',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.0!2d106.8!3d-6.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTInMDAuMCJTIDEwNsKwNDgnMDAuMCJF!5e0!3m2!1sid!2sid!4v1',
      socialMedia: [
        { platform: 'Instagram', url: '#', icon: 'FaInstagram' },
        { platform: 'Facebook', url: '#', icon: 'FaFacebook' },
        { platform: 'TikTok', url: '#', icon: 'FaTiktok' },
      ],
    }),
    _deleted: JSON.stringify([]),
  }

  const insert = db.prepare('INSERT OR IGNORE INTO sections (key, value) VALUES (?, ?)')
  const tx = db.transaction(() => {
    for (const [key, value] of Object.entries(defaultData)) {
      insert.run(key, value)
    }
  })
  tx()
  console.log('Database seeded with default data')
}

seedDatabase()

app.get('/api/data', (_req, res) => {
  try {
    const rows = db.prepare('SELECT key, value FROM sections').all()
    const data = {}
    for (const row of rows) {
      try {
        data[row.key] = JSON.parse(row.value)
      } catch {
        data[row.key] = row.value
      }
    }
    res.json(data)
  } catch (e) {
    console.error('GET /api/data error:', e)
    res.status(500).json({ error: 'Gagal membaca data' })
  }
})

app.post('/api/data', (req, res) => {
  try {
    const body = req.body
    if (!body || typeof body !== 'object') {
      return res.status(400).json({ error: 'Data tidak valid' })
    }
    const upsert = db.prepare('INSERT OR REPLACE INTO sections (key, value) VALUES (?, ?)')
    const tx = db.transaction(() => {
      for (const [key, value] of Object.entries(body)) {
        upsert.run(key, JSON.stringify(value))
      }
    })
    tx()
    res.json({ success: true })
  } catch (e) {
    console.error('POST /api/data error:', e)
    res.status(500).json({ error: 'Gagal menyimpan data' })
  }
})

app.use(express.static(join(__dirname, 'dist')))

app.get('/{*path}', (_req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`)
})
