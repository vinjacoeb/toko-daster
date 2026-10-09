import React from 'react';

export default function Header() {
    return (
        <header className="bg-kapas border-b border-garis">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Wordmark kiri */}
                    <div className="flex-shrink-0">
                        <span className="font-young-serif text-pandan text-2xl">Daster</span>
                    </div>

                    {/* Menu kanan */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <a href="/" className="text-arang hover:text-pandan-gelap">Beranda</a>
                        <a href="/product" className="text-arang hover:text-pandan-gelap">Produk</a>
                        <a href="/kontak-kami" className="text-arang hover:text-pandan-gelap">Kontak kami</a>
                    </nav>

                    {/* Tombol WhatsApp */}
                    <div className="hidden md:block">
                        <a
                            href="https://wa.me/6281234567890"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-putih bg-pandan hover:bg-pandan-gelap focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pandan"
                        >
                            Tanya lewat WhatsApp
                        </a>
                    </div>

                    {/* Tombol Menu ponsel */}
                    <div className="md:hidden">
                        <button className="text-arang hover:text-pandan">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}