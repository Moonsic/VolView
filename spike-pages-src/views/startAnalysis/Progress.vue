<template>
  <div class="progress-page">


    <div class="list-title" :style="{ right: listTitleRight + 'px' }">
      <a-button type="primary" size="large" v-if="[-2, 1, null, undefined].includes(pipelineStatus)"
        @click="onStartSource()">
        <IconStart />
        {{ t('溯源开始') }}
      </a-button>
      <!-- 失败和进行中都可以终止 -->
      <a-button class="stop-button" size="large" danger v-if="[-1, 0].includes(pipelineStatus)" @click="onStopSource()">
        <IconStop />
        {{ t('终止') }}
      </a-button>
      <div class="detail-data">
        <div class="item">
          <span>{{ t('患者编号') }}：</span>
          <span class="break-all"> {{ props.detailData.megId || '-' }}</span>
        </div>
        <div class="item">
          <span>{{ t('姓名') }}：</span>
          <span> {{ props.detailData.subjectName || '-' }}</span>
        </div>
        <div class="item">
          <span>{{ t('性别') }}：</span>
          <span v-if="props.detailData.gender === 1">{{ t('男') }}</span>
          <span v-else-if="props.detailData.gender === 2">{{ t('女') }}</span>
          <span v-else>-</span>
        </div>

        <div class="item" :class="{ 'widthP100': isEnglish }">
          <span>{{ t('脑磁检查类型') }}：</span>
          <span>{{ props.detailData.megCheckType || '-' }}</span>
        </div>
        <div class="item" :class="{ 'widthP100': isEnglish }">
          <span>{{ t('致痫灶位置') }}：</span>
          <span>{{ props.detailData.epilepticLocation || '-' }}</span>
        </div>
        <div class="item">
          <span>{{ t('溯源状态') }}：</span>
          <!-- <span>{{ statusList[pipelineStatus] || '-' }}</span> -->
          <span class="color-tag" :class="{
            'tag-gray': pipelineStatus === -2 || pipelineStatus === null,
            'tag-red': pipelineStatus === -1,
            'tag-yellow': pipelineStatus === 0,
            'tag-green': pipelineStatus === 1,
          }" v-if="[null, -2, -1, 0, 1].includes(pipelineStatus)">
            <span v-if="pipelineStatus === null">{{ t('未开始') }}</span>
            <span v-if="pipelineStatus === -2">{{ t('已终止') }}</span>
            <span v-if="pipelineStatus === -1">{{ t('已失败') }}</span>
            <span v-if="pipelineStatus === 0">{{ t('进行中') }}</span>
            <span v-if="pipelineStatus === 1">{{ t('溯源成功') }}</span>
          </span>
        </div>
        <div class="item">
          <span>{{ t('复核状态') }}：</span>
          <span>
            <a-switch class="switch-checked" v-model:checked="detailData.checked" @change="onSwitchChecked">
              <template #checkedChildren>{{ t('已复核') }}</template>
              <template #unCheckedChildren>{{ t('未复核') }}</template>
            </a-switch>
          </span>
        </div>
        <div class="item widthP100" v-if="everyAlgStepUseTime.pipeline_predict_finish_time">
          <span>{{ t('溯源任务预计结束时间') }}：</span>
          <span>{{ everyAlgStepUseTime.pipeline_predict_finish_time || '-' }}</span>
        </div>
      </div>
    </div>
    <div class="body-wrap">

      <div class="body" :style="bodyStyle">

        <!-- 溯源成功就不显示蓝色小球 -->
        <LottieAnimation class="ball-animation" v-if="pipelineStatus !== 1" :animation-data="ball" :auto-play="true"
          :loop="true" :speed="0.4" />


        <div class="box jibojiance" :class="getStatusColor(tableData['jibojiance'])">
          <div class="top">
            <StatusIcon :type="tableData['jibojiance']" />
          </div>
          <div class="center" @click="goReviewMeg()">
            <span>{{ t('棘波检测') }}</span>
            <IconRight />
          </div>
          <div class="bottom"></div>
          <div class="line" v-if="tableData['jibojiance'] !== 123"></div>
          <RunningBox v-if="tableData['jibojiance'] === 0 && runningTaskPyList.includes('jibojiance')"
            :data="runningTaskList.find(f => f.task_py === 'jibojiance')" />
          <BorderAnimation type="square" v-if="tableData['jibojiance'] === 0" />

        </div>

        <div class="box jiegouxiang" :class="getStatusColor(tableData['jiegouxiang'])">
          <div class="top">
            <StatusIcon :type="tableData['jiegouxiang']" />
          </div>
          <div class="center" @click="goReviewMri()">
            <span>{{ t('结构像预处理') }}</span>
            <IconRight />
          </div>
          <div class="bottom"></div>
          <div class="line" v-if="tableData['jiegouxiang'] !== 123"></div>
          <RunningBox v-if="tableData['jiegouxiang'] === 0 && runningTaskPyList.includes('jiegouxiang')"
            :data="runningTaskList.find(f => f.task_py === 'jiegouxiang')" />
          <BorderAnimation type="square" v-if="tableData['jiegouxiang'] === 0" />
        </div>

        <div class="box peizhun" :class="getStatusColor(tableData['peizhun'])">

          <div class="top">
            <StatusIcon :type="tableData['peizhun']" />
          </div>
          <div class="center" @click="onCoreg()">
            <span>{{ t('配准') }}</span>
            <IconRight />
          </div>
          <div class="bottom have-content flex-between">
            <div class="flex-4" @click="goAnatPageToCoreg()">
              <IconSearch />
              {{ t('查看配准结果') }}
            </div>
            <!-- 工程师版本能看到这个3D头盔弹窗，不能删 -->
            <div class="flex-1 text-center" v-if="versionType === 'engineer'" @click="openCoreg3DModal()">
              <span class="anticon">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                  <ellipse cx="12" cy="17.5" rx="7" ry="3.5" stroke="currentColor" stroke-width="1.5"
                    stroke-linejoin="round" />
                  <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                </svg>
              </span>
            </div>
          </div>

          <div class="line" v-if="tableData['peizhun'] !== 123"></div>
          <RunningBox v-if="tableData['peizhun'] === 0 && runningTaskPyList.includes('peizhun')"
            :data="runningTaskList.find(f => f.task_py === 'peizhun')" />
          <BorderAnimation type="square" v-if="tableData['peizhun'] === 0" />
        </div>

        <div class="box qianxiang" :class="getStatusColor(tableData['qianxiang'])">
          <div class="top">
            <StatusIcon :type="tableData['qianxiang']" />
          </div>
          <div class="center" @click="onHandleForwardTask()">
            <span>{{ t('前向任务') }}</span>
            <IconRight title="发起前向任务" />
          </div>
          <div class="bottom"></div>
          <div class="line" v-if="tableData['qianxiang'] !== 123"></div>
          <RunningBox v-if="tableData['qianxiang'] === 0 && runningTaskPyList.includes('qianxiang')"
            :data="runningTaskList.find(f => f.task_py === 'qianxiang')" />
          <BorderAnimation type="square" v-if="tableData['qianxiang'] === 0" />
        </div>

        <div class="box jibo" :class="getStatusColor(tableData['jibo'])">
          <div class="top">
            <StatusIcon :type="tableData['jibo']" />
          </div>
          <div class="center" @click="openStartFifSourceLocationModal()">
            <span>{{ t('棘波时刻点溯源定位') }}</span>
            <IconRight />
          </div>
          <div class="bottom"></div>

          <div class="line" v-if="tableData['jibo'] !== 123"></div>
          <div class="line line-before" v-if="tableData['jibo'] !== 123"></div>
          <RunningBox v-if="tableData['jibo'] === 0 && runningTaskPyList.includes('jibo')"
            :data="runningTaskList.find(f => f.task_py === 'jibo')" />
          <BorderAnimation type="square" v-if="tableData['jibo'] === 0" />
        </div>

        <div class="box julei" :class="getStatusColor(tableData['julei'])">
          <div class="top">
            <StatusIcon :type="tableData['julei']" />
          </div>
          <div class="center" @click="onCluster()">
            <span>{{ t('聚类') }}</span>
            <IconRight :title="t('发起聚类')" />
          </div>
          <div class="bottom"></div>
          <!-- <div class="bottom have-content" @click="goClusterList()">
            <IconSearch />
            聚类列表
          </div> -->
          <div class="line" v-if="tableData['julei'] !== 123"></div>
          <RunningBox v-if="tableData['julei'] === 0 && runningTaskPyList.includes('julei')"
            :data="runningTaskList.find(f => f.task_py === 'julei')" />
          <BorderAnimation type="square" v-if="tableData['julei'] === 0" />
        </div>

        <div class="box suyuan" :class="getStatusColor(tableData['suyuan'])">
          <div class="top">
            <StatusIcon :type="tableData['suyuan']" />
          </div>
          <div class="center" @click="openLocationModal()">
            <span>{{ t('聚类结果溯源定位') }}</span>
            <IconRight />
          </div>
          <div class="bottom"></div>

          <div class="line" v-if="tableData['suyuan'] !== 123"></div>
          <RunningBox v-if="tableData['suyuan'] === 0 && runningTaskPyList.includes('suyuan')"
            :data="runningTaskList.find(f => f.task_py === 'suyuan')" />
          <BorderAnimation type="square" v-if="tableData['suyuan'] === 0" />
        </div>

        <div class="box baogao" :class="getStatusColor(tableData['baogao'])">
          <div class="top">
            <StatusIcon :type="tableData['baogao']" />
          </div>
          <div class="center" @click="openReportModal()">
            <span>{{ t('生成报告') }}</span>
            <IconRight v-if="!showReportProgress" />
          </div>
          <div class="bottom have-content" @click="goReportPage()">
            <IconSearch />
            {{ t('查看报告') }}
          </div>
          <a-progress class="report-progress" v-show="showReportProgress" :percent="reportProgress" size="small"
            status="active" />
          <RunningBox v-if="tableData['baogao'] === 0 && runningTaskPyList.includes('baogao')"
            :data="runningTaskList.find(f => f.task_py === 'baogao')" />
          <BorderAnimation type="square" v-if="tableData['baogao'] === 0" />
        </div>

      </div>

    </div>
  </div>

  <!-- 一键溯源弹窗 -->
  <ParamsModal ref="paramsModalRef" @success="onSourceSuccess" />

  <!-- 配准弹窗 -->
  <CoregModal ref="coregModalRef" :megId="props.megId" :subjectId="props.subjectId" @success="getData" />

  <!-- 3D页面弹窗 -->
  <Coreg3DModal ref="coreg3DModalRef" :coregId="coregId" />

  <!-- 发起聚类弹窗 -->
  <ClusterModal ref="clusterModalRef" :subjectId="props.subjectId" :megId="props.megId" :coregId="coregId"
    @success="getData" />

  <!-- 聚类结果溯源定位弹窗 -->
  <ResultLocationModal ref="locationModalRef" :subjectId="props.subjectId" :coregId="coregId" @success="getData" />

  <!-- 发起棘波时刻点溯源定位弹窗 -->
  <StartFifSourceLocationModal ref="startFifSourceLocationModalRef" :megId="props.megId" :subjectId="props.subjectId"
    @success="getData" />

  <!-- 生成报告弹窗 -->
  <ReportModal ref="reportModalRef" :subjectId="props.subjectId" @success="getData" />

</template>

<script lang="ts" setup>
import { message, Modal } from 'ant-design-vue'
import { useWindowSize } from '@vueuse/core'

import { LottieAnimation } from "lottie-web-vue"
import ball from '@a/animation/ball.json' // 引入动画JSON文件

import StatusIcon from './StatusIcon.vue'
import RunningBox from './RunningBox.vue'

import BorderAnimation from './BorderAnimation.vue'
import ParamsModal from './modal/ParamsModal.vue'
import CoregModal from './modal/CoregModal.vue'
import Coreg3DModal from './modal/Coreg3DModal.vue'
import ClusterModal from './modal/ClusterModal.vue'
import ResultLocationModal from './modal/ResultLocationModal.vue'
import StartFifSourceLocationModal from './modal/StartFifSourceLocationModal.vue'
import ReportModal from './modal/ReportModal.vue'

import {
  startFwdApi, // 7. 开始前向任务
  stopPipelineAnalysisApi, //  17. 终止一键溯源
  getClusterSourceLocationResultListApi, // 18. 获取聚类聚类结果
} from '@/api/sl'

import {
  addSubjectApi,
  getTaskStatusApi,  // 5. 获取患者任务状态
  getEveryAlgStepUseTimeApi,  // 9. 获取每个pipeline的执行时间
} from '@/api/subject'

import {
  generateReportDataApi,// 9. 新报告数据接口，这个是新报告数据生成接口，调用会自动生成通用报告数据和个性化报告数据（目前支持三博和华西）
} from '@/api/report'

import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store/user'
import { useWebSocketStore } from '@/store/websocket'

const { t, locale } = useI18n()

const isEnglish = computed(() => locale.value === 'en-US')

const webSocketStore = useWebSocketStore()

const userStore = useUserStore()
const { versionType } = storeToRefs(userStore)

// 实时更新当前页面某数据的溯源进度
// 如果有溯源进度的id，并且当前页面存在那一条数据，则刷新
watch(() => webSocketStore.lastReceivedMessage, (newValue: any) => {
  // console.log('通知来了 :>> ');
  // 注释掉了newValue.pipelineAnalysisId的判断，因为单独发起的，通知里没有pipelineAnalysisId
  getData()
})


// 添加轮询相关变量
let pollingTimer: any = null
const HIGH_FREQ_INTERVAL = 10000 // 10秒

// 计算下一次轮询的延迟（毫秒），返回 null 表示无需继续轮询
const calculateNextDelay = () => {
  if (!runningTaskList.value || runningTaskList.value.length === 0) {
    // console.log('calculateNextDelay: 无运行中任务')
    return null
  }

  const now = Date.now()
  let minRemainingMs = Infinity
  let validTaskCount = 0

  runningTaskList.value.forEach((task, index) => {
    // console.log(`任务 ${index}: start_time=${task.start_time}, planTime=${task.planTime}, type=${typeof task.planTime}`)
    if (task.start_time && typeof task.planTime === 'number' && task.planTime > 0) {
      const startTime = new Date(task.start_time.replace(/-/g, '/')).getTime()
      if (isNaN(startTime)) {
        console.log(`任务 ${index} startTime 解析失败:`, task.start_time)
        return
      }
      const endTime = startTime + task.planTime * 1000
      const remainingMs = endTime - now
      // console.log(`任务 ${index} 剩余时间: ${remainingMs}ms`)
      if (remainingMs < minRemainingMs) {
        minRemainingMs = remainingMs
      }
      validTaskCount++
    } else {
      console.log(`任务 ${index} 数据不完整: start_time=${task.start_time}, planTime=${task.planTime}`)
    }
  })

  // console.log(`有效任务数: ${validTaskCount}, minRemainingMs: ${minRemainingMs}`)

  if (minRemainingMs === Infinity) {
    // console.log('没有有效任务数据，返回高频间隔 10000ms')
    return HIGH_FREQ_INTERVAL
  }

  if (minRemainingMs > 0) {
    // console.log(`返回剩余时间 ${minRemainingMs}ms + 100 = ${minRemainingMs + 100}ms`)
    return minRemainingMs + 100
  } else {
    // console.log('有任务已超时，返回高频间隔 10000ms')
    return HIGH_FREQ_INTERVAL
  }
}

// 启动轮询
const startPolling = () => {
  stopPolling()
  // console.log('启动轮询')

  // 如果没有运行中的任务，不启动轮询
  if (!runningTaskList.value || runningTaskList.value.length === 0) {
    // console.log('无运行中任务，不启动轮询')
    return
  }

  const schedule = () => {
    const delay = calculateNextDelay()
    if (delay !== null && delay > 0) {
      pollingTimer = setTimeout(poll, delay)
      // console.log(`首次轮询在 ${(delay / 1000).toFixed(1)} 秒后`)
    }
  }
  schedule()
}

const poll = async () => {
  // console.log('执行轮询请求...')
  await getData() // 获取最新数据

  // 如果任务列表为空，停止轮询
  if (!runningTaskList.value || runningTaskList.value.length === 0) {
    // console.log('任务列表为空，停止轮询')
    pollingTimer = null
    return
  }

  const delay = calculateNextDelay()
  // console.log('delay :>> ', delay);
  if (delay !== null && delay > 0) {
    pollingTimer = setTimeout(poll, delay)
    // console.log(`下次轮询在 ${(delay / 1000).toFixed(1)} 秒后`)
  } else {
    pollingTimer = null
  }
}

// 停止轮询
const stopPolling = () => {
  if (pollingTimer) {
    clearTimeout(pollingTimer)
    pollingTimer = null
    // console.log('轮询已停止')
  }
}



const props = defineProps({
  megId: {
    type: String,
    default: '',
  },
  subjectId: {
    type: String,
    default: '',
  },
  detailData: {
    type: Object,
    default: () => { },
  }
})

// 暴露方法
defineExpose({
  getData, // 执行中的刷新按钮要用
  clearData, // 刷新的时候清空一些数据
})

const loading = ref<boolean>(false)

onMounted(() => {
  getData().then(() => {
    // 挂载后根据初始状态决定是否轮询
    if (pipelineStatus.value === 0) {
      startPolling()
    }
  })
})

onUnmounted(() => {
  stopPolling()
})

async function onSourceSuccess() {
  await getData() // 立即更新一次
  if (pipelineStatus.value === 0) {
    startPolling() // 开启轮询
  }
}

const { width: windowWidth } = useWindowSize()


// right的值，根据窗口宽度变化而变化，在大屏下不会在最右
const listTitleRight = computed(() => {
  // 如果窗口宽度大于1700px，就逐渐变大
  if (windowWidth.value > 1700) {
    return 20 + (windowWidth.value - 1700) * 0.3
  } else {
    return 20
  }
})

// 根据页面大小对流程图整体缩放
const bodyStyle = computed(() => {
  const width = windowWidth.value
  if (width >= 2400) {
    return 'transform: scale(1.1)'
  } else if (width >= 2200 && width < 2400) {
    return 'transform: scale(1.06)'
  } else if (width >= 2000 && width < 2200) {
    return 'transform: scale(1.03)'
  } else if (width >= 1800 && width < 2000) {
    return 'transform: scale(1)'
  } else if (width >= 1700 && width < 1800) {
    return 'transform: scale(0.95)'
  } else if (width >= 1600 && width < 1700) {
    return 'transform: scale(0.9)'
  } else if (width >= 1500 && width < 1600) {
    return 'transform: scale(0.85)'
  } else if (width >= 1420 && width < 1500) {
    return 'transform: scale(0.8)'
  } else if (width >= 1330 && width < 1420) {
    return 'transform: scale(0.75)'
  } else if (width >= 1245 && width < 1330) {
    return 'transform: scale(0.7)'
  } else if (width >= 1160 && width < 1245) {
    return 'transform: scale(0.65)'
  } else if (width >= 1070 && width < 1160) {
    return 'transform: scale(0.6)'
  } else if (width < 1070) {
    return 'transform: scale(0.55)'
  }
})

// 状态列表： -2 表示未开始，灰色，  -1 失败 红色，  0  进行中，黄色  1 完成，绿色
const tableData = reactive({
  jibojiance: -2,
  jiegouxiang: -2,
  peizhun: -2,
  qianxiang: -2,
  jibo: -2,
  julei: -2,
  suyuan: -2,
  baogao: -2,
})

function getStatusColor(number: number) {
  return {
    '-2': 'status-no-start', // 灰
    '-1': 'status-error', // 红
    '0': 'status-going', // 黄
    '1': 'status-success', // 绿
  }[number] || ''
}


const pipelineStatus = ref<number>(null) // -2已终止，-1已失败，0进行中，1溯源成功，null 未开始 没有触发一键溯源
const pipelineAnalysisId = ref<string>('')
const coregId = ref<string>('')
const taskStatus = ref<any>({})

// const statusList: any = {
//   '-2': t('已终止'),
//   '-1': t('已失败'),
//   '0': t('进行中'),
//   '1': t('溯源成功'),
//   null: t('未开始')
// }

const runningTaskList = ref<any[]>([])
const runningTaskPyList = ref<string[]>([])


// const taskNameObj = {
//   '棘波检测': 'jibojiance',
//   '结构像预处理': 'jiegouxiang',
//   '配准': 'peizhun',
//   '前向任务': 'qianxiang',
//   '棘波时刻点溯源定位': 'jibo',
//   '聚类': 'julei',
//   '聚类结果溯源定位': 'suyuan',
//   '生成报告':'baogao',
// }

// const taskNameObj = {
//   detection: '棘波检测',
//   nii_fsprep: '结构像预处理',
//   coreg: '配准',
//   fwd: '前向任务',
//   spike_sl: '棘波时刻点溯源定位',
//   cluster: '聚类',
//   cluster_sl: '聚类结果溯源定位',
//   generate_report: '生成报告',
// }

// const taskNamePyEnObj = {
//   jibojiance: 'detection',
//   jiegouxiang: 'nii_fsprep',
//   peizhun: 'coreg',
//   qianxiang: 'fwd',
//   jibo: 'spike_sl',
//   julei: 'cluster',
//   suyuan: 'cluster_sl',
//   baogao: 'generate_report',
// }

const taskNameEnPyObj = {
  detection: 'jibojiance',
  nii_fsprep: 'jiegouxiang',
  coreg: 'peizhun',
  fwd: 'qianxiang',
  spike_sl: 'jibo',
  cluster: 'julei',
  cluster_sl: 'suyuan',
  generate_report: 'baogao',
}

// 每次请求会把进度条置空（每次切换患者后）
function clearData() {
  showReportProgress.value = false
  reportProgress.value = 0
  clearTimeout(timer)
}

// 获取数据
async function getData() {
  if (loading.value) return // 避免并发请求

  // const runningTask = [
  //   {
  //     "task_id": "coreg",
  //     "task_name": "配准",
  //     "start_time": "2025-05-27 10:32:31",
  //     "running_time": "1秒"
  //   }
  // ]

  // runningTask.forEach((item: any) => {
  //   item.task_py = taskNameEnPyObj[item.task_id]
  // })

  // runningTaskList.value = runningTask || []
  // runningTaskPyList.value = runningTask.map((item: any) => taskNameEnPyObj[item.task_id]) || []
  // console.log('runningTaskList.value  :>> ', runningTaskList.value);

  // return

  const params = {
    subjectId: props.subjectId,
    megId: props.megId,
  }
  loading.value = true
  const { code, data } = await getTaskStatusApi(params)
  loading.value = false
  if (code === 200) {
    if (data) {
      pipelineStatus.value = data['pipelineStatus'] // 这里不能用||，因为取值有null和0

      pipelineAnalysisId.value = data['pipelineAnalysisId']
      coregId.value = data['coregId']

      const { task_status, runningTask } = data
      taskStatus.value = task_status || {}

      if (task_status) {
        tableData.jibojiance = task_status['detection'] // '棘波检测'
        tableData.jiegouxiang = task_status['nii_fsprep'] // '结构像预处理'
        tableData.peizhun = task_status['coreg'] // '配准'
        tableData.qianxiang = task_status['fwd'] // '前向任务'
        tableData.jibo = task_status['spike_sl'] // '棘波时刻点溯源定位'
        tableData.julei = task_status['cluster'] // '聚类'
        tableData.suyuan = task_status['cluster_sl'] // '聚类结果溯源定位'
        tableData.baogao = task_status['generate_report'] // '生成报告'
      }

      runningTask.forEach((item: any) => {
        item.task_py = taskNameEnPyObj[item.task_id]
      })
      runningTaskList.value = runningTask || []
      runningTaskPyList.value = runningTask.map((item: any) => item.task_py) || []
      // console.log('runningTaskPyList.value  :>> ', runningTaskPyList.value);

      // -2已终止，-1已失败，0进行中，1溯源成功，null 未开始 没有触发一键溯源
      // 可选：任务结束后停止轮询
      if ([1, -1, -2].includes(pipelineStatus.value)) {
        stopPolling()
      }

      if (runningTask.length) {
        await getEveryAlgStepUseTime() // await不能少，必须先获取到planTime再轮询
      } else {
        everyAlgStepUseTime.value = {}
      }

    }
  }
}


const everyAlgStepUseTime = ref<any>({})

// 获取每个算法步骤的运行时间
async function getEveryAlgStepUseTime() {
  const params = {
    pipelineAnalysisId: pipelineAnalysisId.value,
    task_status: taskStatus.value,
    subjectId: props.subjectId,
  }
  const { code, data } = await getEveryAlgStepUseTimeApi(params)
  if (code === 200) {
    everyAlgStepUseTime.value = data || {}
    runningTaskList.value.forEach((item: any) => {
      item.planTime = everyAlgStepUseTime.value[item.task_id]
    })
    // console.log('object 22:>> ', runningTaskList.value);
  }
}

// 溯源开始弹窗
const paramsModalRef = ref(null)
// 一键溯源
async function onStartSource() {
  paramsModalRef.value.showModal({
    megId: props.megId,
    subjectId: props.subjectId,
  })
}

// 终止一键溯源
function onStopSource() {
  Modal.confirm({
    title: t('终止'),
    content: t('确认终止') + `【${props.megId}】？`,
    okType: 'danger',
    okText: t('终止'),
    async onOk() {
      const params = {
        pipelineAnalysisId: pipelineAnalysisId.value,
        subjectId: props.subjectId,
      }
      const { code, msg } = await stopPipelineAnalysisApi(params)
      if (code === 200) {
        message.success(msg)
        pipelineStatus.value = -2 // -2已终止
        getData()
      }
    }
  })
}


const router = useRouter()
// 去脑磁图页面
function goReviewMeg() {
  router.push({
    path: 'reviewMeg',
    query: {
      subjectId: props.subjectId,
      megId: props.megId
    }
  })
}

// 去结构像页面
function goReviewMri() {
  router.push({
    path: 'reviewMri',
    query: {
      subjectId: props.subjectId,
      megId: props.megId
    }
  })
}

// 结构像弹窗
const coreg3DModalRef = ref(null)

// 点击溯源定位按钮，打开结构像弹窗
async function goAnatPageToCoreg() {
  if (!coregId.value) {
    return message.info(t('请先进行配准'))
  }
  router.push({
    path: 'reviewMri',
    query: {
      subjectId: props.subjectId,
      megId: props.megId,
      showCoregResult: 'true',
    }
  })
}

// 点击溯源定位按钮，打开结构像弹窗
async function openCoreg3DModal() {
  if (!coregId.value) {
    return message.info(t('请先进行配准'))
  }
  // 打开3D页面
  coreg3DModalRef.value.showModal()
}


const coregModalRef = ref(null)
// 点击配准按钮
function onCoreg() {
  coregModalRef.value.showModal()
}


// 发起前向任务
async function onHandleForwardTask() {
  Modal.confirm({
    title: t('提示'),
    content: t('确认发起前向任务？'),
    async onOk() {
      const params = {
        coregId: coregId.value,
        subjectId: props.subjectId,
      }
      const { code, msg } = await startFwdApi(params)
      if (code === 200) {
        message.success(msg)
        getData()
      }
    }
  })
}


const startFifSourceLocationModalRef = ref(null)
// 点击棘波时刻点溯源定位按钮
function openStartFifSourceLocationModal() {
  startFifSourceLocationModalRef.value.showModal()
}


const clusterModalRef = ref(null)
// 点击聚类按钮
function onCluster() {
  clusterModalRef.value.showModal()
}


// 去聚类列表管理
function goClusterList() {
  router.push({
    path: 'clusterList',
    query: {
      subjectId: props.subjectId,
      megId: props.megId,
    }
  })
}


const locationModalRef = ref(null)

// 点击聚类结果溯源定位按钮
async function openLocationModal() {
  locationModalRef.value.showModal()

  // 从聚类溯源定位结果列表，获取新的算法，给聚类结果溯源定位弹窗
  const params = {
    coregId: coregId.value,
    subjectId: props.subjectId,
  }
  const { code, data } = await getClusterSourceLocationResultListApi(params)
  if (code === 200) {
    if (data.cluster_loc_method?.length) {
      locationModalRef.value.setAlg(data.cluster_loc_method[0])
    }
  }
}


const showReportProgress = ref<boolean>(false)
const reportProgress = ref<number>(0)
const reportModalRef = ref(null)

// 新的点击生成报告要弹窗
async function openReportModal() {
  if (tableData['baogao'] !== 0) {
    reportModalRef.value.showModal({
      subjectId: props.subjectId,
    })
  }
}


// 生成报告按钮
// async function createReportOld() {
//   // 最新：任何时间都可以生成报告
//   // 旧：溯源成功的才有报告

//   // 如果正在生成报告，则不执行
//   if (showReportProgress.value) {
//     return
//   }
//   const params = {
//     subjectId: props.subjectId,
//     userId: JSON.parse(localStorage.getItem('userInfo') || '{}')?.id, // 用户id
//     mainClassSpikesType: 'both'
//   }
//   setProgerss()
//   const { code, msg } = await generateReportDataApi(params)
//   if (code === 200) {
//     message.success(msg)

//     reportProgress.value = 100
//     clearTimeout(timer)
//     setTimeout(() => {
//       showReportProgress.value = false
//       reportProgress.value = 0
//     }, 1500)
//     getData()
//   } else {
//     showReportProgress.value = false
//     reportProgress.value = 0
//     clearTimeout(timer)
//   }
// }

let timer: any = null

// // 设置进度条，9秒内从0到99
// function setProgerss() {
//   showReportProgress.value = true

//   const addNum = () => {
//     timer = setTimeout(() => {
//       if (reportProgress.value < 99) {
//         reportProgress.value += 1
//         addNum()
//       }
//     }, 90) // 这个接口大概需要9秒 90=9
//   }
//   addNum()
// }

// 去临床报告页面
function goReportPage() {
  // 报告成功了才能查看报告
  if (tableData['baogao'] === 1) {
    router.push({
      // path: 'report',
      path: 'clinicalReports',
      query: {
        subjectId: props.subjectId,
        megId: props.megId,
      }
    })
  }
}

// 切换复核状态开关
async function onSwitchChecked() {
  const params = {
    subjectId: props.subjectId,
    megId: props.megId,
    subjectName: props.detailData.subjectName,
    gender: props.detailData.gender,
    birthDate: props.detailData.birthDate,
    scanDate: props.detailData.scanDate,
    megCheckTime: props.detailData.megCheckTime,
    megCheckType: props.detailData.megCheckType,
    epilepticLocation: props.detailData.epilepticLocation,
    checked: props.detailData.checked ? 1 : 0,
  }
  const { code, msg } = await addSubjectApi(params)
  if (code === 200) {
    message.success(msg, 1)
  } else {
    props.detailData.checked = !props.detailData.checked
  }
}
</script>

<style lang="less" scoped>
.progress-page {
  width: 100%;
  height: 100%;

  .list-title {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 99;
    height: 60px;
    font-size: 18px;
    color: var(--color-t2);
    margin: 0 auto;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    font-weight: 500;

    >button {
      height: 64px;
      border-radius: 12px;
      font-size: 18px;
      font-weight: 500;
    }

    .stop-button {
      // border: 2px solid;
      padding-left: 24px;
      padding-right: 24px;
    }

    .detail-data {
      font-size: 18px;
      margin-left: 30px;
      width: 670px; // 670适配英文和mac

      // display: grid;
      // grid-template-columns: 4fr 3fr;
      // grid-gap: 8px;

      border-radius: 8px;
      padding: 16px;
      border: var(--border-card);
      background: var(--color-bg);

      .item {
        display: inline-block;
        width: 50%;
        margin-top: 12px;
        padding-right: 8px;

        &:nth-child(1) {
          width: 100%;
          margin-top: 0px;
        }

        &.widthP100 {
          width: 100%;
        }

        >span:nth-child(1) {
          color: var(--color-t4);
          // font-weight: 400;
        }

        >span:nth-child(2) {
          // font-weight: 500;
          word-break: break-all;
        }
      }
    }
  }
}

.body-wrap {
  height: calc(100% - 0px);
  // overflow-x: scroll; // 既然可以缩放，就不用横向滚动条了
  margin: 0 auto;
  padding-top: 80px;
  display: grid;
  justify-content: center;
  align-items: center;

  &::-webkit-scrollbar {
    width: 16px;
    height: 16px;
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.2);
    cursor: pointer;
  }

}

@top123: 50px;
@top4: 400px;
@top5678: 225px;

.body {
  width: 1770px;
  height: 730px;
  position: relative;
  overflow: scroll;
  margin: 0 auto;
  // border: 1px solid var(--color-border);

  .ball-animation {
    position: absolute;
    // width: 1522px;
    // height: 500px;
    // top: 61px;
    // left: 120px;
    z-index: 1;

    width: 1550px;
    height: 550px;
    position: absolute;
    top: 36px;
    left: 108px;
  }


  .box {
    width: 200px;
    height: 168px;
    font-size: 18px;
    position: absolute;
    z-index: 9;
    cursor: pointer;
    border-radius: 20px;
    // box-shadow: 3px 10px 20px 0px rgba(0, 0, 0, 0.05);
    border: 2px solid var(--color-border-transparent);


    display: flex;
    flex-direction: column;


    .top {
      flex: 3;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .center {
      flex: 2;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 2px 0 8px;

      &:hover {
        background: var(--hover-bg-blue) !important;
      }
    }

    .bottom {
      flex: 1;
      width: 100%;
      display: flex;
      align-items: center;
      font-size: 14px;
      padding-left: 8px;
      border-radius: 0 0 18px 18px;
      cursor: default;


      .anticon {
        font-size: 14px;
        margin-right: 4px;
      }

      &.have-content {
        border-top: var(--border);
        cursor: pointer;

        &:hover {
          background: var(--hover-bg-blue) !important;
        }
      }


    }

    .anticon {
      font-size: 28px;

      &:hover {
        color: var(--color-primary);
      }
    }

    // 圆点
    .point {
      width: 10px;
      height: 10px;
      border-radius: 10px;
      background: #ccc;
      position: absolute;
      right: -6px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 20;
    }

    // 竖线
    .line {
      width: 43px;
      height: 4px;
      background: var(--color-primary-01);
      position: absolute;
      right: -43px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 8;
      cursor: default;
    }

    &.status-no-start {
      color: var(--color-t5);
      border-color: var(--color-border-transparent);
      background: #F8F9FA;

    }


    &.status-going {
      // border: 2px solid var(--color-primary); // 有动画就没有这个
      background: var(--color-bg);
      // background: var(--color-primary-005);
      box-shadow: 3px 10px 20px 0px rgba(0, 0, 0, 0.05);

      >.bottom {
        background: var(--color-bg); // 要给bottom加上背景色是因为runningBox会透色
        // background: var(--color-primary-005);
      }

      .point {
        background: var(--color-primary) !important; // !important要加，否则暗黑模式被覆盖
      }

    }

    &.status-error {
      color: var(--color-red);
      border-color: var(--color-red-06);
      background: #FDF7F7;
    }

    &.status-success {
      border: 2px solid var(--color-green-06);
      background: var(--color-green-005);
      background: #F7FCF5;

      >.bottom.have-content {
        border-top: 1px solid var(--color-green-02);
        color: var(--color-primary);
      }

    }


    &.jibojiance {
      top: @top4;
      left: 50px;

      .line {
        width: 533px;
        height: 181px;
        background: transparent;
        right: -533px;
        top: calc(50% - 180px);
        transform: translateY(0);
        border: 4px solid var(--color-primary-01);
        border-top: none;
        border-left: none;
        border-radius: 0 0 35px 0;
      }
    }

    &.jiegouxiang {
      top: @top123;
      left: 50px;
    }

    &.peizhun {
      top: @top123;
      left: 290px;
    }

    &.qianxiang {
      top: @top123;
      left: 530px;

      .line {
        height: 170px;
        width: 53px;
        background: transparent;
        right: -53px;
        top: calc(50% - 0px);
        transform: translateY(0);
        border: 4px solid var(--color-primary-01);
        border-bottom: none;
        border-left: none;
        border-radius: 0 35px 0 0;
      }
    }

    &.jibo {
      top: @top5678;
      left: 830px;

      .center {
        padding: 0 0 0 4px;
      }

      .line-before {
        width: 49px;
        height: 4px;
        left: -51px;
      }
    }

    &.julei {
      top: @top5678;
      left: 1070px;
    }

    &.suyuan {
      top: @top5678;
      left: 1310px;
    }

    &.baogao {
      top: @top5678;
      left: 1550px;

      // 进行中的不能点
      &.status-going>div:nth-child(2) {
        cursor: not-allowed;
      }

      &:not(.status-success)>div:nth-child(3) {
        cursor: not-allowed;
      }

      .report-progress {
        width: 170px;
        position: absolute;
        top: 58px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }

}


.dark {
  .body {
    .status-no-start {
      background: #202124;
    }

    .status-success {
      background: #1B211D;
    }

    .status-error {
      background: #211C1F;
    }

    .status-going {
      background: #1B1E26;

      >.bottom {
        background: #1B1E26; // 要给bottom加上背景色是因为runningBox会透色
      }
    }
  }
}

.color-tag {
  border-radius: 4px;
  padding: 1px 10px;
  margin-right: 20px;

  &.tag-red {
    color: var(--color-red);
    border: 1px solid var(--color-red-02);
    background: var(--color-red-005);
  }

  &.tag-green {
    color: var(--color-green);
    border: 1px solid var(--color-green-02);
    background: var(--color-green-005);
  }

  &.tag-yellow {
    color: var(--color-yellow);
    border: 1px solid var(--color-yellow-02);
    background: var(--color-yellow-005);
  }

  &.tag-gray {
    color: var(--color-t5);
    border: 1px solid var(--color-t6);
    background: rgba(128, 134, 144, 0.05);
  }

}


:deep(.switch-checked) {
  transform: translateY(-3px);

  &.ant-switch-checked {
    background-color: var(--color-green);

    &:hover:not(.ant-switch-disabled) {
      background-color: var(--color-green-dark);
    }
  }
}
</style>
