import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import GuestLayout from '../Layouts/GuestLayout';

export default function DetailProduk() {
    const { product, settings } = usePage().props;
    
    // Varian dari produk
    const variants = product?.variants || [];
    
    // Unique colors and sizes from variants
    const colors = [...new Set(variants.map(v => v.color))];
    const sizes = [...new Set(variants.map(v => v.size))];

    const [selectedColor, setSelectedColor] = useState(colors[0] || '');
    const [selectedSize, setSelectedSize] = useState(sizes[0] || '');
    const [activeImage, setActiveImage] = useState(0);

    // Cari varian yang cocok dengan warna dan ukuran yang dipilih
    const currentVariant = variants.find(v => v.color === selectedColor && v.size === selectedSize) || variants[0];
    
    const stock = currentVariant ? currentVariant.stock : (product?.stock || 0);
    const stockMinimum = currentVariant ? currentVariant.stock_minimum : 3;
    const isOutOfStock = stock <= 0;
    const isLowStock = stock > 0 && stock <= stockMinimum;

    const price = currentVariant?.price || product?.price || 0;
    const priceCrossed = product?.price_crossed || null;

    const whatsappNumber = settings?.whatsapp_number || settings?.whatsappNumber || '6281234567890';
    const productName = product?.name || 'Produk Daster';
    const categoryName = product?.category?.name || 'Daster';
    const slug = product?.slug || '';
    const images = product?.images && product.images.length > 0 ? product.images : [];

    const productUrl = typeof window !== 'undefined' ? window.location.href : `https://tokodaster.local/product/${slug}`;

    const whatsappMessage = encodeURIComponent(
        `Halo Kak, saya ingin pesan ${productName} (${selectedColor ? `Warna: ${selectedColor}, ` : ''}${selectedSize ? `Ukuran: ${selectedSize}` : ''}). Apakah stoknya tersedia?\n\n${productUrl}`
    );

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    return (
        <GuestLayout>
            <Head title={productName} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                {/* Breadcrumb */}
                <nav className="text-sm text-abu mb-6">
                    <a href="/" className="hover:text-pandan">Beranda</a>
                    {' / '}
                    <a href="/product" className="hover:text-pandan">Produk</a>
                    {' / '}
                    <span className="text-arang">{productName}</span>
                </nav>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Kolom Kiri: Galeri Foto */}
                    <div>
                        <div className="aspect-[4/5] bg-pasir rounded-sm overflow-hidden mb-4 relative">
                            {images.length > 0 ? (
                                <img
                                    src={`/storage/${images[activeImage]?.image_path || images[activeImage]}`}
                                    alt={productName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                                    <span className="text-abu text-sm mb-2">[CONTOH] Foto belum tersedia</span>
                                    <div className="w-12 border-b-2 border-dashed border-garis mt-4"></div>
                                </div>
                            )}
                        </div>

                        {images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`w-20 aspect-[4/5] bg-pasir rounded-sm overflow-hidden border-2 ${activeImage === idx ? 'border-pandan' : 'border-transparent'}`}
                                    >
                                        <img
                                            src={`/storage/${img.image_path || img}`}
                                            alt={`${productName} ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Kolom Kanan: Detail & Aksi */}
                    <div>
                        <p className="text-sm text-abu mb-2">Kategori: {categoryName}</p>
                        <h1 className="font-young-serif text-arang text-3xl md:text-4xl mb-4">{productName}</h1>

                        {/* Etiket Harga */}
                        <div className="border border-dashed border-garis bg-putih p-4 rounded-sm relative mb-6">
                            <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-garis"></div>
                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-garis"></div>
                            <div className="flex items-baseline gap-3">
                                <span className="font-hanken-grotesk text-2xl font-bold text-arang">Rp{Number(price).toLocaleString('id-ID')}</span>
                                {priceCrossed && (
                                    <span className="font-hanken-grotesk text-base text-cabai line-through">Rp{Number(priceCrossed).toLocaleString('id-ID')}</span>
                                )}
                            </div>
                        </div>

                        {/* Pilihan Warna (Swatch) */}
                        {colors.length > 0 && (
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-arang mb-2">Warna: <span className="text-abu font-normal">{selectedColor}</span></label>
                                <div className="flex gap-3 flex-wrap">
                                    {colors.map((color) => {
                                        const isSelected = selectedColor === color;
                                        return (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className={`px-4 h-11 rounded-sm border flex items-center justify-center text-sm font-medium transition-all ${
                                                    isSelected
                                                        ? 'border-2 border-pandan bg-pandan-muda text-pandan-gelap'
                                                        : 'border-garis bg-putih text-arang hover:border-pandan'
                                                }`}
                                            >
                                                {color}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Pilihan Ukuran (Chip) */}
                        {sizes.length > 0 && (
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-arang">Ukuran: <span className="text-abu font-normal">{selectedSize}</span></label>
                                </div>
                                <div className="flex gap-3 flex-wrap">
                                    {sizes.map((size) => {
                                        // Cek apakah kombinasi warna + ukuran ini ada dan stok > 0
                                        const variantForSize = variants.find(v => (!selectedColor || v.color === selectedColor) && v.size === size);
                                        const sizeHabis = !variantForSize || variantForSize.stock <= 0;
                                        const isSelected = selectedSize === size;

                                        return (
                                            <button
                                                key={size}
                                                onClick={() => !sizeHabis && setSelectedSize(size)}
                                                disabled={sizeHabis}
                                                className={`w-11 h-11 rounded-sm border flex items-center justify-center text-sm font-medium relative transition-all ${
                                                    isSelected
                                                        ? 'bg-pandan text-putih border-pandan'
                                                        : sizeHabis
                                                        ? 'bg-pasir text-abu border-garis cursor-not-allowed line-through'
                                                        : 'bg-putih text-arang border-garis hover:border-pandan'
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Indikator Stok */}
                        <div className="mb-6">
                            {isOutOfStock ? (
                                <span className="inline-block px-3 py-1 bg-cabai-muda text-cabai text-xs font-medium rounded-full">
                                    Stok habis
                                </span>
                            ) : isLowStock ? (
                                <span className="inline-block px-3 py-1 bg-kunyit-muda text-arang text-xs font-medium rounded-full">
                                    Sisa {stock} (Stok menipis)
                                </span>
                            ) : (
                                <span className="inline-block px-3 py-1 bg-pandan-muda text-pandan text-xs font-medium rounded-full">
                                    Stok tersedia ({stock})
                                </span>
                            )}
                        </div>

                        {/* Tombol WhatsApp */}
                        <div className="mb-8">
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`w-full flex justify-center items-center h-[44px] rounded-sm font-semibold transition-colors ${
                                    isOutOfStock 
                                        ? 'bg-pasir text-abu border border-garis pointer-events-none' 
                                        : 'bg-pandan text-putih hover:bg-pandan-gelap'
                                }`}
                            >
                                {isOutOfStock ? 'Stok habis' : 'Pesan via WhatsApp'}
                            </a>
                        </div>

                        {/* Bagian Lipat (Accordion / Informasi) */}
                        <div className="border-t border-garis pt-6 space-y-4">
                            <div>
                                <h3 className="font-young-serif text-lg text-arang mb-2">Deskripsi produk</h3>
                                <p className="text-sm text-abu leading-relaxed">
                                    {product?.description || 'Daster nyaman dengan bahan pilihan yang adem dan menyerap keringat. Cocok untuk dipakai sehari-hari di rumah.'}
                                </p>
                            </div>
                            
                            {product?.material && (
                                <div className="border-t border-garis pt-4">
                                    <h3 className="font-young-serif text-lg text-arang mb-2">Bahan</h3>
                                    <p className="text-sm text-abu leading-relaxed">
                                        {product.material}
                                    </p>
                                </div>
                            )}

                            {product?.care_instructions && (
                                <div className="border-t border-garis pt-4">
                                    <h3 className="font-young-serif text-lg text-arang mb-2">Perawatan</h3>
                                    <p className="text-sm text-abu leading-relaxed">
                                        {product.care_instructions}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}