import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import GuestLayout from '../Layouts/GuestLayout';
import Button from '../components/Button';

export default function KontakKami() {
    const { settings, flash } = usePage().props;

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        nama: '',
        kontak: '',
        pesan: '',
        _hp_field: '', // Honeypot field
    });

    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/kontak-kami', {
            preserveScroll: true,
            onSuccess: () => {
                setSubmitted(true);
                reset();
            },
        });
    };

    const handleResetForm = () => {
        setSubmitted(false);
        reset();
        clearErrors();
    };

    return (
        <GuestLayout>
            <Head title="Kontak Kami" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                {/* Breadcrumb */}
                <nav className="text-sm text-abu mb-6">
                    <a href="/" className="hover:text-pandan">Beranda</a>
                    {' / '}
                    <span className="text-arang">Kontak kami</span>
                </nav>

                <h1 className="font-young-serif text-arang text-[40px] leading-tight mb-8">
                    Hubungi kami
                </h1>

                {/* Success Banner / Message if flash or submitted */}
                {(submitted || flash?.success) && (
                    <div className="mb-8 p-6 bg-pandan-muda border-l-4 border-pandan rounded-sm">
                        <h2 className="font-semibold text-arang text-lg mb-1">Pesan terkirim</h2>
                        <p className="text-abu text-sm mb-4">
                            {flash?.success || 'Terima kasih sudah menghubungi kami. Pesan Anda telah diterima dan kami balas secepatnya.'}
                        </p>
                        <Button
                            variant="primary"
                            onClick={handleResetForm}
                        >
                            Kirim pesan lain
                        </Button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Kolom Kiri: Info Toko */}
                    <div>
                        <h2 className="text-xl font-semibold text-arang mb-6">Informasi Toko</h2>
                        <address className="not-italic text-abu space-y-4">
                            <div className="flex items-start">
                                <span className="font-medium text-arang w-28 shrink-0">Alamat</span>
                                <span className="text-abu">: {settings?.alamat || '[CONTOH] Jl. Contoh No. 123, Kota'}</span>
                            </div>
                            <div className="flex items-start">
                                <span className="font-medium text-arang w-28 shrink-0">Jam buka</span>
                                <span className="text-abu">: {settings?.jamBuka || '[CONTOH] Senin - Sabtu, 08:00 - 17:00'}</span>
                            </div>
                            <div className="flex items-start">
                                <span className="font-medium text-arang w-28 shrink-0">WhatsApp</span>
                                <span className="text-abu">
                                    : {settings?.whatsappNumber ? (
                                        <a
                                            href={`https://wa.me/${settings.whatsappNumber}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-pandan hover:text-pandan-gelap underline ml-1"
                                        >
                                            {settings.whatsappNumber} (Tanya lewat WhatsApp)
                                        </a>
                                    ) : (
                                        ' [CONTOH] 6281234567890'
                                    )}
                                </span>
                            </div>
                            <div className="flex items-start">
                                <span className="font-medium text-arang w-28 shrink-0">Email</span>
                                <span className="text-abu">
                                    : {settings?.email ? (
                                        <a
                                            href={`mailto:${settings.email}`}
                                            className="text-pandan hover:text-pandan-gelap underline ml-1"
                                        >
                                            {settings.email}
                                        </a>
                                    ) : (
                                        ' [CONTOH] info@toko.test'
                                    )}
                                </span>
                            </div>
                            <div className="flex items-start">
                                <span className="font-medium text-arang w-28 shrink-0">Instagram</span>
                                <span className="text-abu">
                                    : {settings?.instagram ? (
                                        <a
                                            href={`https://instagram.com/${settings.instagram.replace('@', '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-pandan hover:text-pandan-gelap underline ml-1"
                                        >
                                            {settings.instagram}
                                        </a>
                                    ) : (
                                        ' [CONTOH] @toko_daster'
                                    )}
                                </span>
                            </div>
                            <div className="flex items-start">
                                <span className="font-medium text-arang w-28 shrink-0">Tautan peta</span>
                                <span className="text-abu">
                                    : {settings?.petaUrl && settings.petaUrl !== '#' ? (
                                        <a
                                            href={settings.petaUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-pandan hover:text-pandan-gelap underline ml-1"
                                        >
                                            Lihat peta lokasi
                                        </a>
                                    ) : (
                                        ' [CONTOH] Belum tersedia'
                                    )}
                                </span>
                            </div>
                        </address>
                    </div>

                    {/* Kolom Kanan: Formulir Pesan */}
                    <div>
                        <h2 className="text-xl font-semibold text-arang mb-6">Kirim Pesan</h2>

                        {errors.general && (
                            <div className="mb-6 p-4 bg-cabai-muda border-l-4 border-cabai text-cabai text-sm">
                                {errors.general}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                            {/* Honeypot field (hidden from real users) */}
                            <div className="hidden" aria-hidden="true">
                                <label htmlFor="_hp_field">Jangan diisi jika Anda manusia</label>
                                <input
                                    type="text"
                                    id="_hp_field"
                                    name="_hp_field"
                                    value={data._hp_field}
                                    onChange={e => setData('_hp_field', e.target.value)}
                                    tabIndex={-1}
                                    autoComplete="off"
                                />
                            </div>

                            <div>
                                <label htmlFor="nama" className="block text-sm font-medium text-abu mb-1">
                                    Nama lengkap *
                                </label>
                                <input
                                    id="nama"
                                    type="text"
                                    value={data.nama}
                                    onChange={e => setData('nama', e.target.value)}
                                    aria-describedby="nama-error"
                                    className={`w-full bg-transparent border-0 border-b-2 ${
                                        errors.nama ? 'border-cabai' : 'border-arang'
                                    } text-arang focus:ring-0 focus:border-pandan px-0 py-2 placeholder-abu`}
                                    placeholder="Nama Anda"
                                    required
                                />
                                {errors.nama && (
                                    <p id="nama-error" className="mt-1 text-sm text-cabai">
                                        {errors.nama}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="kontak" className="block text-sm font-medium text-abu mb-1">
                                    Nomor HP atau email *
                                </label>
                                <input
                                    id="kontak"
                                    type="text"
                                    value={data.kontak}
                                    onChange={e => setData('kontak', e.target.value)}
                                    aria-describedby="kontak-error"
                                    className={`w-full bg-transparent border-0 border-b-2 ${
                                        errors.kontak ? 'border-cabai' : 'border-arang'
                                    } text-arang focus:ring-0 focus:border-pandan px-0 py-2 placeholder-abu`}
                                    placeholder="email@contoh.com atau 08123456789"
                                    required
                                />
                                {errors.kontak && (
                                    <p id="kontak-error" className="mt-1 text-sm text-cabai">
                                        {errors.kontak}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="pesan" className="block text-sm font-medium text-abu mb-1">
                                    Pesan *
                                </label>
                                <textarea
                                    id="pesan"
                                    rows="4"
                                    maxLength="1000"
                                    value={data.pesan}
                                    onChange={e => setData('pesan', e.target.value)}
                                    aria-describedby="pesan-error pesan-counter"
                                    className={`w-full bg-transparent border-0 border-b-2 ${
                                        errors.pesan ? 'border-cabai' : 'border-arang'
                                    } text-arang focus:ring-0 focus:border-pandan px-0 py-2 placeholder-abu`}
                                    placeholder="Tuliskan pertanyaan atau pesan Anda di sini..."
                                    required
                                ></textarea>
                                <div className="flex justify-between items-center mt-1">
                                    {errors.pesan ? (
                                        <p id="pesan-error" className="text-sm text-cabai">
                                            {errors.pesan}
                                        </p>
                                    ) : (
                                        <span />
                                    )}
                                    <span id="pesan-counter" className="text-xs text-abu ml-auto">
                                        {data.pesan.length}/1000 karakter
                                    </span>
                                </div>
                            </div>

                            <div>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={processing}
                                    className="w-full"
                                >
                                    {processing ? 'Mengirim...' : 'Kirim pesan'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}