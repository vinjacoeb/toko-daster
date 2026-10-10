import { Head } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import { usePage } from '@inertiajs/react';

export default function AdminPesanan() {
    const { data, filters, settings, title } = usePage().props;
    const orders = data?.data ?? [];

    return (
        <AdminLayout>
            <Head title={title} />
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-arang mb-6">Kelola Pesanan</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders.map(order => (
                        <div key={order.id} className="bg-putih border border-garis rounded-lg p-4">
                            <h2 className="text-xl font-semibold text-arang mb-2">Kode: {order.kode}</h2>
                            <p className="text-abu mb-1">Pelanggan: {order.nama_pelanggan}</p>
                            <p className="text-abu mb-1">Total: Rp {order.total.toLocaleString()}</p>
                            <p className="text-abu mb-1">Status: {order.status}</p>
                            <p className="text-abu mb-1">Dibuat: {order.dipesan_at}</p>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
