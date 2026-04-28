<template>
  <div class="space-y-3">
    <!-- 技能树画布 -->
    <div
      ref="containerRef"
      class="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-field-border select-none"
      style="background: radial-gradient(ellipse at center, #2a2520 0%, #1a1a1a 70%)"
    >
      <!-- SVG 连线层 -->
      <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <!-- 连线 -->
        <g v-for="link in links" :key="link.id">
          <line
            :x1="link.x1"
            :y1="link.y1"
            :x2="link.x2"
            :y2="link.y2"
            :stroke="link.unlocked ? '#b8860b' : '#2a2a2a'"
            :stroke-width="link.unlocked ? 0.5 : 0.2"
            :stroke-dasharray="link.unlocked ? 'none' : '1.5 1.5'"
            :opacity="link.unlocked ? 0.7 : 0.35"
            :filter="link.unlocked ? 'url(#glow)' : ''"
            class="transition-all duration-700"
          />
        </g>

        <!-- 中心装饰圆环 -->
        <circle cx="50" cy="50" r="22" fill="none" stroke="#b8860b" stroke-width="0.12" opacity="0.2" />
        <circle cx="50" cy="50" r="16" fill="none" stroke="#b8860b" stroke-width="0.08" opacity="0.12" stroke-dasharray="2 3" />
      </svg>

      <!-- 节点层 -->
      <div
        v-for="node in nodes"
        :key="node.name"
        class="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
        :style="{ left: node.x + '%', top: node.y + '%' }"
        @click="onNodeClick(node.name)"
        @mouseenter="hoveredNode = node.name"
        @mouseleave="hoveredNode = null"
      >
        <!-- 扩大隐形点击区域 -->
        <div class="relative flex flex-col items-center group p-2 -m-2">
          <!-- 脉冲光晕（已解锁） -->
          <div
            v-if="isUnlocked(node.name)"
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-field-gold/15 blur-sm animate-pulse-glow"
            :style="{ width: node.isRoot ? '40px' : '32px', height: node.isRoot ? '40px' : '32px' }"
          />

          <!-- 节点主体 -->
          <div
            class="relative flex items-center justify-center transition-all duration-200"
            :class="[
              node.isRoot
                ? 'w-7 h-7 sm:w-8 sm:h-8'
                : 'w-6 h-6 sm:w-7 sm:h-7',
              isUnlocked(node.name)
                ? 'opacity-100'
                : 'opacity-40',
              hoveredNode === node.name ? 'scale-110' : 'scale-100',
            ]"
          >
            <!-- 菱形背景 -->
            <div
              class="absolute inset-0 rotate-45 rounded-sm border transition-all duration-200"
              :class="isUnlocked(node.name)
                ? 'border-field-gold bg-field-gold/15 shadow-[0_0_8px_rgba(184,134,11,0.25)]'
                : 'border-field-border/60 bg-field-bg/50'"
            />
            <!-- 图标 -->
            <span
              class="relative text-xs sm:text-sm font-bold z-10 leading-none"
              :class="isUnlocked(node.name) ? 'text-field-gold' : 'text-field-slate'"
            >
              {{ isUnlocked(node.name) ? '◆' : '◇' }}
            </span>
          </div>

          <!-- 名称标签 -->
          <div
            class="mt-1 px-1 py-px rounded text-[9px] font-bold whitespace-nowrap transition-all duration-200 leading-none"
            :class="isUnlocked(node.name)
              ? 'text-field-gold bg-field-gold/10'
              : 'text-field-slate/50'"
          >
            {{ node.shortName }}
          </div>

          <!-- 悬停 Tooltip -->
          <div
            class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-44 sm:w-52 p-2.5 rounded-lg bg-field-bg-light border border-field-gold/30 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20"
          >
            <div class="text-xs font-bold text-field-gold mb-1">{{ node.name }}</div>
            <div class="text-[10px] text-field-slate leading-relaxed">{{ node.desc }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 选中节点详情面板 -->
    <div
      v-if="selectedNode"
      class="p-3 rounded-lg border border-field-gold/30 bg-field-gold/5 animate-fade-in"
    >
      <div class="flex items-start gap-2">
        <span class="text-field-gold text-lg leading-none">{{ isUnlocked(selectedNode.name) ? '◆' : '◇' }}</span>
        <div>
          <div class="text-sm font-bold text-field-gold">{{ selectedNode.name }}</div>
          <div class="text-xs text-field-slate leading-relaxed mt-1">{{ selectedNode.desc }}</div>
        </div>
      </div>
    </div>

    <!-- 提示文字 -->
    <div class="text-[10px] text-field-slate/50 text-center">
      点击菱形节点解锁/取消解锁 · 灰色虚线表示未激活的连接
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  roomCode: string
  unlockedNodes: string[]
}>()

const emit = defineEmits<{
  refresh: []
}>()

const hoveredNode = ref<string | null>(null)
const selectedNode = ref<{ name: string; desc: string } | null>(null)

// 节点配置（坐标向中心靠拢，连接线更短）
const nodeConfig = [
  { name: '间谍网络', shortName: '间谍网络', desc: '你可以训练，维持和使用间谍。你开始拥有1位熟练间谍和一位大师间谍，合计2位。', x: 50, y: 50, isRoot: true },
  { name: '增员', shortName: '增员', desc: '获得一位间谍。将其标注为熟练。', x: 50, y: 24 },
  { name: '训练', shortName: '训练', desc: '将你的一位熟练间谍提升为大师。本节点可以选择两次。', x: 50, y: 12 },
  { name: '分析师', shortName: '分析师', desc: '进行调查任务的间谍+1骰。', x: 76, y: 34 },
  { name: '投资', shortName: '投资', desc: '进行扩张网络任务的间谍+1骰。', x: 88, y: 22 },
  { name: '现场评估', shortName: '现场评估', desc: '在收集情报时，你可以额外多问一个问题。', x: 76, y: 50 },
  { name: '诱捕', shortName: '诱捕', desc: '进行设置陷阱任务的间谍+1骰。', x: 24, y: 50 },
  { name: '信息源', shortName: '信息源', desc: '你的线人无处不在。进行强化任务的间谍+1骰。', x: 50, y: 74 },
  { name: '商人', shortName: '商人', desc: '成功完成强化过的补给任务会使得任务奖励中额外增加1份补给。', x: 32, y: 88 },
  { name: '教团', shortName: '教团', desc: '成功完成强化过的宗教任务会使得任务奖励中额外增加1份资源。', x: 43, y: 88 },
  { name: '佣兵', shortName: '佣兵', desc: '成功完成强化过的突袭任务会使得任务奖励中额外增加1点士气。', x: 57, y: 88 },
  { name: '游侠', shortName: '游侠', desc: '成功完成强化过的侦察任务会使得任务奖励中额外增加1份情报。', x: 68, y: 88 },
]

const nodes = computed(() => nodeConfig)

// 父节点映射
const parentMap: Record<string, string> = {
  增员: '间谍网络',
  分析师: '间谍网络',
  现场评估: '间谍网络',
  诱捕: '间谍网络',
  信息源: '间谍网络',
  训练: '增员',
  投资: '分析师',
  商人: '信息源',
  教团: '信息源',
  佣兵: '信息源',
  游侠: '信息源',
}

// 连线数据
const links = computed(() => {
  const result: { id: string; x1: number; y1: number; x2: number; y2: number; unlocked: boolean }[] = []
  for (const node of nodeConfig) {
    const parent = parentMap[node.name]
    if (parent) {
      const parentNode = nodeConfig.find(n => n.name === parent)
      if (parentNode) {
        result.push({
          id: `${parent}-${node.name}`,
          x1: parentNode.x,
          y1: parentNode.y,
          x2: node.x,
          y2: node.y,
          unlocked: isUnlocked(node.name),
        })
      }
    }
  }
  return result
})

function isUnlocked(name: string): boolean {
  return props.unlockedNodes.includes(name)
}

function onNodeClick(name: string) {
  const node = nodeConfig.find(n => n.name === name)
  if (node) {
    selectedNode.value = { name: node.name, desc: node.desc }
  }
  if (name === '间谍网络') return
  toggleNode(name)
}

async function toggleNode(name: string) {
  const next = !isUnlocked(name)
  try {
    await $fetch(`/api/rooms/${props.roomCode}/spy-network`, {
      method: 'PATCH',
      body: { node: name, unlocked: next },
    })
    emit('refresh')
  } catch (e: any) {
    const msg = e?.statusMessage || e?.message || '操作失败'
    alert(msg)
  }
}
</script>
