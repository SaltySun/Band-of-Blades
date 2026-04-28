<template>
  <div :id="id" class="mb-6 scroll-mt-20">
    <button
      class="w-full flex items-center gap-2 px-4 py-3 bg-field-bg-light border border-field-border rounded-t-lg hover:border-field-gold/30 transition-colors"
      @click="collapsed = !collapsed"
    >
      <span class="text-lg">{{ icon }}</span>
      <span class="text-sm font-medium text-field-paper">{{ title }}</span>
      <span class="ml-auto text-field-slate transition-transform duration-200" :class="collapsed ? '' : 'rotate-180'">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </span>
    </button>
    <div
      class="border border-t-0 border-field-border rounded-b-lg overflow-hidden transition-all duration-300"
      :class="collapsed ? 'max-h-0 opacity-0' : 'max-h-[2000px] opacity-100'"
    >
      <div class="p-4">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  id: string
  title: string
  icon?: string
}>()

const collapsed = ref(false)
</script>
