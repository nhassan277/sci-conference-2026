ALTER TABLE `registrations` ADD `wants_ext_workshop` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `registrations` ADD `ext_workshop_choice` varchar(100);--> statement-breakpoint
ALTER TABLE `registrations` ADD `ext_workshop_invoice_url` varchar(500);--> statement-breakpoint
ALTER TABLE `registrations` ADD `ext_workshop_payment_status` varchar(20) DEFAULT 'unpaid' NOT NULL;