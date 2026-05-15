<template>
  <a-card class="mb16 overflow-hidden">
    <a-form class="form-list grid-5 form-round" ref="formRef" :model="form">
      <a-form-item :label="t('患者编号')" name="megId">
        <a-input v-model:value="form.megId" allowClear :placeholder="t('请输入')" size="large" />
      </a-form-item>
      <a-form-item :label="t('姓名')" name="subjectName">
        <a-input v-model:value="form.subjectName" allowClear :placeholder="t('请输入')" size="large" />
      </a-form-item>
      <a-form-item :label="t('年龄')">
        <div class="flex-start">
          <a-form-item name="startAge" class="m0 flex-auto">
            <a-input-number v-model:value="form.startAge" :placeholder="t('请输入')" :min="0" size="large" />
          </a-form-item>
          <span class="ml4 mr4">-</span>
          <a-form-item name="endAge" class="m0 flex-auto">
            <a-input-number v-model:value="form.endAge" :placeholder="t('请输入')" :min="1" size="large" />
          </a-form-item>
        </div>
      </a-form-item>
      <a-form-item :label="t('性别')" name="gender">
        <a-select v-model:value="form.gender" :options="genderList" allowClear :placeholder="t('请选择')" size="large" />
      </a-form-item>
      <a-form-item :label="t('脑磁检查类型')" name="megCheckType">
        <a-auto-complete v-model:value="form.megCheckType" :options="setOptions(megCheckTypeList)"
          :placeholder="t('请选择或输入')" :defaultActiveFirstOption="false" :filter-option="filterOption" allowClear
          size="large" />
      </a-form-item>
      <a-form-item :label="t('致痫灶位置')" name="epilepticLocation" class="mt16">
        <a-auto-complete v-model:value="form.epilepticLocation" :options="setOptions(epilepticLocationList)"
          :placeholder="t('请选择或输入')" :defaultActiveFirstOption="false" :filter-option="filterOption" allowClear
          size="large" />
      </a-form-item>
      <a-form-item :label="t('溯源状态')" name="pipelineStatus" class="mt16">
        <a-select v-model:value="form.pipelineStatus" :options="statusList" allowClear :placeholder="t('请选择')"
          size="large" />
      </a-form-item>
      <a-form-item :label="t('复核状态')" name="checked" class="mt16">
        <a-select v-model:value="form.checked" :options="checkedList" allowClear :placeholder="t('请选择')" size="large" />
      </a-form-item>
      <a-form-item>
      </a-form-item>
      <a-form-item class="text-right mt16">
        <a-space :size="16">
          <a-button type="default" @click="onReset()">
            <IconReset />
            {{ t('重置') }}
          </a-button>
          <a-button type="primary" @click="onSearch()">
            <IconSearch />
            {{ t('查询') }}
          </a-button>
        </a-space>
      </a-form-item>

    </a-form>
  </a-card>

  <a-card>

    <div class="flex-between mb16">
      <div>
        <a-button class="light-primary-btn mr8" v-if="runningTask && runningTask?.pipelineStatus === 0" type="primary"
          :title="t('点击查询')" @click="clickIsRunningTask()">
          <loading-outlined />
          {{ runningTask?.megId }}
          {{ t('溯源进行中') }}
        </a-button>
        <a-button class="light-red-btn mr8" v-if="runningTask && runningTask?.pipelineStatus === -1" :title="t('点击查询')"
          @click="clickIsRunningTask()">
          <span class="anticon">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20" fill="none">
              <path
                d="M11.7679 9.06558L8.23233 12.6011M11.7679 12.6011L8.23233 9.06556M18.3334 8.33333V14.1667C18.3334 16.0076 16.841 17.5 15.0001 17.5H5.00008C3.15913 17.5 1.66675 16.0076 1.66675 14.1667V5.83333C1.66675 3.99238 3.15913 2.5 5.00008 2.5H7.2223C7.94354 2.5 8.64532 2.73393 9.2223 3.16667L10.7779 4.33333C11.3548 4.76607 12.0566 5 12.7779 5H15.0001C16.841 5 18.3334 6.49238 18.3334 8.33333Z"
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          {{ runningTask?.megId }}
          {{ t('溯源失败') }}
        </a-button>
      </div>

      <a-space :size="16" class="flex-end">

        <div class="color-t5">
          {{ t('压缩包上传格式') }}
          <a-popover trigger="click">
            <QuestionCircleOutlined />
            <template #content>
              <Format />
            </template>
          </a-popover>
        </div>

        <UploadData @uploadFileSuccess="uploadFileSuccess" />


        <a-button v-if="!batchPipelineAnalysisId" type="primary" :disabled="!selectedRowKeysAll.length"
          :title="!selectedRowKeysAll.length ? t('请先选择要批量溯源的数据（可跨页多选）') : t('可跨页多选')" @click="onBatchSource()">
          <IconStart />
          {{ t('批量溯源') }}
        </a-button>


        <div class="target-time" v-if="batchPipelineAnalysisId">
          <span class="time" v-if="batchStatus === -3 && targetTime">{{ targetTime }} {{ t('开始') }}</span>

          <a-button type="primary" @click="onBatchPipeStatus()">
            <loading-outlined v-if="batchStatus === 0" />
            {{ t('批量溯源状态') }}
          </a-button>
        </div>

        <a-button type="primary" @click="onAdd()">
          <PlusCircleOutlined />
          {{ t('新增') }}
        </a-button>


        <a-button type="default" :disabled="!selectedRowKeysAll.length"
          :title="!selectedRowKeysAll.length ? t('请先选择要删除的患者') : null" @click="onDeleteBatch()">
          <IconDelete />
          {{ t('删除') }}
        </a-button>

        <!-- <template v-if="showFold">
        <a-button v-if="isFold" @click="onFold(false)">
          <IconDown />
          展开
        </a-button>
        <a-button v-else @click="onFold(true)">
          <UpOutlined />
          收起
        </a-button>
      </template> -->

      </a-space>
    </div>

    <a-table rowKey="subjectId" :columns="realColumns" :data-source="tableData" :loading="loading" :pagination="false"
      :scroll="{ x: true }" :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: selectTable,
      }" @change="changeTable">

      <template #bodyCell="{ index, record, column }">
        <template v-if="column.dataIndex === 'theIndex'">
          {{ (pageNum - 1) * pageSize + index + 1 }}
        </template>

        <template v-if="column.dataIndex === 'megCheckType'">
          <span v-if="!record.isEditType">
            {{ record.megCheckType || '-' }}
            <EditOutlined class="edit-icon" :title="t('编辑')" @click="editMegCheckType(record)" />
          </span>
          <span v-if="record.isEditType">
            <a-auto-complete class="auto-complete" v-model:value="record.megCheckTypeEdit"
              :options="setOptions(megCheckTypeList)" :placeholder="t('请选择或输入')" :defaultActiveFirstOption="false"
              :dropdownMatchSelectWidth="false" :filter-option="filterOption" allowClear size="large"
              @select="() => saveMegCheckTypeSelect(record)" @blur="() => saveMegCheckTypeBlur(record)" />
          </span>
        </template>

        <template v-if="column.dataIndex === 'epilepticLocation'">
          <span v-if="!record.isEditLocation">
            {{ record.epilepticLocation || '-' }}
            <EditOutlined class="edit-icon" :title="t('编辑')" @click="editEpilepticLocation(record)" />
          </span>
          <span v-if="record.isEditLocation">
            <a-auto-complete class="auto-complete" v-model:value="record.epilepticLocationEdit"
              :options="setOptions(epilepticLocationList)" :placeholder="t('请选择或输入')" :defaultActiveFirstOption="false"
              :dropdownMatchSelectWidth="false" :filter-option="filterOption" allowClear size="large"
              @select="() => saveEpilepticLocationSelect(record)" @blur="() => saveEpilepticLocationBlur(record)" />
          </span>
        </template>

        <template v-if="column.dataIndex === 'checked'">
          <a-tooltip placement="right">
            <a-switch class="switch-checked" v-model:checked="record.checked" size="small"
              @change="onSwitchChecked(record)" />
            <template #title> {{ record.checked ? t('已复核') : t('未复核') }} </template>
          </a-tooltip>
        </template>


        <!-- pipelineStatus：null 没有触发一键溯源的，-2 已终止，-1 失败 ， 0  进行中  ， 1 成功 -->

        <template v-if="column.dataIndex === 'pipelineStatus'">

          <div class="table-total-progress">
            <div class="color-tag" :class="{
              'tag-gray': record.pipelineStatus === -2 || record.pipelineStatus === null,
              'tag-red': record.pipelineStatus === -1,
              'tag-yellow': record.pipelineStatus === 0,
              'tag-green': record.pipelineStatus === 1,
            }" v-if="[null, -2, 1].includes(record.pipelineStatus)">
              <span v-if="record.pipelineStatus === null">{{ t('未开始') }}</span>
              <span v-if="record.pipelineStatus === -2">{{ t('已终止') }}</span>
              <span v-if="record.pipelineStatus === 1">{{ t('已完成') }}</span>
            </div>
          </div>



          <div class="flex-center" style="width: 70px;" v-if="[-1, 0].includes(record.pipelineStatus)">

            <!-- :open='true' -->
            <a-popover placement="right" overlayClassName="patientList-progress-popover">
              <!-- -1失败和0进行中都展示环 12.5%=13%是1/8，14%=13%是1/7，失败是红色圈 -->
              <!-- 移入的时候请求接口查看最新进度 -->
              <!-- 溯源进度环更大，颜色改成绿色，进度百分比在环内显示 -->
              <a-progress v-if="[-1, 0].includes(record.pipelineStatus)" class="cursor-pointer" type="circle"
                :percent="record.progressValue || 1" :size="32" :stroke-color="record.pipelineStatus === 0 ? {
                  '0%': 'var(--color-green)',
                  '100%': 'var(--color-green)'
                } : 'var(--color-red)'" :title="null" @mouseover="mouseoverPopover(record)"
                @mouseleave="mouseleavePopover(record)" />

              <template #content>
                <div class="progress-box" v-if="record?.progressObj">

                  <!-- 对象循环更简单 -->
                  <div v-for="(value, key, index) in record?.progressObj" :key="index"
                    class="progress-item flex-between">

                    <span>{{ key }}：</span>
                    <div class="flex-center">
                      <span class="ml4" :style="{ color: setProgressColor(value) }">
                        {{ setProgressLabel(value) }}
                      </span>
                      <div class="right-icon flex-start">
                        <!-- 1成功会有一个√图标动画 -->
                        <LottieAnimation class="ml4 flex-center" v-if="value === 1" :animation-data="successJson"
                          :auto-play="true" :loop="false" :speed="1" />
                        <!-- 0进行中，loading动画 -->
                        <LottieAnimation class="ml4 flex-center" v-if="value === 0" :animation-data="loadingJson"
                          :auto-play="true" :loop="true" :speed="1" />

                      </div>
                    </div>
                  </div>

                  <div class="progress-item flex-between total-progress">
                    <span>{{ t('总进度') }}：</span>

                    <div class="color-tag" :class="{
                      'tag-gray': record.pipelineStatus === -2 || record.pipelineStatus === -3,
                      'tag-red': record.pipelineStatus === -1,
                      'tag-yellow': record.pipelineStatus === 0,
                      'tag-green': record.pipelineStatus === 1,
                    }">
                      <span v-if="record.pipelineStatus === -3">{{ t('未开始') }}</span>
                      <span v-if="record.pipelineStatus === -2">{{ t('已终止') }}</span>
                      <span v-if="record.pipelineStatus === -1">{{ t('已失败') }}</span>
                      <span v-if="record.pipelineStatus === 0">{{ t('进行中') }}</span>
                      <span v-if="record.pipelineStatus === 1">{{ t('溯源成功') }}</span>
                    </div>
                  </div>

                  <div class="text-center">

                    <!-- 失败和进行中都可以终止 -->
                    <a-button class="stop-button color-t5" type="default" size="small" shape="round"
                      v-if="[-1, 0].includes(record.pipelineStatus)" @click="onStopSource(record)">
                      <IconStop />
                      {{ t('终止溯源') }}
                    </a-button>

                  </div>

                </div>
              </template>
            </a-popover>


          </div>
        </template>


        <template v-if="column.dataIndex === 'operation'">
          <a-space>

            <a href="javascript:;" @click="goStartAnalysis(record)">{{ t('溯源定位') }}</a>

            <!-- 3个点快速跳转到其他tab去，现在不展示了 -->
            <!-- <a-dropdown placement="bottom">
              <a @click.prevent>
                ···
              </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item class="text-center">
                    <span class="color-blue" @click="goReviewMeg(record)">脑磁图</span>
                  </a-menu-item>
                  <a-menu-item class="text-center">
                    <span class="color-blue" @click="goReviewMri(record)">结构像</span>
                  </a-menu-item>
                  <a-menu-item class="text-center">
                    <span class="color-blue" @click="goReviewEeg(record)">脑电图</span>
                  </a-menu-item>
                  <a-menu-item class="text-center">
                    <span class="color-blue" @click="clickLocation(record)">溯源定位结果</span>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown> -->

            <!-- <a-divider type="vertical" class="m0" /> -->

            <!-- 上下排布时 -->
            <!-- <div class="flex flex-column" v-if="record.pipelineStatus === 1">
              <a href="javascript:;" v-show="!record.showReportProgress" @click="createReport(record)">生成报告</a>
              <a-progress class="mb4" v-show="record.showReportProgress" :percent="record.reportProgress" size="small" status="active" />
              <a href="javascript:;" @click="goReport(record)">查看报告</a>
            </div>
            <div class="flex flex-column color-t6" v-else>
              <span>生成报告</span>
              <span>查看报告</span>
            </div> -->

            <!-- 溯源成功的才有报告 -->
            <div class="flex-start" v-if="record.pipelineStatus === 1">
              <!-- <a href="javascript:;" v-show="!record.showReportProgress" @click="createReport(record)">生成报告</a>
              <a-progress v-show="record.showReportProgress" :percent="record.reportProgress" size="small"
                status="active" style="width: 56px;" /> -->
              <a href="javascript:;" @click="goReport(record)">{{ t('查看报告') }}</a>
            </div>
            <div class="flex-start color-t6" v-else>
              <span>{{ t('查看报告') }}</span>
            </div>

            <a href="javascript:;" @click="goCoregPage(record)">{{ t('共注册') }}</a>
            <a href="javascript:;" @click="onEdit(record)">{{ t('编辑') }}</a>
            <!-- <a href="javascript:;" @click="onDetail(record)">详情</a> -->
            <!-- <a href="javascript:;" @click="onDelete(record)">删除</a> -->
          </a-space>
        </template>
      </template>
    </a-table>

    <a-pagination v-model:current="pageNum" v-model:pageSize="pageSize" :total="total"
      :show-total="(total: number) => `${t('pagination.showTotal', { total })} `" :showSizeChanger="true"
      @change="changePage" />

  </a-card>

  <a-back-top class="back-top-btn" />

  <!-- 新增、修改弹窗 -->
  <AddEditModal ref="addEditModalRef" @success="getData" />

  <!-- 溯源定位弹窗 -->
  <!-- <LocationModal ref="locationModalRef" /> -->

  <!-- 批量一键溯源弹窗 -->
  <BatchParamsModal ref="batchParamsModalRef" @success="getDataFromBatchParamsModal" />

  <!-- 批量一键溯源进度弹窗 -->
  <BatchPipeStatusModal ref="batchPipeStatusModalRef" @success="getDataFromBatchPipeStatusModal"
    @setBatchStatus="setBatchStatus" />


</template>

<script lang="ts" setup>
import { LottieAnimation } from "lottie-web-vue"
import loadingJson from '@a/animation/loading.json' // 引入动画JSON文件
import successJson from '@a/animation/success.json' // 引入动画JSON文件
import { message, Modal, type FormInstance } from 'ant-design-vue'
import { calculateAge, formatFileSize } from '@u/utils'
import { confirmDeleteModal } from '@u/modal'

// import useFold from '@/hooks/useFold'
import useKeyUp from '@/hooks/useKeyUp'
import { genderList } from '@u/data'
import { tableConfig } from './config'

import UploadData from './UploadData.vue'
import Format from './Format.vue'

// import LocationModal from './modal/LocationModal.vue'
import AddEditModal from './modal/AddEditModal.vue'
import BatchParamsModal from './modal/BatchParamsModal.vue'
import BatchPipeStatusModal from './modal/BatchPipeStatusModal.vue'

import {
  addSubjectApi,
  listApi, // 3. 按条件分页查询患者列表
  deleteSubjectByIdApi, // 4. 删除患者
  getRunningOrFailedPipeListApi, // 8. 获取一键溯源进行中或者失败的某个患者
} from '@/api/subject'
import {
  getPipelineStatusApi,    // 14. 获取一键溯源进度
  stopPipelineAnalysisApi, //  17. 终止一键溯源
} from '@/api/sl'
import {
  generateReportApi,  // 20. 生成报告
} from '@/api/meg'

import { useUploadStore } from '@/store/upload'
import { useWebSocketStore } from '@/store/websocket'
import { usePatientStore } from '@/store/patient'

const { t } = useI18n()

const uploadStore = useUploadStore()
const webSocketStore = useWebSocketStore()

// 当最新上传成功的文件变化时，刷新列表
// 1：患者数据集   2：DICOM文件  3：NIFTI文件  4：脑电图文件   5：脑磁图文件
watch(() => uploadStore.lastUploadedFile, (newValue: any) => {
  if (newValue.fileType === 1) {
    // 大概3秒后，列表里才会出现新的一条数据
    setTimeout(() => {
      getData()
    }, 3000)
  }

  if (newValue.fileType === 6 && newValue.allFinished) {
    // 大概3秒后，列表里才会出现新的一条数据
    setTimeout(() => {
      getData()
    }, 3000)
  }
})

// 实时更新当前页面某数据的溯源进度
// 如果有溯源进度的id，并且当前页面存在那一条数据，则刷新
watch(() => webSocketStore.lastReceivedMessage, (newValue: any) => {
  // console.log('通知内容 :>> ', newValue);

  // 如果有通知了，但当前还是-3：未开始，就重新获取list
  if (batchStatus.value === -3) {
    getData()
    return
  }

  // 有batchPipelineAnalysisId，代表批量溯源任务结束，只需要刷新list就行。
  if (newValue.batchPipelineAnalysisId) {
    getData()
    return
  }

  // 匹配id更新
  getRunningTask() // 刷新一下更好
  if (newValue.subjectId && newValue.pipelineAnalysisId) {
    const record = tableData.value.find(item => item.subjectId === newValue.subjectId)
    if (record) {
      record.pipelineAnalysisId = newValue.pipelineAnalysisId
      getPipelineStatus(record)
    }
  }
})

const megCheckTypeList = [t('癫痫'), t('精神科'), t('痴呆')]
const epilepticLocationList = [t('颞叶内侧'), t('颞叶外侧'), t('额叶'), t('顶叶')]

const statusList = [
  { label: t('未开始'), value: 999 },
  { label: t('进行中'), value: 0 },
  { label: t('已完成'), value: 1 },
  { label: t('已失败'), value: -1 },
  { label: t('已终止'), value: -2 },
]

const checkedList = [
  { label: t('已复核'), value: 1 },
  { label: t('未复核'), value: 0 },
]

function filterOption(input: string, option: any) {
  return option.label
}

function setOptions(list: any[]) {
  return list.map(item => {
    return {
      label: item,
      value: item,
    }
  })
}


const formRef = ref<FormInstance>()
const addEditModalRef = ref(null)
const batchParamsModalRef = ref(null)
const batchPipeStatusModalRef = ref(null)

// const { formClass, isFold, showFold, onFold } = useFold('.form-list')

interface IForm {
  id?: string
  subjectId: string
  subjectName: string
  megId: string
  gender: number
  startAge: number
  endAge: number
  t1wSize?: number
  megSize?: number
  pipelineAnalysisId?: string
  megCheckType?: string
  epilepticLocation?: string
  pipelineStatus?: number
  isEditType?: boolean
  isEditLocation?: boolean
  checked?: number
}

const form = reactive<IForm>({
  subjectId: null,
  subjectName: null,
  megId: null,
  startAge: null,
  endAge: null,
  gender: null,
  megCheckType: null,
  epilepticLocation: null,
  pipelineStatus: null,
  checked: null,
})

const tableData = ref<IForm[]>([])
const loading = ref<boolean>(false)
const total = ref<number>(0)
const pageNum = ref<number>(1)
const pageSize = ref<number>(10)


const selectedRowKeys = ref<string[]>([])
const selectedRows = ref<IForm[]>([])

const selectedRowKeysAll = ref<string[]>([])  // 跨页所有选中项的ID
const selectedRowsAll = ref<any[]>([])        // 跨页所有选中项完整数据

const route = useRoute()
// 从其他页面回来，获取当前页的最新数据，可以获取到最新的溯源进度
watch(() => route.path, (newPath, oldPath) => {
  if (newPath === '/patientList') {
    nextTick(getData)
  }
})

// 敲击键盘
useKeyUp((key: string) => {
  if (key === 'Enter') {

    // :defaultActiveFirstOption="false" 一定要加，否则按下回车键，会自动选中默认选项，haveEdit会是false
    const haveEdit = tableData.value.some(item => item.isEditType || item.isEditLocation)

    // 如果有编辑状态的
    if (haveEdit) {
      tableData.value.forEach(item => {
        if (item.isEditType || item.isEditLocation) {
          saveData(item)
        }
      })
    } else {
      // 没打开新增编辑页面的时候才刷新表格
      if (!addEditModalRef.value.visible) {
        onSearch()
      }
    }
  }

  // if (key === 'ArrowLeft') {
  //   if (pageNum.value - 1 >= 1) {
  //     pageNum.value -= 1
  //     getData()
  //   }
  // }
  // if (key === 'ArrowRight') {
  //   if (pageNum.value + 1 <= Math.ceil(total.value / pageSize.value)) {
  //     pageNum.value += 1
  //     getData()
  //   }
  // }
  // if (key === 'ArrowUp') {
  //   onFold(true)
  // }
  // if (key === 'ArrowDown') {
  //   onFold(false)
  // }
  if (key === '+') {
    onAdd()
  }
})

const batchPipelineAnalysisId = ref<string>('') // 批量一键溯源的id
const celeryTaskId = ref<string>('')
const targetTime = ref<string>('') // 批量一键溯源的目标时间
const batchStatus = ref<number>() // 批量一键溯源的总状态
const runningTask = ref<any>(null) // 正在跑或者失败的某个患者

const taskNameObj = {
  detection: t('棘波检测'),
  nii_fsprep: t('结构像预处理'),
  coreg: t('配准'),
  fwd: t('前向任务'),
  spike_sl: t('棘波时刻点溯源定位'),
  cluster: t('聚类'),
  cluster_sl: t('聚类结果溯源定位'),
  generate_report: t('生成报告'),
}

const realColumns = ref<any>(tableConfig.columns)

onMounted(() => {
  // 排序也缓存起来
  const patientListOrderField = localStorage.getItem('patientListOrderField')
  const patientListOrder = localStorage.getItem('patientListOrder')
  orderField.value = patientListOrderField === 'null' ? null : patientListOrderField
  order.value = patientListOrder === 'null' ? null : patientListOrder

  if (orderField.value && order.value) {
    updateColumnSortOrders()
  }
  getData()
})

// 获取正在进行中或者失败的某个患者
async function getRunningTask() {
  const { code, data } = await getRunningOrFailedPipeListApi({})
  if (code === 200) {
    runningTask.value = data[0] || null
  }
}

// 点击正在进行中的或者已失败的
function clickIsRunningTask() {
  formRef.value.resetFields()
  form.megId = runningTask.value.megId
  onSearch()
}

// 排序参数
const orderField = ref<string>(null) // 传 createTime | megId | subjectName
const order = ref<string>(null)  // 传 asc | desc

// 处理表格变化（分页、排序、筛选），现在只有排序
function changeTable(pagination: any, filters: any, sorter: any) {
  // 取消排序时，就清空排序条件
  if (!sorter.order) {
    orderField.value = null
    order.value = null
  } else {
    orderField.value = sorter.field
    order.value = sorter.order === 'ascend' ? 'asc' : 'desc'
  }

  // 排序也缓存起来
  localStorage.setItem('patientListOrderField', orderField.value)
  localStorage.setItem('patientListOrder', order.value)

  updateColumnSortOrders()

  getData()
}

// 更新列排序状态的方法
function updateColumnSortOrders() {
  realColumns.value = realColumns.value.map((column: { dataIndex: string }) => {
    if (column.dataIndex === orderField.value) {
      // 当前排序列
      return {
        ...column,
        sortOrder: order.value === 'desc' ? 'descend' : 'ascend'
      }
    } else {
      // 其他列清除排序状态
      return {
        ...column,
        sortOrder: null
      }
    }
  })
}

// 获取数据
async function getData() {
  getRunningTask() // 获取正在进行中或者失败的某个患者

  selectedRowKeys.value = [] // 先取消选中数据。selectTable([], [])这种方式在跨页不行了
  selectedRows.value = []

  const params: any = {
    ...form,
    pageNum: pageNum.value,
    pageSize: pageSize.value,
  }

  //  pipelineStatus 999:未开始但传null，0:进行中，1:已完成，-1:已失败，-2:已终止
  delete params.pipelineStatus
  if ([999, 0, 1, -1, -2].includes(form.pipelineStatus)) {
    params.pipelineStatus = form.pipelineStatus
    if (form.pipelineStatus === 999) {
      params.pipelineStatus = null
    }
  }


  // 排序参数
  if (orderField.value) {
    params.orderField = orderField.value
    params.order = order.value
  }
  loading.value = true
  const { code, data } = await listApi(params)
  loading.value = false
  if (code === 200) {
    tableData.value = data.records?.map((item: any) => {
      // if(item.megId === '0079') {
      //   item.pipelineStatus = 0
      // }
      // 失败和进行中的计算进度值progressValue
      if ([-1, 0].includes(item.pipelineStatus) && item.pipelineExecutionStatus) {
        // 现在是英文，要转成中文
        const pipelineStatusCnName = {}
        Object.keys(item.pipelineExecutionStatus).forEach(key => {
          pipelineStatusCnName[taskNameObj[key]] = item.pipelineExecutionStatus[key]
        })
        item.progressObj = pipelineStatusCnName || {}
        const finishNum = Object.values(item.progressObj).filter(item => item === 1)
        item.progressValue = parseInt((Number(finishNum.length / 8) * 100).toFixed(0))
      }
      return {
        ...item,
        id: item.subjectId, // 用于勾选时计算方便
        age: calculateAge(item.birthDate) || '-', // 年龄
        totalSize: formatFileSize(item.t1wSize + item.megSize), // 数据集大小
        showReportProgress: false, // 显示生成报告进度条
        reportProgress: 0, // 生成报告的进度条值
        isEditType: false,
        isEditLocation: false,
        megCheckTypeEdit: item.megCheckType,
        epilepticLocationEdit: item.epilepticLocation,
        checked: item.checked === 1 ? true : false,
      }
    })
    total.value = data.total || 0
    // 查询和撤销批量一键溯源时会用到
    batchPipelineAnalysisId.value = data.batchPipelineAnalysisId
    celeryTaskId.value = data.celeryTaskId
    targetTime.value = data.targetTime
    batchStatus.value = data.batchStatus // 批量的总状态：-1：失败，0：正在进行，1：成功, -2: 已撤销， -3：未开始

    // 从全局选中列表中恢复当前页选中状态
    selectedRowKeys.value = tableData.value
      .map(item => item.id)
      .filter(id => selectedRowKeysAll.value.includes(id))
  }
}

// 新增
function onAdd() {
  addEditModalRef.value.showModal('add')
}

// 编辑
function onEdit(record: IForm) {
  addEditModalRef.value.showModal('edit', record)
}

const router = useRouter()

// 溯源定位
function goStartAnalysis(record: IForm) {

  // 优化：把 ['reviewMeg', 'reviewEeg', 'viewResults', 'reviewMri', 'startAnalysis']这5个页面的选择患者清空掉
  // 防止首页新增了患者，但进入溯源发起页面后选择患者列表还是缓存的
  const patientStore = usePatientStore()
  patientStore.clearPatientList()

  router.push({
    path: 'startAnalysis',
    query: {
      subjectId: record.subjectId,
      megId: record.megId
    }
  })
  toggleFullScreen()
}

// 去共注册页面
function goCoregPage(record: IForm) {
  router.push({
    path: 'multiImageCoreg',
    query: {
      subjectId: record.subjectId,
      megId: record.megId
    }
  })
}

// // 详情
// function onDetail(record: IForm) {
//   router.push({
//     path: 'patientDetail',
//     query: {
//       subjectId: record.subjectId
//     }
//   })
// }

// // 脑磁图
// function goReviewMeg(record: IForm) {
//   router.push({
//     path: 'reviewMeg',
//     query: {
//       subjectId: record.subjectId,
//       megId: record.megId
//     }
//   })
// }

// // 脑电图
// function goReviewEeg(record: IForm) {
//   router.push({
//     path: 'reviewEeg',
//     query: {
//       subjectId: record.subjectId,
//       megId: record.megId
//     }
//   })
// }

// // 结构像
// function goReviewMri(record: IForm) {
//   router.push({
//     path: 'reviewMri',
//     query: {
//       subjectId: record.subjectId,
//       megId: record.megId
//     }
//   })
// }




// 检查是否处于全屏状态
function checkFullScreen() {
  return document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement;
};


// 切换全屏状态
function toggleFullScreen() {
  const targetElement = document.documentElement;
  if (!checkFullScreen()) {
    if (targetElement.requestFullscreen) {
      targetElement.requestFullscreen();
    } else if (targetElement.webkitRequestFullscreen) {
      targetElement.webkitRequestFullscreen();
    } else if (targetElement.mozRequestFullScreen) {
      targetElement.mozRequestFullScreen();
    } else if (targetElement.msRequestFullscreen) {
      targetElement.msRequestFullscreen();
    }
  }
};


// // 溯源定位弹窗
// const locationModalRef = ref(null)
// // 点击溯源定位
// function clickLocation(record: IForm) {
//   locationModalRef.value.showModal(record)
// }

// 查询
function onSearch() {
  pageNum.value = 1
  selectedRowKeysAll.value = []
  selectedRowsAll.value = []
  getData()
}

// 重置
function onReset() {
  formRef.value.resetFields()
  onSearch()
}

// 修改页码
function changePage(num: number, size: number) {
  pageNum.value = num
  pageSize.value = size
  getData()
}


// 查看报告
function goReport(record: IForm) {
  router.push({
    path: 'clinicalReports',
    query: {
      subjectId: record.subjectId,
      megId: record.megId,
    }
  })
}

// 鼠标移入
function mouseoverPopover(record: any) {
  // if (!record.gettingStatus) {
  //   record.gettingStatus = true  // 正在获取状态接口中，如移动触发则不重新获取
  //   getPipelineStatus(record)
  // }
}

// 鼠标移出
function mouseleavePopover(record: any) {
  // if (record.gettingStatus) {
  //   record.gettingStatus = false
  // }
}

// 获取一键溯源的进度
async function getPipelineStatus(record: any) {
  const params = {
    pipelineAnalysisId: record.pipelineAnalysisId,
  }
  const { code, data } = await getPipelineStatusApi(params)
  if (code === 200) {
    // 现在是英文，要转成中文
    const pipelineStatusCnName = {}
    Object.keys(data).forEach(key => {
      pipelineStatusCnName[taskNameObj[key]] = data[key]
    })
    const target: any = tableData.value.find((item: any) => item.subjectId === record.subjectId)
    target.progressObj = pipelineStatusCnName || {}
    // 找到完成的数量，除以8，就是进度值
    const finishNum = Object.values(target.progressObj).filter(item => item === 1)
    target.progressValue = parseInt((Number(finishNum.length / 8) * 100).toFixed(0))
    // 最新：又改回8了
    // 最新：7/8都是完成状态，报告没完成也算完成，所以改成>=7
    // 如果都完成了，就改成完成状态
    if (finishNum.length >= 8) {
      setTimeout(() => {
        target.pipelineStatus = 1
        getData() // 加上。如果不加，那第一个整体都成功了，那批量里的第二个患者就没有开始转圈，但实际已经在跑了。所以加上
      }, 3000)
    } else {
      // 如果数量不到8，就是进行中，一定要改
      target.pipelineStatus = 0
    }
  }
}

// -2 表示未开始，灰色，  -1 失败 红色，  0  进行中，黄色  1 完成，绿色
function setProgressLabel(number: number) {
  return {
    '-2': t('未开始'),
    '-1': t('失败'),
    '0': t('进行中'),
    '1': t('已完成'),
  }[number] || ''
}
function setProgressColor(number: number) {
  return {
    '-2': 'var(--color-t5)', // 灰
    '-1': 'var(--color-red)', // 红
    '0': 'var(--color-yellow)', // 黄
    '1': 'var(--color-green)', // 绿
  }[number] || ''
}

// 终止一键溯源
function onStopSource(record: any) {
  Modal.confirm({
    title: t('终止'),
    content: `确认终止【${record.megId}】？`,
    okType: 'danger',
    okText: t('终止'),
    async onOk() {
      const params = {
        pipelineAnalysisId: record.pipelineAnalysisId,
        subjectId: record.subjectId,
      }
      const { code, msg } = await stopPipelineAnalysisApi(params)
      if (code === 200) {
        message.success(msg)
        record.pipelineStatus = -2 // -2 表示已终止
        Object.keys(record.progressObj).forEach(key => {
          record.progressObj[key] = -2 // -2 表示未开始，灰色
        })
        getRunningTask() // 这里肯定要刷新一下
      }
    },
  })

}

// 现在生成报告只在溯源发起页面，而且还要弹出弹窗，不是一个按钮的事了
// 生成报告按钮
async function createReport(record: any) {
  // 如果正在生成报告，则不执行
  if (record.showReportProgress) {
    return
  }
  const params = {
    subjectId: record.subjectId,
  }
  setProgerss(record)
  const { code, msg } = await generateReportApi(params)
  if (code === 200) {
    message.success(msg)

    record.reportProgress = 100
    clearTimeout(timer)
    setTimeout(() => {
      record.showReportProgress = false
      record.reportProgress = 0
    }, 1500)
  } else {
    record.showReportProgress = false
    record.reportProgress = 0
    clearTimeout(timer)
  }
}

let timer: any = null

// 设置进度条，9秒内从0到99
function setProgerss(record: any) {
  record.showReportProgress = true

  const addNum = () => {
    timer = setTimeout(() => {
      if (record.reportProgress < 99) {
        record.reportProgress += 1
        addNum()
      }
    }, 90) // 这个接口大概需要9秒 90=9
  }
  addNum()
}


// 上传数据成功，刷选患者数据列表
function uploadFileSuccess() {
  if (pageNum.value === 1) {
    getData()
  }
}


// 删除患者
function onDelete(record: IForm) {
  // const content = t('删除患者【{megId}】的同时，会删除患者的影像文件，是否确定删除？', { megId: record.megId })
  confirmDeleteModal(t('删除'), `删除患者【${record.megId}】的同时，会删除患者的影像文件，是否确定删除？`, async () => {
    const params = {
      subjectId: record.subjectId
    }
    const { code, msg } = await deleteSubjectByIdApi(params)
    if (code === 200) {
      message.success(msg)
      const lastLength = total.value % pageSize.value
      const deleteNum = 1
      if (pageNum.value > 1 && (deleteNum === pageSize.value || deleteNum === lastLength)) {
        pageNum.value--
      }
      getData()
    }
  })
}

// 批量删除
function onDeleteBatch() {
  if (!selectedRowKeysAll.value.length) {
    return message.info(t('请先选择要删除的数据'))
  }

  const megIdList = selectedRowsAll.value.map(item => item.megId)

  // const content = `删除患者 ${megIdList.join('，')} 会同时删除患者的影像文件以及溯源结果，是否确定删除？`
  const content = t('删除患者 {name} 会同时删除患者的影像文件以及溯源结果，是否确定删除？', { name: megIdList.join('，') })

  confirmDeleteModal(t('批量删除'), content, () => {
    let deletedNum = 0 // 已删除的数量

    selectedRowsAll.value.map(async (item, index) => {
      const params = {
        subjectId: item.subjectId,
      }
      const { code, msg } = await deleteSubjectByIdApi(params)
      deletedNum += 1 // 不管成功还是失败都要加1
      if (code === 200) {
        message.success(`${item.megId} ${msg}`)
        // 都删除完了再刷新页面
        if (deletedNum === selectedRowsAll.value.length) {
          onSearch()
        }
      }
    })
  })

  // 删除患者Sub01、Sub02时会同时删除患者的影像文件以及溯源结果，是否确定删除？

  // const pList: any[] = []
  // pList.push(h('div', { class: 'mb16' }, '确认删除选中文件？'))
  // selectedRowKeys.value.forEach((item) => {
  //   pList.push(h('div', {
  //     style : {
  //       padding: '6px 12px',
  //       margin: '6px 12px 0 0',
  //       background: 'var(--color-bg-gray)',
  //       borderRadius: '8px'
  //     }
  //   }, item))
  // })

  // confirmDeleteModal(t('批量删除'), h('div', { class: 'break-all' }, pList), () => {

  //   let deletedNum = 0 // 已删除的数量

  //   selectedRowKeys.value.map(async (item, index) => {
  //     const params = {
  //       subjectId: '',
  //       filePath: item
  //     }
  //     // const { code, msg } = await deleteFileApi(params)
  //     // deletedNum += 1 // 不管成功还是失败都要加1
  //     // if (code === 200) {
  //     //   message.success(`${item} ${msg}`)
  //     //   // 都删除完了再刷新页面
  //     //   if (deletedNum === selectedRowKeys.value.length) {
  //     //     onSearch()
  //     //   }
  //     // }
  //   })
  // })
}





// 批量一键溯源
async function onBatchSource() {
  if (!selectedRowKeysAll.value.length) {
    return message.info(t('请先选择要一键溯源的数据'))
  }
  const checkList = selectedRowsAll.value.map(item => {
    return {
      megId: item.megId,
      subjectId: item.subjectId,
      subjectName: item.subjectName,
    }
  })
  batchParamsModalRef.value.showModal(checkList)
}

// 批量一键溯源状态
async function onBatchPipeStatus() {
  batchPipeStatusModalRef.value.showModal({
    batchPipelineAnalysisId: batchPipelineAnalysisId.value,
    celeryTaskId: celeryTaskId.value
  })
}

// 从批量溯源状态弹窗来更新
function setBatchStatus(value: number) {
  batchStatus.value = value // 批量的总状态：-1：失败，0：正在进行，1：成功, -2: 已撤销， -3：未开始
  if (value === 1) {
    batchPipelineAnalysisId.value = null
    celeryTaskId.value = null
    targetTime.value = null
  }
  getRunningTask() // 刷新一下更好
}


// 选择行
function selectTable(rowKeys: string[], rows: IForm[]) {
  selectedRowKeys.value = rowKeys
  selectedRows.value = rows


  // 合并当前页选中项（自动去重）
  selectedRowKeysAll.value = [
    ...selectedRowKeysAll.value,
    ...rowKeys
  ].filter((v, i, arr) => arr.indexOf(v) === i) // 数组去重

  // 合并完整数据（防重复）
  selectedRowsAll.value = [
    ...selectedRowsAll.value,
    ...rows.filter(row =>
      !selectedRowsAll.value.some(r => r.id === row.id)
    )
  ]

  // 处理取消选择的项（仅当前页）
  const unselectedKeys = selectedRowKeysAll.value
    .filter(key =>
      tableData.value.some(item => item.id === key) && // 属于当前页
      !rowKeys.includes(key)  // 被取消选择
    )

  selectedRowKeysAll.value = selectedRowKeysAll.value
    .filter(key => !unselectedKeys.includes(key))
  selectedRowsAll.value = selectedRowsAll.value
    .filter(row => !unselectedKeys.includes(row.id))
}

// 点击批量一键溯源弹窗确认按钮后，取消勾选
function getDataFromBatchParamsModal(targetTime: string) {
  selectedRowKeysAll.value = [] // 取消勾选
  selectedRowsAll.value = []
  // 立即执行的3秒后在获取一下列表和进行中的，1秒可以，500ms不行
  if (!targetTime) {
    setTimeout(() => {
      getData()
    }, 3000)
  } else {
    getData()
  }
}

// 撤销后，取消勾选
function getDataFromBatchPipeStatusModal() {
  selectedRowKeysAll.value = [] // 取消勾选
  selectedRowsAll.value = []
  setTimeout(() => {
    getData()
  }, 1000)
}


function editMegCheckType(record: any) {
  record.isEditType = true
}

function saveMegCheckTypeSelect(record: any) {
  record.isSelecting = true
  setTimeout(() => {
    record.isSelecting = false
  }, 150)
  saveMegCheckType(record)
}

function saveMegCheckTypeBlur(record: any) {
  // 如果正在选择，则不触发Blur
  if (record.isSelecting) {
    return
  }
  saveMegCheckType(record)
}

async function saveMegCheckType(record: any) {
  // 相同不调接口，直接关闭
  if (record.megCheckTypeEdit === record.megCheckType) {
    record.isEditType = false
    return
  }
  saveData(record)
}

function editEpilepticLocation(record: any) {
  record.isEditLocation = true
}

function saveEpilepticLocationSelect(record: any) {
  record.isSelecting = true
  setTimeout(() => {
    record.isSelecting = false
  }, 150)
  saveEpilepticLocation(record)
}

function saveEpilepticLocationBlur(record: any) {
  // 如果正在选择，则不触发Blur
  if (record.isSelecting) {
    return
  }
  saveEpilepticLocation(record)
}

async function saveEpilepticLocation(record: any) {
  // 相同不调接口，直接关闭
  if (record.epilepticLocationEdit === record.epilepticLocation) {
    record.isEditLocation = false
    return
  }
  saveData(record)
}

async function saveData(record: any) {
  const params = {
    subjectId: record.subjectId,
    megId: record.megId,
    subjectName: record.subjectName,
    gender: record.gender,
    birthDate: record.birthDate,
    scanDate: record.scanDate,
    megCheckTime: record.megCheckTime,
    megCheckType: record.megCheckTypeEdit,
    epilepticLocation: record.epilepticLocationEdit,
    checked: record.checked ? 1 : 0,
  }
  const { code, msg } = await addSubjectApi(params)
  if (code === 200) {
    message.success(msg, 1)
    getData()
  }
}

function onSwitchChecked(record: any) {
  saveData(record)
}
</script>

<style lang="less">
.ant-popover.patientList-progress-popover {

  .ant-popover-inner {
    border-radius: 12px; // 18比较大的圆角更好看
    box-shadow: 0px 12px 20px 0px rgba(0, 0, 0, 0.20);
  }

  .ant-popover-inner-content {
    padding: 16px;
  }
}

.ant-progress-line {
  margin-inline-end: 0px;
  margin-bottom: 3px; // 3正好，4不行
}
</style>

<style lang="less" scoped>
:deep(.form-list) {
  .ant-form-item {
    margin-bottom: 0px;

    .ant-form-item-label>label {
      height: 38px;
    }
  }
}




:deep(.ant-table) {
  font-size: 16px;

  .ant-table-thead>tr>th {
    padding: 16px 8px; // 原来是 16px 16px，现在左右改小一点
  }

  .ant-table-row {
    .ant-table-cell {
      height: 56px;
      padding: 0 4px;
    }
  }


  .auto-complete {
    width: 108px;
    margin-left: -8px;

    .ant-select-selector {
      padding: 0 2px 0 7px;

      .ant-select-selection-search {
        inset-inline-start: 7px;
        inset-inline-end: 2px;
      }

      .ant-select-selection-placeholder {
        font-size: 14px;
      }

    }
  }

  .edit-icon {
    margin-left: 8px;
    font-size: 12px;
    color: var(--color-t4);
    cursor: pointer;

    &:hover {
      color: var(--color-primary);
    }
  }

}

// 生成报告和查看报告上下排布时
// :deep(.ant-table-row) {
//   .ant-table-cell {
//     padding: 7px 16px;
//   }
// }



.progress-box {
  width: 220px;

  .progress-item {
    padding-bottom: 6px;

    .right-icon {
      width: 30px;
    }

  }

  .total-progress {
    margin-top: 8px;
    margin-bottom: 8px;
    padding-top: 12px;
    border-top: var(--border);
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

  .stop-button {
    height: 30px;
  }

}

.target-time {
  color: var(--color-primary);
  background: var(--color-primary-01);
  border-radius: 20px;

  .time {
    padding-left: 16px;
    padding-right: 12px;
  }
}

.table-total-progress {
  font-size: 13px;
  width: 75px;

  .color-tag {
    border-radius: 4px;
    padding: 2px 2px;
    text-align: center;

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

}

:deep(.switch-checked) {

  &.ant-switch-checked {
    background-color: var(--color-green);

    &:hover:not(.ant-switch-disabled) {
      background-color: var(--color-green-dark);
    }
  }
}
</style>