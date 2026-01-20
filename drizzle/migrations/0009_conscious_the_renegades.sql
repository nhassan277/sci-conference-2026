CREATE TABLE `gallery_photos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`title_ar` varchar(255),
	`description` text,
	`description_ar` text,
	`image_url` varchar(500) NOT NULL,
	`image_key` varchar(500) NOT NULL,
	`thumbnail_url` varchar(500),
	`category` varchar(100) NOT NULL,
	`uploaded_by` varchar(255) NOT NULL,
	`uploader_name` varchar(255) NOT NULL,
	`uploaded_at` timestamp NOT NULL DEFAULT (now()),
	`is_visible` boolean NOT NULL DEFAULT true,
	CONSTRAINT `gallery_photos_id` PRIMARY KEY(`id`)
);
