ALTER TABLE `registrations` ADD `certificate_invoice_url` varchar(500);--> statement-breakpoint
ALTER TABLE `registrations` ADD `wants_workshop` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `registrations` ADD `workshop_choice` varchar(50);--> statement-breakpoint
ALTER TABLE `registrations` ADD `workshop_invoice_url` varchar(500);--> statement-breakpoint
ALTER TABLE `registrations` ADD `workshop_payment_status` varchar(20) DEFAULT 'unpaid' NOT NULL;