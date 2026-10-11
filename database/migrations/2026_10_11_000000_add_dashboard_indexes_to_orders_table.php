<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Indeks untuk agregasi dashboard/laporan: filter status + rentang dipesan_at.
        Schema::table('orders', function (Blueprint $table) {
            $table->index(['status', 'dipesan_at'], 'orders_status_dipesan_at_index');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex('orders_status_dipesan_at_index');
        });
    }
};
