import { getDb, schema, eq, and } from '../../../../utils/db'

export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')?.toUpperCase()
  const idParam = getRouterParam(event, 'id')
  const id = idParam ? parseInt(idParam, 10) : NaN

  if (!code || code.length !== 6) {
    throw createError({ statusCode: 400, statusMessage: '无效的房间码' })
  }
  if (Number.isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: '无效的角色ID' })
  }

  const db = getDb()
  const room = await db.select().from(schema.rooms).where(eq(schema.rooms.code, code)).get()

  if (!room) {
    throw createError({ statusCode: 404, statusMessage: '房间不存在' })
  }

  const character = await db.select().from(schema.characters).where(
    and(
      eq(schema.characters.id, id),
      eq(schema.characters.roomId, room.id),
    ),
  ).get()

  if (!character) {
    throw createError({ statusCode: 404, statusMessage: '角色不存在' })
  }

  return {
    success: true,
    character,
  }
})
