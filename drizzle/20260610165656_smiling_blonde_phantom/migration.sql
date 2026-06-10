CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL UNIQUE
);
--> statement-breakpoint
CREATE TABLE `earned_trophies` (
	`trophyId` integer NOT NULL,
	`variantId` integer NOT NULL,
	`userId` integer NOT NULL,
	CONSTRAINT `fk_earned_trophies_trophyId_trophies_id_fk` FOREIGN KEY (`trophyId`) REFERENCES `trophies`(`id`),
	CONSTRAINT `fk_earned_trophies_variantId_variants_id_fk` FOREIGN KEY (`variantId`) REFERENCES `variants`(`id`),
	CONSTRAINT `fk_earned_trophies_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`),
	CONSTRAINT `earned_trophies_trophyId_userId_unique` UNIQUE(`trophyId`,`userId`)
);
--> statement-breakpoint
CREATE TABLE `subcategories` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL UNIQUE,
	`categoryId` integer NOT NULL,
	CONSTRAINT `fk_subcategories_categoryId_categories_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`)
);
--> statement-breakpoint
CREATE TABLE `trophies` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`subcategoryId` integer NOT NULL,
	CONSTRAINT `fk_trophies_subcategoryId_subcategories_id_fk` FOREIGN KEY (`subcategoryId`) REFERENCES `subcategories`(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT
);
--> statement-breakpoint
CREATE TABLE `variants` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL UNIQUE,
	`description` text NOT NULL,
	`trophyId` integer NOT NULL,
	`version` integer NOT NULL,
	CONSTRAINT `fk_variants_trophyId_trophies_id_fk` FOREIGN KEY (`trophyId`) REFERENCES `trophies`(`id`)
);
