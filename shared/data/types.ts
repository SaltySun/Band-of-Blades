// PDF角色卡 v1.3 权威数据 — 类型定义

export interface Ability {
  key: string
  name: string
  description: string
  exclusive?: boolean // 新兵专属
}

export interface Trait {
  key: string
  name: string
  effect: string
}

export interface Culture {
  key: string
  name: string
  description: string
  traits: Trait[]
  maleNames: string[]
  femaleNames: string[]
  surnames: string[]
  namingStyle: string
}

export interface Role {
  key: string
  name: string
  nameEn: string
  description: string
  specialAction: string
  specialActionDesc: string
  xpCondition: string
  abilities: Ability[]
  isRookie?: boolean
}

export interface GearItem {
  key: string
  name: string
  slots: number
  desc: string
  roleOnly?: string[] // 仅限特定职业选择
}

export interface LegionRole {
  key: string
  name: string
  desc: string
  required: boolean
}
