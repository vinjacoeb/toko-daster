import React from 'react';

export default function CardProduct({ product }) {
    if (!product) return null;

    const { nama, harga, harga_coret, slug, status, varian_tersedia } = product;
    const imageUrl = product['gambar utama'] || null;
    const isHabis = status === 'habis';
    const isBaru = status === 'baru';

    return (
        <div className="group relative bg-putih rounded-sm overflow-hidden border border-garis hover:shadow-md transition-shadow">
            {/* Badge */}
            {(isHabis || isBaru) && (
                <div className={`absolute top-2 left-2 z-10 px-2 py-1 text-xs font-medium rounded ${isHabis ? 'bg-cabai text-putih' : 'bg-kunyit text-arang'}`}>                {isHabis ? 'Habis' : 'Baru'}</div>
            )}

            {/* Foto produk (rasio 4:5) */}
            <div className="relative aspect-[4/5] bg-pasir mb-3">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={nama}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-abu text-sm">[CONTOH] Foto belum tersedia</span>
                    </div>
                )}
                {/* Tombol WhatsApp hover */}
                <div className="absolute inset-0 bg-arang/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <a
                        href={`https://wa.me/6281234567890?text=Hi, I’d like to ask about ${encodeURIComponent(nama)} (size=X, color=Y). Can you tell me availability?%0Ahttps://example.com/product/${slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-pandan text-putih px-3 py-2 rounded-sm text-sm font-medium hover:bg-pandan-gelap"
                    >
                        Tanya lewat WhatsApp
                    </a>
                </div>
            </div>

            {/* Nama produk */}
            <div className="px-3 pb-2">
                <h3 className="font-hanken-grotesk text-base font-semibold text-arang line-clamp-2 leading-tight mb-1">
                    {nama}
                </h3>
                {/* Harga */}
                <div className="flex items-center gap-2">
                    <span className="font-hanken-grotesk text-base font-semibold text-arang">Rp{harga.toLocaleString('id-ID')}</span>
                    {harga_coret && (
                        <span className="font-hanken-grotesk text-sm text-cabai line-through">Rp{harga_coret.toLocaleString('id-ID')}</span>
                    )}
                </div>
                {/* Varian ukuran tersedia */}
                {varian_tersedia && varian_tersedia.length > 0 && (
                    <div className="mt-2 text-xs text-abu font-normal">
                        Ukuran tersedia: {varian_tersedia.join(', ')}
                    </div>
                )}
                {isHabis && (
                    <div className="mt-2 text-xs text-cabai font-normal">Habis</div>
                )}
            </div>
        </div>
    );
}