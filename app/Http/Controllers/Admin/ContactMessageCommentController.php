<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\ContactMessageComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ContactMessageCommentController extends Controller
{
    public function store(Request $request, ContactMessage $pesan)
    {
        $validated = $request->validate([
            'isi' => 'required|string|max:1000',
        ]);

        $pesan->comments()->create([
            'user_id' => Auth::id(),
            'isi' => $validated['isi'],
        ]);

        return back()->with('success', 'Komentar berhasil ditambahkan.');
    }
}
