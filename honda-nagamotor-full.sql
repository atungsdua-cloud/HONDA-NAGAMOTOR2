-- Honda Nagamotor - Full Database Dump
-- Generated: 2026-07-07T08:57:47.834Z

SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS profile (
    id INT PRIMARY KEY DEFAULT 1,
    name TEXT NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL,
    photo TEXT DEFAULT '', experience TEXT DEFAULT '', phone TEXT DEFAULT '',
    email TEXT DEFAULT '', address TEXT DEFAULT '',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS profile_stats (
    id INT AUTO_INCREMENT PRIMARY KEY, profile_id INT NOT NULL DEFAULT 1,
    icon VARCHAR(50) NOT NULL, value VARCHAR(50) NOT NULL,
    label VARCHAR(100) NOT NULL, sort_order INT NOT NULL DEFAULT 0,
    FOREIGN KEY (profile_id) REFERENCES profile(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS hero (
    id INT PRIMARY KEY DEFAULT 1, title TEXT NOT NULL, subtitle TEXT NOT NULL,
    sales_photo TEXT DEFAULT '',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS hero_images (
    id INT AUTO_INCREMENT PRIMARY KEY, hero_id INT NOT NULL DEFAULT 1,
    url TEXT NOT NULL, sort_order INT NOT NULL DEFAULT 0,
    FOREIGN KEY (hero_id) REFERENCES hero(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS hero_stats (
    id INT AUTO_INCREMENT PRIMARY KEY, hero_id INT NOT NULL DEFAULT 1,
    icon VARCHAR(50) NOT NULL, value VARCHAR(50) NOT NULL,
    label VARCHAR(100) NOT NULL, suffix VARCHAR(20) DEFAULT '',
    sort_order INT NOT NULL DEFAULT 0,
    FOREIGN KEY (hero_id) REFERENCES hero(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS navbar (
    id INT PRIMARY KEY DEFAULT 1, logo_image TEXT DEFAULT '',
    logo_text TEXT DEFAULT 'HONDA', logo_subtext TEXT DEFAULT 'Nagamotor',
    cta_text TEXT DEFAULT 'Hubungi Saya', cta_url TEXT DEFAULT '',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS navbar_menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY, navbar_id INT NOT NULL DEFAULT 1,
    label VARCHAR(100) NOT NULL, section VARCHAR(100) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    FOREIGN KEY (navbar_id) REFERENCES navbar(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS loading_screen (
    id INT PRIMARY KEY DEFAULT 1, title TEXT DEFAULT 'HONDA',
    subtext TEXT DEFAULT 'NAGAMOTOR', tagline TEXT DEFAULT 'Dealer Resmi Honda'
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS contact (
    id INT PRIMARY KEY DEFAULT 1, phone TEXT DEFAULT '', email TEXT DEFAULT '',
    address TEXT DEFAULT '', map_url TEXT DEFAULT '',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS contact_social_media (
    id INT AUTO_INCREMENT PRIMARY KEY, contact_id INT NOT NULL DEFAULT 1,
    platform VARCHAR(100) NOT NULL, url TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL, sort_order INT NOT NULL DEFAULT 0,
    FOREIGN KEY (contact_id) REFERENCES contact(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(200) NOT NULL,
    tagline TEXT DEFAULT '', type VARCHAR(100) NOT NULL DEFAULT '',
    engine VARCHAR(100) DEFAULT '', fuel VARCHAR(100) DEFAULT '',
    image TEXT DEFAULT '', description TEXT DEFAULT '',
    specs_json LONGTEXT DEFAULT '{}', features_json LONGTEXT DEFAULT '[]',
    colors_json LONGTEXT DEFAULT '[]', price VARCHAR(100) DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS product_images (
    id INT AUTO_INCREMENT PRIMARY KEY, product_id INT NOT NULL,
    url TEXT NOT NULL, sort_order INT NOT NULL DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS product_variants (
    id INT AUTO_INCREMENT PRIMARY KEY, product_id INT NOT NULL,
    name VARCHAR(200) NOT NULL, price VARCHAR(100) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS promotions (
    id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(200) NOT NULL,
    description TEXT DEFAULT '', image TEXT DEFAULT '',
    discount VARCHAR(100) DEFAULT '', valid_until VARCHAR(100) DEFAULT '',
    color VARCHAR(100) DEFAULT 'from-red-600 to-red-800',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(200) NOT NULL,
    car VARCHAR(200) DEFAULT '', photo TEXT DEFAULT '',
    text TEXT NOT NULL, rating INT DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS gallery (
    id INT AUTO_INCREMENT PRIMARY KEY, src TEXT NOT NULL,
    alt TEXT DEFAULT '', sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS faqs (
    id INT AUTO_INCREMENT PRIMARY KEY, question TEXT NOT NULL,
    answer TEXT NOT NULL, sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS advantages (
    id INT AUTO_INCREMENT PRIMARY KEY, icon VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL, description TEXT DEFAULT '',
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM profile;
INSERT INTO profile (id,name,title,description,photo,experience,phone,email,address) VALUES (1,'Budi Santoso','Sales Executive Honda','Dengan pengalaman lebih dari 10 tahun di industri otomotif, Budi Santoso adalah tenaga penjualan terpercaya di Honda Nagamotor. Beliau dikenal dengan pelayanan yang ramah, jujur, dan profesional.\n\nBudi telah membantu ratusan pelanggan menemukan mobil Honda impian mereka. Dengan pengetahuan mendalam tentang setiap model Honda, beliau siap memberikan konsultasi terbaik untuk Anda.\n\n"Kepuasan pelanggan adalah prioritas utama saya. Saya akan membantu Anda dari proses pemilihan hingga pengurusan dokumen, sehingga Anda dapat memiliki mobil Honda dengan pengalaman yang menyenangkan."','','10 Tahun Pengalaman','+62 812 3456 7890','budi.santoso@honda-nagamotor.com','Jl. Raya Utama No. 123, Jakarta');

DELETE FROM profile_stats;
INSERT INTO profile_stats (profile_id,icon,value,label,sort_order) VALUES (1,'FiAward','500+','Pelanggan Puas','1');
INSERT INTO profile_stats (profile_id,icon,value,label,sort_order) VALUES (1,'FiUsers','10+','Tahun Pengalaman','2');
INSERT INTO profile_stats (profile_id,icon,value,label,sort_order) VALUES (1,'FiStar','98%','Kepuasan Terjaga','3');

DELETE FROM hero;
INSERT INTO hero (id,title,subtitle,sales_photo) VALUES (1,'Wujudkan Impian Anda Bersama Honda','Dapatkan pengalaman terbaik memiliki mobil Honda baru dengan layanan profesional dari tenaga penjualan kami yang berpengalaman.','');

DELETE FROM hero_images;

DELETE FROM hero_stats;
INSERT INTO hero_stats (hero_id,icon,value,label,suffix,sort_order) VALUES (1,'FiAward','500','Pelanggan Puas','+','1');
INSERT INTO hero_stats (hero_id,icon,value,label,suffix,sort_order) VALUES (1,'FiUsers','10','Tahun Pelayanan','+','2');
INSERT INTO hero_stats (hero_id,icon,value,label,suffix,sort_order) VALUES (1,'FiStar','98','Kepuasan','%','3');

DELETE FROM navbar;
INSERT INTO navbar (id,logo_image,logo_text,logo_subtext,cta_text,cta_url) VALUES (1,'','HONDA','Nagamotor','Hubungi Saya','https://wa.me/6281234567890');

DELETE FROM navbar_menu_items;
INSERT INTO navbar_menu_items (navbar_id,label,section,sort_order) VALUES (1,'Beranda','home','1');
INSERT INTO navbar_menu_items (navbar_id,label,section,sort_order) VALUES (1,'Produk','produk','2');
INSERT INTO navbar_menu_items (navbar_id,label,section,sort_order) VALUES (1,'Promo','promo','3');
INSERT INTO navbar_menu_items (navbar_id,label,section,sort_order) VALUES (1,'Testimoni','testimoni','4');
INSERT INTO navbar_menu_items (navbar_id,label,section,sort_order) VALUES (1,'Galeri','galeri','5');
INSERT INTO navbar_menu_items (navbar_id,label,section,sort_order) VALUES (1,'Kontak','kontak','6');

DELETE FROM loading_screen;
INSERT INTO loading_screen (id,title,subtext,tagline) VALUES (1,'HONDA','NAGAMOTOR','Dealer Resmi Honda');

DELETE FROM contact;
INSERT INTO contact (id,phone,email,address,map_url) VALUES (1,'+62 812 3456 7890','info@honda-nagamotor.com','Jl. Raya Utama No. 123, Kelurahan Contoh, Kecamatan Teladan, Jakarta Pusat 12345','https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.5!2d106.8!3d-6.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTInMDAuMCJTIDEwNsKwNDgnMDAuMCJF!5e0!3m2!1sid!2sid!4v1');

DELETE FROM contact_social_media;
INSERT INTO contact_social_media (contact_id,platform,url,icon,sort_order) VALUES (1,'Instagram','https://instagram.com/honda.nagamotor','FaInstagram','1');
INSERT INTO contact_social_media (contact_id,platform,url,icon,sort_order) VALUES (1,'Facebook','https://facebook.com/hondanagamotor','FaFacebook','2');
INSERT INTO contact_social_media (contact_id,platform,url,icon,sort_order) VALUES (1,'TikTok','https://tiktok.com/@hondanagamotor','FaTiktok','3');

DELETE FROM product_variants;
DELETE FROM products;
INSERT INTO products (name,tagline,type,engine,fuel,image,description,specs_json,features_json,colors_json,price) VALUES ('Honda Brio Satya','Mobil Perkotaan yang Gesit dan Irit','Hatchback','1.2L i-VTEC','20 km/l','https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80','Honda Brio Satya adalah mobil hatchback kompak yang dirancang untuk mobilitas perkotaan. Dengan mesin 1.2L i-VTEC yang efisien, Brio menawarkan kombinasi sempurna antara performa dan efisiensi bahan bakar. Desainnya yang stylish dan kelincahannya di jalan raya membuatnya menjadi pilihan favorit bagi pengendara perkotaan.','{"Mesin":"1.2L i-VTEC","Tenaga":"90 PS / 6000 rpm","Torsi":"110 Nm / 4800 rpm","Transmisi":"CVT / Manual 5-percepatan","Kapasitas Tempat Duduk":"5 kursi","Kapasitas Tangki":"35 L","Ground Clearance":"165 mm"}','["Dual SRS Airbag","Sistem Pengereman ABS + EBD","Lampu depan LED","Power window otomatis","Sistem audio 2 speaker","AC digital"]','["#ffffff","#1a1a2e","#e8e8e8","#c41e3a","#2d5a27"]','Rp 160 Juta');
INSERT INTO product_variants (product_id,name,price,sort_order) VALUES ('1','S MT','Rp 160 Juta','1');
INSERT INTO product_variants (product_id,name,price,sort_order) VALUES ('1','S CVT','Rp 175 Juta','2');
INSERT INTO product_variants (product_id,name,price,sort_order) VALUES ('1','E CVT','Rp 190 Juta','3');
INSERT INTO products (name,tagline,type,engine,fuel,image,description,specs_json,features_json,colors_json,price) VALUES ('Honda Civic RS','Sporty Sedan dengan Teknologi Masa Depan','Sedan','1.5L VTEC Turbo','18 km/l','https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=800&q=80','Honda Civic RS hadir dengan desain sporty yang agresif dan mesin 1.5L VTEC Turbo yang bertenaga. Dilengkapi dengan teknologi Honda Sensing untuk keselamatan aktif, Civic RS memberikan pengalaman berkendara yang menyenangkan dengan tingkat keamanan tertinggi.','{"Mesin":"1.5L VTEC Turbo","Tenaga":"172 PS / 5500 rpm","Torsi":"220 Nm / 1700-5500 rpm","Transmisi":"CVT","Kapasitas Tempat Duduk":"5 kursi","Kapasitas Tangki":"47 L","Ground Clearance":"136 mm"}','["Honda Sensing (Collision Mitigation, Lane Keep Assist, Adaptive Cruise Control)","Lampu LED full","Velg 18 inci","Sunroof","Sistem audio Bose 8 speaker","Honda Connect"]','["#ffffff","#1a1a2e","#c41e3a","#4a4a4a","#2d5a27"]','Rp 560 Juta');
INSERT INTO product_variants (product_id,name,price,sort_order) VALUES ('2','RS CVT','Rp 560 Juta','1');
INSERT INTO products (name,tagline,type,engine,fuel,image,description,specs_json,features_json,colors_json,price) VALUES ('Honda HR-V','Urban SUV Bergaya Premium','SUV','1.5L i-VTEC','16 km/l','https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80','Honda HR-V adalah Urban SUV yang menggabungkan gaya hidup modern dengan kepraktisan. Dengan desain yang elegan dan fitur-fitur premium, HR-V cocok untuk Anda yang menginginkan kendaraan serbaguna dengan penampilan yang stylish.','{"Mesin":"1.5L i-VTEC","Tenaga":"121 PS / 6600 rpm","Torsi":"145 Nm / 4300 rpm","Transmisi":"CVT","Kapasitas Tempat Duduk":"5 kursi","Kapasitas Tangki":"40 L","Ground Clearance":"181 mm"}','["Honda Sensing","Lampu LED soket","Velg 17 inci alloy","Moonroof","Honda Connect","Kursi kulit premium"]','["#ffffff","#1a1a2e","#c41e3a","#4a4a4a","#d4a843"]','Rp 360 Juta');
INSERT INTO product_variants (product_id,name,price,sort_order) VALUES ('3','S CVT','Rp 360 Juta','1');
INSERT INTO product_variants (product_id,name,price,sort_order) VALUES ('3','E CVT','Rp 390 Juta','2');
INSERT INTO product_variants (product_id,name,price,sort_order) VALUES ('3','RS CVT','Rp 430 Juta','3');
INSERT INTO products (name,tagline,type,engine,fuel,image,description,specs_json,features_json,colors_json,price) VALUES ('Honda BR-V','SUV 7-Seater Keluarga Terbaik','SUV','1.5L i-VTEC','15 km/l','https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80','Honda BR-V adalah SUV 7-seater yang dirancang untuk keluarga Indonesia. Dengan kabin yang luas dan fleksibel, BR-V menawarkan kenyamanan maksimal untuk perjalanan bersama keluarga besar.','{"Mesin":"1.5L i-VTEC","Tenaga":"119 PS / 6600 rpm","Torsi":"145 Nm / 4300 rpm","Transmisi":"CVT","Kapasitas Tempat Duduk":"7 kursi","Kapasitas Tangki":"42 L","Ground Clearance":"201 mm"}','["Honda Sensing","Lampu LED","Velg 17 inci","AC dual zone","Honda Connect","Kursi baris ke-2 lipat one-touch"]','["#ffffff","#1a1a2e","#c41e3a","#4a4a4a","#2d5a27"]','Rp 300 Juta');
INSERT INTO product_variants (product_id,name,price,sort_order) VALUES ('4','S CVT','Rp 300 Juta','1');
INSERT INTO product_variants (product_id,name,price,sort_order) VALUES ('4','E CVT','Rp 325 Juta','2');
INSERT INTO product_variants (product_id,name,price,sort_order) VALUES ('4','RS CVT','Rp 365 Juta','3');
INSERT INTO products (name,tagline,type,engine,fuel,image,description,specs_json,features_json,colors_json,price) VALUES ('Honda CR-V','SUV Premium untuk Gaya Hidup Aktif','SUV','1.5L VTEC Turbo','14 km/l','https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=800&q=80','Honda CR-V adalah SUV premium yang menawarkan kenyamanan kelas atas dengan performa mesin turbo. Cocok untuk Anda yang memiliki gaya hidup aktif dan membutuhkan kendaraan yang tangguh dan elegan.','{"Mesin":"1.5L VTEC Turbo","Tenaga":"190 PS / 5600 rpm","Torsi":"243 Nm / 2000-5000 rpm","Transmisi":"CVT","Kapasitas Tempat Duduk":"5 kursi (7 kursi untuk varian tertentu)","Kapasitas Tangki":"57 L","Ground Clearance":"208 mm"}','["Honda Sensing","Lampu LED full","Velg 18 inci","Panoramic sunroof","Sistem audio premium","Honda Connect","Power tailgate"]','["#ffffff","#1a1a2e","#c41e3a","#4a4a4a","#2d5a27"]','Rp 520 Juta');
INSERT INTO product_variants (product_id,name,price,sort_order) VALUES ('5','1.5L Turbo CVT','Rp 520 Juta','1');
INSERT INTO product_variants (product_id,name,price,sort_order) VALUES ('5','1.5L Turbo Prestige','Rp 560 Juta','2');
INSERT INTO product_variants (product_id,name,price,sort_order) VALUES ('5','RS e:HEV','Rp 620 Juta','3');
INSERT INTO products (name,tagline,type,engine,fuel,image,description,specs_json,features_json,colors_json,price) VALUES ('Honda Accord','Sedan Eksekutif Kelas Dunia','Sedan','1.5L VTEC Turbo','16 km/l','https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80','Honda Accord adalah sedan eksekutif yang memadukan elegansi, kenyamanan, dan teknologi terkini. Ideal untuk profesional yang mengapresiasi kemewahan dan performa dalam setiap perjalanan.','{"Mesin":"1.5L VTEC Turbo","Tenaga":"187 PS / 5500 rpm","Torsi":"240 Nm / 1600-5000 rpm","Transmisi":"CVT","Kapasitas Tempat Duduk":"5 kursi","Kapasitas Tangki":"56 L","Ground Clearance":"147 mm"}','["Honda Sensing","Lampu LED matrix","Velg 19 inci","Wireless charging","Sistem audio Bose 10 speaker","Honda Connect","Kursi depan elektrik dengan memori"]','["#ffffff","#1a1a2e","#c41e3a","#4a4a4a","#d4a843"]','Rp 620 Juta');
INSERT INTO product_variants (product_id,name,price,sort_order) VALUES ('6','1.5L Turbo CVT','Rp 620 Juta','1');
INSERT INTO products (name,tagline,type,engine,fuel,image,description,specs_json,features_json,colors_json,price) VALUES ('Honda City Hatchback','Hatchback Premium dengan Gaya Sporty','Hatchback','1.5L i-VTEC','17 km/l','https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80','Honda City Hatchback menawarkan desain sporty dengan kepraktisan mobil hatchback. Dengan mesin 1.5L i-VTEC yang responsif dan fitur-fitur modern, City Hatchback adalah pilihan tepat untuk mobilitas perkotaan yang stylish.','{"Mesin":"1.5L i-VTEC","Tenaga":"119 PS / 6600 rpm","Torsi":"145 Nm / 4300 rpm","Transmisi":"CVT","Kapasitas Tempat Duduk":"5 kursi","Kapasitas Tangki":"40 L","Ground Clearance":"163 mm"}','["Honda Sensing","Lampu LED","Velg 16 inci","Honda Connect","Kursi belakang lipat 60:40","AC digital"]','["#ffffff","#1a1a2e","#c41e3a","#4a4a4a","#2d5a27"]','Rp 280 Juta');
INSERT INTO product_variants (product_id,name,price,sort_order) VALUES ('7','S CVT','Rp 280 Juta','1');
INSERT INTO product_variants (product_id,name,price,sort_order) VALUES ('7','RS CVT','Rp 320 Juta','2');

DELETE FROM promotions;
INSERT INTO promotions (title,description,image,discount,valid_until,color) VALUES ('DP 0% untuk Semua Model','Dapatkan kemudahan memiliki mobil Honda baru dengan DP 0% untuk semua model. Promo terbatas!','https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80','DP 0%','2026-12-31','from-red-600 to-red-800');
INSERT INTO promotions (title,description,image,discount,valid_until,color) VALUES ('Trade-in Bonus Tinggi','Tukar tambah mobil lama Anda dengan penawaran harga terbaik. Dapatkan bonus hingga Rp 10 Juta!','https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80','Bonus Rp 10 Juta','2026-12-31','from-blue-600 to-blue-800');
INSERT INTO promotions (title,description,image,discount,valid_until,color) VALUES ('Service Gratis 1 Tahun','Beli mobil Honda sekarang dan dapatkan layanan gratis selama 1 tahun atau 20.000 km.','https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&q=80','Gratis Servis','2026-12-31','from-green-600 to-green-800');
INSERT INTO promotions (title,description,image,discount,valid_until,color) VALUES ('Promo Akhir Tahun','Diskon spesial akhir tahun untuk semua model Honda. Jangan lewatkan kesempatan ini!','https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80','Diskon 10%','2026-12-31','from-purple-600 to-purple-800');

DELETE FROM testimonials;
INSERT INTO testimonials (name,car,photo,text,rating) VALUES ('Andi Pratama','Honda Civic RS','https://i.pravatar.cc/150?img=1','Pelayanan dari Pak Budi sangat memuaskan! Beliau membantu saya dari awal hingga proses pengurusan STNK dan BPKB. Mobil Civic RS saya juga dirawat dengan baik sebelum diserahkan. Sangat merekomendasikan!','5');
INSERT INTO testimonials (name,car,photo,text,rating) VALUES ('Siti Nurhaliza','Honda BR-V','https://i.pravatar.cc/150?img=5','Saya membeli Honda BR-V untuk keluarga. Prosesnya cepat dan mudah berkat bantuan Pak Budi. Harga yang ditawarkan juga kompetitif. Terima kasih Honda Nagamotor!','5');
INSERT INTO testimonials (name,car,photo,text,rating) VALUES ('Bambang Wijaya','Honda HR-V','https://i.pravatar.cc/150?img=3','Pengalaman pertama membeli mobil baru dan ternyata tidak serumit yang saya bayangkan. Salesnya ramah, jujur, dan tidak neko-neko. Proses kredit juga dipermudah. Top!','4');
INSERT INTO testimonials (name,car,photo,text,rating) VALUES ('Dewi Lestari','Honda Brio Satya','https://i.pravatar.cc/150?img=9','Brio Satya adalah pilihan tepat untuk saya yang sering berkendara di perkotaan. Irit bahan bakar dan mudah parkir. Pelayanan after-sales dari Honda Nagamotor juga bagus!','5');
INSERT INTO testimonials (name,car,photo,text,rating) VALUES ('Hendra Gunawan','Honda CR-V','https://i.pravatar.cc/150?img=11','Saya sudah 3 kali membeli mobil dari Honda Nagamotor. Pelayanannya konsisten baik. Pak Budi selalu siap membantu kapan pun saya butuh. Recommended banget!','5');
INSERT INTO testimonials (name,car,photo,text,rating) VALUES ('Rina Marlina','Honda City Hatchback','https://i.pravatar.cc/150?img=44','City Hatchback RS-nya keren banget! Salesnya sabar menjelaskan semua fitur. Saya jadi makin cinta sama mobil baru saya. Thank you Honda Nagamotor!','5');

DELETE FROM gallery;
INSERT INTO gallery (src,alt,sort_order) VALUES ('https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80','Honda Brio','1');
INSERT INTO gallery (src,alt,sort_order) VALUES ('https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=800&q=80','Honda Civic RS','2');
INSERT INTO gallery (src,alt,sort_order) VALUES ('https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80','Honda HR-V','3');
INSERT INTO gallery (src,alt,sort_order) VALUES ('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80','Honda BR-V','4');
INSERT INTO gallery (src,alt,sort_order) VALUES ('https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=800&q=80','Honda CR-V','5');
INSERT INTO gallery (src,alt,sort_order) VALUES ('https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80','Honda Accord','6');
INSERT INTO gallery (src,alt,sort_order) VALUES ('https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80','Honda City Hatchback','7');
INSERT INTO gallery (src,alt,sort_order) VALUES ('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80','Showroom Honda','8');
INSERT INTO gallery (src,alt,sort_order) VALUES ('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80','Interior Showroom','9');

DELETE FROM faqs;
INSERT INTO faqs (question,answer,sort_order) VALUES ('Bagaimana cara pembelian mobil Honda di Nagamotor?','Proses pembelian sangat mudah. Anda dapat mengunjungi showroom kami, menghubungi sales melalui WhatsApp, atau mengisi form kontak di website ini. Kami akan membantu Anda dari pemilihan model, simulasi kredit, hingga pengurusan dokumen STNK dan BPKB.','1');
INSERT INTO faqs (question,answer,sort_order) VALUES ('Apakah tersedia opsi pembayaran kredit?','Tentu! Kami bekerja sama dengan berbagai bank ternama seperti BCA, Mandiri, BNI, BRI, dan CIMB Niaga untuk memberikan opsi kredit yang sesuai dengan kebutuhan Anda. Tim kami akan membantu mensimulasikan cicilan yang paling sesuai dengan budget Anda.','2');
INSERT INTO faqs (question,answer,sort_order) VALUES ('Berapa lama proses pengurusan STNK dan BPKB?','Proses pengurusan STNK dan BPKB biasanya memakan waktu 7-14 hari kerja setelah pembayaran lunas. Kami akan mengurus semuanya untuk Anda sehingga Anda tinggal menunggu mobil siap dibawa pulang.','3');
INSERT INTO faqs (question,answer,sort_order) VALUES ('Apakah ada layanan test drive?','Ya, kami menyediakan layanan test drive untuk semua model Honda. Silakan hubungi kami untuk menjadwalkan test drive sesuai dengan waktu yang Anda inginkan. Test drive gratis tanpa biaya apapun!','4');
INSERT INTO faqs (question,answer,sort_order) VALUES ('Apa saja yang termasuk dalam layanan after-sales?','Kami menyediakan layanan after-sales lengkap termasuk service berkala, garansi mobil baru (3 tahun atau 100.000 km), suku cadang asli Honda, dan layanan darurat 24 jam. Kami juga memiliki bengkel resmi dengan teknisi bersertifikat Honda.','5');
INSERT INTO faqs (question,answer,sort_order) VALUES ('Bagaimana cara trade-in mobil lama?','Anda dapat menukar tambah mobil lama Anda dengan mobil Honda baru. Tim kami akan melakukan penilaian mobil lama Anda secara profesional dan memberikan harga terbaik. Prosesnya cepat dan mudah!','6');

DELETE FROM advantages;
INSERT INTO advantages (icon,title,description,sort_order) VALUES ('BsLightningCharge','Proses Cepat & Mudah','Pengurusan dokumen, kredit, dan pengiriman mobil dilakukan dengan cepat dan efisien. Anda tinggal duduk santai dan kami yang mengurus semuanya.','1');
INSERT INTO advantages (icon,title,description,sort_order) VALUES ('BsFileEarmarkCheck','Garansi Resmi Honda','Setiap pembelian mobil Honda baru mendapatkan garansi resmi pabrik selama 3 tahun atau 100.000 km, plus layanan darurat 24 jam.','2');
INSERT INTO advantages (icon,title,description,sort_order) VALUES ('BsGift','Promo & Diskon Menarik','Dapatkan penawaran spesial termasuk DP 0%, diskon akhir tahun, bonus trade-in, dan program cicilan ringan yang sesuai dengan budget Anda.','3');
INSERT INTO advantages (icon,title,description,sort_order) VALUES ('BsChatDots','Konsultasi Gratis','Tim sales profesional kami siap membantu Anda 7 hari seminggu. Konsultasi gratis tentang model, simulasi kredit, dan kebutuhan otomotif Anda.','4');
INSERT INTO advantages (icon,title,description,sort_order) VALUES ('BsCarFront','Test Drive Langsung','Rasakan pengalaman berkendara mobil Honda impian Anda dengan layanan test drive gratis. Tersedia untuk semua model terbaru.','5');
INSERT INTO advantages (icon,title,description,sort_order) VALUES ('BsTruck','Pengiriman ke Rumah','Nikmati kemudahan pengiriman mobil baru langsung ke rumah Anda. Kami antar mobil dalam kondisi prima dengan asuransi pengiriman.','6');

SET FOREIGN_KEY_CHECKS = 1;