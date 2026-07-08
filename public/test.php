<?php
header('Content-Type: text/plain');
echo "PHP Version: " . phpversion() . "\n";
echo "mysqli: " . (extension_loaded('mysqli') ? 'OK' : 'MISSING') . "\n";
echo "mysqlnd: " . (function_exists('mysqli_fetch_all') ? 'OK' : 'MISSING (no fetch_all)') . "\n";
echo "getenv DB_HOST: " . (getenv('DB_HOST') ?: '(not set)') . "\n";

$dbHost = 'localhost';
$dbUser = 'u686012864_aldinmt';
$dbPass = 'Nmtsikur123';
$dbName = 'u686012864_honda_lombok';

$conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName, 3306);
if ($conn->connect_error) {
    echo "DB ERROR: " . $conn->connect_error . "\n";
} else {
    echo "DB: CONNECTED OK\n";
    $r = $conn->query("SELECT COUNT(*) as n FROM products");
    if ($r) {
        $row = $r->fetch_assoc();
        echo "Products count: " . $row['n'] . "\n";
    }
    // Test fetch_all
    $r2 = $conn->query("SELECT id, name FROM products LIMIT 2");
    $all = $r2->fetch_all(MYSQLI_ASSOC);
    echo "fetch_all works: " . (is_array($all) ? 'YES' : 'NO') . "\n";
    echo "First product: " . ($all[0]['name'] ?? 'none') . "\n";
    $conn->close();
}
