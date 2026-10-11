// Fixture pengembangan saja (bukan data produksi).
// Bentuk mengikuti docs/dashboard-tambahan.md bagian 7 (key snake_case bahasa Indonesia).
// Dipakai untuk pengembangan/test komponen dashboard; halaman membaca props asli Inertia.

export const dashboardFixture = {
    kartu: {
        omzet_hari_ini: 1250000,
        omzet_kemarin: 980000,
        omzet_bulan_ini: 42500000,
        omzet_bulan_lalu: 36000000,
        pesanan_perlu_diproses: 7,
        stok_menipis: 3,
        pesan_belum_dibaca: 2,
    },
    perbandingan: {
        hari_ini: {
            label: ['00', '06', '12', '18', '23'],
            sekarang: [0, 150000, 600000, 900000, 1250000],
            pembanding: [0, 100000, 450000, 800000, 980000],
            total_sekarang: 1250000,
            total_pembanding: 980000,
        },
        minggu_ini: {
            label: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
            sekarang: [200000, 350000, 0, 500000, 750000, 900000, 400000],
            pembanding: [150000, 300000, 250000, 400000, 600000, 700000, 350000],
            total_sekarang: 3100000,
            total_pembanding: 2750000,
        },
        bulan_ini: {
            label: ['1', '5', '10', '15', '20', '25', '30'],
            sekarang: [500000, 1200000, 2500000, 4300000, 6100000, 8000000, 9500000],
            pembanding: [400000, 1000000, 2100000, 3800000, 5400000, 7000000, 8300000],
            total_sekarang: 42500000,
            total_pembanding: 36000000,
        },
    },
    pendapatan_bulanan: {
        nama_bulan_ini: 'Oktober',
        nama_bulan_lalu: 'September',
        kelompok: ['1-7', '8-14', '15-21', '22-28', '29-31'],
        bulan_ini: [8200000, 10500000, 11800000, 9000000, 3000000],
        bulan_lalu: [7000000, 9200000, 10100000, 8600000, 1100000],
        total_bulan_ini: 42500000,
        total_bulan_lalu: 36000000,
    },
    riwayat_pesanan_minggu_ini: [
        { id: 1, kode: 'TD-0001', nama_pelanggan: '[CONTOH] Budi', total: 185000, status: 'baru', dipesan_at: '2026-10-06T09:12:00+07:00' },
        { id: 2, kode: 'TD-0002', nama_pelanggan: '[CONTOH] Sari', total: 240000, status: 'dibayar', dipesan_at: '2026-10-07T14:05:00+07:00' },
    ],
    produk_terlaris: [
        { id: 1, nama: '[CONTOH] Daster Motif A', jumlah_terjual: 24, omzet: 2880000 },
        { id: 2, nama: '[CONTOH] Daster Motif B', jumlah_terjual: 18, omzet: 2160000 },
    ],
    stok_menipis_daftar: [
        { varian_id: 11, produk_nama: '[CONTOH] Daster Motif A', ukuran: 'L', warna: 'Biru', stok: 2, stok_minimum: 3 },
        { varian_id: 12, produk_nama: '[CONTOH] Daster Motif B', ukuran: 'M', warna: 'Merah', stok: 1, stok_minimum: 3 },
    ],
};

export default dashboardFixture;
