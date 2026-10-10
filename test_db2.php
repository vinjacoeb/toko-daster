<?php

require __DIR__.'/vendor/autoload.php';

\$app = require_once __DIR__.'/bootstrap/app.php';
\$app->boot();

try {
    DB::connection()->getPdo();
    echo "Koneksi berhasil";
    \$tables = DB::connection()->getDoctrineSchemaManager()->listTableNames();
    echo "Tabel yang ada: " . json_encode(array_keys(\$tables));
} catch (Exception \$e) {
    echo "Gagal terhubung ke database: " . \$e->getMessage();
}
?>