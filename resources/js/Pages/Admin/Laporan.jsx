import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';

export default function AdminLaporan({ title, data, settings }) {
    const stats = data;
    const topProducts = data?.produkTerlaris || [];
    const recentOrders = data?.pesananTerbaru || [];
    const lowStock = data?.varianStokMenipisList || [];

    return (
        <AdminLayout>
            <Head title={title} />
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-arang mb-6">Laporan Admin</h1>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-putih border border-garis rounded-lg p-6">
                        <h3 className="text-sm font-medium text-abu mb-2">Omzet Hari Ini</h3>
                        <p className="text-2xl font-bold text-arang">Rp {stats?.omzetHariIni?.toLocaleString() || 0}</p>
                    </div>
                    <div className="bg-putih border border-garis rounded-lg p-6">
                        <h3 className="text-sm font-medium text-abu mb-2">Pesanan Perlu Proses</h3>
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

                {/* Produk Terlaris */}
                <div className="bg-putih border border-garis rounded-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold text-arang mb-4">Produk Terlaris (30 Hari)</h2>
                    <ul className="space-y-3">
                        {topProducts.map((product, index) => (
                            <li key={index} className="flex justify-between items-center">
                                <span className="text-arang">{product.nama}</span>
                                <span className="text-abu">Terjual: {product.total_terjual}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Pesanan Terbaru */}
                <div className="bg-putih border border-garis rounded-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold text-arang mb-4">Pesanan Terbaru</h2>
                    <ul className="space-y-3">
                        {recentOrders.map((order, index) => (
                            <li key={index} className="flex justify-between items-center">
                                <span className="text-arang">Kode: {order.kode}</span>
                                <span className="text-abu">Total: Rp {order.total.toLocaleString()}</span>
                                <span className="text-abu">Status: {order.status}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Stok Menipis */}
                <div className="bg-putih border border-garis rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-arang mb-4">Stok Menipis</h2>
                    <ul className="space-y-3">
                        {lowStock.map((variant, index) => (
                            <li key={index} className="flex justify-between items-center">
                                <span className="text-arang">{variant.product_nama} ({variant.size} - {variant.color})</span>
                                <span className="text-abu">Stok: {variant.stok} / Min: {variant.stok_minimum}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </AdminLayout>
    );
}