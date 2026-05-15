<template>
  <a-modal :width="850" v-model:open="visible" :confirm-loading="confirmLoading" :title="t('批量溯源')" :ok-text="t('批量溯源')"
    :cancel-text="t('取消')" :mask-closable="false" :destroy-on-close="true" @ok="modalOk" @cancel="modalCancel">

    <a-form class="form-list mb16" ref="formRef" :model="form" :rules="rules">


      <div class="box">
        <div class="title mb12">{{ t('已选患者') }}（{{ tableData.length }}）:</div>


        <div class="meg-list mb12" v-if="!showMoreMeg">
          <div class="item" v-for="(item, index) in tableData.slice(0, 8)" :key="index">
            <div class="mb4">{{ item.megId }}</div>
            <div>{{ item.subjectName || '-' }}</div>
          </div>
        </div>

        <div class="meg-list mb12" v-if="showMoreMeg">
          <div class="item" v-for="(item, index) in tableData" :key="index">
            <div class="mb4">{{ item.megId }}</div>
            <div>{{ item.subjectName || '-' }}</div>
          </div>
        </div>

        <div class="more-params" v-if="tableData.length > 8 && !showMoreMeg" @click="clickMoreMeg">
          {{ t('展开全部') }}
          <IconDown />
        </div>

        <div class="more-params" v-if="tableData.length > 8 && showMoreMeg" @click="clickMoreMeg">
          {{ t('收起') }}
          <IconUp />
        </div>

        <a-form-item :label="t('是否预约时间')" name="targetTime">
          <a-date-picker v-model:value="form.targetTime" style="width: 200px;" format="YYYY-MM-DD HH:mm"
            valueFormat="YYYY-MM-DD HH:mm:00" :show-time="{ format: 'HH:mm' }" :placeholder="t('默认立刻执行')"
            :disabled-date="disabledPastDate" :disabled-time="disabledPastTime" />
        </a-form-item>
      </div>

      <!-- <div class="box">
        <div class="title mb12">结构像预处理参数:</div>
        <a-form-item label="是否沿用已有的预处理结果" name="keepFsprepResult">
          <a-radio-group v-model:value="form.keepFsprepResult" :options="yesNoList" />
        </a-form-item>
      </div>

      <div class="box">
        <div class="title mb12">配准算法参数:</div>
        <a-form-item label="是否沿用已有的配准结果" name="keepCoregResult">
          <a-radio-group v-model:value="form.keepCoregResult" :options="coregYesNoList" />
        </a-form-item>
      </div>

      <div class="box">
        <div class="title mb12">前向算法参数:</div>
        <a-form-item label="是否沿用已有的前向结果" name="keepFwdResult">
          <a-radio-group v-model:value="form.keepFwdResult" :options="fwdYesNoList" />
        </a-form-item>
      </div> -->

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



  </a-modal>
</template>

<script lang="ts" setup>
import { message, type FormInstance } from 'ant-design-vue'
import dayjs from 'dayjs'
import { yesNoList, locMethodList, trueFalseList } from '@u/data' // 算法列表

import {
  startBatchPipelineAnalysisApi, //  24. 批量一键溯源
} from '@/api/sl'

const { t } = useI18n()

function disabledPastDate(current: any) {
  // // 获取今日0点的时间戳（精确到毫秒）
  // // 禁用今日之前的所有日期（包含今日之前的时分秒）
  return current && current < dayjs().startOf('day');
};

function disabledPastTime(current: any) {
  if (!current || !current.isSame(dayjs(), 'day')) return {};

  const now = dayjs();
  return {
    disabledHours: () => [...Array(now.hour()).keys()],  // 禁用当前小时前的所有小时
    disabledMinutes: (selectedHour: number) =>
      selectedHour === now.hour()
        ? [...Array(now.minute()).keys()]
        : [],

  };
};




const tableColumns = [
  {
    title: '患者编号',
    dataIndex: 'megId',
  },
  {
    title: '姓名',
    dataIndex: 'subjectName',
    customRender: ({ text }: { text: string }) => {
      return text || '-'
    },
  },

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

  keepFsprepResult: 0, // 是否沿用已有的预处理结果, 默认为否（批量里改成默认否）
  keepCoregResult: 0, // 是否沿用已有的配准结果, 默认为否
  keepFwdResult: 0,  // 是否沿用已有的前向结果, 默认为否
  runBadSegment: 0, // 是否进行坏段处理, 默认为否
  multipoints: 0, // 棘波是否返回多个时刻点, 默认为否

  targetTime: '', // 触发时间，默认为空
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
  tableData.value = [...record]

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


const emit = defineEmits(['success'])

// 确定弹窗
async function modalOk() {

  formRef.value.validate().then(async values => {

    // 至少有一个
    if (!tableData.value.length) {
      return message.info(t('未选择患者'))
    }

    // 表格
    const checkList = tableData.value.map((item, index) => {
      return {
        megId: item.megId,
        subjectId: item.subjectId,
        subjectName: item.subjectName,
      }
    })


    const params = {
      subjectsCheckedInfo: checkList,
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

      targetTime: form.targetTime // 不预约时间就传空''过去
    }
    delete params.hyperParas.spikeLocMethod
    delete params.hyperParas.locMethod
    delete params.hyperParas.threshold
    delete params.hyperParas.keepFsprepResult
    delete params.hyperParas.keepCoregResult
    delete params.hyperParas.keepFwdResult
    delete params.hyperParas.runBadSegment
    delete params.hyperParas.multipoints
    delete params.hyperParas.targetTime

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
    const { code, msg } = await startBatchPipelineAnalysisApi(params)
    confirmLoading.value = false
    if (code === 200) {
      message.success(msg)
      emit('success', form.targetTime)
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
  showMoreParams.value = false
  showMoreMeg.value = false
}


// 展示全部患者
const showMoreMeg = ref(false)

// 展开收起全部患者
function clickMoreMeg() {
  showMoreMeg.value = !showMoreMeg.value
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

  &:not(:last-child) {
    border-bottom: var(--border);
  }
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
    top: 26px;
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


.meg-list {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 8px;

  .item {
    background: var(--color-bg-gray);
    border-radius: 8px;
    padding: 8px 16px;
  }
}
</style>
