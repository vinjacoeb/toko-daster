# Bug Report: Missing Columns in order_items Table causing QueryException

## Severity and Priority
- **Severity**: Critical (Breaks core functionality, causes runtime errors in Admin Dashboard)
- **Priority**: P0

## Component
- Backend / Database

## Environment
- URL: /admin
- Database: toko-daster
- Error: Illuminate\Database\QueryException: SQLSTATE[42S22]: Column not found: 1054 Unknown column 'order_items.qty' in 'field list'

## Steps to Reproduce
1. Navigate to the Admin Dashboard (`/admin`).
2. The application attempts to load the top products widget.
3. An exception is thrown by the `AdminDashboardController` due to a missing column in the `order_items` table.

## Expected Result
- The `order_items` table should have the columns defined in `docs/PRD.md`: `id`, `order_id`, `variant_id`, `nama`, `warna`, `ukuran`, `harga`, `qty`.
- The query in `AdminDashboardController` should execute successfully.

## Actual Result
- `order_items` table only contains `id` and `timestamps` columns.
- The SQL query fails with `Column not found`.

## Evidence
- Screenshot: `attachments/t_e90eb3e3/error7.png`
- Query in `AdminDashboardController.php`:
```php
$topProducts = OrderItem::selectRaw('products.name, SUM(order_items.qty) as total_sold')
    ->join('orders', 'order_items.order_id', '=', 'orders.id')
    ->join('products', 'order_items.product_id', '=', 'products.id')
    ...
```
- Migration `database/migrations/2026_10_09_065830_create_order_items_table.php` is incomplete.
