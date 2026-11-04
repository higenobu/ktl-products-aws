CREATE TABLE `applications` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`request_id` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`company` text DEFAULT '' NOT NULL,
	`product` text NOT NULL,
	`purpose` text NOT NULL,
	`deployment` text NOT NULL,
	`team_size` text NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'received' NOT NULL,
	`consent_version` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `applications_user_request` ON `applications` (`user_id`,`request_id`);--> statement-breakpoint
CREATE INDEX `applications_user_date` ON `applications` (`user_id`,`created_at`);