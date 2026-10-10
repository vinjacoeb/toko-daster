import { Head, usePage, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function AdminPesanMasuk() {
    const { title, messages } = usePage().props;
    const pesanList = messages.data || [];

    const tandaiDibaca = (id) => {
        router.patch(route('admin.pesanan.update', id)); // Placeholder route untuk patch
    };

    const hapusPesan = (id) => {
        if (confirm('Yakin ingin menghapus pesan ini?')) {
            router.delete(route('admin.pesanan.destroy', id)); // Placeholder route untuk delete
        }
    };

    return (
        <AdminLayout title={title}>
            <Head title={title} />
            <div className="max-w-7xl mx-auto p-6">
                <h1 className="text-3xl font-bold text-arang mb-6">Pesan Masuk</h1>
                
                <div className="bg-putih border border-garis rounded-sm">
                    {pesanList.length === 0 ? (
                        <p className="p-6 text-center text-abu">Tidak ada pesan.</p>
                    ) : (
                        pesanList.map(pesan => (
                            <div key={pesan.id} className="p-4 border-b border-garis flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-arang">{pesan.nama}</p>
                                    <p className="text-sm text-abu">{pesan.kontak}</p>
                                    <p className="mt-1">{pesan.pesan}</p>
                                </div>
                                <div className="flex gap-2">
                                    {!pesan.dibaca_at && (
                                        <button onClick={() => tandaiDibaca(pesan.id)} className="text-pandan text-sm underline">Tandai Dibaca</button>
                                    )}
                                    <button onClick={() => hapusPesan(pesan.id)} className="text-cabai text-sm underline">Hapus</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}