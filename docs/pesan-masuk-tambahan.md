# pesan-masuk-tambahan.md: `/admin/pesan-masuk`

Melengkapi `PRD.md` bagian 6.6 dan `design.md` bagian 10. Nama tabel dan kolom lain mengikuti `docs/db.md`. `[ASUMSI]` = belum dikonfirmasi pemilik.

## 1. Masalah
1. Tombol **Hapus** dan **Tandai Dibaca** tidak berfungsi (penyebab belum diketahui; QA mendiagnosis di kode).
2. Fitur **komentar** pada pesan belum ada, dan tidak ada tabel atau kolomnya.
3. Pesan contoh #5 tampil dengan teks `\n\n` literal dan kalimat yang sama diulang tiga kali (seeder menyimpan karakter garis miring terbalik + n, bukan baris baru sungguhan).
4. Teks pada halaman tampil dengan huruf serif bawaan browser; seluruh admin harus memakai Hanken Grotesk (`design.md` bagian 5).

## 2. Keputusan: komentar disimpan di tabel baru
`[ASUMSI]` Komentar adalah **catatan internal admin** (tidak dikirim ke pengirim pesan, hanya admin yang melihat). Satu pesan dapat memiliki banyak komentar dan perlu mencatat siapa penulisnya dan kapan, jadi memakai tabel baru, bukan satu kolom di `contact_messages`.

Tabel baru `contact_message_comments` (satu migrasi, `php artisan migrate` tanpa `fresh`):
| Kolom | Tipe | Catatan |
|---|---|---|
| id | bigint PK | |
| contact_message_id | foreignId | `constrained('contact_messages')`, `cascadeOnDelete()` (komentar ikut terhapus bersama pesannya) |
| user_id | foreignId | `constrained('users')`, `restrictOnDelete()` |
| isi | text | maks 1.000 karakter, wajib |
| created_at, updated_at | timestamps | |
Indeks pada `contact_message_id`. Perbarui `docs/db.md` dan `docs/kontrak-props.md`.

## 3. Aturan
- **Tandai dibaca:** mengisi `dibaca_at` dengan waktu sekarang bila masih kosong. Tombol hanya tampil untuk pesan belum dibaca. Penghitung "belum dibaca" (kartu dashboard dan menu) ikut turun.
- **Hapus pesan:** dialog konfirmasi ("Hapus pesan ini? Komentarnya ikut terhapus"), lalu baris hilang. Hanya admin yang login.
- **Komentar:** admin dapat menambah komentar; daftar komentar diurutkan dari lama ke baru, memuat nama admin dan waktu (WIB). Admin hanya dapat menghapus komentar miliknya `[ASUMSI]`. Menambah komentar pada pesan yang belum dibaca otomatis menandainya dibaca `[ASUMSI]`.
- Semua teks (pesan dan komentar) ditampilkan sebagai teks biasa (di-escape), dengan baris baru dipertahankan (`white-space: pre-line`).
- Semua aksi memberi umpan balik: pesan sukses (toast) atau pesan galat yang menjelaskan cara memperbaiki. Tamu diarahkan ke `/login`.

## 4. Rute (grup admin, middleware auth; nama final mengikuti konvensi Laravel)
| Aksi | Metode dan jalur | Nama rute |
|---|---|---|
| Tandai dibaca | PATCH `/admin/pesan-masuk/{pesan}/dibaca` | `admin.pesan-masuk.dibaca` |
| Hapus pesan | DELETE `/admin/pesan-masuk/{pesan}` | `admin.pesan-masuk.destroy` |
| Tambah komentar | POST `/admin/pesan-masuk/{pesan}/komentar` | `admin.pesan-masuk.komentar.store` |
| Hapus komentar | DELETE `/admin/pesan-masuk/{pesan}/komentar/{komentar}` | `admin.pesan-masuk.komentar.destroy` |

## 5. Props halaman (tambahan pada kontrak yang ada)
Setiap pesan memuat: `id`, `nama`, `kontak`, `pesan`, `dibaca_at` (null bila belum), `created_at`, dan `komentar`: `[ { id, isi, nama_admin, created_at, milik_saya } ]`. Key lain tetap mengikuti `docs/kontrak-props.md`. Daftar dipaginasi 20 per halaman, terbaru di atas.

## 6. Tampilan (mengikuti `design.md`)
- Setiap pesan satu baris tebal: nama (600), kontak (14px `--abu`), badge "Belum dibaca" (`--kunyit-muda` teks `--arang`, kata + titik), isi pesan, waktu. Tombol "Balas via WhatsApp" bila kontak berupa nomor (`wa.me/<nomor>`), "Tandai dibaca" (sekunder), "Hapus" (garis dan teks `--cabai`).
- Bagian "Komentar (n)" yang dapat dibuka di bawah tiap pesan: daftar komentar, area teks, tombol "Kirim komentar". Tanpa gradien, tanpa bayangan, radius 4px, target sentuh 44px.
- Ponsel: aksi pindah di bawah isi pesan, tidak menumpuk di samping.
- State: daftar kosong ("Belum ada pesan masuk."), memuat, galat, sukses.

## 7. Pembagian tugas (isi kartu perbaikan)
**Kartu A, Backend (perbaikan, tanpa kolom baru):**
1. Diagnosis dan perbaiki hapus dan tandai dibaca (rute, metode, nama kolom `dibaca_at` di migrasi dan `$fillable`, controller benar-benar menyimpan, binding parameter, penghapusan menghormati FK).
2. Perbaiki `PesanMasukSeeder`: pesan #5 berisi 3 paragraf berbeda (700 sampai 900 karakter) dengan baris baru sungguhan (string berkutip ganda atau `PHP_EOL`), bukan `\n` literal dan bukan kalimat yang sama diulang. Tetap idempoten; jalankan `php artisan db:seed --class=PesanMasukSeeder` dua kali, jumlah tetap 12.
3. Pastikan galat dan sukses dikirim kembali ke halaman (errors atau flash).

**Kartu B, Backend (komentar):** migrasi tabel `contact_message_comments`, model dan relasi (`ContactMessage::komentar()`, `Komentar::user()`), controller (`store`, `destroy`) dengan validasi (wajib, maks 1.000), otorisasi (login, hanya milik sendiri untuk hapus), props bagian 5, perbarui `docs/db.md` dan `docs/kontrak-props.md`. Seeder: 6 komentar contoh pada 4 pesan (satu pesan memiliki 2 komentar), idempoten (hapus komentar yang `isi`-nya diawali `[CONTOH]` lalu buat ulang). Contoh isi: "[CONTOH] Sudah dibalas lewat WhatsApp, menunggu konfirmasi ukuran." dan "[CONTOH] Pelanggan akan memesan hari Jumat." Tulis test fitur tetapi jangan jalankan terhadap database `toko-daster`.

**Kartu C, Frontend:** perbaiki tombol sesuai bagian 3 dan 6 (dialog konfirmasi hapus, tandai dibaca), tambah bagian komentar (daftar, formulir, hapus komentar milik sendiri), pertahankan baris baru, gunakan Hanken Grotesk, tampilkan toast dan galat validasi, responsif 360px. Pakai props dari kontrak; jika key belum cocok, kanban_comment di kartu Backend. `npm run build` berhasil.

**Kartu D, QA:** verifikasi ulang (tulis hanya di `docs/`), putaran maks 2.

## 8. Kriteria selesai
- Tandai dibaca: badge hilang, penghitung belum dibaca turun; Hapus: dialog lalu baris hilang beserta komentarnya; komentar tersimpan dan tampil dengan nama admin dan waktu.
- Pesan contoh #5 tampil sebagai tiga paragraf berbeda tanpa `\n` terlihat.
- Tamu yang membuka `/admin/pesan-masuk` diarahkan ke `/login`.
