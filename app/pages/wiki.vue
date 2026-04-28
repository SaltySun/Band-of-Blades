<template>
  <div class="min-h-screen pb-20">
    <!-- ========== Hero Banner ========== -->
    <div class="relative overflow-hidden">
      <!-- 背景渐变 -->
      <div class="absolute inset-0 bg-gradient-to-b from-field-bg via-[#1a1814] to-field-bg" />
      <!-- 装饰纹理 -->
      <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle at 20% 50%, rgba(201,176,124,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(201,176,124,0.1) 0%, transparent 40%);" />
      <!-- 底部光带 -->
      <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-field-gold/40 to-transparent" />

      <div class="relative max-w-6xl mx-auto px-4 pt-12 pb-10">
        <NuxtLink to="/" class="inline-flex items-center gap-1 text-xs text-field-slate hover:text-field-gold transition-colors mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          返回首页
        </NuxtLink>

        <div class="text-center">
          <div class="inline-block mb-3">
            <div class="px-3 py-1 rounded-full border border-field-gold/30 bg-field-gold/5 text-[10px] text-field-gold tracking-widest uppercase">
              Band of Blades v1.3
            </div>
          </div>
          <h1 class="text-4xl sm:text-5xl font-serif-zh text-field-gold mb-3 tracking-wide">
            规则百科
          </h1>
          <p class="text-sm text-field-slate max-w-lg mx-auto leading-relaxed">
            溃败的雇佣兵团在西方不死者大军的追击下向东撤退。<br>
            掌握规则，在注定失败的撤退中守护人性。
          </p>

          <!-- 搜索框 -->
          <div class="max-w-md mx-auto mt-6 relative">
            <input
              v-model="searchQuery"
              placeholder="搜索规则关键词..."
              class="w-full px-4 py-2.5 pl-10 rounded-lg bg-field-bg/80 border border-field-border text-sm text-field-paper placeholder-field-slate/50 outline-none focus:border-field-gold/50 transition-colors"
            >
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-field-slate/50" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
        </div>
      </div>
    </div>

    <!-- ========== 主体：左侧导航 + 右侧内容 ========== -->
    <div class="max-w-6xl mx-auto px-4 mt-8">
      <!-- 移动端分类切换（在flex容器外，避免挤压main） -->
      <div class="lg:hidden w-full mb-4 overflow-x-auto pb-2">
        <div class="flex gap-2 min-w-max">
          <button
            v-for="cat in categories"
            :key="cat.id"
            class="px-3 py-1.5 rounded-full text-xs border transition-all whitespace-nowrap"
            :class="activeCategory === cat.id
              ? 'border-field-gold bg-field-gold/10 text-field-gold'
              : 'border-field-border text-field-slate'"
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
            <div
              v-for="cat in categories"
              :key="cat.id"
              class="group"
            >
              <button
                class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200"
                :class="activeCategory === cat.id
                  ? 'bg-field-gold/10 text-field-gold border border-field-gold/20'
                  : 'text-field-slate hover:bg-field-bg-light hover:text-field-paper border border-transparent'"
                @click="activeCategory = cat.id"
              >
                <span class="text-base">{{ cat.icon }}</span>
                <span class="font-medium">{{ cat.label }}</span>
                <span class="ml-auto text-[10px] opacity-50">{{ cat.count }}</span>
              </button>

              <!-- 子项 -->
              <div
                v-if="activeCategory === cat.id"
                class="ml-6 mt-1 space-y-0.5 border-l border-field-border/50 pl-3"
              >
                <button
                  v-for="child in cat.children"
                  :key="child"
                  class="block w-full text-left px-2 py-1 text-xs rounded transition-colors text-field-slate hover:text-field-gold"
                  @click="scrollToChild(child)"
                >
                  {{ child }}
                </button>
              </div>
            </div>

            <!-- 装饰 -->
            <div class="pt-4 border-t border-field-border/30">
              <div class="text-[10px] text-field-slate/50 text-center">刀锋连队 · 规则 v1.3</div>
            </div>
          </div>
        </aside>

        <!-- 右侧内容区 -->
        <main class="flex-1 min-w-0">
          <!-- ========== 基础规则 ========== -->
          <div v-if="activeCategory === 'basic'" class="space-y-6">
            <SectionHeader title="基础规则" subtitle="投骰机制、行动与处境" />

            <!-- 骰子结果卡片 -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <ResultCard value="6" label="完全成功" color="gold" />
              <ResultCard value="4-5" label="部分成功" color="amber" />
              <ResultCard value="1-3" label="失败" color="red" />
              <ResultCard value="6+6" label="关键成功" color="gold" glow />
            </div>

            <!-- 骰子类型 -->
            <WikiCard title="五种骰子" icon="🎲">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <DiceTypeCard
                  v-for="d in diceTypes"
                  :key="d.name"
                  :name="d.name"
                  :use="d.use"
                  :when="d.when"
                />
              </div>
            </WikiCard>

            <!-- 11种行动 -->
            <WikiCard title="11种通用行动" icon="⚔">
              <div class="space-y-4">
                <div v-for="attr in actionGroups" :key="attr.name">
                  <div class="flex items-center gap-2 mb-2">
                    <div class="w-1 h-4 rounded-full" :class="attr.color" />
                    <span class="text-xs text-field-gold font-medium">{{ attr.name }}</span>
                  </div>
                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <ActionMiniCard
                      v-for="a in attr.actions"
                      :key="a.key"
                      :icon="a.icon"
                      :name="a.name"
                      :desc="a.desc"
                    />
                  </div>
                </div>
              </div>
            </WikiCard>

            <!-- 处境 -->
            <WikiCard title="处境设定" icon="⚡">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <PositionCard name="安全" desc="压倒性优势" consequence="小麻烦/效果降低" color="green" />
                <PositionCard name="危险" desc="势均力敌（默认）" consequence="伤害/麻烦/处境恶化" color="amber" />
                <PositionCard name="绝望" desc="明显劣势" consequence="重伤/严重麻烦/死亡风险" color="red" xp="对应属性+1经验" />
              </div>
            </WikiCard>

            <!-- 效果等级 -->
            <WikiCard title="效果等级" icon="📊">
              <div class="flex gap-2 text-center text-xs">
                <EffectLevel level="极限" value="4+" color="text-field-gold" />
                <EffectLevel level="极佳" value="3" color="text-field-gold-light" />
                <EffectLevel level="一般" value="2" color="text-field-paper" />
                <EffectLevel level="有限" value="1" color="text-field-slate" />
                <EffectLevel level="无效" value="0" color="text-field-red" />
              </div>
              <p class="text-xs text-field-slate mt-3">
                <span class="text-field-gold">💡</span> 玩家可主动将处境降级（危险→绝望）以换取效果提升（一般→极佳）
              </p>
            </WikiCard>
          </div>

          <!-- ========== 战斗系统 ========== -->
          <div v-if="activeCategory === 'combat'" class="space-y-6">
            <SectionHeader title="战斗系统" subtitle="奖励骰、团队协作与闪回" />

            <WikiCard title="奖励骰来源" icon="➕" subtitle="最多叠加 +2d">
              <div class="space-y-2">
                <BonusCard
                  v-for="b in bonusDice"
                  :key="b.name"
                  :name="b.name"
                  :desc="b.desc"
                />
              </div>
            </WikiCard>

            <WikiCard title="团队协作" icon="🤝">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TeamCard
                  v-for="t in teamActions"
                  :key="t.name"
                  :name="t.name"
                  :cost="t.cost"
                  :desc="t.desc"
                />
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
                <span><span class="text-field-gold">!</span> 闪回仍需投骰</span>
              </div>
            </WikiCard>
          </div>

          <!-- ========== 角色成长 ========== -->
          <div v-if="activeCategory === 'growth'" class="space-y-6">
            <SectionHeader title="角色成长" subtitle="压力、抵抗、伤害与腐化" />

            <!-- 压力 -->
            <WikiCard title="压力与抵抗" icon="🧠">
              <div class="p-3 rounded-lg bg-field-bg border border-field-border mb-3">
                <div class="text-xs text-field-gold font-mono mb-1">抵抗骰机制</div>
                <ol class="space-y-1 text-xs text-field-slate list-decimal list-inside">
                  <li>选择对应属性（认知/技术/决心）投抵抗骰</li>
                  <li>承受 <span class="text-field-gold font-mono">6 - 骰子结果</span> 点精神压力</li>
                </ol>
              </div>
              <div class="grid grid-cols-4 gap-2 text-center text-xs">
                <StressLevel value="0-2" label="正常" color="border-field-border" />
                <StressLevel value="3-4" label="紧张" color="border-field-amber/40" />
                <StressLevel value="5" label="濒临崩溃" color="border-field-gold/40" />
                <StressLevel value="6" label="精神创伤" color="border-field-red/40" textColor="text-field-red" />
              </div>
              <div class="mt-3">
                <div class="text-xs text-field-gold font-medium mb-1.5">8种创伤症状</div>
                <div class="flex flex-wrap gap-1.5">
                  <span
                    v-for="t in traumas"
                    :key="t"
                    class="text-xs px-2.5 py-1 rounded-lg bg-field-bg border border-field-border text-field-slate hover:border-field-gold/30 hover:text-field-gold transition-colors cursor-default"
                  >
                    {{ t }}
                  </span>
                </div>
                <p class="text-xs text-field-slate mt-2">最多2次创伤 = 死亡。扮演创伤可获得经验点。</p>
              </div>
            </WikiCard>

            <!-- 伤害 -->
            <WikiCard title="伤害等级" icon="💀">
              <div class="space-y-2">
                <HarmLevel level="1" name="轻微" effect="轻度妨碍" color="bg-field-border" />
                <HarmLevel level="2" name="中度" effect="明显妨碍" color="bg-field-amber/40" />
                <HarmLevel level="3" name="严重" effect="失能" color="bg-field-gold/40" />
                <HarmLevel level="4" name="致命" effect="死亡" color="bg-field-red/40" />
              </div>
              <p class="text-xs text-field-slate mt-3">行满溢推：2级满→升为3级；3级满→升为4级（死亡）。护甲抵消：普通1格，重甲2格，盾牌1格。</p>
            </WikiCard>

            <!-- 腐化 -->
            <WikiCard title="腐化与枯萎病" icon="☠">
              <div class="p-4 rounded-xl bg-gradient-to-r from-field-red/5 to-transparent border border-field-red/20">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-field-red/10 border border-field-red/30 flex items-center justify-center text-field-red text-lg">☠</div>
                  <div>
                    <div class="text-sm text-field-paper">累计 <span class="text-field-red font-mono">7点腐化</span> → 获得枯萎症状，枯萎病+1级</div>
                    <div class="text-sm text-field-red font-medium mt-0.5">4级枯萎病 = 变成怪物 = 死亡</div>
                  </div>
                </div>
              </div>
              <p class="text-xs text-field-slate mt-2">腐化无法通过一般手段降低。不死者造成的腐化通常等于其威胁度。</p>
            </WikiCard>
          </div>

          <!-- ========== 军团管理 ========== -->
          <div v-if="activeCategory === 'legion'" class="space-y-6">
            <SectionHeader title="军团管理" subtitle="五个指挥层职位" />

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <RoleCard
                v-for="r in legionRoles"
                :key="r.key"
                :icon="r.icon"
                :name="r.name"
                :required="r.required"
                :desc="r.desc"
              />
            </div>
          </div>

          <!-- ========== 任务系统 ========== -->
          <div v-if="activeCategory === 'mission'" class="space-y-6">
            <SectionHeader title="任务系统" subtitle="任务类型与遭遇骰" />

            <WikiCard title="四种任务类型" icon="🗺">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <MissionCard
                  v-for="m in missionTypes"
                  :key="m.name"
                  :name="m.name"
                  :desc="m.desc"
                  :bonus="m.bonus"
                  :penalty="m.penalty"
                />
              </div>
            </WikiCard>

            <WikiCard title="遭遇骰" icon="🎲">
              <div class="text-xs text-field-gold font-mono mb-2">分配因素</div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                <div
                  v-for="f in encounterFactors"
                  :key="f"
                  class="p-2 rounded-lg bg-field-bg border border-field-border text-xs text-field-slate"
                >
                  {{ f }}
                </div>
              </div>
              <div class="grid grid-cols-3 gap-3 text-center">
                <EncounterResult range="1-3" label="绝望处境" color="red" />
                <EncounterResult range="4-5" label="危险处境" color="amber" />
                <EncounterResult range="6" label="安全处境" color="green" />
              </div>
            </WikiCard>
          </div>

          <!-- ========== 速查附录 ========== -->
          <div v-if="activeCategory === 'cheatsheet'" class="space-y-6">
            <SectionHeader title="速查附录" subtitle="经验与其他速查表" />

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
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: '规则百科 · 刀锋联队' })

const searchQuery = ref('')
const activeCategory = ref('basic')

const categories = [
  { id: 'basic', label: '基础规则', icon: '🎲', count: 4, children: ['骰子机制', '11种行动', '处境设定', '效果等级'] },
  { id: 'combat', label: '战斗系统', icon: '⚔', count: 3, children: ['奖励骰', '团队协作', '闪回'] },
  { id: 'growth', label: '角色成长', icon: '🧠', count: 3, children: ['压力与抵抗', '伤害', '腐化'] },
  { id: 'legion', label: '军团管理', icon: '📋', count: 5, children: ['指挥官', '军士长', '军需官', '书记官', '间谍总管'] },
  { id: 'mission', label: '任务系统', icon: '🗺', count: 2, children: ['任务类型', '遭遇骰'] },
  { id: 'cheatsheet', label: '速查附录', icon: '⭐', count: 1, children: ['经验获取'] },
]

function scrollToChild(child: string) {
  // 简化处理：滚动到顶部
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
      { key: 'investigation', icon: '🔍', name: '调查', desc: '观察、搜集信息' },
      { key: 'marksmanship', icon: '🎯', name: '射击', desc: '远程攻击' },
      { key: 'rigging', icon: '🔧', name: '修补', desc: '维修、解除陷阱' },
      { key: 'sway', icon: '🗣', name: '社交', desc: '谈判、说服' },
      { key: 'scout', icon: '👁', name: '侦查', desc: '侦察、潜行' },
      { key: 'discipline', icon: '📢', name: '训诫', desc: '维持纪律' },
    ],
  },
  {
    name: '技术',
    color: 'bg-emerald-500',
    actions: [
      { key: 'skirmish', icon: '⚔', name: '游击', desc: '近战骚扰' },
      { key: 'wreck', icon: '💥', name: '破坏', desc: '摧毁、爆破' },
      { key: 'maneuver', icon: '🏃', name: '机动', desc: '移动、驾驶' },
      { key: 'command', icon: '📯', name: '组织', desc: '指挥调度' },
    ],
  },
  {
    name: '决心',
    color: 'bg-purple-500',
    actions: [
      { key: 'resolve', icon: '🛡', name: '动摇', desc: '抵抗恐惧、坚守' },
    ],
  },
]

const bonusDice = [
  { name: '协助', desc: '其他玩家角色协助，被协助者+1骰' },
  { name: '超越自我', desc: '+1d 或 +1效果等级，消耗2点压力' },
  { name: '恶魔的交易', desc: '其他玩家或GM提出代价，换取+1骰' },
]

const teamActions = [
  { name: '协助', cost: '1点压力', desc: '被协助者+1骰。每次行动骰只能接受1位协助，协助者可能承受后果。' },
  { name: '领导集体行动', cost: '每人1点压力', desc: '多人做同一件事，领导者投骰；参与者各+1骰（最多+3d）。领导者失败则所有参与者承受后果。' },
  { name: '准备行动', cost: '无', desc: '接下来配合你的角色改善1级处境或提升1级效果。' },
  { name: '保护', cost: '1-2点压力', desc: '队友承受后果时挺身而出，原目标不受后果，保护者承受全部后果。' },
]

const traumas = ['冷漠', '阴影', '痴迷', '偏执', '鲁莽', '软弱', '无常', '恶毒']

const legionRoles = [
  { key: 'commander', icon: '⚔', name: '指挥官', required: true, desc: '选择任务、决定进军路线、消费情报获得战略优势。' },
  { key: 'marshal', icon: '🛡', name: '军士长', required: true, desc: '部署人员、管理士气（0-10）、投掷遭遇骰。' },
  { key: 'quartermaster', icon: '⚙', name: '军需官', required: true, desc: '物资调配、募兵、休息恢复、长期项目。' },
  { key: 'lorekeeper', icon: '📜', name: '书记官', required: false, desc: '记录编年史、讲述军团故事、提供叙事框架。' },
  { key: 'spymaster', icon: '🕸', name: '间谍总管', required: false, desc: '管理间谍网络、派遣短期/长期任务。' },
]

const missionTypes = [
  { name: '突袭', desc: '突击、进攻', bonus: '士气+1', penalty: '士气-1（若失败）' },
  { name: '侦察', desc: '渗透、巡逻、调查', bonus: '情报+1', penalty: '无' },
  { name: '宗教', desc: '朝圣、仪式', bonus: '宗教补给+1', penalty: '需要神职人员' },
  { name: '补给', desc: '拾荒、佣兵任务', bonus: '食物+2', penalty: '士气-1（任务乏味）' },
]

const encounterFactors = [
  '忠诚度：已派遣角色的忠诚度总和',
  '情报：指挥官为此次任务消耗的情报数量',
  '老兵：每个老兵/专家角色+1骰',
  '领导力：军士长的纪律或指挥行动等级',
  '参数：任务威胁度与地点难度调整',
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
]
</script>
