<template>
  <div ref="container" class="container" :style="{ width: '100%', height: '100%' }" @mousedown="startSelection"
    @mousemove="handleMouseMove" @mouseup="endSelection">
    <div v-for="(item) in lineDataList" :key="item.megName" class="chart-item" :style="{
      width: chartWidth + 'px',
      height: chartHeight + 'px',
      left: (item.x * xVar + 278) * containerWidth / 750 * 1.3 + 'px',
      top: (-item.y * yVar + yMarginTop) * containerHeight / 500 * 1.5 + 'px',
      backgroundColor: item.selected && isDragging ? 'rgba(255, 44, 59, 0.20)' : 'transparent',
      transform: `translateY(${translateY}px)`
    }">

      <!-- 0{{ index+1 }} -->
      <div :ref="(instance) => { lineDataRefs[item.megName] = instance }"
        :style="{ width: chartWidth + 'px', height: chartHeight + 'px' }"></div>
    </div>

    <div v-if="isDragging" class="selection-box" :style="getSelectionBoxStyle()"></div>
  </div>

  <div class="top-right">

    <!-- <span>{{ containerWidth.toFixed(2) }}</span>--
    <span>{{ containerHeight.toFixed(2) }}</span>--
    <span>{{ chartWidth.toFixed(2) }}</span>--
    <span>{{ chartHeight.toFixed(2) }}</span>--
    <span>{{ translateY.toFixed(2) }}</span> -->

    <!-- 开关控制竖线 -->
    <div class="button-box">
      <span class="text-10 button-box-text mr2">{{ t('辅助线') }}: </span>
      <a-switch class="switch-checked scale08" v-model:checked="showRedMarkLine" size="small" @change="onSwitchRedMarkLine" />
    </div>

    <div class="button-box">
      <IconReverseSelect class="zoom-icon" title="反选" @click="reverseSelect" />
    </div>

    <div class="button-box">
      <ZoomInOutlined v-if="redChannelList.length" class="zoom-icon" :title="t('放大查看')" @click="zoomOutView" />
      <ZoomInOutlined v-else class="zoom-icon zoom-icon-disabled" :title="t('放大查看')" />
    </div>

    <div class="button-box">
      <!-- 比例尺放大缩小 -->
      <div class="ratio-icon">
        <MinusCircleOutlined class="mr4" :title="t('幅度缩小')" @click="zoomOut" />
        <PlusCircleOutlined :title="t('幅度放大')" @click="zoomIn" />
      </div>
    </div>

    <div class="button-box">

      <!-- 下拉框选择脑区 -->
      <a-select class="select-list mr4" v-model:value="brainRegion" :defaultOpen="false" :options="brainRegionList"
        size="small" :showArrow="true" :allowClear="false" :placeholder="t('脑区')"
        :getPopupContainer="(triggerNode: any) => triggerNode.parentNode" @change="changeBrainRegion" @mousedown.stop
        @click.stop />
      <IconDelete class="icon-delete" :title="t('清空')" @click="clearAll" />
    </div>

  </div>

  <div class="zoom-box" ref="zoomBox" v-show="showZoomBox">
    <CloseOutlined class="zoom-close" @click="closeZoomBox" />
    <div class="zoom-viewport">
      <div v-for="item in zoomLayoutData" :key="item.megName + '_zoom'" class="zoom-item" :style="{
        width: zoomItemWidth + 'px',
        height: zoomItemHeight + 'px',
        left: item.x + 'px',
        top: item.y + 'px',
      }" :title="item.megName">
        <div :ref="el => selectedLineDataRefs[item.megName + '_zoom'] = el" :style="{
          width: zoomItemWidth + 'px',
          height: zoomItemHeight + 'px',
        }" class="zoom-content"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { init, getInstanceByDom } from 'echarts'
import { brainRegionList } from '@u/data' // 脑区列表

import { useThemeStore } from '@/store/theme'
import { storeToRefs } from 'pinia'
import { allThemeList } from '../config' // 暗色主题

import { useOpmStore } from '@/store/opm'
const opmStore = useOpmStore()

const { t } = useI18n()

const props = defineProps({
  curTime: {
    type: String,
    default: '',
  },
  fifFilePath: {
    type: String,
    default: '',
  },
  containerWidth: {
    type: Number,
    default: 0,
  },
  containerHeight: {
    type: Number,
    default: 0,
  },
  curSpikeSlChannels: {
    type: Array as PropType<any[]>,
    default: [],
  },
  megType: {
    type: String,
    default: 'megin',
  },
})



const allChannelListByName = computed(() => opmStore.allChannelListByName)
const layoutPositionList = computed(() => opmStore.layoutPositionList)

let widthConst = 15 // 15/27 宽度固定值
let xVar = 3.2 // 一些控制位置的变量
let yVar = 2.0
let yMarginTop = 155 // 控制上下的变量

watch(() => props.megType, () => {
  nextTick(() => {
    lineDataList.value = []
    lineDataRefs.value = {}

    if (props.megType === 'megin') {
      xVar = 3.2
      yVar = 2.0
      yMarginTop = 155
      widthConst = 15
      // chartWidth.value = 15
      // chartHeight.value = 10
    } else if (props.megType === 'opm64') {
      // 华西的opm: 无规律的名称
      xVar = 290
      yVar = 140
      yMarginTop = 160
      widthConst = 27
      // chartWidth.value = 27 //3*7
      // chartHeight.value = 18 //2*7
    } else if (props.megType === 'opm64_meg_prefix') {
      // 普通opm: MEG开头的，如MEG001
      xVar = 150
      yVar = 90
      yMarginTop = 180
      widthConst = 27
      // chartWidth.value = 27 //3*7
      // chartHeight.value = 18 //2*7
    } else if (props.megType === 'opm96') {
      // 三博的opm: 无规律的名称
      xVar = 140
      yVar = 95
      yMarginTop = 150
      widthConst = 27
    }

    // 宽度也是算出来的，不是固定的值
    chartWidth.value = Math.round(widthConst / (750 * 0.61) * props.containerWidth)
    // console.log('chartWidth.value', chartWidth.value)

    // 比例尺，其实就是图表的高度
    const local_lineListChartHeight = localStorage.getItem('lineListChartHeight')
    chartHeight.value = local_lineListChartHeight ? Number(local_lineListChartHeight) : 16 // 基础值从10改成16

    setPosition()
  })
}, { immediate: true })

const container = ref(null)
const isSelecting = ref(false)
const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)
const endX = ref(0)
const endY = ref(0)
let rafId: number | null = null

function startSelection(event: MouseEvent) {
  if (!container.value) return
  const rect = container.value.getBoundingClientRect()
  startX.value = event.clientX - rect.left
  startY.value = event.clientY - rect.top
  endX.value = startX.value
  endY.value = startY.value
  isSelecting.value = true
  isDragging.value = false // 初始状态下不认为是在拖动
  // console.log('startSelection :>> ');
}

function selecting(event: MouseEvent) {
  // console.log('selecting :>> ');

  if (!container.value || !isSelecting.value) return

  const rect = container.value.getBoundingClientRect()
  endX.value = event.clientX - rect.left
  endY.value = event.clientY - rect.top

  const selectionRect = getBoundingClientRect(startX.value, startY.value, endX.value, endY.value)

  lineDataList.value.forEach((item) => {
    const xValue = (item.x * xVar + 278) * props.containerWidth / 750 * 1.3
    const yValue = (-item.y * yVar + yMarginTop) * props.containerHeight / 500 * 1.5

    const blockRect = getBoundingClientRect(
      xValue,
      yValue + translateY.value,
      xValue + chartWidth.value,
      yValue + chartHeight.value + translateY.value,
    )
    // const blockRect = getBoundingClientRect(
    //   (item.x * 2.6 + 225) *  chartWidth.value * 0.065 ,
    //   (-item.y * 2.1 + 155) *  chartHeight.value * 0.13,
    //   (item.x * 2.6 + 225) *  chartWidth.value * 0.065   + chartWidth.value,
    //   (-item.y * 2.1 + 155) *  chartHeight.value * 0.13  + chartHeight.value,
    // )
    item.selected = intersects(selectionRect, blockRect)
  })

  isDragging.value = true // 开始拖动后设置为true
  brainRegion.value = null
}
function handleMouseMove(event: MouseEvent) {
  if (!isSelecting.value) return

  if (rafId !== null) {
    cancelAnimationFrame(rafId)
  }

  rafId = requestAnimationFrame(() => {
    selecting(event)
  })
}


function endSelection() {
  // console.log('endSelection :>> ');

  isSelecting.value = false
  if (!isDragging.value) return

  isDragging.value = false // 结束选择后重置拖动状态
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }

  redChannelList.value = [] // 要先清空
  lineDataList.value.forEach((item) => {
    const itemRef = lineDataRefs.value[item.megName]
    if (itemRef) {
      let chartInstance = getInstanceByDom(itemRef)
      if (chartInstance) {
        chartInstance.setOption({
          series: [{
            itemStyle: {
              color: item.selected ? RED_COLOR : BLUE_COLOR  // 改变通道颜色
            },
          }]
        })
      }
    }

    // 包含删掉，不包含加入
    if (item.selected) {
      redChannelList.value.push(item.megName)
    } else {
      redChannelList.value = redChannelList.value.filter(f => f !== item.megName)
    }
  })
  greenChannel.value = ''
  emit('setGreenChannel', '') // 每次setGreenChannel都必须在setRedChannelList之前调用
  emit('setRedChannelList', redChannelList.value)

}

function getSelectionBoxStyle() {
  const rect = getBoundingClientRect(startX.value, startY.value, endX.value, endY.value)
  return {
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
  }
}

function getBoundingClientRect(x1: number, y1: number, x2: number, y2: number) {
  const minX = Math.min(x1, x2)
  const minY = Math.min(y1, y2)
  const maxX = Math.max(x1, x2)
  const maxY = Math.max(y1, y2)
  return {
    left: minX,
    top: minY,
    width: maxX - minX,
    height: maxY - minY,
  }
}

function intersects(rect1: any, rect2: any) {
  return (
    rect1.left <= rect2.left + rect2.width &&
    rect1.left + rect1.width >= rect2.left &&
    rect1.top <= rect2.top + rect2.height &&
    rect1.top + rect1.height >= rect2.top
  )
}

// 清空所有
function clearAll() {
  brainRegion.value = null
  changeBrainRegion()
}

const emit = defineEmits(['setRedChannelList', 'setGreenChannel'])

const chartWidth = ref<number>(15) // 宽
const chartHeight = ref<number>(10) // 高


// 不使用缩放，会模糊transform: `scale(${scaleRatio})`，但循环设置chartInstance.resize()挺卡顿的，所以只在结束拖拽后触发一次就不卡顿了
// const scaleRatio = ref<number>(1)

// 创建一个 ref 数组来存储 LineModal 实例
const lineDataList = ref([])
const lineDataRefs: any = ref({}) // 对象的方式

const leftPer = ref(0.61)
// 缩放弹窗
function setResize(res?: { width: number, height: number, leftPer: number }) {

  if (res && res.width && res.height) {
    chartWidth.value = Math.round(widthConst / (750 * 0.61) * props.containerWidth)
    leftPer.value = res.leftPer
  }

  Object.keys(lineDataRefs.value).forEach((megName) => {
    const itemRef = lineDataRefs.value[megName]
    if (itemRef) {
      // 获取当前实例（如果存在）
      let chartInstance = getInstanceByDom(itemRef)
      // 如果存在实例，则先销毁
      if (chartInstance) {
        chartInstance.resize({
          width: chartWidth.value,
          height: chartHeight.value,
        })
      }

    }
  })
}

// 暴露方法
defineExpose({
  setResize,
  setData,
  setRedLineValue,
  setChartTheme
})

onMounted(() => {
  // 有watch props.megType所以这里不需要setPosition()了
  // 位置信息在config.ts里，直接拿，不再调接口获取
  // setPosition()
})

onUnmounted(() => {
  Object.keys(lineDataRefs.value).forEach((megName) => {
    if (lineDataRefs.value[megName]) {
      let chartInstance = init(lineDataRefs.value[megName])
      chartInstance.clear()
      chartInstance.dispose()
      chartInstance = null
    }
  })
})

 // 是否展示辅助线
const showRedMarkLine = ref(true)

const local_lineListShowRedMarkLine = localStorage.getItem('lineListShowRedMarkLine')
showRedMarkLine.value = local_lineListShowRedMarkLine !== 'false'

// 切换后
function onSwitchRedMarkLine() {
  localStorage.setItem('lineListShowRedMarkLine', String(showRedMarkLine.value))
  setData(allData, redChannelList.value)
}


// 设置位置数据
function setPosition() {
  lineDataList.value = []
  lineDataRefs.value = {}
  layoutPositionList.value.forEach((item: any) => {
    lineDataList.value.push({
      ...item, // left和top 不能写在这
      megName: item.meg_name,
      selected: false,
    })
    lineDataRefs.value[item.meg_name] = ref(null) // 对象的方式
  })
}

const themeStore = useThemeStore()
const { chartTheme } = storeToRefs(themeStore)
// 使用的主题色
let useTheme = allThemeList[chartTheme.value]

const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary')

const BLUE_COLOR = primaryColor // 默认的一个蓝色线
const RED_COLOR = 'red' // 标记的一个红色线
// const GREEN_COLOR = '#ff0001' // 标记的一个绿色线，#ff0000是红色
// const GREEN_COLOR = 'green' // 标记的一个绿色线，#ff0000是红色 #008000
const GREEN_COLOR = '#00aa00' // 标记的一个绿色线，#ff0000是红色
// const GREEN_COLOR = '#60CD2F' // 标记的一个绿色线，#ff0000是红色

let allData: any = {}
// 设置数据
function setData(data: any, curRedChannelList: string[] = []) {
  if (!data) {
    return
  }
  allData = JSON.parse(JSON.stringify(data))

  if (props.curSpikeSlChannels.length) {
    redChannelList.value = props.curSpikeSlChannels
  } else {
    redChannelList.value = curRedChannelList
  }

  emit('setRedChannelList', redChannelList.value, true)

  // console.log('props.curTime :>> ', props.curTime);
  lineDataList.value.forEach((item) => {
    const { megName } = item
    const itemRef = lineDataRefs.value[megName]
    if (itemRef) {
      // 获取当前实例（如果存在）
      let chartInstance = getInstanceByDom(itemRef)
      // 如果存在实例，则先销毁
      if (chartInstance) {
        chartInstance.clear()
        chartInstance.dispose()
      }

      // 重新初始化图表实例，并直接应用基础配置
      chartInstance = init(itemRef)
      chartInstance.setOption(CHART_OPTION)

      // // 判断是否全0
      const isAllZeros = isArrayAllZeros(data.chMegData[megName])
      // 全0时设置固定y轴范围
      if (isAllZeros) {
        chartInstance.setOption({
          yAxis: [{
            min: -1,  // 设置对称范围
            max: 1
          }],
        })
      }
      item.selected = redChannelList.value.includes(item.megName)

      chartInstance.setOption({
        xAxis: [{
          data: data.timePoints,
        }],
        series: [{
          data: data.chMegData[megName],
          itemStyle: {
            color: !redChannelList.value.includes(megName) ? BLUE_COLOR : megName === greenChannel.value ? GREEN_COLOR : RED_COLOR, // 如果换了新的time，原来选择的红色通道依然要标红
          },
          lineStyle: {
            width: isAllZeros ? 1.2 : 1 // 全0时线宽为2
          },
        },
        ...(showRedMarkLine.value ? [{
          name: 'redMarkLine',
          id: 'redMarkLine',
          type: 'line',
          markLine: {
            symbol: 'none', // 相当于['none', 'none'] [虚线，没有箭头]
            silent: true, // true 不响应鼠标事件
            animation: false, // 是否开启动画
            animationDuration: 0, // 初始动画的时长
            data: [{
              xAxis: String(props.curTime) // 对于x轴中的一个值
            }],
            lineStyle: {
              color: useTheme['lineListColor'],
              width: 0.8, // 0 的时候可以隐藏线
              type: 'solid' // 实线，不写默认虚线
            }
          },
        }] : [])
        ],
      })

      onClick(chartInstance, megName)       // 点击事件
    }
  })
}

// 点击lineBottom画竖线时，lineList也要全部重新画竖线
function setRedLineValue(value: string) {
  // console.log('value :>> ', value, props.curTime);
  // 如果没开启画竖线，就不执行
  if (!showRedMarkLine.value) {
    return
  }
  nextTick(() => {
    lineDataList.value.forEach((item) => {
      const { megName } = item
      const itemRef = lineDataRefs.value[megName]
      if (itemRef) {
        // 获取当前实例（如果存在）
        let chartInstance = getInstanceByDom(itemRef)
        if (chartInstance && chartInstance.getOption()) {
          chartInstance.setOption({
            series: [{
              id: 'redMarkLine',
              markLine: {
                data: [{
                  xAxis: String(props.curTime) // 对于x轴中的一个值
                }],
              },
            }]
          })
        }
      }
    })
    // 查看放大也要重新画竖线。  如果此时没放大，zoomLayoutData.value是空的，就不执行下面的代码
    zoomLayoutData.value.forEach((item) => {
      const itemRef = selectedLineDataRefs.value[item.megName + '_zoom']
      if (itemRef) {
        // 获取当前实例（如果存在）
        let chartInstance = getInstanceByDom(itemRef)
        if (chartInstance && chartInstance.getOption()) {
          chartInstance.setOption({
            series: [{
              id: 'redMarkLine',
              markLine: {
                data: [{
                  xAxis: String(props.curTime) // 对于x轴中的一个值
                }],
              },
            }]
          })
        }
      }
    })
  })
}

// 切换主题时，需要重新设置颜色
function setChartTheme(value: string) {
  useTheme = allThemeList[value]
  setData(allData, redChannelList.value)
  // 放大里的图表也需要重新设置主题
  if (showZoomBox.value) {
    zoomOutView()
  }
}

// 判断是否全0
function isArrayAllZeros(data: number[]): boolean {
  // 如果没有数据，就是全0
  if (!data) return true
  // 快速失败策略 - 如果第一个元素非0，则立即返回false
  if (data[0] !== 0) return false;

  // 检查中间关键点（避免需要检查全部数据）
  const midIndex = Math.floor(data.length / 2);
  if (data[midIndex] !== 0) return false;

  // 检查最后元素
  if (data[data.length - 1] !== 0) return false;

  // 最后一步：完整检查（只有当前面检查都通过才进行）
  return data.every(val => val === 0);
}

const redChannelList = ref<string[]>([])
const greenChannel = ref<string>('')

// 点击事件
function onClick(chartInstance: any, megName: string) {

  // 每次都是销毁后新建的，所以不用off('click')
  chartInstance.getZr().on('click', (params: any) => {
    brainRegion.value = null
    // 点击标记为红线
    // target存在则说明点在了线上或者是选框上，点在线上就会有seriesIndex
    const { target } = params
    if (target) {
      // 有时候是2层parent，有时候是3层parent
      const seriesIndex = target.parent?.parent?.__ecComponentInfo ? target.parent?.parent?.__ecComponentInfo?.index : target.parent?.parent?.parent?.__ecComponentInfo?.index
      // seriesIndex有值，说明点在了线上,只画红通道。这里的seriesIndex只能等于0，因为只有一条折线
      if (seriesIndex !== undefined) {
        const oldColor = chartInstance.getOption().series[0].itemStyle.color

        let newColor = ''
        if (oldColor === BLUE_COLOR) {
          newColor = RED_COLOR
          redChannelList.value.push(megName)
        } else if (oldColor === GREEN_COLOR) {
          newColor = RED_COLOR
          greenChannel.value = ''
          redChannelList.value.push(megName)
        } else if (oldColor === RED_COLOR) {
          newColor = GREEN_COLOR
          redChannelList.value.push(megName)


          // 把上一次绿色的先变红
          if (greenChannel.value) {
            const itemRef = lineDataRefs.value[greenChannel.value]
            if (itemRef) {
              // 获取当前实例（如果存在）
              let chartInstance = getInstanceByDom(itemRef)
              chartInstance.setOption({
                series: [{
                  itemStyle: {
                    color: RED_COLOR // 改变通道颜色
                  },
                }]
              })
            }
          }
          // 再把现在的变绿色，永远最多只有一个绿色通道
          greenChannel.value = megName
        }



        // // 包含删掉，不包含加入
        // if (oldColor !== RED_COLOR) {
        //   redChannelList.value.push(megName)
        //   newColor = RED_COLOR
        // } else {
        //   // 如果点击的就是当前绿色的通道，则取消绿色通道和红色通道
        //   if (greenChannel.value === megName) {
        //     greenChannel.value = ''
        //     redChannelList.value = redChannelList.value.filter(f => f !== megName)
        //     newColor = BLUE_COLOR
        //   } else {
        //     // 如果点击的不是当前绿色通道，就把它作为新的绿色通道
        //     greenChannel.value = megName
        //     newColor = GREEN_COLOR
        //   }
        // }

        // 去重
        redChannelList.value = [...new Set(redChannelList.value)]

        // console.log('redChannelList.value :>> ', redChannelList.value);
        // console.log('greenChannel.value :>> ', greenChannel.value);

        emit('setGreenChannel', greenChannel.value) // 每次setGreenChannel都必须在setRedChannelList之前调用
        emit('setRedChannelList', redChannelList.value)
        chartInstance.setOption({
          series: [{
            itemStyle: {
              // color: oldColor === RED_COLOR ? BLUE_COLOR : RED_COLOR // 改变通道颜色
              color: newColor // 改变通道颜色
            },
          }]
        })

        // 不能少
        lineDataList.value.find(f => f.megName === megName).selected = (newColor === RED_COLOR || newColor === GREEN_COLOR) ? true : false

      }
    }

  })

}

// 每个图表都要有一个固定的比例尺，不然都会撑满整个图表，各个图表之间的振幅是有差异的
const ONE_SPACE = 500 // 间距
const TWO_SPACE = ONE_SPACE * 2 // 间距*2


// 把配置和数据放这里
const CHART_OPTION: any = {
  grid: {
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    containLabel: false        // 不自适应。左侧Y轴数据量大时，自适应会失效，有bug，所以直接left写死，不自适应
  },
  xAxis: {
    type: 'category',
    axisLine: {
      show: false       // 是否显示坐标轴轴线
    },
    splitLine: {
      show: false,      // 坐标轴在 grid 区域中的分隔线
    },
    axisTick: {
      show: false       // 是否显示坐标轴刻度
    },
    axisPointer: {
      show: false,      // 大数据时太卡了
    },
    data: [],
  },
  yAxis: {
    type: 'value',
    minInterval: ONE_SPACE, // splitNumber和minInterval 是完全显示Y轴通道名称的关键
    splitNumber: TWO_SPACE,
    axisLabel: {
      show: false,      // 显示刻度标签
    },
    axisTick: {
      show: false       // 是否显示坐标轴刻度
    },
    axisLine: {
      show: false,      // 是否显示坐标轴轴线
    },
    splitLine: {
      show: false,      // 坐标轴在 grid 区域中的分隔线
    }
  },
  series: [{
    type: 'line',
    sampling: 'lttb',
    smooth: true,       // 默认平滑true
    symbol: 'none',     // 标记的图形
    animation: false,   // 动画太卡，不要动画了
    lineStyle: {
      width: 1
    },
    itemStyle: {
      color: BLUE_COLOR
    },
    data: []
  }],
}

const brainRegion = ref() // 选择的脑区

// 改变脑区
function changeBrainRegion() {
  if (brainRegion.value) {
    redChannelList.value = allChannelListByName.value[brainRegion.value]
  } else {
    redChannelList.value = []
  }
  greenChannel.value = ''
  emit('setGreenChannel', '') // 每次setGreenChannel都必须在setRedChannelList之前调用
  emit('setRedChannelList', redChannelList.value)
  drawRedChannelList()
}

function drawRedChannelList() {

  lineDataList.value.forEach((item) => {
    const { megName } = item
    const itemRef = lineDataRefs.value[megName]
    if (itemRef) {
      // 获取当前实例（如果存在）
      const chartInstance = getInstanceByDom(itemRef)
      if (chartInstance) {
        item.selected = redChannelList.value.includes(megName)
        chartInstance.setOption({
          series: [{
            itemStyle: {
              color: !redChannelList.value.includes(megName) ? BLUE_COLOR : RED_COLOR // 如果换了新的time，原来选择的红色通道依然要标红
            },
          }],
        })
      }
    }
  })
}


// 高度变大，就要往上移一下；高度变小，就要往下移一下
const translateY = computed(() => {
  return 10 - chartHeight.value
})

// 缩小图表的高度
function zoomOut() {
  if (chartHeight.value <= 1) {
    return
  }
  chartHeight.value -= 1
  changeHeight()
}

// 放大图表的高度
function zoomIn() {
  chartHeight.value += 1
  changeHeight()
}

// 修改图表的高度
function changeHeight() {
  localStorage.setItem('lineListChartHeight', String(chartHeight.value))
  setResize()
}


function reverseSelect() {
  redChannelList.value = []
  lineDataList.value.forEach((item) => {
    item.selected = !item.selected
    const itemRef = lineDataRefs.value[item.megName]
    if (itemRef) {
      let chartInstance = getInstanceByDom(itemRef)
      if (chartInstance) {
        chartInstance.setOption({
          series: [{
            itemStyle: {
              color: item.selected ? RED_COLOR : BLUE_COLOR  // 改变通道颜色
            },
          }]
        })
      }
    }
    // 包含删掉，不包含加入
    if (item.selected) {
      redChannelList.value.push(item.megName)
    }
  })
  greenChannel.value = ''
  emit('setGreenChannel', '') // 每次setGreenChannel都必须在setRedChannelList之前调用
  emit('setRedChannelList', redChannelList.value)
}



const selectedLineDataList = ref([])
const selectedLineDataRefs: any = ref({}) // 对象的方式

const showZoomBox = ref(false)


// -----------------

const zoomBox = ref<HTMLElement>();
const zoomLayoutData = ref([])

// 声明响应式尺寸变量
const zoomItemWidth = ref(90);
const zoomItemHeight = ref(60);

// 关闭放大视图
function closeZoomBox() {
  showZoomBox.value = false
  zoomLayoutData.value = []
}

// 打开放大视图
async function zoomOutView() {
  showZoomBox.value = true

  // 1. 筛选选中项并初始化引用
  // 使用深拷贝避免数据污染
  selectedLineDataList.value = JSON.parse(JSON.stringify(
    lineDataList.value.filter(item => item.selected)
  ))


  // 2. 初始化引用对象（必须重置）
  selectedLineDataRefs.value = {};
  selectedLineDataList.value.forEach(item => {
    selectedLineDataRefs.value[item.megName + '_zoom'] = null;
  });

  // 3. 等待DOM更新完成
  await nextTick();
  await new Promise(resolve => setTimeout(resolve, 100)); // 确保DOM渲染

  // 计算布局
  zoomLayoutData.value = calculateZoomLayout()

  // console.log('zoomLayoutData.value :>> ', zoomLayoutData.value);

  // 7. 初始化图表实例
  // 必须先给selectedLineDataList.value和selectedLineDataRefs.value赋值，再使用nextTick
  await nextTick();
  zoomLayoutData.value.forEach((item) => {
    const itemRef = selectedLineDataRefs.value[item.megName + '_zoom']
    if (itemRef) {
      // 获取当前实例（如果存在）
      let chartInstance = getInstanceByDom(itemRef)
      // 如果存在实例，则先销毁
      if (chartInstance) {
        chartInstance.clear()
        chartInstance.dispose()
      }
      // 重新初始化图表实例，并直接应用基础配置
      chartInstance = init(itemRef)
      chartInstance.setOption(CHART_OPTION)

      // // 判断是否全0
      const isAllZeros = isArrayAllZeros(allData.chMegData[item.megName])
      // 全0时设置固定y轴范围
      if (isAllZeros) {
        chartInstance.setOption({
          yAxis: [{
            min: -1,  // 设置对称范围
            max: 1
          }],
        })
      }
      chartInstance.setOption({
        xAxis: [{
          data: allData.timePoints,
        }],
        series: [{
          data: allData.chMegData[item.megName],
          itemStyle: {
            // color: !curRedChannelList.includes(item.megName) ? BLUE_COLOR : RED_COLOR // 如果换了新的time，原来选择的红色通道依然要标红
            color: BLUE_COLOR // 如果换了新的time，原、来选择的红色通道依然要标红
          },
          lineStyle: {
            width: isAllZeros ? 1.2 : 1 // 全0时线宽为2
          },
        },
        ...(showRedMarkLine.value ? [{
          name: 'redMarkLine',
          id: 'redMarkLine',
          type: 'line',
          markLine: {
            symbol: 'none', // 相当于['none', 'none'] [虚线，没有箭头]
            silent: true, // true 不响应鼠标事件
            animation: false, // 是否开启动画
            animationDuration: 0, // 初始动画的时长
            data: [{
              xAxis: String(props.curTime) // 对于x轴中的一个值
            }],
            lineStyle: {
              color: useTheme['lineListColor'],
              width: 0.8, // 0 的时候可以隐藏线
              type: 'solid' // 实线，不写默认虚线
            }
          },
        }] : [])
        ],
      })
    }
  })
}

function calculateZoomLayout() {
  if (!zoomBox.value || selectedLineDataList.value.length === 0) return [];

  // 容器尺寸（保留2%安全边距）
  const container = zoomBox.value;
  const padding = Math.min(container.clientWidth, container.clientHeight) * 0.02;
  const maxWidth = container.clientWidth - padding * 2;
  const maxHeight = container.clientHeight - padding * 2;

  // 获取原始坐标
  const points = selectedLineDataList.value.map(p => ({
    x: p.x,
    y: p.y,
    id: p.megName
  }));

  // 特例处理：单个元素
  if (points.length === 1) {
    const size = Math.min(maxWidth, maxHeight) * 0.8;
    zoomItemWidth.value = size
    zoomItemHeight.value = size * 0.6
    return [{
      megName: points[0].id,
      x: (container.clientWidth - size) / 2,
      y: (container.clientHeight - size * 0.6) / 2,
      width: size,
      height: size * 0.6
    }];
  }

  // 计算原始空间范围
  const xVals = points.map(p => p.x);
  const yVals = points.map(p => p.y);
  const minX = Math.min(...xVals);
  const maxX = Math.max(...xVals);
  const minY = Math.min(...yVals);
  const maxY = Math.max(...yVals);
  const rawWidth = maxX - minX || 1; // 防零值
  const rawHeight = maxY - minY || 1;

  // 计算自适应缩放比例
  const scaleX = maxWidth / rawWidth;
  const scaleY = maxHeight / rawHeight;
  const scale = Math.min(scaleX, scaleY) * 0.85;

  // 计算基准偏移量（居中布局）
  const offsetX = padding + (maxWidth - rawWidth * scale) / 2;
  const offsetY = padding + (maxHeight - rawHeight * scale) / 2;

  // 生成基础布局
  let layout = points.map(p => ({
    id: p.id,
    x: offsetX + (p.x - minX) * scale,
    y: offsetY + (maxY - p.y) * scale,
    width: 0,
    height: 0
  }));

  // 动态尺寸调整算法
  let itemWidth = Math.min(200, maxWidth / 3); // 初始宽度根据容器调整
  let itemHeight = itemWidth * 0.6;
  let collision = true;
  let safetyMargin = 8; // 元素间最小间距

  // 优化循环策略：先快速后精细调整
  while (collision && itemWidth > 40) {
    collision = false;

    // 为所有元素设置当前尺寸
    const testItems = layout.map(item => ({
      ...item,
      width: itemWidth,
      height: itemHeight
    }));

    // 四叉树碰撞检测
    const spatialGrid = new Map();
    testItems.forEach((item, index) => {
      const gridX = Math.floor(item.x / (itemWidth + safetyMargin));
      const gridY = Math.floor(item.y / (itemHeight + safetyMargin));
      const key = `${gridX},${gridY}`;
      spatialGrid.set(key, [...(spatialGrid.get(key) || []), index]);
    });

    // 九宫格检测
    outer: for (const [key, indices] of spatialGrid) {
      const [gx, gy] = key.split(',').map(Number);
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const nearKey = `${gx + dx},${gy + dy}`;
          const nearItems = spatialGrid.get(nearKey) || [];
          for (const i of indices) {
            for (const j of nearItems) {
              if (i >= j) continue;
              const a = testItems[i];
              const b = testItems[j];
              if (isOverlap(a, b, safetyMargin)) {
                collision = true;
                break outer;
              }
            }
          }
        }
      }
    }

    // 智能调整策略
    if (collision) {
      // 根据元素密度调整缩小幅度
      const density = testItems.length / (maxWidth * maxHeight);
      itemWidth -= density > 0.1 ? 15 : 8; // 高密度时快速缩小
      itemHeight = itemWidth * 0.6;
    }
  }

  // 动态调整时的边界约束修正
  layout = layout.map(item => {
    const halfWidth = itemWidth / 2;
    const halfHeight = itemHeight / 2;

    // 计算实际边界
    let newX = item.x;
    let newY = item.y;

    // 左侧边界检测
    if (newX - halfWidth < padding) {
      newX = padding + halfWidth;
    }

    // 右侧边界检测
    if (newX + halfWidth > container.clientWidth - padding) {
      newX = container.clientWidth - padding - halfWidth;
    }

    // 顶部边界检测
    if (newY - halfHeight < padding) {
      newY = padding + halfHeight;
    }

    // 底部边界检测
    if (newY + halfHeight > container.clientHeight - padding) {
      newY = container.clientHeight - padding - halfHeight;
    }

    return { ...item, x: newX, y: newY };
  });

  zoomItemWidth.value = itemWidth
  zoomItemHeight.value = itemHeight

  // 最终尺寸分配
  return layout.map(item => ({
    megName: item.id,
    x: Math.max(padding, item.x - itemWidth / 2), // 确保不小于左边界
    y: Math.max(padding, item.y - itemHeight / 2), // 确保不小于上边界
  }));
}

// 碰撞检测函数
function isOverlap(a: any, b: any, margin: number) {
  return (
    Math.abs(a.x - b.x) < (a.width + b.width) / 2 + margin &&
    Math.abs(a.y - b.y) < (a.height + b.height) / 2 + margin
  );
}
</script>

<style lang="less" scoped>
.container {
  position: relative;
  overflow: hidden;
}

.chart-item {
  position: absolute;
}

.top-right {
  position: absolute;
  top: 6px;
  right: 6px;
  display: flex;
  align-items: center;

  .button-box {
    height: 22px;
    background: #f1f3f5;
    background: var(--color-primary-01);
    padding: 0px 5px;
    border-radius: 4px;
    margin-right: 2px;
    display: flex;
    justify-content: center;
    align-items: center;

    .button-box-text {
      color: var(--black-t3);
    }

  }

  .icon-delete {
    font-size: 12px;
    cursor: pointer;
    color: var(--color-t4);

    &:hover {
      color: var(--color-primary);
    }
  }


  // 比例尺2个按钮
  .ratio-icon {
    color: var(--color-t4);
    font-size: 12px;
    cursor: pointer;
    // margin-right: 8px;

    .anticon {
      &:hover {
        color: var(--color-primary);
      }
    }
  }
}

// 必须要加上 :getPopupContainer="(triggerNode:any) => triggerNode.parentNode"，否则会在body下，无法生效
:deep(.select-list) {
  width: 50px;

  // :deep(.ant-select-clear) {
  //   inset-inline-end: 3px;
  // }

  .ant-select-selector {
    font-size: 11px;
    height: 18px !important;

    .ant-select-selection-item {
      line-height: 18px !important;
      padding-inline-end: 0px !important;
    }

    .ant-select-selection-placeholder {
      line-height: 18px !important;
      padding-inline-end: 0px !important;
      font-size: 10px;
    }
  }

  .ant-select-arrow {
    inset-inline-end: 4px;
  }

  // 改变下拉框打开时的选项样式
  .ant-select-dropdown {

    .ant-select-item-option {
      padding: 0 0 0 6px;
      height: 20px;
      min-height: 20px;
      line-height: 20px;
      font-size: 11px;
    }

  }
}

.selection-box {
  position: absolute;
  border: 1px dashed var(--color-t2);
  background: var(--color-005);
  pointer-events: none;
}


.zoom-icon {
  font-size: 12px;
  color: var(--color-t4);
  cursor: pointer;
}

.zoom-icon-disabled {
  color: var(--color-t6);
  cursor: not-allowed;
}

.zoom-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  width: calc(100% - 5px);
  height: 100%;
  background: #f8f8f8;
  background: var(--color-bg);
  z-index: 1000;
  overflow: auto; // 添加滚动以防内容超出

  .zoom-viewport {
    position: relative;
    width: 100%;
    height: 100%;
    // min-width: 800px;
    // min-height: 600px;
    transform-origin: 0 0; // 保证缩放基准点
  }

  .zoom-item {
    position: absolute;
    // border: 1px solid #eee;
    // background: white;
    transition: all 0.2s ease-in-out;

    &:hover {
      box-shadow: 0 0px 2px rgba(40, 40, 40, 0.1);
    }
  }

  .zoom-content {
    width: 100%;
    height: 100%;
  }

  .zoom-close {
    position: absolute;
    top: 12px;
    right: 12px;
    font-size: 12px;
    z-index: 1;
    cursor: pointer;
    color: var(--color-t3);
  }
}

.chart-dark {
  .top-right {

    .button-box-text {
      color: var(--white-t3);
    }

    .icon-delete {
      color: var(--white-t4);

      &:hover {
        color: var(--color-primary);
      }
    }


    // 比例尺2个按钮
    .ratio-icon {
      color: var(--white-t4);
    }
  }


  .selection-box {
    border: 1px dashed var(--white-t2);
    background: var(--color-005); // TODO
  }


  .zoom-icon {
    font-size: 12px;
    color: var(--white-t4);
    cursor: pointer;
  }

  .zoom-icon-disabled {
    color: var(--white-t6);
    cursor: not-allowed;
  }

  .zoom-box {
    background: var(--black-bg);

    .zoom-close {
      cursor: pointer;
      color: var(--white-t3);
    }
  }

}

.chart-eyecare {
  .top-right {

    .button-box-text {
      color: var(--eyecare-t3);
    }

    .icon-delete {
      color: var(--eyecare-t4);

      &:hover {
        color: var(--color-primary);
      }
    }


    // 比例尺2个按钮
    .ratio-icon {
      color: var(--eyecare-t4);
    }
  }


  .selection-box {
    border: 1px dashed var(--eyecare-t2);
    background: var(--eyecare-005); // TODO
  }


  .zoom-icon {
    font-size: 12px;
    color: var(--eyecare-t4);
    cursor: pointer;
  }

  .zoom-icon-disabled {
    color: var(--eyecare-t6);
    cursor: not-allowed;
  }

  .zoom-box {
    background: var(--eyecare-bg);

    .zoom-close {
      cursor: pointer;
      color: var(--eyecare-t3);
    }
  }

}

// 开关控制显示竖线
:deep(.switch-checked) {

  &.ant-switch-checked {
    background-color: var(--color-primary-068);

    &:hover:not(.ant-switch-disabled) {
      background-color: var(--color-primary-068);
    }
  }
}
</style>