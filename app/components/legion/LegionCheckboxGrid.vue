<template>
  <div class="space-y-2">
    <div v-for="(item, i) in items" :key="i" class="flex items-center gap-3">
      <button
        class="w-5 h-5 border-2 rounded flex items-center justify-center transition-colors shrink-0"
        :class="item.checked ? 'bg-field-gold border-field-gold' : 'border-field-border hover:border-field-slate'"
        @click="toggle(i)"
      >
        <svg v-if="item.checked" class="w-3 h-3 text-field-bg" viewBox="0 0 12 12" fill="currentColor">
          <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
        </svg>
      </button>
      <div class="flex-1 min-w-0">
        <div class="text-sm text-field-paper">{{ item.label }}</div>
        <div v-if="item.desc" class="text-xs text-field-slate">{{ item.desc }}</div>
      </div>
      <div v-if="item.badges" class="flex gap-1">
        <span
          v-for="(badge, bi) in item.badges"
          :key="bi"
          class="text-xs px-1.5 py-0.5 rounded bg-field-bg border border-field-border text-field-slate"
        >{{ badge }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface CheckboxItem {
  label: string
  desc?: string
  checked: boolean
  badges?: string[]
}

const props = defineProps<{
  items: CheckboxItem[]
}>()

const emit = defineEmits<{
  'update:items': [items: CheckboxItem[]]
}>()

function toggle(index: number) {
  const item = props.items[index]
  if (!item) return
  const next = [...props.items]
  next[index] = { ...item, checked: !item.checked }
  emit('update:items', next)
}
</script>
