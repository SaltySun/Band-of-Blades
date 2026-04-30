import { getDb, schema, eq } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')?.toUpperCase()
  if (!code || code.length !== 6) {
    throw createError({ statusCode: 400, statusMessage: '无效的房间码' })
  }

  const db = getDb()
  const room = await db.select().from(schema.rooms).where(eq(schema.rooms.code, code)).get()
  if (!room) {
    throw createError({ statusCode: 404, statusMessage: '房间不存在' })
  }

  const annotations = await db.select().from(schema.mapAnnotations)
    .where(eq(schema.mapAnnotations.roomId, room.id))
    .orderBy(schema.mapAnnotations.createdAt)
    .all()

  return { success: true, annotations }
})
