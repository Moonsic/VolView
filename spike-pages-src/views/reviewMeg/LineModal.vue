<!-- 多脑区拖动图 -->
<template>
  <DragCard v-if="showModal" ref="dragCradRef" :width="cardWidth" :height="cardHeight" :left="cardLeft" :top="cardTop"
    :zIndex="zIndex" :marginTop="marginTop" @drag="dragModal" @startDrag="startDragModal" @endDrag="endDragModal"
    @close="closeModal">

    <template v-slot:title>
      <div class="flex-between widthP100">
        <div class="flex-start title-left">
          <LineModalTitle :listName="listName" :listNameType="listNameType" :paramsData="paramsData" />
        </div>
        <div class="flex-end title-right">

          <!-- <div>
            {{ paramsData.modalType }}
          </div> -->

          <!-- 比例尺放大缩小 -->
          <!-- <MinusCircleOutlined class="icon" title="振幅缩小" @click="zoomOut" />
          <PlusCircleOutlined class="icon" title="振幅放大" @click="zoomIn" />
          <span class="mr8 text-11">
            {{ ratioScale }}
            {{ paramsData.modalType === 'meg' ? 'fT' : 'μV' }}
          </span> -->

          <!-- 切换完整通道名称或小圆点 -->
          <!-- 这是一个框，里面一个A的图标 -->
          <span class="anticon icon" v-if="!showYName" :title="t('全显通道名称')" @click="switchShowName(true)">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
              <path
                d="M2 6C2 3.79086 3.79086 2 6 2H18C20.2091 2 22 3.79086 22 6V18C22 20.2091 20.2091 22 18 22H6C3.79086 22 2 20.2091 2 18V6Z"
                stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
              <path d="M9 14H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              <path d="M7 18L12 6L17 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </span>

          <!-- 这是左边2个实心点，右边4横线的图标 -->
          <span class="anticon icon" v-if="showYName" :title="t('隐藏通道名称')" @click="switchShowName(false)">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 22 14" fill="none">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M5.75 3C5.75 1.48122 4.51878 0.25 3 0.25C1.48122 0.25 0.25 1.48122 0.25 3C0.25 4.51878 1.48122 5.75 3 5.75C4.51878 5.75 5.75 4.51878 5.75 3ZM5.75 11C5.75 9.48122 4.51878 8.25 3 8.25C1.48122 8.25 0.25 9.48122 0.25 11C0.25 12.5188 1.48122 13.75 3 13.75C4.51878 13.75 5.75 12.5188 5.75 11ZM8.25 1C8.25 0.585786 8.58579 0.25 9 0.25H15C15.4142 0.25 15.75 0.585786 15.75 1C15.75 1.41421 15.4142 1.75 15 1.75H9C8.58579 1.75 8.25 1.41421 8.25 1ZM9 8.25C8.58579 8.25 8.25 8.58579 8.25 9C8.25 9.41421 8.58579 9.75 9 9.75H15C15.4142 9.75 15.75 9.41421 15.75 9C15.75 8.58579 15.4142 8.25 15 8.25H9ZM8.25 5C8.25 4.58579 8.58579 4.25 9 4.25H21C21.4142 4.25 21.75 4.58579 21.75 5C21.75 5.41421 21.4142 5.75 21 5.75H9C8.58579 5.75 8.25 5.41421 8.25 5ZM9 12.25C8.58579 12.25 8.25 12.5858 8.25 13C8.25 13.4142 8.58579 13.75 9 13.75H21C21.4142 13.75 21.75 13.4142 21.75 13C21.75 12.5858 21.4142 12.25 21 12.25H9Z"
                fill="currentColor" />
            </svg>
          </span>

          <SettingOutlined class="icon" v-if="!showRightDrawer" @click="openSwitchChannel(true)" />
          <SettingOutlined class="icon" v-if="showRightDrawer" @click="openSwitchChannel(false)" />


          <!-- <div class="switch-channel-btn mr4 icon" v-if="!showRightDrawer" @click="openSwitchChannel(true)">切换通道
          </div>
          <div class="switch-channel-btn mr4 icon" v-if="showRightDrawer" @click="openSwitchChannel(false)">取消切换
          </div>
 -->





        </div>
      </div>

    </template>



    <div class="drag-modal" ref="modalRef" :style="{ backgroundColor: useTheme['backgroundColor'] }">

      <div class="modal-body">
        <div ref="myEchartRef" :style="{ width: '100%', height: cardHeight + 'px' }"></div>
        <!-- <div ref="myEchartRef" :style="{ width: '100%', height: cardHeight - 10 + 'px', marginTop: '10px' }"></div> -->
      </div>

    </div>

    <div v-if="tooltip.visible" class="y-name-tooltip" :style="tooltipStyle">
      {{ tooltip.content }}
    </div>


    <div class="right-drawer" v-if="showRightDrawer">

      <!-- <a-segmented v-model:value="rightDrawerTab" block :options="rightDrawerTabList" size="small" /> -->


      <a-tabs v-model:activeKey="rightDrawerTab" centered size="small">
        <a-tab-pane key="1">
          <template #tab>
            <span class="anticon">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" fill="none">
                <path
                  d="M14.6667 8.66653L12.9233 7.62051C11.9675 7.04703 10.7559 7.12853 9.88549 7.82484L9.66589 8.00052C8.69198 8.77965 7.3081 8.77965 6.33419 8.00052L6.11459 7.82484C5.2442 7.12853 4.03255 7.04703 3.07675 7.62051L1.33337 8.66653M14.6667 4.66653L12.9233 3.62051C11.9675 3.04703 10.7559 3.12853 9.88549 3.82484L9.66589 4.00052C8.69198 4.77965 7.3081 4.77965 6.33419 4.00052L6.11459 3.82484C5.2442 3.12853 4.03255 3.04703 3.07675 3.62051L1.33337 4.66653"
                  stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
                <path
                  d="M14.6666 12.6668L12.9232 11.6208C11.9674 11.0473 10.7558 11.1288 9.88537 11.8251L9.66577 12.0008C8.69186 12.7799 7.30798 12.7799 6.33406 12.0008L6.11447 11.8251C5.24408 11.1288 4.03243 11.0473 3.07663 11.6208L1.33325 12.6668"
                  stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
              </svg>
            </span>
          </template>
        </a-tab-pane>
        <a-tab-pane key="2">
          <template #tab>
            <BgColorsOutlined />
            <!-- <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
              <path
                d="M10.0128 21.8025L10.161 21.0673H10.161L10.0128 21.8025ZM19.0552 19.0869L18.5261 18.5554L19.0552 19.0869ZM11.75 7.5C11.75 6.25736 10.7426 5.25 9.5 5.25V6.75C9.91421 6.75 10.25 7.08579 10.25 7.5H11.75ZM9.5 5.25C8.25736 5.25 7.25 6.25736 7.25 7.5H8.75C8.75 7.08579 9.08579 6.75 9.5 6.75V5.25ZM7.25 7.5C7.25 8.74264 8.25736 9.75 9.5 9.75V8.25C9.08579 8.25 8.75 7.91421 8.75 7.5H7.25ZM9.5 9.75C10.7426 9.75 11.75 8.74264 11.75 7.5H10.25C10.25 7.91421 9.91421 8.25 9.5 8.25V9.75ZM19.25 10C19.25 8.75736 18.2426 7.75 17 7.75V9.25C17.4142 9.25 17.75 9.58579 17.75 10H19.25ZM17 7.75C15.7574 7.75 14.75 8.75736 14.75 10H16.25C16.25 9.58579 16.5858 9.25 17 9.25V7.75ZM14.75 10C14.75 11.2426 15.7574 12.25 17 12.25V10.75C16.5858 10.75 16.25 10.4142 16.25 10H14.75ZM17 12.25C18.2426 12.25 19.25 11.2426 19.25 10H17.75C17.75 10.4142 17.4142 10.75 17 10.75V12.25ZM10.25 15.5C10.25 14.2574 9.24264 13.25 8 13.25V14.75C8.41421 14.75 8.75 15.0858 8.75 15.5H10.25ZM8 13.25C6.75736 13.25 5.75 14.2574 5.75 15.5H7.25C7.25 15.0858 7.58579 14.75 8 14.75V13.25ZM5.75 15.5C5.75 16.7426 6.75736 17.75 8 17.75V16.25C7.58579 16.25 7.25 15.9142 7.25 15.5H5.75ZM8 17.75C9.24264 17.75 10.25 16.7426 10.25 15.5H8.75C8.75 15.9142 8.41421 16.25 8 16.25V17.75ZM10.161 21.0673C5.9333 20.2149 2.75 16.4784 2.75 12H1.25C1.25 17.2065 4.95055 21.547 9.86453 22.5378L10.161 21.0673ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75V1.25C6.06294 1.25 1.25 6.06294 1.25 12H2.75ZM12 2.75C17.1086 2.75 21.25 6.89137 21.25 12H22.75C22.75 6.06294 17.9371 1.25 12 1.25V2.75ZM14.2222 14.9722C15.0353 14.9722 15.6944 15.6314 15.6944 16.4444H17.1944C17.1944 14.8029 15.8637 13.4722 14.2222 13.4722V14.9722ZM12.75 16.4444C12.75 15.6314 13.4091 14.9722 14.2222 14.9722V13.4722C12.5807 13.4722 11.25 14.8029 11.25 16.4444H12.75ZM15.6944 16.4444V17.7333H17.1944V16.4444H15.6944ZM21.25 12C21.25 14.562 20.2094 16.8795 18.5261 18.5554L19.5844 19.6184C21.5389 17.6725 22.75 14.977 22.75 12H21.25ZM11.25 16.4444V20H12.75V16.4444H11.25ZM15.6944 17.7333C15.6944 18.7415 16.2266 19.5991 16.9966 20.0183C17.7947 20.4528 18.8116 20.3878 19.5844 19.6184L18.5261 18.5554C18.2467 18.8335 17.9582 18.8339 17.7139 18.7009C17.4416 18.5526 17.1944 18.2097 17.1944 17.7333H15.6944ZM9.86453 22.5378C11.515 22.8705 12.75 21.4669 12.75 20H11.25C11.25 20.7422 10.6761 21.1712 10.161 21.0673L9.86453 22.5378Z"
                fill="currentColor" />
            </svg> -->
          </template>
        </a-tab-pane>
      </a-tabs>

      <div v-show="rightDrawerTab === '1'">

        <div class="small-title">{{ t('比例尺') }}：</div>
        <!-- <div class="flex-between ml8 mr8">
          <MinusCircleOutlined class="icon" @click="zoomIn" />
          <span>
            {{ ratioScale }}
            {{ setRatioScaleUnit }}
          </span>
          <PlusCircleOutlined class="icon" @click="zoomOut" />
        </div> -->

        <!-- 比例尺可编辑 -->
        <a-input-number class="mb8" v-model:value="ratioScale" :placeholder="t('比例尺')" :addon-after="setRatioScaleUnit"
          :min="1" :step="ratioStep" v-bind="inputNumberParser" size="small" @step="onRatioStep"
          @change="changeRatioScale()" />

        <div class="small-title flex-between" v-if="['eegChannel', 'eegComb'].includes(paramsData.modalType)">
          <span>{{ t('翻转振幅') }}：</span>
          <a-switch v-model:checked="isFlipChart" size="small" @change="switchFlipChart" />
        </div>

        <div class="small-title" v-if="paramsData.modalType === 'meg'">{{ t('通道') }}：</div>

        <!-- 快捷选中 -->
        <div class="given-channel-list" v-if="paramsData.modalType === 'meg'">
          <div v-for="(item, index) in brainRegionList" :key="index" class="given-item">
            <div class="label">{{ item.label }}:</div>
            <div class="btn btn-all" :class="{ 'active': item.label + '_all' === listName }"
              @click="clickGivenList(item.label + '_all')">all</div>
            <div class="btn btn-grad" :class="{ 'active': item.label + '_grad' === listName }"
              @click="clickGivenList(item.label + '_grad')" v-if="megType === 'megin'">grad</div>
          </div>
        </div>


        <div class="small-title" v-if="['eegChannel', 'eegComb'].includes(paramsData.modalType)">{{ t('导联组合') }}：</div>

        <div class="custom-channel-list mt4" v-if="['eegChannel', 'eegComb'].includes(paramsData.modalType)">
          <div v-for="(item, index) in eegCombList" :key="index" class="given-item"
            :class="{ 'active': item.label === listName }" @click="clickEegCombList(item)">
            {{ item.label }}
          </div>
        </div>


        <div class="small-title" v-if="['meg', 'eegChannel', 'eegComb'].includes(paramsData.modalType)">{{ t('自定义集合')
          }}：
        </div>

        <div class="custom-channel-list" v-if="paramsData.modalType === 'meg'">
          <div v-for="(item, index) in customChannelList" :key="index" class="given-item"
            :class="{ 'active': item.listName === listName }" @click="clickCustomChannelList(item)">
            {{ item.listName }}
          </div>
        </div>

        <div class="custom-channel-list mt4" v-if="['eegChannel', 'eegComb'].includes(paramsData.modalType)">
          <div v-for="(item, index) in eegCustomChannelList" :key="index" class="given-item"
            :class="{ 'active': item.listName === listName }" @click="clickEegCustomChannelList(item)">
            {{ item.listName }}
          </div>
        </div>


      </div>
      <div v-show="rightDrawerTab === '2'">


        <div class="small-title">{{ t('宽高') }}：</div>
        <div class="flex-center mb4">
          <a-input-number class="" v-model:value="cardWidth" :placeholder="t('宽')" size="small" :controls="false"
            :min="200" :max="innerWidth - 110" @change="changeWidthHeight" />
          *
          <a-input-number class="" v-model:value="cardHeight" :placeholder="t('高')" size="small" :controls="false"
            :min="133" :max="innerHeight" @change="changeWidthHeight" />
        </div>
        <div class="custom-channel-list">
          <div v-for="(item, index) in givenWidthHeightList" :key="index" class="given-item"
            :class="{ 'active': item.width === cardWidth && item.height === cardHeight }"
            @click="clickGivenWidthHeightList(item)">
            {{ item.width }} * {{ item.height }}
          </div>
        </div>

        <div class="small-title">{{ t('主题') }}：</div>
        <div class="custom-color-list">
          <div v-for="(item, index) in customColorList" :key="index" class="given-item"
            :class="{ 'active': item.value === chartTheme }" @click="clickCustomColorList(item)">
            {{ item.label }}
          </div>
        </div>
      </div>
    </div>

  </DragCard>

  <!-- 弹窗永远比窗口高1000 -->
  <a-modal v-model:open="showMenuModal" :zIndex="zIndex + 1000"
    :style="{ width: '140px', top: modalTop + 'px', left: modalLeft + 'px', margin: '0' }" :title="null" :footer="null"
    :closable="false" :maskStyle="{
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    }" :bodyStyle="{
      padding: '0px',
    }">
    <div class="context-menu">
      <div class="title" :class="[isMore ? 'pl4' : 'pl8']">
        {{ isMore ? `${curStartTime}-${curEndTime}` : curTime }}
      </div>
      <div class="item flex-between" v-for="(item, index) in spikeTypeList" :key="index" @click="clickType(item)">
        <div class="flex-start">
          <span class="point" :style="{
            background: item.color[0],
          }"></span>
          {{ item.label }}
        </div>
        <span class="pr8 color-blue text-11">
          Alt+{{ item.value }}
        </span>
      </div>
      <div class="menu-button flex-between" v-if="!isMore" @click="clickLocation">
        <span>{{ t('溯源定位') }}</span>
        <span class="pr8 text-12">Alt+Q</span>
      </div>
      <div class="menu-button" @click="openLayoutModal">{{ t('打开通道布局') }}</div>

      <div class="menu-button button-bad" v-if="redChannelList.length && curGoodListLength" @click="turnToBadChannel">
        {{ t('标记为坏通道') }}
        <div class="num">{{ curGoodListLength }}</div>
      </div>
      <div class="menu-button button-bad" v-if="redChannelList.length && curBadListLength" @click="turnToGoodChannel">
        {{ t('取消坏通道标记') }}
        <div class="num">{{ curBadListLength }}</div>
      </div>
    </div>
  </a-modal>

</template>

<script lang="ts" setup>
import { init } from 'echarts'
import { message } from 'ant-design-vue'
import DragCard from './parts/DragCard.vue'
import LineModalTitle from './LineModalTitle.vue'

import { useThemeStore } from '@/store/theme'
import { storeToRefs } from 'pinia'

import { inputNumberParser } from '@u/utils'
import { calcUp, calcDown, setRatioStep } from '@/utils/ratioScale'
import { spikeTypeList, brainRegionList } from '@u/data'
import { allThemeList, customColorList } from './config' // 暗色主题

// import { allChannelListByName16 as allChannelListByNameMegin } from './config' // 所有通道列表
// import { allChannelListByName16 as allChannelListByNameOpm } from './configOpm' // 所有通道列表

import { useOpmStore } from '@/store/opm'
const opmStore = useOpmStore()

import {
  megApi, // 1. 查折线图
  eegjsonApi,                // 41.  获取脑电数据
  addOrUpdateManualSpikeApi, // 添加或者修改手动标注的棘波，修改的时候，也需要传入所有字段的信息
  getGfpPointApi, // 当ctrl+鼠标单击一个点时，自动跳转到附近的波峰/波谷点
  addBadChannelApi,
  deleteBadChannelApi,
} from '@/api/meg'

const { t } = useI18n()

// 取消默认的浏览器自带右键
window.oncontextmenu = (e) => {
  e.preventDefault()
}

const props = defineProps({
  filePath: {
    type: String,
    default: '',
  },
  brainRegion: {
    type: String,
    default: '',
  },
  chNames: {
    type: Array,
    default: [],
  },
  startTime: {
    type: Number,
    default: 0,
  },
  coregId: {
    type: String,
    default: '',
  },
  subjectId: {
    type: String,
    default: '',
  },
  autoSl: {
    type: Number,
    default: 0,
  },
  customChannelList: {
    type: Array as PropType<any[]>,
    default: [],
  },
  eegCustomChannelList: {
    type: Array as PropType<any[]>,
    default: [],
  },
  eegCombList: {
    type: Array as PropType<any[]>,
    default: [],
  },
  badChannelList: {
    type: Array as PropType<any[]>,
    default: [],
  },
  curSpikeChannels: {
    type: Array as PropType<any[]>,
    default: [],
  },
  megType: {
    type: String,
    default: 'megin',
  },
  showMarkAreaBg: {
    type: Number,
    default: 1,
  },
  markAreaBgDuration: {
    type: Number,
    default: 1,
  },
  duration: {
    type: Number,
    default: 5,
  },
})

// 暴露方法
defineExpose({
  setZIndex,
  addData,
  setData,
  setChartData,
  setRedMarkLine,
  getPositionSize,
  setChartTheme,
  drawBadChannel,
  changeNewBrain,
})

// const allChannelListByName = ref<any>([])
const allChannelListByName = computed(() => opmStore.allChannelListByName16)

// watch(() => props.megType, () => {
//   nextTick(() => {
//     if (props.megType === 'megin') {
//       allChannelListByName.value = allChannelListByNameMegin
//     } else {
//       allChannelListByName.value = allChannelListByNameOpm
//     }
//   })
// }, { immediate: true })

const dragCradRef = ref(null)

function getPositionSize() {
  const modalType = getModalType()
  return {
    ...dragCradRef.value.getPositionSize(),
    modalId: paramsData.modalId,
    modalType: modalType,
    chNames: paramsData.chNames,
    leadCombination: paramsData.leadCombination,
    isEcg: paramsData.isEcg,
    isEog: paramsData.isEog,
    isGfp: paramsData.isGfp,
    listName: paramsData.listName,
    listNameType: listNameType.value,
    isFlipChart: isFlipChart.value, // 翻转振幅存到布局中
    ratioScale: ratioScale.value, // 比例尺存到布局中
  }
}

function getModalType() {
  if (paramsData.modalType === 'eegChannel' || paramsData.modalType === 'eegComb') {
    return paramsData.modalType
  } else if (paramsData.chNames.length) {
    return 'meg'
  } else {
    if ((paramsData.isEcg || paramsData.isEog) && !paramsData.isGfp) {
      return 'ecgeog'
    } else if (!paramsData.isEcg && !paramsData.isEog && paramsData.isGfp) {
      return 'gfp'
    } else {
      // 当有ecgeog 和gfp的时候，就是脑磁
      return 'meg'
    }
  }
}

const innerWidth = window.innerWidth
const innerHeight = window.innerHeight

let myChart: any = null
const myEchartRef: Ref<HTMLElement | null> = ref(null)

onUnmounted(() => {
  if (myChart) {
    myChart.clear()
    myChart.dispose()
    myChart = null
  }
  isChartInited = false
})

onMounted(() => {
  myChart = init(myEchartRef.value as HTMLElement)
})

let paramsData: any = {} // 请求接口的params
const modalId = ref(null)

const cardWidth = ref(600)
const cardHeight = ref(400)
const cardLeft = ref(270)
const cardTop = ref(94)
const zIndex = ref<number>(0) // 卡片层级，用于拖拽时始终在最上方
const marginTop = 20


// 设置层级z-index
function setZIndex(value: number) {
  zIndex.value = Number(value + 100)
}

// 弹窗可拖动
const modalRef = ref(null)
const showModal = ref<boolean>(true)
const listName = ref<string>('')
const listNameType = ref<'listName' | 'chNames'>()

// 关闭弹窗
function closeModal() {
  showModal.value = false
  if (myChart) {
    myChart.clear()
    myChart.dispose()
    myChart = null
  }
  emit('closeModal', modalId.value)
}

// 开始拖拽
function startDragModal() {
  // console.log('res :>> ', res);
}

// 正在拖拽
function dragModal(res: any) {
  // console.log('res :>> ', res);
  cardWidth.value = res.cardWidth
  cardHeight.value = res.cardHeight
  myChart.resize({
    width: res.cardWidth,
    height: res.cardHeight - marginTop
  })
}

// 结束拖拽
function endDragModal(res: any) {
}


// 新增一个LineModal
async function addData(params: any) {

  // console.log('params :>> ', params);

  showModal.value = true

  // 以前老的布局没有modalType，默认给个meg
  if (!params.modalType) {
    params.modalType = 'meg'
  }

  modalId.value = params.modalId
  isFlipChart.value = params.isFlipChart // 翻转振幅
  ratioScale.value = params.ratioScale || ONE_SPACE // 比例尺存到布局里了

  zIndex.value = Number(params.zIndexValue + 100)

  const { modalIndex } = params

  // 最新：第2个开始，就从左上角开始往下一个一个降低一点
  if (modalIndex >= 1) {
    cardLeft.value = 270
    cardTop.value = 94 + 40 * (modalIndex - 1)
  }

  // 如果有卡片大小位置信息，就设置
  if (params.cardHeight) {
    params.cardWidth = Math.round(params.cardWidth) // 四舍五入为整数，把以前的小数都改成整数
    params.cardHeight = Math.round(params.cardHeight) // 同上

    cardWidth.value = params.cardWidth
    cardHeight.value = params.cardHeight
    cardLeft.value = params.cardLeft
    cardTop.value = params.cardTop
    myChart.resize({
      width: params.cardWidth,
      height: params.cardHeight - marginTop
    })
  }

  // 有名称
  if (params.listName) {
    listName.value = params.listName
    listNameType.value = 'listName'
  } else {
    // 没有名称
    listNameType.value = 'chNames'

    if (params.modalType === 'eegComb') {

    }
    if (params.modalType === 'eegChannel') {

    }
    // if (params.modalType === 'ecgeog') {
    //   const newChNames = [...params.chNames]
    //   if (params.isEcg) {
    //     newChNames.push('ECG')
    //   }
    //   if (params.isEog) {
    //     newChNames.push('EOG')
    //   }
    //   if (params.isGfp) {
    //     newChNames.push('GFP')
    //   }
    //   listName.value = newChNames.join(',')
    // }

    // if (params.modalType === 'GFP') {
    //   listName.value = 'GFP'
    // }
  }


  // if (params.listName) {
  //   // 有名称
  //   listName.value = params.listName
  //   listNameType.value = 'listName'
  // } else {
  //   // 没有名称，只能用脑区列表，把ECG也加上
  //   const newChNames = [...params.chNames]
  //   if (params.isEcg) {
  //     newChNames.push('ECG')
  //   }
  //   if (params.isEog) {
  //     newChNames.push('EOG')
  //   }
  //   if (params.isGfp) {
  //     newChNames.push('GFP')
  //   }
  //   listName.value = newChNames.join(',')
  //   listNameType.value = 'chNames'



  //   params.listName = listName.value // 如果一个图表只有ECG那些，要加这2行
  //   params.listNameType = listNameType.value
  // }

  // if (params.modalType === 'eegComb') {
  //   params.chNames = []
  // }

  paramsData = { ...params }

  // console.log('params :>> ', params.chNames);
  const res = params.modalType === 'eegChannel' || params.modalType === 'eegComb' ? await eegjsonApi(params) : await megApi(params)

  if (res.code === 200) {
    setChartData(res.data)
  } else {
    closeModal() // 接口失败要关闭弹窗
  }
}

// 设置，意思是修改，保留原来的通道
async function setData(params: any) {
  // console.log('setData :>> ', params)
  // 这里4个要写是因为接口要传参
  params.chNames = paramsData.chNames // paramsData是弹窗初始的数据
  params.leadCombination = paramsData.leadCombination // paramsData是弹窗初始的数据
  params.isEog = paramsData.isEog
  params.isEcg = paramsData.isEcg
  params.isGfp = paramsData.isGfp
  params.modalType = paramsData.modalType

  if (params.modalType === 'eegComb') {
    params.chNames = []
  }

  const res = params.modalType === 'eegChannel' || params.modalType === 'eegComb' ? await eegjsonApi(params) : await megApi(params)

  if (res.code === 200) {
    paramsData = {
      ...params,
      chNames: paramsData.chNames,
      leadCombination: paramsData.leadCombination,
      isEog: paramsData.isEog, // 这里也要一直保留以前的
      isEcg: paramsData.isEcg,
      isGfp: paramsData.isGfp,
      listName: paramsData.listName, // listName也要一直保留以前的。这是之前没写，导致点击前进按钮后，布局弹窗里获取时listName为空。
      modalType: paramsData.modalType, // listName也要一直保留以前的。这是之前没写，导致点击前进按钮后，布局弹窗里获取时listName为空。
      modalId: paramsData.modalId,
      modalIndex: paramsData.modalIndex,
    }
    setChartData(res.data)
  }
}

// 点击查询、修改脑区、前进后退会走到这 res：图表数据
function setChartData(data: any) {
  xData = data.timePoints
  chMegData = data.chMegData
  yData = Object.keys(data.chMegData)

  chMegDataNormal = JSON.parse(JSON.stringify(data.chMegData))
  chMegDataFlip = null

  redChannelList.value = []

  switchFlipChart() // 翻转图表代替下面2行

  // setSeriesList('setChartData')
  // realSetData()


  // console.log('new xData :>> ', curTime.value, xData, props.startTime);
  // 有数字，但不在x轴内，就找最近的一个点
  if (curTime.value && curTime.value >= xData[0] && curTime.value <= xData[xData.length - 1] && !xData.includes(curTime.value)) {
    // 不包含就找最近的一个点
    const closestNumber = findClosestNumber(xData, curTime.value)
    // console.log('不包含 :>> ');
    // console.log('closestNumber :>> ', closestNumber);
    curTime.value = closestNumber
    drawRedMarkLine()
  }

}

// 找到最近的一个数字
function findClosestNumber(arr: any[], target: number) {
  return arr.reduce((closest, current) =>
    Math.abs(current - target) < Math.abs(closest - target) ? current : closest
  )
}


// 设置通道颜色，现在有好通道和坏通道之分，所以每次变换颜色都要区分好坏。
function setChannelColor(channelName: string) {
  return props.badChannelList.includes(channelName) ? BAD_COLOR : GOOD_COLOR
}


const themeStore = useThemeStore()
const { chartTheme } = storeToRefs(themeStore)

// 使用的主题色
let useTheme = allThemeList[chartTheme.value]

let GOOD_COLOR = useTheme['series.itemStyle.color']
let BAD_COLOR = useTheme['badColor']
const RED_COLOR = 'red'
const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary')


const ONE_SPACE = 2000 // 间距
const TWO_SPACE = ONE_SPACE * 2 // 间距*2
const HANDLE_ICON = 'path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z'
// 把配置和数据放这里
const CHART_OPTION: any = {
  backgroundColor: useTheme['backgroundColor'],    // 背景色
  animation: false,           // 把所以动画都关掉了
  tooltip: {
    show: false,
  },
  toolbox: {
    show: false,
  },
  legend: {
    show: false,
  },
  grid: {
    left: 10,
    right: 14,
    bottom: 26,
    top: 17,
    containLabel: false        // 不自适应。左侧Y轴数据量大时，自适应会失效，有bug，所以直接left写死，不自适应
  },
  dataZoom: [
    {
      show: true,
      id: 'ySilder',
      type: 'slider',          // Y轴可滑动
      yAxisIndex: [0],
      showDetail: false,       // 显示详细数值
      showDataShadow: false,   // 显示数据阴影。数据阴影可以简单地反应数据走势。
      brushSelect: false,      // 是否开启刷选功能
      width: 7,
      right: 3,                // 与右侧的距离
      filterMode: 'none',      // 不过滤数据，只改变数轴范围
      handleIcon: HANDLE_ICON, // 移动手柄图标
      handleSize: '100%',
      borderColor: useTheme['sliderBorderColor'], // 滑块边框颜色

      // 最新：说是还是全显示的比较好，所以注释掉
      // startValue: TWO_SPACE,
      // endValue: TWO_SPACE * 13
    },
  ],
  brush: { // 选框
    removeOnClick: false,  // 是否支持『单击清除所有选框』
    xAxisIndex: 0,         // 如 0，表示这个 index 所对应的坐标系
    transformable: false,  // 已经选好的选框是否可以被调整形状或平移。默认是true
    brushStyle: {
      borderWidth: 0,
      color: 'rgba(120,140,200,0.3)', // 偏蓝一点，原：'rgba(120,140,180,0.2)'
      borderColor: 'rgba(120,140,200,0.8)',
    }
  },
  xAxis: [{
    type: 'category',
    triggerEvent: true,     // 事件触发，移入就有鼠标手势
    boundaryGap: true, // 坐标轴两边留白策略，默认为true
    axisLabel: {
      // interval: 250-1, // 坐标轴刻度标签的显示间隔，在类目轴中有效，默认是'auto', 0: 强制显示所有标签。这个现在根据xData长度计算
      hideOverlap: true, // 隐藏重叠的标签
      color: useTheme['xAxis.axisLabel.color'],    // x轴刻度标签
    },
    axisLine: {
      show: false,       // 是否显示坐标轴轴线
    },
    splitLine: {
      show: true,         // 坐标轴在 grid 区域中的分隔线
      // interval: 250-1, // 坐标轴分隔线的显示间隔, 默认同axisLabel.interval一样。
      lineStyle: {
        color: useTheme['xAxis.splitLine.lineStyle.color'],  // x轴分隔线颜色
        width: 1,       // 分隔线线宽
        type: 'dashed', // 线的类型
      }
    },
    axisTick: {
      show: false    // 是否显示坐标轴刻度
    },
    axisPointer: {
      show: true,    // 大数据时太卡了
      type: 'line',  // 竖线
      snap: true,    // 坐标轴指示器是否自动吸附到点上
      lineStyle: {
        type: 'dashed',
        color: useTheme['red-mark-line'], // 竖线颜色
      }
    },
    data: []
  }],
  yAxis: [{
    type: 'value',
    triggerEvent: true,     // 事件触发，移入就有鼠标手势
    minInterval: ONE_SPACE, // splitNumber和minInterval 是完全显示Y轴通道名称的关键
    splitNumber: TWO_SPACE,
    axisLabel: {
      show: true,         // 显示刻度标签
      fontSize: 10,       // 字体大小
      // fontWeight: 'bold', // 刻度标签文字的字体加粗
      color: useTheme['yAxis.axisLabel.color'],      // 刻度标签文字的颜色
      margin: 1           // 刻度标签与轴线之间的距离
    },
    axisTick: {
      show: false       // 是否显示坐标轴刻度
    },
    axisLine: {
      show: true,       // 是否显示坐标轴轴线
      lineStyle: {
        color: useTheme['yAxis.axisLine.lineStyle.color'], // y轴坐标轴轴线颜色
        width: 1,       // 坐标轴线线宽
        type: 'solid',  // 线的类型
      }
    },
    splitLine: {
      show: true,       // 坐标轴在 grid 区域中的分隔线
      interval: 0,      // 坐标轴分隔线的显示间隔
      lineStyle: {
        color: useTheme['yAxis.splitLine.lineStyle.color'],  // y轴分隔线颜色
        width: 1,       // 分隔线线宽
        type: 'dashed', // 线的类型
      },
    }
  }],
  series: []
}


let seriesList: any[] = []                   // series数据
let chMegData: { [key: string]: number[] } = null   // res.chMegData {通道名称1:[数据],通道名称2:[数据]}
let chMegDataNormal: { [key: string]: number[] } = null   // 没翻转的，默认就是res.chMegData
let chMegDataFlip: { [key: string]: number[] } = null   // 翻转的

let xData: number[] = []                     // x轴数据 [17, 17.001, 17.002, 17.003]
let yData: string[] = []                     // 通道名称列表, 也是y轴数据 ['MEG0113', 'EOG061', 'ECG062', 'GFP']

// 重叠，默认不重叠
const overlap = ref<boolean>(false)
// 比例尺
const ratioScale = ref<number>(ONE_SPACE)

// 设置折线数据
function setSeriesList(type: 'setChartData' | 'setOverlapRatio') {
  let oldSeriesList: any[] = null // 上一个seriesList的值，用于保留折线颜色
  if (type === 'setOverlapRatio') {
    oldSeriesList = seriesList || []
  }
  // 先清空seriesList
  seriesList = []
  yData.map((item: any, index: number) => {
    let seriesData: any = []
    // 如果重叠
    if (overlap.value) {
      // 直接用原始数据seriesData = chMegData[item] 不对，点击比例尺就没反应
      seriesData = chMegData[item].map((item2: number) => {
        return (item2 * ONE_SPACE / ratioScale.value) // 重叠时
      })
    } else {
      seriesData = chMegData[item].map((item2: number) => {
        return (item2 * ONE_SPACE / ratioScale.value - TWO_SPACE * index) // 重叠时 比例尺不影响形状
      })
    }

    const obj: any = {
      name: 'spikeLine', // 这个必须是一样的
      type: 'line',
      sampling: 'lttb',  // 折线图在数据量远大于像素点时候的降采样策略，开启后可以有效的优化图表的绘制效率，默认关闭，也就是全部绘制不过滤数据点。
      smooth: false,     // 默认平滑true , true会卡，false不卡
      symbol: 'none',    // 标记的图形
      animation: false,  // 动画太卡，不要动画了
      emphasis: {
        disabled: true,    // 完全禁用高亮状态
      },
      itemStyle: {
        color: type === 'setOverlapRatio' ? oldSeriesList[index].itemStyle.color : setChannelColor(item), // 如果是重叠或者比例尺按钮，要保持原来的颜色
      },
      lineStyle: {
        width: 1
      },
      data: seriesData,
      channelName: item, // 通道名称
    }

    // console.log('props.curSpikeChannels :>> ', props.curSpikeChannels.includes(item));


    // if (item === 'MEG0412' || item === 'MEG0442' || item === 'MEG1043') {
    if (props.curSpikeChannels.length && props.curSpikeChannels.includes(item)) {
      // 一个通道的上下范围值
      const max = -TWO_SPACE * index + ONE_SPACE
      const min = -TWO_SPACE * index - ONE_SPACE
      obj.markArea = {
        silent: true,
        itemStyle: {
          color: primaryColor,
          opacity: 0.1
        },
        data: [
          [{ yAxis: max }, { yAxis: min }],
        ]
      }
    }

    seriesList.push(obj)
  })
}

let isChartInited = false // 是否初始化过图表，代替以前的myChart.getOption()

// 真正的画折线
function realSetData() {
  // 如果不是第一次
  if (isChartInited) {
    // 第一步是先获取oldSeries
    const oldSeries = myChart.getOption().series.filter((item: any) => item && item.name !== 'spikeLine') // 当series数量减少时会出现series某值为null的情况
    // 第二步是setNewOption
    setNewOption()
    // 上面先赋值seriesList，再单独赋值oldSeries，如果一起的话，新的seriesList会在oldSeries后面，导致画红通道时index有问题
    myChart.setOption({
      series: oldSeries
    })
    clearBrush() // 清除选框，主要是点击前进后退后，选框还在，但数值不对，干脆清除掉
  } else {
    //  如果第一次画图，先把基础配置一下
    myChart.setOption(CHART_OPTION)
    setNewOption()
    firstDrawRedMarkLine() // 第一次画红色竖线
    setIsNote(true) // 默认开启棘波标注
    isChartInited = true // 初始化图表
  }

  // TODO 现在有个问题。如果坏通道接口比megjson接口慢，就画不到了
  setTimeout(() => {
    drawBadChannel()
  }, 200)
}

const yList: any = {}


// 设置新的选项，X轴，Y轴和seriesList
function setNewOption() {
  switchShowName(showYName.value) // 切换显示完整名称或小圆点

  myChart.setOption({
    xAxis: [{
      data: xData,
      axisLabel: {
        interval: setXInterval(), // 设置xAxis[0].axisLabel.interval，这个现在根据xData长度计算
      }
    }],
    series: seriesList
  }, { replaceMerge: ['series'] }) // 先删除掉series，再赋值
}

// 设置xAxis[0].axisLabel.interval，以1/5/10/20秒，5种情况
function setXInterval() {
  let xInterval = 250 - 1
  if (xData.length <= 1001) {
    xInterval = 100 - 1
  } else if (xData.length < 5001) {
    xInterval = 250 - 1
  } else if (xData.length < 10001) {
    xInterval = 500 - 1
  } else if (xData.length < 20001) {
    xInterval = 1000 - 1
  } else {
    xInterval = 2000 - 1
  }
  return xInterval
}

// 默认开启棘波标注
function setIsNote(isNote: boolean = true) {
  myChart.off('brush')
  myChart.off('brushEnd')
  myChart.getZr().off('click')
  myChart.getZr().off('contextmenu')
  // 目前isNote一直为true
  if (isNote) {
    myChart.dispatchAction({
      type: 'takeGlobalCursor',
      key: 'brush', // 如果想变为“可刷选状态”，必须设置。不设置则会关闭“可刷选状态”。
      brushOption: {
        brushType: 'lineX', // 参见 brush 组件的 brushType。如果设置为 false 则关闭“可刷选状态”。
      }
    })
    onClick()       // 点击事件
    onBrushEnd()    // 刷选事件
    onContextmenu() // 右键事件
  }
}

const curTime = ref<number>(null)   // 当前点击后的时间

// 当某些通道被选中(标红)的情况下,如果选中某个时间范围,则从这几个被选中的通道对应的时间范围内寻找振幅的最大值和最小值
// 当没有通道被选中时,则从当前页面展示的所有通道对应的的时间范围内寻找振幅的最大值和最小值

const isMore = ref<boolean>(false)          // 多选状态

const curStartTime = ref<number>(null)      // 当前框选的开始时间
const curEndTime = ref<number>(null)        // 当前框选的结束时间
const durationTime = ref<number>(null)      // 当前框选的时间间隔

const curStartTimeIndex = ref<number>(null) // 当前框选的开始时间在xData的下标
const curEndTimeIndex = ref<number>(null)   // 当前框选的结束时间在xData的下标

const minfT = ref<number>(null)             // 当前选框的时间范围内寻找振幅的最小值
const maxfT = ref<number>(null)             // 当前选框的时间范围内寻找振幅的最大值
const minChannel = ref<string>(null)        // 当前选框的时间范围内寻找振幅的最小值所在的通道
const maxChannel = ref<string>(null)        // 当前选框的时间范围内寻找振幅的最大值所在的通道

const redChannelList = ref<{ channelName: string, index: number }[]>([])      // 选中的红色通道列表{channelName:通道名，index:在seriesList中的下标}


// 找到最近的值
function findNearestValue(target: number) {
  let minDiff = Infinity
  let nearestKey
  for (const key in yList) {
    const currentKey = parseFloat(key)
    const diff = Math.abs(target - currentKey)
    if (diff < minDiff) {
      minDiff = diff
      nearestKey = key
    }
  }
  return yList[nearestKey]
}


// 在鼠标移到Y轴标签名称上时，能够在旁边悬浮展示该标签名称
const tooltip = reactive({
  visible: false,
  content: '',
  x: -68,
  y: 0
})
const tooltipStyle = computed(() => ({
  left: tooltip.x + 'px',
  top: tooltip.y + 'px',
  opacity: tooltip.visible ? 1 : 0
}))

// 点击事件
function onClick() {
  // 只有展示小圆点时才移入展示
  // 监听鼠标事件
  myChart.on('mouseover', (params: any) => {
    if (!showYName.value) {
      // console.log('params1 :>> ', params)
      if (params.componentType === 'yAxis') {
        // 要把Y轴标签名称string的逗号去掉
        const realChannelName = findNearestValue(params.value.replace(/[,，]/g, ''))
        // console.log('Y轴标签1 :>> ', parseFloat(params.value.replace(/[,，]/g, '')), realChannelName)
        tooltip.content = realChannelName
        tooltip.y = params.event.offsetY - 2
        tooltip.visible = true
      }
    }
  })
  myChart.on('mouseout', (params: any) => {
    if (!showYName.value) {
      if (params.componentType === 'yAxis') {
        tooltip.visible = false
      }
    }
  })

  myChart.getZr().on('click', (params: any) => {
    // console.log('params :>> ', params, params.offsetX, params.offsetY)
    // 点击了内部
    if (params.topTarget) {
      const channelName = params.topTarget.style?.text
      // console.log('channelName :>> ', channelName);
      if (channelName) {
        // Y轴标签，在框左侧&&右靠齐
        if (params.offsetX < CHART_OPTION.grid.left && params.topTarget.style?.textAlign === 'right') {
          let realChannelName = ''
          // 只展示小圆点，channelName === '●'
          if (!showYName.value) {
            const yValue = myChart.convertFromPixel({ seriesIndex: 0 }, [0, params.offsetY])[1]
            // console.log('Y轴标签yValue :>> ', yValue)
            realChannelName = findNearestValue(yValue)
          } else {
            // showYName.value=true，展示完整名称，channelName就是真实的通道名称
            realChannelName = channelName
          }
          // console.log('Y轴标签 :>> ', realChannelName)

          // 先判断是否已经存在
          const seriesIndex = seriesList.findIndex((item: any) => item.channelName === realChannelName)
          seriesList[seriesIndex].itemStyle.color = seriesList[seriesIndex].itemStyle.color === RED_COLOR ? setChannelColor(realChannelName) : RED_COLOR // 改变通道颜色

          myChart.setOption({
            series: seriesList
          })

          // 获取红色通道列表，获取图表信息
          getRedChannelList()
        }
        // X轴标签， （也会点到顶部的红色时刻点，所以要去掉），不在顶部&&是数字&&不是红色
        else if (params.offsetY > CHART_OPTION.grid.top && !isNaN(parseFloat(channelName)) && params.topTarget.style?.fill !== '#a00') {
          // console.log('X轴标签 :>> ',channelName)
          readyToDrawRedMarkLineByTime(Number(channelName), params.event.metaKey || params.event.ctrlKey)
          setTimeout(() => {
            clearBrush()
          })
        }
      } else {
        // console.log('点击了内部空白处')
        // 点击了内部空白处，准备画竖线，清除选框
        // 延迟清除选框，能让画线更快
        // event.metaKey
        // 如果使用的是windows，meta键表示的是键盘上的win键
        // 如果使用的是苹果电脑，meta键表示的是键盘上的Cmd键
        readyToDrawRedMarkLine([params.offsetX, params.offsetY], params.event.metaKey || params.event.ctrlKey)
        setTimeout(() => {
          clearBrush()
        })
      }
    } else {
      // console.log('点击了外部空白处')
    }
  })

}

// 点击事件
function onClickOld() {
  myChart.getZr().on('click', (params: any) => {
    // 点击标记为红线
    // target存在则说明点在了线上或者是选框上，点在线上就会有seriesIndex
    const { target } = params
    if (target) {
      // 有时候是2层parent，有时候是3层parent
      const seriesIndex = target.parent?.parent?.__ecComponentInfo ? target.parent?.parent?.__ecComponentInfo?.index : target.parent?.parent?.parent?.__ecComponentInfo?.index
      // seriesIndex有值，说明点在了线上,只画红通道
      if (seriesIndex !== undefined) {
        const channelName = seriesList[seriesIndex].channelName
        seriesList[seriesIndex].itemStyle.color = seriesList[seriesIndex].itemStyle.color === RED_COLOR ? setChannelColor(channelName) : RED_COLOR // 改变通道颜色

        myChart.setOption({
          series: seriesList
        })

      } else {
        // 如果点在了选框上，seriesIndex就是undefined,准备画竖线，清除选框
        // 延迟清除选框，能让画线更快
        readyToDrawRedMarkLine([params.offsetX, params.offsetY], params.event.metaKey || params.event.ctrlKey)
        setTimeout(() => {
          clearBrush()
        })
      }
    } else {
      // 点击了空白处,准备画竖线，清除选框
      // 延迟清除选框，能让画线更快

      // event.metaKey
      // 如果使用的是windows，meta键表示的是键盘上的win键
      // 如果使用的是苹果电脑，meta键表示的是键盘上的Cmd键
      readyToDrawRedMarkLine([params.offsetX, params.offsetY], params.event.metaKey || params.event.ctrlKey)
      setTimeout(() => {
        clearBrush()
      })
    }

  })

}


// 获取红色通道列表，获取图表信息
function getRedChannelList() {
  redChannelList.value = []
  seriesList.forEach((item: any, index: number) => {
    if (item.itemStyle.color === RED_COLOR) {
      redChannelList.value.push({
        channelName: item.channelName,
        index: index,
      })
    }
  })
}


// 清除选框，如果清除选框前有选框再操作，加上if判断这一步使画竖线速度更快了
function clearBrush() {
  if (isMore.value) {
    myChart.dispatchAction({
      type: 'brush',
      areas: []
    })
    curStartTime.value = null
    curEndTime.value = null
    curStartTimeIndex.value = null
    curEndTimeIndex.value = null
    durationTime.value = null
    minfT.value = null
    maxfT.value = null
    minChannel.value = null
    maxChannel.value = null
    isMore.value = false
    const timeRangePoint = {
      name: 'timeRangePoint',
      id: 'timeRangePoint',
      type: 'line',
      // 使用markLine，可以让时间范围文字悬浮在图表上，markPoint做不到
      markLine: {
        data: [{
          xAxis: String(null), // 对于x轴中的一个值
        }],
      }
    }
    myChart.setOption({
      series: [timeRangePoint]
    })
  }

}

// 准备画竖线
function readyToDrawRedMarkLine(pointInPixel: number[], ctrlKey: boolean) {
  if (myChart.containPixel('grid', pointInPixel)) {
    const xIndex = myChart.convertFromPixel({ seriesIndex: 0 }, pointInPixel)[0]
    // 获取到了点击时的X轴数据
    const time = xData[xIndex]
    readyToDrawRedMarkLineByTime(time, ctrlKey)
  }
}

// 准备画竖线，已知时间
function readyToDrawRedMarkLineByTime(time: number, ctrlKey: boolean) {
  // 点击了本身
  if (curTime.value === time) {
    // 如果按了ctrl键，就getGfpPoint()
    if (ctrlKey) {
      getGfpPoint()
    } else {
      // 点击了本身也没按ctrl键就取消竖线
      curTime.value = null
      drawRedMarkLine()
    }
  } else {
    // 没点击本身
    curTime.value = time
    drawRedMarkLine()
    // 如果按了ctrl键，就getGfpPoint()
    if (ctrlKey) {
      getGfpPoint()
    }
  }
}

// 刷选事件
function onBrushEnd() {
  // 点击框选 brushEnd、brushselected
  myChart.on('brushEnd', function (params: any) {
    // console.log('brushEnd :>> ', params)
    // 如果刷出来了, 这个if一直会进来，因为设置了 removeOnClick: false
    if (params.areas.length) {
      isMore.value = true

      const range = params.areas[0].coordRange //根据坐标获取选中区域数据
      curStartTimeIndex.value = range[0]
      curEndTimeIndex.value = range[1]
      curStartTime.value = xData[range[0]]
      curEndTime.value = xData[range[1]]
      durationTime.value = parseFloat((curEndTime.value - curStartTime.value).toFixed(3))

      const timeRangePoint: any = {
        name: 'timeRangePoint',
        id: 'timeRangePoint',
        type: 'line',
        // 使用markLine，可以让时间范围文字悬浮在图表上，markPoint做不到
        markLine: {
          symbol: ['none', 'none'],
          lineStyle: {
            width: 0, // 不显示线
          },
          silent: true,  // true 不响应鼠标事件
          label: {
            show: true, // 是否展示文字
            color: useTheme['red-mark-line-text'], // 红色竖线上的文字颜色
            padding: [0, 0, 0, 50],
            formatter: `${curStartTime.value}-${curEndTime.value}`
          },
          data: [{
            xAxis: String(curStartTime.value), // 对于x轴中的一个值, startTime: string
          }],
        }
      }
      myChart.setOption({
        series: [timeRangePoint]
      })

      curTime.value = null
      drawRedMarkLine()
    }
  })
}

const modalTop = ref<number>(0)           // 右键弹窗的位置top
const modalLeft = ref<number>(0)          // 右键弹窗的位置left
const showMenuModal = ref<boolean>(false) // 显示右键弹窗

const modal_width = 140         // 右键弹窗的宽度
let modal_height = 306          // 右键弹窗的高度 = title30 + 6*item_height + 1个按钮*(26+2) 没有2个标记按钮是306

// 右键事件
function onContextmenu() {
  myChart.getZr().on('contextmenu', (params: any) => {
    // console.log('contextmenu :>> ', params)
    params.event.preventDefault(); // 阻止默认行为
    // 获取右键弹窗的位置并显现
    modalLeft.value = params.event.clientX
    modalTop.value = params.event.clientY

    if (params.event.clientX > window.innerWidth - modal_width - 5) { // 5是一个固定值，表示不想挨着边
      modalLeft.value = params.event.clientX - modal_width // -右键弹窗的宽度
    }

    // 先计算新的modal_height
    getGoodListAndBadList()

    if (params.event.clientY > window.innerHeight - modal_height) {
      modalTop.value = params.event.clientY - modal_height // 选框setChartData没有查看拓扑图按钮，所以再-30
    }

    // 如果没有多选并且没有先画红竖线，就右键的时候同时画
    if (!isMore.value && !curTime.value) {
      const pointInPixel = [params.offsetX, params.offsetY]
      if (myChart.containPixel('grid', pointInPixel)) {
        const xIndex = myChart.convertFromPixel({ seriesIndex: 0 }, pointInPixel)[0]
        // 获取到了点击时的X轴数据
        curTime.value = xData[xIndex]
        drawRedMarkLine()
        openMenuModal()
      } else {
        // 来到这里，说明右键点在了grid范围外，不弹窗不画线
      }
    } else {
      openMenuModal()
    }

  })
}

// 打开右键弹窗
function openMenuModal() {
  // 延时是关键，解决mac和linux上取消弹窗触发框选效果的问题。100ms不行
  setTimeout(() => {
    showMenuModal.value = true
  }, 200)
}

const curBadListLength = ref<number>(0)  // 当前标记为红色的通道中，坏通道的数量
const curGoodListLength = ref<number>(0) // 当前标记为红色的通道中，好通道的数量

// 获取2个标记按钮后面的数字，和 modal_height
function getGoodListAndBadList() {
  const curBadList = redChannelList.value.filter(item => props.badChannelList.includes(item.channelName))
  const curGoodList = redChannelList.value.filter(item => !props.badChannelList.includes(item.channelName))
  curBadListLength.value = curBadList.length
  curGoodListLength.value = curGoodList.length

  // 右键弹窗高度有6种情况
  if (!isMore.value) {
    if (curBadList.length > 0 && curGoodList.length > 0) {
      modal_height = 398
    } else if (curBadList.length === 0 && curGoodList.length === 0) {
      modal_height = 306
    } else {
      modal_height = 352
    }
  } else {
    if (curBadList.length > 0 && curGoodList.length > 0) {
      modal_height = 352
    } else if (curBadList.length === 0 && curGoodList.length === 0) {
      modal_height = 260
    } else {
      modal_height = 306
    }
  }
}

// 第一次画红色竖线，初始化竖线值为null，实际并没有显示线
function firstDrawRedMarkLine() {
  const redMarkLine = {
    name: 'redMarkLine',
    id: 'redMarkLine',
    type: 'line', // 如果将 markLine 单独写在一个对象里，就必须加 type ，不然报错。
    markLine: {
      symbol: 'none', // 相当于['none', 'none'] [虚线，没有箭头]
      silent: true, // true 不响应鼠标事件
      animation: false, // 是否开启动画
      animationDuration: 0, // 初始动画的时长
      data: [{
        xAxis: String(null) // 对于x轴中的一个值
      }],
      label: {
        show: true, // 是否展示文字
        color: useTheme['red-mark-line-text'], // 红色竖线上的文字颜色
        fontSize: 12,
        distance: 3 // 文字距离线的距离
      },
      lineStyle: {
        color: useTheme['red-mark-line'],
        width: 2, // 0 的时候可以隐藏线
        type: 'solid' // 实线，不写默认虚线
      }
    },
    markArea: {
      data: [[{
        xAxis: String(null) // 区域起点
      }, {
        xAxis: String(null) // 区域终点
      }]],
      itemStyle: {
        color: 'rgba(255, 0, 0, 0.05)', // 红色带透明度的背景色
      },
    }
  }
  myChart.setOption({
    series: [redMarkLine]
  })
}

const emit = defineEmits(['closeModal', 'successClickType', 'setRedLineValue', 'openViewModal', 'openLayoutModal', 'updateLayoutModal', 'setAllChartTheme', 'turnToGoodOrBadChannel'])

// 画标注红色背景
function drawMarkArea() {
  if (!props.showMarkAreaBg) {
    return {
      data: [],
    }
  } else {
    // 当前时间点
    const currentTime = curTime.value
    if (typeof currentTime !== 'number' || isNaN(currentTime)) {
      return { data: [] }
    }
    const { startTime, duration } = props
    const endTime = startTime + duration
    // 定义 markArea 宽度（半宽）
    const halfWidth = props.markAreaBgDuration / 2 // 默认1秒，即左右各0.5秒
    // 计算左右边界，并且限制在 x 轴有效范围内
    let start: any = Math.max(currentTime - halfWidth, startTime)
    let end: any = Math.min(currentTime + halfWidth, endTime)
    // 确保数值精度（保留2位小数）
    start = String(parseFloat(start.toFixed(3)))
    end = String(parseFloat(end.toFixed(3)))
    return {
      data: [[
        { xAxis: start }, // 区域起点
        { xAxis: end } // 区域终点
      ]]
    }
  }
}

// 画红色竖线
function drawRedMarkLine() {
  // console.log('curTime.value :>> ', curTime.value);
  if (isChartInited) {
    myChart.setOption({
      series: [{
        id: 'redMarkLine',
        markLine: {
          data: [{
            xAxis: String(curTime.value) // 对于x轴中的一个值
          }],
        },
        markArea: drawMarkArea(),
      }]
    })
    // 如果画上了竖线
    if (curTime.value) {
      emit('setRedLineValue', curTime.value)
      updateLayoutModal() // 画竖线时，如果打开了通道布局窗口，就更新

      // 如果开启了自动溯源，画竖线的时候就自动溯源
      if (props.autoSl) {
        clickLocation()
      }
    } else if (isMore.value) {
      updateLayoutModal()
    }
  }
}

// 设置红色竖线
function setRedMarkLine(time: number) {
  // if(curTime.value === time) {
  //   return console.log('一样时间')
  // }

  curTime.value = time

  // 加上这么if，解决了有时整个折线图会突然缩小到80%大小的问题，这一看就是折线图出错了，可能是myChart还为null，
  // 但一直不知道怎么复现，现在发现了，是在某个fif文件单模式下，切换模式，点击选择配准结果弹窗，选的不是当前fif文件，是其他的fif文件，确定后，就会触发设置所有卡片竖线setRedMarkLine方法，来到这里。
  // 因为此时切换了fif，触发了Index.vue里getCurData() 里的setRedMarkLine方法，来到这个，发现myChart还没初始化完成，就要画竖线，就会报错。
  if (isChartInited) {
    myChart.setOption({
      series: [{
        id: 'redMarkLine',
        markLine: {
          data: [{
            xAxis: String(curTime.value) // 对于x轴中的一个值
          }],
        },
        markArea: drawMarkArea(),
      }]
    })
    setTimeout(() => {
      clearBrush()
    })
  }
}

// 当ctrl+鼠标单击一个点时，自动跳转到附近的波峰/波谷点
async function getGfpPoint() {
  const params: any = {
    timeSec: String(curTime.value),     // 棘波开始时间, 以字符串形式传递
    startTime: String(props.startTime), // form起点时间, 以字符串形式传递
    filePath: props.filePath,           // 文件路径
    megData: chMegData,
  }
  const { code, data } = await getGfpPointApi(params)
  if (code === 200) {
    curTime.value = parseFloat(Number(data).toFixed(3))
    drawRedMarkLine()
  }
}


// 点击类型
async function clickType(item: any) {
  const params: any = {
    coregId: props.coregId,
    spikeType: item.value,             // 棘波类型
    startTime: String(curTime.value),  // 棘波开始时间, 以字符串形式传递
    filePath: props.filePath,          // 文件路径
    brainArea: props.brainRegion,      // 脑区
    channels: props.chNames.join(','), // 当前展示的是哪些通道的脑磁图，以逗号隔开。如果同时存在脑区和通道的话，以通道为准
    subjectId: props.subjectId,
  }
  // 如果是选时间段
  if (isMore.value) {
    params.startTime = String(curStartTime.value)
    params.endTime = String(curEndTime.value) //棘波结束时间。当选择一个时间段的时候，才会有endTime。 以字符串形式传递
  }
  const { code, msg } = await addOrUpdateManualSpikeApi(params)
  if (code === 200) {
    message.success(`${curTime.value}已标记为${item.label}`, 1)
    showMenuModal.value = false
    // 添加标注点成功后刷新标注点
    emit('successClickType', String(curTime.value))
  }
}

// 右键点击溯源定位按钮
async function clickLocation() {
  showMenuModal.value = false
  emit('openViewModal', String(curTime.value))
}

// 右键点击打开通道布局按钮
async function openLayoutModal() {
  showMenuModal.value = false
  if (curTime.value) {
    emit('openLayoutModal', String(curTime.value))
  } else if (isMore.value) {
    // emit('updateLayoutModal', [curStartTime.value, curEndTime.value, durationTime.value])
    emit('openLayoutModal', {
      startTime: curStartTime.value,
      endTime: curEndTime.value,
      durationTime: durationTime.value,
    })
  }
}

// 画竖线时，如果打开了通道布局窗口，就更新
async function updateLayoutModal() {
  showMenuModal.value = false
  if (curTime.value) {
    emit('updateLayoutModal', String(curTime.value))
  } else if (isMore.value) {
    // emit('updateLayoutModal', [curStartTime.value, curEndTime.value, durationTime.value])
    emit('updateLayoutModal', {
      startTime: curStartTime.value,
      endTime: curEndTime.value,
      durationTime: durationTime.value,
    })
  }
}


const showYName = ref(false) // 是否展示完整通道名称

const local_showYName = localStorage.getItem('showYName')
showYName.value = local_showYName === 'true'

// 切换：Y轴是否显示完整通道名称
function switchShowName(bool: boolean) {
  showYName.value = bool
  localStorage.setItem('showYName', String(showYName.value))

  if (showYName.value) {
    CHART_OPTION.grid.left = 50
    myChart.setOption({
      grid: {
        left: 50,
      },
      yAxis: [{
        axisLabel: {
          formatter: (value: number) => {
            if (!overlap.value) {
              if (value <= 0 && value % TWO_SPACE === 0) {
                yList[value] = yData[value / -TWO_SPACE]
                return yList[value]
              } else {
                return ''
              }
            } else {
              return value === 0 ? '0' : ''
            }
          },
        }
      }],
    })
  } else {
    CHART_OPTION.grid.left = 10
    myChart.setOption({
      grid: {
        left: 10,
      },
      yAxis: [{
        axisLabel: {
          formatter: (value: number) => {
            // console.log('value :>> ', value);
            if (!overlap.value) {
              if (value <= 0 && value % TWO_SPACE === 0) {
                yList[value] = yData[value / -TWO_SPACE]
                return yList[value] ? `{name|●}` : ''
              } else {
                return ''
              }
            } else {
              return value === 0 ? '0' : ''
            }
          },
          rich: {
            name: {
              color: '#999', // 可以设置颜色
              fontSize: 11, // 可以设置字体大小
            }
          }
        }
      }],
    })
  }
}


// 缩小，比例尺就变大
function zoomOut() {
  ratioScale.value = calcUp(ratioScale.value)
  changeRatioScale()
}

// 放大，比例尺就变小
function zoomIn() {
  ratioScale.value = calcDown(ratioScale.value)
  changeRatioScale()
}

const ratioStep = ref<number>(0)
// 比例尺input-number点击上下箭头的回调
function onRatioStep(value: number, info: { offset: number, type: 'up' | 'down' }) {
  ratioStep.value = setRatioStep(ratioScale.value, info.type)
  // 第一次点击没反应，自己操作，但如果先点击了缩放，再点这个就有问题了
  if (info.offset === 0) {
    ratioScale.value = info.type === 'up' ? calcUp(ratioScale.value) : calcDown(ratioScale.value)
    changeRatioScale()
  }
  if (info.type === 'up' && ratioScale.value === 11) {
    ratioScale.value = 10
  }
}


// const local_allModeRatioScale = localStorage.getItem('allModeRatioScale')
// ratioScale.value = local_allModeRatioScale ? Number(local_allModeRatioScale) : ONE_SPACE

// 修改比例尺
function changeRatioScale() {
  // localStorage.setItem('allModeRatioScale', String(ratioScale.value))
  setOverlapRatio(overlap.value, ratioScale.value)
}


// 修改重叠和比例尺, ratio：比例尺
function setOverlapRatio(overlapValue: boolean = false, ratio: number = ONE_SPACE) {
  overlap.value = overlapValue
  ratioScale.value = ratio
  setSeriesList('setOverlapRatio')
  // 不设置X轴Y轴，只设置series
  myChart.setOption({
    series: seriesList
  })

}

const showRightDrawer = ref(false)
function openSwitchChannel(bool: boolean) {
  showRightDrawer.value = bool
}


// 点击快捷搜索和快捷选中
async function clickGivenList(item: string) {
  // console.log('item :>> ', allChannelListByName.value,item);
  const channels = [...allChannelListByName.value[item]] // 这里必须要加[...]，否则再点击快捷选中中的脑区，会去随便点击的几个也加上去

  listName.value = item
  listNameType.value = 'listName'

  paramsData.listName = item
  paramsData.listNameType = 'listName'
  paramsData.chNames = JSON.parse(JSON.stringify(channels))

  const res = await megApi(paramsData)
  if (res.code === 200) {
    setChartData(res.data)
  }

}


// 点击了自定义通道集合 meg
async function clickCustomChannelList(item: any) {
  const channels = [...item.channelList]
  listName.value = item.listName
  listNameType.value = 'listName'

  paramsData.listName = item.listName
  paramsData.listNameType = 'listName'
  paramsData.chNames = JSON.parse(JSON.stringify(channels))

  const res = await megApi(paramsData)
  if (res.code === 200) {
    setChartData(res.data)
  }

}

// 点击了自定义通道集合 eeg
async function clickEegCustomChannelList(item: any) {
  // 组合是要放在leadCombination里的
  if (item.modalType === 'eegComb') {
    paramsData.leadCombination = JSON.parse(JSON.stringify(item.channelList))
    paramsData.chNames = [] // 要清空，否则chNames还有之前的数据，会报错
    paramsData.modalType = 'eegComb'
  } else {
    paramsData.chNames = JSON.parse(JSON.stringify(item.channelList))
    paramsData.leadCombination = []
    paramsData.modalType = 'eegChannel'
  }

  listName.value = item.listName
  listNameType.value = 'listName'
  paramsData.listName = item.listName
  paramsData.listNameType = 'listName'

  const res = await eegjsonApi(paramsData)
  if (res.code === 200) {
    setChartData(res.data)
  }

}


// 点击了导联组合 eeg
async function clickEegCombList(item: any) {

  // 组合是要放在leadCombination里的
  paramsData.leadCombination = JSON.parse(JSON.stringify(item.combination))
  paramsData.chNames = [] // 要清空，否则chNames还有之前的数据，会报错

  listName.value = item.label
  listNameType.value = 'listName'
  paramsData.listName = item.label
  paramsData.listNameType = 'listName'

  const res = await eegjsonApi(paramsData)
  if (res.code === 200) {
    setChartData(res.data)
  }

}




// 预设窗口宽高
const givenWidthHeightList = ref<any[]>([
  { width: 300, height: 300 },
  { width: 300, height: 400 },
  { width: 300, height: 600 },
  { width: 400, height: 300 },
  { width: 400, height: 400 },
  { width: 400, height: 600 },
  { width: 600, height: 300 },
  { width: 600, height: 400 },
  { width: 600, height: 600 },
])
function clickGivenWidthHeightList(item: any) {
  cardWidth.value = item.width
  cardHeight.value = item.height
  myChart.resize({
    width: item.width,
    height: item.height - marginTop
  })
}

// 修改了窗口宽高
function changeWidthHeight() {
  if (!cardWidth.value) {
    cardWidth.value = 200
  }
  if (!cardHeight.value) {
    cardHeight.value = 133
  }
  myChart.resize({
    width: cardWidth.value,
    height: cardHeight.value - marginTop
  })
}





// 图表主题色
function clickCustomColorList(item: any) {
  themeStore.switchChartTheme(item.value)
  emit('setAllChartTheme', item.value) // 会走到全脑区图和所有窗口的setChartTheme方法（在下面）
}

function setChartTheme(value: string) {
  useTheme = allThemeList[value]
  GOOD_COLOR = useTheme['series.itemStyle.color']
  BAD_COLOR = useTheme['badColor']

  CHART_OPTION.backgroundColor = useTheme['backgroundColor']
  CHART_OPTION.dataZoom[0].borderColor = useTheme['sliderBorderColor']
  CHART_OPTION.xAxis[0].axisLabel.color = useTheme['xAxis.axisLabel.color']

  CHART_OPTION.xAxis[0].splitLine.lineStyle.color = useTheme['xAxis.splitLine.lineStyle.color']
  CHART_OPTION.xAxis[0].axisPointer.lineStyle.color = useTheme['red-mark-line']

  CHART_OPTION.yAxis[0].axisLabel.color = useTheme['yAxis.axisLabel.color']
  CHART_OPTION.yAxis[0].axisLine.lineStyle.color = useTheme['yAxis.axisLine.lineStyle.color']
  CHART_OPTION.yAxis[0].splitLine.lineStyle.color = useTheme['yAxis.splitLine.lineStyle.color']

  myChart.setOption(CHART_OPTION)

  setSeriesList('setChartData')
  realSetData()
}


const rightDrawerTab = ref('1')
const rightDrawerTabList = ref([
  { label: t('通道'), value: '1' },
  { label: t('设置'), value: '2' },
])


// const modalTypeName = computed(() => {
//   console.log('paramsData.modalType',paramsData.modalType)
//   return {
//     meg: '脑磁',
//     eegChannel: '脑电',
//     eegComb: '脑电',
//   }[paramsData.modalType] || ''
// })

// 是否是翻转振幅
const isFlipChart = ref(false)
// 翻转图表
function switchFlipChart() {
  // 如果当前是翻转的，那数据就是chMegDataFlip，如果chMegDataFlip还没有，就算一次，下次不用再算了
  // 如果当前是不翻转的，那数据就是chMegDataNormal，chMegDataNormal一开始就有
  if (isFlipChart.value) {
    if (chMegDataFlip) {
      chMegData = JSON.parse(JSON.stringify(chMegDataFlip))
    } else {
      const flipData: any = {}
      Object.keys(chMegDataNormal).forEach((key) => {
        const list: number[] = []
        chMegDataNormal[key].forEach((item: number) => {
          list.push(-item) // 翻转
        })
        flipData[key] = list
      })
      chMegDataFlip = flipData
      chMegData = JSON.parse(JSON.stringify(chMegDataFlip))
    }
  } else {
    chMegData = JSON.parse(JSON.stringify(chMegDataNormal))
  }

  // console.log('chMegDataNormal :>> ', chMegDataNormal);
  // console.log('chMegDataFlip :>> ', chMegDataFlip);
  // console.log('chMegData :>> ', chMegData);
  setSeriesList('setChartData')
  realSetData()
}


// 画坏通道
function drawBadChannel() {

  seriesList.forEach((item: any) => {
    item.itemStyle.color = setChannelColor(item.channelName)
  })

  if (isChartInited) {
    myChart.setOption({
      yAxis: [{
        axisLabel: {
          color: (value: number) => {
            if (!overlap.value) {
              let channelName = (value <= 0 && value % TWO_SPACE === 0) ? yData[value / -TWO_SPACE] : ''
              if (props.badChannelList.includes(channelName)) {
                return BAD_COLOR
              } else {
                return useTheme['yAxis.axisLabel.color']
              }
            } else {
              return useTheme['yAxis.axisLabel.color']
            }
          },
        },
      }],
      series: seriesList
    })
  }
}


// 变成坏通道
async function turnToBadChannel() {
  const chNameList = redChannelList.value.map(item => item.channelName)
  const params = {
    fifFilePath: props.filePath, // 文件路径
    subjectId: props.subjectId,
    channelNames: chNameList
  }
  const { code, msg } = await addBadChannelApi(params)
  if (code === 200) {
    message.success(t('已标记为坏通道'), 1)
    redChannelList.value = []
    showMenuModal.value = false
    emit('turnToGoodOrBadChannel')
  }
}

// 变成好通道（删除坏通道标记）
async function turnToGoodChannel() {
  const chNameList = redChannelList.value.map(item => item.channelName)
  const params = {
    fifFilePath: props.filePath, // 文件路径
    subjectId: props.subjectId,
    channelNames: chNameList
  }
  const { code, msg } = await deleteBadChannelApi(params)
  if (code === 200) {
    message.success(t('已取消坏通道标记'), 1)
    redChannelList.value = []
    showMenuModal.value = false
    emit('turnToGoodOrBadChannel')
  }
}

// 比例尺单位，ECGEOG是脑电，GFP是脑磁
const setRatioScaleUnit = computed(() => {
  const { modalType } = paramsData

  if (['meg', 'gfp'].includes(modalType)) {
    return 'fT'
  }
  if (['eegChannel', 'eegComb', 'ecgeog'].includes(modalType)) {
    return 'μV'
  }
})


function changeNewBrain(value: string) {
  // console.log('value :>> ', value);
  // 要把新的startTime 赋值上去，否则用的还是老的paramsData.startTime
  paramsData.startTime = props.startTime
  // opm的进不来这个方法，放心用'_grad'
  clickGivenList(value + '_grad')
}

</script>

<style lang="less" scoped>
@import './style/line.less';
@import './style/drawer.less';
</style>