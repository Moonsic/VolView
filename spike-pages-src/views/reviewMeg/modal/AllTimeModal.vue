<template>
  <DragCard v-if="visible" class="drag-modal" ref="dragCardRef" :width="cardWidth" :height="cardHeight" :left="cardLeft"
    :top="cardTop" :zIndex="zIndex" :marginTop="marginTop" @drag="dragModal" @startDrag="startDragModal"
    @endDrag="endDragModal" @close="closeModal">

    <div class="card-body">
      <div class="card-title flex-between widthP100">
        <div class="flex-start title-left">
          <span class="text-11">{{ t('全局时刻点') }}</span>
          <!-- <div class="modal-type-center">
            <span class="text-11">全局时刻点</span>
          </div> -->
        </div>
      </div>
      <!-- <div style="position: absolute; z-index:999">{{ cardWidth }} {{ cardHeight }}</div> -->

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
        </div>
        <div class="right"> {{ props.tmax }}</div>
      </div>

    </div>

  </DragCard>
</template>

<script lang="ts" setup>
import { useDraggable } from '@vueuse/core'

import { debounce } from '@u/utils'
import DragCard from '../parts/DragCard.vue'

import {
} from '@/api/meg'

const { t } = useI18n()

const props = defineProps({
  startTime: {
    type: Number,
    default: 0,
  },
  subjectId: {
    type: String,
    default: '',
  },
  curTime: {
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
  allSpikeList: {
    type: Array as PropType<any[]>,
    default: [],
  },

})


const emit = defineEmits(['openViewModal', 'setStartTime', 'clickAllSpikeList'])

// 弹窗可拖动
const dragCardRef = ref(null)

function getPositionSize() {
  return {
    ...dragCardRef.value.getPositionSize(),
  }
}


const cardWidth = ref(600)
const cardHeight = ref(75)
const cardLeft = ref(270)
const cardTop = ref(94)
const zIndex = ref<number>(0) // 卡片层级，用于拖拽时始终在最上方
const marginTop = 0

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
  cardWidth.value = res.cardWidth
  cardHeight.value = res.cardHeight
}

// 结束拖拽
function endDragModal() {
  // 原来在这里的缩放大小，改成在拖拽时防抖触发
}


// 关闭弹窗
function closeModal() {
  visible.value = false
}


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


function clickAllSpikeList(item: any) {
  emit('clickAllSpikeList', item)
}


const visible = ref<boolean>(false)

// 显示弹窗
async function showModal(zIndexValue: number, cardParams: any, cb?: () => {}) {
  visible.value = true
  zIndex.value = Number(zIndexValue + 100)

  // 如果有卡片大小位置信息，就设置
  if (cardParams) {
    cardWidth.value = cardParams.cardWidth
    cardHeight.value = cardParams.cardHeight - marginTop
    cardLeft.value = cardParams.cardLeft
    cardTop.value = cardParams.cardTop
  }

}

// 暴露方法
defineExpose({
  visible,
  showModal,
  setZIndex,
  getPositionSize,
})

</script>

<style lang="less" scoped>
// @import '../style/line.less';

.card-body {
  width: 100%;
  position: relative;

  .card-title {
    position: absolute;
    top: -24px;
    left: 4px;
    color: var(--black-t2);
  }
}

.all-spike-list {

  height: 17px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2px 62px 0;
  margin-top: 25px;

  font-size: 12px;
  position: relative;
  color: var(--black-t2);

  .item {
    width: 2px;
    height: 8px;
    cursor: pointer;
    position: absolute;
    transform: translateX(-50%);

    &.item-alg {
      top: 0px;
      background: #4DA8B7;
      // background: var(--color-title-bg-green); // 暗黑模式下也用亮色比较好

      &:hover,
      &.active {
        top: -1px;
        border: #4DA8B7 1px solid;
      }

    }

    &.item-manual {
      top: 9px;
      background: #6172C9;
      // background: var(--color-title-bg-purple);

      &:hover,
      &.active {
        border: #6172C9 1px solid;
      }

    }

    &:hover {
      height: 9px;
    }


    &.active {
      width: 3px;
      background: #fff;
      height: 9px;
    }
  }

  .spike-tooltip {

    &::before {
      content: attr(data-title);
      position: absolute;
      display: none; // 默认不显示
      align-items: center;
      height: 18px;
      padding: 0 4px;
      font-size: 11px;
      // background-color: rgba(83, 29, 231, 0.9);
      border: var(--border-transparent);
      color: #fff;
      white-space: nowrap;
      z-index: 9999;
      border-radius: 4px;

      left: 50%;
      top: -24px;
      transform: translateX(-50%);
    }

    &:hover::before {
      display: flex;
    }

    &.item-alg::before {
      background-color: rgba(38, 121, 137, 1);
    }

    &.item-manual::before {
      background-color: rgb(79, 94, 169);
    }
  }

}

.all-time-list {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1px 0px 0;
  font-size: 12px;
  color: var(--black-t2);

  .left,
  .right {
    min-width: 60px;
  }

  .left {
    text-align: right;
    padding-right: 4px;
  }

  .right {
    text-align: left;
    padding-left: 4px;
  }

  .time-list {
    display: flex;
    align-items: center;
    width: 100%;

    .item {
      flex: 1;
      background: var(--color-primary-02);
      height: 12px;
      min-width: 0.1px; // 改成0.1px，就不怕窗口宽度小的情况了
      cursor: pointer;
      border-radius: 1px;

      &:hover {
        background: var(--color-primary);
        height: 14px;
      }

      &.short-item:not(:last-child) {
        margin-right: 1px;
      }

      &.active {
        background: var(--color-primary);
      }
    }

    .time-tooltip {
      position: relative;

      &::before {
        content: attr(data-title);
        position: absolute;
        display: none;
        align-items: center;
        height: 22px;
        padding: 0 6px;
        font-size: 13px;
        background-color: rgba(17, 17, 17, 0.9);
        // background-color: var(--color-primary);
        border: var(--border-transparent);
        color: #fff;
        white-space: nowrap;
        z-index: 99;
        border-radius: 4px;

        left: 50%;
        top: -26px;
        transform: translateX(-50%);
      }

      &:hover::before {
        display: flex;
      }

    }
  }
}




.chart-dark {

  .card-title {
    color: var(--white-t2);
  }

  .all-spike-list {
    color: var(--white-t2);

    .item {

      &.active {
        background: #fff;
      }
    }

  }

  .all-time-list {
    color: var(--white-t2);

    .time-list {

      .item {
        background: var(--color-primary-068);

        &:hover {
          background: var(--color-primary);
        }

        &.active {
          background: var(--color-primary);
        }
      }

      .time-tooltip {

        &::before {
          background-color: var(--color-primary);
          color: #fff;
        }

      }
    }
  }

}
</style>
