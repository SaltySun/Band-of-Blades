ALTER TABLE `legion_state` ADD `summer_time` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `legion_state` ADD `autumn_time` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `legion_state` ADD `winter_time` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `legion_state` ADD `spy_mission_reinforce` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `legion_state` ADD `spy_mission_expand` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `legion_state` ADD `spy_mission_trap` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `legion_state` ADD `spy_mission_recruit` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `legion_state` ADD `spy_mission_scout` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `legion_state` ADD `spy_network_unlocked` text DEFAULT '[]';--> statement-breakpoint
ALTER TABLE `legion_state` ADD `spy_statuses` text DEFAULT '[]';--> statement-breakpoint
ALTER TABLE `legion_state` ADD `marshal_state` text DEFAULT '{}';--> statement-breakpoint
ALTER TABLE `legion_state` ADD `quartermaster_state` text DEFAULT '{}';--> statement-breakpoint
ALTER TABLE `legion_state` ADD `lorekeeper_state` text DEFAULT '{}';
