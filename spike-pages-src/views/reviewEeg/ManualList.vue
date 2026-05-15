<template>
  <div class="list-page">
    <div class="list-title flex-between">
      <div class="flex">
        {{ t('手动标注列表') }}
        <IconReload class="reload-icon ml8" v-if="curData.filePath" :title="t('刷新')" @click="onReload" />
      </div>
      <IconDown class="down-icon" :style="{ transform: showList ? '' : 'rotate(-90deg)' }" @click="clickMenu" />
    </div>

    <div class="list" v-if="showList">
      <div class="header">
        <div v-for="(item, index) in header" :key="index">{{ item }}</div>
      </div>

      <NoData :loading="loading" v-if="!tableData.length" />

      <div class="body">
        <div class="item" v-for="(item, index) in tableData" :key="index">
          <div @click="clickItem(item)">
            <span>{{ item.timeLabel }}</span>
          </div>
          <div @click="clickItem(item)">
            <span>{{ item.spikeTypeLabel }}</span>
          </div>
          <div>
            <a-popconfirm
              :title="t('确认删除？')"
              placement="right"
              :ok-text="t('确定')"
              :cancel-text="t('取消')"
              @confirm="confirmDelete(item)"
            >
              <IconDelete class="color-red text-14" :title="t('删除')" />
            </a-popconfirm>
          </div>
        </div>
      </div>

      <a-pagination class="mr8 mb8" v-if="tableData.length > 0" v-model:current="pageNum"
        v-model:pageSize="pageSize" :total="total" size="small" :showSizeChanger="false" :showLessItems="true" @change="changePage" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'

// 棘波类型列表
import { spikeTypeList } from '@u/data'

import {
  getManualSpikeListApi, // 获取手动标注棘波的列表
  deleteManualSpikeApi, // 删除手动标记的棘波
} from '@/api/eeg'

const { t } = useI18n()

const emit = defineEmits(['getCurSpike', 'deleteSpike'])

const showList = ref<boolean>(true)
// 点击标题
function clickMenu() {
  showList.value = !showList.value
}

const header = ref([t('时间点'), t('类型'), '']) // 表头
const tableData = ref<any[]>([]) // 列表
const loading = ref<boolean>(false)
const total = ref<number>(0)
const pageNum = ref<number>(1)
const pageSize = ref<number>(10)

// 暴露方法
defineExpose({
  getData,
  setData
})

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
}

// 获取数据
async function getData() {
  if (!curData.value.filePath) {
    return
  }
  const params = {
    filePath: curData.value.filePath,
    pageNum: pageNum.value,
    pageSize: pageSize.value,
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
        timeLabel: item.endTime ? item.startTime + '-' + item.endTime : item.startTime // timeLabel: string
      }
    })
    total.value = data.total || 0
  }
}

// {
//     "id": "75f17b3f-8204-11ee-ae2b-7486e21ad510",
//     "startTime": "19.728",
//     "endTime": null,
//     "spikeType": 1
// }

// 点击某项
function clickItem(item: any) {
  emit('getCurSpike', item)
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

// 修改页码
function changePage(num: number, size: number) {
  pageNum.value = num
  pageSize.value = size
  getData()
}

</script>

<style lang="less" scoped>

.list-title {
  color: #fff;
  background: var(--color-title-bg-purple);
}

.list {
  width: 100%;
  padding: 0 8px;
  font-size: 14px;
  margin-top: 8px;


  .header,
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

  .header {
    font-weight: 500;
    color: var(--color-gray);
    background: var(--color-primary-005);
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
