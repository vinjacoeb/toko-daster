# Laporan QA: Riwayat Edit Stok Tidak Muncul

## 1. Ringkasan Temuan
Berdasarkan investigasi pada kartu Kanban `t_a3e1b7d0` ("riwayat edit stok tidak muncul, padahal sudah coba edit namun tidak ada riwayat") serta tangkapan layar `riwayateditstok.png`, ditemukan bahwa saat pengguna mencoba melihat riwayat mutasi stok, sistem menampilkan pesan *"Belum ada riwayat mutasi untuk varian ini."* 

Setelah pemeriksaan kode (`App\Http\Controllers\Admin\StockController`, `App\Services\StockService`, dan migrasi database `stock_movements`), ditemukan dua akar masalah utama (root cause) yang mengakibatkan riwayat edit stok tidak pernah tercatat maupun ditampilkan:

## 2. Akar Masalah (Root Causes)

### A. Metode `getVariantHistory` Hilang pada `StockService`
- **Lokasi:** `app/Http/Controllers/Admin/StockController.php` (baris 67) memanggil:
  ```php
  $movements = $this->stockService->getVariantHistory($id, 20);
  ```
- **Masalah:** Kelas `App\Services\StockService` tidak mendefinisikan metode `getVariantHistory()`. Hal ini menyebabkan pemanggilan halaman riwayat stok memicu error (undefined method).

### B. Ketidaksinkronan Skema Tabel `stock_movements` (Kolom `variant_id`)
- **Lokasi:** `app/Services/StockService.php` (baris 34) mencoba mencatat mutasi stok:
  ```php
  StockMovement::create([
      'variant_id' => $variantId,
      'jumlah' => $quantity,
      'alasan' => $reason,
      'order_id' => $orderId,
      'user_id' => auth()->id(),
      'catatan' => $note,
  ]);
  ```
- **Masalah:** Berdasarkan temuan sebelumnya (`docs/qa-error-stock-movement.md`), tabel database `stock_movements` tidak memiliki kolom `variant_id` (atau migrasi belum dijalankan dengan benar / struktur tabel tidak sinkron). Akibatnya, setiap kali admin mencoba melakukan restok, koreksi, atau perubahan stok, terjadi `QueryException` (`Column not found: 1054 Unknown column 'variant_id' in 'field list'`). Karena transaksi gagal/gagal simpan, tidak ada satupun riwayat mutasi yang tersimpan di database.

## 3. Langkah Reproduksi
1. Buka panel admin pada halaman `/admin/stok`.
2. Lakukan aksi restok atau koreksi stok pada salah satu varian produk.
3. Sistem mengalami error atau gagal menyimpan riwayat mutasi ke database karena kolom `variant_id` tidak ada pada tabel `stock_movements`.
4. Ketika tombol riwayat diklik (`/admin/stok/{id}/riwayat`), metode `getVariantHistory` di `StockService` tidak ditemukan dan data riwayat kosong/tidak muncul.

## 4. Rekomendasi Perbaikan untuk Backend Developer
1. **Tambahkan metode `getVariantHistory` di `App\Services\StockService`:**
   ```php
   public function getVariantHistory(int $variantId, int $perPage = 10)
   {
       return StockMovement::with(['user'])
           ->where('variant_id', $variantId)
           ->latest()
           ->paginate($perPage);
   }
   ```
2. **Periksa dan perbaiki skema database tabel `stock_movements`:**
   - Pastikan migrasi tabel `stock_movements` dijalankan dengan benar (`php artisan migrate`), atau tambahkan kolom `variant_id` jika tabel dibuat dari dump lama yang belum menyertakannya.
3. **Verifikasi End-to-End:**
   - Lakukan restok/koreksi stok, pastikan data berhasil tersimpan tanpa error SQL.
   - Buka halaman riwayat mutasi stok untuk memastikan riwayat tampil dengan benar.
