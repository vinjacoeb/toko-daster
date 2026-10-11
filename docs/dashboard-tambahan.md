# dashboard-tambahan.md: Dashboard admin (`/admin`)

Menggantikan `PRD.md` bagian 6.1 dan `design.md` bagian 10 (paragraf Dashboard) untuk halaman `/admin`. Aturan lain di `design.md` tetap berlaku: token warna, Hanken Grotesk di seluruh admin (tanpa serif), tanpa gradien, tanpa bayangan kartu, radius 4px, garis jahitan sebagai garis bantu grafik.
Nama kolom dan tabel mengikuti `docs/db.md`. Tanda `[ASUMSI]` = belum dikonfirmasi pemilik.

## 1. Susunan (desktop, 12 kolom)
| Baris | Isi |
|---|---|
| 1 | 5 kartu statistik (ponsel: 2 kolom) |
| 2 | **Perbandingan omzet** (grafik gelombang, 8 kolom) + **Produk terlaris 30 hari** (4 kolom) |
| 3 | **Pendapatan bulan ini vs bulan lalu** (grafik batang, 6 kolom) + **Riwayat pesanan minggu ini** (tabel, 6 kolom) |
| 4 | **Stok menipis** (daftar 5 varian, lebar penuh) |

Dihapus karena digantikan: grafik "omzet 30 hari" tunggal dan tabel "pesanan terbaru 5".

## 2. Kartu statistik
| Kartu | Isi |
|---|---|
| Omzet hari ini | Angka Rupiah + perbandingan terhadap kemarin (persen, panah naik atau turun) |
| Omzet bulan ini | Angka Rupiah + perbandingan terhadap bulan lalu |
| Pesanan perlu diproses | Jumlah pesanan berstatus `baru`, `dibayar`, `dikemas` |
| Stok menipis | Jumlah varian dengan `stok > 0` dan `stok <= stok_minimum`, dari produk yang tidak diarsipkan |
| Pesan belum dibaca | Jumlah pesan kontak yang belum dibaca; kartu menjadi tautan ke `/admin/pesan-masuk` |

Perbandingan persen: jika pembanding 0, tulis "Baru" (jangan membagi nol). Label perbandingan memakai teks dan ikon, bukan warna saja.

## 3. Definisi
- Minggu = Senin sampai Minggu, zona Asia/Jakarta. Bulan = kalender (tanggal 1 sampai akhir bulan).
- Omzet = jumlah `total` pesanan berstatus `dibayar`, `dikemas`, `dikirim`, `selesai` (bukan `baru`, bukan `batal`), menurut tanggal pesanan. Angkanya harus sama dengan halaman Laporan untuk periode yang sama.

## 4. Grafik perbandingan omzet (grafik gelombang)
- Satu grafik dengan pilihan tiga tab: **Hari ini | Minggu ini | Bulan ini** (bawaan: Minggu ini). Tab memakai tombol (`role="tablist"`), terpilih bergaris bawah 3px `--pandan`.
- Sumbu X: hari ini = jam 00 sampai 23 (data sampai jam sekarang); minggu ini = Senin sampai Minggu; bulan ini = tanggal 1 sampai akhir bulan. Sumbu Y: Rupiah dengan singkatan (mis. "Rp1,2 jt").
- Dua deret: **periode ini** (garis 2px `--pandan`, kurva halus `monotone`, isian datar `--pandan-muda`, tanpa gradien) dan **pembanding** (garis putus `--abu`: kemarin, minggu lalu, atau bulan lalu). Legenda di bawah grafik.
- Di atas grafik: total periode ini, total pembanding, dan selisih (persen, teks + panah).
- Tooltip berkotak putih bergaris 1px berisi label, nilai periode ini, dan nilai pembanding. Garis bantu horizontal berupa garis jahitan.
- Kosong: garis datar di 0 dan teks "Belum ada penjualan pada periode ini."

## 5. Grafik batang: pendapatan bulan ini vs bulan lalu
- Batang berkelompok per minggu dalam bulan: tanggal 1-7, 8-14, 15-21, 22-28, 29-akhir. Dua batang per kelompok: bulan lalu (`--lawon`) dan bulan ini (`--pandan`). Lebar batang sama, radius 2px di ujung atas, tanpa gradien.
- Judul memuat total kedua bulan dan selisih, contoh: "Rp4,2 jt, naik 18% dari bulan lalu (Rp3,6 jt)". Naik atau turun ditulis dengan kata, bukan hanya warna. `[ASUMSI]` pengelompokan per minggu; jika ingin hanya dua batang total, ubah di sini.
- Minggu yang belum terjadi pada bulan ini tidak digambar (bukan 0). Kosong: teks "Belum ada data penjualan."

## 6. Riwayat pesanan minggu ini
- Tabel maks 10 pesanan terbaru dalam minggu berjalan: kode, nama pelanggan, total (rata kanan), badge status (`design.md` bagian 8), waktu (hari dan jam, WIB). Baris menjadi tautan ke detail pesanan.
- Tautan "Lihat semua" ke `/admin/pesanan` (dengan penyaring minggu ini jika halaman pesanan mendukungnya).
- Kosong: "Belum ada pesanan minggu ini."

## 7. Props (Inertia, key bahasa Indonesia snake_case)
```
kartu: { omzet_hari_ini, omzet_kemarin, omzet_bulan_ini, omzet_bulan_lalu,
         pesanan_perlu_diproses, stok_menipis, pesan_belum_dibaca }
perbandingan: {
  hari_ini:   { label: [], sekarang: [], pembanding: [], total_sekarang, total_pembanding },
  minggu_ini: { ... }, bulan_ini: { ... } }
pendapatan_bulanan: { nama_bulan_ini, nama_bulan_lalu, kelompok: ["1-7","8-14","15-21","22-28","29-31"],
                      bulan_ini: [], bulan_lalu: [], total_bulan_ini, total_bulan_lalu }
riwayat_pesanan_minggu_ini: [ { id, kode, nama_pelanggan, total, status, dipesan_at } ]
produk_terlaris: [ { id, nama, jumlah_terjual, omzet } ]   // 5 teratas, 30 hari
stok_menipis_daftar: [ { varian_id, produk_nama, ukuran, warna, stok, stok_minimum } ]   // 5
```
Uang integer rupiah, tanggal ISO 8601. Semua dihitung di server dan didokumentasikan di `docs/kontrak-props.md`. Pustaka grafik: Recharts.

## 8. Catatan teknis
- Perhitungan memakai agregasi database (`SUM`, `GROUP BY`) dengan indeks pada tanggal pesanan dan status, bukan memuat semua pesanan ke memori.
- Bulan lalu yang lebih pendek atau lebih panjang dari bulan ini: kelompok minggu terakhir menyesuaikan jumlah hari.
- Judul halaman admin dan seluruh teks admin memakai Hanken Grotesk. Jika judul tampil dengan serif bawaan browser, font belum termuat (periksa impor `@fontsource-variable/hanken-grotesk` dan `--font-isi`).

## 9. Kriteria selesai
- Tiga tab perbandingan berganti tanpa memuat ulang halaman dan menampilkan data yang berbeda.
- Angka kartu dan total grafik sama dengan Laporan untuk periode yang sama.
- Kartu "Stok menipis" tidak menghitung varian yang stoknya 0 atau di atas stok minimum (dengan data seeder jumlahnya kecil, bukan puluhan).
- Semua state (loading, kosong, galat) ada; tidak ada gradien; teks `[Grafik Placeholder]` tidak tersisa.
- Responsif: ponsel menumpuk satu kolom, grafik tidak melebar melewati layar, tabel menggulir di dalam wadahnya.
- `npm run build` berhasil.
