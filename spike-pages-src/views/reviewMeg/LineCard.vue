<!-- 多脑区拖动图 -->
<template>
  <div :style="{ width: '100%', height: chartHeight + 'px' }">

    <ButterflyModal v-if="showButterflyModal" ref="butterflyModalRef" @mousedown="clickButterflyModal"
      @setRedLineValue="setRedLineValueFromButterflyModal" @closeModal="closeButterflyModal"
      @setAllChartTheme="setAllChartTheme" />

    <div v-for="(item) in lineModalList" :key="item.modalId" @mousedown="clickLineModal(item)">
      <LineModal :ref="(instance) => { lineModalRefs[item.modalId] = instance }" :filePath="props.filePath"
        :brainRegion="props.brainRegion" :chNames="props.chNames" :startTime="props.startTime" :coregId="props.coregId"
        :subjectId="props.subjectId" :autoSl="props.autoSl" :customChannelList="props.customChannelList"
        :eegCustomChannelList="props.eegCustomChannelList" :eegCombList="props.eegCombList"
        :badChannelList="props.badChannelList" :curSpikeChannels="props.curSpikeChannels" :megType="props.megType"
        :showMarkAreaBg="props.showMarkAreaBg" :markAreaBgDuration="props.markAreaBgDuration" :duration="props.duration"
        @setRedLineValue="setRedLineValueFromLineModal" @closeModal="closeModal"
        @openViewModal="openViewModalFromLineModal" @openLayoutModal="openLayoutModalFromLineModal"
        @updateLayoutModal="updateLayoutModalFromLineModal" @setAllChartTheme="setAllChartTheme"
        @turnToGoodOrBadChannel="turnToGoodOrBadChannel" @successClickType="successClickType" />
    </div>

    <!-- 结构像窗口 -->
    <ViewModal ref="viewModalRef" :fifFilePath="props.fifFilePath" :niiFilePath="props.niiFilePath"
      :brainRegion="props.brainRegion" :chNames="props.chNames" :locMethod="props.locMethod" :megId="props.megId"
      :subjectId="props.subjectId" :autoSl="props.autoSl" @mousedown="clickViewModal" />

    <!-- 通道布局窗口 -->
    <LayoutModal ref="layoutModalRef" :fifFilePath="props.fifFilePath" :subjectId="props.subjectId"
      :curSpikeSlChannels="props.curSpikeSlChannels" :autoSl="props.autoSl" :megType="props.megType" :markAreaBgDuration="props.markAreaBgDuration"
      @mousedown="clickLayoutModal" @openViewModal="openViewModalFromLineModal"
      @setRedLineValue="setRedLineValueFromLineModal" />

    <!-- 全局时刻点窗口 -->
    <AllTimeModal ref="allTimeModalRef" :startTime="props.startTime" :curTime="props.curTime" :tmin="props.tmin"
      :tmax="props.tmax" :duration="props.duration" :allSpikeList="allSpikeList" @mousedown="clickAllTimeModal"
      @setStartTime="setStartTime" @clickAllSpikeList="clickAllSpikeList" />

  </div>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'

import ButterflyModal from './ButterflyModal.vue'
import LineModal from './LineModal.vue'
import ViewModal from './modal/ViewModal.vue'
import LayoutModal from './layoutModal/LayoutModal.vue'
import AllTimeModal from './modal/AllTimeModal.vue'

import { getRandomId } from '@u/utils'

// import { allChannelListByName16 as allChannelListByNameMegin } from './config' // 所有通道列表
// import { allChannelListByName16 as allChannelListByNameOpm } from './configOpm' // 所有通道列表

import { useOpmStore } from '@/store/opm'
const opmStore = useOpmStore()

import { useCardStore } from '@/store/card'

import {
  addOrUpdateManualSpikeApi, // 添加或者修改手动标注的棘波，修改的时候，也需要传入所有字段的信息
} from '@/api/meg'

import { spikeTypeList } from '@u/data'

const { t } = useI18n()

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
  curTime: {
    type: Number,
    default: 0,
  },
  startTime: {
    type: Number,
    default: 0,
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
  coregId: {
    type: String,
    default: '',
  },
  niiFilePath: {
    type: String,
    default: '',
  },
  fifFilePath: {
    type: String,
    default: '',
  },
  locMethod: {
    type: String,
    default: '',
  },
  megId: {
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
  getFormParams: {
    type: Function,
  },
  customChannelList: {
    type: Array,
    default: [],
  },
  eegCustomChannelList: {
    type: Array,
    default: [],
  },
  eegCombList: {
    type: Array,
    default: [],
  },
  badChannelList: {
    type: Array as PropType<any[]>,
    default: [],
  },
  allSpikeList: {
    type: Array as PropType<any[]>,
    default: [],
  },
  curSpikeChannels: {
    type: Array as PropType<any[]>,
    default: [],
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
  },
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


const cardStore = useCardStore()
// 监听store的状态变化
watch(() => cardStore.isCollecting, (isCollecting) => {
  if (isCollecting) {
    // 如果弹窗关闭的话，要设置成null
    if (showButterflyModal.value) {
      const cardRect = butterflyModalRef.value.getPositionSize()
      cardStore.setButterflyData(cardRect)
    } else {
      cardStore.setButterflyData(null)
    }

    if (layoutModalRef.value.visible) {
      const cardRect = layoutModalRef.value.getPositionSize()
      cardStore.setLayoutModalData(cardRect)
    } else {
      cardStore.setLayoutModalData(null)
    }

    if (viewModalRef.value.visible) {
      const cardRect = viewModalRef.value.getPositionSize()
      cardStore.setViewModalData(cardRect)
    } else {
      cardStore.setViewModalData(null)
    }

    if (allTimeModalRef.value.visible) {
      const cardRect = allTimeModalRef.value.getPositionSize()
      cardStore.setAllTimeModalData(cardRect)
    } else {
      cardStore.setAllTimeModalData(null)
    }

    const lineList: any[] = []
    Object.values(lineModalRefs.value).forEach((item: any) => {
      if (item) {
        const cardRect = item?.getPositionSize()
        if (cardRect.modalId) {
          lineList.push(cardRect)
        }
      }
    })
    cardStore.setLineData(lineList)

    // console.log('lineModalList.value :>> ', lineModalList.value);
    // console.log('lineModalRefs.value :>> ', lineModalRefs.value);
    // console.log('lineList :>> ', lineList);

  }
})

// 暴露方法
defineExpose({
  // resize,
  addLineData,
  setAllLineData,
  setButterflyData,
  setLayoutModalData,
  getLineModalList,
  openViewModal,
  openAllTimeModal,
  setRedMarkLine,
  clearAllModal,
  clearViewModalData,
  clickLocation,
  clickLocationFromSpikeOrManual,
  drawBadChannel,
  setZIndex,
  changeOneModalBrain,
  setClusterSlResult,
  clickType
})

const emit = defineEmits(['setRedLineValue', 'closeButterflyModal', 'turnToGoodOrBadChannel', 'setStartTime', 'clickAllSpikeList', 'setZIndex','successClickType'])

let topHeight: number = 104 // 浏览器顶部到图表的距离 12+12+68+12=104
// let leftWidth: number = 312 // 浏览器宽度到图表的距离 12+240+4+4+40+12 = 72 + 240 = 312
const chartHeight = ref<number>(window.innerHeight - topHeight) // 高，这里减的数字是浏览器顶部到图表的距离
// const chartWidth = ref<number>(window.innerWidth - leftWidth) // 宽，这里减的数字是浏览器宽度到图表的距离

// onUnmounted(() => {
//   window.onresize = null
// })

// onMounted(() => {
//   // 根据页面大小自动响应图表大小
//   window.onresize = () => resize(topHeight, leftWidth)
// })

// // 根据页面大小自动响应图表大小
// function resize(top: number, left: number) {
//   topHeight = top  // 顶，这一步不能删
//   leftWidth = left // 左，这一步不能删
//   chartHeight.value = window.innerHeight - top // 高
//   chartWidth.value = window.innerWidth - left  // 宽
//   console.log('chartHeight.value :>> ', chartHeight.value);
// }



const butterflyModalRef = ref(null) // 蝴蝶图
const showButterflyModal = ref(false) // 展示蝴蝶图

// 创建一个 ref 数组来存储 LineModal 实例
const lineModalList = ref([])
const lineModalRefs: any = ref({}) // 对象的方式
// let zIndexValue = 0 // 层级的值，不停的累加
const zIndex = ref(0) // 层级的值，不停的累加


watch(() => zIndex.value, (newVal, oldVal) => {
  emit('setZIndex', zIndex.value)
})

function setZIndex(value: number) {
  zIndex.value = value
}


// let paramsData = {} // 没有用

// 显示蝴蝶图卡片和数据
function setButterflyData(params: any) {
  // console.log('params :>> ', params);
  showButterflyModal.value = true

  params.zIndexValue = zIndex.value
  zIndex.value++
  // paramsData = params
  // console.log('params1 :>> ', paramsData);
  nextTick(() => {
    // butterflyModalRef.value.setData(params)
    butterflyModalRef.value.addData(params)
  })

  // setTimeout(()=>{
  //   getButterflyModalSize()
  // },3000)
}

// function getButterflyModalSize() {
//   const cardRect = butterflyModalRef.value.getPositionSize()
//   console.log('cardRect :>> ', cardRect);
// }




// 添加一个折线图卡片LineModal
async function addLineData(params: any) {
  const data: any = {
    modalId: getRandomId(),
    modalIndex: lineModalList.value.length + 1, // 当前是第几个，从0开始 + 1
    // modalPosition: getNextModalPosition(), // 1234，4个位置的编号
    zIndexValue: zIndex.value,
    ...params,
  }
  zIndex.value++

  lineModalList.value.push(data)
  lineModalRefs.value[data.modalId] = ref(null) // 对象的方式

  nextTick(() => {
    lineModalRefs.value[data.modalId]?.addData(data) // 对象的方式
  })
}

// // 放置在哪个位置的编号 1/2/3/4
// function getNextModalPosition() {
//   const positionObj: any = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 }

//   // 统计现有数组中modalPosition各位置的数量
//   lineModalList.value.forEach((item: { modalPosition: number }) => {
//     if (item.modalPosition) {
//       positionObj[item.modalPosition]++
//     }
//   })
//   // 找到最少数量的位置，如果有多个最少则选择最小的那个
//   let minCount = Infinity
//   let nextPosition = 1

//   for (const position in positionObj) {
//     const count = positionObj[position];
//     if (count < minCount) {
//       minCount = count
//       nextPosition = Number(position)
//     }
//   }
//   // 返回下一个应该使用的modalPosition值
//   return nextPosition
// }


// 画线时的红线值
let redLineValue: number = null

// 设置和重置所有卡片数据
function setAllLineData(params: any) {
  // paramsData = params
  nextTick(() => {
    Object.values(lineModalRefs.value).forEach((item: any) => {
      item?.setData(params)
    })

    if (showButterflyModal.value) {
      butterflyModalRef.value.setData(params, () => {
        // 如果获取到新的蝴蝶图后，redLineValue有值，说明需要新的蝴蝶图需要画线
        if (redLineValue) {
          butterflyModalRef.value.setRedMarkLine(redLineValue)
          redLineValue = null
        }
      })
    }

  })
}

// 设置所有卡片竖线
function setRedMarkLine(value: number) {
  // 现在是要画竖线的状态，标记一下，等蝴蝶图获取到新图后再画线
  redLineValue = value

  nextTick(() => {
    // 画线时，如果通道布局窗口打开了，要升级一下数据，已经在这个函数里了
    setRedLineValueFromButterflyModal(value)
    // 但是需要先尝试画一下，因为如果蝴蝶图不获取新图，就是现在画的竖线，如果蝴蝶图获取了新图，就是获取后再画线的操作
    if (showButterflyModal.value) {
      butterflyModalRef.value.setRedMarkLine(value)
    }
  })
}


// 获取LineModal数据
function getLineModalList() {
  return lineModalRefs.value
}


const redMarkLine = ref<number>() // 竖线的值

// 设置标记线的值,让其他卡片和蝴蝶图也设置成这个值
function setRedLineValueFromLineModal(value: number) {
  redMarkLine.value = value
  Object.values(lineModalRefs.value).forEach((item: any) => {
    item?.setRedMarkLine(value)
  })
  if (showButterflyModal.value) {
    butterflyModalRef.value.setRedMarkLine(value)
  }
  emit('setRedLineValue', value)
}

// 设置标记线的值,让其他卡片也设置成这个值
function setRedLineValueFromButterflyModal(value: number) {
  redMarkLine.value = value
  if (Object.keys(lineModalList.value).length) {
    Object.values(lineModalRefs.value).forEach((item: any) => {
      item?.setRedMarkLine(value)
    })
  }  // 对象的方式

  // 点击蝴蝶图画线时，如果通道布局窗口打开了，要升级一下数据
  updateLayoutModalFromLineModal(String(value))

  emit('setRedLineValue', value)
}

// 关闭卡片
function closeModal(modalId: string) {
  lineModalList.value = lineModalList.value.filter((item) => item.modalId !== modalId)
  delete lineModalRefs.value[modalId]  // 对象的方式
}

// 关闭蝴蝶图
function closeButterflyModal() {
  showButterflyModal.value = false
  emit('closeButterflyModal')
}


// 点击蝴蝶图
function clickButterflyModal() {
  butterflyModalRef.value?.setZIndex(zIndex.value)
  zIndex.value++
}

// 点击折线图
function clickLineModal(item: any) {
  lineModalRefs.value[item.modalId]?.setZIndex(zIndex.value)
  zIndex.value++
}


// 结构像窗口
const viewModalRef = ref(null)

// 打开结构像窗口
function openViewModal(cardParams: any) {
  // 如果没有才打开，已经打开就无需操作
  if (!viewModalRef.value.visible) {
    viewModalRef.value.showModal(zIndex.value, cardParams)
    zIndex.value++
  }
}

// 点击结构像图
function clickViewModal() {
  viewModalRef.value?.setZIndex(zIndex.value)
  zIndex.value++
}

// 右键点击溯源定位，打开结构像窗口
async function openViewModalFromLineModal(curTime: string, channels: string[] = [], position: any) {
  // console.log('385 curTime :>> ', curTime, viewModalRef.value.visible);
  // 如果没打开，就打开
  if (!viewModalRef.value.visible) {
    viewModalRef.value.showModal(zIndex.value, null, () => {
      setTimeout(() => {
        viewModalRef.value.setTimeData(curTime, props.coregId, channels, position)
      }, 3500)
    })
  } else {
    viewModalRef.value.setTimeData(curTime, props.coregId, channels, position)
  }
}


// 通道布局窗口
const layoutModalRef = ref(null)

// 点击通道布局图
function clickLayoutModal() {
  layoutModalRef.value?.setZIndex(zIndex.value)
  zIndex.value++
}

// 右键点击通道布局，打开通道布局窗口
async function openLayoutModalFromLineModal(curTime: string | IAnyObject) {
  const formParams = props.getFormParams()
  layoutModalRef.value.showModal({
    zIndexValue: zIndex.value,
    coregId: props.coregId,
    curTime,
    formParams,
  })
  zIndex.value++
}

// 画竖线时，如果打开了通道布局窗口，就更新
async function updateLayoutModalFromLineModal(curTime: string | IAnyObject) {
  // console.log('423 :>> ', curTime, typeof curTime);

  // 当默认布局出来后，点击患者数据列表，curTime 是 null，传过来之前被String(curTime) 变成了 'null'
  if (layoutModalRef.value.visible && curTime && curTime !== 'null') {
    const formParams = props.getFormParams()
    layoutModalRef.value.showModal({
      zIndexValue: zIndex.value,
      coregId: props.coregId,
      curTime,
      formParams,
      isUpdate: true,
    })
  }
}

// 设置一个空的布局弹窗
async function setLayoutModalData(params: any) {
  layoutModalRef.value.showModal({
    zIndexValue: zIndex.value,
    coregId: props.coregId,
    curTime: null,
    formParams: params,
  })
  zIndex.value++
}


// 清空所有的弹窗
function clearAllModal() {
  layoutModalRef.value.visible = false
  viewModalRef.value.visible = false
  viewModalRef.value.clearTimeData()
  showButterflyModal.value = false
  allTimeModalRef.value.visible = false
  lineModalRefs.value = {}
  lineModalList.value = []
}

// 清空结构像窗口数据
function clearViewModalData() {
  // 如果结构像窗口打开，把数据清空
  if (viewModalRef.value.visible) {
    viewModalRef.value.clearTimeData()
  }
}

// alt+q 溯源定位
function clickLocation() {
  if (redMarkLine.value) {
    const curTime = String(redMarkLine.value)
    openViewModalFromLineModal(curTime, [], null)
  }
}

//  溯源定位，点击左侧算法或手动列表来的，自带slCoord
function clickLocationFromSpikeOrManual(position: any) {
  console.log('clickLocationFromSpikeOrManual :>> ', position);
  // 如果结构像窗口打开了，还有竖线，才填上去
  if (viewModalRef.value.visible && redMarkLine.value) {
    const curTime = String(redMarkLine.value)
    viewModalRef.value.setTimeData(curTime, props.coregId, [], position)
  }
}

// 点击左侧列表的“查看聚类溯源结果”按钮，在结构像窗口批量展示时刻点，和clickLocationFromSpikeOrManual方法类似，但上面那个可以设置redMarkLine.value。批量没法设置，所以是传入spikeTime。
function setClusterSlResult(position: any, spikeTime: number) {
  console.log('setClusterSlResult :>> ', spikeTime);
  // 如果结构像窗口打开了，才填上去
  if (viewModalRef.value.visible) {
    viewModalRef.value.setTimeData(String(spikeTime), props.coregId, [], position)
  }
}

function setAllChartTheme(value: string) {

  if (showButterflyModal.value) {
    butterflyModalRef.value.setChartTheme(value)
  }
  Object.values(lineModalRefs.value).forEach((item: any) => {
    item?.setChartTheme(value)
  })

  if (layoutModalRef.value.visible) {
    layoutModalRef.value.setChartTheme(value)
  }
}

// 画坏通道
function drawBadChannel() {
  nextTick(() => {
    if (Object.keys(lineModalList.value).length) {
      Object.values(lineModalRefs.value).forEach((item: any) => {
        item?.drawBadChannel()
      })
    }  // 对象的方式
  })
}

// 标记后再获取新的坏通道列表，再画坏通道线
function turnToGoodOrBadChannel() {
  emit('turnToGoodOrBadChannel')
}




// 全局时刻点窗口
const allTimeModalRef = ref(null)

// 打开结构像窗口
function openAllTimeModal(cardParams: any) {
  // 如果没有才打开，已经打开就无需操作
  if (!allTimeModalRef.value.visible) {
    allTimeModalRef.value.showModal(zIndex.value, cardParams)
    zIndex.value++
  }
}

// 点击结构像图
function clickAllTimeModal() {
  allTimeModalRef.value?.setZIndex(zIndex.value)
  zIndex.value++
}

// 从时间拉条设置起始时间
function setStartTime(start: number) {
  emit('setStartTime', start)
}


function clickAllSpikeList(item: any) {
  emit('clickAllSpikeList', item)
}

function changeOneModalBrain(brainRegion: string) {
  // console.log('brainRegion :>> ', brainRegion);
  // console.log('lineModalList.value :>> ', lineModalList.value)

  // opm的就不变化了
  if (props.megType !== 'megin') {
    return
  }


  const megModalList = lineModalList.value.filter(item => item.modalType === 'meg')
  if (!megModalList.length) {
    console.log('没有meg类型窗口 :>> ');
    return
  }

  const haveSame = megModalList.find(item => item.listName?.includes(brainRegion))
  // console.log('haveSame :>> ', haveSame);
  if (haveSame) {
    console.log('已有相同的窗口 :>> ');
    return
  }

  // 使用 reduce 方法
  const target = megModalList.reduce((minCard, currentCard) => {
    const currentSum = currentCard.cardLeft + currentCard.cardTop;
    const minSum = minCard.cardLeft + minCard.cardTop;
    return currentSum < minSum ? currentCard : minCard;
  }, lineModalList.value[0])

  console.log('要改变脑区的窗口 :>> ', target);

  // console.log('lineModalRefs.value :>> ', lineModalRefs.value);
  lineModalRefs.value[target.modalId].changeNewBrain(brainRegion)

  const newBrain = brainRegion + (props.megType === 'megin' ? '_grad' : '_all') // opm的grad是空的，所以要加_all。必须要加上小括号，否则优先加号而不是三元运算符
  target.listName = newBrain
  target.listNameType = 'listName'
  const channels = [...allChannelListByName.value[newBrain]]
  target.chNames = JSON.parse(JSON.stringify(channels))
  target.startTime = props.startTime // 要把新的startTime 赋值上去
  // console.log('target :>> ', target);
}


// 快捷键选择棘波类型的走这里
async function clickType(key: number) {
  if (redMarkLine.value) {
    const target = spikeTypeList.find(item => item.value === key)
    const curTime = String(redMarkLine.value)
    const params: any = {
      coregId: props.coregId,
      spikeType: key,             // 棘波类型
      startTime: curTime,  // 棘波开始时间, 以字符串形式传递
      filePath: props.filePath,          // 文件路径
      brainArea: props.brainRegion,      // 脑区
      channels: props.chNames.join(','), // 当前展示的是哪些通道的脑磁图，以逗号隔开。如果同时存在脑区和通道的话，以通道为准
      subjectId: props.subjectId,
    }

    const { code } = await addOrUpdateManualSpikeApi(params)
    if (code === 200) {
      message.success(`${curTime} ${t('已标记为')} ${target.label}`, 1)
      // 添加标注点成功后刷新标注点
      emit('successClickType', String(curTime))
    }
  }
}

function successClickType(time: string) {
  emit('successClickType', time)
}
</script>

<style lang="less" scoped>
@import './style/line.less';
</style>