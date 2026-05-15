<template>
  <a-modal :width="850" v-model:open="visible" :confirm-loading="confirmLoading" :title="t('溯源')" :ok-text="t('开始溯源')"
    :cancel-text="t('取消')" :mask-closable="false" :destroy-on-close="true" @ok="modalOk" @cancel="modalCancel">

    <a-form class="form-list mb16" ref="formRef" :model="form" :rules="rules">

      <div class="box">
        <div class="title mb12">{{ t('算法结果复用选择') }}:</div>
        <a-form-item :label="t('是否沿用已有的预处理结果')" name="keepFsprepResult" :labelCol="{ span: 6 }">
          <a-radio-group class="ml8" v-model:value="form.keepFsprepResult" :options="yesNoList" />
        </a-form-item>
        <a-form-item :label="t('是否沿用已有的配准结果')" name="keepCoregResult" :labelCol="{ span: 6 }">
          <a-radio-group class="ml8" v-model:value="form.keepCoregResult" :options="coregYesNoList" />
        </a-form-item>
        <a-form-item :label="t('是否沿用已有的前向结果')" name="keepFwdResult" :labelCol="{ span: 6 }">
          <a-radio-group class="ml8" v-model:value="form.keepFwdResult" :options="fwdYesNoList" />
        </a-form-item>
      </div>

      <div class="box">

        <div class="title mb12">{{ t('棘波检测参数') }}:</div>

        <div class="grid-4">
          <a-form-item :label="t('阈值')" name="threshold">
            <a-input-number v-model:value="form.threshold" :placeholder="t('请输入')" :min="0" :step="0.1" size="large" />
          </a-form-item>
        </div>
        <a-form-item :label="t('是否进行坏段处理')" name="runBadSegment">
          <a-radio-group v-model:value="form.runBadSegment" :options="yesNoList" />
        </a-form-item>
        <a-form-item :label="t('棘波是否返回多个时刻点')" name="multipoints">
          <a-radio-group v-model:value="form.multipoints" :options="yesNoList" />
        </a-form-item>
        <a-form-item :label="t('棘波点溯源算法选择')" name="spikeLocMethod">
          <div class="show-tip-wrap">
            <a-checkbox-group v-model:value="form.spikeLocMethod" :options="spikeLocMethodList" />
            <div class="show-tip color-blue" v-if="showTip">{{ t('提示：beamformer溯源算法执行耗时较长，请确定是否选择') }}</div>
          </div>
        </a-form-item>

        <a-table class="table mt16 mb16" rowKey="name" size="small" :columns="topTableColumns" :data-source="tableData"
          :loading="loading" :pagination="false" :scroll="{ x: true, y: 304 }" :row-selection="{
            selectedRowKeys: topSelectedRowKeys,
            onChange: topSelectTable,
          }
            ">
          <template #bodyCell="{ record, column }">
            <template v-if="column.dataIndex === 'is_alg_detected'">
              <a-checkbox v-model:checked="record.is_alg_detected" disabled></a-checkbox>
            </template>
          </template>
        </a-table>

      </div>

      <div class="box">
        <div class="title mt8 mb12">{{ t('聚类算法参数') }}:</div>
        <a-form-item :label="t('聚类时溯源算法选择')" name="locMethod">
          <a-radio-group v-model:value="form.locMethod" :options="newLocMethodList" />
        </a-form-item>

        <div class="more-params" v-if="!showMoreParams" @click="clickMoreParams">
          {{ t('更多参数') }}
          <IconDown />
        </div>

        <div class="grid-4 mt16" v-if="showMoreParams">
          <a-form-item label="GOF_THR" name="GOF_THR" :tooltip="t('聚类算法内部调用的gof算法阈值')">
            <a-input-number class="input" v-model:value="form.GOF_THR" :placeholder="t('请输入')" :min="0" :step="0.1"
              size="large" />
          </a-form-item>
          <a-form-item label="PEAK_RANGE" name="PEAK_RANGE" :tooltip="t('对棘波时刻点邻域多少范围进行平均')">
            <a-input-number class="input" v-model:value="form.PEAK_RANGE" :placeholder="t('请输入')" :min="0" :step="1"
              size="large" />
          </a-form-item>
          <a-form-item label="MAG_WEIT" name="MAG_WEIT" :tooltip="t('棘波时刻点的磁力计对聚类效果的影响权重')">
            <a-input-number class="input" v-model:value="form.MAG_WEIT" :placeholder="t('请输入')" :min="0" :step="0.1"
              size="large" />
          </a-form-item>
          <a-form-item label="GRAD_WEIT" name="GRAD_WEIT" :tooltip="t('棘波时刻点的梯度计对聚类效果的影响权重')">
            <a-input-number class="input" v-model:value="form.GRAD_WEIT" :placeholder="t('请输入')" :min="0" :step="0.1"
              size="large" />
          </a-form-item>
          <a-form-item label="WAVE_WEIT" name="WAVE_WEIT" :tooltip="t('棘波时刻点附近(约左右32ms)的磁力计对聚类效果的影响权重')">
            <a-input-number class="input" v-model:value="form.WAVE_WEIT" :placeholder="t('请输入')" :min="0" :step="0.1"
              size="large" />
          </a-form-item>
          <a-form-item label="POS_WEIT" name="POS_WEIT" :tooltip="t('棘波时刻点的球体溯源偶极子位置对聚类效果的影响权重')">
            <a-input-number class="input" v-model:value="form.POS_WEIT" :placeholder="t('请输入')" :min="0" :step="0.1"
              size="large" />
          </a-form-item>
          <a-form-item label="ORI_WEIT" name="ORI_WEIT" :tooltip="t('棘波时刻点的球体溯源偶极子方向对聚类效果的影响权重')">
            <a-input-number class="input" v-model:value="form.ORI_WEIT" :placeholder="t('请输入')" :min="0" :step="0.1"
              size="large" />
          </a-form-item>
          <a-form-item label="NORM_DIS" name="NORM_DIS"
            :tooltip="t('是否对每个特征的距离矩阵进行归一化，不建议更改为False，可通过各WEIT来进行调整距离矩阵分布')">
            <a-select v-model:value="form.NORM_DIS" :options="trueFalseList" :placeholder="t('请选择')" size="large" />
          </a-form-item>
          <a-form-item label="FIT_K_VALUE" name="FIT_K_VALUE" :tooltip="t('聚类算法生成的簇的数量，小于1时会自动遍历聚类效果较好的簇数')">
            <a-input-number class="input" v-model:value="form.FIT_K_VALUE" :placeholder="t('请输入')" :min="0" :step="1"
              size="large" />
          </a-form-item>
          <a-form-item label="CLS_EARLYSTOP" name="CLS_EARLYSTOP"
            :tooltip="t('如果设定了聚类的FIT_K_VALUE可忽略该参数，如果使用自适应类别数聚类，则建议使用该超参，一般设置数十就行，在棘波数特别多时，可以减少聚类耗时')">
            <a-input-number class="input" v-model:value="form.CLS_EARLYSTOP" :placeholder="t('请输入')" :min="0" :step="1"
              size="large" />
          </a-form-item>
          <a-form-item label="FIT_STAGE" name="FIT_STAGE" :tooltip="t('聚类算法的阶段数')">
            <a-input-number class="input" v-model:value="form.FIT_STAGE" :placeholder="t('请输入')" :min="0" :step="1"
              size="large" />
          </a-form-item>
          <a-form-item label="FIT_CUT_SIZE" name="FIT_CUT_SIZE" :tooltip="t('聚类结果中类别个数小于该值的簇会被整个剔除')">
            <a-input-number class="input" v-model:value="form.FIT_CUT_SIZE" :placeholder="t('请输入')" :min="0" :step="1"
              size="large" />
          </a-form-item>
          <a-form-item label="DO_METRIC" name="DO_METRIC"
            :tooltip="t('做完聚类后是否调用gof算法统计一下聚类前后avg-gof的变化情况，占用部分耗时，仅调试效果时使用')">
            <a-select v-model:value="form.DO_METRIC" :options="trueFalseList" :placeholder="t('请选择')" size="large" />
          </a-form-item>

          <div class="more-params more-params-fold" @click="clickMoreParams">
            {{ t('收起参数') }}
            <IconUp />
          </div>

        </div>

      </div>
    </a-form>

    <a-table class="table" rowKey="name" size="small" :columns="tableColumns" :data-source="tableData"
      :loading="loading" :pagination="false" :scroll="{ x: true, y: 304 }" :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onSelect: onSelectRow,
        onSelectAll: onSelectAllRow,
        getCheckboxProps: getCheckboxProps,
      }
        ">
      <template #bodyCell="{ record, column }">
        <template v-if="column.dataIndex === 'checkSpike'">
          <a-checkbox v-model:checked="record.checkSpike"
            :disabled="!(record.is_alg_detected || topSelectedRowKeys.includes(record.name))"
            @change="changeCheck(record)"></a-checkbox>
        </template>
        <template v-if="column.dataIndex === 'checkManual'">
          <a-checkbox v-model:checked="record.checkManual"
            :disabled="!(record.is_alg_detected || topSelectedRowKeys.includes(record.name))"
            @change="changeCheck(record)"></a-checkbox>
        </template>
      </template>
    </a-table>

  </a-modal>
</template>

<script lang="ts" setup>
import { message, type FormInstance } from 'ant-design-vue'

import { yesNoList, locMethodList, trueFalseList } from '@u/data' // 算法列表

import {
  getFifFileListApi,
} from '@/api/meg'

import {
  startPipelineAnalysisApi, //  15. 一键溯源
} from '@/api/sl'

const { t } = useI18n()

const topTableColumns = [
  {
    title: t('脑磁图文件'),
    dataIndex: 'name',
  },
  {
    title: t('是否已经进行棘波检测'),
    dataIndex: 'is_alg_detected',
    align: 'center',
    width: 220
  },
]

const tableColumns = [
  {
    title: t('脑磁图文件'),
    dataIndex: 'name',
  },
  {
    title: t('算法检测棘波'),
    dataIndex: 'checkSpike',
    align: 'center',
    width: 180
  },
  {
    title: t('手动标注棘波'),
    dataIndex: 'checkManual',
    align: 'center',
    width: 180
  }
]



// 是否沿用已有的配准结果 是根据 是否沿用已有的预处理结果 来判断的，上面是否，下面只能否；上面是是，下面可以选是。
const coregYesNoList = computed(() => {
  if (form.keepFsprepResult === 1) {
    return [
      { label: t('是'), value: 1, disabled: false },
      { label: t('否'), value: 0, disabled: false },
    ]
  } else {
    form.keepCoregResult = 0
    return [
      { label: t('是'), value: 1, disabled: true },
      { label: t('否'), value: 0, disabled: false },
    ]
  }
})

// 是否沿用已有的前向结果 是根据 是否沿用已有的配准结果 来判断的，上面是否，下面只能否；上面是是，下面可以选是。
const fwdYesNoList = computed(() => {
  if (form.keepCoregResult === 1) {
    return [
      { label: t('是'), value: 1, disabled: false },
      { label: t('否'), value: 0, disabled: false },
    ]
  } else {
    form.keepFwdResult = 0
    return [
      { label: t('是'), value: 1, disabled: true },
      { label: t('否'), value: 0, disabled: false },
    ]
  }
})

interface IModalContent {
  subjectId?: string
  [key: string]: any
}
const modalContent = ref<IModalContent>({})

// 弹窗相关
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const confirmLoading = ref<boolean>(false)
const tableData = ref<any[]>([])
const selectedRowKeys = ref<string[]>([])
const topSelectedRowKeys = ref<string[]>([])

const formRef = ref<FormInstance>()
const form = reactive<any>({
  GOF_THR: 0.4,
  PEAK_RANGE: 1,
  MAG_WEIT: 0.5,
  GRAD_WEIT: 1.0,
  WAVE_WEIT: 0.25,
  POS_WEIT: 2.0,
  ORI_WEIT: 0.5,
  NORM_DIS: 1, // true
  FIT_K_VALUE: 0,
  CLS_EARLYSTOP: 30,
  FIT_STAGE: 1,
  FIT_CUT_SIZE: 4,
  DO_METRIC: 0,  // false

  threshold: 0.5, // 阈值
  spikeLocMethod: ['dip', 'dSPM', 'sLORETA', 'wMNE'], // 棘波点溯源算法算法，这个用多选
  locMethod: 'dip', // 算法，这个用单选

  keepFsprepResult: 1, // 是否沿用已有的预处理结果, 默认为是
  keepCoregResult: 0, // 是否沿用已有的配准结果, 默认为否
  keepFwdResult: 0,  // 是否沿用已有的前向结果, 默认为否
  runBadSegment: 0, // 是否进行坏段处理, 默认为否
  multipoints: 0, // 棘波是否返回多个时刻点, 默认为否

})

// // 是否
// export const yesNoList = [
//   { label: '是', value: 1 },
//   { label: '否', value: 0 },
// ]

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
  locMethod: [
    { required: true, message: t('请选择') },
  ],
  keepFsprepResult: [
    { required: true, message: t('请选择') },
  ],
  keepCoregResult: [
    { required: true, message: t('请选择') },
  ],
  keepFwdResult: [
    { required: true, message: t('请选择') },
  ],
  runBadSegment: [
    { required: true, message: t('请选择') },
  ],
  multipoints: [
    { required: true, message: t('请选择') },
  ],
}

// 新的棘波点溯源算法列表，除了beamformer，其他都加上不可选择，默认选中其他4个
const spikeLocMethodList = locMethodList.map((item: any) => {
  return {
    ...item,
    disabled: item.value === 'beamformer' ? false : true
  }
})

// form.locMethod的算法列表，加上不可选择，选择项是form.spikeLocMethod的值，实时变化
const newLocMethodList = computed(() => {
  const list: any[] = []
  locMethodList.map((item: any) => {
    if (form.spikeLocMethod.includes(item.value)) {
      list.push({
        ...item,
        disabled: false,
      })
    } else {
      list.push({
        ...item,
        disabled: true, // 隐藏
      })
      // 如果form.locMethod被隐藏了，那么就清空
      if (item.value === form.locMethod) {
        form.locMethod = ''
      }
    }
  })
  return list
})



// 显示弹窗
function showModal(record: any) {
  visible.value = true
  // 直接从分页接口拿数据
  modalContent.value = { ...record }
  getFifData()

  const local_threshold = localStorage.getItem('threshold')
  form.threshold = local_threshold ? Number(local_threshold) : 0.5

  const local_runBadSegment = localStorage.getItem('runBadSegment')
  form.runBadSegment = local_runBadSegment ? Number(local_runBadSegment) : 0

  const local_multipoints = localStorage.getItem('multipoints')
  form.multipoints = local_multipoints ? Number(local_multipoints) : 0

  // 存在就赋值
  const local_hyperParas = JSON.parse(localStorage.getItem('hyperParas'))
  if (local_hyperParas) {
    Object.keys(local_hyperParas).forEach(item => {
      form[item] = local_hyperParas[item]
    })
  }

  nextTick(() => {
    formRef.value.resetFields()
  })
}

// 获取表格数据
async function getFifData() {
  const params = {
    foldName: `${modalContent.value.megId}/meg`,
    subjectId: modalContent.value.subjectId,
  }
  loading.value = true
  const { code, data } = await getFifFileListApi(params)
  loading.value = false
  if (code === 200) {
    // 看看是否有带tsss的
    const haveTsss = data?.some((item: any) => item.name.includes('_tsss')) ?? false
    tableData.value = data?.map((item: any) => {

      // 最新：改成 “文件名字带有tsss”的，并且没有已经进行棘波检测，默认勾上
      // 但 如果一个带 tsss 的都没有，则对所有的并且没有已经进行棘波检测的fif文件进行棘波检测，默认都勾上
      const shouldSelect = !item.is_alg_detected && (!haveTsss || item.name.includes('_tsss'))
      if (shouldSelect) {
        topSelectedRowKeys.value.push(item.name)
      }

      // 更通俗写法：
      // if (!haveTsss) {
      //   if (!item.is_alg_detected) {
      //     topSelectedRowKeys.value.push(item.name)
      //   }
      // } else {
      //   if (item.name.includes('_tsss') && !item.is_alg_detected) {
      //     topSelectedRowKeys.value.push(item.name)
      //   }
      // }

      // //以前：如果以sss.fif结尾，并且没有已经进行棘波检测，默认勾上
      // if (item.name.endsWith('sss.fif') && !item.is_alg_detected) {
      //   topSelectedRowKeys.value.push(item.name)
      // }

      // 以前：下面的表格去掉默认勾上，因为还要根据上面的表格去判断，不能盲目的勾上
      // const isTsss: boolean = item.name.includes('_tsss')
      // if (isTsss) {
      //   selectedRowKeys.value.push(item.name)
      // }

      return {
        name: item.name,
        filePath: item.filePath,
        is_alg_detected: item.is_alg_detected,
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
      return message.info(t('聚类算法至少选择一个脑磁图文件'))
    }

    // 上面的表格
    const detect_fif_file_list: string[] = []
    tableData.value.forEach((item) => {
      if (topSelectedRowKeys.value.includes(item.name)) {
        detect_fif_file_list.push(item.filePath)
      }
    })

    // 下面的表格
    const checkList = tableData.value.map((item) => {
      return {
        fifPath: item.filePath,
        checkAlgSpikes: item.checkSpike,
        checkManual: item.checkManual,
      }
    })

    const params = {
      megId: modalContent.value.megId,
      subjectId: modalContent.value.subjectId,
      foldName: `${modalContent.value.megId}/meg`,
      detect_fif_file_list: detect_fif_file_list,
      checkList: checkList,
      hyperParas: {
        ...form,
        NORM_DIS: Boolean(form.NORM_DIS),
        DO_METRIC: Boolean(form.DO_METRIC),
      },
      spikeLocMethod: form.spikeLocMethod.join(','),
      locMethod: form.locMethod,
      thr: form.threshold,
      keepFsprepResult: Boolean(form.keepFsprepResult),
      keepCoregResult: Boolean(form.keepCoregResult),
      keepFwdResult: Boolean(form.keepFwdResult),
      runBadSegment: Boolean(form.runBadSegment),
      multipoints: Boolean(form.multipoints),

    }
    delete params.hyperParas.spikeLocMethod
    delete params.hyperParas.locMethod
    delete params.hyperParas.threshold
    delete params.hyperParas.keepFsprepResult
    delete params.hyperParas.keepCoregResult
    delete params.hyperParas.keepFwdResult
    delete params.hyperParas.runBadSegment
    delete params.hyperParas.multipoints

    localStorage.setItem('threshold', form.threshold)
    localStorage.setItem('runBadSegment', form.runBadSegment)
    localStorage.setItem('multipoints', values.multipoints)

    // 缓存hyperParas参数
    localStorage.setItem('hyperParas', JSON.stringify({
      ...params.hyperParas,
      NORM_DIS: form.NORM_DIS,
      DO_METRIC: form.DO_METRIC,
    }))

    confirmLoading.value = true
    const { code, msg } = await startPipelineAnalysisApi(params)
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
  topSelectedRowKeys.value = []
  showMoreParams.value = false
}

// 修改Checkbox
function changeCheck(record: any) {

  // 2种逻辑：
  // // 1. 当2个都选中时，父级选中；否则父级不选中
  // if(record.checkSpike && record.checkManual) {
  //   selectedRowKeys.value = [...selectedRowKeys.value, record.name]
  // } else {
  //   selectedRowKeys.value = selectedRowKeys.value.filter(f=>f !== record.name)
  // }

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

// 禁用
function getCheckboxProps(record: any) {
  // // 可以选的情况
  // let can = false;
  // if (record.is_alg_detected) {
  //   can = true
  // } else if (topSelectedRowKeys.value.includes(record.name)) {
  //   can = true
  // }
  return {
    // disabled: !can
    disabled: !(record.is_alg_detected || topSelectedRowKeys.value.includes(record.name))
  }
}


// 上面表格勾选，如果没勾选且没进行棘波检测，下面表格对应的不能选，禁用。
function topSelectTable(rowKeys: string[], rows: any[]) {
  topSelectedRowKeys.value = rowKeys

  tableData.value.forEach(item => {
    if (!item.is_alg_detected && !topSelectedRowKeys.value.includes(item.name)) {
      item.checkSpike = false
      item.checkManual = false
      selectedRowKeys.value = selectedRowKeys.value.filter(f => f !== item.name)
    }
  })
}


// 展示更多参数
const showMoreParams = ref(false)

// 展开收起更多参数
function clickMoreParams() {
  showMoreParams.value = !showMoreParams.value
}

// 暴露方法
defineExpose({
  showModal
})

</script>

<style lang="less" scoped>
.box {
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: var(--border);
}

.title {
  width: 100%;
  font-size: 15px;
  font-weight: 600;

  &:before {
    content: '';
    display: inline;
    border-left: 3px solid var(--color-modal-title-before);
    border-right: 3px solid var(--color-modal-title-before);
    border-radius: 2px;
    margin-right: 12px;
  }

}

.form-list {
  .ant-form-item {
    margin-bottom: 8px;
  }
}

.show-tip-wrap {
  position: relative;

  .show-tip {
    position: absolute;
    top: 22px;
    left: 0;
    font-size: 12px;
  }
}

.more-params {
  color: var(--color-primary);
  cursor: pointer;
  width: 100%;
  text-align: center;
  margin-bottom: 8px;

  &.more-params-fold {
    width: 50%;
    margin-top: 20px;
    margin-bottom: 0;
  }
}
</style>
