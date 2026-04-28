import { getDb, schema, eq, and } from '../../../../utils/db'

export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')?.toUpperCase()
  const idParam = getRouterParam(event, 'id')
  const id = idParam ? parseInt(idParam, 10) : NaN

  if (!code || code.length !== 6 || isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: '无效参数' })
  }

  const body = await readBody(event)
  const db = getDb()
  const room = await db.select().from(schema.rooms).where(eq(schema.rooms.code, code)).get()
  if (!room) {
    throw createError({ statusCode: 404, statusMessage: '房间不存在' })
  }

  const character = await db.select().from(schema.characters)
    .where(and(eq(schema.characters.id, id), eq(schema.characters.roomId, room.id)))
    .get()
  if (!character) {
    throw createError({ statusCode: 404, statusMessage: '角色不存在' })
  }

  // 构建更新数据
  const updateData: Record<string, any> = { updatedAt: new Date() }

  const allowedFields = [
    'stress', 'harmLevel1', 'harmLevel2', 'harmLevel3', 'harmLevel4',
    'rotLevel', 'armor', 'notes', 'characterState',
    'actionInvestigation', 'actionMarksmanship', 'actionRigging', 'actionSway',
    'actionScout', 'actionDiscipline', 'actionSkirmish', 'actionWreck',
    'actionManeuver', 'actionCommand', 'actionResolve',
    'actionChannel', 'actionAim', 'actionMartialArts', 'actionMedicine',
    'actionEndure', 'actionSurvival', 'actionWeave',
    'xpMental', 'xpPhysical', 'xpResolve',
  ] as const

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updateData[field] = body[field]
    }
  }

  // 处理数组字段
  if (body.traumas !== undefined) updateData.traumas = body.traumas
  if (body.rotSymptoms !== undefined) updateData.rotSymptoms = body.rotSymptoms
  if (body.abilities !== undefined) updateData.abilities = body.abilities
  if (body.gearSlots !== undefined) updateData.gearSlots = body.gearSlots
  if (body.loadoutChoices !== undefined) updateData.loadoutChoices = body.loadoutChoices

  // 处理 JSON 字段
  if (body.characterState !== undefined) {
    updateData.characterState = JSON.stringify(body.characterState)
  }

  await db.update(schema.characters)
    .set(updateData)
    .where(eq(schema.characters.id, id))

  return { success: true }
})
