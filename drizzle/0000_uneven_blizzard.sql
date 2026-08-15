CREATE TABLE `contact_guard` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ip_hash` text NOT NULL,
	`content_hash` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `contact_guard_ip_time_idx` ON `contact_guard` (`ip_hash`,`created_at`);--> statement-breakpoint
CREATE INDEX `contact_guard_content_time_idx` ON `contact_guard` (`content_hash`,`created_at`);--> statement-breakpoint
CREATE INDEX `contact_guard_time_idx` ON `contact_guard` (`created_at`);