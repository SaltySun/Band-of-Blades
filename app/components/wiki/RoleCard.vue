<template>
  <div class="p-4 rounded-2xl border border-field-border bg-field-bg-light hover:border-field-gold/20 transition-all duration-300 group">
    <div class="flex items-center gap-3 mb-2">
      <span class="text-2xl group-hover:scale-110 transition-transform">{{ icon }}</span>
      <div>
        <div class="text-sm text-field-paper font-medium">{{ name }}</div>
        <span
          class="text-[10px] px-1.5 py-0.5 rounded border"
          :class="required ? 'border-field-gold/30 text-field-gold bg-field-gold/5' : 'border-field-slate text-field-paper/70'"
        >
          {{ required ? '必要职位' : '可选职位' }}
        </span>
      </div>
    </div>
    <p class="text-xs text-field-paper/70 leading-relaxed">{{ desc }}</p>
  </div>
</template>
<script setup lang="ts">
defineProps<{ icon: string; name: string; required: boolean; desc: string }>()
</script>
