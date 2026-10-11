# QA Dashboard Admin (`/admin`) — t_c80dbc8f

Tanggal: 2026-10-11. Scope: `docs/dashboard-tambahan.md` bagian 2–9 vs implementasi.
Parent: `t_2e15e755` (frontend dashboard baru) + `t_dc8f1257` (seeder pesanan/pesan masuk).
Aturan: PRD §12 (QA via HTTP, "Belum diuji" untuk yang tidak dijalankan, tanpa `.env`, tulis di `docs/`).

## 1. Pemahaman fitur

Frontend `resources/js/Pages/Admin/Dashboard/Index.jsx` (445 baris) dibangun ulang sesuai tambahan:
5 kartu statistik, perbandingan omzet 3 tab (SVG murni), batang bulanan per kelompok minggu,
produk terlaris 30 hari, riwayat pesanan minggu ini (maks 10), stok menipis (5 varian).
Fixture dev `resources/js/dev/fixtures/dashboard.js` mengikuti kontrak baru snake_case (§7).

Backend `app/Http/Controllers/Admin/DashboardController@index` **masih kontrak lama**:
mengirim `{ title, data: { omzetHariIni, omzetBulanIni, ... camelCase }, settings }`,
bukan kontrak baru `{ kartu, perbandingan, pendapatan_bulanan, riwayat_pesanan_minggu_ini,
produk_terlaris, stok_menipis_daftar }`. Parent `t_2e15e755` sudah menyatakan hal ini
("perlu penyesuaian backend ke kontrak baru"). Laporan ini memverifikasi dan merinci gap-nya.

Hasil `t_dc8f1257`: seeder idempoten 40 pesanan / 12 pesan / ≥79 order_item, stok varian stabil.
Data contoh tersedia untuk pengujian visual setelah backend diperbaiki.

## 2. Review requirement (§§2–9) dan ketidaksinkronan

| § tambahan | Status implementasi | Keterangan |
|---|---|---|
| 2. Kartu statistik (5 kartu, "Baru" bila pembanding 0, teks+ikon bukan warna saja) | Frontend LULUS (inspeksi kode) | `LabelPerbandingan`: `b===0 → "Baru"`; panah ↑↓→ + kata naik/turun/sama. Kartu pesan tautan ke `/admin/pesan-masuk`. Kartu stok teks "Stok di atas 0 sampai batas minimum". Backend GAGAL: tidak mengirim `omzet_kemarin`, `omzet_bulan_lalu`; key `data.omzetHariIni` lama. |
| 3. Definisi minggu (Senin–Minggu, Asia/Jakarta), bulan kalender; omzet = SUM(`total`) status `dibayar,dikemas,dikirim,selesai` by tanggal pesanan, sama dengan Laporan | Backend GAGAL (definisi) | `config/app.php:68` timezone `Asia/Jakarta` OK. Tetapi `DashboardController:26,31,35,58,74` memakai `where('status','!=','batal')` → **ikut menghitung `baru`**, melanggar §3 + PRD §6.7. `ReportController:34,39,43,66` pola sama → dashboard vs laporan sama-sama salah, tapi konsisten salah. Filter minggu Sen–Min dan agregasi per jam/hari/tanggal belum ada di backend. |
| 4. Grafik perbandingan (3 tab `role=tablist`, underline 3px `--pandan`, default Minggu ini; sumbu X jam 00–23 / Sen–Min / 1–akhir bulan; Y Rp singkat; garis 2px pandan + dashed abu; isian datar pandan-muda tanpa gradien; legenda bawah; header total+selisih; tooltip putih; garis bantu jahitan; empty "Belum ada penjualan pada periode ini.") | Frontend LULUS (inspeksi kode); runtime Belum diuji | `role="tablist"`, 3 tab, default `minggu_ini`, ganti via `useState` tanpa reload. SVG: garis `#2E5E4E` 2px, pembanding `#6B645A` dashed `5 4`, area `polygon fill #DCE7DF` (datar, bukan gradien), grid dashed `#D6CDB8`, `<title>` per titik sebagai tooltip native. Empty state teks sesuai §4. Deviasi: tidak ada legenda terpisah di bawah grafik (hanya header total) — minor. Sumbu X memakai label dari props (backend baru yang harus mengisi jam/hari/tanggal) — belum diverifikasi runtime. |
| 5. Batang bulanan per kelompok 1-7/8-14/15-21/22-28/29-akhir; dua batang (`--lawon` lalu, `--pandan` kini); radius 2px atas; tanpa gradien; judul total+selisih kata; minggu depan = tidak digambar (null); empty "Belum ada data penjualan." | Frontend LULUS (inspeksi kode); runtime Belum diuji | `GrafikBatang`: warna `#2D5B87` lalu / `#2E5E4E` kini, `rounded-t-[2px]`, `null → height 0 + title "belum ada data"`, judul "RpX, ↑ naik N% dari bulan lalu (RpY)". Backend GAGAL: `pendapatan_bulanan` tidak dikirim sama sekali. |
| 6. Riwayat pesanan minggu ini (maks 10 terbaru minggu berjalan; kolom kode/nama/total kanan/badge §8 design/waktu hari+jam WIB; baris tautan detail; "Lihat semua" → `/admin/pesanan`; empty "Belum ada pesanan minggu ini.") | Frontend LULUS (inspeksi kode); runtime Belum diuji | Tabel maks 10 (`slice(0,10)`), total kanan, `BadgeStatus`, waktu `toLocaleString('id-ID', {weekday,hour,minute,day,month})`, kode link `/admin/pesanan/{id}` (sesuai `OrderController@show`), "Lihat semua" `/admin/pesanan`. Backend GAGAL: mengirim `pesananTerbaru` (5 terbaru global, tanpa filter minggu) bukan `riwayat_pesanan_minggu_ini` (10, minggu Sen–Min). |
| 7. Props snake_case + Recharts | Frontend LULUS (bentuk); Backend GAGAL; Recharts DEVIASI | Frontend membaca key §7 dengan fallback (`?? {}` / `?? []`). Fixture sesuai §7. Backend masih camelCase lama. `package.json` ada `recharts ^2.15.1`, tetapi frontend memakai **SVG murni** (bukan Recharts) — deviasi sadar dari parent; visual memenuhi "tanpa gradien", tetapi §7 kalimat "Pustaka grafik: Recharts" perlu dimutakhirkan bila SVG dipertahankan. Uang integer rupiah + tanggal ISO di fixture OK. |
| 8. Agregasi DB + font Hanken admin tanpa serif | Sebagian | Agregasi backend memakai `SUM/GROUP BY` OK, tetapi perlu indeks tanggal+status (tidak dicek — Belum diuji). Judul dashboard `font-hanken-grotesk` OK. Catatan minor: `AdminLayout.jsx:12` wordmark sidebar memakai `font-young-serif` ("Daster") — bertentangan dengan "seluruh teks admin Hanken tanpa serif" (§1 tambahan). Disarankan ubah ke Hanken atau kecualikan wordmark di spek. |
| 9. Kriteria selesai (tab tanpa reload + data beda; angka = Laporan; stok menipis kecil bukan puluhan; loading/kosong/galat ada; tanpa gradien; tanpa `[Grafik Placeholder]`; responsif; build lolos) | Frontend LULUS (statis); runtime Belum diuji | Tab `useState` tanpa reload (kode). Search `gradient|Placeholder|placeholder|lorem|Recharts|BarChart|LineChart` di `Index.jsx` = 0. Layout `grid-cols-12`, `col-span-12 lg:col-span-8/4/6`, tabel `overflow-x-auto` — pola responsif benar, tetapi verifikasi 360px butuh browser → Belum diuji. State loading/galat **tidak ada** (hanya empty state) — lihat BUG-02 di bawah; §9 menuntut "semua state (loading, kosong, galat) ada". `npm run build` lolos (748ms). |

Konflik sumber: `docs/kontrak-props.md` (bagian LOCKED + adendum t_d2c95e63) masih mendokumentasikan
props lama `{ title, data.omzetHariIni..., settings }` dan eksplisit menunda update sampai koordinasi
frontend. Sekarang frontend baru sudah memilih kontrak §7 tambahan → kontrak-props **wajib dimutakhirkan**
oleh backend saat memperbaiki controller (satu paket, bukan kartu terpisah).

Bukan defect (di luar scope): akun pembeli, keranjang/checkout, pembayaran online, ekspor Excel —
tidak dilaporkan sebagai bug (PRD §4).

## 3. Asumsi dan pertanyaan terbuka

Asumsi: (a) `dipesan_at` adalah "tanggal pesanan" untuk omzet (§3); kolom ada di model/fixture.
(b) Zona controller mengikuti `config/app.php` Asia/Jakarta; Carbon `today()`/`startOfMonth()` konsisten.
(c) Fallback frontend (`??`) membuat halaman kontrak-lama tidak crash (nol/empty state) — terkonfirmasi pola kode, belum runtime login.
(d) Seeder `t_dc8f1257` (40 pesanan tersebar 30 hari, status beragam) cukup untuk menguji grafik/tab/menipis.

Pertanyaan (maks 5, prioritas desc):
1. [BLOCKING — backenddeveloper] Kontrak baru §7 vs Recharts: pertahankan SVG murni (update §7 hapus "Pustaka grafik: Recharts") atau wajib Recharts? Rekomendasi: pertahankan SVG (ringan, tanpa gradien, build kecil) + update satu kalimat §7. — NON-BLOCKING untuk QA, BLOCKING untuk kriteria "selesai" harfiah.
2. [NON-BLOCKING — techlead] Wordmark sidebar serif dikecualikan dari "tanpa serif"? Rekomendasi: kecualikan wordmark atau ganti Hanken.
3. [NON-BLOCKING — backenddeveloper] Indeks `(status, dipesan_at)` sudah ada? Rekomendasi: pastikan di migrasi saat backend rewrite agregasi (§8).
4. [NON-BLOCKING — techlead] "Lihat semua" perlu query filter minggu (`/admin/pesanan?minggu_ini=1`)? Tambahan §6 "jika halaman pesanan mendukungnya" — rekomendasi: biarkan link polos, catat P3.
5. [NON-BLOCKING — techlead] State loading/galat dashboard: apakah halaman Inertia server-render dikecualikan dari syarat loading? Rekomendasi: tambah error boundary minimal + dokumentasikan; tidak menahan rilis bila backend 500 sudah halaman error Inertia global.

## 4. Matriks risiko dan strategi uji

| Area/Fitur | Kemungkinan gagal | Dampak | Level | Strategi/kedalaman uji |
|---|---|---|---|---|
| Definisi omzet (baru ikut dihitung) | Tinggi (kode terbukti `!= batal`) | Tinggi (angka bisnis salah, laporan ikut salah) | Kritis | Review kode + uji runtime banding dashboard vs laporan per periode (butuh login) |
| Kontrak props lama vs baru (tabs/batang/riwayat kosong) | Pasti (terbukti) | Tinggi (fitur baru tidak tampil dengan backend lama) | Kritis | Inspeksi key + runtime login |
| Stok menipis (`<=` literal string, ikut 0, tanpa filter arsip) | Tinggi (`where('stok','<=','stok_minimum')` vs `whereColumn`; Report benar) | Sedang (counter salah, bisa puluhan) | Tinggi | Review kode + uji dengan seeder (varian 0 vs menipis vs arsip) |
| Proteksi `/admin` (auth) | Rendah | Tinggi | Tinggi | HTTP 302 (terbukti) + sesi/logout (Belum diuji) |
| Produk terlaris (key `total_terjual` vs `jumlah_terjual`, tanpa `omzet`, filter `baru`) | Pasti | Sedang | Sedang | Inspeksi + runtime |
| Riwayat minggu (5 global vs 10 mingguan) | Pasti | Sedang | Sedang | Inspeksi + runtime Sen–Min |
| Visual: gradien/placeholder/font/responsif 360px | Rendah (search 0) | Rendah–Sedang | Rendah | Statis lulus; browser Belum diuji |
| Performa LCP/Lighthouse, aksesibilitas keyboard tablist | — | Sedang | Rendah | Belum diuji (butuh browser + alat) |

Jenis uji: review requirement, fungsional (statis), HTTP (`/admin`, `/login`), integrasi props,
regresi build. TIDAK dilakukan: E2E browser, load/pen-test, screen reader (alat tidak tersedia).

## 5. Test case

| ID | Requirement/AC | Fitur | Skenario | Prasyarat | Langkah | Hasil diharapkan | Tipe | Prioritas | Status | Otomatis? |
|---|---|---|---|---|---|---|---|---|---|---|
| QA-DASH-01 | Tambahan §2 | Kartu statistik | Props baru tampil + "Baru" bila pembanding 0 | Backend baru / fixture | Buka `/admin`, cek 5 kartu; bandingkan kemarin/bulan lalu = 0 | Angka + "Baru", pesan link ke pesan-masuk | Fungsional | P0 | Belum diuji (butuh login/browser) | Tidak |
| QA-DASH-02 | Tambahan §3, PRD §6.7 | Omzet | `baru` tidak dihitung; = Laporan | Seeder 40 pesanan | Bandingkan kartu/grafik vs `/admin/laporan` per periode | Sama persis; `baru` excluded | Fungsional/integrasi | P0 | Gagal (review kode: `!= batal` di Dashboard+Report) → bug backend | Tidak |
| QA-DASH-03 | Tambahan §4 | Tab perbandingan | 3 tab ganti tanpa reload, data beda | Backend baru | Klik Hari ini/Minggu ini/Bulan ini | `tablist`, underline pandan, grafik+total berubah | Fungsional/UI | P0 | Belum diuji (kode: `useState` + `role=tablist` OK) | Tidak |
| QA-DASH-04 | Tambahan §4 | Grafik gelombang | Tanpa gradien, tooltip, empty state | — | Inspeksi + runtime kosong | Isian datar pandan-muda, garis jahitan, "Belum ada penjualan pada periode ini." | UI | P1 | Lulus (statis: search gradien/placeholder 0; area flat) | Tidak |
| QA-DASH-05 | Tambahan §5 | Batang bulanan | Kelompok minggu, null tidak digambar | Backend baru | Cek 5 kelompok, minggu depan kosong | Dua batang lawon/pandan, radius 2px, judul kata naik/turun | Fungsional/UI | P1 | Belum diuji (kode OK) | Tidak |
| QA-DASH-06 | Tambahan §6 | Riwayat minggu | 10 terbaru minggu Sen–Min + link | Seeder | Buka tabel, klik kode & "Lihat semua" | Kolom+badge+WIB benar; link `/admin/pesanan/{id}` | Fungsional | P1 | Belum diuji (backend kirim 5 global) | Tidak |
| QA-DASH-07 | Tambahan §2/§9 | Stok menipis | `0 < stok <= minimum`, non-arsip, kecil | Seeder (1 menipis + 1 habis) | Cek kartu + daftar 5 | Habis (0) tidak dihitung; arsip excluded | Fungsional/boundary | P0 | Gagal (review kode: `where` literal + tanpa `>0`/arsip) → bug backend | Tidak |
| QA-DASH-08 | Tambahan §9 | Placeholder/gradien | Tidak ada teks/gradien sisa | — | Search + build | 0 `gradient/Placeholder/lorem`; build lolos | Regresi | P1 | Lulus (search 0; build 748ms) | Tidak |
| QA-DASH-09 | PRD §5.5 | Proteksi admin | Tamu `/admin` → `/login` | Server pemilik | `curl /admin`, `/login` | 302 → `/login`; `/login` 200 | HTTP/otorisasi | P0 | Lulus | Tidak |
| QA-DASH-10 | Tambahan §9 | Responsif 360px | Menumpuk, tidak overflow | Browser | 360px + tablet | 1 kolom, tabel scroll dalam wadah | UI | P2 | Belum diuji, butuh browser | Tidak |
| QA-DASH-11 | Tambahan §9 | Loading/galat | State ada | — | Simulasi lambat/gagal | Skeleton/error + retry | UI | P2 | Gagal (kode: hanya empty state) → observasi, lihat §3-Q5 | Tidak |
| QA-DASH-12 | Tambahan §7 | Props snake_case | Key sesuai §7 | Backend baru | Header `X-Inertia` / `data-page` | `kartu/perbandingan/pendapatan_bulanan/...` | Integrasi | P0 | Gagal (backend camelCase lama) → bug backend | Tidak |

## 6. Traceability matrix

| Requirement/AC | Test Case ID | Cakupan | Status |
|---|---|---|---|
| §2 kartu | QA-DASH-01, 07 | 5 kartu, "Baru", link pesan | Belum diuji + Gagal (backend) |
| §3 definisi omzet/minggu | QA-DASH-02 | Status + periode + =Laporan | Gagal (kode) |
| §4 gelombang | QA-DASH-03, 04 | Tab, garis, tooltip, empty | Belum diuji + Lulus statis |
| §5 batang | QA-DASH-05 | Kelompok, null, judul | Belum diuji |
| §6 riwayat | QA-DASH-06 | 10/minggu/link | Belum diuji (backend salah) |
| §7 props | QA-DASH-12, fixture | snake_case, Recharts | Gagal (backend) + deviasi Recharts |
| §8 teknis | — | Agregasi, indeks, font | Sebagian (indeks Belum diuji; serif minor) |
| §9 selesai | QA-DASH-08, 09, 10, 11 | Gradien, responsif, state, build | Lulus (statis+HTTP+build); runtime Belum diuji |
| PRD §12 QA | QA-DASH-09 | HTTP + jujur | Lulus |

## 7. Script otomatisasi

Tidak dibuat (tidak diminta kartu; tooling browser/PHPUnit tidak tersedia/bukan wewenang QA).
Verifikasi memakai `curl` + `search_files` + `npm run build` yang sudah ada.

## 8. Hasil eksekusi (hanya yang benar-benar dijalankan)

- `GET /admin` (tamu): **302 Found → `http://127.0.0.1:8000/login`**, `SIZE:354 TIME:0.44s`, cookie sesi diset. — LULUS (proteksi dasar).
- `GET /login`: **200, SIZE:1063, 0.43s**. — LULUS (halaman tersedia).
- `npm run build`: **lolos 748ms**, 16 chunk termasuk `Index-D7VNhUXQ.js 20.43kB` (dashboard). — LULUS.
- Search `gradient|Placeholder|placeholder|lorem|Recharts|BarChart|LineChart` di `Index.jsx`: **0**. — LULUS (tanpa gradien/placeholder).
- Search `role="tablist"` + `useState('minggu_ini')`: ada (baris 191–192, 280). — LULUS statis (runtime Belum diuji).
- Review `DashboardController` + `ReportController` + `Order` + `config/app.php:68`: temuan definisi (lihat §9). — GAGAL (kode).
- Runtime login/browser (tab klik, angka vs laporan, 360px, LCP/Lighthouse, keyboard, sesi/logout): **Belum diuji** — butuh kredensial/akun uji + browser; server milik pemilik, QA tidak mengubah data.

Ringkasan: total 12 — Lulus 4 (QA-DASH-04/08/09 + sebagian 03-statis), Gagal 4 (02/07/11/12),
Belum diuji 5 (01/03-runtime/05/06-runtime/10). Per prioritas: P0: 1 lulus, 3 gagal, 2 belum; P1: 2 lulus-statis, 3 belum; P2: 2 belum/gagal-observasi.

## 9. Bug report

### BUG-DASH-01 (Kritis/High, P0) — Backend masih kontrak lama + definisi omzet/stok salah
- Komponen: Backend. File: `app/Http/Controllers/Admin/DashboardController.php:26–120`,
  `app/Http/Controllers/Admin/ReportController.php:34–67` (pola sama), `docs/kontrak-props.md` (LOCKED lama).
- Prasyarat: server + seeder `t_dc8f1257`.
- Reproduksi: (1) buka `/admin` dengan backend sekarang → kartu/grafik/tab kosong-nol (fallback `??`);
  (2) baca controller: `where('status','!=','batal')` menghitung `baru`;
  (3) `Variant::where('stok','<=','stok_minimum')` membandingkan ke string literal + ikut stok 0
  (Report sudah benar pakai `whereColumn`); (4) tidak ada key `kartu/perbandingan/pendapatan_bulanan/riwayat...`.
- Aktual: props `{ data.omzetHariIni...camelCase, grafikOmzet30Hari, pesananTerbaru(5 global),
  produkTerlaris{total_terjual}, varianStokMenipisList{id,sku,size,color,product_nama} }`.
- Diharapkan (tambahan §§2–7 + PRD §6.7): props snake_case §7; omzet `SUM(total)` hanya
  `dibayar,dikemas,dikirim,selesai` by `dipesan_at`; minggu Sen–Min Asia/Jakarta; `perbandingan`
  (jam 00–23 / Sen–Min / 1–akhir bulan + total); `pendapatan_bulanan` kelompok 1-7/8-14/15-21/22-28/29-akhir
  (null untuk minggu depan); `riwayat_pesanan_minggu_ini` 10 minggu berjalan; `produk_terlaris`
  `{id,nama,jumlah_terjual,omzet}` 30 hari; `stok_menipis_daftar` `{varian_id,produk_nama,ukuran,warna,
  stok,stok_minimum}` dengan `stok>0 AND stok<=minimum`, produk non-arsip; `kartu` lengkap
  (`omzet_kemarin`, `omzet_bulan_lalu`); agregasi `SUM/GROUP BY`; `kontrak-props.md` dimutakhirkan.
- Bukti: controller 146 baris dibaca; search status 40+ hit; `curl` 302; build lolos (frontend valid).
- Frekuensi: selalu. Dugaan: controller ditulis sebelum tambahan; copy-paste ke Report membawa pola `!= batal`.
- Status: terbuka → kartu perbaikan backend (satu kartu mencakup controller + kontrak-props).
- Batas putaran: maks 2 putaran/masalah (kartu ini putaran 1).

### OBS-DASH-02 (Low, P2–P3, observasi — bukan kartu bug terpisah)
- State loading/galat tidak ada (hanya empty); Recharts→SVG deviasi satu kalimat §7;
  legenda bawah grafik minim; wordmark sidebar serif (`AdminLayout.jsx:12`).
  Ditawarkan sebagai tindak lanjut setelah BUG-DASH-01; tidak dibuatkan kartu agar patuh "maks 2".

## 10. Hasil non-fungsional dan batasan

- Keamanan dasar: proteksi tamu 302 LULUS; pesan login/rate-limit/sesi-logout, IDOR, XSS injeksi: Belum diuji.
- Performa indikatif: build 748ms; respons `/admin` 0.44s (302) / `/login` 0.43s. LCP <2,5s + Lighthouse ≥85 (`/`, `/product`): Belum diuji (butuh browser/lighthouse; dashboard bukan halaman yang ditarget PRD).
- Aksesibilitas: `role=tablist/tab`, `aria-selected`, `aria-label` grafik, fokus ring kartu pesan OK statis; keyboard/kontras/screen-reader: Belum diuji.
- Kompatibilitas 360px/tablet: pola grid/scroll benar statis; visual Belum diuji, butuh browser.
- Ketahanan: request lambat/timeout/500: Belum diuji.
- Environment: server + DB milik pemilik; `.env` tidak disentuh; tidak ada aksi destruktif/pesan nyata.

## 11. Self-review checklist

- [x] Semua AC §§2–9 dipetakan (§6) atau gap dicatat.
- [x] Risiko tinggi diprioritaskan (§4: omzet, kontrak, stok, proteksi).
- [x] Negatif/boundary/edge/otorisasi/state UI dipertimbangkan (§5).
- [x] Sesuai arsitektur Inertia (props, tanpa `/api`) + route yang ada (`web.php` grup `auth` prefix `admin`).
- [x] Tanpa klaim pengujian yang belum dieksekusi (runtime = Belum diuji).
- [x] Bug ada reproduksi + expected bersumber + bukti aman (§9, tanpa secret).
- [ ] Perbaikan belum diverifikasi (backend belum dikerjakan) + regresi menunggu putaran 2.
- [x] Known issues, batasan, risiko tersisa dicatat.
- [x] Hanya `docs/` diubah (file ini); tidak baca/ubah `.env`.
- [x] Go/No-Go beralasan (§12).

## 12. Rekomendasi Go/No-Go

**NO-GO** (rilis dashboard ditahan sampai BUG-DASH-01 diperbaiki dan diverifikasi putaran 2).

Alasan: kontrak backend lama membuat seluruh fitur baru §§4–7 tidak tampil (fallback nol/kosong);
definisi omzet salah (`baru` ikut dihitung) merambat ke Laporan sehingga "angka = Laporan" (§9)
lolos semu; counter stok menipis salah (ikut 0 + banding string). Frontend sendiri valid
(tanpa gradien/placeholder, tablist, empty state, build lolos) dan aman-fallback (tidak crash),
serta proteksi tamu 302 bekerja — sehingga NO-GO ini sempit ke backend, bukan penolakan frontend.

Syarat GO putaran 2: (1) backend kirim kontrak §7 + definisi §3 benar;
(2) `kontrak-props.md` dimutakhirkan; (3) QA login verifikasi angka dashboard = laporan,
tab 3 berganti data, riwayat 10 mingguan, menipis kecil; (4) `npm run build` tetap lolos.
Observasi (loading/galat, Recharts-vs-SVG, serif wordmark, 360px visual) boleh GO bersyarat terpisah.
