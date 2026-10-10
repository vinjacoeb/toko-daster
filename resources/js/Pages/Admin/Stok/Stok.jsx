import React, { useState } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Button from '../../../components/Button';
import Toast from '../../../components/Toast';
import Pagination from '../../../components/Pagination';
import Drawer from '../../../components/Drawer';

function formatRupiah(n) {
    if (n === null || n === undefined || n === '') return '-';
    return 'Rp' + Number(n).toLocaleString('id-ID');
}

export default function AdminStok() {
    const { data: paginatedData, filters = {}, title, flash } = usePage().props;
    const variants = paginatedData?.data ?? [];
    const links = paginatedData?.links ?? [];
    const total = paginatedData?.total ?? 0;

    const [search, setSearch] = useState(filters.search || '');
    const [stokFilter, setStokFilter] = useState(filters.status_stok || '');

    const [toast, setToast] = useState(
        flash?.success ? { type: 'success', message: flash.success } : null
    );

    // Dialog sesuaikan stok
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [adjustMode, setAdjustMode] = useState('tambah'); // 'tambah' or 'kurang'

    const { data: formStock, setData: setFormStock, post, processing, errors, reset, clearErrors } = useForm({
        variant_id: '',
        quantity: 1,
        reason: 'restock',
        note: '',
    });

    // Panel riwayat mutasi
    const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
    const [historyVariant, setHistoryVariant] = useState(null);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyData, setHistoryData] = useState([]);

    const applyFilters = (overrides = {}) => {
        const params = {
            cari: search,
            stok: stokFilter,
            ...overrides,
        };
        Object.keys(params).forEach((key) => {
            if (params[key] === '' || params[key] === null || params[key] === undefined) {
                delete params[key];
            }
        });
        router.get('/admin/stok', params, { preserveState: true, replace: true });
    };

    const handleResetFilter = () => {
        setSearch('');
        setStokFilter('');
        router.get('/admin/stok', {}, { replace: true });
    };

    const openAdjustModal = (variant, mode) => {
        setSelectedVariant(variant);
        setAdjustMode(mode);
        reset();
        clearErrors();
        setFormStock({
            variant_id: variant.id,
            quantity: 1,
            reason: mode === 'tambah' ? 'restock' : 'koreksi',
            note: '',
        });
        setIsModalOpen(true);
    };

    const handleStockSubmit = (e) => {
        e.preventDefault();
        const qtyNum = Number(formStock.quantity) || 0;
        const finalQuantity = adjustMode === 'tambah' ? qtyNum : -qtyNum;

        // Validasi client-side jika kurang melebihi stok
        if (adjustMode === 'kurang' && selectedVariant && qtyNum > selectedVariant.stock) {
            alert(`Pengurangan melebihi stok (maks ${selectedVariant.stock})`);
            return;
        }

        router.post('/admin/stok', {
            variant_id: selectedVariant.id,
            quantity: finalQuantity,
            reason: formStock.reason,
            note: formStock.note,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsModalOpen(false);
                setToast({
                    type: 'success',
                    message: `Stok ${selectedVariant.sku} disesuaikan: ${selectedVariant.stock} → ${adjustMode === 'tambah' ? selectedVariant.stock + qtyNum : selectedVariant.stock - qtyNum} (${formStock.reason})`
                });
            },
            onError: (errs) => {
                if (errs.stock) {
                    alert(errs.stock);
                }
            }
        });
    };

    const openHistoryDrawer = async (variant) => {
        setHistoryVariant(variant);
        setIsHistoryDrawerOpen(true);
        setHistoryLoading(true);
        try {
            const res = await fetch(`/admin/stok/${variant.id}/riwayat`, {
                headers: { 'Accept': 'application/json' }
            });
            if (res.ok) {
                const json = await res.json();
                setHistoryData(json.data?.data || json.movements?.data || []);
            } else {
                setHistoryData([]);
            }
        } catch (e) {
            setHistoryData([]);
        } finally {
            setHistoryLoading(false);
        }
    };

    const countMenipis = variants.filter(v => v.stock > 0 && v.stock <= (v.stock_minimum ?? 3)).length;
    const countHabis = variants.filter(v => v.stock <= 0).length;

    return (
        <AdminLayout>
            <Head title={title || 'Manajemen Stok'} />

            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-arang mb-1">Stok</h1>
                        <p className="text-sm text-abu">Stok per varian. Penyesuaian selalu dicatat.</p>
                    </div>
                    <div className="text-sm text-abu font-medium bg-putih border border-garis px-4 py-2 rounded-sm">
                        {total} varian · <span className="text-kunyit font-semibold">{countMenipis} menipis</span> · <span className="text-cabai font-semibold">{countHabis} habis</span>
                    </div>
                </div>

                {/* Filter */}
                <form
                    onSubmit={(e) => { e.preventDefault(); applyFilters(); }}
                    className="bg-putih border border-garis p-4 rounded-sm mb-6 flex flex-col md:flex-row gap-3 items-end"
                >
                    <div className="flex-1 w-full">
                        <label htmlFor="stok-cari" className="block text-sm font-medium text-abu mb-1">Cari produk, SKU, warna</label>
                        <input
                            id="stok-cari"
                            type="text"
                            placeholder="Cari produk, SKU, atau warna..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full h-[44px] px-3 border border-garis rounded-sm text-sm focus:ring-2 focus:ring-pandan focus:outline-none bg-putih"
                        />
                    </div>
                    <div className="w-full md:w-56">
                        <label htmlFor="stok-status" className="block text-sm font-medium text-abu mb-1">Status stok</label>
                        <select
                            id="stok-status"
                            value={stokFilter}
                            onChange={(e) => { setStokFilter(e.target.value); applyFilters({ stok: e.target.value }); }}
                            className="w-full h-[44px] px-3 border border-garis rounded-sm text-sm focus:ring-2 focus:ring-pandan focus:outline-none bg-putih"
                        >
                            <option value="">Semua status</option>
                            <option value="aman">Aman</option>
                            <option value="menipis">Menipis</option>
                            <option value="habis">Habis</option>
                        </select>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button type="submit" variant="secondary" className="px-4 py-2 text-sm h-[44px] flex-1 md:flex-initial">
                            Cari
                        </Button>
                        {(search !== '' || stokFilter !== '') && (
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
                                <th className="py-3 px-4">Produk / SKU</th>
                                <th className="py-3 px-4">Ukuran</th>
                                <th className="py-3 px-4">Warna</th>
                                <th className="py-3 px-4 text-right">Harga</th>
                                <th className="py-3 px-4 text-right">Stok</th>
                                <th className="py-3 px-4 text-right">Stok Min.</th>
                                <th className="py-3 px-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-arang">
                            {variants.length > 0 ? (
                                variants.map((v) => {
                                    const prod = v.product;
                                    const photo = prod?.images?.[0]?.path || null;
                                    const isHabis = v.stock <= 0;
                                    const isMenipis = !isHabis && v.stock <= (v.stock_minimum ?? 3);

                                    return (
                                        <tr key={v.id} className="hover:bg-kapas transition-colors h-[48px] border-b border-garis last:border-b-0">
                                            <td className="py-2 px-4">
                                                {photo ? (
                                                    <img
                                                        src={photo}
                                                        alt={prod?.name || 'Produk'}
                                                        className="w-10 h-12 object-cover rounded-sm"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-12 bg-pasir rounded-sm flex items-center justify-center text-[10px] text-abu text-center leading-tight px-0.5">
                                                        [CONTOH]
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="font-medium line-clamp-1">{prod?.name || '-'}</span>
                                                <span className="block text-xs text-abu font-mono">{v.sku}</span>
                                            </td>
                                            <td className="py-3 px-4 text-abu">{v.size}</td>
                                            <td className="py-3 px-4 text-abu">{v.color}</td>
                                            <td className="py-3 px-4 text-right font-semibold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                                {formatRupiah(v.price || prod?.price)}
                                            </td>
                                            <td className="py-3 px-4 text-right font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                                <span className="inline-flex items-center gap-1.5 justify-end">
                                                    {v.stock}
                                                    {isHabis && (
                                                        <span className="px-2 py-0.5 bg-cabai-muda text-cabai text-xs rounded-full font-semibold">Habis</span>
                                                    )}
                                                    {isMenipis && (
                                                        <span className="px-2 py-0.5 bg-kunyit-muda text-arang text-xs rounded-full font-semibold">Sisa {v.stock}</span>
                                                    )}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right text-abu" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                                {v.stock_minimum}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => openAdjustModal(v, 'tambah')}
                                                        className="w-9 h-9 border border-garis bg-putih rounded-sm text-pandan hover:bg-pasir font-bold flex items-center justify-center"
                                                        title={`Tambah stok ${v.sku}`}
                                                        aria-label={`Tambah stok ${v.sku}`}
                                                    >
                                                        +
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => openAdjustModal(v, 'kurang')}
                                                        disabled={v.stock <= 0}
                                                        className={`w-9 h-9 border border-garis rounded-sm font-bold flex items-center justify-center ${v.stock <= 0 ? 'bg-pasir text-abu cursor-not-allowed opacity-50' : 'bg-putih text-cabai hover:bg-pasir'}`}
                                                        title={v.stock <= 0 ? 'Stok sudah 0' : `Kurangi stok ${v.sku}`}
                                                        aria-label={`Kurangi stok ${v.sku}`}
                                                    >
                                                        -
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => openHistoryDrawer(v)}
                                                        className="h-9 px-3 border border-garis bg-putih rounded-sm text-xs font-semibold text-arang hover:bg-pasir flex items-center justify-center"
                                                        title={`Riwayat ${v.sku}`}
                                                    >
                                                        Riwayat
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="8" className="py-12 text-center text-abu">
                                        Belum ada varian produk atau tidak ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination links={links} />
            </div>

            {/* Dialog Sesuaikan Stok */}
            {isModalOpen && selectedVariant && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-arang/50 p-4 overflow-y-auto">
                    <div className="bg-putih border border-garis rounded-sm w-full max-w-md p-6 relative">
                        <h2 className="text-xl font-bold text-arang mb-1">Sesuaikan stok</h2>
                        <p className="text-sm text-abu mb-4">
                            {selectedVariant.product?.name} · {selectedVariant.size} · {selectedVariant.color} ({selectedVariant.sku})
                        </p>
                        <div className="bg-pasir p-3 rounded-sm text-sm text-arang mb-4 flex justify-between items-center">
                            <span>Stok saat ini:</span>
                            <span className="font-bold text-base" style={{ fontVariantNumeric: 'tabular-nums' }}>{selectedVariant.stock}</span>
                        </div>

                        <form onSubmit={handleStockSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-abu mb-1">Arah</label>
                                <div className="flex gap-4 text-sm text-arang">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="adjustMode"
                                            checked={adjustMode === 'tambah'}
                                            onChange={() => setAdjustMode('tambah')}
                                            className="text-pandan focus:ring-pandan"
                                        />
                                        <span>Tambah</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="adjustMode"
                                            checked={adjustMode === 'kurang'}
                                            onChange={() => setAdjustMode('kurang')}
                                            className="text-pandan focus:ring-pandan"
                                        />
                                        <span>Kurang</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="form-qty" className="block text-sm font-medium text-abu mb-1">Jumlah</label>
                                <input
                                    id="form-qty"
                                    type="number"
                                    min="1"
                                    value={formStock.quantity}
                                    onChange={(e) => setFormStock('quantity', e.target.value)}
                                    className="w-full h-[44px] px-3 border border-garis rounded-sm text-sm focus:ring-2 focus:ring-pandan focus:outline-none bg-putih"
                                />
                                {errors.quantity && <p className="text-cabai text-xs mt-1">{errors.quantity}</p>}
                            </div>

                            <div>
                                <label htmlFor="form-reason" className="block text-sm font-medium text-abu mb-1">Alasan</label>
                                <select
                                    id="form-reason"
                                    value={formStock.reason}
                                    onChange={(e) => setFormStock('reason', e.target.value)}
                                    className="w-full h-[44px] px-3 border border-garis rounded-sm text-sm focus:ring-2 focus:ring-pandan focus:outline-none bg-putih"
                                >
                                    <option value="restock">Restock</option>
                                    <option value="koreksi">Koreksi</option>
                                    <option value="rusak-hilang">Rusak/hilang</option>
                                </select>
                                {errors.reason && <p className="text-cabai text-xs mt-1">{errors.reason}</p>}
                            </div>

                            <div>
                                <label htmlFor="form-note" className="block text-sm font-medium text-abu mb-1">Catatan (opsional)</label>
                                <input
                                    id="form-note"
                                    type="text"
                                    value={formStock.note}
                                    onChange={(e) => setFormStock('note', e.target.value)}
                                    placeholder="Keterangan tambahan..."
                                    className="w-full h-[44px] px-3 border border-garis rounded-sm text-sm focus:ring-2 focus:ring-pandan focus:outline-none bg-putih"
                                />
                                {errors.note && <p className="text-cabai text-xs mt-1">{errors.note}</p>}
                            </div>

                            <div className="bg-kapas p-3 rounded-sm text-sm text-arang flex justify-between items-center">
                                <span className="font-medium">Stok akhir:</span>
                                <span className="font-bold text-base text-pandan" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                    {adjustMode === 'tambah'
                                        ? selectedVariant.stock + (Number(formStock.quantity) || 0)
                                        : Math.max(0, selectedVariant.stock - (Number(formStock.quantity) || 0))}
                                </span>
                            </div>

                            <div className="flex justify-end space-x-3 pt-2">
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
                                    Simpan
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Panel Riwayat Mutasi */}
            <Drawer
                isOpen={isHistoryDrawerOpen}
                onClose={() => setIsHistoryDrawerOpen(false)}
                title={historyVariant ? `Riwayat — ${historyVariant.sku} (${historyVariant.product?.name})` : 'Riwayat Mutasi Stok'}
            >
                {historyLoading ? (
                    <div className="py-12 text-center text-abu">Memuat riwayat...</div>
                ) : historyData.length > 0 ? (
                    <div className="space-y-4">
                        {historyData.map((item) => (
                            <div key={item.id} className="bg-kapas border border-garis p-3 rounded-sm text-sm space-y-1">
                                <div className="flex justify-between text-xs text-abu">
                                    <span>{new Date(item.created_at).toLocaleString('id-ID')}</span>
                                    <span className="font-semibold text-arang">{item.user?.name || 'Admin'}</span>
                                </div>
                                <div className="flex justify-between items-center font-medium">
                                    <span className={item.jumlah > 0 ? 'text-pandan font-bold' : 'text-cabai font-bold'} style={{ fontVariantNumeric: 'tabular-nums' }}>
                                        {item.jumlah > 0 ? `+${item.jumlah}` : item.jumlah}
                                    </span>
                                    <span className="text-xs text-abu">Stok akhir: <strong className="text-arang" style={{ fontVariantNumeric: 'tabular-nums' }}>{item.stok_akhir ?? '-'}</strong></span>
                                </div>
                                <div className="text-xs text-abu pt-1 border-t border-garis flex justify-between">
                                    <span>Alasan: <strong className="text-arang uppercase">{item.alasan}</strong></span>
                                    {item.order && <span className="text-pandan font-mono font-semibold">Pesanan: {item.order.code}</span>}
                                </div>
                                {item.catatan && <p className="text-xs text-arang italic pt-0.5">Catatan: {item.catatan}</p>}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-12 text-center text-abu">Belum ada riwayat mutasi untuk varian ini.</div>
                )}
            </Drawer>
        </AdminLayout>
    );
}
