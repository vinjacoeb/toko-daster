require __DIR__.'/vendor/autoload.php';

if (file_exists(__DIR__ . '/bootstrap/app.php')) {
    \$app = require_once __DIR__.'/bootstrap/app.php';
    \$app->boot();
}

try {
    \$pdo = DB::connection()->getPdo();
    echo "Koneksi berhasil" . PHP_EOL;

    \$tables = DB::select('SHOW TABLES');
    echo "Tabel yang ada: " . json_encode(array_column(\$tables, 0)) . PHP_EOL;
} catch (Exception \$e) {
    echo "Gagal terhubung ke database: " . \$e->getMessage() . PHP_EOL;
}