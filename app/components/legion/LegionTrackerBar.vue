<template>
  <div class="w-full">
    <div class="flex items-center justify-between mb-1">
      <span class="text-sm font-medium text-field-paper">{{ label }}</span>
      <span v-if="showValue" class="text-xs text-field-gold font-mono">{{ modelValue }} / {{ max }}</span>
    </div>
    <div class="flex items-center gap-1">
      <button
        v-for="i in max"
        :key="i"
        class="flex-1 h-6 rounded border-2 transition-all duration-200 flex items-center justify-center"
        :class="i <= modelValue
          ? 'bg-field-gold/20 border-field-gold'
          : 'bg-field-bg-light border-field-border hover:border-field-gold/40'"
        :title="`${label} ${i}`"
        @click="toggle(i)"
      >
        <div
          v-if="i <= modelValue"
          class="w-2.5 h-2.5 rotate-45"
          :class="filledClass"
        />
      </button>
    </div>
    <div v-if="description" class="text-xs text-field-slate mt-1">{{ description }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: number
  max: number
  label: string
  description?: string
  showValue?: boolean
  filledClass?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

function toggle(index: number) {
  const newValue = props.modelValue === index ? index - 1 : index
  emit('update:modelValue', Math.max(0, Math.min(props.max, newValue)))
}
</script>
