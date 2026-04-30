<template>
  <div class="space-y-6">
    <h2 class="font-brush text-2xl text-field-ink text-center">能力、装备与职务</h2>

    <!-- 能力选择 -->
    <div class="card-archive">
      <div class="section-title-ink">选择一个起始能力</div>
      <div class="space-y-2">
        <SelectableCard
          v-for="ability in roleAbilities"
          :key="ability.key"
          :selected="abilityKey === ability.key"
          @click="selectAbility(ability.key)"
        >
          <template #title>{{ ability.name }}</template>
          <template #desc>{{ ability.description }}</template>
        </SelectableCard>
      </div>
    </div>

    <!-- jack_of_all 额外行动 -->
    <div v-if="abilityKey === 'jack_of_all'" class="card-archive">
      <div class="section-title-ink">样样通：选择两项行动+1</div>
      <p class="handnote mb-3">
        将两项当前0级的行动提升至1级（已选 {{ localJackOfAll.length }}/2）
      </p>
      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="action in zeroLevelActions"
          :key="action.key"
          class="p-2 border text-xs text-left transition-all"
          :class="localJackOfAll.includes(action.key)
            ? 'border-field-ink/40 bg-field-ink/5 text-field-ink'
            : localJackOfAll.length >= 2
              ? 'border-field-slate/30 opacity-60 cursor-not-allowed text-field-slate'
              : 'border-field-slate/40 text-field-slate hover:border-field-ink/30'"
          :disabled="localJackOfAll.length >= 2 && !localJackOfAll.includes(action.key)"
          @click="toggleJackOfAll(action.key)"
        >
          {{ action.name }}
        </button>
      </div>
    </div>

    <!-- 负载选择 -->
    <div class="card-archive">
      <div class="section-title-ink">选择负载等级</div>
      <div class="grid grid-cols-3 gap-3">
        <button
          v-for="loadOption in ['light', 'medium', 'heavy'] as const"
          :key="loadOption"
          class="p-3 border text-center transition-all"
          :class="load === loadOption
            ? 'border-field-ink/40 bg-field-ink/5 text-field-ink'
            : 'border-field-slate/40 text-field-slate hover:border-field-ink/30'"
          @click="selectLoad(loadOption)"
        >
          <div class="font-serif-zh">{{ getLoadLabel(loadOption) }}</div>
          <div class="text-xs mt-1 opacity-70">
            {{ loadoutDesc(loadOption) }} · {{ maxGearSlots }}功能栏
            <span v-if="hasBearStrength" class="text-field-ink font-medium">（力大如熊+2）</span>
          </div>
        </button>
      </div>
    </div>

    <!-- 默认装备 -->
    <div v-if="load" class="card-archive">
      <div class="section-title-ink">{{ getLoadLabel(load) }}默认装备</div>
      <p class="handnote mb-2">根据负载自动获得</p>
      <div class="space-y-2">
        <div
          v-for="item in currentLoadout.fixed"
          :key="item.key"
          class="p-2 border-b border-field-slate/20"
        >
          <div class="flex items-center gap-2">
            <span class="text-sm text-field-ink">{{ item.name }}</span>
            <span v-if="item.uses" class="text-xs text-field-ink font-medium">×{{ item.uses }}</span>
            <span v-if="item.slotCount && item.slotCount > 0" class="text-xs text-field-slate">(占{{ item.slotCount }}格)</span>
          </div>
          <div v-if="item.desc" class="text-xs text-field-slate">{{ item.desc }}</div>
        </div>
      </div>

      <!-- 默认装备选项 -->
      <div v-for="(group, gi) in currentLoadout.choices" :key="gi" class="mt-3">
        <div class="font-mono text-[10px] text-field-slate/70 tracking-wider uppercase mb-2">{{ group.label }}（必选）</div>
        <div class="space-y-2">
          <SelectableCard
            v-for="item in group.items"
            :key="item.key"
            :selected="loadoutChoices.includes(item.key)"
            @click="selectLoadoutChoice(group, item.key)"
          >
            <template #title>
              {{ item.name }}
              <span v-if="item.uses" class="text-xs text-field-ink font-medium">×{{ item.uses }}</span>
            </template>
            <template #desc>{{ item.desc }}</template>
          </SelectableCard>
        </div>
      </div>
    </div>

    <!-- 特性自动装备 -->
    <div v-if="hasDevout" class="card-archive">
      <div class="section-title-ink">特性自动装备</div>
      <div class="p-2 border border-field-ink/20">
        <div class="flex items-center gap-2">
          <span class="text-sm text-field-ink">圣骸</span>
          <span class="text-xs text-field-ink font-medium">（信仰虔诚·不占用功能栏）</span>
        </div>
        <div class="text-xs text-field-slate">降低腐化，抵抗腐化+1骰</div>
      </div>
    </div>

    <!-- 能力自动装备 -->
    <div v-if="hasChemist" class="card-archive">
      <div class="section-title-ink">能力自动装备</div>
      <div class="p-2 border border-field-ink/20">
        <div class="flex items-center gap-2">
          <span class="text-sm text-field-ink">炼金武装带</span>
          <span class="text-xs text-field-ink font-medium">（化学家）</span>
        </div>
        <div class="text-xs text-field-slate">枭目油、化合软膏、深海试剂等</div>
      </div>
    </div>

    <!-- 可选装备池 -->
    <div class="card-archive">
      <div class="section-title-ink">
        功能栏选项（{{ effectiveGearSlots.length }}/{{ maxGearSlots }} 件）
      </div>
      <p class="handnote mb-3">
        从可选池中选择装备。
      </p>
      <div class="space-y-2">
        <SelectableCard
          v-for="gear in displayGearPool"
          :key="gear.key"
          :selected="gearSlots.includes(gear.key)"
          :disabled="gearSlots.length >= maxGearSlots && !gearSlots.includes(gear.key)"
          @click="$emit('toggle-gear', gear.key)"
        >
          <template #title>{{ gear.name }}</template>
          <template #desc>{{ gear.desc }}</template>
        </SelectableCard>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
import {
  ROLES, getRoleGearConfig, getDefaultLoadout, LEGION_ROLES,
  getRoleName, getLoadLabel, ACTIONS,
} from '~/composables/useCharacterData'
import type { ChoiceGroup, GearItem } from '~/composables/useCharacterData'

const props = defineProps<{
  role: string
  abilityKey: string
  load: 'light' | 'medium' | 'heavy'
  gearSlots: string[]
  loadoutChoices: string[]
  traits: string[]
  actions: Record<string, number>
  jackOfAllActions: string[]
}>()

const emit = defineEmits<{
  'update:ability': [key: string]
  'update:load': [load: 'light' | 'medium' | 'heavy']
  'toggle-gear': [key: string]
  'update:loadoutChoices': [choices: string[]]
  'update:jack-of-all-actions': [actions: string[]]
}>()

const roleAbilities = computed(() => {
  return ROLES.find(r => r.key === props.role)?.abilities || []
})

const hasBearStrength = computed(() => props.abilityKey === 'bear_strength')
const hasDevout = computed(() => props.traits.includes('devout'))
const hasChemist = computed(() => props.abilityKey === 'chemist')
const hasGrenadier = computed(() => props.abilityKey === 'grenadier')

const maxGearSlots = computed(() => {
  let slots = 2
  if (hasBearStrength.value) slots += 2
  return slots
})

const currentLoadout = computed(() => {
  if (!props.role || !props.load) return { fixed: [], choices: [] }
  return getDefaultLoadout(props.role, props.load)
})

// jack_of_all 本地状态
const localJackOfAll = computed(() => props.jackOfAllActions)

function selectAbility(key: string) {
  emit('update:ability', key)
  // 切换能力时重置 jack_of_all 选择
  if (key !== 'jack_of_all') {
    emit('update:jack-of-all-actions', [])
  }
}

const zeroLevelActions = computed(() => {
  return ACTIONS.filter(a => !props.actions[a.key])
})

function toggleJackOfAll(key: string) {
  const idx = localJackOfAll.value.indexOf(key)
  if (idx >= 0) {
    const next = [...localJackOfAll.value]
    next.splice(idx, 1)
    emit('update:jack-of-all-actions', next)
  } else if (localJackOfAll.value.length < 2) {
    emit('update:jack-of-all-actions', [...localJackOfAll.value, key])
  }
}

// 可选装备池（根据特性/能力动态调整）
const displayGearPool = computed(() => {
  if (!props.role) return []
  let pool: GearItem[] = [...getRoleGearConfig(props.role).optional]

  // devout: 从可选池移除圣骸（自动装备）
  if (hasDevout.value) {
    pool = pool.filter(g => g.key !== 'relic')
  }

  // grenadier: 轻装时增加手榴弹和炸药
  if (hasGrenadier.value && props.load === 'light') {
    pool.push(
      { key: 'grenade', name: '手榴弹', slots: 1, desc: '爆炸物，可对群体造成伤害' },
      { key: 'explosive', name: '炸药', slots: 2, desc: '大威力爆炸物，可破坏建筑' },
    )
  }

  // chemist: 炼金武装带始终可用（已经在 medic 池中，这里只是确保）
  // 如果不在池中则添加
  if (hasChemist.value && !pool.some(g => g.key === 'alchemical_bandolier')) {
    pool.push(
      { key: 'alchemical_bandolier', name: '炼金武装带', slots: 1, desc: '枭目油、化合软膏、深海试剂等（化学家）' },
    )
  }

  return pool
})

// 实际占用的功能栏装备（排除自动装备）
const effectiveGearSlots = computed(() => props.gearSlots)

function selectLoad(loadOption: 'light' | 'medium' | 'heavy') {
  emit('update:load', loadOption)
  emit('update:loadoutChoices', [])
}

function selectLoadoutChoice(group: ChoiceGroup, key: string) {
  const otherChoices = props.loadoutChoices.filter(k =>
    !group.items.some(item => item.key === k)
  )
  emit('update:loadoutChoices', [...otherChoices, key])
}

function loadoutDesc(loadOption: string): string {
  const cfg = getRoleGearConfig(props.role)
  const loadout = cfg[loadOption as keyof typeof cfg] as { fixed: any[]; choices: any[] }
  const fixedCount = loadout?.fixed?.length || 0
  const choiceCount = loadout?.choices?.length || 0
  const parts: string[] = []
  if (fixedCount > 0) parts.push(`${fixedCount}件固定`)
  if (choiceCount > 0) parts.push(`${choiceCount}项选择`)
  return parts.join('·') || '基础装备'
}
</script>
