<template>
  <div class="space-y-6">
    <h2 class="text-xl font-serif-zh text-field-gold text-center">确认角色</h2>

    <div class="card-field space-y-4">
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span class="text-field-slate">玩家：</span>
          <span class="text-field-paper">{{ playerName }}</span>
        </div>
        <div>
          <span class="text-field-slate">角色名：</span>
          <span class="text-field-paper">{{ form.name }}</span>
        </div>
        <div>
          <span class="text-field-slate">文化：</span>
          <span class="text-field-paper">{{ getCultureName(form.culture) }}</span>
        </div>
        <div>
          <span class="text-field-slate">职业：</span>
          <span class="text-field-paper">{{ getRoleName(form.role) }}</span>
        </div>
        <div>
          <span class="text-field-slate">负载：</span>
          <span class="text-field-paper">{{ getLoadLabel(form.load) }}</span>
        </div>
        <div v-if="form.legionRole">
          <span class="text-field-slate">职务：</span>
          <span class="text-field-gold">{{ getLegionRoleName(form.legionRole) }}</span>
        </div>
      </div>

      <div>
        <span class="text-field-slate text-sm">特性：</span>
        <div class="flex gap-2 mt-1">
          <span
            v-for="t in form.traits"
            :key="t"
            class="text-xs px-2 py-1 rounded bg-field-gold/10 text-field-gold border border-field-gold/30"
          >
            {{ getTraitName(t) }}
          </span>
        </div>
      </div>

      <div>
        <span class="text-field-slate text-sm">起始能力：</span>
        <div class="mt-1 text-field-paper">{{ getAbilityName(form.startingAbility) }}</div>
      </div>

      <div v-if="form.gearSlots.length > 0">
        <span class="text-field-slate text-sm">自选装备：</span>
        <div class="flex flex-wrap gap-1 mt-1">
          <span
            v-for="gk in form.gearSlots"
            :key="gk"
            class="text-xs px-2 py-0.5 rounded bg-field-gold/10 text-field-gold border border-field-gold/30"
          >
            {{ getGearName(gk, form.role) }}
          </span>
        </div>
      </div>

      <div>
        <span class="text-field-slate text-sm">行动分配：</span>
        <div class="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-xs">
          <div v-for="action in nonExpertActions" :key="action.key">
            <span class="text-field-slate">{{ action.name }}:</span>
            <span class="text-field-paper ml-1">{{ form.actions[action.key] || 0 }}</span>
          </div>
        </div>
        <div v-if="roleSpecialAction" class="mt-1 text-xs">
          <span class="text-field-gold">{{ roleSpecialActionName }}:</span>
          <span class="text-field-paper ml-1">{{ form.actions[roleSpecialAction] || 0 }}</span>
          <span class="text-field-slate">（本职）</span>
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
import { computed } from 'vue'

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

defineProps<{
  form: FormData
  playerName: string
}>()
</script>
