<template>
  <div class="border border-field-border rounded overflow-hidden">
    <!-- 表头 -->
    <div class="grid gap-1 px-2 py-1.5 bg-field-bg-light border-b border-field-border text-xs text-field-gold font-medium"
      :style="{ gridTemplateColumns }">
      <span v-for="col in columns" :key="col.key">{{ col.label }}</span>
      <span v-if="showActions" class="text-right pr-1">操作</span>
    </div>
    <!-- 数据行 -->
    <div
      v-for="(row, ri) in rows" :key="ri"
      class="grid gap-1 px-2 py-1.5 text-sm items-center border-b border-field-border/50"
      :class="ri % 2 === 0 ? 'bg-field-bg' : 'bg-field-bg-light/50'"
      :style="{ gridTemplateColumns }"
    >
      <template v-for="col in columns" :key="col.key">
        <input
          v-if="col.type === 'text'"
          v-model="row[col.key]"
          class="bg-transparent text-field-paper text-sm outline-none placeholder-field-slate/50 w-full"
          :placeholder="col.placeholder || ''"
          @input="emitUpdate"
        >
        <input
          v-else-if="col.type === 'number'"
          v-model.number="row[col.key]"
          type="number"
          :min="col.min"
          :max="col.max"
          class="bg-transparent text-field-paper text-sm outline-none w-full text-center"
          @input="emitUpdate"
        >
        <div v-else-if="col.type === 'checkbox'" class="flex gap-1">
          <button
            v-for="ci in (col.checkboxCount || 3)"
            :key="ci"
            class="w-5 h-5 border rounded flex items-center justify-center transition-colors"
            :class="(row[col.key] || 0) >= ci ? 'bg-field-gold border-field-gold' : 'border-field-slate hover:border-field-gold'"
            @click="toggleCheckbox(row, col.key, ci)"
          />
        </div>
        <select
          v-else-if="col.type === 'select'"
          v-model="row[col.key]"
          class="bg-field-bg text-field-paper text-sm outline-none border border-field-border rounded px-1 py-0.5 w-full"
          @change="emitUpdate"
        >
          <option v-for="opt in (col.options || [])" :key="opt" :value="opt">{{ opt }}</option>
        </select>
        <span v-else class="text-field-paper">{{ row[col.key] }}</span>
      </template>
      <!-- 行操作 -->
      <div v-if="showActions" class="flex items-center justify-end gap-1">
        <button
          v-if="killable"
          class="w-5 h-5 border rounded flex items-center justify-center transition-colors text-[10px] text-field-slate hover:text-field-red hover:border-field-red hover:bg-field-red/10"
          title="阵亡"
          @click="killRow(ri, row)"
        >
          ☠
        </button>
        <button
          v-if="deletable"
          class="w-5 h-5 border rounded flex items-center justify-center transition-colors text-[10px] text-field-slate hover:text-field-red hover:border-field-red"
          title="删除"
          @click="deleteRow(ri)"
        >
          ✕
        </button>
      </div>
    </div>
    <!-- 添加行 -->
    <button
      v-if="addable"
      class="w-full py-1.5 text-xs text-field-slate hover:text-field-gold transition-colors border-t border-field-border"
      @click="addRow"
    >
      + 添加行
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface TableColumn {
  key: string
  label: string
  type?: 'text' | 'number' | 'checkbox' | 'display' | 'select'
  width?: string
  placeholder?: string
  checkboxCount?: number
  options?: string[]
  min?: number
  max?: number
}

const props = defineProps<{
  columns: TableColumn[]
  rows: Record<string, any>[]
  addable?: boolean
  deletable?: boolean
  killable?: boolean
}>()

const emit = defineEmits<{
  'update:rows': [rows: Record<string, any>[]]
  'deleteRow': [index: number]
  'killRow': [index: number, row: Record<string, any>]
}>()

const showActions = computed(() => props.deletable || props.killable)

const gridTemplateColumns = computed(() => {
  const cols = props.columns.map(c => c.width || '1fr')
  if (showActions.value) cols.push('auto')
  return cols.join(' ')
})

function toggleCheckbox(row: Record<string, any>, key: string, index: number) {
  const current = row[key] || 0
  row[key] = current >= index ? index - 1 : index
  emitUpdate()
}

function addRow() {
  const newRow: Record<string, any> = {}
  for (const col of props.columns) {
    if (col.type === 'checkbox') {
      newRow[col.key] = 0
    } else if (col.type === 'number') {
      newRow[col.key] = 0
    } else if (col.type === 'select') {
      newRow[col.key] = col.options?.[0] || ''
    } else {
      newRow[col.key] = ''
    }
  }
  emit('update:rows', [...props.rows, newRow])
}

function deleteRow(index: number) {
  const newRows = [...props.rows]
  newRows.splice(index, 1)
  emit('update:rows', newRows)
  emit('deleteRow', index)
}

function killRow(index: number, row: Record<string, any>) {
  const newRows = [...props.rows]
  newRows.splice(index, 1)
  emit('update:rows', newRows)
  emit('killRow', index, row)
}

function emitUpdate() {
  emit('update:rows', [...props.rows])
}
</script>
