import { getDb, schema, eq } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')?.toUpperCase()
  if (!code || code.length !== 6) {
    throw createError({ statusCode: 400, statusMessage: '无效的房间码' })
  }

  const body = await readBody(event)
  const { squads, specialists, casualties } = body

  const db = getDb()
  const room = await db.select().from(schema.rooms).where(eq(schema.rooms.code, code)).get()
  if (!room) {
    throw createError({ statusCode: 404, statusMessage: '房间不存在' })
  }

  const legion = await db.select().from(schema.legionState).where(eq(schema.legionState.roomId, room.id)).get()
  const current: any = JSON.parse(legion?.marshalState || '{}')

  if (squads !== undefined) current.squads = squads
  if (specialists !== undefined) current.specialists = specialists
  if (casualties !== undefined) current.casualties = casualties

  await db.update(schema.legionState)
    .set({ marshalState: JSON.stringify(current), updatedAt: new Date() })
    .where(eq(schema.legionState.roomId, room.id))

  return { success: true }
})
