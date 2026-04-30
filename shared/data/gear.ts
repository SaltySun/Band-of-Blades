import type { GearItem } from './types'

// 装备占用功能栏数（默认0，武器/工具类通常占1格）
export interface LoadoutItem {
  key: string
  name: string
  desc?: string
  uses?: number      // 消耗品次数
  slotCount?: number // 占用功能栏（默认0）
}

// 选项组：互斥选择
export interface ChoiceGroup {
  label: string
  items: LoadoutItem[]
}

export interface LoadoutConfig {
  fixed: LoadoutItem[]     // 固定默认装备
  choices: ChoiceGroup[]   // 必须选择的选项组
}

export interface RoleGearConfig {
  light: LoadoutConfig
  medium: LoadoutConfig
  heavy: LoadoutConfig
  optional: GearItem[]     // 功能栏选项池（花费2次选择机会）
}

// ========== 各职业装备配置 ==========

export const ROLE_GEAR_CONFIGS: Record<string, RoleGearConfig> = {
  heavy: {
    light: {
      fixed: [
        { key: 'flare_gun', name: '信号枪', uses: 4, slotCount: 1 },
        { key: 'fine_armor', name: '优质护甲', desc: '抵抗物理伤害时护甲+1', slotCount: 0 },
        { key: 'fine_hand_weapon', name: '优质单手武器', desc: '效果等级+1', slotCount: 1 },
      ],
      choices: [],
    },
    medium: {
      fixed: [
        { key: 'custom_heavy_plate', name: '定制重板甲', desc: '替代优质护甲，抵抗时额外护甲+1', slotCount: 0 },
      ],
      choices: [
        {
          label: '中装武器选择',
          items: [
            { key: 'fine_shield', name: '优质盾牌', desc: '抵抗物理伤害时护甲+1', slotCount: 1 },
            { key: 'fine_heavy_weapon', name: '优质重型武器', desc: '效果等级+1', slotCount: 1 },
          ],
        },
      ],
    },
    heavy: {
      fixed: [
        { key: 'fine_wrecking_kit', name: '优质破坏套装', desc: '破坏行动效果等级+1', slotCount: 1 },
      ],
      choices: [
        {
          label: '重型盾牌',
          items: [
            { key: 'fine_tower_shield', name: '优质塔盾', desc: '替代任何盾牌，抵抗时护甲+2', slotCount: 1 },
          ],
        },
      ],
    },
    optional: [
      { key: 'hand_weapon', name: '单手武器', slots: 1, desc: '标准近战武器' },
      { key: 'heavy_weapon', name: '重型武器', slots: 1, desc: '双手巨剑或战锤' },
      { key: 'black_shot', name: '黑弹', slots: 1, desc: '对抗不死者时行动获得效力', roleOnly: ['heavy'] },
      { key: 'shield', name: '盾牌', slots: 1, desc: '抵抗物理攻击时护甲+1格' },
      { key: 'winter_clothes', name: '冬装', slots: 1, desc: '抵御严寒环境' },
      { key: 'oil', name: '油', slots: 1, desc: '可用于润滑、燃烧或照明', roleOnly: ['heavy'] },
      { key: 'rations', name: '兵粮', slots: 1, desc: '干粮与饮水', roleOnly: ['heavy'] },
      { key: 'soldier_kit', name: '士兵套装', slots: 1, desc: '行军必需品' },
      { key: 'wrecking_kit', name: '破坏套装', slots: 1, desc: '撬棍、锤子和凿子' },
      { key: 'relic', name: '圣骸', slots: 1, desc: '降低腐化，抵抗腐化+1d' },
    ],
  },

  medic: {
    light: {
      fixed: [
        { key: 'fine_medical_kit', name: '优质医疗套装', uses: 3, slotCount: 1 },
        { key: 'tonic', name: '补药', uses: 1, slotCount: 1 },
        { key: 'mercy_icon', name: '慈悲圣徽', desc: '医疗兵标志', slotCount: 0 },
        { key: 'healing_goddess_seal', name: '治愈女神之印', desc: '神圣印记', slotCount: 1 },
      ],
      choices: [],
    },
    medium: {
      fixed: [
        { key: 'fine_pistol', name: '优质手枪', desc: '效果等级+1', slotCount: 1 },
        { key: 'ammo', name: '弹药', uses: 5, slotCount: 1 },
        { key: 'armor', name: '护甲', desc: '标准护甲', slotCount: 0 },
        { key: 'tonic_2', name: '补药', uses: 1, slotCount: 1 },
      ],
      choices: [],
    },
    heavy: {
      fixed: [
        { key: 'tonic_3', name: '补药', uses: 1, slotCount: 1 },
        { key: 'tonic_4', name: '补药', uses: 1, slotCount: 1 },
      ],
      choices: [],
    },
    optional: [
      { key: 'hand_weapon', name: '单手武器', slots: 1, desc: '标准近战武器' },
      { key: 'oil', name: '油', slots: 1, desc: '可用于润滑、燃烧或照明', roleOnly: ['medic'] },
      { key: 'alchemical_bandolier', name: '炼金武装带', slots: 1, desc: '枭目油、化合软膏、深海试剂等（需特殊能力「化学家」）', roleOnly: ['medic'] },
      { key: 'shield', name: '盾牌', slots: 1, desc: '抵抗物理攻击时护甲+1格' },
      { key: 'winter_clothes', name: '冬装', slots: 1, desc: '抵御严寒环境' },
      { key: 'black_shot', name: '黑弹', slots: 1, desc: '对抗不死者时行动获得效力', roleOnly: ['medic'] },
      { key: 'rations', name: '兵粮', slots: 1, desc: '干粮与饮水', roleOnly: ['medic'] },
      { key: 'repair_kit', name: '修理套装', uses: 3, slots: 1, desc: '工具与零件', roleOnly: ['medic'] },
      { key: 'scrolls', name: '书本&卷轴', uses: 2, slots: 1, desc: '为调查+1d或+1效果等级' },
      { key: 'relic', name: '圣骸', slots: 1, desc: '降低腐化，抵抗腐化+1d' },
    ],
  },

  sniper: {
    light: {
      fixed: [
        { key: 'black_shot_default', name: '黑弹', uses: 3, slotCount: 1 },
        { key: 'ammo_default', name: '弹药', uses: 5, slotCount: 1 },
      ],
      choices: [
        {
          label: '轻装武器选择',
          items: [
            { key: 'fine_pistol_pair', name: '两把优质手枪', desc: '效果等级+1', slotCount: 1 },
            { key: 'fine_rifle', name: '优质来复枪', desc: '效果等级+1', slotCount: 1 },
          ],
        },
      ],
    },
    medium: {
      fixed: [
        { key: 'gun_maintenance', name: '枪支保养套装', desc: '维护枪械', slotCount: 1 },
        { key: 'fine_armor_2', name: '优质护甲', desc: '抵抗物理伤害时护甲+1', slotCount: 0 },
      ],
      choices: [],
    },
    heavy: {
      fixed: [],
      choices: [
        {
          label: '重装武器（未选择的那种）',
          items: [
            { key: 'fine_pistol_pair_2', name: '两把优质手枪', desc: '效果等级+1', slotCount: 1 },
            { key: 'fine_rifle_2', name: '优质来复枪', desc: '效果等级+1', slotCount: 1 },
          ],
        },
      ],
    },
    optional: [
      { key: 'crimson_bullet', name: '猩红魔弹', slots: 1, desc: '任务中携带一枚猩红魔弹（威胁度4攻击），发射时受到1次精神创伤', roleOnly: ['sniper'] },
      { key: 'heavy_weapon', name: '重型武器', slots: 1, desc: '双手巨剑或战锤' },
      { key: 'black_shot', name: '黑弹', slots: 1, desc: '对抗不死者时行动获得效力', roleOnly: ['sniper'] },
      { key: 'pistol', name: '手枪', slots: 1, desc: '标准手枪' },
      { key: 'ammo', name: '弹药', slots: 1, desc: '额外弹药', roleOnly: ['sniper'] },
      { key: 'oil', name: '油', slots: 1, desc: '可用于润滑、燃烧或照明', roleOnly: ['sniper'] },
      { key: 'rations', name: '兵粮', slots: 1, desc: '干粮与饮水', roleOnly: ['sniper'] },
      { key: 'winter_clothes', name: '冬装', slots: 1, desc: '抵御严寒环境' },
      { key: 'soldier_kit', name: '士兵套装', slots: 1, desc: '行军必需品' },
      { key: 'relic', name: '圣骸', slots: 1, desc: '降低腐化，抵抗腐化+1d' },
    ],
  },

  officer: {
    light: {
      fixed: [
        { key: 'flare_gun', name: '信号枪', uses: 4, slotCount: 1 },
        { key: 'fine_armor', name: '优质护甲', desc: '抵抗物理伤害时护甲+1', slotCount: 0 },
        { key: 'fine_hand_weapon', name: '优质单手武器', desc: '效果等级+1', slotCount: 1 },
        { key: 'fine_cloak', name: '优质大氅', desc: '身份象征', slotCount: 0 },
      ],
      choices: [],
    },
    medium: {
      fixed: [
        { key: 'fine_luxury', name: '优质奢侈物品', desc: '彰显地位', slotCount: 0 },
        { key: 'ammo', name: '弹药', uses: 4, slotCount: 1 },
      ],
      choices: [
        {
          label: '中装装备选择',
          items: [
            { key: 'fine_shield', name: '优质盾牌', desc: '抵抗物理伤害时护甲+1', slotCount: 1 },
            { key: 'fine_pistol', name: '优质手枪', desc: '效果等级+1', slotCount: 1 },
          ],
        },
      ],
    },
    heavy: {
      fixed: [
        { key: 'banner', name: '战旗', desc: '军团旗帜', slotCount: 1 },
        { key: 'fine_heavy_armor', name: '优质重甲', desc: '抵抗物理伤害时护甲+2', slotCount: 0 },
      ],
      choices: [],
    },
    optional: [
      { key: 'hand_weapon', name: '单手武器', slots: 1, desc: '标准近战武器' },
      { key: 'large_weapon', name: '大型武器', slots: 1, desc: '长柄武器或双手武器' },
      { key: 'black_shot', name: '黑弹', slots: 1, desc: '对抗不死者时行动获得效力', roleOnly: ['officer'] },
      { key: 'shield', name: '盾牌', slots: 1, desc: '抵抗物理攻击时护甲+1格' },
      { key: 'winter_clothes', name: '冬装', slots: 1, desc: '抵御严寒环境' },
      { key: 'oil', name: '油', slots: 1, desc: '可用于润滑、燃烧或照明', roleOnly: ['officer'] },
      { key: 'rations', name: '兵粮', slots: 1, desc: '干粮与饮水', roleOnly: ['officer'] },
      { key: 'compass_map', name: '罗盘&地图', slots: 1, desc: '导航工具' },
      { key: 'credentials', name: '证件', slots: 1, desc: '身份证明文件' },
      { key: 'relic', name: '圣骸', slots: 1, desc: '降低腐化，抵抗腐化+1d' },
    ],
  },

  soldier: {
    light: {
      fixed: [
        { key: 'fine_armor', name: '优质护甲', desc: '抵抗物理伤害时护甲+1', slotCount: 0 },
        { key: 'hometown_souvenir', name: '家乡的纪念品', desc: '精神慰藉', slotCount: 0 },
        { key: 'fine_hand_weapon', name: '优质单手武器', desc: '效果等级+1', slotCount: 1 },
      ],
      choices: [
        {
          label: '轻装套装选择',
          items: [
            { key: 'fine_medical_set', name: '优质医疗套装', desc: '医疗行动效果等级+1', slotCount: 1 },
            { key: 'fine_climbing_set', name: '优质攀爬套装', desc: '机动行动效果等级+1', slotCount: 1 },
            { key: 'fine_cooking_set', name: '优质烹饪套装', desc: '烹饪行动效果等级+1', slotCount: 1 },
            { key: 'fine_repair_set', name: '优质修理套装', desc: '修补行动效果等级+1', slotCount: 1 },
            { key: 'fine_soldier_set', name: '优质士兵套装', desc: '组织行动效果等级+1', slotCount: 1 },
            { key: 'fine_wrecking_set', name: '优质破坏套装', desc: '破坏行动效果等级+1', slotCount: 1 },
          ],
        },
      ],
    },
    medium: {
      fixed: [
        { key: 'extra_slots_2', name: '2个额外功能栏', desc: '中装提供额外2格功能栏空间', slotCount: 0 },
      ],
      choices: [
        {
          label: '中装武器选择',
          items: [
            { key: 'fine_heavy_weapon', name: '优质重型武器', desc: '效果等级+1', slotCount: 1 },
            { key: 'fine_shield', name: '优质盾牌', desc: '抵抗物理伤害时护甲+1', slotCount: 1 },
          ],
        },
      ],
    },
    heavy: {
      fixed: [
        { key: 'extra_slot_1', name: '1个额外功能栏', desc: '重装提供额外1格功能栏空间', slotCount: 0 },
        { key: 'fine_heavy_armor', name: '优质重型护甲', desc: '抵抗物理伤害时护甲+2', slotCount: 0 },
      ],
      choices: [],
    },
    optional: [
      { key: 'hand_weapon', name: '单手武器', slots: 1, desc: '标准近战武器' },
      { key: 'heavy_weapon', name: '重型武器', slots: 1, desc: '双手巨剑或战锤' },
      { key: 'black_shot', name: '黑弹', slots: 1, desc: '对抗不死者时行动获得效力', roleOnly: ['soldier'] },
      { key: 'ammo', name: '弹药', slots: 1, desc: '额外弹药', roleOnly: ['soldier'] },
      { key: 'winter_clothes', name: '冬装', slots: 1, desc: '抵御严寒环境' },
      { key: 'oil', name: '油', slots: 1, desc: '可用于润滑、燃烧或照明', roleOnly: ['soldier'] },
      { key: 'rations', name: '兵粮', slots: 1, desc: '干粮与饮水', roleOnly: ['soldier'] },
      { key: 'medical_kit', name: '医疗套装', uses: 3, slots: 1, desc: '绷带与药品', roleOnly: ['soldier'] },
      { key: 'wrecking_kit', name: '破坏套装', slots: 1, desc: '撬棍、锤子和凿子' },
      { key: 'relic', name: '圣骸', slots: 1, desc: '降低腐化，抵抗腐化+1d' },
    ],
  },

  rookie: {
    light: {
      fixed: [
        { key: 'naive_hope', name: '天真的希望', desc: '新兵的乐观', slotCount: 0 },
        { key: 'hometown_souvenir', name: '家乡的纪念品', desc: '精神慰藉', slotCount: 0 },
        { key: 'soldier_kit', name: '士兵套装', desc: '基础行军装备', slotCount: 1 },
        { key: 'matchlock', name: '火绳枪', desc: '标准火绳枪', slotCount: 1 },
        { key: 'ammo', name: '弹药', uses: 5, slotCount: 1 },
      ],
      choices: [],
    },
    medium: {
      fixed: [
        { key: 'family_weapon', name: '家传武器', desc: '祖辈传下的武器', slotCount: 1 },
      ],
      choices: [
        {
          label: '中装装备选择',
          items: [
            { key: 'tent_camping', name: '帐篷&露营装备', desc: '野外露营用品', slotCount: 1 },
            { key: 'cooking_set', name: '烹饪套装', desc: '炊具与调料', slotCount: 1 },
          ],
        },
        {
          label: '食物选择',
          items: [
            { key: 'fresh_food', name: '新鲜食物', desc: '可口的热食', slotCount: 1 },
          ],
        },
      ],
    },
    heavy: {
      fixed: [
        { key: 'armor', name: '护甲', desc: '标准护甲', slotCount: 0 },
        { key: 'shield', name: '盾牌', desc: '标准盾牌', slotCount: 1 },
      ],
      choices: [],
    },
    optional: [
      { key: 'armor_opt', name: '护甲', slots: 1, desc: '额外护甲', roleOnly: ['rookie'] },
      { key: 'hand_weapon', name: '单手武器', slots: 1, desc: '标准近战武器' },
      { key: 'black_shot', name: '黑弹', slots: 1, desc: '对抗不死者时行动获得效力', roleOnly: ['rookie'] },
      { key: 'shield_opt', name: '盾牌', slots: 1, desc: '标准盾牌' },
      { key: 'winter_clothes', name: '冬装', slots: 1, desc: '抵御严寒环境' },
      { key: 'oil', name: '油', slots: 1, desc: '可用于润滑、燃烧或照明', roleOnly: ['rookie'] },
      { key: 'rations', name: '兵粮', slots: 1, desc: '干粮与饮水', roleOnly: ['rookie'] },
      { key: 'medical_kit', name: '医疗套装', uses: 3, slots: 1, desc: '绷带与药品', roleOnly: ['rookie'] },
      { key: 'climbing_set', name: '攀爬套装', slots: 1, desc: '绳索、抓钩与登山工具' },
      { key: 'relic', name: '圣骸', slots: 1, desc: '降低腐化，抵抗腐化+1d' },
    ],
  },

  scout: {
    light: {
      fixed: [
        { key: 'black_arrow', name: '黑箭', uses: 3, desc: '特制箭矢', slotCount: 1 },
        { key: 'fine_compass_map', name: '优质罗盘和地图', desc: '侦查行动效果等级+1', slotCount: 1 },
        { key: 'fine_bow', name: '优质弓箭', desc: '效果等级+1', slotCount: 1 },
      ],
      choices: [],
    },
    medium: {
      fixed: [
        { key: 'lens_set', name: '透镜组', desc: '观察远处', slotCount: 1 },
        { key: 'climbing_set', name: '攀爬套装', desc: '绳索、抓钩与登山工具', slotCount: 1 },
      ],
      choices: [
        {
          label: '中装圣骸',
          items: [
            { key: 'fine_relic', name: '优质圣骸', uses: 3, desc: '抵抗腐化+2d', slotCount: 1 },
          ],
        },
      ],
    },
    heavy: {
      fixed: [
        { key: 'camouflage', name: '伪装用品', desc: '隐蔽行动效果等级+1', slotCount: 1 },
        { key: 'fine_armor', name: '优质护甲', desc: '抵抗物理伤害时护甲+1', slotCount: 0 },
      ],
      choices: [],
    },
    optional: [
      { key: 'hand_weapon', name: '单手武器', slots: 1, desc: '标准近战武器' },
      { key: 'large_weapon', name: '大型武器', slots: 1, desc: '长柄武器或双手武器' },
      { key: 'black_shot', name: '黑弹', slots: 1, desc: '对抗不死者时行动获得效力', roleOnly: ['scout'] },
      { key: 'pistol', name: '手枪', slots: 1, desc: '标准手枪' },
      { key: 'ammo', name: '弹药', slots: 1, desc: '额外弹药', roleOnly: ['scout'] },
      { key: 'flare', name: '信号弹', uses: 3, slots: 1, desc: '求救或标记', roleOnly: ['scout'] },
      { key: 'rations', name: '兵粮', slots: 1, desc: '干粮与饮水', roleOnly: ['scout'] },
      { key: 'winter_clothes', name: '冬装', slots: 1, desc: '抵御严寒环境' },
      { key: 'soldier_kit', name: '士兵套装', slots: 1, desc: '行军必需品' },
      { key: 'relic', name: '圣骸', slots: 1, desc: '降低腐化，抵抗腐化+1d' },
    ],
  },
}

// 获取某职业的装备配置
export function getRoleGearConfig(roleKey: string): RoleGearConfig {
  return ROLE_GEAR_CONFIGS[roleKey] ?? ROLE_GEAR_CONFIGS.rookie
}

// 获取某负载下的默认装备（含选项）
export function getDefaultLoadout(roleKey: string, load: string): LoadoutConfig {
  const cfg = getRoleGearConfig(roleKey)
  return cfg[load as keyof RoleGearConfig] as LoadoutConfig || { fixed: [], choices: [] }
}

// 获取某职业的可选装备池
export function getRoleOptionalGear(roleKey: string): GearItem[] {
  return getRoleGearConfig(roleKey).optional
}

// 旧版兼容：获取某职业的装备池（可选池）
export function getRoleGearPool(roleKey: string): GearItem[] {
  return getRoleOptionalGear(roleKey)
}
