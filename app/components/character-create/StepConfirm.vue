<template>
  <div class="space-y-6">
    <h2 class="font-brush text-2xl text-field-ink text-center">确认角色</h2>

    <div class="border border-field-ink/20 p-4 space-y-4">
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span class="font-mono text-[10px] text-field-slate/70 tracking-wider uppercase">玩家</span>
          <span class="text-field-ink ml-1">{{ playerName }}</span>
        </div>
        <div>
          <span class="font-mono text-[10px] text-field-slate/70 tracking-wider uppercase">角色名</span>
          <span class="text-field-ink ml-1">{{ form.name }}</span>
        </div>
        <div>
          <span class="font-mono text-[10px] text-field-slate/70 tracking-wider uppercase">文化</span>
          <span class="text-field-ink ml-1">{{ getCultureName(form.culture) }}</span>
        </div>
        <div>
          <span class="font-mono text-[10px] text-field-slate/70 tracking-wider uppercase">职业</span>
          <span class="text-field-ink ml-1">{{ getRoleName(form.role) }}</span>
        </div>
        <div>
          <span class="font-mono text-[10px] text-field-slate/70 tracking-wider uppercase">负载</span>
          <span class="text-field-ink ml-1">{{ getLoadLabel(form.load) }}</span>
        </div>
        <div v-if="form.legionRole">
          <span class="font-mono text-[10px] text-field-slate/70 tracking-wider uppercase">职务</span>
          <span class="text-field-ink ml-1">{{ getLegionRoleName(form.legionRole) }}</span>
        </div>
      </div>

      <div>
        <span class="font-mono text-[10px] text-field-slate/70 tracking-wider uppercase">特性</span>
        <div class="flex gap-2 mt-1">
          <span
            v-for="t in form.traits"
            :key="t"
            class="text-xs px-2 py-1 border border-field-ink/40 bg-field-ink/5 text-field-ink"
          >
            {{ getTraitName(t) }}
          </span>
        </div>
      </div>

      <div>
        <span class="font-mono text-[10px] text-field-slate/70 tracking-wider uppercase">起始能力</span>
        <div class="mt-1 text-field-ink">{{ getAbilityName(form.startingAbility) }}</div>
      </div>

      <div v-if="form.gearSlots.length > 0">
        <span class="font-mono text-[10px] text-field-slate/70 tracking-wider uppercase">自选装备</span>
        <div class="flex flex-wrap gap-1 mt-1">
          <span
            v-for="gk in form.gearSlots"
            :key="gk"
            class="text-xs px-2 py-0.5 border border-field-ink/40 bg-field-ink/5 text-field-ink"
          >
            {{ getGearName(gk, form.role) }}
          </span>
        </div>
      </div>

      <div>
        <span class="font-mono text-[10px] text-field-slate/70 tracking-wider uppercase">行动分配</span>
        <div class="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-xs">
          <div v-for="action in nonExpertActions" :key="action.key">
            <span class="font-mono text-[10px] text-field-slate/70 tracking-wider uppercase">{{ action.name }}</span>
            <span class="text-field-ink ml-1">{{ form.actions[action.key] || 0 }}</span>
          </div>
        </div>
        <div v-if="roleSpecialAction" class="mt-1 text-xs">
          <span class="font-mono text-[10px] text-field-slate/70 tracking-wider uppercase">{{ roleSpecialActionName }}</span>
          <span class="text-field-ink ml-1">{{ form.actions[roleSpecialAction] || 0 }}</span>
          <span class="handnote">（本职）</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ACTIONS,
  getRoleName, getCultureName, getTraitName, getAbilityName, getGearName,
  getLegionRoleName, getLoadLabel,
} from '~/composables/useCharacterData'

const ROLE_SPECIAL_ACTION_MAP: Record<string, string> = {
  heavy: 'martial_arts',
  medic: 'medicine',
  sniper: 'aim',
  officer: 'channel',
  soldier: 'endure',
  rookie: '',
  scout: 'survival',
}

const nonExpertActions = computed(() => ACTIONS.filter(a => a.attr !== '专家'))
const roleSpecialAction = computed(() => ROLE_SPECIAL_ACTION_MAP[props.form.role] || '')
const roleSpecialActionName = computed(() => {
  const key = roleSpecialAction.value
  if (!key) return ''
  return ACTIONS.find(a => a.key === key)?.name || key
})

interface FormData {
  name: string
  culture: string
  role: string
  traits: string[]
  actions: Record<string, number>
  startingAbility: string
  load: string
  gearSlots: string[]
  legionRole: string
}

const props = defineProps<{
  form: FormData
  playerName: string
}>()
</script>
