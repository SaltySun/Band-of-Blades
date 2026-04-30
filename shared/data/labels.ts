import { ROLES } from './roles'
import { CULTURES } from './cultures'
import { LEGION_ROLES } from './legion-roles'
import { getRoleGearPool } from './gear'

export function getRoleName(key: string): string {
  return ROLES.find(r => r.key === key)?.name || key
}

export function getCultureName(key: string): string {
  return CULTURES.find(c => c.key === key)?.name || key
}

export function getTraitName(key: string): string {
  for (const c of CULTURES) {
    const t = c.traits.find(tr => tr.key === key)
    if (t) return t.name
  }
  return key
}

export function getAbilityName(key: string): string {
  for (const r of ROLES) {
    const a = r.abilities.find(ab => ab.key === key)
    if (a) return a.name
  }
  return key
}

export function getGearName(key: string, roleKey?: string): string {
  const pool = getRoleGearPool(roleKey || 'rookie')
  const item = pool.find(g => g.key === key)
  return item?.name || key
}

export function getLegionRoleName(key: string): string {
  return LEGION_ROLES.find(r => r.key === key)?.name || key
}

export function getLoadLabel(load: string): string {
  const map: Record<string, string> = { light: '轻装', medium: '中装', heavy: '重装' }
  return map[load] || load
}
