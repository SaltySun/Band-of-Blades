<template>
  <div class="max-w-5xl mx-auto animate-fade-in pb-12">
    <!-- 返回 -->
    <div class="mb-4">
      <NuxtLink :to="`/room/${code}`" class="text-sm text-field-paper/70 hover:text-field-gold transition-colors">
        ← 返回房间
      </NuxtLink>
    </div>

    <!-- ===== 任命书头部 ===== -->
    <div class="mb-6 relative">
      <div class="relative border border-field-gold/30 overflow-hidden" style="background: linear-gradient(135deg, #302c26 0%, #252320 100%);">
        <div class="h-1 bg-field-gold/40" />
        <div class="px-6 py-5">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 border border-field-gold/30 flex items-center justify-center shrink-0">
              <span class="text-field-gold text-xl">{{ roleIcon(role) }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3 mb-1 flex-wrap">
                <h1 class="font-brush text-3xl text-field-gold tracking-wider">{{ detail.name }}</h1>
                <span
                  class="text-xs px-2 py-0.5 border font-mono tracking-wider"
                  :class="detail.required ? 'border-field-gold/40 text-field-gold bg-field-gold/10' : 'border-field-slate text-field-paper/70'"
                >
                  {{ detail.required ? '必要职位' : '可选职位' }}
                </span>
              </div>
              <p class="text-xs text-field-gold/70 mb-2 font-mono tracking-wide">{{ detail.tagline }}</p>
              <p class="text-sm text-field-paper/70 leading-relaxed italic border-l-2 border-field-gold/30 pl-3">{{ detail.description }}</p>
            </div>
          </div>
        </div>
        <div class="h-px bg-field-gold/20" />
      </div>
    </div>

    <!-- ===== 主体：两栏布局 ===== -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- 左栏：追踪与记录（5列，军士长占满12列） -->
      <div :class="role === 'marshal' ? 'lg:col-span-12 space-y-6' : 'lg:col-span-5 space-y-6'">

        <!-- ===== 指挥官特有追踪 ===== -->
        <template v-if="role === 'commander'">
          <LegionInfoBlock title="压力追踪" icon="▪">
            <LegionTrackerBar
              :model-value="(legion as any)?.pressure || 0"
              :max="10"
              label="压力"
              description="战役推进与不利事件会增加压力"
              show-value
              @update:model-value="v => updateLegionField('pressure', v)"
            />
          </LegionInfoBlock>

          <LegionInfoBlock title="时间追踪" icon="◈">
            <div class="flex items-center justify-around">
              <LegionProgressClock
                :segments="10"
                :filled="(legion as any)?.summerTime || 0"
                label="夏日之末"
                clickable
                @toggle="v => updateLegionField('summerTime', v)"
              />
              <LegionProgressClock
                :segments="10"
                :filled="(legion as any)?.autumnTime || 0"
                label="深秋已至"
                clickable
                @toggle="v => updateLegionField('autumnTime', v)"
              />
              <LegionProgressClock
                :segments="10"
                :filled="(legion as any)?.winterTime || 0"
                label="凛冬初降"
                clickable
                @toggle="v => updateLegionField('winterTime', v)"
              />
            </div>
          </LegionInfoBlock>

          <LegionInfoBlock title="情报追踪" icon="◈">
            <LegionTrackerBar
              :model-value="(legion as any)?.intel || 0"
              :max="6"
              label="情报"
              show-value
              @update:model-value="v => updateLegionField('intel', v)"
            />
          </LegionInfoBlock>

          <LegionInfoBlock title="地点列表" icon="◆">
            <div class="space-y-2">
              <div v-for="(loc, i) in detail.locations" :key="i" class="flex items-start gap-2 text-xs">
                <span class="text-field-gold mt-0.5 shrink-0">◆</span>
                <div class="min-w-0">
                  <span class="text-field-paper font-medium">{{ loc.name }}</span>
                  <span class="text-field-paper/70 ml-1">— {{ loc.note }}</span>
                </div>
              </div>
            </div>
          </LegionInfoBlock>
        </template>

        <!-- ===== 军士长特有追踪 ===== -->
        <template v-if="role === 'marshal'">
          <LegionInfoBlock title="士气追踪" icon="▪">
            <LegionTrackerBar
              :model-value="(legion as any)?.morale || 0"
              :max="10"
              label="士气"
              description="0-10。低士气会导致叛逃与恐慌"
              show-value
              @update:model-value="v => updateLegionField('morale', v)"
            />
          </LegionInfoBlock>

          <!-- 6战团 三列布局 -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <LegionInfoBlock
              v-for="(squad, i) in marshalSquads"
              :key="i"
              :title="squad.name"
              icon="◈"
            >
              <div class="space-y-2">
                <!-- 战团名（可修改） -->
                <div class="flex items-center gap-2">
                  <span class="text-xs text-field-paper/70 shrink-0">战团名</span>
                  <input
                    v-model="squad.name"
                    class="flex-1 min-w-0 px-2 py-1 bg-field-bg border border-field-border rounded text-sm text-field-paper outline-none focus:border-field-gold"
                    @blur="saveMarshalState"
                  >
                </div>
                <!-- 士兵列表 -->
                <div class="space-y-1">
                  <div
                    v-for="(soldier, si) in squad.soldiers"
                    :key="si"
                    class="py-1.5 border-b border-field-border/20 last:border-0"
                  >
                    <!-- 名字 + 新兵/士兵 + 操作 -->
                    <div class="flex items-center gap-1.5 mb-1">
                      <input
                        v-model="soldier.name"
                        class="flex-1 min-w-0 px-2 py-1 bg-field-bg border border-field-border rounded text-sm text-field-paper outline-none focus:border-field-gold"
                        placeholder="名字"
                        @blur="saveMarshalState"
                      >
                      <button
                        class="text-[10px] px-1.5 py-1 rounded border transition-colors shrink-0"
                        :class="soldier.isSoldier ? 'bg-field-gold/20 border-field-gold text-field-gold' : 'border-field-slate text-field-paper/70 hover:border-field-gold'"
                        :title="soldier.isSoldier ? '士兵' : '新兵'"
                        @click="soldier.isSoldier = !soldier.isSoldier; saveMarshalState()"
                      >
                        {{ soldier.isSoldier ? '兵' : '新' }}
                      </button>
                      <button
                        class="w-5 h-5 border rounded flex items-center justify-center transition-colors shrink-0 text-[10px] text-field-paper/70 hover:text-field-red hover:border-field-red"
                        title="删除"
                        @click="removeSoldier(i, si)"
                      >
                        ✕
                      </button>
                      <button
                        class="w-5 h-5 border rounded flex items-center justify-center transition-colors shrink-0 text-[10px] text-field-paper/70 hover:text-field-red hover:border-field-red hover:bg-field-red/10"
                        title="阵亡"
                        @click="killSoldier(i, si)"
                      >
                        ☠
                      </button>
                    </div>
                    <!-- 受伤 + 压力 -->
                    <div class="flex items-center gap-3">
                      <div class="flex items-center gap-1">
                        <span class="text-[10px] text-field-paper/70">伤</span>
                        <button
                          v-for="ci in 3"
                          :key="ci"
                          class="w-4 h-4 border rounded flex items-center justify-center transition-colors"
                          :class="soldier.wounded >= ci ? 'bg-field-red border-field-red' : 'border-field-slate hover:border-field-red'"
                          @click="toggleSoldierCheck(i, si, 'wounded', ci)"
                        >
                          <span v-if="soldier.wounded >= ci" class="text-field-paper text-[8px]">✕</span>
                        </button>
                      </div>
                      <div class="flex items-center gap-1">
                        <span class="text-[10px] text-field-paper/70">压</span>
                        <button
                          v-for="ci in 3"
                          :key="ci"
                          class="w-4 h-4 border rounded flex items-center justify-center transition-colors"
                          :class="soldier.stress >= ci ? 'bg-field-gold border-field-gold' : 'border-field-slate hover:border-field-gold'"
                          @click="toggleSoldierCheck(i, si, 'stress', ci)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 添加士兵 -->
                <button
                  class="w-full py-1 text-[10px] text-field-paper/70 hover:text-field-gold border border-dashed border-field-border hover:border-field-gold rounded transition-colors"
                  @click="addSoldier(i)"
                >
                  + 添加士兵
                </button>
              </div>
            </LegionInfoBlock>
          </div>

          <LegionInfoBlock title="专家记录表" icon="◈">
            <LegionRecordTable
              v-model:rows="marshalSpecialists"
              :columns="specialistColumns"
              addable
              deletable
              killable
              @update:rows="saveMarshalState"
              @kill-row="onSpecialistKilled"
            />
          </LegionInfoBlock>

          <LegionInfoBlock title="阵亡名单" icon="▪">
            <div v-if="!casualties.length" class="text-xs text-field-paper/70 italic">暂无阵亡记录</div>
            <div v-else class="space-y-2">
              <div
                v-for="(c, ci) in casualties"
                :key="ci"
                class="flex items-center gap-2 py-1.5 border-b border-field-border/30 last:border-0"
              >
                <span class="text-field-paper text-sm font-medium">{{ c.name || '无名氏' }}</span>
                <span class="text-[10px] text-field-paper/70 bg-field-bg-light px-1.5 py-0.5 rounded shrink-0">{{ c.squad }}</span>
                <input
                  v-model="c.note"
                  class="flex-1 min-w-0 px-2 py-1 bg-field-bg border border-field-border rounded text-xs text-field-paper outline-none focus:border-field-gold"
                  placeholder="牺牲经过..."
                  @blur="saveMarshalState"
                >
                <button
                  class="text-[10px] text-field-paper/70 hover:text-field-red px-1.5 py-0.5 rounded border border-field-border hover:border-field-red transition-colors shrink-0"
                  @click="removeCasualty(ci)"
                >
                  移除
                </button>
              </div>
            </div>
          </LegionInfoBlock>

          <!-- 遭遇骰（从右栏移过来） -->
          <template v-if="detail.encounterDice">
            <LegionInfoBlock title="遭遇骰分配" icon="◈">
              <div class="space-y-2 mb-1">
                <div v-for="(p, i) in detail.encounterDice.pool" :key="i" class="flex items-start gap-2 text-xs">
                  <span class="text-field-gold font-mono shrink-0 w-14">{{ p.stat }}</span>
                  <span class="text-field-paper/70">{{ p.desc }}</span>
                </div>
              </div>
            </LegionInfoBlock>
            <LegionInfoBlock title="遭遇骰结果" icon="◆">
              <div class="space-y-2">
                <div v-for="(r, i) in detail.encounterDice.results" :key="i" class="flex items-start gap-2 text-xs">
                  <span class="text-field-gold font-mono shrink-0 w-10">{{ r.range }}</span>
                  <span class="text-field-paper">{{ r.outcome }}</span>
                </div>
              </div>
            </LegionInfoBlock>
          </template>
        </template>

        <!-- ===== 军需官特有追踪 ===== -->
        <template v-if="role === 'quartermaster'">
          <!-- 补给 -->
          <LegionInfoBlock title="补给" icon="▪">
            <div class="flex items-center gap-3">
              <span class="text-xs text-field-paper/70">当前补给</span>
              <input
                :value="(legion as any)?.supplies || 0"
                type="number"
                min="0"
                class="w-16 text-center px-2 py-1 bg-field-bg border border-field-border rounded text-sm text-field-paper outline-none focus:border-field-gold"
                @change="e => updateLegionField('supplies', Number((e.target as HTMLInputElement).value))"
              >
              <span class="text-xs text-field-paper/70">通过任务奖励获得，因惩罚而失去。花费补给增强战役行动</span>
            </div>
          </LegionInfoBlock>

          <!-- 战役行动 -->
          <LegionInfoBlock title="战役行动" icon="◈">
            <div class="text-xs text-field-paper/70 mb-2">每个战役阶段每个行动只能执行一次（获取资源和长期项目可多次，每次花费1份补给）</div>
            <div class="space-y-2">
              <div
                v-for="action in qmCampaignActions"
                :key="action.key"
                class="flex items-center gap-2"
              >
                <button
                  class="w-4 h-4 border rounded flex items-center justify-center transition-colors shrink-0"
                  :class="qmData.campaignActions[action.key] ? 'bg-field-gold border-field-gold' : 'border-field-slate hover:border-field-gold'"
                  @click="toggleQmAction(action.key)"
                >
                  <span v-if="qmData.campaignActions[action.key]" class="text-field-paper text-[10px]">✓</span>
                </button>
                <span class="text-sm text-field-paper font-medium">{{ action.name }}</span>
                <span class="text-xs text-field-paper/70">{{ action.desc }}</span>
              </div>
            </div>
          </LegionInfoBlock>

          <!-- 长期项目 -->
          <LegionInfoBlock title="长期项目" icon="◆">
            <div class="space-y-2">
              <div
                v-for="(proj, i) in qmData.longProjects"
                :key="i"
                class="flex items-center gap-2 py-1.5 border-b border-field-border/30 last:border-0"
              >
                <input
                  v-model="proj.name"
                  class="flex-1 min-w-0 px-2 py-1 bg-field-bg border border-field-border rounded text-sm text-field-paper outline-none focus:border-field-gold"
                  placeholder="项目名称"
                  @blur="saveQmState"
                >
                <div class="flex items-center gap-1">
                  <button
                    v-for="ci in proj.max"
                    :key="ci"
                    class="w-4 h-4 border rounded flex items-center justify-center transition-colors"
                    :class="proj.progress >= ci ? 'bg-field-gold border-field-gold' : 'border-field-slate hover:border-field-gold'"
                    @click="toggleQmProject(i, ci)"
                  />
                </div>
                <button
                  class="w-5 h-5 border rounded flex items-center justify-center text-[10px] text-field-paper/70 hover:text-field-red hover:border-field-red transition-colors shrink-0"
                  @click="removeQmProject(i)"
                >✕</button>
              </div>
            </div>
            <button
              class="w-full mt-2 py-1 text-[10px] text-field-paper/70 hover:text-field-gold border border-dashed border-field-border hover:border-field-gold rounded transition-colors"
              @click="addQmProject"
            >+ 添加长期项目</button>
          </LegionInfoBlock>

          <!-- 编外人员 -->
          <LegionInfoBlock title="编外人员" icon="◆">
            <div class="grid grid-cols-2 gap-4">
              <!-- 慈悲者 -->
              <div>
                <div class="text-xs text-field-gold font-medium mb-2">慈悲者</div>
                <div class="space-y-1.5">
                  <div
                    v-for="(mw, i) in qmData.mercyWorkers"
                    :key="i"
                    class="flex items-center gap-1.5"
                  >
                    <input
                      v-model="mw.name"
                      class="flex-1 min-w-0 px-2 py-1 bg-field-bg border border-field-border rounded text-xs text-field-paper outline-none focus:border-field-gold"
                      placeholder="名字"
                      @blur="saveQmState"
                    >
                    <div class="flex items-center gap-1">
                      <span class="text-[10px] text-field-paper/70">伤</span>
                      <button
                        v-for="ci in 3"
                        :key="ci"
                        class="w-3.5 h-3.5 border rounded flex items-center justify-center transition-colors"
                        :class="mw.wounded >= ci ? 'bg-field-red border-field-red' : 'border-field-slate hover:border-field-red'"
                        @click="toggleQmPersonnel('mercyWorkers', i, 'wounded', ci)"
                      >
                        <span v-if="mw.wounded >= ci" class="text-field-paper text-[7px]">✕</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 炼金术师 -->
              <div>
                <div class="text-xs text-field-gold font-medium mb-2">炼金术师</div>
                <div class="space-y-1.5">
                  <div
                    v-for="(al, i) in qmData.alchemists"
                    :key="i"
                    class="flex items-center gap-1.5"
                  >
                    <input
                      v-model="al.name"
                      class="flex-1 min-w-0 px-2 py-1 bg-field-bg border border-field-border rounded text-xs text-field-paper outline-none focus:border-field-gold"
                      placeholder="名字"
                      @blur="saveQmState"
                    >
                    <div class="flex items-center gap-1">
                      <span class="text-[10px] text-field-paper/70">腐</span>
                      <button
                        v-for="ci in 3"
                        :key="ci"
                        class="w-3.5 h-3.5 border rounded flex items-center justify-center transition-colors"
                        :class="al.corruption >= ci ? 'bg-field-purple border-field-purple' : 'border-field-slate hover:border-field-purple'"
                        @click="toggleQmPersonnel('alchemists', i, 'corruption', ci)"
                      >
                        <span v-if="al.corruption >= ci" class="text-field-paper text-[7px]">✕</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </LegionInfoBlock>

          <!-- 物资 -->
          <LegionInfoBlock title="物资" icon="◈">
            <div class="space-y-4">
              <!-- 食物储备 -->
              <div>
                <div class="text-xs text-field-gold font-medium mb-1.5">食物储备</div>
                <div class="space-y-1">
                  <div
                    v-for="(row, i) in qmData.foodStores"
                    :key="i"
                    class="flex items-center gap-2"
                  >
                    <span class="text-[10px] text-field-paper/70 w-4">{{ i + 1 }}</span>
                    <div class="flex gap-1">
                      <button
                        v-for="ci in 6"
                        :key="ci"
                        class="w-4 h-4 border rounded-full flex items-center justify-center transition-colors"
                        :class="row.used >= ci ? 'bg-field-gold border-field-gold' : 'border-field-slate hover:border-field-gold'"
                        @click="toggleQmResource('foodStores', i, ci)"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <!-- 马匹 / 黑弹 -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <div class="text-xs text-field-gold font-medium mb-1.5">马匹</div>
                  <div class="space-y-1">
                    <div
                      v-for="(row, i) in qmData.horses"
                      :key="i"
                      class="flex items-center gap-2"
                    >
                      <span class="text-[10px] text-field-paper/70 w-4">{{ i + 1 }}</span>
                      <div class="flex gap-1">
                        <button
                          v-for="ci in 3"
                          :key="ci"
                          class="w-4 h-4 border rounded-full flex items-center justify-center transition-colors"
                          :class="row.used >= ci ? 'bg-field-gold border-field-gold' : 'border-field-slate hover:border-field-gold'"
                          @click="toggleQmResource('horses', i, ci)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div class="text-xs text-field-gold font-medium mb-1.5">黑弹</div>
                  <div class="space-y-1">
                    <div
                      v-for="(row, i) in qmData.blackShots"
                      :key="i"
                      class="flex items-center gap-2"
                    >
                      <span class="text-[10px] text-field-paper/70 w-4">{{ i + 1 }}</span>
                      <div class="flex gap-1">
                        <button
                          v-for="ci in 3"
                          :key="ci"
                          class="w-4 h-4 border rounded-full flex items-center justify-center transition-colors"
                          :class="row.used >= ci ? 'bg-field-gold border-field-gold' : 'border-field-slate hover:border-field-gold'"
                          @click="toggleQmResource('blackShots', i, ci)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 宗教补给 -->
              <div>
                <div class="text-xs text-field-gold font-medium mb-1.5">宗教补给</div>
                <div class="space-y-1">
                  <div
                    v-for="(row, i) in qmData.religiousSupplies"
                    :key="i"
                    class="flex items-center gap-2"
                  >
                    <span class="text-[10px] text-field-paper/70 w-4">{{ i + 1 }}</span>
                    <div class="flex gap-1">
                      <button
                        v-for="ci in 3"
                        :key="ci"
                        class="w-4 h-4 border rounded-full flex items-center justify-center transition-colors"
                        :class="row.used >= ci ? 'bg-field-gold border-field-gold' : 'border-field-slate hover:border-field-gold'"
                        @click="toggleQmResource('religiousSupplies', i, ci)"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <!-- 劳工 / 攻城武器 / 补给车 -->
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <div class="text-xs text-field-gold font-medium mb-1.5">劳工</div>
                  <div class="flex gap-1">
                    <button
                      v-for="ci in 3"
                      :key="ci"
                      class="w-5 h-5 border rounded flex items-center justify-center transition-colors"
                      :class="qmData.laborers >= ci ? 'bg-field-gold border-field-gold' : 'border-field-slate hover:border-field-gold'"
                      @click="toggleQmSimple('laborers', ci)"
                    />
                  </div>
                </div>
                <div>
                  <div class="text-xs text-field-gold font-medium mb-1.5">攻城武器</div>
                  <div class="flex gap-1">
                    <button
                      v-for="ci in 3"
                      :key="ci"
                      class="w-5 h-5 border rounded flex items-center justify-center transition-colors"
                      :class="qmData.siegeWeapons >= ci ? 'bg-field-gold border-field-gold' : 'border-field-slate hover:border-field-gold'"
                      @click="toggleQmSimple('siegeWeapons', ci)"
                    />
                  </div>
                </div>
                <div>
                  <div class="text-xs text-field-gold font-medium mb-1.5">补给车</div>
                  <div class="flex gap-1">
                    <button
                      v-for="ci in 3"
                      :key="ci"
                      class="w-5 h-5 border rounded flex items-center justify-center transition-colors"
                      :class="qmData.supplyWagons >= ci ? 'bg-field-gold border-field-gold' : 'border-field-slate hover:border-field-gold'"
                      @click="toggleQmSimple('supplyWagons', ci)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </LegionInfoBlock>
        </template>

        <!-- ===== 书记官特有追踪 ===== -->
        <template v-if="role === 'lorekeeper'">
          <!-- 后续编年史 -->
          <LegionInfoBlock title="后续编年史" icon="📜">
            <div class="text-xs text-field-paper/70 leading-relaxed mb-3 italic border-l-2 border-field-gold/30 pl-3">
              当所有故事都被讲述过，并且又有四个名字被记录在《编年史》中时，你可以讲述任何一个故事——但每个故事只能讲述一次，直到所有类型的故事都再次讲述一遍。
            </div>
            <div class="space-y-1.5">
              <div
                v-for="(entry, i) in lkEntries"
                :key="i"
                class="flex items-center gap-2"
              >
                <span class="text-field-gold text-xs font-mono w-4">{{ i + 1 }}</span>
                <input
                  v-model="entry.name"
                  class="flex-1 min-w-0 px-2 py-1 bg-field-bg border border-field-border rounded text-sm text-field-paper outline-none focus:border-field-gold"
                  placeholder="阵亡者姓名"
                  @blur="saveLorekeeperState"
                >
                <button
                  type="button"
                  class="w-5 h-5 border rounded flex items-center justify-center transition-colors shrink-0 text-[10px] text-field-paper/70 hover:text-field-red hover:border-field-red"
                  @click="removeLkEntry(i)"
                >
                  ✕
                </button>
              </div>
            </div>
            <button
              type="button"
              class="w-full mt-2 py-1 text-[10px] text-field-paper/70 hover:text-field-gold border border-dashed border-field-border hover:border-field-gold rounded transition-colors"
              @click="addLkEntry"
            >
              + 记录阵亡者
            </button>
          </LegionInfoBlock>

          <!-- 编年史故事概览 -->
          <LegionInfoBlock title="编年史故事" icon="◈">
            <div class="text-xs text-field-paper/70 leading-relaxed mb-2">
              当有四个名字被记录在《编年史》中时，下次时间流逝时，在进行战役行动之前，花一点时间讲述一个故事。
            </div>
            <div class="space-y-1">
              <div
                v-for="c in detail.chronicles"
                :key="c.key"
                class="flex items-center justify-between py-1.5 border-b border-field-border/20 last:border-0"
              >
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    class="w-4 h-4 border rounded flex items-center justify-center transition-colors shrink-0"
                    :class="lkState.toldStories[c.key] ? 'bg-field-gold border-field-gold' : 'border-field-slate hover:border-field-gold'"
                    @click="toggleStoryTold(c.key)"
                  >
                    <span v-if="lkState.toldStories[c.key]" class="text-field-paper text-[10px]">✓</span>
                  </button>
                  <span class="text-sm" :class="lkState.toldStories[c.key] ? 'text-field-paper/70 line-through' : 'text-field-paper'">{{ c.title }}</span>
                </div>
                <span class="text-[10px] px-1.5 py-0.5 rounded border" :class="lkState.toldStories[c.key] ? 'border-field-gold/40 text-field-gold bg-field-gold/10' : 'border-field-border text-field-paper/70'">
                  {{ lkState.toldStories[c.key] ? '已讲述' : '未讲述' }}
                </span>
              </div>
            </div>
          </LegionInfoBlock>

          <!-- 阵亡名单（与军士长同步） -->
          <LegionInfoBlock title="阵亡名单" icon="▪">
            <div v-if="!casualties.length" class="text-xs text-field-paper/70 italic">暂无阵亡记录</div>
            <div v-else class="space-y-2">
              <div
                v-for="(c, ci) in casualties"
                :key="ci"
                class="flex items-center gap-2 py-1.5 border-b border-field-border/30 last:border-0"
              >
                <span class="text-field-paper text-sm font-medium">{{ c.name || '无名氏' }}</span>
                <span class="text-[10px] text-field-paper/70 bg-field-bg-light px-1.5 py-0.5 rounded shrink-0">{{ c.squad }}</span>
                <input
                  v-model="c.note"
                  class="flex-1 min-w-0 px-2 py-1 bg-field-bg border border-field-border rounded text-xs text-field-paper outline-none focus:border-field-gold"
                  placeholder="牺牲经过..."
                  @blur="saveMarshalState"
                >
                <button
                  type="button"
                  class="text-[10px] text-field-paper/70 hover:text-field-red px-1.5 py-0.5 rounded border border-field-border hover:border-field-red transition-colors shrink-0"
                  @click="removeCasualty(ci)"
                >
                  移除
                </button>
              </div>
            </div>
            <button
              type="button"
              class="w-full mt-2 py-1 text-[10px] text-field-paper/70 hover:text-field-gold border border-dashed border-field-border hover:border-field-gold rounded transition-colors"
              @click="addCasualty"
            >
              + 添加阵亡记录
            </button>
          </LegionInfoBlock>
        </template>

        <!-- ===== 间谍总管特有追踪 ===== -->
        <template v-if="role === 'spymaster'">
          <LegionInfoBlock title="间谍名册" icon="◈">
            <SpyRoster
              :room-code="code"
              :spies="detail.spies || []"
              :spy-statuses="(legion as any)?.spyStatuses ? JSON.parse((legion as any).spyStatuses) : []"
              @refresh="refreshRoom"
            />
          </LegionInfoBlock>

          <LegionInfoBlock title="长期任务进度" icon="◆">
            <div class="space-y-4">
              <!-- 总述 -->
              <div v-if="detail.spyMissionsLong?.[0]" class="text-xs text-field-paper/70 leading-relaxed pb-3 border-b border-field-border/50">
                <span class="text-field-paper font-medium">{{ detail.spyMissionsLong[0].name }}</span>
                <p class="mt-1">{{ detail.spyMissionsLong[0].effect }}</p>
              </div>
              <!-- 具体任务进度 -->
              <div v-for="(m, i) in detail.spyMissionsLong?.slice(1)" :key="i" class="flex items-start gap-3">
                <div class="flex-1 min-w-0">
                  <div class="text-xs text-field-paper font-medium">{{ m.name }}</div>
                  <div class="text-[10px] text-field-paper/70 leading-relaxed mt-0.5">{{ m.effect }}</div>
                </div>
                <LegionProgressClock
                  :segments="m.segments"
                  :filled="(legion as any)?.[m.fieldKey!] || 0"
                  clickable
                  @toggle="v => updateLegionField(m.fieldKey!, v)"
                />
              </div>
            </div>
          </LegionInfoBlock>
        </template>

        <!-- ===== 军团资源快照（所有角色） ===== -->
        <LegionInfoBlock title="军团资源" icon="◈">
          <div class="grid grid-cols-3 gap-3 text-center">
            <div class="p-2 rounded bg-field-bg border border-field-border">
              <div class="text-xl font-mono text-field-gold">{{ (legion as any)?.morale ?? '-' }}</div>
              <div class="text-[10px] text-field-paper/70 uppercase tracking-wider">士气</div>
            </div>
            <div class="p-2 rounded bg-field-bg border border-field-border">
              <div class="text-xl font-mono text-field-paper">{{ (legion as any)?.intel ?? '-' }}</div>
              <div class="text-[10px] text-field-paper/70 uppercase tracking-wider">情报</div>
            </div>
            <div class="p-2 rounded bg-field-bg border border-field-border">
              <div class="text-xl font-mono text-field-gold-light">{{ (legion as any)?.supplies ?? '-' }}</div>
              <div class="text-[10px] text-field-paper/70 uppercase tracking-wider">补给</div>
            </div>
            <div class="p-2 rounded bg-field-bg border border-field-border">
              <div class="text-xl font-mono text-field-paper">{{ (legion as any)?.food ?? '-' }}</div>
              <div class="text-[10px] text-field-paper/70 uppercase tracking-wider">食物</div>
            </div>
            <div class="p-2 rounded bg-field-bg border border-field-border">
              <div class="text-xl font-mono text-field-red">{{ (legion as any)?.pressure ?? '-' }}</div>
              <div class="text-[10px] text-field-paper/70 uppercase tracking-wider">压力</div>
            </div>
            <div class="p-2 rounded bg-field-bg border border-field-border">
              <div class="text-xl font-mono text-field-gold">
                {{ ((legion as any)?.summerTime || 0) + ((legion as any)?.autumnTime || 0) + ((legion as any)?.winterTime || 0) }}
              </div>
              <div class="text-[10px] text-field-paper/70 uppercase tracking-wider">时间</div>
            </div>
          </div>
        </LegionInfoBlock>

        <!-- 游戏中职责 -->
        <LegionInfoBlock title="游戏中职责" icon="◆">
          <ul class="space-y-2">
            <li v-for="(duty, i) in detail.duties" :key="i" class="flex items-start gap-2 text-sm text-field-paper">
              <span class="text-field-gold mt-0.5 shrink-0">◆</span>
              <span>{{ duty }}</span>
            </li>
          </ul>
        </LegionInfoBlock>
      </div>

      <!-- 右栏：规则与信息（7列） -->
      <div v-if="role !== 'marshal'" class="lg:col-span-7 space-y-6">
        <!-- 战役地图（仅指挥官页面显示） -->
        <template v-if="role === 'commander'">
          <LegionInfoBlock title="战役地图" icon="🗺">
            <MapCanvas :room-code="code" :player-name="currentPlayerName" />
          </LegionInfoBlock>
        </template>

        <!-- 指挥官特有：情报问题 -->
        <template v-if="role === 'commander'">
          <LegionInfoBlock title="情报问题" icon="?" subtitle="按持有情报数量解锁">
            <div v-for="iq in detail.intelQuestions" :key="iq.level" class="mb-4 last:mb-0">
              <div class="text-xs text-field-gold font-mono mb-1.5 border-b border-field-border pb-1">{{ iq.title }}</div>
              <ul class="space-y-1">
                <li v-for="(q, qi) in iq.questions" :key="qi" class="text-xs text-field-paper/70 leading-relaxed flex items-start gap-1.5">
                  <span class="text-field-gold/60 mt-0.5 shrink-0">•</span>
                  <span>{{ q }}</span>
                </li>
              </ul>
            </div>
          </LegionInfoBlock>

          <LegionInfoBlock title="任务类型" icon="◈">
            <div class="overflow-x-auto">
              <table class="w-full text-xs">
                <thead>
                  <tr class="border-b border-field-border">
                    <th class="text-left text-field-gold py-2 pr-3">类型</th>
                    <th class="text-left text-field-gold py-2 pr-3">描述</th>
                    <th class="text-left text-field-gold py-2 pr-3">奖励</th>
                    <th class="text-left text-field-gold py-2">惩罚</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(mt, i) in detail.missionTypes" :key="i" class="border-b border-field-border/50">
                    <td class="py-2 pr-3 text-field-paper font-medium whitespace-nowrap">{{ mt.name }}</td>
                    <td class="py-2 pr-3 text-field-paper/70">{{ mt.desc }}</td>
                    <td class="py-2 pr-3 text-field-gold" v-html="formatRewardPenalty(mt.bonus)"></td>
                    <td class="py-2 text-field-red" v-html="formatRewardPenalty(mt.penalty)"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </LegionInfoBlock>
        </template>

        <!-- 军士长特有：遭遇骰 -->
        <template v-if="role === 'marshal' && detail.encounterDice">
          <LegionInfoBlock title="遭遇骰分配" icon="◈">
            <div class="space-y-2 mb-1">
              <div v-for="(p, i) in detail.encounterDice.pool" :key="i" class="flex items-start gap-2 text-xs">
                <span class="text-field-gold font-mono shrink-0 w-14">{{ p.stat }}</span>
                <span class="text-field-paper/70">{{ p.desc }}</span>
              </div>
            </div>
          </LegionInfoBlock>
          <LegionInfoBlock title="遭遇骰结果" icon="◆">
            <div class="space-y-2">
              <div v-for="(r, i) in detail.encounterDice.results" :key="i" class="flex items-start gap-2 text-xs">
                <span class="text-field-gold font-mono shrink-0 w-10">{{ r.range }}</span>
                <span class="text-field-paper">{{ r.outcome }}</span>
              </div>
            </div>
          </LegionInfoBlock>
        </template>

        <!-- 军需官特有：物资细节与规则 -->
        <template v-if="role === 'quartermaster'">
          <LegionInfoBlock title="物资细节" icon="◈">
            <div class="space-y-3 text-xs text-field-paper/70 leading-relaxed">
              <div>
                <span class="text-field-paper font-medium">黑弹</span>
                <span class="ml-1">— 对不死者的杀伤力。使用次数代表一箱珍贵的弹药。可用于突袭任务遭遇骰+1骰，专家不占用功能栏。</span>
              </div>
              <div>
                <span class="text-field-paper font-medium">食物储备</span>
                <span class="ml-1">— 谷物、干肉、净水、乳酪等。每次使用次数代表一车食物。时间流逝阶段结束时，若食物不足则士气-2。</span>
              </div>
              <div>
                <span class="text-field-paper font-medium">马匹</span>
                <span class="ml-1">— 拉车、供应指挥官和斥候侦察。可用于侦察任务遭遇骰+1骰，或降低压力1点。</span>
              </div>
              <div>
                <span class="text-field-paper font-medium">宗教补给</span>
                <span class="ml-1">— 上古神选者的遗骨和血液，对抗不死者腐败。可用于宗教任务遭遇骰+1骰，为所有专家提供1份普通圣骸。</span>
              </div>
              <div>
                <span class="text-field-paper font-medium">攻城武器</span>
                <span class="ml-1">— 弩车、投石车等，威胁度3。可无视一部分敌人的规模优势。拥有攻城武器可降低守城难度。</span>
              </div>
              <div>
                <span class="text-field-paper font-medium">补给车</span>
                <span class="ml-1">— 运送补给、食物、装备和伤员。每格补给车可让食物储备上限+1次使用。没有补给车时最多携带3份补给。</span>
              </div>
            </div>
          </LegionInfoBlock>

          <LegionInfoBlock title="编外人员规则" icon="◆">
            <div class="space-y-3 text-xs text-field-paper/70 leading-relaxed">
              <div>
                <span class="text-field-paper font-medium">炼金术师</span>
                <span class="ml-1">— 治愈炼金疾病，提供炼金物质。获取资源或长期项目时，按炼金术师人数投骰决定效果。每次使用会受到腐化。</span>
              </div>
              <div>
                <span class="text-field-paper font-medium">劳工</span>
                <span class="ml-1">— 铁匠、工程师、木匠等。每次参与的长期项目额外增加1格进度。只在能参与的项目上发挥作用。</span>
              </div>
              <div>
                <span class="text-field-paper font-medium">慈悲者</span>
                <span class="ml-1">— 治愈女神阿斯莉卡的虔信者。休息与恢复时，可进入负伤状态以给某位军团成员额外勾销伤害行中的一格。</span>
              </div>
            </div>
          </LegionInfoBlock>

          <LegionInfoBlock title="战役行动规则" icon="◈">
            <div class="space-y-3 text-xs text-field-paper/70 leading-relaxed">
              <div>
                <span class="text-field-paper font-medium">获取资源</span>
                <span class="ml-1">— 骰【当地资源等级】个骰子。1-3低劣、4/5标准、6优质、重大成功无与伦比。可花费补给增强投骰结果。</span>
              </div>
              <div>
                <span class="text-field-paper font-medium">放假</span>
                <span class="ml-1">— 成员获得假期，减少最多3点精神压力，士气提升2点。增强可清除全部精神压力，额外提升2点士气（共4点）。</span>
              </div>
              <div>
                <span class="text-field-paper font-medium">长期项目</span>
                <span class="ml-1">— 专家负责领导。1-3一格、4/5两格、6三格、关键成功五格。每次进行的长期项目必须不同。可花费补给增强。</span>
              </div>
              <div>
                <span class="text-field-paper font-medium">募兵</span>
                <span class="ml-1">— 招募回归前线的战士。军士长获得最多5位新兵。由于辅兵和补给限制，暂时无法建立新的小队。增强可将2位新兵替换为士兵。</span>
              </div>
              <div>
                <span class="text-field-paper font-medium">休息与恢复</span>
                <span class="ml-1">— 处理伤口，勾销伤害行中的一格。部署慈悲者可额外勾销一格。增强可让所有军团成员额外勾销伤害行中的一格。</span>
              </div>
            </div>
          </LegionInfoBlock>
        </template>

        <!-- 书记官特有：编年史故事 -->
        <template v-if="role === 'lorekeeper'">
          <!-- 游戏前准备 -->
          <LegionInfoBlock title="游戏前准备" icon="◆">
            <div class="text-xs text-field-paper/70 leading-relaxed mb-3">
              为了为军团的战役做准备，请执行以下步骤：
            </div>
            <div class="space-y-3">
              <div v-for="(step, i) in detail.prepSteps" :key="i" class="flex items-start gap-2">
                <span class="text-field-gold mt-0.5 shrink-0">◆</span>
                <div>
                  <span class="text-sm text-field-paper font-medium">{{ step.title }}</span>
                  <p class="text-xs text-field-paper/70 mt-0.5 leading-relaxed">{{ step.desc }}</p>
                </div>
              </div>
            </div>
          </LegionInfoBlock>

          <!-- 在游戏中你的职责 -->
          <LegionInfoBlock title="在游戏中你的职责" icon="◈">
            <div class="space-y-2">
              <div v-for="(duty, i) in detail.duties" :key="i" class="flex items-start gap-2">
                <span class="text-field-gold mt-0.5 shrink-0">◆</span>
                <span class="text-sm text-field-paper leading-relaxed">{{ duty }}</span>
              </div>
            </div>
          </LegionInfoBlock>

          <!-- 5个编年史故事详情 -->
          <LegionInfoBlock
            v-for="c in detail.chronicles"
            :key="c.key"
            :title="c.title"
            icon="◈"
          >
            <!-- 引言 -->
            <div class="text-xs text-field-gold/80 mb-3 italic leading-relaxed">{{ c.intro }}</div>
            <!-- 引导问题 -->
            <div class="space-y-1.5 mb-3">
              <div v-for="(q, qi) in c.questions" :key="qi" class="flex items-start gap-2 text-xs text-field-paper/70 leading-relaxed">
                <span class="text-field-gold/60 mt-0.5 shrink-0">◆</span>
                <span>{{ q }}</span>
              </div>
            </div>
            <!-- 效果选择 -->
            <div class="text-xs text-field-paper/70 mb-2 font-medium">讲述完毕后，选择以下效果之一：</div>
            <div class="space-y-2">
              <div
                v-for="(eff, ei) in c.effects"
                :key="ei"
                class="flex items-start gap-2 p-2 rounded bg-field-bg border border-field-border/50"
              >
                <span class="text-field-gold mt-0.5 shrink-0">◆</span>
                <div>
                  <span class="text-xs text-field-paper font-medium">{{ eff.label }}</span>
                  <span class="text-xs text-field-paper/70 ml-1">— {{ eff.detail }}</span>
                </div>
              </div>
            </div>
          </LegionInfoBlock>
        </template>

        <!-- 间谍总管特有：间谍网络 -->
        <template v-if="role === 'spymaster'">
          <LegionInfoBlock title="短期任务" icon="◈" subtitle="无风险，不投骰">
            <div class="space-y-1.5">
              <div v-for="(m, i) in detail.spyMissionsShort" :key="i" class="flex items-start gap-2 text-xs">
                <span class="text-field-gold font-mono shrink-0 w-12">{{ m.name }}</span>
                <span class="text-field-paper/70">{{ m.effect }}</span>
              </div>
            </div>
          </LegionInfoBlock>

          <LegionInfoBlock title="间谍网络" icon="◆">
            <SpyNetworkTree
              :room-code="code"
              :unlocked-nodes="(legion as any)?.spyNetworkUnlocked ? JSON.parse((legion as any).spyNetworkUnlocked) : ['间谍网络']"
              @refresh="refreshRoom"
            />
          </LegionInfoBlock>
        </template>

        <!-- 通用表格 -->
        <template v-if="displayTables.length">
          <LegionInfoBlock
            v-for="(t, i) in displayTables"
            :key="`table-${i}`"
            :title="t.title"
          >
            <div class="overflow-x-auto">
              <LegionRecordTable
                :columns="t.columns"
                :rows="t.rows"
              />
            </div>
          </LegionInfoBlock>
        </template>

        <!-- 备注 -->
        <LegionInfoBlock v-if="detail.notes" title="备注" icon="*">
          <ul class="space-y-2">
            <li v-for="(note, i) in detail.notes" :key="i" class="flex items-start gap-2 text-xs text-field-paper/70">
              <span class="text-field-gold mt-0.5 shrink-0">*</span>
              <span>{{ note }}</span>
            </li>
          </ul>
        </LegionInfoBlock>

        <!-- 科技树 -->
        <template v-if="detail.trees">
          <LegionInfoBlock v-for="(tree, i) in detail.trees" :key="`tree-${i}`" :title="tree.title">
            <div class="p-3 rounded bg-field-bg border border-field-border font-mono text-xs text-field-paper/70 leading-relaxed whitespace-pre">
              {{ tree.nodes.join('\n') }}
            </div>
          </LegionInfoBlock>
        </template>

        <!-- 当前担任者 -->
        <LegionInfoBlock v-if="currentHolder" title="当前担任者" icon="◈" title-class="bg-field-gold/10 border-b border-field-gold/30">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-field-gold/10 border border-field-gold/30 flex items-center justify-center text-field-gold text-lg">
              {{ currentHolder.name?.charAt(0) }}
            </div>
            <div>
              <div class="text-field-paper text-sm">{{ currentHolder.name }}</div>
              <div class="text-xs text-field-paper/70">{{ currentHolder.playerName }} · {{ roleLabel(currentHolder.role) }}</div>
            </div>
          </div>
        </LegionInfoBlock>
      </div>
    </div>

    <!-- 放弃职务 -->
    <div v-if="currentHolder" class="mt-6">
      <button
        class="w-full py-2.5 text-sm text-field-red border border-field-red/30 rounded-lg hover:bg-field-red/10 transition-colors"
        @click="resignLegionRole"
      >
        放弃{{ detail.name }}职务
      </button>
    </div>

    <!-- 导航到其他职位 -->
    <div class="mt-6">
      <LegionInfoBlock title="其他军团职务" icon="◈">
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <NuxtLink
            v-for="r in otherRoles"
            :key="r.key"
            :to="`/room/${code}/legion-role/${r.key}`"
            class="p-3 rounded border text-center transition-all hover:border-field-gold/50"
            :class="r.key === role ? 'border-field-gold bg-field-gold/5' : 'border-field-border'"
          >
            <div class="text-field-paper text-sm">{{ r.name }}</div>
            <div class="text-xs text-field-paper/70 mt-1">{{ r.tagline }}</div>
          </NuxtLink>
        </div>
      </LegionInfoBlock>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getLegionRoleDetail, LEGION_ROLES } from '~/composables/useLegionRoleData'
import { getLegionRoleName } from '~~/shared/game-data'
import type { LegionRoleDetail } from '~/composables/useLegionRoleData'
import type { TableColumn } from '~/components/legion/LegionRecordTable.vue'

const { playerName: currentPlayerName } = usePlayerName()

const route = useRoute()
const code = computed(() => (route.params.code as string).toUpperCase())
const role = computed(() => route.params.role as string)

const detail = computed<LegionRoleDetail>(() => {
  const d = getLegionRoleDetail(role.value)
  if (!d) throw createError({ statusCode: 404, statusMessage: '职位不存在' })
  return d
})

// 当前担任者
const { data: roomData, refresh: refreshRoom } = await useFetch(`/api/rooms/${code.value}`)
const legion = computed(() => (roomData.value as any)?.legion)

async function updateLegionField(field: string, value: number) {
  console.log('[role] updateLegionField', field, value)
  try {
    const result = await $fetch(`/api/rooms/${code.value}/legion-state`, {
      method: 'PATCH',
      body: { field, value },
    })
    console.log('[role] update success', result)
    await refreshRoom()
  } catch (e: any) {
    console.error('[role] 更新军团状态失败:', e)
  }
}

const { data: charactersData, refresh: refreshChars } = await useFetch(`/api/rooms/${code.value}/characters`)
const currentHolder = computed(() => {
  const chars = (charactersData.value as any)?.characters || []
  return chars.find((c: any) => c.legionRole === role.value)
})

const { data: logsData, refresh: refreshLogs } = await useFetch(`/api/rooms/${code.value}/legion-logs?role=${role.value}`)
const logs = computed(() => (logsData.value as any)?.logs || [])

// 其他职位导航
const otherRoles = computed(() => {
  return LEGION_ROLES.map(r => ({
    key: r.key,
    name: r.name,
    tagline: r.desc.slice(0, 12) + (r.desc.length > 12 ? '…' : ''),
  }))
})

// 表格转换
const displayTables = computed(() => {
  return (detail.value.tables || []).map(t => ({
    title: t.title,
    columns: t.headers.map(h => ({ key: h, label: h, type: 'display' as const })),
    rows: t.rows.map(r => {
      const obj: Record<string, any> = {}
      t.headers.forEach((h, i) => { obj[h] = r[i] ?? '' })
      return obj
    }),
  }))
})

// 军士长：从 marshalState 读取数据
const marshalStateRaw = computed(() => {
  const raw = (legion.value as any)?.marshalState
  if (raw) {
    try { return JSON.parse(raw) } catch { /* ignore */ }
  }
  return null
})

// 士兵
interface MarshalSoldier {
  name: string
  wounded: number
  stress: number
  isSoldier: boolean
}

// 小队数据
interface MarshalSquad {
  name: string
  soldiers: MarshalSoldier[]
}

const defaultSquads: MarshalSquad[] = [
  { name: '冷笑渡鸦', soldiers: Array.from({ length: 5 }, () => ({ name: '', wounded: 0, stress: 0, isSoldier: false })) },
  { name: '星辰毒蛇', soldiers: Array.from({ length: 5 }, () => ({ name: '', wounded: 0, stress: 0, isSoldier: false })) },
  { name: '白银牡鹿', soldiers: Array.from({ length: 5 }, () => ({ name: '', wounded: 0, stress: 0, isSoldier: false })) },
  { name: '幽灵夜枭', soldiers: Array.from({ length: 5 }, () => ({ name: '', wounded: 0, stress: 0, isSoldier: false })) },
  { name: '琥珀野狼', soldiers: Array.from({ length: 5 }, () => ({ name: '', wounded: 0, stress: 0, isSoldier: false })) },
  { name: '破碎雄狮', soldiers: Array.from({ length: 5 }, () => ({ name: '', wounded: 0, stress: 0, isSoldier: false })) },
]

const marshalSquads = ref<MarshalSquad[]>(
  marshalStateRaw.value?.squads || defaultSquads
)

// 专家数据
interface MarshalSpecialist {
  role: string
  name: string
  stress: number
  wounded: number
  ability: string
  action: string
}

const defaultSpecialists: MarshalSpecialist[] = [
  { role: '重装兵', name: '', stress: 0, wounded: 0, ability: '', action: '' },
  { role: '医疗兵', name: '', stress: 0, wounded: 0, ability: '', action: '' },
  { role: '军官', name: '', stress: 0, wounded: 0, ability: '', action: '' },
  { role: '斥候', name: '', stress: 0, wounded: 0, ability: '', action: '' },
  { role: '狙击手', name: '', stress: 0, wounded: 0, ability: '', action: '' },
  { role: '新兵', name: '', stress: 0, wounded: 0, ability: '', action: '' },
  { role: '士兵', name: '', stress: 0, wounded: 0, ability: '', action: '' },
]

const marshalSpecialists = ref<MarshalSpecialist[]>(
  marshalStateRaw.value?.specialists || defaultSpecialists
)

// 阵亡名单
interface Casualty {
  name: string
  squad: string
  note: string
}

const casualties = ref<Casualty[]>(
  marshalStateRaw.value?.casualties || []
)

// 监听 marshalState 变化（首次加载或刷新后同步）
watch(marshalStateRaw, (raw) => {
  if (raw?.squads) marshalSquads.value = raw.squads
  if (raw?.specialists) marshalSpecialists.value = raw.specialists
  if (raw?.casualties) casualties.value = raw.casualties
}, { immediate: true })

function toggleSoldierCheck(squadIndex: number, soldierIndex: number, key: 'wounded' | 'stress', ci: number) {
  const squad = marshalSquads.value[squadIndex]
  const soldier = squad?.soldiers[soldierIndex]
  if (!squad || !soldier) return
  soldier[key] = soldier[key] >= ci ? ci - 1 : ci
  saveMarshalState()
}

function addSoldier(squadIndex: number) {
  const squad = marshalSquads.value[squadIndex]
  if (!squad) return
  squad.soldiers.push({ name: '', wounded: 0, stress: 0, isSoldier: false })
  saveMarshalState()
}

function removeSoldier(squadIndex: number, soldierIndex: number) {
  const squad = marshalSquads.value[squadIndex]
  if (!squad) return
  squad.soldiers.splice(soldierIndex, 1)
  saveMarshalState()
}

function killSoldier(squadIndex: number, soldierIndex: number) {
  const squad = marshalSquads.value[squadIndex]
  if (!squad) return
  const soldier = squad.soldiers[soldierIndex]
  if (!soldier) return
  casualties.value.push({
    name: soldier.name || '无名氏',
    squad: squad.name,
    note: '',
  })
  squad.soldiers.splice(soldierIndex, 1)
  saveMarshalState()
}

function removeCasualty(index: number) {
  casualties.value.splice(index, 1)
  saveMarshalState()
}

function addCasualty() {
  casualties.value.push({ name: '', squad: '', note: '' })
  saveMarshalState()
}

async function saveMarshalState() {
  try {
    await $fetch(`/api/rooms/${code.value}/marshal-state`, {
      method: 'PATCH',
      body: {
        squads: marshalSquads.value,
        specialists: marshalSpecialists.value,
        casualties: casualties.value,
      },
    })
    await refreshRoom()
  } catch (e: any) {
    console.error('保存军士长状态失败:', e)
  }
}

// 军士长：专家记录表列
const specialistColumns: TableColumn[] = [
  { key: 'role', label: '职位', type: 'select', width: '80px', options: ['重装兵', '医疗兵', '军官', '斥候', '狙击手', '新兵', '士兵'] },
  { key: 'name', label: '名字', type: 'text', width: '0.75fr' },
  { key: 'wounded', label: '受伤', type: 'checkbox', width: '60px', checkboxCount: 3 },
  { key: 'stress', label: '压力', type: 'number', width: '50px', min: 0, max: 10 },
  { key: 'ability', label: '能力', type: 'text', width: '1fr' },
  { key: 'action', label: '行动', type: 'text', width: '1fr' },
]

function onSpecialistKilled(index: number, row: Record<string, any>) {
  casualties.value.push({
    name: row.name || '无名氏',
    squad: row.role || '专家',
    note: '',
  })
  saveMarshalState()
}

// 军需官：从 quartermasterState 读取数据
const qmStateRaw = computed(() => {
  const raw = (legion.value as any)?.quartermasterState
  if (raw) {
    try { return JSON.parse(raw) } catch { /* ignore */ }
  }
  return null
})

interface QmCampaignActions {
  getResources: boolean
  leave: boolean
  longProject: boolean
  recruit: boolean
  restRecover: boolean
}

interface QmLongProject {
  name: string
  progress: number
  max: number
}

interface QmPersonnel {
  name: string
  wounded: number
}

interface QmAlchemist {
  name: string
  corruption: number
}

interface QmResourceRow {
  used: number
}

interface QuartermasterState {
  campaignActions: QmCampaignActions
  longProjects: QmLongProject[]
  mercyWorkers: QmPersonnel[]
  alchemists: QmAlchemist[]
  foodStores: QmResourceRow[]
  horses: QmResourceRow[]
  blackShots: QmResourceRow[]
  religiousSupplies: QmResourceRow[]
  laborers: number
  siegeWeapons: number
  supplyWagons: number
}

const defaultQmState: QuartermasterState = {
  campaignActions: {
    getResources: false,
    leave: false,
    longProject: false,
    recruit: false,
    restRecover: false,
  },
  longProjects: [],
  mercyWorkers: [
    { name: '', wounded: 0 },
    { name: '', wounded: 0 },
    { name: '', wounded: 0 },
  ],
  alchemists: [
    { name: '', corruption: 0 },
    { name: '', corruption: 0 },
    { name: '', corruption: 0 },
  ],
  foodStores: [{ used: 0 }, { used: 0 }, { used: 0 }],
  horses: [{ used: 0 }, { used: 0 }, { used: 0 }],
  blackShots: [{ used: 0 }, { used: 0 }, { used: 0 }],
  religiousSupplies: [{ used: 0 }, { used: 0 }],
  laborers: 0,
  siegeWeapons: 0,
  supplyWagons: 0,
}

const qmData = ref<QuartermasterState>({ ...defaultQmState })

watch(qmStateRaw, (raw) => {
  if (raw) {
    qmData.value = {
      ...defaultQmState,
      ...raw,
      campaignActions: { ...defaultQmState.campaignActions, ...raw.campaignActions },
      mercyWorkers: raw.mercyWorkers || defaultQmState.mercyWorkers,
      alchemists: raw.alchemists || defaultQmState.alchemists,
      foodStores: raw.foodStores || defaultQmState.foodStores,
      horses: raw.horses || defaultQmState.horses,
      blackShots: raw.blackShots || defaultQmState.blackShots,
      religiousSupplies: raw.religiousSupplies || defaultQmState.religiousSupplies,
    }
  }
}, { immediate: true })

const qmCampaignActions = [
  { key: 'getResources' as const, name: '获取资源', desc: '骰当地资源等级获得物资' },
  { key: 'leave' as const, name: '放假', desc: '休整恢复士气，勾销伤害' },
  { key: 'longProject' as const, name: '长期项目', desc: '推进大型工程进程表' },
  { key: 'recruit' as const, name: '募兵', desc: '招募新兵补充伤亡' },
  { key: 'restRecover' as const, name: '休息与恢复', desc: '处理伤口，勾销伤害' },
]

function toggleQmAction(key: keyof QmCampaignActions) {
  qmData.value.campaignActions[key] = !qmData.value.campaignActions[key]
  saveQmState()
}

function addQmProject() {
  qmData.value.longProjects.push({ name: '', progress: 0, max: 8 })
  saveQmState()
}

function removeQmProject(index: number) {
  qmData.value.longProjects.splice(index, 1)
  saveQmState()
}

function toggleQmProject(index: number, ci: number) {
  const proj = qmData.value.longProjects[index]
  if (!proj) return
  proj.progress = proj.progress >= ci ? ci - 1 : ci
  saveQmState()
}

function toggleQmPersonnel(
  category: 'mercyWorkers' | 'alchemists',
  index: number,
  key: 'wounded' | 'corruption',
  ci: number,
) {
  const person = qmData.value[category][index]
  if (!person) return
  person[key] = person[key] >= ci ? ci - 1 : ci
  saveQmState()
}

function toggleQmResource(
  category: 'foodStores' | 'horses' | 'blackShots' | 'religiousSupplies',
  index: number,
  ci: number,
) {
  const row = qmData.value[category][index]
  if (!row) return
  row.used = row.used >= ci ? ci - 1 : ci
  saveQmState()
}

function toggleQmSimple(key: 'laborers' | 'siegeWeapons' | 'supplyWagons', ci: number) {
  qmData.value[key] = qmData.value[key] >= ci ? ci - 1 : ci
  saveQmState()
}

async function saveQmState() {
  try {
    await $fetch(`/api/rooms/${code.value}/quartermaster-state`, {
      method: 'PATCH',
      body: { quartermasterState: qmData.value },
    })
    await refreshRoom()
  } catch (e: any) {
    console.error('保存军需官状态失败:', e)
  }
}

// ========== 书记官状态 ==========
const lkStateRaw = computed(() => {
  const raw = (legion.value as any)?.lorekeeperState
  if (raw) {
    try { return JSON.parse(raw) } catch { /* ignore */ }
  }
  return null
})

interface LkEntry {
  name: string
}

interface LorekeeperState {
  entries: LkEntry[]
  toldStories: Record<string, boolean>
}

const defaultLkState: LorekeeperState = {
  entries: [],
  toldStories: {},
}

const lkState = ref<LorekeeperState>({ ...defaultLkState })

watch(lkStateRaw, (raw) => {
  if (raw) {
    lkState.value = {
      entries: raw.entries || [],
      toldStories: raw.toldStories || {},
    }
  }
}, { immediate: true })

const lkEntries = computed({
  get: () => lkState.value.entries,
  set: (v) => { lkState.value.entries = v },
})

function addLkEntry() {
  lkState.value.entries.push({ name: '' })
  saveLorekeeperState()
}

function removeLkEntry(index: number) {
  lkState.value.entries.splice(index, 1)
  saveLorekeeperState()
}

function toggleStoryTold(key: string) {
  lkState.value.toldStories[key] = !lkState.value.toldStories[key]
  saveLorekeeperState()
}

async function saveLorekeeperState() {
  try {
    await $fetch(`/api/rooms/${code.value}/lorekeeper-state`, {
      method: 'PATCH',
      body: { lorekeeperState: lkState.value },
    })
    await refreshRoom()
  } catch (e: any) {
    console.error('保存书记官状态失败:', e)
  }
}

function roleIcon(roleKey: string): string {
  const map: Record<string, string> = {
    commander: '⚔',
    marshal: '🛡',
    quartermaster: '⚙',
    lorekeeper: '📜',
    spymaster: '🕸',
  }
  return map[roleKey] || '◆'
}

function roleLabel(roleKey: string): string {
  const map: Record<string, string> = {
    heavy: '重装兵', medic: '医疗兵', sniper: '狙击手',
    officer: '军官', scout: '斥候', soldier: '士兵', rookie: '新兵',
  }
  return map[roleKey] || roleKey
}

function formatRewardPenalty(text: string): string {
  return text.split('、').map(part => {
    const trimmed = part.trim()
    if (trimmed.includes('（一定）')) {
      return `<span class="font-bold">${trimmed.replace('（一定）', '')}</span>`
    }
    return trimmed
  }).join('、')
}

function formatRoleName(actor: string): string {
  return getLegionRoleName(actor) || actor
}

async function resignLegionRole() {
  if (!confirm(`确定要放弃「${detail.value.name}」职务吗？`)) return
  try {
    await $fetch(`/api/rooms/${code.value}/resign-legion-role`, {
      method: 'POST',
      body: { role: role.value },
    })
    await refreshRoom()
    await refreshChars()
  } catch (e: any) {
    console.error('放弃职务失败:', e)
    alert(e.data?.statusMessage || '放弃职务失败')
  }
}

function formatTime(ts: string | Date | null): string {
  if (!ts) return ''
  const d = new Date(ts)
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}
</script>
