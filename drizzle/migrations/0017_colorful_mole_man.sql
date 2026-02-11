ALTER TABLE `sponsorships` ADD `status` varchar(50) DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE `sponsorships` ADD `logo_url` varchar(500);--> statement-breakpoint
ALTER TABLE `sponsorships` ADD `banner_url` varchar(500);--> statement-breakpoint
ALTER TABLE `sponsorships` ADD `brochure_url` varchar(500);--> statement-breakpoint
ALTER TABLE `sponsorships` ADD `workshop_materials_url` varchar(500);--> statement-breakpoint
ALTER TABLE `sponsorships` ADD `company_description` text;--> statement-breakpoint
ALTER TABLE `sponsorships` ADD `materials_uploaded_at` timestamp;--> statement-breakpoint
ALTER TABLE `sponsorships` ADD `updated_at` timestamp DEFAULT (now()) NOT NULL;