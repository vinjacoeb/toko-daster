<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;


class Order extends Model
{
    // Bersihkan duplikat deklarasi OrderItem yang salah

    protected $table = 'orders';

    protected $fillable = [
        'code',
        'customer_name',
        'customer_phone',
        'address',
        'channel',
        'status',
        'subtotal',
        'shipping_cost',
        'discount',
        'total',
        'tracking_number',
        'note',
        'ordered_at',
        'dipesan_at',
        'user_id',
    ];

    protected $casts = [
        'ordered_at' => 'datetime',
        'dipesan_at' => 'datetime',
        'subtotal' => 'integer',
        'shipping_cost' => 'integer',
        'discount' => 'integer',
        'total' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}