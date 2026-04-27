import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

// 战役房间
export const rooms = sqliteTable('rooms', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  code: text('code').notNull().unique(), // 6位房间码
  name: text('name').notNull(),
  gmToken: text('gm_token').notNull(), // GM管理密钥
  campaignType: text('campaign_type').notNull().default('summer'), // 战役类型
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

// 军团状态
export const legionState = sqliteTable('legion_state', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  roomId: integer('room_id').notNull().references(() => rooms.id, { onDelete: 'cascade' }),
  time: integer('time').notNull().default(0), // 时间进度
  pressure: integer('pressure').notNull().default(0), // 压力
  intel: integer('intel').notNull().default(0), // 情报
  morale: integer('morale').notNull().default(0), // 士气
  supplies: integer('supplies').notNull().default(0), // 补给
  food: integer('food').notNull().default(0), // 食物
  blackShot: integer('black_shot').notNull().default(0), // 黑弹
  horses: integer('horses').notNull().default(0), // 马匹
  religiousSupplies: integer('religious_supplies').notNull().default(0), // 宗教补给
  laborers: integer('laborers').notNull().default(0), // 劳工
  siegeWeapons: integer('siege_weapons').notNull().default(0), // 攻城武器
  supplyWagons: integer('supply_wagons').notNull().default(0), // 补给车
  currentLocation: text('current_location').default(''),
  commanderName: text('commander_name').default(''),
  marshalName: text('marshal_name').default(''),
  quartermasterName: text('quartermaster_name').default(''),
  lorekeeperName: text('lorekeeper_name').default(''),
  spymasterName: text('spymaster_name').default(''),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

// 角色
export const characters = sqliteTable('characters', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  roomId: integer('room_id').notNull().references(() => rooms.id, { onDelete: 'cascade' }),
  playerName: text('player_name').notNull(),
  name: text('name').notNull(),
  culture: text('culture').notNull(), // barta/panya/ald/zeremya
  traits: text('traits', { mode: 'json' }).$type<string[]>().notNull().default([]),
  role: text('role').notNull(), // heavy/medic/sniper/officer/scout/soldier/rookie
  specialAction: text('special_action').notNull(),
  specialActionLevel: integer('special_action_level').notNull().default(1),
  abilities: text('abilities', { mode: 'json' }).$type<string[]>().notNull().default([]),
  // 11种行动等级
  actionInvestigation: integer('action_investigation').notNull().default(0),
  actionMarksmanship: integer('action_marksmanship').notNull().default(0),
  actionRigging: integer('action_rigging').notNull().default(0),
  actionSway: integer('action_sway').notNull().default(0),
  actionScout: integer('action_scout').notNull().default(0),
  actionDiscipline: integer('action_discipline').notNull().default(0),
  actionSkirmish: integer('action_skirmish').notNull().default(0),
  actionWreck: integer('action_wreck').notNull().default(0),
  actionManeuver: integer('action_maneuver').notNull().default(0),
  actionCommand: integer('action_command').notNull().default(0),
  actionResolve: integer('action_resolve').notNull().default(0),
  // 行动经验
  xpMental: integer('xp_mental').notNull().default(0),
  xpPhysical: integer('xp_physical').notNull().default(0),
  xpResolve: integer('xp_resolve').notNull().default(0),
  // 伤害/压力/创伤
  harmLevel1: integer('harm_level_1').notNull().default(0),
  harmLevel2: integer('harm_level_2').notNull().default(0),
  harmLevel3: integer('harm_level_3').notNull().default(0),
  harmLevel4: integer('harm_level_4').notNull().default(0),
  stress: integer('stress').notNull().default(0),
  stressMax: integer('stress_max').notNull().default(6),
  traumas: text('traumas', { mode: 'json' }).$type<string[]>().notNull().default([]),
  traumaMax: integer('trauma_max').notNull().default(2),
  rotLevel: integer('rot_level').notNull().default(0),
  rotSymptoms: text('rot_symptoms', { mode: 'json' }).$type<string[]>().notNull().default([]),
  // 装备
  load: text('load').notNull().default('medium'), // light/medium/heavy
  gearSlots: text('gear_slots', { mode: 'json' }).$type<string[]>().notNull().default([]),
  armor: integer('armor').notNull().default(0),
  // 状态
  isDead: integer('is_dead', { mode: 'boolean' }).notNull().default(false),
  isRookie: integer('is_rookie', { mode: 'boolean' }).notNull().default(false),
  xpTotal: integer('xp_total').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

// 部署/任务
export const deployments = sqliteTable('deployments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  roomId: integer('room_id').notNull().references(() => rooms.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  type: text('type').notNull(), // assault/recon/supply/religious
  location: text('location').notNull(),
  priority: text('priority').notNull().default('secondary'), // primary/secondary
  status: text('status').notNull().default('pending'), // pending/active/completed/failed
  threatLevel: integer('threat_level').notNull().default(1),
  characterIds: text('character_ids', { mode: 'json' }).$type<number[]>().notNull().default([]),
  result: text('result'), // success/failure/mixed
  rewards: text('rewards', { mode: 'json' }).$type<string[]>().default([]),
  penalties: text('penalties', { mode: 'json' }).$type<string[]>().default([]),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
})

// 进程表
export const progressClocks = sqliteTable('progress_clocks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  roomId: integer('room_id').notNull().references(() => rooms.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  segments: integer('segments').notNull().default(4),
  filled: integer('filled').notNull().default(0),
  category: text('category').notNull().default('mission'), // mission/clock/rot
  relatedId: integer('related_id'), // 关联角色ID或部署ID
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

// 编年史条目
export const chronicleEntries = sqliteTable('chronicle_entries', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  roomId: integer('room_id').notNull().references(() => rooms.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // death/story/values/mission
  content: text('content').notNull(),
  characterName: text('character_name'),
  storyType: text('story_type'), // founding/independence/tempered/purpose/will
  effect: text('effect'), // 故事带来的增益效果
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

// 行动日志
export const actionLogs = sqliteTable('action_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  roomId: integer('room_id').notNull().references(() => rooms.id, { onDelete: 'cascade' }),
  actor: text('actor').notNull(), // 执行者名称
  action: text('action').notNull(),
  target: text('target'),
  result: text('result'),
  timestamp: integer('timestamp', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})
