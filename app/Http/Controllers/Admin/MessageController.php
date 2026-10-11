<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function index()
    {
        $messages = ContactMessage::orderBy('created_at', 'desc')->paginate(20);

        return Inertia::render('Admin/PesanMasuk/Index', [
            'title' => 'Pesan Masuk',
            'messages' => $messages,
        ]);
    }

    public function dibaca($id)
    {
        ContactMessage::findOrFail($id)->update(['dibaca_at' => now()]);
        return back()->with('success', 'Pesan ditandai dibaca.');
    }

    public function destroy($id)
    {
        ContactMessage::findOrFail($id)->delete();
        return back()->with('success', 'Pesan berhasil dihapus.');
    }
}
