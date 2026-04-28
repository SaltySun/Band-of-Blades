<template>
  <div
    class="relative p-3 rounded-xl border text-center transition-all duration-300 hover:scale-[1.02]"
    :class="[
      color === 'gold' ? 'border-field-gold/30 bg-field-gold/5' :
      color === 'amber' ? 'border-field-amber/30 bg-field-amber/5' :
      color === 'red' ? 'border-field-red/30 bg-field-red/5' :
      'border-field-border bg-field-bg',
      glow ? 'shadow-[0_0_20px_rgba(201,176,124,0.1)]' : ''
    ]"
  >
    <div
      class="text-2xl font-mono font-bold mb-1"
      :class="color === 'gold' ? 'text-field-gold' : color === 'amber' ? 'text-field-amber' : color === 'red' ? 'text-field-red' : 'text-field-paper'"
    >
      {{ value }}
    </div>
    <div class="text-xs text-field-paper">{{ label }}</div>
  </div>
</template>
<script setup lang="ts">
defineProps<{ value: string; label: string; color: 'gold' | 'amber' | 'red' | 'default'; glow?: boolean }>()
</script>
