CREATE TABLE `content_entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`summary` text DEFAULT '' NOT NULL,
	`body` text DEFAULT '' NOT NULL,
	`metadata` text DEFAULT '{}' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`published_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
CREATE UNIQUE INDEX `content_entries_slug_unique` ON `content_entries` (`slug`);
CREATE INDEX `content_entries_type_status_idx` ON `content_entries` (`type`,`status`);
CREATE INDEX `content_entries_sort_idx` ON `content_entries` (`type`,`sort_order`);
CREATE TABLE `admin_audit` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`actor` text NOT NULL,
	`action` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` integer,
	`created_at` integer NOT NULL
);
