<template>
  <DragCard v-if="visible" class="drag-modal" ref="dragCardRef" :width="cardWidth" :height="cardHeight" :left="cardLeft"
    :top="cardTop" :zIndex="zIndex" :marginTop="marginTop" :title="curTime" :draggable="true" @drag="dragModal"
    @startDrag="startDragModal" @endDrag="endDragModal" @close="closeModal">
    <div class="card-body">
      <!-- <div style="position: absolute; z-index:999">{{ cardWidth }} {{ cardHeight }}</div> -->

      <div class="left" :style="{ width: cardWidth * leftPer + 'px' }">
        <LineList ref="lineListRef" :curTime="curTime" :curSpikeSlChannels="props.curSpikeSlChannels"
          :megType="props.megType" @setRedChannelList="setRedChannelList" @setGreenChannel="setGreenChannel"
          :containerWidth="cardWidth * leftPer" :containerHeight="(cardHeight - marginTop)" />
        <div class="v-line" ref="vLineRef"></div>
      </div>
      <div class="right" :style="{ width: cardWidth * (1 - leftPer) + 'px' }">
        <div class="h-line" ref="hLineRef" :style="{ top: (cardHeight - marginTop) * topPer + 'px' }"></div>
        <div class="top" :style="{ height: (cardHeight - marginTop) * topPer + 'px' }">
          <a-segmented class="segmented" size="small" v-model:value="curLayout" :options="layoutList"
            @change="changeLayout">
          </a-segmented>

          <Helmet ref="helmetRef" v-if="curLayout === '3d'" />

          <img class="graph-img" v-if="curLayout === '2d'" :src="graphImg" alt="" draggable="false"
            @click.stop="previewImg(graphImg)">

        </div>
        <div class="bottom" :style="{ height: (cardHeight - marginTop) * (1 - topPer) + 'px' }">
          <div class="title">{{ t('幅度值') }}</div>
          <LineBottom ref="lineBottomRef" :mode="props.mode" :autoSl="props.autoSl" @setRedLineValue="setRedLineValue"
            @openViewModal="openViewModal" />
        </div>
      </div>
    </div>

  </DragCard>
</template>

<script lang="ts" setup>
import { useDraggable } from '@vueuse/core'
import { previewImg } from '@u/preview'
import { debounce } from '@u/utils'

import DragCard from '../parts/DragCard.vue'
import LineList from './LineList.vue'
import Helmet from './Helmet.vue'
import LineBottom from './LineBottom.vue'

import {
  megApi,          // 1. 查折线图
  getTopoGraphApi, // 获取拓扑图的接口
  getTopomap3dApi, // 23. 获取头盔图
} from '@/api/meg'

const { t } = useI18n()

const props = defineProps({
  fifFilePath: {
    type: String,
    default: '',
  },
  subjectId: {
    type: String,
    default: '',
  },
  mode: {
    type: String,
    default: 'more',
  },
  curSpikeSlChannels: {
    type: Array as PropType<any[]>,
    default: [],
  },
  autoSl: {
    type: Number,
    default: 0,
  },
  megType: {
    type: String,
    default: 'megin',
  },
  markAreaBgDuration: {
    type: Number,
    default: 1,
  }

})

watch(() => props.megType, () => {
  nextTick(() => {
    redChannelList = [] // 要清空，因为megin和opm64的通道不一样。
  })
}, { immediate: true })


// 弹窗可拖动
const dragCardRef = ref(null)

function getPositionSize() {
  // console.log('dragCardRef.value.getPositionSize() :>> ', dragCardRef.value.getPositionSize());
  // return dragCardRef.value.getPositionSize()
  return {
    ...dragCardRef.value.getPositionSize(),
    leftPer: leftPer.value,
    topPer: topPer.value,
  }
}


const lineListRef = ref(null)
const helmetRef = ref(null)
const lineBottomRef = ref(null)

const cardWidth = ref(750)
const cardHeight = ref(500)
const cardLeft = ref(270)
const cardTop = ref(94)
const zIndex = ref<number>(0) // 卡片层级，用于拖拽时始终在最上方
const marginTop = 20

// 设置层级z-index
function setZIndex(value: number) {
  zIndex.value = Number(value + 100)
}

// 开始拖拽
function startDragModal() {
  // console.log('res :>> ', res);
}

// 正在拖拽
function dragModal(res: any) {
  // console.log('dragModal :>> ', res);
  cardWidth.value = res.cardWidth
  cardHeight.value = res.cardHeight

  helmetRef.value?.setResize({
    width: res.cardWidth * (1 - leftPer.value),
    height: (res.cardHeight - marginTop) * topPer.value - 5, // 5px 是hLine的高度
  })

  lineBottomRef.value.setResize({
    width: res.cardWidth * (1 - leftPer.value),
    height: (res.cardHeight - marginTop) * (1 - topPer.value),
  })

  debounceSetResize()

}

// 结束拖拽
function endDragModal() {
  // 原来在这里的缩放大小，改成在拖拽时防抖触发
}

// 使用防抖包装，500毫秒内连续触发只执行最后一次
const debounceSetResize = debounce(() => {
  // 这个太卡顿了，就不在拖拽中进行，在结束时触发一次
  lineListRef.value.setResize({
    width: cardWidth.value * leftPer.value,
    height: (cardHeight.value - marginTop),
    leftPer: leftPer.value,
  })
}, 500)


// 关闭弹窗
function closeModal() {
  visible.value = false
  graphImg.value = null
  tableData.value = []
}

const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const tableData = ref<any[]>([])
const formParams = ref<any>()
const coregId = ref<string>('')
const curTime = ref<string>('')
const durationTime = ref<number>(props.markAreaBgDuration)

const isFirstOpen = ref<boolean>(true)

// 显示弹窗
async function showModal({ coregId: coregIdValue, zIndexValue, curTime: curTimeValue, formParams: formParamsValue, isUpdate }: any) {

  visible.value = true

  // 更新数据时不设置层级，否则更新数据时，通道布局窗口始终在最上层。
  if (!isUpdate) {
    zIndex.value = Number(zIndexValue + 100)
  }

  formParams.value = formParamsValue
  coregId.value = coregIdValue

  curTime.value = curTimeValue // 先置空，否则就算curTimeValue=null，这个组件的curTime也不是null
  durationTime.value = props.markAreaBgDuration

  // 没有时间时，全部置空
  if (curTimeValue === null) {
    nextTick(() => {
      // if (isFirstOpen.value) {
      //   cardHeight.value = cardHeight.value + marginTop // 刚打开时必须加上20px，否则bottomLine下面会空20px
      //   isFirstOpen.value = false
      // }
      lineListRef.value.setData(null)
      helmetRef.value?.setData(null)
      graphImg.value = null
      lineBottomRef.value.setChartData(null)
    })
  }
  // // 只画竖线
  // if (typeof curTimeValue === 'string') {
  //   curTime.value = curTimeValue
  //   durationTime.value = 0.2
  // }
  // 框选
  if (curTimeValue && typeof curTimeValue === 'object') {
    curTime.value = (((curTimeValue.endTime + curTimeValue.startTime) / 2).toFixed(3))
    durationTime.value = curTimeValue.durationTime
  }

  // console.log('formParamsValue :>> ', formParamsValue);
  // console.log('cardWidth :>> ', cardWidth.value, cardHeight.value);
  // console.log('leftPer :>> ', leftPer.value, topPer.value);

  nextTick(() => {
    // 如果有卡片大小位置信息，就设置
    if (formParamsValue.cardHeight) {
      // 先赋值，再dragModal()，因为dragModal()里用到leftPer和topPer了。
      cardWidth.value = formParamsValue.cardWidth
      cardHeight.value = formParamsValue.cardHeight
      cardLeft.value = formParamsValue.cardLeft
      cardTop.value = formParamsValue.cardTop
      leftPer.value = formParamsValue.leftPer || 0.61
      topPer.value = formParamsValue.topPer || 0.68

      dragModal({
        cardWidth: formParamsValue.cardWidth,
        cardHeight: formParamsValue.cardHeight,
        cardLeft: formParamsValue.cardLeft,
        cardTop: formParamsValue.cardTop,
      })
      endDragModal()
    } else {

      helmetRef.value?.setResize({
        width: cardWidth.value * (1 - leftPer.value),
        height: (cardHeight.value - marginTop) * topPer.value - 5, // 5px 是hLine的高度
      })
      lineBottomRef.value.setResize({
        width: cardWidth.value * (1 - leftPer.value),
        height: (cardHeight.value - marginTop) * (1 - topPer.value),
      })
    }
    // 添加以下代码，会导致缩放弹窗时，点击新的竖线，位置还是之前的。目前先注释撤回。
    // else {
    //   dragModal({
    //     cardWidth: cardWidth.value,
    //     cardHeight: cardHeight.value,
    //   })
    //   endDragModal()
    // }
    // console.log('cardWidth 2 :>> ', cardWidth.value, cardHeight.value);
  })

  debouncedGetTwoData()

}

// 使用防抖包装，500毫秒内连续触发只执行最后一次
const debouncedGetTwoData = debounce(() => {
  // 如果没时间，说明是设置一个空的布局弹窗
  if (curTime.value) {
    getHelmetData()
    getChartData()
  }
}, 500)


// 获取头盔数据
async function getHelmetData() {
  // 如果没有头盔组件，就获取2d图片
  if (!helmetRef.value) {
    return getTopoGraph()
  }
  // 如果没有时间，则不请求。
  if (!curTime.value) {
    return
  }
  // 请先配准
  if (!coregId.value) {
    helmetRef.value?.setData(null)
    return
  }
  const params: any = {
    coregId: coregId.value,
    timePoint: curTime.value,
    isFilter: formParams.value.isFilter,
    filterFreqs: {
      lowFreq: formParams.value.filterFreqs.lowFreq,
      highFreq: formParams.value.filterFreqs.highFreq,
      notchFreq: formParams.value.filterFreqs.notchFreq,
    },
    filePath: props.fifFilePath
  }

  const { code, data } = await getTopomap3dApi(params)
  if (code === 200) {
    helmetRef.value?.setData(data)
  }
}

let chMegData: { [key: string]: number[] } = null   // res.chMegData {通道名称1:[数据],通道名称2:[数据]}
let xData: number[] = []                     // x轴数据 [17, 17.001, 17.002, 17.003]
let redChannelList: string[] = []            // 存下标红的通道


// 获取306通道数据
async function getChartData() {
  const params = {
    ...formParams.value,
    isEog: false,
    isEcg: false,
    isGfp: false,
    brainRegion: 'all', // 获取所有306个通道
    duration: durationTime.value,
    startTime: parseFloat((Number(curTime.value) - durationTime.value / 2).toFixed(3))
  }
  // 判断是否小于tmin或者大于tmax
  if (params.startTime < params.tmin) {
    params.startTime = params.tmin
  }
  if (params.startTime >= params.tmax - params.duration) {
    params.startTime = params.tmax - params.duration
  }
  delete params.tmax
  delete params.tmin
  delete params.chNames // 获取所有306个通道，通道名称不能传

  const { code, data } = await megApi(params)
  if (code === 200) {
    // console.log('data :>> ', data);
    chMegData = data.chMegData
    xData = data.timePoints
    lineListRef.value.setData(data, redChannelList)

    // 因为在最新的代码里lineListRef.value.setData里加上了emit('setRedChannelList'), 所以不能在这里调setRedChannelList(redChannelList, true)了
    // 删除 setRedChannelList(redChannelList, true)
  }

}

// drawCenterLine：是否画中间线，如果是调接口就需要，如果是在lineList上点击，线可能以前改动了，就不需要
function setRedChannelList(list: string[], drawCenterLine = false) {
  // console.log('redChannelList.value :>> ', list)
  redChannelList = list || [] // 防止后台传过来的是空字符串，确保 redChannelList 是数组
  if (redChannelList.length) {
    const newChMegData: any = {}
    redChannelList.forEach(item => {
      newChMegData[item] = chMegData[item]
    })
    const data = {
      chMegData: newChMegData,
      timePoints: xData
    }
    lineBottomRef.value.setChartData(data, drawCenterLine ? Number(curTime.value) : null) // 本来是不加时间的，为了维持已有的红线，但请求了新接口就画中间线
  } else {
    // 全部
    const data = {
      chMegData: chMegData,
      timePoints: xData
    }
    lineBottomRef.value.setChartData(data, drawCenterLine ? Number(curTime.value) : null) // 本来是不加时间的，为了维持已有的红线，但请求了新接口就画中间线
  }
}

function setGreenChannel(greenChannel: string) {
  lineBottomRef.value.setGreenChannel(greenChannel)
}

const emit = defineEmits(['openViewModal', 'setRedLineValue'])

// 右键点击溯源定位按钮
async function openViewModal(time: string, channels: string[]) {
  emit('openViewModal', String(time), channels)
}

// 设置标记线的值,让其他卡片和蝴蝶图也设置成这个值
function setRedLineValue(value: number) {
  emit('setRedLineValue', value)
  // 如果是后来点击下面图表时，要重新请求一下头盔图，不能省略这个if，否则点击外面竖线时这里也会触发，导致触发2次接口请求。
  if (curTime.value !== String(value)) {
    curTime.value = String(value)
    getHelmetData()
    // lineList也需要重新画竖线
    lineListRef.value.setRedLineValue(value)
  }
}


const vLineRef = ref(null)
const hLineRef = ref(null)
const isDragging = ref<boolean>(false) // 正在被拖拽
const leftPer = ref<number>(0.61) // 正在被拖拽
const topPer = ref<number>(0.68) // 正在被拖拽

useDraggable(vLineRef, {
  // initialValue: { x: props.left, y: props.top }, // 弹窗的初始位置
  onStart: () => {
    isDragging.value = true
  },
  onEnd: (position) => {
    isDragging.value = false

    const rect = vLineRef.value.getBoundingClientRect()
    const r = (rect.right - position.x) / cardWidth.value
    leftPer.value = leftPer.value - r
    leftPer.value = parseFloat((leftPer.value + r).toFixed(4))

    lineListRef.value.setResize({
      width: cardWidth.value * leftPer.value,
      height: (cardHeight.value - marginTop),
      leftPer: leftPer.value,
    })

  },
  onMove: (position) => {
    const rect = vLineRef.value.getBoundingClientRect()
    const r = (rect.right - position.x) / cardWidth.value
    leftPer.value = leftPer.value - r

    if (leftPer.value <= 0.05) {
      leftPer.value = 0.05
    }
    if (leftPer.value >= 0.95) {
      leftPer.value = 0.95
    }

    helmetRef.value?.setResize({
      width: cardWidth.value * (1 - leftPer.value),
      height: (cardHeight.value - marginTop) * topPer.value - 5, // 5px 是hLine的高度
    })

    lineBottomRef.value.setResize({
      width: cardWidth.value * (1 - leftPer.value),
      height: (cardHeight.value - marginTop) * (1 - topPer.value),
    })

  },
})


useDraggable(hLineRef, {
  // initialValue: { x: props.left, y: props.top }, // 弹窗的初始位置
  onStart: () => {
    isDragging.value = true
  },
  onEnd: (position) => {
    isDragging.value = false

    const rect = hLineRef.value.getBoundingClientRect()
    const r = (rect.top - position.y) / cardHeight.value
    topPer.value = topPer.value - r
    topPer.value = parseFloat((topPer.value + r).toFixed(4))

  },
  onMove: (position) => {
    const rect = hLineRef.value.getBoundingClientRect()
    const r = (rect.top - position.y) / cardHeight.value
    topPer.value = topPer.value - r

    if (topPer.value <= 0.05) {
      topPer.value = 0.05
    }
    if (topPer.value >= 0.95) {
      topPer.value = 0.95
    }

    helmetRef.value?.setResize({
      width: cardWidth.value * (1 - leftPer.value),
      height: (cardHeight.value - marginTop) * topPer.value - 5, // 5px 是hLine的高度
    })

    lineBottomRef.value.setResize({
      width: cardWidth.value * (1 - leftPer.value),
      height: (cardHeight.value - marginTop) * (1 - topPer.value),
    })

  },
})

function setChartTheme(value: string) {
  lineListRef.value.setChartTheme(value)
  lineBottomRef.value.setChartTheme(value)
  helmetRef.value?.setChartTheme(value)
}


const curLayout = ref('3d')

const layoutList = ref([
  { value: '3d' },
  { value: '2d' },
])

function changeLayout() {
  if (curLayout.value === '2d') {
    getTopoGraph()
  }
  if (curLayout.value === '3d') {
    nextTick(() => {
      getHelmetData()
    })
  }
  // userStore.updateWebPageSet({
  //   flowchartLayout: curLayout.value,
  // })
}

const graphImg = ref<string>(null)

// 显示弹窗
async function getTopoGraph() {
  // 如果没有时间，则不请求。
  if (!curTime.value) {
    return
  }
  const params = {
    timeSec: String(curTime.value), // 以字符串形式传递
    filePath: props.fifFilePath,       // 文件路径
    subjectId: props.subjectId
  }
  const { code, data } = await getTopoGraphApi(params)
  if (code === 200) {
    graphImg.value = `data:image/png;base64,${data}`
  }
}


// 暴露方法
defineExpose({
  visible,
  showModal,
  setZIndex,
  getPositionSize,
  setChartTheme,
})

</script>

<style lang="less" scoped>
.card-body {
  width: 100%;
  height: 100%;
  position: relative;
  background: var(--white-bg); // 必须要加，因为暗黑模式下的边框是透明的


  .left {
    height: 100%;
    display: inline-block;
    vertical-align: top;
    background: var(--white-bg);
    position: relative;
    // border-right: 5px solid var(--color-border);
    overflow: hidden;

    position: relative;

    .v-line {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 1;
      width: 5px;
      height: 100%;
      background: var(--black-border);
      // background: red;
      cursor: e-resize;
    }
  }

  .right {
    height: 100%;
    display: inline-block;
    // vertical-align: top;
    position: relative;
    overflow: hidden;
    position: relative;
    background: #d1d5d9;

    .top {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      // height: 68%;
      // height: 350px;
      border-bottom: 5px solid var(--white-border);
    }

    .h-line {
      position: absolute;
      top: 0;
      z-index: 1;
      width: 100%;
      height: 5px;
      transform: translateY(-100%);
      // background: var(--color-border);
      // background: red;
      cursor: n-resize;
      background: var(--black-border);
    }

    .graph-img {
      width: 100%;
      cursor: zoom-in;
    }
  }


  .bottom {
    width: 100%;
    background: var(--white-bg);
    position: relative;
  }

  .title {
    position: absolute;
    top: 0;
    left: 2px;
    z-index: 999;
    font-size: 11px;
    color: var(--black-t2);
  }
}


.chart-dark {
  .card-body {
    .top {
      border-bottom: 5px solid var(--white-border);
    }

    .left {
      background: var(--black-bg);

      .v-line {
        background: var(--white-border);
      }
    }

    .right {
      // background: #303030;
      background: var(--black-bg);

      .h-line {
        background: var(--white-border);
      }
    }

    .bottom {
      background: var(--black-bg);
    }

    .title {
      color: var(--white-t2);
    }
  }

}


.chart-eyecare {
  .card-body {
    .top {
      border-bottom: 5px solid var(--eyecare-border);
    }

    .left {
      background: var(--eyecare-bg);

      .v-line {
        background: var(--eyecare-gray-bg);
      }
    }

    .right {
      background: #d1d5d9;

      .h-line {
        background: var(--eyecare-gray-bg);
      }
    }

    .bottom {
      background: var(--eyecare-bg);
    }

    .title {
      color: var(--eyecare-t2);
    }
  }

}

:deep(.segmented) {
  position: absolute;
  top: 2px;
  right: 2px;
  z-index: 9;

  &.ant-segmented .ant-segmented-item-label {
    padding: 0 5px;
  }
}
</style>
