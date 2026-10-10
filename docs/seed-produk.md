# seed-produk.md: 20 produk contoh untuk ProdukSeeder

Semua data di sini adalah **[CONTOH]**, hanya untuk database lokal. Sumber untuk `backenddeveloper` saat menulis `database/seeders/ProdukSeeder.php`.
Nama kolom: ikuti migrasi dan model yang benar-benar ada (PRD memakai nama Indonesia, `kontrak-props.md` memakai nama Inggris; keduanya bisa berbeda dari database). Kolom yang tidak ada di database dilewati dan dicatat, bukan dibuatkan migrasi.

## 1. Aturan "berbeda"
- 20 nama unik, 20 slug unik, 20 deskripsi berbeda, tiap produk punya motif dan warna sendiri.
- Harga bervariasi (Rp69.000 sampai Rp129.000), bahan bervariasi, jumlah varian 1 sampai 4.
- Campuran status: 18 `tayang`, 1 `draf`, 1 `arsip`. Tepat 4 produk unggulan (semuanya tayang).
- Ada: produk dengan harga coret (3), varian dengan harga sendiri (1), varian menipis (stok <= stok minimum dan > 0), varian habis, dan produk yang semua variannya habis (1).
- SKU unik: `DS-{NN}-{UKURAN}-{n}` (NN nomor produk dua digit, UKURAN huruf besar tanpa spasi, n urutan varian). Contoh: `DS-01-M-1`, `DS-04-ALLSIZE-2`.
- stok_minimum default 3 kecuali ditulis lain. Kombinasi produk+ukuran+warna unik.

## 2. Produk

| # | Nama | Slug | Kategori | Bahan | Harga | Coret | Status | Unggulan |
|---|---|---|---|---|---|---|---|---|
| 1 | Daster Batik Parang Biru | daster-batik-parang-biru | Daster Batik | Rayon | 89000 | 110000 | tayang | ya |
| 2 | Daster Batik Kawung Cokelat | daster-batik-kawung-cokelat | Daster Batik | Katun rayon | 95000 | | tayang | |
| 3 | Daster Batik Mega Mendung | daster-batik-mega-mendung | Daster Batik | Rayon premium | 119000 | | tayang | ya |
| 4 | Daster Batik Sekar Jagad | daster-batik-sekar-jagad | Daster Batik | Viscose | 129000 | | tayang | |
| 5 | Daster Batik Truntum Hijau | daster-batik-truntum-hijau | Daster Batik | Katun | 99000 | | tayang | |
| 6 | Daster Bunga Sore | daster-bunga-sore | Daster Rumahan | Katun rayon | 79000 | | tayang | |
| 7 | Daster Melati Putih | daster-melati-putih | Daster Rumahan | Rayon | 75000 | | tayang | |
| 8 | Daster Kembang Sepatu Merah | daster-kembang-sepatu-merah | Daster Rumahan | Rayon adem | 85000 | 99000 | tayang | |
| 9 | Daster Lurik Kunyit | daster-lurik-kunyit | Daster Rumahan | Katun | 89000 | | tayang | |
| 10 | Daster Polos Indigo | daster-polos-indigo | Daster Rumahan | Viscose | 79000 | | tayang | |
| 11 | Daster Polos Pandan | daster-polos-pandan | Daster Rumahan | Rayon | 69000 | | tayang | |
| 12 | Daster Garis Cabai | daster-garis-cabai | Daster Rumahan | Katun | 72000 | | tayang | |
| 13 | Daster Kancing Depan Ceplok | daster-kancing-depan-ceplok | Daster Kancing Depan | Rayon | 105000 | | tayang | ya |
| 14 | Daster Kancing Depan Abu Polos | daster-kancing-depan-abu-polos | Daster Kancing Depan | Katun | 98000 | | tayang | |
| 15 | Daster Kancing Depan Bunga Kecil | daster-kancing-depan-bunga-kecil | Daster Kancing Depan | Rayon premium | 115000 | | tayang | |
| 16 | Daster Kancing Depan Kotak Kunyit | daster-kancing-depan-kotak-kunyit | Daster Kancing Depan | Katun | 92000 | | draf | |
| 17 | Daster Lengan Panjang Tumpal | daster-lengan-panjang-tumpal | Daster Lengan Panjang | Rayon | 109000 | | tayang | |
| 18 | Daster Lengan Panjang Sido Mukti | daster-lengan-panjang-sido-mukti | Daster Lengan Panjang | Viscose | 125000 | 145000 | tayang | ya |
| 19 | Daster Lengan Panjang Hijau Lumut | daster-lengan-panjang-hijau-lumut | Daster Lengan Panjang | Katun rayon | 99000 | | tayang | |
| 20 | Daster Jumbo Bunga Pagi | daster-jumbo-bunga-pagi | Daster Rumahan | Rayon | 115000 | | arsip | |

Kategori: pakai kategori yang sudah dibuat seeder kategori (Daster Rumahan, Daster Batik, Daster Kancing Depan, Daster Lengan Panjang). Jika namanya berbeda, cocokkan yang terdekat dan catat. Jangan membuat kategori ganda.

## 3. Varian (ukuran / warna / stok, tambahan jika ada)

| # | Varian |
|---|---|
| 1 | M / Biru tua / 12; L / Biru tua / 8; XL / Biru tua / 3 |
| 2 | M / Cokelat / 10; L / Cokelat / 6 |
| 3 | M / Biru laut / 9; L / Biru laut / 9; L / Putih gading / 4; XL / Putih gading / 2 |
| 4 | All Size / Merah marun / 15; All Size / Hijau botol / 11 / harga varian 135000 |
| 5 | M / Hijau tua / 7; L / Hijau tua / 7; XL / Hijau tua / 7 |
| 6 | S / Kuning / 6; M / Kuning / 10; L / Kuning / 10; XL / Kuning / 0 |
| 7 | M / Putih / 14; L / Putih / 12 |
| 8 | M / Merah / 5; L / Merah / 5; XL / Merah / 2 |
| 9 | M / Kunyit / 8; L / Kunyit / 8 |
| 10 | All Size / Indigo / 20 |
| 11 | All Size / Hijau pandan / 0; All Size / Hijau muda / 0 |
| 12 | M / Putih garis cabai / 6; L / Putih garis cabai / 6; XL / Putih garis cabai / 6 |
| 13 | M / Merah bata / 7; L / Merah bata / 7; XL / Merah bata / 4 |
| 14 | M / Abu / 10; L / Abu / 10; XL / Abu / 10 |
| 15 | M / Biru muda / 6; L / Biru muda / 6; M / Rose / 6 |
| 16 | M / Kunyit / 5; L / Kunyit / 5 |
| 17 | M / Cokelat tua / 5; L / Cokelat tua / 5; XL / Cokelat tua / 3 |
| 18 | M / Hitam / 4; L / Hitam / 4; XL / Hitam / 1 |
| 19 | M / Hijau lumut / 9; L / Hijau lumut / 9 |
| 20 | Jumbo / Merah muda / 6; Jumbo / Biru muda / 6 |

## 4. Deskripsi (satu per produk, jangan disatukan atau diganti templat)

1. Motif parang diagonal berwarna biru tua dengan potongan longgar.
2. Kawung cokelat dengan pola bulat berulang, nyaman untuk dipakai seharian di rumah.
3. Motif awan mega mendung berwarna biru laut dan putih gading.
4. Sekar jagad: kumpulan motif kecil dalam satu kain. Tersedia merah marun dan hijau botol, All Size.
5. Truntum hijau tua dengan taburan bunga kecil bersusun, potongan longgar.
6. Bunga sore berwarna kuning pada dasar polos, pas untuk santai sore hari.
7. Melati putih berbunga kecil, ringan dan tidak gerah.
8. Kembang sepatu merah berukuran besar di atas kain yang adem.
9. Lurik kunyit bergaris vertikal, sederhana dan rapi.
10. Polos indigo tanpa motif, All Size dengan potongan longgar.
11. Polos hijau pandan, All Size, mudah dipadukan dengan kerudung.
12. Garis tipis warna cabai di atas dasar putih.
13. Kancing depan dengan motif ceplok merah bata, memudahkan dipakai dan dilepas.
14. Kancing depan abu polos, tampilan rapi tanpa motif.
15. Kancing depan dengan bunga kecil, tersedia biru muda dan rose.
16. Kotak-kotak warna kunyit dengan kancing depan.
17. Lengan panjang bermotif tumpal cokelat tua, untuk yang suka menutup lengan.
18. Sido mukti hitam berlengan panjang, nuansa gelap yang tegas.
19. Hijau lumut polos berlengan panjang, mudah dipadukan.
20. Bunga pagi untuk ukuran Jumbo, tersedia merah muda dan biru muda.

Perawatan (pakai bergiliran menurut nomor produk modulo 3, semuanya [CONTOH]): (a) Cuci terpisah dengan air dingin, jemur di tempat teduh. (b) Cuci tangan atau mesin mode lembut, jangan diperas keras. (c) Setrika suhu rendah dari sisi dalam kain.

## 5. Foto (placeholder lokal, tanpa internet)
- Setiap produk 3 foto: `produk-contoh/{slug}-1.svg` sampai `-3.svg`, ditulis seeder ke disk `public` (`Storage::disk('public')->put(...)`). Pakai SVG agar tidak butuh ekstensi GD.
- Ukuran 800x1000 (rasio 4:5), latar datar dari token `design.md`: `#EAE3D3`, `#DCE7DF`, `#F7E7BE`, `#F6DAD3`, `#DCE8F3`. Warna dipilih `(nomor produk + nomor foto) % 5` supaya foto berbeda satu sama lain.
- Isi: nama produk (maks 2 baris, warna `#1E1B18`), teks kecil "[CONTOH] Foto belum tersedia", nomor "1/3", satu garis putus 2px (garis jahitan) di bagian bawah. Tanpa gradien, tanpa gambar dari luar.
- Simpan di `product_images` dengan path relatif seperti cara foto produk lain diresolusi di aplikasi (lihat model dan controller yang ada), urutan 1 sampai 3.

## 6. Perilaku seeder
- Idempoten: `updateOrCreate` berdasarkan slug (produk) dan sku (varian); foto berdasarkan produk dan urutan. Dijalankan dua kali: tetap 20 produk dan tidak ada baris ganda.
- Hanya berjalan di environment `local`.
- Dipanggil dari `DatabaseSeeder` setelah seeder kategori. Hanya satu seeder produk; jika ada seeder produk lama, gantikan.
- Sebelum menulis ke database, seeder memeriksa dirinya sendiri: 20 nama unik, 20 slug unik, semua sku unik, tidak ada deskripsi yang sama. Gagal = lempar exception. Di akhir mencetak "20 produk contoh siap" dan jumlah per status.
- Tidak menyentuh tabel orders, order_items, dan stock_movements.
