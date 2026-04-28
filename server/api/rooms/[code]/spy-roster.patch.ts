import { getDb, schema, eq } from '../../../utils/db'

interface SpyStatus {
  name: string
  skilled: boolean
  master: boolean
  injured: boolean
}

export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')?.toUpperCase()
  if (!code || code.length !== 6) {
    throw createError({ statusCode: 400, statusMessage: '无效的房间码' })
  }

  const body = await readBody(event)
  const { name, field, value } = body

  if (!name || !field || typeof value !== 'boolean') {
    throw createError({ statusCode: 400, statusMessage: '缺少参数' })
  }

  const allowedNames = ['安托瓦内特', '鲍提斯', '赤烦风', '伊葛丽德', '莉娅', '昂也廷']
  const allowedFields = ['skilled', 'master', 'injured']

  if (!allowedNames.includes(name) || !allowedFields.includes(field)) {
    throw createError({ statusCode: 400, statusMessage: '无效参数' })
  }

  const db = getDb()
  const room = await db.select().from(schema.rooms).where(eq(schema.rooms.code, code)).get()
  if (!room) {
    throw createError({ statusCode: 404, statusMessage: '房间不存在' })
  }

  const legion = await db.select().from(schema.legionState).where(eq(schema.legionState.roomId, room.id)).get()
  const current: SpyStatus[] = JSON.parse(legion?.spyStatuses || '[]')

  let found = current.find(s => s.name === name)
  if (!found) {
    found = { name, skilled: false, master: false, injured: false }
    current.push(found)
  }

  // 如果选中大师，自动取消熟练；如果选中熟练，自动取消大师
  if (field === 'master' && value) {
    found.master = true
    found.skilled = false
  } else if (field === 'skilled' && value) {
    found.skilled = true
    found.master = false
  } else {
    ;(found as any)[field] = value
  }

  await db.update(schema.legionState)
    .set({ spyStatuses: JSON.stringify(current), updatedAt: new Date() })
    .where(eq(schema.legionState.roomId, room.id))

  return { success: true, spy: found }
})
