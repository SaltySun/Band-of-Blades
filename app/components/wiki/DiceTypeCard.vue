<template>
  <div class="p-3 rounded-xl border border-field-border bg-field-bg hover:border-field-gold/20 hover:bg-field-bg-light transition-all duration-200">
    <div class="text-xs text-field-gold font-medium mb-1">{{ name }}</div>
    <div class="text-[10px] text-field-slate">{{ use }}</div>
    <div class="text-[10px] text-field-slate/60 mt-0.5">{{ when }}</div>
  </div>
</template>
<script setup lang="ts">
defineProps<{ name: string; use: string; when: string }>()
</script>
