import { getDb, schema, eq } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')?.toUpperCase()
  if (!code || code.length !== 6) {
    throw createError({ statusCode: 400, statusMessage: '无效的房间码' })
  }

  const body = await readBody(event)
  const { lorekeeperState } = body

  if (!lorekeeperState || typeof lorekeeperState !== 'object') {
    throw createError({ statusCode: 400, statusMessage: '缺少lorekeeperState' })
  }

  const db = getDb()
  const room = await db.select().from(schema.rooms).where(eq(schema.rooms.code, code)).get()
  if (!room) {
    throw createError({ statusCode: 404, statusMessage: '房间不存在' })
  }

  try {
    await db.update(schema.legionState)
      .set({ lorekeeperState: JSON.stringify(lorekeeperState), updatedAt: new Date() })
      .where(eq(schema.legionState.roomId, room.id))
  } catch (e: any) {
    // 如果字段不存在（旧数据库），尝试添加字段后重试
    if (e.message?.includes('no such column') || e.message?.includes('lorekeeper_state')) {
      const client = (db as any).$client
      if (client) {
        await client.execute("ALTER TABLE legion_state ADD COLUMN lorekeeper_state TEXT DEFAULT '{}'")
        await db.update(schema.legionState)
          .set({ lorekeeperState: JSON.stringify(lorekeeperState), updatedAt: new Date() })
          .where(eq(schema.legionState.roomId, room.id))
      } else {
        throw e
      }
    } else {
      throw e
    }
  }

  return { success: true }
})
