// PDF角色卡 v1.3 权威数据

export interface Ability {
  key: string
  name: string
  description: string
  exclusive?: boolean // 新兵专属
}

export interface Trait {
  key: string
  name: string
  effect: string
}

export interface Culture {
  key: string
  name: string
  description: string
  traits: Trait[]
  maleNames: string[]
  femaleNames: string[]
  surnames: string[]
  namingStyle: string
}

export interface Role {
  key: string
  name: string
  nameEn: string
  description: string
  specialAction: string
  specialActionDesc: string
  xpCondition: string
  abilities: Ability[]
  isRookie?: boolean
}

export const ROLES: Role[] = [
  {
    key: 'heavy',
    name: '重装兵',
    nameEn: 'Heavy',
    description: '身披重甲的铁壁战士。能在最危险的战场保护队友，降低敌人的威胁等级。',
    specialAction: '武艺',
    specialActionDesc: '一次战斗中被视为一支小型队伍。对抗规模优势敌人时，效果等级无视规模优势。',
    xpCondition: '通过力量或坚韧帮助你的团队',
    abilities: [
      { key: 'bastion', name: '堡垒', description: '消耗武艺的使用次数，作为你保护的小队抵抗后果用的特殊护甲' },
      { key: 'assist', name: '援助', description: '保护队友时抵抗骰+1d；协助队友时他们的超越自我只增加1点精神压力' },
      { key: 'resilient', name: '顽强', description: '伤害带来的惩罚降低1级（4级及以上除外）' },
      { key: 'weapon_master', name: '武器大师', description: '近身战斗中超越自我时，此次近身战斗行动获得效力' },
      { key: 'war_machine', name: '战争机器', description: '超越自我时可额外获得：降低对抗敌人的威胁度1级，或进行一次几近超人的行动' },
      { key: 'vigor', name: '精力充沛', description: '休息与恢复期间勾销伤害时额外勾销一格；受伤时减少1点精神压力' },
      { key: 'against_darkness', name: '对抗黑暗', description: '你和所有能看到你的队友在抵抗恐惧和腐化时+1d' },
      { key: 'elite', name: '精英', description: '精通两种行动（将提升上限提升至4级）' },
    ],
  },
  {
    key: 'medic',
    name: '医疗兵',
    nameEn: 'Medic',
    description: '在战场上挽救生命的关键角色。能在战斗中暂时消除伤害的惩罚效果。',
    specialAction: '医疗',
    specialActionDesc: '让一个军团成员在一个场景内暂时无视伤害惩罚（4级伤害依然是致命的）。',
    xpCondition: '通过医学知识或安抚情绪帮助你的团队',
    abilities: [
      { key: 'attaché', name: '特派员', description: '可以参与专家名额已满的任务（创建时自动获得）' },
      { key: 'first_aid', name: '急救', description: '使用1次补药移除某位军团成员的1个1级伤害' },
      { key: 'not_yet', name: '时辰未到', description: '消耗1次医疗将4级伤害降至3级，避免死亡（必须尽快使用）' },
      { key: 'toxic_medic', name: '绝命毒医', description: '使用1次补药令某位队友的某次肉体行动获得效力' },
      { key: 'field_stitch', name: '战地止血', description: '任务结束时消耗剩余医疗次数勾销队友2级或3级伤害行格子（每人限一次）' },
      { key: 'chemist', name: '化学家', description: '可选择炼金武装带作为标准物品（参见奥尔医用炼金试剂）' },
      { key: 'moral_support', name: '精神支持', description: '每次任务一次，给队友讲故事使所有听者降低1点精神压力' },
      { key: 'elite', name: '精英', description: '精通两种行动（将提升上限提升至4级）' },
    ],
  },
  {
    key: 'sniper',
    name: '狙击手',
    nameEn: 'Sniper',
    description: '从阴影中取敌性命的致命射手。射击效果独立+1级。',
    specialAction: '瞄准',
    specialActionDesc: '每使用1次将射击行动效果等级提升1级。可将不可能的射击变为可能。',
    xpCondition: '通过敏锐的观察力或起到关键作用的射击帮助你的团队',
    abilities: [
      { key: 'one_eye', name: '一只眼', description: '炼金装置替代一只眼睛。可清楚看到隐形目标，分辨超自然力量' },
      { key: 'ambush', name: '伏击', description: '从藏身处攻击或发动陷阱时+1d' },
      { key: 'dual_guns', name: '双枪客', description: '近距离使用两把手枪战斗时，这些战斗行动获得效力' },
      { key: 'head_count', name: '记人头', description: '射杀威胁度2或更高的敌人获得1点可任意分配的XP' },
      { key: 'sharpshooter', name: '神射手', description: '射击时超越自我可：超出武器射程攻击，或通过火力暂时压制敌人' },
      { key: 'cover_fire', name: '火力掩护', description: '通过射击为某人准备时，他们的下个行动获得效力' },
      { key: 'crimson_bullet', name: '猩红魔弹', description: '任务中携带一枚猩红魔弹（威胁度4攻击），发射时受到1次精神创伤' },
      { key: 'elite', name: '精英', description: '精通两种行动（将提升上限提升至4级）' },
    ],
  },
  {
    key: 'officer',
    name: '军官',
    nameEn: 'Officer',
    description: '善用个人关系获取额外资源与情报的领导者。',
    specialAction: '渠道',
    specialActionDesc: '让小队在一次闪回中获得一项资源（质量由动摇行动骰决定），此次闪回精神压力为0。',
    xpCondition: '通过强化纪律和战术规划来帮助你的团队',
    abilities: [
      { key: 'tactician', name: '战术家', description: '领导集体行动时最多受到1点精神压力' },
      { key: 'lead_from_front', name: '身先士卒', description: '领导集体行动时可调整小队规模；战斗中多个6视为关键成功' },
      { key: 'logistics', name: '后勤支援', description: '协助队友时消耗1次渠道使协助额外+1d' },
      { key: 'mission_first', name: '任务优先', description: '额外经验条件：任务结束时如有在你指挥下的人死亡，获得1XP' },
      { key: 'order', name: '军令如山', description: '可牺牲一位NPC队友吸收一次攻击的全部伤害' },
      { key: 'strategist', name: '战略家', description: '获取资源时消耗1次渠道为动摇+1d；有你参与的任务遭遇骰自动+1d' },
      { key: 'officer_school', name: '军官学校', description: '使用调查收集信息和使用认知抵抗时+1d' },
      { key: 'elite', name: '精英', description: '精通两种行动（将提升上限提升至4级）' },
    ],
  },
  {
    key: 'scout',
    name: '斥候',
    nameEn: 'Scout',
    description: '在黑暗中悄无声息前行的侦察兵。永远能感知到区域内不死者的最高威胁度。',
    specialAction: '求生',
    specialActionDesc: '为小队找到安全避难所（暂居一夜），或为每人获得1份补给（类型相同）。',
    xpCondition: '通过隐匿能力和远见帮助你的团队',
    abilities: [
      { key: 'ghost', name: '幽灵', description: '消耗1次求生获得1点对抗陷阱或被发现的特殊护甲' },
      { key: 'leopard_grace', name: '豹之优雅', description: '不穿护甲且速度和安静程度为轻装水平时，受到的伤害降低1级' },
      { key: 'like_wind', name: '如风', description: '出手争议时自动获得先手；用技巧抵抗攻击时+1d' },
      { key: 'infiltrator', name: '渗透者', description: '暗中观察收集信息或破解陷阱时，行动获得效力' },
      { key: 'sixth_sense', name: '第六感', description: '永远了解区域内不死者的最高具体威胁度；可用决心对其收集信息' },
      { key: 'prepared', name: '准备万全', description: '被伏击时闪回无精神压力，闪回期间所有行动获得效力；次要任务中受到伤害降低1级' },
      { key: 'reckless', name: '胆大妄为', description: '处境为绝望的投骰时+1d' },
      { key: 'elite', name: '精英', description: '精通两种行动（将提升上限提升至4级）' },
    ],
  },
  {
    key: 'soldier',
    name: '士兵',
    nameEn: 'Soldier',
    description: '经历过无数战役的可靠战友。拥有忍耐能力使抵抗伤害时获得+2d。',
    specialAction: '忍耐',
    specialActionDesc: '一次抵抗骰+2d（必须在投骰前宣布，每次投骰只能使用1次）。',
    xpCondition: '通过勇气和决心帮助队友',
    abilities: [
      { key: 'tireless', name: '不知疲倦', description: '消耗忍耐使用次数超越自我，此次超越自我不带来精神压力' },
      { key: 'leap_peak', name: '飞跃巅峰', description: '向强于你的对手冲锋时降低1点精神压力，机动行动骰+1d' },
      { key: 'steel_will', name: '钢之意志', description: '消耗忍耐使用次数作为对抗恐惧、麻痹、腐化和疲劳的特殊护甲' },
      { key: 'bear_strength', name: '力大如熊', description: '选择装备时额外提供2个功能栏' },
      { key: 'iron_gut', name: '食铁屙钉', description: '超越自我时无视所有伤害惩罚；抵抗本次投骰后果的抵抗骰+1d' },
      { key: 'grenadier', name: '掷弹兵', description: '可选择携带手榴弹（1格）或炸药（2格）作为轻装一部分' },
      { key: 'cavalry', name: '骑兵', description: '军需官有马匹时小队可骑马开始任务；马上机动行动骰+1d' },
      { key: 'elite', name: '精英', description: '精通两种行动（将提升上限提升至4级）' },
    ],
  },
  {
    key: 'rookie',
    name: '新兵',
    nameEn: 'Rookie',
    description: '刚刚入伍的年轻战士，还没有特殊能力。填满XP表后晋升为士兵。',
    specialAction: '',
    specialActionDesc: '无特种行动。',
    xpCondition: '通过不碍事和在不太可能幸存的情况下幸存',
    isRookie: true,
    abilities: [
      { key: 'devils_luck', name: '恶魔的好运', description: '所有抵抗骰+1d（无法通过老兵标准能力获得）', exclusive: true },
      { key: 'true_local', name: '彻头彻尾的【某地人】', description: '获得所属文化的所有文化特性（非新兵只能在创建时通过老兵标准能力获得）', exclusive: true },
      { key: 'just_a_kid', name: '只是个孩子', description: '保护你的人受伤时他们获得1XP；晋升时替换为士兵能力（无法通过老兵标准能力获得）', exclusive: true },
      { key: 'tough', name: '硬茬', description: '任务结束时受到2级或更高伤害获得2点可任意分配的XP（无法通过老兵标准能力获得）', exclusive: true },
      { key: 'will_to_live', name: '我要活下去', description: '提升精神创伤上限1次（共2次）；晋升时用"幸存者"替代（无法通过老兵标准能力获得）', exclusive: true },
      { key: 'taste_of_home', name: '家的味道', description: '任务持续1天以上可用新鲜食物烹饪，参与者减少1点精神压力（无法通过老兵标准能力获得）', exclusive: true },
      { key: 'jack_of_all', name: '样样通', description: '将两项0级行动提升至1级（无法通过老兵标准能力获得）', exclusive: true },
      { key: 'no_longer_rookie', name: '新兵不再', description: '第一次晋升必选。晋升为士兵，获得1项士兵能力+1级忍耐。选择后立即移除，不占用栏位', exclusive: true },
    ],
  },
]

export const CULTURES: Culture[] = [
  {
    key: 'barta',
    name: '巴尔塔',
    description: '北方苦寒之地的人民，以坚韧和信仰著称。采取共和体制，尊重老者和智慧。',
    namingStyle: '从母姓，名在前，姓在后',
    traits: [
      { key: 'affable', name: '和蔼可亲', effect: '社交+1（最高2）' },
      { key: 'devout', name: '信仰虔诚', effect: '总是装备圣骸' },
      { key: 'resolute', name: '坚韧不拔', effect: '使用技术抵抗时+1d' },
      { key: 'learned', name: '学识渊博', effect: '调查+1（最高2）' },
    ],
    maleNames: ['阿迪卡', '阿伦', '卡洛基', '玛吉特', '纳迪特', '帕克瑞什', '拉格哈夫', '拉喀什'],
    femaleNames: ['阿迪莎', '阿斯维娜', '卡莉卡', '卡维亚', '姬塔', '拉希卡', '拉希', '瑞亚', '赛内哈', '施姆亚', '瓦尼'],
    surnames: ['阿拉尼', '夏巴提', '达尔迪', '德瓦', '卡帕提亚', '卡特利', '帕克希', '马纳布尔'],
  },
  {
    key: 'panya',
    name: '潘雅',
    description: '南方商人国度，善于交易与工艺。丛林覆盖的国度，居民会获得动物特征。',
    namingStyle: '有色名、记名、行名',
    traits: [
      { key: 'craftsman', name: '能工巧匠', effect: '修补上限4' },
      { key: 'well_traveled', name: '走南闯北', effect: '中装时快速且安静' },
      { key: 'sharp', name: '精明强干', effect: '认知抵抗+1d' },
      { key: 'beast_mark', name: '兽性印记', effect: '抵抗腐化+2d' },
    ],
    maleNames: [],
    femaleNames: [],
    surnames: [],
  },
  {
    key: 'ald',
    name: '奥尔',
    description: '西方贵族血统，重视荣誉与复仇。以炼金术和科学技术闻名。',
    namingStyle: '有贵族头衔，名在前，姓在后',
    traits: [
      { key: 'noble', name: '出身高贵', effect: '提升一个战役行动效果' },
      { key: 'connected', name: '交游广泛', effect: '动摇+1（最高3）' },
      { key: 'vengeful', name: '有仇必报', effect: '受到伤害惩罚时获得效力' },
      { key: 'stoic', name: '不苟言笑', effect: '训诫+1（最高2）' },
    ],
    maleNames: ['阿尔本', '安东', '布拉斯', '赛普瑞安', '埃尔力克', '法瑞安', '里昂', '马瑞洛', '鲁宾', '西尔文'],
    femaleNames: ['阿罗拉', '琪娅拉', '埃梅塔', '汉瑞亚娜', '卡托维卡', '利维亚', '米莉亚', '赛孚瑞娜', '缇娅娜', '瓦勒瑞亚'],
    surnames: ['阿尔伯瑞克特', '伽罗西', '洛浦瑞奥', '马尔提科', '罗达诺', '桑尼奇', '扎尔达尼'],
  },
  {
    key: 'zeremya',
    name: '泽姆亚',
    description: '东方战士部落，以无畏和忠诚闻名。生活在北部山区，以氏族为单位聚居。',
    namingStyle: '父称/母称系统，名+父称/母称+氏族姓',
    traits: [
      { key: 'pain_immune', name: '不惧疼痛', effect: '忽略1级伤害惩罚' },
      { key: 'fearless', name: '无所畏惧', effect: '绝望抵抗+1d' },
      { key: 'loyal', name: '忠心耿耿', effect: '团队行动+1d' },
      { key: 'stubborn', name: '固执己见', effect: '决心抵抗+1d' },
    ],
    maleNames: ['阿德瑞米尔', '柯莱', '加布里迪约尔', '里亚夫', '马雷克西', '梅里斯拉夫', '特奥宁', '维尔托利'],
    femaleNames: ['阿利卡', '达尼亚', '爱蜜琳雅', '芙瑞雅', '卡拉莉娜', '赛弗琳娜', '塔婷尼卡', '瓦伦蒂娜', '扎雅'],
    surnames: ['阿尔伯瑞克特', '伽罗西', '洛浦瑞奥', '马尔提科', '罗达诺', '桑尼奇', '扎尔达尼'],
  },
]

export const ACTIONS = [
  { key: 'investigation', name: '调查', attr: '认知', desc: '使用细致观察收集信息，调查人、文件或物品' },
  { key: 'marksmanship', name: '射击', attr: '认知', desc: '远处朝目标射击，寻找清晰射击线' },
  { key: 'rigging', name: '修补', attr: '认知', desc: '机械化解决方案，修理机械，解除陷阱，撬锁' },
  { key: 'sway', name: '社交', attr: '认知', desc: '获得资源、信息，或留下好印象' },
  { key: 'scout', name: '侦查', attr: '认知', desc: '侦察地点收集信息，不被察觉地移动或观察' },
  { key: 'discipline', name: '训诫', attr: '认知', desc: '训诫士兵，利用人格力量强迫服从' },
  { key: 'skirmish', name: '游击', attr: '技术', desc: '近身搏斗，突袭，摔跤，近距离开枪' },
  { key: 'wreck', name: '破坏', attr: '技术', desc: '爆破破坏，散播混乱，使用爆炸物' },
  { key: 'maneuver', name: '机动', attr: '技术', desc: '移动、攀爬、游泳、奔跑、驾驭动物' },
  { key: 'command', name: '组织', attr: '技术', desc: '组织小队协同行动，对目标协同开火' },
  { key: 'resolve', name: '动摇', attr: '决心', desc: '用欺骗、魅力、逻辑动摇某人；伪装' },
] as const

export const TOTAL_ACTION_POINTS = 4
export const MAX_STARTING_ACTION_LEVEL = 2
export const DEFAULT_ACTION_CAP = 3

// 特性对行动上限的影响
export const TRAIT_ACTION_CAPS: Record<string, { action: string; cap: number }> = {
  affable: { action: 'sway', cap: 2 },
  learned: { action: 'investigation', cap: 2 },
  craftsman: { action: 'rigging', cap: 4 },
  connected: { action: 'resolve', cap: 3 },
  stoic: { action: 'discipline', cap: 2 },
}
