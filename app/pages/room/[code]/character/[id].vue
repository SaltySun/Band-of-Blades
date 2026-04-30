<template>
  <div class="max-w-6xl mx-auto animate-fade-in pb-8">
    <!-- 返回 -->
    <div class="mb-6">
      <NuxtLink :to="`/room/${code}`" class="text-sm text-field-paper/70 hover:text-field-gold transition-colors font-mono">
        ← 返回花名册
      </NuxtLink>
    </div>

    <!-- 加载/错误 -->
    <div v-if="pending" class="text-center py-16 text-field-paper/70 font-mono">调阅档案中...</div>
    <div v-else-if="error" class="text-center py-16">
      <p class="text-field-paper font-mono bg-field-red/25 rounded px-3 py-1.5 inline-block">{{ error.statusMessage || '调阅失败' }}</p>
    </div>

    <div v-else-if="char" class="space-y-6">
      <!-- ===== 头部 — Personnel File ===== -->
      <div class="card-archive relative" style="transform: rotate(-0.2deg);">
        <div class="absolute -top-2 left-8 w-3 h-5 bg-field-bg-light/80 border border-field-border rounded-sm" />
        <div class="stamp-gold absolute -top-2 right-4 z-10 text-[9px]">{{ roleInfo?.name }}</div>

        <div class="flex items-start justify-between">
          <div class="flex items-start gap-4">
            <!-- 档案照片框 -->
            <div class="w-16 h-20 border-2 border-field-ink/20 flex items-center justify-center bg-field-bg-light/30 shrink-0">
              <span class="font-brush text-3xl text-field-ink/30">{{ char.name.charAt(0) }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3 flex-wrap">
                <h1 class="font-brush text-3xl text-field-ink">{{ char.name }}</h1>
                <span v-if="char.isDead" class="stamp text-[10px] px-2 py-0.5">阵亡</span>
                <span v-else-if="char.isRookie" class="stamp-gold text-[10px] px-2 py-0.5">新兵</span>
              </div>
              <div class="text-sm text-field-slate/80 font-mono mt-1">
                {{ char.playerName }}
                <span v-if="char.legionRole" class="text-field-gold ml-2">[{{ getLegionRoleName(char.legionRole) }}]</span>
              </div>
              <div v-if="char.specialAction" class="text-xs text-field-hand mt-2 handnote">
                特种行动：{{ char.specialAction }} — {{ roleInfo?.specialActionDesc }}
              </div>
            </div>
          </div>
          <button type="button"
            class="text-xs px-2 py-1 border border-field-red/30 text-field-red hover:bg-field-red/5 transition-colors shrink-0 font-mono"
            @click="deleteCharacter"
          >销毁档案</button>
        </div>
      </div>

      <!-- ===== 左右两栏布局 ===== -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <!-- ===== 左栏 — 医疗记录 ===== -->
        <div class="space-y-5">
          <!-- 笔记 — 档案批注 -->
          <div class="card-archive relative" style="transform: rotate(0.3deg);">
            <div class="absolute -top-2 right-6 w-3 h-5 bg-field-bg-light/80 border border-field-border rounded-sm" />
            <div class="section-title-ink flex items-center justify-between">
              <span>档案批注</span>
              <span class="font-mono text-[10px] text-field-slate/40">NOTES</span>
            </div>
            <textarea
              v-model="charNotes"
              rows="4"
              class="w-full px-3 py-2 bg-[#e0d4b8] border border-[#b0a080] rounded-sm text-sm text-field-ink outline-none focus:border-field-gold resize-none mt-3"
              placeholder="记录角色的经历、目标、关系..."
              @blur="saveNotes"
            />
          </div>

          <!-- 状态追踪 — 医疗记录 -->
          <div class="card-archive" style="transform: rotate(-0.3deg);">
            <div class="section-title-ink">医疗记录</div>
            <div class="space-y-3 mt-3">
              <!-- 压力 -->
              <div class="flex items-center gap-3">
                <span class="text-sm text-field-ink font-medium w-10 shrink-0 font-mono">压力</span>
                <div class="flex gap-1 flex-wrap">
                  <button type="button"
                    v-for="i in char.stressMax"
                    :key="i"
                    class="w-5 h-5 border transition-colors text-[10px] flex items-center justify-center"
                    :class="char.stress >= i ? 'bg-field-gold border-field-gold text-field-bg' : 'border-field-ink/20 hover:border-field-gold text-transparent'"
                    @click="updateField('stress', char.stress >= i ? i - 1 : i)"
                  >{{ i }}</button>
                </div>
                <span class="text-xs text-field-slate ml-1 font-mono">{{ char.stress }}/{{ char.stressMax }}</span>
              </div>

              <!-- 创伤 -->
              <div class="flex items-start gap-3">
                <span class="text-sm text-field-ink font-medium w-10 shrink-0 font-mono">创伤</span>
                <div class="flex-1">
                  <div class="flex flex-wrap gap-1">
                    <button type="button"
                      v-for="t in traumaOptions"
                      :key="t"
                      class="text-[10px] px-2 py-0.5 border transition-colors font-mono"
                      :class="(char.traumas || []).includes(t)
                        ? 'bg-field-red/10 text-field-red border-field-red/40'
                        : 'text-field-slate/60 border-field-ink/15 hover:border-field-red/30'"
                      @click="toggleTraumaOption(t)"
                    >{{ t }}</button>
                  </div>
                </div>
              </div>

              <!-- 腐化 -->
              <div class="flex items-center gap-3">
                <span class="text-sm text-field-ink font-medium w-10 shrink-0 font-mono">腐化</span>
                <div class="flex gap-1 flex-wrap">
                  <button type="button"
                    v-for="i in 8"
                    :key="i"
                    class="w-4 h-4 border transition-colors"
                    :class="char.rotLevel >= i ? 'bg-field-purple border-field-purple' : 'border-field-ink/20 hover:border-field-purple'"
                    @click="updateField('rotLevel', char.rotLevel >= i ? i - 1 : i)"
                  />
                </div>
                <span class="text-xs text-field-slate ml-1 font-mono">{{ char.rotLevel }}/8</span>
              </div>

              <!-- 腐化症状 -->
              <div class="flex items-start gap-3">
                <span class="text-sm text-field-ink font-medium w-10 shrink-0 font-mono">症状</span>
                <div class="flex-1">
                  <div class="flex flex-wrap gap-1">
                    <button type="button"
                      v-for="s in rotSymptomOptions"
                      :key="s"
                      class="text-[10px] px-2 py-0.5 border transition-colors font-mono"
                      :class="(char.rotSymptoms || []).includes(s)
                        ? 'bg-field-purple/10 text-field-purple border-field-purple/40'
                        : 'text-field-slate/60 border-field-ink/15 hover:border-field-purple/30'"
                      @click="toggleRotSymptom(s)"
                    >{{ s }}</button>
                  </div>
                </div>
              </div>

              <!-- 枯萎病 -->
              <div class="flex items-center gap-3">
                <span class="text-sm text-field-ink font-medium w-10 shrink-0 font-mono">枯萎</span>
                <div class="flex gap-1">
                  <button type="button"
                    v-for="i in 4"
                    :key="i"
                    class="text-lg leading-none transition-colors"
                    :class="cs.blight >= i ? 'text-field-purple' : 'text-field-ink/20 hover:text-field-purple/60'"
                    @click="updateCS('blight', cs.blight >= i ? i - 1 : i)"
                  >◆</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 伤害 — 伤情记录 -->
          <div class="card-archive" style="transform: rotate(0.2deg);">
            <div class="section-title-ink text-field-red">伤情记录</div>
            <div class="space-y-1 mt-3">
              <div class="flex items-center gap-2 py-1.5 border-b border-field-ink/10">
                <span class="text-xs text-field-slate w-4 font-mono">4</span>
                <span class="text-xs text-field-red flex-1 font-medium">死亡</span>
                <span v-if="char.harmLevel4 > 0" class="text-xs text-field-red font-bold font-mono">✕</span>
              </div>
              <div class="flex items-center gap-2 py-1.5 border-b border-field-ink/10">
                <span class="text-xs text-field-slate w-4 font-mono">3</span>
                <span class="text-xs text-field-ink flex-1">需要帮助</span>
                <div class="flex gap-1">
                  <button type="button"
                    v-for="i in 3"
                    :key="i"
                    class="w-5 h-5 border transition-colors"
                    :class="char.harmLevel3 >= i ? 'bg-field-red border-field-red' : 'border-field-ink/20 hover:border-field-red'"
                    @click="updateField('harmLevel3', char.harmLevel3 >= i ? i - 1 : i)"
                  />
                </div>
              </div>
              <div class="flex items-center gap-2 py-1.5 border-b border-field-ink/10">
                <span class="text-xs text-field-slate w-4 font-mono">2</span>
                <span class="text-xs text-field-ink flex-1">-1D</span>
                <div class="flex gap-1">
                  <button type="button"
                    v-for="i in 2"
                    :key="i"
                    class="w-5 h-5 border transition-colors"
                    :class="char.harmLevel2 >= i ? 'bg-field-red border-field-red' : 'border-field-ink/20 hover:border-field-red'"
                    @click="updateField('harmLevel2', char.harmLevel2 >= i ? i - 1 : i)"
                  />
                </div>
              </div>
              <div class="flex items-center gap-2 py-1.5">
                <span class="text-xs text-field-slate w-4 font-mono">1</span>
                <span class="text-xs text-field-ink flex-1">效力减弱</span>
                <div class="flex gap-1">
                  <button type="button"
                    v-for="i in 1"
                    :key="i"
                    class="w-5 h-5 border transition-colors"
                    :class="char.harmLevel1 >= i ? 'bg-field-red border-field-red' : 'border-field-ink/20 hover:border-field-red'"
                    @click="updateField('harmLevel1', char.harmLevel1 >= i ? i - 1 : i)"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 护甲 — 防护记录 -->
          <div class="card-archive" style="transform: rotate(-0.2deg);">
            <div class="section-title-ink">防护记录</div>
            <div class="flex items-center gap-4 mt-3">
              <div class="flex items-center gap-2">
                <span class="text-xs text-field-slate font-mono">等级</span>
                <input
                  v-model.number="char.armor"
                  type="number"
                  min="0"
                  max="4"
                  class="w-12 text-center px-2 py-1 bg-[#e0d4b8] border border-[#b0a080] rounded-sm text-sm text-field-ink outline-none focus:border-field-gold font-mono"
                  @change="updateField('armor', char.armor)"
                >
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs text-field-slate font-mono">类型</span>
                <button type="button"
                  v-for="type in armorTypes"
                  :key="type.key"
                  class="text-xs px-2 py-1 border transition-colors font-mono"
                  :class="cs.armorType === type.key ? 'border-field-gold bg-field-gold/10 text-field-gold' : 'border-field-ink/15 text-field-slate/70 hover:border-field-gold/30'"
                  @click="updateCS('armorType', type.key)"
                >{{ type.name }}</button>
              </div>
            </div>
          </div>

          <!-- 文化特性 -->
          <div class="card-archive" style="transform: rotate(0.3deg);">
            <div class="section-title-ink">文化背景</div>
            <div class="flex flex-wrap gap-2 mt-3">
              <span
                v-for="t in char.traits"
                :key="t"
                class="text-xs px-2.5 py-1 bg-field-gold/10 text-field-gold border border-field-gold/30 font-mono"
              >{{ getTraitName(t, char.culture) }}</span>
            </div>
          </div>
        </div>

        <!-- ===== 右栏 — 技能与装备 ===== -->
        <div class="space-y-5">
          <!-- 特殊能力 — 勋章记录 -->
          <div class="card-archive" style="transform: rotate(0.4deg);">
            <div class="section-title-ink">勋章记录</div>
            <div class="space-y-1.5 mt-3">
              <div
                v-for="ab in allAbilities"
                :key="ab.key"
                class="flex items-start gap-2 py-1.5 border-b border-field-ink/10 last:border-0"
              >
                <button type="button"
                  class="text-field-gold text-sm leading-tight mt-0.5 shrink-0"
                  :class="hasAbility(ab.key) ? 'opacity-100' : 'opacity-30'"
                  @click="toggleAbility(ab.key)"
                >{{ hasAbility(ab.key) ? '◆' : '◇' }}</button>
                <div class="min-w-0">
                  <div class="text-xs text-field-ink font-medium">{{ ab.name }}</div>
                  <div class="text-[10px] text-field-slate/70 leading-relaxed">{{ ab.description }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 行动等级 — 技能评定表 -->
          <div class="card-archive" style="transform: rotate(-0.4deg);">
            <div class="section-title-ink">技能评定</div>
            <div class="space-y-4 mt-3">
              <div v-for="group in actionGroups" :key="group.attr">
                <div class="text-xs text-field-ink font-bold mb-1.5 flex items-center justify-between font-mono">
                  <span>{{ group.attr }}</span>
                  <span v-if="group.resist" class="text-[10px] text-field-slate/50">抵抗：{{ group.resist }}</span>
                </div>
                <div class="space-y-1">
                  <div
                    v-for="action in group.actions"
                    :key="action.key"
                    class="flex items-center gap-2"
                  >
                    <span class="text-xs text-field-ink flex-1">{{ action.name }}</span>
                    <div class="flex gap-0.5">
                      <button
                        v-for="n in 4"
                        :key="n"
                        type="button"
                        class="text-xs leading-none disabled:cursor-not-allowed"
                        :class="n <= action.level
                          ? 'text-field-gold'
                          : canUpgradeAction(action.key)
                            ? 'text-field-ink/20 hover:text-field-gold/60'
                            : 'text-field-ink/10'"
                        :disabled="!canUpgradeAction(action.key) && n > action.level"
                        :title="!canUpgradeAction(action.key) && action.attr === '专家' ? '非本职专家技能不可升级' : ''"
                        @click="setActionLevel(action.key, n)"
                      >◆</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 装备 — 军用清单 -->
          <div class="card-archive" style="transform: rotate(0.2deg);">
            <div class="section-title-ink">装备清单</div>
            <div class="space-y-2 mt-3">
              <div class="flex items-center gap-2 flex-wrap text-xs font-mono">
                <span class="text-field-slate">负载</span>
                <span class="text-field-ink">{{ getLoadLabel(char.load) }}</span>
                <span class="text-field-slate">· 功能栏 {{ gearSlotCount }}/{{ maxGearSlots }}</span>
              </div>
              <div v-if="defaultGear.length" class="space-y-1">
                <div class="text-[10px] text-field-gold font-mono tracking-wider">默认装备</div>
                <div
                  v-for="item in defaultGear"
                  :key="item.key"
                  class="text-xs text-field-slate inline-flex items-center gap-1"
                >· {{ item.name }} <span v-if="item.uses" class="text-field-gold">×{{ item.uses }}</span>
                  <button type="button" class="text-field-slate/50 hover:text-field-red" @click="hideDefaultGear(item.key)">×</button>
                </div>
              </div>
              <div v-if="chosenLoadoutGear.length" class="space-y-1">
                <div class="text-[10px] text-field-gold font-mono tracking-wider">装备选择</div>
                <div
                  v-for="item in chosenLoadoutGear"
                  :key="item.key"
                  class="text-xs text-field-slate inline-flex items-center gap-1"
                >· {{ item.name }} <span v-if="item.uses" class="text-field-gold">×{{ item.uses }}</span>
                  <button type="button" class="text-field-slate/50 hover:text-field-red" @click="hideChoiceGear(item.key)">×</button>
                </div>
              </div>
              <div v-if="gearList.length">
                <div class="text-[10px] text-field-gold font-mono tracking-wider">自选装备</div>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="g in gearList"
                    :key="g.key"
                    class="text-xs px-1.5 py-0.5 bg-[#e0d4b8] border border-[#b0a080] text-field-slate inline-flex items-center gap-1"
                  >{{ g.name }}
                    <button type="button" class="text-field-slate/50 hover:text-field-red" @click="removeGearSlot(g.key)">×</button>
                  </span>
                </div>
              </div>
              <div v-if="customGear.length">
                <div class="text-[10px] text-field-gold font-mono tracking-wider">额外装备</div>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="(g, idx) in customGear"
                    :key="idx"
                    class="text-xs px-1.5 py-0.5 bg-[#e0d4b8] border border-[#b0a080] text-field-slate inline-flex items-center gap-1"
                  >{{ g }}
                    <button type="button" class="text-field-slate/50 hover:text-field-red" @click="removeCustomGear(idx)">×</button>
                  </span>
                </div>
              </div>
              <div class="flex gap-2 mt-2">
                <input
                  v-model="newGearName"
                  type="text"
                  placeholder="装备名称"
                  class="flex-1 px-2 py-1 bg-[#e0d4b8] border border-[#b0a080] rounded-sm text-xs text-field-ink outline-none focus:border-field-gold"
                  @keydown.enter.prevent="addCustomGear"
                >
                <button type="button" class="text-xs px-2 py-1 border border-field-gold/40 text-field-gold hover:bg-field-gold/10 transition-colors font-mono" @click="addCustomGear">添加</button>
              </div>
            </div>
          </div>

          <!-- 属性校验值 — 印章打卡 -->
          <div class="card-archive" style="transform: rotate(-0.3deg);">
            <div class="section-title-ink flex items-center justify-between">
              <span>属性校验值</span>
              <span class="font-mono text-[10px] text-field-slate/40">满6点升1级</span>
            </div>
            <div class="grid grid-cols-3 gap-4 mt-3">
              <div v-for="attr in attrTracks" :key="attr.key" class="text-center">
                <div class="text-xs text-field-ink mb-2 font-mono">{{ attr.name }}</div>
                <div class="flex justify-center gap-1">
                  <button
                    v-for="i in 6"
                    :key="i"
                    type="button"
                    class="w-6 h-6 border transition-colors text-[10px] flex items-center justify-center font-mono"
                    :class="attr.value >= i ? 'bg-field-gold border-field-gold text-field-bg' : 'border-field-ink/20 hover:border-field-gold/50 text-transparent'"
                    @click="updateField(attr.field, attr.value >= i ? i - 1 : i)"
                  >{{ i }}</button>
                </div>
                <div class="text-[10px] text-field-slate mt-1 font-mono">{{ attr.value }}/6</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ACTIONS,
  getCultureName, getTraitName, getGearName,
  getLegionRoleName, getLoadLabel,
  getDefaultLoadout, getRoleGearConfig,
  getExtraGearSlots,
} from '~~/shared/game-data'
import { ROLES } from '~~/shared/game-data'

const route = useRoute()
const code = (route.params.code as string)?.toUpperCase() || ''
const id = parseInt(route.params.id as string, 10)

const { data: charData, pending, error, refresh: refreshChar } = await useFetch(`/api/rooms/${code}/characters/${id}`)

// 本地状态（避免直接修改 useFetch 返回的 freeze 数据）
const localChar = ref<any>(null)
watch(() => charData.value?.character, (v) => {
  if (v) {
    localChar.value = JSON.parse(JSON.stringify(v))
  }
}, { immediate: true })

const char = computed(() => localChar.value)

// 角色职业信息
const roleInfo = computed(() => {
  if (!char.value) return null
  return ROLES.find(r => r.key === char.value!.role)
})

// characterState JSON
const cs = computed(() => {
  const raw = char.value?.characterState
  if (raw && typeof raw === 'string') {
    try { return JSON.parse(raw) } catch { /* ignore */ }
  }
  if (raw && typeof raw === 'object') return raw
  return {}
})

// 笔记
const charNotes = ref('')
watch(() => char.value?.notes, (v) => { charNotes.value = v || '' }, { immediate: true })

// 预定义列表
const traumaOptions = ['冷漠', '阴影', '痴迷', '偏执', '鲁莽', '软弱', '无常', '恶毒']
const rotSymptomOptions = ['咒诅', '寄生', '饥渴', '瘴气', '变异', '狂怒', '腐烂', '幻象']

// 护甲类型
const armorTypes = [
  { key: 'light', name: '护甲' },
  { key: 'heavy', name: '重甲' },
  { key: 'shield', name: '盾牌' },
  { key: 'special', name: '特殊' },
]

// 行动分组
const actionGroups = computed(() => {
  if (!char.value) return []
  const c = char.value
  const map: Record<string, number> = {
    investigation: c.actionInvestigation,
    marksmanship: c.actionMarksmanship,
    rigging: c.actionRigging,
    sway: c.actionSway,
    scout: c.actionScout,
    discipline: c.actionDiscipline,
    skirmish: c.actionSkirmish,
    wreck: c.actionWreck,
    maneuver: c.actionManeuver,
    command: c.actionCommand,
    resolve: c.actionResolve,
    channel: c.actionChannel,
    aim: c.actionAim,
    martial_arts: c.actionMartialArts,
    medicine: c.actionMedicine,
    endure: c.actionEndure,
    survival: c.actionSurvival,
    weave: c.actionWeave,
  }
  const resistMap: Record<string, string> = { 认知: '恐惧', 技术: '眩晕', 决心: '迷惑', 专家: '蛊惑' }
  const grouped = new Map<string, typeof ACTIONS>()
  for (const a of ACTIONS) {
    const list = grouped.get(a.attr) || []
    list.push({ ...a, level: map[a.key] || 0 })
    grouped.set(a.attr, list)
  }
  return Array.from(grouped.entries()).map(([attr, actions]) => ({
    attr,
    resist: resistMap[attr] || '',
    actions,
  }))
})

// 所有能力（角色职业的）
const allAbilities = computed(() => {
  return roleInfo.value?.abilities || []
})

function hasAbility(key: string): boolean {
  return (char.value?.abilities || []).includes(key)
}

// 能力切换：只能选本职能力（新兵也只能选新兵专属）
function toggleAbility(key: string) {
  const current = [...(char.value?.abilities || [])]
  const idx = current.indexOf(key)
  if (idx >= 0) {
    current.splice(idx, 1)
  } else {
    current.push(key)
  }
  updateField('abilities', current)
}

// 额外装备
const newGearName = ref('')
const customGear = computed(() => cs.value.customGear || [])

function addCustomGear() {
  const name = newGearName.value.trim()
  if (!name) return
  const next = [...customGear.value, name]
  updateCS('customGear', next)
  newGearName.value = ''
}

function removeCustomGear(idx: number) {
  const next = [...customGear.value]
  next.splice(idx, 1)
  updateCS('customGear', next)
}

function removeGearSlot(key: string) {
  const current = [...(char.value?.gearSlots || [])]
  const next = current.filter(k => k !== key)
  updateField('gearSlots', next)
}

// 行动字段映射
const ACTION_KEY_TO_FIELD: Record<string, string> = {
  investigation: 'actionInvestigation',
  marksmanship: 'actionMarksmanship',
  rigging: 'actionRigging',
  sway: 'actionSway',
  scout: 'actionScout',
  discipline: 'actionDiscipline',
  skirmish: 'actionSkirmish',
  wreck: 'actionWreck',
  maneuver: 'actionManeuver',
  command: 'actionCommand',
  resolve: 'actionResolve',
  channel: 'actionChannel',
  aim: 'actionAim',
  martial_arts: 'actionMartialArts',
  medicine: 'actionMedicine',
  endure: 'actionEndure',
  survival: 'actionSurvival',
  weave: 'actionWeave',
}

const ROLE_SPECIAL_ACTION_MAP: Record<string, string> = {
  heavy: 'martial_arts',
  medic: 'medicine',
  sniper: 'aim',
  officer: 'channel',
  soldier: 'endure',
  scout: 'survival',
  rookie: '',
}

function canUpgradeAction(key: string): boolean {
  const action = ACTIONS.find(a => a.key === key)
  if (!action) return false
  // 非专家行动都可以升级
  if (action.attr !== '专家') return true
  // 专家行动只能升级本职对应的
  const specialKey = ROLE_SPECIAL_ACTION_MAP[char.value?.role || '']
  return key === specialKey
}

function setActionLevel(key: string, targetLevel: number) {
  const field = ACTION_KEY_TO_FIELD[key]
  if (!field) return
  const current = (char.value as any)?.[field] || 0
  const newLevel = current >= targetLevel ? targetLevel - 1 : targetLevel
  if (newLevel > current && !canUpgradeAction(key)) return
  updateField(field, newLevel)
}

// 属性校验值圆盘
const attrTracks = computed(() => {
  if (!char.value) return []
  return [
    { key: 'mental', name: '认知', field: 'xpMental', value: char.value.xpMental || 0 },
    { key: 'physical', name: '技术', field: 'xpPhysical', value: char.value.xpPhysical || 0 },
    { key: 'resolve', name: '决心', field: 'xpResolve', value: char.value.xpResolve || 0 },
  ]
})

// 默认/选择装备隐藏列表（存储在 characterState）
const hiddenDefaultGear = computed(() => cs.value.hiddenDefaultGear || [])
const hiddenChoiceGear = computed(() => cs.value.hiddenChoiceGear || [])

// 装备计算
const defaultGear = computed(() => {
  if (!char.value) return []
  const hidden = new Set(hiddenDefaultGear.value)
  return getDefaultLoadout(char.value.role, char.value.load).fixed.filter(item => !hidden.has(item.key))
})

const chosenLoadoutGear = computed(() => {
  if (!char.value) return []
  const hidden = new Set(hiddenChoiceGear.value)
  const cfg = getDefaultLoadout(char.value.role, char.value.load)
  const choices = char.value.loadoutChoices || []
  const result = []
  for (const group of cfg.choices) {
    for (const item of group.items) {
      if (choices.includes(item.key) && !hidden.has(item.key)) result.push(item)
    }
  }
  return result
})

function hideDefaultGear(key: string) {
  const next = [...hiddenDefaultGear.value, key]
  updateCS('hiddenDefaultGear', next)
}

function hideChoiceGear(key: string) {
  const next = [...hiddenChoiceGear.value, key]
  updateCS('hiddenChoiceGear', next)
}

const gearList = computed(() => {
  if (!char.value) return []
  return (char.value.gearSlots || []).map((key: string) => ({
    key,
    name: getGearName(key, char.value!.role),
  }))
})

const maxGearSlots = computed(() => {
  if (!char.value) return 2
  return 2 + getExtraGearSlots(char.value.abilities || [])
})

const gearSlotCount = computed(() => {
  if (!char.value) return 0
  let count = 0
  for (const item of defaultGear.value) count += item.slotCount || 0
  for (const item of chosenLoadoutGear.value) count += item.slotCount || 0
  const hasDevout = (char.value.traits || []).includes('devout')
  count += gearList.value.filter(g => !(hasDevout && g.key === 'relic')).length
  return count
})

// 保存字段（乐观更新本地状态，避免闪烁）
async function updateField(field: string, value: any) {
  if (localChar.value) {
    localChar.value[field] = value
  }
  try {
    await $fetch(`/api/rooms/${code}/characters/${id}`, {
      method: 'PATCH',
      body: { [field]: value },
    })
  } catch (e: any) {
    console.error('更新失败:', e)
    await refreshChar()
  }
}

// 保存 characterState（乐观更新本地状态）
async function updateCS(key: string, value: any) {
  const raw = localChar.value?.characterState
  const currentState = (raw && typeof raw === 'string')
    ? JSON.parse(raw)
    : (raw && typeof raw === 'object' ? raw : {})
  const next = { ...currentState, [key]: value }
  const nextStr = JSON.stringify(next)
  if (localChar.value) {
    localChar.value.characterState = nextStr
  }
  try {
    await $fetch(`/api/rooms/${code}/characters/${id}`, {
      method: 'PATCH',
      body: { characterState: next },
    })
  } catch (e: any) {
    console.error('更新失败:', e)
    await refreshChar()
  }
}

// 保存笔记
async function saveNotes() {
  await updateField('notes', charNotes.value)
}

// 创伤切换
function toggleTraumaOption(name: string) {
  const current = [...(char.value?.traumas || [])]
  const idx = current.indexOf(name)
  if (idx >= 0) {
    current.splice(idx, 1)
  } else if (current.length < (char.value?.traumaMax || 2)) {
    current.push(name)
  }
  updateField('traumas', current)
}

// 腐化症状切换
function toggleRotSymptom(name: string) {
  const current = [...(char.value?.rotSymptoms || [])]
  const idx = current.indexOf(name)
  if (idx >= 0) {
    current.splice(idx, 1)
  } else {
    current.push(name)
  }
  updateField('rotSymptoms', current)
}

async function deleteCharacter() {
  if (!char.value) return
  if (!confirm(`确定要销毁角色「${char.value.name}」的档案吗？此操作不可撤销。`)) return
  try {
    await $fetch(`/api/rooms/${code}/characters/${char.value.id}`, { method: 'DELETE' })
    navigateTo(`/room/${code}`)
  } catch (e: any) {
    alert(e.data?.statusMessage || '销毁失败')
  }
}
</script>
