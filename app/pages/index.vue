<template>
  <div class="animate-fade-in space-y-16">
    <!-- ===== Hero 区 — 非对称档案扉页 ===== -->
    <section class="relative pt-8 pb-4">
      <div class="flex flex-col lg:flex-row lg:items-start lg:gap-16">
        <!-- 左侧：大标题 -->
        <div class="lg:w-1/2">
          <div class="handnote text-field-hand/60 text-xs mb-2 tracking-wider">
            编号：BAND-OF-BLADES · 密级：绝密
          </div>
          <h1 class="font-brush text-6xl sm:text-7xl lg:text-8xl text-field-gold leading-tight tracking-wider"
              style="transform: rotate(-1deg);"
          >
            刀锋联队
          </h1>
          <div class="mt-4 flex items-center gap-3">
            <div class="h-px flex-1 bg-gradient-to-r from-field-gold/50 to-transparent" />
            <span class="font-mono text-xs text-field-paper/70 tracking-[0.3em] uppercase">Field Campaign Tool v1.3</span>
          </div>
        </div>

        <!-- 右侧：引言 -->
        <div class="lg:w-1/2 mt-8 lg:mt-4">
          <div class="card-archive max-w-lg" style="transform: rotate(0.5deg);">
            <div class="section-title-ink">战役简报</div>
            <p class="text-sm leading-relaxed text-field-ink/90">
              你是著名的雇佣兵部队"军团"中为数不多的幸存士兵之一。你和你的神选者是站在余烬之王的亡灵军队和东方诸国毁灭之间的最后防线。
            </p>
            <p class="text-sm leading-relaxed text-field-ink/90 mt-3 handnote">
              古帝国已经陨落。不死者大军正在从西方涌来。军团的撤退已经开始。
            </p>
            <div class="mt-5 flex gap-4">
              <NuxtLink to="/room" class="btn-seal-dark">加入战役</NuxtLink>
              <NuxtLink to="/wiki" class="px-5 py-2.5 text-field-ink/60 font-mono text-sm tracking-wider uppercase
                         hover:text-field-ink transition-colors border-b-2 border-transparent hover:border-field-ink/30">
                查阅规则
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 已有战役房间 — 档案柜 ===== -->
    <section v-if="rooms.length > 0">
      <div class="flex items-center gap-3 mb-6">
        <span class="font-mono text-xs text-field-paper/70 tracking-[0.2em] uppercase">档案柜</span>
        <div class="h-px flex-1 bg-field-border" />
        <span class="font-mono text-xs text-field-paper/70">{{ rooms.length }} 份档案</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="room in rooms"
          :key="room.code"
          class="card-archive group hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden cursor-pointer"
          @click="goToRoom(room.code)"
        >
          <!-- 文件夹标签 -->
          <div class="absolute top-0 right-4 w-8 h-10 bg-field-gold/10 border border-field-gold/20 border-t-0 rounded-b-sm flex items-end justify-center pb-1">
            <span class="font-mono text-[8px] text-field-gold/60">{{ room.code.slice(0,2) }}</span>
          </div>
          <!-- 销毁按钮 -->
          <button
            type="button"
            @click.stop="confirmDelete(room)"
            class="absolute top-2 right-14 opacity-0 group-hover:opacity-100 transition-opacity
                   w-6 h-6 flex items-center justify-center rounded-sm
                   border border-field-red/40 text-field-red/60 hover:bg-field-red/10 hover:text-field-red
                   text-xs font-mono"
            title="销毁档案"
          >
            ×
          </button>
          <div class="pr-10">
            <div class="font-mono text-lg text-field-ink tracking-widest">{{ room.code }}</div>
            <!-- 战役名称 — 长按删除 -->
            <div
              class="text-field-ink/80 font-medium mt-1 select-none"
              @mousedown.prevent="startLongPress(room)"
              @mouseup="cancelLongPress"
              @mouseleave="cancelLongPress"
              @touchstart.prevent="startLongPress(room)"
              @touchend="cancelLongPress"
              @touchcancel="cancelLongPress"
            >
              {{ room.name }}
            </div>
            <div class="text-xs text-field-slate/60 mt-2 font-mono">{{ formatDate(room.createdAt) }}</div>
          </div>
          <!-- 悬停时的墨迹效果 -->
          <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-field-gold/0 group-hover:bg-field-gold/40 transition-colors" />
        </div>
      </div>
    </section>

    <!-- ===== 快速加入 — 电报输入框 ===== -->
    <section class="max-w-md mx-auto">
      <div class="flex items-center gap-3 mb-4">
        <div class="h-px flex-1 bg-field-border" />
        <span class="font-mono text-xs text-field-paper/70 tracking-[0.2em] uppercase">紧急调令</span>
        <div class="h-px flex-1 bg-field-border" />
      </div>
      <div class="flex gap-3 items-end">
        <div class="flex-1">
          <label class="font-mono text-[10px] text-field-paper/70 tracking-wider uppercase block mb-1">房间识别码</label>
          <input
            v-model="roomCode"
            placeholder="██████"
            class="input-ink w-full text-center text-lg tracking-[0.5em] uppercase"
            maxlength="6"
            @keyup.enter="joinRoom"
          />
        </div>
        <button @click="joinRoom" class="btn-seal mb-0.5">
          进入
        </button>
      </div>
      <p v-if="error" class="text-field-paper text-xs mt-2 text-center font-mono bg-field-red/25 rounded px-2 py-1 inline-block">{{ error }}</p>
    </section>

    <!-- ===== 删除确认弹窗 ===== -->
    <div v-if="deletingRoom" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div class="card-archive max-w-sm w-full relative">
        <div class="stamp absolute -top-3 -right-2 z-10">待销毁</div>
        <div class="section-title-ink text-field-red">销毁档案</div>
        <p class="text-sm text-field-ink/70 mb-4">
          确认销毁档案 <span class="font-mono text-field-ink">{{ deletingRoom.code }}</span> — {{ deletingRoom.name }}？
          <br><span class="handnote">此操作不可恢复。</span>
        </p>
        <div class="space-y-3">
          <input
            v-model="deleteGMCode"
            placeholder="输入GM授权码"
            class="input-paper w-full"
            type="password"
            @keyup.enter="doDelete"
          />
          <div class="flex gap-3">
            <button @click="deletingRoom = null; deleteGMCode = ''; deleteError = ''"
                    class="flex-1 px-4 py-2 border border-field-ink/20 text-field-ink/60 font-mono text-xs tracking-wider uppercase
                           hover:border-field-ink/40 transition-colors">
              取消
            </button>
            <button
              @click="doDelete"
              :disabled="deleting"
              class="flex-1 btn-seal-dark"
            >
              {{ deleting ? '销毁中...' : '确认销毁' }}
            </button>
          </div>
          <p v-if="deleteError" class="text-field-paper text-xs text-center font-mono bg-field-red/25 rounded px-2 py-1 inline-block">{{ deleteError }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Room {
  id: number
  code: string
  name: string
  campaignType: string
  createdAt: string | Date | null
}

const roomCode = ref('')
const error = ref('')
const deletingRoom = ref<Room | null>(null)
const deleteGMCode = ref('')
const deleteError = ref('')
const deleting = ref(false)

const { data: roomsData, refresh } = await useFetch('/api/rooms')
const rooms = computed(() => roomsData.value?.rooms || [])

function formatDate(dateStr: string | Date | null): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getDate().toString().padStart(2, '0')}`
}

function joinRoom() {
  const code = roomCode.value.trim().toUpperCase()
  if (code.length !== 6) {
    error.value = '房间码必须是6位'
    return
  }
  navigateTo(`/room/${code}`)
}

// 长按删除
const longPressTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const isLongPressTriggered = ref(false)

function startLongPress(room: Room) {
  isLongPressTriggered.value = false
  longPressTimer.value = setTimeout(() => {
    isLongPressTriggered.value = true
    confirmDelete(room)
    longPressTimer.value = null
  }, 600)
}

function cancelLongPress() {
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value)
    longPressTimer.value = null
  }
}

function goToRoom(code: string) {
  // 如果刚触发过长按删除，不跳转
  if (isLongPressTriggered.value) {
    isLongPressTriggered.value = false
    return
  }
  navigateTo(`/room/${code}`)
}

function confirmDelete(room: Room) {
  deletingRoom.value = room
  deleteGMCode.value = ''
  deleteError.value = ''
}

async function doDelete() {
  if (!deletingRoom.value || !deleteGMCode.value.trim()) {
    deleteError.value = '请输入GM码'
    return
  }

  deleting.value = true
  deleteError.value = ''

  try {
    await $fetch(`/api/rooms/${deletingRoom.value.code}`, {
      method: 'DELETE',
      body: { gmCode: deleteGMCode.value.trim() },
    })
    deletingRoom.value = null
    deleteGMCode.value = ''
    await refresh()
  } catch (e: any) {
    deleteError.value = e.data?.statusMessage || '删除失败'
  } finally {
    deleting.value = false
  }
}
</script>
