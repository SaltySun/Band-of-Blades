<template>
  <div class="space-y-3">
    <!-- 工具栏（只读模式下隐藏） -->
    <div v-if="!props.readonly" class="flex flex-wrap items-center gap-2">
      <div class="flex bg-field-bg border border-field-border rounded-lg overflow-hidden">
        <button
          v-for="t in tools"
          :key="t.key"
          class="px-3 py-1.5 text-xs transition-colors"
          :class="tool === t.key ? 'bg-field-gold/20 text-field-gold' : 'text-field-paper/70 hover:text-field-paper'"
          @click="tool = t.key"
        >
          {{ t.icon }} {{ t.label }}
        </button>
      </div>

      <div class="flex items-center gap-2">
        <input
          v-model="color"
          type="color"
          class="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
        >
        <select
          v-if="tool === 'pen'"
          v-model="lineWidth"
          class="bg-field-bg border border-field-border rounded text-xs text-field-paper px-2 py-1.5 outline-none"
        >
          <option :value="2">细</option>
          <option :value="4">中</option>
          <option :value="6">粗</option>
          <option :value="10">特粗</option>
        </select>
      </div>

      <button
        class="text-xs px-3 py-1.5 rounded border border-field-red/30 text-field-red hover:bg-field-red/10 transition-colors"
        @click="clearAll"
      >
        清空全部
      </button>
    </div>

    <!-- 文字输入弹窗 -->
    <div
      v-if="textInput.visible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      @click.self="textInput.visible = false"
    >
      <div class="bg-field-bg border border-field-border rounded-xl p-4 w-80 space-y-3">
        <div class="text-sm text-field-paper font-medium">
          {{ textInput.mode === 'text' ? '添加文字标注' : '添加标记' }}
        </div>
        <input
          v-model="textInput.value"
          :placeholder="textInput.mode === 'text' ? '输入标注文字...' : '输入标记名称...'"
          class="w-full px-3 py-2 bg-field-bg border border-field-border rounded text-sm text-field-paper placeholder-field-slate outline-none focus:border-field-gold"
          @keydown.enter="confirmText"
        >
        <div class="flex gap-2 justify-end">
          <button class="text-xs px-3 py-1.5 rounded border border-field-border text-field-paper/70 hover:text-field-paper" @click="textInput.visible = false">取消</button>
          <button class="text-xs px-3 py-1.5 rounded bg-field-gold text-field-bg font-medium" @click="confirmText">确认</button>
        </div>
      </div>
    </div>

    <!-- 地图容器 -->
    <div
      ref="containerRef"
      class="relative rounded-xl overflow-hidden border border-field-border bg-field-bg select-none"
    >
      <img
        ref="imgRef"
        src="/images/campaign-map.jpg"
        class="w-full block"
        draggable="false"
        @load="onImgLoad"
      >
      <canvas
        ref="canvasRef"
        class="absolute inset-0 w-full h-full"
        :class="canvasCursor"
        :style="{ touchAction: 'none' }"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseup="onMouseUp"
        @mouseleave="onMouseUp"
        @click="onClick"
      />
    </div>

    <!-- 标注列表（只读模式下隐藏删除按钮） -->
    <div v-if="annotations.length > 0" class="space-y-1">
      <div class="text-xs text-field-paper/70">共 {{ annotations.length }} 条标注</div>
      <div class="flex flex-wrap gap-1.5">
        <div
          v-for="ann in annotations.slice(-20)"
          :key="ann.id"
          class="flex items-center gap-1 text-xs px-2 py-1 rounded bg-field-bg border border-field-border"
        >
          <span :class="typeIcon(ann.type)">{{ typeLabel(ann.type) }}</span>
          <span class="text-field-paper/70">{{ ann.createdBy }}</span>
          <button v-if="!props.readonly" class="text-field-red hover:text-field-red-light ml-1" @click="deleteAnnotation(ann.id)">✕</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Annotation {
  id: number
  type: 'draw' | 'text' | 'marker'
  data: string
  createdBy: string
  createdAt: string
}

const props = defineProps<{
  roomCode: string
  playerName: string
  readonly?: boolean
}>()

const tools = [
  { key: 'pen', label: '画笔', icon: '✏' },
  { key: 'text', label: '文字', icon: 'T' },
  { key: 'marker', label: '标记', icon: '📍' },
  { key: 'eraser', label: '删除', icon: '🗑' },
] as const

const tool = ref<'pen' | 'text' | 'marker' | 'eraser'>('pen')
const color = ref('#b8860b')
const lineWidth = ref(4)
const annotations = ref<Annotation[]>([])

const containerRef = ref<HTMLDivElement>()
const imgRef = ref<HTMLImageElement>()
const canvasRef = ref<HTMLCanvasElement>()

const isDrawing = ref(false)
const currentPath = ref<{ x: number; y: number }[]>([])

const textInput = ref({
  visible: false,
  mode: 'text' as 'text' | 'marker',
  value: '',
  x: 0,
  y: 0,
})

const canvasCursor = computed(() => {
  if (tool.value === 'pen') return 'cursor-crosshair'
  if (tool.value === 'eraser') return 'cursor-pointer'
  return 'cursor-crosshair'
})

function typeIcon(t: string) {
  if (t === 'draw') return 'text-field-gold'
  if (t === 'text') return 'text-field-paper'
  return 'text-field-red'
}

function typeLabel(t: string) {
  if (t === 'draw') return '✏'
  if (t === 'text') return 'T'
  return '📍'
}

// 同步 Canvas 大小与图片
function onImgLoad() {
  syncCanvasSize()
  render()
}

function syncCanvasSize() {
  const img = imgRef.value
  const canvas = canvasRef.value
  if (!img || !canvas) return
  const rect = img.getBoundingClientRect()
  canvas.width = rect.width
  canvas.height = rect.height
}

// 获取相对于图片的百分比坐标
function getPos(e: MouseEvent): { x: number; y: number } {
  const img = imgRef.value!
  const rect = img.getBoundingClientRect()
  return {
    x: (e.clientX - rect.left) / rect.width,
    y: (e.clientY - rect.top) / rect.height,
  }
}

// 渲染所有标注
function render() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (const ann of annotations.value) {
    const d = JSON.parse(ann.data)
    if (ann.type === 'draw') {
      drawPath(ctx, d.points, d.color, d.width)
    } else if (ann.type === 'text') {
      drawText(ctx, d.x, d.y, d.text, d.color, d.fontSize || 14)
    } else if (ann.type === 'marker') {
      drawMarker(ctx, d.x, d.y, d.label, d.color)
    }
  }

  // 正在绘制的临时路径
  if (currentPath.value.length > 1) {
    drawPath(ctx, currentPath.value, color.value, lineWidth.value, true)
  }
}

function drawPath(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
  strokeColor: string,
  width: number,
  isTemp = false,
) {
  if (points.length < 2) return
  const canvas = canvasRef.value!
  ctx.beginPath()
  ctx.moveTo(points[0].x * canvas.width, points[0].y * canvas.height)
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x * canvas.width, points[i].y * canvas.height)
  }
  ctx.strokeStyle = strokeColor
  ctx.lineWidth = width
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  if (isTemp) {
    ctx.globalAlpha = 0.7
  }
  ctx.stroke()
  ctx.globalAlpha = 1
}

function drawText(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  textColor: string,
  fontSize: number,
) {
  const canvas = canvasRef.value!
  const px = x * canvas.width
  const py = y * canvas.height
  const scale = Math.max(0.5, canvas.width / 800)
  const size = Math.max(8, (fontSize || 14) * scale)
  ctx.font = `bold ${size}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  // 文字阴影背景
  ctx.fillStyle = 'rgba(0,0,0,0.6)'
  const metrics = ctx.measureText(text)
  const pad = 2
  ctx.fillRect(px - metrics.width / 2 - pad, py - size / 2 - pad, metrics.width + pad * 2, size + pad * 2)
  ctx.fillStyle = textColor
  ctx.fillText(text, px, py)
}

function drawMarker(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  label: string,
  markerColor: string,
) {
  const canvas = canvasRef.value!
  const px = x * canvas.width
  const py = y * canvas.height
  const scale = Math.max(0.5, canvas.width / 800)
  const r = 5 * scale

  // 外圈
  ctx.beginPath()
  ctx.arc(px, py, r + 1.5, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(0,0,0,0.5)'
  ctx.fill()

  // 内圆
  ctx.beginPath()
  ctx.arc(px, py, r, 0, Math.PI * 2)
  ctx.fillStyle = markerColor
  ctx.fill()
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 1
  ctx.stroke()

  // 标签
  if (label) {
    const labelSize = Math.max(8, 10 * scale)
    ctx.font = `bold ${labelSize}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillStyle = 'rgba(0,0,0,0.6)'
    const m = ctx.measureText(label)
    ctx.fillRect(px - m.width / 2 - 2, py + r + 2, m.width + 4, 13)
    ctx.fillStyle = '#fff'
    ctx.fillText(label, px, py + r + 3)
  }
}

// 鼠标事件
function onMouseDown(e: MouseEvent) {
  if (props.readonly || tool.value !== 'pen') return
  isDrawing.value = true
  currentPath.value = [getPos(e)]
}

function onMouseMove(e: MouseEvent) {
  if (props.readonly || !isDrawing.value || tool.value !== 'pen') return
  currentPath.value.push(getPos(e))
  render()
}

function onMouseUp() {
  if (props.readonly || !isDrawing.value || tool.value !== 'pen') return
  isDrawing.value = false
  if (currentPath.value.length > 1) {
    saveDrawAnnotation()
  }
  currentPath.value = []
  render()
}

function onClick(e: MouseEvent) {
  if (props.readonly) return
  const pos = getPos(e)

  if (tool.value === 'text') {
    textInput.value = { visible: true, mode: 'text', value: '', x: pos.x, y: pos.y }
  } else if (tool.value === 'marker') {
    textInput.value = { visible: true, mode: 'marker', value: '', x: pos.x, y: pos.y }
  } else if (tool.value === 'eraser') {
    // 查找最近的标注并删除
    const nearest = findNearestAnnotation(pos)
    if (nearest) {
      deleteAnnotation(nearest.id)
    }
  }
}

function findNearestAnnotation(pos: { x: number; y: number }) {
  let nearest: Annotation | null = null
  let minDist = Infinity
  const threshold = 0.03 // 3% of image size

  for (const ann of annotations.value) {
    const d = JSON.parse(ann.data)
    let dist = Infinity

    if (ann.type === 'draw') {
      for (const p of d.points) {
        const dx = p.x - pos.x
        const dy = p.y - pos.y
        dist = Math.min(dist, Math.sqrt(dx * dx + dy * dy))
      }
    } else if (ann.type === 'text' || ann.type === 'marker') {
      const dx = d.x - pos.x
      const dy = d.y - pos.y
      dist = Math.sqrt(dx * dx + dy * dy)
    }

    if (dist < minDist && dist < threshold) {
      minDist = dist
      nearest = ann
    }
  }
  return nearest
}

async function saveDrawAnnotation() {
  const data = JSON.stringify({
    points: currentPath.value,
    color: color.value,
    width: lineWidth.value,
  })
  await createAnnotation('draw', data)
}

async function confirmText() {
  const { mode, value, x, y } = textInput.value
  if (!value.trim()) {
    textInput.value.visible = false
    return
  }
  const data = mode === 'text'
    ? JSON.stringify({ x, y, text: value.trim(), color: color.value, fontSize: 14 })
    : JSON.stringify({ x, y, label: value.trim(), color: color.value })
  await createAnnotation(mode, data)
  textInput.value.visible = false
  textInput.value.value = ''
}

async function createAnnotation(type: 'draw' | 'text' | 'marker', data: string) {
  try {
    await $fetch(`/api/rooms/${props.roomCode}/map-annotations`, {
      method: 'POST',
      body: { type, data, createdBy: props.playerName },
    })
    await refreshAnnotations()
  } catch (e: any) {
    console.error('创建标注失败:', e)
  }
}

async function deleteAnnotation(id: number) {
  try {
    await $fetch(`/api/rooms/${props.roomCode}/map-annotations/${id}`, {
      method: 'DELETE',
    })
    await refreshAnnotations()
  } catch (e: any) {
    console.error('删除标注失败:', e)
  }
}

async function clearAll() {
  if (!confirm('确定要清空所有标注吗？')) return
  await Promise.all(annotations.value.map(a => deleteAnnotation(a.id)))
}

async function refreshAnnotations() {
  try {
    const res = await $fetch<{ success: boolean; annotations: Annotation[] }>(`/api/rooms/${props.roomCode}/map-annotations`)
    if (res.success) {
      annotations.value = res.annotations
      nextTick(() => render())
    }
  } catch (e) {
    console.error('加载标注失败:', e)
  }
}

// 窗口大小变化时重新同步 Canvas
let resizeTimer: ReturnType<typeof setTimeout>
function onResize() {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    syncCanvasSize()
    render()
  }, 100)
}

onMounted(() => {
  refreshAnnotations()
  window.addEventListener('resize', onResize)
  // 定时轮询
  const interval = setInterval(refreshAnnotations, 5000)
  onUnmounted(() => {
    window.removeEventListener('resize', onResize)
    clearInterval(interval)
  })
})

watch(annotations, () => {
  nextTick(() => render())
}, { deep: true })
</script>
