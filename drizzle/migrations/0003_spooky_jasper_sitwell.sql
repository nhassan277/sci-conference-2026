ALTER TABLE `registrations` ADD `wants_certificate` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `registrations` ADD `payment_status` varchar(20) DEFAULT 'unpaid' NOT NULL;--> statement-breakpoint
ALTER TABLE `registrations` ADD `stripe_payment_intent_id` varchar(255);--> statement-breakpoint
ALTER TABLE `registrations` ADD `stripe_checkout_session_id` varchar(255);--> statement-breakpoint
ALTER TABLE `registrations` ADD `paid_at` timestamp;