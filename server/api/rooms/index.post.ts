import { getDb, schema, generateRoomCode, generateGMToken } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, campaignType = 'summer' } = body

  if (!name || typeof name !== 'string' || name.trim().length < 1) {
    throw createError({ statusCode: 400, statusMessage: '房间名称不能为空' })
  }

  const db = getDb()
  const code = generateRoomCode()
  const gmToken = generateGMToken()

  // 创建房间
  const roomResult = await db.insert(schema.rooms).values({
    code,
    name: name.trim(),
    gmToken,
    campaignType,
  }).returning()

  const room = roomResult[0]
  if (!room) {
    throw createError({ statusCode: 500, statusMessage: '房间创建失败' })
  }

  // 创建军团初始状态
  await db.insert(schema.legionState).values({
    roomId: room.id,
    time: 0,
    pressure: 0,
    intel: 0,
    morale: 6,
    supplies: 3,
    food: 1,
    blackShot: 1,
    horses: 1,
    religiousSupplies: 1,
    laborers: 1,
    siegeWeapons: 0,
    supplyWagons: 0,
    spyNetworkUnlocked: '["间谍网络"]',
    spyStatuses: JSON.stringify([
      { name: '安托瓦内特', skilled: false, master: true, injured: false },
      { name: '鲍提斯', skilled: false, master: false, injured: false },
      { name: '赤烦风', skilled: false, master: false, injured: false },
      { name: '伊葛丽德', skilled: false, master: false, injured: false },
      { name: '莉娅', skilled: false, master: false, injured: false },
      { name: '昂也廷', skilled: false, master: false, injured: false },
    ]),
    quartermasterState: JSON.stringify({
      campaignActions: {
        getResources: false,
        leave: false,
        longProject: false,
        recruit: false,
        restRecover: false,
      },
      longProjects: [],
      mercyWorkers: [
        { name: '', wounded: 0 },
        { name: '', wounded: 0 },
        { name: '', wounded: 0 },
      ],
      alchemists: [
        { name: '', corruption: 0 },
        { name: '', corruption: 0 },
        { name: '', corruption: 0 },
      ],
      foodStores: [{ used: 0 }, { used: 0 }, { used: 0 }],
      horses: [{ used: 0 }, { used: 0 }, { used: 0 }],
      blackShots: [{ used: 0 }, { used: 0 }, { used: 0 }],
      religiousSupplies: [{ used: 0 }, { used: 0 }],
      laborers: 0,
      siegeWeapons: 0,
      supplyWagons: 0,
    }),
    marshalState: JSON.stringify({
      squads: [
        { name: '冷笑渡鸦', soldiers: Array.from({ length: 5 }, () => ({ name: '', wounded: 0, stress: 0, isSoldier: false })) },
        { name: '星辰毒蛇', soldiers: Array.from({ length: 5 }, () => ({ name: '', wounded: 0, stress: 0, isSoldier: false })) },
        { name: '白银牡鹿', soldiers: Array.from({ length: 5 }, () => ({ name: '', wounded: 0, stress: 0, isSoldier: false })) },
        { name: '幽灵夜枭', soldiers: Array.from({ length: 5 }, () => ({ name: '', wounded: 0, stress: 0, isSoldier: false })) },
        { name: '琥珀野狼', soldiers: Array.from({ length: 5 }, () => ({ name: '', wounded: 0, stress: 0, isSoldier: false })) },
        { name: '破碎雄狮', soldiers: Array.from({ length: 5 }, () => ({ name: '', wounded: 0, stress: 0, isSoldier: false })) },
      ],
      specialists: [
        { role: '重装兵', name: '', stress: 0, wounded: 0, ability: '', action: '' },
        { role: '医疗兵', name: '', stress: 0, wounded: 0, ability: '', action: '' },
        { role: '军官', name: '', stress: 0, wounded: 0, ability: '', action: '' },
        { role: '斥候', name: '', stress: 0, wounded: 0, ability: '', action: '' },
        { role: '狙击手', name: '', stress: 0, wounded: 0, ability: '', action: '' },
        { role: '新兵', name: '', stress: 0, wounded: 0, ability: '', action: '' },
        { role: '士兵', name: '', stress: 0, wounded: 0, ability: '', action: '' },
      ],
      casualties: [],
    }),
  })

  return {
    success: true,
    roomCode: room.code,
    gmToken: room.gmToken,
    name: room.name,
    campaignType: room.campaignType,
  }
})
