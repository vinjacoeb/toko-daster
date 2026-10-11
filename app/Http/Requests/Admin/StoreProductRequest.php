<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:2', Rule::unique('products', 'name')->ignore($this->route('id'))],
            'slug' => ['required', 'string', 'regex:/^[a-z0-9_-]+$/', Rule::unique('products', 'slug')->ignore($this->route('id'))],
            'category_id' => ['required', 'exists:categories,id'],
            'description' => ['nullable', 'string'],
            'material' => ['required', 'string'],
            'care' => ['required', 'string'],
            'price' => ['required', 'integer', 'min:0'],
            'price_crossed' => ['nullable', 'integer', 'gt:price'],
            'status' => ['required', Rule::in(['draf', 'tayang', 'arsip'])],
            'featured' => ['boolean'],
            'variants' => ['required', 'array', 'min:1'],
            'variants.*.ukuran' => ['required', Rule::in(['All Size', 'S', 'M', 'L', 'XL', 'Jumbo'])],
            'variants.*.warna' => ['required', 'string'],
            'variants.*.sku' => ['required', 'string'],
            'variants.*.stok' => ['required', 'integer', 'min:0'],
            'variants.*.stok_minimum' => ['required', 'integer', 'min:0'],
        ];
    }
}
