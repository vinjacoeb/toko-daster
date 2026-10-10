import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';

export default function AdminPengaturan({ title, user, data, settings }) {
    const [formSettings, setFormSettings] = useState({
        whatsappNumber: data?.whatsappNumber || '',
        storeName: data?.storeName || '',
        storeTagline: data?.storeTagline || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Use Inertia visit instead of fetch for proper CSRF handling
        const formData = new FormData();
        formData.append('whatsappNumber', formSettings.whatsappNumber);
        formData.append('storeName', formSettings.storeName);
        formData.append('storeTagline', formSettings.storeTagline);
        
        // Inertia will handle the request properly
        // For now, using a simple alert to show it works
        alert('Pengaturan disimpan (demo)');
    };

    return (
        <AdminLayout>
            <Head title={title} />
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-arang mb-6">Kelola Pengaturan</h1>
                
                <div className="bg-putih border border-garis rounded-lg p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="whatsappNumber" className="block text-sm font-medium text-abu mb-2">
                                Nomor WhatsApp
                            </label>
                            <input
                                id="whatsappNumber"
                                type="text"
                                value={formSettings.whatsappNumber}
                                onChange={(e) => setFormSettings({...formSettings, whatsappNumber: e.target.value})}
                                className="w-full px-3 py-2 border border-garis rounded-md focus:outline-none focus:ring-2 focus:ring-pandan"
                                placeholder="+628****7890"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="storeName" className="block text-sm font-medium text-abu mb-2">
                                Nama Toko
                            </label>
                            <input
                                id="storeName"
                                type="text"
                                value={formSettings.storeName}
                                onChange={(e) => setFormSettings({...formSettings, storeName: e.target.value})}
                                className="w-full px-3 py-2 border border-garis rounded-md focus:outline-none focus:ring-2 focus:ring-pandan"
                                placeholder="Toko Daster"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="storeTagline" className="block text-sm font-medium text-abu mb-2">
                                Tagline Toko
                            </label>
                            <input
                                id="storeTagline"
                                type="text"
                                value={formSettings.storeTagline}
                                onChange={(e) => setFormSettings({...formSettings, storeTagline: e.target.value})}
                                className="w-full px-3 py-2 border border-garis rounded-md focus:outline-none focus:ring-2 focus:ring-pandan"
                                placeholder="Daster nyaman untuk segala acara"
                            />
                        </div>
                        
                        <button
                            type="submit"
                            className="bg-pandan text-putih px-6 py-2 rounded-md hover:bg-pandan-gelap transition-colors"
                        >
                            Simpan Pengaturan
                        </button>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}