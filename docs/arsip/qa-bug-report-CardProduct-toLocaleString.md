# Bug Report: TypeError Cannot read properties of undefined (reading 'toLocaleString')

## ID dan judul
- ID: BUG-001
- Judul: TypeError: Cannot read properties of undefined (reading 'toLocaleString') pada CardProduct.jsx

## Severity dan prioritas
- Severity: High (Fitur utama katalog produk rusak)
- Prioritas: P0

## Komponen
- Frontend

## Environment
- File: resources/js/components/CardProduct.jsx

## Prasyarat
- Membuka halaman yang merender CardProduct (misalnya / atau /product) dengan data produk yang tidak lengkap (harga undefined).

## Langkah reproduksi
1. Buka aplikasi web di environment pengujian.
2. Navigasi ke halaman katalog produk (/ atau /product).
3. Halaman gagal dimuat dan menampilkan error UI React.

## Hasil aktual
Aplikasi menampilkan error "TypeError: Cannot read properties of undefined (reading 'toLocaleString')" di konsol dan UI rusak/putih.

## Hasil yang diharapkan
Aplikasi menampilkan produk dengan harga yang valid, atau menangani ketiadaan harga dengan aman tanpa menyebabkan crash.

## Bukti
- Screenshot: error12.png
- Lokasi: CardProduct.jsx:52

## Status
- Terbuka
