CREATE TABLE `announcements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`message` text NOT NULL,
	`message_ar` text,
	`type` varchar(20) NOT NULL DEFAULT 'info',
	`is_active` boolean NOT NULL DEFAULT true,
	`link` varchar(500),
	`link_text` varchar(100),
	`created_by` varchar(255) NOT NULL,
	`created_by_name` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `announcements_id` PRIMARY KEY(`id`)
);
