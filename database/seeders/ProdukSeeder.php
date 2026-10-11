<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Variant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class ProdukSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
        public function run(): void
    {
        // 20 produk dari docs/seed-produk.md
        $productsData = [
            [
                'name' => 'Daster Batik Parang Biru',
                'slug' => 'daster-batik-parang-biru',
                'category_name' => 'Daster Batik',
                'description' => 'Motif parang diagonal berwarna biru tua dengan potongan longgar.',
                'material' => 'Rayon',
                'care' => 'Cuci terpisah dengan air dingin, jemur di tempat teduh. Cuci tangan atau mesin mode lembut, jangan diperas keras. Setrika suhu rendah dari sisi dalam kain.',
                'price' => 89000,
                'price_crossed' => 110000,
                'status' => 'tayang',
                'featured' => true,
            ],
            [
                'name' => 'Daster Batik Kawung Cokelat',
                'slug' => 'daster-batik-kawung-cokelat',
                'category_name' => 'Daster Batik',
                'description' => 'Kawung cokelat dengan pola bulat berulang, nyaman untuk dipakai seharian di rumah.',
                'material' => 'Katun rayon',
                'care' => 'Cuci terpisah dengan air dingin, jemur di tempat teduh. Cuci tangan atau mesin mode lembut, jangan diperas keras. Setrika suhu rendah dari sisi dalam kain.',
                'price' => 95000,
                'price_crossed' => null,
                'status' => 'tayang',
                'featured' => false,
            ],
            [
                'name' => 'Daster Batik Mega Mendung',
                'slug' => 'daster-batik-mega-mendung',
                'category_name' => 'Daster Batik',
                'description' => 'Motif awan mega mendung berwarna biru laut dan putih gading.',
                'material' => 'Rayon premium',
                'care' => 'Cuci terpisah dengan air dingin, jemur di tempat teduh. Cuci tangan atau mesin mode lembut, jangan diperas keras. Setrika suhu rendah dari sisi dalam kain.',
                'price' => 119000,
                'price_crossed' => null,
                'status' => 'tayang',
                'featured' => true,
            ],
            [
                'name' => 'Daster Batik Sekar Jagad',
                'slug' => 'daster-batik-sekar-jagad',
                'category_name' => 'Daster Batik',
                'description' => 'Sekar jagad: kumpulan motif kecil dalam satu kain. Tersedia merah marun dan hijau botol, All Size.',
                'material' => 'Viscose',
                'care' => 'Cuci terpisah dengan air dingin, jemur di tempat teduh. Cuci tangan atau mesin mode lembut, jangan diperas keras. Setrika suhu rendah dari sisi dalam kain.',
                'price' => 129000,
                'price_crossed' => null,
                'status' => 'tayang',
                'featured' => false,
            ],
            [
                'name' => 'Daster Batik Truntum Hijau',
                'slug' => 'daster-batik-truntum-hijau',
                'category_name' => 'Daster Batik',
                'description' => 'Truntum hijau tua dengan taburan bunga kecil bersusun, potongan longgar.',
                'material' => 'Katun',
                'care' => 'Cuci terpisah dengan air dingin, jemur di tempat teduh. Cuci tangan atau mesin mode lembut, jangan diperas keras. Setrika suhu rendah dari sisi dalam kain.',
                'price' => 99000,
                'price_crossed' => null,
                'status' => 'tayang',
                'featured' => false,
            ],
            [
                'name' => 'Daster Bunga Sore',
                'slug' => 'daster-bunga-sore',
                'category_name' => 'Daster Rumahan',
                'description' => 'Bunga sore berwarna kuning pada dasar polos, pas untuk santai sore hari.',
                'material' => 'Katun rayon',
                'care' => 'Cuci terpisah dengan air dingin, jemur di tempat teduh. Cuci tangan atau mesin mode lembut, jangan diperas keras. Setrika suhu rendah dari sisi dalam kain.',
                'price' => 79000,
                'price_crossed' => null,
                'status' => 'tayang',
                'featured' => false,
            ],
            [
                'name' => 'Daster Melati Putih',
                'slug' => 'daster-melati-putih',
                'category_name' => 'Daster Rumahan',
                'description' => 'Melati putih berbunga kecil, ringan dan tidak gerah.',
                'material' => 'Rayon',
                'care' => 'Cuci terpisah dengan air dingin, jemur di tempat teduh. Cuci tangan atau mesin mode lembut, jangan diperas keras. Setrika suhu rendah dari sisi dalam kain.',
                'price' => 75000,
                'price_crossed' => null,
                'status' => 'tayang',
                'featured' => false,
            ],
            [
                'name' => 'Daster Kembang Sepatu Merah',
                'slug' => 'daster-kembang-sepatu-merah',
                'category_name' => 'Daster Rumahan',
                'description' => 'Kembang sepatu merah berukuran besar di atas kain yang adem.',
                'material' => 'Rayon adem',
                'care' => 'Cuci terpisah dengan air dingin, jemur di tempat teduh. Cuci tangan atau mesin mode lembut, jangan diperas keras. Setrika suhu rendah dari sisi dalam kain.',
                'price' => 85000,
                'price_crossed' => 99000,
                'status' => 'tayang',
                'featured' => false,
            ],
            [
                'name' => 'Daster Lurik Kunyit',
                'slug' => 'daster-lurik-kunyit',
                'category_name' => 'Daster Rumahan',
                'description' => 'Lurik kunyit bergaris vertikal, sederhana dan rapi.',
                'material' => 'Katun',
                'care' => 'Cuci terpisah dengan air dingin, jemur di tempat teduh. Cuci tangan atau mesin mode lembut, jangan diperas keras. Setrika suhu rendah dari sisi dalam kain.',
                'price' => 89000,
                'price_crossed' => null,
                'status' => 'tayang',
                'featured' => false,
            ],
            [
                'name' => 'Daster Polos Indigo',
                'slug' => 'daster-polos-indigo',
                'category_name' => 'Daster Rumahan',
                'description' => 'Polos indigo tanpa motif, All Size dengan potongan longgar.',
                'material' => 'Viscose',
                'care' => 'Cuci terpisah dengan air dingin, jemur di tempat teduh. Cuci tangan atau mesin mode lembut, jangan diperas keras. Setrika suhu rendah dari sisi dalam kain.',
                'price' => 79000,
                'price_crossed' => null,
                'status' => 'tayang',
                'featured' => false,
            ],
            [
                'name' => 'Daster Polos Pandan',
                'slug' => 'daster-polos-pandan',
                'category_name' => 'Daster Rumahan',
                'description' => 'Polos hijau pandan, All Size, mudah dipadukan dengan kerudung.',
                'material' => 'Rayon',
                'care' => 'Cuci terpisah dengan air dingin, jemur di tempat teduh. Cuci tangan atau mesin mode lembut, jangan diperas keras. Setrika suhu rendah dari sisi dalam kain.',
                'price' => 69000,
                'price_crossed' => null,
                'status' => 'tayang',
                'featured' => false,
            ],
            [
                'name' => 'Daster Garis Cabai',
                'slug' => 'daster-garis-cabai',
                'category_name' => 'Daster Rumahan',
                'description' => 'Garis tipis warna cabai di atas dasar putih.',
                'material' => 'Katun',
                'care' => 'Cuci terpisah dengan air dingin, jemur di tempat teduh. Cuci tangan atau mesin mode lembut, jangan diperas keras. Setrika suhu rendah dari sisi dalam kain.',
                'price' => 72000,
                'price_crossed' => null,
                'status' => 'tayang',
                'featured' => false,
            ],
            [
                'name' => 'Daster Kancing Depan Ceplok',
                'slug' => 'daster-kancing-depan-ceplok',
                'category_name' => 'Daster Kancing Depan',
                'description' => 'Kancing depan dengan motif ceplok merah bata, memudahkan dipakai dan dilepas.',
                'material' => 'Rayon',
                'care' => 'Cuci terpisah dengan air dingin, jemur di tempat teduh. Cuci tangan atau mesin mode lembut, jangan diperas keras. Setrika suhu rendah dari sisi dalam kain.',
                'price' => 105000,
                'price_crossed' => null,
                'status' => 'tayang',
                'featured' => true,
            ],
            [
                'name' => 'Daster Kancing Depan Abu Polos',
                'slug' => 'daster-kancing-depan-abu-polos',
                'category_name' => 'Daster Kancing Depan',
                'description' => 'Kancing depan abu polos, tampilan rapi tanpa motif.',
                'material' => 'Katun',
                'care' => 'Cuci terpisah dengan air dingin, jemur di tempat teduh. Cuci tangan atau mesin mode lembut, jangan diperas keras. Setrika suhu rendah dari sisi dalam kain.',
                'price' => 98000,
                'price_crossed' => null,
                'status' => 'tayang',
                'featured' => false,
            ],
            [
                'name' => 'Daster Kancing Depan Bunga Kecil',
                'slug' => 'daster-kancing-depan-bunga-kecil',
                'category_name' => 'Daster Kancing Depan',
                'description' => 'Kancing depan dengan bunga kecil, tersedia biru muda dan rose.',
                'material' => 'Rayon premium',
                'care' => 'Cuci terpisah dengan air dingin, jemur di tempat teduh. Cuci tangan atau mesin mode lembut, jangan diperas keras. Setrika suhu rendah dari sisi dalam kain.',
                'price' => 115000,
                'price_crossed' => null,
                'status' => 'tayang',
                'featured' => false,
            ],
            [
                'name' => 'Daster Kancing Depan Kotak Kunyit',
                'slug' => 'daster-kancing-depan-kotak-kunyit',
                'category_name' => 'Daster Kancing Depan',
                'description' => 'Kotak-kotak warna kunyit dengan kancing depan.',
                'material' => 'Katun',
                'care' => 'Cuci terpisah dengan air dingin, jemur di tempat teduh. Cuci tangan atau mesin mode lembut, jangan diperas keras. Setrika suhu rendah dari sisi dalam kain.',
                'price' => 92000,
                'price_crossed' => null,
                'status' => 'draf',
                'featured' => false,
            ],
            [
                'name' => 'Daster Lengan Panjang Tumpal',
                'slug' => 'daster-lengan-panjang-tumpal',
                'category_name' => 'Daster Lengan Panjang',
                'description' => 'Lengan panjang bermotif tumpal cokelat tua, untuk yang suka menutup lengan.',
                'material' => 'Rayon',
                'care' => 'Cuci terpisah dengan air dingin, jemur di tempat teduh. Cuci tangan atau mesin mode lembut, jangan diperas keras. Setrika suhu rendah dari sisi dalam kain.',
                'price' => 109000,
                'price_crossed' => null,
                'status' => 'tayang',
                'featured' => false,
            ],
            [
                'name' => 'Daster Lengan Panjang Sido Mukti',
                'slug' => 'daster-lengan-panjang-sido-mukti',
                'category_name' => 'Daster Lengan Panjang',
                'description' => 'Sido mukti hitam berlengan panjang, nuansa gelap yang tegas.',
                'material' => 'Viscose',
                'care' => 'Cuci terpisah dengan air dingin, jemur di tempat teduh. Cuci tangan atau mesin mode lembut, jangan diperas keras. Setrika suhu rendah dari sisi dalam kain.',
                'price' => 125000,
                'price_crossed' => 145000,
                'status' => 'tayang',
                'featured' => true,
            ],
            [
                'name' => 'Daster Lengan Panjang Hijau Lumut',
                'slug' => 'daster-lengan-panjang-hijau-lumut',
                'category_name' => 'Daster Lengan Panjang',
                'description' => 'Hijau lumut polos berlengan panjang, mudah dipadukan.',
                'material' => 'Katun rayon',
                'care' => 'Cuci terpisah dengan air dingin, jemur di tempat teduh. Cuci tangan atau mesin mode lembut, jangan diperas keras. Setrika suhu rendah dari sisi dalam kain.',
                'price' => 99000,
                'price_crossed' => null,
                'status' => 'tayang',
                'featured' => false,
            ],
            [
                'name' => 'Daster Jumbo Bunga Pagi',
                'slug' => 'daster-jumbo-bunga-pagi',
                'category_name' => 'Daster Rumahan',
                'description' => 'Bunga pagi untuk ukuran Jumbo, tersedia merah muda dan biru muda.',
                'material' => 'Rayon',
                'care' => 'Cuci terpisah dengan air dingin, jemur di tempat teduh. Cuci tangan atau mesin mode lembut, jangan diperas keras. Setrika suhu rendah dari sisi dalam kain.',
                'price' => 115000,
                'price_crossed' => null,
                'status' => 'arsip',
                'featured' => false,
            ],
        ];

        // Seed products
        foreach ($productsData as $productData) {
            // Find category
            $category = Category::where('name', $productData['category_name'])
                ->whereNull('deleted_at')
                ->first();

            if (!$category) {
                continue;
            }

            // Create or update product
            $product = Product::updateOrCreate(
                ['slug' => $productData['slug']],
                [
                    'category_id' => $category->id,
                    'name' => $productData['name'],
                    'description' => $productData['description'],
                    'material' => $productData['material'],
                    'care' => $productData['care'],
                    'price' => $productData['price'],
                    'price_crossed' => $productData['price_crossed'] ?? null,
                    'status' => $productData['status'],
                    'featured' => $productData['featured'],
                ]
            );

            // Generate variants and SKU for each product
            $this->generateVariants($product, $productData);

            // Generate product images
            $this->generateProductImages($product);
        }

        $this->command->info('20 produk contoh siap');
    }

    private function generateVariants($product, $productData): void
    {
        // Varian dari docs/seed-produk.md
        $varianList = [
            ['M', 'Biru tua', 12],
            ['L', 'Biru tua', 8],
            ['XL', 'Biru tua', 3],
            ['M', 'Cokelat', 10],
            ['L', 'Cokelat', 6],
            ['M', 'Biru laut', 9],
            ['L', 'Biru laut', 9],
            ['L', 'Putih gading', 4],
            ['XL', 'Putih gading', 2],
            ['All Size', 'Merah marun', 15],
            ['All Size', 'Hijau botol', 11],
            ['M', 'Hijau tua', 7],
            ['L', 'Hijau tua', 7],
            ['XL', 'Hijau tua', 7],
            ['S', 'Kuning', 6],
            ['M', 'Kuning', 10],
            ['L', 'Kuning', 10],
            ['XL', 'Kuning', 0],
            ['M', 'Putih', 14],
            ['L', 'Putih', 12],
            ['M', 'Merah', 5],
            ['L', 'Merah', 5],
            ['XL', 'Merah', 2],
            ['M', 'Kunyit', 8],
            ['L', 'Kunyit', 8],
            ['All Size', 'Indigo', 20],
            ['All Size', 'Hijau pandan', 0],
            ['All Size', 'Hijau muda', 0],
            ['M', 'Putih garis cabai', 6],
            ['L', 'Putih garis cabai', 6],
            ['XL', 'Putih garis cabai', 6],
            ['M', 'Merah bata', 7],
            ['L', 'Merah bata', 7],
            ['XL', 'Merah bata', 4],
            ['M', 'Abu', 10],
            ['L', 'Abu', 10],
            ['XL', 'Abu', 10],
            ['M', 'Biru muda', 6],
            ['L', 'Biru muda', 6],
            ['M', 'Rose', 6],
            ['M', 'Kunyit', 5],
            ['L', 'Kunyit', 5],
            ['M', 'Cokelat tua', 5],
            ['L', 'Cokelat tua', 5],
            ['XL', 'Cokelat tua', 3],
            ['M', 'Hitam', 4],
            ['L', 'Hitam', 4],
            ['XL', 'Hitam', 1],
            ['M', 'Hijau lumut', 9],
            ['L', 'Hijau lumut', 9],
            ['Jumbo', 'Merah muda', 6],
            ['Jumbo', 'Biru muda', 6],
        ];

        foreach ($varianList as $index => $variantData) {
            $sku = $this->generateSku($product->id, $index + 1, $variantData[0]);

            $variant = Variant::updateOrCreate(
                ['product_id' => $product->id, 'size' => $variantData[0], 'color' => $variantData[1]],
                [
                    'sku' => $sku,
                    'size' => $variantData[0],
                    'color' => $variantData[1],
                    'stok' => $variantData[2],
                    'stok_minimum' => 3,
                    'price' => $variantData[2] >= 0 ? $product->price : null,
                ]
            );
        }
    }

    private function generateSku($productId, $variantIndex, $size): string
    {
        $productNumber = str_pad($productId, 2, '0', STR_PAD_LEFT);
        $size = strtoupper($size);
        return "DS-{$productNumber}-{$size}-{$variantIndex}";
    }

    private function generateProductImages($product): void
    {
        $colors = ['#EAE3D3', '#DCE7DF', '#F7E7BE', '#F6DAD3', '#DCE8F3'];
        $baseDir = storage_path('app/public/produk-contoh');

        for ($i = 1; $i <= 3; $i++) {
            $colorIndex = ($product->id + $i) % 5;
            $color = $colors[$colorIndex];
            $path = "produk-contoh/{$product->slug}-{$i}.svg";

            // Create placeholder SVG content
            $svgContent = $this->generateSvgContent(
                $product->name,
                $color,
                $i,
                $product->id
            );

            // Save to storage
            Storage::disk('public')->put($path, $svgContent);

            // Save to database
            ProductImage::updateOrCreate(
                ['product_id' => $product->id, 'order' => $i],
                ['path' => $path]
            );
        }
    }

    private function generateSvgContent($productName, $color, $imageNumber, $productId): string
    {
        $maxTwoLines = $this->truncateText($productName, 2);
        $smallText = '[CONTOH] Foto belum tersedia';

        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<svg width=\"800\" height=\"1000\" xmlns=\"http://www.w3.org/2000/svg\">
    <rect width=\"100%\" height=\"100%\" fill=\"{$color}\" rx=\"5\" ry=\"5\"/>

    <text x=\"400\" y=\"100\" text-anchor=\"middle\" font-family=\"Arial, sans-serif\" font-size=\"24\" font-weight=\"bold\" fill=\"#1E1B18\">
        {$maxTwoLines}
    </text>

    <text x=\"400\" y=\"150\" text-anchor=\"middle\" font-family=\"Arial, sans-serif\" font-size=\"16\" fill=\"#1E1B18\">
        {$smallText}
    </text>

    <text x=\"400\" y=\"950\" text-anchor=\"middle\" font-family=\"Arial, sans-serif\" font-size=\"20\" fill=\"#1E1B18\">
        Foto {$imageNumber}/3
    </text>

    <line x1=\"50\" y1=\"980\" x2=\"750\" y2=\"980\" stroke=\"#000\" stroke-width=\"2\" stroke-dasharray=\"10,10\"/>
</svg>";
    }

    private function truncateText($text, $lines): string
    {
        $words = explode(' ', $text);
        $maxWords = $lines * 5; // Roughly 5 words per line
        $truncated = array_slice($words, 0, $maxWords);
        return implode(' ', $truncated);
    }
}