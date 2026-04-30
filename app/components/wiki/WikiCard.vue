<template>
  <div class="rounded-2xl border border-field-border/60 bg-field-bg-light overflow-hidden hover:border-field-gold/30 hover:shadow-[0_0_30px_rgba(184,134,11,0.08)] transition-all duration-300">
    <div class="flex items-center gap-3 px-5 py-3.5 border-b border-field-border/40 bg-field-bg/50">
      <span v-if="icon" class="text-lg">{{ icon }}</span>
      <div>
        <span class="text-sm font-medium text-field-paper">{{ title }}</span>
        <span v-if="subtitle" class="text-xs text-field-paper/70 ml-2">{{ subtitle }}</span>
      </div>
    </div>
    <div class="p-5">
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{ title: string; icon?: string; subtitle?: string }>()
</script>
