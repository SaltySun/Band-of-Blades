<template>
  <div class="space-y-6">
    <h2 class="text-xl font-serif-zh text-field-gold text-center">
      分配行动点数
      <span class="text-sm text-field-slate block mt-1">
        剩余: {{ manualRemaining }} / 4点（起始最大等级1）
      </span>
    </h2>

    <!-- 本职专家技能提示 -->
    <div v-if="roleSpecialAction" class="card-field bg-field-gold/5 border-field-gold/20">
      <div class="text-xs text-field-gold">
        本职专家技能：<span class="font-medium">{{ roleSpecialActionName }}</span>
        <span class="text-field-slate">— 创建后自动获得1级</span>
      </div>
    </div>

    <!-- 特性加成提示 -->
    <div v-if="Object.keys(traitBonuses).length > 0" class="card-field bg-field-gold/5 border-field-gold/20">
      <div class="text-xs text-field-gold mb-2">特性自动加成（不计入预算）</div>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="(bonus, key) in traitBonuses"
          :key="key"
          class="text-xs px-2 py-0.5 rounded bg-field-gold/10 text-field-gold border border-field-gold/20"
        >
          {{ getActionName(key) }} +{{ bonus }}
        </span>
      </div>
    </div>

    <div class="card-field space-y-4">
      <div v-for="action in nonExpertActions" :key="action.key" class="flex items-center gap-4">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <span class="text-field-paper">{{ action.name }}</span>
            <span class="text-xs text-field-slate">({{ action.attr }})</span>
            <span v-if="traitBonuses[action.key]" class="text-xs text-field-gold">+{{ traitBonuses[action.key] }}特性</span>
          </div>
          <div class="text-xs text-field-slate truncate">{{ action.desc }}</div>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs text-field-slate w-4 text-right">{{ getDisplayLevel(action.key) }}</span>
          <div class="flex items-center gap-1">
            <!-- 手动分配圆点 -->
            <button
              type="button"
              class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
              :class="getManualLevel(action.key) >= 1
                ? 'border-field-gold bg-field-gold'
                : 'border-field-slate hover:border-field-gold/50'"
              title="1级（消耗1点）"
              @click="setLevel(action.key, 1)"
            >
              <div v-if="getManualLevel(action.key) >= 1" class="w-2 h-2 bg-field-bg rounded-full" />
            </button>
            <!-- 特性加成圆点（额外显示） -->
            <button
              v-if="traitBonuses[action.key]"
              type="button"
              class="w-6 h-6 rounded-full border-2 border-field-gold bg-field-gold/30 flex items-center justify-center cursor-default"
              title="特性加成"
            >
              <div class="w-2 h-2 bg-field-gold rounded-full" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="manualRemaining < 0" class="text-field-red text-sm text-center">
      行动点数超出限制！
    </div>
    <div v-if="manualRemaining > 0" class="text-field-gold/70 text-sm text-center">
      还有 {{ manualRemaining }} 点未分配
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { ACTIONS, TOTAL_ACTION_POINTS, MAX_STARTING_ACTION_LEVEL, getTraitActionBonuses } from '~/composables/useCharacterData'

const ROLE_SPECIAL_ACTION_MAP: Record<string, string> = {
  heavy: 'martial_arts',
  medic: 'medicine',
  sniper: 'aim',
  officer: 'channel',
  soldier: 'endure',
  rookie: '',
  scout: 'survival',
}

const props = defineProps<{
  actions: Record<string, number>
  traits: string[]
  role: string
}>()

const emit = defineEmits<{
  'update:actions': [actions: Record<string, number>]
}>()

const nonExpertActions = computed(() => ACTIONS.filter(a => a.attr !== '专家'))

const roleSpecialAction = computed(() => ROLE_SPECIAL_ACTION_MAP[props.role] || '')
const roleSpecialActionName = computed(() => {
  const key = roleSpecialAction.value
  if (!key) return ''
  return ACTIONS.find(a => a.key === key)?.name || key
})

const traitBonuses = computed(() => getTraitActionBonuses(props.traits))

function getManualLevel(key: string): number {
  return props.actions[key] || 0
}

function getDisplayLevel(key: string): number {
  return (props.actions[key] || 0) + (traitBonuses.value[key] || 0)
}

function getActionName(key: string): string {
  return ACTIONS.find(a => a.key === key)?.name || key
}

const manualRemaining = computed(() => {
  const specialKey = roleSpecialAction.value
  const used = Object.entries(props.actions).reduce((sum, [k, v]) => {
    if (k === specialKey) return sum // 本职专家技能不消耗预算
    return sum + (v || 0)
  }, 0)
  return TOTAL_ACTION_POINTS - used
})

function setLevel(key: string, level: number) {
  const current = getManualLevel(key)
  const newLevel = current === level ? 0 : level
  const diff = newLevel - current
  if (manualRemaining.value - diff < 0) return
  if (newLevel > MAX_STARTING_ACTION_LEVEL) return

  const next = { ...props.actions, [key]: newLevel }
  if (newLevel === 0) {
    delete next[key]
  }
  emit('update:actions', next)
}

// 职业变化时自动设置本职专家技能1级，并清除其他专家技能
watch(() => props.role, (newRole) => {
  const next = { ...props.actions }
  // 先清除所有专家技能
  for (const a of ACTIONS.filter(x => x.attr === '专家')) {
    delete next[a.key]
  }
  const specialKey = ROLE_SPECIAL_ACTION_MAP[newRole]
  if (specialKey) {
    next[specialKey] = 1
  }
  emit('update:actions', next)
}, { immediate: true })
</script>
