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

  const characters = await db.select({
    id: schema.characters.id,
    name: schema.characters.name,
    playerName: schema.characters.playerName,
    culture: schema.characters.culture,
    traits: schema.characters.traits,
    role: schema.characters.role,
    specialAction: schema.characters.specialAction,
    specialActionLevel: schema.characters.specialActionLevel,
    abilities: schema.characters.abilities,
    load: schema.characters.load,
    gearSlots: schema.characters.gearSlots,
    legionRole: schema.characters.legionRole,
    stress: schema.characters.stress,
    isDead: schema.characters.isDead,
    xpTotal: schema.characters.xpTotal,
    updatedAt: schema.characters.updatedAt,
  }).from(schema.characters).where(eq(schema.characters.roomId, room.id)).all()

  return {
    success: true,
    characters,
  }
})
