<template>
  <div
    class="p-4 rounded-xl border transition-all duration-200"
    :class="{
      'border-emerald-500/20 bg-emerald-500/5': color === 'green',
      'border-field-amber/20 bg-field-amber/5': color === 'amber',
      'border-field-red/20 bg-field-red/5': color === 'red',
    }"
  >
    <div
      class="text-sm font-medium mb-1"
      :class="{
        'text-emerald-400': color === 'green',
        'text-field-amber': color === 'amber',
        'text-field-red': color === 'red',
      }"
    >
      {{ name }}
    </div>
    <div class="text-xs text-field-slate mb-1.5">{{ desc }}</div>
    <div class="text-[10px] text-field-slate/70">{{ consequence }}</div>
    <div v-if="xp" class="text-[10px] text-field-gold mt-1">{{ xp }}</div>
  </div>
</template>
<script setup lang="ts">
defineProps<{ name: string; desc: string; consequence: string; color: 'green' | 'amber' | 'red'; xp?: string }>()
</script>
