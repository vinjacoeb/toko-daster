import { Head, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function AdminLaporan() {
    const { title, data } = usePage().props;
    const stats = data;

    const handlePrint = () => {
        window.print();
    };

    return (
        <AdminLayout title={title}>
            <Head title={title} />
            <div className="max-w-7xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-arang">Laporan Penjualan</h1>
                    <div className="flex gap-2">
                        <button onClick={handlePrint} className="bg-pandan text-white px-4 py-2 rounded-sm">Cetak</button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-putih border border-garis rounded-lg p-6">
                        <h3 className="text-sm font-medium text-abu mb-2">Omzet</h3>
                        <p className="text-2xl font-bold text-arang">Rp {stats?.omzetBulanIni?.toLocaleString() || 0}</p>
                    </div>
                    <div className="bg-putih border border-garis rounded-lg p-6">
                        <h3 className="text-sm font-medium text-abu mb-2">Jumlah Pesanan</h3>
                        <p className="text-2xl font-bold text-arang">{stats?.pesananPerluDiproses || 0}</p>
                    </div>
                    <div className="bg-putih border border-garis rounded-lg p-6">
                        <h3 className="text-sm font-medium text-abu mb-2">Rata-rata Pesanan</h3>
                        <p className="text-2xl font-bold text-arang">Rp {stats?.omzetBulanIni > 0 ? (stats.omzetBulanIni / (stats.pesananPerluDiproses || 1)).toLocaleString() : 0}</p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}