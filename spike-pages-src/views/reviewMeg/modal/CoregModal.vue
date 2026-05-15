<template>
  <a-modal :width="600" v-model:open="visible" :confirm-loading="loading" :title="t('发起配准')" :maskClosable="false"
    :destroyOnClose="true" @ok="modalOk" @cancel="modalCancel">
    <div class="color-red ml8 mb8" v-if="tipText"> {{ tipText }}</div>
    <a-table class="table mb16" rowKey="filePath" size="small" :columns="niiTableColumns" :data-source="niiTableData"
      :pagination="false" :scroll="{ x: true, y: 390 }" :customRow="niiCustomRow" :row-class-name="'cursor-pointer'"
      :row-selection="{
        type: 'radio', // 单选
        selectedRowKeys: niiSelectedRowKeys,
        onChange: niiSelectTable,
      }
        ">
    </a-table>
    <a-table class="table" rowKey="filePath" size="small" :columns="tableColumns" :data-source="tableData"
      :pagination="false" :scroll="{ x: true, y: 390 }" :customRow="customRow" :row-class-name="'cursor-pointer'"
      :row-selection="{
        type: 'radio', // 单选 // type: 'checkbox', // 多选
        selectedRowKeys: selectedRowKeys,
        onChange: selectTable,
      }
        ">
    </a-table>
  </a-modal>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'

import {
  getNiiFileListApi, // 2. 获取结构像文件列表
  startCoregApi, // 5. 点击配准按钮
} from '@/api/sl'

import {
  getFifFileListApi,
} from '@/api/meg'

const { t } = useI18n()

const props = defineProps({
  megId: {
    type: String,
    default: '',
  },
  subjectId: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['success'])


// 弹窗相关
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const tableData = ref<any[]>([])
const selectedRowKeys = ref<string[]>([])
const tableColumns = [
  {
    title: t('脑磁图文件列表'),
    dataIndex: 'filePath',
  },
]

const niiTableData = ref<any[]>([])
const niiSelectedRowKeys = ref<string[]>([])
const niiTableColumns = [
  {
    title: t('结构像文件列表'),
    dataIndex: 'filePath',
  },
]

const tipText = ref('')
// 显示弹窗
function showModal(str?: string) {
  visible.value = true
  if (str) {
    tipText.value = str
  }
  getNiiData()
  getFifData()
}

// 获取结构像文件列表
async function getNiiData() {
  const params = {
    foldName: `${props.megId}/anat`,
  }
  const { code, data } = await getNiiFileListApi(params)
  if (code === 200) {
    niiTableData.value = data || []
    // 如果只有一个，选中它
    if (niiTableData.value.length === 1) {
      niiSelectedRowKeys.value = [niiTableData.value[0].filePath]
    }
  }
}

// 获取脑磁图文件列表
async function getFifData() {
  const params = {
    foldName: `${props.megId}/meg`,
    subjectId: props.subjectId
  }
  const { code, data } = await getFifFileListApi(params)
  if (code === 200) {
    tableData.value = data || []
    // 如果只有一个，选中它
    if (tableData.value.length === 1) {
      selectedRowKeys.value = [tableData.value[0].filePath]
    }
  }
}

// 确定弹窗
async function modalOk() {
  if (!niiSelectedRowKeys.value.length) {
    return message.info(t('请选择结构像文件'))
  }
  if (!selectedRowKeys.value.length) {
    return message.info(t('请选择脑磁图文件'))
  }
  const params = {
    niiFilePath: niiSelectedRowKeys.value[0],
    fifFilePath: selectedRowKeys.value[0],
    subjectId: props.subjectId,
  }
  loading.value = true
  const { code, msg } = await startCoregApi(params)
  loading.value = false
  if (code === 200) {
    message.success(msg, 5)
    modalCancel()
  }
}

// 取消弹窗
function modalCancel() {
  visible.value = false
  loading.value = false
  tableData.value = []
  niiTableData.value = []
  selectedRowKeys.value = []
  niiSelectedRowKeys.value = []
  tipText.value = ''
}

// 选择行
function selectTable(rowKeys: string[], rows: any[]) {
  selectedRowKeys.value = rowKeys
}

// 点击表格一行
function customRow(record: any) {
  return {
    onClick: () => {
      selectedRowKeys.value = [record.filePath]
    }
  }
}

// // 点击表格一行（多选时的方法）
// function customRow(record: any) {
//   return {
//     onClick: () => {
//       // 包含删掉，不包含加入
//       if (selectedRowKeys.value.includes(record.filePath)) {
//         selectedRowKeys.value = selectedRowKeys.value.filter(f=>f !== record.filePath)
//       } else {
//         selectedRowKeys.value.push(record.filePath)
//       }
//     }
//   }
// }

// 选择行
function niiSelectTable(rowKeys: string[], rows: any[]) {
  niiSelectedRowKeys.value = rowKeys
}

// 点击表格一行
function niiCustomRow(record: any) {
  return {
    onClick: () => {
      niiSelectedRowKeys.value = [record.filePath]
    }
  }
}

// 暴露方法
defineExpose({
  showModal
})

</script>