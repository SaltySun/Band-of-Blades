export interface IntelQuestionLevel {
  level: number
  title: string
  questions: string[]
}

export interface MissionType {
  name: string
  desc: string
  bonus: string
  penalty: string
}

export interface LocationInfo {
  name: string
  note: string
}

export interface EncounterDiceRule {
  pool: { stat: string; desc: string }[]
  results: { range: string; outcome: string }[]
}

export interface ChronicleStory {
  key: string
  title: string
  question: string
  effects: string[]
}

export interface SpyInfo {
  name: string
  background: string
  ability: string
  role: string
  master?: boolean
}

export interface SpyNetworkNode {
  name: string
  parent?: string
  effect: string
}

export interface SupplyItem {
  name: string
  max: number
  desc?: string
}

export interface ExtraPersonnel {
  name: string
  tracks: string[]
}

export interface LegionRoleDetail {
  key: string
  name: string
  tagline: string
  description: string
  required?: boolean
  duties: string[]
  resource?: {
    name: string
    desc: string
    max?: number
  }
  actions?: {
    title: string
    items: { name: string; desc: string }[]
  }[]
  tables?: {
    title: string
    headers: string[]
    rows: string[][]
  }[]
  notes?: string[]
  trees?: {
    title: string
    nodes: string[]
  }[]
  // 角色卡特有扩展
  intelQuestions?: IntelQuestionLevel[]
  missionTypes?: MissionType[]
  locations?: LocationInfo[]
  encounterDice?: EncounterDiceRule
  squads?: { name: string; defaultSoldiers?: number }[]
  specialists?: { role: string; label: string }[]
  supplyItems?: SupplyItem[]
  extraPersonnel?: ExtraPersonnel[]
  chronicles?: ChronicleStory[]
  spyMissionsLong?: { name: string; effect: string; segments: number; fieldKey?: string }[]
  spyMissionsShort?: { name: string; effect: string }[]
  spies?: SpyInfo[]
  spyNetworkNodes?: SpyNetworkNode[]
}

export const LEGION_ROLE_DETAILS: Record<string, LegionRoleDetail> = {
  commander: {
    key: 'commander',
    name: '指挥官',
    tagline: '军团最高决策者',
    description: '选择主要任务与次要任务，决定进军路线，消费情报获得战略优势。你是站在军团与毁灭之间的第一个防线。',
    required: true,
    duties: [
      '选择主要任务与次要任务',
      '决定进军路线（选择下一个地点）',
      '决定是否进军（推进战役）',
      '消费情报获得战略优势',
    ],
    resource: {
      name: '情报',
      desc: '任务奖励（主要是侦察任务）',
    },
    actions: [
      {
        title: '情报消费方式',
        items: [
          { name: '遭遇骰+1', desc: '消耗1点情报，为任何任务增加1个遭遇骰' },
          { name: '解锁特殊任务', desc: '消耗情报，获得执行某地特殊任务的权利' },
          { name: '情报问题', desc: '不消耗，提问数量 = 持有的情报数量上限' },
        ],
      },
    ],
    tables: [],
    intelQuestions: [
      {
        level: 0,
        title: '0情报 — 眼前任务',
        questions: [
          '任务中不死者威胁度最高分别是多少？',
          '任务需要多远距离行军？',
          '哪件物品带上比较有用？',
          '任务中有哪两种可选执行方式？',
          '哪些小队不尊重或不信任领导层？',
          '神选者对任务的态度是怎样的？',
        ],
      },
      {
        level: 1,
        title: '1情报 — 额外问题',
        questions: [
          '任务中哪些物品比较有用？',
          '谁对这个任务很认真？',
          '可能遇到什么样的挑战？',
          '会遇上哪些破碎者的部队？',
          '接下来地点能找到什么有益资源？',
          '某个精英的弱点/欲望可能是什么？',
        ],
      },
      {
        level: 2,
        title: '2情报 — 战略级',
        questions: [
          '会遇到哪个副官或臭名昭著的存在？',
          '不死者布置中最大的弱点是什么？',
          '这个任务和之前的任务有关联吗？',
          '破碎者在往哪个方向移动？',
          '地点存在什么样的挑战或困难？',
        ],
      },
      {
        level: 3,
        title: '3情报 — 战役级',
        questions: [
          '此前遇到的某个臭名昭著的存在的深层弱点是什么？',
          '余烬之王的目标是什么？',
          '破碎者如何影响当前地区的？',
          '不死者军队正在执行什么计划？',
          '军团如何才能最大限度地利用当前局势？',
        ],
      },
    ],
    missionTypes: [
      { name: '突袭', desc: '突击. 突袭. 进攻.', bonus: '士气（一定）、补给、时间', penalty: '压力（一定）、补给、时间' },
      { name: '宗教', desc: '朝圣. 仪式.', bonus: '优质资源（一定）、时间、专家', penalty: '压力（一定）、部队损失、士气' },
      { name: '侦察', desc: '渗透. 巡逻. 调查.', bonus: '情报（一定）、资源、部队', penalty: '压力、部队损失、时间' },
      { name: '补给', desc: '拾荒. 佣兵任务', bonus: '补给（一定）、资源', penalty: '士气、补给' },
    ],
    locations: [
      { name: '西部前线', note: '小型军营。不堪再战的残兵。大量不死者。' },
      { name: '平原镇', note: '曾经繁荣的平原城镇，被远古的城墙保护着。' },
      { name: '帝国古道', note: '古老的守护。漫长的行军。长的过头了。补给稀少。' },
      { name: '巴拉克矿山', note: '富裕的矿山城镇。适合补给黑弹。' },
      { name: '绞架隘口', note: '狭窄的隘口山道。大量神殿。补给稀少。' },
      { name: '逐日者营地', note: '平原上的营地。挤满了难民。优质的马匹。' },
      { name: '杜雷什森林', note: '凶猛的野兽。不可置信的猎人。难以辨别方向。' },
      { name: '塔尔贡森林', note: '有角者的圣地。巨型野兽。' },
      { name: '湖西城', note: '有城墙的城市。可疑。腐败。高傲。充满政治。' },
      { name: '湖东城', note: '富裕的城市。非常虔诚。非常骄傲。与湖西城是对头。' },
      { name: '卡利思科堡', note: '山脚下的军事要塞。正在被围攻。' },
      { name: '巨口深渊', note: '远古的地下通道。藏有守卫。古墓。' },
      { name: '高山之路', note: '古代的朝圣路线。很容易遭到伏击。' },
      { name: '天刃堡', note: '建立于隘口处的要塞。你们要坚守此处，直到到大雪结束不死者的进军。' },
    ],
  },

  marshal: {
    key: 'marshal',
    name: '军士长',
    tagline: '军团纪律与士气维护者',
    description: '部署人员参与任务，管理军团士气，投掷遭遇骰决定任务起始处境。你是军团战斗力的核心调度者。',
    required: true,
    duties: [
      '部署人员：选择哪些角色参与主要/次要任务',
      '管理士气：士气追踪（0-10）',
      '投遭遇骰：决定任务起始处境',
    ],
    resource: {
      name: '士气',
      desc: '0-10 追踪。低士气 = 惩罚/叛逃风险',
      max: 10,
    },
    encounterDice: {
      pool: [
        { stat: '忠诚度', desc: '已派遣角色的忠诚度总和' },
        { stat: '情报', desc: '指挥官为此次任务消耗的情报数量' },
        { stat: '老兵', desc: '每个老兵/专家角色+1骰' },
        { stat: '领导力', desc: '军士长的纪律或指挥行动等级' },
        { stat: '参数', desc: '任务威胁度与地点难度调整' },
      ],
      results: [
        { range: '1-3', outcome: '绝望处境 — 极端劣势开场' },
        { range: '4-5', outcome: '危险处境 — 困难开场' },
        { range: '6', outcome: '安全处境 — 可控开场' },
      ],
    },
    squads: [
      { name: '冷笑渡鸦' },
      { name: '星辰毒蛇' },
      { name: '白银牡鹿' },
      { name: '幽灵夜枭' },
      { name: '琥珀野狼' },
      { name: '破碎雄狮' },
    ],
    specialists: [
      { role: 'heavy', label: '重装兵' },
      { role: 'medic', label: '医疗兵' },
      { role: 'officer', label: '军官' },
      { role: 'scout', label: '斥候' },
      { role: 'sniper', label: '狙击手' },
      { role: 'other', label: '其他' },
    ],
    tables: [
      {
        title: '士气调整',
        headers: ['条件', '士气变化'],
        rows: [
          ['有角色阵亡', '-1'],
          ['士气当前≥6', '+1（庆祝胜利）'],
          ['士气当前≤3', '-1（恐慌蔓延）'],
          ['完成宗教任务', '+1'],
          ['完成突袭任务', '+1'],
        ],
      },
      {
        title: '遭遇骰',
        headers: ['骰值', '处境'],
        rows: [
          ['1-3', '绝望处境'],
          ['4-5', '危险处境'],
          ['6', '安全处境'],
        ],
      },
    ],
    notes: [
      '派遣人员原则：考虑角色的状态（失能、创伤、高腐化不宜派遣）',
      '考虑角色的专业能力匹配任务类型',
      '一个角色不能同时参与主要和次要任务',
      '死亡角色无法派遣',
    ],
  },

  quartermaster: {
    key: 'quartermaster',
    name: '军需官',
    tagline: '军团物资与补给管理者',
    description: '物资调配与补给，募兵补充伤亡，休息与恢复管理角色状态，推进长期项目。你是军团的后勤命脉。',
    required: true,
    duties: [
      '物资调配与补给',
      '募兵（补充伤亡）',
      '休息与恢复（管理角色状态）',
      '长期项目（制造攻城武器、研发药物等）',
    ],
    resource: {
      name: '补给',
      desc: '食物、黑弹、马匹等所有物资统称',
    },
    actions: [
      {
        title: '战役行动（每次战役阶段选一项）',
        items: [
          { name: '获取资源', desc: '军需官投战役骰，结果决定获得多少食物/补给。可通过渠道、勒索等获得加成。' },
          { name: '放假（R&R）', desc: '让军团休整，士气+1。每个角色可以勾销伤害格子。但时间和压力会推进。' },
          { name: '长期项目', desc: '推进大型工程进程表。范例：制造攻城武器、研发新药、修理装备。通常需要多个战役阶段完成。' },
          { name: '募兵', desc: '补充新兵。新兵数量取决于声誉和士气。新兵默认无特种行动，威胁度1。' },
        ],
      },
      {
        title: '休息与恢复',
        items: [
          { name: '6小时休息', desc: '勾销1格伤害（任意等级），清除部分压力（2-3点）。营地不安全时效果减半。' },
          { name: '1天完整休整', desc: '勾销2格伤害（任意等级），清空所有压力（归零），新兵晋升判定。' },
        ],
      },
    ],
    tables: [
      {
        title: '休息前提条件',
        headers: ['条件', '说明'],
        rows: [
          ['必须有足够食物', '每个存活角色消耗1单位食物'],
          ['营地必须相对安全', '否则效果减半'],
          ['食物不足时', '无法有效休息，士气下降，可能出现饥饿状态'],
        ],
      },
      {
        title: '补给获取途径',
        headers: ['途径', '说明'],
        rows: [
          ['补给任务', '完成补给类型任务获得食物'],
          ['军需官"获取资源"', '投战役骰获得物资'],
          ['渠道（社交行动）', '利用关系获取额外补给'],
          ['间谍网络"商人"节点', '强化补给任务额外+1补给'],
          ['地点搜刮', '某些地点有特殊资源'],
        ],
      },
    ],
    supplyItems: [
      { name: '食物储备', max: 3, desc: '每次战役阶段每名存活角色消耗1单位' },
      { name: '马匹', max: 3, desc: '用于快速机动与侦察' },
      { name: '黑弹', max: 3, desc: '对不死者特效弹药' },
      { name: '宗教补给', max: 2, desc: '宗教任务与仪式消耗' },
      { name: '劳工', max: 1, desc: '协助长期项目与搬运' },
      { name: '攻城武器', max: 1, desc: '围城战与要塞攻坚必需' },
    ],
    extraPersonnel: [
      { name: '慈悲者', tracks: ['受伤', '腐化'] },
      { name: '炼金术师', tracks: ['受伤', '腐化'] },
    ],
    notes: [
      '每次战役阶段（进军后），每个存活角色消耗1单位食物',
      '初始食物：10单位',
    ],
  },

  lorekeeper: {
    key: 'lorekeeper',
    name: '书记官',
    tagline: '军团故事记录者',
    description: '记录编年史，在营地阶段讲述军团故事，提供叙事框架与背景信息。你是军团的记忆与灵魂。',
    required: false,
    duties: [
      '记录编年史（军团的故事与传说）',
      '在"在营地"阶段讲述军团故事',
      '提供叙事框架与背景信息',
    ],
    actions: [
      {
        title: '编年史类型（5种）',
        items: [
          { name: '军团建立的故事', desc: '军团最初如何组建' },
          { name: '军团独立的故事', desc: '军团何时成为独立雇佣兵' },
          { name: '战火淬炼的故事', desc: '某场关键战役的传说' },
          { name: '意志不屈的故事', desc: '绝境中坚守' },
          { name: '军团存在的意义', desc: '军团的信念与使命' },
        ],
      },
    ],
    chronicles: [
      {
        key: 'founding',
        title: '军团建立的故事',
        question: '军团最初是如何组建的？谁召集了第一批成员？他们为何愿意追随？',
        effects: ['听众+1心智XP', '士气≥8时所有听众额外+1XP'],
      },
      {
        key: 'independence',
        title: '军团独立的故事',
        question: '军团何时脱离原有势力成为独立雇佣兵？代价是什么？谁做出了关键决定？',
        effects: ['听众+1身体XP', '士气≥8时所有听众额外+1XP'],
      },
      {
        key: 'tempered',
        title: '战火淬炼的故事',
        question: '哪一场战役最能体现军团的战斗精神？谁的故事至今被传颂？',
        effects: ['听众+1意志XP', '士气≥8时所有听众额外+1XP'],
      },
      {
        key: 'will',
        title: '意志不屈的故事',
        question: '军团曾在怎样的绝境中坚守不退？是什么让他们没有崩溃？',
        effects: ['听众+1心智XP', '士气≥8时所有听众额外+1XP'],
      },
      {
        key: 'purpose',
        title: '军团存在的意义',
        question: '军团的信念与使命是什么？他们为何而战？',
        effects: ['听众任选+1XP', '士气≥8时所有听众额外+1XP'],
      },
    ],
    notes: [
      '每次战役阶段，书记官可以讲述一个故事',
      '参与玩家可获得对应属性的经验点',
      '士气8-10时，所有听众额外+1 XP',
    ],
  },

  spymaster: {
    key: 'spymaster',
    name: '间谍总管',
    tagline: '暗影中的操纵者',
    description: '管理间谍网络，派遣短期/长期任务，通过阴影中的行动为军团获取战略优势。',
    required: false,
    duties: [
      '管理间谍网络',
      '派遣间谍执行短期/长期任务',
      '通过间谍获取情报与资源',
    ],
    resource: {
      name: '间谍',
      desc: '起始2位（1熟练+1大师），最多3位',
    },
    spyMissionsLong: [
      { name: '长期任务指派（总述）', effect: '军需官战役行动时可派遣间谍执行长期任务。熟练间谍投1颗骰，大师间谍投2颗。结果：1-3=间谍负伤；4/5=2格；6=3格；重大成功=5格。负伤间谍再次负伤则牺牲。可通过招募获得新间谍。', segments: 8 },
      { name: '强化任务', effect: '利用间谍网络关系增加任务好处。完成效果：GM生成任务时，指定任务类型的奖励骰与惩罚骰各+1（该类型需至少出现一次）。', segments: 8, fieldKey: 'spyMissionReinforce' },
      { name: '扩张网络', effect: '建立当地联系，发展线人。完成效果：选择与已有节点相连的新节点发展，立刻获得该节点效果。', segments: 8, fieldKey: 'spyMissionExpand' },
      { name: '布置陷阱', effect: '利用不死者的弱点诱入陷阱。完成效果：下个任务列表必然包含一个突袭任务，攻击指定的副官或臭名昭著者。', segments: 8, fieldKey: 'spyMissionTrap' },
      { name: '招募', effect: '间谍死亡后可招募替代品。完成效果：从撤退过程中可招募的间谍中选择加入。最多维持2位（网络扩张到增员节点可3位）。', segments: 8, fieldKey: 'spyMissionRecruit' },
      { name: '侦查', effect: '提前前往下一个目的地了解当地情报。完成效果：了解所有特殊任务。若指挥官已消耗情报获取特殊任务机会，可选择执行哪一个。若军团已离开目标地区，重置进程表。', segments: 8, fieldKey: 'spyMissionScout' },
    ],
    spyMissionsShort: [
      { name: '恢复', effect: '移除间谍的负伤状态' },
      { name: '收集情报', effect: '从指挥官情报问题列表中选1个问题问GM' },
      { name: '勒索', effect: '为1次"获取资源"战役行动+1骰' },
      { name: '协助', effect: '为1次"长期项目"战役行动+1骰' },
    ],
    spies: [
      { name: '安托瓦内特', background: '被剥夺继承权的奥尔女裁缝，令无数男人心碎、战士与贵族饮下毒酒，从未失手。', ability: '选择时立刻自行升级为大师级间谍。', role: '暗杀/破坏', master: true },
      { name: '鲍提斯', background: '不修边幅的泽姆亚人，传闻若活下来必为下任间谍总管。导师风格严厉但公平。', ability: '投扩张网络任务时，投骰结果增加的格数基础上额外让进程表前进一格。', role: '导师/建设' },
      { name: '赤烦风', background: '一切隐藏在迷雾中，来去自由，过去流言无数，唯一不变的是忠诚。', ability: '不会在任何任务中负伤。', role: '万能安全牌' },
      { name: '伊葛丽德', background: '阿尔德马克本地人，能融入任何聚居地，自由游荡记录新闻传言，经验丰富的登山家。', ability: '进行收集情报任务时，可以额外多问一个问题。', role: '情报专家' },
      { name: '莉娅', background: '巴尔塔人，无亲近首饰，喜欢长期潜伏独处任务，还是武器大师和决斗大师。', ability: '进行调查长期任务时+1骰。', role: '侦察/潜伏' },
      { name: '昂也廷', background: '熊一样高大的亲切男子，东部诸国最致命刺客之一，擅长发现隐藏目标与存货。', ability: '进行强化任务长期任务时+1骰。', role: '任务优化' },
    ],
    spyNetworkNodes: [
      { name: '间谍网络', effect: '你可以训练，维持和使用间谍。你开始拥有1位熟练间谍和一位大师间谍，合计2位。' },
      { name: '增员', parent: '间谍网络', effect: '获得一位间谍。将其标注为熟练。' },
      { name: '训练', parent: '增员', effect: '将你的一位熟练间谍提升为大师。本节点可以选择两次。' },
      { name: '分析师', parent: '间谍网络', effect: '进行调查任务的间谍+1骰。' },
      { name: '投资', parent: '分析师', effect: '进行扩张网络任务的间谍+1骰。' },
      { name: '现场评估', parent: '间谍网络', effect: '在收集情报时，你可以额外多问一个问题。' },
      { name: '诱捕', parent: '间谍网络', effect: '进行设置陷阱任务的间谍+1骰。' },
      { name: '信息源', parent: '间谍网络', effect: '你的线人无处不在。进行强化任务的间谍+1骰。' },
      { name: '商人', parent: '信息源', effect: '成功完成强化过的补给任务会使得任务奖励中额外增加1份补给。' },
      { name: '教团', parent: '信息源', effect: '成功完成强化过的宗教任务会使得任务奖励中额外增加1份资源。' },
      { name: '佣兵', parent: '信息源', effect: '成功完成强化过的突袭任务会使得任务奖励中额外增加1点士气。' },
      { name: '游侠', parent: '信息源', effect: '成功完成强化过的侦察任务会使得任务奖励中额外增加1份情报。' },
    ],
    tables: [],
    trees: [],
    notes: [
      '每个战役阶段，一名间谍只能执行短期任务或长期任务之一',
      '长期任务可接力：不同间谍轮流推进同一任务，暂停无惩罚',
      '伤亡规则：首次负伤 → 获得负伤状态；已负伤再次负伤 → 牺牲（死亡）',
    ],
  },
}

// 军团职务基础信息 — 统一从共享数据源导入
export { LEGION_ROLES } from '../../shared/game-data'

export function getLegionRoleDetail(key: string): LegionRoleDetail | undefined {
  return LEGION_ROLE_DETAILS[key]
}
