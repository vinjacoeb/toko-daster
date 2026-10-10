import React, { useState } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Button from '../../../components/Button';
import Toast from '../../../components/Toast';

export default function AdminKategori() {
    const { data: paginatedData, filters, title, flash } = usePage().props;
    const categories = paginatedData?.data ?? [];
    const links = paginatedData?.links ?? [];

    const [search, setSearch] = useState(filters?.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [deletingCategory, setDeletingCategory] = useState(null);
    const [toastMessage, setToastMessage] = useState(flash?.success || '');

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        slug: '',
        parent_id: '',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/kategori', { search }, { preserveState: true, replace: true });
    };

    const openCreateModal = () => {
        setEditingCategory(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (cat) => {
        setEditingCategory(cat);
        setData({
            name: cat.name,
            slug: cat.slug,
            parent_id: cat.parent_id || '',
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const openDeleteModal = (cat) => {
        setDeletingCategory(cat);
        setIsDeleteModalOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (editingCategory) {
            put(`/admin/kategori/${editingCategory.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    setToastMessage('Kategori berhasil diperbarui.');
                }
            });
        } else {
            post('/admin/kategori', {
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                    setToastMessage('Kategori berhasil dibuat.');
                }
            });
        }
    };

    const handleDelete = () => {
        if (!deletingCategory) return;
        destroy(`/admin/kategori/${deletingCategory.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setDeletingCategory(null);
                setToastMessage('Kategori berhasil dihapus.');
            },
            onError: () => {
                setIsDeleteModalOpen(false);
                setToastMessage('Gagal menghapus kategori. Kategori mungkin masih memiliki produk atau subkategori.');
            }
        });
    };

    const generateSlugFromName = (name) => {
        return name.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');
    };

    return (
        <AdminLayout>
            <Head title={title || 'Manajemen Kategori'} />

            {toastMessage && (
                <Toast
                    type="success"
                    message={toastMessage}
                    onClose={() => setToastMessage('')}
                />
            )}

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h1 className="text-3xl font-bold text-arang">Kelola Kategori</h1>
                    <Button onClick={openCreateModal} variant="primary">
                        Tambah Kategori +
                    </Button>
                </div>

                <div className="bg-putih border border-garis p-4 rounded-sm mb-6">
                    <form onSubmit={handleSearch} className="flex w-full sm:w-80 gap-2">
                        <input
                            type="text"
                            placeholder="Cari kategori..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full px-3 py-2 border border-garis rounded-sm text-sm focus:ring-2 focus:ring-pandan focus:outline-none"
                        />
                        <Button type="submit" variant="secondary" className="px-4 py-2 text-sm">
                            Cari
                        </Button>
                    </form>
                </div>

                <div className="bg-putih border border-garis rounded-sm overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-pasir text-abu text-[13px] font-semibold border-b border-garis">
                                <th className="py-3 px-4">Nama</th>
                                <th className="py-3 px-4">Slug</th>
                                <th className="py-3 px-4">Induk</th>
                                <th className="py-3 px-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-arang">
                            {categories.length > 0 ? (
                                categories.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-kapas transition-colors h-[48px] border-b border-garis last:border-b-0">
                                        <td className="py-3 px-4 font-medium">{cat.name}</td>
                                        <td className="py-3 px-4 text-abu font-mono text-xs">{cat.slug}</td>
                                        <td className="py-3 px-4 text-abu">{cat.parent?.name || '-'}</td>
                                        <td className="py-3 px-4 text-right space-x-3">
                                            <button
                                                onClick={() => openEditModal(cat)}
                                                className="text-pandan hover:underline text-xs font-semibold"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(cat)}
                                                className="text-cabai hover:underline text-xs font-semibold"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-8 text-center text-abu">
                                        Belum ada kategori.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {links.length > 3 && (
                    <div className="flex justify-center mt-6">
                        <nav className="flex space-x-1">
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-arang/50 p-4">
                    <div className="bg-putih border border-garis rounded-sm w-full max-w-md p-6 relative">
                        <h2 className="text-xl font-bold text-arang mb-4">
                            {editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}
                        </h2>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label htmlFor="kategori-nama" className="block text-sm font-medium text-abu mb-1">Nama Kategori</label>
                                <input
                                    id="kategori-nama"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            name: e.target.value,
                                            slug: generateSlugFromName(e.target.value)
                                        });
                                    }}
                                    className="w-full px-3 py-2 border border-garis rounded-sm text-sm focus:ring-2 focus:ring-pandan focus:outline-none"
                                    placeholder="Contoh: Daster Batik"
                                />
                                {errors.name && <p className="text-cabai text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label htmlFor="kategori-slug" className="block text-sm font-medium text-abu mb-1">Slug</label>
                                <input
                                    id="kategori-slug"
                                    type="text"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    className="w-full px-3 py-2 border border-garis rounded-sm text-sm focus:ring-2 focus:ring-pandan focus:outline-none font-mono text-xs"
                                    placeholder="daster-batik"
                                />
                                {errors.slug && <p className="text-cabai text-xs mt-1">{errors.slug}</p>}
                            </div>

                            <div>
                                <label htmlFor="kategori-induk" className="block text-sm font-medium text-abu mb-1">Kategori Induk (Opsional)</label>
                                <select
                                    id="kategori-induk"
                                    value={data.parent_id}
                                    onChange={(e) => setData('parent_id', e.target.value)}
                                    className="w-full px-3 py-2 border border-garis rounded-sm text-sm focus:ring-2 focus:ring-pandan focus:outline-none bg-putih"
                                >
                                    <option value="">-- Tanpa Induk --</option>
                                    {categories
                                        .filter((c) => !editingCategory || c.id !== editingCategory.id)
                                        .map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                </select>
                                {errors.parent_id && <p className="text-cabai text-xs mt-1">{errors.parent_id}</p>}
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
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
                                    {editingCategory ? 'Simpan Perubahan' : 'Simpan'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && deletingCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-arang/50 p-4">
                    <div className="bg-putih border border-garis rounded-sm w-full max-w-sm p-6 text-center">
                        <h2 className="text-lg font-bold text-arang mb-2">Hapus kategori ini?</h2>
                        <p className="text-sm text-abu mb-6">
                            Kategori <span className="font-semibold text-arang">"{deletingCategory.name}"</span> akan dihapus. Tindakan ini tidak dapat dibatalkan jika kategori masih memiliki produk terikat.
                        </p>
                        <div className="flex justify-center space-x-3">
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
