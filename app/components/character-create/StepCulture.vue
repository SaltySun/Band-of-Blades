<template>
  <div class="space-y-6">
    <h2 class="text-xl font-serif-zh text-field-gold text-center">文化与特性</h2>

    <!-- 文化选择 -->
    <div class="card-field">
      <div class="section-title">选择文化</div>
      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="culture in CULTURES"
          :key="culture.key"
          class="p-3 rounded border text-left transition-all"
          :class="selectedCulture === culture.key
            ? 'border-field-gold bg-field-gold/5 text-field-paper'
            : 'border-field-border text-field-slate hover:border-field-gold/30'"
          @click="$emit('update:culture', culture.key)"
        >
          <div class="font-serif-zh">{{ culture.name }}</div>
          <div class="text-xs mt-1 opacity-70">{{ culture.namingStyle }}</div>
        </button>
      </div>
    </div>

    <!-- 角色名字 -->
    <div class="card-field">
      <div class="section-title">角色名字</div>
      <input
        :value="name"
        class="input-field w-full"
        placeholder="输入角色名字"
        @input="$emit('update:name', ($event.target as HTMLInputElement).value)"
      />
      <div v-if="cultureData" class="mt-3">
        <div class="text-xs text-field-slate mb-2">名字参考：</div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="n in [...cultureData.maleNames, ...cultureData.femaleNames].slice(0, 8)"
            :key="n"
            class="text-xs px-2 py-1 rounded bg-field-bg border border-field-border hover:border-field-gold/50 transition-colors"
            @click="$emit('update:name', n)"
          >
            {{ n }}
          </button>
        </div>
      </div>
    </div>

    <!-- 特性选择 -->
    <div class="card-field">
      <div class="section-title">
        选择特性（{{ traits.length }}/2）
      </div>
      <div v-if="!selectedCulture" class="text-sm text-field-slate">
        请先选择文化
      </div>
      <div v-else class="space-y-2">
        <SelectableCard
          v-for="trait in cultureData?.traits"
          :key="trait.key"
          :selected="traits.includes(trait.key)"
          :disabled="traits.length >= 2 && !traits.includes(trait.key)"
          @click="$emit('toggle-trait', trait.key)"
        >
          <template #title>{{ trait.name }}</template>
          <template #desc>{{ trait.effect }}</template>
        </SelectableCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CULTURES } from '~/composables/useCharacterData'
import type { Culture } from '~/composables/useCharacterData'

const props = defineProps<{
  name: string
  selectedCulture: string
  traits: string[]
}>()

defineEmits<{
  'update:name': [value: string]
  'update:culture': [key: string]
  'toggle-trait': [key: string]
}>()

const cultureData = computed<Culture | undefined>(() =>
  CULTURES.find(c => c.key === props.selectedCulture)
)
</script>
