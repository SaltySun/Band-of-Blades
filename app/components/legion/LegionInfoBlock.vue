<template>
  <div class="border border-field-border rounded overflow-hidden">
    <!-- 标题栏 -->
    <div
      class="px-3 py-2 flex items-center gap-2"
      :class="titleClass || 'bg-field-bg-light border-b border-field-border'"
    >
      <span v-if="icon" class="text-field-gold">{{ icon }}</span>
      <span class="text-sm font-medium text-field-paper">{{ title }}</span>
      <span v-if="subtitle" class="text-xs text-field-slate ml-auto">{{ subtitle }}</span>
    </div>
    <!-- 内容区 -->
    <div class="p-3" :class="contentClass">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  icon?: string
  titleClass?: string
  contentClass?: string
}>()
</script>
