<template>
  <div class="p-2 rounded-lg border" :class="color">
    <div class="text-sm font-mono font-bold" :class="textColor || 'text-field-paper'">{{ value }}</div>
    <div class="text-[10px] text-field-slate">{{ label }}</div>
  </div>
</template>
<script setup lang="ts">
defineProps<{ value: string; label: string; color: string; textColor?: string }>()
</script>
