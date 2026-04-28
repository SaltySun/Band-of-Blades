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

  const body = await readBody(event)
  if (!body.type || !body.data || !body.createdBy) {
    throw createError({ statusCode: 400, statusMessage: '缺少必要字段' })
  }

  const result = await db.insert(schema.mapAnnotations).values({
    roomId: room.id,
    type: body.type,
    data: body.data,
    createdBy: body.createdBy,
  }).returning().get()

  return { success: true, annotation: result }
})
