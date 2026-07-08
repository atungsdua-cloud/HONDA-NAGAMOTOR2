<?php
// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Database config — coba dari env var dulu, fallback ke hardcoded
$dbHost = getenv('DB_HOST') ?: 'localhost';
$dbUser = getenv('DB_USER') ?: 'u686012864_aldinmt';
$dbPass = getenv('DB_PASSWORD') ?: 'Nmtsikur123';
$dbName = getenv('DB_NAME') ?: 'u686012864_honda_lombok';
$dbPort = getenv('DB_PORT') ?: '3306';

$conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName, (int)$dbPort);
$conn->set_charset('utf8mb4');

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Koneksi database gagal: ' . $conn->connect_error]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode(readData($conn));
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);
    if (!$body || !is_array($body)) {
        http_response_code(400);
        echo json_encode(['error' => 'Data tidak valid']);
        exit;
    }
    try {
        writeData($conn, $body);
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method tidak diizinkan']);

function readData($conn) {
    $data = [];

    // Profile
    $r = $conn->query("SELECT * FROM profile WHERE id = 1");
    $profile = $r->fetch_assoc();
    $r = $conn->query("SELECT icon, value, label FROM profile_stats WHERE profile_id = 1 ORDER BY sort_order");
    $stats = $r->fetch_all(MYSQLI_ASSOC);
    $data['profile'] = [
        'name' => $profile['name'] ?? '',
        'title' => $profile['title'] ?? '',
        'description' => $profile['description'] ?? '',
        'photo' => $profile['photo'] ?? '',
        'experience' => $profile['experience'] ?? '',
        'phone' => $profile['phone'] ?? '',
        'email' => $profile['email'] ?? '',
        'address' => $profile['address'] ?? '',
        'stats' => $stats
    ];

    // Hero
    $r = $conn->query("SELECT * FROM hero WHERE id = 1");
    $hero = $r->fetch_assoc();
    $r = $conn->query("SELECT url FROM hero_images WHERE hero_id = 1 ORDER BY sort_order");
    $images = $r->fetch_all(MYSQLI_ASSOC);
    $r = $conn->query("SELECT icon, value, label, suffix FROM hero_stats WHERE hero_id = 1 ORDER BY sort_order");
    $hstats = $r->fetch_all(MYSQLI_ASSOC);
    $data['hero'] = [
        'title' => $hero['title'] ?? '',
        'subtitle' => $hero['subtitle'] ?? '',
        'salesPhoto' => $hero['sales_photo'] ?? '',
        'images' => array_map(fn($i) => $i['url'], $images),
        'stats' => $hstats
    ];

    // Navbar
    $r = $conn->query("SELECT * FROM navbar WHERE id = 1");
    $navbar = $r->fetch_assoc();
    $r = $conn->query("SELECT label, section FROM navbar_menu_items WHERE navbar_id = 1 ORDER BY sort_order");
    $menu = $r->fetch_all(MYSQLI_ASSOC);
    $data['navbar'] = [
        'logoImage' => $navbar['logo_image'] ?? '',
        'logoText' => $navbar['logo_text'] ?? 'HONDA',
        'logoSubtext' => $navbar['logo_subtext'] ?? 'Nagamotor',
        'menuItems' => $menu,
        'ctaText' => $navbar['cta_text'] ?? 'Hubungi Saya',
        'ctaUrl' => $navbar['cta_url'] ?? ''
    ];

    // Loading Screen
    $r = $conn->query("SELECT * FROM loading_screen WHERE id = 1");
    $ls = $r->fetch_assoc();
    $data['loadingScreen'] = [
        'title' => $ls['title'] ?? 'HONDA',
        'subtext' => $ls['subtext'] ?? 'NAGAMOTOR',
        'tagline' => $ls['tagline'] ?? 'Dealer Resmi Honda'
    ];

    // Contact
    $r = $conn->query("SELECT * FROM contact WHERE id = 1");
    $contact = $r->fetch_assoc();
    $r = $conn->query("SELECT platform, url, icon FROM contact_social_media WHERE contact_id = 1 ORDER BY sort_order");
    $social = $r->fetch_all(MYSQLI_ASSOC);
    $data['contact'] = [
        'phone' => $contact['phone'] ?? '',
        'email' => $contact['email'] ?? '',
        'address' => $contact['address'] ?? '',
        'mapUrl' => $contact['map_url'] ?? '',
        'socialMedia' => $social
    ];

    // Products
    $r = $conn->query("SELECT id, name, tagline, type, engine, fuel, image, description, specs_json, features_json, colors_json, price FROM products ORDER BY id");
    $products = $r->fetch_all(MYSQLI_ASSOC);
    $data['products'] = [];
    foreach ($products as $p) {
        $pid = $p['id'];
        $vr = $conn->query("SELECT name, price FROM product_variants WHERE product_id = $pid ORDER BY sort_order");
        $variants = $vr->fetch_all(MYSQLI_ASSOC);
        $ir = $conn->query("SELECT url FROM product_images WHERE product_id = $pid ORDER BY sort_order");
        $imgs = $ir->fetch_all(MYSQLI_ASSOC);
        $data['products'][] = [
            'id' => "product-$pid",
            'name' => $p['name'],
            'tagline' => $p['tagline'] ?? '',
            'type' => $p['type'] ?? '',
            'engine' => $p['engine'] ?? '',
            'fuel' => $p['fuel'] ?? '',
            'image' => $p['image'] ?? '',
            'images' => array_map(fn($i) => $i['url'], $imgs),
            'description' => $p['description'] ?? '',
            'specs' => json_decode($p['specs_json'] ?? '{}', true) ?: [],
            'features' => json_decode($p['features_json'] ?? '[]', true) ?: [],
            'colors' => json_decode($p['colors_json'] ?? '[]', true) ?: [],
            'price' => $p['price'] ?? '',
            'variants' => $variants
        ];
    }

    // Promotions
    $r = $conn->query("SELECT id, title, description, image, discount, valid_until AS validUntil, color FROM promotions ORDER BY id");
    $promos = $r->fetch_all(MYSQLI_ASSOC);
    $data['promotions'] = array_map(fn($p) => [
        'id' => "promotion-{$p['id']}",
        'title' => $p['title'],
        'description' => $p['description'] ?? '',
        'image' => $p['image'] ?? '',
        'discount' => $p['discount'] ?? '',
        'validUntil' => $p['validUntil'] ?? '',
        'color' => $p['color'] ?? 'from-red-600 to-red-800'
    ], $promos);

    // Testimonials
    $r = $conn->query("SELECT id, name, car, photo, text, rating FROM testimonials ORDER BY id");
    $testis = $r->fetch_all(MYSQLI_ASSOC);
    $data['testimonials'] = array_map(fn($t) => [
        'id' => "testimonial-{$t['id']}",
        'name' => $t['name'],
        'car' => $t['car'] ?? '',
        'photo' => $t['photo'] ?? '',
        'text' => $t['text'],
        'rating' => (int)($t['rating'] ?? 5)
    ], $testis);

    // Gallery
    $r = $conn->query("SELECT id, src, alt FROM gallery ORDER BY sort_order");
    $gals = $r->fetch_all(MYSQLI_ASSOC);
    $data['gallery'] = array_map(fn($g) => [
        'id' => "gallery-{$g['id']}",
        'src' => $g['src'],
        'alt' => $g['alt'] ?? ''
    ], $gals);

    // FAQs
    $r = $conn->query("SELECT id, question, answer FROM faqs ORDER BY sort_order");
    $faqs = $r->fetch_all(MYSQLI_ASSOC);
    $data['faqs'] = array_map(fn($f) => [
        'id' => "faq-{$f['id']}",
        'question' => $f['question'],
        'answer' => $f['answer']
    ], $faqs);

    // Advantages
    $r = $conn->query("SELECT id, icon, title, description FROM advantages ORDER BY sort_order");
    $advs = $r->fetch_all(MYSQLI_ASSOC);
    $data['advantages'] = array_map(fn($a) => [
        'id' => "advantage-{$a['id']}",
        'icon' => $a['icon'],
        'title' => $a['title'],
        'description' => $a['description'] ?? ''
    ], $advs);

    return $data;
}

function writeData($conn, $data) {
    $conn->begin_transaction();
    try {

        if (isset($data['profile'])) {
            $p = $data['profile'];
            $stmt = $conn->prepare("UPDATE profile SET name=?, title=?, description=?, photo=?, experience=?, phone=?, email=?, address=? WHERE id=1");
            $stmt->bind_param('ssssssss',
                $p['name'] ?? '', $p['title'] ?? '', $p['description'] ?? '', $p['photo'] ?? '',
                $p['experience'] ?? '', $p['phone'] ?? '', $p['email'] ?? '', $p['address'] ?? ''
            );
            $stmt->execute();

            if (isset($p['stats'])) {
                $conn->query("DELETE FROM profile_stats WHERE profile_id = 1");
                $stmt = $conn->prepare("INSERT INTO profile_stats (profile_id, icon, value, label, sort_order) VALUES (1, ?, ?, ?, ?)");
                foreach ($p['stats'] as $i => $s) {
                    $stmt->bind_param('sssi', $s['icon'], $s['value'], $s['label'], $i + 1);
                    $stmt->execute();
                }
            }
        }

        if (isset($data['hero'])) {
            $h = $data['hero'];
            $stmt = $conn->prepare("UPDATE hero SET title=?, subtitle=?, sales_photo=? WHERE id=1");
            $stmt->bind_param('sss', $h['title'] ?? '', $h['subtitle'] ?? '', $h['salesPhoto'] ?? '');
            $stmt->execute();

            if (isset($h['images'])) {
                $conn->query("DELETE FROM hero_images WHERE hero_id = 1");
                $stmt = $conn->prepare("INSERT INTO hero_images (hero_id, url, sort_order) VALUES (1, ?, ?)");
                foreach ($h['images'] as $i => $url) {
                    $stmt->bind_param('si', $url, $i + 1);
                    $stmt->execute();
                }
            }
            if (isset($h['stats'])) {
                $conn->query("DELETE FROM hero_stats WHERE hero_id = 1");
                $stmt = $conn->prepare("INSERT INTO hero_stats (hero_id, icon, value, label, suffix, sort_order) VALUES (1, ?, ?, ?, ?, ?)");
                foreach ($h['stats'] as $i => $s) {
                    $stmt->bind_param('ssssi', $s['icon'], $s['value'], $s['label'], $s['suffix'] ?? '', $i + 1);
                    $stmt->execute();
                }
            }
        }

        if (isset($data['navbar'])) {
            $n = $data['navbar'];
            $stmt = $conn->prepare("UPDATE navbar SET logo_image=?, logo_text=?, logo_subtext=?, cta_text=?, cta_url=? WHERE id=1");
            $stmt->bind_param('sssss',
                $n['logoImage'] ?? '', $n['logoText'] ?? 'HONDA', $n['logoSubtext'] ?? 'Nagamotor',
                $n['ctaText'] ?? 'Hubungi Saya', $n['ctaUrl'] ?? ''
            );
            $stmt->execute();

            if (isset($n['menuItems'])) {
                $conn->query("DELETE FROM navbar_menu_items WHERE navbar_id = 1");
                $stmt = $conn->prepare("INSERT INTO navbar_menu_items (navbar_id, label, section, sort_order) VALUES (1, ?, ?, ?)");
                foreach ($n['menuItems'] as $i => $m) {
                    $stmt->bind_param('ssi', $m['label'], $m['section'], $i + 1);
                    $stmt->execute();
                }
            }
        }

        if (isset($data['loadingScreen'])) {
            $l = $data['loadingScreen'];
            $stmt = $conn->prepare("UPDATE loading_screen SET title=?, subtext=?, tagline=? WHERE id=1");
            $stmt->bind_param('sss', $l['title'] ?? 'HONDA', $l['subtext'] ?? 'NAGAMOTOR', $l['tagline'] ?? 'Dealer Resmi Honda');
            $stmt->execute();
        }

        if (isset($data['contact'])) {
            $c = $data['contact'];
            $stmt = $conn->prepare("UPDATE contact SET phone=?, email=?, address=?, map_url=? WHERE id=1");
            $stmt->bind_param('ssss', $c['phone'] ?? '', $c['email'] ?? '', $c['address'] ?? '', $c['mapUrl'] ?? '');
            $stmt->execute();

            if (isset($c['socialMedia'])) {
                $conn->query("DELETE FROM contact_social_media WHERE contact_id = 1");
                $stmt = $conn->prepare("INSERT INTO contact_social_media (contact_id, platform, url, icon, sort_order) VALUES (1, ?, ?, ?, ?)");
                foreach ($c['socialMedia'] as $i => $s) {
                    $stmt->bind_param('sssi', $s['platform'], $s['url'], $s['icon'], $i + 1);
                    $stmt->execute();
                }
            }
        }

        if (isset($data['products'])) {
            foreach ($data['products'] as $p) {
                $pid = null;
                if (isset($p['id'])) {
                    $pidVal = (int)str_replace('product-', '', $p['id']);
                    $r = $conn->query("SELECT id FROM products WHERE id = $pidVal");
                    if ($r && $r->fetch_assoc()) {
                        $pid = $pidVal;
                    }
                }
                if ($pid) {
                    $stmt = $conn->prepare("UPDATE products SET name=?, tagline=?, type=?, engine=?, fuel=?, image=?, description=?, specs_json=?, features_json=?, colors_json=?, price=? WHERE id=?");
                    $specs = json_encode($p['specs'] ?? []);
                    $features = json_encode($p['features'] ?? []);
                    $colors = json_encode($p['colors'] ?? []);
                    $stmt->bind_param('sssssssssssi',
                        $p['name'] ?? '', $p['tagline'] ?? '', $p['type'] ?? '', $p['engine'] ?? '',
                        $p['fuel'] ?? '', $p['image'] ?? '', $p['description'] ?? '',
                        $specs, $features, $colors, $p['price'] ?? '', $pid
                    );
                    $stmt->execute();
                } else {
                    $stmt = $conn->prepare("INSERT INTO products (name, tagline, type, engine, fuel, image, description, specs_json, features_json, colors_json, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                    $specs = json_encode($p['specs'] ?? []);
                    $features = json_encode($p['features'] ?? []);
                    $colors = json_encode($p['colors'] ?? []);
                    $stmt->bind_param('sssssssssss',
                        $p['name'] ?? '', $p['tagline'] ?? '', $p['type'] ?? '', $p['engine'] ?? '',
                        $p['fuel'] ?? '', $p['image'] ?? '', $p['description'] ?? '',
                        $specs, $features, $colors, $p['price'] ?? ''
                    );
                    $stmt->execute();
                    $newId = $conn->insert_id;
                    if (isset($p['variants'])) {
                        $vStmt = $conn->prepare("INSERT INTO product_variants (product_id, name, price, sort_order) VALUES (?, ?, ?, ?)");
                        foreach ($p['variants'] as $vi => $v) {
                            $vStmt->bind_param('issi', $newId, $v['name'], $v['price'], $vi + 1);
                            $vStmt->execute();
                        }
                    }
                }
            }
        }

        if (isset($data['promotions'])) {
            foreach ($data['promotions'] as $p) {
                $pid = null;
                if (isset($p['id'])) {
                    $pidVal = (int)str_replace('promotion-', '', $p['id']);
                    $r = $conn->query("SELECT id FROM promotions WHERE id = $pidVal");
                    if ($r && $r->fetch_assoc()) $pid = $pidVal;
                }
                if ($pid) {
                    $stmt = $conn->prepare("UPDATE promotions SET title=?, description=?, image=?, discount=?, valid_until=?, color=? WHERE id=?");
                    $stmt->bind_param('ssssssi',
                        $p['title'] ?? '', $p['description'] ?? '', $p['image'] ?? '',
                        $p['discount'] ?? '', $p['validUntil'] ?? '', $p['color'] ?? 'from-red-600 to-red-800', $pid
                    );
                    $stmt->execute();
                } else {
                    $stmt = $conn->prepare("INSERT INTO promotions (title, description, image, discount, valid_until, color) VALUES (?, ?, ?, ?, ?, ?)");
                    $stmt->bind_param('ssssss',
                        $p['title'] ?? '', $p['description'] ?? '', $p['image'] ?? '',
                        $p['discount'] ?? '', $p['validUntil'] ?? '', $p['color'] ?? 'from-red-600 to-red-800'
                    );
                    $stmt->execute();
                }
            }
        }

        if (isset($data['testimonials'])) {
            foreach ($data['testimonials'] as $t) {
                $tid = null;
                if (isset($t['id'])) {
                    $tidVal = (int)str_replace('testimonial-', '', $t['id']);
                    $r = $conn->query("SELECT id FROM testimonials WHERE id = $tidVal");
                    if ($r && $r->fetch_assoc()) $tid = $tidVal;
                }
                if ($tid) {
                    $stmt = $conn->prepare("UPDATE testimonials SET name=?, car=?, photo=?, text=?, rating=? WHERE id=?");
                    $rating = (int)($t['rating'] ?? 5);
                    $stmt->bind_param('ssssii', $t['name'] ?? '', $t['car'] ?? '', $t['photo'] ?? '', $t['text'] ?? '', $rating, $tid);
                    $stmt->execute();
                } else {
                    $stmt = $conn->prepare("INSERT INTO testimonials (name, car, photo, text, rating) VALUES (?, ?, ?, ?, ?)");
                    $rating = (int)($t['rating'] ?? 5);
                    $stmt->bind_param('ssssi', $t['name'] ?? '', $t['car'] ?? '', $t['photo'] ?? '', $t['text'] ?? '', $rating);
                    $stmt->execute();
                }
            }
        }

        if (isset($data['gallery'])) {
            foreach ($data['gallery'] as $gi => $g) {
                $gid = null;
                if (isset($g['id'])) {
                    $gidVal = (int)str_replace('gallery-', '', $g['id']);
                    $r = $conn->query("SELECT id FROM gallery WHERE id = $gidVal");
                    if ($r && $r->fetch_assoc()) $gid = $gidVal;
                }
                if ($gid) {
                    $stmt = $conn->prepare("UPDATE gallery SET src=?, alt=? WHERE id=?");
                    $stmt->bind_param('ssi', $g['src'] ?? '', $g['alt'] ?? '', $gid);
                    $stmt->execute();
                } else {
                    $stmt = $conn->prepare("INSERT INTO gallery (src, alt, sort_order) VALUES (?, ?, ?)");
                    $stmt->bind_param('ssi', $g['src'] ?? '', $g['alt'] ?? '', $gi + 1);
                    $stmt->execute();
                }
            }
        }

        if (isset($data['faqs'])) {
            foreach ($data['faqs'] as $fi => $f) {
                $fid = null;
                if (isset($f['id'])) {
                    $fidVal = (int)str_replace('faq-', '', $f['id']);
                    $r = $conn->query("SELECT id FROM faqs WHERE id = $fidVal");
                    if ($r && $r->fetch_assoc()) $fid = $fidVal;
                }
                if ($fid) {
                    $stmt = $conn->prepare("UPDATE faqs SET question=?, answer=? WHERE id=?");
                    $stmt->bind_param('ssi', $f['question'] ?? '', $f['answer'] ?? '', $fid);
                    $stmt->execute();
                } else {
                    $stmt = $conn->prepare("INSERT INTO faqs (question, answer, sort_order) VALUES (?, ?, ?)");
                    $stmt->bind_param('ssi', $f['question'] ?? '', $f['answer'] ?? '', $fi + 1);
                    $stmt->execute();
                }
            }
        }

        if (isset($data['advantages'])) {
            foreach ($data['advantages'] as $ai => $a) {
                $aid = null;
                if (isset($a['id'])) {
                    $aidVal = (int)str_replace('advantage-', '', $a['id']);
                    $r = $conn->query("SELECT id FROM advantages WHERE id = $aidVal");
                    if ($r && $r->fetch_assoc()) $aid = $aidVal;
                }
                if ($aid) {
                    $stmt = $conn->prepare("UPDATE advantages SET icon=?, title=?, description=? WHERE id=?");
                    $stmt->bind_param('sssi', $a['icon'] ?? '', $a['title'] ?? '', $a['description'] ?? '', $aid);
                    $stmt->execute();
                } else {
                    $stmt = $conn->prepare("INSERT INTO advantages (icon, title, description, sort_order) VALUES (?, ?, ?, ?)");
                    $stmt->bind_param('sssi', $a['icon'] ?? '', $a['title'] ?? '', $a['description'] ?? '', $ai + 1);
                    $stmt->execute();
                }
            }
        }

        $conn->commit();
    } catch (Exception $e) {
        $conn->rollback();
        throw $e;
    }
}
