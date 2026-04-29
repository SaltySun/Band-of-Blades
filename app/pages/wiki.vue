<template>
  <div class="min-h-screen pb-20">
    <!-- ========== Hero Banner ========== -->
    <div class="relative pt-8 pb-6">
      <div class="max-w-6xl mx-auto px-4">
        <NuxtLink to="/" class="inline-flex items-center gap-1 text-xs text-field-slate hover:text-field-gold transition-colors mb-6 font-mono">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          返回首页
        </NuxtLink>

        <div>
          <div class="handnote text-field-hand/60 text-xs mb-2 tracking-wider">
            军团作战手册 · 内部传阅
          </div>
          <h1 class="font-brush text-5xl sm:text-6xl text-field-gold tracking-wider">
            规则百科
          </h1>
          <div class="mt-3 flex items-center gap-4 max-w-lg">
            <div class="h-px flex-1 bg-field-border" />
            <span class="font-mono text-xs text-field-slate tracking-[0.2em] uppercase">Band of Blades v1.3</span>
          </div>
          <p class="text-sm text-field-slate mt-4 max-w-lg leading-relaxed">
            溃败的雇佣兵团在西方不死者大军的追击下向东撤退。掌握规则，在注定失败的撤退中守护人性。
          </p>
        </div>
      </div>
    </div>

    <!-- ========== 主体：左侧导航 + 右侧内容 ========== -->
    <div class="max-w-6xl mx-auto px-4 mt-8">
      <div class="lg:hidden w-full mb-4 overflow-x-auto pb-2">
        <div class="flex gap-2 min-w-max">
          <button
            v-for="cat in categories"
            :key="cat.id"
            class="px-3 py-1.5 text-xs border transition-all whitespace-nowrap font-mono tracking-wider"
            :class="activeCategory === cat.id
              ? 'border-field-gold bg-field-gold/10 text-field-gold'
              : 'border-field-border text-field-slate hover:border-field-gold/30'"
            @click="activeCategory = cat.id"
          >
            {{ cat.icon }} {{ cat.label }}
          </button>
        </div>
      </div>

      <div class="flex gap-6 items-start">
        <!-- 左侧导航 -->
        <aside class="hidden lg:block w-56 shrink-0">
          <div class="sticky top-6 space-y-1">
            <div v-for="cat in categories" :key="cat.id" class="group">
              <button
                class="w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-all duration-200 border-b border-field-border/30"
                :class="activeCategory === cat.id
                  ? 'text-field-gold border-b-field-gold/40'
                  : 'text-field-slate hover:text-field-paper'"
                @click="activeCategory = cat.id"
              >
                <span class="text-base">{{ cat.icon }}</span>
                <span class="font-medium">{{ cat.label }}</span>
                <span class="ml-auto text-[10px] opacity-50 font-mono">{{ cat.count }}</span>
              </button>
              <div v-if="activeCategory === cat.id" class="ml-6 mt-1 space-y-0.5 border-l border-field-border/50 pl-3">
                <button
                  v-for="child in cat.children"
                  :key="child"
                  class="block w-full text-left px-2 py-1 text-xs rounded transition-colors text-field-slate hover:text-field-gold"
                  @click="scrollToTop"
                >
                  {{ child }}
                </button>
              </div>
            </div>
            <div class="pt-4 border-t border-field-border/30">
              <div class="text-[10px] text-field-slate/50 text-center">刀锋连队 · 规则 v1.3</div>
            </div>
          </div>
        </aside>

        <!-- 右侧内容区 -->
        <main class="flex-1 min-w-0">

          <!-- ========== 1. 核心机制 ========== -->
          <div v-if="activeCategory === 'basic'" class="space-y-6">
            <div class="flex items-center gap-3 mb-6">
              <h2 class="font-brush text-3xl text-field-gold">核心机制</h2>
              <div class="h-px flex-1 bg-field-border" />
              <span class="font-mono text-xs text-field-slate tracking-wider">投骰、行动、处境、效果、抵抗</span>
            </div>

            <WikiCard title="投骰结果" icon="🎲">
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <ResultCard value="6" label="完全成功" color="gold" />
                <ResultCard value="4-5" label="部分成功（+1后果）" color="amber" />
                <ResultCard value="1-3" label="失败（+1~2后果）" color="red" />
                <ResultCard value="6+6" label="关键成功（额外优势）" color="gold" glow />
              </div>
              <p class="text-xs text-field-slate mt-3">投若干d6取最大值。骰池≤0时投2d取较小值（无法关键成功）。奖励骰最多+2d。</p>
            </WikiCard>

            <WikiCard title="五种骰子" icon="🎲">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <DiceTypeCard v-for="d in diceTypes" :key="d.name" :name="d.name" :use="d.use" :when="d.when" />
              </div>
            </WikiCard>

            <WikiCard title="12种通用行动" icon="⚔">
              <div class="space-y-4">
                <div v-for="attr in actionGroups" :key="attr.name">
                  <div class="flex items-center gap-2 mb-2">
                    <div class="w-1 h-4 rounded-full" :class="attr.color" />
                    <span class="text-xs text-field-gold font-medium">{{ attr.name }}</span>
                  </div>
                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <ActionMiniCard v-for="a in attr.actions" :key="a.key" :icon="a.icon" :name="a.name" :desc="a.desc" />
                  </div>
                </div>
              </div>
            </WikiCard>

            <WikiCard title="行动骰六步法" icon="📋">
              <div class="space-y-2">
                <div v-for="(step, i) in actionSteps" :key="i" class="flex items-start gap-3 p-3 rounded-lg bg-field-bg border border-field-border">
                  <span class="text-field-gold font-mono text-sm shrink-0">{{ i + 1 }}</span>
                  <div>
                    <div class="text-sm text-field-paper font-medium">{{ step.title }}</div>
                    <div class="text-xs text-field-slate mt-0.5">{{ step.desc }}</div>
                  </div>
                </div>
              </div>
            </WikiCard>

            <WikiCard title="处境设定" icon="⚡">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <PositionCard name="安全" desc="压倒性优势" consequence="小麻烦/效果降低" color="green" />
                <PositionCard name="危险" desc="势均力敌（默认）" consequence="伤害/麻烦/处境恶化" color="amber" />
                <PositionCard name="绝望" desc="明显劣势" consequence="重伤/严重麻烦/死亡风险" color="red" xp="对应属性+1经验" />
              </div>
            </WikiCard>

            <WikiCard title="效果等级" icon="📊">
              <div class="flex gap-2 text-center text-xs">
                <EffectLevel level="极限" value="4+" color="text-field-gold" />
                <EffectLevel level="极佳" value="3" color="text-field-gold-light" />
                <EffectLevel level="一般" value="2" color="text-field-paper" />
                <EffectLevel level="有限" value="1" color="text-field-slate" />
                <EffectLevel level="无效" value="0" color="text-field-red" />
              </div>
              <p class="text-xs text-field-slate mt-3">效果三要素：效力（针对弱点/时间/风险）· 规模（敌人数量）· 威胁（装备质量）。玩家可主动降级处境换取效果提升。</p>
            </WikiCard>

            <WikiCard title="抵抗、压力与创伤" icon="🧠">
              <div class="p-3 rounded-lg bg-field-bg border border-field-border mb-3">
                <div class="text-xs text-field-gold font-mono mb-1">抵抗骰机制</div>
                <ol class="space-y-1 text-xs text-field-slate list-decimal list-inside">
                  <li>选择对应属性投抵抗骰（认知/技术/决心）</li>
                  <li>承受 <span class="text-field-gold font-mono">6 - 骰子结果</span> 点精神压力</li>
                  <li>6=完全抵抗 / 4-5=部分抵抗 / 1-3=失败</li>
                </ol>
              </div>
              <div class="grid grid-cols-4 gap-2 text-center text-xs mb-3">
                <StressLevel value="0-2" label="正常" color="border-field-border" />
                <StressLevel value="3-4" label="紧张" color="border-field-amber/40" />
                <StressLevel value="5" label="濒临崩溃" color="border-field-gold/40" />
                <StressLevel value="6" label="精神创伤" color="border-field-red/40" textColor="text-field-red" />
              </div>
              <div class="text-xs text-field-gold font-medium mb-1.5">8种创伤症状</div>
              <div class="flex flex-wrap gap-1.5 mb-2">
                <span v-for="t in traumas" :key="t" class="text-xs px-2.5 py-1 rounded-lg bg-field-bg border border-field-border text-field-slate">{{ t }}</span>
              </div>
              <p class="text-xs text-field-slate">压力上限默认6点（"幸存者"能力可提升至8/10）。最多2次创伤=死亡（"老兵"能力可提升至3/4）。扮演创伤可获得经验。</p>
            </WikiCard>

            <WikiCard title="伤害、腐化与死亡" icon="💀">
              <div class="space-y-2">
                <HarmLevel level="1" name="轻微" effect="轻度妨碍" color="bg-field-border" />
                <HarmLevel level="2" name="中度" effect="明显妨碍" color="bg-field-amber/40" />
                <HarmLevel level="3" name="严重" effect="失能" color="bg-field-gold/40" />
                <HarmLevel level="4" name="致命" effect="死亡" color="bg-field-red/40" />
              </div>
              <p class="text-xs text-field-slate mt-3">行满溢推：2级满→升为3级；3级满→升为4级（死亡）。护甲：普通1格/重甲2格/盾牌1格。</p>
              <div class="mt-3 p-4 rounded-xl bg-gradient-to-r from-field-red/5 to-transparent border border-field-red/20">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-field-red/10 border border-field-red/30 flex items-center justify-center text-field-red text-lg">☠</div>
                  <div>
                    <div class="text-sm text-field-paper">累计 <span class="text-field-red font-mono">7点腐化</span> → 获得枯萎症状，枯萎病+1级</div>
                    <div class="text-sm text-field-red font-medium mt-0.5">4级枯萎病 = 变成怪物 = 死亡</div>
                  </div>
                </div>
              </div>
              <p class="text-xs text-field-slate mt-2">8种枯萎症状：咒诅、寄生、饥渴、瘴气、变异、狂怒、腐烂、幻象。腐化无法通过一般手段降低。</p>
            </WikiCard>
          </div>

          <!-- ========== 2. 角色与成长 ========== -->
          <div v-if="activeCategory === 'character'" class="space-y-6">
            <div class="flex items-center gap-3 mb-6">
              <h2 class="font-brush text-3xl text-field-gold">角色与成长</h2>
              <div class="h-px flex-1 bg-field-border" />
              <span class="font-mono text-xs text-field-slate tracking-wider">职业、文化、装备、创建、晋升</span>
            </div>

            <WikiCard title="职业与专家" icon="🎭">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div v-for="r in rolesDetail" :key="r.key" class="p-4 rounded-xl bg-field-bg-light border border-field-border hover:border-field-gold/30 transition-all">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-lg">{{ r.icon }}</span>
                    <span class="text-field-paper font-medium text-sm">{{ r.name }}</span>
                  </div>
                  <div class="text-xs text-field-gold mb-1">特种行动：{{ r.special }}</div>
                  <div class="text-xs text-field-slate">{{ r.desc }}</div>
                </div>
              </div>
            </WikiCard>

            <WikiCard title="文化特性" icon="🏛">
              <div class="space-y-3">
                <div v-for="c in cultures" :key="c.name" class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-sm text-field-paper font-medium mb-1">{{ c.name }}</div>
                  <div class="text-xs text-field-slate">{{ c.desc }}</div>
                  <div class="mt-1 flex flex-wrap gap-1">
                    <span v-for="t in c.traits" :key="t" class="text-xs px-2 py-0.5 rounded bg-field-ink/10 text-field-slate">{{ t }}</span>
                  </div>
                </div>
              </div>
            </WikiCard>

            <WikiCard title="装备与负载" icon="🎒">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                <div class="p-3 rounded-lg bg-field-bg border border-field-border text-center">
                  <div class="text-xs text-field-paper font-medium">轻装</div>
                  <div class="text-xs text-field-gold">2个功能栏</div>
                  <div class="text-xs text-field-slate mt-1">无惩罚，可冲刺</div>
                </div>
                <div class="p-3 rounded-lg bg-field-bg border border-field-border text-center">
                  <div class="text-xs text-field-paper font-medium">中装</div>
                  <div class="text-xs text-field-gold">3个功能栏</div>
                  <div class="text-xs text-field-slate mt-1">机动行动-1骰</div>
                </div>
                <div class="p-3 rounded-lg bg-field-bg border border-field-border text-center">
                  <div class="text-xs text-field-paper font-medium">重装</div>
                  <div class="text-xs text-field-gold">4个功能栏</div>
                  <div class="text-xs text-field-slate mt-1">机动-1骰，无法冲刺</div>
                </div>
              </div>

              <div class="text-xs text-field-paper font-medium mb-2">功能栏物品（占栏位）</div>
              <div class="overflow-x-auto mb-3">
                <table class="w-full text-xs">
                  <thead>
                    <tr class="border-b border-field-border">
                      <th class="text-left text-field-gold py-2 pr-3 font-medium">物品</th>
                      <th class="text-left text-field-gold py-2 pr-3 font-medium">栏位</th>
                      <th class="text-left text-field-gold py-2 font-medium">效果</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-b border-field-border/30">
                      <td class="py-2 pr-3 text-field-paper">黑弹</td>
                      <td class="py-2 pr-3 text-field-gold font-mono">1</td>
                      <td class="py-2 text-field-slate">投掷/发射后对不死者造成额外伤害</td>
                    </tr>
                    <tr class="border-b border-field-border/30">
                      <td class="py-2 pr-3 text-field-paper">手雷</td>
                      <td class="py-2 pr-3 text-field-gold font-mono">1</td>
                      <td class="py-2 text-field-slate">范围爆炸伤害，可填充进程表</td>
                    </tr>
                    <tr class="border-b border-field-border/30">
                      <td class="py-2 pr-3 text-field-paper">炼金武装带</td>
                      <td class="py-2 pr-3 text-field-gold font-mono">1</td>
                      <td class="py-2 text-field-slate">医疗兵专属，携带炼金试剂（枭目油、化合软膏等）</td>
                    </tr>
                    <tr class="border-b border-field-border/30">
                      <td class="py-2 pr-3 text-field-paper">重武器</td>
                      <td class="py-2 pr-3 text-field-gold font-mono">1</td>
                      <td class="py-2 text-field-slate">威胁度+1，但影响机动</td>
                    </tr>
                    <tr class="border-b border-field-border/30">
                      <td class="py-2 pr-3 text-field-paper">盾牌</td>
                      <td class="py-2 pr-3 text-field-gold font-mono">1</td>
                      <td class="py-2 text-field-slate">护甲+1格</td>
                    </tr>
                    <tr class="border-b border-field-border/30">
                      <td class="py-2 pr-3 text-field-paper">黑栎防具</td>
                      <td class="py-2 pr-3 text-field-gold font-mono">1</td>
                      <td class="py-2 text-field-slate">优质护甲，可额外抵消1级伤害</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="text-xs text-field-paper font-medium mb-2">标准物品（不占栏，默认携带）</div>
              <div class="flex flex-wrap gap-1.5 mb-3">
                <span class="text-xs px-2.5 py-1 rounded-lg bg-field-bg border border-field-border text-field-slate">军团佩剑/匕首</span>
                <span class="text-xs px-2.5 py-1 rounded-lg bg-field-bg border border-field-border text-field-slate">火绳枪/手枪（需装填）</span>
                <span class="text-xs px-2.5 py-1 rounded-lg bg-field-bg border border-field-border text-field-slate">基本护甲（1格）</span>
                <span class="text-xs px-2.5 py-1 rounded-lg bg-field-bg border border-field-border text-field-slate">绷带（勾销1级伤害）</span>
                <span class="text-xs px-2.5 py-1 rounded-lg bg-field-bg border border-field-border text-field-slate">口粮（1天份）</span>
                <span class="text-xs px-2.5 py-1 rounded-lg bg-field-bg border border-field-border text-field-slate">火绒盒</span>
              </div>

              <div class="text-xs text-field-paper font-medium mb-2">护甲系统</div>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center mb-2">
                <div class="p-2 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-field-paper">基本护甲</div>
                  <div class="text-field-gold">1格</div>
                </div>
                <div class="p-2 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-field-paper">重甲</div>
                  <div class="text-field-gold">2格</div>
                </div>
                <div class="p-2 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-field-paper">盾牌</div>
                  <div class="text-field-gold">+1格</div>
                </div>
                <div class="p-2 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-field-paper">黑栎防具</div>
                  <div class="text-field-gold">额外1格</div>
                </div>
              </div>
              <p class="text-xs text-field-slate">护甲用来抵消伤害等级。1格护甲可将1级伤害降为0（无伤）。护甲用完后需修理或更换。</p>
            </WikiCard>

            <WikiCard title="角色创建流程" icon="📋">
              <div class="space-y-3">
                <div class="flex items-start gap-3 p-3 rounded-lg bg-field-bg border border-field-border">
                  <span class="text-field-gold font-mono text-sm shrink-0">1</span>
                  <div><div class="text-sm text-field-paper font-medium">选择职业</div><div class="text-xs text-field-slate mt-0.5">重装兵/医疗兵/狙击手/军官/斥候/士兵/新兵。专家选2项初始能力，士兵/新兵选1项。</div></div>
                </div>
                <div class="flex items-start gap-3 p-3 rounded-lg bg-field-bg border border-field-border">
                  <span class="text-field-gold font-mono text-sm shrink-0">2</span>
                  <div><div class="text-sm text-field-paper font-medium">选择文化特性</div><div class="text-xs text-field-slate mt-0.5">巴尔塔/潘雅/奥尔/泽姆亚四大文化，各有独特特性加成。</div></div>
                </div>
                <div class="flex items-start gap-3 p-3 rounded-lg bg-field-bg border border-field-border">
                  <span class="text-field-gold font-mono text-sm shrink-0">3</span>
                  <div><div class="text-sm text-field-paper font-medium">分配行动点数</div><div class="text-xs text-field-slate mt-0.5">共4点，分配到12个通用行动上（每项0-2级）。本职专家技能自动1级，不消耗点数。</div></div>
                </div>
                <div class="flex items-start gap-3 p-3 rounded-lg bg-field-bg border border-field-border">
                  <span class="text-field-gold font-mono text-sm shrink-0">4</span>
                  <div><div class="text-sm text-field-paper font-medium">选择装备</div><div class="text-xs text-field-slate mt-0.5">轻/中/重三种负载，选择功能栏物品和标准物品。</div></div>
                </div>
                <div class="flex items-start gap-3 p-3 rounded-lg bg-field-bg border border-field-border">
                  <span class="text-field-gold font-mono text-sm shrink-0">5</span>
                  <div><div class="text-sm text-field-paper font-medium">选择军团职务</div><div class="text-xs text-field-slate mt-0.5">指挥官/军士长/军需官为必要职务；书记官/间谍总管为可选。</div></div>
                </div>
              </div>
            </WikiCard>

            <WikiCard title="晋升与死亡" icon="💀">
              <div class="space-y-2">
                <div class="flex items-start gap-3 p-3 rounded-lg bg-field-bg border border-field-border">
                  <span class="text-field-gold font-mono text-sm shrink-0">新兵→士兵</span>
                  <div class="text-xs text-field-slate">存活2次任务后晋升为士兵，获得"忍耐"特种行动和1个新能力。</div>
                </div>
                <div class="flex items-start gap-3 p-3 rounded-lg bg-field-bg border border-field-border">
                  <span class="text-field-gold font-mono text-sm shrink-0">行动升级</span>
                  <div class="text-xs text-field-slate">经验表6格满→该行动等级+1。默认上限3级，"精英"能力可提升至4级。</div>
                </div>
                <div class="flex items-start gap-3 p-3 rounded-lg bg-field-bg border border-field-red/20">
                  <span class="text-field-red font-mono text-sm shrink-0">死亡</span>
                  <div class="text-xs text-field-slate">4级伤害=死亡 / 第2次精神创伤=死亡 / 4级枯萎病=死亡。死亡角色遗赠1点XP给新角色。</div>
                </div>
              </div>
            </WikiCard>

            <WikiCard title="经验获取" icon="⭐">
              <div class="overflow-x-auto">
                <table class="w-full text-xs">
                  <thead>
                    <tr class="border-b border-field-border">
                      <th class="text-left text-field-gold py-2 pr-3 font-medium">条件</th>
                      <th class="text-left text-field-gold py-2 font-medium">XP奖励</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="x in xpTable" :key="x.condition" class="border-b border-field-border/30">
                      <td class="py-2 pr-3 text-field-slate">{{ x.condition }}</td>
                      <td class="py-2 text-field-gold whitespace-nowrap">{{ x.reward }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </WikiCard>
          </div>

          <!-- ========== 3. 战斗系统 ========== -->
          <div v-if="activeCategory === 'combat'" class="space-y-6">
            <div class="flex items-center gap-3 mb-6">
              <h2 class="font-brush text-3xl text-field-gold">战斗系统</h2>
              <div class="h-px flex-1 bg-field-border" />
              <span class="font-mono text-xs text-field-slate tracking-wider">奖励骰、协作、闪回、进程表、护甲</span>
            </div>

            <WikiCard title="奖励骰来源" icon="➕" subtitle="最多叠加 +2d">
              <div class="space-y-2">
                <BonusCard v-for="b in bonusDice" :key="b.name" :name="b.name" :desc="b.desc" />
              </div>
            </WikiCard>

            <WikiCard title="团队协作" icon="🤝">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TeamCard v-for="t in teamActions" :key="t.name" :name="t.name" :cost="t.cost" :desc="t.desc" />
              </div>
            </WikiCard>

            <WikiCard title="闪回机制" icon="⏮">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="p-4 rounded-xl bg-field-bg-light border border-field-border hover:border-field-gold/30 transition-all">
                  <div class="text-field-paper font-medium text-sm mb-1">简单闪回</div>
                  <div class="text-field-gold font-mono text-lg mb-1">1点压力</div>
                  <div class="text-xs text-field-slate">提前藏好物品、偷了钥匙</div>
                </div>
                <div class="p-4 rounded-xl bg-field-bg-light border border-field-border hover:border-field-gold/30 transition-all">
                  <div class="text-field-paper font-medium text-sm mb-1">复杂闪回</div>
                  <div class="text-field-gold font-mono text-lg mb-1">2点压力</div>
                  <div class="text-xs text-field-slate">提前侦查路线、建立关系</div>
                </div>
              </div>
              <div class="mt-3 flex gap-4 text-xs text-field-slate">
                <span><span class="text-field-red">×</span> 不能改变已确定的事实</span>
                <span><span class="text-field-red">×</span> 不能闪回不可能的时间点</span>
                <span><span class="text-field-gold">!</span> 闪回中的行动仍需投骰</span>
                <span><span class="text-field-red">!</span> 闪回失败也有后果</span>
              </div>
            </WikiCard>

            <WikiCard title="恶魔的交易" icon="😈">
              <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                <p class="text-xs text-field-slate">GM或其他玩家提出一个<span class="text-field-gold">代价</span>，接受代价的角色获得<span class="text-field-gold">+1d</span>（最多+2d）。交易不论成败都会生效。</p>
                <div class="mt-2 text-xs text-field-slate">常见代价：连带损伤、背叛朋友、激怒神选者、承受腐化、推进危机进程表、暴露位置、装备损坏</div>
              </div>
            </WikiCard>

            <WikiCard title="进程表系统" icon="⏱">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-3">
                <div v-for="p in progressTypes" :key="p.name" class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper font-medium">{{ p.name }}</div>
                  <div class="text-xs text-field-slate mt-0.5">{{ p.desc }}</div>
                  <div class="text-xs text-field-gold mt-1">填满触发：{{ p.trigger }}</div>
                </div>
              </div>
              <div class="text-xs text-field-slate">填表规则：有限效果=1格 / 一般效果=2格 / 极佳效果=3格。威胁表血量：威胁度2→8格 / 3→10格 / 4→12格。</div>
            </WikiCard>

            <WikiCard title="护甲与装备质量" icon="🛡">
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center mb-3">
                <div class="p-2 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-field-paper">基本护甲</div>
                  <div class="text-field-gold">1格</div>
                </div>
                <div class="p-2 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-field-paper">重甲</div>
                  <div class="text-field-gold">2格</div>
                </div>
                <div class="p-2 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-field-paper">盾牌</div>
                  <div class="text-field-gold">+1格</div>
                </div>
                <div class="p-2 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-field-paper">黑栎防具</div>
                  <div class="text-field-gold">额外1格</div>
                </div>
              </div>
              <div class="text-xs text-field-slate">装备质量：普通（威胁度1）→ 优质（威胁度2）→ 重武器（威胁度3+）。质量影响效果判定中的"威胁"要素。</div>
            </WikiCard>
          </div>
          <!-- ========== 4. 军团运营 ========== -->
          <div v-if="activeCategory === 'legion'" class="space-y-6">
            <div class="flex items-center gap-3 mb-6">
              <h2 class="font-brush text-3xl text-field-gold">军团运营</h2>
              <div class="h-px flex-1 bg-field-border" />
              <span class="font-mono text-xs text-field-slate tracking-wider">五个职位详细规则、物资、间谍、编年史、营地</span>
            </div>

            <WikiCard title="职位概览" icon="📋">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <RoleCard v-for="r in legionRoles" :key="r.key" :icon="r.icon" :name="r.name" :required="r.required" :desc="r.desc" />
              </div>
            </WikiCard>

            <WikiCard title="指挥官（Commander）" icon="⚔">
              <div class="text-xs text-field-slate mb-2">核心职责：选择主要/次要任务、决定进军路线、消费情报获得战略优势。</div>
              <div class="space-y-2">
                <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper font-medium mb-1">情报消费方式</div>
                  <div class="text-xs text-field-slate space-y-0.5">
                    <div><span class="text-field-gold">遭遇骰+1</span>（消耗1点情报）：为任何任务增加1个遭遇骰</div>
                    <div><span class="text-field-gold">解锁特殊任务</span>（消耗情报）：获得执行某地特殊任务的权利</div>
                    <div><span class="text-field-gold">情报问题</span>（不消耗，提问数量=持有的情报数量上限）</div>
                  </div>
                </div>
                <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper font-medium mb-1">0情报 — 眼前任务细节</div>
                  <div class="text-xs text-field-slate">任务中不死者威胁度最高是多少？ / 需要多远行军？ / 哪件物品带上比较有用？ / 任务中有哪两种可选执行方式？ / 哪些小队不尊重领导层？ / 神选者对任务的态度？</div>
                </div>
                <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper font-medium mb-1">1情报 — 额外问题</div>
                  <div class="text-xs text-field-slate">任务中哪些物品比较有用？ / 谁对这个任务很认真？ / 可能遇到什么样的挑战？ / 会遇上哪些破碎者的部队？ / 接下来地点能找到什么有益资源？ / 某个精英的弱点/欲望是什么？</div>
                </div>
                <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper font-medium mb-1">2情报 — 战略级</div>
                  <div class="text-xs text-field-slate">会遇到哪个副官或臭名昭著的存在？ / 不死者布置中最大的弱点是什么？ / 这个任务和之前的任务有关联吗？ / 破碎者在往哪个方向移动？ / 地点存在什么样的挑战或困难？</div>
                </div>
                <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper font-medium mb-1">3情报 — 战役级</div>
                  <div class="text-xs text-field-slate">此前遇到的某个臭名昭著的存在的深层弱点是什么？ / 余烬之王的目标是什么？ / 破碎者如何影响当前地区？ / 不死者军队正在执行什么计划？ / 军团如何才能最大限度地利用当前局势？</div>
                </div>
                <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper font-medium mb-1">按神选者的初始情报</div>
                  <div class="text-xs text-field-slate space-y-0.5">
                    <div><span class="text-field-gold">施芮亚</span>：每完成2次主要任务获得1份情报</div>
                    <div><span class="text-field-gold">有角者</span>：初始情报1</div>
                    <div><span class="text-field-gold">左拉</span>：初始情报0（军团没时间侦察）</div>
                  </div>
                </div>
              </div>
            </WikiCard>

            <WikiCard title="军士长（Sergeant）" icon="🛡">
              <div class="text-xs text-field-slate mb-2">核心职责：部署人员、管理士气（0-10）、投掷遭遇骰。</div>
              <div class="space-y-2">
                <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper font-medium mb-1">士气调整</div>
                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div class="p-2 rounded bg-field-ink/10 text-center"><span class="text-field-red">阵亡</span> <span class="text-field-slate">士气-1</span></div>
                    <div class="p-2 rounded bg-field-ink/10 text-center"><span class="text-field-gold">士气≥6</span> <span class="text-field-slate">+1（庆祝胜利）</span></div>
                    <div class="p-2 rounded bg-field-ink/10 text-center"><span class="text-field-red">士气≤3</span> <span class="text-field-slate">-1（恐慌蔓延）</span></div>
                    <div class="p-2 rounded bg-field-ink/10 text-center"><span class="text-field-gold">宗教任务</span> <span class="text-field-slate">+1</span></div>
                    <div class="p-2 rounded bg-field-ink/10 text-center"><span class="text-field-gold">突袭任务</span> <span class="text-field-slate">+1</span></div>
                  </div>
                </div>
                <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper font-medium mb-1">遭遇骰</div>
                  <div class="text-xs text-field-slate space-y-0.5">
                    <div><span class="text-field-red font-mono">1-3</span> = 绝望处境</div>
                    <div><span class="text-field-amber font-mono">4-5</span> = 危险处境</div>
                    <div><span class="text-field-gold font-mono">6</span> = 安全处境</div>
                  </div>
                </div>
                <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper font-medium mb-1">派遣原则</div>
                  <div class="text-xs text-field-slate space-y-0.5">
                    <div>• 考虑角色状态（失能、创伤、高腐化不宜派遣）</div>
                    <div>• 考虑角色的专业能力匹配任务类型</div>
                    <div>• 一个角色不能同时参与主要和次要任务</div>
                    <div>• 死亡角色无法派遣</div>
                  </div>
                </div>
              </div>
            </WikiCard>

            <WikiCard title="军需官（Quartermaster）" icon="⚙">
              <div class="text-xs text-field-slate mb-2">核心职责：物资调配、募兵、休息恢复、长期项目。</div>
              <div class="space-y-2">
                <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper font-medium mb-1">战役行动（每次阶段选一项）</div>
                  <div class="text-xs text-field-slate space-y-1">
                    <div><span class="text-field-gold">1. 获取资源</span>：投战役骰，结果决定获得多少食物/补给。可通过渠道、勒索等获得加成。</div>
                    <div><span class="text-field-gold">2. 放假（R&R）</span>：士气+1，每个角色可以勾销伤害格子。但时间和压力会推进。</div>
                    <div><span class="text-field-gold">3. 长期项目</span>：推进大型工程进程表。范例：制造攻城武器、研发新药、修理装备。通常需多个战役阶段完成。</div>
                    <div><span class="text-field-gold">4. 募兵</span>：补充新兵。新兵数量取决于声誉和士气。新兵默认无特种行动，威胁度1。</div>
                  </div>
                </div>
                <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper font-medium mb-1">休息与恢复</div>
                  <div class="text-xs text-field-slate space-y-1">
                    <div><span class="text-field-gold">6小时休息</span>：勾销1格伤害（任意等级），清除2-3点压力。营地不安全时效果减半。</div>
                    <div><span class="text-field-gold">1天完整休整</span>：勾销2格伤害（任意等级），清空所有压力（归零），进行新兵晋升判定。</div>
                    <div><span class="text-field-gold">前提条件</span>：必须有足够食物（每个存活角色消耗1单位）+ 营地相对安全。食物不足时无法有效休息，士气下降，可能出现饥饿状态。</div>
                  </div>
                </div>
                <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper font-medium mb-1">食物消耗与补给</div>
                  <div class="text-xs text-field-slate space-y-0.5">
                    <div>• 每次战役阶段（进军后），每个存活角色消耗<span class="text-field-gold">1单位食物</span></div>
                    <div>• 初始食物：<span class="text-field-gold">10单位</span></div>
                    <div>• 补给获取：补给任务 / 军需官"获取资源" / 渠道（社交行动）/ 间谍网络"商人"节点 / 地点搜刮</div>
                  </div>
                </div>
              </div>
            </WikiCard>

            <WikiCard title="书记官（Lorekeeper）" icon="📜">
              <div class="text-xs text-field-slate mb-2">核心职责：记录编年史、在营地阶段讲述军团故事、提供叙事框架。</div>
              <div class="space-y-2">
                <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper font-medium mb-1">5种编年史类型</div>
                  <div class="text-xs text-field-slate space-y-0.5">
                    <div>1. <span class="text-field-gold">军团建立的故事</span>：军团最初如何组建</div>
                    <div>2. <span class="text-field-gold">军团独立的故事</span>：军团何时成为独立雇佣兵</div>
                    <div>3. <span class="text-field-gold">战火淬炼的故事</span>：某场关键战役的传说</div>
                    <div>4. <span class="text-field-gold">意志不屈的故事</span>：绝境中坚守</div>
                    <div>5. <span class="text-field-gold">军团存在的意义</span>：军团的信念与使命</div>
                  </div>
                </div>
                <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper font-medium mb-1">讲述规则</div>
                  <div class="text-xs text-field-slate space-y-0.5">
                    <div>• 每次战役阶段，书记官可以讲述一个故事</div>
                    <div>• 参与玩家可获得对应属性的<span class="text-field-gold">经验点</span></div>
                    <div>• 士气8-10时，所有听众额外<span class="text-field-gold">+1 XP</span></div>
                    <div>• 每记录4位死者可多讲一个故事</div>
                    <div>• 沮丧营地时听众很难获得经验点</div>
                  </div>
                </div>
              </div>
            </WikiCard>

            <WikiCard title="间谍总管（Spymaster）" icon="🕸">
              <div class="text-xs text-field-slate mb-2">核心职责：管理间谍网络、派遣短期/长期任务。</div>
              <div class="space-y-2">
                <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper font-medium mb-1">起始配置</div>
                  <div class="text-xs text-field-slate">2位初始间谍：1位熟练 + 1位大师。最多同时拥有3位间谍（需解锁"增员"节点）。</div>
                </div>
                <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper font-medium mb-1">7位可选间谍</div>
                  <div class="overflow-x-auto">
                    <table class="w-full text-xs">
                      <thead>
                        <tr class="border-b border-field-border">
                          <th class="text-left text-field-gold py-1.5 pr-2 font-medium">间谍</th>
                          <th class="text-left text-field-gold py-1.5 pr-2 font-medium">特技</th>
                          <th class="text-left text-field-gold py-1.5 font-medium">定位</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr class="border-b border-field-border/30"><td class="py-1.5 pr-2 text-field-paper">安托瓦内特</td><td class="py-1.5 pr-2 text-field-slate">起始即为大师级</td><td class="py-1.5 text-field-slate">暗杀/破坏</td></tr>
                        <tr class="border-b border-field-border/30"><td class="py-1.5 pr-2 text-field-paper">鲍提斯</td><td class="py-1.5 pr-2 text-field-slate">扩张网络任务额外+1格</td><td class="py-1.5 text-field-slate">导师/建设</td></tr>
                        <tr class="border-b border-field-border/30"><td class="py-1.5 pr-2 text-field-paper">赤烦风</td><td class="py-1.5 pr-2 text-field-slate">任何任务都不会负伤</td><td class="py-1.5 text-field-slate">万能安全牌</td></tr>
                        <tr class="border-b border-field-border/30"><td class="py-1.5 pr-2 text-field-paper">伊葛丽德</td><td class="py-1.5 pr-2 text-field-slate">收集情报时额外多问1个问题</td><td class="py-1.5 text-field-slate">情报专家</td></tr>
                        <tr class="border-b border-field-border/30"><td class="py-1.5 pr-2 text-field-paper">莉娅</td><td class="py-1.5 pr-2 text-field-slate">调查长期任务+1骰</td><td class="py-1.5 text-field-slate">侦察/潜伏</td></tr>
                        <tr><td class="py-1.5 pr-2 text-field-paper">昂也廷</td><td class="py-1.5 pr-2 text-field-slate">强化任务长期任务+1骰</td><td class="py-1.5 text-field-slate">任务优化</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper font-medium mb-1">间谍网络科技树</div>
                  <div class="text-xs text-field-slate space-y-0.5">
                    <div>间谍网络（起始，允许维持2位间谍）</div>
                    <div>├─ <span class="text-field-gold">增员</span> → 可同时维持3位间谍</div>
                    <div>│　└─ <span class="text-field-gold">训练</span> → 熟练间谍升为大师（可点2次）</div>
                    <div>├─ <span class="text-field-gold">分析师</span> → 调查长期任务+1骰</div>
                    <div>│　└─ <span class="text-field-gold">投资</span> → 扩张网络长期任务+1骰</div>
                    <div>├─ <span class="text-field-gold">现场评估</span> → 收集情报时额外多问1个问题</div>
                    <div>├─ <span class="text-field-gold">诱捕</span> → 设置陷阱长期任务+1骰</div>
                    <div>└─ <span class="text-field-gold">信息源</span> → 强化任务长期任务+1骰</div>
                    <div>　　├─ <span class="text-field-gold">商人</span> → 强化补给任务额外+1补给</div>
                    <div>　　├─ <span class="text-field-gold">教团</span> → 强化宗教任务额外+1资源</div>
                    <div>　　├─ <span class="text-field-gold">佣兵</span> → 强化突袭任务额外+1士气</div>
                    <div>　　└─ <span class="text-field-gold">游侠</span> → 强化侦察任务额外+1情报</div>
                  </div>
                </div>
                <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper font-medium mb-1">短期任务（无风险，不投骰）</div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div class="p-2 rounded bg-field-ink/10"><span class="text-field-gold">恢复</span> <span class="text-field-slate">移除间谍负伤状态</span></div>
                    <div class="p-2 rounded bg-field-ink/10"><span class="text-field-gold">收集情报</span> <span class="text-field-slate">从指挥官情报问题列表中选1个问GM</span></div>
                    <div class="p-2 rounded bg-field-ink/10"><span class="text-field-gold">勒索</span> <span class="text-field-slate">为1次"获取资源"战役行动+1骰</span></div>
                    <div class="p-2 rounded bg-field-ink/10"><span class="text-field-gold">协助</span> <span class="text-field-slate">为1次"长期项目"战役行动+1骰</span></div>
                  </div>
                </div>
                <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper font-medium mb-1">长期任务（8格进程表，有伤亡风险）</div>
                  <div class="text-xs text-field-slate space-y-1">
                    <div>投骰：熟练间谍1d / 大师间谍2d取高。1-3=1格（负伤）/ 4-5=2格 / 6=3格 / 双6=5格</div>
                    <div>伤亡：首次负伤→获得负伤状态；已负伤再负伤→<span class="text-field-red">牺牲（死亡）</span>。负伤间谍执行"恢复"短期任务可清除负伤。</div>
                    <div class="mt-1">长期任务可接力：不同间谍轮流推进同一任务，暂停无惩罚。</div>
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-xs">
                    <div class="p-2 rounded bg-field-ink/10"><span class="text-field-gold">强化任务</span> <span class="text-field-slate">指定类型任务奖励与惩罚骰各+1</span></div>
                    <div class="p-2 rounded bg-field-ink/10"><span class="text-field-gold">扩张网络</span> <span class="text-field-slate">解锁一个新网络节点</span></div>
                    <div class="p-2 rounded bg-field-ink/10"><span class="text-field-gold">设置陷阱</span> <span class="text-field-slate">下轮任务列表必定包含突袭指定副官/怖物的任务</span></div>
                    <div class="p-2 rounded bg-field-ink/10"><span class="text-field-gold">招募</span> <span class="text-field-slate">加入1位新间谍（替换死亡者）</span></div>
                    <div class="p-2 rounded bg-field-ink/10"><span class="text-field-gold">调查</span> <span class="text-field-slate">了解当地所有特殊任务</span></div>
                  </div>
                </div>
              </div>
            </WikiCard>

            <WikiCard title="营地场景" icon="🏕">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                <div class="p-3 rounded-lg bg-field-bg border border-field-red/20 text-center">
                  <div class="text-xs text-field-red font-medium">士气 0-3</div>
                  <div class="text-xs text-field-paper">沮丧营地</div>
                  <div class="text-xs text-field-slate mt-1">休息效果减半，可能逃兵，结算-1</div>
                </div>
                <div class="p-3 rounded-lg bg-field-bg border border-field-border text-center">
                  <div class="text-xs text-field-amber font-medium">士气 4-7</div>
                  <div class="text-xs text-field-paper">普通营地</div>
                  <div class="text-xs text-field-slate mt-1">正常休息</div>
                </div>
                <div class="p-3 rounded-lg bg-field-bg border border-field-gold/20 text-center">
                  <div class="text-xs text-field-gold font-medium">士气 8-10</div>
                  <div class="text-xs text-field-paper">振奋营地</div>
                  <div class="text-xs text-field-slate mt-1">休息额外+1格，可能募兵，结算+1</div>
                </div>
              </div>
              <div class="text-xs text-field-slate">营地活动：休息、修理装备、交换情报、祷告/冥想、训练新兵、写遗书。</div>
            </WikiCard>
          </div>

          <!-- ========== 5. 任务与战役 ========== -->
          <div v-if="activeCategory === 'mission'" class="space-y-6">
            <div class="flex items-center gap-3 mb-6">
              <h2 class="font-brush text-3xl text-field-gold">任务与战役</h2>
              <div class="h-px flex-1 bg-field-border" />
              <span class="font-mono text-xs text-field-slate tracking-wider">游戏结构、任务、结算、地点</span>
            </div>

            <WikiCard title="游戏结构" icon="🏰">
              <div class="p-3 rounded-lg bg-field-bg border border-field-border mb-3">
                <div class="text-xs text-field-slate space-y-1">
                  <div><span class="text-field-gold">战役阶段</span>：时间流逝 → 各职位执行行动 → 指挥官决定是否进军 → GM生成新任务</div>
                  <div><span class="text-field-gold">任务阶段</span>：选任务 → 部署人员 → 投遭遇骰 → 执行任务 → 结算 → 营地</div>
                  <div><span class="text-field-gold">一节游戏</span> = 一次任务阶段 + 一次战役阶段</div>
                  <div><span class="text-field-gold">完整战役</span> ≈ 12节。到达天刃堡=最终防守战=战役结束。</div>
                </div>
              </div>
              <div class="text-xs text-field-paper font-medium mb-1">撤退路线</div>
              <div class="text-xs text-field-slate">军团从西方溃败，一路向东撤退，经过多个地点，最终目标是天刃堡。每个地点有4个标准任务和3个特殊任务。</div>
            </WikiCard>

            <WikiCard title="四种标准任务" icon="🗺">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <MissionCard v-for="m in missionTypes" :key="m.name" :name="m.name" :desc="m.desc" :bonus="m.bonus" :penalty="m.penalty" />
              </div>
            </WikiCard>

            <WikiCard title="特殊任务与次要任务" icon="📌">
              <div class="space-y-2">
                <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper font-medium mb-1">特殊任务</div>
                  <div class="text-xs text-field-slate">每个地点有3个特殊任务。需消耗1份情报解锁。通常有独特背景、奖励和惩罚，完成后可能改变战役走向。</div>
                </div>
                <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper font-medium mb-1">次要任务</div>
                  <div class="text-xs text-field-slate">指挥官选择的第二个任务，不需要玩家扮演执行。由遭遇骰自动决定成败。骰值1-3=惩罚 / 4-6=奖励。所有参与专家+2XP不论成败。</div>
                </div>
              </div>
            </WikiCard>

            <WikiCard title="结算七步" icon="📋">
              <div class="space-y-2">
                <div v-for="(step, i) in settlementSteps" :key="i" class="flex items-start gap-3 p-3 rounded-lg bg-field-bg border border-field-border">
                  <span class="text-field-gold font-mono text-sm shrink-0">{{ i + 1 }}</span>
                  <div>
                    <div class="text-sm text-field-paper font-medium">{{ step.title }}</div>
                    <div class="text-xs text-field-slate mt-0.5">{{ step.desc }}</div>
                  </div>
                </div>
              </div>
              <p class="text-xs text-field-red mt-2">⚠ 严格顺序，不可颠倒。死亡处理必须在士气调整和XP分配之前。</p>
            </WikiCard>

            <WikiCard title="地点与任务生成" icon="📍">
              <div class="text-xs text-field-slate mb-2">每个地点包含：4个标准任务（突袭/侦察/宗教/补给）+ 3个特殊任务（需情报解锁）+ 次要任务奖励/惩罚表（骰值1-6）。</div>
              <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                <div class="text-xs text-field-paper font-medium mb-1">示例地点：灰烬沼泽</div>
                <div class="text-xs text-field-slate space-y-0.5">
                  <div><span class="text-field-gold">突袭</span>：烧毁不死者孵化池 → 士气+1，延缓追击 / 伤亡，瘴气腐化+1</div>
                  <div><span class="text-field-gold">侦察</span>：测绘安全通道 → 情报+1，下地点进军时间-1 / 陷入泥潭，物资损失</div>
                  <div><span class="text-field-gold">宗教</span>：净化被亵渎的神龛 → 神选者支持，士气+1 / 亵渎反噬，腐化+2</div>
                  <div><span class="text-field-gold">补给</span>：搜刮废弃渔村 → 食物+2，炼金试剂 / 食物污染，疾病</div>
                </div>
              </div>
            </WikiCard>
          </div>

          <!-- ========== 6. 神选者系统 ========== -->
          <div v-if="activeCategory === 'chosen'" class="space-y-6">
            <div class="flex items-center gap-3 mb-6">
              <h2 class="font-brush text-3xl text-field-gold">神选者系统</h2>
              <div class="h-px flex-1 bg-field-border" />
              <span class="font-mono text-xs text-field-slate tracking-wider">形态进化、超凡使命、战役规则</span>
            </div>

            <WikiCard title="施芮亚 — 阿斯莉卡之慈悲" icon="🕊">
              <div class="text-xs text-field-slate mb-2">巴尔塔治愈女神。主题：军事与战略、治愈与牺牲。战役风格：稳扎稳打，情报驱动。每2次主要任务+1情报。</div>
              <div class="overflow-x-auto">
                <table class="w-full text-xs">
                  <thead>
                    <tr class="border-b border-field-border">
                      <th class="text-left text-field-gold py-2 pr-2 font-medium">形态</th>
                      <th class="text-left text-field-gold py-2 pr-2 font-medium">阶段</th>
                      <th class="text-left text-field-gold py-2 pr-2 font-medium">威胁</th>
                      <th class="text-left text-field-gold py-2 font-medium">核心能力</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-b border-field-border/30">
                      <td class="py-2 pr-2 text-field-paper">阿斯莉卡之慈悲</td>
                      <td class="py-2 pr-2 text-field-slate">初始</td>
                      <td class="py-2 pr-2 text-field-gold font-mono">4</td>
                      <td class="py-2 text-field-slate"><span class="text-field-gold">治愈之光</span>：每场任务一次，清空一名角色压力并勾销1格伤害</td>
                    </tr>
                    <tr class="border-b border-field-border/30">
                      <td class="py-2 pr-2 text-field-paper">阿斯莉卡之佑</td>
                      <td class="py-2 pr-2 text-field-slate">3-4节</td>
                      <td class="py-2 pr-2 text-field-gold font-mono">4</td>
                      <td class="py-2 text-field-slate"><span class="text-field-gold">庇护领域</span>：全队获得1格特殊护甲（抵抗1次伤害/腐化）</td>
                    </tr>
                    <tr class="border-b border-field-border/30">
                      <td class="py-2 pr-2 text-field-paper">阿斯莉卡之泪</td>
                      <td class="py-2 pr-2 text-field-slate">5-6节</td>
                      <td class="py-2 pr-2 text-field-gold font-mono">4</td>
                      <td class="py-2 text-field-slate"><span class="text-field-gold">牺牲之泪</span>：承受一名角色的全部伤害和压力（自身不受伤害，神眷进度延迟）</td>
                    </tr>
                    <tr class="border-b border-field-border/30">
                      <td class="py-2 pr-2 text-field-paper">受膏者</td>
                      <td class="py-2 pr-2 text-field-slate">7-8节</td>
                      <td class="py-2 pr-2 text-field-gold font-mono">5</td>
                      <td class="py-2 text-field-slate"><span class="text-field-gold">圣印标记</span>：标记敌人，该敌人受效果+1级，威胁度视为-1</td>
                    </tr>
                    <tr class="border-b border-field-border/30">
                      <td class="py-2 pr-2 text-field-paper">战斗圣女</td>
                      <td class="py-2 pr-2 text-field-slate">9-10节</td>
                      <td class="py-2 pr-2 text-field-gold font-mono">5</td>
                      <td class="py-2 text-field-slate"><span class="text-field-gold">神选者之血</span>：血液成为圣物，可净化腐化、复活刚死亡角色（1次/战役）</td>
                    </tr>
                    <tr>
                      <td class="py-2 pr-2 text-field-paper font-medium">战争圣徒</td>
                      <td class="py-2 pr-2 text-field-slate">11-12节</td>
                      <td class="py-2 pr-2 text-field-gold font-mono">6</td>
                      <td class="py-2 text-field-slate"><span class="text-field-gold">天刃裁决</span>：最终防守战威胁度6+，可单独对抗破碎者1回合不受伤害</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </WikiCard>

            <WikiCard title="有角者（潘雅丛林之神）" icon="🦌">
              <div class="text-xs text-field-slate mb-2">主题：神秘力量与变形、自然与野性。战役风格：灵活多变，适应性强。初始情报1。</div>
              <div class="text-xs text-field-paper font-medium mb-1">初始三选一</div>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                <div class="p-2 rounded-lg bg-field-bg-light border border-field-border">
                  <div class="text-xs text-field-gold font-medium">赏（Gift）</div>
                  <div class="text-xs text-field-slate"><span class="text-field-gold">野兽之赐</span>：每场任务一次，令一名角色的一个行动临时提升至4级（1场景）</div>
                </div>
                <div class="p-2 rounded-lg bg-field-bg-light border border-field-border">
                  <div class="text-xs text-field-gold font-medium">眼（Eye）</div>
                  <div class="text-xs text-field-slate"><span class="text-field-gold">丛林之眼</span>：任务开始时，自动揭示所有敌人的位置和最高威胁度</div>
                </div>
                <div class="p-2 rounded-lg bg-field-bg-light border border-field-border">
                  <div class="text-xs text-field-gold font-medium">筋（Sinew）</div>
                  <div class="text-xs text-field-slate"><span class="text-field-gold">筋肉强化</span>：神选者自身威胁度+1，可携带2名角色一起执行超凡使命</div>
                </div>
              </div>
              <div class="text-xs text-field-slate">后续：变形者（野兽变形）→ 受膏者（自然共鸣）→ 伟大猎手/森林之翼/白腿马之皮（三选一最终形态）。</div>
            </WikiCard>

            <WikiCard title="左拉（泽姆亚远古神明）" icon="⚡">
              <div class="text-xs text-field-slate mb-2">主题：强力正面作战、毁灭与审判。战役风格：正面硬撼，高风险高回报。初始情报0。</div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                <div class="p-2 rounded-lg bg-field-bg-light border border-field-border">
                  <div class="text-xs text-field-paper font-medium">晨星（初始）</div>
                  <div class="text-xs text-field-slate"><span class="text-field-gold">黎明之光</span>：每场任务一次，对不死者群体造成"效果极佳"的神圣伤害（填3格进程表）</div>
                </div>
                <div class="p-2 rounded-lg bg-field-bg-light border border-field-border">
                  <div class="text-xs text-field-paper font-medium">圣印（3-4节）</div>
                  <div class="text-xs text-field-slate"><span class="text-field-gold">审判印记</span>：标记敌人，该敌人对全队伤害-1级，效果-1级</div>
                </div>
              </div>
              <div class="text-xs text-field-slate mb-1">中期三选一：</div>
              <div class="text-xs text-field-slate space-y-0.5 mb-2">
                <div><span class="text-field-gold">永生神之怒</span>：超凡使命中威胁度视为6，不死者效果对神选者无效</div>
                <div><span class="text-field-gold">永生神之吻</span>：近身触碰敌人，直接填满其威胁表（副官有效，破碎者减半）</div>
                <div><span class="text-field-gold">永生神之力</span>：令一名角色本场景内所有行动+1骰，效果+1级</div>
              </div>
              <div class="text-xs text-field-slate">最终：泽姆亚化身（攻击无视不死者护甲，对破碎者威胁度视为对等）。</div>
            </WikiCard>

            <WikiCard title="超凡使命" icon="🌟">
              <div class="space-y-2">
                <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper font-medium mb-1">规则</div>
                  <div class="text-xs text-field-slate">神选者单独执行的高风险任务，不需要其他角色参与。使用当前威胁度作为基础骰池（4-6d），不受普通敌人威胁度压制。</div>
                </div>
                <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper font-medium mb-1">失败后果</div>
                  <div class="text-xs text-field-slate">神选者受伤 / 被俘（需救援任务）/ 神眷等级下降（退回上一形态）</div>
                </div>
                <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper font-medium mb-1">成功奖励</div>
                  <div class="text-xs text-field-slate">大幅削弱破碎者 / 扭转局部战局 / 解锁新形态 / 士气+1</div>
                </div>
              </div>
            </WikiCard>

            <WikiCard title="通用规则" icon="📜">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper font-medium mb-1">不死规则</div>
                  <div class="text-xs text-field-slate">受到致命伤害时，可牺牲当前神眷等级避免死亡（退回上一形态）</div>
                </div>
                <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper font-medium mb-1">能力限制</div>
                  <div class="text-xs text-field-slate">每次任务只能使用一次神选者能力（无论哪个形态）</div>
                </div>
                <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper font-medium mb-1">腐化免疫</div>
                  <div class="text-xs text-field-slate">不受腐化影响，不积累腐化值</div>
                </div>
                <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper font-medium mb-1">士气影响</div>
                  <div class="text-xs text-field-slate">受伤/降级→士气-1；完成超凡使命→士气+1</div>
                </div>
              </div>
              <p class="text-xs text-field-slate mt-2">最终防守战：普通角色无法对破碎者造成伤害，只有神选者能直接伤害破碎者。</p>
            </WikiCard>
          </div>
          <!-- ========== 7. 敌人与威胁 ========== -->
          <div v-if="activeCategory === 'enemy'" class="space-y-6">
            <div class="flex items-center gap-3 mb-6">
              <h2 class="font-brush text-3xl text-field-gold">敌人与威胁</h2>
              <div class="h-px flex-1 bg-field-border" />
              <span class="font-mono text-xs text-field-slate tracking-wider">威胁度、敌人图鉴、破碎者、最终战</span>
            </div>

            <WikiCard title="威胁度尺度" icon="⚠">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                <div v-for="t in threatLevels" :key="t.level" class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="flex items-center gap-2">
                    <span class="text-field-gold font-mono">T{{ t.level }}</span>
                    <span class="text-xs text-field-paper">{{ t.name }}</span>
                  </div>
                  <div class="text-xs text-field-slate mt-1">{{ t.examples }}</div>
                </div>
              </div>
              <p class="text-xs text-field-slate mt-3">敌人威胁度每比你高1级：你的效果-1级 / 你受到的伤害+1级 / 腐化=其威胁度。</p>
            </WikiCard>

            <WikiCard title="敌人图鉴" icon="👹">
              <div class="overflow-x-auto">
                <table class="w-full text-xs">
                  <thead>
                    <tr class="border-b border-field-border">
                      <th class="text-left text-field-gold py-2 pr-3 font-medium">敌人</th>
                      <th class="text-left text-field-gold py-2 pr-3 font-medium">威胁</th>
                      <th class="text-left text-field-gold py-2 font-medium">特性</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="e in enemies" :key="e.name" class="border-b border-field-border/30">
                      <td class="py-2 pr-3 text-field-paper">{{ e.name }}</td>
                      <td class="py-2 pr-3 text-field-gold font-mono">{{ e.threat }}</td>
                      <td class="py-2 text-field-slate">{{ e.desc }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </WikiCard>

            <WikiCard title="破碎者（终极Boss）" icon="🔥">
              <div class="space-y-3">
                <div class="p-4 rounded-xl bg-gradient-to-r from-field-red/5 to-transparent border border-field-red/20">
                  <div class="text-sm text-field-paper font-medium mb-1">战役中选择两位破碎者</div>
                  <div class="text-xs text-field-slate">原本是9位神选者中的5位，被余烬之王腐化。每位破碎者拥有独特的恐怖主题和腐化方式，战役中会逐渐展现其能力。</div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                    <div class="text-xs text-field-red font-medium mb-1">凋零者</div>
                    <div class="text-xs text-field-slate">血肉扭曲者。特殊规则：现代战争（武器/护甲部队威胁度+1）。副官："博士"（精于缝制怖物）。特色：血肉工程、瘟疫散布、变形实验。</div>
                  </div>
                  <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                    <div class="text-xs text-field-red font-medium mb-1">破坏者</div>
                    <div class="text-xs text-field-slate">风暴女巫。特殊规则：操控天气与心灵。特色：幻象、恐惧、精神污染。</div>
                  </div>
                  <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                    <div class="text-xs text-field-red font-medium mb-1">撕裂者</div>
                    <div class="text-xs text-field-slate">战争巨人。特殊规则：战争机器、强制征召。特色：碾碎一切、军团对抗军团。</div>
                  </div>
                </div>
                <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper font-medium mb-1">最终防守战（第12节）</div>
                  <div class="text-xs text-field-slate">地点：天刃堡。胜利条件：守住直到黎明（填满黎明进程表12格）。普通角色无法对破碎者造成伤害，只有神选者能直接伤害破碎者。</div>
                </div>
              </div>
            </WikiCard>
          </div>

          <!-- ========== 8. 世界观与背景 ========== -->
          <div v-if="activeCategory === 'lore'" class="space-y-6">
            <div class="flex items-center gap-3 mb-6">
              <h2 class="font-brush text-3xl text-field-gold">世界观与背景</h2>
              <div class="h-px flex-1 bg-field-border" />
              <span class="font-mono text-xs text-field-slate tracking-wider">战役背景、四大文化、军团历史</span>
            </div>

            <WikiCard title="战役背景" icon="🌑">
              <div class="space-y-2">
                <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper font-medium mb-1">西方不死者大军</div>
                  <div class="text-xs text-field-slate">被称为"余烬之王"的恐怖存在率领不死者大军从西方席卷而来。所到之处，城市化为灰烬，生者变成腐尸。没有任何军队能够正面抵挡。</div>
                </div>
                <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper font-medium mb-1">刀锋连队的溃败</div>
                  <div class="text-xs text-field-slate">刀锋连队是一支经验丰富的雇佣兵团，曾在无数战场上立下赫赫战功。但在不死者大军面前，他们遭遇了毁灭性的溃败。现在，残存的军团必须向东撤退，穿越被战争蹂躏的土地，前往传说中的最后堡垒——天刃堡。</div>
                </div>
                <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper font-medium mb-1">撤退的代价</div>
                  <div class="text-xs text-field-slate">这不仅仅是一次军事撤退。每一次放弃阵地、每一个倒下的战友、每一份被消耗的物资，都在侵蚀军团的士气。而不死者大军永不停歇的追击，让休息成为一种奢望。</div>
                </div>
                <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper font-medium mb-1">天刃堡 — 最后的希望</div>
                  <div class="text-xs text-field-slate">位于大陆东端的古老要塞，传说中从未被攻陷。如果军团能够到达天刃堡并守住它直到黎明，也许还有一线生机。但在这之前，他们必须穿越12个危机四伏的地点。</div>
                </div>
              </div>
            </WikiCard>

            <WikiCard title="四大文化" icon="🏛">
              <div class="space-y-3">
                <div v-for="c in cultures" :key="c.name" class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-sm text-field-paper font-medium mb-1">{{ c.name }}</div>
                  <div class="text-xs text-field-slate">{{ c.desc }}</div>
                  <div class="mt-1 flex flex-wrap gap-1">
                    <span v-for="t in c.traits" :key="t" class="text-xs px-2 py-0.5 rounded bg-field-ink/10 text-field-slate">{{ t }}</span>
                  </div>
                </div>
              </div>
            </WikiCard>

            <WikiCard title="军团历史" icon="📜">
              <div class="space-y-2">
                <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper font-medium mb-1">成立</div>
                  <div class="text-xs text-field-slate">刀锋连队由一群来自四大文化的退伍老兵和雇佣兵组建。他们不效忠于任何国家，只效忠于契约和战友。</div>
                </div>
                <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper font-medium mb-1">辉煌</div>
                  <div class="text-xs text-field-slate">曾参与大陆上几乎所有重大战役，以纪律严明和战术灵活著称。无论多么绝望的战斗，刀锋连队总能找到生路。</div>
                </div>
                <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper font-medium mb-1">溃败</div>
                  <div class="text-xs text-field-slate">面对余烬之王的不死者大军，传统的战术完全失效。军团在西方前线遭受重创，指挥官阵亡，编制被打散。现在，活着的人只是曾经那支传奇军队的一小部分。</div>
                </div>
                <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper font-medium mb-1">传承</div>
                  <div class="text-xs text-field-slate">书记官记录着每一位阵亡者的名字和故事。只要还有人记得他们，刀锋连队就还没有真正灭亡。新兵不断加入，老兵不断倒下——这是撤退路上唯一的常态。</div>
                </div>
              </div>
            </WikiCard>

            <WikiCard title="战役地点结构" icon="🗺">
              <div class="text-xs text-field-slate mb-2">完整战役约12节，军团从西向东撤退，经过多个不同类型的地点。每个地点包含：</div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                <div class="p-2 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper">4个标准任务</div>
                  <div class="text-xs text-field-slate">突袭/侦察/宗教/补给</div>
                </div>
                <div class="p-2 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper">3个特殊任务</div>
                  <div class="text-xs text-field-slate">需1份情报解锁，可能改变战役走向</div>
                </div>
                <div class="p-2 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper">地点资源</div>
                  <div class="text-xs text-field-slate">可搜刮的特殊物品/食物/情报</div>
                </div>
                <div class="p-2 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper">地点威胁</div>
                  <div class="text-xs text-field-slate">该地点常见敌人类型</div>
                </div>
              </div>
              <div class="p-3 rounded-lg bg-field-bg border border-field-border">
                <div class="text-xs text-field-paper font-medium mb-1">示例：灰烬沼泽</div>
                <div class="text-xs text-field-slate">环境特征：毒雾、腐烂植被、木板栈道。标准任务包括烧毁不死者孵化池、测绘安全通道、净化神龛、搜刮渔村。威胁：瘴气腐化+1。</div>
              </div>
            </WikiCard>
          </div>

          <!-- ========== 9. 速查附录 ========== -->
          <div v-if="activeCategory === 'cheatsheet'" class="space-y-6">
            <div class="flex items-center gap-3 mb-6">
              <h2 class="font-brush text-3xl text-field-gold">速查附录</h2>
              <div class="h-px flex-1 bg-field-border" />
              <span class="font-mono text-xs text-field-slate tracking-wider">数字、流程、术语、经验</span>
            </div>

            <WikiCard title="数字速查表" icon="🔢">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div v-for="n in numberCheats" :key="n.label" class="p-2 rounded-lg bg-field-bg border border-field-border flex justify-between">
                  <span class="text-xs text-field-slate">{{ n.label }}</span>
                  <span class="text-xs text-field-gold font-mono">{{ n.value }}</span>
                </div>
              </div>
            </WikiCard>

            <WikiCard title="判定六步法" icon="📋">
              <div class="space-y-1">
                <div v-for="(step, i) in actionSteps" :key="i" class="flex items-start gap-2 text-xs">
                  <span class="text-field-gold font-mono shrink-0">{{ i + 1 }}.</span>
                  <span class="text-field-slate">{{ step.title }} — {{ step.desc }}</span>
                </div>
              </div>
            </WikiCard>

            <WikiCard title="结算七步" icon="📋">
              <div class="space-y-1">
                <div v-for="(step, i) in settlementSteps" :key="i" class="flex items-start gap-2 text-xs">
                  <span class="text-field-gold font-mono shrink-0">{{ i + 1 }}.</span>
                  <span class="text-field-slate">{{ step.title }} — {{ step.desc }}</span>
                </div>
              </div>
              <p class="text-xs text-field-red mt-2">⚠ 严格顺序，不可颠倒。</p>
            </WikiCard>

            <WikiCard title="进程表类型" icon="⏱">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                <div v-for="p in progressTypes" :key="p.name" class="p-2 rounded-lg bg-field-bg border border-field-border">
                  <div class="text-xs text-field-paper font-medium">{{ p.name }}</div>
                  <div class="text-xs text-field-slate">{{ p.desc }}</div>
                  <div class="text-xs text-field-gold">触发：{{ p.trigger }}</div>
                </div>
              </div>
            </WikiCard>

            <WikiCard title="术语索引" icon="📖">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div class="p-2 rounded-lg bg-field-bg border border-field-border">
                  <span class="text-field-gold font-medium">XP / 经验点</span>
                  <span class="text-field-slate"> — 用于提升行动等级（6格满→升级）</span>
                </div>
                <div class="p-2 rounded-lg bg-field-bg border border-field-border">
                  <span class="text-field-gold font-medium">腐化</span>
                  <span class="text-field-slate"> — 累计7点→枯萎症状，4级枯萎=死亡</span>
                </div>
                <div class="p-2 rounded-lg bg-field-bg border border-field-border">
                  <span class="text-field-gold font-medium">压力</span>
                  <span class="text-field-slate"> — 满6点→精神创伤，上限6（可提升）</span>
                </div>
                <div class="p-2 rounded-lg bg-field-bg border border-field-border">
                  <span class="text-field-gold font-medium">闪回</span>
                  <span class="text-field-slate"> — 1-2点压力，提前安排有利条件</span>
                </div>
                <div class="p-2 rounded-lg bg-field-bg border border-field-border">
                  <span class="text-field-gold font-medium">超越自我</span>
                  <span class="text-field-slate"> — 2点压力，+1d或+1效果等级</span>
                </div>
                <div class="p-2 rounded-lg bg-field-bg border border-field-border">
                  <span class="text-field-gold font-medium">恶魔交易</span>
                  <span class="text-field-slate"> — 接受代价换取+1d（最多+2d）</span>
                </div>
                <div class="p-2 rounded-lg bg-field-bg border border-field-border">
                  <span class="text-field-gold font-medium">遭遇骰</span>
                  <span class="text-field-slate"> — 1-3绝望/4-5危险/6安全</span>
                </div>
                <div class="p-2 rounded-lg bg-field-bg border border-field-border">
                  <span class="text-field-gold font-medium">士气</span>
                  <span class="text-field-slate"> — 0-10，影响营地、结算、募兵</span>
                </div>
              </div>
            </WikiCard>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: '规则百科 · 刀锋联队' })

const activeCategory = ref('basic')

const categories = [
  { id: 'basic', label: '核心机制', icon: '🎲', count: 6, children: ['投骰结果', '骰子类型', '12种行动', '六步法', '处境设定', '效果等级', '抵抗压力', '伤害腐化'] },
  { id: 'character', label: '角色与成长', icon: '🎭', count: 6, children: ['职业专家', '文化特性', '装备负载', '创建流程', '晋升死亡', '经验获取'] },
  { id: 'combat', label: '战斗系统', icon: '⚔', count: 6, children: ['奖励骰', '团队协作', '闪回', '恶魔交易', '进程表', '护甲质量'] },
  { id: 'legion', label: '军团运营', icon: '📋', count: 6, children: ['五个职位', '情报系统', '物资休息', '编年史', '间谍网络', '营地场景'] },
  { id: 'mission', label: '任务与战役', icon: '🗺', count: 5, children: ['游戏结构', '任务类型', '特殊次要', '结算七步', '地点生成'] },
  { id: 'chosen', label: '神选者系统', icon: '✨', count: 5, children: ['施芮亚', '有角者', '左拉', '超凡使命', '通用规则'] },
  { id: 'enemy', label: '敌人与威胁', icon: '💀', count: 3, children: ['威胁度', '敌人图鉴', '破碎者'] },
  { id: 'lore', label: '世界观与背景', icon: '📜', count: 4, children: ['战役背景', '四大文化', '军团历史', '地点结构'] },
  { id: 'cheatsheet', label: '速查附录', icon: '⭐', count: 5, children: ['数字速查', '六步法', '结算七步', '进程表', '术语索引'] },
]

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const diceTypes = [
  { name: '行动骰', use: 'PC进行有挑战性的行动', when: '玩家声明行动时' },
  { name: '抵抗骰', use: '减轻或避免后果', when: '玩家不想接受后果时' },
  { name: '遭遇骰', use: '任务开始时确定处境', when: '任务部署完成后，GM投' },
  { name: '战役骰', use: '战役阶段的职位行动', when: '战役阶段各职位执行行动时' },
  { name: '幸运骰', use: 'GM判断不确定事件', when: 'GM需要随机决定时' },
]

const actionGroups = [
  {
    name: '认知',
    color: 'bg-blue-500',
    actions: [
      { key: 'channel', icon: '🤝', name: '渠道', desc: '获取资源、关系网' },
      { key: 'investigation', icon: '🔍', name: '调查', desc: '观察、搜集信息' },
      { key: 'rigging', icon: '🔧', name: '修补', desc: '维修、解除陷阱' },
      { key: 'scout', icon: '👁', name: '侦察', desc: '侦察、潜行' },
    ],
  },
  {
    name: '技术',
    color: 'bg-emerald-500',
    actions: [
      { key: 'maneuver', icon: '🏃', name: '机动', desc: '移动、驾驶' },
      { key: 'marksmanship', icon: '🎯', name: '射击', desc: '远程攻击' },
      { key: 'skirmish', icon: '⚔', name: '游击', desc: '近战骚扰' },
      { key: 'wreck', icon: '💥', name: '破坏', desc: '摧毁、爆破' },
    ],
  },
  {
    name: '决心',
    color: 'bg-purple-500',
    actions: [
      { key: 'sway', icon: '🗣', name: '社交', desc: '谈判、说服' },
      { key: 'discipline', icon: '📢', name: '训诫', desc: '维持纪律、威吓' },
      { key: 'command', icon: '📯', name: '组织', desc: '指挥调度' },
      { key: 'resolve', icon: '🛡', name: '动摇', desc: '抵抗恐惧、坚守' },
    ],
  },
  {
    name: '专家',
    color: 'bg-field-gold',
    actions: [
      { key: 'aim', icon: '🎯', name: '瞄准', desc: '狙击手：射击效果+1级' },
      { key: 'martialArts', icon: '👊', name: '武艺', desc: '重装兵：对抗规模优势' },
      { key: 'medicine', icon: '💉', name: '医疗', desc: '医疗兵：暂时消除伤害惩罚' },
      { key: 'endure', icon: '🏔', name: '忍耐', desc: '士兵：抵抗骰+2d' },
      { key: 'survival', icon: '🌲', name: '求生', desc: '斥候：寻找避难所/补给' },
      { key: 'weave', icon: '✨', name: '编织', desc: '炼金术相关操作' },
    ],
  },
]

const actionSteps = [
  { title: '玩家宣布目标', desc: '清晰说出要做什么和期望的结果' },
  { title: '玩家选择行动类型', desc: '从12种通用行动中选择最合适的一项' },
  { title: 'GM设定处境', desc: '安全/危险（默认）/绝望。绝望中行动对应属性+1经验' },
  { title: 'GM设定效果等级', desc: '基于效力、规模、威胁判断：无效0/有限1/一般2/极佳3/极限4+' },
  { title: '玩家添加奖励骰', desc: '协助+1d（1压）/ 超越自我+1d或+1效果（2压）/ 恶魔交易+1d' },
  { title: '投骰与判断', desc: '6=完全成功 / 4-5=部分成功+1后果 / 1-3=失败+1~2后果 / 双6+=关键成功' },
]

const bonusDice = [
  { name: '协助', desc: '其他玩家角色协助，被协助者+1骰（协助者消耗1点压力）' },
  { name: '超越自我', desc: '+1d 或 +1效果等级，消耗2点压力' },
  { name: '恶魔的交易', desc: '其他玩家或GM提出代价，换取+1骰（最多+2d）' },
]

const teamActions = [
  { name: '协助', cost: '1点压力', desc: '被协助者+1骰。每次行动骰只能接受1位协助，协助者可能承受后果。' },
  { name: '领导集体行动', cost: '每人1点压力', desc: '多人做同一件事，领导者投骰；参与者各+1骰（最多+3d）。领导者失败则所有参与者承受后果。' },
  { name: '准备行动', cost: '通常无', desc: '接下来配合你的角色改善1级处境或提升1级效果。' },
  { name: '保护', cost: '1-2点压力', desc: '队友承受后果时挺身而出，原目标不受后果，保护者承受全部后果。' },
]

const traumas = ['冷漠', '阴影', '痴迷', '偏执', '鲁莽', '软弱', '无常', '恶毒']

const progressTypes = [
  { name: '危机表', desc: '敌人疑心增长、仪式进行', trigger: '危机爆发' },
  { name: '竞速表', desc: '两个对立表同时推进', trigger: '谁先满谁赢' },
  { name: '连锁表', desc: '条件解锁型', trigger: '前置表满后启动' },
  { name: '任务表', desc: '时间窗口倒计时', trigger: '时间到' },
  { name: '威胁表', desc: '精英/著名怪物血量', trigger: '怪物被击败' },
  { name: '长期项目', desc: '军需官大型工程', trigger: '项目完成' },
]

const rolesDetail = [
  { key: 'heavy', icon: '🛡', name: '重装兵', special: '武艺', desc: '保护者/近战斗士。武艺：被视为一支小型队伍，规模优势无效。' },
  { key: 'medic', icon: '💉', name: '医疗兵', special: '医疗', desc: '战地医生。医疗：令一个成员在一个场景内暂时无视伤害惩罚。' },
  { key: 'sniper', icon: '🎯', name: '狙击手', special: '瞄准', desc: '远程杀手。瞄准：每次使用将射击行动效果等级提升1级。' },
  { key: 'officer', icon: '📯', name: '军官', special: '渠道', desc: '领导者/战术家。渠道：通过闪回利用关系获取额外资源。' },
  { key: 'scout', icon: '👁', name: '斥候', special: '求生', desc: '隐蔽先头部队。求生：寻找安全避难所或获得补给。' },
  { key: 'soldier', icon: '⚔', name: '士兵', special: '忍耐', desc: '饱经风霜的老兵。忍耐：一次抵抗骰+2d。' },
  { key: 'rookie', icon: '🎖', name: '新兵', special: '无', desc: '未经考验的新人。存活2次任务晋升为士兵。' },
]

const cultures = [
  { name: '巴尔塔', desc: '军事与战略文化。重视纪律和忠诚。', traits: ['和蔼可亲:+1社交', '信仰虔诚:装备圣骸', '坚韧不拔:技术抵抗+1d', '学识渊博:+1调查'] },
  { name: '潘雅', desc: '神秘与变形文化。与自然和野兽为伴。', traits: ['能工巧匠:修补上限4', '走南闯北:中装快速安静', '精明强干:认知抵抗+1d', '兽性印记:抵抗腐化+2d'] },
  { name: '奥尔', desc: '炼金与工程文化。精于机械和物质变性。', traits: ['出身高贵:战役行动效果+1', '交游广泛:+1动摇', '有仇必报:受伤惩罚时获得效力', '不苟言笑:+1训诫'] },
  { name: '泽姆亚', desc: '强力正面作战文化。直面敌人，不惧疼痛。', traits: ['不惧疼痛:忽略1级伤害惩罚', '无所畏惧:绝望处境抵抗+1d', '忠心耿耿:团队行动+1d', '固执己见:决心抵抗+1d'] },
]

const legionRoles = [
  { key: 'commander', icon: '⚔', name: '指挥官', required: true, desc: '选择任务、决定进军路线、消费情报获得战略优势。' },
  { key: 'marshal', icon: '🛡', name: '军士长', required: true, desc: '部署人员、管理士气（0-10）、投掷遭遇骰。' },
  { key: 'quartermaster', icon: '⚙', name: '军需官', required: true, desc: '物资调配、募兵、休息恢复、长期项目。' },
  { key: 'lorekeeper', icon: '📜', name: '书记官', required: false, desc: '记录编年史与阵亡者、讲述军团故事、设定营地场景。' },
  { key: 'spymaster', icon: '🕸', name: '间谍总管', required: false, desc: '管理间谍网络、派遣短期/长期任务。' },
]

const missionTypes = [
  { name: '突袭', desc: '突击、进攻、制造混乱', bonus: '士气+1，消灭敌人，削弱敌军', penalty: '伤亡，敌人警觉提升，报复' },
  { name: '侦察', desc: '渗透、巡逻、调查', bonus: '情报+1，了解威胁度，发现弱点', penalty: '被发现，遭遇战，情报泄露' },
  { name: '宗教', desc: '朝圣、仪式、净化', bonus: '神选者支持，士气+1，净化腐化', penalty: '亵渎，腐化+，神选者不满' },
  { name: '补给', desc: '拾荒、交易、获取物资', bonus: '食物+，补给+，获得特殊物品', penalty: '物资损失，遭遇伏击，食物污染' },
]

const settlementSteps = [
  { title: '主要任务结算', desc: '存活角色获得任务奖励；死亡角色移除，士气-1/人' },
  { title: '次要任务结算', desc: '用参与者调查骰池投遭遇骰；1-3惩罚 / 4-6奖励' },
  { title: '伤害与压力处理', desc: '勾销伤害；压力满6→创伤+失能；4级伤害→死亡' },
  { title: '士气调整', desc: '阵亡-1 / 士气≥6+1 / 士气≤3-1 / 宗教任务+1 / 突袭+1' },
  { title: '经验点分配', desc: '基础XP=最高敌人威胁度；次要任务专家+2XP；其他条件见经验表' },
  { title: '晋升判定', desc: '新兵存活2次任务→晋升为士兵，获得忍耐+1能力' },
  { title: '进入营地', desc: '按士气水平描述氛围；进行休息和营地活动' },
]

const threatLevels = [
  { level: 1, name: '普通', examples: '腐尸、新兵、普通邪教徒' },
  { level: 2, name: '精英', examples: '暗影女巫、无心者、黑栎骑士、痰尸' },
  { level: 3, name: '怖物', examples: '哀嚎者、奇美拉、杂碎包、余烬卫士' },
  { level: 4, name: '副官', examples: '"博士"、"狼人"比希德、攻城武器' },
  { level: '5+', name: '传说', examples: '破碎者、余烬之王、神选者（最终形态）' },
]

const enemies = [
  { name: '腐尸', threat: 'T1', desc: '最基本的不死者，数量庞大' },
  { name: '痰尸', threat: 'T2', desc: '吐酸性浓液，腐化=威胁度' },
  { name: '暗影女巫', threat: 'T2', desc: '诅咒和精神攻击，威胁表8格' },
  { name: '无心者', threat: 'T2', desc: '不知疲倦的战斗机器' },
  { name: '黑栎骑士', threat: 'T2', desc: '重甲不死骑兵' },
  { name: '杂碎包', threat: 'T3', desc: '膨胀炸弹，被击中爆炸，威胁表10格' },
  { name: '哀嚎者', threat: 'T3', desc: '缝合巨型怪物，4米+' },
  { name: '奇美拉', threat: 'T3', desc: '兽化人怖物，多种动物脑袋' },
  { name: '"博士"', threat: 'T4', desc: '凋零者手下，精于缝制怖物' },
  { name: '"狼人"比希德', threat: 'T4', desc: '兽化人副官' },
  { name: '"发条刺客"卢戈斯', threat: 'T4', desc: '乌鸦副官，护甲免疫黑弹' },
]

const xpTable = [
  { condition: '基础XP', reward: '= 本次最高敌人威胁度' },
  { condition: '高威胁击杀（狙击手威胁度≥2）', reward: '+1 XP' },
  { condition: '危险/绝望处境中行动', reward: '对应属性+1 XP' },
  { condition: '成功协助他人', reward: '+1 XP' },
  { condition: '营地场景有趣扮演（GM判断）', reward: '+1 XP' },
  { condition: '扮演创伤症状制造困难', reward: '+1 XP' },
  { condition: '任务中承受精神创伤', reward: '+1 XP' },
  { condition: '任务中承受3级以上伤害', reward: '+1 XP' },
  { condition: '角色死亡遗赠', reward: '+1 XP（分配给新角色）' },
  { condition: '士气8-10时书记官讲故事', reward: '额外+1 XP' },
  { condition: '新兵晋升为士兵', reward: '+1 XP' },
  { condition: '次要任务（专家参与）', reward: '+2 XP（不论成败）' },
]

const numberCheats = [
  { label: '压力上限', value: '6（幸存者→8→10）' },
  { label: '创伤上限', value: '2（老兵→3→4）' },
  { label: '腐化阈值', value: '7点→枯萎症状' },
  { label: '4级枯萎病', value: '死亡' },
  { label: '4级伤害', value: '死亡' },
  { label: '经验表', value: '6格满→升级' },
  { label: '行动等级上限', value: '3（精英→4）' },
  { label: '威胁表血量', value: 'T2=8格 / T3=10格 / T4=12格' },
  { label: '初始食物', value: '10单位' },
  { label: '战役节数', value: '约12节' },
  { label: '遭遇骰', value: '1-3绝望 / 4-5危险 / 6安全' },
  { label: '奖励骰上限', value: '+2d' },
  { label: '进程表填格', value: '有限1格 / 一般2格 / 极佳3格' },
  { label: '新兵晋升', value: '存活2次任务' },
]
</script>
