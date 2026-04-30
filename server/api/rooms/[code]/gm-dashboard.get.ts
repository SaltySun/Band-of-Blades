import { getDb, schema, eq, desc } from '../../../utils/db'

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

  const roomId = room.id

  // 并行查询所有数据
  const [
    legion,
    characters,
    deployments,
    progressClocks,
    chronicleEntries,
    actionLogs,
    mapAnnotations,
  ] = await Promise.all([
    db.select().from(schema.legionState).where(eq(schema.legionState.roomId, roomId)).get(),
    db.select().from(schema.characters).where(eq(schema.characters.roomId, roomId)).all(),
    db.select().from(schema.deployments).where(eq(schema.deployments.roomId, roomId)).orderBy(desc(schema.deployments.createdAt)).all(),
    db.select().from(schema.progressClocks).where(eq(schema.progressClocks.roomId, roomId)).all(),
    db.select().from(schema.chronicleEntries).where(eq(schema.chronicleEntries.roomId, roomId)).orderBy(desc(schema.chronicleEntries.createdAt)).all(),
    db.select().from(schema.actionLogs).where(eq(schema.actionLogs.roomId, roomId)).orderBy(desc(schema.actionLogs.timestamp)).limit(200).all(),
    db.select().from(schema.mapAnnotations).where(eq(schema.mapAnnotations.roomId, roomId)).orderBy(schema.mapAnnotations.createdAt).all(),
  ])

  return {
    success: true,
    room: {
      id: room.id,
      code: room.code,
      name: room.name,
      campaignType: room.campaignType,
      gmToken: room.gmToken,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
    },
    legion: legion || null,
    characters: characters || [],
    deployments: deployments || [],
    progressClocks: progressClocks || [],
    chronicleEntries: chronicleEntries || [],
    actionLogs: actionLogs || [],
    mapAnnotations: mapAnnotations || [],
  }
})
