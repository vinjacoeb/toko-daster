<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            if (!Schema::hasColumn('order_items', 'order_id')) {
                $table->foreignId('order_id')->constrained('orders')->onDelete('restrict');
            }
            if (!Schema::hasColumn('order_items', 'variant_id')) {
                $table->foreignId('variant_id')->constrained('variants')->onDelete('restrict');
            }
            if (!Schema::hasColumn('order_items', 'product_id')) {
                $table->foreignId('product_id')->nullable()->constrained('products')->onDelete('set null');
            }
            if (!Schema::hasColumn('order_items', 'nama')) {
                $table->string('nama')->nullable();
            }
            if (!Schema::hasColumn('order_items', 'warna')) {
                $table->string('warna')->nullable();
            }
            if (!Schema::hasColumn('order_items', 'ukuran')) {
                $table->string('ukuran')->nullable();
            }
            if (!Schema::hasColumn('order_items', 'harga')) {
                $table->integer('harga')->default(0);
            }
            if (!Schema::hasColumn('order_items', 'qty')) {
                $table->integer('qty')->default(1);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropForeign(['order_id']);
            $table->dropForeign(['variant_id']);
            if (Schema::hasColumn('order_items', 'product_id')) {
                $table->dropForeign(['product_id']);
            }
            $table->dropColumn([
                'order_id',
                'variant_id',
                'product_id',
                'nama',
                'warna',
                'ukuran',
                'harga',
                'qty'
            ]);
        });
    }
};
