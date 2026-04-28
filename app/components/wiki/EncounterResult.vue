<template>
  <div
    class="p-3 rounded-xl border text-center transition-all duration-200"
    :class="{
      'border-field-red/30 bg-field-red/5': color === 'red',
      'border-field-amber/30 bg-field-amber/5': color === 'amber',
      'border-emerald-500/20 bg-emerald-500/5': color === 'green',
    }"
  >
    <div
      class="text-lg font-mono font-bold"
      :class="{
        'text-field-red': color === 'red',
        'text-field-amber': color === 'amber',
        'text-emerald-400': color === 'green',
      }"
    >
      {{ range }}
    </div>
    <div class="text-xs text-field-paper">{{ label }}</div>
  </div>
</template>
<script setup lang="ts">
defineProps<{ range: string; label: string; color: 'red' | 'amber' | 'green' }>()
</script>
