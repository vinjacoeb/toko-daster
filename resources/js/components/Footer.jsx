import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-arang text-kapas py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Kolom Toko */}
                    <div>
                        <h3 className="font-young-serif text-pandan text-xl mb-4">Toko Daster</h3>
                        <address className="not-italic text-kapas/80 space-y-2">
                            <p>Jl. Contoh No. 123</p>
                            <p>Kota, 12345</p>
                            <p>Jam buka: Senin - Sabtu, 09.00 - 17.00</p>
                        </address>
                    </div>

                    {/* Kolom Tautan */}
                    <div>
                        <h3 className="font-young-serif text-pandan text-xl mb-4">Tautan</h3>
                        <nav className="space-y-2">
                            <a href="/" className="block hover:text-pandan-muda">Beranda</a>
                            <a href="/product" className="block hover:text-pandan-muda">Produk</a>
                            <a href="/kontak-kami" className="block hover:text-pandan-muda">Kontak kami</a>
                        </nav>
                    </div>

                    {/* Kolom Kontak */}
                    <div>
                        <h3 className="font-young-serif text-pandan text-xl mb-4">Kontak</h3>
                        <div className="space-y-2">
                            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="block hover:text-pandan-muda">WhatsApp</a>
                            <a href="mailto:info@tokodaster.com" className="block hover:text-pandan-muda">email</a>
                            <a href="https://instagram.com/tokodaster" target="_blank" rel="noopener noreferrer" className="block hover:text-pandan-muda">Instagram</a>
                        </div>
                    </div>
                </div>

                {/* Baris Hak Cipta */}
                <div className="mt-12 pt-8 border-t border-abu/30">
                    <p className="text-sm text-kapas/60">© 2024 Daster. Semua hak dilindungi.</p>
                </div>
            </div>
        </footer>
    );
}