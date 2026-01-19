ALTER TABLE `registrations` ADD `checked_in` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `registrations` ADD `checked_in_at` timestamp;--> statement-breakpoint
ALTER TABLE `registrations` ADD `checked_in_by` varchar(255);