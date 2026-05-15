<template>
  <div class="page" ref="parentRef">
    <div
      ref="cardRef"
      class="draggable-card"
      :style="{ top: cardTop - parentTop + 'px', left: cardLeft - parentLeft + 'px', width: cardWidth + 'px', height: cardHeight + 'px' }"
    >
      <!-- 4个角落 -->
      <div
        v-for="(corner, index) in cornerList"
        :key="index"
        ref="cornerRefs[index]"
        class="corner-item"
        :class="corner"
        @mousedown.prevent.stop="e => handleCornerMouseDown(e, corner)"
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>

const cornerList = [
  'nw', // 左上角0
  'ne', // 右上角1
  'se', // 右下角2
  'sw', // 左下角3
]

const parentRef = ref(null)
const cardRef = ref(null)
// const cornerRefs = ref(new Array(cornerList.length).fill(null))
const isResizing = ref<boolean>(false) // 正在被拖拽
const curCorner = ref<string>(null) // 当前被拖拽的角

const initialSize = ref({
  width: 0,
  height: 0,
  top: 0,
  left: 0,
})

const margin_num = 5
const min_width = 50

const parentWidth = ref(0)
const parentHeight = ref(0)
const parentTop = ref(0)
const parentLeft = ref(0)


const cardWidth = ref(100)
const cardHeight = ref(100)
const cardTop = ref(margin_num)
const cardLeft = ref(margin_num)


onMounted(() => {
  const parentRect = parentRef.value.getBoundingClientRect()
  const cardRect = cardRef.value.getBoundingClientRect()


  parentWidth.value = parentRect.width
  parentHeight.value = parentRect.height
  parentTop.value = parentRect.top
  parentLeft.value = parentRect.left

  cardWidth.value = cardRect.width
  cardHeight.value = cardRect.height
  cardTop.value = cardRect.top
  cardLeft.value = cardRect.left

  // // 初始化各个角落的ref
  // for (let i = 0; i < cornerList.length; i++) {
  //   cornerRefs.value[i] = ref(null)
  // }
});


// 鼠标按下去
function handleCornerMouseDown(e: any, corner: string) {
  isResizing.value = true
  curCorner.value = corner
  // 获取鼠标按下时的坐标和卡片的初始尺寸及位置
  const rect = cardRef.value.getBoundingClientRect()
  initialSize.value = {
    width: rect.width,
    height: rect.height,
    top: rect.top,
    left: rect.left,
  }
  document.addEventListener('mousemove', handleResizeMouseMove)
  document.addEventListener('mouseup', handleResizeMouseUp)
}

// 鼠标移动过程中
function handleResizeMouseMove(e: { clientX: any, clientY: any }) {
  if (!isResizing.value) return
  const { clientX, clientY } = e
  const diffX = clientX - initialSize.value.left
  const diffY = clientY - initialSize.value.top
  // console.log('diffX :>> ', diffX,diffY)

  // 根据拖动的是哪个角来调整宽高
  switch (curCorner.value) {
    // 左上角0
    case 'nw':
      cardWidth.value = initialSize.value.width - diffX
      cardHeight.value = initialSize.value.height - diffY
      cardTop.value = clientY
      cardLeft.value = clientX
      break
      // 右上角1
    case 'ne':
      cardWidth.value = diffX
      cardHeight.value = initialSize.value.height - diffY
      cardTop.value = clientY
      break
    // 右下角2 只改变宽高
    case 'se':
      cardWidth.value = diffX
      cardHeight.value = diffY
      break
    // 左下角3
    case 'sw':
      cardWidth.value = initialSize.value.width - diffX
      cardHeight.value = diffY
      cardLeft.value = clientX
      break
  }

  // console.log('object :>> ', cardWidth.value,cardHeight.value,cardTop.value,cardLeft.value)

  // 限制最小宽高
  if (cardWidth.value <= min_width) cardWidth.value = min_width
  if (cardHeight.value <= min_width) cardHeight.value = min_width
  // 限制左边和顶部范围
  if (cardTop.value <= parentTop.value + margin_num) cardTop.value = parentTop.value + margin_num
  if (cardLeft.value <= parentLeft.value + margin_num) cardLeft.value = parentLeft.value + margin_num
  // 限制右边和下边范围
  if (cardWidth.value >= parentWidth.value - cardLeft.value + parentLeft.value - margin_num) cardWidth.value = parentWidth.value - cardLeft.value + parentLeft.value - margin_num
  if (cardHeight.value >= parentHeight.value - cardTop.value + parentTop.value - margin_num) cardHeight.value = parentHeight.value - cardTop.value + parentTop.value - margin_num

}

// 鼠标弹起来
function handleResizeMouseUp() {
  isResizing.value = false
  curCorner.value = null
  document.removeEventListener('mousemove', handleResizeMouseMove)
  document.removeEventListener('mouseup', handleResizeMouseUp)
}


</script>

<style lang="less" scoped>
.page {
  position: relative;
  height: 600px;
  background: rgba(50, 50, 50, 0.1);
}

@margin: -2px;
@border: 2px solid #aaa;

.draggable-card {
  position: relative;
  border: 1px solid #ccc;
  background: #fff;

  .corner-item {
    position: absolute;
    width: 10px;
    height: 10px;

    &.nw {
      top: @margin;
      left: @margin;
      cursor: nwse-resize;
      border-top: @border;
      border-left: @border;
    }

    &.ne {
      top: @margin;
      right: @margin;
      cursor: nesw-resize;
      border-top: @border;
      border-right: @border;
    }

    &.se {
      bottom: @margin;
      right: @margin;
      cursor: nwse-resize;
      border-bottom: @border;
      border-right: @border;
    }

    &.sw {
      bottom: @margin;
      left: @margin;
      cursor: nesw-resize;
      border-bottom: @border;
      border-left: @border;
    }
  }
}


</style>
