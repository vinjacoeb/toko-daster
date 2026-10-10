import React from 'react';
import { Link, Head } from '@inertiajs/react';

export default function AdminLayout({ children, title }) {
    return (
        <div className="min-h-screen bg-kapas flex">
            <Head title={title || 'Admin'} />
            
            {/* Sidebar */}
            <aside className="w-64 bg-pandan-gelap text-kapas shrink-0 hidden md:block">
                <div className="p-6">
                    <h1 className="font-young-serif text-2xl text-kapas mb-8">Daster</h1>
                    <nav className="space-y-2">
                        <Link href="/admin" className="block px-4 py-2 rounded hover:bg-pandan transition-colors">Dashboard</Link>
                        <Link href="/admin/produk" className="block px-4 py-2 rounded hover:bg-pandan transition-colors">Produk</Link>
                        <Link href="/admin/kategori" className="block px-4 py-2 rounded hover:bg-pandan transition-colors">Kategori</Link>
                        <Link href="/admin/stok" className="block px-4 py-2 rounded hover:bg-pandan transition-colors">Stok</Link>
                        <Link href="/admin/pesanan" className="block px-4 py-2 rounded hover:bg-pandan transition-colors">Pesanan</Link>
                        <Link href="/admin/pesan-masuk" className="block px-4 py-2 rounded hover:bg-pandan transition-colors">Pesan Masuk</Link>
                        <Link href="/admin/laporan" className="block px-4 py-2 rounded hover:bg-pandan transition-colors">Laporan</Link>
                        <Link href="/admin/pengaturan" className="block px-4 py-2 rounded hover:bg-pandan transition-colors">Pengaturan</Link>
                        <Link href="/admin/akun" className="block px-4 py-2 rounded hover:bg-pandan transition-colors">Akun</Link>
                    </nav>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="bg-putih border-b border-garis h-14 flex items-center justify-between px-6">
                    <div className="flex items-center space-x-4">
                        <span className="font-semibold text-arang">Panel Pengelola</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-abu">admin@example.com</span>
                        <Link 
                            href="/logout" 
                            method="post" 
                            as="button" 
                            className="text-sm text-cabai hover:underline"
                        >
                            Keluar
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
