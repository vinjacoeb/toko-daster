import { Head, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function AdminDashboard() {
    const { title, data, settings } = usePage().props;
    const stats = data;

    return (
        <AdminLayout title={title}>
            <Head title={title} />
            <div className="max-w-7xl mx-auto p-6">
                <h1 className="text-3xl font-bold text-arang mb-6">Dashboard Admin</h1>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-putih border border-garis rounded-lg p-6">
                        <h3 className="text-sm font-medium text-abu mb-2">Omzet Hari Ini</h3>
                        <p className="text-2xl font-bold text-arang">Rp {stats?.omzetHariIni?.toLocaleString() || 0}</p>
                    </div>
                    <div className="bg-putih border border-garis rounded-lg p-6">
                        <h3 className="text-sm font-medium text-abu mb-2">Pesanan Perlu Diproses</h3>
                        <p className="text-2xl font-bold text-arang">{stats?.pesananPerluDiproses || 0}</p>
                    </div>
                    <div className="bg-putih border border-garis rounded-lg p-6">
                        <h3 className="text-sm font-medium text-abu mb-2">Stok Menipis</h3>
                        <p className="text-2xl font-bold text-arang">{stats?.varianStokMenipis || 0}</p>
                    </div>
                    <div className="bg-putih border border-garis rounded-lg p-6">
                        <h3 className="text-sm font-medium text-abu mb-2">Pesan Belum Dibaca</h3>
                        <p className="text-2xl font-bold text-arang">{stats?.pesanBelumDibaca || 0}</p>
                    </div>
                </div>

                {/* Grafik & Produk Terlaris (Simplified) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-putih border border-garis rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-arang mb-4">Grafik Omzet (30 Hari)</h2>
                        <div className="h-64 bg-pasir flex items-center justify-center text-abu">[Grafik Placeholder]</div>
                    </div>
                    <div className="bg-putih border border-garis rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-arang mb-4">Produk Terlaris</h2>
                        <ul className="space-y-2">
                            {stats?.produkTerlaris?.map((p, i) => (
                                <li key={i} className="flex justify-between">
                                    <span>{p.nama}</span>
                                    <span>{p.total_terjual} terjual</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}