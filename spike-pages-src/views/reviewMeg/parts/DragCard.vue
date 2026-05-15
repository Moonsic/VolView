<!-- 拖拽移动组件 -->
<template>
  <div ref="cardRef" class="draggable-card" :style="{
    top: cardTop + 'px',
    left: cardLeft + 'px',
    width: cardWidth + 'px',
    height: cardHeight + 'px',
    zIndex: props.zIndex
  }">
    <!-- 4个角落拖拽图标 -->
    <template v-if="props.draggable">
      <div v-for="(corner, index) in cornerList" :key="index" :ref="cornerRefs[index]" class="corner-item"
        :class="corner" @mousedown.prevent.stop="handleCornerMouseDown(corner)"></div>
    </template>

    <div class="card-title flex-between" ref="titleRef" :style="{ height: title_height + 'px' }">
      <div class="flex-start flex-auto text-ellipsis">
        <span v-if="props.title" class="text-12">{{ props.title }}</span>
        <slot name="title"></slot>
        <!-- <span>{{ cardLeft }} * {{ cardTop }}</span> -->

        <!-- 下拉框改变大小 -->
        <!-- <ExpandOutlined class="size-icon" />
        <a-select class="select-size" v-model:value="selectSize" :defaultOpen="false" :options="sizeList" size="small"
          :bordered="true" :showArrow="false" :getPopupContainer="(triggerNode: any) => triggerNode.parentNode"
          @change="changeSize" /> -->

      </div>
      <close-outlined class="card-close" @click="closeModal" />
    </div>


    <!-- 正在拖拽时的灰色蒙版 -->
    <div class="dragging-gray-mask" v-if="isDragging"></div>

    <div class="card-content" :style="{
      marginTop: margin_top + 'px',
      width: cardWidth + 'px',
      height: (cardHeight - margin_top) + 'px',
    }">
      <slot></slot>
    </div>


  </div>
</template>

<script lang="ts" setup>
import { useDraggable } from '@vueuse/core'

const props = defineProps({
  width: {
    type: Number,
    default: 0,
  },
  height: {
    type: Number,
    default: 0,
  },
  left: {
    type: Number,
    default: 0,
  },
  top: {
    type: Number,
    default: 0,
  },
  zIndex: {
    type: Number,
    default: 0,
  },
  // 距离顶部距离，20就是卡片多20px高度
  marginTop: {
    type: Number,
    default: 0,
  },
  draggable: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: '',
  },
  // 类型，在时刻点列表弹窗中有特殊操作
  type: {
    type: String,
    default: '',
  },
})

// left和top是父组件传过来的，所以要监听
watch(() => props.left, () => {
  cardLeft.value = props.left
})
watch(() => props.top, () => {
  cardTop.value = props.top
})
watch(() => props.width, () => {
  cardWidth.value = props.width
})
watch(() => props.height, () => {
  cardHeight.value = props.height
})


// 暴露方法
defineExpose({
  getPositionSize,
})

function getPositionSize() {
  return {
    cardWidth: cardWidth.value,
    cardHeight: cardHeight.value,
    cardTop: cardTop.value,
    cardLeft: cardLeft.value
  }
}

const emit = defineEmits(['startDrag', 'endDrag', 'drag', 'close'])


const cornerList = [
  'top', // 上边4
  'bottom', // 下边5
  'left', // 左边6
  'right', // 右边7
  'nw', // 左上角0
  'ne', // 右上角1
  'se', // 右下角2
  'sw', // 左下角3
]

const cardRef = ref(null)
const titleRef = ref(null)

const cornerRefs = ref(new Array(cornerList.length).fill(null))
const isDragging = ref<boolean>(false) // 正在被拖拽
const curCorner = ref<string>(null) // 当前被拖拽的角

// 上一次的卡片数据
const lastCard = ref({
  width: 0,
  height: 0,
  top: 0,
  left: 0,
})

const margin_num = 5

const min_width = props.width / 3   // 让最小宽高等于传来的宽高/3，就不用再传了
const min_height = props.height / 3

// const min_width = 150  // 固定吧
// const min_height = 150  // 固定吧


const title_height = 20
const margin_top = props.marginTop // 距离顶部10px，就是卡片多10px高度

const cardWidth = ref(props.width)
const cardHeight = ref(props.height)
const cardTop = ref(props.top)
const cardLeft = ref(props.left)


onMounted(() => {
  const cardRect = cardRef.value.getBoundingClientRect()

  cardWidth.value = cardRect.width
  cardHeight.value = cardRect.height
  cardTop.value = cardRect.top
  cardLeft.value = cardRect.left
  // console.log('cardHeight33 :>> ', cardHeight.value);

  // 初始化各个角落的ref
  for (let i = 0; i < cornerList.length; i++) {
    cornerRefs.value[i] = ref(null)
  }
})

// const { x: cardLeft , y: cardTop } =
useDraggable(titleRef, {
  initialValue: { x: props.left, y: props.top }, // 弹窗的初始位置
  onStart: () => {
    isDragging.value = true
  },
  onEnd: () => {
    isDragging.value = false
  },
  onMove: (position) => {
    cardLeft.value = position.x
    cardTop.value = position.y

    if (position.x <= 0) {
      cardLeft.value = 0
    }
    if (position.y <= 0) {
      cardTop.value = 0
    }
    if (position.x >= window.innerWidth - cardWidth.value) {
      cardLeft.value = window.innerWidth - cardWidth.value
    }
    if (position.y >= window.innerHeight - cardHeight.value) {
      cardTop.value = window.innerHeight - cardHeight.value
      // 如果窗口高度小于卡片高度，则上面计算cardTop.value会小于0，title部分会跑出去，导致卡片关不掉，所以cardTop.value必须大于等于0
      if (cardTop.value <= 0) {
        cardTop.value = 0
      }
    }

    // 避免小数吧，没有必要小数
    cardLeft.value = Number(cardLeft.value.toFixed(0))
    cardTop.value = Number(cardTop.value.toFixed(0))
  },
})


// 鼠标按下去
function handleCornerMouseDown(corner: string) {
  isDragging.value = true
  curCorner.value = corner
  // 获取鼠标按下时的坐标和卡片的初始尺寸及位置
  const rect = cardRef.value.getBoundingClientRect()
  lastCard.value = {
    width: rect.width,
    height: rect.height,
    top: rect.top,
    left: rect.left,
  }

  emit('startDrag')

  document.addEventListener('mousemove', handleResizeMouseMove)
  document.addEventListener('mouseup', handleResizeMouseUp)
}

// 鼠标移动过程中
function handleResizeMouseMove(e: { clientX: any, clientY: any }) {
  if (!isDragging.value) return
  const { clientX, clientY } = e

  // 限制左边和上边范围
  if (clientX < 0 || clientY < 0) {
    return
  }
  // 限制右边和下边范围
  if (clientX > window.innerWidth || clientY > window.innerHeight) {
    return
  }

  // 如果宽度达到最小&&高度达到最小&&鼠标正在内部
  if (
    cardWidth.value <= min_width && cardHeight.value <= min_height
    &&
    (clientX >= cardLeft.value && clientX <= cardLeft.value + min_width)
    &&
    (clientY >= cardTop.value && clientY <= cardTop.value + min_height)
  ) {
    return
  }

  const diffX = clientX - lastCard.value.left
  const diffY = clientY - lastCard.value.top

  // 根据拖动的是哪个角来调整宽高
  switch (curCorner.value) {
    // 左上角0
    case 'nw':
      cardWidth.value = lastCard.value.width - diffX
      cardHeight.value = lastCard.value.height - diffY
      // 防止把卡片往右方推
      if (cardWidth.value <= min_width) {
        cardWidth.value = min_width
      } else {
        cardLeft.value = clientX
      }
      // 防止把卡片往下方推
      if (cardHeight.value <= min_height) {
        cardHeight.value = min_height
      } else {
        cardTop.value = clientY
      }
      break

    // 右上角1
    case 'ne':
      cardWidth.value = diffX
      cardHeight.value = lastCard.value.height - diffY
      // 限制卡片最小宽度
      if (cardWidth.value <= min_width) {
        cardWidth.value = min_width
      }
      // 防止把卡片往下方推
      if (cardHeight.value <= min_height) {
        cardHeight.value = min_height
      } else {
        cardTop.value = clientY
      }
      break

    // 右下角2 只改变宽高
    case 'se':
      cardWidth.value = diffX
      cardHeight.value = diffY
      // 限制卡片最小宽度
      if (cardWidth.value <= min_width) {
        cardWidth.value = min_width
      }
      // 限制卡片最小高度
      if (cardHeight.value <= min_height) {
        cardHeight.value = min_height
      }
      break

    // 左下角3
    case 'sw':
      cardWidth.value = lastCard.value.width - diffX
      cardHeight.value = diffY
      // 防止把卡片往右方推
      if (cardWidth.value <= min_width) {
        cardWidth.value = min_width
      } else {
        cardLeft.value = clientX
      }
      // 限制卡片最小高度
      if (cardHeight.value <= min_height) {
        cardHeight.value = min_height
      }
      break

    // 上边
    case 'top':
      cardHeight.value = lastCard.value.height - diffY
      // 防止把卡片往下方推
      if (cardHeight.value <= min_height) {
        cardHeight.value = min_height
      } else {
        cardTop.value = clientY
      }
      break

    // 下边
    case 'bottom':
      cardHeight.value = diffY
      // 限制卡片最小高度
      if (cardHeight.value <= min_height) {
        cardHeight.value = min_height
      }
      break

    // 左边
    case 'left':
      cardWidth.value = lastCard.value.width - diffX
      // 防止把卡片往右方推
      if (cardWidth.value <= min_width) {
        cardWidth.value = min_width
      } else {
        cardLeft.value = clientX
      }
      break

    // 右边
    case 'right':
      cardWidth.value = diffX
      // 限制卡片最小宽度
      if (cardWidth.value <= min_width) {
        cardWidth.value = min_width
      }
      break
  }
  cardWidth.value = Math.round(cardWidth.value) // 四舍五入为整数
  cardHeight.value = Math.round(cardHeight.value) // 四舍五入为整数

  // console.log('object :>> ', cardWidth.value,cardHeight.value,cardTop.value,cardLeft.value)

  emit('drag', {
    cardWidth: cardWidth.value,
    cardHeight: cardHeight.value,
    cardTop: cardTop.value,
    cardLeft: cardLeft.value
  })
}

// 鼠标弹起来
function handleResizeMouseUp() {
  isDragging.value = false
  curCorner.value = null
  document.removeEventListener('mousemove', handleResizeMouseMove)
  document.removeEventListener('mouseup', handleResizeMouseUp)

  emit('endDrag', {
    cardWidth: cardWidth.value,
    cardHeight: cardHeight.value,
    cardTop: cardTop.value,
    cardLeft: cardLeft.value
  })
}


// 关闭
function closeModal() {
  emit('close')
}

// const selectSize = ref(100)
// const sizeList = [
//   { label: '50%', value: 50 },
//   { label: '60%', value: 60 },
//   { label: '70%', value: 70 },
//   { label: '80%', value: 80 },
//   { label: '90%', value: 90 },
//   { label: '100%', value: 100 },
//   { label: '110%', value: 110 },
//   { label: '120%', value: 120 },
//   { label: '130%', value: 130 },
//   { label: '140%', value: 140 },
//   { label: '150%', value: 150 },
// ]
// // 改变大小
// function changeSize() {
//   cardWidth.value = props.width * selectSize.value / 100
//   cardHeight.value = props.height * selectSize.value / 100 + title_height

//   emit('drag', {
//     cardWidth: cardWidth.value,
//     cardHeight: cardHeight.value,
//     cardTop: cardTop.value,
//     cardLeft: cardLeft.value
//   })
// }

</script>

<style lang="less" scoped>
@margin: -2px;
// @border: 2px solid var(--color-t6);
// @border: none;

.draggable-card {
  position: fixed;
  box-shadow: 0 0 3px rgba(100, 100, 100, 0.8);
  // border: 1px solid rgba(100, 100, 100, 0.7);
  border-radius: 3px;

  .card-title {
    width: 100%;
    padding-left: 4px;
    padding-right: 4px;
    font-size: 10px;
    cursor: move;

    position: absolute;
    top: 0;
    z-index: 1001; // 层级关系 corner-item 1002 > card-title 1001 > dragging-gray-mask 1000
    // background: #262626; // 有颜色会把上面的内容挡住哎

    &:hover {
      border-radius: 3px;

      // .card-title-bottom {
      //   height: 50px;
      // }
    }
  }

  .card-close {
    font-size: 12px;
    transition: all .3s;

    &:hover {
      transform: rotate(90deg);
    }
  }

  .card-content {
    overflow: hidden;
    border-radius: 3px;
  }

  .corner-item {
    position: absolute;
    width: 10px;
    height: 10px;
    z-index: 1002;

    &.nw {
      top: @margin;
      left: @margin;
      cursor: nwse-resize;
      // border-top: @border;
      // border-left: @border;
      border-radius: 5px 0 0 0;
    }

    &.ne {
      top: @margin;
      right: @margin;
      cursor: nesw-resize;
      // border-top: @border;
      // border-right: @border;
      border-radius: 0 5px 0 0;
    }

    &.se {
      bottom: @margin;
      right: @margin;
      cursor: nwse-resize;
      // border-bottom: @border;
      // border-right: @border;
      border-radius: 0 0 5px 0;
    }

    &.sw {
      bottom: @margin;
      left: @margin;
      cursor: nesw-resize;
      // border-bottom: @border;
      // border-left: @border;
      border-radius: 0 0 0 5px;
    }

    &.top {
      width: calc(100% - 16px);
      height: 2px;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      cursor: n-resize;
    }

    &.bottom {
      width: calc(100% - 16px);
      height: 2px;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      cursor: n-resize;
    }

    &.left {
      height: calc(100% - 16px);
      width: 2px;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      cursor: e-resize;
    }

    &.right {
      height: calc(100% - 16px);
      width: 2px;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      cursor: e-resize;
    }
  }
}

.dragging-gray-mask {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1000;
  // background: rgba(0, 0, 0, 0.1);
}


.size-icon {
  position: absolute;
  top: 50%;
  left: 8px;
  transform: translateY(-50%);
  color: #fff;
  font-size: 9px;
}

// 必须要加上 :getPopupContainer="(triggerNode:any) => triggerNode.parentNode"，否则会在body下，无法生效
.select-size {
  width: 50px;

  :deep(.ant-select-selector) {
    background-color: rgba(70, 70, 70, 0.5);
    color: #eee;
    border: none !important;
    box-shadow: none !important;
    font-size: 10px;
    height: 17px !important;

    .ant-select-selection-item {
      color: #aaa;
      padding-left: 10px;
      line-height: 17px !important;
    }
  }


  /* 改变下拉框打开时的选项样式 */
  :deep(.ant-select-dropdown) {
    background-color: #444;

    // ant-select-item ant-select-item-option
    .ant-select-item-option {
      padding: 0px 2px;
      height: 18px;
      min-height: 18px;
      line-height: 18px;
      font-size: 10px;
      color: #ddd;
    }

    .ant-select-item-option-active {
      background-color: #888;
    }

    // 选择的
    .ant-select-item-option-selected {
      color: #fff;
      font-weight: 600;
      background-color: var(--color-t4);
    }
  }
}


.draggable-card {
  background: var(--white-bg);

  .card-title {
    color: var(--black-t2);
    background: transparent;

    &:hover {
      background: rgba(230, 230, 230, 0.5);
    }
  }

  .card-close {
    color: var(--black-t3);

    &:hover {
      color: var(--black-t1);
    }
  }
}

.chart-dark {

  .draggable-card {
    background: var(--black-bg);

    .card-title {
      color: var(--white-t2);
      background: transparent;

      &:hover {
        background: var(--black-t5);
      }
    }

    .card-close {
      color: var(--white-t3);

      &:hover {
        color: var(--white-t1);
      }
    }
  }
}

.chart-eyecare {

  .draggable-card {
    background: var(--eyecare-bg);

    .card-title {
      color: var(--eyecare-t2);
      background: transparent;

      &:hover {
        background: var(--eyecare-t7);
      }
    }

    .card-close {
      color: var(--eyecare-t3);

      &:hover {
        color: var(--eyecare-t1);
      }
    }
  }
}
</style>
