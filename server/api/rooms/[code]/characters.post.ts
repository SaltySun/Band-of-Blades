import { getDb, schema, eq, and } from '../../../utils/db'
import {
  ROLES, CULTURES, ACTIONS, TOTAL_ACTION_POINTS, MAX_STARTING_ACTION_LEVEL,
  getRoleGearConfig, getDefaultLoadout, LEGION_ROLES,
  getExtraGearSlots, getTraitActionBonuses, getStartingActionMaxLevel,
} from '../../../../shared/game-data'

const ROLE_SPECIAL_ACTION_MAP: Record<string, string> = {
  heavy: 'martial_arts',
  medic: 'medicine',
  sniper: 'aim',
  officer: 'channel',
  soldier: 'endure',
  scout: 'survival',
  rookie: '',
}

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
    loadoutChoices,
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

  // ========== 业务规则验证 ==========

  // 验证文化
  const cultureData = CULTURES.find(c => c.key === culture)
  if (!cultureData) {
    throw createError({ statusCode: 400, statusMessage: '无效的文化' })
  }

  // 验证职业
  const roleData = ROLES.find(r => r.key === role)
  if (!roleData) {
    throw createError({ statusCode: 400, statusMessage: '无效的职业' })
  }

  // 验证特性（必须属于选中的文化）
  const validTraitKeys = new Set(cultureData.traits.map(t => t.key))
  const abilityList = Array.isArray(abilities) ? abilities : []
  const hasTrueLocal = abilityList.includes('true_local')
  const expectedTraitCount = hasTrueLocal ? cultureData.traits.length : 2
  if (!Array.isArray(traits) || traits.length !== expectedTraitCount) {
    throw createError({ statusCode: 400, statusMessage: `必须选择恰好${expectedTraitCount}项特性` })
  }
  for (const t of traits) {
    if (!validTraitKeys.has(t)) {
      throw createError({ statusCode: 400, statusMessage: `特性 "${t}" 不属于选中的文化` })
    }
  }

  // 验证能力（必须属于选中的职业）
  if (abilityList.length !== 1 || !abilityList[0]) {
    throw createError({ statusCode: 400, statusMessage: '必须选择1个起始能力' })
  }
  const validAbilityKeys = new Set(roleData.abilities.map(a => a.key))
  if (!validAbilityKeys.has(abilityList[0])) {
    throw createError({ statusCode: 400, statusMessage: '选择的起始能力不属于该职业' })
  }

  // 验证负载选择
  const loadValue = load || 'medium'
  if (!['light', 'medium', 'heavy'].includes(loadValue)) {
    throw createError({ statusCode: 400, statusMessage: '无效的负载等级' })
  }

  // 验证默认装备选项（每个选项组必须恰好选1个）
  const loadoutCfg = getDefaultLoadout(role, loadValue)
  const choiceList = Array.isArray(loadoutChoices) ? loadoutChoices : []
  for (const group of loadoutCfg.choices) {
    const selectedInGroup = choiceList.filter(k => group.items.some(item => item.key === k))
    if (selectedInGroup.length === 0) {
      throw createError({ statusCode: 400, statusMessage: `必须在「${group.label}」中选择一项` })
    }
    if (selectedInGroup.length > 1) {
      throw createError({ statusCode: 400, statusMessage: `「${group.label}」只能选择一项` })
    }
  }
  // 验证选项合法性
  const allChoiceKeys = new Set(loadoutCfg.choices.flatMap(g => g.items.map(i => i.key)))
  for (const k of choiceList) {
    if (!allChoiceKeys.has(k)) {
      throw createError({ statusCode: 400, statusMessage: `默认装备选项 "${k}" 不属于该职业` })
    }
  }

  // 验证可选装备
  const gearList = Array.isArray(gearSlots) ? gearSlots : []
  const maxSlots = 2 + getExtraGearSlots(abilityList)
  // devout 自动装备圣骸，不计入功能栏
  const hasDevout = Array.isArray(traits) && traits.includes('devout')
  const effectiveGearCount = hasDevout
    ? gearList.filter(g => g !== 'relic').length
    : gearList.length
  if (effectiveGearCount > maxSlots) {
    throw createError({ statusCode: 400, statusMessage: `可选装备不能超过${maxSlots}件（当前${effectiveGearCount}件）` })
  }
  const optionalPool = getRoleGearConfig(role).optional
  const validGearKeys = new Set(optionalPool.map(g => g.key))
  // grenadier 轻装时允许手榴弹和炸药
  if (abilityList.includes('grenadier') && loadValue === 'light') {
    validGearKeys.add('grenade')
    validGearKeys.add('explosive')
  }
  // chemist 允许炼金武装带
  if (abilityList.includes('chemist')) {
    validGearKeys.add('alchemical_bandolier')
  }
  for (const g of gearList) {
    if (!validGearKeys.has(g)) {
      throw createError({ statusCode: 400, statusMessage: `装备 "${g}" 不属于该职业可选装备池` })
    }
  }

  // 验证行动点数
  const actionMap: Record<string, number> = actions || {}
  let totalUsed = 0
  const validActionKeys = new Set<string>(ACTIONS.map(a => a.key))
  const specialActionKey = ROLE_SPECIAL_ACTION_MAP[role] || ''
  for (const [key, level] of Object.entries(actionMap)) {
    if (!validActionKeys.has(key)) {
      throw createError({ statusCode: 400, statusMessage: `无效的行动: ${key}` })
    }
    const maxLevel = getStartingActionMaxLevel(key, traits || [])
    if (typeof level !== 'number' || level < 0 || level > maxLevel) {
      throw createError({ statusCode: 400, statusMessage: `行动 "${key}" 等级必须在 0-${maxLevel} 之间` })
    }
    // 本职专家技能1级不消耗预算
    if (key === specialActionKey && level === 1) continue
    totalUsed += level
  }
  // 计算期望总点数：基础4点 + jack_of_all 2点 + 特性加成
  const traitBonuses = getTraitActionBonuses(traits || [])
  const traitBonusPoints = Object.values(traitBonuses).reduce((a, b) => a + b, 0)
  const expectedPoints = TOTAL_ACTION_POINTS
    + (abilityList.includes('jack_of_all') ? 2 : 0)
    + traitBonusPoints
  if (totalUsed !== expectedPoints) {
    throw createError({ statusCode: 400, statusMessage: `行动点数必须恰好分配 ${expectedPoints} 点（当前 ${totalUsed} 点）` })
  }

  // 验证军团职务
  if (legionRole) {
    const validRole = LEGION_ROLES.find(r => r.key === legionRole)
    if (!validRole) {
      throw createError({ statusCode: 400, statusMessage: '无效的军团职务' })
    }
    // 检查是否已被占用
    const existingChars = await db.select({
      legionRole: schema.characters.legionRole,
    }).from(schema.characters).where(eq(schema.characters.roomId, room.id)).all()
    const taken = existingChars.some(c => c.legionRole === legionRole)
    if (taken) {
      throw createError({ statusCode: 409, statusMessage: '该军团职务已被担任' })
    }
  }

  // 根据角色类型确定初始特种行动等级
  let specialActionLevel = 1
  if (isRookie || role === 'rookie') {
    specialActionLevel = 0
  }

  // ========== 事务：创建角色 + 更新军团状态 ==========
  const result = await db.transaction(async (tx) => {
    // 如果新角色担任某职务，先清除旧角色该职务
    if (legionRole) {
      await tx.update(schema.characters)
        .set({ legionRole: '' })
        .where(and(
          eq(schema.characters.roomId, room.id),
          eq(schema.characters.legionRole, legionRole),
        ))
    }

    // 创建角色
    const insertResult = await tx.insert(schema.characters).values({
      roomId: room.id,
      playerName: playerName.trim(),
      name: name.trim(),
      culture,
      traits: traits || [],
      role,
      specialAction: specialAction || '',
      specialActionLevel,
      abilities: abilityList,
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
      actionChannel: actionMap.channel || (specialActionKey === 'channel' ? 1 : 0),
      actionAim: actionMap.aim || (specialActionKey === 'aim' ? 1 : 0),
      actionMartialArts: actionMap.martial_arts || (specialActionKey === 'martial_arts' ? 1 : 0),
      actionMedicine: actionMap.medicine || (specialActionKey === 'medicine' ? 1 : 0),
      actionEndure: actionMap.endure || (specialActionKey === 'endure' ? 1 : 0),
      actionSurvival: actionMap.survival || (specialActionKey === 'survival' ? 1 : 0),
      actionWeave: actionMap.weave || 0,
      load,
      gearSlots: gearList,
      loadoutChoices: choiceList,
      isRookie: isRookie || role === 'rookie',
    }).returning()

    const character = insertResult[0]

    // 如果选择了军团职务，更新军团状态（存储玩家名而非角色名）
    if (legionRole) {
      const updateData: Record<string, string> = {}
      switch (legionRole) {
        case 'commander': updateData.commanderName = playerName.trim(); break
        case 'marshal': updateData.marshalName = playerName.trim(); break
        case 'quartermaster': updateData.quartermasterName = playerName.trim(); break
        case 'lorekeeper': updateData.lorekeeperName = playerName.trim(); break
        case 'spymaster': updateData.spymasterName = playerName.trim(); break
      }
      if (Object.keys(updateData).length > 0) {
        await tx.update(schema.legionState)
          .set(updateData)
          .where(eq(schema.legionState.roomId, room.id))
      }
    }

    return character
  })

  if (!result) {
    throw createError({ statusCode: 500, statusMessage: '角色创建失败' })
  }

  // 记录日志（在事务外，避免事务失败导致日志也回滚）
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
      id: result.id,
      name: result.name,
      playerName: result.playerName,
      culture: result.culture,
      role: result.role,
      specialAction: result.specialAction,
      specialActionLevel: result.specialActionLevel,
      abilities: result.abilities,
      load: result.load,
      legionRole: result.legionRole,
    },
  }
})
