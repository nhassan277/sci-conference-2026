ALTER TABLE `registrations` ADD `source_sheet_id` varchar(255);--> statement-breakpoint
ALTER TABLE `registrations` ADD `source_row_index` int;--> statement-breakpoint
ALTER TABLE `registrations` ADD `raw_form_data` json;--> statement-breakpoint
ALTER TABLE `registrations` ADD `updated_at` timestamp DEFAULT (now()) NOT NULL;