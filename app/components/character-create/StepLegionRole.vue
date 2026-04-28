<template>
  <div class="space-y-6">
    <h2 class="text-xl font-serif-zh text-field-gold text-center">选择军团职务</h2>
    <p class="text-sm text-field-slate text-center">左右滑动浏览职位，每个职务只能由一人担任</p>

    <!-- 已占用提示 -->
    <div v-if="Object.keys(takenRoles).length > 0" class="card-field bg-field-amber/5 border-field-amber/20">
      <div class="text-xs text-field-amber mb-1">已占用职位</div>
      <div class="flex flex-wrap gap-2">
        <span v-for="(name, key) in takenRoles" :key="key" class="text-xs text-field-slate">
          <span class="text-field-parchment-muted">{{ getLegionRoleName(key) }}</span>
          <span class="text-field-amber/60"> → {{ name }}</span>
        </span>
      </div>
    </div>

    <!-- CoverFlow 轮播 -->
    <div class="relative flex items-center justify-center py-6 select-none">
      <!-- 卡片容器 -->
      <div class="relative flex items-center justify-center w-full max-w-3xl h-[560px]">
        <div
          v-for="(role, i) in availableRoles"
          :key="role.key"
          class="absolute rounded-xl overflow-hidden transition-all duration-500 ease-out"
          :class="{
            'opacity-60 cursor-not-allowed': takenRoles[role.key],
            'cursor-pointer': !takenRoles[role.key],
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
              <div class="text-4xl font-serif-zh text-white/90 drop-shadow-lg">{{ role.name[0] }}</div>
            </div>
          </div>


        </div>
      </div>

      <!-- 圆点指示器 -->
      <div class="absolute bottom-0 flex gap-1.5">
        <button
          v-for="(role, i) in availableRoles"
          :key="role.key"
          class="h-2 rounded-full transition-all"
          :class="i === centerIndex ? 'bg-field-gold w-4' : 'bg-field-border w-2 hover:bg-field-slate/60'"
          @click="centerIndex = i"
        />
      </div>
    </div>

    <!-- 跳过选项 -->
    <div class="text-center">
      <button
        class="text-sm text-field-slate hover:text-field-gold transition-colors"
        @click="$emit('select', '')"
      >
        暂不担任职务 →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LEGION_ROLES, getLegionRoleName } from '~/composables/useCharacterData'

const props = defineProps<{
  selectedKey: string
  takenRoles: Record<string, string>
}>()

const emit = defineEmits<{
  select: [key: string]
}>()

const centerIndex = ref(0)

// 过滤掉已被占用的角色（保留当前选中的）
const availableRoles = computed(() => {
  return LEGION_ROLES.filter(r => {
    if (props.selectedKey === r.key) return true
    return !props.takenRoles[r.key]
  })
})

// 同步 centerIndex
watch(() => props.selectedKey, (key) => {
  const idx = availableRoles.value.findIndex(r => r.key === key)
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
  const width = isCenter ? 310 : 240
  const height = isCenter ? 520 : 410

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
  const role = availableRoles.value[i]
  if (props.takenRoles[role.key]) return
  if (i === centerIndex.value) {
    emit('select', props.selectedKey === role.key ? '' : role.key)
  } else {
    centerIndex.value = i
  }
}

function goLeft() {
  const next = centerIndex.value > 0 ? centerIndex.value - 1 : availableRoles.value.length - 1
  centerIndex.value = next
  const role = availableRoles.value[next]
  if (!props.takenRoles[role.key]) {
    emit('select', role.key)
  }
}

function goRight() {
  const next = centerIndex.value < availableRoles.value.length - 1 ? centerIndex.value + 1 : 0
  centerIndex.value = next
  const role = availableRoles.value[next]
  if (!props.takenRoles[role.key]) {
    emit('select', role.key)
  }
}

const gradientMap: Record<string, string> = {
  commander: 'bg-gradient-to-b from-amber-800 to-amber-950',
  marshal: 'bg-gradient-to-b from-red-900 to-red-950',
  quartermaster: 'bg-gradient-to-b from-emerald-800 to-emerald-950',
  lorekeeper: 'bg-gradient-to-b from-indigo-800 to-indigo-950',
  spymaster: 'bg-gradient-to-b from-purple-800 to-purple-950',
}

const roleImageMap: Record<string, string> = {
  commander: '/images/指挥官.png',
  marshal: '/images/军士长.png',
  quartermaster: '/images/军需官.png',
  lorekeeper: '/images/书记官.png',
  spymaster: '/images/间谍总管.png',
}

function gradientClass(key: string): string {
  return gradientMap[key] || 'bg-gradient-to-b from-gray-700 to-gray-900'
}
</script>
