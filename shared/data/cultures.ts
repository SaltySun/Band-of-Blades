import type { Culture } from './types'

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
    maleNames: ['基兰', '维克拉姆', '拉维', '德维什', '阿苏尔', '坎查纳', '纳兰', '苏里亚', '贾伊', '普拉卡什'],
    femaleNames: ['梅拉', '塔拉', '因杜', '拉妮', '萨丽塔', '卡维塔', '普里娅', '莉拉', '黛薇', '莎娜'],
    surnames: ['金织', '红陶', '青染', '白盐', '黑铁', '紫商', '琥珀行', '银器', '蓝染', '翠玉'],
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
