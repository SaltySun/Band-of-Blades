import { getDb, schema, eq } from '../../../utils/db'

interface SpyStatus {
  name: string
  skilled: boolean
  master: boolean
  injured: boolean
}

export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')?.toUpperCase()
  if (!code || code.length !== 6) {
    throw createError({ statusCode: 400, statusMessage: '无效的房间码' })
  }

  const body = await readBody(event)
  const { statuses } = body

  if (!Array.isArray(statuses)) {
    throw createError({ statusCode: 400, statusMessage: '缺少状态数据' })
  }

  const db = getDb()
  const room = await db.select().from(schema.rooms).where(eq(schema.rooms.code, code)).get()
  if (!room) {
    throw createError({ statusCode: 404, statusMessage: '房间不存在' })
  }

  await db.update(schema.legionState)
    .set({ spyStatuses: JSON.stringify(statuses), updatedAt: new Date() })
    .where(eq(schema.legionState.roomId, room.id))

  return { success: true, statuses }
})
