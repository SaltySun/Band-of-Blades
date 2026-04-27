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
  </div>
</template>

<script setup lang="ts">
const roomCode = ref('')
const error = ref('')

function joinRoom() {
  const code = roomCode.value.trim().toUpperCase()
  if (code.length !== 6) {
    error.value = '房间码必须是6位'
    return
  }
  navigateTo(`/room/${code}`)
}
</script>
