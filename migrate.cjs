/**
 * Migrasi data dari SQLite (data-export.json) ke MySQL
 * Cara pakai: node migrate.cjs
 */
require('dotenv').config()
const mysql = require('mysql2/promise')
const fs = require('fs')
const { join } = require('path')

async function migrate() {
  const exportFile = join(__dirname, 'data-export.json')
  if (!fs.existsSync(exportFile)) {
    console.error('File data-export.json tidak ditemukan!')
    console.error('Jalankan dulu: npm run export-data')
    process.exit(1)
  }

  const data = JSON.parse(fs.readFileSync(exportFile, 'utf-8'))

  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'honda_nagamotor',
    port: parseInt(process.env.DB_PORT || '3306'),
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
  })

  try {
    // Cek koneksi
    await pool.query('SELECT 1')
    console.log('Terhubung ke MySQL:', process.env.DB_NAME)

    const conn = await pool.getConnection()
    await conn.beginTransaction()

    // Helper upsert: delete dulu lalu insert
    async function replace(table, columns, values) {
      await conn.query('DELETE FROM ' + table)
      if (values.length === 0) return
      const placeholders = values.map(() => '(' + columns.map(() => '?').join(',') + ')').join(',')
      const flat = values.flat()
      await conn.query('INSERT INTO ' + table + ' (' + columns.join(',') + ') VALUES ' + placeholders, flat)
    }

    // Profile
    const p = data.profile
    await conn.query('DELETE FROM profile_stats WHERE profile_id = 1')
    await conn.query('DELETE FROM profile')
    await conn.query(
      'INSERT INTO profile (id, name, title, description, photo, experience, phone, email, address) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?)',
      [p.name, p.title, p.description, p.photo || '', p.experience || '', p.phone || '', p.email || '', p.address || '']
    )
    if (p.stats) {
      for (let i = 0; i < p.stats.length; i++) {
        await conn.query('INSERT INTO profile_stats (profile_id, icon, value, label, sort_order) VALUES (1, ?, ?, ?, ?)',
          [p.stats[i].icon, p.stats[i].value, p.stats[i].label, i + 1])
      }
    }

    // Hero
    const h = data.hero
    await conn.query('DELETE FROM hero_images WHERE hero_id = 1')
    await conn.query('DELETE FROM hero_stats WHERE hero_id = 1')
    await conn.query('DELETE FROM hero')
    await conn.query(
      'INSERT INTO hero (id, title, subtitle, sales_photo) VALUES (1, ?, ?, ?)',
      [h.title, h.subtitle, h.salesPhoto || '']
    )
    if (h.images) {
      for (let i = 0; i < h.images.length; i++) {
        await conn.query('INSERT INTO hero_images (hero_id, url, sort_order) VALUES (1, ?, ?)', [h.images[i], i + 1])
      }
    }
    if (h.stats) {
      for (let i = 0; i < h.stats.length; i++) {
        await conn.query('INSERT INTO hero_stats (hero_id, icon, value, label, suffix, sort_order) VALUES (1, ?, ?, ?, ?, ?)',
          [h.stats[i].icon, h.stats[i].value, h.stats[i].label, h.stats[i].suffix || '', i + 1])
      }
    }

    // Navbar
    const n = data.navbar
    await conn.query('DELETE FROM navbar_menu_items WHERE navbar_id = 1')
    await conn.query('DELETE FROM navbar')
    await conn.query(
      'INSERT INTO navbar (id, logo_image, logo_text, logo_subtext, cta_text, cta_url) VALUES (1, ?, ?, ?, ?, ?)',
      [n.logoImage || '', n.logoText || 'HONDA', n.logoSubtext || 'Nagamotor', n.ctaText || 'Hubungi Saya', n.ctaUrl || '']
    )
    if (n.menuItems) {
      for (let i = 0; i < n.menuItems.length; i++) {
        await conn.query('INSERT INTO navbar_menu_items (navbar_id, label, section, sort_order) VALUES (1, ?, ?, ?)',
          [n.menuItems[i].label, n.menuItems[i].section, i + 1])
      }
    }

    // Loading Screen
    const l = data.loadingScreen
    await conn.query('DELETE FROM loading_screen')
    await conn.query(
      'INSERT INTO loading_screen (id, title, subtext, tagline) VALUES (1, ?, ?, ?)',
      [l.title || 'HONDA', l.subtext || 'NAGAMOTOR', l.tagline || 'Dealer Resmi Honda']
    )

    // Contact
    const c = data.contact
    await conn.query('DELETE FROM contact_social_media WHERE contact_id = 1')
    await conn.query('DELETE FROM contact')
    await conn.query(
      'INSERT INTO contact (id, phone, email, address, map_url, hours_json) VALUES (1, ?, ?, ?, ?, ?)',
      [c.phone || '', c.email || '', c.address || '', c.mapUrl || '', JSON.stringify(c.hours || {})]
    )
    if (c.socialMedia) {
      for (let i = 0; i < c.socialMedia.length; i++) {
        await conn.query('INSERT INTO contact_social_media (contact_id, platform, url, icon, sort_order) VALUES (1, ?, ?, ?, ?)',
          [c.socialMedia[i].platform, c.socialMedia[i].url, c.socialMedia[i].icon, i + 1])
      }
    }

    // Products
    await conn.query('DELETE FROM product_variants')
    await conn.query('DELETE FROM product_images')
    await conn.query('DELETE FROM products')
    for (const p of data.products) {
      const [result] = await conn.query(
        `INSERT INTO products (name, tagline, type, engine, fuel, image, description, specs_json, features_json, colors_json, price, theme_json)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [p.name, p.tagline || '', p.type || '', p.engine || '', p.fuel || '', p.image || '', p.description || '',
         JSON.stringify(p.specs || {}), JSON.stringify(p.features || []), JSON.stringify(p.colors || []), p.price || '',
         JSON.stringify(p.theme || {})]
      )
      if (p.variants) {
        for (let i = 0; i < p.variants.length; i++) {
          await conn.query('INSERT INTO product_variants (product_id, name, price, sort_order) VALUES (?, ?, ?, ?)',
            [result.insertId, p.variants[i].name, p.variants[i].price, i + 1])
        }
      }
    }

    // Promotions
    await conn.query('DELETE FROM promotions')
    for (const p of data.promotions) {
      await conn.query(
        'INSERT INTO promotions (title, description, image, discount, valid_until, color) VALUES (?, ?, ?, ?, ?, ?)',
        [p.title, p.description || '', p.image || '', p.discount || '', p.validUntil || '', p.color || 'from-red-600 to-red-800']
      )
    }

    // Testimonials
    await conn.query('DELETE FROM testimonials')
    for (const t of data.testimonials) {
      await conn.query(
        'INSERT INTO testimonials (name, car, photo, text, rating) VALUES (?, ?, ?, ?, ?)',
        [t.name, t.car || '', t.photo || '', t.text, t.rating || 5]
      )
    }

    // Gallery
    await conn.query('DELETE FROM gallery')
    for (let i = 0; i < data.gallery.length; i++) {
      await conn.query('INSERT INTO gallery (src, alt, sort_order) VALUES (?, ?, ?)',
        [data.gallery[i].src, data.gallery[i].alt || '', i + 1])
    }

    // FAQs
    await conn.query('DELETE FROM faqs')
    for (let i = 0; i < data.faqs.length; i++) {
      await conn.query('INSERT INTO faqs (question, answer, sort_order) VALUES (?, ?, ?)',
        [data.faqs[i].question, data.faqs[i].answer, i + 1])
    }

    // Advantages
    await conn.query('DELETE FROM advantages')
    for (let i = 0; i < data.advantages.length; i++) {
      await conn.query('INSERT INTO advantages (icon, title, description, sort_order) VALUES (?, ?, ?, ?)',
        [data.advantages[i].icon, data.advantages[i].title, data.advantages[i].description || '', i + 1])
    }

    await conn.commit()
    conn.release()

    console.log('✅ Migrasi berhasil! Semua data dari SQLite telah dipindahkan ke MySQL.')
  } catch (e) {
    console.error('❌ Migrasi gagal:', e.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

migrate()
