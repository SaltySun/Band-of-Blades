<template>
  <div class="space-y-6">
    <h2 class="font-brush text-2xl text-field-gold text-center">文化与特性</h2>

    <!-- 文化选择 -->
    <div class="card-archive">
      <div class="section-title-ink">选择文化</div>
      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="culture in CULTURES"
          :key="culture.key"
          class="p-3 border border-field-ink/20 text-left transition-all hover:border-field-ink/40"
          :class="selectedCulture === culture.key
            ? 'border-field-ink/40 bg-field-ink/5 text-field-ink'
            : 'border-field-ink/20 text-field-ink/70 hover:border-field-ink/40'"
          @click="$emit('update:culture', culture.key)"
        >
          <div class="font-brush">{{ culture.name }}</div>
          <div class="text-xs mt-1 text-field-ink/50 font-mono">{{ culture.namingStyle }}</div>
        </button>
      </div>
    </div>

    <!-- 角色名字 -->
    <div class="card-archive">
      <div class="section-title-ink">角色名字</div>
      <input
        :value="name"
        class="input-paper w-full"
        placeholder="输入角色名字"
        @input="$emit('update:name', ($event.target as HTMLInputElement).value)"
      />
      <div v-if="cultureData" class="mt-3">
        <div class="font-mono text-[10px] text-field-slate/70 tracking-wider uppercase mb-2">名字参考：</div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="n in [...cultureData.maleNames, ...cultureData.femaleNames].slice(0, 8)"
            :key="n"
            class="text-xs px-2 py-1 border border-field-ink/20 hover:border-field-ink/50 transition-colors text-field-ink/70 font-mono"
            @click="$emit('update:name', n)"
          >
            {{ n }}
          </button>
        </div>
      </div>
    </div>

    <!-- 特性选择 -->
    <div class="card-archive">
      <div class="section-title-ink">
        选择特性（{{ traits.length }}/2）
      </div>
      <div v-if="!selectedCulture" class="text-sm text-field-ink/60">
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
