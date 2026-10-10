# Catatan Perbaikan Frontend

## Ringkasan Perbaikan
- Memperbaiki error `Uncaught SyntaxError: The requested module ... does not provide an export named 'default'` dengan mengubah `export const InputSearch` menjadi `export default InputSearch` pada `resources/js/components/InputSearch.jsx`.
- Mengubah `import.meta.glob` di `resources/js/app.jsx` dari `{ eager: true }` menjadi tanpa `eager` (lazy loading) dan menyesuaikan fungsi `resolve` di `createInertiaApp` untuk menangani promise modul.
- Memverifikasi bahwa seluruh komponen lain di `resources/js/components/` sudah menggunakan `export default`.
- Memverifikasi build berhasil dengan `npm run build`.

## Status
- [x] Perbaikan `InputSearch` export.
- [x] Periksa seluruh komponen.
- [x] Perubahan `app.jsx` resolver.
- [x] Build berhasil.
