<template>
  <div class="list-page">
    <div class="list-title flex-between">
      <div class="flex">
        {{ t('算法检测棘波列表') }}
        <IconReload class="reload-icon ml8" v-if="curData.filePath" :title="t('刷新')" @click="onSearch" />
      </div>
      <IconDown class="down-icon" :style="{ transform: showList ? '' : 'rotate(-90deg)' }" @click="clickMenu" />
    </div>

    <div class="flex-center pt8 pr8 pl8 pb8" ref="formRef" :model="form" v-if="showList">
      <a-input-number class="flex-1" v-model:value="form.threshold" ref="thresholdRef" :placeholder="t('填写阈值')"
        :min="0" :step="0.1" @blur="blurThreshold" @pressEnter="pressEnterThreshold" />
    </div>

    <div class="list" v-if="showList">
      <div class="header">
        <div v-for="(item, index) in header" :key="index">{{ item }}</div>
      </div>

      <NoData :loading="loading" v-if="!tableData.length" />

      <div class="body">
        <div class="item" v-for="(item, index) in tableData" :key="index" @click="clickItem(item)">
          <div>
            <span>{{ item.spikeTime.toFixed(4) }}</span>
          </div>
          <div>
            <span>{{ item.modelScore.toFixed(3) }}</span>
          </div>
        </div>
      </div>
      <a-pagination class="mr8 mb8" v-if="tableData.length > 0" v-model:current="pageNum" v-model:pageSize="pageSize"
        :total="total" size="small" :showSizeChanger="false" :showLessItems="true" @change="changePage" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue'

import {
  getSpikeListApi,    // 5. 棘波检测列表，分页。脑区和tag是固定的
} from '@/api/eeg'

const { t } = useI18n()

const emit = defineEmits(['getCurSpike', 'pressEnterThreshold'])

const showList = ref<boolean>(true)

// 点击标题
function clickMenu() {
  showList.value = !showList.value
}

const formRef = ref<FormInstance>()

const form = reactive<any>({
  threshold: null,   // 阈值
})

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

const header = ref([t('时刻点'), t('置信度')]) // 表头

const tableData = ref<any[]>([]) // 列表
const loading = ref<boolean>(false)
const total = ref<number>(0)
const pageNum = ref<number>(1)
const pageSize = ref<number>(10)

// 暴露方法
defineExpose({
  setData
})

const curData = ref<any>({})

function setData(item: any) {
  curData.value = item
  onSearch()
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
    thr: form.threshold ? String(form.threshold) : null,
  }
  loading.value = true
  const { code, data } = await getSpikeListApi(params)
  loading.value = false
  if (code === 200) {
    tableData.value = data.records?.map((item: any) => {
      return {
        ...item,
        spikeTime: parseFloat(Number(item.spikeTime).toFixed(4)),
        modelScore: parseFloat(Number(item.modelScore).toFixed(3)),
      }
    })
    total.value = data.total || 0
  }
}
// {
//     "id": "b7bc5f38-5207-11ee-b7a5-3cecefaf2582",
//     "spikeTime": "160.896",
//     "type": 1,
//     "modelScore": "0.5341334613886747"
// }

// 刷新
function onSearch() {
  tableData.value = []
  total.value = 0
  changePage(1, 10)
  showList.value = true
}

// 点击某棘波
function clickItem(item: any) {
  emit('getCurSpike', item)
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
  background: var(--color-title-bg-green);
}

.list {
  width: 100%;
  padding: 0 8px;
  font-size: 14px;

  .header,
  .item {
    height: 34px;
    padding: 0 8px;
    display: flex;
    align-items: center;
    border-radius: 4px;

    >div {
      text-align: center;

      &:nth-child(1) {
        width: 50%;
      }

      &:nth-child(2) {
        width: 50%;
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
