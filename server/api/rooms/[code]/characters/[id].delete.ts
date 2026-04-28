import { getDb, schema, eq, and } from '../../../../utils/db'

export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')?.toUpperCase()
  const id = parseInt(getRouterParam(event, 'id') || '0', 10)

  if (!code || code.length !== 6) {
    throw createError({ statusCode: 400, statusMessage: '无效的房间码' })
  }
  if (!id || isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: '无效的角色ID' })
  }

  const db = getDb()
  const room = await db.select().from(schema.rooms).where(eq(schema.rooms.code, code)).get()

  if (!room) {
    throw createError({ statusCode: 404, statusMessage: '房间不存在' })
  }

  // 查找角色
  const character = await db.select()
    .from(schema.characters)
    .where(and(
      eq(schema.characters.id, id),
      eq(schema.characters.roomId, room.id),
    ))
    .get()

  if (!character) {
    throw createError({ statusCode: 404, statusMessage: '角色不存在' })
  }

  // 删除角色（不影响军团状态中绑定的玩家名）
  await db.delete(schema.characters)
    .where(and(
      eq(schema.characters.id, id),
      eq(schema.characters.roomId, room.id),
    ))

  // 记录日志
  await db.insert(schema.actionLogs).values({
    roomId: room.id,
    actor: character.playerName || character.name,
    action: 'delete_character',
    target: character.name,
    result: `角色 ${character.name} 已删除`,
  })

  return { success: true }
})
