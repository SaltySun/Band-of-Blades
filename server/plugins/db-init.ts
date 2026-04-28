import { createClient } from '@libsql/client'

export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig()
  const dbUrl = config.dbUrl || 'file:./data/campaign.db'
  
  // 确保data目录存在
  if (dbUrl.startsWith('file:')) {
    const fs = await import('fs')
    const path = await import('path')
    const dbPath = dbUrl.replace('file:', '')
    const dir = path.dirname(dbPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  }
  
  const client = createClient({ url: dbUrl })
  
  // 创建表（如果不存在）
  await client.execute(`
    CREATE TABLE IF NOT EXISTS rooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      gm_token TEXT NOT NULL,
      campaign_type TEXT NOT NULL DEFAULT 'summer',
      created_at INTEGER,
      updated_at INTEGER
    )
  `)
  
  await client.execute(`
    CREATE TABLE IF NOT EXISTS legion_state (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_id INTEGER NOT NULL,
      time INTEGER NOT NULL DEFAULT 0,
      summer_time INTEGER NOT NULL DEFAULT 0,
      autumn_time INTEGER NOT NULL DEFAULT 0,
      winter_time INTEGER NOT NULL DEFAULT 0,
      pressure INTEGER NOT NULL DEFAULT 0,
      intel INTEGER NOT NULL DEFAULT 0,
      morale INTEGER NOT NULL DEFAULT 0,
      supplies INTEGER NOT NULL DEFAULT 0,
      food INTEGER NOT NULL DEFAULT 0,
      black_shot INTEGER NOT NULL DEFAULT 0,
      horses INTEGER NOT NULL DEFAULT 0,
      religious_supplies INTEGER NOT NULL DEFAULT 0,
      laborers INTEGER NOT NULL DEFAULT 0,
      siege_weapons INTEGER NOT NULL DEFAULT 0,
      supply_wagons INTEGER NOT NULL DEFAULT 0,
      current_location TEXT DEFAULT '',
      commander_name TEXT DEFAULT '',
      marshal_name TEXT DEFAULT '',
      quartermaster_name TEXT DEFAULT '',
      lorekeeper_name TEXT DEFAULT '',
      spymaster_name TEXT DEFAULT '',
      quartermaster_state TEXT DEFAULT '{}',
      lorekeeper_state TEXT DEFAULT '{}',
      updated_at INTEGER
    )
  `)

  // 迁移：为旧表添加时间追踪列
  await client.execute(`ALTER TABLE legion_state ADD COLUMN summer_time INTEGER NOT NULL DEFAULT 0`).catch(() => {})
  await client.execute(`ALTER TABLE legion_state ADD COLUMN autumn_time INTEGER NOT NULL DEFAULT 0`).catch(() => {})
  await client.execute(`ALTER TABLE legion_state ADD COLUMN winter_time INTEGER NOT NULL DEFAULT 0`).catch(() => {})
  
  // 迁移：为旧表添加间谍长期任务列
  await client.execute(`ALTER TABLE legion_state ADD COLUMN spy_mission_reinforce INTEGER NOT NULL DEFAULT 0`).catch(() => {})
  await client.execute(`ALTER TABLE legion_state ADD COLUMN spy_mission_expand INTEGER NOT NULL DEFAULT 0`).catch(() => {})
  await client.execute(`ALTER TABLE legion_state ADD COLUMN spy_mission_trap INTEGER NOT NULL DEFAULT 0`).catch(() => {})
  await client.execute(`ALTER TABLE legion_state ADD COLUMN spy_mission_recruit INTEGER NOT NULL DEFAULT 0`).catch(() => {})
  await client.execute(`ALTER TABLE legion_state ADD COLUMN spy_mission_scout INTEGER NOT NULL DEFAULT 0`).catch(() => {})
  
  // 迁移：为旧表添加间谍网络解锁状态列
  await client.execute(`ALTER TABLE legion_state ADD COLUMN spy_network_unlocked TEXT DEFAULT '[]'`).catch(() => {})
  
  // 迁移：为旧表添加间谍名册状态列
  await client.execute(`ALTER TABLE legion_state ADD COLUMN spy_statuses TEXT DEFAULT '[]'`).catch(() => {})
  
  // 迁移：为旧表添加军士长状态列
  await client.execute(`ALTER TABLE legion_state ADD COLUMN marshal_state TEXT DEFAULT '{}'`).catch(() => {})
  
  await client.execute(`
    CREATE TABLE IF NOT EXISTS characters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_id INTEGER NOT NULL,
      player_name TEXT NOT NULL,
      name TEXT NOT NULL,
      culture TEXT NOT NULL,
      traits TEXT DEFAULT '[]',
      role TEXT NOT NULL,
      special_action TEXT NOT NULL,
      special_action_level INTEGER NOT NULL DEFAULT 1,
      abilities TEXT DEFAULT '[]',
      action_investigation INTEGER NOT NULL DEFAULT 0,
      action_marksmanship INTEGER NOT NULL DEFAULT 0,
      action_rigging INTEGER NOT NULL DEFAULT 0,
      action_sway INTEGER NOT NULL DEFAULT 0,
      action_scout INTEGER NOT NULL DEFAULT 0,
      action_discipline INTEGER NOT NULL DEFAULT 0,
      action_skirmish INTEGER NOT NULL DEFAULT 0,
      action_wreck INTEGER NOT NULL DEFAULT 0,
      action_maneuver INTEGER NOT NULL DEFAULT 0,
      action_command INTEGER NOT NULL DEFAULT 0,
      action_resolve INTEGER NOT NULL DEFAULT 0,
      xp_mental INTEGER NOT NULL DEFAULT 0,
      xp_physical INTEGER NOT NULL DEFAULT 0,
      xp_resolve INTEGER NOT NULL DEFAULT 0,
      harm_level_1 INTEGER NOT NULL DEFAULT 0,
      harm_level_2 INTEGER NOT NULL DEFAULT 0,
      harm_level_3 INTEGER NOT NULL DEFAULT 0,
      harm_level_4 INTEGER NOT NULL DEFAULT 0,
      stress INTEGER NOT NULL DEFAULT 0,
      stress_max INTEGER NOT NULL DEFAULT 6,
      traumas TEXT DEFAULT '[]',
      trauma_max INTEGER NOT NULL DEFAULT 2,
      rot_level INTEGER NOT NULL DEFAULT 0,
      rot_symptoms TEXT DEFAULT '[]',
      load TEXT NOT NULL DEFAULT 'medium',
      gear_slots TEXT DEFAULT '[]',
      loadout_choices TEXT DEFAULT '[]',
      armor INTEGER NOT NULL DEFAULT 0,
      legion_role TEXT DEFAULT '',
      is_dead INTEGER NOT NULL DEFAULT 0,
      is_rookie INTEGER NOT NULL DEFAULT 0,
      xp_total INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER,
      updated_at INTEGER
    )
  `)
  
  await client.execute(`
    CREATE TABLE IF NOT EXISTS deployments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      location TEXT NOT NULL,
      priority TEXT NOT NULL DEFAULT 'secondary',
      status TEXT NOT NULL DEFAULT 'pending',
      threat_level INTEGER NOT NULL DEFAULT 1,
      character_ids TEXT DEFAULT '[]',
      result TEXT,
      rewards TEXT DEFAULT '[]',
      penalties TEXT DEFAULT '[]',
      created_at INTEGER,
      completed_at INTEGER
    )
  `)
  
  await client.execute(`
    CREATE TABLE IF NOT EXISTS progress_clocks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      segments INTEGER NOT NULL DEFAULT 4,
      filled INTEGER NOT NULL DEFAULT 0,
      category TEXT NOT NULL DEFAULT 'mission',
      related_id INTEGER,
      created_at INTEGER
    )
  `)
  
  await client.execute(`
    CREATE TABLE IF NOT EXISTS chronicle_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      content TEXT NOT NULL,
      character_name TEXT,
      story_type TEXT,
      effect TEXT,
      created_at INTEGER
    )
  `)
  
  await client.execute(`
    CREATE TABLE IF NOT EXISTS action_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_id INTEGER NOT NULL,
      actor TEXT NOT NULL,
      action TEXT NOT NULL,
      target TEXT,
      result TEXT,
      timestamp INTEGER
    )
  `)
  
  await client.execute(`
    CREATE TABLE IF NOT EXISTS map_annotations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      data TEXT NOT NULL,
      created_by TEXT NOT NULL,
      created_at INTEGER
    )
  `)

  console.log('[DB Init] Database tables initialized')
})
