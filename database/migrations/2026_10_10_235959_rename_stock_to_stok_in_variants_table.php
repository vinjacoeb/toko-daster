<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('variants', function (Blueprint $table) {
            $table->integer('stok')->default(0);
            $table->integer('stok_minimum')->default(0);
        });

        DB::statement('UPDATE variants SET stok = stock, stok_minimum = stock_minimum');

        Schema::table('variants', function (Blueprint $table) {
            $table->dropColumn('stock');
            $table->dropColumn('stock_minimum');
        });
    }

    public function down(): void
    {
        Schema::table('variants', function (Blueprint $table) {
            $table->integer('stock')->default(0);
            $table->integer('stock_minimum')->default(0);
        });

        DB::statement('UPDATE variants SET stock = stok, stock_minimum = stok_minimum');

        Schema::table('variants', function (Blueprint $table) {
            $table->dropColumn('stok');
            $table->dropColumn('stok_minimum');
        });
    }
};
