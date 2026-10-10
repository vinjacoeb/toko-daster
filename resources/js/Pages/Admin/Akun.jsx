import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';

export default function AdminAkun({ title, user, data, settings }) {
    // Use the user prop passed from the controller (logged-in user)
    const userData = user || data;

    return (
        <AdminLayout>
            <Head title={title} />
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-arang mb-6">Kelola Akun</h1>
                
                <div className="bg-putih border border-garis rounded-lg p-6">
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-arang mb-4">Informasi Profil</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-abu mb-1">ID</label>
                                    <p className="text-arang">{userData?.id || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-abu mb-1">Nama</label>
                                    <p className="text-arang">{userData?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-abu mb-1">Email</label>
                                    <p className="text-arang">{userData?.email || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-abu mb-1">Status</label>
                                    <p className="text-arang">{userData?.aktif ? 'Aktif' : 'Tidak Aktif'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}