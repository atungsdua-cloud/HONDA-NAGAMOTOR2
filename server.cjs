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
  ]

  for (const sql of tables) {
    await pool.query(sql)
  }
  console.log('Tabel database berhasil dibuat')
}

async function seedData() {
  const [rows] = await pool.query('SELECT id FROM profile WHERE id = 1')
  if (rows.length > 0) return

  await pool.query(`
    INSERT INTO profile (id, name, title, description, experience, phone, email, address)
    VALUES (1, 'Budi Santoso', 'Sales Executive Honda',
      'Dengan pengalaman lebih dari 10 tahun di industri otomotif, Budi Santoso adalah tenaga penjualan terpercaya di Honda Nagamotor. Beliau dikenal dengan pelayanan yang ramah, jujur, dan profesional.\n\nBudi telah membantu ratusan pelanggan menemukan mobil Honda impian mereka. Dengan pengetahuan mendalam tentang setiap model Honda, beliau siap memberikan konsultasi terbaik untuk Anda.\n\n"Kepuasan pelanggan adalah prioritas utama saya. Saya akan membantu Anda dari proses pemilihan hingga pengurusan dokumen, sehingga Anda dapat memiliki mobil Honda dengan pengalaman yang menyenangkan."',
      '10 Tahun Pengalaman', '+62 812 3456 7890', 'budi.santoso@honda-nagamotor.com',
      'Jl. Raya Utama No. 123, Jakarta')
  `)

  await pool.query(`
    INSERT INTO profile_stats (profile_id, icon, value, label, sort_order)
    VALUES (1, 'FiAward', '500+', 'Pelanggan Puas', 1),
           (1, 'FiUsers', '10+', 'Tahun Pengalaman', 2),
           (1, 'FiStar', '98%', 'Kepuasan Terjaga', 3)
  `)

  await pool.query(`
    INSERT INTO hero (id, title, subtitle)
    VALUES (1, 'Wujudkan Impian Anda Bersama Honda',
      'Dapatkan pengalaman terbaik memiliki mobil Honda baru dengan layanan profesional dari tenaga penjualan kami yang berpengalaman.')
  `)

  await pool.query(`
    INSERT INTO hero_images (hero_id, url, sort_order)
    VALUES (1, 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1600&q=80', 1),
           (1, 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=1600&q=80', 2),
           (1, 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1600&q=80', 3)
  `)

  await pool.query(`
    INSERT INTO hero_stats (hero_id, icon, value, label, suffix, sort_order)
    VALUES (1, 'FiAward', '500', 'Pelanggan Puas', '+', 1),
           (1, 'FiUsers', '10', 'Tahun Pelayanan', '+', 2),
           (1, 'FiStar', '98', 'Kepuasan', '%', 3)
  `)

  await pool.query(`
    INSERT INTO navbar (id, logo_text, logo_subtext, cta_text, cta_url)
    VALUES (1, 'HONDA', 'Nagamotor', 'Hubungi Saya', 'https://wa.me/6281234567890')
  `)

  await pool.query(`
    INSERT INTO navbar_menu_items (navbar_id, label, section, sort_order)
    VALUES (1, 'Beranda', 'home', 1),
           (1, 'Produk', 'produk', 2),
           (1, 'Promo', 'promo', 3),
           (1, 'Testimoni', 'testimoni', 4),
           (1, 'Galeri', 'galeri', 5),
           (1, 'Kontak', 'kontak', 6)
  `)

  await pool.query(`
    INSERT INTO loading_screen (id, title, subtext, tagline)
    VALUES (1, 'HONDA', 'NAGAMOTOR', 'Dealer Resmi Honda')
  `)

  await pool.query(`
    INSERT INTO contact (id, phone, email, address, map_url)
    VALUES (1, '+62 812 3456 7890', 'info@honda-nagamotor.com',
      'Jl. Raya Utama No. 123, Kelurahan Contoh, Kecamatan Teladan, Jakarta Pusat 12345',
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.5!2d106.8!3d-6.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTInMDAuMCJTIDEwNsKwNDgnMDAuMCJF!5e0!3m2!1sid!2sid!4v1')
  `)

  await pool.query(`
    INSERT INTO contact_social_media (contact_id, platform, url, icon, sort_order)
    VALUES (1, 'Instagram', 'https://instagram.com/honda.nagamotor', 'FaInstagram', 1),
           (1, 'Facebook', 'https://facebook.com/hondanagamotor', 'FaFacebook', 2),
           (1, 'TikTok', 'https://tiktok.com/@hondanagamotor', 'FaTiktok', 3)
  `)

  const products = [
    {
      name: 'Honda Brio Satya', tagline: 'Mobil Perkotaan yang Gesit dan Irit', type: 'Hatchback', engine: '1.2L i-VTEC', fuel: '20 km/l',
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
      description: 'Honda Brio Satya adalah mobil hatchback kompak yang dirancang untuk mobilitas perkotaan.',
      specs_json: JSON.stringify({ Mesin: '1.2L i-VTEC', Tenaga: '90 PS / 6000 rpm', Torsi: '110 Nm / 4800 rpm', Transmisi: 'CVT / Manual 5-percepatan', 'Kapasitas Tempat Duduk': '5 kursi', 'Kapasitas Tangki': '35 L', 'Ground Clearance': '165 mm' }),
      features_json: JSON.stringify(['Dual SRS Airbag', 'Sistem Pengereman ABS + EBD', 'Lampu depan LED', 'Power window otomatis', 'Sistem audio 2 speaker', 'AC digital']),
      colors_json: JSON.stringify(['#ffffff', '#1a1a2e', '#e8e8e8', '#c41e3a', '#2d5a27']),
      price: 'Rp 160 Juta',
      variants: [{ name: 'S MT', price: 'Rp 160 Juta' }, { name: 'S CVT', price: 'Rp 175 Juta' }, { name: 'E CVT', price: 'Rp 190 Juta' }]
    },
    {
      name: 'Honda Civic RS', tagline: 'Sporty Sedan dengan Teknologi Masa Depan', type: 'Sedan', engine: '1.5L VTEC Turbo', fuel: '18 km/l',
      image: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=800&q=80',
      description: 'Honda Civic RS hadir dengan desain sporty yang agresif dan mesin 1.5L VTEC Turbo yang bertenaga.',
      specs_json: JSON.stringify({ Mesin: '1.5L VTEC Turbo', Tenaga: '172 PS / 5500 rpm', Torsi: '220 Nm / 1700-5500 rpm', Transmisi: 'CVT', 'Kapasitas Tempat Duduk': '5 kursi', 'Kapasitas Tangki': '47 L', 'Ground Clearance': '136 mm' }),
      features_json: JSON.stringify(['Honda Sensing', 'Lampu LED full', 'Velg 18 inci', 'Sunroof', 'Sistem audio Bose 8 speaker', 'Honda Connect']),
      colors_json: JSON.stringify(['#ffffff', '#1a1a2e', '#c41e3a', '#4a4a4a', '#2d5a27']),
      price: 'Rp 560 Juta',
      variants: [{ name: 'RS CVT', price: 'Rp 560 Juta' }]
    },
    {
      name: 'Honda HR-V', tagline: 'Urban SUV Bergaya Premium', type: 'SUV', engine: '1.5L i-VTEC', fuel: '16 km/l',
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80',
      description: 'Honda HR-V adalah Urban SUV yang menggabungkan gaya hidup modern dengan kepraktisan.',
      specs_json: JSON.stringify({ Mesin: '1.5L i-VTEC', Tenaga: '121 PS / 6600 rpm', Torsi: '145 Nm / 4300 rpm', Transmisi: 'CVT', 'Kapasitas Tempat Duduk': '5 kursi', 'Kapasitas Tangki': '40 L', 'Ground Clearance': '181 mm' }),
      features_json: JSON.stringify(['Honda Sensing', 'Lampu LED soket', 'Velg 17 inci alloy', 'Moonroof', 'Honda Connect', 'Kursi kulit premium']),
      colors_json: JSON.stringify(['#ffffff', '#1a1a2e', '#c41e3a', '#4a4a4a', '#d4a843']),
      price: 'Rp 360 Juta',
      variants: [{ name: 'S CVT', price: 'Rp 360 Juta' }, { name: 'E CVT', price: 'Rp 390 Juta' }, { name: 'RS CVT', price: 'Rp 430 Juta' }]
    },
    {
      name: 'Honda BR-V', tagline: 'SUV 7-Seater Keluarga Terbaik', type: 'SUV', engine: '1.5L i-VTEC', fuel: '15 km/l',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',
      description: 'Honda BR-V adalah SUV 7-seater yang dirancang untuk keluarga Indonesia.',
      specs_json: JSON.stringify({ Mesin: '1.5L i-VTEC', Tenaga: '119 PS / 6600 rpm', Torsi: '145 Nm / 4300 rpm', Transmisi: 'CVT', 'Kapasitas Tempat Duduk': '7 kursi', 'Kapasitas Tangki': '42 L', 'Ground Clearance': '201 mm' }),
      features_json: JSON.stringify(['Honda Sensing', 'Lampu LED', 'Velg 17 inci', 'AC dual zone', 'Honda Connect', 'Kursi baris ke-2 lipat one-touch']),
      colors_json: JSON.stringify(['#ffffff', '#1a1a2e', '#c41e3a', '#4a4a4a', '#2d5a27']),
      price: 'Rp 300 Juta',
      variants: [{ name: 'S CVT', price: 'Rp 300 Juta' }, { name: 'E CVT', price: 'Rp 325 Juta' }, { name: 'RS CVT', price: 'Rp 365 Juta' }]
    },
    {
      name: 'Honda CR-V', tagline: 'SUV Premium untuk Gaya Hidup Aktif', type: 'SUV', engine: '1.5L VTEC Turbo', fuel: '14 km/l',
      image: 'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=800&q=80',
      description: 'Honda CR-V adalah SUV premium yang menawarkan kenyamanan kelas atas dengan performa mesin turbo.',
      specs_json: JSON.stringify({ Mesin: '1.5L VTEC Turbo', Tenaga: '190 PS / 5600 rpm', Torsi: '243 Nm / 2000-5000 rpm', Transmisi: 'CVT', 'Kapasitas Tempat Duduk': '5 kursi (7 kursi untuk varian tertentu)', 'Kapasitas Tangki': '57 L', 'Ground Clearance': '208 mm' }),
      features_json: JSON.stringify(['Honda Sensing', 'Lampu LED full', 'Velg 18 inci', 'Panoramic sunroof', 'Sistem audio premium', 'Honda Connect', 'Power tailgate']),
      colors_json: JSON.stringify(['#ffffff', '#1a1a2e', '#c41e3a', '#4a4a4a', '#2d5a27']),
      price: 'Rp 520 Juta',
      variants: [{ name: '1.5L Turbo CVT', price: 'Rp 520 Juta' }, { name: '1.5L Turbo Prestige', price: 'Rp 560 Juta' }, { name: 'RS e:HEV', price: 'Rp 620 Juta' }]
    },
    {
      name: 'Honda Accord', tagline: 'Sedan Eksekutif Kelas Dunia', type: 'Sedan', engine: '1.5L VTEC Turbo', fuel: '16 km/l',
      image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80',
      description: 'Honda Accord adalah sedan eksekutif yang memadukan elegansi, kenyamanan, dan teknologi terkini.',
      specs_json: JSON.stringify({ Mesin: '1.5L VTEC Turbo', Tenaga: '187 PS / 5500 rpm', Torsi: '240 Nm / 1600-5000 rpm', Transmisi: 'CVT', 'Kapasitas Tempat Duduk': '5 kursi', 'Kapasitas Tangki': '56 L', 'Ground Clearance': '147 mm' }),
      features_json: JSON.stringify(['Honda Sensing', 'Lampu LED matrix', 'Velg 19 inci', 'Wireless charging', 'Sistem audio Bose 10 speaker', 'Honda Connect', 'Kursi depan elektrik dengan memori']),
      colors_json: JSON.stringify(['#ffffff', '#1a1a2e', '#c41e3a', '#4a4a4a', '#d4a843']),
      price: 'Rp 620 Juta',
      variants: [{ name: '1.5L Turbo CVT', price: 'Rp 620 Juta' }]
    },
    {
      name: 'Honda City Hatchback', tagline: 'Hatchback Premium dengan Gaya Sporty', type: 'Hatchback', engine: '1.5L i-VTEC', fuel: '17 km/l',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
      description: 'Honda City Hatchback menawarkan desain sporty dengan kepraktisan mobil hatchback.',
      specs_json: JSON.stringify({ Mesin: '1.5L i-VTEC', Tenaga: '119 PS / 6600 rpm', Torsi: '145 Nm / 4300 rpm', Transmisi: 'CVT', 'Kapasitas Tempat Duduk': '5 kursi', 'Kapasitas Tangki': '40 L', 'Ground Clearance': '163 mm' }),
      features_json: JSON.stringify(['Honda Sensing', 'Lampu LED', 'Velg 16 inci', 'Honda Connect', 'Kursi belakang lipat 60:40', 'AC digital']),
      colors_json: JSON.stringify(['#ffffff', '#1a1a2e', '#c41e3a', '#4a4a4a', '#2d5a27']),
      price: 'Rp 280 Juta',
      variants: [{ name: 'S CVT', price: 'Rp 280 Juta' }, { name: 'RS CVT', price: 'Rp 320 Juta' }]
    }
  ]

  for (const p of products) {
    const { variants, ...productData } = p
    const [result] = await pool.query(
      `INSERT INTO products (name, tagline, type, engine, fuel, image, description, specs_json, features_json, colors_json, price)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [productData.name, productData.tagline, productData.type, productData.engine, productData.fuel, productData.image, productData.description, productData.specs_json, productData.features_json, productData.colors_json, productData.price]
    )
    for (let i = 0; i < variants.length; i++) {
      await pool.query(
        'INSERT INTO product_variants (product_id, name, price, sort_order) VALUES (?, ?, ?, ?)',
        [result.insertId, variants[i].name, variants[i].price, i + 1]
      )
    }
  }

  await pool.query(
    `INSERT INTO promotions (title, description, image, discount, valid_until, color) VALUES
     ('DP 0% untuk Semua Model', 'Dapatkan kemudahan memiliki mobil Honda baru dengan DP 0% untuk semua model. Promo terbatas!', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80', 'DP 0%', '2026-12-31', 'from-red-600 to-red-800'),
     ('Trade-in Bonus Tinggi', 'Tukar tambah mobil lama Anda dengan penawaran harga terbaik. Dapatkan bonus hingga Rp 10 Juta!', 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80', 'Bonus Rp 10 Juta', '2026-12-31', 'from-blue-600 to-blue-800'),
     ('Service Gratis 1 Tahun', 'Beli mobil Honda sekarang dan dapatkan layanan gratis selama 1 tahun atau 20.000 km.', 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&q=80', 'Gratis Servis', '2026-12-31', 'from-green-600 to-green-800'),
     ('Promo Akhir Tahun', 'Diskon spesial akhir tahun untuk semua model Honda. Jangan lewatkan kesempatan ini!', 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80', 'Diskon 10%', '2026-12-31', 'from-purple-600 to-purple-800')`
  )

  await pool.query(
    `INSERT INTO testimonials (name, car, photo, text, rating) VALUES
     ('Andi Pratama', 'Honda Civic RS', 'https://i.pravatar.cc/150?img=1', 'Pelayanan dari Pak Budi sangat memuaskan! Beliau membantu saya dari awal hingga proses pengurusan STNK dan BPKB. Mobil Civic RS saya juga dirawat dengan baik sebelum diserahkan. Sangat merekomendasikan!', 5),
     ('Siti Nurhaliza', 'Honda BR-V', 'https://i.pravatar.cc/150?img=5', 'Saya membeli Honda BR-V untuk keluarga. Prosesnya cepat dan mudah berkat bantuan Pak Budi. Harga yang ditawarkan juga kompetitif. Terima kasih Honda Nagamotor!', 5),
     ('Bambang Wijaya', 'Honda HR-V', 'https://i.pravatar.cc/150?img=3', 'Pengalaman pertama membeli mobil baru dan ternyata tidak serumit yang saya bayangkan. Salesnya ramah, jujur, dan tidak neko-neko. Proses kredit juga dipermudah. Top!', 4),
     ('Dewi Lestari', 'Honda Brio Satya', 'https://i.pravatar.cc/150?img=9', 'Brio Satya adalah pilihan tepat untuk saya yang sering berkendara di perkotaan. Irit bahan bakar dan mudah parkir. Pelayanan after-sales dari Honda Nagamotor juga bagus!', 5),
     ('Hendra Gunawan', 'Honda CR-V', 'https://i.pravatar.cc/150?img=11', 'Saya sudah 3 kali membeli mobil dari Honda Nagamotor. Pelayanannya konsisten baik. Pak Budi selalu siap membantu kapan pun saya butuh. Recommended banget!', 5),
     ('Rina Marlina', 'Honda City Hatchback', 'https://i.pravatar.cc/150?img=44', 'City Hatchback RS-nya keren banget! Salesnya sabar menjelaskan semua fitur. Saya jadi makin cinta sama mobil baru saya. Thank you Honda Nagamotor!', 5)`
  )

  await pool.query(
    `INSERT INTO faqs (question, answer, sort_order) VALUES
     ('Bagaimana cara pembelian mobil Honda di Nagamotor?', 'Proses pembelian sangat mudah. Anda dapat mengunjungi showroom kami, menghubungi sales melalui WhatsApp, atau mengisi form kontak di website ini. Kami akan membantu Anda dari pemilihan model, simulasi kredit, hingga pengurusan dokumen STNK dan BPKB.', 1),
     ('Apakah tersedia opsi pembayaran kredit?', 'Tentu! Kami bekerja sama dengan berbagai bank ternama seperti BCA, Mandiri, BNI, BRI, dan CIMB Niaga untuk memberikan opsi kredit yang sesuai dengan kebutuhan Anda. Tim kami akan membantu mensimulasikan cicilan yang paling sesuai dengan budget Anda.', 2),
     ('Berapa lama proses pengurusan STNK dan BPKB?', 'Proses pengurusan STNK dan BPKB biasanya memakan waktu 7-14 hari kerja setelah pembayaran lunas. Kami akan mengurus semuanya untuk Anda sehingga Anda tinggal menunggu mobil siap dibawa pulang.', 3),
     ('Apakah ada layanan test drive?', 'Ya, kami menyediakan layanan test drive untuk semua model Honda. Silakan hubungi kami untuk menjadwalkan test drive sesuai dengan waktu yang Anda inginkan. Test drive gratis tanpa biaya apapun!', 4),
     ('Apa saja yang termasuk dalam layanan after-sales?', 'Kami menyediakan layanan after-sales lengkap termasuk service berkala, garansi mobil baru (3 tahun atau 100.000 km), suku cadang asli Honda, dan layanan darurat 24 jam. Kami juga memiliki bengkel resmi dengan teknisi bersertifikat Honda.', 5),
     ('Bagaimana cara trade-in mobil lama?', 'Anda dapat menukar tambah mobil lama Anda dengan mobil Honda baru. Tim kami akan melakukan penilaian mobil lama Anda secara profesional dan memberikan harga terbaik. Prosesnya cepat dan mudah!', 6)`
  )

  await pool.query(
    `INSERT INTO advantages (icon, title, description, sort_order) VALUES
     ('BsLightningCharge', 'Proses Cepat & Mudah', 'Pengurusan dokumen, kredit, dan pengiriman mobil dilakukan dengan cepat dan efisien. Anda tinggal duduk santai dan kami yang mengurus semuanya.', 1),
     ('BsFileEarmarkCheck', 'Garansi Resmi Honda', 'Setiap pembelian mobil Honda baru mendapatkan garansi resmi pabrik selama 3 tahun atau 100.000 km, plus layanan darurat 24 jam.', 2),
     ('BsGift', 'Promo & Diskon Menarik', 'Dapatkan penawaran spesial termasuk DP 0%, diskon akhir tahun, bonus trade-in, dan program cicilan ringan yang sesuai dengan budget Anda.', 3),
     ('BsChatDots', 'Konsultasi Gratis', 'Tim sales profesional kami siap membantu Anda 7 hari seminggu. Konsultasi gratis tentang model, simulasi kredit, dan kebutuhan otomotif Anda.', 4),
     ('BsCarFront', 'Test Drive Langsung', 'Rasakan pengalaman berkendara mobil Honda impian Anda dengan layanan test drive gratis. Tersedia untuk semua model terbaru.', 5),
     ('BsTruck', 'Pengiriman ke Rumah', 'Nikmati kemudahan pengiriman mobil baru langsung ke rumah Anda. Kami antar mobil dalam kondisi prima dengan asuransi pengiriman.', 6)`
  )

  await pool.query(
    `INSERT INTO gallery (src, alt, sort_order) VALUES
     ('https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80', 'Honda Brio', 1),
     ('https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=800&q=80', 'Honda Civic RS', 2),
     ('https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80', 'Honda HR-V', 3),
     ('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80', 'Honda BR-V', 4),
     ('https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=800&q=80', 'Honda CR-V', 5),
     ('https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80', 'Honda Accord', 6),
     ('https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80', 'Honda City Hatchback', 7),
     ('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80', 'Showroom Honda', 8),
     ('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80', 'Interior Showroom', 9)`
  )

  console.log('Database Honda Nagamotor berhasil diinisialisasi dengan data dummy')
}

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

  const [products] = await pool.query('SELECT id, name, tagline, type, engine, fuel, image, description, specs_json, features_json, colors_json, price FROM products ORDER BY id')
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
        'UPDATE contact SET phone = ?, email = ?, address = ?, map_url = ? WHERE id = 1',
        [c.phone || '', c.email || '', c.address || '', c.mapUrl || '']
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
      for (const p of data.products) {
        const pid = p.id && parseInt(p.id.replace('product-', ''))
        const [existing] = pid ? await conn.query('SELECT id FROM products WHERE id = ?', [pid]) : [[]]
        if (existing && existing[0]) {
          await conn.query(
            `UPDATE products SET name = ?, tagline = ?, type = ?, engine = ?, fuel = ?, image = ?, description = ?,
             specs_json = ?, features_json = ?, colors_json = ?, price = ? WHERE id = ?`,
            [p.name || '', p.tagline || '', p.type || '', p.engine || '', p.fuel || '', p.image || '',
             p.description || '', JSON.stringify(p.specs || {}), JSON.stringify(p.features || []),
             JSON.stringify(p.colors || []), p.price || '', existing[0].id]
          )
        } else {
          const [result] = await conn.query(
            `INSERT INTO products (name, tagline, type, engine, fuel, image, description, specs_json, features_json, colors_json, price)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [p.name || '', p.tagline || '', p.type || '', p.engine || '', p.fuel || '', p.image || '',
             p.description || '', JSON.stringify(p.specs || {}), JSON.stringify(p.features || []),
             JSON.stringify(p.colors || []), p.price || '']
          )
          if (p.variants) {
            for (let i = 0; i < p.variants.length; i++) {
              await conn.query('INSERT INTO product_variants (product_id, name, price, sort_order) VALUES (?, ?, ?, ?)',
                [result.insertId, p.variants[i].name, p.variants[i].price, i + 1])
            }
          }
        }
      }
    }

    if (data.promotions) {
      for (const p of data.promotions) {
        const pid = p.id && parseInt(p.id.replace('promotion-', ''))
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
      for (const t of data.testimonials) {
        const tid = t.id && parseInt(t.id.replace('testimonial-', ''))
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
      for (const g of data.gallery) {
        const gid = g.id && parseInt(g.id.replace('gallery-', ''))
        const [existing] = gid ? await conn.query('SELECT id FROM gallery WHERE id = ?', [gid]) : [[]]
        if (existing && existing[0]) {
          await conn.query('UPDATE gallery SET src = ?, alt = ? WHERE id = ?', [g.src || '', g.alt || '', existing[0].id])
        } else {
          await conn.query('INSERT INTO gallery (src, alt, sort_order) VALUES (?, ?, ?)', [g.src || '', g.alt || '', data.gallery.indexOf(g) + 1])
        }
      }
    }

    if (data.faqs) {
      for (const f of data.faqs) {
        const fid = f.id && parseInt(f.id.replace('faq-', ''))
        const [existing] = fid ? await conn.query('SELECT id FROM faqs WHERE id = ?', [fid]) : [[]]
        if (existing && existing[0]) {
          await conn.query('UPDATE faqs SET question = ?, answer = ? WHERE id = ?', [f.question || '', f.answer || '', existing[0].id])
        } else {
          await conn.query('INSERT INTO faqs (question, answer, sort_order) VALUES (?, ?, ?)', [f.question || '', f.answer || '', data.faqs.indexOf(f) + 1])
        }
      }
    }

    if (data.advantages) {
      for (const a of data.advantages) {
        const aid = a.id && parseInt(a.id.replace('advantage-', ''))
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
    await seedData()

    app.listen(PORT, () => {
      console.log(`Server berjalan di port ${PORT} (MySQL - Honda Nagamotor)`)
    })
  } catch (e) {
    console.error('Gagal inisialisasi database:', e.message)
    process.exit(1)
  }
}

start()
