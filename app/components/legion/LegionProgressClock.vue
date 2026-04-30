<template>
  <div class="inline-flex flex-col items-center">
    <div
      class="relative w-20 h-20 cursor-pointer select-none"
      :class="clickable ? 'hover:scale-105 transition-transform' : ''"
      @click="onClick"
    >
      <svg viewBox="0 0 100 100" class="w-full h-full -rotate-90">
        <!-- 背景圆 -->
        <circle
          cx="50" cy="50" r="42"
          fill="none"
          stroke="currentColor"
          stroke-width="10"
          class="text-field-border"
        />
        <!-- 填充段 -->
        <circle
          v-for="i in segments"
          :key="i"
          cx="50" cy="50" r="42"
          fill="none"
          stroke="currentColor"
          stroke-width="10"
          :stroke-dasharray="`${segmentLength} ${circumference - segmentLength}`"
          :stroke-dashoffset="-((i - 1) * segmentLength)"
          class="transition-all duration-300 pointer-events-none"
          :class="i <= filled ? 'text-field-gold' : 'text-transparent'"
        />
      </svg>
      <div class="absolute inset-0 flex items-center justify-center">
        <span class="text-xs font-mono text-field-paper">{{ filled }}/{{ segments }}</span>
      </div>
    </div>
    <span v-if="label" class="text-xs text-field-slate mt-1 text-center">{{ label }}</span>
    <span v-if="seasonLabel" class="text-[10px] text-field-gold mt-0.5 text-center">{{ seasonLabel }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  segments: number
  filled: number
  label?: string
  clickable?: boolean
  seasonLabel?: string
}>()

const emit = defineEmits<{
  toggle: [value: number]
}>()

const circumference = 2 * Math.PI * 42
const segmentLength = circumference / props.segments

function onClick() {
  console.log('[LPC] onClick enter, clickable=', props.clickable, 'filled=', props.filled, 'segments=', props.segments)
  if (!props.clickable) return
  const next = props.filled >= props.segments ? 0 : props.filled + 1
  console.log('[LPC] onClick emit toggle, next=', next)
  emit('toggle', next)
}
</script>
