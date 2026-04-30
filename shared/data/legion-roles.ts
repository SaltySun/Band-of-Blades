import type { LegionRole } from './types'

export const LEGION_ROLES: LegionRole[] = [
  { key: 'commander', name: '指挥官', desc: '军团最高决策者。选择任务路线、决定军团是否进军', required: true },
  { key: 'marshal', name: '军士长', desc: '军团纪律与士气维护者。分配遭遇骰、决定任务人选', required: true },
  { key: 'quartermaster', name: '军需官', desc: '军团物资与补给管理者。执行战役行动（放假、募兵、补给等）', required: true },
  { key: 'lorekeeper', name: '书记官', desc: '军团故事记录者。记录编年史、讲述故事获得增益', required: false },
  { key: 'spymaster', name: '间谍总管', desc: '管理间谍网络，派遣短期/长期任务', required: false },
]
