<template>
  <div class="animate-fade-in">
    <!-- 玩家名输入弹窗 -->
    <div
      v-if="!hasName"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
    >
      <div class="bg-field-bg border border-field-border rounded-xl p-6 w-80 space-y-4">
        <div class="text-center">
          <div class="text-lg font-serif-zh text-field-gold mb-1">进入房间</div>
          <div class="text-xs text-field-slate">请输入你的名字以加入战役</div>
        </div>
        <input
          v-model="inputName"
          class="input-field w-full"
          placeholder="你的名字"
          maxlength="20"
          @keydown.enter="confirmName"
        >
        <button
          class="btn-primary w-full"
          @click="confirmName"
        >
          进入房间
        </button>
      </div>
    </div>

    <!-- 加载中 -->
    <div v-if="pending" class="text-center py-16 text-field-slate">
      加载中...
    </div>

    <!-- 错误 -->
    <div v-else-if="error" class="text-center py-16">
      <p class="text-field-red">{{ error.statusMessage || '加载失败' }}</p>
      <NuxtLink to="/room" class="btn-secondary mt-4 inline-block">
        返回
      </NuxtLink>
    </div>

    <!-- 房间内容 -->
    <div v-else-if="roomData" class="space-y-6">
      <!-- 房间头部 -->
      <div class="card-field">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-serif-zh text-field-gold">{{ roomData.room.name }}</h1>
            <p class="text-sm text-field-slate mt-1">
              房间码：<span class="font-mono text-field-paper tracking-widest">{{ roomData.room.code }}</span>
            </p>
          </div>
          <div class="text-right">
            <span class="text-xs text-field-slate uppercase tracking-wider">{{ roomData.room.campaignType }}</span>
          </div>
        </div>
      </div>

      <!-- 当前玩家 -->
      <div class="card-field">
        <div class="flex items-center justify-between mb-3">
          <div class="section-title mb-0">房间玩家</div>
          <div class="flex items-center gap-2">
            <span class="text-xs" :class="isGM ? 'text-field-gold' : 'text-field-paper'">
              当前：{{ playerName }}<span v-if="isGM" class="ml-1 text-field-gold">👑 GM</span>
            </span>
            <button
              class="text-xs px-2 py-1 rounded border border-field-border text-field-slate hover:text-field-paper transition-colors"
              @click="changeName"
            >
              更换名字
            </button>
            <button
              class="text-xs px-2 py-1 rounded border border-field-red/30 text-field-red hover:bg-field-red/10 transition-colors"
              @click="exitRoom"
            >
              退出战役
            </button>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="name in roomPlayers"
            :key="name"
            class="text-xs px-3 py-1.5 rounded-full border"
            :class="name === playerName
              ? 'border-field-gold/50 bg-field-gold/10 text-field-gold'
              : 'border-field-border text-field-slate'"
          >
            {{ name }}<span v-if="name.toLowerCase() === 'gm'" class="ml-1">👑</span>
          </div>
          <div v-if="roomPlayers.length === 0" class="text-xs text-field-slate">
            暂无玩家，创建角色后即可加入
          </div>
        </div>
      </div>

      <!-- 军团状态 + 军团成员（左右一行） -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- 军团状态 -->
        <div v-if="roomData.legion" class="card-field">
          <div class="section-title">军团状态</div>
          <div class="grid grid-cols-3 gap-4">
            <div class="text-center">
              <div class="text-2xl font-mono text-field-gold">{{ roomData.legion.morale }}</div>
              <div class="text-xs text-field-slate">士气</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-mono text-field-red">{{ roomData.legion.pressure }}</div>
              <div class="text-xs text-field-slate">压力</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-mono text-field-gold-light">{{ roomData.legion.supplies }}</div>
              <div class="text-xs text-field-slate">补给</div>
            </div>
          </div>
          <!-- 指挥层 -->
          <div class="mt-4 pt-4 border-t border-field-border">
            <div class="text-xs text-field-slate mb-2">指挥层（玩家名）</div>
            <div class="flex flex-wrap gap-2">
              <NuxtLink
                v-for="lr in legionRolesDisplay"
                :key="lr.key"
                :to="`/room/${code}/legion-role/${lr.key}`"
                class="text-xs px-2 py-1 rounded border transition-colors"
                :class="lr.heldBy
                  ? 'border-field-gold/50 bg-field-gold/10 text-field-gold'
                  : 'border-field-border text-field-slate hover:border-field-gold/30'"
              >
                {{ lr.name }}<span v-if="lr.heldBy">: {{ lr.heldBy }}</span>
                <span v-else class="text-field-slate/60">（空缺）</span>
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- 军团成员 -->
        <div class="card-field">
          <div class="flex items-center justify-between mb-4">
            <div class="section-title mb-0">军团成员</div>
            <NuxtLink
              :to="`/room/${code}/create-character`"
              class="btn-primary text-xs inline-block"
            >
              + 创建角色
            </NuxtLink>
          </div>

        <div v-if="livingCharacters.length === 0" class="text-center py-8 text-field-slate text-sm">
          暂无角色，点击上方按钮创建
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="char in livingCharacters"
            :key="char.id"
            class="flex items-center justify-between p-3 bg-field-bg rounded border border-field-border
                   hover:border-field-gold/30 transition-colors"
          >
            <NuxtLink :to="`/room/${code}/character/${char.id}`" class="flex-1 min-w-0">
              <div class="font-serif-zh text-field-paper">{{ char.name }}</div>
              <div class="text-xs text-field-slate">
                {{ char.playerName }} · {{ getRoleName(char.role) }} · {{ getCultureName(char.culture) }}
                <span
                  v-if="char.legionRole"
                  class="text-field-gold ml-1"
                >
                  · {{ getLegionRoleName(char.legionRole) }}
                </span>
              </div>
            </NuxtLink>
            <div class="flex items-center gap-3">
              <div class="text-right">
                <div class="text-xs text-field-slate">
                  压力 {{ char.stress }}/{{ char.stressMax }}
                </div>
                <div class="text-xs text-field-gold" v-if="char.xpTotal > 0">
                  XP {{ char.xpTotal }}
                </div>
              </div>
              <button
                class="text-xs px-2 py-1 rounded border border-field-red/30 text-field-red hover:bg-field-red/10 transition-colors"
                @click="deleteCharacter(char.id)"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>

      <!-- 战役地图（全宽） -->
      <div class="card-field">
        <div class="flex items-center justify-between mb-3">
          <div class="section-title mb-0">战役地图</div>
          <button
            class="text-xs px-2 py-1 rounded border border-field-border text-field-slate hover:text-field-paper transition-colors"
            @click="mapExpanded = !mapExpanded"
          >
            {{ mapExpanded ? '收起 ▲' : '展开 ▼' }}
          </button>
        </div>
        <!-- 收起状态：只显示缩略图，只读 -->
        <div v-if="!mapExpanded" class="relative rounded-lg overflow-hidden border border-field-border cursor-pointer max-h-32" @click="mapExpanded = true">
          <img src="/images/campaign-map.jpg" class="w-full block opacity-50 object-cover">
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-xs text-field-slate bg-field-bg/80 px-3 py-1.5 rounded border border-field-border">点击展开以查看/编辑标注</span>
          </div>
        </div>
        <!-- 展开状态：完整交互地图 -->
        <MapCanvas v-else :room-code="code" :player-name="playerName" />
      </div>

      <!-- 死亡名册 -->
      <div v-if="deadCharacters.length > 0" class="card-field border-field-red/30">
        <div class="section-title text-field-red mb-4">死亡名册</div>
        <div class="space-y-2">
          <div
            v-for="char in deadCharacters"
            :key="char.id"
            class="flex items-center justify-between p-3 bg-field-bg rounded border border-field-red/20 opacity-70"
          >
            <div>
              <div class="font-serif-zh text-field-paper line-through">{{ char.name }}</div>
              <div class="text-xs text-field-slate">
                {{ char.playerName }} · {{ getRoleName(char.role) }} · {{ getCultureName(char.culture) }}
              </div>
            </div>
            <button
              class="text-xs px-2 py-1 rounded border border-field-red/30 text-field-red hover:bg-field-red/10 transition-colors"
              @click="deleteCharacter(char.id)"
            >
              删除
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const code = (route.params.code as string)?.toUpperCase() || ''

const { playerName, hasName, setName, clearName, isGM } = usePlayerName()
const inputName = ref('player')
const mapExpanded = ref(false)

function confirmName() {
  const name = inputName.value.trim() || 'player'
  setName(name)
}

function changeName() {
  const newName = prompt('更换你的名字：', playerName.value)
  if (newName && newName.trim()) {
    setName(newName.trim())
  }
}

function exitRoom() {
  if (!confirm('确定要退出战役吗？你的角色数据不会被删除。')) return
  clearName()
  navigateTo('/room')
}

const { data: roomData, pending, error } = await useFetch(`/api/rooms/${code}`)

const { data: charactersData, refresh: refreshChars } = await useFetch(`/api/rooms/${code}/characters`)
const characters = computed(() => charactersData.value?.characters || [])

const livingCharacters = computed(() => characters.value.filter(c => !c.isDead))
const deadCharacters = computed(() => characters.value.filter(c => c.isDead))

// 房间玩家列表（从角色中收集不同 playerName）
const roomPlayers = computed(() => {
  const names = new Set<string>()
  for (const c of characters.value) {
    if (c.playerName) names.add(c.playerName)
  }
  return Array.from(names)
})

// 指挥层显示数据（从角色列表读取 legionRole）
const legionRolesDisplay = computed(() => {
  const roles = [
    { key: 'commander', name: '指挥官' },
    { key: 'marshal', name: '军士长' },
    { key: 'quartermaster', name: '军需官' },
    { key: 'lorekeeper', name: '书记官' },
    { key: 'spymaster', name: '间谍总管' },
  ]
  return roles.map(r => {
    const holder = characters.value.find((c: any) => c.legionRole === r.key)
    return {
      key: r.key,
      name: r.name,
      heldBy: holder ? holder.name : '',
    }
  })
})

async function deleteCharacter(id: number) {
  if (!confirm('确定要删除这个角色吗？此操作不可撤销。')) return
  try {
    await $fetch(`/api/rooms/${code}/characters/${id}`, { method: 'DELETE' })
    await refreshChars()
  } catch (e: any) {
    alert(e.data?.statusMessage || '删除失败')
  }
}

import { getRoleName, getCultureName, getLegionRoleName } from '~~/shared/game-data'
</script>
