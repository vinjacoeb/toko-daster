<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function index()
    {
        $settings = Setting::pluck('value', 'key')->toArray();

        return Inertia::render('KontakKami', [
            'title' => 'Kontak Kami',
            'settings' => [
                'alamat' => $settings['alamat'] ?? '[CONTOH] Alamat Toko',
                'jamBuka' => $settings['jam_buka'] ?? '[CONTOH] 08:00 - 17:00',
                'whatsappNumber' => $settings['whatsapp_number'] ?? '',
                'email' => $settings['email'] ?? '[CONTOH] info@toko.test',
                'instagram' => $settings['instagram'] ?? '[CONTOH] @toko_daster',
                'petaUrl' => $settings['peta_url'] ?? '#',
            ],
        ]);
    }

    public function store(Request $request)
    {
        // Rate limit: 3 per 10 menit
        $key = 'contact_rate_' . $request->ip();
        if (cache()->has($key)) {
            $count = cache()->get($key);
            if ($count >= 3) {
                return back()->withErrors(['general' => 'Terlalu banyak percobaan pengiriman pesan. Coba lagi dalam beberapa menit.']);
            }
        }

        $validated = $request->validate([
            'nama' => 'required|min:2',
            'kontak' => ['required', function ($attribute, $value, $fail) {
                if (!filter_var($value, FILTER_VALIDATE_EMAIL) && !preg_match('/^[0-9]{10,}$/', preg_replace('/[^0-9]/', '', $value))) {
                    $fail('Kontak wajib diisi dengan nomor HP atau email yang valid.');
                }
            }],
            'pesan' => 'required|max:1000',
            '_hp_field' => 'nullable|prohibited',
        ]);

        ContactMessage::create([
            'nama' => $validated['nama'],
            'kontak' => $validated['kontak'],
            'pesan' => $validated['pesan'],
            'ip' => $request->ip(),
        ]);

        // Increment rate limit
        cache()->put($key, (cache()->get($key, 0) + 1), 600);

        return back()->with('success', 'Terima kasih sudah menghubungi kami. Pesan Anda telah diterima dan kami balas secepatnya.');
    }
}
