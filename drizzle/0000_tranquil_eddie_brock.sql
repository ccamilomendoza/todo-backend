CREATE TABLE `users_table` (
	`create_at` text DEFAULT (current_timestamp) NOT NULL,
	`description` text NOT NULL,
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`status` text NOT NULL,
	`title` text NOT NULL
);
