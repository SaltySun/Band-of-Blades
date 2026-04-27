CREATE TABLE `action_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`room_id` integer NOT NULL,
	`actor` text NOT NULL,
	`action` text NOT NULL,
	`target` text,
	`result` text,
	`timestamp` integer,
	FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `characters` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`room_id` integer NOT NULL,
	`player_name` text NOT NULL,
	`name` text NOT NULL,
	`culture` text NOT NULL,
	`traits` text DEFAULT '[]' NOT NULL,
	`role` text NOT NULL,
	`special_action` text NOT NULL,
	`special_action_level` integer DEFAULT 1 NOT NULL,
	`abilities` text DEFAULT '[]' NOT NULL,
	`action_investigation` integer DEFAULT 0 NOT NULL,
	`action_marksmanship` integer DEFAULT 0 NOT NULL,
	`action_rigging` integer DEFAULT 0 NOT NULL,
	`action_sway` integer DEFAULT 0 NOT NULL,
	`action_scout` integer DEFAULT 0 NOT NULL,
	`action_discipline` integer DEFAULT 0 NOT NULL,
	`action_skirmish` integer DEFAULT 0 NOT NULL,
	`action_wreck` integer DEFAULT 0 NOT NULL,
	`action_maneuver` integer DEFAULT 0 NOT NULL,
	`action_command` integer DEFAULT 0 NOT NULL,
	`action_resolve` integer DEFAULT 0 NOT NULL,
	`xp_mental` integer DEFAULT 0 NOT NULL,
	`xp_physical` integer DEFAULT 0 NOT NULL,
	`xp_resolve` integer DEFAULT 0 NOT NULL,
	`harm_level_1` integer DEFAULT 0 NOT NULL,
	`harm_level_2` integer DEFAULT 0 NOT NULL,
	`harm_level_3` integer DEFAULT 0 NOT NULL,
	`harm_level_4` integer DEFAULT 0 NOT NULL,
	`stress` integer DEFAULT 0 NOT NULL,
	`stress_max` integer DEFAULT 6 NOT NULL,
	`traumas` text DEFAULT '[]' NOT NULL,
	`trauma_max` integer DEFAULT 2 NOT NULL,
	`rot_level` integer DEFAULT 0 NOT NULL,
	`rot_symptoms` text DEFAULT '[]' NOT NULL,
	`load` text DEFAULT 'medium' NOT NULL,
	`gear_slots` text DEFAULT '[]' NOT NULL,
	`armor` integer DEFAULT 0 NOT NULL,
	`legion_role` text DEFAULT '',
	`is_dead` integer DEFAULT false NOT NULL,
	`is_rookie` integer DEFAULT false NOT NULL,
	`xp_total` integer DEFAULT 0 NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `chronicle_entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`room_id` integer NOT NULL,
	`type` text NOT NULL,
	`content` text NOT NULL,
	`character_name` text,
	`story_type` text,
	`effect` text,
	`created_at` integer,
	FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `deployments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`room_id` integer NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`location` text NOT NULL,
	`priority` text DEFAULT 'secondary' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`threat_level` integer DEFAULT 1 NOT NULL,
	`character_ids` text DEFAULT '[]' NOT NULL,
	`result` text,
	`rewards` text DEFAULT '[]',
	`penalties` text DEFAULT '[]',
	`created_at` integer,
	`completed_at` integer,
	FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `legion_state` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`room_id` integer NOT NULL,
	`time` integer DEFAULT 0 NOT NULL,
	`pressure` integer DEFAULT 0 NOT NULL,
	`intel` integer DEFAULT 0 NOT NULL,
	`morale` integer DEFAULT 0 NOT NULL,
	`supplies` integer DEFAULT 0 NOT NULL,
	`food` integer DEFAULT 0 NOT NULL,
	`black_shot` integer DEFAULT 0 NOT NULL,
	`horses` integer DEFAULT 0 NOT NULL,
	`religious_supplies` integer DEFAULT 0 NOT NULL,
	`laborers` integer DEFAULT 0 NOT NULL,
	`siege_weapons` integer DEFAULT 0 NOT NULL,
	`supply_wagons` integer DEFAULT 0 NOT NULL,
	`current_location` text DEFAULT '',
	`commander_name` text DEFAULT '',
	`marshal_name` text DEFAULT '',
	`quartermaster_name` text DEFAULT '',
	`lorekeeper_name` text DEFAULT '',
	`spymaster_name` text DEFAULT '',
	`updated_at` integer,
	FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `progress_clocks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`room_id` integer NOT NULL,
	`name` text NOT NULL,
	`segments` integer DEFAULT 4 NOT NULL,
	`filled` integer DEFAULT 0 NOT NULL,
	`category` text DEFAULT 'mission' NOT NULL,
	`related_id` integer,
	`created_at` integer,
	FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `rooms` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`gm_token` text NOT NULL,
	`campaign_type` text DEFAULT 'summer' NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `rooms_code_unique` ON `rooms` (`code`);