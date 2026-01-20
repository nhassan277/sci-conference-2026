CREATE TABLE `reminder_subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`subscribed_at` timestamp NOT NULL DEFAULT (now()),
	`reminder_sent` boolean NOT NULL DEFAULT false,
	`reminder_sent_at` timestamp,
	`unsubscribed` boolean NOT NULL DEFAULT false,
	`unsubscribed_at` timestamp,
	CONSTRAINT `reminder_subscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `reminder_subscriptions_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `survey_responses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`survey_id` int NOT NULL,
	`registration_id` int NOT NULL,
	`answers` json NOT NULL,
	`sentiment` varchar(20),
	`sentiment_score` int,
	`ip_address` varchar(45),
	`submitted_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `survey_responses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `surveys` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`questions` json NOT NULL,
	`status` varchar(20) NOT NULL DEFAULT 'draft',
	`scheduled_send_date` timestamp,
	`sent_at` timestamp,
	`created_by` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `surveys_id` PRIMARY KEY(`id`)
);
