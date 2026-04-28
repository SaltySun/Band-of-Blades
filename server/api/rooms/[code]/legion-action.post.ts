import { getDb, schema, eq, and } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')?.toUpperCase()
  if (!code || code.length !== 6) {
    throw createError({ statusCode: 400, statusMessage: '无效的房间码' })
  }

  const body = await readBody(event)
  const { role, actionType, data = {} } = body

  if (!role || !actionType) {
    throw createError({ statusCode: 400, statusMessage: '缺少职务或操作类型' })
  }

  const db = getDb()
  const room = await db.select().from(schema.rooms).where(eq(schema.rooms.code, code)).get()
  if (!room) {
    throw createError({ statusCode: 404, statusMessage: '房间不存在' })
  }

  const legionState = await db.select().from(schema.legionState)
    .where(eq(schema.legionState.roomId, room.id)).get()

  if (!legionState) {
    throw createError({ statusCode: 500, statusMessage: '军团状态不存在' })
  }

  let result = ''

  // ========== 指挥官操作 ==========
  if (role === 'commander') {
    if (actionType === 'create_mission') {
      const { name, type, location, priority = 'secondary', threatLevel = 1 } = data
      if (!name || !type || !location) {
        throw createError({ statusCode: 400, statusMessage: '缺少任务信息' })
      }
      await db.insert(schema.deployments).values({
        roomId: room.id,
        name: name.trim(),
        type,
        location: location.trim(),
        priority,
        threatLevel,
      })
      result = `创建任务「${name}」(${type})`
    }
    else if (actionType === 'spend_intel') {
      const { amount = 1, reason = '' } = data
      const currentIntel = legionState.intel || 0
      if (currentIntel < amount) {
        throw createError({ statusCode: 400, statusMessage: '情报不足' })
      }
      await db.update(schema.legionState)
        .set({ intel: currentIntel - amount })
        .where(eq(schema.legionState.roomId, room.id))
      result = `消费 ${amount} 点情报${reason ? `：${reason}` : ''}`
    }
    else if (actionType === 'advance_time') {
      await db.update(schema.legionState)
        .set({ time: (legionState.time || 0) + 1 })
        .where(eq(schema.legionState.roomId, room.id))
      result = '推进时间'
    }
  }

  // ========== 军士长操作 ==========
  else if (role === 'marshal') {
    if (actionType === 'assign_characters') {
      const { deploymentId, characterIds = [] } = data
      if (!deploymentId) {
        throw createError({ statusCode: 400, statusMessage: '缺少任务ID' })
      }
      await db.update(schema.deployments)
        .set({ characterIds })
        .where(and(
          eq(schema.deployments.id, deploymentId),
          eq(schema.deployments.roomId, room.id),
        ))
      result = `派遣 ${characterIds.length} 人参与任务`
    }
    else if (actionType === 'roll_encounter') {
      const roll = Math.floor(Math.random() * 6) + 1
      let situation = '危险处境'
      if (roll <= 3) situation = '绝望处境'
      else if (roll === 6) situation = '安全处境'
      result = `遭遇骰：${roll} → ${situation}`
    }
    else if (actionType === 'adjust_morale') {
      const { delta = 0, reason = '' } = data
      const newMorale = Math.max(0, Math.min(10, (legionState.morale || 0) + delta))
      await db.update(schema.legionState)
        .set({ morale: newMorale })
        .where(eq(schema.legionState.roomId, room.id))
      result = `士气 ${delta > 0 ? '+' : ''}${delta} → ${newMorale}${reason ? `（${reason}）` : ''}`
    }
  }

  // ========== 军需官操作 ==========
  else if (role === 'quartermaster') {
    if (actionType === 'campaign_action') {
      const { action: campaignAction, note = '' } = data
      const updates: Record<string, number> = {}
      if (campaignAction === 'get_resources') {
        // 简单模拟：投2d6，结果=食物+补给
        const roll1 = Math.floor(Math.random() * 6) + 1
        const roll2 = Math.floor(Math.random() * 6) + 1
        const foodGain = Math.max(0, roll1 - 2)
        const supplyGain = Math.max(0, roll2 - 3)
        updates.food = (legionState.food || 0) + foodGain
        updates.supplies = (legionState.supplies || 0) + supplyGain
        result = `获取资源：食物+${foodGain}，补给+${supplyGain}（骰值 ${roll1}, ${roll2}）`
      }
      else if (campaignAction === 'rr') {
        updates.morale = Math.min(10, (legionState.morale || 0) + 1)
        result = '放假（R&R）：士气+1'
      }
      else if (campaignAction === 'recruit') {
        const recruitCount = Math.max(1, Math.floor((legionState.morale || 0) / 3))
        result = `募兵：补充 ${recruitCount} 名新兵`
      }
      else if (campaignAction === 'long_project') {
        result = '推进长期项目'
      }
      else {
        result = `执行战役行动：${campaignAction}`
      }

      if (Object.keys(updates).length > 0) {
        await db.update(schema.legionState)
          .set(updates)
          .where(eq(schema.legionState.roomId, room.id))
      }
      if (note) result += ` — ${note}`
    }
    else if (actionType === 'manage_supplies') {
      const { food: foodDelta = 0, supplies: suppliesDelta = 0, note = '' } = data
      await db.update(schema.legionState)
        .set({
          food: Math.max(0, (legionState.food || 0) + foodDelta),
          supplies: Math.max(0, (legionState.supplies || 0) + suppliesDelta),
        })
        .where(eq(schema.legionState.roomId, room.id))
      result = `调整补给${note ? `：${note}` : ''}`
    }
  }

  // ========== 书记官操作 ==========
  else if (role === 'lorekeeper') {
    if (actionType === 'record_chronicle') {
      const { storyType, content, effect = '' } = data
      if (!content) {
        throw createError({ statusCode: 400, statusMessage: '缺少编年史内容' })
      }
      await db.insert(schema.chronicleEntries).values({
        roomId: room.id,
        type: 'story',
        content: content.trim(),
        storyType: storyType || 'founding',
        effect: effect.trim(),
      })
      result = `记录编年史：${storyType || '军团建立的故事'}`
    }
  }

  // ========== 间谍总管操作 ==========
  else if (role === 'spymaster') {
    if (actionType === 'spy_mission') {
      const { spyName, missionType, note = '' } = data
      result = `派遣间谍「${spyName || '未知'}」执行${missionType || '任务'}${note ? `：${note}` : ''}`
    }
  }

  if (!result) {
    throw createError({ statusCode: 400, statusMessage: '未知的操作类型' })
  }

  // 记录操作日志
  await db.insert(schema.actionLogs).values({
    roomId: room.id,
    actor: role,
    action: actionType,
    result,
  })

  return { success: true, result }
})
