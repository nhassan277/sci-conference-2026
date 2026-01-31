CREATE TABLE `committees` (
	`id` int AUTO_INCREMENT NOT NULL,
	`full_name` varchar(255) NOT NULL,
	`title` varchar(100) NOT NULL,
	`committee_type` varchar(50) NOT NULL,
	`department` varchar(255),
	`role` varchar(100),
	`email` varchar(255),
	`phone` varchar(50),
	`display_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `committees_id` PRIMARY KEY(`id`)
);
