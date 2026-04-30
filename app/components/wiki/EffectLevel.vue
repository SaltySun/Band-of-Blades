<template>
  <div class="flex-1 p-2 rounded-lg border border-field-border bg-field-bg text-center">
    <div class="text-xs text-field-paper font-medium">{{ level }}</div>
    <div class="text-sm font-mono" :class="color">{{ value }}</div>
  </div>
</template>
<script setup lang="ts">
defineProps<{ level: string; value: string; color: string }>()
</script>
