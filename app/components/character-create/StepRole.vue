<template>
  <div class="space-y-6">
    <h2 class="font-brush text-2xl text-field-ink text-center">选择特种士兵</h2>
    <p class="text-sm text-field-ink/70 text-center">左右滑动或点击箭头浏览职业，点击中心卡片选择</p>

    <!-- CoverFlow 轮播 -->
    <div class="relative flex items-center justify-center py-6 select-none">
      <!-- 卡片容器 -->
      <div class="relative flex items-center justify-center w-full max-w-3xl h-[540px]">
        <div
          v-for="(role, i) in ROLES"
          :key="role.key"
          class="absolute border border-field-ink/20 overflow-hidden transition-all duration-500 ease-out cursor-pointer"
          :class="{
            'opacity-0': Math.abs(i - centerIndex) > 2,
          }"
          :style="cardStyle(i)"
          @click="onCardClick(i)"
        >
          <!-- 图片 / 占位 -->
          <img
            v-if="roleImageMap[role.key]"
            :src="roleImageMap[role.key]"
            :alt="role.name"
            class="absolute inset-0 w-full h-full object-fill"
            draggable="false"
          >
          <div
            v-else
            class="absolute inset-0 flex items-end justify-center pb-4"
            :class="gradientClass(role.key)"
          >
            <div class="text-center">
              <div class="text-4xl font-brush text-field-ink">{{ role.name[0] }}</div>
            </div>
          </div>


        </div>
      </div>

      <!-- 圆点指示器 -->
      <div class="absolute bottom-0 flex gap-1.5">
        <button
          v-for="(role, i) in ROLES"
          :key="role.key"
          class="h-2 rounded-full transition-all"
          :class="i === centerIndex ? 'bg-field-ink w-4' : 'bg-field-ink/30 w-2 hover:bg-field-ink/50'"
          @click="centerIndex = i"
        />
      </div>
    </div>

    <!-- 选中职业的详情预览 -->
    <div v-if="selectedRoleData" class="card-archive">
      <div class="flex items-start gap-4">
        <img
          v-if="roleImageMap[selectedRoleData.key]"
          :src="roleImageMap[selectedRoleData.key]"
          :alt="selectedRoleData.name"
          class="w-16 h-24 border border-field-ink/20 flex-shrink-0 object-fill"
        >
        <div
          v-else
          class="w-16 h-24 border border-field-ink/20 flex-shrink-0 flex items-center justify-center"
          :class="gradientClass(selectedRoleData.key)"
        >
          <span class="text-2xl font-brush text-field-ink">{{ selectedRoleData.name[0] }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <span class="font-brush text-lg text-field-ink">{{ selectedRoleData.name }}</span>
            <span v-if="selectedRoleData.specialAction" class="text-xs handnote text-field-ink/80">{{ selectedRoleData.specialAction }}</span>
          </div>
          <p class="text-sm text-field-ink/80 mt-1 leading-relaxed">{{ selectedRoleData.description }}</p>
          <p v-if="selectedRoleData.specialActionDesc" class="text-xs handnote text-field-ink/60 mt-1">{{ selectedRoleData.specialActionDesc }}</p>
          <div class="mt-2 flex flex-wrap gap-1.5">
            <span
              v-for="ab in selectedRoleData.abilities.slice(0, 4)"
              :key="ab.key"
              class="text-xs px-2 py-0.5 border border-field-ink/20 text-field-ink/70 font-mono"
            >
              {{ ab.name }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ROLES } from '~/composables/useCharacterData'

const props = defineProps<{
  selectedKey: string
}>()

const emit = defineEmits<{
  select: [key: string]
}>()

const centerIndex = ref(0)

const selectedRoleData = computed(() => ROLES.find(r => r.key === props.selectedKey))

// 同步 centerIndex 与已选职业
watch(() => props.selectedKey, (key) => {
  const idx = ROLES.findIndex(r => r.key === key)
  if (idx >= 0) centerIndex.value = idx
}, { immediate: true })

function cardStyle(i: number) {
  const diff = i - centerIndex.value
  const absD = Math.abs(diff)
  const isCenter = diff === 0
  const translateX = diff * 150
  const scale = isCenter ? 1 : absD === 1 ? 0.78 : absD === 2 ? 0.55 : 0.4
  const zIndex = 10 - absD
  const opacity = isCenter ? 1 : absD === 1 ? 0.75 : absD === 2 ? 0.4 : 0
  const blur = isCenter ? 0 : 2
  const width = isCenter ? 230 : 180
  const height = isCenter ? 510 : 390

  return {
    transform: `translateX(${translateX}px) scale(${scale})`,
    zIndex,
    opacity,
    filter: `blur(${blur}px)`,
    width: `${width}px`,
    height: `${height}px`,
  }
}

function onCardClick(i: number) {
  if (i === centerIndex.value) {
    const role = ROLES[i]
    emit('select', role.key)
  } else {
    centerIndex.value = i
  }
}

function goLeft() {
  const next = centerIndex.value > 0 ? centerIndex.value - 1 : ROLES.length - 1
  centerIndex.value = next
  emit('select', ROLES[next].key)
}

function goRight() {
  const next = centerIndex.value < ROLES.length - 1 ? centerIndex.value + 1 : 0
  centerIndex.value = next
  emit('select', ROLES[next].key)
}

const gradientMap: Record<string, string> = {
  heavy: 'bg-gradient-to-b from-stone-700 to-stone-900',
  medic: 'bg-gradient-to-b from-emerald-800 to-emerald-950',
  sniper: 'bg-gradient-to-b from-slate-700 to-slate-900',
  officer: 'bg-gradient-to-b from-amber-800 to-amber-950',
  scout: 'bg-gradient-to-b from-teal-800 to-teal-950',
  soldier: 'bg-gradient-to-b from-red-900 to-red-950',
  rookie: 'bg-gradient-to-b from-indigo-800 to-indigo-950',
}

const roleImageMap: Record<string, string> = {
  heavy: '/images/重装.png',
  medic: '/images/医疗兵.png',
  sniper: '/images/狙击手.png',
  officer: '/images/军官.png',
  scout: '/images/斥候.png',
  soldier: '/images/士兵.png',
  rookie: '/images/新兵.png',
}

function gradientClass(key: string): string {
  return gradientMap[key] || 'bg-gradient-to-b from-gray-700 to-gray-900'
}
</script>
