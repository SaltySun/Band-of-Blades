import { createClient } from '@libsql/client'

export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig()
  const dbUrl = config.dbUrl || 'file:./data/campaign.db'

  // 文件数据库路径处理
  const url = dbUrl.startsWith('file:') ? dbUrl : dbUrl

  const client = createClient({ url })

  // 迁移：添加 lorekeeper_state 列到 legion_state 表
  try {
    await client.execute("ALTER TABLE legion_state ADD COLUMN lorekeeper_state TEXT DEFAULT '{}'")
    console.log('[db-migrate] 已添加 lorekeeper_state 列')
  } catch (e: any) {
    if (e.message?.includes('duplicate column') || e.message?.includes('already exists') || e.message?.includes('lorekeeper_state')) {
      // 列已存在或表不存在，忽略
    } else {
      console.warn('[db-migrate] 迁移失败:', e.message)
    }
  }

  await client.close()
})
