<?php

namespace Database\Seeders;

use App\Models\ContactMessage;
use App\Models\ContactMessageComment;
use App\Models\User;
use Illuminate\Database\Seeder;

class ContactMessageCommentSeeder extends Seeder
{
    public function run(): void
    {
        if (!app()->isLocal()) {
            return;
        }

        $admin = User::where('email', 'admin@example.com')->first();
        if (!$admin) {
            return;
        }

        $pesan = ContactMessage::all();
        foreach ($pesan as $p) {
            // [CONTOH] Menambahkan komentar pada pesan secara acak
            if (rand(0, 1)) {
                ContactMessageComment::updateOrCreate(
                    ['contact_message_id' => $p->id, 'user_id' => $admin->id],
                    ['isi' => '[CONTOH] Tanggapan admin terkait pesan ini.']
                );
            }
        }
    }
}
