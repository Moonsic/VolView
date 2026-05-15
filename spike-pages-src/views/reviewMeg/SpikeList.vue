<template>
  <div class="list-page">
    <div class="list-title flex-between">
      <div class="flex">
        {{ t('算法检测棘波列表') }}
        <IconReload class="reload-icon ml8" v-if="curData.filePath" :title="t('刷新')" @click="onSearch" />
        <IconSwap class="reload-icon ml8" v-if="curData.filePath" :title="t('批量删除或恢复')" @click="onTurnNegativeAll()" />
      </div>
      <IconDown class="down-icon" :style="{ transform: showList ? '' : 'rotate(-90deg)' }" @click="clickMenu" />
    </div>

    <div class="search-list" v-if="showList">
      <a-select class="flex-1 mr4" v-if="showType === 'time'" v-model:value="form.brainRegion"
        :options="brainRegionList" :placeholder="t('选择脑区')" allowClear @change="changeBrainRegion" />

      <a-select class="flex-1 mr4" v-if="showType === 'cluster'" v-model:value="form.clType"
        :options="props.clusterTypeList" :placeholder="t('聚类分类')" allowClear @change="changeClType" />

      <a-input-number class="flex-1 mr4" v-model:value="form.threshold" ref="thresholdRef" :placeholder="t('填写阈值')" :min="0"
        :step="0.1" @blur="blurThreshold" @pressEnter="pressEnterThreshold" />

      <a-tooltip placement="right" overlayClassName="very-big-z-index">
        <template #title> {{ showType === 'time' ? t('切换到按聚类排序') : t('切换到按时间排序') }} </template>

        <a-button class="flex-12" v-if="showType === 'cluster'" type="default" size="small"
          @click="switchShowType('time')">
          <ClockCircleOutlined />
        </a-button>
        <a-button class="flex-12" v-if="showType === 'time'" type="default" size="small"
          @click="switchShowType('cluster')">
          <DotChartOutlined />
        </a-button>
      </a-tooltip>
    </div>
    <div class="search-list" v-if="showList && showType === 'cluster' && isAllMode && tableData.length">
      <a-button class="flex-12" v-if="showType === 'cluster'" type="default" size="small" @click="setClusterSlResult()">
        {{ t('查看聚类溯源结果') }}
      </a-button>
    </div>

    <div v-if="showList">
      <a-table class="table-list" rowKey="id" size="small" :columns="tableColumns" :data-source="tableData"
        :loading="loading" :pagination="false" :scroll="{ x: true }" :rowClassName="rowClassName" :customRow="customRow"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: selectTable,
        }" @change="changeTable">
        <template #bodyCell="{ record, column }">
          <template v-if="column.dataIndex === 'spikeTime'">
            <div class="flex-end">
              <span>{{ record.spikeTime.toFixed(3) }}</span>
              <span class="brain">{{ record.brainRegion }}</span>
            </div>
          </template>
          <template v-if="column.dataIndex === 'modelScore'">
            <div class="flex-between">
              <span class="flex-5">{{ record.modelScore.toFixed(3) }}</span>
              <div class="flex-4 flex-start">
                <a-tooltip placement="right" overlayClassName="very-big-z-index">
                  <IconRedo class="color-t5" v-if="record.positive != 1" @click.stop="onTurnNegative(record)" />
                  <IconDelete class="color-red" v-if="record.positive === 1" @click.stop="onTurnNegative(record)" />
                  <template #title> {{ record.positive === 1 ? t('删除') : t('恢复') }} </template>
                </a-tooltip>

                <a-tooltip placement="right" overlayClassName="very-big-z-index" v-if="record.positive === 1">
                  <FileAddOutlined class="ml8 color-blue" v-if="record.inReport !== 1"
                    @click.stop="onAddToReport(record)" />
                  <IconRedo class="ml8 color-t5" v-if="record.inReport === 1"
                    @click.stop="onDeleteFromReport(record)" />
                  <template #title> {{ record.inReport === 1 ? t('从报告中删除') : t('添加到报告') }} </template>
                </a-tooltip>
              </div>
            </div>
          </template>

          <template v-if="column.dataIndex === 'operation'">
          </template>
        </template>
      </a-table>

      <a-pagination class="mr8 mb8" v-if="tableData.length > 0" v-model:current="pageNum" v-model:pageSize="pageSize"
        :total="total" size="small" :showSizeChanger="false" :showLessItems="true" @change="changePage" />
    </div>

  </div>

  <NoteModal ref="noteModalRef" :subjectId="props.subjectId" :fifFilePath="curData.filePath" :isManual="false" />

</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { confirmModal } from '@u/modal'
// 脑区列表
import { brainRegionList } from '@u/data'

import NoteModal from './modal/NoteModal.vue'

import {
  spikeListApi,    // 5. 棘波检测列表，分页。脑区和tag是固定的
  turnNegativeApi, // 6. 转换
  getAlgClusterSpikeTimeListApi, // 45.  分页查询算法结果列表
  addSpikeToReportApi, // 47.  将时刻点添加到报告中
  cancelSpikeInReportApi // 48.  将时刻点从报告中取消
} from '@/api/meg'

const { t } = useI18n()

const props = defineProps({
  subjectId: {
    type: String,
    default: '',
  },
  isAllMode: {
    type: Boolean,
    default: false,
  },
  clusterTypeList: {
    type: Array as PropType<any[]>,
    default: () => [],
  }
})

const emit = defineEmits(['getCurSpike', 'pressEnterThreshold', 'getClusterTypeList', 'setClusterSlResult'])

const showList = ref<boolean>(true)

// 点击标题
function clickMenu() {
  showList.value = !showList.value
}

const form = reactive<any>({
  brainRegion: null, // 脑区
  threshold: null,   // 阈值
  clType: null, // 聚类分类
})

// 修改脑区
function changeBrainRegion(e: any) {
  onSearch()
}

function changeClType(e: any) {
  onSearch()
}

function changeThreshold(e: any) {
  if (enter) {
    emit('pressEnterThreshold', e.target.value)
  }
}

const thresholdRef = ref(null)
let enter = false // 按了enter键

// 修改阈值
function blurThreshold() {
  if (enter) {
    enter = false
  } else {
    onSearch()
  }
}

// 在算法检测棘波列表的阈值输入框按下Enter键，会触发它的getData()方法，并会阻止useKeyUp()事件
function pressEnterThreshold() {
  enter = true
  emit('pressEnterThreshold')
  onSearch()
  thresholdRef.value.blur()
}

const tableData = ref<any[]>([]) // 列表
const loading = ref<boolean>(false)
const total = ref<number>(0)
const pageNum = ref<number>(1)
const pageSize = ref<number>(10)

// 如果标记线和当前选中的不一样，就清掉选中的
function setRedLineValue(value: number) {
  if (curSpike.value.spikeTime !== value) {
    curSpike.value = {}
  }
}

const curData = ref<any>({})

function setData(item: any) {
  curData.value = item
  onSearch()
}

// 刷新
function onSearch() {
  tableData.value = []
  total.value = 0
  changePage(1, 10)
  showList.value = true
}

// 排序参数
const orderField = ref<string>(null) // 传 createTime | megId | subjectName
const order = ref<string>(null)  // 传 asc | desc

// 处理表格变化（分页、排序、筛选），现在只有排序
function changeTable(pagination: any, filters: any, sorter: any) {
  // 取消排序时，就清空排序条件
  if (!sorter.order) {
    orderField.value = null
    order.value = null
  } else {
    orderField.value = sorter.field
    order.value = sorter.order === 'ascend' ? 'asc' : 'desc'
  }
  onSearch()
}

// 获取数据
async function getData() {
  if (!curData.value.filePath) {
    return
  }
  selectTable([], []) // 先取消选中数据

  if (showType.value === 'time') {

    const params: any = {
      subjectId: props.subjectId,
      filePath: curData.value.filePath,
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      brainRegion: form.brainRegion,
      thr: form.threshold ? String(form.threshold) : null,
    }
    // 排序参数
    if (orderField.value) {
      params.orderField = orderField.value
      params.order = order.value
    }
    loading.value = true
    const { code, data } = await spikeListApi(params)
    loading.value = false
    if (code === 200) {
      tableData.value = data?.records?.map((item: any) => {
        return {
          ...item,
          spikeTime: parseFloat(Number(item.spikeTime).toFixed(3)),
          modelScore: parseFloat(Number(item.modelScore).toFixed(3)),
        }
      }) || []
      total.value = data?.total || 0
    }
  } else {

    const params: any = {
      subjectId: props.subjectId,
      fifFilePath: curData.value.filePath,
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      className: form.clType,
      thr: form.threshold ? String(form.threshold) : null,
    }
    // 排序参数
    if (orderField.value) {
      params.orderField = orderField.value
      params.order = order.value
    }
    loading.value = true
    const { code, data } = await getAlgClusterSpikeTimeListApi(params)
    loading.value = false
    if (code === 200) {
      tableData.value = data?.records?.map((item: any) => {
        return {
          ...item,
          spikeTime: parseFloat(Number(item.spikeTime).toFixed(3)),
          modelScore: parseFloat(Number(item.modelScore).toFixed(3)),
        }
      }) || []
      total.value = data?.total || 0
    }
  }

}
// {
//     "id": "b7bc5f38-5207-11ee-b7a5-3cecefaf2582",
//     "spikeTime": "160.896",
//     "brainRegion": "LT",
//     "positive": 1,
//     "type": 1,
//     "modelScore": "0.5341334613886747"
// }


function getPopconfirmTitle(record: any) {
  return record.positive === 1 ?
    `确定将时刻点【${record.spikeTime.toFixed(3)}】标记为非棘波点吗？`
    : `确定将时刻点【${record.spikeTime.toFixed(3)}】转换为棘波点吗？`
}

// 点击转换
async function onTurnNegative(item: any) {
  const params = {
    id: item.id
  }
  const { code, msg } = await turnNegativeApi(params)
  if (code === 200) {
    message.success(msg)
    getData()
  }
}


async function onAddToReport(record: any) {
  const params = {
    spikeId: record.id,
    isAlg: true
  }
  const { code, msg } = await addSpikeToReportApi(params)
  if (code === 200) {
    message.success(msg + t('！提示: 典型时刻点有更新，请在溯源发起页面点击【生成报告】重新生成'))
    getData()
  }
}

async function onDeleteFromReport(record: any) {
  const params = {
    spikeId: record.id,
    isAlg: true
  }
  const { code, msg } = await cancelSpikeInReportApi(params)
  if (code === 200) {
    message.success(msg)
    getData()
  }
}

// 修改页码
function changePage(num: number, size: number) {
  pageNum.value = num
  pageSize.value = size
  getData()
}

const tableColumns = [
  {
    title: t('时刻点/脑区'),
    dataIndex: 'spikeTime',
    // width: 80,
  },
  {
    title: t('模型置信度'),
    dataIndex: 'modelScore',
    // width: 56,
    // width: 90,
    align: 'center',
    sorter: true
  },
  // {
  //   title: '',
  //   dataIndex: 'operation',
  //   width: 46,
  //   // align: 'center',
  // },
]
const selectedRowKeys = ref<string[]>([])
const selectedRows = ref<any[]>([])

// 表格勾选
function selectTable(rowKeys: string[], rows: any[]) {
  selectedRowKeys.value = rowKeys
  selectedRows.value = rows
}

// 激活状态
function rowClassName(record: any) {
  return {
    // 'table-tr': true,
    'colorGray': !record.positive,
    'active': record.id === curSpike.value.id
  }
}

const curSpike = ref<any>({})

const noteModalRef = ref(null)
// 点击表格一行
function customRow(record: any) {
  return {
    onClick: (event: any) => {
      curSpike.value = record
      emit('getCurSpike', record)
    },
    onContextmenu: (event: any) => {
      noteModalRef.value.showModal(record)
    }
  }
}

function onTurnNegativeAll() {
  if (!selectedRowKeys.value.length) {
    return message.info(t('请先选择时刻点'))
  }

  const pList: any[] = []
  // pList.push(h('div', { class: 'mb16' }, '确定将以下时刻点标记为非棘波点吗？'))
  selectedRows.value.forEach((item) => {
    pList.push(h('div', {
      style: {
        padding: '6px 16px 6px 12px',
        margin: '6px 12px 0 0',
        background: 'var(--color-bg-gray)',
        borderRadius: '8px',
        display: 'flex'
      }
    }, [
      h('span', { class: 'flex-3' }, `${item.spikeTime.toFixed(3)}`),
      h('span', { class: 'flex-2 color-t4' }, `${item.brainRegion}`),
      h('span', { class: 'flex-2 color-t4' }, `${item.modelScore.toFixed(3)}`),
      h('span', { class: 'flex-2 text-center' }, `${item.positive === 1 ? t('删除') : t('恢复')}`),
    ]))
  })


  confirmModal(t('确认操作？'), h('div', { class: 'break-all' }, pList), () => {
    let successNum = 0 // 成功数量

    selectedRows.value.map(async (item, index) => {
      const params = {
        id: item.id
      }
      const { code, msg } = await turnNegativeApi(params)
      successNum += 1 // 不管成功还是失败都要加1
      if (code === 200) {
        // 都删除完了再刷新页面
        if (successNum === selectedRows.value.length) {
          message.success(msg)
          onSearch()
        }
      }
    })


  })
}


// 名称显示类型
const showType = ref<'time' | 'cluster'>('time')
// 切换
function switchShowType(type: 'time' | 'cluster') {
  showType.value = type
  if (showType.value === 'time') {
    form.clType = null
    onSearch()
  } else {
    form.brainRegion = null
    if (props.clusterTypeList.length) {
      // 说明有值，有值就默认选中第一个
      form.clType = props.clusterTypeList[0].value
      onSearch()
    } else {
      emit('getClusterTypeList')
    }

  }

}

function setClusterTypeList() {
  if (showType.value === 'cluster') {
    if (props.clusterTypeList.length) {
      // 说明有值，有值就默认选中第一个
      form.clType = props.clusterTypeList[0].value
      onSearch()
    } else {
      form.clType = null
      tableData.value = []
      total.value = 0
      selectedRowKeys.value = []
      selectedRows.value = []
    }
  }
}


function clearData() {
  form.clType = null
  showType.value = 'time'
}

async function setClusterSlResult() {
  const params: any = {
    subjectId: props.subjectId,
    fifFilePath: curData.value.filePath,
    pageNum: 1,
    pageSize: 1000,
    className: form.clType,
    thr: form.threshold ? String(form.threshold) : null,
  }
  // 排序参数
  if (orderField.value) {
    params.orderField = orderField.value
    params.order = order.value
  }
  loading.value = true
  const { code, data } = await getAlgClusterSpikeTimeListApi(params)
  loading.value = false
  if (code === 200) {
    const list = data?.records?.map((item: any) => {
      return {
        ...item,
        spikeTime: parseFloat(Number(item.spikeTime).toFixed(3)),
      }
    }) || []
    emit('setClusterSlResult', list)
  }
}

// 暴露方法
defineExpose({
  showType,
  setData,
  clearData,
  setRedLineValue,
  setClusterTypeList
})

</script>

<style lang="less" scoped>
.list-title {
  color: #fff;
  background: var(--color-title-bg-green);
}

:deep(.search-list) {
  display: flex;
  align-items: center;
  margin: 8px;

  .ant-select {
    width: 45%; // 适配英文
  }

}


// flex-center pt8 pr8 pl8 pb8

:deep(.table-list) {
  margin: 0 8px;

  .ant-table-cell {
    padding: 6px 0px !important;
  }

  .ant-table-selection-column {
    width: 32px;
    padding: 0 !important;
  }

  .ant-table-thead>tr>th {
    font-weight: 500;
    color: var(--color-gray);
    background: var(--color-primary-005);

    &::before {
      display: none;
    }

    .ant-table-column-sorter {
      margin-right: 8px;
    }
  }

  .ant-table-tbody tr {
    cursor: pointer;

    // 激活状态（激活在td上解决移出闪烁问题，!important解决active被hover覆盖问题）
    &.active td {
      background: var(--color-primary-02) !important;
    }

    .brain {
      width: 18px;
      margin-left: 8px;
      margin-right: 6px;
      font-size: 12px;
      font-weight: 600;
      color: blueviolet;
    }

    &.colorGray {
      color: var(--color-t5);

      .brain {
        color: rgba(138, 43, 226, 0.5);
      }
    }

  }

}

:deep(.ant-pagination) {}

// .list {
//   width: 100%;
//   padding: 0 8px;
//   font-size: 14px;

//   .header,
//   .item {
//     height: 34px;
//     padding: 0 8px;
//     display: flex;
//     align-items: center;
//     border-radius: 4px;

//     >div {
//       text-align: center;

//       &:nth-child(1) {
//         width: 50%;
//         text-align: left;
//         padding-left: 8px;
//       }

//       &:nth-child(2) {
//         width: 30%;
//       }

//       &:nth-child(3) {
//         width: 20%;
//       }
//     }
//   }

//   .header {
//     font-weight: 500;
//     color: var(--color-gray);
//     background: var(--color-primary-005);
//   }

//   .item {
//     cursor: pointer;
//     border-bottom: var(--border);

//     &:hover {
//       background: var(--hover-bg-blue);
//     }

//     .brain {
//       margin-left: 6px;
//       font-size: 12px;
//       font-weight: 600;
//       color: blueviolet;
//     }

//     &.colorGray {
//       color: var(--color-t5);

//       .brain {
//         color: rgba(138, 43, 226, 0.5);
//       }
//     }

//   }

// }</style>
