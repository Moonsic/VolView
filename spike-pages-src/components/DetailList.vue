<template>
  <a-descriptions bordered :column="props.column" :labelStyle="{ width: props.labelWidth, textAlign: 'right' }" v-bind="$attrs">
    <a-descriptions-item v-for="(item, index) in detailList" :key="index" :label="item.label" :span="item.span">
      <template v-if="item.options">
        <template v-if="(item.options instanceof Array)">
          {{ item.options.find(f => f.value === item.value)?.label }}
        </template>
        <template v-else>
          {{ item.options[item.value] }}
        </template>
      </template>
      <template v-else-if="item.type === 'date'">
        {{ item.value ? formatDate(item.value, item.format || 'YYYY-MM-DD hh:mm:ss') : '' }}
      </template>
      <template v-else>
        {{ item.value }}
      </template>
    </a-descriptions-item>
  </a-descriptions>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { formatDate } from '@u/utils'

const props = defineProps({
  column: {
    type: Number,
    default: 1,
  },
  // 左侧名称宽度
  labelWidth: {
    type: String,
    default: '150px',
  },
  detailList: {
    type: Array as PropType<IDetailList[]>,
    default: () => [],
  },
})

// DetailList组件
interface IDetailList {
  label: string // 左侧名称
  key: string // key
  value?: any // 右侧值
  span?: number // 占位
  options?: { label: string, value: string | number }[] | IAnyObject // 选项列表
  type?: string // 'date'
  format?: string // 当type='date'时，时间的显示格式，默认值'YYYY-MM-DD hh:mm:ss'
}


</script>