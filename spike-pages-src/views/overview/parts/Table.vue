<!-- 环形饼状图+右侧列表 -->
<template>
  <a-card :title="title">
    <a-table :columns="tableConfig.columns" :data-source="tableData" :pagination="false" :scroll="{ x: true }">
      <template #headerCell="{ title, column }">
        <template v-if="column.dataIndex === 'spikeNum'">
          <span>{{ title }}（{{ allSpikeNum }}）</span>
        </template>
      </template>
      <template #bodyCell="{ index, column }">
        <template v-if="column.dataIndex === 'theIndex'">
          {{ index + 1 }}
        </template>
      </template>
    </a-table>

    <div class="more" v-if="showMore" @click="onMore">{{ t('查看更多') }}</div>
  </a-card>
</template>

<script lang="ts" setup>
const { t } = useI18n()

const tableConfig = {
  columns: [
    {
      title: t('序号'),
      dataIndex: 'theIndex',
      width: 100,
      align: 'center'
    },
    {
      title: '患者名',
      dataIndex: 'megId',
    },
    {
      title: '文件名',
      dataIndex: 'fileName',
    },
    {
      title: '棘波时刻点数量',
      dataIndex: 'spikeNum',
      width: 280,
    },
  ],
}
interface IForm {
  megId: string
  fileName: string
  spikeNum: string
}

const tableData = ref<IForm[]>([])
const allSpikeNum = ref<number>(0) // 棘波时刻点数量 总数量

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  allData: {
    type: Array as PropType<IForm[]>,
    default: () => [],
  },
})

watch(() => props.allData, () => {
  getData()
})

const showMore = ref(false)
// 获取数据
function getData() {
  const data: any[] = props.allData || []
  if (data.length > 10) {
    showMore.value = true
    tableData.value = data.slice(0, 10)
  } else {
    showMore.value = false
    tableData.value = data || []
  }
  allSpikeNum.value = data.reduce((pre, cur) => {
    return pre + Number(cur.spikeNum || 0)
  }, 0)
}

function onMore() {
  showMore.value = false
  tableData.value = props.allData || []
}

</script>

<style lang="less" scoped>
:deep(.ant-card-head) {
  border: none;
  font-size: 22px;
  font-weight: 600;
  padding-top: 24px;
}

:deep(.ant-table) {
  font-size: 18px;
}

.more {
  color: var(--color-primary);
  font-size: 18px;
  text-align: center;
  margin-top: 22px;
  cursor: pointer;

  &:hover {
    font-weight: 600;
  }
}
</style>