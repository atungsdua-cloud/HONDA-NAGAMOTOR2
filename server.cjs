const express = require('express')
const { join } = require('path')
const mysql = require('mysql2/promise')
require('dotenv').config()

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'honda_nagamotor',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json({ limit: '50mb' }))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})

app.get('/api/data', async (req, res) => {
  try {
    const data = await readData()
    res.json(data)
  } catch (e) {
    console.error('Gagal baca database:', e.message)
    res.status(500).json({ error: e.message })
  }
})

app.post('/api/data', async (req, res) => {
  const body = req.body
  if (!body || typeof body !== 'object')
    return res.status(400).json({ error: 'Data tidak valid' })
  try {
    await writeData(body)
    res.json({ success: true })
  } catch (e) {
    console.error('=== ERROR WRITE DATABASE ===')
    console.error('Message:', e.message)
    console.error('Stack:', e.stack)
    res.status(500).json({ error: e.message || 'Gagal menyimpan data' })
  }
})

app.post('/api/contact', async (req, res) => {
  const { name, phone, product, message } = req.body
  if (!name || !phone)
    return res.status(400).json({ error: 'Nama dan nomor HP wajib diisi' })
  try {
    await pool.query(
      'INSERT INTO contact_leads (name, phone, product, message) VALUES (?, ?, ?, ?)',
      [name.trim(), phone.trim(), (product || '').trim(), (message || '').trim()]
    )
    res.json({ success: true })
  } catch (e) {
    console.error('Gagal simpan lead:', e.message)
    res.status(500).json({ error: e.message })
  }
})

app.use(express.static(join(__dirname, 'dist')))

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

async function initDatabase() {
  const tables = [
    `CREATE TABLE IF NOT EXISTS profile (
      id INT PRIMARY KEY DEFAULT 1,
      name TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      photo MEDIUMTEXT,
      experience TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      email TEXT DEFAULT '',
      address TEXT DEFAULT '',
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS profile_stats (
      id INT AUTO_INCREMENT PRIMARY KEY,
      profile_id INT NOT NULL DEFAULT 1,
      icon VARCHAR(50) NOT NULL,
      value VARCHAR(50) NOT NULL,
      label VARCHAR(100) NOT NULL,
      sort_order INT NOT NULL DEFAULT 0,
      FOREIGN KEY (profile_id) REFERENCES profile(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS hero (
      id INT PRIMARY KEY DEFAULT 1,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      sales_photo MEDIUMTEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS hero_images (
      id INT AUTO_INCREMENT PRIMARY KEY,
      hero_id INT NOT NULL DEFAULT 1,
      url MEDIUMTEXT NOT NULL,
      sort_order INT NOT NULL DEFAULT 0,
      FOREIGN KEY (hero_id) REFERENCES hero(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS hero_stats (
      id INT AUTO_INCREMENT PRIMARY KEY,
      hero_id INT NOT NULL DEFAULT 1,
      icon VARCHAR(50) NOT NULL,
      value VARCHAR(50) NOT NULL,
      label VARCHAR(100) NOT NULL,
      suffix VARCHAR(20) DEFAULT '',
      sort_order INT NOT NULL DEFAULT 0,
      FOREIGN KEY (hero_id) REFERENCES hero(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS navbar (
      id INT PRIMARY KEY DEFAULT 1,
      logo_image MEDIUMTEXT,
      logo_text TEXT DEFAULT 'HONDA',
      logo_subtext TEXT DEFAULT 'Nagamotor',
      cta_text TEXT DEFAULT 'Hubungi Saya',
      cta_url TEXT DEFAULT '',
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS navbar_menu_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      navbar_id INT NOT NULL DEFAULT 1,
      label VARCHAR(100) NOT NULL,
      section VARCHAR(100) NOT NULL,
      sort_order INT NOT NULL DEFAULT 0,
      FOREIGN KEY (navbar_id) REFERENCES navbar(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS loading_screen (
      id INT PRIMARY KEY DEFAULT 1,
      title TEXT DEFAULT 'HONDA',
      subtext TEXT DEFAULT 'NAGAMOTOR',
      tagline TEXT DEFAULT 'Dealer Resmi Honda'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS contact (
      id INT PRIMARY KEY DEFAULT 1,
      phone TEXT DEFAULT '',
      email TEXT DEFAULT '',
      address TEXT DEFAULT '',
      map_url TEXT DEFAULT '',
      hours_json TEXT DEFAULT '{}',
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS contact_social_media (
      id INT AUTO_INCREMENT PRIMARY KEY,
      contact_id INT NOT NULL DEFAULT 1,
      platform VARCHAR(100) NOT NULL,
      url TEXT NOT NULL,
      icon VARCHAR(50) NOT NULL,
      sort_order INT NOT NULL DEFAULT 0,
      FOREIGN KEY (contact_id) REFERENCES contact(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      tagline TEXT DEFAULT '',
      type VARCHAR(100) NOT NULL DEFAULT '',
      engine VARCHAR(100) DEFAULT '',
      fuel VARCHAR(100) DEFAULT '',
      image MEDIUMTEXT,
      description TEXT DEFAULT '',
      specs_json LONGTEXT DEFAULT '{}',
      features_json LONGTEXT DEFAULT '[]',
      colors_json LONGTEXT DEFAULT '[]',
      price VARCHAR(100) DEFAULT '',
      theme_json TEXT DEFAULT '{}',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS product_images (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT NOT NULL,
      url MEDIUMTEXT NOT NULL,
      sort_order INT NOT NULL DEFAULT 0,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS product_variants (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT NOT NULL,
      name VARCHAR(200) NOT NULL,
      price VARCHAR(100) NOT NULL,
      sort_order INT NOT NULL DEFAULT 0,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS promotions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      description TEXT DEFAULT '',
      image MEDIUMTEXT,
      discount VARCHAR(100) DEFAULT '',
      valid_until VARCHAR(100) DEFAULT '',
      color VARCHAR(100) DEFAULT 'from-red-600 to-red-800',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS testimonials (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      car VARCHAR(200) DEFAULT '',
      photo MEDIUMTEXT,
      text TEXT NOT NULL,
      rating INT DEFAULT 5,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS gallery (
      id INT AUTO_INCREMENT PRIMARY KEY,
      src MEDIUMTEXT NOT NULL,
      alt TEXT DEFAULT '',
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS faqs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS advantages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      icon VARCHAR(100) NOT NULL,
      title VARCHAR(200) NOT NULL,
      description TEXT DEFAULT '',
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS contact_leads (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      product VARCHAR(200) DEFAULT '',
      message TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  ]

  for (const sql of tables) {
    await pool.query(sql)
  }
  console.log('Tabel database berhasil dibuat')
}

// seedData telah dihapus — hanya gunakan data asli dari database

async function readData() {
  const [profile] = await pool.query('SELECT * FROM profile WHERE id = 1')
  const [profileStats] = await pool.query('SELECT icon, value, label FROM profile_stats WHERE profile_id = 1 ORDER BY sort_order')

  const [hero] = await pool.query('SELECT * FROM hero WHERE id = 1')
  const [heroImages] = await pool.query('SELECT url FROM hero_images WHERE hero_id = 1 ORDER BY sort_order')
  const [heroStats] = await pool.query('SELECT icon, value, label, suffix FROM hero_stats WHERE hero_id = 1 ORDER BY sort_order')

  const [navbar] = await pool.query('SELECT * FROM navbar WHERE id = 1')
  const [menuItems] = await pool.query('SELECT label, section FROM navbar_menu_items WHERE navbar_id = 1 ORDER BY sort_order')

  const [loading] = await pool.query('SELECT * FROM loading_screen WHERE id = 1')

  const [contact] = await pool.query('SELECT * FROM contact WHERE id = 1')
  const [socialMedia] = await pool.query('SELECT platform, url, icon FROM contact_social_media WHERE contact_id = 1 ORDER BY sort_order')

  const [products] = await pool.query('SELECT id, name, tagline, type, engine, fuel, image, description, specs_json, features_json, colors_json, price, theme_json FROM products ORDER BY id')
  const productsWithVariants = []
  for (const p of products) {
    const [variants] = await pool.query('SELECT name, price FROM product_variants WHERE product_id = ? ORDER BY sort_order', [p.id])
    const [images] = await pool.query('SELECT url FROM product_images WHERE product_id = ? ORDER BY sort_order', [p.id])
    productsWithVariants.push({
      id: `product-${p.id}`,
      name: p.name,
      tagline: p.tagline,
      type: p.type,
      engine: p.engine,
      fuel: p.fuel,
      image: p.image,
      images: images.map(i => i.url),
      description: p.description,
      specs: JSON.parse(p.specs_json || '{}'),
      features: JSON.parse(p.features_json || '[]'),
      colors: JSON.parse(p.colors_json || '[]'),
      price: p.price,
      theme: JSON.parse(p.theme_json || '{}'),
      variants
    })
  }

  const [promotions] = await pool.query('SELECT id, title, description, image, discount, valid_until AS validUntil, color FROM promotions ORDER BY id')
  const [testimonials] = await pool.query('SELECT id, name, car, photo, text, rating FROM testimonials ORDER BY id')
  const [gallery] = await pool.query('SELECT id, src, alt FROM gallery ORDER BY sort_order')
  const [faqs] = await pool.query('SELECT id, question, answer FROM faqs ORDER BY sort_order')
  const [advantages] = await pool.query('SELECT id, icon, title, description FROM advantages ORDER BY sort_order')

  return {
    profile: {
      name: profile[0]?.name || '',
      title: profile[0]?.title || '',
      description: profile[0]?.description || '',
      photo: profile[0]?.photo || '',
      experience: profile[0]?.experience || '',
      phone: profile[0]?.phone || '',
      email: profile[0]?.email || '',
      address: profile[0]?.address || '',
      stats: profileStats
    },
    hero: {
      title: hero[0]?.title || '',
      subtitle: hero[0]?.subtitle || '',
      salesPhoto: hero[0]?.sales_photo || '',
      images: heroImages.map(i => i.url),
      stats: heroStats
    },
    navbar: {
      logoImage: navbar[0]?.logo_image || '',
      logoText: navbar[0]?.logo_text || 'HONDA',
      logoSubtext: navbar[0]?.logo_subtext || 'Nagamotor',
      menuItems,
      ctaText: navbar[0]?.cta_text || 'Hubungi Saya',
      ctaUrl: navbar[0]?.cta_url || ''
    },
    loadingScreen: {
      title: loading[0]?.title || 'HONDA',
      subtext: loading[0]?.subtext || 'NAGAMOTOR',
      tagline: loading[0]?.tagline || 'Dealer Resmi Honda'
    },
    contact: {
      phone: contact[0]?.phone || '',
      email: contact[0]?.email || '',
      address: contact[0]?.address || '',
      mapUrl: contact[0]?.map_url || '',
      hours: JSON.parse(contact[0]?.hours_json || '{}'),
      socialMedia
    },
    products: productsWithVariants,
    promotions: promotions.map(p => ({
      id: `promotion-${p.id}`,
      title: p.title,
      description: p.description,
      image: p.image,
      discount: p.discount,
      validUntil: p.validUntil,
      color: p.color
    })),
    testimonials: testimonials.map(t => ({
      id: `testimonial-${t.id}`,
      name: t.name,
      car: t.car,
      photo: t.photo,
      text: t.text,
      rating: t.rating
    })),
    gallery: gallery.map(g => ({
      id: `gallery-${g.id}`,
      src: g.src,
      alt: g.alt
    })),
    faqs: faqs.map(f => ({
      id: `faq-${f.id}`,
      question: f.question,
      answer: f.answer
    })),
    advantages: advantages.map(a => ({
      id: `advantage-${a.id}`,
      icon: a.icon,
      title: a.title,
      description: a.description
    }))
  }
}

async function writeData(data) {
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()

    if (data.profile) {
      const p = data.profile
      await conn.query(
        `UPDATE profile SET name = ?, title = ?, description = ?, photo = ?, experience = ?, phone = ?, email = ?, address = ? WHERE id = 1`,
        [p.name || '', p.title || '', p.description || '', p.photo || '', p.experience || '', p.phone || '', p.email || '', p.address || '']
      )
      if (p.stats) {
        await conn.query('DELETE FROM profile_stats WHERE profile_id = 1')
        for (let i = 0; i < p.stats.length; i++) {
          await conn.query('INSERT INTO profile_stats (profile_id, icon, value, label, sort_order) VALUES (1, ?, ?, ?, ?)',
            [p.stats[i].icon, p.stats[i].value, p.stats[i].label, i + 1])
        }
      }
    }

    if (data.hero) {
      const h = data.hero
      await conn.query(
        'UPDATE hero SET title = ?, subtitle = ?, sales_photo = ? WHERE id = 1',
        [h.title || '', h.subtitle || '', h.salesPhoto || '']
      )
      if (h.images) {
        await conn.query('DELETE FROM hero_images WHERE hero_id = 1')
        for (let i = 0; i < h.images.length; i++) {
          await conn.query('INSERT INTO hero_images (hero_id, url, sort_order) VALUES (1, ?, ?)', [h.images[i], i + 1])
        }
      }
      if (h.stats) {
        await conn.query('DELETE FROM hero_stats WHERE hero_id = 1')
        for (let i = 0; i < h.stats.length; i++) {
          await conn.query('INSERT INTO hero_stats (hero_id, icon, value, label, suffix, sort_order) VALUES (1, ?, ?, ?, ?, ?)',
            [h.stats[i].icon, h.stats[i].value, h.stats[i].label, h.stats[i].suffix || '', i + 1])
        }
      }
    }

    if (data.navbar) {
      const n = data.navbar
      await conn.query(
        'UPDATE navbar SET logo_image = ?, logo_text = ?, logo_subtext = ?, cta_text = ?, cta_url = ? WHERE id = 1',
        [n.logoImage || '', n.logoText || 'HONDA', n.logoSubtext || 'Nagamotor', n.ctaText || 'Hubungi Saya', n.ctaUrl || '']
      )
      if (n.menuItems) {
        await conn.query('DELETE FROM navbar_menu_items WHERE navbar_id = 1')
        for (let i = 0; i < n.menuItems.length; i++) {
          await conn.query('INSERT INTO navbar_menu_items (navbar_id, label, section, sort_order) VALUES (1, ?, ?, ?)',
            [n.menuItems[i].label, n.menuItems[i].section, i + 1])
        }
      }
    }

    if (data.loadingScreen) {
      const l = data.loadingScreen
      await conn.query(
        'UPDATE loading_screen SET title = ?, subtext = ?, tagline = ? WHERE id = 1',
        [l.title || 'HONDA', l.subtext || 'NAGAMOTOR', l.tagline || 'Dealer Resmi Honda']
      )
    }

    if (data.contact) {
      const c = data.contact
      await conn.query(
        'UPDATE contact SET phone = ?, email = ?, address = ?, map_url = ?, hours_json = ? WHERE id = 1',
        [c.phone || '', c.email || '', c.address || '', c.mapUrl || '', JSON.stringify(c.hours || {})]
      )
      if (c.socialMedia) {
        await conn.query('DELETE FROM contact_social_media WHERE contact_id = 1')
        for (let i = 0; i < c.socialMedia.length; i++) {
          await conn.query('INSERT INTO contact_social_media (contact_id, platform, url, icon, sort_order) VALUES (1, ?, ?, ?, ?)',
            [c.socialMedia[i].platform, c.socialMedia[i].url, c.socialMedia[i].icon, i + 1])
        }
      }
    }

    if (data.products) {
      // Hapus produk yang ada di DB tapi tidak di data incoming
      const [existingRows] = await conn.query('SELECT id FROM products')
      const existingIds = existingRows.map(r => r.id)
      const incomingIds = data.products
        .filter(p => p.id && p.id.startsWith('product-'))
        .map(p => parseInt(p.id.replace('product-', ''), 10))
        .filter(id => !isNaN(id))
      const toDelete = existingIds.filter(id => !incomingIds.includes(id))
      for (const id of toDelete) {
        await conn.query('DELETE FROM products WHERE id = ?', [id])
      }

      for (const p of data.products) {
        const pid = p.id && parseInt(p.id.replace('product-', ''), 10)
        const [existing] = pid ? await conn.query('SELECT id FROM products WHERE id = ?', [pid]) : [[]]
        if (existing && existing[0]) {
          await conn.query(
            `UPDATE products SET name = ?, tagline = ?, type = ?, engine = ?, fuel = ?, image = ?, description = ?,
             specs_json = ?, features_json = ?, colors_json = ?, price = ?, theme_json = ? WHERE id = ?`,
            [p.name || '', p.tagline || '', p.type || '', p.engine || '', p.fuel || '', p.image || '',
             p.description || '', JSON.stringify(p.specs || {}), JSON.stringify(p.features || []),
             JSON.stringify(p.colors || []), p.price || '', JSON.stringify(p.theme || {}), existing[0].id]
          )
          // Replace variants
          await conn.query('DELETE FROM product_variants WHERE product_id = ?', [existing[0].id])
          if (p.variants) {
            for (let i = 0; i < p.variants.length; i++) {
              await conn.query('INSERT INTO product_variants (product_id, name, price, sort_order) VALUES (?, ?, ?, ?)',
                [existing[0].id, p.variants[i].name, p.variants[i].price, i + 1])
            }
          }
          // Replace images
          await conn.query('DELETE FROM product_images WHERE product_id = ?', [existing[0].id])
          if (p.images) {
            for (let i = 0; i < p.images.length; i++) {
              await conn.query('INSERT INTO product_images (product_id, url, sort_order) VALUES (?, ?, ?)',
                [existing[0].id, p.images[i], i + 1])
            }
          }
        } else {
          const [result] = await conn.query(
            `INSERT INTO products (name, tagline, type, engine, fuel, image, description, specs_json, features_json, colors_json, price, theme_json)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [p.name || '', p.tagline || '', p.type || '', p.engine || '', p.fuel || '', p.image || '',
             p.description || '', JSON.stringify(p.specs || {}), JSON.stringify(p.features || []),
             JSON.stringify(p.colors || []), p.price || '', JSON.stringify(p.theme || {})]
          )
          if (p.variants) {
            for (let i = 0; i < p.variants.length; i++) {
              await conn.query('INSERT INTO product_variants (product_id, name, price, sort_order) VALUES (?, ?, ?, ?)',
                [result.insertId, p.variants[i].name, p.variants[i].price, i + 1])
            }
          }
          if (p.images) {
            for (let i = 0; i < p.images.length; i++) {
              await conn.query('INSERT INTO product_images (product_id, url, sort_order) VALUES (?, ?, ?)',
                [result.insertId, p.images[i], i + 1])
            }
          }
        }
      }
    }

    if (data.promotions) {
      const [existingRows] = await conn.query('SELECT id FROM promotions')
      const existingIds = existingRows.map(r => r.id)
      const incomingIds = data.promotions
        .filter(p => p.id && p.id.startsWith('promotion-'))
        .map(p => parseInt(p.id.replace('promotion-', ''), 10))
        .filter(id => !isNaN(id))
      const toDelete = existingIds.filter(id => !incomingIds.includes(id))
      for (const id of toDelete) {
        await conn.query('DELETE FROM promotions WHERE id = ?', [id])
      }
      for (const p of data.promotions) {
        const pid = p.id && parseInt(p.id.replace('promotion-', ''), 10)
        const [existing] = pid ? await conn.query('SELECT id FROM promotions WHERE id = ?', [pid]) : [[]]
        if (existing && existing[0]) {
          await conn.query(
            'UPDATE promotions SET title = ?, description = ?, image = ?, discount = ?, valid_until = ?, color = ? WHERE id = ?',
            [p.title || '', p.description || '', p.image || '', p.discount || '', p.validUntil || '', p.color || 'from-red-600 to-red-800', existing[0].id]
          )
        } else {
          await conn.query(
            'INSERT INTO promotions (title, description, image, discount, valid_until, color) VALUES (?, ?, ?, ?, ?, ?)',
            [p.title || '', p.description || '', p.image || '', p.discount || '', p.validUntil || '', p.color || 'from-red-600 to-red-800']
          )
        }
      }
    }

    if (data.testimonials) {
      const [existingRows] = await conn.query('SELECT id FROM testimonials')
      const existingIds = existingRows.map(r => r.id)
      const incomingIds = data.testimonials
        .filter(t => t.id && t.id.startsWith('testimonial-'))
        .map(t => parseInt(t.id.replace('testimonial-', ''), 10))
        .filter(id => !isNaN(id))
      const toDelete = existingIds.filter(id => !incomingIds.includes(id))
      for (const id of toDelete) {
        await conn.query('DELETE FROM testimonials WHERE id = ?', [id])
      }
      for (const t of data.testimonials) {
        const tid = t.id && parseInt(t.id.replace('testimonial-', ''), 10)
        const [existing] = tid ? await conn.query('SELECT id FROM testimonials WHERE id = ?', [tid]) : [[]]
        if (existing && existing[0]) {
          await conn.query(
            'UPDATE testimonials SET name = ?, car = ?, photo = ?, text = ?, rating = ? WHERE id = ?',
            [t.name || '', t.car || '', t.photo || '', t.text || '', t.rating || 5, existing[0].id]
          )
        } else {
          await conn.query(
            'INSERT INTO testimonials (name, car, photo, text, rating) VALUES (?, ?, ?, ?, ?)',
            [t.name || '', t.car || '', t.photo || '', t.text || '', t.rating || 5]
          )
        }
      }
    }

    if (data.gallery) {
      const [existingRows] = await conn.query('SELECT id FROM gallery')
      const existingIds = existingRows.map(r => r.id)
      const incomingIds = data.gallery
        .filter(g => g.id && g.id.startsWith('gallery-'))
        .map(g => parseInt(g.id.replace('gallery-', ''), 10))
        .filter(id => !isNaN(id))
      const toDelete = existingIds.filter(id => !incomingIds.includes(id))
      for (const id of toDelete) {
        await conn.query('DELETE FROM gallery WHERE id = ?', [id])
      }
      for (const g of data.gallery) {
        const gid = g.id && parseInt(g.id.replace('gallery-', ''), 10)
        const [existing] = gid ? await conn.query('SELECT id FROM gallery WHERE id = ?', [gid]) : [[]]
        if (existing && existing[0]) {
          await conn.query('UPDATE gallery SET src = ?, alt = ? WHERE id = ?', [g.src || '', g.alt || '', existing[0].id])
        } else {
          await conn.query('INSERT INTO gallery (src, alt, sort_order) VALUES (?, ?, ?)', [g.src || '', g.alt || '', data.gallery.indexOf(g) + 1])
        }
      }
    }

    if (data.faqs) {
      const [existingRows] = await conn.query('SELECT id FROM faqs')
      const existingIds = existingRows.map(r => r.id)
      const incomingIds = data.faqs
        .filter(f => f.id && f.id.startsWith('faq-'))
        .map(f => parseInt(f.id.replace('faq-', ''), 10))
        .filter(id => !isNaN(id))
      const toDelete = existingIds.filter(id => !incomingIds.includes(id))
      for (const id of toDelete) {
        await conn.query('DELETE FROM faqs WHERE id = ?', [id])
      }
      for (const f of data.faqs) {
        const fid = f.id && parseInt(f.id.replace('faq-', ''), 10)
        const [existing] = fid ? await conn.query('SELECT id FROM faqs WHERE id = ?', [fid]) : [[]]
        if (existing && existing[0]) {
          await conn.query('UPDATE faqs SET question = ?, answer = ? WHERE id = ?', [f.question || '', f.answer || '', existing[0].id])
        } else {
          await conn.query('INSERT INTO faqs (question, answer, sort_order) VALUES (?, ?, ?)', [f.question || '', f.answer || '', data.faqs.indexOf(f) + 1])
        }
      }
    }

    if (data.advantages) {
      const [existingRows] = await conn.query('SELECT id FROM advantages')
      const existingIds = existingRows.map(r => r.id)
      const incomingIds = data.advantages
        .filter(a => a.id && a.id.startsWith('advantage-'))
        .map(a => parseInt(a.id.replace('advantage-', ''), 10))
        .filter(id => !isNaN(id))
      const toDelete = existingIds.filter(id => !incomingIds.includes(id))
      for (const id of toDelete) {
        await conn.query('DELETE FROM advantages WHERE id = ?', [id])
      }
      for (const a of data.advantages) {
        const aid = a.id && parseInt(a.id.replace('advantage-', ''), 10)
        const [existing] = aid ? await conn.query('SELECT id FROM advantages WHERE id = ?', [aid]) : [[]]
        if (existing && existing[0]) {
          await conn.query('UPDATE advantages SET icon = ?, title = ?, description = ? WHERE id = ?',
            [a.icon || '', a.title || '', a.description || '', existing[0].id])
        } else {
          await conn.query('INSERT INTO advantages (icon, title, description, sort_order) VALUES (?, ?, ?, ?)',
            [a.icon || '', a.title || '', a.description || '', data.advantages.indexOf(a) + 1])
        }
      }
    }

    await conn.commit()
    return true
  } catch (e) {
    await conn.rollback()
    throw e
  } finally {
    conn.release()
  }
}

async function start() {
  try {
    await initDatabase()
    console.log('Database terhubung:', process.env.DB_NAME || 'honda_nagamotor')

    app.listen(PORT, () => {
      console.log(`Server berjalan di port ${PORT} (MySQL - Honda Nagamotor)`)
    })
  } catch (e) {
    console.error('Gagal inisialisasi database:', e.message)
    process.exit(1)
  }
}

start()
