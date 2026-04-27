import { getDb, schema, verifyGMCode } from '../../utils/db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')
  if (!code) {
    throw createError({ statusCode: 400, statusMessage: '房间码不能为空' })
  }
  
  const body = await readBody(event)
  const { gmCode } = body
  
  if (!gmCode) {
    throw createError({ statusCode: 403, statusMessage: '需要提供GM码' })
  }
  
  const db = getDb()
  
  // 查找房间
  const room = await db.select().from(schema.rooms).where(eq(schema.rooms.code, code)).get()
  if (!room) {
    throw createError({ statusCode: 404, statusMessage: '房间不存在' })
  }
  
  // 验证GM码（通用码或房间专属token）
  const isAuthorized = await verifyGMCode(code, gmCode)
  if (!isAuthorized) {
    throw createError({ statusCode: 403, statusMessage: 'GM码错误' })
  }
  
  // 删除房间（级联删除关联数据）
  await db.delete(schema.rooms).where(eq(schema.rooms.code, code))
  
  return { success: true, message: '房间已删除' }
})
