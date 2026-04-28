<template>
  <div class="min-h-screen bg-field-bg text-field-paper flex flex-col">
    <!-- 顶部导航 — 档案夹标签风格 -->
    <header class="sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-end justify-between pt-4 pb-0">
          <!-- 左侧：军团徽章 -->
          <NuxtLink to="/" class="flex items-center gap-3 group pb-2">
            <div class="w-10 h-10 border-2 border-field-gold/60 flex items-center justify-center
                        group-hover:bg-field-gold/10 transition-colors relative">
              <span class="font-brush text-xl text-field-gold leading-none mt-1">刃</span>
              <!-- 角落折痕 -->
              <div class="absolute top-0 right-0 w-0 h-0 border-t-[6px] border-r-[6px] border-t-field-gold/30 border-r-transparent" />
            </div>
            <span class="font-brush text-2xl text-field-gold tracking-widest hidden sm:block">
              刀锋联队
            </span>
          </NuxtLink>

          <!-- 右侧：档案标签页 -->
          <nav class="flex items-end gap-1">
            <NuxtLink
              to="/"
              class="px-4 py-2 text-sm font-mono tracking-wider border-t-2 border-x border-transparent
                     hover:text-field-gold transition-colors relative -mb-px"
              :class="$route.path === '/' ? 'text-field-gold border-t-field-gold border-x-field-border bg-field-bg-light' : 'text-field-slate'"
            >
              首页
            </NuxtLink>
            <NuxtLink
              to="/wiki"
              class="px-4 py-2 text-sm font-mono tracking-wider border-t-2 border-x border-transparent
                     hover:text-field-gold transition-colors relative -mb-px"
              :class="$route.path.startsWith('/wiki') ? 'text-field-gold border-t-field-gold border-x-field-border bg-field-bg-light' : 'text-field-slate'"
            >
              规则
            </NuxtLink>
            <NuxtLink
              to="/room"
              class="px-4 py-2 text-sm font-mono tracking-wider border-t-2 border-x border-transparent
                     hover:text-field-gold transition-colors relative -mb-px"
              :class="$route.path.startsWith('/room') ? 'text-field-gold border-t-field-gold border-x-field-border bg-field-bg-light' : 'text-field-slate'"
            >
              加入战役
            </NuxtLink>
          </nav>
        </div>
      </div>
      <!-- 分隔线 -->
      <div class="border-b border-field-border" />
    </header>

    <!-- 主内容 -->
    <main class="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
      <slot />
    </main>
  </div>
</template>
