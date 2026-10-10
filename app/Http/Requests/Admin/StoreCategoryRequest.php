<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:2', Rule::unique('categories', 'name')->ignore($this->route('id'))],
            'slug' => ['required', 'string', 'regex:/^[a-z0-9_-]+$/', Rule::unique('categories', 'slug')->ignore($this->route('id'))],
            'parent_id' => ['nullable', 'exists:categories,id'],
        ];
    }
}
