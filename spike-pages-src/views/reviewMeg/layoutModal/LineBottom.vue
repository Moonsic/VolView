<!-- 折线图 -->
<template>
  <div ref="myEchartRef" :style="{ width: '100%', height: '100%' }"></div>

  <div class="menu-list">
    <div class="item" :class="{ 'active': item.select === true }" v-for="(item, index) in typeList" :key="index"
      @click="clickMenu(item)">{{ item.label }}</div>
  </div>

  <a-modal v-model:open="showMenuModal"
    :style="{ width: '100px', top: modalTop + 'px', left: modalLeft + 'px', margin: '0' }" :title="null" :footer="null"
    :closable="false" :maskStyle="{
      backgroundColor: 'rgba(0, 0, 0, 0.2)'
    }" :bodyStyle="{
      padding: '0px',
    }">
    <div class="context-menu">
      <div class="title pl8"> {{ curTime }}</div>
      <div class="menu-button" @click="clickLocation">{{ t('溯源定位') }}</div>
    </div>
  </a-modal>


</template>

<script lang="ts" setup>
import { init } from 'echarts'
import { allThemeList } from '../config' // 暗色主题
import { useThemeStore } from '@/store/theme'
import { storeToRefs } from 'pinia'

const { t } = useI18n()

// 取消默认的浏览器自带右键
window.oncontextmenu = (e) => {
  e.preventDefault()
}

const props = defineProps({
  mode: {
    type: String,
    default: 'more',
  },
  autoSl: {
    type: Number,
    default: 0,
  },
})

// 暴露方法
defineExpose({
  setChartData,
  setResize,
  setChartTheme,
  setGreenChannel
})

function setResize(obj: any) {
  myChart.resize(obj)
}

// const chartHeight = ref<number>(160) // 高，这里减的数字是浏览器顶部到图表的距离

let myChart: any = null
const myEchartRef: Ref<HTMLElement | null> = ref(null)


onMounted(() => {
  myChart = init(myEchartRef.value as HTMLElement)
})

onUnmounted(() => {
  window.onresize = null
  myChart.clear()
  myChart.dispose()
  myChart = null
  curTime.value = null
  isChartInited = false
})

const themeStore = useThemeStore()
const { chartTheme } = storeToRefs(themeStore)
let useTheme = allThemeList[chartTheme.value]


function setChartTheme(value: string) {

  useTheme = allThemeList[value]

  CHART_OPTION.backgroundColor = useTheme['backgroundColor']
  CHART_OPTION.xAxis[0].axisLabel.color = useTheme['xAxis.axisLabel.color']
  CHART_OPTION.xAxis[0].axisLine.lineStyle.color = useTheme['xAxis.splitLine.lineStyle.color']

  CHART_OPTION.xAxis[0].splitLine.lineStyle.color = useTheme['xAxis.splitLine.lineStyle.color']
  CHART_OPTION.xAxis[0].axisPointer.lineStyle.color = useTheme['red-mark-line']

  CHART_OPTION.yAxis[0].axisLabel.color = useTheme['yAxis.axisLabel.color']
  CHART_OPTION.yAxis[0].axisLine.lineStyle.color = useTheme['yAxis.axisLine.lineStyle.color']
  CHART_OPTION.yAxis[0].splitLine.lineStyle.color = useTheme['yAxis.splitLine.lineStyle.color']

  myChart.setOption(CHART_OPTION)

  setSeriesList()
  realSetData()
}


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
    left: 40,
    right: 38,
    bottom: 30,
    top: 22,
    containLabel: false        // 不自适应。左侧Y轴数据量大时，自适应会失效，有bug，所以直接left写死，不自适应
  },
  dataZoom: [
    {
      id: 'yInside',
      type: 'inside',       // Y轴可鼠标滑动缩放
      yAxisIndex: [0],
      filterMode: 'none',   // 不过滤数据，只改变数轴范围
    }
  ],
  xAxis: [{
    type: 'category',
    boundaryGap: false, // 坐标轴两边留白策略，默认为true
    axisLabel: {
      // interval: 50 - 1, // 坐标轴刻度标签的显示间隔，在类目轴中有效，默认是'auto', 0: 强制显示所有标签。这个现在根据xData长度计算
      hideOverlap: true, // 隐藏重叠的标签
      color: useTheme['xAxis.axisLabel.color'],    // x轴刻度标签
    },
    axisLine: {
      show: true,       // 是否显示坐标轴轴线
      lineStyle: {
        color: useTheme['xAxis.splitLine.lineStyle.color'],  // x轴分隔线颜色
      }
    },
    splitLine: {
      show: true,         // 坐标轴在 grid 区域中的分隔线
      // interval: 50 - 1, // 坐标轴分隔线的显示间隔, 默认同axisLabel.interval一样。
      lineStyle: {
        color: useTheme['xAxis.splitLine.lineStyle.color'],  // x轴分隔线颜色
        width: 1,       // 分隔线线宽
        type: 'dashed', // 线的类型
      }
    },
    axisTick: {
      show: false,    // 是否显示坐标轴刻度
    },
    axisPointer: {
      show: true,    // 大数据时太卡了
      type: 'line',  // 竖线
      snap: true,    // 坐标轴指示器是否自动吸附到点上
      lineStyle: {
        type: 'dashed',
        color: useTheme['red-mark-line'], // 竖线颜色
      },
      label: {
        backgroundColor: '#333'
      },
    },
    data: []
  }],
  yAxis: [{
    type: 'value',
    axisLabel: {
      show: true,         // 显示刻度标签
      fontSize: 10,       // 字体大小
      fontWeight: 'bold', // 刻度标签文字的字体加粗
      color: useTheme['yAxis.axisLabel.color'],      // 刻度标签文字的颜色
      margin: 5           // 刻度标签与轴线之间的距离
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

// const obj = {
//   'meg1': [1,4,6,7,8,9,3],
//   'meg2': [4,6,9,5,2,2,5],
//   'meg3': [4,5,3,3,5,7,8],
// }



let seriesList: any[] = []                   // series数据
let chMegData: { [key: string]: number[] } = null   // res.chMegData {通道名称1:[数据],通道名称2:[数据]}
let xData: number[] = []                     // x轴数据 [17, 17.001, 17.002, 17.003]
let yData: string[] = []                     // 通道名称列表, 也是y轴数据 ['MEG0113', 'EOG061', 'ECG062', 'GFP']
let resChMegData: { [key: string]: number[] } = null   // res.chMegData {通道名称1:[数据],通道名称2:[数据]}


const curType = ref('average')
const typeList = ref([
  { label: 'GFP', value: 'average', select: true },
  { label: t('所有'), value: 'all', select: false },
])


function clickMenu(item: any) {
  item.select = !item.select

  if (!typeList.value[0].select && !typeList.value[1].select) {
    if (item.value === 'average') {
      typeList.value[1].select = true
    } else {
      typeList.value[0].select = true
    }
  }
  setCurType()
}

function setCurType() {
  if (typeList.value[0].select && !typeList.value[1].select) {
    curType.value = 'average'
    chMegData = {
      'average': calculateGFPValues(resChMegData)
    }
    yData = [
      'average'
    ]

    if (greenChannel.value) {
      chMegData = {
        ...chMegData,
        [greenChannel.value]: resChMegData[greenChannel.value],
      }
      yData = [
        ...yData,
        greenChannel.value,
      ]
    }

  }
  if (!typeList.value[0].select && typeList.value[1].select) {
    curType.value = 'all'
    chMegData = {
      ...resChMegData,
    }
    yData = [
      ...Object.keys(resChMegData),
    ]
  }
  if (typeList.value[0].select && typeList.value[1].select) {
    curType.value = 'average+all'
    chMegData = {
      ...resChMegData,
      'average': calculateGFPValues(resChMegData)
    }
    yData = [
      ...Object.keys(resChMegData),
      'average'
    ]
  }
  setSeriesList()
  realSetData()
}


// 点击查询、修改脑区、前进后退会走到这 res：图表数据
function setChartData(res: any, time: number) {
  if (!res) {
    return
  }
  xData = res.timePoints // 想用 xData = getXData(35, 40)这个方法，但感觉对速度的影响并不大，因为通道就有很多条。方法在utils里
  resChMegData = { ...res.chMegData }
  // 如果要画线就画线
  if (time) {
    curTime.value = time
  }
  setCurType()
}

// 计算GFP值时，需要过滤掉坏通道，坏通道值为undefined。
// 计算GFP值 : 开根号((a方+b方+c方+...)/数量)    Math.sqrt((a+b2)/2)
function calculateGFPValues(inputObj: { [key: string]: number[] | undefined }): number[] {
  // console.log('inputObj :>> ', inputObj);
  // ⭐ 第一步：过滤掉无效数据
  const validEntries = Object.entries(inputObj).filter(
    ([, value]) => Array.isArray(value)
  ) as [string, number[]][]
  // 如果全是 undefined，直接返回空
  if (validEntries.length === 0) return []
  // ⭐ 第二步：用第一个有效数组作为基准长度
  const firstArray = validEntries[0][1]
  const result: number[] = []
  for (let i = 0; i < firstArray.length; i++) {
    let sum = 0
    let count = 0
    for (const [, arr] of validEntries) {
      // 防御：防止数组长度不一致
      if (arr[i] != null) {
        sum += arr[i] ** 2
        count++
      }
    }
    result.push(count > 0 ? Math.sqrt(sum / count) : 0)
  }
  return result
}
// // 计算平均值
// function calculateAverageValues(inputObj: { [key: string]: number[] }): number[] {
//   // 获取对象中的第一个数组以决定新数组的长度
//   const firstArray = inputObj[Object.keys(inputObj)[0]]
//   const averageValues: number[] = []

//   // 遍历第一个数组的每个索引
//   for (let i = 0; i < firstArray.length; i++) {
//     let sum = 0
//     // 遍历对象中的所有数组，对每个索引位置的元素求和
//     for (const key in inputObj) {
//       if (inputObj.hasOwnProperty(key)) {
//         sum += inputObj[key][i]
//       }
//     }
//     // 计算平均值并添加到结果数组中
//     averageValues.push(sum / Object.keys(inputObj).length)
//   }

//   return averageValues
// }
const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary');

const BLUE_COLOR = primaryColor // 默认的一个蓝色线
// const GREEN_COLOR = 'green' // 默认的一个蓝色线
const GREEN_COLOR = '#00aa00' // 默认的一个蓝色线

// 设置折线数据
function setSeriesList() {
  // 先清空seriesList
  seriesList = []
  yData.map((item: any, index: number) => {
    let seriesData = chMegData[item]
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
        // color: item === 'average' && curType.value === 'average+all' ? 'rgba(255,0,0,.2)' : BLUE_COLOR, // 如果是平均值，要保持红色
        color: item === 'average' ? 'red' : item === greenChannel.value ? GREEN_COLOR : BLUE_COLOR, // 如果是平均值，要保持红色
      },
      lineStyle: {
        width: 1,
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
    drawRedMarkLine()
  } else {
    //  如果第一次画图，先把基础配置一下
    myChart.setOption(CHART_OPTION)
    setNewOption()
    firstDrawRedMarkLine() // 第一次画红色竖线

    myChart.getZr().off('click')
    onClick()       // 点击事件
    onContextmenu() // 右键事件
    isChartInited = true // 初始化图表
  }
}

// 设置新的选项，X轴，Y轴和seriesList
function setNewOption() {
  // 计算间隔，永远只分成4份，x轴只有5个标签
  const interval = Math.floor(xData.length / 4)
  myChart.setOption({
    xAxis: [{
      data: xData,
      axisLabel: {
        interval: (index: number) => {
          return index % interval === 0 || index === xData.length - 1
        }
      }
    }],
    series: seriesList
  }, { replaceMerge: ['series'] }) // 先删除掉series，再赋值
}

// 点击事件
function onClick() {
  myChart.getZr().on('click', (params: any) => {
    // 点在了线上,准备画竖线
    // 点击了空白处,准备画竖线
    readyToDrawRedMarkLine([params.offsetX, params.offsetY])
  })
}

const curTime = ref<number>(null)   // 当前点击后的时间


// 准备画竖线
function readyToDrawRedMarkLine(pointInPixel: number[]) {
  if (myChart.containPixel('grid', pointInPixel)) {
    const xIndex = myChart.convertFromPixel({ seriesIndex: 0 }, pointInPixel)[0]
    // 获取到了点击时的X轴数据
    const time = xData[xIndex]
    // 点击了本身
    if (curTime.value === time) {
      curTime.value = null
    } else {
      // 没点击本身
      curTime.value = time
    }
    drawRedMarkLine()
    // 自动溯源 只能放在这里，因为只有手动点击画竖线时才触发，
    // 如果写在drawRedMarkLine()里，那么在画meg窗口的竖线时，drawRedMarkLine()也会被触发，导致溯源2次。
    // 如果开启了自动溯源，画竖线的时候就自动溯源
    if (curTime.value && props.autoSl) {
      clickLocation()
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
        xAxis: String(curTime.value) // 对于x轴中的一个值
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

// 画红色竖线
function drawRedMarkLine() {
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
  }
}



const modalTop = ref<number>(0)           // 右键弹窗的位置top
const modalLeft = ref<number>(0)          // 右键弹窗的位置left
const showMenuModal = ref<boolean>(false) // 显示右键弹窗

const modal_width = 100           // 右键弹窗的宽度
const modal_height = 60          // 右键弹窗的高度 = title30 + 1个按钮*(26+2)

// 右键事件
function onContextmenu() {
  // 单模式不显示右键弹窗，因为单模式没法溯源定位
  if (props.mode === 'single') {
    return
  }
  myChart.getZr().on('contextmenu', (params: any) => {
    // console.log('contextmenu :>> ', params)
    params.event.preventDefault(); // 阻止默认行为
    // 获取右键弹窗的位置并显现
    modalLeft.value = params.event.clientX
    modalTop.value = params.event.clientY

    if (params.event.clientX > window.innerWidth - modal_width - 5) { // 5是一个固定值，表示不想挨着边
      modalLeft.value = params.event.clientX - modal_width // -右键弹窗的宽度
    }
    if (params.event.clientY > window.innerHeight - modal_height) {
      modalTop.value = params.event.clientY - modal_height // 选框没有查看拓扑图按钮，所以再-30
    }
    showMenuModal.value = true

    // 如果没有多选并且没有先画红竖线，就右键的时候同时画
    if (!curTime.value) {
      const pointInPixel = [params.offsetX, params.offsetY]
      if (myChart.containPixel('grid', pointInPixel)) {
        const xIndex = myChart.convertFromPixel({ seriesIndex: 0 }, pointInPixel)[0]
        // 获取到了点击时的X轴数据
        curTime.value = xData[xIndex]
        drawRedMarkLine()
      } else {
        // 来到这里，说明右键点在了grid范围外，不弹窗不画线
        showMenuModal.value = false
      }
    }

  })
}

const emit = defineEmits(['openViewModal', 'setRedLineValue'])


// 右键点击溯源定位按钮，新加上选中的通道集合
async function clickLocation() {
  const channels = Object.keys(resChMegData)
  showMenuModal.value = false
  emit('openViewModal', String(curTime.value), channels.length === 306 ? [] : channels) // 全部的话就直接给空数组就行了
}


const greenChannel = ref<string>('')
// 每次setGreenChannel都必须在setRedChannelList之前调用
function setGreenChannel(megName: string) {
  greenChannel.value = megName
  //  console.log('greenChannel.value :>> ', greenChannel.value);

  // //  && curType.value!=== 'average'
  // if (megName) {
  //   chMegData = {
  //     ...chMegData,
  //     [megName]: resChMegData[megName],
  //   }
  //   yData = [
  //     ...yData,
  //     megName,
  //   ]
  // }
  // console.log('chMegData :>> ', chMegData);
  // console.log('yData :>> ', yData);
  // setSeriesList()
  // realSetData()
}
</script>

<style lang="less" scoped>
@import '../style/line.less';

.menu-list {
  position: absolute;
  top: 21px;
  right: 8px;
  font-size: 12px;

  >.item {
    padding: 5px 2px 5px 1px;
    font-size: 12px;
    text-align: center;
    cursor: pointer;
    writing-mode: vertical-rl;
    border-radius: 2px;
    color: var(--black-t2);
    background: var(--white-bg);
    border: 1px solid #ddd;
    line-height: 1.4;

    &:first-child {
      margin-bottom: 4px;
    }

    &.active {
      color: #fff !important;
      background: var(--color-primary) !important;
      border: 1px solid var(--color-primary) !important;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02) !important;
    }
  }
}

.chart-dark {
  .menu-list {
    >.item {
      color: var(--white-t2);
      border: 1px solid var(--white-t6);
      background: var(--black-bg);
    }
  }
}

.chart-eyecare {
  .menu-list {
    >.item {
      color: var(--eyecare-t2);
      border: 1px solid var(--eyecare-t6);
      background: var(--eyecare-bg);
    }
  }
}
</style>