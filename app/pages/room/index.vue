<template>
  <div class="max-w-md mx-auto animate-fade-in">
    <h1 class="text-2xl font-serif-zh text-field-gold text-center mb-8 tracking-wider">
      加入战役
    </h1>
    
    <!-- 创建新房间 -->
    <div class="card-field mb-6">
      <div class="section-title">创建新战役</div>
      <div class="space-y-4">
        <div>
          <label class="text-sm text-field-slate block mb-1">战役名称</label>
          <input v-model="newRoom.name" class="input-field w-full" placeholder="例如：夏日余烬" />
        </div>
        <div>
          <label class="text-sm text-field-slate block mb-1">战役类型</label>
          <select v-model="newRoom.campaignType" class="input-field w-full">
            <option value="summer">夏日之末（默认）</option>
          </select>
        </div>
        <button 
          @click="createRoom" 
          :disabled="creating"
          class="btn-primary w-full"
        >
          {{ creating ? '创建中...' : '创建战役房间' }}
        </button>
      </div>
    </div>
    
    <!-- 加入现有房间 -->
    <div class="card-field">
      <div class="section-title">加入现有战役</div>
      <div class="flex gap-3">
        <input 
          v-model="joinCode"
          placeholder="输入6位房间码"
          class="input-field flex-1 uppercase text-center tracking-widest"
          maxlength="6"
          @keyup.enter="joinRoom"
        />
        <button @click="joinRoom" class="btn-primary whitespace-nowrap">
          进入
        </button>
      </div>
    </div>
    
    <!-- 结果 -->
    <div v-if="result" class="mt-6 card-field border-field-gold/30">
      <div class="section-title text-field-gold">创建成功</div>
      <div class="space-y-2 text-sm">
        <p><span class="text-field-slate">房间码：</span> 
          <span class="font-mono text-lg text-field-gold tracking-widest">{{ result.roomCode }}</span>
        </p>
        <p><span class="text-field-slate">GM密钥：</span> 
          <span class="font-mono text-xs text-field-red break-all">{{ result.gmToken }}</span>
        </p>
        <p class="text-xs text-field-slate mt-2">
          请保存GM密钥，这是管理战役的唯一凭证。
        </p>
        <NuxtLink :to="`/room/${result.roomCode}`" class="btn-primary w-full block text-center mt-4">
          进入房间
        </NuxtLink>
      </div>
    </div>
    
    <p v-if="error" class="text-field-red text-sm mt-4 text-center">{{ error }}</p>
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
