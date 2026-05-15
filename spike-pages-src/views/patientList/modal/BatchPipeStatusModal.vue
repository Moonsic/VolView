<template>
  <a-modal :width="800" v-model:open="visible" :confirm-loading="loading" :title="t('批量溯源状态')" :maskClosable="false"
    :destroyOnClose="true" @cancel="modalCancel">
    <!-- <a-space class="mb16">
      <a-button type="primary" @click="onCoreg">
        <IconCoreg />
        发起配准
      </a-button>
    </a-space> -->
    <a-table class="table" rowKey="id" size="small" :columns="tableColumns" :data-source="tableData" :pagination="false"
      :scroll="{ x: true, y: 480 }">
      <template #bodyCell="{ record, column }">
        <template v-if="column.dataIndex === 'statusText'">
          <a-space class="flex-start">

            <span class="flex-1" :style="{ color: record.statusColor }">{{ record.statusText }}</span>

            <div class="flex-1">
              <!-- 1成功会有一个√图标动画 -->
              <LottieAnimation class="icon flex-center" style="width:20px; height: 18px;" v-if="record.status === 1"
                :animation-data="successJson" :auto-play="true" :loop="false" :speed="1" />

              <!-- 0进行中，loading动画 -->
              <LottieAnimation class="icon flex-center" style="width:20px; height: 18px;" v-if="record.status === 0"
                :animation-data="loadingJson" :auto-play="true" :loop="true" :speed="1" />
            </div>
          </a-space>
        </template>
      </template>
    </a-table>

    <template #footer>
      <a-button @click="modalCancel">
        {{ t('返回') }}
      </a-button>
      <a-button v-if="batchStatus !== 1" danger @click="onStopSource">
        <IconStop />
        {{ t('撤销') }}
      </a-button>
    </template>
  </a-modal>


</template>

<script lang="ts" setup>
import { LottieAnimation } from "lottie-web-vue"
import loadingJson from '@a/animation/loading.json' // 引入动画JSON文件
import successJson from '@a/animation/success.json' // 引入动画JSON文件
import { message } from 'ant-design-vue'

import {
  getBatchPipelineStatusApi, // 26. 获取批量一键溯源状态列表
  stopBatchPipelineAnalysisApi, // 25. 撤销批量一键溯源
} from '@/api/sl'

const { t } = useI18n()

const emit = defineEmits(['success', 'setBatchStatus'])

const tableColumns = [
  {
    title: t('患者编号'),
    dataIndex: 'megId',
  },
  {
    title: t('姓名'),
    dataIndex: 'subjectName',
    customRender: ({ text }: { text: string }) => {
      return text || '-'
    },
  },
  {
    title: t('状态'),
    dataIndex: 'statusText',
    width: 150,
    align: 'left',
  },
]

// 状态
const statusList: any = {
  '-3': {
    label: t('未开始'),
    color: 'var(--color-t5)',
  },
  '-2': {
    label: t('已终止'),
    color: 'var(--color-t5)',
  },
  '-1': {
    label: t('已失败'),
    color: 'var(--color-red)',
  },
  '0': {
    label: t('进行中'),
    color: 'var(--color-yellow)',
  },
  '1': {
    label: t('溯源成功'),
    color: 'var(--color-green)',
  },
}


// 弹窗相关
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const tableData = ref<any[]>([])
const batchStatus = ref<number>()

const modalContent = ref<any>({})

// 显示弹窗
function showModal(record: any) {
  visible.value = true
  modalContent.value = { ...record }

  getData()
}

// 获取配准结果列表
async function getData() {
  const params = {
    batchPipelineAnalysisId: modalContent.value.batchPipelineAnalysisId,
  }
  const { code, data } = await getBatchPipelineStatusApi(params)
  if (code === 200) {
    tableData.value = data?.subtaskStatus.map((item: any) => {
      const target = statusList[item.status] || {}
      return {
        ...item,
        statusText: target.label || '',
        statusColor: target.color || '',
      }
    })
    batchStatus.value = data.batchStatus // 批量的总状态：-1：失败，0：正在进行，1：成功, -2: 已撤销， -3：未开始
    emit('setBatchStatus', batchStatus.value) // 更新列表页的最新状态
  }
}


// 取消弹窗
function modalCancel() {
  visible.value = false
  loading.value = false
  tableData.value = []
}

// 撤销
async function onStopSource() {
  const params = {
    batchPipelineAnalysisId: modalContent.value.batchPipelineAnalysisId,
    celeryTaskId: modalContent.value.celeryTaskId,
  }
  const { code, msg } = await stopBatchPipelineAnalysisApi(params)
  if (code === 200) {
    message.success(msg)
    emit('success')
    modalCancel()
  }
}



// 暴露方法
defineExpose({
  showModal
})

</script>

<style lang="less" scoped>
:deep(.ant-table-cell) {
  word-break: break-all;
}
</style>