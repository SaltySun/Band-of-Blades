<template>
  <div class="p-4 rounded-xl border border-field-border bg-field-bg-light hover:border-field-gold/20 transition-all duration-200">
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm text-field-paper font-medium">{{ name }}</span>
      <span class="text-[10px] px-2 py-0.5 rounded-full bg-field-gold/10 text-field-gold border border-field-gold/20">{{ cost }}</span>
    </div>
    <p class="text-xs text-field-slate leading-relaxed">{{ desc }}</p>
  </div>
</template>
<script setup lang="ts">
defineProps<{ name: string; cost: string; desc: string }>()
</script>
