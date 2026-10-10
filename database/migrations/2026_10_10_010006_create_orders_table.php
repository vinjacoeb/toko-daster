<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->foreignId('user_id')->nullable()->constrained('users');
            $table->string('customer_name');
            $table->string('customer_phone');
            $table->text('address')->nullable();
            $table->enum('channel', ['whatsapp', 'marketplace', 'langsung']);
            $table->enum('status', ['baru', 'dibayar', 'dikemas', 'dikirim', 'selesai', 'batal'])->default('baru');
            $table->integer('subtotal');
            $table->integer('shipping_cost')->default(0);
            $table->integer('discount')->default(0);
            $table->integer('total');
            $table->string('tracking_number')->nullable();
            $table->text('note')->nullable();
            $table->timestamp('ordered_at')->useCurrent();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
