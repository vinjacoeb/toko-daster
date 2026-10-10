import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';

export default function AdminPesanMasuk() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/admin/api/pesan-masuk')
            .then(res => {
                if (!res.ok) throw new Error('Gagal memuat pesan masuk');
                return res.json();
            })
            .then(data => setMessages(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <AdminLayout>
            <Head title="Admin Pesan Masuk" />
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-arang mb-6">Kelola Pesan Masuk</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {messages.map(message => (
                        <div key={message.id} className="bg-putih border border-garis rounded-lg p-4">
                            <h2 className="text-xl font-semibold text-arang mb-2">{message.nama}</h2>
                            <p className="text-abu mb-1">Kontak: {message.kontak}</p>
                            <p className="text-abu mb-1">Pesan: {message.pesan}</p>
                            <p className="text-abu mb-1">Dibaca: {message.dibaca_at || 'Belum'}</p>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
