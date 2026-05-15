<template>
  <div class="list-page">
    <div class="list-title flex-between">
      <div class="flex-center">
        {{ t('手动标注列表') }}
        <IconReload class="reload-icon ml8" v-if="curData.filePath" :title="t('刷新')" @click="onReload" />
        <IconUpload class="reload-icon text-14 ml8" v-if="curData.filePath"
          :title="t('导入数据，支持fif、txt、csv、evl、bdip格式，导入文件的数据格式可以参考导出文件。')" @click="clickUpload" />
        <IconDelete class="reload-icon ml8" v-if="curData.filePath" :title="t('全部删除或批量删除（可跨页多选）')"
          @click="confirmDeleteBatch()" />
      </div>
      <IconDown class="down-icon" :style="{ transform: showList ? '' : 'rotate(-90deg)' }" @click="clickMenu" />
    </div>


    <div class="search-list" v-if="showList">
      <a-select class="flex-1 mr4" v-if="showType === 'time'" v-model:value="form.brainRegion"
        :options="brainRegionList" :placeholder="t('选择脑区')" allowClear @change="changeBrainRegion" />

      <a-select class="flex-1 mr4" v-if="showType === 'cluster'" v-model:value="form.clType"
        :options="props.clusterTypeList" :placeholder="t('聚类分类')" allowClear @change="changeClType" />

      <!-- <a-input-number class="flex-1 mr4" v-model:value="form.threshold" ref="thresholdRef" placeholder="填写阈值" :min="0"
        :step="0.1" @blur="blurThreshold" @pressEnter="pressEnterThreshold" /> -->

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


    <div v-if="showList">
      <a-table class="table-list" rowKey="id" size="small" :columns="tableColumns" :data-source="tableData"
        :loading="loading" :pagination="false" :scroll="{ x: true }" :rowClassName="rowClassName" :customRow="customRow"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: selectTable,
        }">
        <template #bodyCell="{ record, column }">
          <template v-if="column.dataIndex === 'timeLabel'">
            <div class="flex-end">
              <span>{{ record.timeLabel }}</span>
              <span class="brain">{{ record.brainRegion }}</span>
            </div>
          </template>
          <template v-if="column.dataIndex === 'spikeTypeLabel'">
            <span class="text-13">{{ record.spikeTypeLabel }}</span>
          </template>
          <template v-if="column.dataIndex === 'operation'">
            <a-popconfirm  overlayClassName="very-big-z-index" :title="t('确认删除') + '？'" placement="right" :ok-text="t('确定')" :cancel-text="t('取消')"
              @confirm="confirmDelete(record)">
              <IconDelete class="color-red text-14" :title="t('删除')" @click.stop.prevent />
            </a-popconfirm>

            <a-tooltip placement="right" overlayClassName="very-big-z-index">
              <FileAddOutlined class="ml8 color-blue" v-if="record.inReport !== 1"
                @click.stop="onAddToReport(record)" />
              <IconRedo class="ml8 color-t5" v-if="record.inReport === 1" @click.stop="onDeleteFromReport(record)" />
              <template #title> {{ record.inReport === 1 ? t('从报告中删除') : t('添加到报告') }} </template>
            </a-tooltip>

          </template>
        </template>
      </a-table>

      <a-pagination class="mr8 mb8" v-if="tableData.length > 0" v-model:current="pageNum" v-model:pageSize="pageSize"
        :total="total" size="small" :showSizeChanger="false" :showLessItems="true" @change="changePage" />
    </div>
  </div>

  <UploadFile ref="uploadFileRef" accept=".fif,.txt,.csv,.evl,.bdip" @success="fileSelected" />

  <NoteModal ref="noteModalRef" :subjectId="props.subjectId" :fifFilePath="curData.filePath" :isManual="true" />

</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { confirmDeleteModal } from '@u/modal'
// 棘波类型列表
import { brainRegionList, spikeTypeList } from '@u/data'

import UploadFile from '@c/UploadFile.vue'
import NoteModal from './modal/NoteModal.vue'

import {
  getManualSpikeListApi, // 获取手动标注棘波的列表
  deleteManualSpikeApi,  // 删除手动标记的棘波
  deleteManualSpikeBatchApi,  // 批量删除手动标记的棘波
  importEventApi,        // 30.  导入手动标注点文件
  getManualClusterSpikeTimeListApi, // 获取手动聚类时间列表
  addSpikeToReportApi, // 47.  将时刻点添加到报告中
  cancelSpikeInReportApi // 48.  将时刻点从报告中取消
} from '@/api/meg'

const { t } = useI18n()

const props = defineProps({
  subjectId: {
    type: String,
    default: '',
  },
  clusterTypeList: {
    type: Array as PropType<any[]>,
    default: () => [],
  }
})

const emit = defineEmits(['getCurSpike', 'deleteSpike', 'getClusterTypeList'])

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
  onReload()
}

function changeClType(e: any) {
  onReload()
}

const tableColumns = [
  {
    title: t('时间点/脑区'),
    dataIndex: 'timeLabel',
  },
  {
    title: t('类型'),
    dataIndex: 'spikeTypeLabel',
    width: 66,
    align: 'center',
  },
  {
    title: '',
    dataIndex: 'operation',
    width: 46,
  },
]
const tableData = ref<any[]>([]) // 列表
const loading = ref<boolean>(false)
const total = ref<number>(0)
const pageNum = ref<number>(1)
const pageSize = ref<number>(10)
const selectedRowKeys = ref<string[]>([])
const selectedRows = ref<any[]>([])

const selectedRowKeysAll = ref<string[]>([])  // 跨页所有选中项的ID
const selectedRowsAll = ref<any[]>([])        // 跨页所有选中项完整数据


// 如果标记线和当前选中的不一样，就清掉选中的
function setRedLineValue(value: number) {
  if (curSpike.value.startTime !== value) {
    curSpike.value = {}
  }
}

const curData = ref<any>({})

function setData(item: any) {
  curData.value = item
  onReload()
}

// 刷新
function onReload() {
  tableData.value = []
  total.value = 0
  changePage(1, 10)
  showList.value = true
  selectedRowKeysAll.value = []
  selectedRowsAll.value = []
}

// 获取数据
async function getData() {
  if (!curData.value.filePath) {
    return
  }
  selectedRowKeys.value = [] // 先取消选中数据。selectTable([], [])这种方式在跨页不行了
  selectedRows.value = []

  if (showType.value === 'time') {
    const params = {
      subjectId: props.subjectId,
      filePath: curData.value.filePath,
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      brainRegion: form.brainRegion,
    }
    loading.value = true
    const { code, data } = await getManualSpikeListApi(params)
    loading.value = false
    if (code === 200) {
      tableData.value = data.records?.map((item: any) => {
        return {
          ...item,
          spikeTypeLabel: spikeTypeList.find(f => f.value === item.spikeType)?.label || '',
          startTime: parseFloat(item.startTime), // startTime: number
          timeLabel: item.endTime ? item.startTime + '-' + item.endTime : item.startTime, // timeLabel: string
        }
      })
      total.value = data.total || 0

      // 从全局选中列表中恢复当前页选中状态
      selectedRowKeys.value = tableData.value
        .map(item => item.id)
        .filter(id => selectedRowKeysAll.value.includes(id))

    }
  } else {

    const params = {
      subjectId: props.subjectId,
      fifFilePath: curData.value.filePath,
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      className: form.clType,
    }
    loading.value = true
    const { code, data } = await getManualClusterSpikeTimeListApi(params)
    loading.value = false
    if (code === 200) {
      tableData.value = data.records?.map((item: any) => {
        return {
          ...item,
          spikeTypeLabel: spikeTypeList.find(f => f.value === item.spikeType)?.label || '',
          startTime: parseFloat(item.startTime), // startTime: number
          timeLabel: item.endTime ? item.startTime + '-' + item.endTime : item.startTime, // timeLabel: string
        }
      })
      total.value = data.total || 0

      // 从全局选中列表中恢复当前页选中状态
      selectedRowKeys.value = tableData.value
        .map(item => item.id)
        .filter(id => selectedRowKeysAll.value.includes(id))

    }
  }
}

// {
//     "id": "75f17b3f-8204-11ee-ae2b-7486e21ad510",
//     "startTime": "19.728",
//     "endTime": null,
//     "spikeType": 1
// }

// 激活状态
function rowClassName(record: any) {
  return {
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
      // console.log('record :>> ', record);
      emit('getCurSpike', record)
    },
    onContextmenu: (event: any) => {
      noteModalRef.value.showModal(record)
    }
  }
}

// 表格勾选
function selectTable(rowKeys: string[], rows: any[]) {
  selectedRowKeys.value = rowKeys
  selectedRows.value = rows


  // 合并当前页选中项（自动去重）
  selectedRowKeysAll.value = [
    ...selectedRowKeysAll.value,
    ...rowKeys
  ].filter((v, i, arr) => arr.indexOf(v) === i) // 数组去重

  // 合并完整数据（防重复）
  selectedRowsAll.value = [
    ...selectedRowsAll.value,
    ...rows.filter(row =>
      !selectedRowsAll.value.some(r => r.id === row.id)
    )
  ]

  // 处理取消选择的项（仅当前页）
  const unselectedKeys = selectedRowKeysAll.value
    .filter(key =>
      tableData.value.some(item => item.id === key) && // 属于当前页
      !rowKeys.includes(key)  // 被取消选择
    )

  selectedRowKeysAll.value = selectedRowKeysAll.value
    .filter(key => !unselectedKeys.includes(key))
  selectedRowsAll.value = selectedRowsAll.value
    .filter(row => !unselectedKeys.includes(row.id))

}

// 确定删除
async function confirmDelete(item: any) {
  const params = {
    id: item.id
  }
  const { code, msg } = await deleteManualSpikeApi(params)
  if (code === 200) {
    message.success(msg)
    if (pageNum.value > 1 && (pageSize.value === 1 || total.value % pageSize.value === 1)) {
      pageNum.value--
    }
    getData()
    // 如果点就在当前图中，就获取新的棘波点
    emit('deleteSpike', item)
  }
}

// 全部删除 或 批量删除
function confirmDeleteBatch() {
  if (!total.value) {
    return message.info(t('暂无数据可删'))
  }
  if (!selectedRowKeysAll.value.length) {
    confirmDeleteModal(t('删除'), `${t('确定删除所有手动标注棘波时刻点吗？')}（${total.value}${t('个')}）`, async () => {
      const params: any = {
        subjectId: props.subjectId,
        fifFilePath: curData.value.filePath,
        ids: []
      }
      const { code, msg } = await deleteManualSpikeBatchApi(params)
      if (code === 200) {
        message.success(msg)
        pageNum.value = 1
        selectedRowKeysAll.value = []
        selectedRowsAll.value = []
        getData()
      }
    })
    return
  }

  // 以前把序号、类型也展示出来了，数据太多弹窗就太长了
  // const pList: any[] = []
  // selectedRowsAll.value.forEach((item, index) => {
  //   pList.push(h('div', {
  //     class: 'item',
  //   }, [
  //     h('span', { class: 'flex-1 color-t4' }, `${index + 1}`),
  //     h('span', { class: 'flex-3' }, `${item.timeLabel}`),
  //     h('span', { class: 'flex-2 color-t4' }, `${item.spikeTypeLabel}`),
  //   ]))
  // })

  const pList: any[] = []
  selectedRowsAll.value.forEach((item, index) => {
    pList.push(h('div', {
      class: 'item',
    }, `${item.timeLabel}`))
  })


  confirmDeleteModal(`${t('批量删除')}？（${selectedRowsAll.value.length}）`, h('div', { class: 'manual-delete-confirm-modal' }, pList), async () => {
    const params = {
      subjectId: props.subjectId,
      fifFilePath: curData.value.filePath,
      ids: selectedRowKeysAll.value
    }
    const { code, msg } = await deleteManualSpikeBatchApi(params)
    if (code === 200) {
      message.success(msg)

      // 这种方式万能
      // 计算删除后的总数
      const newTotal = total.value - selectedRowKeysAll.value.length
      // 计算删除后的最大页码
      const maxPage = Math.ceil(newTotal / pageSize.value)
      // 校正越界页码，如果当前页码大于最大页码，则将页码设置为最大页码（除非全删了变成1）
      if (pageNum.value > maxPage) {
        pageNum.value = maxPage > 0 ? maxPage : 1
      }

      // 这种方式不能跨页删除
      // // 原有逻辑（处理末页余数删除）
      // const lastLength = total.value % pageSize.value
      // const deleteNum = selectedRowKeysAll.value.length
      // if (pageNum.value > 1 && (deleteNum === pageSize.value || deleteNum === lastLength)) {
      //   pageNum.value--
      // }


      // 先计算新的pageNum.value，再清空All[]
      selectedRowKeysAll.value = []
      selectedRowsAll.value = []

      getData()
      // 如果点就在当前图中，就获取新的棘波点
      // emit('deleteSpike', item)
    }
  })
}

// 修改页码
function changePage(num: number, size: number) {
  pageNum.value = num
  pageSize.value = size
  getData()
}

const uploadFileRef = ref()
function clickUpload() {
  uploadFileRef.value.upload()
}

async function fileSelected(file: File) {
  const params: any = new FormData()

  params.append('subjectId', props.subjectId)
  params.append('fifFilePath', curData.value.filePath)    // 文件路径（含文件名）
  params.append('files', file)  // 当前文件

  const { code, msg } = await importEventApi(params)
  if (code === 200) {
    message.success(msg)
    onReload()
  }

}


// 名称显示类型
const showType = ref<'time' | 'cluster'>('time')
// 切换
function switchShowType(type: 'time' | 'cluster') {
  showType.value = type
  if (showType.value === 'time') {
    form.clType = null
    onReload()
  } else {
    form.brainRegion = null
    if (props.clusterTypeList.length) {
      // 说明有值，有值就默认选中第一个
      form.clType = props.clusterTypeList[0].value
      onReload()
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
      onReload()
    } else {
      form.clType = null
      tableData.value = []
      total.value = 0
      selectedRowKeysAll.value = []
      selectedRowsAll.value = []
      selectedRowKeys.value = []
      selectedRows.value = []
    }
  }
}

async function onAddToReport(record: any) {
  const params = {
    spikeId: record.id,
    isAlg: false
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
    isAlg: false
  }
  const { code, msg } = await cancelSpikeInReportApi(params)
  if (code === 200) {
    message.success(msg)
    getData()
  }
}

function clearData() {
  form.clType = null
  showType.value = 'time'
}


// 传入时间，看看时间是否在当前表格页的范围内，在就刷新当前页面
// 成功点击类型，点击的或者快捷键都都算，要刷新手动标注列表，如果是最后一页必须刷新，其他页的要在范围内
function giveTimeToRefresh(time: string) {
  if (showType.value !== 'time') return

  const target = parseFloat(time)
  if (isNaN(target)) return

  if (tableData.value.length === 0) {
    getData()
    return
  }

  const startTimes = tableData.value.map(x => x.startTime)
  const min = Math.min(...startTimes)
  const max = Math.max(...startTimes)

  const currentPage = pageNum.value
  const totalPages = Math.ceil(total.value / pageSize.value)
  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === totalPages

  let shouldRefresh = false

  // 必须要判断isLastPage，再判断isFirstPage
  if (isLastPage) {
    // 如果最后一页已经10个了，再产生就有新的最后一页，就主动跳到新的最后一页去
    if (tableData.value.length === pageSize.value) {
      pageNum.value ++
    }
    shouldRefresh = true // 插入到最后一页或进入新的最后一页
  } else if (isFirstPage && target <= max) {
    shouldRefresh = true // 插入到第一页
  } else if (!isFirstPage && !isLastPage && target >= min && target <= max) {
    shouldRefresh = true // 中间页，严格匹配
  }

  if (shouldRefresh) {
    getData()
  }
}

// 暴露方法
defineExpose({
  showType,
  setData,
  clearData,
  setRedLineValue,
  setClusterTypeList,
  giveTimeToRefresh
})

</script>

<style lang="less">
.manual-delete-confirm-modal {
  display: flex;
  flex-wrap: wrap;

  .item {
    width: 96px;
    padding: 6px 6px 6px 12px;
    margin: 6px 6px 0 0;
    background: var(--color-bg-gray);
    border-radius: 8px;
    display: flex;
  }
}
</style>

<style lang="less" scoped>
.list-title {
  color: #fff;
  background: var(--color-title-bg-purple);
}

:deep(.search-list) {
  display: flex;
  align-items: center;
  margin: 8px;
}

:deep(.table-list) {
  margin: 8px 8px 0 8px;

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

  }
}


.list {
  width: 100%;
  padding: 0 8px;
  font-size: 14px;
  margin-top: 8px;

  .item {
    height: 34px;
    display: flex;
    align-items: center;
    border-radius: 4px;

    >div {
      text-align: center;

      &:nth-child(1) {
        width: 48%;
        word-break: break-all;
      }

      &:nth-child(2) {
        width: 36%;
      }

      &:nth-child(3) {
        width: 17%;
      }
    }
  }

  .item {
    cursor: pointer;
    border-bottom: var(--border);

    &:hover {
      background: var(--hover-bg-blue);
    }
  }
}
</style>
