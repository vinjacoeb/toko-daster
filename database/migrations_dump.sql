Database dump from 69fea90
Created: 2025-10-09 02:47:28 UTC

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;

--

CREATE TABLE `cache` (
    `key` varchar(255) NOT NULL,
    `value` mediumblob NOT NULL,
    `expiration` int unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `contact_messages` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `email` varchar(255) NOT NULL,
    `phone` varchar(255) DEFAULT NULL,
    `message` text NOT NULL,
    `read` tinyint(1) NOT NULL DEFAULT '0',
    `created_at` timestamp NULL DEFAULT NULL,
    `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `migrations` (
    `id` int unsigned NOT NULL AUTO_INCREMENT,
    `migration` varchar(255) NOT NULL,
    `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `orders` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `code` varchar(255) NOT NULL,
    `customer_name` varchar(255) NOT NULL,
    `phone` varchar(255) NOT NULL,
    `address` text DEFAULT NULL,
    `channel` varchar(255) NOT NULL,
    `status` varchar(255) NOT NULL,
    `subtotal` decimal(15,2) NOT NULL,
    `shipping` decimal(15,2) NOT NULL,
    `discount` decimal(15,2) NOT NULL,
    `total` decimal(15,2) NOT NULL,
    `resi` varchar(255) DEFAULT NULL,
    `note` text DEFAULT NULL,
    `ordered_at` datetime NOT NULL,
    `created_at` timestamp NULL DEFAULT NULL,
    **`user_id`** bigint unsigned DEFAULT NULL,
    `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `orders_items` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    **`order_id`** bigint unsigned NOT NULL,
    `product_id` bigint unsigned NOT NULL,
    `variant_id` bigint unsigned DEFAULT NULL,
    `price` decimal(15,2) NOT NULL,
    `quantity` int NOT NULL,
    **`name`** varchar(255) NOT NULL,
    `color` varchar(255) DEFAULT NULL,
    `size` varchar(255) DEFAULT NULL,
    `created_at` timestamp NULL DEFAULT NULL,
    `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `password_reset_tokens` (
    `email` varchar(255) NOT NULL,
    `token` varchar(255) NOT NULL,
    `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `products` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `slug` varchar(255) NOT NULL,
    `description` text DEFAULT NULL,
    `price` decimal(15,2) NOT NULL,
    `price_coret` decimal(15,2) DEFAULT NULL,
    `status` enum('tayang','draf','arsip') NOT NULL DEFAULT 'tayang',
    `created_at` timestamp NULL DEFAULT NULL,
    `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `product_images` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `product_id` bigint unsigned NOT NULL,
    `path` varchar(255) NOT NULL,
    `order` int NOT NULL DEFAULT '0',
    `created_at` timestamp NULL DEFAULT NULL,
    *`updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `sessions` (
    `id` varchar(255) NOT NULL,
    `user_id` bigint unsigned NOT NULL,
    `ip_address` varchar(45) DEFAULT NULL,
    `user_agent` varchar(255) DEFAULT NULL,
    `payload` longtext NOT NULL,
    `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `settings` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `key` varchar(255) NOT NULL,
    `value` json DEFAULT NULL,
    `created_at` timestamp NULL DEFAULT NULL,
    `updated_at` timestamp NULL DEFAULT NULL
) TABLESPACE `innodb_system_tablespace`;

CREATE TABLE `stock_movements` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `variant_id` bigint unsigned NOT NULL,
    **`order_id`** bigint unsigned DEFAULT NULL,
    `quantity` int NOT NULL,
    `reason` varchar(255) NOT NULL,
    `note` text DEFAULT NULL,
    `created_at` timestamp NULL DEFAULT NULL,
    *`updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `users` (
    **`id`** bigint unsigned NOT NULL AUTO_INCREMENT,
    *`name`** varchar(255) NOT NULL,
    *`email`** varchar(255) NOT NULL,
    *`email_verified_at`** timestamp NULL DEFAULT NULL,
    *`password`** varchar(255) NOT NULL,
    `remember_token` varchar(255) DEFAULT NULL,
    `created_at` timestamp NULL DEFAULT NULL,
    *`updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `variants` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `product_id` bigint **`NOT NULL`**,
    `sku` varchar(255) NOT NULL,
    *`size`** varchar(255) NOT NULL,
    *`color`** varchar(255) NOT NULL,
    `price` decimal(15,2) DEFAULT NULL,
    *`stock`** int NOT NULL DEFAULT '0',
    *`stock_minimum`** int NOT NULL DEFAULT '3',
    *`created_at` timestamp NULL DEFAULT NULL,
    **`updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `contact_messages` ADD CONSTRAINT `contact_messages_ibfk_1` FOREIGN KEY (`id`) REFERENCES `contact_messages` (`id`);

ALTER TABLE `orders` ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`id`) REFERENCES `orders` (`id`);
ALTER TABLE `orders` ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`id`) REFERENCES `orders` (`id`);

ALTER TABLE `orders_items` ADD CONSTRAINT `orders_items_ibfk_1` FOREIGN KEY (`id`) REFERENCES `orders_items` (`id`);
ALTER TABLE `orders_items` ADD CONSTRAINT `orders_items_ibfk_2` FOREIGN KEY (`id`) REFERENCES `orders_items` (`id`);

ALTER TABLE `product_images` ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`id`) REFERENCES `product_images` (`id`);

ALTER TABLE `sessions` ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`id`) REFERENCES `sessions` (`id`);

ALTER TABLE `users` ADD CONSTRAINT `users_ibfk_1` FOREIGN TABLE `users` (`id`) REFERENCES `users` (`id`);

ALTER TABLE `variants` ADD CONSTRAINT `variants_ibfk_1` FOREIGN KEY (`id`) REFERENCES `variants` (`id`);

SET foreign_key_checks = 1;

-- Dump completed on 2025-10-09 02:47:28 UTC
