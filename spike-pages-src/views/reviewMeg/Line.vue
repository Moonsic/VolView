<!-- 折线图 -->
<template>
  <div class="page-line" :style="{ width: '100%', height: chartHeight + 'px' }">

    <div ref="myEchartRef" :style="{ width: '100%', height: chartHeight - 58 + 'px' }"></div>

    <div class="all-spike-list">
      <div class="item spike-tooltip"
        :class="[item.type === 1 ? 'item-alg' : 'item-manual', curTime == Number(item.startTime) ? 'active' : null]"
        :style="{ left: ((item.startTime - props.tmin) / (props.tmax - props.tmin)) * 100 + '%' }"
        :data-title="item.type === 1 ? `${t('算法')}: ${item.startTime}` : `${t('手动')}: ${item.startTime}`"
        v-for="(item, index) in allSpikeList" :key="index" @click="clickAllSpikeList(item)">
      </div>
    </div>


    <div class="all-time-list" v-if="timeList.length">
      <div class="left"> {{ props.tmin }}</div>
      <div class="time-list">
        <div class="item time-tooltip"
          :class="[timeList.length <= 300 ? 'short-item' : 'long-time', props.startTime === item.start ? 'active' : null]"
          :data-title="`${item.start}-${item.end}`" v-for="(item, index) in timeList" :key="index"
          @click="clickTime(item)"></div>
        <!-- <div class="item time-tooltip short-item" v-for="(item, index) in 300" :key="index" @click="clickTime(item)"></div> -->
        <!-- <div class="item time-tooltip long-item" v-for="(item, index) in 810" :key="index" @click="clickTime(item)"></div> -->
      </div>
      <div class="right"> {{ props.tmax }}</div>
    </div>

    <div class="chart-info flex-center" v-show="isMore">
      <div class="mr16">Selection: [{{ curStartTime }} s, {{ curEndTime }} s] </div>
      <div class="mr16">Duration: [{{ durationTime }} s]</div>
      <div class="mr16">Min: [{{ minfT }} {{ channelsTypeUnit }}, {{ minChannel }}]</div>
      <div class="mr16">Max: [{{ maxfT }} {{ channelsTypeUnit }}, {{ maxChannel }}]</div>
    </div>

    <a-modal v-model:open="showMenuModal"
      :style="{ width: '140px', top: modalTop + 'px', left: modalLeft + 'px', margin: '0' }" :title="null"
      :footer="null" :closable="false" :maskStyle="{
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
      }" :bodyStyle="{
        padding: '0px',
      }">
      <div class="context-menu">
        <div class="title" :class="[isMore ? 'pl4' : 'pl8']"> {{ isMore ? `${curStartTime}-${curEndTime}` : curTime }}
        </div>
        <!-- <div class="item" v-for="(item, index) in spikeTypeList" :key="index" @click="clickType(item)">
          <span class="point mr8" :style="{
            background: item.color[0],
            borderColor: item.color[1],
          }"></span>
          {{ item.label }}
        </div> -->

        <!-- <div class="menu-button" v-if="!isMore" @click="clickGraph">查看拓扑图</div> -->
        <div class="menu-button" v-if="!isMore" @click="openLayoutModal"> {{ t('打开通道布局') }}</div>

        <div class="menu-button button-bad" v-if="redChannelList.length && curGoodListLength" @click="turnToBadChannel">
          {{ t('标记为坏通道') }}
          <div class="num">{{ curGoodListLength }}</div>
        </div>
        <div class="menu-button button-bad" v-if="redChannelList.length && curBadListLength" @click="turnToGoodChannel">
          {{ t('取消坏通道标记') }}
          <div class="num">{{ curBadListLength }}</div>
        </div>

        <!-- <div class="menu-button-list" v-if="!isMore">
          <div><MenuFoldOutlined /></div>
          <div>bad</div>
          <div><MenuFoldOutlined /></div>
          <div><MenuFoldOutlined /></div>
        </div> -->

      </div>
    </a-modal>

    <!-- 拓扑图窗口，现在由通道布局窗口代替 -->
    <!-- <GraphModal ref="graphModalRef" /> -->


    <!-- 通道布局窗口 -->
    <LayoutModal ref="layoutModalRef" mode="single" :fifFilePath="props.filePath" :subjectId="props.subjectId"
      :curSpikeSlChannels="props.curSpikeSlChannels" :megType="props.megType"
      @setRedLineValue="setRedLineValueFromLineModal" />

  </div>
</template>

<script lang="ts" setup>
import { init } from 'echarts'
import { message } from 'ant-design-vue'
import { spikeTypeList } from '@u/data'
import { arraysAreEqual } from '@u/utils'
import { allThemeList } from './config' // 主题色
// import GraphModal from './modal/GraphModal.vue'
import LayoutModal from './layoutModal/LayoutModal.vue'

import { useThemeStore } from '@/store/theme'
import { storeToRefs } from 'pinia'

import {
  addOrUpdateManualSpikeApi, // 添加或者修改手动标注的棘波，修改的时候，也需要传入所有字段的信息
  getGfpPointApi, // 当ctrl+鼠标单击一个点时，自动跳转到附近的波峰/波谷点
  getBadChannelApi,
  addBadChannelApi,
  deleteBadChannelApi
} from '@/api/meg'

// import {
//   getCoregResultListApi, // 1. 获取配准结果列表
// } from '@/api/sl'

const { t } = useI18n()


// 取消默认的浏览器自带右键
window.oncontextmenu = (e) => {
  e.preventDefault()
}

const props = defineProps({
  // megId: {
  //   type: String,
  //   default: '',
  // },
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
  subjectId: {
    type: String,
    default: '',
  },
  tmin: {
    type: Number,
    default: 0,
  },
  tmax: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number,
    default: 5,
  },
  badChannelList: {
    type: Array as PropType<any[]>,
    default: [],
  },
  allSpikeList: {
    type: Array as PropType<any[]>,
    default: [],
  },
  coregId: {
    type: String,
    default: '',
  },
  getFormParams: {
    type: Function,
  },
  curSpikeSlChannels: {
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
  }
})

// 暴露方法
defineExpose({
  resize,
  setMove,
  resetChart,
  resetRedChannel,
  setChartData,
  setRedMarkLine,
  setOverlap,
  setRatioScale,
  drawSpikePointList,
  drawBadChannel
})

const timeList = computed(() => {
  const list = []
  const { tmin, tmax, duration } = props
  // 如果时长被清空=0，就会陷入死循环，页面崩溃
  if (!duration) {
    return []
  }
  const length = tmax - tmin
  // 如果时长大于总长度，也不显示
  if (duration > length) {
    return []
  }
  for (let start = tmin; start < tmax; start += duration) {
    let end = Math.min(start + duration, tmax)
    // 如果是最后一个区间，并且它不能被整除，则调整end值
    if (end === tmax && length % duration !== 0) {
      end = list[list.length - 1].end
      list[list.length - 1].end = tmax
      break
    }
    list.push({
      start: parseFloat(start.toFixed(3)),
      end: parseFloat(end.toFixed(3))
    })
  }
  return list
})

// 点击时间段
function clickTime(item: any) {
  emit('setStartTime', item.start)
}



// let topHeight: number = 104 // 浏览器顶部到图表的距离 12+12+68+12=104
let topHeight: number = 94 // 浏览器顶部到图表的距离 12+12+58+12=94
let leftWidth: number = 480 // 浏览器宽度到图表的距离 12+240+8+16+200+12 = 480
const chartHeight = ref<number>(window.innerHeight - topHeight) // 高，这里减的数字是浏览器顶部到图表的距离
const chartWidth = ref<number>(window.innerWidth - leftWidth) // 宽，这里减的数字是浏览器宽度到图表的距离

let myChart: any = null
const myEchartRef: Ref<HTMLElement | null> = ref(null)

onUnmounted(() => {
  window.onresize = null
  myChart.clear()
  myChart.dispose()
  myChart = null
  isChartInited = false
})

onMounted(() => {
  myChart = init(myEchartRef.value as HTMLElement)
  // 根据页面大小自动响应图表大小
  window.onresize = () => resize(topHeight, leftWidth)
})

// 根据页面大小自动响应图表大小
function resize(top: number, left: number) {
  topHeight = top  // 顶，这一步不能删
  leftWidth = left // 左，这一步不能删
  chartHeight.value = window.innerHeight - top // 高
  chartWidth.value = window.innerWidth - left  // 宽
  myChart.resize({
    height: chartHeight.value - 58,
    width: chartWidth.value
  })
}

// 上下左右移动
function setMove(type: 'up' | 'down' | 'left' | 'right') {
  const dataZoom = myChart.getOption().dataZoom
  const xStart = dataZoom[0].start
  const xEnd = dataZoom[0].end
  const yStart = dataZoom[1].start
  const yEnd = dataZoom[1].end
  if (type === 'up' && yEnd < 100) {
    myChart.dispatchAction({
      type: 'dataZoom',
      dataZoomIndex: 1,   // dataZoom 组件的 index，多个 dataZoom 组件时有用
      start: yStart + 10, // 开始位置的百分比，0 - 100
      end: yEnd + 10,     // 结束位置的百分比，0 - 100
    })
  }
  if (type === 'down' && yStart > 0) {
    myChart.dispatchAction({
      type: 'dataZoom',
      dataZoomIndex: 1,
      start: yStart - 10,
      end: yEnd - 10,
    })
  }
  if (type === 'left' && xStart > 0) {
    myChart.dispatchAction({
      type: 'dataZoom',
      dataZoomIndex: 0,
      start: xStart - 10,
      end: xEnd - 10,
    })
  }
  if (type === 'right' && xEnd < 100) {
    myChart.dispatchAction({
      type: 'dataZoom',
      dataZoomIndex: 0,
      start: xStart + 10,
      end: xEnd + 10,
    })
  }
}

// 重置图表，重置移动和红通道
function resetChart() {
  myChart.dispatchAction({
    type: 'dataZoom',
    dataZoomIndex: 0,
    start: 0,
    end: 100,
  })
  myChart.dispatchAction({
    type: 'dataZoom',
    dataZoomIndex: 1,
    start: 0,
    end: 100,
  })

  // 把红通道也清除
  resetRedChannel()
}

// 设置通道颜色，现在有好通道和坏通道之分，所以每次变换颜色都要区分好坏。
function setChannelColor(channelName: string) {
  return props.badChannelList.includes(channelName) ? BAD_COLOR : GOOD_COLOR
}

// 重置红通道
function resetRedChannel() {
  redChannelList.value = []

  seriesList.forEach((item: any) => {
    item.itemStyle.color = setChannelColor(item.channelName)
  })
  myChart.setOption({
    series: seriesList
  })
}

const themeStore = useThemeStore()
const { theme } = storeToRefs(themeStore)
// 使用的主题色
const useTheme = allThemeList[theme.value]

// 标记通道的3种颜色
const GOOD_COLOR = useTheme['series.itemStyle.color']
const BAD_COLOR = useTheme['badColor']
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
    left: 70,
    right: 25,
    bottom: 24,
    top: 22,
    containLabel: false        // 不自适应。左侧Y轴数据量大时，自适应会失效，有bug，所以直接left写死，不自适应
  },
  dataZoom: [
    // {
    //   show: true,
    //   id: 'xSilder',
    //   type: 'slider',          // X轴可滑动
    //   xAxisIndex: [0],
    //   height: 20,
    //   moveHandleSize: 12,      // 移动手柄的尺寸高度
    //   bottom: 15,              // slider组件离容器下侧的距离
    //   filterMode: 'none',      // 不过滤数据，只改变数轴范围
    //   handleIcon: HANDLE_ICON, // 移动手柄图标
    //   handleSize: '80%',
    // },
    {
      show: true,
      id: 'ySilder',
      type: 'slider',          // Y轴可滑动
      yAxisIndex: [0],
      showDetail: false,       // 显示详细数值
      showDataShadow: false,   // 显示数据阴影。数据阴影可以简单地反应数据走势。
      brushSelect: false,      // 是否开启刷选功能
      width: 8,
      filterMode: 'none',      // 不过滤数据，只改变数轴范围
      handleIcon: HANDLE_ICON, // 移动手柄图标
      handleSize: '100%',
      borderColor: useTheme['sliderBorderColor'], // 滑块边框颜色

      // 之前默认显示8条，现在显示所有
      // startValue: TWO_SPACE,
      // endValue: TWO_SPACE * 9
    },
    {
      id: 'yInside',
      type: 'inside',       // Y轴可鼠标滑动缩放
      yAxisIndex: [0],
      filterMode: 'none',   // 不过滤数据，只改变数轴范围
    }
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
      show: false       // 是否显示坐标轴轴线
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
      margin: 5,           // 刻度标签与轴线之间的距离
      // emphasis: {
      //   color: '#FF0000 !important' // 悬停时字体颜色变为红色， 不生效啊
      // }
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
    },
  }],
  series: []
}

let seriesList: any[] = []                   // series数据
let chMegData: { [key: string]: number[] } = null   // res.chMegData {通道名称1:[数据],通道名称2:[数据]}
let xData: number[] = []                     // x轴数据 [17, 17.001, 17.002, 17.003]
let yData: string[] = []                     // 通道名称列表, 也是y轴数据 ['MEG0113', 'EOG061', 'ECG062', 'GFP']

// 重叠，默认不重叠
const overlap = ref<boolean>(false)
// 比例尺
const ratioScale = ref<number>(ONE_SPACE)

// 修改重叠
function setOverlap(overlapValue: boolean = false, ratio: number = ONE_SPACE) {
  // 重叠时放到最大
  myChart.dispatchAction({
    type: 'dataZoom',
    dataZoomIndex: 0,
    start: 0,
    end: 100,
  })
  myChart.dispatchAction({
    type: 'dataZoom',
    dataZoomIndex: 1,
    start: 0,
    end: 100,
  })
  setOverlapRatio(overlapValue, ratio)
}

// 修改比例尺
function setRatioScale(overlapValue: boolean = false, ratio: number = ONE_SPACE) {
  setOverlapRatio(overlapValue, ratio)
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


// // 坏通道列表
// const badChannelList = ref<string[]>([
//   // 'MEG0141', 'MEG0222'
// ])


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


// 点击查询、修改脑区、前进后退会走到这 res：图表数据
function setChartData(res: any) {
  // console.log('res :>> ', res);
  xData = res.timePoints // 想用 xData = getXData(35, 40)这个方法，但感觉对速度的影响并不大，因为通道就有很多条。方法在utils里
  chMegData = res.chMegData
  yData = Object.keys(res.chMegData)
  setSeriesList('setChartData')
  realSetData()

  redChannelList.value = []

  // console.log('new xData :>> ', xData, curTime.value, props.startTime)
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
  );
}



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
    const obj = {
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
        color: type === 'setOverlapRatio' ? oldSeriesList[index].itemStyle.color : setChannelColor(item), // 如果是重叠或者比例尺按钮，要保持原来的颜色;
      },
      lineStyle: {
        width: 1
      },
      data: seriesData,
      channelName: item, // 通道名称
    }
    seriesList.push(obj)
  })
}

let isChartInited = false // 是否初始化过图表，代替以前的myChart.getOption()

// 真正的画折线
function realSetData() {
  // console.log('myChart :>> ', myChart);
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
    isChartInited = true // 初始化过图表了
  }
  drawBadChannel()
}

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
        // color: useTheme['yAxis.axisLabel.color'], // 现在要先默认y轴标签颜色，否则切换fif文件时，坏通道颜色还在，会等画坏通道时才设置新的颜色。
        // 前进后退时，使用之前的坏通道列表先设置颜色
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
        formatter: (value: number) => {
          if (!overlap.value) {
            if (value <= 0 && value % TWO_SPACE === 0) {
              return yData[value / -TWO_SPACE]
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

// 设置xAxis[0].axisLabel.interval，以2/5/10/20秒，5种情况
function setXInterval() {
  let xInterval = 250 - 1
  if (xData.length <= 2001) {
    xInterval = 100 - 1
  } else if (xData.length < 5001) {
    xInterval = 200 - 1
  } else if (xData.length < 10001) {
    xInterval = 250 - 1
  } else if (xData.length < 20001) {
    xInterval = 500 - 1
  } else {
    xInterval = 1000 - 1
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

const channelsType = ref<string>('meg')      // 当前通道类型 'meg'|'eogecg'|'gfp'
const channelsTypeUnit = computed(() => {    // 单位，'meg'|'gfp'是fT，'eogecg'是μV
  return channelsType.value === 'eogecg' ? 'μV' : 'fT'
})
// 只有在选框情况下才获取图表信息，获取最大最小值
// 最新逻辑：有MEG，只比较MEG，单位是fT；没有MEG，比较EOG/ECG，单位是uV；只有GTP，就是GFP，单位是fT
function changeChartInfo() {

  let newSeriesList: any[] = []
  let seriesType: string = ''
  // 首先检查是否有包含 'MEG' 的对象。并且不是坏通道
  const megObjects = seriesList.filter(obj => obj.channelName.includes('MEG') && !props.badChannelList.includes(obj.channelName))
  if (megObjects.length > 0) {
    newSeriesList = megObjects
    seriesType = 'meg'
  } else {
    // 如果没有 'MEG' 对象，则检查 'EOG' 或 'ECG'
    const eogOrEcgObjects = seriesList.filter(obj => obj.channelName.includes('EOG') || obj.channelName.includes('ECG'))
    if (eogOrEcgObjects.length > 0) {
      newSeriesList = eogOrEcgObjects
      seriesType = 'eogecg'
    } else {
      // 如果只有GTP，就是GFP
      const gfpObjects = seriesList.filter(obj => obj.channelName.includes('GFP'))
      if (gfpObjects.length > 0) {
        newSeriesList = gfpObjects
        seriesType = 'gfp'
      } else {
        // 如果没有MEG，EOG/ECG，GTP，不可能。
        return
      }
    }
  }
  channelsType.value = seriesType

  // 红色通道，现在只选符合seriesType的才是真正的有效的红色通道
  const newRedChannelList = redChannelList.value.filter(obj => {
    if (seriesType === 'meg') {
      return obj.channelName.includes('MEG') && !props.badChannelList.includes(obj.channelName)
    }
    if (seriesType === 'eogecg') {
      return obj.channelName.includes('EOG') || obj.channelName.includes('ECG')
    }
    if (seriesType === 'gfp') {
      return obj.channelName.includes('GFP')
    }
  })

  //curEndTimeIndex.value 要 + 1，slice()要把endTime包括进去
  if (newRedChannelList.length > 0) {
    newRedChannelList.forEach((item: any, index: number) => {
      // index用的是item.index
      const data = seriesList[item.index].data.slice(curStartTimeIndex.value, curEndTimeIndex.value + 1)
      const max = parseFloat(((Math.max(...data) + TWO_SPACE * item.index) * ratioScale.value / ONE_SPACE).toFixed(3))
      const min = parseFloat(((Math.min(...data) + TWO_SPACE * item.index) * ratioScale.value / ONE_SPACE).toFixed(3))
      if (index === 0) {
        minfT.value = min
        maxfT.value = max
        minChannel.value = item.channelName
        maxChannel.value = item.channelName
      } else {
        if (min < minfT.value) {
          minfT.value = min
          minChannel.value = item.channelName
        }
        if (max > maxfT.value) {
          maxfT.value = max
          maxChannel.value = item.channelName
        }
      }
    })
  } else {
    // 如果当前没有红色通道,就遍历所有通道，index用的是index
    newSeriesList.forEach((item: any, index: number) => {
      const data = item.data.slice(curStartTimeIndex.value, curEndTimeIndex.value + 1)
      const max = parseFloat(((Math.max(...data) + TWO_SPACE * index) * ratioScale.value / ONE_SPACE).toFixed(3))
      const min = parseFloat(((Math.min(...data) + TWO_SPACE * index) * ratioScale.value / ONE_SPACE).toFixed(3))
      if (index === 0) {
        minfT.value = min
        maxfT.value = max
        minChannel.value = item.channelName
        maxChannel.value = item.channelName
      } else {
        if (min < minfT.value) {
          minfT.value = min
          minChannel.value = item.channelName
        }
        if (max > maxfT.value) {
          maxfT.value = max
          maxChannel.value = item.channelName
        }
      }
    })
  }
}

// 点击事件
function onClick() {
  myChart.getZr().on('click', (params: any) => {
    // console.log('params :>> ', params,params.offsetX,params.offsetY);
    if (params.topTarget) {
      const channelName = params.topTarget.style?.text
      if (channelName) {
        // Y轴标签，在框左侧&&右靠齐
        if (params.offsetX < CHART_OPTION.grid.left && channelName.includes('MEG') || channelName.includes('EOG') || channelName.includes('ECG') || channelName.includes('GFP')) {
          // console.log('Y轴标签 :>> ',channelName);
          // 先判断是否已经存在
          const seriesIndex = seriesList.findIndex((item: any) => item.channelName === channelName)
          seriesList[seriesIndex].itemStyle.color = seriesList[seriesIndex].itemStyle.color === RED_COLOR ? setChannelColor(channelName) : RED_COLOR // 改变通道颜色
          myChart.setOption({
            series: seriesList
          })
          // 获取红色通道列表，获取图表信息
          getRedChannelList()
        }
        // X轴标签， （也会点到顶部的红色时刻点，所以要去掉），不在顶部&&是数字&&不是红色
        else if (params.offsetY > CHART_OPTION.grid.top && !isNaN(parseFloat(channelName)) && params.topTarget.style?.fill !== '#a00') {
          // console.log('X轴标签 :>> ',channelName);
          readyToDrawRedMarkLineByTime(Number(channelName), params.event.metaKey || params.event.ctrlKey)
          setTimeout(() => {
            clearBrush()
          })
        }
      } else {
        // console.log('点击了内部空白处');
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
      // console.log('点击了外部空白处');
    }
  })
}


// 点击事件
function onClickOld() {
  myChart.getZr().on('click', (params: any) => {
    // console.log('params :>> ', params);
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
        // 获取红色通道列表，获取图表信息
        getRedChannelList()

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
  if (isMore.value) {
    changeChartInfo()
  }
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

      // 获取红色通道列表，获取图表信息
      getRedChannelList()

      curTime.value = null
      drawRedMarkLine()
    }
  })
}

const modalTop = ref<number>(0)           // 右键弹窗的位置top
const modalLeft = ref<number>(0)          // 右键弹窗的位置left
const showMenuModal = ref<boolean>(false) // 显示右键弹窗

const modal_width = 140         // 右键弹窗的宽度 + 15是标记通道数字的宽度
let modal_height = 184          // 右键弹窗的高度，包含按钮

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
      modalTop.value = params.event.clientY - modal_height // 选框没有查看拓扑图按钮和溯源定位，所以再-2个按钮高度
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
    } else if (!isMore.value) {
      // 如果是单选，就打开
      openMenuModal()
    } else if (isMore.value && redChannelList.value.length) {
      // 新：现在多选状态下，并且有红色通道标记，也可以去标记/取消坏通道了
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

  // 右键弹窗高度有6-1种情况
  if (!isMore.value) {
    if (curBadList.length && curGoodList.length) {
      modal_height = 184
    } else if (!curBadList.length && !curGoodList.length) {
      modal_height = 92
    } else {
      modal_height = 138
    }
  } else {
    if (curBadList.length && curGoodList.length) {
      modal_height = 138
    } else if (!curBadList.length && !curGoodList.length) {
      modal_height = 0 // 这种情况其实不会出现，因为都为0时不弹窗
    } else {
      modal_height = 92
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

// 添加标注点成功后刷新标注点
const emit = defineEmits(['successClickType', 'setRedLineValue', 'setStartTime', 'turnToGoodOrBadChannel', 'clickAllSpikeList'])

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
      return {
        data: [],
      }
    }
    const { startTime, duration } = props
    const endTime = startTime + duration
    // console.log('startTime :>> ', startTime, curTime.value);
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
  // console.log('drawRedMarkLine :>> ', myChart.getOption());
  // console.log('isChartInited :>> ', isChartInited);
  if (isChartInited) {
    // 不加nextTick会导致drawMarkArea()里的props.startTime还是上一个数据
    nextTick(() => {
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

      // emit('setRedLineValue', curTime.value)

      // 如果画上了竖线
      if (curTime.value) {
        emit('setRedLineValue', curTime.value)
        updateLayoutModal() // 画竖线时，如果打开了通道布局窗口，就更新
        // 竖线的改变 同步2d拓扑图的改变，不过现在已经没有2d拓扑图了
        // if (graphModalRef.value.visible) {
        //   clickGraph()
        // }
      } else if (isMore.value) {
        updateLayoutModal()
      }
    })

  }
}

// 设置红色竖线
function setRedMarkLine(time: number) {
  // console.log('setRedMarkLine', time, xData, props.startTime)
  curTime.value = time
  drawRedMarkLine()
  setTimeout(() => {
    clearBrush()
  })
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


// // 点击类型
// async function clickType(item: any) {
//   const params: any = {
//     spikeType: item.value,             // 棘波类型
//     startTime: String(curTime.value),  // 棘波开始时间, 以字符串形式传递
//     filePath: props.filePath,          // 文件路径
//     brainArea: props.brainRegion,      // 脑区
//     channels: props.chNames.join(','), // 当前展示的是哪些通道的脑磁图，以逗号隔开。如果同时存在脑区和通道的话，以通道为准
//     subjectId: props.subjectId,
//   }
//   // 如果是选时间段
//   if (isMore.value) {
//     params.startTime = String(curStartTime.value)
//     params.endTime = String(curEndTime.value) //棘波结束时间。当选择一个时间段的时候，才会有endTime。 以字符串形式传递
//   }
//   const { code, msg } = await addOrUpdateManualSpikeApi(params)
//   if (code === 200) {
//     message.success(msg)
//     showMenuModal.value = false
//     // 添加标注点成功后刷新标注点
//     emit('successClickType')
//   }
// }


const colorObj: any = {
  '0': ['#f5222d', '#a8071a'], // 算法标注点是0
}
spikeTypeList.forEach(item => {
  colorObj[item.value] = [item.color[0], item.color[1]]
})

// 画标注点
// BUG（已解决）：时长减少，再点击前进，和之前有重叠的时间段的标注点还保留着
// 解决方案：先拿到oldSeries赋值，之后新的spikePoint的id换个名称：id: 'spikePoint' + new Date().getTime()
// 现在是使用markLine画标注点，可以悬浮在图表上，markPoint做不到
function drawSpikePointList(records: any[]) {

  const oldSeries = myChart.getOption().series.filter((item: any) => item && item.name !== 'spikePoint') // 当series数量减少时会出现series某值为null的情况
  myChart.setOption({
    series: oldSeries,
  }, { replaceMerge: ['series'] }) // 先删除掉series，再赋值

  // 如果没有标注点，就不画。这个判断必须在下面，否则从左侧一个有标记点的数据切换到一个没有标记点的数据时，点会保留，没清空。
  if (!records.length) {
    return false
  }

  const spikePointList: any[] = []
  records.forEach((item: { startTime: string; spikeType: number }) => {
    const spikePoint = {
      xAxis: String(parseFloat(item.startTime)), // 对于x轴中的一个值, startTime: string，例：将字符串'1.1000'变成字符串'1.1'
      lineStyle: {
        color: colorObj[item.spikeType][0],
      }
    }
    spikePointList.push(spikePoint)
  })
  const spikePointListOption = {
    name: 'spikePoint',
    id: 'spikePoint' + new Date().getTime(), // 这里id要更换
    type: 'line', // 如果将 markLine 单独写在一个对象里，就必须加 type ，不然报错。
    markLine: {
      symbol: ['none', 'circle'], // 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
      symbolSize: 6,
      lineStyle: {
        width: 0, // 不显示线
      },
      silent: true,  // true 不响应鼠标事件
      label: {
        show: false, // 是否展示文字
      },
      data: spikePointList,
    }
  }
  myChart.setOption({
    series: [spikePointListOption]
  })
}



// // 拓扑图窗口可拖动；拓扑图窗口，现在由通道布局窗口代替
// const graphModalRef = ref(null)
// // 点击查看拓扑图
// async function clickGraph() {
//   showMenuModal.value = false
//   const params = {
//     curTime: curTime.value,   // 棘波时间
//     filePath: props.filePath, // 文件路径
//     subjectId: props.subjectId,
//   }
//   graphModalRef.value.showModal(params)
// }


// // // 获取坏通道列表
// async function getBadChannel() {
//   //   const params = {
//   //     fifFilePath: props.filePath, // 文件路径
//   //     subjectId: props.subjectId,
//   //   }
//   //   const { code, data } = await getBadChannelApi(params)
//   //   if (code === 200) {
//   //     // console.log('== :>> ', arraysAreEqual(badChannelList.value, data || []))
//   //     // 如果新数组和旧数组不相等，才执行赋值和画线操作
//   //     if (!arraysAreEqual(badChannelList.value, data)) {
//   //       badChannelList.value = data || []
//   //       drawBadChannel()
//   //     }
//   //   }
// }

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

function clickAllSpikeList(item: any) {
  emit('clickAllSpikeList', item)
}



// 通道布局窗口
const layoutModalRef = ref(null)
// 右键点击打开通道布局按钮
async function openLayoutModal() {
  showMenuModal.value = false
  let data = null
  if (curTime.value) {
    // emit('openLayoutModal', String(curTime.value))
    data = String(curTime.value)
  } else if (isMore.value) {
    // emit('updateLayoutModal', [curStartTime.value, curEndTime.value, durationTime.value])
    data = {
      startTime: curStartTime.value,
      endTime: curEndTime.value,
      durationTime: durationTime.value,
    }
  }
  const formParams = props.getFormParams()

  layoutModalRef.value.showModal({
    zIndexValue: 111,
    coregId: props.coregId,
    curTime: data,
    formParams,
  })

}


// 画竖线时，如果打开了通道布局窗口，就更新
async function updateLayoutModal() {
  showMenuModal.value = false
  let data = null
  if (curTime.value) {
    data = String(curTime.value)
  } else if (isMore.value) {
    data = {
      startTime: curStartTime.value,
      endTime: curEndTime.value,
      durationTime: durationTime.value,
    }
  }
  // 当默认布局出来后，点击患者数据列表，curTime 是 null，传过来之前被String(curTime) 变成了 'null'
  if (layoutModalRef.value.visible && data && data !== 'null') {
    const formParams = props.getFormParams()
    layoutModalRef.value.showModal({
      zIndexValue: 111,
      coregId: props.coregId,
      curTime: data,
      formParams,
      isUpdate: true,
    })
  }

}
// 改变了幅度值的竖线，就要改变大波形图的竖线和标记线的值
// 设置标记线的值,让其他卡片和蝴蝶图也设置成这个值
function setRedLineValueFromLineModal(value: number) {
  curTime.value = value
  emit('setRedLineValue', value)
  // console.log('isChartInited :>> ', myChart.getOption(), isChartInited);
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
  }
  setTimeout(() => {
    clearBrush()
  })
}


</script>

<style lang="less" scoped>
@import './style/line.less';
</style>