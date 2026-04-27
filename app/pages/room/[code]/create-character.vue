<template>
  <div class="max-w-2xl mx-auto animate-fade-in">
    <!-- 步骤导航 -->
    <div class="flex items-center justify-center gap-2 mb-8">
      <div v-for="(s, i) in steps" :key="i" class="flex items-center gap-2">
        <div 
          class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-mono transition-colors"
          :class="i <= step ? 'bg-field-gold text-field-bg' : 'bg-field-bg-light text-field-slate border border-field-border'"
        >
          {{ i + 1 }}
        </div>
        <span 
          class="text-sm hidden sm:block"
          :class="i <= step ? 'text-field-gold' : 'text-field-slate'"
        >
          {{ s }}
        </span>
        <div v-if="i < steps.length - 1" class="w-8 h-px bg-field-border" />
      </div>
    </div>

    <!-- Step 1: 选择特种士兵 -->
    <div v-if="step === 0" class="space-y-6">
      <h2 class="text-xl font-serif-zh text-field-gold text-center">选择特种士兵</h2>
      
      <div class="grid grid-cols-1 gap-3">
        <button
          v-for="role in ROLES"
          :key="role.key"
          @click="selectRole(role)"
          class="card-field text-left hover:border-field-gold/50 transition-all"
          :class="form.role === role.key ? 'border-field-gold bg-field-gold/5' : ''"
        >
          <div class="flex items-start justify-between">
            <div>
              <div class="font-serif-zh text-lg text-field-paper">{{ role.name }}</div>
              <div class="text-xs text-field-gold mt-1">{{ role.specialAction || '无特种行动' }}</div>
              <p class="text-sm text-field-slate mt-2 leading-relaxed">{{ role.description }}</p>
            </div>
            <div 
              class="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-4 mt-1"
              :class="form.role === role.key ? 'border-field-gold bg-field-gold' : 'border-field-slate'"
            >
              <div v-if="form.role === role.key" class="w-2 h-2 bg-field-bg rounded-full" />
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Step 2: 文化与特性 -->
    <div v-if="step === 1" class="space-y-6">
      <h2 class="text-xl font-serif-zh text-field-gold text-center">文化与特性</h2>
      
      <!-- 文化选择 -->
      <div class="card-field">
        <div class="section-title">选择文化</div>
        <div class="grid grid-cols-2 gap-3">
          <button
            v-for="culture in CULTURES"
            :key="culture.key"
            @click="selectCulture(culture.key)"
            class="p-3 rounded border text-left transition-all"
            :class="form.culture === culture.key 
              ? 'border-field-gold bg-field-gold/5 text-field-paper' 
              : 'border-field-border text-field-slate hover:border-field-gold/30'"
          >
            <div class="font-serif-zh">{{ culture.name }}</div>
            <div class="text-xs mt-1 opacity-70">{{ culture.namingStyle }}</div>
          </button>
        </div>
      </div>

      <!-- 名字 -->
      <div class="card-field">
        <div class="section-title">角色名字</div>
        <input v-model="form.name" class="input-field w-full" placeholder="输入角色名字" />
        <div v-if="selectedCulture" class="mt-3">
          <div class="text-xs text-field-slate mb-2">名字参考：</div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="n in [...selectedCulture.maleNames, ...selectedCulture.femaleNames].slice(0, 8)"
              :key="n"
              @click="form.name = n"
              class="text-xs px-2 py-1 rounded bg-field-bg border border-field-border hover:border-field-gold/50 transition-colors"
            >
              {{ n }}
            </button>
          </div>
        </div>
      </div>

      <!-- 特性选择 -->
      <div class="card-field">
        <div class="section-title">
          选择特性（{{ form.traits.length }}/2）
        </div>
        <div v-if="!form.culture" class="text-sm text-field-slate">
          请先选择文化
        </div>
        <div v-else class="space-y-2">
          <button
            v-for="trait in selectedCulture?.traits"
            :key="trait.key"
            @click="toggleTrait(trait.key)"
            class="w-full p-3 rounded border text-left transition-all flex items-center justify-between"
            :class="form.traits.includes(trait.key)
              ? 'border-field-gold bg-field-gold/5' 
              : 'border-field-border hover:border-field-gold/30'"
            :disabled="form.traits.length >= 2 && !form.traits.includes(trait.key)"
          >
            <div>
              <div class="text-field-paper">{{ trait.name }}</div>
              <div class="text-xs text-field-slate">{{ trait.effect }}</div>
            </div>
            <div 
              class="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ml-3"
              :class="form.traits.includes(trait.key) ? 'border-field-gold bg-field-gold' : 'border-field-slate'"
            >
              <div v-if="form.traits.includes(trait.key)" class="w-2 h-2 bg-field-bg rounded-full" />
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Step 3: 行动点数 -->
    <div v-if="step === 2" class="space-y-6">
      <h2 class="text-xl font-serif-zh text-field-gold text-center">
        分配行动点数
        <span class="text-sm text-field-slate block mt-1">
          剩余: {{ remainingPoints }} / 4点（起始最大等级2）
        </span>
      </h2>

      <div class="card-field space-y-4">
        <div v-for="action in ACTIONS" :key="action.key" class="flex items-center gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="text-field-paper">{{ action.name }}</span>
              <span class="text-xs text-field-slate">({{ action.attr }})</span>
            </div>
            <div class="text-xs text-field-slate truncate">{{ action.desc }}</div>
          </div>
          
          <div class="flex items-center gap-1">
            <button
              v-for="lvl in [0, 1, 2]"
              :key="lvl"
              @click="setActionLevel(action.key, lvl)"
              class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
              :class="getActionLevel(action.key) >= lvl 
                ? 'border-field-gold bg-field-gold' 
                : 'border-field-slate hover:border-field-gold/50'"
            >
              <div v-if="getActionLevel(action.key) >= lvl" class="w-2 h-2 bg-field-bg rounded-full" />
            </button>
          </div>
        </div>
      </div>

      <div v-if="remainingPoints < 0" class="text-field-red text-sm text-center">
        行动点数超出限制！
      </div>
    </div>

    <!-- Step 4: 能力与装备 -->
    <div v-if="step === 3" class="space-y-6">
      <h2 class="text-xl font-serif-zh text-field-gold text-center">起始能力与装备</h2>
      
      <!-- 能力选择 -->
      <div class="card-field">
        <div class="section-title">选择一个起始能力</div>
        <div class="space-y-2">
          <button
            v-for="ability in selectedRole?.abilities"
            :key="ability.key"
            @click="form.startingAbility = ability.key"
            class="w-full p-3 rounded border text-left transition-all"
            :class="form.startingAbility === ability.key
              ? 'border-field-gold bg-field-gold/5' 
              : 'border-field-border hover:border-field-gold/30'"
          >
            <div class="flex items-start justify-between">
              <div>
                <div class="text-field-paper">{{ ability.name }}</div>
                <div class="text-xs text-field-slate mt-1">{{ ability.description }}</div>
              </div>
              <div 
                class="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-3 mt-0.5"
                :class="form.startingAbility === ability.key ? 'border-field-gold bg-field-gold' : 'border-field-slate'"
              >
                <div v-if="form.startingAbility === ability.key" class="w-2 h-2 bg-field-bg rounded-full" />
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- 负载选择 -->
      <div class="card-field">
        <div class="section-title">选择负载等级</div>
        <div class="grid grid-cols-3 gap-3">
          <button
            v-for="load in ['light', 'medium', 'heavy'] as const"
            :key="load"
            @click="form.load = load"
            class="p-3 rounded border text-center transition-all"
            :class="form.load === load 
              ? 'border-field-gold bg-field-gold/5 text-field-paper' 
              : 'border-field-border text-field-slate hover:border-field-gold/30'"
          >
            <div class="font-serif-zh">{{ loadLabel(load) }}</div>
            <div class="text-xs mt-1 opacity-70">
              {{ load === 'light' ? '轻便快捷' : load === 'medium' ? '均衡配置' : '缓慢重装' }}
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Step 5: 确认 -->
    <div v-if="step === 4" class="space-y-6">
      <h2 class="text-xl font-serif-zh text-field-gold text-center">确认角色</h2>
      
      <div class="card-field space-y-4">
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-field-slate">姓名：</span>
            <span class="text-field-paper">{{ form.name }}</span>
          </div>
          <div>
            <span class="text-field-slate">文化：</span>
            <span class="text-field-paper">{{ cultureName(form.culture) }}</span>
          </div>
          <div>
            <span class="text-field-slate">职业：</span>
            <span class="text-field-paper">{{ roleName(form.role) }}</span>
          </div>
          <div>
            <span class="text-field-slate">负载：</span>
            <span class="text-field-paper">{{ loadLabel(form.load) }}</span>
          </div>
        </div>
        
        <div>
          <span class="text-field-slate text-sm">特性：</span>
          <div class="flex gap-2 mt-1">
            <span v-for="t in form.traits" :key="t" class="text-xs px-2 py-1 rounded bg-field-gold/10 text-field-gold border border-field-gold/30">
              {{ traitName(t) }}
            </span>
          </div>
        </div>
        
        <div>
          <span class="text-field-slate text-sm">起始能力：</span>
          <div class="mt-1 text-field-paper">{{ abilityName(form.startingAbility) }}</div>
        </div>
        
        <div>
          <span class="text-field-slate text-sm">行动分配：</span>
          <div class="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-xs">
            <div v-for="action in ACTIONS" :key="action.key">
              <span class="text-field-slate">{{ action.name }}:</span>
              <span class="text-field-paper ml-1">{{ getActionLevel(action.key) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 导航按钮 -->
    <div class="flex justify-between mt-8">
      <button 
        v-if="step > 0" 
        @click="step--" 
        class="btn-secondary"
      >
        上一步
      </button>
      <div v-else />
      
      <button 
        v-if="step < steps.length - 1"
        @click="nextStep"
        :disabled="!canProceed"
        class="btn-primary"
        :class="!canProceed ? 'opacity-50 cursor-not-allowed' : ''"
      >
        下一步
      </button>
      <button 
        v-else
        @click="submit"
        :disabled="submitting"
        class="btn-primary"
      >
        {{ submitting ? '创建中...' : '报道并服役' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ROLES, CULTURES, ACTIONS, TOTAL_ACTION_POINTS, MAX_STARTING_ACTION_LEVEL } from '~/composables/useCharacterData'
import type { Role, Culture } from '~/composables/useCharacterData'

const steps = ['选择职业', '文化特性', '行动点数', '能力装备', '确认']
const step = ref(0)
const submitting = ref(false)

const form = reactive({
  role: '',
  culture: '',
  name: '',
  traits: [] as string[],
  actions: {} as Record<string, number>,
  startingAbility: '',
  load: 'medium' as 'light' | 'medium' | 'heavy',
})

const selectedRole = computed(() => ROLES.find(r => r.key === form.role))
const selectedCulture = computed(() => CULTURES.find(c => c.key === form.culture))

const remainingPoints = computed(() => {
  const used = Object.values(form.actions).reduce((sum, v) => sum + (v || 0), 0)
  return TOTAL_ACTION_POINTS - used
})

const canProceed = computed(() => {
  if (step.value === 0) return !!form.role
  if (step.value === 1) return !!form.culture && !!form.name.trim() && form.traits.length === 2
  if (step.value === 2) return remainingPoints.value === 0
  if (step.value === 3) return !!form.startingAbility
  return true
})

function selectRole(role: Role) {
  form.role = role.key
  form.actions = {}
  form.startingAbility = ''
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

function getActionLevel(key: string): number {
  return form.actions[key] || 0
}

function setActionLevel(key: string, level: number) {
  const current = getActionLevel(key)
  const diff = level - current
  if (remainingPoints.value - diff < 0) return
  if (level > MAX_STARTING_ACTION_LEVEL) return
  form.actions[key] = level
}

function nextStep() {
  if (canProceed.value) step.value++
}

function loadLabel(load: string): string {
  const map: Record<string, string> = { light: '轻装', medium: '中装', heavy: '重装' }
  return map[load] || load
}

function cultureName(key: string): string {
  return CULTURES.find(c => c.key === key)?.name || key
}

function roleName(key: string): string {
  return ROLES.find(r => r.key === key)?.name || key
}

function traitName(key: string): string {
  for (const c of CULTURES) {
    const t = c.traits.find(tr => tr.key === key)
    if (t) return t.name
  }
  return key
}

function abilityName(key: string): string {
  for (const r of ROLES) {
    const a = r.abilities.find(ab => ab.key === key)
    if (a) return a.name
  }
  return key
}

const route = useRoute()
const code = computed(() => (route.params.code as string).toUpperCase())

async function submit() {
  submitting.value = true
  try {
    const roleData = selectedRole.value
    await $fetch(`/api/rooms/${code.value}/characters`, {
      method: 'POST',
      body: {
        playerName: '玩家', // TODO: 让玩家输入
        name: form.name,
        culture: form.culture,
        traits: form.traits,
        role: form.role,
        specialAction: roleData?.specialAction || '',
        abilities: [form.startingAbility],
        actions: form.actions,
        load: form.load,
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
