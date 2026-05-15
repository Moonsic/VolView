<template>
  <a-button class="light-primary-btn mr8" type="primary" size="small" shape="round" :title="t('导出标记点')" @click="onClick()">
    <span class="anticon">
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 14" fill="none">
        <path d="M12.2499 5.25L12.2499 1.75M12.2499 1.75L8.74992 1.75M12.2499 1.75L5.83325 8.16666"
          stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
        <path
          d="M7 2.91699H4.08C2.79318 2.91699 1.75 3.96017 1.75 5.24699V9.92033C1.75 11.2071 2.79318 12.2503 4.08 12.2503H8.75333C10.0402 12.2503 11.0833 11.2071 11.0833 9.92033V7.00033"
          stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </span>
    <span v-if="!widthSmall">{{ t('导出标记点') }}</span>
  </a-button>

  <a-modal v-model:open="visible" :confirm-loading="loading" :title="t('导出标记点')" :okText="t('确定')" :cancelText="t('取消')"
    :maskClosable="false" :destroyOnClose="true" @ok="modalOk" @cancel="modalCancel">

    <div class="mb16">
      <span class="mr8">{{ t('导出文件类型') }}：</span>
      <a-radio-group v-model:value="exportType" :options="exportTypeList" />
    </div>

    <div class="mb16" v-if="exportType === 'csv'">
      <span class="mr8">{{ t('是否导出溯源坐标') }}：</span>
      <a-radio-group v-model:value="isExportSl" :options="yesNoList" />
    </div>

    <a-table class="table" rowKey="filePath" size="small" :columns="tableColumns" :data-source="tableData"
      :pagination="false" :scroll="{ x: true, y: 390 }" :customRow="customRow" row-class-name="cursor-pointer"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: selectTable,
      }">
    </a-table>

  </a-modal>

</template>
<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { downloadFile } from '@u/utils'
import { yesNoList } from '@/utils/data'

import {
  getFifFileListApi,
  exportEventApi, // 26.  导出数据
} from '@/api/meg'

const { t } = useI18n()

const props = defineProps({
  subjectId: {
    type: String,
    default: '',
  },
  megId: {
    type: String,
    default: '',
  },
  widthSmall: {
    type: Boolean,
    default: false,
  },
})


const tableColumns = [
  {
    title: t('患者数据列表'),
    dataIndex: 'name',
  },
]

// 弹窗相关
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const tableData = ref<any[]>([])
const selectedRowKeys = ref<string[]>([])

// 获取表格数据
async function onClick() {
  visible.value = true

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

// 导出文件类型，默认fif
const exportType = ref<string>('fif')
const exportTypeList = ['fif', 'txt', 'csv', 'evl', 'bdip']
// 是否导出溯源坐标
const isExportSl = ref<number>(1)

// 确定弹窗
async function modalOk() {
  if (!selectedRowKeys.value.length) {
    return message.info(t('请先选择要下载的数据'))
  }

  const list: { fifPath: string; sfreq: string }[] = []
  tableData.value.forEach(item => {
    if (selectedRowKeys.value.includes(item.filePath)) {
      list.push({
        fifPath: item.filePath,
        sfreq: String(parseFloat(item.sfreq) || 0),
      })
    }
  })

  const params: any = {
    megId: props.megId,
    type: exportType.value,
    fifFileInfoList: list,
  }
  if (exportType.value === 'csv') {
    params.isExportSl = isExportSl.value === 1 ? true : false
  }
  loading.value = true
  const res: any = await exportEventApi(params)
  loading.value = false
  // console.log('res :>> ', res); // 正确的打印应该是 Blob {size: 1813, type: 'application/octet-stream'} ，而不是数据流，说明blob出问题了，受到了mock.js的影响
  // console.log('res.headers :>> ', res.headers); // 正确的打印应该是 Blob {size: 1813, type: 'application/octet-stream'} ，而不是数据流，说明blob出问题了，受到了mock.js的影响
  downloadFile(res, res.headers['content-disposition'].split('=')[1])
  modalCancel()
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

// 点击表格一行（多选时的方法）
function customRow(record: any) {
  return {
    onClick: () => {
      // 包含删掉，不包含加入
      if (selectedRowKeys.value.includes(record.filePath)) {
        selectedRowKeys.value = selectedRowKeys.value.filter(f => f !== record.filePath)
      } else {
        selectedRowKeys.value.push(record.filePath)
      }
    }
  }
}

</script>

<style lang="less" scoped></style>
