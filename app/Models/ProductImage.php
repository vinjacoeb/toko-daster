<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['product_id', 'path', 'order'])]
#[Hidden(['deleted_at'])]
class ProductImage extends Model
{
    use SoftDeletes;

    protected $table = 'product_images';

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}