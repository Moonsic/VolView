<!-- 多脑区拖动图 -->
<template>
  <DragCard v-if="showModal" ref="dragCradRef" :width="cardWidth" :height="cardHeight" :left="cardLeft" :top="cardTop"
    :zIndex="zIndex" :marginTop="marginTop" @drag="dragModal" @startDrag="startDragModal" @endDrag="endDragModal"
    @close="closeModal">

    <template v-slot:title>
      <div class="flex-between widthP100">
        <div class="flex-start title-left">
          <span class="text-11">{{ t('全脑区') }}</span>
          <!-- <div class="modal-type-center">
            <span class="text-11">全脑区图</span>
          </div> -->
        </div>
        <div class="flex-end title-right">

          <!-- 比例尺放大缩小 -->
          <MinusCircleOutlined class="icon" :title="t('振幅缩小')" @click="zoomOut" />
          <PlusCircleOutlined class="icon" :title="t('振幅放大')" @click="zoomIn" />

          <SettingOutlined class="icon" v-if="!showRightDrawer" @click="openSwitchChannel(true)" />
          <SettingOutlined class="icon" v-if="showRightDrawer" @click="openSwitchChannel(false)" />

        </div>
      </div>

    </template>



    <div class="drag-modal" ref="modalRef" :style="{ backgroundColor: useTheme['backgroundColor'] }">

      <div class="modal-body">
        <div ref="myEchartRef" :style="{ width: '100%', height: cardHeight + 'px' }"></div>
        <!-- <div ref="myEchartRef" :style="{ width: '100%', height: cardHeight - 10 + 'px', marginTop: '10px' }"></div> -->
      </div>

    </div>


    <div class="right-drawer" v-if="showRightDrawer">

      <div class="small-title">{{ t('宽高') }}：</div>
      <div class="flex-center mb4">
        <a-input-number class="" v-model:value="cardWidth" :placeholder="t('宽')" size="small" :controls="false"
          :min="200" :max="innerWidth - 110" @change="changeWidthHeight" />
        *
        <a-input-number class="" v-model:value="cardHeight" :placeholder="t('高')" size="small" :controls="false"
          :min="250" :max="innerHeight" @change="changeWidthHeight" />
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

  </DragCard>


</template>

<script lang="ts" setup>
import { init } from 'echarts'
import { message } from 'ant-design-vue'
import DragCard from './parts/DragCard.vue'
import { useThemeStore } from '@/store/theme'
import { storeToRefs } from 'pinia'

import { allThemeList, customColorList } from './config' // 暗色主题
import {
  getButterflyDataApi,
} from '@/api/meg'

import { calcUp, calcDown } from '@/utils/ratioScale'

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
  customChannelList: {
    type: Array as PropType<any[]>,
    default: [],
  },
  badChannelList: {
    type: Array as PropType<any[]>,
    default: [],
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
})

const dragCradRef = ref(null)

function getPositionSize() {
  return {
    ...dragCradRef.value.getPositionSize(),
    modalType: paramsData.modalType,
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
// const paramsData = reactive<any>({})

const cardWidth = ref(600)
const cardHeight = ref(750)
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

// 关闭弹窗
function closeModal() {
  showModal.value = false
  // emit('closeModal', modalId.value)
  if (myChart) {
    myChart.clear()
    myChart.dispose()
    myChart = null
  }
  emit('closeModal')
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

  params.modalType = 'butterfly'

  zIndex.value = Number(params.zIndexValue + 100)

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

  paramsData = { ...params }

  const res = await getButterflyDataApi(params)
  // console.log('butterfly res.data :>> ', res.data);
  if (res.code === 200) {
    setChartData(res.data)
  } else {
    closeModal() // 接口失败要关闭弹窗
  }
}

// 设置，意思是修改，保留原来的通道
async function setData(params: any) {

  const res = await getButterflyDataApi(params)

  if (res.code === 200) {
    paramsData = {
      ...params,
    }
    setChartData(res.data)
  }
}

// 点击查询、修改脑区、前进后退会走到这 res：图表数据
function setChartData(data: any) {
  xData = data.timePoints
  chMegData = data.regionMegData

  yData = Object.keys(data.regionMegData)

  // console.log('yData :>> ', yData);

  chMegDataNormal = JSON.parse(JSON.stringify(data.regionMegData))
  chMegDataFlip = null

  redChannelList.value = []


  setSeriesList('setChartData')
  realSetData()

}

// 设置通道颜色，现在有好通道和坏通道之分，所以每次变换颜色都要区分好坏。
function setChannelColor(channelName: string) {
  return channelName === 'avgData' ? RED_COLOR : GOOD_COLOR
  // return GOOD_COLOR
}


const themeStore = useThemeStore()
const { chartTheme } = storeToRefs(themeStore)

// 使用的主题色
let useTheme = allThemeList[chartTheme.value]

let GOOD_COLOR = useTheme['series.itemStyle.color']
let BAD_COLOR = useTheme['badColor']
const RED_COLOR = 'red'

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
    left: 22,
    right: 6,
    bottom: 26,
    top: 17,
    containLabel: false        // 不自适应。左侧Y轴数据量大时，自适应会失效，有bug，所以直接left写死，不自适应
  },
  // dataZoom: [
  //   {
  //     show: true,
  //     id: 'ySilder',
  //     type: 'slider',          // Y轴可滑动
  //     yAxisIndex: [0],
  //     showDetail: false,       // 显示详细数值
  //     showDataShadow: false,   // 显示数据阴影。数据阴影可以简单地反应数据走势。
  //     brushSelect: false,      // 是否开启刷选功能
  //     width: 7,
  //     right: 3,                // 与右侧的距离
  //     filterMode: 'none',      // 不过滤数据，只改变数轴范围
  //     handleIcon: HANDLE_ICON, // 移动手柄图标
  //     handleSize: '100%',
  //     borderColor: useTheme['sliderBorderColor'], // 滑块边框颜色

  //     // 最新：说是还是全显示的比较好，所以注释掉
  //     // startValue: TWO_SPACE,
  //     // endValue: TWO_SPACE * 13
  //   },
  // ],
  // brush: { // 选框
  //   removeOnClick: false,  // 是否支持『单击清除所有选框』
  //   xAxisIndex: 0,         // 如 0，表示这个 index 所对应的坐标系
  //   transformable: false,  // 已经选好的选框是否可以被调整形状或平移。默认是true
  //   brushStyle: {
  //     borderWidth: 0,
  //     color: 'rgba(120,140,200,0.3)', // 偏蓝一点，原：'rgba(120,140,180,0.2)'
  //     borderColor: 'rgba(120,140,200,0.8)',
  //   }
  // },
  xAxis: [{
    type: 'category',
    triggerEvent: true,     // 事件触发，移入就有鼠标手势
    boundaryGap: true, // 坐标轴两边留白策略，默认为true
    axisLabel: {
      // interval: 250-1, // 坐标轴刻度标签的显示间隔，在类目轴中有效，默认是'auto', 0: 强制显示所有标签。这个现在根据xData长度计算
      hideOverlap: true, // 隐藏重叠的标签
      color: useTheme['xAxis.axisLabel.color'],    // x轴刻度标签
      align: 'center', // 默认是 'center'，改成 'right' 让最后一个标签左对齐
      formatter: (value, index) => {
        if (index === xData.length - 1) {
          return `{last|${value}}`; // 最后一个标签左对齐
        }
        return value;
      },
      rich: {
        last: {
          padding: [0, 20, 0, 0], // 右间距
        },
      },
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
      fontSize: 11,       // 字体大小
      // fontWeight: 'bold', // 刻度标签文字的字体加粗
      color: useTheme['yAxis.axisLabel.color'],      // 刻度标签文字的颜色
      margin: 3,           // 刻度标签与轴线之间的距离
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
// const ratioScaleAll = ref<number>(ONE_SPACE)

// 设置折线数据
function setSeriesList(type: 'setChartData' | 'setOverlapRatio') {
  // let oldSeriesList: any[] = null // 上一个seriesList的值，用于保留折线颜色
  // if (type === 'setOverlapRatio') {
  //   oldSeriesList = seriesList || []
  // }
  // 先清空seriesList
  seriesList = []
  yData.map((item3: any, index3: number) => {


    const yData2 = Object.keys(chMegData[item3])
    yData2.map((item: any, index: number) => {

      let seriesData: any = []
      // 如果重叠
      if (overlap.value) {
        // // 直接用原始数据seriesData = chMegData[item] 不对，点击比例尺就没反应
        // seriesData = chMegData[item3][item].map((item2: number) => {
        //   return (item2 * ONE_SPACE / ratioScale.value) // 重叠时
        // })
      } else {
        seriesData = chMegData[item3][item].map((item2: number) => {
          // return (item2 * ONE_SPACE / ratioScaleAll.value - TWO_SPACE * index3) // 重叠时 比例尺不影响形状
          // return item2 - (TWO_SPACE * index3) // 重叠时 比例尺不影响形状

          // 只改变平均线的比例尺
          if (item === 'avgData') {
            return (item2 * ONE_SPACE / ratioScale.value - TWO_SPACE * index3) // 重叠时 比例尺不影响形状
          } else {
            return item2 - (TWO_SPACE * index3) // 重叠时 比例尺不影响形状

          }
        })
      }

      // 注意，这里的index已经乱了
      // if (type === 'setOverlapRatio' && item === 'avgData') {
      //   console.log('oldSeriesList:>> ',oldSeriesList[index].itemStyle.color);
      // }


      const obj = {
        name: 'spikeLine', // 这个必须是一样的
        type: 'line',
        sampling: 'lttb',  // 折线图在数据量远大于像素点时候的降采样策略，开启后可以有效的优化图表的绘制效率，默认关闭，也就是全部绘制不过滤数据点。
        smooth: false,     // 默认平滑true , true会卡，false不卡
        symbol: 'none',    // 标记的图形
        animation: false,  // 动画太卡，不要动画了
        silent: true,      // true 不响应鼠标事件
        emphasis: {
          disabled: true,    // 完全禁用高亮状态
        },
        itemStyle: {
          // 注意，这里的index已经乱了
          // color: type === 'setOverlapRatio' ? oldSeriesList[index].itemStyle.color : setChannelColor(item), // 如果是重叠或者比例尺按钮，要保持原来的颜色
          color: setChannelColor(item), // 如果是重叠或者比例尺按钮，要保持原来的颜色
        },
        lineStyle: {
          width: 1
        },
        data: seriesData,
        channelName: item, // 通道名称

      }

      // if (item === 'avgData') {
      //   console.log('item, obj :>> ',item, obj);
      // }
      seriesList.push(obj)

    })

  })
}

let isChartInited = false // 是否初始化过图表，代替以前的myChart.getOption()

// 真正的画折线
function realSetData() {
  // console.log('myChart.getOption() :>> ', myChart.getOption());
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

}

const yList: any = {}


// 设置新的选项，X轴，Y轴和seriesList
function setNewOption() {


  myChart.setOption({
    xAxis: [{
      data: xData,
      axisLabel: {
        interval: setXInterval(), // 设置xAxis[0].axisLabel.interval，这个现在根据xData长度计算
      }
    }],
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
  // myChart.off('brush')
  // myChart.off('brushEnd')
  myChart.getZr().off('click')
  // myChart.getZr().off('contextmenu')
  // 目前isNote一直为true
  if (isNote) {
    // myChart.dispatchAction({
    //   type: 'takeGlobalCursor',
    //   key: 'brush', // 如果想变为“可刷选状态”，必须设置。不设置则会关闭“可刷选状态”。
    //   brushOption: {
    //     brushType: 'lineX', // 参见 brush 组件的 brushType。如果设置为 false 则关闭“可刷选状态”。
    //   }
    // })
    onClick()       // 点击事件
    // onBrushEnd()    // 刷选事件
    // onContextmenu() // 右键事件
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



// 点击事件
function onClick() {

  // 初始化时绑定全局事件
  // myChart.getZr().on('mousemove', () => {
  //   myChart.dispatchAction({ type: 'downplay' }); // 强制取消高亮[3,5](@ref)
  // });

  // myChart.getZr().on('mousemove', throttle(() => {
  //   console.log('mousemove :>> ');
  //   myChart.dispatchAction({ type: 'downplay' });
  // }, 100)); // 100ms间隔的防抖处理[3,5](@ref)

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

          // showYName.value=true，展示完整名称，channelName就是真实的通道名称
          realChannelName = channelName

          // console.log('Y轴标签 :>> ', realChannelName)

          // // 先判断是否已经存在
          // const seriesIndex = seriesList.findIndex((item: any) => item.channelName === realChannelName)
          // seriesList[seriesIndex].itemStyle.color = seriesList[seriesIndex].itemStyle.color === RED_COLOR ? setChannelColor(realChannelName) : RED_COLOR // 改变通道颜色

          // myChart.setOption({
          //   series: seriesList
          // })

          // // 获取红色通道列表，获取图表信息
          // getRedChannelList()
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
    }
  }
  myChart.setOption({
    series: [redMarkLine]
  })
}

const emit = defineEmits(['closeModal', 'successClickType', 'setRedLineValue', 'openViewModal', 'openLayoutModal', 'updateLayoutModal', 'setAllChartTheme', 'turnToGoodOrBadChannel'])

// 画红色竖线
function drawRedMarkLine() {
  if (isChartInited) {
    myChart.setOption({
      series: [{
        id: 'redMarkLine',
        markLine: {
          data: [{
            xAxis: String(curTime.value) // 对于x轴中的一个值
          }],
        }
      }]
    })
    // 如果画上了竖线
    if (curTime.value) {
      emit('setRedLineValue', curTime.value)
      updateLayoutModal() // 画竖线时，如果打开了通道布局窗口，就更新
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
        }
      }]
    })
    setTimeout(() => {
      clearBrush()
    })
  }
}


// 画竖线时，如果打开了通道布局窗口，就更新
async function updateLayoutModal() {
  if (curTime.value) {
    emit('updateLayoutModal', String(curTime.value))
  } else if (isMore.value) {
    emit('updateLayoutModal', {
      startTime: curStartTime.value,
      endTime: curEndTime.value,
      durationTime: durationTime.value,
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


const local_butterflyRatioScale = localStorage.getItem('butterflyRatioScale')
ratioScale.value = local_butterflyRatioScale ? Number(local_butterflyRatioScale) : ONE_SPACE

// 修改比例尺
function changeRatioScale() {
  localStorage.setItem('butterflyRatioScale', String(ratioScale.value))
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



// 预设窗口宽高
const givenWidthHeightList = ref<any[]>([
  { width: 200, height: 600 },
  { width: 200, height: 800 },
  { width: 300, height: 600 },
  { width: 300, height: 800 },
  { width: 400, height: 800 },
  { width: 400, height: 1000 },
  { width: 400, height: 1160 },
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
    cardHeight.value = 250
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

</script>

<style lang="less" scoped>
@import './style/line.less';
@import './style/drawer.less';

.modal-type-center {
  width: 100%;
  text-align: center;

  >span {
    display: inline-block;
    padding: 2px 4px;
    color: var(--black-t4);
    border: 1px solid var(--black-t6);
    border-radius: 3px;
    line-height: 1;
    transform: translateX(52%);

  }
}

.chart-dark {
  .modal-type-center {
    >span {
      color: var(--white-t4);
      border: 1px solid var(--white-t6);
    }
  }
}

.chart-eyecare {
  .modal-type-center {
    >span {
      color: var(--eyecare-t4);
      border: 1px solid var(--eyecare-t6);
    }
  }
}
</style>