<template>
  <button
    class="w-full p-3 rounded border text-left transition-all flex items-center justify-between"
    :class="selected
      ? 'border-field-gold bg-field-gold/5'
      : disabled
        ? 'border-field-border/50 opacity-60 cursor-not-allowed'
        : 'border-field-border hover:border-field-gold/30'"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <div class="min-w-0">
      <div class="text-field-paper">
        <slot name="title" />
      </div>
      <div v-if="$slots.desc" class="text-xs text-field-slate mt-1">
        <slot name="desc" />
      </div>
    </div>
    <slot name="indicator">
      <RadioIndicator v-if="!disabled" :checked="selected" class="ml-3" />
      <span v-else class="text-xs text-field-slate flex-shrink-0 ml-3">✓</span>
    </slot>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  selected: boolean
  disabled?: boolean
}>()

defineEmits<{
  click: []
}>()
</script>
