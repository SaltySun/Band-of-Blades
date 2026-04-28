<template>
  <div class="max-w-3xl mx-auto animate-fade-in">
    <!-- 标题 -->
    <div class="text-center mb-8">
      <div class="handnote text-field-hand/60 text-xs mb-2 tracking-wider">新兵入伍处 · 档案科</div>
      <h1 class="font-brush text-4xl text-field-gold tracking-wider">入伍登记</h1>
    </div>

    <!-- 步骤导航 — 档案页码 -->
    <div class="flex items-center justify-center gap-1 mb-8">
      <div v-for="(s, i) in steps" :key="i" class="flex items-center gap-1">
        <button
          type="button"
          class="w-10 h-10 flex items-center justify-center text-sm font-mono transition-all border"
          :class="i === step ? 'border-field-gold bg-field-gold/10 text-field-gold' : i < step ? 'border-field-gold/30 text-field-gold/60' : 'border-field-border text-field-slate/40'"
          @click="step = i"
        >
          {{ i + 1 }}
        </button>
        <span
          class="text-xs hidden sm:block font-mono tracking-wider"
          :class="i === step ? 'text-field-gold' : i < step ? 'text-field-gold/40' : 'text-field-slate/30'"
        >
          {{ s }}
        </span>
        <div v-if="i < steps.length - 1" class="w-4 h-px bg-field-border mx-1" />
      </div>
    </div>

    <!-- 步骤内容 -->
    <CharacterCreateStepRole
      v-if="step === 0"
      :selected-key="form.role"
      @select="selectRole"
    />

    <CharacterCreateStepCulture
      v-else-if="step === 1"
      :name="form.name"
      :selected-culture="form.culture"
      :traits="form.traits"
      @update:name="form.name = $event"
      @update:culture="selectCulture"
      @toggle-trait="toggleTrait"
    />

    <CharacterCreateStepActions
      v-else-if="step === 2"
      :actions="form.actions"
      :traits="form.traits"
      :role="form.role"
      @update:actions="form.actions = $event"
    />

    <CharacterCreateStepAbilityGear
      v-else-if="step === 3"
      :role="form.role"
      :ability-key="form.startingAbility"
      :load="form.load"
      :gear-slots="form.gearSlots"
      :loadout-choices="form.loadoutChoices"
      :traits="form.traits"
      :actions="form.actions"
      :jack-of-all-actions="form.jackOfAllActions"
      @update:ability="selectAbility"
      @update:load="form.load = $event"
      @toggle-gear="toggleGear"
      @update:loadout-choices="form.loadoutChoices = $event"
      @update:jack-of-all-actions="form.jackOfAllActions = $event"
    />

    <CharacterCreateStepLegionRole
      v-else-if="step === 4"
      :selected-key="form.legionRole"
      :taken-roles="takenLegionRoles"
      @select="form.legionRole = $event"
    />

    <CharacterCreateStepConfirm
      v-else-if="step === 5"
      :form="form"
      :player-name="playerName"
    />

    <!-- 导航按钮 -->
    <div class="flex justify-between mt-8">
      <button
        v-if="step > 0"
        type="button"
        class="px-4 py-2 border border-field-border text-field-slate font-mono text-xs tracking-wider uppercase
               hover:border-field-gold/50 hover:text-field-gold transition-colors"
        @click="step--"
      >
        ← 上一步
      </button>
      <div v-else />

      <button
        v-if="step < steps.length - 1"
        type="button"
        :disabled="!canProceed"
        class="btn-seal"
        :class="!canProceed ? 'opacity-40 cursor-not-allowed' : ''"
        @click="nextStep"
      >
        下一步 →
      </button>
      <button
        v-else
        type="button"
        :disabled="submitting"
        class="btn-seal"
        @click="submit"
      >
        {{ submitting ? '登记中...' : '报道并服役' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ROLES, CULTURES, TOTAL_ACTION_POINTS,
  getRoleGearPool, LEGION_ROLES, getTraitActionBonuses,
} from '~/composables/useCharacterData'

const route = useRoute()
const code = computed(() => (route.params.code as string).toUpperCase())

const steps = ['选择职业', '文化特性', '行动点数', '能力装备', '军团职务', '确认']
const step = ref(0)
const submitting = ref(false)

const { playerName } = usePlayerName()

// 客户端挂载后检查：如果没有玩家名，重定向回房间
onMounted(() => {
  if (!playerName.value) {
    navigateTo(`/room/${code.value}`)
  }
})

const form = reactive({
  role: '',
  culture: '',
  name: '',
  traits: [] as string[],
  actions: {} as Record<string, number>,
  startingAbility: '',
  load: 'medium' as 'light' | 'medium' | 'heavy',
  gearSlots: [] as string[],
  loadoutChoices: [] as string[],
  legionRole: '',
  jackOfAllActions: [] as string[], // jack_of_all 额外提升的两项行动
})

const selectedRole = computed(() => ROLES.find(r => r.key === form.role))
const selectedCulture = computed(() => CULTURES.find(c => c.key === form.culture))

// 当前职业的装备池
const roleGearPool = computed(() => {
  if (!form.role) return []
  return getRoleGearPool(form.role)
})

// 已选择的职务映射 { roleKey: playerName }
const { data: existingCharsData } = await useFetch(`/api/rooms/${code.value}/characters`)
const takenLegionRoles = computed(() => {
  const map: Record<string, string> = {}
  const chars = existingCharsData.value?.characters || []
  for (const c of chars) {
    if (c.legionRole) {
      map[c.legionRole] = c.playerName || c.name
    }
  }
  return map
})

const ROLE_SPECIAL_ACTION_MAP: Record<string, string> = {
  heavy: 'martial_arts',
  medic: 'medicine',
  sniper: 'aim',
  officer: 'channel',
  soldier: 'endure',
  scout: 'survival',
}

const remainingPoints = computed(() => {
  const specialKey = ROLE_SPECIAL_ACTION_MAP[form.role] || ''
  const used = Object.entries(form.actions).reduce((sum, [k, v]) => {
    if (k === specialKey) return sum // 本职专家技能1级不消耗预算
    return sum + (v || 0)
  }, 0)
  return TOTAL_ACTION_POINTS - used
})

const canProceed = computed(() => {
  if (step.value === 0) return !!form.role
  if (step.value === 1) return !!form.culture && !!form.name.trim() && form.traits.length === 2
  if (step.value === 2) return remainingPoints.value === 0
  if (step.value === 3) {
    if (!form.startingAbility) return false
    if (form.startingAbility === 'jack_of_all' && form.jackOfAllActions.length !== 2) return false
    return true
  }
  if (step.value === 4) return true // 军团职务可选
  return true
})

function selectRole(key: string) {
  form.role = key
  form.actions = {}
  form.startingAbility = ''
  form.gearSlots = []
  form.loadoutChoices = []
}

function selectCulture(key: string) {
  form.culture = key
  form.traits = []
}

function toggleTrait(key: string) {
  const idx = form.traits.indexOf(key)
  if (idx >= 0) {
    form.traits.splice(idx, 1)
  } else if (form.traits.length < 2) {
    form.traits.push(key)
  }
}

function selectAbility(key: string) {
  form.startingAbility = key
  // true_local: 自动获得所有文化特性
  if (key === 'true_local' && form.role === 'rookie') {
    const culture = CULTURES.find(c => c.key === form.culture)
    if (culture) {
      form.traits = culture.traits.map(t => t.key)
    }
  }
}

function toggleGear(key: string) {
  const idx = form.gearSlots.indexOf(key)
  if (idx >= 0) {
    form.gearSlots.splice(idx, 1)
  } else if (form.gearSlots.length < 2) {
    form.gearSlots.push(key)
  }
}

function nextStep() {
  if (canProceed.value) step.value++
}

async function submit() {
  submitting.value = true
  try {
    const roleData = selectedRole.value
    // 合并特性加成 + jack_of_all 的额外行动
    const finalActions = { ...form.actions }
    const traitBonuses = getTraitActionBonuses(form.traits)
    for (const [key, bonus] of Object.entries(traitBonuses)) {
      finalActions[key] = (finalActions[key] || 0) + bonus
    }
    for (const key of form.jackOfAllActions) {
      finalActions[key] = (finalActions[key] || 0) + 1
    }
    // devout 自动装备圣骸
    const finalGearSlots = [...form.gearSlots]
    if (form.traits.includes('devout') && !finalGearSlots.includes('relic')) {
      finalGearSlots.push('relic')
    }
    await $fetch(`/api/rooms/${code.value}/characters`, {
      method: 'POST',
      body: {
        playerName: playerName.value.trim(),
        name: form.name.trim(),
        culture: form.culture,
        traits: form.traits,
        role: form.role,
        specialAction: roleData?.specialAction || '',
        abilities: [form.startingAbility],
        actions: finalActions,
        load: form.load,
        gearSlots: finalGearSlots,
        loadoutChoices: form.loadoutChoices,
        legionRole: form.legionRole,
        isRookie: roleData?.isRookie || false,
      },
    })
    navigateTo(`/room/${code.value}`)
  } catch (e: any) {
    alert(e.data?.statusMessage || '创建失败')
  } finally {
    submitting.value = false
  }
}
</script>
