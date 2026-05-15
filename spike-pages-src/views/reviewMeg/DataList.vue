<template>
  <div class="list-page">
    <div class="list-title flex-between">
      <span class="flex">

        <span class="mr8">{{ t('患者数据列表') }}</span>
        <IconReload class="reload-icon mr8" :title="t('刷新')" @click="onReload" />

        <span class="anticon reload-icon" v-if="showType === 'long'" :title="t('省略名称')" @click="switchShowType">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
            <path d="M9 11H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            <path d="M7 15L12 3L17 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
            <path d="M18 21L20 19M20 19L18 17M20 19L4 19" stroke="currentColor" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>

        <span class="anticon reload-icon" v-if="showType === 'short'" :title="t('全显名称')" @click="switchShowType">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
            <path d="M12 13H18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            <path d="M4 18L6 20M6 20L8 18M6 20L6 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
            <path d="M10 17L15 5L20 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </span>


      </span>
      <IconDown class="down-icon" :style="{ transform: showList ? '' : 'rotate(-90deg)' }" @click="clickMenu" />
    </div>

    <div class="list" v-if="showList">

      <NoData :loading="loading" v-if="!tableData.length" />

      <div v-for="(item, index) in tableData" :key="index" class="item"
        :class="{ active: curData.filePath === item.filePath, 'long-item': showType === 'long', 'short-item': showType === 'short' }"
        @click="clickItem(item)">
        <div class="text-ellipsis" :title="item.name" v-if="showType === 'short'">
          <span>{{ item.shortName }}</span>
        </div>
        <div class="long-name" v-if="showType === 'long'">
          {{ item.name }}
        </div>
        <div class="flex-center">

          <a-popover overlayClassName="data-list-popover very-big-z-index" placement="bottomLeft" :title="item.name">
            <IconMore class="more-icon color-t5 text-16 mr4" />
            <template #content>
              <div class="item-popover">
                <div><span>{{ t('陷波滤波') }}：</span><span>{{ item.lineFreq }}</span></div>
                <div><span>{{ t('文件起始时间') }}：</span><span>{{ item.tmin }} s</span></div>
                <div><span>{{ t('文件终止时间') }}：</span><span>{{ item.tmax }} s</span></div>
                <div><span>{{ t('采样频率') }}：</span><span>{{ item.sfreq }}</span></div>
                <div><span>{{ t('低通滤波频率') }}：</span><span>{{ item.lowpass }}</span></div>
                <div><span>{{ t('高通滤波频率') }}：</span><span>{{ item.highpass }}</span></div>
              </div>
            </template>
          </a-popover>

          <IconDelete class="more-icon color-t5 mr8" :title="t('删除')" @click.stop="onDelete(item)" />

          <!-- <div class="check-icon" :class="{ active: curCheckItem.filePath === item.filePath }"
            :title="item.is_alg_detected ? '再次检测' : '检测'" @click.stop="checkItem(item)">
            <CaretRightOutlined :style="{ fontSize: '16px', color: item.is_alg_detected ? 'var(--color-t2)' : 'var(--color-green)' }" />
          </div> -->


          <IconCheckActive class="check-icon-active" v-if="curCheckItem.filePath === item.filePath"
            @click.stop="checkItem(item)" />
          <IconCheck class="check-icon" v-else :title="item.is_alg_detected ? t('再次检测') : t('检测')"
            :style="{ color: item.is_alg_detected ? 'var(--color-t2)' : 'var(--color-green)' }"
            @click.stop="checkItem(item)" />

        </div>
      </div>
    </div>
  </div>

  <a-modal :width="450" v-model:open="visible" :confirm-loading="confirmLoading"
    :title="judgeData ? t('再次检测') : t('检测')" :okText="t('确定')" :cancelText="t('取消')" :maskClosable="false"
    :destroyOnClose="true" @ok="modalOk" @cancel="modalCancel">
    <div class="mb16 break-all" v-if="judgeData === false">
      <!-- {{ `是否对【${curCheckItem.name}】进行棘波检测？` }} -->
      {{ t('是否对【{name}】进行棘波检测？', { name: curCheckItem.name }) }}
    </div>
    <div class="mb8 break-all" v-if="judgeData === true">
      {{ `【${curCheckItem.name}】${t('已经进行过棘波检测')}，` }}
    </div>
    <div class="mb16 ml8" v-if="judgeData === true">
      {{ t('是否再次检测？') }}
    </div>
    <a-form ref="formRef" :model="form" :rules="rules" :labelCol="{ span: 11 }" :wrapperCol="{ span: 7 }">
      <a-form-item class="mb16" :label="t('阈值')" name="threshold">
        <a-input-number v-model:value="form.threshold" :placeholder="t('请输入')" :min="0" :step="0.1" />
      </a-form-item>
      <a-form-item class="mb8" :label="t('是否进行坏段处理')" name="runBadSegment">
        <a-radio-group v-model:value="form.runBadSegment" :options="yesNoList" />
      </a-form-item>
      <a-form-item class="mb8" :label="t('棘波是否返回多个时刻点')" name="multipoints">
        <a-radio-group v-model:value="form.multipoints" :options="yesNoList" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { message, type FormInstance } from 'ant-design-vue'
import { confirmDeleteModal } from '@u/modal'
import { getShortName } from '@u/utils'
import { yesNoList } from '@u/data' // 算法列表

import {
  getFifFileListApi,
  judgeIfDetectApi,
  analysisApi,
} from '@/api/meg'

import { deleteFileApi } from '@/api/file'

import { useUploadStore } from '@/store/upload'

const { t } = useI18n()

const uploadStore = useUploadStore()
// 当最新上传成功的文件变化时，刷新列表
// 1：患者数据集   2：DICOM文件  3：NIFTI文件  4：脑电图文件   5：脑磁图文件
watch(() => uploadStore.lastUploadedFile, (newValue: any) => {
  if (newValue.fileType === 5) {
    getData()
  }
})

const props = defineProps({
  foldName: {
    type: String,
    default: '',
  },
  subjectId: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['getCurData'])

// 暴露方法
defineExpose({
  getData,
  setData,
  onReload
})

const showList = ref<boolean>(true)

// 点击标题
function clickMenu() {
  showList.value = !showList.value
}

const tableData = ref<any[]>([]) // 列表
const loading = ref<boolean>(false)
const curData = ref<any>({})

const route = useRoute()
const coregId = ref<string>(String(route.query.coregId || ''))
const fifFilePath = ref<string>(String(route.query.fifFilePath || ''))

onMounted(() => {
  // 如果有coregId，说明是多窗口模式
  if (coregId.value && fifFilePath.value) {
    getData(false, async () => {
      const target = tableData.value.find(item => item.filePath === fifFilePath.value)
      if (target) {
        clickItem(target)
      } else {
        message.info(t('fif文件不存在，请先选择患者fif文件'))
      }
    })
  } else {
    getData(true)
  }
})

// 选择配准弹窗成功后，匹配对应的fif文件
async function setData(fifPath: string) {
  // console.log(' setData fifPath :>> ', fifPath, fifFilePath.value, tableData.value);
  // 有时会有延时，所以要等一下tableData.value的获取
  if (!tableData.value.length) {
    setTimeout(() => {
      setData(fifPath)
    }, 500)
    return
  }
  // 选到一样的就不改了
  if (fifFilePath.value === fifPath) {
    return
  }
  const target = tableData.value.find(item => item.filePath === fifPath)
  if (target) {
    clickItem(target)
  } else {
    message.info(t('fif文件不存在，请选择新的fif文件，重新配准'))
  }
}

// 刷新，修改患者会用到
function onReload(first: boolean = false) {
  tableData.value = []
  showList.value = true
  getData(first)
}


// function getNewData() {
//   showList.value = true
//   tableData.value = []
//   curData.value = {}
//   getData(true)
// }


// 获取数据
async function getData(first: boolean = false, cb?: () => {}) {
  const params = {
    foldName: props.foldName,
    subjectId: props.subjectId,
  }
  loading.value = true
  const { code, data } = await getFifFileListApi(params)
  loading.value = false
  if (code === 200) {
    tableData.value = data?.map((item: any) => {
      return {
        ...item,
        tmax: parseFloat(item.tmax) || 0,
        tmin: parseFloat(item.tmin) || 0, // firstTime === tmin, 所以用tmin，不用firstTime
        highpass: item.highpass ? parseFloat(item.highpass).toFixed(3) + ' ' + item.highpass?.split(' ')[1] : '', // 这个小数点太多了，所以处理一下 highpass : "0.10000000149011612 HZ"
        shortName: setShortName(item.name) // 短名字
      }
    })
    // 默认选中第一个
    if (first && tableData.value.length) {
      clickItem(tableData.value[0])
    }

    cb && cb()
  }
}

// {
//     "filePath": "sub-01/meg/sub01_EP_5__01_raw_tsss01.fif",
//     "name": "sub01_EP_5__01_raw_tsss01.fif",
//     "type": 1,
//     "lastModified": "2023-09-14 16:32:54",
//     "size": 17488802,
//     "is_alg_detected": true,
//     "firstTime": "35.0",
//     "lineFreq": "50.0 HZ",
//     "tmax": "45.0 s",
//     "tmin": "35.0 s",
//     "sfreq": "1000.0 HZ",
//     "lowpass": "330.0 HZ",
//     "highpass": "0.10000000149011612 HZ"
// }


// 点击
async function clickItem(item: any) {
  curData.value = item
  fifFilePath.value = item.filePath // 它也要改变
  emit('getCurData', item)
}

// 检测弹窗相关
const visible = ref<boolean>(false)
const confirmLoading = ref<boolean>(false)
const formRef = ref<FormInstance>()
const form = reactive({
  threshold: null,    // 阈值
  runBadSegment: 0, // 是否进行坏段处理, 默认为否
  multipoints: 0, // 棘波是否返回多个时刻点, 默认为否
})
const rules = {
  threshold: [
    { required: true, message: t('请填写阈值') },
  ],
  runBadSegment: [
    { required: true, message: t('请选择') },
  ],
  multipoints: [
    { required: true, message: t('请选择') },
  ],
}

const curCheckItem = ref<any>({})     // 当前正在检测的数据
const judgeData = ref<boolean>(null) // 是否已经进行过棘波检测

// 检测
async function checkItem(item: any) {
  visible.value = true
  curCheckItem.value = item
  const local_threshold = localStorage.getItem('threshold')
  form.threshold = local_threshold ? Number(local_threshold) : 0.5

  const local_runBadSegment = localStorage.getItem('runBadSegment')
  form.runBadSegment = local_runBadSegment ? Number(local_runBadSegment) : 0

  const local_multipoints = localStorage.getItem('multipoints')
  form.multipoints = local_multipoints ? Number(local_multipoints) : 0


  const params = {
    filePath: item.filePath,
  }
  judgeData.value = item.is_alg_detected // 可以先预设judgeData的值，因为接口得出的大概率就是is_alg_detected
  const { code, data } = await judgeIfDetectApi(params)
  if (code === 200) {
    judgeData.value = data // 是否已经进行过棘波检测；true/false
  }
}

// 确定弹窗
function modalOk() {
  formRef.value.validate().then(async values => {
    localStorage.setItem('threshold', values.threshold)
    localStorage.setItem('runBadSegment', values.runBadSegment)
    localStorage.setItem('multipoints', values.multipoints)

    analysisItem(curCheckItem.value)
  })
}

// 分析数据
async function analysisItem(item: any) {
  const params = {
    filePath: item.filePath,
    thr: form.threshold ? String(form.threshold) : null,
    subjectId: props.subjectId,
    runBadSegment: Boolean(form.runBadSegment),
    multipoints: Boolean(form.multipoints),
  }
  confirmLoading.value = true
  const { code, msg } = await analysisApi(params)
  confirmLoading.value = false
  if (code === 200) {
    message.success(msg)
    clickItem(item)
    modalCancel()
  }
}

// 取消弹窗
function modalCancel() {
  visible.value = false
  confirmLoading.value = false
  formRef.value.resetFields()
  curCheckItem.value = {}
  judgeData.value = null
}

// 删除
function onDelete(record: any) {
  confirmDeleteModal(t('删除'), t('modal.confirmDelete', { name: record.name }), () => {
    onDeleteRequest(record.filePath)
  })
}

// 请求删除
async function onDeleteRequest(filePath: string) {
  const params = {
    subjectId: '',
    filePath: filePath
  }
  const { code, msg } = await deleteFileApi(params)
  if (code === 200) {
    message.success(msg)
    getData()
  }
}


// 名称显示类型
const showType = ref<'short' | 'long'>('long')
// 切换
function switchShowType() {
  if (showType.value === 'long') {
    showType.value = 'short'
  } else {
    showType.value = 'long'
  }
}


const MAX_WIDTH = 188; //文字宽度，单位px
const SUFFIX = '.fif';
const FONT_SIZE = '14px';

// 设置一个短名字，把中间变成3个点.
function setShortName(name: string) {
  return getShortName(name, MAX_WIDTH, SUFFIX, FONT_SIZE)
}


</script>

<style lang="less">
.ant-popover.data-list-popover {

  .ant-popover-content {
    overflow: hidden;
    box-shadow: 0px 12px 20px 0px rgba(0, 0, 0, 0.20);
  }

  .ant-popover-title {
    margin: 0;
    padding: 12px;
    font-size: 16px;
    font-weight: 500;
    color: #fff;
    background: var(--color-title-bg-blue);

    &:before {
      content: '';
      display: inline;
      border-left: 4px solid rgba(255, 255, 255, 0.50);
      border-right: 4px solid rgba(255, 255, 255, 0.50);
      border-radius: 2px;
      margin-right: 8px;
    }
  }
}
</style>

<style lang="less" scoped>
.list-title {
  color: #fff;
  background: var(--color-title-bg-blue);
}

.list {
  width: 100%;
  max-height: 392px; // 392正好放7个
  overflow-y: scroll;
  overflow-y: overlay;
  font-size: 14px;

  &::-webkit-scrollbar {
    width: 2px;
  }

  .item {
    height: 40px;
    margin: 8px;
    padding: 0 8px;
    display: flex;
    align-items: center;
    cursor: pointer;
    border-radius: 4px;
    background: var(--color-primary-003);

    // 先hover
    &:hover {
      background: var(--hover-bg-blue);

      .more-icon {
        display: block;
      }
    }

    // 再选中
    &.active {
      background: var(--active-bg-blue);
    }

    .more-icon {
      display: none;
    }

    >div {
      text-align: center;

      &:nth-child(1) {
        width: 100%;
        text-align: left;
      }

    }

    &.long-item {
      height: auto;
      min-height: 40px;

      .long-name {
        padding-right: 4px;
        word-break: break-all;
      }

    }

  }

}

.dark .list .item.active {
  border: var(--border-card);
}

.item-popover {

  >div {
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    span:first-child {
      color: var(--color-gray);
      margin-right: 24px;
    }
  }
}
</style>
