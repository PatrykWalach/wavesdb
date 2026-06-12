CREATE TABLE `account` (
	`id` text PRIMARY KEY,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	CONSTRAINT `fk_account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL UNIQUE,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	CONSTRAINT `fk_session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
ALTER TABLE `users` RENAME TO `user`;--> statement-breakpoint
ALTER TABLE `user` ADD `name` text NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `email` text NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `email_verified` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `image` text;--> statement-breakpoint
ALTER TABLE `user` ADD `created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL;--> statement-breakpoint
ALTER TABLE `variants` ADD `hidden` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `variants` ADD `asterites` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `variants` ADD `notes` text;--> statement-breakpoint
ALTER TABLE `variants` ADD `obteinable` integer DEFAULT true;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`email` text NOT NULL UNIQUE,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_user`(`id`) SELECT `id` FROM `user`;--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
ALTER TABLE `__new_user` RENAME TO `user`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_variants` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`hidden` integer NOT NULL,
	`asterites` integer NOT NULL,
	`trophyId` integer NOT NULL,
	`notes` text,
	`obteinable` integer DEFAULT true,
	`version` text,
	CONSTRAINT `fk_variants_trophyId_trophies_id_fk` FOREIGN KEY (`trophyId`) REFERENCES `trophies`(`id`)
);
--> statement-breakpoint
INSERT INTO `__new_variants`(`id`, `name`, `description`, `trophyId`, `version`) SELECT `id`, `name`, `description`, `trophyId`, `version` FROM `variants`;--> statement-breakpoint
DROP TABLE `variants`;--> statement-breakpoint
ALTER TABLE `__new_variants` RENAME TO `variants`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_earned_trophies` (
	`trophyId` integer NOT NULL,
	`variantId` integer NOT NULL,
	`userId` text NOT NULL,
	CONSTRAINT `fk_earned_trophies_trophyId_trophies_id_fk` FOREIGN KEY (`trophyId`) REFERENCES `trophies`(`id`),
	CONSTRAINT `fk_earned_trophies_variantId_variants_id_fk` FOREIGN KEY (`variantId`) REFERENCES `variants`(`id`),
	CONSTRAINT `fk_earned_trophies_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`),
	CONSTRAINT `earned_trophies_trophyId_userId_unique` UNIQUE(`trophyId`,`userId`)
);
--> statement-breakpoint
INSERT INTO `__new_earned_trophies`(`trophyId`, `variantId`, `userId`) SELECT `trophyId`, `variantId`, `userId` FROM `earned_trophies`;--> statement-breakpoint
DROP TABLE `earned_trophies`;--> statement-breakpoint
ALTER TABLE `__new_earned_trophies` RENAME TO `earned_trophies`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_subcategories` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL UNIQUE,
	`categoryId` integer,
	CONSTRAINT `fk_subcategories_categoryId_categories_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`)
);
--> statement-breakpoint
INSERT INTO `__new_subcategories`(`id`, `name`, `categoryId`) SELECT `id`, `name`, `categoryId` FROM `subcategories`;--> statement-breakpoint
DROP TABLE `subcategories`;--> statement-breakpoint
ALTER TABLE `__new_subcategories` RENAME TO `subcategories`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);