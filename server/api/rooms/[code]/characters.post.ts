import { getDb, schema, eq } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')?.toUpperCase()
  
  if (!code || code.length !== 6) {
    throw createError({ statusCode: 400, statusMessage: '无效的房间码' })
  }

  const body = await readBody(event)
  const {
    playerName,
    name,
    culture,
    traits,
    role,
    specialAction,
    abilities,
    actions,
    load = 'medium',
    gearSlots,
    legionRole,
    isRookie = false,
  } = body

  // 基础验证
  if (!playerName || !name || !culture || !role) {
    throw createError({ statusCode: 400, statusMessage: '缺少必要字段' })
  }

  const db = getDb()
  const room = await db.select().from(schema.rooms).where(eq(schema.rooms.code, code)).get()

  if (!room) {
    throw createError({ statusCode: 404, statusMessage: '房间不存在' })
  }

  // 提取行动等级
  const actionMap: Record<string, number> = actions || {}
  
  // 根据角色类型确定初始特种行动等级
  let specialActionLevel = 1
  if (isRookie || role === 'rookie') {
    specialActionLevel = 0
  }

  // 创建角色
  const result = await db.insert(schema.characters).values({
    roomId: room.id,
    playerName: playerName.trim(),
    name: name.trim(),
    culture,
    traits: traits || [],
    role,
    specialAction: specialAction || '',
    specialActionLevel,
    abilities: abilities || [],
    legionRole: legionRole || '',
    // 行动等级
    actionInvestigation: actionMap.investigation || 0,
    actionMarksmanship: actionMap.marksmanship || 0,
    actionRigging: actionMap.rigging || 0,
    actionSway: actionMap.sway || 0,
    actionScout: actionMap.scout || 0,
    actionDiscipline: actionMap.discipline || 0,
    actionSkirmish: actionMap.skirmish || 0,
    actionWreck: actionMap.wreck || 0,
    actionManeuver: actionMap.maneuver || 0,
    actionCommand: actionMap.command || 0,
    actionResolve: actionMap.resolve || 0,
    load,
    gearSlots: gearSlots || [],
    isRookie: isRookie || role === 'rookie',
  }).returning()

  const character = result[0]

  // 如果选择了军团职务，更新军团状态
  if (legionRole) {
    const updateData: Record<string, string> = {}
    switch (legionRole) {
      case 'commander':
        updateData.commanderName = name.trim()
        break
      case 'marshal':
        updateData.marshalName = name.trim()
        break
      case 'quartermaster':
        updateData.quartermasterName = name.trim()
        break
      case 'lorekeeper':
        updateData.lorekeeperName = name.trim()
        break
      case 'spymaster':
        updateData.spymasterName = name.trim()
        break
    }
    if (Object.keys(updateData).length > 0) {
      await db.update(schema.legionState)
        .set(updateData)
        .where(eq(schema.legionState.roomId, room.id))
    }
  }

  // 记录日志
  await db.insert(schema.actionLogs).values({
    roomId: room.id,
    actor: playerName.trim(),
    action: 'create_character',
    target: name.trim(),
    result: `${role} 角色创建成功`,
  })

  return {
    success: true,
    character: {
      id: character.id,
      name: character.name,
      playerName: character.playerName,
      culture: character.culture,
      role: character.role,
      specialAction: character.specialAction,
      specialActionLevel: character.specialActionLevel,
      abilities: character.abilities,
      load: character.load,
      legionRole: character.legionRole,
    },
  }
})
