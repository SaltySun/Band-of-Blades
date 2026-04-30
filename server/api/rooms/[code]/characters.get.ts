import { getDb, schema, eq } from '../../../utils/db'

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

  const characters = await db.select({
    id: schema.characters.id,
    name: schema.characters.name,
    playerName: schema.characters.playerName,
    culture: schema.characters.culture,
    traits: schema.characters.traits,
    role: schema.characters.role,
    specialAction: schema.characters.specialAction,
    specialActionLevel: schema.characters.specialActionLevel,
    abilities: schema.characters.abilities,
    load: schema.characters.load,
    gearSlots: schema.characters.gearSlots,
    legionRole: schema.characters.legionRole,
    // 行动等级
    actionInvestigation: schema.characters.actionInvestigation,
    actionMarksmanship: schema.characters.actionMarksmanship,
    actionRigging: schema.characters.actionRigging,
    actionSway: schema.characters.actionSway,
    actionScout: schema.characters.actionScout,
    actionDiscipline: schema.characters.actionDiscipline,
    actionSkirmish: schema.characters.actionSkirmish,
    actionWreck: schema.characters.actionWreck,
    actionManeuver: schema.characters.actionManeuver,
    actionCommand: schema.characters.actionCommand,
    actionResolve: schema.characters.actionResolve,
    actionChannel: schema.characters.actionChannel,
    actionAim: schema.characters.actionAim,
    actionMartialArts: schema.characters.actionMartialArts,
    actionMedicine: schema.characters.actionMedicine,
    actionEndure: schema.characters.actionEndure,
    actionSurvival: schema.characters.actionSurvival,
    actionWeave: schema.characters.actionWeave,
    // 伤害/状态
    harmLevel1: schema.characters.harmLevel1,
    harmLevel2: schema.characters.harmLevel2,
    harmLevel3: schema.characters.harmLevel3,
    harmLevel4: schema.characters.harmLevel4,
    stress: schema.characters.stress,
    stressMax: schema.characters.stressMax,
    traumas: schema.characters.traumas,
    rotLevel: schema.characters.rotLevel,
    rotSymptoms: schema.characters.rotSymptoms,
    armor: schema.characters.armor,
    // XP
    xpMental: schema.characters.xpMental,
    xpPhysical: schema.characters.xpPhysical,
    xpResolve: schema.characters.xpResolve,
    xpTotal: schema.characters.xpTotal,
    notes: schema.characters.notes,
    characterState: schema.characters.characterState,
    isDead: schema.characters.isDead,
    isRookie: schema.characters.isRookie,
    createdAt: schema.characters.createdAt,
    updatedAt: schema.characters.updatedAt,
  }).from(schema.characters).where(eq(schema.characters.roomId, room.id)).all()

  return {
    success: true,
    characters,
  }
})
