<template>
  <LegionInfoBlock title="操作面板" icon="◈">
    <div class="space-y-4">
      <!-- ===== 指挥官 ===== -->
      <div v-if="role === 'commander'" class="space-y-4">
        <LegionInfoBlock title="发布任务" icon="◆" title-class="bg-field-bg border-b border-field-border">
          <div class="space-y-3">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs text-field-slate block mb-1">任务名称</label>
                <input v-model="form.name" class="input-field w-full text-sm" placeholder="例如：摧毁亡灵前哨" />
              </div>
              <div>
                <label class="text-xs text-field-slate block mb-1">任务类型</label>
                <select v-model="form.type" class="input-field w-full text-sm">
                  <option value="assault">突袭</option>
                  <option value="recon">侦察</option>
                  <option value="supply">补给</option>
                  <option value="religious">宗教</option>
                </select>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs text-field-slate block mb-1">地点</label>
                <input v-model="form.location" class="input-field w-full text-sm" placeholder="地点名称" />
              </div>
              <div>
                <label class="text-xs text-field-slate block mb-1">优先级</label>
                <select v-model="form.priority" class="input-field w-full text-sm">
                  <option value="primary">主要任务</option>
                  <option value="secondary">次要任务</option>
                </select>
              </div>
            </div>
            <button @click="submit('create_mission', form)" :disabled="submitting" class="btn-primary w-full text-sm">
              {{ submitting ? '处理中...' : '发布任务' }}
            </button>
          </div>
        </LegionInfoBlock>

        <LegionInfoBlock title="情报与时间" icon="◈" title-class="bg-field-bg border-b border-field-border">
          <div class="grid grid-cols-2 gap-3">
            <button @click="submit('spend_intel', { amount: 1, reason: '遭遇骰+1' })" class="btn-secondary text-sm">
              消费情报(+1骰)
            </button>
            <button @click="submit('advance_time')" class="btn-secondary text-sm">
              推进时间
            </button>
          </div>
        </LegionInfoBlock>
      </div>

      <!-- ===== 军士长 ===== -->
      <div v-if="role === 'marshal'" class="space-y-4">
        <LegionInfoBlock title="士气与遭遇" icon="◆" title-class="bg-field-bg border-b border-field-border">
          <div class="grid grid-cols-3 gap-3">
            <button @click="submit('adjust_morale', { delta: 1, reason: '庆祝胜利' })" class="btn-secondary text-sm">
              士气 +1
            </button>
            <button @click="submit('adjust_morale', { delta: -1, reason: '恐慌蔓延' })" class="btn-secondary text-sm">
              士气 -1
            </button>
            <button @click="submit('roll_encounter')" class="btn-secondary text-sm">
              投掷遭遇骰
            </button>
          </div>
        </LegionInfoBlock>
      </div>

      <!-- ===== 军需官 ===== -->
      <div v-if="role === 'quartermaster'" class="space-y-4">
        <LegionInfoBlock title="战役行动" icon="◆" title-class="bg-field-bg border-b border-field-border">
          <div class="grid grid-cols-2 gap-3">
            <button @click="submit('campaign_action', { action: 'get_resources' })" class="btn-secondary text-sm">
              获取资源
            </button>
            <button @click="submit('campaign_action', { action: 'rr' })" class="btn-secondary text-sm">
              放假(R&R)
            </button>
            <button @click="submit('campaign_action', { action: 'recruit' })" class="btn-secondary text-sm">
              募兵
            </button>
            <button @click="submit('campaign_action', { action: 'long_project' })" class="btn-secondary text-sm">
              长期项目
            </button>
          </div>
        </LegionInfoBlock>

        <LegionInfoBlock title="调整补给" icon="◈" title-class="bg-field-bg border-b border-field-border">
          <div class="flex gap-3">
            <input v-model.number="supplyForm.food" type="number" class="input-field flex-1 text-sm" placeholder="食物 ±" />
            <input v-model.number="supplyForm.supplies" type="number" class="input-field flex-1 text-sm" placeholder="补给 ±" />
            <button @click="submit('manage_supplies', { food: supplyForm.food, supplies: supplyForm.supplies })" class="btn-primary text-sm whitespace-nowrap">
              确认
            </button>
          </div>
        </LegionInfoBlock>
      </div>

      <!-- ===== 书记官 ===== -->
      <div v-if="role === 'lorekeeper'" class="space-y-4">
        <LegionInfoBlock title="记录编年史" icon="◆" title-class="bg-field-bg border-b border-field-border">
          <div class="space-y-3">
            <div>
              <label class="text-xs text-field-slate block mb-1">故事类型</label>
              <select v-model="chronicleForm.storyType" class="input-field w-full text-sm">
                <option value="founding">军团建立</option>
                <option value="independence">军团独立</option>
                <option value="tempered">战火淬炼</option>
                <option value="will">意志不屈</option>
                <option value="purpose">军团存在的意义</option>
              </select>
            </div>
            <div>
              <label class="text-xs text-field-slate block mb-1">内容</label>
              <textarea v-model="chronicleForm.content" class="input-field w-full text-sm" rows="3" placeholder="记录这个故事..."></textarea>
            </div>
            <div>
              <label class="text-xs text-field-slate block mb-1">效果（可选）</label>
              <input v-model="chronicleForm.effect" class="input-field w-full text-sm" placeholder="例如：所有听众+1认知XP" />
            </div>
            <button @click="submit('record_chronicle', chronicleForm)" :disabled="submitting" class="btn-primary w-full text-sm">
              {{ submitting ? '记录中...' : '记录编年史' }}
            </button>
          </div>
        </LegionInfoBlock>
      </div>

      <!-- ===== 间谍总管 ===== -->
      <div v-if="role === 'spymaster'" class="space-y-4">
        <LegionInfoBlock title="派遣间谍" icon="◆" title-class="bg-field-bg border-b border-field-border">
          <div class="space-y-3">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs text-field-slate block mb-1">间谍名</label>
                <input v-model="spyForm.spyName" class="input-field w-full text-sm" placeholder="间谍名称" />
              </div>
              <div>
                <label class="text-xs text-field-slate block mb-1">任务类型</label>
                <select v-model="spyForm.missionType" class="input-field w-full text-sm">
                  <option value="short">短期任务</option>
                  <option value="long">长期任务</option>
                </select>
              </div>
            </div>
            <div>
              <label class="text-xs text-field-slate block mb-1">备注</label>
              <input v-model="spyForm.note" class="input-field w-full text-sm" placeholder="任务详情..." />
            </div>
            <button @click="submit('spy_mission', spyForm)" :disabled="submitting" class="btn-primary w-full text-sm">
              {{ submitting ? '派遣中...' : '派遣间谍' }}
            </button>
          </div>
        </LegionInfoBlock>
      </div>

      <p v-if="errorMsg" class="text-field-red text-xs mt-2 text-center">{{ errorMsg }}</p>
    </div>
  </LegionInfoBlock>
</template>

<script setup lang="ts">
import type { LegionRoleDetail } from '~/composables/useLegionRoleData'

const props = defineProps<{
  role: string
  detail: LegionRoleDetail
  code: string
}>()

const emit = defineEmits<{
  action: []
}>()

const submitting = ref(false)
const errorMsg = ref('')

// 指挥官表单
const form = reactive({
  name: '',
  type: 'assault',
  location: '',
  priority: 'secondary',
})

// 军需官补给表单
const supplyForm = reactive({
  food: 0,
  supplies: 0,
})

// 书记官编年史表单
const chronicleForm = reactive({
  storyType: 'founding',
  content: '',
  effect: '',
})

// 间谍表单
const spyForm = reactive({
  spyName: '',
  missionType: 'short',
  note: '',
})

async function submit(actionType: string, data?: any) {
  submitting.value = true
  errorMsg.value = ''
  try {
    await $fetch(`/api/rooms/${props.code}/legion-action`, {
      method: 'POST',
      body: {
        role: props.role,
        actionType,
        data,
      },
    })
    emit('action')
    // 清空部分表单
    if (props.role === 'commander') {
      form.name = ''
      form.location = ''
    }
    if (props.role === 'lorekeeper') {
      chronicleForm.content = ''
      chronicleForm.effect = ''
    }
    if (props.role === 'spymaster') {
      spyForm.note = ''
    }
    if (props.role === 'quartermaster') {
      supplyForm.food = 0
      supplyForm.supplies = 0
    }
  } catch (e: any) {
    errorMsg.value = e.data?.statusMessage || '操作失败'
  } finally {
    submitting.value = false
  }
}
</script>
