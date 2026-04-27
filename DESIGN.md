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

## 四、数据架构（SQLite + 房间系统）

### 4.1 房间与权限系统

```
GM 创建战役房间
    ↓
生成 roomCode (6位字母数字，如 "X7K9P2")
生成 gmToken   (32位随机字符串，GM管理密钥)
    ↓
GM 分享 roomCode 给玩家
    ↓
玩家输入 roomCode → 加入房间 → 只读查看
GM 携带 gmToken   → 完整读写权限
```

**权限矩阵**：

| 操作 | GM (携带gmToken) | 玩家 (仅roomCode) |
|------|------------------|-------------------|
| 查看规则Wiki | ✅ | ✅ |
| 查看角色名册 | ✅ | ✅ |
| 查看军团状态 | ✅ | ✅ |
| 查看编年史 | ✅ | ✅ |
| 创建/编辑角色 | ✅ | ❌ |
| 部署任务 | ✅ | ❌ |
| 投骰判定 | ✅ | ❌ |
| 执行结算 | ✅ | ❌ |
| 编辑编年史 | ✅ | ❌ |
| 导出数据 | ✅ | ❌ |

**无用户注册**：房间码即身份。GM通过URL中的`?gmToken=xxx`保持管理状态，玩家通过`?room=xxx`加入。

### 4.2 数据库设计（SQLite）

```sql
-- 战役房间
CREATE TABLE rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,           -- 房间码，如 "X7K9P2"
  gm_token TEXT NOT NULL,              -- GM管理密钥
  name TEXT DEFAULT '未命名战役',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 军团状态（每个房间一条，随战役推进更新）
CREATE TABLE legion_state (
  room_id INTEGER PRIMARY KEY REFERENCES rooms(id) ON DELETE CASCADE,
  cycle INTEGER DEFAULT 0,             -- 当前节数
  pressure INTEGER DEFAULT 0,
  morale INTEGER DEFAULT 5,
  food INTEGER DEFAULT 10,
  supply INTEGER DEFAULT 0,
  intel INTEGER DEFAULT 0,
  chosen_one TEXT,                     -- shreya / horned_one / zora
  broken_ones TEXT,                    -- JSON ["render", "breaker"]
  location TEXT DEFAULT '阿尔德马克边境',
  next_location TEXT,
  spy_network TEXT,                    -- JSON {spies:[], nodes:[]}
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 角色
CREATE TABLE characters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id INTEGER NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('rookie','soldier','specialist')),
  class TEXT CHECK(class IN ('heavy','medic','officer','scout','sniper')),
  threat INTEGER DEFAULT 1,
  actions TEXT NOT NULL,               -- JSON {investigate:{level:1,xp:2},...}
  stress INTEGER DEFAULT 0,
  stress_max INTEGER DEFAULT 6,
  trauma_count INTEGER DEFAULT 0,
  trauma_max INTEGER DEFAULT 2,
  trauma_symptom TEXT,
  harm TEXT DEFAULT '{"l1":0,"l2":0,"l3":0,"l4":0}', -- JSON
  corruption INTEGER DEFAULT 0,
  rot_level INTEGER DEFAULT 0,
  rot_symptoms TEXT DEFAULT '[]',      -- JSON []
  special_action TEXT,                 -- JSON {name,level,uses}
  abilities TEXT DEFAULT '[]',         -- JSON []
  load TEXT DEFAULT 'medium',
  items TEXT DEFAULT '[]',             -- JSON []
  missions_survived INTEGER DEFAULT 0,
  is_alive INTEGER DEFAULT 1,
  is_retired INTEGER DEFAULT 0,
  notes TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 部署记录（每节一条）
CREATE TABLE deployments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id INTEGER NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  cycle INTEGER NOT NULL,
  main_mission_name TEXT,
  side_mission_name TEXT,
  main_chars TEXT DEFAULT '[]',        -- JSON [charId1, charId2]
  side_chars TEXT DEFAULT '[]',
  encounter_roll INTEGER,
  situation TEXT,
  main_result TEXT,
  side_result INTEGER,
  xp_log TEXT DEFAULT '[]',            -- JSON [{charId,amount,reason}]
  casualties TEXT DEFAULT '[]',        -- JSON [charId1]
  log_entries TEXT DEFAULT '[]',       -- JSON [{timestamp,content}]
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 进程表
CREATE TABLE progress_clocks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id INTEGER NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('crisis','race','chain','mission','threat','project')),
  total_segments INTEGER NOT NULL,
  filled_segments INTEGER DEFAULT 0,
  color TEXT DEFAULT '#8b2e2e',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 编年史条目
CREATE TABLE chronicle_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id INTEGER NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK(type IN ('founding','independence','trial','perseverance','purpose')),
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  told_by TEXT,
  cycle INTEGER,
  xp_awarded INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 操作日志（用于追溯和恢复）
CREATE TABLE action_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id INTEGER NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  action TEXT NOT NULL,                -- 操作类型
  payload TEXT,                        -- JSON 操作数据
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 4.3 客户端类型定义（与DB表对应）

```typescript
// 客户端使用的类型，与SQLite表结构保持一致
interface Character {
  id: number
  roomId: number
  name: string
  type: 'rookie' | 'soldier' | 'specialist'
  class?: 'heavy' | 'medic' | 'officer' | 'scout' | 'sniper'
  threat: number
  actions: Record<string, { level: number; xp: number }>
  stress: number
  stressMax: number
  traumaCount: number
  traumaMax: number
  traumaSymptom?: string
  harm: { l1: number; l2: number; l3: number; l4: number }
  corruption: number
  rotLevel: number
  rotSymptoms: string[]
  specialAction?: { name: string; level: number; usesRemaining: number }
  abilities: string[]
  load: 'light' | 'medium' | 'heavy'
  items: string[]
  missionsSurvived: number
  isAlive: boolean
  isRetired: boolean
  notes: string
  createdAt: string
}

interface Room {
  id: number
  code: string
  gmToken: string
  name: string
  createdAt: string
  updatedAt: string
}

interface LegionState {
  roomId: number
  cycle: number
  pressure: number
  morale: number
  food: number
  supply: number
  intel: number
  chosenOne: string | null
  brokenOnes: string[]
  location: string
  nextLocation: string
  spyNetwork: { spies: Spy[]; unlockedNodes: string[] }
}

interface ProgressClock {
  id: number
  roomId: number
  name: string
  type: 'crisis' | 'race' | 'chain' | 'mission' | 'threat' | 'project'
  totalSegments: number
  filledSegments: number
  color: string
}

interface ChronicleEntry {
  id: number
  roomId: number
  type: 'founding' | 'independence' | 'trial' | 'perseverance' | 'purpose'
  title: string
  content: string
  toldBy?: string
  cycle?: number
  xpAwarded: boolean
}

interface Deployment {
  id: number
  roomId: number
  cycle: number
  mainMissionName: string
  sideMissionName: string
  mainChars: number[]
  sideChars: number[]
  encounterRoll?: number
  situation?: string
  mainResult?: string
  sideResult?: number
  xpLog: Array<{ charId: number; amount: number; reason: string }>
  casualties: number[]
  logEntries: Array<{ timestamp: string; content: string }>
}
```

### 4.4 数据同步策略

**架构**：
```
浏览器客户端
    ↓ HTTP /api/rooms/:code/...
Nuxt Nitro Server
    ↓ better-sqlite3
SQLite 文件 (data/blades.db)
```

**同步机制**：
1. **GM操作**：GM执行任何修改（创建角色、更新状态、执行结算）→ 立即调用 API → 服务端写入 SQLite → 返回最新状态
2. **玩家查看**：玩家页面每 **15秒** 自动轮询获取最新数据，或 GM 可点击「推送更新」主动触发
3. **首次加载**：进入房间时一次性拉取全量数据，后续增量更新
4. **离线友好**：GM页面在本地维护一个 optimistic state，API失败时回滚并提示
5. **备份**：服务端每日自动导出 JSON 备份到 `data/backups/`

**为什么不用 WebSocket / SSE？**
- 跑团是"回合制"节奏，不需要毫秒级同步。15秒轮询足够
- 减少服务器复杂度和资源消耗
- 未来如需更实时，可无缝升级为 SSE

**SQLite 文件位置**：
```
项目目录/
├── data/
│   ├── blades.db           ← 主数据库
│   └── backups/            ← 每日自动备份
│       ├── blades-2026-04-27.json
│       └── ...
```

**部署注意**：
- VPS 上使用 `systemd` 或 `PM2` 运行 Nuxt 生产服务
- SQLite 文件需持久化（不要放在 Docker 容器内，使用 volume 映射）
- 定期 `sqlite3 blades.db ".backup data/backups/blades-$(date +%F).db"`

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

**目标**：记录战役的完整历史，提供回顾和沉浸感。**玩家和GM均可查看**。

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
- 支持GM撰写和编辑（玩家只读）

### 5.5 速查面板

**目标**：运行游戏时的快速参考，可置于副屏或分屏。**玩家和GM均可查看**。

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
| 框架 | Nuxt 4 + Vue 3 | 已初始化，支持 Server API（Nitro） |
| 样式 | Tailwind CSS 4 + 自定义设计令牌 | 原子化CSS，便于维护军事档案主题 |
| UI组件 | 自研组件为主 + `@nuxt/ui` 基础组件 | 避免通用UI库的模板感，保持独特视觉 |
| 字体 | Noto Serif SC + JetBrains Mono | 衬线档案感 + 等宽数据感 |
| 图标 | Lucide Icons | 简洁线性图标，不抢视觉 |
| 文档渲染 | `@nuxt/content` v3 | Markdown内容管理，支持全文搜索 |
| 数据库 | `better-sqlite3` + `drizzle-orm` | 同步SQLite驱动 + 类型安全ORM |
| 服务端API | Nuxt Server Routes (Nitro) | `/server/api/` 目录下定义REST API |
| 状态管理 | Pinia + 服务端API封装 | 客户端状态管理，数据通过API持久化到SQLite |
| 动画 | CSS transitions（克制） | 页面切换纸张感，数字变化打字机感 |
| 数据验证 | Zod | API请求/响应校验、数据库迁移校验 |

---

## 七、开发阶段规划

### Phase 1: 基础设施 + 数据库（2-3天）
- [ ] 安装依赖（Tailwind, Pinia, Nuxt Content, Zod, Lucide, better-sqlite3, drizzle-orm）
- [ ] 配置设计令牌（颜色、字体、间距）
- [ ] 搭建全局布局（AppHeader, AppFooter, 背景纹理）
- [ ] 配置 Drizzle ORM + SQLite 数据库连接
- [ ] 编写数据库 Schema 和初始迁移脚本
- [ ] 实现 `/server/api/rooms` API（创建房间、加入房间）
- [ ] 实现 `/server/api/rooms/[code]/state` API（读写军团状态）
- [ ] 实现 `/server/api/rooms/[code]/chars` API（角色CRUD）
- [ ] 配置 markdown 内容路由（docs → pages）

### Phase 2: 规则Wiki（2-3天）
- [ ] 集成 Nuxt Content 读取 docs/ 目录
- [ ] 实现左侧目录树 + 右侧正文布局
- [ ] 实现全文搜索（MiniSearch）
- [ ] Markdown样式定制（表格、代码块、标题层级）
- [ ] 移动端适配

### Phase 3: 角色卡（2-3天）
- [ ] 角色数据模型 + 校验（Zod）
- [ ] 角色列表页（名册视图）
- [ ] 角色创建向导（6步）
- [ ] 角色详情页（完整角色卡UI）
- [ ] 伤害/压力/腐化的可视化追踪
- [ ] 玩家只读视图（隐藏编辑按钮）

### Phase 4: GM控制台（3-4天）
- [ ] 军团状态面板（士气/食物/补给/情报）
- [ ] 角色部署系统（拖拽分配主要/次要任务）
- [ ] 六步法判定向导
- [ ] 投骰器组件（动画+结果判定）
- [ ] 进程表组件（填表+填满警报）
- [ ] 结算流程自动化（七步向导）
- [ ] 操作自动记录到 action_logs 表

### Phase 5: 编年史与速查（1-2天）
- [ ] 战役时间轴视图（从 deployments 表生成）
- [ ] 伤亡纪念碑（从 characters 表筛选 isAlive=0）
- [ ] 书记官故事编辑器（GM可写，玩家只读）
- [ ] 速查面板（纯前端，无需API）

### Phase 6: 打磨与部署（2-3天）
- [ ] 房间系统完整流程（创建→分享→加入→权限控制）
- [ ] 数据导出/导入功能（JSON备份）
- [ ] 响应式适配（平板优先，手机可用）
- [ ] 性能优化（API响应缓存、大文档懒加载）
- [ ] VPS部署（Nuxt production build + PM2 + Nginx）
- [ ] SQLite备份脚本（cron定时任务）

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

### 2. 为什么用 SQLite + 房间码，而不是 localStorage？

因为用户需要**发布网站让玩家也能看到**。localStorage 只能 GM 自己看，玩家无法访问。SQLite + 房间码方案：
- GM 创建房间 → 生成 roomCode → 分享给玩家
- 玩家输入 roomCode 即可查看战役状态、角色卡、编年史
- 无需注册登录，最符合跑团 "一桌人" 的社交模式
- 自托管 VPS 上，SQLite 文件直接持久化在服务器磁盘，可靠且零额外成本

### 3. 为什么不用 WebSocket / SSE 做实时同步？

跑团是**回合制节奏**，不需要毫秒级同步。15秒轮询足够满足 "玩家看到GM最新操作" 的需求。避免 WebSocket 带来的服务器复杂度和连接管理开销。未来如需更实时，可无缝升级。

### 4. 为什么把文档库放在 content/ 而非直接读取 docs/？

`@nuxt/content` 需要特定的目录结构来支持全文搜索和路由生成。我们可以在构建时把 `docs/L2/` 和 `docs/L3/` 复制到 `content/wiki/`，或者配置 Nuxt Content 直接读取 docs 目录。

### 5. 移动端策略？

**平板优先设计**（iPad / Surface）。跑团时GM通常用平板或笔记本，手机只是辅助查阅。GM控制台在手机上会折叠为标签页切换，但核心功能可用。角色卡和速查面板在手机上表现良好。

---

> **下一步**：确认本设计方案后，进入 Phase 1 开发 —— 搭建基础设施和全局布局。
