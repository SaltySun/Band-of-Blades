// 文化特性与特殊能力的实际效果映射
// 用于前端创建流程和后端验证

import { MAX_STARTING_ACTION_LEVEL } from './actions'

/** 根据特性获取自动装备 */
export function getTraitAutoGear(traits: string[]): string[] {
  const auto: string[] = []
  if (traits.includes('devout')) {
    auto.push('relic')
  }
  return auto
}

/** 根据能力获取功能栏额外数量 */
export function getExtraGearSlots(abilities: string[]): number {
  let extra = 0
  if (abilities.includes('bear_strength')) {
    extra += 2
  }
  return extra
}

/** 特性对行动上限的影响（游戏中生效，非创建时） */
export const TRAIT_ACTION_EFFECTS: Record<string, { action: string; label: string }> = {
  affable: { action: 'sway', label: '社交+1（最高2）' },
  learned: { action: 'investigation', label: '调查+1（最高2）' },
  craftsman: { action: 'rigging', label: '修补上限4' },
  connected: { action: 'resolve', label: '动摇+1（最高3）' },
  stoic: { action: 'discipline', label: '训诫+1（最高2）' },
}

/** 特性在角色创建时提供的行动等级加成 */
export function getTraitActionBonuses(traits: string[]): Record<string, number> {
  const bonuses: Record<string, number> = {}
  for (const key of traits) {
    const effect = TRAIT_ACTION_EFFECTS[key]
    if (effect && ['affable', 'learned', 'connected', 'stoic'].includes(key)) {
      bonuses[effect.action] = 1
    }
  }
  return bonuses
}

/** 获取某个行动在角色创建时的最大等级（含特性加成） */
export function getStartingActionMaxLevel(actionKey: string, traits: string[]): number {
  const bonuses = getTraitActionBonuses(traits)
  const bonus = bonuses[actionKey] || 0
  return MAX_STARTING_ACTION_LEVEL + bonus
}

/** 特性的其他效果（用于详情页展示） */
export const TRAIT_SPECIAL_EFFECTS: Record<string, string> = {
  devout: '总是装备圣骸',
  resolute: '使用技术抵抗时+1骰',
  well_traveled: '中装时快速且安静',
  sharp: '认知抵抗时+1骰',
  beast_mark: '抵抗腐化+2骰',
  noble: '提升一个战役行动效果',
  vengeful: '受到伤害惩罚时获得效力',
  pain_immune: '忽略1级伤害惩罚',
  fearless: '绝望抵抗时+1骰',
  loyal: '团队行动时+1骰',
  stubborn: '决心抵抗时+1骰',
}

/** 能力的特殊效果（用于详情页展示） */
export const ABILITY_SPECIAL_EFFECTS: Record<string, string> = {
  bear_strength: '额外2个功能栏',
  jack_of_all: '将两项0级行动提升至1级',
  true_local: '获得所属文化的所有文化特性',
  chemist: '可选择炼金武装带作为标准物品',
  grenadier: '轻装时可携带手榴弹或炸药',
  attaché: '创建时自动获得；可参与专家名额已满的任务',
  tireless: '消耗忍耐超越自我时不产生精神压力',
  leap_peak: '向强手冲锋时-1精神压力，机动行动+1骰',
  steel_will: '消耗忍耐作为对抗恐惧/麻痹/腐化/疲劳的特殊护甲',
  iron_gut: '超越自我时无视伤害惩罚；抵抗后果+1骰',
  cavalry: '有马匹时可骑马开始任务；马上机动行动+1骰',
}

/** 判断角色是否有某个特殊效果 */
export function hasEffect(traits: string[], abilities: string[], effectKey: string): boolean {
  return traits.includes(effectKey) || abilities.includes(effectKey)
}

/** 获取角色的所有特殊效果文本列表 */
export function getAllSpecialEffects(traits: string[], abilities: string[]): string[] {
  const effects: string[] = []
  for (const key of traits) {
    if (TRAIT_SPECIAL_EFFECTS[key]) {
      effects.push(`[特性] ${TRAIT_SPECIAL_EFFECTS[key]}`)
    }
    if (TRAIT_ACTION_EFFECTS[key]) {
      effects.push(`[特性] ${TRAIT_ACTION_EFFECTS[key].label}`)
    }
  }
  for (const key of abilities) {
    if (ABILITY_SPECIAL_EFFECTS[key]) {
      effects.push(`[能力] ${ABILITY_SPECIAL_EFFECTS[key]}`)
    }
  }
  return effects
}
