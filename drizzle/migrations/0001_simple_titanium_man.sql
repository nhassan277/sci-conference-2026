CREATE TABLE `sponsorships` (
	`id` int AUTO_INCREMENT NOT NULL,
	`company_name` varchar(255) NOT NULL,
	`contact_person` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(50) NOT NULL,
	`package_type` varchar(50) NOT NULL,
	`company_website` varchar(255),
	`message` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sponsorships_id` PRIMARY KEY(`id`)
);
