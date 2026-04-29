export const ACTIONS = [
  // 认知
  { key: 'channel', name: '渠道', attr: '认知', desc: '通过社交关系获取资源、情报或帮助' },
  { key: 'investigation', name: '调查', attr: '认知', desc: '使用细致观察收集信息，调查人、文件或物品' },
  { key: 'rigging', name: '修补', attr: '认知', desc: '机械化解决方案，修理机械，解除陷阱，撬锁' },
  { key: 'scout', name: '侦察', attr: '认知', desc: '侦察地点收集信息，不被察觉地移动或观察' },
  // 技术
  { key: 'maneuver', name: '机动', attr: '技术', desc: '移动、攀爬、游泳、奔跑、驾驭动物' },
  { key: 'marksmanship', name: '射击', attr: '技术', desc: '远处朝目标射击，寻找清晰射击线' },
  { key: 'skirmish', name: '游击', attr: '技术', desc: '近身搏斗，突袭，摔跤，近距离开枪' },
  { key: 'wreck', name: '破坏', attr: '技术', desc: '爆破破坏，散播混乱，使用爆炸物' },
  // 决心
  { key: 'sway', name: '社交', attr: '决心', desc: '获得资源、信息，或留下好印象' },
  { key: 'discipline', name: '训诫', attr: '决心', desc: '训诫士兵，利用人格力量强迫服从' },
  { key: 'command', name: '组织', attr: '决心', desc: '组织小队协同行动，对目标协同开火' },
  { key: 'resolve', name: '动摇', attr: '决心', desc: '用欺骗、魅力、逻辑动摇某人；伪装' },
  // 专家
  { key: 'aim', name: '瞄准', attr: '专家', desc: '每使用1次将射击行动效果等级提升1级' },
  { key: 'martial_arts', name: '武艺', attr: '专家', desc: '一次战斗中被视为一支小型队伍' },
  { key: 'medicine', name: '医疗', attr: '专家', desc: '让一个军团成员在一个场景内暂时无视伤害惩罚' },
  { key: 'endure', name: '忍耐', attr: '专家', desc: '一次抵抗骰+2d' },
  { key: 'survival', name: '求生', attr: '专家', desc: '为小队找到安全避难所或获得补给' },
  { key: 'weave', name: '编织', attr: '专家', desc: '炼金术相关操作' },
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
