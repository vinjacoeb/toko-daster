import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Pesanan() {
    const { data: paginatedData, filters, orderStatuses, orderChannels, title } = usePage().props;
    const orders = paginatedData?.data ?? [];
    
    return (
        <AdminLayout>
            <Head title={title || 'Manajemen Pesanan'} />
            <div className="max-w-7xl mx-auto p-6">
                <h1 className="text-3xl font-bold text-arang mb-6">Pesanan</h1>
                <div className="bg-putih border border-garis rounded-sm overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[760px]">
                        <thead>
                            <tr className="bg-pasir text-abu text-[13px] font-semibold border-b border-garis">
                                <th className="py-3 px-4">Kode</th>
                                <th className="py-3 px-4">Pelanggan</th>
                                <th className="py-3 px-4">Channel</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4 text-right">Total</th>
                                <th className="py-3 px-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-arang">
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order.id} className="border-b border-garis">
                                        <td className="py-3 px-4 font-mono">{order.code}</td>
                                        <td className="py-3 px-4">{order.customer_name}</td>
                                        <td className="py-3 px-4 capitalize">{order.channel}</td>
                                        <td className="py-3 px-4">{order.status}</td>
                                        <td className="py-3 px-4 text-right">{order.total.toLocaleString('id-ID')}</td>
                                        <td className="py-3 px-4 text-right">
                                            <a href={`/admin/pesanan/${order.id}`} className="text-pandan hover:underline">Detail</a>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center text-abu">Belum ada pesanan.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}