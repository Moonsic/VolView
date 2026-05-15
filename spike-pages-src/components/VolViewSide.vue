<template>

  <div class="volview-function-page">

    <div class="bg-color grid-1 mb8">
      <a-button class="text-bold" v-if="showResliceCursor" type="default" size="small" shape="round"
        :disabled="!props.disabled" @click="setShowResliceCursor(false)">
        {{ t('隐藏十字线&滑动条') }}
      </a-button>
      <a-button class="text-bold" v-if="!showResliceCursor" type="default" size="small" shape="round"
        :disabled="!props.disabled" @click="setShowResliceCursor(true)">
        {{ t('显示十字线&滑动条') }}
      </a-button>
      <a-button class="text-bold" type="default" size="small" shape="round" :disabled="!props.disabled"
        @click="restartView">
        {{ t('加载结构像') }}
      </a-button>
      <a-button class="text-bold" type="default" size="small" shape="round" :disabled="!props.disabled"
        @click="resetView()">
        {{ t('回到中心点') }}
      </a-button>
    </div>

    <div class="left-mouse-function-box bg-color mb8">

      <div :class="{ 'mb122': curDragFunction === 'WindowLevel' }">
        <!-- <span class="text-bold">左键拖拽：</span> -->

        <a-tooltip placement="top" color="#333" :title="item.label" v-for="(item, index) in dragFunctionList"
          :key="index">

          <a-button class="mr8" :style="{ background: item.value === curDragFunction ? 'var(--color-primary-02)' : '' }"
            type="default" size="small" :disabled="!props.disabled" @click="dragFunction(item.value)">
            <template #icon>
              <StopOutlined v-if="item.value === 'Close'" />

              <span v-if="item.value === 'WindowLevel'" class="anticon">
                <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
                  <path fill-opacity="0.8"
                    d="M16 512c0 273.932 222.066 496 496 496s496-222.068 496-496S785.932 16 512 16 16 238.066 16 512z m496 368V144c203.41 0 368 164.622 368 368 0 203.41-164.622 368-368 368z">
                  </path>
                </svg>
              </span>

              <span v-if="item.value === 'Pan'" class="anticon">
                <svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor">
                  <path
                    d="M1013.333333 486.4l-153.6-153.6c-10.666667-10.666667-27.733333-2.133333-27.733333 10.666667v132.266666H544V189.866667h132.266667c14.933333 0 21.333333-17.066667 10.666666-27.733334L533.333333 8.533333c-12.8-12.8-32-12.8-44.8 0l-153.6 153.6c-10.666667 10.666667-2.133333 27.733333 10.666667 27.733334h132.266667v285.866666L192 477.866667v-132.266667c0-14.933333-17.066667-21.333333-27.733333-10.666667L10.666667 488.533333c-12.8 12.8-12.8 32 0 44.8l153.6 153.6c10.666667 10.666667 27.733333 2.133333 27.733333-10.666666v-132.266667h285.866667v285.866667h-132.266667c-14.933333 0-21.333333 17.066667-10.666667 27.733333l153.6 153.6c12.8 12.8 32 12.8 44.8 0l153.6-153.6c10.666667-10.666667 2.133333-27.733333-10.666666-27.733333h-132.266667V544H832v132.266667c0 14.933333 17.066667 21.333333 27.733333 10.666666l153.6-153.6c10.666667-12.8 10.666667-34.133333 0-46.933333z">
                  </path>
                </svg>
              </span>

              <!-- <DragOutlined v-if="item.value === 'Pan'" style="transform: scale(1.2);" /> -->
              <ZoomInOutlined v-if="item.value === 'Zoom'" />

            </template>
          </a-button>
        </a-tooltip>
        <Question placement="topRight" :title="t('选中图标后，可通过鼠标左键在结构像上滑动进行明暗调整、移动或放大缩小。')" />
      </div>

    </div>

    <!-- <div class="bg-color mb8">
      <slot name="leftMouse"></slot>
    </div> -->

    <div class="bg-color mb8">
      <div class="text-bold mb8">{{ t('调节明暗') }}：</div>
      <div>
        {{ t('窗宽') }}
        <Question :title="t('窗宽（Window）控制结构像的对比度，上下滑动可快速调节')" /> ：
      </div>
      <div class="flex-between">
        <a-slider class="widthP100 mr16" v-model:value="windowLocal" :min="minNew" :max="maxNew"
          @change="changeWindow" />
        <a-input-number style="width: 140px;" v-model:value="windowLocal" :min="minNew" :max="maxNew"
          @change="changeWindow" />
      </div>
      <div>
        {{ t('窗位') }}
        <Question :title="t('窗位（Level）控制结构像的亮度，左右滑动可快速调节')" /> ：
      </div>
      <div class="flex-between">
        <a-slider class="widthP100 mr16" v-model:value="levelLocal" :min="minNew" :max="maxNew" @change="changeLevel" />
        <a-input-number style="width: 140px;" v-model:value="levelLocal" :min="minNew" :max="maxNew"
          @change="changeLevel" />
      </div>
    </div>



    <div class="bg-color select-layer" v-if="props.showSliceBox">
      <div class="title text-bold">{{ t('临床报告结构像层选择') }}：</div>

      <div class="mb16 flex-start">
        <div class="title">{{ t('自动截图间隔') }}：</div>
        <div class="item">
          <a-input-number class="input" v-model:value="steps" size="small" placeholder="" /> {{ t('层/图') }}
        </div>
      </div>

      <div class="item">
        <div class="left">{{ t('冠状面') }}：</div>
        <div class="right">
          <div>
            {{ t('第') }}<a-input-number class="input" v-model:value="yStart" size="small" placeholder="" />{{ t('层起') }}
            <a href="javascript:;" class="text-12 color-blue ml4" type="text" @click="autoInputY">{{ t('填入') }}</a>
          </div>
          <div>{{ t('第') }}<a-input-number class="input" v-model:value="yEnd" size="small" placeholder="" />{{ t('层止') }}</div>
          <div>{{ t('共') }} {{ yTotal }} {{ t('层') }}</div>
        </div>
      </div>
      <div class="item">
        <div class="left">{{ t('矢状面') }}：</div>
        <div class="right">
          <div>
            {{ t('第') }}<a-input-number class="input" v-model:value="xStart" size="small" placeholder="" />{{ t('层起') }}
            <a href="javascript:;" class="text-12 color-blue ml4" type="text" @click="autoInputX">{{ t('填入') }}</a>
          </div>
          <div>{{ t('第') }}<a-input-number class="input" v-model:value="xEnd" size="small" placeholder="" />{{ t('层止') }}</div>
          <div>{{ t('共') }} {{ xTotal }} {{ t('层') }}</div>
        </div>
      </div>
      <div class="item">
        <div class="left">{{ t('水平面') }}：</div>
        <div class="right">
          <div>
            {{ t('第') }}<a-input-number class="input" v-model:value="zStart" size="small" placeholder="" />{{ t('层起') }}
            <a href="javascript:;" class="text-12 color-blue ml4" type="text" @click="autoInputZ">{{ t('填入') }}</a>
          </div>
          <div>{{ t('第') }}<a-input-number class="input" v-model:value="zEnd" size="small" placeholder="" />{{ t('层止') }}</div>
          <div>{{ t('共') }} {{ zTotal }} {{ t('层') }}</div>
        </div>
      </div>

      <div class="text-center">
        <a-button class="light-primary-btn2" type="primary" ghost size="small" shape="round" :disabled="!props.disabled"
          @click="addMriSliceInReport">
          {{ t('保存临床报告结构像层') }}
        </a-button>

      </div>


      <!-- <div>{{ imageMetadata }}</div> -->

      <!-- <div>{{ imageMetadata.name }}</div> -->
      <!--
      <div>{{ imageMetadata.dimensions }}</div>
      <div class="mt8">{{ planeOrigin }}</div>
      <div class="mt8">{{ sliceDomain }}</div>


      <div class="mt8" v-if="imageMetadata.dimensions && planeOrigin">
        <div>1: {{ planeOrigin[1]?.toFixed(2) }}/{{ imageMetadata.dimensions[2] }}</div>
        <div>2: {{ planeOrigin[0]?.toFixed(2) }}/{{ imageMetadata.dimensions[0] }}</div>
        <div>3: {{ planeOrigin[2]?.toFixed(2) }}/{{ imageMetadata.dimensions[1] }}</div>
      </div> -->


      <!-- sliceList就是3个视图的切片 -->
      <!-- <div class="mt8" v-if="imageMetadata.dimensions && sliceList">
        <div>1: {{ sliceList.ObliqueCoronal }}/{{ imageMetadata.dimensions[2] }}</div>
        <div>2: {{ sliceList.ObliqueSagittal }}/{{ imageMetadata.dimensions[1] }}</div>
        <div>3: {{ sliceList.ObliqueAxial }}/{{ imageMetadata.dimensions[0] }}</div>
      </div> -->

      <!-- <div>{{ planeOrigin }}</div>
      <div>{{ planeOrigin }}</div> -->
      <!-- <div>{{ imageMetadata.worldBounds }}</div>
      <div>{{ imageMetadata.worldToIndex }}</div>
      <div>{{ imageMetadata.spacing }}</div> -->


    </div>


    <slot></slot>

  </div>

</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { debounce } from '@u/utils'

import {
  getMriSliceInReportApi, // 获取临床报告层
  addMriSliceInReportApi, // 添加临床报告层
} from '@/api/subject'

const { t } = useI18n()
const props = defineProps({
  disabled: {
    type: String,
    default: '',
  },
  subjectId: {
    type: String,
    default: '',
  },
  imageMetadata: {
    type: Object,
    default: {},
  },
  planeOrigin: {
    type: Array,
    default: [],
  },
  sliceDomain: {
    type: Object,
    default: {},
  },
  showSliceBox: {
    type: Boolean,
    default: false,
  },
  windowNew: {
    type: Number,
    default: 0,
  },
  levelNew: {
    type: Number,
    default: 0,
  },
  minNew: {
    type: Number,
    default: 0,
  },
  maxNew: {
    type: Number,
    default: 0,
  },
  sliceList: {
    type: Object,
    default: {
      ObliqueCoronal: 0,
      ObliqueSagittal: 0,
      ObliqueAxial: 0,
    },
  }
})

const emit = defineEmits(['switchFunction', 'setShowResliceCursor', 'restartView', 'resetView', 'update:windowNew', 'update:levelNew', 'changeWindow', 'changeLevel'])

const windowLocal = ref(0)
const levelLocal = ref(0)

// 监听 prop 变化更新本地值
watch(() => props.windowNew, (newVal) => {
  // console.log('watch windowNew :>> ', newVal)
  if (newVal !== windowLocal.value) {
    windowLocal.value = newVal
  }
})

// 监听 prop 变化更新本地值
watch(() => props.levelNew, (newVal) => {
  // console.log('watch levelNew :>> ', newVal)
  if (newVal !== levelLocal.value) {
    levelLocal.value = newVal
  }
})

// 使用防抖包装，给定时间内连续触发只执行最后一次
const changeWindow = debounce(() => {
  emit('changeWindow', windowLocal.value)
}, 10)

// 使用防抖包装，给定时间内连续触发只执行最后一次
const changeLevel = debounce(() => {
  emit('changeLevel', levelLocal.value)
}, 10)


const dragFunctionList = [
  // { label: '关闭拖拽', value: 'Close' },
  { label: t('调节明暗'), value: 'WindowLevel' },
  { label: t('移动'), value: 'Pan' },
  { label: t('缩放'), value: 'Zoom' },
]

const curDragFunction = ref('Close')

function dragFunction(value: string) {
  if (curDragFunction.value === value) {
    curDragFunction.value = 'Close'
  } else {
    curDragFunction.value = value
  }
  emit('switchFunction', curDragFunction.value)
}



// 显示十字线&滑动条
const showResliceCursor = ref(true)
function setShowResliceCursor(value: boolean) {
  showResliceCursor.value = value
  emit('setShowResliceCursor', value)
  // volviewRef.value.setShowResliceCursor(value)
}

// 加载结构像
function restartView() {
  emit('restartView')
}

function resetView() {
  emit('resetView')
}


const xStart = ref(0)
const xEnd = ref(0)

const yStart = ref(0)
const yEnd = ref(0)

const zStart = ref(0)
const zEnd = ref(0)

const xTotal = createRangeTotal(xStart, xEnd)
const yTotal = createRangeTotal(yStart, yEnd)
const zTotal = createRangeTotal(zStart, zEnd)

// 通用计算函数
function createRangeTotal(startRef: any, endRef: any) {
  return computed(() => {
    const start = Number(startRef.value)
    const end = Number(endRef.value)
    if (isNaN(start) || isNaN(end) || isNaN(steps.value) || end < start) {
      return 0
    }
    return Math.floor((end - start) / steps.value) + 1 // 等价，但deepseek说这样更好些
    // return Math.ceil((end - start + 1) / steps.value)
  })
}


onMounted(() => {
  if (props.showSliceBox) {
    getMriSliceInReport()
  }
})

async function getMriSliceInReport() {
  const params = {
    subjectId: props.subjectId,
  }
  let { code, data } = await getMriSliceInReportApi(params)
  if (code === 200) {
    xStart.value = data?.sagittalStart || 0
    xEnd.value = data?.sagittalEnd || 0
    yStart.value = data?.coronalStart || 0
    yEnd.value = data?.coronalEnd || 0
    zStart.value = data?.axialStart || 0
    zEnd.value = data?.axialEnd || 0
    steps.value = data?.steps || 2
  }
}

async function addMriSliceInReport() {
  if (!(yTotal.value > 0 && xTotal.value > 0 && zTotal.value > 0)) {
    return message.error(t('层数必须大于0'))
  }
  const params = {
    subjectId: props.subjectId,
    mriSliceInReport: {
      coronalStart: yStart.value,  // 冠状面 Y ( 将身体分为 前(腹侧) 和 后(背侧) 两部分)
      coronalEnd: yEnd.value,
      sagittalStart: xStart.value,  // 矢状面 X （将身体分为 左 和 右 两部分（正中矢状面位于正中间））
      sagittalEnd: xEnd.value,
      axialStart: zStart.value, // 水平面 Z （ 将身体分为 上(头侧) 和 下(尾侧) 两部分。
      axialEnd: zEnd.value,
      steps: steps.value,
    }
  }
  const { code, msg } = await addMriSliceInReportApi(params)
  if (code === 200) {
    message.success(msg + t('！提示: 结构像层修改后，请在溯源发起页面点击【生成报告】重新生成'))
  }
}

const steps = ref(2) // 自动截图间隔

// 自动填入
function autoInputY() {
  const slice = props.sliceList.ObliqueCoronal
  const num = Number(yTotal.value)
  yStart.value = slice
  if (num > 0) {
    yEnd.value = slice + (num - 1) * steps.value
  }
}

function autoInputX() {
  const slice = props.sliceList.ObliqueSagittal
  const num = Number(xTotal.value)
  xStart.value = slice
  if (num > 0) {
    xEnd.value = slice + (num - 1) * steps.value
  }
}
function autoInputZ() {
  const slice = props.sliceList.ObliqueAxial
  const num = Number(zTotal.value)
  zStart.value = slice
  if (num > 0) {
    zEnd.value = slice + (num - 1) * steps.value
  }
}


</script>

<style lang="less" scoped>
.volview-function-page {
  width: 240px;
  height: 100%;
  margin-left: 12px;
  border-radius: 8px;
  padding: 8px;
  padding-bottom: 66px; // 适配英文
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  overflow-y: scroll;
  background: var(--color-bg);
  border: var(--border-card);

  >.ant-btn,
  >span .ant-btn {
    margin-bottom: 8px;
  }
}

.grid-1 {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 8px;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 8px;
}



.select-layer {
  .title {
    margin-bottom: 8px;
  }

  .item {
    display: flex;

    .left {
      min-width: 60px; // 适配英文
    }

    .right {
      margin-bottom: 8px;

      >div {
        margin-bottom: 8px;

        .input {
          width: 60px;
          margin: 0 4px;
        }
      }
    }

  }
}

.input {
  width: 60px;
  margin: 0 4px;
}

.bg-color {
  background: var(--color-primary-005);
  padding: 8px;
  border-radius: 8px;
}

// .left-mouse-function-box {
//   // button {
//   //   margin-right: 2px;
//   // }
//   // button:last-child {
//   //   margin-right: 0;
//   // }
// }</style>
