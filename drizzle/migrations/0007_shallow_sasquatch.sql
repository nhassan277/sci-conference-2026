CREATE TABLE `digest_preferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`admin_id` int NOT NULL,
	`email` varchar(255) NOT NULL,
	`frequency` varchar(20) NOT NULL,
	`enabled` boolean NOT NULL DEFAULT true,
	`last_sent_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `digest_preferences_id` PRIMARY KEY(`id`)
);
