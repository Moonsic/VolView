<template>
  <div class="volview-function-page flex-start">

    <a-button class="mr4" v-if="showResliceCursor" type="default" size="small" :disabled="!props.disabled"
      @click="setShowResliceCursor(false)">
      {{ t('隐藏十字线&滑动条') }}
    </a-button>
    <a-button class="mr4" v-if="!showResliceCursor" type="default" size="small" :disabled="!props.disabled"
      @click="setShowResliceCursor(true)">
      {{ t('显示十字线&滑动条') }}
    </a-button>
    <a-button class="mr4" type="default" size="small" :disabled="!props.disabled" @click="restartView">
      {{ t('加载结构像') }}
    </a-button>
    <a-button class="mr8" type="default" size="small" :disabled="!props.disabled" @click="resetView()">
      {{ t('回到中心点') }}
    </a-button>

    <!-- <a-divider type="vertical" class="ml8 mr8" style="background-color: #555;" /> -->

    <a-tooltip placement="top" color="#333" :title="item.label" v-for="(item, index) in dragFunctionList" :key="index">

      <a-button class="mr4 tooltip-button"
        :style="{ background: item.value === curDragFunction ? 'var(--color-primary-068)' : '', borderColor: item.value === curDragFunction ? 'var(--color-primary-068)' : '' }"
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


    <Question class="text-12" color="var(--white-t4)" placement="top"
      :title="t('选中图标后，可通过鼠标左键在结构像上滑动进行明暗调整、移动或放大缩小。')" />

  </div>

</template>

<script lang="ts" setup>

const { t } = useI18n()
const props = defineProps({
  disabled: {
    type: String,
    default: 'true',
  },

})

const emit = defineEmits(['switchFunction', 'setShowResliceCursor', 'restartView', 'resetView'])

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


</script>

<style lang="less" scoped>
.volview-function-page {
  background: #17181B;
  padding: 4px;

  .ant-btn.ant-btn-sm {
    height: 22px;
    line-height: 19px;
    font-size: 11px;
    background: #17181B;
    color: #eee;
    border: 1px solid #555;
    padding: 0 7px;

    &.tooltip-button {
      width: 26px;
      padding: 0 2px;
    }

    &:hover {
      background: #222;
      border: 1px solid #777;
    }
  }
}
</style>
