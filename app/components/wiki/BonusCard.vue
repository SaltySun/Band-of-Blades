<template>
  <div class="flex items-center gap-3 p-3 rounded-xl border border-field-border bg-field-bg hover:border-field-gold/20 transition-all">
    <div class="w-8 h-8 rounded-full bg-field-gold/10 border border-field-gold/20 flex items-center justify-center text-field-gold text-xs font-mono shrink-0">+1d</div>
    <div>
      <div class="text-xs text-field-paper font-medium">{{ name }}</div>
      <div class="text-[10px] text-field-slate">{{ desc }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{ name: string; desc: string }>()
</script>
