require('dotenv').config()
const mysql = require('mysql2/promise')
const sqlite3 = require('better-sqlite3')

async function updateHarga() {
  if (!process.env.DB_HOST || process.env.DB_HOST === 'localhost' || !process.env.DB_PASSWORD) {
    console.error('Isi dulu .env dengan kredensial MySQL yang benar!')
    process.exit(1)
  }

  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306'),
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
  })

  const db = new sqlite3('/workspaces/HONDA-NAGAMOTOR2/data.db')

  try {
    // Baca produk + varian dari SQLite
    const products = db.prepare('SELECT id, name, tagline, type, engine, fuel, price FROM products ORDER BY id').all()
    const getVariants = db.prepare('SELECT name, price FROM product_variants WHERE product_id = ? ORDER BY sort_order')
    const getImages = db.prepare('SELECT url FROM product_images WHERE product_id = ? ORDER BY sort_order')

    const conn = await pool.getConnection()
    await conn.beginTransaction()

    for (const p of products) {
      const variants = getVariants.all(p.id)
      const images = getImages.all(p.id)

      // Cek apakah produk sudah ada di MySQL (cocokkan nama)
      const [existing] = await conn.query('SELECT id FROM products WHERE name = ?', [p.name])

      if (existing.length > 0) {
        const pid = existing[0].id
        // Update info produk
        await conn.query(
          `UPDATE products SET tagline=?, type=?, engine=?, fuel=?, price=? WHERE id=?`,
          [p.tagline || '', p.type || '', p.engine || '', p.fuel || '', p.price || '', pid]
        )
        // Hapus varian lama, insert baru
        await conn.query('DELETE FROM product_variants WHERE product_id = ?', [pid])
        for (let i = 0; i < variants.length; i++) {
          await conn.query(
            'INSERT INTO product_variants (product_id, name, price, sort_order) VALUES (?, ?, ?, ?)',
            [pid, variants[i].name, variants[i].price, i + 1]
          )
        }
        console.log(`✓ Update: ${p.name} (${variants.length} varian)`)
      } else {
        // Produk baru — insert
        // Cari id terakhir + 1
        const [last] = await conn.query('SELECT MAX(id) as maxId FROM products')
        const newId = (last[0].maxId || 0) + 1
        await conn.query(
          `INSERT INTO products (id, name, tagline, type, engine, fuel, price) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [newId, p.name, p.tagline || '', p.type || '', p.engine || '', p.fuel || '', p.price || '']
        )
        for (let i = 0; i < variants.length; i++) {
          await conn.query(
            'INSERT INTO product_variants (product_id, name, price, sort_order) VALUES (?, ?, ?, ?)',
            [newId, variants[i].name, variants[i].price, i + 1]
          )
        }
        console.log(`+ Baru: ${p.name} (${variants.length} varian)`)
      }
    }

    await conn.commit()
    conn.release()
    console.log('\n✅ Semua harga berhasil diupdate di MySQL!')
  } catch (e) {
    console.error('❌ Gagal:', e.message)
    console.error(e.stack)
    process.exit(1)
  } finally {
    await pool.end()
    db.close()
  }
}

updateHarga()