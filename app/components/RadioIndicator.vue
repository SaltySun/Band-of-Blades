<template>
  <div
    class="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
    :class="checked ? 'border-field-gold bg-field-gold' : 'border-field-slate'"
  >
    <div v-if="checked" class="w-2 h-2 bg-field-bg rounded-full" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  checked: boolean
}>()
</script>
