CREATE TABLE `google_sheets_syncs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sheet_id` varchar(255) NOT NULL,
	`sheet_name` varchar(255) NOT NULL,
	`category` varchar(50) NOT NULL,
	`last_synced_at` timestamp,
	`last_row_count` int DEFAULT 0,
	`sync_status` varchar(50) NOT NULL DEFAULT 'pending',
	`error_message` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `google_sheets_syncs_id` PRIMARY KEY(`id`),
	CONSTRAINT `google_sheets_syncs_sheet_id_unique` UNIQUE(`sheet_id`)
);
