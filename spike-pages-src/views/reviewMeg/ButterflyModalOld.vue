<!-- 可拖动全脑区蝴蝶图 -->
<template>
  <DragCard v-if="showModal" ref="dragCradRef" :width="cardWidth" :height="cardHeight" :left="cardLeft" :top="cardTop"
    :zIndex="zIndex" :marginTop="marginTop" @drag="dragModal" @startDrag="startDragModal" @endDrag="endDragModal"
    @close="closeModal">
    <div class="drag-modal" ref="modalRef" @click="onClick($event)" @contextmenu="contextMenu($event)">
      <div class="img-wrap">
        <img class="img" v-if="butterflyImg" :src="butterflyImg" draggable="false">
      </div>
      <div class="red-line" v-if="butterflyImg && typeof lineX === 'number'" :style="{ left: lineX + 'px' }"></div>
      <div class="red-line-text" v-if="butterflyImg && redMarkLine"
        :style="{ left: lineX + 'px', transform: `translateX(${setTextPostion()})` }">{{ redMarkLine }}</div>

      <div v-for="(item, index) in textList" :key="index" class="text"
        :style="{ fontSize: textFontSize, top: item.top }">{{ item.label }}</div>
    </div>


    <template v-slot:title>
      <div class="flex-between widthP100">
        <div class="flex-start title-left"></div>
        <div class="flex-end widthP100 title-right">
          <SettingOutlined class="icon" v-if="!showRightDrawer" @click="openSwitchChannel(true)" />
          <SettingOutlined class="icon" v-if="showRightDrawer" @click="openSwitchChannel(false)" />
        </div>
      </div>

    </template>

    <div class="right-drawer" v-if="showRightDrawer">

      <div class="small-title">宽高：</div>
      <div class="flex-center mb4">
        <a-input-number class="" v-model:value="cardWidth" placeholder="宽" size="small" :controls="false" :min="200"
          :max="innerWidth - 110" @change="changeWidthHeight" />
        *
        <a-input-number class="" v-model:value="cardHeight" placeholder="宽" size="small" :controls="false" :min="250"
          :max="innerHeight" @change="changeWidthHeight" />
      </div>
      <div class="custom-channel-list">
        <div v-for="(item, index) in givenWidthHeightList" :key="index" class="given-item"
          @click="clickGivenWidthHeightList(item)">
          {{ item.width }} * {{ item.height }}
        </div>
      </div>

      <div class="small-title">主题：</div>
      <div class="custom-color-list">
        <div v-for="(item, index) in customColorList" :key="index" class="given-item"
          @click="clickCustomColorList(item)">
          {{ item.label }}
        </div>
      </div>
    </div>

  </DragCard>
</template>

<script lang="ts" setup>
import DragCard from './parts/DragCard.vue'
import { useThemeStore } from '@/store/theme'
import {
  getEntireButterflyApi
} from '@/api/meg'

// 暴露方法
defineExpose({
  setZIndex,
  setData,
  setRedMarkLine,
  getPositionSize,
  setChartTheme,
})

const dragCradRef = ref(null)

function getPositionSize() {
  return dragCradRef.value.getPositionSize()
}

const innerWidth = window.innerWidth
const innerHeight = window.innerHeight

const emit = defineEmits(['setRedLineValue', 'closeModal', 'setAllChartTheme'])

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
// const loading = ref<boolean>(false)
const butterflyImg = ref<string>('')

const lineX = ref<number>(null) // 竖线left值
const lineY = ref<number>(0)

let dataParams: any = {} // 蝴蝶图弹窗的数据


const isDarkMode = ref(false);
const storedTheme = localStorage.getItem('chartTheme')
isDarkMode.value = storedTheme === 'dark'

// 设置数据，请求接口
async function setData(params: any, cb?: () => {}) {

  // console.log('params 1 :>> ', params);

  // 如果有卡片大小位置信息，就设置
  if (params.cardHeight) {
    params.cardWidth = Math.round(params.cardWidth) // 四舍五入为整数，把以前的小数都改成整数
    params.cardHeight = Math.round(params.cardHeight) // 同上

    cardWidth.value = params.cardWidth
    cardHeight.value = params.cardHeight
    cardLeft.value = params.cardLeft
    cardTop.value = params.cardTop
  }

  showModal.value = true
  zIndex.value = Number(params.zIndexValue + 100)

  // 如果起始时间和时长与原来的一样，竖线不动
  let sameXData = false
  if (params.startTime === dataParams.startTime && params.duration === dataParams.duration) {
    sameXData = true
  }
  dataParams = { ...params }

  params.isColorFlip = !isDarkMode.value // 默认false黑底白线，传true就变成了白底黑线

  // loading.value = true
  const { code, data } = await getEntireButterflyApi(params)
  // loading.value = false
  if (code === 200) {
    butterflyImg.value = `data:image/png;base64,${data.butterflyFig}`
    // 如果起始时间和时长与原来的不一样，竖线隐藏
    if (!sameXData) {
      redMarkLine.value = null
      lineX.value = null
    }
    cb && cb()
  }
}

const redMarkLine = ref<number>() // 竖线的值

// 点击蝴蝶图
function onClick($event: any) {
  const { clientX, clientY } = $event
  const cardRect = modalRef.value.getBoundingClientRect()

  lineX.value = Math.round(clientX - cardRect.left)
  lineY.value = Math.round(clientY - cardRect.top)
  if (lineX.value < 0) {
    lineX.value = 0
  }
  if (lineY.value < 0) {
    lineY.value = 0
  }
  const { startTime, duration } = dataParams
  redMarkLine.value = parseFloat((lineX.value * duration / cardWidth.value + startTime).toFixed(3))

  emit('setRedLineValue', redMarkLine.value)
}

// 设置竖线，暴露给LineCard
function setRedMarkLine(value: number) {
  redMarkLine.value = value
  const { startTime, duration } = dataParams
  lineX.value = parseFloat(((value - startTime) / duration * cardWidth.value).toFixed(3))
}

// 设置竖线文字位置
function setTextPostion() {
  if (lineX.value < 10) {
    return 0
  } else if (lineX.value < 20) {
    return '-20%'
  } else if (lineX.value > cardWidth.value - 12) {
    return '-92%'
  } else if (lineX.value > cardWidth.value - 22) {
    return '-70%'
  } else {
    return '-50%'
  }
}

// 关闭弹窗
function closeModal() {
  showModal.value = false
  butterflyImg.value = null
  redMarkLine.value = null
  lineX.value = null
  emit('closeModal')
}

// 开始拖拽
function startDragModal() {
  // console.log('res :>> ', res);
}

// 正在拖拽
function dragModal(res: any) {
  cardWidth.value = res.cardWidth
  cardHeight.value = res.cardHeight // 不能删，影响 计算属性textFontSize
  setRedMarkLine(redMarkLine.value)
}

// 结束拖拽
function endDragModal(res: any) {
  // console.log('res :>> ', res);
  // cardWidth.value = res.cardWidth
  // setRedMarkLine(redMarkLine.value)
}


// 右键
function contextMenu($event: any) {
  // const { clientX, clientY } = $event
  // lineY.value = Math.round(clientY - y.value - title_height)
  // if(lineX.value<0) {
  //   lineX.value = 0
  // }
  // if(lineY.value<0) {
  //   lineY.value = 0
  // }
  // const number = findPartPosition(lineY.value)
  // const brainRegion = brainRegionList[number].value
  // console.log('number,brainRegion :>> ',number,brainRegion);
  // emit('setBrainRegion',brainRegion)
}

// function findPartPosition(targetHeight: number) {
//   const TOTAL_HEIGHT = 750
//   const NUMBER = 8
//   const heightPerPart = TOTAL_HEIGHT / NUMBER; // 计算每份的高度
//   // 对目标高度进行四舍五入，以确定它所在的份数（假设高度必须恰好位于某一份内）
//   const position = Math.floor(targetHeight / heightPerPart);
//   return position
// }

// 文字列表
const textList = [
  { label: 'Left-frontal', top: '2.3%' },
  { label: 'Right-frontal', top: '14.2%' },
  { label: 'Left-occipital', top: '26.4%' },
  { label: 'Right-occipital', top: '39.2%' },

  { label: 'Left-parietal', top: '51.5%' },
  { label: 'Right-parietal', top: '64%' },
  { label: 'Left-temporal', top: '76.4%' },
  { label: 'Right-temporal', top: '88.3%' },
]

// 创建一个计算属性来根据 cardHeight 返回对应的 字体大小
const textFontSize = computed(() => {
  if (cardHeight.value <= 300) {
    return '8px';
  } else if (cardHeight.value <= 400) {
    return '9px';
  } else if (cardHeight.value <= 600) {
    return '10px';
  } else if (cardHeight.value <= 800) {
    return '11px';
  } else {
    return '11px';// 感觉12px太大了，还是11px吧
  }
})

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
  dataParams.cardWidth = item.width
  dataParams.cardHeight = item.height
}

// 修改了窗口宽高
function changeWidthHeight() {
  if (!cardWidth.value) {
    cardWidth.value = 200
  }
  if (!cardHeight.value) {
    cardHeight.value = 250
  }
}

const themeStore = useThemeStore()

// 图表主题色
const customColorList = ref<any[]>([
  { label: '浅色主题', value: 'light' },
  { label: '暗色主题', value: 'dark' },
  { label: '护眼主题', value: 'eyecare' },
])
function clickCustomColorList(item: any) {
  themeStore.switchChartTheme(item.value)
  emit('setAllChartTheme', item.value) // 会走到全脑区图和所有窗口的setChartTheme方法（在下面）
}

// 设置图表主题
function setChartTheme(value: string) {
  isDarkMode.value = value
  butterflyImg.value = ''
  setData(dataParams)
}

</script>

<style lang="less" scoped>
.drag-modal {
  width: 100%;
  height: 100%;
  cursor: crosshair;
  overflow: hidden;
  position: relative;

  .img-wrap {
    width: 100%;
    height: 100%;

    .img {
      width: 100%;
      height: 100%;
    }
  }

  .red-line {
    width: 2px;
    height: calc(100% - 20px); // 20px 是top的值，还需要再减marginTop20
    background: rgba(255, 0, 0, .4); // 红色竖线，带透明度，不遮挡折线
    position: absolute;
    // top: 40px;
    top: 20px;
    z-index: 999;
  }

  .red-line-text {
    color: #a00;
    font-size: 12px;
    position: absolute;
    top: 0;
    z-index: 999;
    line-height: 1;
  }

  .text {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    line-height: 1;
    color: var(--black-t2);
  }
}

.chart-dark {
  .drag-modal {
    .red-line-text {
      color: #f00;
    }

    .text {
      color: var(--white-t2);
    }
  }
}


@import './style/drawer.less';
</style>