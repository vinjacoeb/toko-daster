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
        Schema::table('orders', function (Blueprint $table) {
            $table->string('code')->unique()->after('id');
            $table->foreignId('user_id')->nullable()->constrained()->after('code');
            $table->string('customer_name')->after('user_id');
            $table->string('customer_phone')->after('customer_name');
            $table->text('address')->nullable()->after('customer_phone');
            $table->enum('channel', ['whatsapp', 'marketplace', 'langsung'])->after('address');
            $table->enum('status', ['baru', 'dibayar', 'dikemas', 'dikirim', 'selesai', 'batal'])->default('baru')->after('channel');
            $table->integer('subtotal')->after('status');
            $table->integer('shipping_cost')->default(0)->after('subtotal');
            $table->integer('discount')->default(0)->after('shipping_cost');
            $table->integer('total')->after('discount');
            $table->string('tracking_number')->nullable()->after('total');
            $table->text('note')->nullable()->after('tracking_number');
            $table->timestamp('ordered_at')->useCurrent()->after('note');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn([
                'code', 'user_id', 'customer_name', 'customer_phone', 'address', 'channel', 'status',
                'subtotal', 'shipping_cost', 'discount', 'total', 'tracking_number', 'note', 'ordered_at'
            ]);
        });
    }
};
