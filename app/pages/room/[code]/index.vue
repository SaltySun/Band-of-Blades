<template>
  <div class="animate-fade-in">
    <!-- 玩家名输入弹窗 — 入伍登记 -->
    <div
      v-if="!hasName"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
    >
      <div class="card-archive w-80 space-y-4 relative" style="transform: rotate(0.5deg);">
        <div class="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-6 bg-field-bg-light/80 border border-field-border rounded-sm" />
        <div class="text-center">
          <div class="font-brush text-2xl text-field-ink mb-1">入伍登记</div>
          <div class="text-xs text-field-slate/70 font-mono tracking-wider">ENTER YOUR NAME</div>
        </div>
        <input
          v-model="inputName"
          class="input-paper w-full text-center"
          placeholder="你的名字"
          maxlength="20"
          @keydown.enter="confirmName"
        >
        <button
          class="btn-seal-dark w-full"
          @click="confirmName"
        >
          确认入役
        </button>
      </div>
    </div>

    <!-- 加载中 -->
    <div v-if="pending" class="text-center py-16 text-field-slate font-mono text-sm">
      调阅档案中...
    </div>

    <!-- 错误 -->
    <div v-else-if="error" class="text-center py-16">
      <p class="text-field-red font-mono">{{ error.statusMessage || '调阅失败' }}</p>
      <NuxtLink to="/room" class="btn-seal mt-4 inline-block">
        返回指挥部
      </NuxtLink>
    </div>

    <!-- 房间内容 -->
    <div v-else-if="roomData" class="space-y-8">
      <!-- 房间头部 — 战役命令书 -->
      <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div class="handnote text-field-hand/60 text-xs mb-1 tracking-wider">
            作战指挥部 · 密级：内部
          </div>
          <h1 class="font-brush text-4xl md:text-5xl text-field-gold tracking-wider">{{ roomData.room.name }}</h1>
          <div class="flex items-center gap-4 mt-2">
            <span class="font-mono text-sm text-field-slate tracking-widest">
              NO. {{ roomData.room.code }}
            </span>
            <span class="font-mono text-xs text-field-slate/60 tracking-wider uppercase border border-field-border px-2 py-0.5">
              {{ roomData.room.campaignType }}
            </span>
          </div>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <span class="text-xs font-mono" :class="isGM ? 'text-field-gold' : 'text-field-paper'">
            {{ playerName }}<span v-if="isGM" class="ml-1">[GM]</span>
          </span>
          <button
            class="text-xs px-2 py-1 border border-field-border text-field-slate hover:text-field-paper transition-colors font-mono"
            @click="changeName"
          >
            更名
          </button>
          <button
            class="text-xs px-2 py-1 border border-field-red/30 text-field-red hover:bg-field-red/10 transition-colors font-mono"
            @click="exitRoom"
          >
            退役
          </button>
        </div>
      </div>

      <!-- 军团状态 — 战情简报 -->
      <div v-if="roomData.legion" class="card-archive relative" style="transform: rotate(-0.3deg);">
        <div class="absolute -top-2 left-8 w-3 h-5 bg-field-bg-light/80 border border-field-border rounded-sm" />
        <div class="section-title-ink flex items-center justify-between">
          <span>战情简报</span>
          <span class="font-mono text-[10px] text-field-slate/50 tracking-wider">SITREP</span>
        </div>
        <div class="grid grid-cols-3 sm:grid-cols-6 gap-4 mt-4">
          <div class="text-center">
            <div class="font-mono text-3xl text-field-gold">{{ roomData.legion.morale }}</div>
            <div class="text-[10px] text-field-slate/70 font-mono tracking-wider uppercase mt-1">士气</div>
          </div>
          <div class="text-center">
            <div class="font-mono text-3xl text-field-red">{{ roomData.legion.pressure }}</div>
            <div class="text-[10px] text-field-slate/70 font-mono tracking-wider uppercase mt-1">压力</div>
          </div>
          <div class="text-center">
            <div class="font-mono text-3xl text-field-gold-light">{{ roomData.legion.supplies }}</div>
            <div class="text-[10px] text-field-slate/70 font-mono tracking-wider uppercase mt-1">补给</div>
          </div>
          <div class="text-center">
            <div class="font-mono text-3xl text-field-paper">{{ roomData.legion.intel }}</div>
            <div class="text-[10px] text-field-slate/70 font-mono tracking-wider uppercase mt-1">情报</div>
          </div>
          <div class="text-center">
            <div class="font-mono text-3xl text-field-paper">{{ roomData.legion.food }}</div>
            <div class="text-[10px] text-field-slate/70 font-mono tracking-wider uppercase mt-1">食物</div>
          </div>
          <div class="text-center">
            <div class="font-mono text-3xl text-field-gold">
              {{ ((roomData.legion as any)?.summerTime || 0) + ((roomData.legion as any)?.autumnTime || 0) + ((roomData.legion as any)?.winterTime || 0) }}
            </div>
            <div class="text-[10px] text-field-slate/70 font-mono tracking-wider uppercase mt-1">时间</div>
          </div>
        </div>

        <!-- 指挥层 -->
        <div class="mt-5 pt-4 border-t border-field-ink/10">
          <div class="font-mono text-[10px] text-field-slate/50 tracking-wider uppercase mb-2">指挥链</div>
          <div class="flex flex-wrap gap-2">
            <NuxtLink
              v-for="lr in legionRolesDisplay"
              :key="lr.key"
              :to="`/room/${code}/legion-role/${lr.key}`"
              class="text-xs px-3 py-1.5 border transition-colors font-mono tracking-wider"
              :class="lr.heldBy
                ? 'border-field-gold/40 text-field-gold bg-field-gold/5'
                : 'border-field-ink/15 text-field-slate/60 hover:border-field-gold/30'"
            >
              {{ lr.name }}<span v-if="lr.heldBy" class="ml-1">: {{ lr.heldBy }}</span>
              <span v-else class="text-field-slate/40">（空缺）</span>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- 军团成员 — 人员花名册 -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="font-mono text-xs text-field-slate tracking-[0.2em] uppercase">人员花名册</span>
            <div class="h-px w-12 bg-field-border" />
          </div>
          <NuxtLink
            :to="`/room/${code}/create-character`"
            class="btn-seal text-xs"
          >
            + 新增人员
          </NuxtLink>
        </div>

        <div v-if="livingCharacters.length === 0" class="card-archive text-center py-8 text-field-slate/60 text-sm">
          花名册为空，点击上方按钮登记新兵
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <NuxtLink
            v-for="char in livingCharacters"
            :key="char.id"
            :to="`/room/${code}/character/${char.id}`"
            class="card-archive group hover:-translate-y-0.5 transition-all duration-200 relative"
            :style="`transform: rotate(${(char.id % 3 - 1) * 0.3}deg);`"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="font-brush text-xl text-field-ink">{{ char.name }}</span>
                  <span v-if="char.legionRole" class="stamp-gold text-[9px] px-1.5 py-0.5">{{ getLegionRoleName(char.legionRole) }}</span>
                </div>
                <div class="text-xs text-field-slate/70 font-mono mt-1">
                  {{ char.playerName }} · {{ getRoleName(char.role) }} · {{ getCultureName(char.culture) }}
                </div>
                <div class="flex items-center gap-3 mt-2">
                  <span class="text-[10px] font-mono text-field-slate/50">压力 {{ char.stress }}/{{ char.stressMax }}</span>
                  <span v-if="char.xpTotal > 0" class="text-[10px] font-mono text-field-gold/70">校验 {{ char.xpTotal }}</span>
                </div>
              </div>
              <div class="w-8 h-8 border border-field-ink/15 flex items-center justify-center text-field-ink/30 font-mono text-xs shrink-0">
                {{ char.name.charAt(0) }}
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- 战役地图 -->
      <div class="card-archive relative" style="transform: rotate(0.3deg);">
        <div class="absolute -top-2 right-8 w-3 h-5 bg-field-bg-light/80 border border-field-border rounded-sm" />
        <div class="section-title-ink flex items-center justify-between">
          <span>战役地图</span>
          <button
            class="text-xs font-mono text-field-slate/60 hover:text-field-ink transition-colors border-b border-transparent hover:border-field-ink/30"
            @click="mapExpanded = !mapExpanded"
          >
            {{ mapExpanded ? '收起' : '展开' }}
          </button>
        </div>
        <div v-if="!mapExpanded" class="relative rounded-sm overflow-hidden border border-field-ink/10 cursor-pointer mt-3 max-h-32" @click="mapExpanded = true">
          <img src="/images/campaign-map.jpg" class="w-full block opacity-40 object-cover">
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-xs text-field-slate bg-field-bg/90 px-3 py-1.5 border border-field-border font-mono">点击展开以查看/编辑标注</span>
          </div>
        </div>
        <MapCanvas v-else :room-code="code" :player-name="playerName" />
      </div>

      <!-- 死亡名册 -->
      <div v-if="deadCharacters.length > 0" class="relative">
        <div class="flex items-center gap-3 mb-4">
          <span class="font-mono text-xs text-field-red tracking-[0.2em] uppercase">死亡名册</span>
          <div class="h-px flex-1 bg-field-red/20" />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            v-for="char in deadCharacters"
            :key="char.id"
            class="card-archive relative opacity-60"
            :style="`transform: rotate(${(char.id % 3 - 1) * 0.5}deg);`"
          >
            <div class="stamp absolute -top-2 -right-1 z-10 text-[9px] px-1.5 py-0.5">阵亡</div>
            <div class="flex items-center justify-between">
              <div>
                <div class="font-brush text-lg text-field-ink line-through">{{ char.name }}</div>
                <div class="text-xs text-field-slate/60 font-mono">
                  {{ char.playerName }} · {{ getRoleName(char.role) }} · {{ getCultureName(char.culture) }}
                </div>
              </div>
              <button
                class="text-xs px-2 py-1 border border-field-red/20 text-field-red/60 hover:bg-field-red/5 transition-colors font-mono"
                @click.prevent="deleteCharacter(char.id)"
              >
                销毁档案
              </button>
            </div>
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
  if (!confirm('确定要销毁这份角色档案吗？此操作不可撤销。')) return
  try {
    await $fetch(`/api/rooms/${code}/characters/${id}`, { method: 'DELETE' })
    await refreshChars()
  } catch (e: any) {
    alert(e.data?.statusMessage || '销毁失败')
  }
}

import { getRoleName, getCultureName, getLegionRoleName } from '~~/shared/game-data'
</script>
