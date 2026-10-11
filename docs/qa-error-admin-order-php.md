# QA ANALISIS ERROR /admin

## Ringkasan
- Lokasi error: /admin
- Attachment: error22.png
- Laravel 13.35.0, PHP 8.3.32

## Jenis & Pesan Error
- ParseError pada app/Models/Order.php baris 57.
- Pesan: syntax error, unexpected token 'protected', expecting end of file.

## Analisis Penyebab
- Pada baris 57 terdapat `protected $table = 'order_items';` di luar class.
- Sebelumnya deklarasi class beserta tanda `{` di-comment-out, sehingga properti `protected` muncul di luar class.
- Hal ini error sintaks dasar PHP: property/variable protected/public/private hanya valid dalam blok class.
- Karena error di model, akses /admin (Inertia) error total, HTTP 500.

## Dampak
- Semua akses /admin gagal (tidak bisa login/admin dashboard/mengatur data).
- Seluruh fungsional admin terblokir akibat error ini.

## Contoh kode bermasalah (dari screenshot):
// Dihapus: duplikat OrderItem rusak
//class OrderItem extends Model
//{
...
57 protected $table = 'order_items';
...

## Saran Perbaikan
- Pastikan `protected $table` berada di dalam blok class.
- Jangan meng-comment class tanpa meng-comment seluruh isi class terkait.

## Acceptance Criteria
1. Akses /admin kembali normal dan tidak error 500.
2. Struktur file Order.php valid, tidak ada deklarasi property di luar blok class.
3. Seluruh fungsional admin berjalan kembali sesuai PRD.

## Rekomendasi Lanjut
- Task child untuk backenddeveloper dibuat: "PERBAIKI: Error ParseError Order.php baris 57 – protected di luar class"
- Setelah fix, QA akan verifikasi ulang /admin, khususnya regresi error sintaks model.

---
**Ttd,**
QA Engineer
