require __DIR__.'/vendor/autoload.php';

if (file_exists(__DIR__ . '/bootstrap/app.php')) {
    \$app = require_once __DIR__.'/bootstrap/app.php';
    \$app->boot();
}

try {
    \$pdo = DB::connection()->getPdo();
    echo "Koneksi berhasil" . PHP_EOL;
    \$tables = DB::connection()->getDoctrineSchemaManager()->listTableNames();
    echo "Tabel yang ada: " . json_encode(array_keys(\$tables)) . PHP_EOL;
} catch (Exception \$e) {
    echo "Gagal terhubung ke database: " . \$e->getMessage() . PHP_EOL;
}