import { getDb, schema, generateRoomCode, generateGMToken } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, campaignType = 'summer' } = body

  if (!name || typeof name !== 'string' || name.trim().length < 1) {
    throw createError({ statusCode: 400, statusMessage: '房间名称不能为空' })
  }

  const db = getDb()
  const code = generateRoomCode()
  const gmToken = generateGMToken()

  // 创建房间
  const roomResult = await db.insert(schema.rooms).values({
    code,
    name: name.trim(),
    gmToken,
    campaignType,
  }).returning()

  const room = roomResult[0]

  // 创建军团初始状态
  await db.insert(schema.legionState).values({
    roomId: room.id,
    time: 0,
    pressure: 0,
    intel: 0,
    morale: 6,
    supplies: 3,
    food: 1,
    blackShot: 1,
    horses: 1,
    religiousSupplies: 1,
    laborers: 1,
    siegeWeapons: 0,
    supplyWagons: 0,
  })

  return {
    success: true,
    roomCode: room.code,
    gmToken: room.gmToken,
    name: room.name,
    campaignType: room.campaignType,
  }
})
