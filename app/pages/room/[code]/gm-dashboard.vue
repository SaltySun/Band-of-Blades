<template>
  <div class="max-w-6xl mx-auto animate-fade-in pb-12">
    <!-- 返回与头部 -->
    <div class="mb-4 flex items-center justify-between">
      <NuxtLink :to="`/room/${code}`" class="text-sm text-field-paper/70 hover:text-field-gold transition-colors">
        ← 返回房间
      </NuxtLink>
      <span class="text-xs font-mono text-field-gold border border-field-gold/30 px-2 py-0.5">GM 视图</span>
    </div>

    <!-- 房间头部 -->
    <div class="mb-6 relative">
      <div class="relative border border-field-gold/30 overflow-hidden" style="background: linear-gradient(135deg, #302c26 0%, #252320 100%);">
        <div class="h-1 bg-field-gold/40" />
        <div class="px-6 py-5">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 class="font-brush text-3xl text-field-gold tracking-wider">{{ dashboard?.room?.name }}</h1>
              <div class="flex items-center gap-3 mt-2">
                <span class="font-mono text-sm text-field-paper/80 tracking-widest">NO. {{ dashboard?.room?.code }}</span>
                <span class="font-mono text-xs text-field-paper/80 tracking-wider uppercase border border-field-border px-2 py-0.5">{{ dashboard?.room?.campaignType }}</span>
              </div>
            </div>
            <div class="text-right">
              <div class="font-mono text-[10px] text-field-paper/50 tracking-wider uppercase">GM TOKEN</div>
              <div class="font-mono text-xs text-field-gold/70 select-all">{{ dashboard?.room?.gmToken }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载 / 错误 -->
    <div v-if="pending" class="text-center py-16 text-field-paper/80 font-mono text-sm">调阅档案中...</div>
    <div v-else-if="error" class="text-center py-16">
      <p class="text-field-paper font-mono bg-field-red/25 rounded px-3 py-1.5 inline-block">{{ error.statusMessage || '调阅失败' }}</p>
    </div>

    <template v-else-if="dashboard">
      <!-- 标签页导航 -->
      <div class="flex flex-wrap gap-1 mb-6 border-b border-field-border pb-1">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="px-3 py-1.5 text-xs font-mono tracking-wider transition-colors border-b-2 -mb-[2px]"
          :class="activeTab === tab.key
            ? 'border-field-gold text-field-gold'
            : 'border-transparent text-field-paper/50 hover:text-field-paper/80'"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}<span v-if="tab.count !== undefined" class="ml-1 opacity-60">({{ tab.count }})</span>
        </button>
      </div>

      <!-- ===== 概览 ===== -->
      <div v-if="activeTab === 'overview'" class="space-y-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div class="card-archive text-center py-4" style="transform: rotate(-0.2deg);">
            <div class="font-mono text-2xl text-field-gold">{{ dashboard.characters.filter(c => !c.isDead).length }}</div>
            <div class="text-[10px] text-field-ink/80 font-mono uppercase mt-1">存活角色</div>
          </div>
          <div class="card-archive text-center py-4" style="transform: rotate(0.2deg);">
            <div class="font-mono text-2xl text-field-red">{{ dashboard.characters.filter(c => c.isDead).length }}</div>
            <div class="text-[10px] text-field-ink/80 font-mono uppercase mt-1">阵亡角色</div>
          </div>
          <div class="card-archive text-center py-4" style="transform: rotate(-0.1deg);">
            <div class="font-mono text-2xl text-field-gold-light">{{ dashboard.deployments.length }}</div>
            <div class="text-[10px] text-field-ink/80 font-mono uppercase mt-1">任务总数</div>
          </div>
          <div class="card-archive text-center py-4" style="transform: rotate(0.1deg);">
            <div class="font-mono text-2xl text-field-paper">{{ dashboard.actionLogs.length }}</div>
            <div class="text-[10px] text-field-ink/80 font-mono uppercase mt-1">日志条目</div>
          </div>
        </div>

        <!-- 军团状态 -->
        <div v-if="dashboard.legion" class="card-archive" style="transform: rotate(0.3deg);">
          <div class="section-title-ink flex items-center justify-between">
            <span>军团完整状态</span>
            <span class="font-mono text-[10px] text-field-ink/60">LEGION STATE</span>
          </div>
          <div class="grid grid-cols-3 sm:grid-cols-6 gap-4 mt-4">
            <div v-for="item in legionStats" :key="item.key" class="text-center">
              <div class="font-mono text-2xl" :class="item.color">{{ (dashboard.legion as any)[item.key] ?? 0 }}</div>
              <div class="text-[10px] text-field-ink/80 font-mono tracking-wider uppercase mt-1">{{ item.label }}</div>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-field-ink/10 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono text-field-ink/80">
            <div>黑弹: {{ dashboard.legion.blackShot || 0 }}</div>
            <div>马匹: {{ dashboard.legion.horses || 0 }}</div>
            <div>宗教补给: {{ dashboard.legion.religiousSupplies || 0 }}</div>
            <div>劳工: {{ dashboard.legion.laborers || 0 }}</div>
            <div>攻城武器: {{ dashboard.legion.siegeWeapons || 0 }}</div>
            <div>补给车: {{ dashboard.legion.supplyWagons || 0 }}</div>
            <div class="md:col-span-2">当前位置: {{ dashboard.legion.currentLocation || '—' }}</div>
          </div>
        </div>

        <!-- 指挥链状态 -->
        <div v-if="dashboard.legion" class="card-archive" style="transform: rotate(-0.2deg);">
          <div class="section-title-ink">指挥链任命</div>
          <div class="grid grid-cols-2 md:grid-cols-5 gap-2 mt-3">
            <div v-for="role in legionRoles" :key="role.key" class="border border-field-ink/15 p-2 text-center">
              <div class="text-[10px] text-field-ink/60 font-mono uppercase">{{ role.label }}</div>
              <div class="text-sm text-field-ink font-medium mt-1">{{ getRoleHolderName(role.key) || '空缺' }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== 角色 ===== -->
      <div v-if="activeTab === 'characters'" class="space-y-4">
        <div class="flex items-center gap-3 mb-2">
          <button
            v-for="filter in characterFilters"
            :key="filter.key"
            class="text-xs font-mono px-2 py-1 border transition-colors"
            :class="charFilter === filter.key
              ? 'border-field-gold/40 text-field-gold bg-field-gold/5'
              : 'border-field-border text-field-paper/60 hover:text-field-paper'"
            @click="charFilter = filter.key"
          >
            {{ filter.label }}
          </button>
        </div>
        <div class="grid grid-cols-1 gap-3">
          <div
            v-for="char in filteredCharacters"
            :key="char.id"
            class="card-archive"
            :class="char.isDead ? 'opacity-60' : ''"
            :style="`transform: rotate(${(char.id % 3 - 1) * 0.2}deg);`"
          >
            <div class="flex flex-col md:flex-row md:items-start gap-4">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="font-brush text-lg text-field-ink" :class="char.isDead ? 'line-through' : ''">{{ char.name }}</span>
                  <span class="text-xs font-mono text-field-ink/60">{{ char.playerName }}</span>
                  <span v-if="char.legionRole" class="stamp-gold text-[9px] px-1.5 py-0.5">{{ getLegionRoleName(char.legionRole) }}</span>
                  <span v-if="char.isDead" class="text-xs text-field-red font-mono border border-field-red/30 px-1">阵亡</span>
                  <span v-if="char.isRookie" class="text-xs text-field-gold font-mono border border-field-gold/30 px-1">新兵</span>
                </div>
                <div class="text-xs text-field-ink/70 font-mono mt-1">
                  {{ getRoleName(char.role) }} · {{ getCultureName(char.culture) }} · {{ getLoadLabel(char.load) }}
                </div>
                <div class="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs font-mono text-field-ink/80">
                  <span>压力 {{ char.stress }}/{{ char.stressMax }}</span>
                  <span>创伤 {{ char.traumas?.length || 0 }}/{{ char.traumaMax }}</span>
                  <span>腐化 {{ char.rotLevel }}</span>
                  <span>护甲 {{ char.armor }}</span>
                  <span v-if="char.xpTotal > 0" class="text-field-gold">XP {{ char.xpTotal }}</span>
                </div>
                <div class="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs font-mono text-field-ink/60">
                  <span>心理XP {{ char.xpMental }}</span>
                  <span>身体XP {{ char.xpPhysical }}</span>
                  <span>意志XP {{ char.xpResolve }}</span>
                </div>
                <!-- 行动等级 -->
                <div class="mt-2 flex flex-wrap gap-1.5">
                  <span
                    v-for="action in characterActions(char)"
                    :key="action.key"
                    class="text-[10px] px-1.5 py-0.5 border font-mono"
                    :class="action.level > 0 ? 'border-field-ink/30 text-field-ink' : 'border-field-ink/10 text-field-ink/40'"
                  >
                    {{ action.name }} {{ action.level }}
                  </span>
                </div>
                <div v-if="char.abilities?.length" class="mt-2 flex flex-wrap gap-1">
                  <span v-for="ab in char.abilities" :key="ab" class="text-[10px] px-1.5 py-0.5 bg-field-ink/5 text-field-ink/70 font-mono">{{ ab }}</span>
                </div>
                <div v-if="char.notes" class="mt-2 text-xs text-field-ink/60 italic border-l-2 border-field-ink/10 pl-2">{{ char.notes }}</div>
              </div>
              <!-- 伤害格 -->
              <div class="shrink-0 text-xs font-mono text-field-ink/70">
                <div class="grid grid-cols-2 gap-x-3 gap-y-1">
                  <div :class="char.harmLevel1 ? 'text-field-red' : ''">Lv1: {{ char.harmLevel1 || '—' }}</div>
                  <div :class="char.harmLevel2 ? 'text-field-red' : ''">Lv2: {{ char.harmLevel2 || '—' }}</div>
                  <div :class="char.harmLevel3 ? 'text-field-red' : ''">Lv3: {{ char.harmLevel3 || '—' }}</div>
                  <div :class="char.harmLevel4 ? 'text-field-red' : ''">Lv4: {{ char.harmLevel4 || '—' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== 任务 ===== -->
      <div v-if="activeTab === 'deployments'" class="space-y-3">
        <div v-if="dashboard.deployments.length === 0" class="card-archive text-center py-8 text-field-ink/60 text-sm">
          暂无任务记录
        </div>
        <div
          v-for="dep in dashboard.deployments"
          :key="dep.id"
          class="card-archive"
          :style="`transform: rotate(${(dep.id % 3 - 1) * 0.2}deg);`"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-brush text-lg text-field-ink">{{ dep.name }}</span>
                <span class="text-[10px] font-mono border px-1.5 py-0.5" :class="dep.priority === 'primary' ? 'border-field-red/40 text-field-red' : 'border-field-ink/30 text-field-ink/70'">{{ dep.priority === 'primary' ? '主要' : '次要' }}</span>
                <span class="text-[10px] font-mono border border-field-ink/20 text-field-ink/60 px-1.5 py-0.5 uppercase">{{ dep.type }}</span>
              </div>
              <div class="text-xs text-field-ink/70 font-mono mt-1">地点: {{ dep.location }} · 威胁等级: {{ dep.threatLevel }}</div>
              <div class="flex flex-wrap gap-2 mt-2">
                <span class="text-[10px] font-mono px-2 py-0.5 border" :class="statusClass(dep.status)">{{ dep.status }}</span>
                <span v-if="dep.result" class="text-[10px] font-mono px-2 py-0.5 border border-field-gold/30 text-field-gold">{{ dep.result }}</span>
              </div>
              <div v-if="dep.characterIds?.length" class="mt-2 text-xs text-field-ink/70 font-mono">
                参与角色: {{ dep.characterIds.map(id => dashboard.characters.find(c => c.id === id)?.name || id).join(', ') }}
              </div>
            </div>
            <div class="text-[10px] font-mono text-field-ink/40 shrink-0">{{ formatDate(dep.createdAt) }}</div>
          </div>
        </div>
      </div>

      <!-- ===== 日志 ===== -->
      <div v-if="activeTab === 'logs'" class="space-y-3">
        <div v-if="dashboard.actionLogs.length === 0" class="card-archive text-center py-8 text-field-ink/60 text-sm">
          暂无行动日志
        </div>
        <div class="card-archive overflow-hidden" style="transform: rotate(0.1deg);">
          <table class="w-full text-xs">
            <thead>
              <tr class="border-b border-field-ink/15 text-field-ink/60 font-mono uppercase text-[10px]">
                <th class="text-left px-3 py-2">时间</th>
                <th class="text-left px-3 py-2">执行者</th>
                <th class="text-left px-3 py-2">行动</th>
                <th class="text-left px-3 py-2">目标</th>
                <th class="text-left px-3 py-2">结果</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="log in dashboard.actionLogs"
                :key="log.id"
                class="border-b border-field-ink/5 hover:bg-field-ink/5 transition-colors"
              >
                <td class="px-3 py-2 text-field-ink/50 font-mono whitespace-nowrap">{{ formatDateTime(log.timestamp) }}</td>
                <td class="px-3 py-2 text-field-ink font-mono">{{ log.actor }}</td>
                <td class="px-3 py-2 text-field-ink/80 font-mono">{{ log.action }}</td>
                <td class="px-3 py-2 text-field-ink/60 font-mono">{{ log.target || '—' }}</td>
                <td class="px-3 py-2 text-field-ink/70">{{ log.result }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ===== 编年史 ===== -->
      <div v-if="activeTab === 'chronicle'" class="space-y-3">
        <div v-if="dashboard.chronicleEntries.length === 0" class="card-archive text-center py-8 text-field-ink/60 text-sm">
          暂无编年史记录
        </div>
        <div
          v-for="entry in dashboard.chronicleEntries"
          :key="entry.id"
          class="card-archive"
          :style="`transform: rotate(${(entry.id % 3 - 1) * 0.2}deg);`"
        >
          <div class="flex items-start justify-between gap-2">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-[10px] font-mono border border-field-ink/20 text-field-ink/60 px-1.5 py-0.5 uppercase">{{ entry.type }}</span>
                <span v-if="entry.storyType" class="text-[10px] font-mono text-field-gold/70">{{ entry.storyType }}</span>
              </div>
              <p class="text-sm text-field-ink mt-2 leading-relaxed">{{ entry.content }}</p>
              <p v-if="entry.effect" class="text-xs text-field-gold/80 mt-1 font-mono">效果: {{ entry.effect }}</p>
            </div>
            <div class="text-[10px] font-mono text-field-ink/40 shrink-0">{{ formatDate(entry.createdAt) }}</div>
          </div>
        </div>
      </div>

      <!-- ===== 进程表 ===== -->
      <div v-if="activeTab === 'clocks'" class="space-y-3">
        <div v-if="dashboard.progressClocks.length === 0" class="card-archive text-center py-8 text-field-ink/60 text-sm">
          暂无进程表
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div
            v-for="clock in dashboard.progressClocks"
            :key="clock.id"
            class="card-archive text-center"
            :style="`transform: rotate(${(clock.id % 3 - 1) * 0.2}deg);`"
          >
            <div class="text-[10px] text-field-ink/60 font-mono uppercase">{{ clock.category }}</div>
            <div class="font-brush text-lg text-field-ink mt-1">{{ clock.name }}</div>
            <div class="flex items-center justify-center gap-1 mt-2">
              <div
                v-for="i in clock.segments"
                :key="i"
                class="w-3 h-3 rounded-full border"
                :class="i <= clock.filled ? 'bg-field-ink border-field-ink' : 'border-field-ink/20'"
              />
            </div>
            <div class="text-xs font-mono text-field-ink/60 mt-1">{{ clock.filled }} / {{ clock.segments }}</div>
          </div>
        </div>
      </div>

      <!-- ===== 地图标注 ===== -->
      <div v-if="activeTab === 'map'" class="space-y-3">
        <div v-if="dashboard.mapAnnotations.length === 0" class="card-archive text-center py-8 text-field-ink/60 text-sm">
          暂无地图标注
        </div>
        <div class="card-archive overflow-hidden" style="transform: rotate(0.1deg);">
          <table class="w-full text-xs">
            <thead>
              <tr class="border-b border-field-ink/15 text-field-ink/60 font-mono uppercase text-[10px]">
                <th class="text-left px-3 py-2">ID</th>
                <th class="text-left px-3 py-2">类型</th>
                <th class="text-left px-3 py-2">创建者</th>
                <th class="text-left px-3 py-2">数据</th>
                <th class="text-left px-3 py-2">时间</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="ann in dashboard.mapAnnotations"
                :key="ann.id"
                class="border-b border-field-ink/5 hover:bg-field-ink/5 transition-colors"
              >
                <td class="px-3 py-2 text-field-ink/50 font-mono">{{ ann.id }}</td>
                <td class="px-3 py-2 text-field-ink font-mono uppercase">{{ ann.type }}</td>
                <td class="px-3 py-2 text-field-ink/70 font-mono">{{ ann.createdBy }}</td>
                <td class="px-3 py-2 text-field-ink/60 font-mono max-w-xs truncate">{{ ann.data }}</td>
                <td class="px-3 py-2 text-field-ink/40 font-mono whitespace-nowrap">{{ formatDateTime(ann.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { getRoleName, getCultureName, getLegionRoleName, getLoadLabel } from '~~/shared/game-data'

const route = useRoute()
const code = (route.params.code as string)?.toUpperCase() || ''
const { isGM } = usePlayerName()

// 非GM重定向
if (process.client && !isGM.value) {
  navigateTo(`/room/${code}`)
}

const activeTab = ref('overview')
const charFilter = ref('all')

const { data: dashboard, pending, error } = await useFetch(`/api/rooms/${code}/gm-dashboard`)

const tabs = computed(() => {
  const d = dashboard.value
  if (!d) return []
  return [
    { key: 'overview', label: '概览' },
    { key: 'characters', label: '角色', count: d.characters?.length },
    { key: 'deployments', label: '任务', count: d.deployments?.length },
    { key: 'logs', label: '日志', count: d.actionLogs?.length },
    { key: 'chronicle', label: '编年史', count: d.chronicleEntries?.length },
    { key: 'clocks', label: '进程表', count: d.progressClocks?.length },
    { key: 'map', label: '地图标注', count: d.mapAnnotations?.length },
  ]
})

const characterFilters = [
  { key: 'all', label: '全部' },
  { key: 'living', label: '存活' },
  { key: 'dead', label: '阵亡' },
]

const filteredCharacters = computed(() => {
  const chars = dashboard.value?.characters || []
  if (charFilter.value === 'living') return chars.filter(c => !c.isDead)
  if (charFilter.value === 'dead') return chars.filter(c => c.isDead)
  return chars
})

const legionStats = [
  { key: 'morale', label: '士气', color: 'text-field-gold' },
  { key: 'pressure', label: '压力', color: 'text-field-red' },
  { key: 'supplies', label: '补给', color: 'text-field-gold-light' },
  { key: 'intel', label: '情报', color: 'text-field-paper' },
  { key: 'food', label: '食物', color: 'text-field-paper' },
  { key: 'time', label: '时间(旧)', color: 'text-field-paper' },
]

const legionRoles = [
  { key: 'commander', label: '指挥官' },
  { key: 'marshal', label: '军士长' },
  { key: 'quartermaster', label: '军需官' },
  { key: 'lorekeeper', label: '书记官' },
  { key: 'spymaster', label: '间谍总管' },
]

function getRoleHolderName(roleKey: string): string {
  const char = dashboard.value?.characters?.find((c: any) => c.legionRole === roleKey)
  return char?.name || ''
}

function statusClass(status: string): string {
  const map: Record<string, string> = {
    pending: 'border-field-ink/30 text-field-ink/60',
    active: 'border-field-gold/40 text-field-gold',
    completed: 'border-field-gold/30 text-field-gold/80',
    failed: 'border-field-red/40 text-field-red',
  }
  return map[status] || 'border-field-ink/30 text-field-ink/60'
}

const actionKeyMap: Record<string, string> = {
  actionInvestigation: '调查', actionMarksmanship: '射击', actionRigging: '架设',
  actionSway: '说服', actionScout: '侦察', actionDiscipline: '纪律',
  actionSkirmish: '混战', actionWreck: '破坏', actionManeuver: '机动',
  actionCommand: '指挥', actionResolve: '决心', actionChannel: '引导',
  actionAim: '瞄准', actionMartialArts: '格斗', actionMedicine: '医术',
  actionEndure: '忍耐', actionSurvival: '生存', actionWeave: '编织',
}

function characterActions(char: any) {
  return Object.entries(actionKeyMap)
    .map(([key, name]) => ({ key, name, level: (char as any)[key] || 0 }))
    .filter(a => a.level > 0)
    .sort((a, b) => b.level - a.level)
}

function formatDate(d: Date | string | null): string {
  if (!d) return '—'
  const date = new Date(d)
  return date.toLocaleDateString('zh-CN')
}

function formatDateTime(d: Date | string | null): string {
  if (!d) return '—'
  const date = new Date(d)
  return `${date.toLocaleDateString('zh-CN')} ${date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`
}
</script>
