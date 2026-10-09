import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';

export default function AdminDashboard() {
    return (
        <AdminLayout>
            <Head title="Dashboard Admin" />
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-arang mb-6">Dashboard Admin</h1>
                
                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-putih border border-garis rounded-lg p-6">
                        <h3 className="text-sm font-medium text-abu mb-2">Omzet Hari Ini</h3>
                        <p className="text-2xl font-bold text-arang">Rp 5.000.000</p>
                        <span className="text-sm text-pandan mt-1">▲ 5% dari kemarin</span>
                    </div>
                    <div className="bg-putih border border-garis rounded-lg p-6">
                        <h3 className="text-sm font-medium text-abu mb-2">Pesanan Perlu Proses</h3>
                        <p className="text-2xl font-bold text-arang">12</p>
                        <span className="text-sm text-kunyit mt-1">● Menunggu</span>
                    </div>
                    <div className="bg-putih border border-garis rounded-lg p-6">
                        <h3 className="text-sm font-medium text-abu mb-2">Stok Menipis</h3>
                        <p className="text-2xl font-bold text-arang">8</p>
                        <span className="text-sm text-cabai mt-1">● Menipis</span>
                    </div>
                    <div className="bg-putih border border-garis rounded-lg p-6">
                        <h3 className="text-sm font-medium text-abu mb-2">Pesan Belum Dibaca</h3>
                        <p className="text-2xl font-bold text-arang">3</p>
                        <span className="text-sm text-lawon mt-1">● Belum dibaca</span>
                    </div>
                </div>

                {/* Grafik Omzet 30 Hari */}
                <div className="bg-putih border border-garis rounded-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold text-arang mb-4">Grafik Omzet 30 Hari</h2>
                    <div className="h-64 bg-kapas rounded flex items-center justify-center">
                        <span className="text-abu">Grafik omzet akan ditampilkan di sini</span>
                    </div>
                </div>

                {/* Produk Terlaris */}
                <div className="bg-putih border border-garis rounded-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold text-arang mb-4">Produk Terlaris (30 Hari)</h2>
                    <ul className="space-y-3">
                        <li className="flex justify-between items-center">
                            <span className="text-arang">Daster A</span>
                            <span className="text-abu">Terjual: 150</span>
                        </li>
                        <li className="flex justify-between items-center">
                            <span className="text-arang">Daster B</span>
                            <span className="text-abu">Terjual: 120</span>
                        </li>
                        <li className="flex justify-between items-center">
                            <span className="text-arang">Daster C</span>
                            <span className="text-abu">Terjual: 100</span>
                        </li>
                    </ul>
                </div>

                {/* Pesanan Terbaru */}
                <div className="bg-putih border border-garis rounded-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold text-arang mb-4">Pesanan Terbaru</h2>
                    <ul className="space-y-3">
                        <li className="flex justify-between items-center">
                            <span className="text-arang">Kode: #001</span>
                            <span className="text-abu">Pelanggan: Budi Santoso</span>
                            <span className="text-abu">Total: Rp 125.000</span>
                            <span className="text-abu">Status: Dibayar</span>
                            <span className="text-abu">Waktu: 2024-01-15 10:30</span>
                        </li>
                        <li className="flex justify-between items-center">
                            <span className="text-arang">Kode: #002</span>
                            <span className="text-abu">Pelanggan: Anita Wijaya</span>
                            <span className="text-abu">Total: Rp 89.000</span>
                            <span className="text-abu">Status: Baru</span>
                            <span className="text-abu">Waktu: 2024-01-15 09:15</span>
                        </li>
                    </ul>
                </div>

                {/* Stok Menipis */}
                <div className="bg-putih border border-garis rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-arang mb-4">Stok Menipis</h2>
                    <ul className="space-y-3">
                        <li className="flex justify-between items-center">
                            <span className="text-arang">Daster A - Ukuran M</span>
                            <span className="text-abu">Stok: 2 / Minimum: 5</span>
                        </li>
                        <li className="flex justify-between items-center">
                            <span className="text-arang">Daster B - Ukuran S</span>
                            <span className="text-abu">Stok: 1 / Minimum: 3</span>
                        </li>
                    </ul>
                </div>
            </div>
        </AdminLayout>
    );
}
