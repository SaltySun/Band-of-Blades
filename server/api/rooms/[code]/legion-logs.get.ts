import { getDb, schema, eq } from '../../../utils/db'
import { desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')?.toUpperCase()
  const query = getQuery(event)
  const roleFilter = query.role as string | undefined

  if (!code || code.length !== 6) {
    throw createError({ statusCode: 400, statusMessage: '无效的房间码' })
  }

  const db = getDb()
  const room = await db.select().from(schema.rooms).where(eq(schema.rooms.code, code)).get()
  if (!room) {
    throw createError({ statusCode: 404, statusMessage: '房间不存在' })
  }

  let q = db.select().from(schema.actionLogs)
    .where(eq(schema.actionLogs.roomId, room.id))
    .orderBy(desc(schema.actionLogs.timestamp))
    .limit(50)

  const logs = await q.all()

  // 按角色过滤（actor字段存储的是角色key）
  const filtered = roleFilter
    ? logs.filter(l => l.actor === roleFilter)
    : logs

  return { logs: filtered }
})
