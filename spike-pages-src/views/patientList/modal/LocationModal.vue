<template>
  <a-modal
    :width="800"
    v-model:open="visible"
    :confirm-loading="loading"
    title="溯源定位"
    :maskClosable="false"
    :destroyOnClose="true"
    @ok="modalOk"
    @cancel="modalCancel"
  >
    <a-space class="mb16">
      <a-button type="primary" @click="onCoreg">
        <IconCoreg />
        发起配准
      </a-button>
    </a-space>
    <a-table
      class="table"
      rowKey="id"
      size="small"
      :columns="tableColumns"
      :data-source="tableData"
      :pagination="false"
      :scroll="{ x: true, y: 480 }"
      :customRow="customRow"
      :row-class-name="'cursor-pointer'"
      :row-selection="
        {
          type: 'radio', // 单选
          selectedRowKeys: selectedRowKeys,
          onChange: selectTable,
          getCheckboxProps: (record: any) => ({
            disabled: record.fwdStatus !== 1, // 没处理的不能选择
          }),
        }
      "
    >
      <template #bodyCell="{ record, column }">
        <template v-if="column.dataIndex === 'operation'">
          <a-space>
            <span>{{ record.fwdStatusText }}</span>
            <!-- fwdStatus：  null 表示没有进行前向，-1失败，0进行中，1已完成 -->
            <a href="javascript:;" v-if="record.fwdStatus === null || record.fwdStatus === -1" @click.stop="onHandleForwardTask(record)">处理</a>
          </a-space>
        </template>
      </template>
    </a-table>
  </a-modal>

  <!-- 配准弹窗 -->
  <CoregModal ref="coregModalRef" :megId="modalContent.megId" :subjectId="modalContent.subjectId" />

</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'

import CoregModal from './CoregModal.vue'

import {
  getCoregResultListApi, // 1. 获取配准结果列表
  startFwdApi, // 7. 开始前向任务
} from '@/api/sl'


const emit = defineEmits(['success'])

const tableColumns = [
  {
    title: 'fif文件路径',
    dataIndex: 'fifFilePath',
  },
  {
    title: 'nii文件路径',
    dataIndex: 'niiFilePath',
  },
  {
    title: '前向任务',
    dataIndex: 'operation',
    width: 100,
    ellipsis: true
  }
]

// 前向任务状态
const fwdStatusList: any = {
  '1': '已完成',
  '0': '进行中',
  '-1': '失败',
  // 'null': '未处理' // 未处理不显示
}

// 弹窗相关
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const tableData = ref<any[]>([])
const selectedRowKeys = ref<string[]>([])


const modalContent = ref<any>({})


// 显示弹窗
function showModal(record: any) {
  visible.value = true
  modalContent.value = { ...record }

  getFifData()
}

// 获取配准结果列表
async function getFifData() {
  const params = {
    megId: modalContent.value.megId,
  }
  const { code, data } = await getCoregResultListApi(params)
  if (code === 200) {
    tableData.value = data?.map((item: any) => {
      return {
        ...item,
        fwdStatusText: fwdStatusList[item.fwdStatus]
      }
    })
    // 默认选中第一个，但第一个也必须是前向任务已完成的
    if (tableData.value.length && tableData.value[0].fwdStatus === 1) {
      selectedRowKeys.value = [tableData.value[0].id]
    }
  }
}

// 处理前向任务
async function onHandleForwardTask(item: any) {
  const params = {
    coregId: item.id,
    subjectId: modalContent.value.subjectId,
  }
  const { code, msg } = await startFwdApi(params)
  if (code === 200) {
    message.success(msg)
    getFifData()
  }
}


// 确定弹窗
async function modalOk() {
  if (!selectedRowKeys.value.length) {
    return message.info('请选择配准结果')
  }
  const target = tableData.value.find(f=>f.id === selectedRowKeys.value[0])
  modalCancel()
  window.open(`${window.location.origin}/viewResults?megId=${modalContent.value.megId}&subjectId=${modalContent.value.subjectId}&coregId=${target.id}`, '_blank')
  // const router = useRouter()
  // router.push({
  //   path: '/viewResults',
  //   query:{
  //     megId: modalContent.value.megId,
  //     subjectId: modalContent.value.subjectId,
  //     coregId: target.id,
  //   }
  // })
}

// 取消弹窗
function modalCancel() {
  visible.value = false
  loading.value = false
  tableData.value = []
  selectedRowKeys.value = []
}

// 选择行
function selectTable(rowKeys: string[], rows: any[]) {
  selectedRowKeys.value = rowKeys
}

// 点击表格一行
function customRow(record: any) {
  return {
    onClick: () => {
      // 完成的才能选中
      if (record.fwdStatus === 1) {
        selectedRowKeys.value = [record.id]
      }
    }
  }
}


const coregModalRef = ref(null)
// 点击配准按钮
function onCoreg() {
  coregModalRef.value.showModal()
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