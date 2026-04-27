<template>
  <div class="animate-fade-in">
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
      
      <!-- 军团状态 -->
      <div v-if="roomData.legion" class="card-field">
        <div class="section-title">军团状态</div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center">
            <div class="text-2xl font-mono text-field-gold">{{ roomData.legion.morale }}</div>
            <div class="text-xs text-field-slate">士气</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-mono text-field-red">{{ roomData.legion.pressure }}</div>
            <div class="text-xs text-field-slate">压力</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-mono text-field-paper">{{ roomData.legion.time }}</div>
            <div class="text-xs text-field-slate">时间</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-mono text-field-gold-light">{{ roomData.legion.supplies }}</div>
            <div class="text-xs text-field-slate">补给</div>
          </div>
        </div>
        <!-- 指挥层 -->
        <div class="mt-4 pt-4 border-t border-field-border">
          <div class="text-xs text-field-slate mb-2">指挥层</div>
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
            </NuxtLink>
          </div>
        </div>
      </div>
      
      <!-- 角色列表 -->
      <div class="card-field">
        <div class="flex items-center justify-between mb-4">
          <div class="section-title mb-0">军团成员</div>
          <a 
            :href="`/room/${code}/create-character`"
            @click.prevent="goToCreateCharacter"
            class="btn-primary text-xs inline-block"
          >
            + 创建角色
          </a>
        </div>
        
        <div v-if="characters.length === 0" class="text-center py-8 text-field-slate text-sm">
          暂无角色，点击上方按钮创建
        </div>
        
        <div v-else class="space-y-3">
          <div 
            v-for="char in characters" 
            :key="char.id"
            class="flex items-center justify-between p-3 bg-field-bg rounded border border-field-border
                   hover:border-field-gold/30 transition-colors"
          >
            <div>
              <div class="font-serif-zh text-field-paper">{{ char.name }}</div>
              <div class="text-xs text-field-slate">
                {{ char.playerName }} · {{ roleLabel(char.role) }} · {{ cultureLabel(char.culture) }}
                <NuxtLink
                  v-if="char.legionRole"
                  :to="`/room/${code}/legion-role/${char.legionRole}`"
                  class="text-field-gold hover:underline ml-1"
                >
                  · {{ legionRoleLabel(char.legionRole) }}
                </NuxtLink>
              </div>
            </div>
            <div class="text-right">
              <div class="text-xs text-field-slate">
                压力 {{ char.stress }}/{{ char.stressMax }}
              </div>
              <div class="text-xs text-field-gold" v-if="char.xpTotal > 0">
                XP {{ char.xpTotal }}
              </div>
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

function goToCreateCharacter() {
  navigateTo(`/room/${code}/create-character`)
}

const { data: roomData, pending, error } = await useFetch(`/api/rooms/${code}`)

const { data: charactersData } = await useFetch(`/api/rooms/${code}/characters`)
const characters = computed(() => charactersData.value?.characters || [])

// 指挥层显示数据
const legionRolesDisplay = computed(() => {
  const roles = [
    { key: 'commander', name: '指挥官' },
    { key: 'marshal', name: '军士长' },
    { key: 'quartermaster', name: '军需官' },
    { key: 'lorekeeper', name: '书记官' },
    { key: 'spymaster', name: '间谍总管' },
  ]
  const heldMap: Record<string, string> = {}
  for (const c of characters.value) {
    if (c.legionRole) {
      heldMap[c.legionRole] = c.name
    }
  }
  return roles.map(r => ({
    ...r,
    heldBy: heldMap[r.key] || '',
  }))
})

function roleLabel(role: string) {
  const map: Record<string, string> = {
    heavy: '重装兵',
    medic: '医疗兵',
    sniper: '狙击手',
    officer: '军官',
    scout: '斥候',
    soldier: '士兵',
    rookie: '新兵',
  }
  return map[role] || role
}

function cultureLabel(culture: string) {
  const map: Record<string, string> = {
    barta: '巴尔塔',
    panya: '潘雅',
    ald: '奥尔',
    zeremya: '泽姆亚',
  }
  return map[culture] || culture
}

function legionRoleLabel(role: string) {
  const map: Record<string, string> = {
    commander: '指挥官',
    marshal: '军士长',
    quartermaster: '军需官',
    lorekeeper: '书记官',
    spymaster: '间谍总管',
  }
  return map[role] || role
}
</script>
