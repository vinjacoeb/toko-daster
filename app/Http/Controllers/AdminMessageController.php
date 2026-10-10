<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Inertia\Inertia;

class AdminMessageController extends Controller
{
    public function index()
    {
        $messages = ContactMessage::orderBy('created_at', 'desc')->paginate(20);

        return Inertia::render('AdminPesanMasuk', [
            'title' => 'Pesan Masuk',
            'messages' => $messages,
        ]);
    }
}
