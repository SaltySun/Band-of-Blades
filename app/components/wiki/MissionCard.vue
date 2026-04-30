<template>
  <div class="p-4 rounded-2xl border border-field-border bg-field-bg-light hover:border-field-gold/20 transition-all duration-300">
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm text-field-paper font-medium">{{ name }}</span>
      <span class="text-xs text-field-paper/70">{{ desc }}</span>
    </div>
    <div class="flex gap-4 text-xs">
      <span class="text-field-gold">奖励: {{ bonus }}</span>
      <span class="text-field-red">惩罚: {{ penalty }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{ name: string; desc: string; bonus: string; penalty: string }>()
</script>
