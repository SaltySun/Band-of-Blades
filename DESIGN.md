# 刀锋联队战役网站 — 设计方案 v1.0

> **项目定位**：刀锋连队 (Band of Blades) 跑团辅助工具站  
> **目标用户**：中文TRPG玩家（GM + 玩家）  
> **核心场景**：线上/线下主持刀锋连队战役时的规则查阅、角色管理、战役追踪、实时判定辅助  
> **设计基调**：黑暗军事奇幻 —— "一本在撤退途中被雨水浸透、被血渍弄脏的军团作战手册"

---

## 一、视觉设计方向

### 核心概念：战地档案

界面不是"现代Web应用"，而是一本**被反复翻阅的军事档案**。

- **背景**：深炭色（#1a1816）为主，不是纯黑。带有极淡的纸质噪点纹理，暗示这是一本旧手册的扫描件。
- **文字**：主体内容使用衬线体（思源宋体/Noto Serif SC），营造正式档案感；UI控件和标签使用等宽或窄体无衬线（JetBrains Mono / 方正兰亭黑），营造军事编号感。
- **强调色**：暗红（#8b2e2e）—— 代表鲜血与牺牲，用于关键数字、警告、死亡标记。暗金（#b8956a）—— 代表神选者的神圣性，用于成功、解锁、神选者相关内容。
- **辅助色**：泥灰（#8a8279）—— 用于次要文字和边框；霉绿（#5a6352）—— 用于腐化/枯萎相关标记。
- **排版**：
  - 标题使用大字号衬线体 + 轻微 letter-spacing，模拟战报标题
  - 数据使用等宽字体对齐，模拟表格档案
  - 避免卡片网格 —— 用"档案页"分隔不同区域，区域间用细线分隔而非阴影卡片
  - 左对齐为主，避免居中对齐的"模板感"
- **装饰元素**：
  - 页面角落有随机的"污渍"和"折痕"效果（CSS背景图，低透明度）
  - 重要字段有"手写批注"风格的标注（使用手写字体，红色）
  - 完成的事项有"已盖章"效果（圆形印章图案）
- **动效**：克制。页面切换有轻微的"纸张翻动"感（opacity + translateX），数字变化有"打字机滚轮"感。不要悬浮发光、不要弹性动画。

### 设计禁忌（避免AI slop）

- ❌ 不使用紫色-蓝色渐变
- ❌ 不使用玻璃拟态（glassmorphism）
- ❌ 不使用圆角大卡片网格
- ❌ 不使用霓虹发光边框
- ❌ 不使用居中的大数字指标（hero metrics）
- ❌ 不使用渐变色文字

---

## 二、功能架构

```
┌─────────────────────────────────────────────────────────────┐
│                     导航栏（固定顶部）                         │
│  [刀锋联队logo]  规则Wiki | 角色卡 | GM控制台 | 编年史 | 速查  │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────┬───────┴───────┬─────────────┐
        ▼             ▼               ▼             ▼
   ┌─────────┐  ┌─────────┐   ┌─────────────┐  ┌─────────┐
   │ 规则Wiki │  │ 角色卡  │   │  GM控制台   │  │  编年史  │
   │ (知识库) │  │(角色管理)│   │  (战役运行)  │  │(记录回顾)│
   └─────────┘  └─────────┘   └─────────────┘  └─────────┘
        │             │               │             │
        ▼             ▼               ▼             ▼
   ┌─────────┐  ┌─────────┐   ┌─────────────┐  ┌─────────┐
   │三层文档  │  │创建角色  │   │ 军团状态板   │  │任务日志  │
   │快速查阅  │  │编辑角色  │   │ 任务部署    │  │伤亡名单  │
   │关键词搜索│  │角色名册  │   │ 实时判定    │  │编年史故事│
   └─────────┘  └─────────┘   │ 结算辅助    │  └─────────┘
                                └─────────────┘
```

---

## 三、页面结构与路由

### 3.1 全局布局

```
app.vue
├── layouts/
│   └── default.vue          ← 战地档案主题布局（深色背景+纸质纹理+导航栏）
├── components/
│   ├── AppHeader.vue        ← 顶部导航（logo + 主菜单 + 数据导出/导入按钮）
│   ├── AppFooter.vue        ← 底部（版本号 + GitHub链接）
│   ├── DiceRoller.vue       ← 全局悬浮骰子投骰器（可收缩的小组件）
│   └── ArchiveStamp.vue     ← "已盖章"装饰组件
└── pages/
```

### 3.2 路由设计

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | 军团当前状态概览（如果无存档则显示引导） |
| `/wiki` | 规则Wiki首页 | 三层文档库的网页化入口 |
| `/wiki/[...slug]` | 规则详情页 | 动态路由，对应L2/L3的markdown文件 |
| `/chars` | 角色名册 | 所有角色的列表视图 |
| `/chars/new` | 创建角色 | 交互式角色创建向导 |
| `/chars/[id]` | 角色详情 | 单个角色的完整角色卡 |
| `/gm` | GM控制台 | 战役运行主面板 |
| `/gm/mission` | 任务阶段 | 主要/次要任务部署与执行 |
| `/gm/campaign` | 战役阶段 | 各职位行动、休息、结算 |
| `/chronicle` | 编年史 | 战役记录、故事、伤亡名单 |
| `/quickref` | 速查面板 | 数字速查表+骰子投骰器 |

---

## 四、数据模型设计

### 4.1 核心实体

```typescript
// 角色
interface Character {
  id: string
  name: string
  type: 'rookie' | 'soldier' | 'specialist'
  class?: 'heavy' | 'medic' | 'officer' | 'scout' | 'sniper'
  threat: number        // 威胁度 1-2
  actions: Record<ActionType, { level: number; xp: number }>
  stress: number        // 当前压力 0-6+
  stressMax: number     // 6 / 8 / 10
  traumaCount: number   // 已承受创伤次数
  traumaMax: number     // 2 / 3 / 4
  traumaSymptom?: string
  harm: HarmState
  corruption: number    // 累计腐化
  rotLevel: number      // 枯萎病等级 0-4
  rotSymptoms: string[]
  specialAction?: { name: string; level: number; usesRemaining: number }
  abilities: string[]
  load: 'light' | 'medium' | 'heavy'
  items: string[]
  missionsSurvived: number
  isAlive: boolean
  isRetired: boolean
  notes: string         // 玩家备注
  createdAt: string
}

// 军团状态
interface LegionState {
  time: number           // 时间进度（战役节数）
  pressure: number       // 战役压力
  morale: number         // 士气 0-10
  food: number           // 食物存量
  supply: number         // 补给存量
  intel: number         // 情报数量
  chosenOne: 'shreya' | 'horned_one' | 'zora' | null
  brokenOnes: string[]   // 选中的两位破碎者
  location: string       // 当前地点
  nextLocation: string   // 下一个目标地点
  spyNetwork: {
    spies: Spy[]
    unlockedNodes: string[]
  }
  chronicles: ChronicleEntry[]
  longProjects: ProgressClock[]
  missionLog: MissionRecord[]
}

// 部署记录
interface Deployment {
  cycle: number           // 第几节
  mainMission: Mission
  sideMission: Mission
  mainChars: string[]     // char IDs
  sideChars: string[]     // char IDs
  encounterRoll: number   // 遭遇骰结果
  situation: 'safe' | 'risky' | 'desperate'
  mainResult?: 'success' | 'partial' | 'failure'
  sideResult?: number     // 次要任务骰值 1-6
  xpLog: XPRecord[]
  casualties: string[]    // 死亡角色ID
}

// 进程表（通用）
interface ProgressClock {
  id: string
  name: string
  type: 'crisis' | 'race' | 'chain' | 'mission' | 'threat' | 'project'
  totalSegments: number   // 总格数
  filledSegments: number  // 已填格数
  color: string           // 显示颜色
}

// 编年史条目
interface ChronicleEntry {
  id: string
  type: 'founding' | 'independence' | 'trial' | 'perseverance' | 'purpose'
  title: string
  content: string
  toldBy: string         // 书记官角色名
  cycle: number
  xpAwarded: boolean
}
```

### 4.2 存储方案

```
浏览器 localStorage（主存储）
├── blades-chars        → Character[]
├── blades-legion       → LegionState
├── blades-deployments  → Deployment[]
├── blades-clocks       → ProgressClock[]
├── blades-ui-state     → 用户界面偏好（主题、折叠状态等）
└── blades-backup-timestamp → 最后备份时间
```

**数据持久化策略**：
1. 所有数据实时写入 localStorage（防抖 500ms）
2. 提供「导出军团档案」功能 → 生成 JSON 文件下载
3. 提供「导入军团档案」功能 → 读取 JSON 恢复全部状态
4. 每次重大操作（结算完成、角色死亡）自动触发导出提示
5. 可选：未来接入服务端同步（Supabase/Firebase）

---

## 五、各模块详细设计

### 5.1 规则Wiki模块

**目标**：把 `docs/` 下的三层文档库做成可浏览、可搜索的网页。

**技术方案**：
- 构建时将 `docs/L2_Structured/` 和 `docs/L3_QuickRef/` 的 markdown 文件编译为静态页面（使用 `@nuxt/content` 或自定义 vite 插件）
- 提供全文搜索（前端 MiniSearch）
- 页面内锚点导航（右侧目录）

**页面结构**：
```
┌──────────────────────────────────────────┐
│ [搜索框]              [L1][L2][L3] 层级切换 │
├──────────────────────────────────────────┤
│ 左侧目录树 │         正文区域           │
│           │                             │
│ - 核心机制 │  (渲染后的 markdown)       │
│ - 角色系统 │                             │
│ - 特种士兵 │                             │
│ ...       │                             │
│           │                             │
└──────────────────────────────────────────┘
```

**交互**：
- 搜索框实时搜索，高亮匹配关键词
- 表格悬停时行高亮（等宽字体对齐）
- 关键数字（伤害阈值、XP数值）用暗红色等宽字体突出
- 支持「速查模式」：只显示L3卡片内容，隐藏详细解释

### 5.2 角色卡模块

**目标**：交互式角色创建、编辑、查看。

**创建角色流程（向导式）**：
```
Step 1: 选择类型（新兵/士兵/专家）
Step 2: 专家选择职业（6选1）
Step 3: 分配初始行动等级（拖拽/点击）
Step 4: 选择能力（根据类型数量限制）
Step 5: 选择装备和负载
Step 6: 命名和背景
```

**角色卡详情页布局**：
```
┌──────────────────────────────────────────┐
│ [角色名] [类型标签] [威胁度] [状态:存活]    │
├──────────────────────────────────────────┤
│ 左侧: 行动等级表 │ 右侧: 状态追踪          │
│ ┌─────────────┐ │ ┌─────────────┐       │
│ │ 调查 ■□□□□   │ │ 压力: [0 1 2 3 4 5 6] │
│ │ 射击 ■■□□□   │ │ 创伤: [症状名称]      │
│ │ ...         │ │ 腐化: [0 1 2...]      │
│ │             │ │ 枯萎: 等级0            │
│ │ 经验表: ■■■□ │ │                      │
│ └─────────────┘ │ └─────────────┘       │
│                  │ 伤害追踪 (4行格子)      │
│ 下方: 能力列表    │ 装备清单               │
│ 特种行动使用次数  │ 任务存活计数           │
└──────────────────────────────────────────┘
```

**交互细节**：
- 行动等级用「填满的格子」可视化（■=已提升，□=未提升）
- 经验表用进度条表示
- 压力/腐化用横向刻度表示，达到阈值时变色（6=红色闪烁）
- 伤害追踪用4行垂直格子，每行填满时自动向上溢推（视觉动画）
- 创伤症状选择用下拉菜单（8种症状）
- 死亡角色灰度显示，姓名上划横线

### 5.3 GM控制台模块

**目标**：战役运行时的一站式控制台。

**主面板布局**：
```
┌──────────────────────────────────────────┐
│ 军团状态条: 士气[████░░░░░░] 食物[██████░░░░] │
│ 时间: 第3节 │ 地点: 灰烬沼泽 │ 压力: 2      │
├──────────────────────────────────────────┤
│ 左侧面板(1/3)      │ 右侧面板(2/3)        │
│                    │                      │
│ [角色名册]          │ [当前阶段]           │
│ 可拖拽到部署区      │ 战役阶段/任务阶段     │
│                    │                      │
│ [进程表列表]        │ [判定辅助工具]        │
│ 危机表 ██████░░░░   │ 六步法向导           │
│ 威胁表 ████░░░░░░   │ 投骰器               │
│                    │ 效果计算器           │
│ [快速操作]          │                      │
│ +XP / +伤害 / +压力 │ [日志记录区]          │
│ 一键结算           │ 自动记录每次判定       │
└──────────────────────────────────────────┘
```

**六步法判定向导（核心交互）**：
```
┌──────────────────────────────────────────┐
│ Step 1/6: 玩家宣布目标                    │
│ [输入框: 玩家要做什么？]                   │
│                                          │
│ [下一步] → Step 2: 选择行动类型           │
│            [调查][射击][游击][组织]...    │
│                                          │
│ [下一步] → Step 3: 设定处境              │
│            [安全] [危险●] [绝望]          │
│                                          │
│ [下一步] → Step 4: 设定效果等级          │
│            [无效][有限][一般●][极佳][极限]│
│                                          │
│ [下一步] → Step 5: 奖励骰               │
│            ☑协助(+1d) ☑超越自我(+1d)     │
│                                          │
│ [下一步] → Step 6: 投骰 → [🎲 投4d ]    │
│            结果: [2][4][5][6] → 完全成功!│
│            效果: 一般(2格) → 填2格       │
│                                          │
│ [记录到日志] [ consequences: ____ ]      │
└──────────────────────────────────────────┘
```

**投骰器组件**：
- 点击投骰 → 骰子动画（3D旋转或洗牌动画）→ 结果展示
- 支持多种骰子：行动骰、抵抗骰、遭遇骰、战役骰、幸运骰
- 自动根据当前处境和奖励骰计算总骰池
- 结果自动判断（成功/部分成功/失败/关键成功）

**进程表组件**：
- 扇形/圆形进度表（类似时钟，分成若干格）
- 点击格子填表，右键取消
- 不同类型不同颜色：危机=红色，竞速=双色，威胁=黑色
- 填满时触发警报动画

### 5.4 编年史模块

**目标**：记录战役的完整历史，提供回顾和沉浸感。

**页面结构**：
```
┌──────────────────────────────────────────┐
│ 编年史 — 刀锋连队的撤退之路               │
├──────────────────────────────────────────┤
│ 时间轴视图                                │
│                                          │
│ ○──第1节: 阿尔德马克边境                  │
│ │   [突袭成功] [士气:5→7] [伤亡:0]        │
│ │   [书记官故事: 军团建立]                │
│ ▼──第2节: 灰烬沼泽                        │
│ │   [突袭成功] [士气:7→6] [伤亡:1]        │
│ │   [牺牲者: 艾德里克 ███████]            │
│ ▼──第3节: 黑栎要塞 ...                    │
│                                          │
│ [展开详情] [查看伤亡名单] [阅读编年史故事] │
└──────────────────────────────────────────┘
```

**伤亡名单**：
- 以纪念碑形式展示所有死亡角色
- 显示姓名、职业、阵亡节数、遗言（如有）
- 书记官记录的牺牲故事

**编年史故事**：
- 书记官讲述的5个故事类型，每个以卡片形式展示
- 支持GM撰写和编辑

### 5.5 速查面板

**目标**：运行游戏时的快速参考，可置于副屏或分屏。

**布局**：
```
┌──────────────────────────────────────────┐
│ [迷你投骰器]  [数字速查表切换]             │
├──────────────────────────────────────────┤
│ 当前激活的速查表:                          │
│ ┌─────────────────────────────────────┐  │
│ │ 骰子结果: 6=成功 4-5=部分 1-3=失败   │  │
│ │ 伤害: 1轻/2中/3重失能/4死            │  │
│ │ 压力: 0-2正常/3-4紧张/5崩溃/6创伤    │  │
│ │ ...                                 │  │
│ └─────────────────────────────────────┘  │
│                                          │
│ [判定流程] [经验速查] [敌人速查] [职位速查]│
└──────────────────────────────────────────┘
```

---

## 六、技术栈

| 层级 | 技术选型 | 理由 |
|------|---------|------|
| 框架 | Nuxt 4 + Vue 3 | 已初始化，SSR/SSG支持，文档库可静态生成 |
| 样式 | Tailwind CSS 4 + 自定义设计令牌 | 原子化CSS，便于维护军事档案主题 |
| UI组件 | 自研组件为主 + `@nuxt/ui` 基础组件 | 避免通用UI库的模板感，保持独特视觉 |
| 字体 | Noto Serif SC + JetBrains Mono | 衬线档案感 + 等宽数据感 |
| 图标 | Lucide Icons | 简洁线性图标，不抢视觉 |
| 文档渲染 | `@nuxt/content` v3 | Markdown内容管理，支持全文搜索 |
| 状态管理 | Pinia + `useLocalStorage` composable | 本地持久化，响应式 |
| 动画 | CSS transitions + GSAP（仅页面切换） | 克制动效，保持严肃感 |
| 数据验证 | Zod | 导出/导入时的数据校验 |

---

## 七、开发阶段规划

### Phase 1: 基础设施（1-2天）
- [ ] 安装依赖（Tailwind, Pinia, Nuxt Content, Zod, Lucide）
- [ ] 配置设计令牌（颜色、字体、间距）
- [ ] 搭建全局布局（AppHeader, AppFooter, 背景纹理）
- [ ] 实现 localStorage 数据层封装
- [ ] 配置 markdown 内容路由（docs → pages）

### Phase 2: 规则Wiki（2-3天）
- [ ] 集成 Nuxt Content 读取 docs/ 目录
- [ ] 实现左侧目录树 + 右侧正文布局
- [ ] 实现全文搜索（MiniSearch）
- [ ] Markdown样式定制（表格、代码块、标题层级）
- [ ] 移动端适配

### Phase 3: 角色卡（2-3天）
- [ ] 角色数据模型 + 校验
- [ ] 角色列表页（名册视图）
- [ ] 角色创建向导（6步）
- [ ] 角色详情页（完整角色卡UI）
- [ ] 伤害/压力/腐化的可视化追踪

### Phase 4: GM控制台（3-4天）
- [ ] 军团状态面板（士气/食物/补给/情报）
- [ ] 角色部署系统（拖拽分配主要/次要任务）
- [ ] 六步法判定向导
- [ ] 投骰器组件（动画+结果判定）
- [ ] 进程表组件（填表+填满警报）
- [ ] 结算流程自动化（七步向导）

### Phase 5: 编年史与速查（1-2天）
- [ ] 战役时间轴视图
- [ ] 伤亡纪念碑
- [ ] 书记官故事编辑器
- [ ] 速查面板（可切换的速查表）

### Phase 6: 打磨与部署（1-2天）
- [ ] 数据导出/导入功能
- [ ] 响应式适配（平板优先，手机可用）
- [ ] 性能优化（大文档懒加载）
- [ ] 静态生成部署（`nuxt generate` → GitHub Pages）

---

## 八、文件结构规划

```
刀锋联队战役/
├── app/
│   ├── app.vue
│   ├── layouts/
│   │   └── default.vue
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppHeader.vue
│   │   │   ├── AppFooter.vue
│   │   │   └── ArchiveBackground.vue
│   │   ├── wiki/
│   │   │   ├── WikiSidebar.vue
│   │   │   ├── WikiSearch.vue
│   │   │   └── WikiToc.vue
│   │   ├── char/
│   │   │   ├── CharCard.vue
│   │   │   ├── CharActionGrid.vue
│   │   │   ├── CharHarmTracker.vue
│   │   │   ├── CharStressBar.vue
│   │   │   └── CharCreator.vue
│   │   ├── gm/
│   │   │   ├── LegionStatusBar.vue
│   │   │   ├── DeploymentBoard.vue
│   │   │   ├── SixStepsWizard.vue
│   │   │   ├── DiceRoller.vue
│   │   │   ├── ProgressClock.vue
│   │   │   └── SettlementWizard.vue
│   │   ├── chronicle/
│   │   │   ├── TimelineView.vue
│   │   │   ├── MemorialWall.vue
│   │   │   └── StoryCard.vue
│   │   └── quickref/
│   │       ├── QuickRefPanel.vue
│   │       └── MiniDiceBox.vue
│   ├── composables/
│   │   ├── useLegionData.ts      ← localStorage 封装
│   │   ├── useDiceRoller.ts      ← 投骰逻辑
│   │   ├── useSixSteps.ts        ← 六步法状态机
│   │   └── useProgressClock.ts   ← 进程表逻辑
│   ├── stores/
│   │   ├── legion.ts             ← Pinia: 军团状态
│   │   ├── chars.ts              ← Pinia: 角色列表
│   │   └── gm.ts                 ← Pinia: GM运行状态
│   ├── types/
│   │   └── index.ts              ← TypeScript 类型定义
│   ├── pages/
│   │   ├── index.vue
│   │   ├── wiki/
│   │   │   ├── index.vue
│   │   │   └── [...slug].vue
│   │   ├── chars/
│   │   │   ├── index.vue
│   │   │   ├── new.vue
│   │   │   └── [id].vue
│   │   ├── gm/
│   │   │   ├── index.vue
│   │   │   ├── mission.vue
│   │   │   └── campaign.vue
│   │   ├── chronicle.vue
│   │   └── quickref.vue
│   └── assets/
│       ├── css/
│       │   └── main.css          ← Tailwind + 自定义变量
│       ├── fonts/
│       └── images/
│           └── paper-texture.png
├── content/                       ← Nuxt Content 内容目录
│   └── wiki/
│       ├── L2/                    ← 从 docs/L2_Structured/ 复制/链接
│       └── L3/                    ← 从 docs/L3_QuickRef/ 复制/链接
├── docs/                          ← 三层文档库（已有）
├── public/
├── nuxt.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 九、关键设计决策

### 1. 为什么不用现成UI库（如 Element Plus / Ant Design）？

因为刀锋联队需要**独特的"战地档案"视觉风格**。通用UI库的圆角卡片、蓝色主色调、统一阴影完全不符合黑暗军事奇幻的基调。自研组件虽然工作量更大，但能保证每个按钮、每个输入框都融入档案质感。

### 2. 为什么 localStorage 而非服务端数据库？

跑团工具的**核心场景是单桌本地使用**。GM在电脑上主持，玩家们围坐在旁或用语音连线。数据不需要跨设备实时同步（不像网游），localStorage 足够可靠。导出/导入 JSON 文件作为备份和分享手段，简单有效。未来若需要多设备同步，可再接入 Supabase。

### 3. 为什么把文档库放在 content/ 而非直接读取 docs/？

`@nuxt/content` 需要特定的目录结构来支持全文搜索和路由生成。我们可以在构建时把 `docs/L2/` 和 `docs/L3/` 复制到 `content/wiki/`，或者配置 Nuxt Content 直接读取 docs 目录。

### 4. 移动端策略？

**平板优先设计**（iPad / Surface）。跑团时GM通常用平板或笔记本，手机只是辅助查阅。GM控制台在手机上会折叠为标签页切换，但核心功能可用。角色卡和速查面板在手机上表现良好。

---

> **下一步**：确认本设计方案后，进入 Phase 1 开发 —— 搭建基础设施和全局布局。
