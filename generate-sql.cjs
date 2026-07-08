const Database = require('better-sqlite3')
const db = new Database('data.db')
const fs = require('fs')

const q = v => {
  if (v === null || v === undefined) return 'NULL'
  const s = String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')
  return "'" + s + "'"
}

const sql = []
sql.push('-- Honda Nagamotor - Full Database Dump')
sql.push('-- Generated: ' + new Date().toISOString())
sql.push('')
sql.push('SET FOREIGN_KEY_CHECKS = 0;')
sql.push('')

const tables = [
  `CREATE TABLE IF NOT EXISTS profile (
    id INT PRIMARY KEY DEFAULT 1,
    name TEXT NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL,
    photo TEXT DEFAULT '', experience TEXT DEFAULT '', phone TEXT DEFAULT '',
    email TEXT DEFAULT '', address TEXT DEFAULT '',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS profile_stats (
    id INT AUTO_INCREMENT PRIMARY KEY, profile_id INT NOT NULL DEFAULT 1,
    icon VARCHAR(50) NOT NULL, value VARCHAR(50) NOT NULL,
    label VARCHAR(100) NOT NULL, sort_order INT NOT NULL DEFAULT 0,
    FOREIGN KEY (profile_id) REFERENCES profile(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS hero (
    id INT PRIMARY KEY DEFAULT 1, title TEXT NOT NULL, subtitle TEXT NOT NULL,
    sales_photo TEXT DEFAULT '',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS hero_images (
    id INT AUTO_INCREMENT PRIMARY KEY, hero_id INT NOT NULL DEFAULT 1,
    url TEXT NOT NULL, sort_order INT NOT NULL DEFAULT 0,
    FOREIGN KEY (hero_id) REFERENCES hero(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS hero_stats (
    id INT AUTO_INCREMENT PRIMARY KEY, hero_id INT NOT NULL DEFAULT 1,
    icon VARCHAR(50) NOT NULL, value VARCHAR(50) NOT NULL,
    label VARCHAR(100) NOT NULL, suffix VARCHAR(20) DEFAULT '',
    sort_order INT NOT NULL DEFAULT 0,
    FOREIGN KEY (hero_id) REFERENCES hero(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS navbar (
    id INT PRIMARY KEY DEFAULT 1, logo_image TEXT DEFAULT '',
    logo_text TEXT DEFAULT 'HONDA', logo_subtext TEXT DEFAULT 'Nagamotor',
    cta_text TEXT DEFAULT 'Hubungi Saya', cta_url TEXT DEFAULT '',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS navbar_menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY, navbar_id INT NOT NULL DEFAULT 1,
    label VARCHAR(100) NOT NULL, section VARCHAR(100) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    FOREIGN KEY (navbar_id) REFERENCES navbar(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS loading_screen (
    id INT PRIMARY KEY DEFAULT 1, title TEXT DEFAULT 'HONDA',
    subtext TEXT DEFAULT 'NAGAMOTOR', tagline TEXT DEFAULT 'Dealer Resmi Honda'
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS contact (
    id INT PRIMARY KEY DEFAULT 1, phone TEXT DEFAULT '', email TEXT DEFAULT '',
    address TEXT DEFAULT '', map_url TEXT DEFAULT '',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS contact_social_media (
    id INT AUTO_INCREMENT PRIMARY KEY, contact_id INT NOT NULL DEFAULT 1,
    platform VARCHAR(100) NOT NULL, url TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL, sort_order INT NOT NULL DEFAULT 0,
    FOREIGN KEY (contact_id) REFERENCES contact(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(200) NOT NULL,
    tagline TEXT DEFAULT '', type VARCHAR(100) NOT NULL DEFAULT '',
    engine VARCHAR(100) DEFAULT '', fuel VARCHAR(100) DEFAULT '',
    image TEXT DEFAULT '', description TEXT DEFAULT '',
    specs_json LONGTEXT DEFAULT '{}', features_json LONGTEXT DEFAULT '[]',
    colors_json LONGTEXT DEFAULT '[]', price VARCHAR(100) DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS product_images (
    id INT AUTO_INCREMENT PRIMARY KEY, product_id INT NOT NULL,
    url TEXT NOT NULL, sort_order INT NOT NULL DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS product_variants (
    id INT AUTO_INCREMENT PRIMARY KEY, product_id INT NOT NULL,
    name VARCHAR(200) NOT NULL, price VARCHAR(100) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS promotions (
    id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(200) NOT NULL,
    description TEXT DEFAULT '', image TEXT DEFAULT '',
    discount VARCHAR(100) DEFAULT '', valid_until VARCHAR(100) DEFAULT '',
    color VARCHAR(100) DEFAULT 'from-red-600 to-red-800',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(200) NOT NULL,
    car VARCHAR(200) DEFAULT '', photo TEXT DEFAULT '',
    text TEXT NOT NULL, rating INT DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS gallery (
    id INT AUTO_INCREMENT PRIMARY KEY, src TEXT NOT NULL,
    alt TEXT DEFAULT '', sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS faqs (
    id INT AUTO_INCREMENT PRIMARY KEY, question TEXT NOT NULL,
    answer TEXT NOT NULL, sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS advantages (
    id INT AUTO_INCREMENT PRIMARY KEY, icon VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL, description TEXT DEFAULT '',
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
]

tables.forEach(t => { sql.push(t + ';') })
sql.push('')

// --- DATA ---

const p = db.prepare('SELECT * FROM profile WHERE id=1').get()
sql.push('DELETE FROM profile;')
sql.push('INSERT INTO profile (id,name,title,description,photo,experience,phone,email,address) VALUES (1,' + [p.name,p.title,p.description,p.photo||'',p.experience||'',p.phone||'',p.email||'',p.address||''].map(q).join(',') + ');')
sql.push('')

sql.push('DELETE FROM profile_stats;')
db.prepare('SELECT * FROM profile_stats ORDER BY sort_order').all().forEach(s => {
  sql.push('INSERT INTO profile_stats (profile_id,icon,value,label,sort_order) VALUES (1,' + [s.icon,s.value,s.label,s.sort_order].map(q).join(',') + ');')
})
sql.push('')

const h = db.prepare('SELECT * FROM hero WHERE id=1').get()
sql.push('DELETE FROM hero;')
sql.push('INSERT INTO hero (id,title,subtitle,sales_photo) VALUES (1,' + [h.title,h.subtitle,h.sales_photo||''].map(q).join(',') + ');')
sql.push('')

sql.push('DELETE FROM hero_images;')
db.prepare('SELECT * FROM hero_images ORDER BY sort_order').all().forEach(r => {
  sql.push('INSERT INTO hero_images (hero_id,url,sort_order) VALUES (1,' + [r.url,r.sort_order].map(q).join(',') + ');')
})
sql.push('')

sql.push('DELETE FROM hero_stats;')
db.prepare('SELECT * FROM hero_stats ORDER BY sort_order').all().forEach(s => {
  sql.push('INSERT INTO hero_stats (hero_id,icon,value,label,suffix,sort_order) VALUES (1,' + [s.icon,s.value,s.label,s.suffix||'',s.sort_order].map(q).join(',') + ');')
})
sql.push('')

const n = db.prepare('SELECT * FROM navbar WHERE id=1').get()
sql.push('DELETE FROM navbar;')
sql.push('INSERT INTO navbar (id,logo_image,logo_text,logo_subtext,cta_text,cta_url) VALUES (1,' + [n.logo_image||'',n.logo_text||'HONDA',n.logo_subtext||'Nagamotor',n.cta_text||'Hubungi Saya',n.cta_url||''].map(q).join(',') + ');')
sql.push('')

sql.push('DELETE FROM navbar_menu_items;')
db.prepare('SELECT * FROM navbar_menu_items ORDER BY sort_order').all().forEach(m => {
  sql.push('INSERT INTO navbar_menu_items (navbar_id,label,section,sort_order) VALUES (1,' + [m.label,m.section,m.sort_order].map(q).join(',') + ');')
})
sql.push('')

const l = db.prepare('SELECT * FROM loading_screen WHERE id=1').get()
sql.push('DELETE FROM loading_screen;')
sql.push('INSERT INTO loading_screen (id,title,subtext,tagline) VALUES (1,' + [l.title||'HONDA',l.subtext||'NAGAMOTOR',l.tagline||'Dealer Resmi Honda'].map(q).join(',') + ');')
sql.push('')

const c = db.prepare('SELECT * FROM contact WHERE id=1').get()
sql.push('DELETE FROM contact;')
sql.push('INSERT INTO contact (id,phone,email,address,map_url) VALUES (1,' + [c.phone||'',c.email||'',c.address||'',c.map_url||''].map(q).join(',') + ');')
sql.push('')

sql.push('DELETE FROM contact_social_media;')
db.prepare('SELECT * FROM contact_social_media ORDER BY sort_order').all().forEach(s => {
  sql.push('INSERT INTO contact_social_media (contact_id,platform,url,icon,sort_order) VALUES (1,' + [s.platform,s.url,s.icon,s.sort_order].map(q).join(',') + ');')
})
sql.push('')

sql.push('DELETE FROM product_variants;')
sql.push('DELETE FROM products;')
db.prepare('SELECT * FROM products ORDER BY id').all().forEach(p => {
  sql.push('INSERT INTO products (name,tagline,type,engine,fuel,image,description,specs_json,features_json,colors_json,price) VALUES (' +
    [p.name,p.tagline||'',p.type||'',p.engine||'',p.fuel||'',p.image||'',p.description||'',p.specs_json||'{}',p.features_json||'[]',p.colors_json||'[]',p.price||''].map(q).join(',') + ');')
  db.prepare('SELECT * FROM product_variants WHERE product_id=? ORDER BY sort_order').all(p.id).forEach(v => {
    sql.push('INSERT INTO product_variants (product_id,name,price,sort_order) VALUES (' + [p.id,v.name,v.price,v.sort_order].map(q).join(',') + ');')
  })
})
sql.push('')

sql.push('DELETE FROM promotions;')
db.prepare('SELECT * FROM promotions ORDER BY id').all().forEach(p => {
  sql.push('INSERT INTO promotions (title,description,image,discount,valid_until,color) VALUES (' +
    [p.title,p.description||'',p.image||'',p.discount||'',p.valid_until||'',p.color||'from-red-600 to-red-800'].map(q).join(',') + ');')
})
sql.push('')

sql.push('DELETE FROM testimonials;')
db.prepare('SELECT * FROM testimonials ORDER BY id').all().forEach(t => {
  sql.push('INSERT INTO testimonials (name,car,photo,text,rating) VALUES (' +
    [t.name,t.car||'',t.photo||'',t.text,t.rating||5].map(q).join(',') + ');')
})
sql.push('')

sql.push('DELETE FROM gallery;')
db.prepare('SELECT * FROM gallery ORDER BY sort_order').all().forEach(g => {
  sql.push('INSERT INTO gallery (src,alt,sort_order) VALUES (' + [g.src,g.alt||'',g.sort_order].map(q).join(',') + ');')
})
sql.push('')

sql.push('DELETE FROM faqs;')
db.prepare('SELECT * FROM faqs ORDER BY sort_order').all().forEach(f => {
  sql.push('INSERT INTO faqs (question,answer,sort_order) VALUES (' + [f.question,f.answer,f.sort_order].map(q).join(',') + ');')
})
sql.push('')

sql.push('DELETE FROM advantages;')
db.prepare('SELECT * FROM advantages ORDER BY sort_order').all().forEach(a => {
  sql.push('INSERT INTO advantages (icon,title,description,sort_order) VALUES (' + [a.icon,a.title,a.description||'',a.sort_order].map(q).join(',') + ');')
})
sql.push('')

sql.push('SET FOREIGN_KEY_CHECKS = 1;')

fs.writeFileSync('honda-nagamotor-full.sql', sql.join('\n'))
console.log('OK! File: honda-nagamotor-full.sql (' + (sql.join('').length / 1024).toFixed(1) + ' KB, ' + sql.length + ' baris)')
db.close()
