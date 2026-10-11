<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Variant;
use App\Models\Product;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class PesananSeeder extends Seeder
{
    public function run(): void
    {
        // Only local
        if (!app()->isLocal()) return;

        DB::transaction(function () {
            // Hapus pesanan contoh (berbasis [CONTOH] di catatan)
            $contohOrders = Order::where('note', 'like', '[CONTOH]%')->pluck('id')->all();
            if (count($contohOrders)) {
                OrderItem::whereIn('order_id', $contohOrders)->delete();
                Order::whereIn('id', $contohOrders)->delete();
            }

            // Data dasar dari seed-pesanan.md
            $tanggal = static::generateDates();
            $status = static::generateStatuses();
            $channels = static::generateChannels();
            $distribusi_resi = static::generateTrackingNumbers();
            $diskon_indexes = static::diskonIndexes();
            $addresses = static::generateAddresses();
            $customers = static::generateCustomers();

            // List varian aktif berstatus 'tayang'
            $variants = Variant::whereHas('product', fn($q) => $q->where('status', 'tayang'))->with('product')->get();
            $variantCount = $variants->count();
            $variantIdx = 0;
            $resiIdx = 0;

            for ($i = 0; $i < 40; $i++) {
                // Tanggal
                $tgl = $tanggal[$i];
                $sts = $status[$i];
                $ch = $channels[$i];
                $customer = $customers[$i % count($customers)];
                $address = ($i % 2 === 0) ? $addresses[$i % count($addresses)] : null;
                $diskon = in_array($i, $diskon_indexes) ? ($i % 2 == 0 ? 5000 : 10000) : 0;
                $ongkir = [0, 10000, 15000, 20000][($i % 4)];
                $catatan = '[CONTOH] Pesanan ke-' . ($i + 1);
                $resi = in_array($sts, ['dikirim', 'selesai']) ? $distribusi_resi[$resiIdx++] : null;

                // Pesanan: 1-3 item, qty 1-3
                $item_count = 1 + ($i % 3);
                $item_variants = [];
                $subtotal = 0;
                for ($j = 0; $j < $item_count; $j++) {
                    // Bergilir varian
                    $variant = $variants[$variantIdx % $variantCount];
                    $variantIdx++;
                    $qty = 1 + (($i + $j) % 3);
                    // Harga varian
                    $harga = $variant->price ?? $variant->product->price;
                    $item_variants[] = [
                        'variant_id' => $variant->id,
                        'product_id' => $variant->product->id,
                        'nama' => $variant->product->name,
                        'warna' => $variant->color,
                        'ukuran' => $variant->size,
                        'harga' => $harga,
                        'qty' => $qty,
                    ];
                    $subtotal += $harga * $qty;
                }
                $total = $subtotal + $ongkir - $diskon;

                $order = Order::create([
                    'code' => static::generateOrderCode($tgl, $i),
                    'customer_name' => $customer['nama'],
                    'customer_phone' => $customer['kontak'],
                    'address' => $address,
                    'channel' => $ch,
                    'status' => $sts,
                    'subtotal' => $subtotal,
                    'shipping_cost' => $ongkir,
                    'discount' => $diskon,
                    'total' => $total,
                    'tracking_number' => $resi,
                    'note' => $catatan,
                    'ordered_at' => $tgl,
                    'dipesan_at' => $tgl,
                ]);

                // Item
                foreach ($item_variants as $item) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'variant_id' => $item['variant_id'],
                        'product_id' => $item['product_id'],
                        'nama' => $item['nama'],
                        'warna' => $item['warna'],
                        'ukuran' => $item['ukuran'],
                        'harga' => $item['harga'],
                        'qty' => $item['qty'],
                    ]);
                }
            }
        });
    }

    // Helpers: generateDates, generateStatuses, generateChannels, dsb.
    private static function generateDates(): array
    {
        $tz = 'Asia/Jakarta';
        $now = now($tz);
        $hari_ini = $now->copy()->startOfDay();
        $dates = [];
        // Hari ini 3 pesanan jam berbeda
        for($i=0;$i<3;$i++){
            $dates[] = $hari_ini->copy()->addHours(1+$i*2);
        }
        // Minggu ini sebelum hari ini: 9
        $senin = $hari_ini->copy()->startOfWeek();
        for($i=0;$i<9;$i++){
            $hari = $senin->copy()->addDays($i);
            if($hari->greaterThanOrEqualTo($hari_ini)) $hari = $hari_ini->copy();
            $dates[] = $hari->addHours(8+$i);
        }
        // Bulan ini, di luar minggu ini: 10
        $start_bulan = $hari_ini->copy()->startOfMonth();
        for($i=1;$i<=10;$i++){
            $t = $start_bulan->copy()->addDays($i);
            if($t->greaterThanOrEqualTo($senin)) $t = $senin->copy()->subDay($i);
            $dates[] = $t->addHours(10+$i);
        }
        // Bulan lalu: 18
        $bulan_lalu = $start_bulan->copy()->subMonth();
        for($i=0;$i<18;$i++){
            $d = $bulan_lalu->copy()->addDays($i);
            $dates[] = $d->addHours(12+($i%6));
        }
        return $dates;
    }
    private static function generateStatuses(): array
    {
        // Sesuai seed-pesanan.md
        $base = array_merge(
            array_fill(0, 4, 'baru'),
            array_fill(0, 5, 'dibayar'),
            array_fill(0, 4, 'dikemas'),
            array_fill(0, 5, 'dikirim'),
            array_fill(0, 18, 'selesai'),
            array_fill(0, 4, 'batal'),
        );
        // Satukan, mixing: agar hari ini dan minggu ini campuran status
        return array_slice($base, 0, 40);
    }
    private static function generateChannels(): array
    {
        return array_merge(
            array_fill(0, 24, 'whatsapp'),
            array_fill(0, 10, 'marketplace'),
            array_fill(0, 6, 'langsung'),
        );
    }
    private static function generateTrackingNumbers(): array
    {
        $resi = [];
        for($i=1;$i<=23;$i++) {
            $resi[] = 'JNT'.str_pad($i, 9, '0', STR_PAD_LEFT);
        }
        return $resi;
    }
    private static function diskonIndexes(): array
    {
        // Ambil 6 indeks (acak deterministik)
        return [2, 4, 9, 16, 23, 37];
    }
    private static function generateAddresses(): array
    {
        return [
            'Jl. Contoh No. 12, Kota Contoh',
            'Jl. Mawar No. 3, Kota Lain',
            'Jl. Melati No. 7, Surabaya',
            'Perumahan Asri Blok B2, Bandung',
            'Jalan Raya Dalam, Yogyakarta',
            'Desa Sukajadi Km 5, Semarang',
        ];
    }
    private static function generateCustomers(): array
    {
        return [
            ['nama'=>'Siti Rahmawati','kontak'=>'6281200000001'],
            ['nama'=>'Dewi Lestari','kontak'=>'6281200000002'],
            ['nama'=>'Rina Wulandari','kontak'=>'6281200000003'],
            ['nama'=>'Fitri Handayani','kontak'=>'6281200000004'],
            ['nama'=>'Yuni Astuti','kontak'=>'6281200000005'],
            ['nama'=>'Nur Hidayah','kontak'=>'6281200000006'],
            ['nama'=>'Maya Putri','kontak'=>'6281200000007'],
            ['nama'=>'Lina Marlina','kontak'=>'6281200000008'],
            ['nama'=>'Rahma Sari','kontak'=>'6281200000009'],
            ['nama'=>'Tini Suryani','kontak'=>'6281200000010'],
            ['nama'=>'Wati Kusuma','kontak'=>'6281200000011'],
            ['nama'=>'Ani Purwanti','kontak'=>'6281200000012'],
            ['nama'=>'Sri Mulyani','kontak'=>'6281200000013'],
            ['nama'=>'Endah Pratiwi','kontak'=>'6281200000014'],
            ['nama'=>'Ratna Dewi','kontak'=>'6281200000015'],
        ];
    }
    private static function generateOrderCode($date, $idx): string
    {
        $codeDate = Carbon::parse($date)->format('ymd');
        $urut = str_pad(1 + $idx % 40, 3, '0', STR_PAD_LEFT); // urut harian, unik
        return "TD-{$codeDate}-{$urut}";
    }
}
