# db.md — Skema Database Toko Daster

Dokumen ini berisi struktur tabel database berdasarkan migrasi yang ada.

## Tabel users
| Kolom | Tipe | Null | Default | FK | Komentar |
|-------|------|------|---------|-----|----------|
| id | bigIncrements | No | auto | — | Primary key |
| name | string | No | — | — | |
| email | string | No | — | — | Unique |
| email_verified_at | timestamp | Yes | null | — | |
| password | string | No | — | — | |
| remember_token | string | Yes | null | — | |
| created_at | timestamp | Yes | null | — | |
| updated_at | timestamp | Yes | null | — | |
| deleted_at | timestamp | Yes | null | — | Soft delete |

## Tabel sessions
| Kolom | Tipe | Null | Default | FK | Komentar |
|-------|------|------|---------|-----|----------|
| id | string | No | — | — | Primary key |
| user_id | foreignId | Yes | null | — | Index |
| ip_address | string(45)| Yes | null | — | |
| user_agent | text | Yes | null | — | |
| payload | longText | No | — | — | |
| last_activity | integer | No | — | — | Index |

## Tabel categories
| Kolom | Tipe | Null | Default | FK | Komentar |
|-------|------|------|---------|-----|----------|
| id | bigIncrements | No | auto | — | Primary key |
| parent_id | foreignId | Yes | null | FK → categories | Nullable, nullOnDelete |
| name | string | No | — | — | |
| slug | string | No | — | — | Unique |
| deleted_at | timestamp | Yes | null | — | Soft delete |
| created_at | timestamp | Yes | null | — | |
| updated_at | timestamp | Yes | null | — | |

## Tabel products
| Kolom | Tipe | Null | Default | FK | Komentar |
|-------|------|------|---------|-----|----------|
| id | bigIncrements | No | auto | — | Primary key |
| category_id | foreignId | No | — | FK → categories | RestrictOnDelete |
| name | string | No | — | — | |
| slug | string | No | — | — | Unique |
| description | text | Yes | null | — | |
| material | string | Yes | null | — | |
| care | string | Yes | null | — | |
| price | integer | No | — | — | |
| price_crossed | integer | Yes | null | — | |
| status | enum | No | 'draf' | — | 'draf', 'tayang', 'arsip' |
| featured | boolean | No | false | — | |
| deleted_at | timestamp | Yes | null | — | Soft delete |
| created_at | timestamp | Yes | null | — | |
| updated_at | timestamp | Yes | null | — | |

## Tabel product_images
| Kolom | Tipe | Null | Default | FK | Komentar |
|-------|------|------|---------|-----|----------|
| id | bigIncrements | No | auto | — | Primary key |
| product_id | foreignId | No | — | FK → products | CascadeOnDelete |
| path | string | No | — | — | |
| order | integer | No | 0 | — | |
| deleted_at | timestamp | Yes | null | — | Soft delete |
| created_at | timestamp | Yes | null | — | |
| updated_at | timestamp | Yes | null | — | |

## Tabel variants
| Kolom | Tipe | Null | Default | FK | Komentar |
|-------|------|------|---------|-----|----------|
| id | bigIncrements | No | auto | — | Primary key |
| product_id | foreignId | No | — | FK → products | CascadeOnDelete |
| sku | string | No | — | — | Unique |
| size | string | No | — | — | |
| color | string | No | — | — | |
| price | integer | Yes | null | — | |
| stock | integer | No | — | — | |
| stock_minimum | integer | No | 0 | — | |
| deleted_at | timestamp | Yes | null | — | Soft delete |
| created_at | timestamp | Yes | null | — | |
| updated_at | timestamp | Yes | null | — | |

## Tabel stock_movements
| Kolom | Tipe | Null | Default | FK | Komentar |
|-------|------|------|---------|-----|----------|
| id | bigIncrements | No | auto | — | Primary key |
| created_at | timestamp | Yes | null | — | |
| updated_at | timestamp | Yes | null | — | |

## Tabel orders
| Kolom | Tipe | Null | Default | FK | Komentar |
|-------|------|------|---------|-----|----------|
| id | bigIncrements | No | auto | — | Primary key |
| code | string | No | — | — | Unique |
| user_id | foreignId | Yes | null | FK → users | |
| customer_name | string | No | — | — | |
| customer_phone | string | No | — | — | |
| address | text | Yes | null | — | |
| channel | enum | No | — | — | 'whatsapp', 'marketplace', 'langsung' |
| status | enum | No | 'baru' | — | 'baru', 'dibayar', 'dikemas', 'dikirim', 'selesai', 'batal' |
| subtotal | integer | No | — | — | |
| shipping_cost | integer | No | 0 | — | |
| discount | integer | No | 0 | — | |
| total | integer | No | — | — | |
| tracking_number | string | Yes | null | — | |
| note | text | Yes | null | — | |
| ordered_at | timestamp | No | current_timestamp | — | |
| deleted_at | timestamp | Yes | null | — | Soft delete |
| created_at | timestamp | Yes | null | — | |
| updated_at | timestamp | Yes | null | — | |

## Tabel order_items
| Kolom | Tipe | Null | Default | FK | Komentar |
|-------|------|------|---------|-----|----------|
| id | bigIncrements | No | auto | — | Primary key |
| order_id | foreignId | No | — | FK → orders | restrictOnDelete |
| variant_id | foreignId | No | — | FK → variants | restrictOnDelete |
| product_id | foreignId | Yes | null | FK → products | setNullOnDelete |
| nama | string | Yes | null | — | Snapshot |
| warna | string | Yes | null | — | Snapshot |
| ukuran | string | Yes | null | — | Snapshot |
| harga | integer | No | 0 | — | Snapshot |
| qty | integer | No | 1 | — | |
| deleted_at | timestamp | Yes | null | — | Soft delete |
| created_at | timestamp | Yes | null | — | |
| updated_at | timestamp | Yes | null | — | |

## Tabel contact_messages
| Kolom | Tipe | Null | Default | FK | Komentar |
|-------|------|------|---------|-----|----------|
| id | bigIncrements | No | auto | — | Primary key |
| nama | string | No | — | — | |
| kontak | string | No | — | — | |
| pesan | text | No | — | — | |
| dibaca_at | timestamp | Yes | null | — | |
| ip | string | Yes | null | — | |
| created_at | timestamp | Yes | null | — | |
| updated_at | timestamp | Yes | null | — | |

## Tabel contact_message_comments
| Kolom | Tipe | Null | Default | FK | Komentar |
|-------|------|------|---------|-----|----------|
| id | bigIncrements | No | auto | — | Primary key |
| contact_message_id | foreignId | No | — | FK → contact_messages | cascadeOnDelete |
| user_id | foreignId | No | — | FK → users | restrictOnDelete |
| isi | text | No | — | — | Maks 1.000 |
| created_at | timestamp | Yes | null | — | |
| updated_at | timestamp | Yes | null | — | |

## Tabel settings
| Kolom | Tipe | Null | Default | FK | Komentar |
|-------|------|------|---------|-----|----------|
| id | bigIncrements | No | auto | — | Primary key |
| key | string | No | — | — | Unique |
| value | text | Yes | null | — | |
| created_at | timestamp | Yes | null | — | |
| updated_at | timestamp | Yes | null | — | |

