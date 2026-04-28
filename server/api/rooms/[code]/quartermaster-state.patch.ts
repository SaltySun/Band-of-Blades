import { getDb, schema, eq } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')?.toUpperCase()
  if (!code || code.length !== 6) {
    throw createError({ statusCode: 400, statusMessage: '无效的房间码' })
  }

  const body = await readBody(event)
  const { quartermasterState } = body

  if (!quartermasterState || typeof quartermasterState !== 'object') {
    throw createError({ statusCode: 400, statusMessage: '缺少quartermasterState' })
  }

  const db = getDb()
  const room = await db.select().from(schema.rooms).where(eq(schema.rooms.code, code)).get()
  if (!room) {
    throw createError({ statusCode: 404, statusMessage: '房间不存在' })
  }

  await db.update(schema.legionState)
    .set({ quartermasterState: JSON.stringify(quartermasterState), updatedAt: new Date() })
    .where(eq(schema.legionState.roomId, room.id))

  return { success: true }
})
