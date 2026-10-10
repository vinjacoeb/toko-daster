<?php

try {
    DB::connection()->getPdo();
    echo "Koneksi berhasil";
    $tables = DB::connection()->getDoctrineSchemaManager()->listTableNames();
    echo "Tabel yang ada: " . json_encode(array_keys($tables));
} catch (Exception $e) {
    echo "Gagal terhubung ke database: " . $e->getMessage();
}
?>