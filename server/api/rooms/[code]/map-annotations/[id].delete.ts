import { getDb, schema, eq } from '../../../../utils/db'

export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')?.toUpperCase()
  const idStr = getRouterParam(event, 'id')
  if (!code || code.length !== 6 || !idStr) {
    throw createError({ statusCode: 400, statusMessage: '无效参数' })
  }

  const db = getDb()
  const room = await db.select().from(schema.rooms).where(eq(schema.rooms.code, code)).get()
  if (!room) {
    throw createError({ statusCode: 404, statusMessage: '房间不存在' })
  }

  const id = parseInt(idStr)
  await db.delete(schema.mapAnnotations)
    .where(eq(schema.mapAnnotations.id, id))
    .run()

  return { success: true }
})
