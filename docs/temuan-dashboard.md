# temuan-dashboard.md: respons `/admin` vs tampilan dashboard

Dibuat dari dua bukti pemilik: `docs/bukti/respone-admin.txt` (HTML respons `/admin`, berisi props Inertia, diambil Minggu 11 Okt 2026) dan screenshot dashboard pada waktu yang sama. Acuan: `docs/dashboard-tambahan.md`. Kolom "Dugaan" belum terbukti; QA wajib memverifikasinya di kode (path dan baris) sebelum menyebutnya dikonfirmasi.

## Ringkasan
Data **ada** di respons dan sebagian grafik menampilkannya dengan benar. Masalahnya tiga jenis: (1) Backend mengirim `null` untuk nama dan kode, (2) beberapa angka Backend salah atau tidak konsisten, (3) Frontend tidak menampilkan nilai yang ada (kartu 0). Bentuk props juga campur antara kontrak lama dan baru.

## Temuan
| ID | Prioritas | Temuan | Bukti | Dugaan | Pemilik |
|---|---|---|---|---|---|
| T1 | P0 | Lima kartu statistik menampilkan 0 padahal props berisi nilai | Props: `kartu.omzet_hari_ini` "2191000", `omzet_bulan_ini` "3398000", `pesanan_perlu_diproses` 13, `pesan_belum_dibaca` 7, `stok_menipis` 160. Layar: Rp0, Rp0, 0, 0 varian, 0 | Frontend membaca jalur key yang berbeda (mis. `data.kartu`) atau menolak nilai bertipe string | Frontend |
| T2 | P0 | Nama dan kode kosong | `produk_terlaris[].nama`, `riwayat_pesanan_minggu_ini[].kode` dan `.nama_pelanggan`, `stok_menipis_daftar[].produk_nama` semuanya `null`. Layar: kolom Kode, Pelanggan, Produk kosong; terlaris tanpa nama | Query memakai nama kolom yang tidak sesuai database (catatan Backend menyebut `orders.code`, `orders.customer_name`, `products.name`) | Backend |
| T3 | P0 | "Stok menipis" salah | `kartu.stok_menipis` = 160, lebih besar dari jumlah varian seed (sekitar 50). Daftar memuat varian dengan `stok` 0 (Kuning, Hijau pandan) padahal definisi 0 < stok <= stok_minimum | Join menggandakan baris, kondisi `stok > 0` tidak diterapkan | Backend |
| T4 | P0 | Total tidak sama dengan jumlah kelompok | Bulan ini: total 3.398.000, kelompok 1.751.000 + 3.294.000 = 5.045.000. Bulan lalu: total 7.867.000, kelompok 6.258.000. Total bulan ini (3.398.000) lebih kecil dari total minggu ini (4.387.000), mustahil karena 5 sampai 11 Okt seluruhnya di Oktober. Persentase -56,8% ikut salah | Total memakai filter status atau batas tanggal berbeda dari grafik | Backend |
| T5 | P1 | Omzet hari ini perlu diverifikasi | `omzet_hari_ini` 2.191.000; tiga pesanan dikemas hari ini yang terlihat berjumlah 1.103.000. Dua pesanan `baru` berjam 22.00 UTC (05.00 WIB 11 Okt) juga jatuh pada hari ini WIB, padahal seed menjanjikan 3 pesanan hari ini | Status `baru` ikut terhitung, atau batas hari antara UTC dan WIB tidak konsisten (seeder atau query) | Backend |
| T6 | P1 | Seri grafik hari ini kosong | `perbandingan.hari_ini`: label `["0:00"]`, `sekarang` `[0]`, `pembanding` `[0]`, padahal total 2.191.000 dan 534.000 | Agregasi per jam tidak dihitung | Backend |
| T7 | P2 | Label bahasa Inggris | `perbandingan.minggu_ini.label` = Mon sampai Sun; `pendapatan_bulanan.nama_bulan_ini` "October", `nama_bulan_lalu` "September". Layar: "Pendapatan October vs September" | Locale Carbon belum `id`. Perbaiki di kode (`->locale('id')` atau `translatedFormat`), bukan lewat `.env` | Backend |
| T8 | P1 | Minggu yang belum terjadi bernilai 0 | `pendapatan_bulanan.bulan_ini` = `[1751000, 3294000, 0, 0, 0]` padahal hari ini 11 Okt. Spesifikasi (bagian 5): minggu yang belum terjadi tidak digambar. Layar: batang kecil Oktober di 15-21, 22-28, 29-31 | Backend mengirim 0 alih-alih `null`; Frontend menggambar 0 | Backend, lalu Frontend |
| T9 | P1 | Riwayat pesanan hanya 5 baris | `riwayat_pesanan_minggu_ini` berisi 5 elemen; spesifikasi maks 10 | Batas query 5 (mengikuti "pesanan terbaru" lama) | Backend |
| T10 | P1 | Bentuk props campur dua kontrak | `data` memuat key lama (`varian_stok_menipis`, `grafik_omzet_30_hari`, `pesanan_terbaru`, `varian_stok_menipis_list`, `persentase_bulan_lalu`) dan sebagian key baru (`pendapatan_bulanan`, `riwayat_pesanan_minggu_ini`, `stok_menipis_daftar`, `produk_terlaris`), sedangkan `kartu` dan `perbandingan` berada di luar `data`. Nilai uang dan jumlah berupa string ("2191000", "85") | Controller menggabungkan versi lama dan baru. Spesifikasi bagian 7: semua key datar di level atas, uang integer | Backend |
| T11 | P2 | `settings` memakai kontrak lama | `settings.whatsappNumber` "081234567890", `storeName`, `storeTagline`. PRD: snake_case dari tabel settings (`whatsapp` format 62..., `nama_toko`, `tagline`) | Sisa implementasi awal | Backend |
| T12 | P2 | Judul dan legenda batang bahasa Inggris | "Pendapatan October vs September" | Sama dengan T7 | Backend |

## Urutan perbaikan yang disarankan
1. **Backend A (data benar):** T2, T3, T4, T5, T6, T8 (kirim `null`), T9, T7.
2. **Backend B (bentuk props):** T10, T11 (setelah A, berkas yang sama).
3. **Frontend:** T1, penanganan `null` (tampilkan "-" untuk nama kosong, jangan menggambar `null` di batang), pastikan semua nilai dibaca dari key datar baru dan angka dikonversi dengan aman.
4. **QA verifikasi ulang** setelah ketiganya.

## Cara memeriksa ulang (QA)
- Bandingkan setiap angka dengan `docs/dashboard-tambahan.md` bagian 3: omzet = jumlah `total` pesanan berstatus dibayar, dikemas, dikirim, selesai menurut tanggal pesanan (WIB), dan harus sama dengan Laporan untuk periode yang sama.
- Konsistensi yang harus dipenuhi: total bulan = jumlah kelompok; total bulan >= total minggu ini; `kartu.omzet_hari_ini` = nilai Minggu pada seri minggu ini; stok menipis <= jumlah varian.
- Pemeriksaan tampilan di browser tulis "Belum diuji, butuh browser"; pemilik yang mengonfirmasi.
