PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_groups` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text UNIQUE,
	`categoryId` integer,
	CONSTRAINT `fk_subcategories_categoryId_categories_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`)
);
--> statement-breakpoint
INSERT INTO `__new_groups`(`id`, `name`, `categoryId`) SELECT `id`, `name`, `categoryId` FROM `groups`;--> statement-breakpoint
DROP TABLE `groups`;--> statement-breakpoint
ALTER TABLE `__new_groups` RENAME TO `groups`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_variants` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`hidden` integer NOT NULL,
	`asterites` integer,
	`trophyId` integer NOT NULL,
	`notes` text,
	`obteinable` integer DEFAULT true,
	`version` text,
	CONSTRAINT `fk_variants_trophyId_trophies_id_fk` FOREIGN KEY (`trophyId`) REFERENCES `trophies`(`id`)
);
--> statement-breakpoint
INSERT INTO `__new_variants`(`id`, `name`, `description`, `hidden`, `asterites`, `trophyId`, `notes`, `obteinable`, `version`) SELECT `id`, `name`, `description`, `hidden`, `asterites`, `trophyId`, `notes`, `obteinable`, `version` FROM `variants`;--> statement-breakpoint
DROP TABLE `variants`;--> statement-breakpoint
ALTER TABLE `__new_variants` RENAME TO `variants`;--> statement-breakpoint
PRAGMA foreign_keys=ON;