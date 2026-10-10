import React, { useState } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import Button from '../../components/Button';
import Toast from '../../components/Toast';

const SIZES = ['All Size', 'S', 'M', 'L', 'XL', 'Jumbo'];
const STATUSES = ['draf', 'tayang', 'arsip'];

const emptyVariant = () => ({ size: 'All Size', color: '', sku: '', price: '', stock: 0, stock_minimum: 0 });

function formatRupiah(n) {
    if (n === null || n === undefined || n === '') return '-';
    return 'Rp' + Number(n).toLocaleString('id-ID');
}

function statusBadgeClass(status) {
    if (status === 'tayang') return 'bg-pandan-muda text-pandan-gelap';
    if (status === 'draf') return 'bg-kunyit-muda text-arang';
    return 'bg-putih text-abu border border-garis';
}

function statusDotClass(status) {
    if (status === 'tayang') return 'bg-pandan';
    if (status === 'draf') return 'bg-kunyit';
    return 'bg-abu';
}

function slugify(name) {
    return (name || '').toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
}

function variantToPayload(v) {
    const row = {
        size: v.size,
        color: v.color,
        sku: v.sku,
        stock: Number(v.stock) || 0,
        stock_minimum: Number(v.stock_minimum) || 0,
    };
    if (v.price !== '' && v.price !== null && v.price !== undefined) {
        row.price = Number(v.price);
    }
    return row;
}

function productToForm(product) {
    return {
        category_id: product.category_id || '',
        name: product.name || '',
        slug: product.slug || '',
        description: product.description || '',
        material: product.material || '',
        care: product.care || '',
        price: product.price ?? '',
        price_crossed: product.price_crossed ?? '',
        status: product.status || 'draf',
        featured: !!product.featured,
        variants: (product.variants && product.variants.length > 0)
            ? product.variants.map((v) => ({
                size: v.size || 'All Size',
                color: v.color || '',
                sku: v.sku || '',
                price: v.price ?? '',
                stock: v.stock ?? 0,
                stock_minimum: v.stock_minimum ?? 0,
            }))
            : [emptyVariant()],
    };
}

export default function AdminProduk() {
    const { data: paginatedData, categories = [], filters, title, flash } = usePage().props;
    const products = paginatedData?.data ?? [];
    const links = paginatedData?.links ?? [];

    const [search, setSearch] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || '');
    const [categoryFilter, setCategoryFilter] = useState(filters?.category_id || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [deletingProduct, setDeletingProduct] = useState(null);
    const [statusChangingId, setStatusChangingId] = useState(null);
    const [toast, setToast] = useState(
        flash?.success ? { type: 'success', message: flash.success } : null
    );

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm(productToForm({ variants: [] }));

    const hasActiveFilter = search !== '' || statusFilter !== '' || categoryFilter !== '';

    const applyFilters = (overrides = {}) => {
        const params = {
            search,
            status: statusFilter,
            category_id: categoryFilter,
            ...overrides,
        };
        Object.keys(params).forEach((key) => {
            if (params[key] === '' || params[key] === null || params[key] === undefined) {
                delete params[key];
            }
        });
        router.get('/admin/produk', params, { preserveState: true, replace: true });
    };

    const handleResetFilter = () => {
        setSearch('');
        setStatusFilter('');
        setCategoryFilter('');
        router.get('/admin/produk', {}, { replace: true });
    };

    const openCreateModal = () => {
        setEditingProduct(null);
        reset();
        setData(productToForm({ variants: [] }));
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setData(productToForm(product));
        clearErrors();
        setIsModalOpen(true);
    };

    const openDeleteModal = (product) => {
        setDeletingProduct(product);
        setIsDeleteModalOpen(true);
    };

    const buildSubmitPayload = () => ({
        category_id: data.category_id ? Number(data.category_id) : '',
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        material: data.material,
        care: data.care,
        price: data.price === '' ? '' : Number(data.price),
        price_crossed: (data.price_crossed === '' || data.price_crossed === null) ? null : Number(data.price_crossed),
        status: data.status,
        featured: !!data.featured,
        variants: (data.variants || []).map(variantToPayload),
    });

    const handleSave = (e) => {
        e.preventDefault();
        const payload = buildSubmitPayload();
        if (editingProduct) {
            put(`/admin/produk/${editingProduct.id}`, {
                ...payload,
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    setToast({ type: 'success', message: 'Produk disimpan' });
                },
            });
        } else {
            post('/admin/produk', {
                ...payload,
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    setToast({ type: 'success', message: 'Produk disimpan' });
                },
            });
        }
    };

    const handleVariantChange = (index, field, value) => {
        const next = [...(data.variants || [])];
        next[index] = { ...next[index], [field]: value };
        setData('variants', next);
    };

    const handleAddVariant = () => {
        setData('variants', [...(data.variants || []), emptyVariant()]);
    };

    const handleRemoveVariant = (index) => {
        const next = [...(data.variants || [])];
        if (next.length <= 1) return;
        next.splice(index, 1);
        setData('variants', next);
    };

    const handleQuickStatus = (e, product) => {
        const nextStatus = e.target.value;
        if (!nextStatus || nextStatus === product.status) return;
        setStatusChangingId(product.id);
        const payload = {
            category_id: product.category_id,
            name: product.name,
            slug: product.slug,
            description: product.description ?? null,
            material: product.material,
            care: product.care,
            price: product.price,
            price_crossed: product.price_crossed ?? null,
            status: nextStatus,
            featured: !!product.featured,
            variants: (product.variants || []).map(variantToPayload),
        };
        router.put(`/admin/produk/${product.id}`, payload, {
            preserveScroll: true,
            onSuccess: () => setToast({ type: 'success', message: 'Produk disimpan' }),
            onError: () => setToast({ type: 'error', message: 'Gagal mengubah status produk.' }),
            onFinish: () => setStatusChangingId(null),
        });
    };

    const handleDelete = () => {
        if (!deletingProduct) return;
        destroy(`/admin/produk/${deletingProduct.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setDeletingProduct(null);
                setToast({ type: 'success', message: 'Produk berhasil dihapus.' });
            },
            onError: () => {
                setIsDeleteModalOpen(false);
                setToast({ type: 'error', message: 'Gagal menghapus produk.' });
            },
        });
    };

    const categoryName = (product) =>
        product.category?.name || categories.find((c) => c.id === product.category_id)?.name || '-';

    const productPhoto = (product) =>
        product.images?.[0]?.path || null;

    return (
        <AdminLayout>
            <Head title={title || 'Manajemen Produk'} />

            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h1 className="text-3xl font-bold text-arang">Produk</h1>
                    <Button onClick={openCreateModal} variant="primary">
                        Tambah Produk +
                    </Button>
                </div>

                {/* Filter */}
                <form
                    onSubmit={(e) => { e.preventDefault(); applyFilters(); }}
                    className="bg-putih border border-garis p-4 rounded-sm mb-6 flex flex-col lg:flex-row gap-3 lg:items-end"
                >
                    <div className="flex-1 min-w-[180px]">
                        <label htmlFor="produk-cari" className="block text-sm font-medium text-abu mb-1">Cari</label>
                        <input
                            id="produk-cari"
                            type="text"
                            placeholder="Cari nama produk..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full h-[44px] px-3 border border-garis rounded-sm text-sm focus:ring-2 focus:ring-pandan focus:outline-none"
                        />
                    </div>
                    <div className="w-full lg:w-52">
                        <label htmlFor="produk-kategori" className="block text-sm font-medium text-abu mb-1">Kategori</label>
                        <select
                            id="produk-kategori"
                            value={categoryFilter}
                            onChange={(e) => { setCategoryFilter(e.target.value); applyFilters({ category_id: e.target.value }); }}
                            className="w-full h-[44px] px-3 border border-garis rounded-sm text-sm focus:ring-2 focus:ring-pandan focus:outline-none bg-putih"
                        >
                            <option value="">Semua kategori</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="w-full lg:w-44">
                        <label htmlFor="produk-status" className="block text-sm font-medium text-abu mb-1">Status</label>
                        <select
                            id="produk-status"
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value); applyFilters({ status: e.target.value }); }}
                            className="w-full h-[44px] px-3 border border-garis rounded-sm text-sm focus:ring-2 focus:ring-pandan focus:outline-none bg-putih"
                        >
                            <option value="">Semua status</option>
                            <option value="tayang">Tayang</option>
                            <option value="draf">Draf</option>
                            <option value="arsip">Arsip</option>
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <Button type="submit" variant="secondary" className="px-4 py-2 text-sm h-[44px]">
                            Cari
                        </Button>
                        {hasActiveFilter && (
                            <Button type="button" variant="secondary" onClick={handleResetFilter} className="px-4 py-2 text-sm h-[44px]">
                                Atur ulang
                            </Button>
                        )}
                    </div>
                </form>

                {/* Tabel */}
                <div className="bg-putih border border-garis rounded-sm overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[760px]">
                        <thead>
                            <tr className="bg-pasir text-abu text-[13px] font-semibold border-b border-garis">
                                <th className="py-3 px-4 w-14">Foto</th>
                                <th className="py-3 px-4">Nama</th>
                                <th className="py-3 px-4">Kategori</th>
                                <th className="py-3 px-4 text-right">Harga</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-arang">
                            {products.length > 0 ? (
                                products.map((product) => {
                                    const photo = productPhoto(product);
                                    return (
                                        <tr key={product.id} className="hover:bg-kapas transition-colors h-[48px] border-b border-garis last:border-b-0">
                                            <td className="py-2 px-4">
                                                {photo ? (
                                                    <img
                                                        src={photo}
                                                        alt={product.name}
                                                        className="w-10 h-12 object-cover rounded-sm"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-12 bg-pasir rounded-sm flex items-center justify-center text-[10px] text-abu text-center leading-tight px-1">
                                                        [CONTOH] Foto belum tersedia
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="font-medium">{product.name}</span>
                                                <span className="block text-xs text-abu font-mono">{product.slug}</span>
                                            </td>
                                            <td className="py-3 px-4 text-abu">{categoryName(product)}</td>
                                            <td className="py-3 px-4 text-right font-semibold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                                {formatRupiah(product.price)}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 h-6 rounded-full text-[13px] font-semibold ${statusBadgeClass(product.status)}`}>
                                                    <span className={`w-2 h-2 rounded-full ${statusDotClass(product.status)}`} aria-hidden="true" />
                                                    {product.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <select
                                                        value={product.status}
                                                        onChange={(e) => handleQuickStatus(e, product)}
                                                        disabled={statusChangingId === product.id}
                                                        aria-label={`Ubah status ${product.name}`}
                                                        title="Ubah status"
                                                        className="h-9 px-2 border border-garis rounded-sm text-xs bg-putih focus:ring-2 focus:ring-pandan focus:outline-none disabled:opacity-50"
                                                    >
                                                        {STATUSES.map((s) => (
                                                            <option key={s} value={s}>{s}</option>
                                                        ))}
                                                    </select>
                                                    <button
                                                        onClick={() => openEditModal(product)}
                                                        className="text-pandan hover:underline text-xs font-semibold px-1 py-2"
                                                        title="Edit produk"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(product)}
                                                        className="text-cabai hover:underline text-xs font-semibold px-1 py-2"
                                                        title="Hapus produk"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center text-abu">
                                        Belum ada produk.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {links.length > 3 && (
                    <div className="flex justify-center mt-6">
                        <nav className="flex space-x-1" aria-label="Navigasi halaman">
                            {links.map((link, idx) => (
                                link.url ? (
                                    <a
                                        key={idx}
                                        href={link.url}
                                        className={`px-3 py-1 border text-sm rounded-sm ${link.active ? 'bg-pandan text-putih border-pandan' : 'bg-putih text-arang border-garis hover:bg-pasir'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 border text-sm rounded-sm opacity-50 cursor-not-allowed bg-putih text-abu border-garis"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )
                            ))}
                        </nav>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center bg-arang/50 p-4 overflow-y-auto">
                    <div className="bg-putih border border-garis rounded-sm w-full max-w-3xl p-6 my-8">
                        <h2 className="text-xl font-bold text-arang mb-4">
                            {editingProduct ? 'Edit Produk' : 'Tambah Produk'}
                        </h2>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="produk-nama" className="block text-sm font-medium text-abu mb-1">Nama Produk</label>
                                    <input
                                        id="produk-nama"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData({ ...data, name: e.target.value, slug: slugify(e.target.value) })}
                                        className="w-full h-[44px] px-3 border border-garis rounded-sm text-sm focus:ring-2 focus:ring-pandan focus:outline-none"
                                        placeholder="Contoh: Daster Batik Cap"
                                    />
                                    {errors.name && <p className="text-cabai text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <label htmlFor="produk-slug" className="block text-sm font-medium text-abu mb-1">Slug</label>
                                    <input
                                        id="produk-slug"
                                        type="text"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        className="w-full h-[44px] px-3 border border-garis rounded-sm text-sm focus:ring-2 focus:ring-pandan focus:outline-none font-mono text-xs"
                                        placeholder="daster-batik-cap"
                                    />
                                    {errors.slug && <p className="text-cabai text-xs mt-1">{errors.slug}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="produk-kategori-form" className="block text-sm font-medium text-abu mb-1">Kategori</label>
                                    <select
                                        id="produk-kategori-form"
                                        value={data.category_id}
                                        onChange={(e) => setData('category_id', e.target.value)}
                                        className="w-full h-[44px] px-3 border border-garis rounded-sm text-sm focus:ring-2 focus:ring-pandan focus:outline-none bg-putih"
                                    >
                                        <option value="">-- Pilih kategori --</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {errors.category_id && <p className="text-cabai text-xs mt-1">{errors.category_id}</p>}
                                </div>
                                <div>
                                    <label htmlFor="produk-status-form" className="block text-sm font-medium text-abu mb-1">Status</label>
                                    <select
                                        id="produk-status-form"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full h-[44px] px-3 border border-garis rounded-sm text-sm focus:ring-2 focus:ring-pandan focus:outline-none bg-putih"
                                    >
                                        {STATUSES.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                    {errors.status && <p className="text-cabai text-xs mt-1">{errors.status}</p>}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="produk-deskripsi" className="block text-sm font-medium text-abu mb-1">Deskripsi</label>
                                <textarea
                                    id="produk-deskripsi"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-garis rounded-sm text-sm focus:ring-2 focus:ring-pandan focus:outline-none"
                                    placeholder="Deskripsi produk..."
                                />
                                {errors.description && <p className="text-cabai text-xs mt-1">{errors.description}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="produk-bahan" className="block text-sm font-medium text-abu mb-1">Bahan</label>
                                    <input
                                        id="produk-bahan"
                                        type="text"
                                        value={data.material}
                                        onChange={(e) => setData('material', e.target.value)}
                                        className="w-full h-[44px] px-3 border border-garis rounded-sm text-sm focus:ring-2 focus:ring-pandan focus:outline-none"
                                        placeholder="Contoh: Katun rayon"
                                    />
                                    {errors.material && <p className="text-cabai text-xs mt-1">{errors.material}</p>}
                                </div>
                                <div>
                                    <label htmlFor="produk-perawatan" className="block text-sm font-medium text-abu mb-1">Perawatan</label>
                                    <input
                                        id="produk-perawatan"
                                        type="text"
                                        value={data.care}
                                        onChange={(e) => setData('care', e.target.value)}
                                        className="w-full h-[44px] px-3 border border-garis rounded-sm text-sm focus:ring-2 focus:ring-pandan focus:outline-none"
                                        placeholder="Contoh: Cuci dengan tangan"
                                    />
                                    {errors.care && <p className="text-cabai text-xs mt-1">{errors.care}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="produk-harga" className="block text-sm font-medium text-abu mb-1">Harga (Rp)</label>
                                    <input
                                        id="produk-harga"
                                        type="number"
                                        min="0"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        className="w-full h-[44px] px-3 border border-garis rounded-sm text-sm focus:ring-2 focus:ring-pandan focus:outline-none"
                                        placeholder="89000"
                                    />
                                    {errors.price && <p className="text-cabai text-xs mt-1">{errors.price}</p>}
                                </div>
                                <div>
                                    <label htmlFor="produk-harga-coret" className="block text-sm font-medium text-abu mb-1">Harga Coret (Rp, opsional)</label>
                                    <input
                                        id="produk-harga-coret"
                                        type="number"
                                        min="0"
                                        value={data.price_crossed ?? ''}
                                        onChange={(e) => setData('price_crossed', e.target.value)}
                                        className="w-full h-[44px] px-3 border border-garis rounded-sm text-sm focus:ring-2 focus:ring-pandan focus:outline-none"
                                        placeholder="129000"
                                    />
                                    {errors.price_crossed && <p className="text-cabai text-xs mt-1">{errors.price_crossed}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 cursor-pointer text-sm text-arang">
                                    <input
                                        type="checkbox"
                                        checked={!!data.featured}
                                        onChange={(e) => setData('featured', e.target.checked)}
                                        className="h-4 w-4 text-pandan border-garis focus:ring-pandan"
                                    />
                                    Produk unggulan (tampil di landing)
                                </label>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-semibold text-arang">Varian</h3>
                                    <button
                                        type="button"
                                        onClick={handleAddVariant}
                                        className="text-pandan hover:underline text-xs font-semibold"
                                    >
                                        + Tambah varian
                                    </button>
                                </div>
                                {errors.variants && typeof errors.variants === 'string' && (
                                    <p className="text-cabai text-xs mb-2">{errors.variants}</p>
                                )}
                                <div className="border border-garis rounded-sm overflow-x-auto">
                                    <table className="w-full text-left min-w-[640px]">
                                        <thead>
                                            <tr className="bg-pasir text-abu text-xs font-semibold border-b border-garis">
                                                <th className="py-2 px-2">Ukuran</th>
                                                <th className="py-2 px-2">Warna</th>
                                                <th className="py-2 px-2">SKU</th>
                                                <th className="py-2 px-2">Harga</th>
                                                <th className="py-2 px-2">Stok</th>
                                                <th className="py-2 px-2">Min</th>
                                                <th className="py-2 px-2" />
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {(data.variants || []).map((v, idx) => (
                                                <tr key={idx} className="border-b border-garis last:border-b-0 align-top">
                                                    <td className="py-2 px-2">
                                                        <select
                                                            value={v.size}
                                                            onChange={(e) => handleVariantChange(idx, 'size', e.target.value)}
                                                            className="h-9 px-1 border border-garis rounded-sm text-xs bg-putih focus:ring-2 focus:ring-pandan focus:outline-none"
                                                            aria-label={`Ukuran varian ${idx + 1}`}
                                                        >
                                                            {SIZES.map((s) => (
                                                                <option key={s} value={s}>{s}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td className="py-2 px-2">
                                                        <input
                                                            type="text"
                                                            value={v.color}
                                                            onChange={(e) => handleVariantChange(idx, 'color', e.target.value)}
                                                            className="h-9 w-24 px-2 border border-garis rounded-sm text-xs focus:ring-2 focus:ring-pandan focus:outline-none"
                                                            placeholder="Merah"
                                                            aria-label={`Warna varian ${idx + 1}`}
                                                        />
                                                    </td>
                                                    <td className="py-2 px-2">
                                                        <input
                                                            type="text"
                                                            value={v.sku}
                                                            onChange={(e) => handleVariantChange(idx, 'sku', e.target.value)}
                                                            className="h-9 w-28 px-2 border border-garis rounded-sm text-xs focus:ring-2 focus:ring-pandan focus:outline-none font-mono"
                                                            placeholder="SKU-001"
                                                            aria-label={`SKU varian ${idx + 1}`}
                                                        />
                                                    </td>
                                                    <td className="py-2 px-2">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={v.price}
                                                            onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}
                                                            className="h-9 w-24 px-2 border border-garis rounded-sm text-xs focus:ring-2 focus:ring-pandan focus:outline-none"
                                                            placeholder="Ikut produk"
                                                            aria-label={`Harga varian ${idx + 1}`}
                                                        />
                                                    </td>
                                                    <td className="py-2 px-2">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={v.stock}
                                                            onChange={(e) => handleVariantChange(idx, 'stock', e.target.value)}
                                                            className="h-9 w-16 px-2 border border-garis rounded-sm text-xs focus:ring-2 focus:ring-pandan focus:outline-none"
                                                            aria-label={`Stok varian ${idx + 1}`}
                                                        />
                                                    </td>
                                                    <td className="py-2 px-2">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={v.stock_minimum}
                                                            onChange={(e) => handleVariantChange(idx, 'stock_minimum', e.target.value)}
                                                            className="h-9 w-16 px-2 border border-garis rounded-sm text-xs focus:ring-2 focus:ring-pandan focus:outline-none"
                                                            aria-label={`Stok minimum varian ${idx + 1}`}
                                                        />
                                                    </td>
                                                    <td className="py-2 px-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveVariant(idx)}
                                                            disabled={(data.variants || []).length <= 1}
                                                            className="text-cabai hover:underline text-xs font-semibold px-1 disabled:opacity-40"
                                                            aria-label={`Hapus varian ${idx + 1}`}
                                                        >
                                                            Hapus
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {Object.keys(errors)
                                    .filter((k) => k.startsWith('variants.'))
                                    .map((k) => (
                                        <p key={k} className="text-cabai text-xs mt-1">{errors[k]}</p>
                                    ))}
                            </div>

                            <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-putih pb-1">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={processing}
                                    className="px-4 py-2 text-sm"
                                >
                                    {editingProduct ? 'Simpan Perubahan' : 'Simpan'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && deletingProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-arang/50 p-4">
                    <div className="bg-putih border border-garis rounded-sm w-full max-w-sm p-6 text-center">
                        <h2 className="text-lg font-bold text-arang mb-2">Hapus produk ini?</h2>
                        <p className="text-sm text-abu mb-6">
                            Produk <span className="font-semibold text-arang">"{deletingProduct.name}"</span> akan dihapus. Riwayat pesanan tidak ikut terhapus.
                        </p>
                        <div className="flex justify-center gap-3">
                            <Button
                                variant="secondary"
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 text-sm"
                            >
                                Batal
                            </Button>
                            <Button
                                variant="danger"
                                onClick={handleDelete}
                                disabled={processing}
                                className="px-4 py-2 text-sm"
                            >
                                Hapus
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
