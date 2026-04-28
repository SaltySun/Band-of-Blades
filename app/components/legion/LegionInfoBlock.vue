<template>
  <div class="border border-field-border/60 rounded-sm overflow-hidden relative"
       style="background: linear-gradient(135deg, #302c26 0%, #252320 100%);">
    <!-- 顶部订书钉装饰 -->
    <div v-if="!titleClass" class="absolute -top-1.5 left-4 w-2.5 h-4 bg-field-bg-light/60 border border-field-border/40 rounded-sm z-10" />
    <!-- 标题栏 -->
    <div
      class="px-3 py-2.5 flex items-center gap-2 relative"
      :class="titleClass || 'border-b border-field-border/40'"
    >
      <span v-if="icon" class="text-field-gold/80 text-xs">{{ icon }}</span>
      <span class="text-xs font-mono tracking-wider uppercase text-field-gold/80">{{ title }}</span>
      <span v-if="subtitle" class="text-[10px] text-field-slate/60 ml-auto font-mono">{{ subtitle }}</span>
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
