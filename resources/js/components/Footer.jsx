import React from 'react';
import { usePage } from '@inertiajs/react';
import GarisJahitan from './GarisJahitan';

export default function Footer() {
    const { props } = usePage();
    const settings = props.settings || {};
    const storeName = settings.storeName || 'Toko Daster';
    const whatsappNumber = settings.whatsappNumber || '';
    const email = settings.email || '';
    const instagram = settings.instagram || '';
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-arang text-kapas py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Kolom Toko */}
                    <div>
                        <h3 className="font-young-serif text-pandan text-xl mb-4">{storeName}</h3>
                        <address className="not-italic text-kapas/80 space-y-2">
                            <p>{settings.address || '[CONTOH] Jl. Contoh No. 123'}</p>
                            <p>{settings.city || '[CONTOH] Kota, 12345'}</p>
                            <p>{settings.operatingHours || '[CONTOH] Jam buka: Senin - Sabtu, 09.00 - 17.00'}</p>
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
                            {whatsappNumber ? (
                                <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="block hover:text-pandan-muda">WhatsApp</a>
                            ) : (
                                <span className="block text-kapas/60">[CONTOH] WhatsApp</span>
                            )}
                            {email ? (
                                <a href={`mailto:${email}`} className="block hover:text-pandan-muda">{email}</a>
                            ) : (
                                <span className="block text-kapas/60">[CONTOH] info@tokodaster.com</span>
                            )}
                            {instagram ? (
                                <a href={`https://instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer" className="block hover:text-pandan-muda">Instagram</a>
                            ) : (
                                <span className="block text-kapas/60">[CONTOH] Instagram</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Garis jahitan sebelum hak cipta */}
                <div className="mt-12 pt-4">
                    <GarisJahitan />
                    <p className="text-sm text-kapas/60 mt-4">© {currentYear} {storeName}. Semua hak dilindungi.</p>
                </div>
            </div>
        </footer>
    );
}