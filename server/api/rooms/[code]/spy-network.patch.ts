import { getDb, schema, eq } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')?.toUpperCase()
  if (!code || code.length !== 6) {
    throw createError({ statusCode: 400, statusMessage: '无效的房间码' })
  }

  const body = await readBody(event)
  const { node, unlocked } = body

  if (!node || typeof unlocked !== 'boolean') {
    throw createError({ statusCode: 400, statusMessage: '缺少节点或状态' })
  }

  // 允许解锁的节点白名单
  const allowedNodes = [
    '间谍网络', '增员', '训练', '分析师', '投资',
    '现场评估', '诱捕', '信息源', '商人', '教团', '佣兵', '游侠',
  ]
  if (!allowedNodes.includes(node)) {
    throw createError({ statusCode: 400, statusMessage: '无效节点' })
  }

  const db = getDb()
  const room = await db.select().from(schema.rooms).where(eq(schema.rooms.code, code)).get()
  if (!room) {
    throw createError({ statusCode: 404, statusMessage: '房间不存在' })
  }

  const legion = await db.select().from(schema.legionState).where(eq(schema.legionState.roomId, room.id)).get()
  const current: string[] = JSON.parse(legion?.spyNetworkUnlocked || '[]')
  // 确保根节点始终在解锁列表中
  if (!current.includes('间谍网络')) {
    current.push('间谍网络')
  }

  // 父节点映射
  const parentMap: Record<string, string> = {
    增员: '间谍网络',
    分析师: '间谍网络',
    现场评估: '间谍网络',
    诱捕: '间谍网络',
    信息源: '间谍网络',
    训练: '增员',
    投资: '分析师',
    商人: '信息源',
    教团: '信息源',
    佣兵: '信息源',
    游侠: '信息源',
  }

  // 子节点映射（用于取消解锁时级联取消）
  const childrenMap: Record<string, string[]> = {
    间谍网络: ['增员', '分析师', '现场评估', '诱捕', '信息源'],
    增员: ['训练'],
    分析师: ['投资'],
    信息源: ['商人', '教团', '佣兵', '游侠'],
  }

  let next: string[]

  if (unlocked) {
    // 解锁节点：检查父节点是否已解锁
    const parent = parentMap[node]
    if (parent && !current.includes(parent)) {
      throw createError({ statusCode: 400, statusMessage: `需要先解锁「${parent}」` })
    }
    next = [...new Set([...current, node])]
  } else {
    // 取消解锁：同时取消所有后代节点
    const toRemove = [node]
    const queue = [node]
    while (queue.length) {
      const cur = queue.shift()!
      const children = childrenMap[cur] || []
      for (const child of children) {
        if (!toRemove.includes(child)) {
          toRemove.push(child)
          queue.push(child)
        }
      }
    }
    next = current.filter(n => !toRemove.includes(n))
  }

  await db.update(schema.legionState)
    .set({ spyNetworkUnlocked: JSON.stringify(next), updatedAt: new Date() })
    .where(eq(schema.legionState.roomId, room.id))

  return { success: true, nodes: next }
})
