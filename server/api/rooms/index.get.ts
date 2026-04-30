import { getDb, schema } from '../../utils/db'
import { desc } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const db = getDb()
  
  const rooms = await db.select({
    id: schema.rooms.id,
    code: schema.rooms.code,
    name: schema.rooms.name,
    campaignType: schema.rooms.campaignType,
    createdAt: schema.rooms.createdAt,
  })
  .from(schema.rooms)
  .orderBy(desc(schema.rooms.createdAt))
  
  return { rooms }
})
