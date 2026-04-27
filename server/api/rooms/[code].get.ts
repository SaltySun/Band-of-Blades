import { getDb, schema, eq } from '../../utils/db'

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

  // 获取军团状态
  const legion = await db.select().from(schema.legionState).where(eq(schema.legionState.roomId, room.id)).get()

  return {
    success: true,
    room: {
      id: room.id,
      code: room.code,
      name: room.name,
      campaignType: room.campaignType,
      createdAt: room.createdAt,
    },
    legion: legion || null,
  }
})
