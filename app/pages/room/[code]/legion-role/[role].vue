<template>
  <div class="max-w-3xl mx-auto animate-fade-in">
    <!-- 返回 -->
    <div class="mb-4">
      <NuxtLink :to="`/room/${code}`" class="text-sm text-field-slate hover:text-field-gold transition-colors">
        ← 返回房间
      </NuxtLink>
    </div>

    <!-- 头部 -->
    <div class="card-field mb-6">
      <div class="flex items-center gap-3 mb-2">
        <div class="w-10 h-10 rounded bg-field-gold/10 border border-field-gold/30 flex items-center justify-center">
          <span class="text-field-gold text-lg">{{ roleIcon(role) }}</span>
        </div>
        <div>
          <h1 class="text-2xl font-serif-zh text-field-gold">{{ detail.name }}</h1>
          <p class="text-xs text-field-gold/70">{{ detail.tagline }}</p>
        </div>
      </div>
      <p class="text-sm text-field-slate leading-relaxed">{{ detail.description }}</p>
    </div>

    <!-- 核心职责 -->
    <div class="card-field mb-6">
      <div class="section-title">核心职责</div>
      <ul class="space-y-2">
        <li v-for="(duty, i) in detail.duties" :key="i" class="flex items-start gap-2 text-sm text-field-paper">
          <span class="text-field-gold mt-0.5">•</span>
          <span>{{ duty }}</span>
        </li>
      </ul>
    </div>

    <!-- 核心资源 -->
    <div v-if="detail.resource" class="card-field mb-6">
      <div class="section-title">核心资源：{{ detail.resource.name }}</div>
      <p class="text-sm text-field-slate">{{ detail.resource.desc }}</p>
      <p v-if="detail.resource.max" class="text-xs text-field-slate mt-1">上限：{{ detail.resource.max }}</p>
    </div>

    <!-- 行动/规则区块 -->
    <div v-for="(action, i) in detail.actions" :key="i" class="card-field mb-6">
      <div class="section-title">{{ action.title }}</div>
      <div class="space-y-3">
        <div v-for="(item, j) in action.items" :key="j" class="p-3 rounded bg-field-bg-light border border-field-border">
          <div class="text-sm text-field-paper font-medium">{{ item.name }}</div>
          <div class="text-xs text-field-slate mt-1 leading-relaxed">{{ item.desc }}</div>
        </div>
      </div>
    </div>

    <!-- 表格 -->
    <div v-for="(table, i) in detail.tables" :key="`table-${i}`" class="card-field mb-6">
      <div class="section-title">{{ table.title }}</div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-field-border">
              <th v-for="(h, hi) in table.headers" :key="hi" class="text-left text-field-gold py-2 pr-4 text-xs">
                {{ h }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, ri) in table.rows" :key="ri" class="border-b border-field-border/50">
              <td v-for="(cell, ci) in row" :key="ci" class="py-2 pr-4 text-field-paper">
                {{ cell }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 科技树 -->
    <div v-for="(tree, i) in detail.trees" :key="`tree-${i}`" class="card-field mb-6">
      <div class="section-title">{{ tree.title }}</div>
      <div class="p-3 rounded bg-field-bg-light border border-field-border font-mono text-xs text-field-slate leading-relaxed whitespace-pre">
        {{ tree.nodes.join('\n') }}
      </div>
    </div>

    <!-- 备注 -->
    <div v-if="detail.notes" class="card-field mb-6">
      <div class="section-title">备注</div>
      <ul class="space-y-2">
        <li v-for="(note, i) in detail.notes" :key="i" class="flex items-start gap-2 text-xs text-field-slate">
          <span class="text-field-gold mt-0.5">*</span>
          <span>{{ note }}</span>
        </li>
      </ul>
    </div>

    <!-- 当前担任者 -->
    <div v-if="currentHolder" class="card-field mb-6 border-field-gold/30">
      <div class="section-title text-field-gold">当前担任者</div>
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-field-gold/10 border border-field-gold/30 flex items-center justify-center text-field-gold text-sm">
          {{ currentHolder.name?.charAt(0) }}
        </div>
        <div>
          <div class="text-field-paper">{{ currentHolder.name }}</div>
          <div class="text-xs text-field-slate">{{ currentHolder.playerName }} · {{ roleLabel(currentHolder.role) }}</div>
        </div>
      </div>
    </div>

    <!-- 导航到其他职位 -->
    <div class="card-field">
      <div class="section-title">其他军团职务</div>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <NuxtLink
          v-for="r in otherRoles"
          :key="r.key"
          :to="`/room/${code}/legion-role/${r.key}`"
          class="p-3 rounded border text-center transition-all hover:border-field-gold/50"
          :class="r.key === role ? 'border-field-gold bg-field-gold/5' : 'border-field-border'"
        >
          <div class="text-field-paper text-sm">{{ r.name }}</div>
          <div class="text-xs text-field-slate mt-1">{{ r.tagline }}</div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getLegionRoleDetail, LEGION_ROLES } from '~/composables/useLegionRoleData'

const route = useRoute()
const code = computed(() => (route.params.code as string).toUpperCase())
const role = computed(() => route.params.role as string)

const detail = computed(() => getLegionRoleDetail(role.value))

// 当前担任者
const { data: charactersData } = await useFetch(`/api/rooms/${code.value}/characters`)
const currentHolder = computed(() => {
  const chars = charactersData.value?.characters || []
  return chars.find((c: any) => c.legionRole === role.value)
})

// 其他职位导航
const otherRoles = computed(() => {
  return Object.values(LEGION_ROLES).map(r => ({
    key: r.key,
    name: r.name,
    tagline: r.desc.slice(0, 12) + (r.desc.length > 12 ? '…' : ''),
  }))
})

function roleIcon(roleKey: string): string {
  const map: Record<string, string> = {
    commander: '⚔',
    marshal: '🛡',
    quartermaster: '⚙',
    lorekeeper: '📜',
    spymaster: '🕸',
  }
  return map[roleKey] || '◆'
}

function roleLabel(roleKey: string): string {
  const map: Record<string, string> = {
    heavy: '重装兵', medic: '医疗兵', sniper: '狙击手',
    officer: '军官', scout: '斥候', soldier: '士兵', rookie: '新兵',
  }
  return map[roleKey] || roleKey
}

// 404 if invalid role
if (!detail.value) {
  throw createError({ statusCode: 404, statusMessage: '职位不存在' })
}
</script>
