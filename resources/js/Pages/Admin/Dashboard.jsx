import { Head } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import { usePage } from '@inertiajs/react';

export default function AdminDashboard() {
    const { data, filters, settings, title } = usePage().props;
    const products = data?.products ?? [];
    const categories = data?.categories ?? [];
    const orders = data?.orders ?? [];

    return (
        <AdminLayout>
            <Head title={title} />
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-arang mb-6">Dasbor Admin</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-putih border border-garis rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-arang mb-4">Produk</h2>
                        <p className="text-3xl font-bold text-pandan">{products.length}</p>
                    </div>
                    <div className="bg-putih border border-garis rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-arang mb-4">Kategori</h2>
                        <p className="text-3xl font-bold text-pandan">{categories.length}</p>
                    </div>
                    <div className="bg-putih border border-garis rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-arang mb-4">Pesanan</h2>
                        <p className="text-3xl font-bold text-pandan">{orders.length}</p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
