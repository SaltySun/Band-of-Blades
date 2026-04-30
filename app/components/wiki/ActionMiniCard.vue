<template>
  <div class="flex items-start gap-2 p-2.5 rounded-xl border border-field-border bg-field-bg hover:border-field-gold/20 hover:bg-field-bg-light transition-all duration-200">
    <span class="text-base shrink-0">{{ icon }}</span>
    <div class="min-w-0">
      <div class="text-xs text-field-paper font-medium">{{ name }}</div>
      <div class="text-[10px] text-field-paper/70 truncate">{{ desc }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{ icon: string; name: string; desc: string }>()
</script>
