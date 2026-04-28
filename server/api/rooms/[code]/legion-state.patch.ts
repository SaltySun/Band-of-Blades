import { getDb, schema, eq } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')?.toUpperCase()
  if (!code || code.length !== 6) {
    throw createError({ statusCode: 400, statusMessage: '无效的房间码' })
  }

  const body = await readBody(event)
  const { field, value } = body

  if (!field || typeof value !== 'number') {
    throw createError({ statusCode: 400, statusMessage: '缺少字段或值' })
  }

  const db = getDb()
  const room = await db.select().from(schema.rooms).where(eq(schema.rooms.code, code)).get()
  if (!room) {
    throw createError({ statusCode: 404, statusMessage: '房间不存在' })
  }

  // 白名单校验（传入的 camelCase 字段名）
  const allowedFields = [
    'time', 'summerTime', 'autumnTime', 'winterTime',
    'pressure', 'intel', 'morale', 'supplies', 'food', 'blackShot',
    'horses', 'religiousSupplies', 'laborers', 'siegeWeapons', 'supplyWagons',
    'spyMissionReinforce', 'spyMissionExpand', 'spyMissionTrap', 'spyMissionRecruit', 'spyMissionScout',
  ] as const

  if (!allowedFields.includes(field as any)) {
    throw createError({ statusCode: 400, statusMessage: '无效字段' })
  }

  await db.update(schema.legionState)
    .set({ [field]: value, updatedAt: new Date() } as any)
    .where(eq(schema.legionState.roomId, room.id))

  return { success: true, field, value }
})
