import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import GuestLayout from '../Layouts/GuestLayout';
import CardProduct from '../components/CardProduct';
import Button from '../components/Button';
import GarisJahitan from '../components/GarisJahitan';

export default function Landing() {
    const { props } = usePage();
    const [settings, setSettings] = useState(props.settings || {});
    const [featuredProducts, setFeaturedProducts] = useState(props.featuredProducts || []);
    const [fallbackProducts, setFallbackProducts] = useState(props.fallbackProducts || []);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setSettings(props.settings || {});
        setFeaturedProducts(props.featuredProducts || []);
        setFallbackProducts(props.fallbackProducts || []);
        setError(null);
        setIsLoading(false);
    }, [props]);

    const heroTitle = settings.hero_title || '[CONTOH] Daster yang enak dipakai seharian.';
    const heroSubtitle = settings.hero_subtitle || '[CONTOH] Temukan daster yang nyaman untuk ke kantor, pesta, atau santai.';
    const whatsappNumber = settings.whatsapp_number || '';
    const heroWhatsAppUrl = whatsappNumber
        ? `https://wa.me/${whatsappNumber}?text=Hi, saya ingin tahu lebih lanjut tentang produk Anda.`
        : '';

    const allProducts = featuredProducts.length > 0 ? featuredProducts : fallbackProducts;
    const hasProducts = allProducts.length > 0;

    const ownerClaims = settings.why_daster || [
        '[CONTOH] Bahan katun yang lembut dan adem.',
        '[CONTOH] Potongan yang pas dan tidak gerah.',
        '[CONTOH] Jahitan rapi di setiap bagian.'
    ];

    const formattedPrice = (price) => {
        if (!price) return '';
        return `Rp${price.toLocaleString('id-ID')}`;
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'habis':
                return 'bg-cabai text-putih';
            case 'baru':
                return 'bg-kunyit text-arang';
            default:
                return '';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'habis':
                return 'Habis';
            case 'baru':
                return 'Baru';
            default:
                return '';
        }
    };

    const renderHero = () => (
        <section className="relative grid grid-cols-1 md:grid-cols-5 gap-8 mb-8 md:mb-12">
            <div className="md:col-span-2 order-2 md:order-1">
                <h1 className="font-young-serif text-arang text-[40px] leading-tight mb-4">
                    {heroTitle}
                </h1>
                <p className="text-abu text-base leading-relaxed mb-6">
                    {heroSubtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                        variant="primary"
                        onClick={() => window.location.href = '/product'}
                        className="w-full sm:w-auto"
                        aria-label="Lihat produk"
                    >
                        Lihat produk
                    </Button>
                    {whatsappNumber && heroWhatsAppUrl && (
                        <a
                            href={heroWhatsAppUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-4 py-2 border border-garis text-sm font-medium rounded-sm text-arang bg-putih hover:bg-pasir focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pandan w-full sm:w-auto"
                            aria-label="Chat via WhatsApp"
                        >
                            Tanya lewat WhatsApp
                        </a>
                    )}
                </div>
            </div>
            <div className="md:col-span-3 order-1 md:order-2 relative aspect-[4/5] bg-pasir rounded-sm overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                    <span className="text-abu text-sm">[CONTOH] Foto produk belum tersedia</span>
                </div>
            </div>
        </section>
    );

    const renderFeaturedProducts = () => {
        if (isLoading) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-putih rounded-sm overflow-hidden border border-garis">
                            <div className="aspect-[4/5] bg-pasir animate-pulse" />
                            <div className="p-4 space-y-3">
                                <div className="h-4 bg-pasir rounded animate-pulse" />
                                <div className="h-4 w-2/3 bg-pasir rounded animate-pulse" />
                                <div className="h-4 w-1/2 bg-pasir rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center py-12">
                    <h3 className="font-young-serif text-arang text-xl mb-2">Gagal memuat daster unggulan</h3>
                    <p className="text-abu mb-6">Produk belum bisa dimuat. Coba lagi.</p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-sm text-putih bg-pandan hover:bg-pandan-gelap focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pandan"
                        >
                            Coba lagi
                        </button>
                        <button
                            onClick={() => window.location.href = '/product'}
                            className="inline-flex items-center px-4 py-2 border border-garis text-sm font-medium rounded-sm text-arang bg-putih hover:bg-pasir focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pandan"
                        >
                            Lihat Semua
                        </button>
                    </div>
                </div>
            );
        }

        if (!hasProducts) {
            return (
                <div className="text-center py-12">
                    <h3 className="font-young-serif text-arang text-xl mb-2">Belum ada daster yang ditampilkan</h3>
                    <p className="text-abu mb-6">Semua produk daster baru saja diluncurkan. Silakan kunjungi kembali nanti.</p>
                    <button
                        onClick={() => window.location.href = '/product'}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-sm text-putih bg-pandan hover:bg-pandan-gelap focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pandan"
                    >
                        Jelajahi Katalog
                    </button>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {allProducts.map(product => (
                    <CardProduct
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>
        );
    };

    const renderAdvantages = () => (
        <section className="mb-8 md:mb-16">
            <h2 className="font-young-serif text-arang text-3xl mb-6 md:mb-8">Kenapa daster ini</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {ownerClaims.map((claim, index) => (
                    <div key={index} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-pandan-muda rounded-sm flex items-center justify-center text-arang font-bold">
                            {index + 1}
                        </div>
                        <p className="text-arang text-base leading-relaxed pt-1">
                            {claim}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );

    const renderHowToOrder = () => (
        <section className="mb-8 md:mb-16">
            <h2 className="font-young-serif text-arang text-3xl mb-6 md:mb-8">Cara pesan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                <div className="text-center">
                    <div className="w-12 h-12 bg-pasir rounded-sm flex items-center justify-center text-arang font-bold text-xl mb-4">1</div>
                    <p className="text-arang">Pilih daster</p>
                    <p className="text-abu text-sm mt-1">dari `/product` atau `/product/&#123;slug&#125;`</p>
                </div>
                <div className="text-center">
                    <div className="w-12 h-12 bg-pasir rounded-sm flex items-center justify-center text-arang font-bold text-xl mb-4">2</div>
                    <p className="text-arang">Kirim lewat WhatsApp</p>
                    <p className="text-abu text-sm mt-1">gunakan nomor WhatsApp dari pengaturan</p>
                </div>
                <div className="text-center">
                    <div className="w-12 h-12 bg-pasir rounded-sm flex items-center justify-center text-arang font-bold text-xl mb-4">3</div>
                    <p className="text-arang">Konfirmasi dan kirim</p>
                    <p className="text-abu text-sm mt-1">konfirmasi admin dan kirim barang</p>
                </div>
            </div>
        </section>
    );

    const renderCallToAction = () => (
        <section className="bg-arang text-kapas rounded-sm p-8 md:p-12 mb-8 md:mb-16">
            <h2 className="font-young-serif text-kapas text-2xl md:text-3xl mb-4">
                Mulai koleksi daster Anda hari ini
            </h2>
            {whatsappNumber && heroWhatsAppUrl ? (
                <a
                    href={heroWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-sm text-putih bg-pandan hover:bg-pandan-gelap focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pandan"
                    aria-label="Chat via WhatsApp"
                >
                    Tanya lewat WhatsApp
                </a>
            ) : (
                <button
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-sm text-putih bg-pasir cursor-not-allowed"
                    disabled
                    aria-label="WhatsApp tidak tersedia"
                >
                    Tanya lewat WhatsApp
                </button>
            )}
        </section>
    );

    return (
        <GuestLayout>
            <Head title="Daster – Toko Daster" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {renderHero()}
                <GarisJahitan />
                <h2 className="font-young-serif text-arang text-3xl mb-8">Daster pilihan</h2>
                {renderFeaturedProducts()}
                <GarisJahitan />
                {renderAdvantages()}
                <GarisJahitan />
                {renderHowToOrder()}
                {renderCallToAction()}
            </div>
        </GuestLayout>
    );
}
