<template>
  <div class="space-y-6">
    <h2 class="font-brush text-2xl text-field-gold text-center">
      分配行动点数
      <span class="handnote block mt-1">
        剩余: {{ manualRemaining }} / 4点（起始最大等级2）
      </span>
    </h2>

    <!-- 本职专家技能提示 -->
    <div v-if="roleSpecialAction" class="card-archive">
      <div class="handnote">
        本职专家技能：<span class="font-medium">{{ roleSpecialActionName }}</span>
        <span class="text-field-slate">— 创建后自动获得1级</span>
      </div>
    </div>

    <!-- 特性加成提示 -->
    <div v-if="Object.keys(traitBonuses).length > 0" class="card-archive">
      <div class="font-mono text-[10px] text-field-slate/70 tracking-wider uppercase mb-2">特性自动加成（不计入预算）</div>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="(bonus, key) in traitBonuses"
          :key="key"
          class="text-xs px-2 py-0.5 border text-field-ink border-field-ink/20"
        >
          {{ getActionName(key) }} +{{ bonus }}
        </span>
      </div>
    </div>

    <div class="card-archive space-y-4">
      <div v-for="action in nonExpertActions" :key="action.key" class="flex items-center gap-4">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <span class="text-field-ink">{{ action.name }}</span>
            <span class="text-xs text-field-slate">({{ action.attr }})</span>
            <span v-if="traitBonuses[action.key]" class="text-xs text-field-ink font-medium">+{{ traitBonuses[action.key] }}特性</span>
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
                ? 'border-field-ink bg-field-ink'
                : 'border-field-slate/40 hover:border-field-ink/30'"
              title="1级（消耗1点）"
              @click="setLevel(action.key, 1)"
            >
              <div v-if="getManualLevel(action.key) >= 1" class="w-2 h-2 bg-field-paper rounded-full" />
            </button>
            <button
              type="button"
              class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
              :class="getManualLevel(action.key) >= 2
                ? 'border-field-ink bg-field-ink'
                : 'border-field-slate/40 hover:border-field-ink/30'"
              title="2级（消耗2点）"
              @click="setLevel(action.key, 2)"
            >
              <div v-if="getManualLevel(action.key) >= 2" class="w-2 h-2 bg-field-paper rounded-full" />
            </button>
            <!-- 特性加成圆点（额外显示） -->
            <button
              v-if="traitBonuses[action.key]"
              type="button"
              class="w-6 h-6 rounded-full border-2 border-field-ink/30 bg-field-ink/10 flex items-center justify-center cursor-default"
              title="特性加成"
            >
              <div class="w-2 h-2 bg-field-ink rounded-full" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="manualRemaining < 0" class="text-field-paper text-sm text-center bg-field-red/25 rounded px-3 py-1.5 inline-block">
      行动点数超出限制！
    </div>
    <div v-if="manualRemaining > 0" class="handnote text-sm text-center">
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
