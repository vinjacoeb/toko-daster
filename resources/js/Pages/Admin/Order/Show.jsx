import React, { useState } from 'react';
import { Head, usePage, router, Link, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Button from '../../../components/Button';

export default function OrderShow() {
    const { data: order, orderStatuses, title } = usePage().props;
    const { put, processing } = useForm({
        status: order.status,
        resi: order.tracking_number || '',
    });

    const [status, setStatus] = useState(order.status);
    const [resi, setResi] = useState(order.tracking_number || '');

    const handleUpdateStatus = (newStatus) => {
        router.put(route('admin.pesanan.update', order.id), { status: newStatus, resi }, {
            onSuccess: () => setStatus(newStatus),
        });
    };

    const getStatusBadge = (st) => {
        const classes = {
            baru: 'bg-kunyit-muda text-arang border border-kunyit',
            dibayar: 'bg-pandan-muda text-pandan-gelap border border-pandan',
            dikemas: 'bg-pasir text-arang border border-garis',
            dikirim: 'bg-[#DCE8F3] text-lawon border border-lawon',
            selesai: 'bg-pandan text-putih',
            batal: 'bg-cabai-muda text-cabai border border-cabai',
        };
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${classes[st] || 'bg-pasir text-arang'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
                {st}
            </span>
        );
    };

    return (
        <AdminLayout title={title}>
            <Head title={title} />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-arang">Detail Pesanan {order.kode}</h1>
                    <Link href="/admin/pesanan" className="text-pandan hover:underline">Kembali</Link>
                </div>

                <div className="bg-putih border border-garis p-6 rounded-sm shadow-sm mb-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="text-sm text-abu mb-1">Status</div>
                            {getStatusBadge(status)}
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-abu mb-1">Tanggal Pesan</div>
                            <div className="text-arang font-medium">{new Date(order.ordered_at).toLocaleString('id-ID')}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <h3 className="text-sm font-semibold text-arang mb-2">Data Pelanggan</h3>
                            <p className="text-arang font-medium">{order.customer_name}</p>
                            <p className="text-abu text-sm">{order.customer_phone}</p>
                            <p className="text-abu text-sm mt-2">{order.address}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-arang mb-2">Informasi</h3>
                            <p className="text-sm text-arang"><span className="text-abu">Channel:</span> {order.channel}</p>
                            <p className="text-sm text-arang mt-1"><span className="text-abu">Catatan:</span> {order.note || '-'}</p>
                        </div>
                    </div>

                    <table className="w-full text-left border-collapse mb-6">
                        <thead>
                            <tr className="bg-pasir text-abu text-xs uppercase font-semibold border-b border-garis">
                                <th className="py-2 px-3">Item</th>
                                <th className="py-2 px-3 text-right">Qty</th>
                                <th className="py-2 px-3 text-right">Harga</th>
                                <th className="py-2 px-3 text-right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-arang">
                            {order.items.map((item) => (
                                <tr key={item.id} className="border-b border-garis">
                                    <td className="py-3 px-3">
                                        <div className="font-medium">{item.nama}</div>
                                        <div className="text-xs text-abu">{item.warna} / {item.ukuran}</div>
                                    </td>
                                    <td className="py-3 px-3 text-right">{item.quantity}</td>
                                    <td className="py-3 px-3 text-right font-mono">Rp{item.price.toLocaleString()}</td>
                                    <td className="py-3 px-3 text-right font-mono font-medium">Rp{(item.price * item.quantity).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="3" className="py-2 px-3 text-right text-abu">Subtotal</td>
                                <td className="py-2 px-3 text-right font-mono">Rp{order.subtotal.toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td colSpan="3" className="py-2 px-3 text-right text-abu">Ongkir</td>
                                <td className="py-2 px-3 text-right font-mono">Rp{order.shipping_cost.toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td colSpan="3" className="py-2 px-3 text-right text-abu">Diskon</td>
                                <td className="py-2 px-3 text-right font-mono text-cabai">-Rp{order.discount.toLocaleString()}</td>
                            </tr>
                            <tr className="border-t border-garis font-bold">
                                <td colSpan="3" className="py-2 px-3 text-right">Total</td>
                                <td className="py-2 px-3 text-right font-mono text-lg text-pandan">Rp{order.total.toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Status Updates */}
                {status !== 'selesai' && status !== 'batal' && (
                    <div className="bg-putih border border-garis p-6 rounded-sm shadow-sm">
                        <h3 className="font-semibold text-arang mb-4">Ubah Status</h3>
                        {status === 'dikemas' && (
                            <div className="mb-4">
                                <label className="block text-sm text-abu mb-1">Nomor Resi *</label>
                                <input
                                    type="text"
                                    value={resi}
                                    onChange={(e) => setResi(e.target.value)}
                                    className="w-full h-10 px-3 border border-garis rounded-sm text-sm"
                                    placeholder="Masukkan nomor resi..."
                                />
                            </div>
                        )}
                        <div className="flex gap-2">
                            {status === 'baru' && <Button onClick={() => handleUpdateStatus('dibayar')} disabled={processing}>Tandai Dibayar</Button>}
                            {status === 'dibayar' && <Button onClick={() => handleUpdateStatus('dikemas')} disabled={processing}>Tandai Dikemas</Button>}
                            {status === 'dikemas' && <Button onClick={() => handleUpdateStatus('dikirim')} disabled={processing || !resi}>Tandai Dikirim</Button>}
                            {status === 'dikirim' && <Button onClick={() => handleUpdateStatus('selesai')} disabled={processing}>Selesaikan Pesanan</Button>}
                            <Button variant="secondary" className="border-cabai text-cabai" onClick={() => handleUpdateStatus('batal')} disabled={processing}>Batalkan</Button>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}