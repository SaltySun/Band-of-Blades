<template>
  <div class="flex items-center gap-3">
    <div class="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-mono font-bold text-field-bg" :class="color">
      {{ level }}
    </div>
    <div class="flex-1">
      <div class="text-xs text-field-paper font-medium">{{ name }}</div>
      <div class="text-[10px] text-field-paper/70">{{ effect }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{ level: string; name: string; effect: string; color: string }>()
</script>
