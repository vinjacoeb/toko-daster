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
            // Missing columns from PRD
            $table->foreignId('order_id')->constrained('orders')->restrictOnDelete();
            $table->foreignId('variant_id')->constrained('variants')->restrictOnDelete();
            $table->foreignId('product_id')->constrained('products')->restrictOnDelete();
            $table->string('nama'); // snapshot
            $table->string('warna'); // snapshot
            $table->string('ukuran'); // snapshot
            $table->integer('harga')->unsigned(); // snapshot
            $table->integer('qty')->unsigned(); // quantity
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropForeign(['order_id', 'variant_id', 'product_id']);
            $table->dropColumn(['order_id', 'variant_id', 'product_id', 'nama', 'warna', 'ukuran', 'harga', 'qty']);
        });
    }
};
