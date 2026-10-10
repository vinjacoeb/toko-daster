<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;


class Order extends Model
{
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
        'user_id',
    ];

    protected $casts = [
        'ordered_at' => 'datetime',
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

class OrderItem extends Model
{
    protected $table = 'order_items';

    #[Fillable([
        'order_id',
        'variant_id',
        'product_id',
        'price',
        'quantity',
        'nama',
        'warna',
        'ukuran',
    ])]
    #[Hidden(['deleted_at'])]
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function variant(): BelongsTo
    {
        return $this->belongsTo(Variant::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}