<template>

  <a-modal :width="850" v-model:open="visible" :confirm-loading="confirmLoading" :title="t('发起聚类')" :ok-text="t('确定')"
    :cancel-text="t('取消')" :mask-closable="false" :destroy-on-close="true" @ok="modalOk" @cancel="modalCancel">
    <div class="mb16" v-if="judgeData === false">
      {{ t('是否调用聚类算法？') }}
    </div>
    <div class="mb16 color-blue" v-if="judgeData === true">
      {{ t('已经调用过聚类算法，是否再次调用？') }}
    </div>

    <a-form class="form-list mb16" ref="formRef" :model="form" :rules="rules">

      <a-form-item :label="t('选择溯源算法')" name="locMethod" :label-col="{ sapn: 4 }" :wrapper-col="{ sapn: 14 }"
        :style="{ width: '600px', marginBottom: '16px' }">
        <div class="show-tip-wrap">
          <a-radio-group v-model:value="form.locMethod" :options="locMethodList" />
          <!-- <a-checkbox-group v-model:value="form.locMethod" :options="spikeLocMethodList" /> -->
          <div class="show-tip color-blue" v-if="showTip">{{ t('提示：beamformer溯源算法执行耗时较长，请确定是否选择') }}</div>
        </div>
      </a-form-item>

      <div class="more-params" v-if="!showMoreParams" @click="clickMoreParams">{{ t('更多参数') }}
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
        <a-form-item label="NORM_DIS" name="NORM_DIS" :tooltip="t('是否对每个特征的距离矩阵进行归一化，不建议更改为False，可通过各WEIT来进行调整距离矩阵分布')">
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
        <div class="more-params more-params-fold" @click="clickMoreParams">{{ t('收起参数') }}
          <IconUp />
        </div>
      </div>
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
      </template>
    </a-table>

  </a-modal>
</template>

<script lang="ts" setup>
import { message, type FormInstance } from 'ant-design-vue'

import { locMethodList, trueFalseList } from '@u/data' // 算法列表

import {
  judgeIfClusterApi,   // 检测是否调用过聚类算法
  clusterAnalysisApi,  // 调用聚类算法
} from '@/api/meg'

import {
  getFifFileListWithIsSlApi, // 22. 获取发起棘波时刻点溯源定位弹窗内的表格列表
} from '@/api/sl'

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
  coregId: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['success'])

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

// 弹窗相关
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const confirmLoading = ref<boolean>(false)
const tableData = ref<any[]>([])
const selectedRowKeys = ref<string[]>([])
const judgeData = ref<boolean>(null) // 是否已经进行过棘波检测

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

  locMethod: 'dip', // 算法，这个页面现在是单选
  // locMethod: ['dip', 'dSPM', 'sLORETA', 'wMNE'], // 棘波点溯源算法算法，以前用多选

})

const showTip = ref<boolean>(false) // 展示beamformer的提示
const rules = {
  locMethod: [
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
// const spikeLocMethodList = locMethodList.map((item: any) => {
//   return {
//     ...item,
//     disabled: item.value === 'beamformer' ? false : true
//   }
// })

// 显示弹窗 点击按钮先检测是否已经调用过
async function showModal() {
  visible.value = true
  getFifData()

  // 存在就赋值
  const local_hyperParas = JSON.parse(localStorage.getItem('hyperParas'))
  if (local_hyperParas) {
    Object.keys(local_hyperParas).forEach(item => {
      form[item] = local_hyperParas[item]
    })
  }

  const params = {
    subjectId: props.subjectId,
  }
  const { code, data } = await judgeIfClusterApi(params)
  if (code === 200) {
    judgeData.value = data // 是否已经调用过；true/false
  }
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
      // 包含_tsss的默认勾上
      const isTsss: boolean = item.fif_file_path.includes('_tsss')
      if (isTsss) {
        selectedRowKeys.value.push(item.fif_file_path)
      }

      return {
        name: item.fif_file_path,
        filePath: item.fif_file_path,
        checkSpike: isTsss,
        checkManual: isTsss,
      }
    })
  }
}


// 确定弹窗
async function modalOk() {
  // 至少有一个true
  let haveTrue = tableData.value.some(item => item.checkSpike || item.checkManual)
  if (!haveTrue) {
    return message.info(t('至少选择一个脑磁图文件'))
  }

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
    coregId: props.coregId,
    foldName: `${props.megId}/meg`,
    checkList: checkList,
    hyperParas: {
      ...form,
      NORM_DIS: Boolean(form.NORM_DIS),
      DO_METRIC: Boolean(form.DO_METRIC),
    },
    locMethod: form.locMethod, // 现在是单选
  }
  delete params.hyperParas.locMethod

  // 缓存hyperParas参数
  localStorage.setItem('hyperParas', JSON.stringify({
    ...params.hyperParas,
    NORM_DIS: form.NORM_DIS,
    DO_METRIC: form.DO_METRIC,
  }))

  confirmLoading.value = true
  const { code, msg } = await clusterAnalysisApi(params)
  confirmLoading.value = false
  if (code === 200) {
    message.success(msg)
    emit('success')
    modalCancel()
  }
}

// 取消弹窗
function modalCancel() {
  visible.value = false
  loading.value = false
  confirmLoading.value = false
  judgeData.value = null
  formRef.value.resetFields()
  tableData.value = []
  selectedRowKeys.value = []
  showTip.value = false
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
