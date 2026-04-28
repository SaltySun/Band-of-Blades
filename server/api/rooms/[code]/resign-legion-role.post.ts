import { getDb, schema, eq, and } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')?.toUpperCase()
  if (!code || code.length !== 6) {
    throw createError({ statusCode: 400, statusMessage: '无效的房间码' })
  }

  const body = await readBody(event)
  const { role } = body
  if (!role || typeof role !== 'string') {
    throw createError({ statusCode: 400, statusMessage: '缺少职务参数' })
  }

  const db = getDb()
  const room = await db.select().from(schema.rooms).where(eq(schema.rooms.code, code)).get()
  if (!room) {
    throw createError({ statusCode: 404, statusMessage: '房间不存在' })
  }

  // 找到担任该职务的角色
  const holder = await db.select()
    .from(schema.characters)
    .where(and(
      eq(schema.characters.roomId, room.id),
      eq(schema.characters.legionRole, role),
    ))
    .get()

  if (!holder) {
    throw createError({ statusCode: 404, statusMessage: '该职务当前无人担任' })
  }

  // 清除角色的 legionRole
  await db.update(schema.characters)
    .set({ legionRole: '' })
    .where(eq(schema.characters.id, holder.id))

  // 同时清除 legionState 中的对应名字字段
  const legion = await db.select().from(schema.legionState).where(eq(schema.legionState.roomId, room.id)).get()
  if (legion) {
    const updateData: Partial<typeof schema.legionState.$inferInsert> = { updatedAt: new Date() }
    switch (role) {
      case 'commander': updateData.commanderName = ''; break
      case 'marshal': updateData.marshalName = ''; break
      case 'quartermaster': updateData.quartermasterName = ''; break
      case 'lorekeeper': updateData.lorekeeperName = ''; break
      case 'spymaster': updateData.spymasterName = ''; break
    }
    await db.update(schema.legionState)
      .set(updateData)
      .where(eq(schema.legionState.roomId, room.id))
  }

  return { success: true, characterId: holder.id }
})
