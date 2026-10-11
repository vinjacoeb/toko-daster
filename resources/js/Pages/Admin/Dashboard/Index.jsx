import React, { useMemo, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

function formatRupiah(n) {
    if (n === null || n === undefined || n === '') return 'Rp0';
    return 'Rp' + Number(n).toLocaleString('id-ID');
}

function formatRupiahSingkat(n) {
    const v = Number(n) || 0;
    if (Math.abs(v) >= 1000000000) {
        return 'Rp' + (v / 1000000000).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' M';
    }
    if (Math.abs(v) >= 1000000) {
        return 'Rp' + (v / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' jt';
    }
    if (Math.abs(v) >= 1000) {
        return 'Rp' + (v / 1000).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' rb';
    }
    return 'Rp' + v.toLocaleString('id-ID');
}

function perbandinganPersen(sekarang, pembanding) {
    const a = Number(sekarang) || 0;
    const b = Number(pembanding) || 0;
    if (b === 0) return { teks: 'Baru', persen: null };
    const p = ((a - b) / b) * 100;
    const bulat = Math.round(p * 10) / 10;
    return {
        teks: `${Math.abs(bulat).toLocaleString('id-ID')}%`,
        persen: bulat,
        naik: bulat > 0,
        turun: bulat < 0,
    };
}

function LabelPerbandingan({ sekarang, pembanding }) {
    const hasil = perbandinganPersen(sekarang, pembanding);
    if (hasil.persen === null) {
        return <span className="text-xs text-abu">Baru</span>;
    }
    const panah = hasil.naik ? '↑' : hasil.turun ? '↓' : '→';
    const kata = hasil.naik ? 'naik' : hasil.turun ? 'turun' : 'sama';
    return (
        <span className="text-xs text-abu">
            {panah} {kata} {hasil.teks}
        </span>
    );
}

function BadgeStatus({ status }) {
    const peta = {
        baru: 'bg-kunyit-muda text-arang border-kunyit',
        dibayar: 'bg-pandan-muda text-pandan-gelap border-pandan',
        dikemas: 'bg-pasir text-arang border-garis',
        dikirim: 'bg-putih text-lawon border-lawon',
        selesai: 'bg-pandan text-putih border-pandan',
        batal: 'bg-cabai-muda text-cabai border-cabai',
    };
    const cls = peta[status] || 'bg-pasir text-arang border-garis';
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
            {status}
        </span>
    );
}

function GrafikPerbandingan({ data }) {
    const W = 640;
    const H = 260;
    const padKiri = 76;
    const padBawah = 32;
    const padAtas = 12;
    const lebar = W - padKiri - 16;
    const tinggi = H - padAtas - padBawah;
    const maks = Math.max(1, ...data.map((d) => Math.max(d.sekarang, d.pembanding)));
    const titik = (nilai, i) => {
        const n = Math.max(data.length, 1);
        const x = n === 1 ? padKiri + lebar / 2 : padKiri + (i / (n - 1)) * lebar;
        const y = padAtas + tinggi - (Number(nilai) / maks) * tinggi;
        return [x, y];
    };
    const garisSekarang = data.map((d, i) => titik(d.sekarang, i).join(',')).join(' ');
    const garisBanding = data.map((d, i) => titik(d.pembanding, i).join(',')).join(' ');
    const area = `${padKiri},${padAtas + tinggi} ${garisSekarang} ${padKiri + lebar},${padAtas + tinggi}`;
    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="h-[260px] w-full" role="img" aria-label="Grafik perbandingan omzet">
            {[0, 0.5, 1].map((f) => {
                const y = padAtas + tinggi - f * tinggi;
                return (
                    <g key={f}>
                        <line x1={padKiri} x2={W - 16} y1={y} y2={y} stroke="#D6CDB8" strokeDasharray="4 4" />
                        <text x={padKiri - 8} y={y + 4} textAnchor="end" fontSize="11" fill="#6B645A">
                            {formatRupiahSingkat(maks * f)}
                        </text>
                    </g>
                );
            })}
            <polygon points={area} fill="#DCE7DF" />
            <polyline points={garisSekarang} fill="none" stroke="#2E5E4E" strokeWidth="2" />
            <polyline points={garisBanding} fill="none" stroke="#6B645A" strokeWidth="2" strokeDasharray="5 4" />
            {data.map((d, i) => {
                const [x, y] = titik(d.sekarang, i);
                const [, yb] = titik(d.pembanding, i);
                return (
                    <g key={d.nama + i}>
                        <circle cx={x} cy={y} r="3" fill="#2E5E4E">
                            <title>{`${d.nama} periode ini: ${formatRupiah(d.sekarang)}`}</title>
                        </circle>
                        <circle cx={x} cy={yb} r="3" fill="#6B645A">
                            <title>{`${d.nama} pembanding: ${formatRupiah(d.pembanding)}`}</title>
                        </circle>
                        <text x={x} y={H - 8} textAnchor="middle" fontSize="11" fill="#6B645A">
                            {d.nama}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}

function GrafikBatang({ data, namaBulanIni, namaBulanLalu }) {
    const maks = Math.max(1, ...data.map((d) => Math.max(d.bulan_ini ?? 0, d.bulan_lalu ?? 0)));
    return (
        <div>
            <div className="mb-3 flex items-center gap-4 text-xs text-abu">
                <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: '#2D5B87' }} aria-hidden="true" />
                    {namaBulanLalu}
                </span>
                <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: '#2E5E4E' }} aria-hidden="true" />
                    {namaBulanIni}
                </span>
            </div>
            <div className="flex h-[220px] items-end gap-3 overflow-x-auto" role="img" aria-label={`Perbandingan pendapatan ${namaBulanIni} dan ${namaBulanLalu}`}>
                {data.map((d) => {
                    const tLalu = d.bulan_lalu === null ? null : (Number(d.bulan_lalu) / maks) * 100;
                    const tIni = d.bulan_ini === null ? null : (Number(d.bulan_ini) / maks) * 100;
                    return (
                        <div key={d.nama} className="flex min-w-[64px] flex-1 flex-col items-center gap-2">
                            <div className="flex h-[180px] w-full items-end justify-center gap-1.5">
                                <div
                                    className="w-5 rounded-t-[2px]"
                                    style={{ height: tLalu === null ? 0 : `${Math.max(tLalu, 2)}%`, backgroundColor: '#2D5B87' }}
                                    title={d.bulan_lalu === null ? `${namaBulanLalu}: belum ada data` : `${namaBulanLalu}: ${formatRupiah(d.bulan_lalu)}`}
                                />
                                <div
                                    className="w-5 rounded-t-[2px]"
                                    style={{ height: tIni === null ? 0 : `${Math.max(tIni, 2)}%`, backgroundColor: '#2E5E4E' }}
                                    title={d.bulan_ini === null ? `${namaBulanIni}: belum ada data` : `${namaBulanIni}: ${formatRupiah(d.bulan_ini)}`}
                                />
                            </div>
                            <p className="text-[11px] text-abu">{d.nama}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const TAB_PERBANDINGAN = [
    { kunci: 'hari_ini', label: 'Hari ini' },
    { kunci: 'minggu_ini', label: 'Minggu ini' },
    { kunci: 'bulan_ini', label: 'Bulan ini' },
];

export default function AdminDashboard() {
    const props = usePage().props;
    const { title } = props;
    const data = props.data ?? {};

    const kartu = data.kartu ?? {};
    const pendapatan = data.pendapatan_bulanan ?? {};
    const riwayat = data.riwayat_pesanan_minggu_ini ?? [];
    const terlaris = data.produk_terlaris ?? [];
    const menipis = data.stok_menipis_daftar ?? [];

    const omzetHariIni = Number(kartu.omzet_hari_ini ?? 0);
    const omzetKemarin = Number(kartu.omzet_kemarin ?? 0);
    const omzetBulanIni = Number(kartu.omzet_bulan_ini ?? 0);
    const omzetBulanLalu = Number(kartu.omzet_bulan_lalu ?? 0);
    const perluDiproses = Number(kartu.pesanan_perlu_diproses ?? 0);
    const stokMenipis = Number(kartu.stok_menipis ?? 0);
    const pesanBelumDibaca = Number(kartu.pesan_belum_dibaca ?? 0);

    const [tabAktif, setTabAktif] = useState('minggu_ini');
    const perbandingan = props.perbandingan ?? {};
    const dataTab = perbandingan[tabAktif] ?? { label: [], sekarang: [], pembanding: [], total_sekarang: 0, total_pembanding: 0 };

    

    const dataGrafik = useMemo(() => {
        const label = dataTab.label ?? [];
        const sekarang = dataTab.sekarang ?? [];
        const pembandingArr = dataTab.pembanding ?? [];
        return label.map((nama, i) => ({
            nama,
            sekarang: Number(sekarang[i] ?? 0),
            pembanding: Number(pembandingArr[i] ?? 0),
        }));
    }, [dataTab]);

    const adaPenjualanPeriode = dataGrafik.some((d) => d.sekarang > 0 || d.pembanding > 0);
    const selisihGrafik = perbandinganPersen(dataTab.total_sekarang ?? 0, dataTab.total_pembanding ?? 0);

    const kelompok = pendapatan.kelompok ?? [];
    const bulanIniArr = pendapatan.bulan_ini ?? [];
    const bulanLaluArr = pendapatan.bulan_lalu ?? [];
    const dataBatang = useMemo(
        () =>
            kelompok.map((nama, i) => ({
                nama,
                bulan_ini: bulanIniArr[i] === null || bulanIniArr[i] === undefined ? null : Number(bulanIniArr[i]),
                bulan_lalu: bulanLaluArr[i] === null || bulanLaluArr[i] === undefined ? null : Number(bulanLaluArr[i]),
            })),
        [kelompok, bulanIniArr, bulanLaluArr],
    );
    const adaPendapatan = dataBatang.some((d) => (d.bulan_ini ?? 0) > 0 || (d.bulan_lalu ?? 0) > 0);
    const selisihBulanan = perbandinganPersen(pendapatan.total_bulan_ini ?? 0, pendapatan.total_bulan_lalu ?? 0);
    const kataBulanan = selisihBulanan.persen === null ? '' : selisihBulanan.naik ? 'naik' : selisihBulanan.turun ? 'turun' : 'sama';
    const panahBulanan = selisihBulanan.persen === null ? '' : selisihBulanan.naik ? '↑' : selisihBulanan.turun ? '↓' : '→';

    return (
        <AdminLayout title={title || 'Dashboard'}>
            <Head title={title || 'Dashboard'} />
            <div className="mx-auto max-w-7xl">
                <h1 className="mb-1 font-hanken-grotesk text-[28px] font-semibold leading-tight text-arang">Dashboard</h1>
                <p className="mb-6 text-sm text-abu">Ringkasan omzet, pesanan, produk terlaris, dan stok.</p>

                <section aria-label="Statistik" className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
                    <div className="rounded border border-garis bg-putih p-4">
                        <p className="mb-1 text-sm text-abu">Omzet hari ini</p>
                        <p className="text-[22px] font-semibold leading-tight text-arang">{formatRupiah(omzetHariIni)}</p>
                        <div className="mt-1">
                            <LabelPerbandingan sekarang={omzetHariIni} pembanding={omzetKemarin} />
                        </div>
                    </div>
                    <div className="rounded border border-garis bg-putih p-4">
                        <p className="mb-1 text-sm text-abu">Omzet bulan ini</p>
                        <p className="text-[22px] font-semibold leading-tight text-arang">{formatRupiah(omzetBulanIni)}</p>
                        <div className="mt-1">
                            <LabelPerbandingan sekarang={omzetBulanIni} pembanding={omzetBulanLalu} />
                        </div>
                    </div>
                    <div className="rounded border border-garis bg-putih p-4">
                        <p className="mb-1 text-sm text-abu">Pesanan perlu diproses</p>
                        <p className="text-[22px] font-semibold leading-tight text-arang">{perluDiproses.toLocaleString('id-ID')}</p>
                        <p className="mt-1 text-xs text-abu">Status baru, dibayar, dikemas</p>
                    </div>
                    <div className="rounded border border-garis bg-putih p-4">
                        <p className="mb-1 text-sm text-abu">Stok menipis</p>
                        <p className="text-[22px] font-semibold leading-tight text-arang">{stokMenipis.toLocaleString('id-ID')} varian</p>
                        <p className="mt-1 text-xs text-abu">Stok di atas 0 sampai batas minimum</p>
                    </div>
                    <Link
                        href="/admin/pesan-masuk"
                        className="rounded border border-garis bg-putih p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-pandan focus-visible:ring-offset-2"
                    >
                        <p className="mb-1 text-sm text-abu">Pesan belum dibaca</p>
                        <p className="text-[22px] font-semibold leading-tight text-arang">{pesanBelumDibaca.toLocaleString('id-ID')}</p>
                        <p className="mt-1 text-xs text-pandan underline">Buka pesan masuk</p>
                    </Link>
                </section>

                <section className="mb-6 grid grid-cols-12 gap-6">
                    <div className="col-span-12 rounded border border-garis bg-putih p-4 lg:col-span-8">
                        <h2 className="mb-2 font-hanken-grotesk text-[18px] font-semibold text-arang">Perbandingan omzet</h2>
                        <p className="mb-3 text-sm text-abu">
                            Periode ini {formatRupiah(dataTab.total_sekarang ?? 0)} · Pembanding {formatRupiah(dataTab.total_pembanding ?? 0)} ·{' '}
                            {selisihGrafik.persen === null ? (
                                'Baru'
                            ) : (
                                <>
                                    {selisihGrafik.naik ? '↑ naik' : selisihGrafik.turun ? '↓ turun' : '→ sama'} {selisihGrafik.teks}
                                </>
                            )}
                        </p>
                        <div role="tablist" aria-label="Periode perbandingan" className="mb-4 flex gap-6 border-b border-garis">
                            {TAB_PERBANDINGAN.map((t) => {
                                const aktif = tabAktif === t.kunci;
                                return (
                                    <button
                                        key={t.kunci}
                                        role="tab"
                                        aria-selected={aktif}
                                        type="button"
                                        onClick={() => setTabAktif(t.kunci)}
                                        className={`h-[44px] text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-pandan ${
                                            aktif ? 'border-b-[3px] border-pandan text-arang' : 'text-abu hover:text-arang'
                                        }`}
                                    >
                                        {t.label}
                                    </button>
                                );
                            })}
                        </div>
                        {!adaPenjualanPeriode ? (
                            <div>
                                <GrafikPerbandingan data={dataGrafik} />
                                <p className="mt-2 text-sm text-abu">Belum ada penjualan pada periode ini.</p>
                            </div>
                        ) : (
                            <GrafikPerbandingan data={dataGrafik} />
                        )}
                    </div>

                    <div className="col-span-12 rounded border border-garis bg-putih p-4 lg:col-span-4">
                        <h2 className="mb-1 font-hanken-grotesk text-[18px] font-semibold text-arang">Produk terlaris 30 hari</h2>
                        <p className="mb-3 text-sm text-abu">5 teratas berdasarkan jumlah terjual.</p>
                        {terlaris.length === 0 ? (
                            <p className="text-sm text-abu">Belum ada penjualan 30 hari terakhir.</p>
                        ) : (
                            <ol className="divide-y divide-garis">
                                {terlaris.slice(0, 5).map((p, i) => (
                                    <li key={p.id ?? i} className="flex items-start justify-between gap-3 py-3">
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-arang">
                                                {i + 1}. {p.nama}
                                            </p>
                                            <p className="text-xs text-abu">{Number(p.jumlah_terjual ?? 0).toLocaleString('id-ID')} terjual</p>
                                        </div>
                                        <p className="shrink-0 text-sm font-semibold text-arang">{formatRupiah(p.omzet ?? 0)}</p>
                                    </li>
                                ))}
                            </ol>
                        )}
                    </div>
                </section>

                <section className="mb-6 grid grid-cols-12 gap-6">
                    <div className="col-span-12 rounded border border-garis bg-putih p-4 lg:col-span-6">
                        <h2 className="mb-1 font-hanken-grotesk text-[18px] font-semibold text-arang">
                            Pendapatan {pendapatan.nama_bulan_ini || 'bulan ini'} vs {pendapatan.nama_bulan_lalu || 'bulan lalu'}
                        </h2>
                        <p className="mb-3 text-sm text-abu">
                            {formatRupiahSingkat(pendapatan.total_bulan_ini ?? 0)}
                            {selisihBulanan.persen === null ? (
                                ', data pembanding belum ada'
                            ) : (
                                <>
                                    , {panahBulanan} {kataBulanan} {selisihBulanan.teks} dari bulan lalu ({formatRupiahSingkat(pendapatan.total_bulan_lalu ?? 0)})
                                </>
                            )}
                        </p>
                        {!adaPendapatan ? (
                            <p className="text-sm text-abu">Belum ada data penjualan.</p>
                        ) : (
                            <GrafikBatang
                                data={dataBatang}
                                namaBulanIni={pendapatan.nama_bulan_ini || 'Bulan ini'}
                                namaBulanLalu={pendapatan.nama_bulan_lalu || 'Bulan lalu'}
                            />
                        )}
                    </div>

                    <div className="col-span-12 rounded border border-garis bg-putih p-4 lg:col-span-6">
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <h2 className="font-hanken-grotesk text-[18px] font-semibold text-arang">Riwayat pesanan minggu ini</h2>
                            <Link href="/admin/pesanan" className="text-sm text-pandan underline underline-offset-2">
                                Lihat semua
                            </Link>
                        </div>
                        {riwayat.length === 0 ? (
                            <p className="text-sm text-abu">Belum ada pesanan minggu ini.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[520px] border-collapse text-left">
                                    <thead>
                                        <tr className="border-b border-garis bg-pasir text-[13px] font-semibold text-abu">
                                            <th className="px-3 py-2">Kode</th>
                                            <th className="px-3 py-2">Pelanggan</th>
                                            <th className="px-3 py-2 text-right">Total</th>
                                            <th className="px-3 py-2">Status</th>
                                            <th className="px-3 py-2">Waktu</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {riwayat.slice(0, 10).map((o) => (
                                            <tr key={o.id} className="h-[48px] border-b border-garis last:border-b-0 hover:bg-kapas">
                                                <td className="px-3 py-2 text-sm">
                                                    <Link href={`/admin/pesanan/${o.id}`} className="text-pandan underline underline-offset-2">
                                                        {o.kode}
                                                    </Link>
                                                </td>
                                                <td className="px-3 py-2 text-sm text-arang">{o.nama_pelanggan}</td>
                                                <td className="px-3 py-2 text-right text-sm font-semibold text-arang">{formatRupiah(o.total)}</td>
                                                <td className="px-3 py-2">
                                                    <BadgeStatus status={o.status} />
                                                </td>
                                                <td className="px-3 py-2 text-xs text-abu">
                                                    {o.dipesan_at
                                                        ? new Date(o.dipesan_at).toLocaleString('id-ID', { weekday: 'short', hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })
                                                        : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </section>

                <section aria-label="Stok menipis" className="rounded border border-garis bg-putih p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <h2 className="font-hanken-grotesk text-[18px] font-semibold text-arang">Stok menipis</h2>
                        <Link href="/admin/stok" className="text-sm text-pandan underline underline-offset-2">
                            Kelola stok
                        </Link>
                    </div>
                    {menipis.length === 0 ? (
                        <p className="text-sm text-abu">Semua varian masih di atas batas minimum.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[560px] border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-garis bg-pasir text-[13px] font-semibold text-abu">
                                        <th className="px-3 py-2">Produk</th>
                                        <th className="px-3 py-2">Ukuran</th>
                                        <th className="px-3 py-2">Warna</th>
                                        <th className="px-3 py-2 text-right">Sisa</th>
                                        <th className="px-3 py-2 text-right">Minimum</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {menipis.slice(0, 5).map((v) => (
                                        <tr key={v.varian_id} className="h-[48px] border-b border-garis last:border-b-0 hover:bg-kapas">
                                            <td className="px-3 py-2 text-sm font-medium text-arang">{v.produk_nama}</td>
                                            <td className="px-3 py-2 text-sm text-abu">{v.ukuran}</td>
                                            <td className="px-3 py-2 text-sm text-abu">{v.warna}</td>
                                            <td className="px-3 py-2 text-right text-sm font-semibold text-arang">Sisa {Number(v.stok ?? 0).toLocaleString('id-ID')}</td>
                                            <td className="px-3 py-2 text-right text-sm text-abu">{Number(v.stok_minimum ?? 0).toLocaleString('id-ID')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </AdminLayout>
    );
}