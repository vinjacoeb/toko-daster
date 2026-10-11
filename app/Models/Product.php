<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Product extends Model
{
    use SoftDeletes;

    protected $table = 'products';

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'material',
        'care',
        'price',
        'price_crossed',
        'status',
        'featured',
        'sku',
        'weight',
        'image',
        'order',
        'stok',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('order');
    }

    public function variants(): HasMany
    {
        return $this->hasMany(Variant::class);
    }

    public function categories(): HasManyThrough
    {
        return $this->hasManyThrough(Category::class, ProductImage::class);
    }

    protected function casts(): array
    {
        return [
            'price' => 'integer',
            'price_crossed' => 'integer',
            'featured' => 'boolean',
            'status' => 'string',
        ];
    }

    public static function generateSlug(string $name): string
    {
        $slug = Str::slug($name);
        $original = $slug;
        $count = 1;
        while (self::where('slug', $slug)->whereNull('deleted_at')->exists()) {
            $slug = $original . '-' . $count++;
        }
        return $slug;
    }
}