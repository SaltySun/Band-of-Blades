<template>
  <div class="space-y-3">
    <div
      v-for="spy in spies"
      :key="spy.name"
      class="p-3 rounded-lg border transition-colors"
      :class="isAcquired(spy.name) ? 'border-field-gold/40 bg-field-gold/5' : 'border-field-border/50 bg-field-bg/40 opacity-60'"
    >
      <!-- 头部：名字 + 角色 + 获取按钮 -->
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <span class="text-sm font-bold" :class="isAcquired(spy.name) ? 'text-field-gold' : 'text-field-slate'">
            {{ spy.name }}
          </span>
          <span class="text-[10px] px-1.5 py-px rounded border text-field-slate border-field-border">
            {{ spy.role }}
          </span>
        </div>
        <button
          class="text-xs px-2 py-1 rounded border transition-colors"
          :class="isAcquired(spy.name)
            ? 'border-field-gold/50 text-field-gold bg-field-gold/10 hover:bg-field-gold/20'
            : 'border-field-border text-field-slate hover:border-field-gold/40 hover:text-field-gold'"
          @click="toggleAcquired(spy.name)"
        >
          {{ isAcquired(spy.name) ? '已获取 ✓' : '获取' }}
        </button>
      </div>

      <!-- 背景 -->
      <div class="text-xs text-field-slate leading-relaxed mb-2">{{ spy.background }}</div>

      <!-- 特技 -->
      <div class="text-xs text-field-gold/90 leading-relaxed mb-2 bg-field-bg/60 rounded px-2 py-1.5">
        <span class="text-field-gold font-bold">特技：</span>{{ spy.ability }}
      </div>

      <!-- 状态栏（仅已获取时可用） -->
      <div v-if="isAcquired(spy.name)" class="flex flex-wrap items-center gap-3 pt-2 border-t border-field-border/30">
        <label class="flex items-center gap-1.5 cursor-pointer group">
          <div
            class="w-4 h-4 border rounded-sm flex items-center justify-center transition-colors"
            :class="status(spy.name, 'skilled') ? 'border-field-gold bg-field-gold/20' : 'border-field-border group-hover:border-field-gold/50'"
            @click="toggleStatus(spy.name, 'skilled')"
          >
            <span v-if="status(spy.name, 'skilled')" class="text-field-gold text-xs">✓</span>
          </div>
          <span class="text-xs" :class="status(spy.name, 'skilled') ? 'text-field-gold' : 'text-field-slate'">熟练</span>
        </label>

        <label class="flex items-center gap-1.5 cursor-pointer group">
          <div
            class="w-4 h-4 border rounded-sm flex items-center justify-center transition-colors"
            :class="status(spy.name, 'master') ? 'border-field-gold bg-field-gold/20' : 'border-field-border group-hover:border-field-gold/50'"
            @click="toggleStatus(spy.name, 'master')"
          >
            <span v-if="status(spy.name, 'master')" class="text-field-gold text-xs">✓</span>
          </div>
          <span class="text-xs" :class="status(spy.name, 'master') ? 'text-field-gold' : 'text-field-slate'">大师</span>
        </label>

        <label class="flex items-center gap-1.5 cursor-pointer group">
          <div
            class="w-4 h-4 border rounded-sm flex items-center justify-center transition-colors"
            :class="status(spy.name, 'injured') ? 'border-field-red bg-field-red/20' : 'border-field-border group-hover:border-field-red/50'"
            @click="toggleStatus(spy.name, 'injured')"
          >
            <span v-if="status(spy.name, 'injured')" class="text-field-red text-xs">✓</span>
          </div>
          <span class="text-xs" :class="status(spy.name, 'injured') ? 'text-field-red' : 'text-field-slate'">受伤</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SpyInfo } from '~/composables/useLegionRoleData'

interface SpyStatus {
  name: string
  skilled: boolean
  master: boolean
  injured: boolean
}

const props = defineProps<{
  roomCode: string
  spies: SpyInfo[]
  spyStatuses: SpyStatus[]
}>()

const emit = defineEmits<{
  refresh: []
}>()

function isAcquired(name: string): boolean {
  return props.spyStatuses.some(s => s.name === name)
}

function status(name: string, field: 'skilled' | 'master' | 'injured'): boolean {
  const s = props.spyStatuses.find(s => s.name === name)
  return s ? s[field] : false
}

async function toggleAcquired(name: string) {
  const current = props.spyStatuses.find(s => s.name === name)
  if (current) {
    // 取消获取：从列表中移除
    const next = props.spyStatuses.filter(s => s.name !== name)
    await saveStatuses(next)
  } else {
    // 获取：添加默认状态（安托瓦内特默认大师）
    const isAntoinette = name === '安托瓦内特'
    const next = [...props.spyStatuses, {
      name,
      skilled: false,
      master: isAntoinette,
      injured: false,
    }]
    await saveStatuses(next)
  }
}

async function toggleStatus(name: string, field: 'skilled' | 'master' | 'injured') {
  const current = !status(name, field)
  try {
    await $fetch(`/api/rooms/${props.roomCode}/spy-roster`, {
      method: 'PATCH',
      body: { name, field, value: current },
    })
    emit('refresh')
  } catch (e: any) {
    alert(e?.statusMessage || e?.message || '操作失败')
  }
}

async function saveStatuses(statuses: SpyStatus[]) {
  try {
    await $fetch(`/api/rooms/${props.roomCode}/spy-roster-bulk`, {
      method: 'PATCH',
      body: { statuses },
    })
    emit('refresh')
  } catch (e: any) {
    alert(e?.statusMessage || e?.message || '操作失败')
  }
}
</script>
