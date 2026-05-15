<template>
  <a-modal :width="900" v-model:open="visible" :confirm-loading="confirmLoading" :title="t('棘波时刻点溯源定位')" :okText="t('确定')"
    :cancelText="t('取消')" :maskClosable="false" :destroyOnClose="true" @ok="modalOk" @cancel="modalCancel">

    <a-form class="form-list mb16" ref="formRef" :model="form" :rules="rules">

      <a-form-item :label="t('棘波点溯源算法选择')" name="spikeLocMethod">
        <div class="show-tip-wrap">
          <a-checkbox-group v-model:value="form.spikeLocMethod" :options="spikeLocMethodList" />
          <div class="show-tip color-blue" v-if="showTip">{{ t('提示：beamformer溯源算法执行耗时较长，请确定是否选择') }}</div>
        </div>
      </a-form-item>

    </a-form>

    <a-table class="table" rowKey="name" size="small" :columns="tableColumns" :data-source="tableData"
      :loading="loading" :pagination="false" :scroll="{ x: true, y: 390 }" :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onSelect: onSelectRow,
        onSelectAll: onSelectAllRow,
      }
        ">
      <template #bodyCell="{ record, column }">
        <template v-if="column.dataIndex === 'checkSpike'">
          <a-checkbox v-model:checked="record.checkSpike" @change="changeCheck(record)"></a-checkbox>
        </template>
        <template v-if="column.dataIndex === 'checkManual'">
          <a-checkbox v-model:checked="record.checkManual" @change="changeCheck(record)"></a-checkbox>
        </template>

        <template v-if="column.dataIndex === 'alg_spike_sl'">
          <a-checkbox v-model:checked="record.alg_spike_sl" disabled></a-checkbox>
        </template>
        <template v-if="column.dataIndex === 'manual_spike_sl'">
          <a-checkbox v-model:checked="record.manual_spike_sl" disabled></a-checkbox>
        </template>

      </template>
    </a-table>

  </a-modal>
</template>

<script lang="ts" setup>
import { message, type FormInstance } from 'ant-design-vue'

import { locMethodList } from '@u/data' // 算法列表

import {
  getFifFileListWithIsSlApi, // 22. 获取发起棘波时刻点溯源定位弹窗内的表格列表
  startFifSourceLocationApi, // 23. 棘波时刻点溯源定位弹窗，确定按钮
} from '@/api/sl'

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

const tableColumns = [
  {
    title: t('脑磁图文件'),
    dataIndex: 'name',
  },
  {
    title: t('算法检测棘波'),
    dataIndex: 'checkSpike',
    align: 'center',
    width: 120
  },
  {
    title: t('手动标注棘波'),
    dataIndex: 'checkManual',
    align: 'center',
    width: 120
  },
  {
    title: t('算法检测棘波是否已经溯源定位'),
    dataIndex: 'alg_spike_sl',
    align: 'center',
    width: 130
  },
  {
    title: t('手动标注棘波是否已经溯源定位'),
    dataIndex: 'manual_spike_sl',
    align: 'center',
    width: 130
  },
]


// 弹窗相关
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const confirmLoading = ref<boolean>(false)
const tableData = ref<any[]>([])
const selectedRowKeys = ref<string[]>([])

const formRef = ref<FormInstance>()
const form = reactive<any>({
  spikeLocMethod: ['dip', 'dSPM', 'sLORETA', 'wMNE'], // 棘波点溯源算法算法，这个用多选
})


const showTip = ref<boolean>(false) // 展示beamformer的提示
const rules = {
  spikeLocMethod: [
    { required: true, message: t('请选择至少一个棘波点溯源算法') },
    {
      validator: (rule: any, value: string, callback: (arg0?: string) => void) => {
        if (value.includes('beamformer')) {
          showTip.value = true
        } else {
          showTip.value = false
        }
        callback()
      },
    }
  ],
}

// 新的棘波点溯源算法列表，除了beamformer，其他都加上不可选择，默认选中其他4个
const spikeLocMethodList = locMethodList.map((item: any) => {
  return {
    ...item,
    disabled: item.value === 'beamformer' ? false : true
  }
})


// 显示弹窗
function showModal() {
  visible.value = true
  getFifData()

  nextTick(() => {
    formRef.value.resetFields()
  })
}

// 获取表格数据
async function getFifData() {
  const params = {
    megId: props.megId,
  }
  loading.value = true
  const { code, data } = await getFifFileListWithIsSlApi(params)
  loading.value = false
  if (code === 200) {
    tableData.value = data?.map((item: any) => {
      return {
        name: item.fif_file_path,
        filePath: item.fif_file_path,
        alg_spike_sl: item.alg_spike_sl,
        manual_spike_sl: item.manual_spike_sl,
        checkSpike: false,
        checkManual: false,
      }
    })
  }
}

const emit = defineEmits(['success'])

// 确定弹窗
async function modalOk() {

  formRef.value.validate().then(async values => {

    // 至少有一个true
    let haveTrue = tableData.value.some(item => item.checkSpike || item.checkManual)
    if (!haveTrue) {
      return message.info(t('至少选择一个脑磁图文件'))
    }

    // 下面的表格
    const checkList = tableData.value.map((item) => {
      return {
        fifPath: item.filePath,
        checkAlgSpikes: item.checkSpike,
        checkManual: item.checkManual,
      }
    })

    const params = {
      megId: props.megId,
      subjectId: props.subjectId,
      checkList: checkList,
      spikeLocMethod: form.spikeLocMethod.join(','),
    }

    confirmLoading.value = true
    const { code, msg } = await startFifSourceLocationApi(params)
    confirmLoading.value = false
    if (code === 200) {
      message.success(msg)
      emit('success')
      modalCancel()
    }
  })
}

// 取消弹窗
function modalCancel() {
  visible.value = false
  loading.value = false
  confirmLoading.value = false
  showTip.value = false
  formRef.value.resetFields()
  tableData.value = []
  selectedRowKeys.value = []
}

// 修改Checkbox
function changeCheck(record: any) {
  // 2. 当至少1个选中时，父级选中；当都没选，则父级不选中
  if (!record.checkSpike && !record.checkManual) {
    selectedRowKeys.value = selectedRowKeys.value.filter(f => f !== record.name)
  } else {
    selectedRowKeys.value = [...selectedRowKeys.value, record.name]
  }
}

// 选择表格某一行
function onSelectRow(record: any, selected: boolean, selectedRows: any) {
  selectedRowKeys.value = selectedRows.map((f: any) => f.name)
  record.checkSpike = selected
  record.checkManual = selected
}

// 点击表格的全选
function onSelectAllRow(selected: boolean, selectedRows: any, changeRows: any[]) {
  selectedRowKeys.value = selectedRows.map((f: any) => f.name)
  changeRows.forEach(item => {
    item.checkSpike = selected
    item.checkManual = selected
  })
}

// 暴露方法
defineExpose({
  showModal
})

</script>

<style lang="less" scoped>

.show-tip-wrap {
  position: relative;

  .show-tip {
    position: absolute;
    top: 26px;
    left: 0;
    font-size: 12px;
  }
}

</style>
