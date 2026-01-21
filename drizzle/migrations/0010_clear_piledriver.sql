CREATE TABLE `newsletter_subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`name` varchar(255),
	`subscribed_at` timestamp NOT NULL DEFAULT (now()),
	`is_active` boolean NOT NULL DEFAULT true,
	`unsubscribed_at` timestamp,
	`source` varchar(50) NOT NULL DEFAULT 'website',
	CONSTRAINT `newsletter_subscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `newsletter_subscriptions_email_unique` UNIQUE(`email`)
);
