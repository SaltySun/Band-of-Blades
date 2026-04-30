<template>
  <div class="max-w-4xl mx-auto animate-fade-in space-y-12">
    <!-- 标题 -->
    <div class="text-center pt-4">
      <div class="handnote text-field-hand/60 text-xs mb-2 tracking-wider">作战指挥部 · 通信科</div>
      <h1 class="font-brush text-5xl text-field-gold tracking-wider">加入战役</h1>
      <div class="mt-3 flex items-center justify-center gap-4">
        <div class="h-px w-16 bg-field-border" />
        <span class="font-mono text-xs text-field-paper/70 tracking-[0.2em]">ROOM ACCESS</span>
        <div class="h-px w-16 bg-field-border" />
      </div>
    </div>

    <!-- 两栏非对称布局 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- 创建新战役 — 战役命令表格 -->
      <div class="card-archive relative" style="transform: rotate(-0.5deg);">
        <!-- 顶部订书钉 -->
        <div class="absolute -top-3 left-6 w-3 h-6 bg-field-bg-light/80 border border-field-border rounded-sm" />
        <div class="section-title-ink">新建战役命令</div>
        <div class="space-y-4 mt-4">
          <div>
            <label class="font-mono text-[10px] text-field-slate/70 tracking-wider uppercase block mb-1">战役代号</label>
            <input v-model="newRoom.name" class="input-paper w-full" placeholder="例如：夏日余烬" />
          </div>
          <div>
            <label class="font-mono text-[10px] text-field-slate/70 tracking-wider uppercase block mb-1">战役类型</label>
            <select v-model="newRoom.campaignType" class="input-paper w-full">
              <option value="summer">夏日之末（默认）</option>
            </select>
          </div>
          <button
            @click="createRoom"
            :disabled="creating"
            class="btn-seal-dark w-full mt-2"
          >
            {{ creating ? '签发中...' : '签发命令' }}
          </button>
        </div>
      </div>

      <!-- 加入现有战役 — 密电码框 -->
      <div class="card-archive relative" style="transform: rotate(0.5deg);">
        <div class="absolute -top-3 left-6 w-3 h-6 bg-field-bg-light/80 border border-field-border rounded-sm" />
        <div class="section-title-ink">调令接入</div>
        <div class="mt-4">
          <label class="font-mono text-[10px] text-field-slate/70 tracking-wider uppercase block mb-1">房间识别码</label>
          <input
            v-model="joinCode"
            placeholder="██████"
            class="input-paper w-full text-center text-lg tracking-[0.5em] uppercase font-mono"
            maxlength="6"
            @keyup.enter="joinRoom"
          />
          <button @click="joinRoom" class="btn-seal-dark w-full mt-4">
            进入房间
          </button>
        </div>
      </div>
    </div>

    <!-- 创建成功结果 — 盖了章的调令 -->
    <div v-if="result" class="card-archive max-w-lg mx-auto relative" style="transform: rotate(-0.3deg);">
      <div class="stamp-gold absolute -top-3 right-4 z-10">已签发</div>
      <div class="section-title-ink text-field-ink">战役命令已生效</div>
      <div class="space-y-3 text-sm mt-4">
        <div class="flex items-center gap-3">
          <span class="font-mono text-[10px] text-field-slate/70 tracking-wider uppercase w-20">房间码</span>
          <span class="font-mono text-xl text-field-ink tracking-widest">{{ result.roomCode }}</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="font-mono text-[10px] text-field-slate/70 tracking-wider uppercase w-20">GM密钥</span>
          <span class="font-mono text-xs text-field-red break-all">{{ result.gmToken }}</span>
        </div>
        <p class="handnote text-xs mt-2">请保存GM密钥，这是管理战役的唯一凭证。遗失不补。</p>
        <NuxtLink :to="`/room/${result.roomCode}`" class="btn-seal-dark w-full block text-center mt-4">
          进入房间
        </NuxtLink>
      </div>
    </div>

    <p v-if="error" class="text-field-red text-xs text-center font-mono">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
interface CreateRoomResponse {
  success: boolean
  roomCode: string
  gmToken: string
  name: string
  campaignType: string
}

const newRoom = ref({ name: '', campaignType: 'summer' })
const joinCode = ref('')
const creating = ref(false)
const result = ref<CreateRoomResponse | null>(null)
const error = ref('')

async function createRoom() {
  if (!newRoom.value.name.trim()) {
    error.value = '请输入战役名称'
    return
  }

  creating.value = true
  error.value = ''

  try {
    const data = await $fetch<CreateRoomResponse>('/api/rooms', {
      method: 'POST',
      body: {
        name: newRoom.value.name,
        campaignType: newRoom.value.campaignType,
      },
    })
    result.value = data
  } catch (e: any) {
    error.value = e.data?.statusMessage || '创建失败'
  } finally {
    creating.value = false
  }
}

function joinRoom() {
  const code = joinCode.value.trim().toUpperCase()
  if (code.length !== 6) {
    error.value = '房间码必须是6位'
    return
  }
  navigateTo(`/room/${code}`)
}
</script>
