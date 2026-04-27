<template>
  <div class="min-h-screen bg-field-bg text-field-paper">
    <!-- 顶部导航 -->
    <header class="border-b border-field-border bg-field-bg/95 backdrop-blur sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <div class="w-8 h-8 border-2 border-field-gold rounded flex items-center justify-center
                      group-hover:bg-field-gold group-hover:text-field-bg transition-colors">
            <span class="font-mono font-bold text-sm">刃</span>
          </div>
          <span class="font-serif-zh text-lg tracking-wider text-field-gold">
            刀锋联队
          </span>
        </NuxtLink>
        
        <nav class="flex items-center gap-6">
          <NuxtLink to="/" class="text-sm text-field-slate hover:text-field-paper transition-colors">
            首页
          </NuxtLink>
          <NuxtLink to="/wiki" class="text-sm text-field-slate hover:text-field-paper transition-colors">
            规则
          </NuxtLink>
          <NuxtLink to="/room" class="text-sm text-field-slate hover:text-field-paper transition-colors">
            加入战役
          </NuxtLink>
        </nav>
      </div>
    </header>
    
    <!-- 主内容 -->
    <main class="max-w-6xl mx-auto px-4 py-8">
      <slot />
    </main>
    
    <!-- 底部 -->
    <footer class="border-t border-field-border mt-auto">
      <div class="max-w-6xl mx-auto px-4 py-4 text-center text-xs text-field-slate">
        刀锋联队战役工具 · 基于 Band of Blades 规则
      </div>
    </footer>
  </div>
</template>
