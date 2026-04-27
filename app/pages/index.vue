<template>
  <div class="space-y-12 animate-fade-in">
    <!-- 英雄区域 -->
    <section class="text-center py-16">
      <h1 class="text-5xl font-serif-zh text-field-gold mb-4 tracking-widest">
        刀锋联队
      </h1>
      <p class="text-field-slate text-lg max-w-2xl mx-auto leading-relaxed">
        你是著名的雇佣兵部队"军团"中为数不多的幸存士兵之一。
        你和你的神选者是站在余烬之王的亡灵军队和东方诸国毁灭之间的最后防线。
      </p>
      <div class="mt-8 flex justify-center gap-4">
        <NuxtLink to="/room" class="btn-primary">
          加入战役
        </NuxtLink>
        <NuxtLink to="/wiki" class="btn-secondary">
          查阅规则
        </NuxtLink>
      </div>
    </section>

    <!-- 功能卡片 -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card-field hover:border-field-gold/50 transition-colors">
        <div class="section-title">角色创建</div>
        <p class="text-sm text-field-slate leading-relaxed">
          选择文化背景，分配4点行动点数，选择起始能力。
          7种特种士兵，4种文化，数十种能力组合。
        </p>
      </div>
      
      <div class="card-field hover:border-field-gold/50 transition-colors">
        <div class="section-title">战役管理</div>
        <p class="text-sm text-field-slate leading-relaxed">
          指挥官选择任务，军士长分配部队，军需官管理补给。
          追踪军团士气、时间、压力和情报。
        </p>
      </div>
      
      <div class="card-field hover:border-field-gold/50 transition-colors">
        <div class="section-title">编年史记述</div>
        <p class="text-sm text-field-slate leading-relaxed">
          记录每一位阵亡将士的名字，讲述军团的历史。
          从过去的教训中汲取力量。
        </p>
      </div>
    </section>

    <!-- 已有房间列表 -->
    <section v-if="rooms.length > 0" class="card-field">
      <div class="flex items-center justify-between mb-4">
        <div class="section-title mb-0">已有战役房间</div>
        <span class="text-xs text-field-slate">{{ rooms.length }} 个房间</span>
      </div>
      <div class="space-y-3">
        <div 
          v-for="room in rooms" 
          :key="room.code"
          class="flex items-center justify-between p-3 bg-field-bg-light rounded border border-field-border hover:border-field-gold/30 transition-colors"
        >
          <NuxtLink :to="`/room/${room.code}`" class="flex-1 min-w-0">
            <div class="flex items-center gap-3">
              <div class="font-mono text-lg text-field-gold tracking-widest">{{ room.code }}</div>
              <div class="text-field-paper truncate">{{ room.name }}</div>
              <div class="text-xs text-field-slate shrink-0">{{ formatDate(room.createdAt) }}</div>
            </div>
          </NuxtLink>
          <button 
            @click="confirmDelete(room)"
            class="ml-3 text-field-slate hover:text-field-red transition-colors p-1"
            title="删除房间"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    </section>

    <!-- 快速加入 -->
    <section class="card-field max-w-md mx-auto">
      <div class="section-title text-center">快速加入战役</div>
      <div class="flex gap-3">
        <input 
          v-model="roomCode"
          placeholder="输入6位房间码"
          class="input-field flex-1 uppercase text-center tracking-widest"
          maxlength="6"
          @keyup.enter="joinRoom"
        />
        <button @click="joinRoom" class="btn-primary whitespace-nowrap">
          进入
        </button>
      </div>
      <p v-if="error" class="text-field-red text-sm mt-2 text-center">{{ error }}</p>
    </section>

    <!-- 删除确认弹窗 -->
    <div v-if="deletingRoom" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div class="card-field max-w-sm w-full">
        <div class="section-title text-field-red">删除房间</div>
        <p class="text-sm text-field-slate mb-4">
          确认删除 <span class="text-field-gold font-mono">{{ deletingRoom.code }}</span> — {{ deletingRoom.name }}？
          <br>此操作不可恢复。
        </p>
        <div class="space-y-3">
          <input 
            v-model="deleteGMCode"
            placeholder="输入GM码"
            class="input-field w-full"
            type="password"
            @keyup.enter="doDelete"
          />
          <div class="flex gap-3">
            <button @click="deletingRoom = null; deleteGMCode = ''; deleteError = ''" class="btn-secondary flex-1">
              取消
            </button>
            <button 
              @click="doDelete" 
              :disabled="deleting"
              class="btn-primary flex-1 bg-field-red hover:bg-field-red/80 border-field-red"
            >
              {{ deleting ? '删除中...' : '确认删除' }}
            </button>
          </div>
          <p v-if="deleteError" class="text-field-red text-sm text-center">{{ deleteError }}</p>
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
  createdAt: string
}

const roomCode = ref('')
const error = ref('')
const deletingRoom = ref<Room | null>(null)
const deleteGMCode = ref('')
const deleteError = ref('')
const deleting = ref(false)

// 获取房间列表
const { data: roomsData, refresh } = await useFetch('/api/rooms')
const rooms = computed(() => roomsData.value?.rooms || [])

function formatDate(dateStr: string | Date | null): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

function joinRoom() {
  const code = roomCode.value.trim().toUpperCase()
  if (code.length !== 6) {
    error.value = '房间码必须是6位'
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
