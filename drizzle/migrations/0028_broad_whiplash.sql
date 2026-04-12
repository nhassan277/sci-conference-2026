CREATE TABLE `certificate_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name_on_certificate` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`affiliation` varchar(255) NOT NULL,
	`certificate_type` varchar(50) NOT NULL,
	`presentation_title` text,
	`presentation_type` varchar(50),
	`organization_role` text,
	`additional_notes` text,
	`status` varchar(30) NOT NULL DEFAULT 'pending',
	`admin_notes` text,
	`processed_by` varchar(255),
	`processed_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `certificate_requests_id` PRIMARY KEY(`id`)
);
