CREATE TABLE `registrations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`full_name_english` varchar(255) NOT NULL,
	`full_name_arabic` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(50) NOT NULL,
	`affiliation` varchar(255) NOT NULL,
	`attendee_category` varchar(50) NOT NULL,
	`participation_type` varchar(50) NOT NULL,
	`research_title` text,
	`research_abstract` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `registrations_id` PRIMARY KEY(`id`)
);
