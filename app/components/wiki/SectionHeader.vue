<template>
  <div class="mb-2">
    <h2 class="text-xl font-serif-zh text-field-gold">{{ title }}</h2>
    <p class="text-xs text-field-slate mt-0.5">{{ subtitle }}</p>
  </div>
</template>
<script setup lang="ts">
defineProps<{ title: string; subtitle: string }>()
</script>
