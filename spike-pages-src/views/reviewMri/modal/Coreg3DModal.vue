<template>
  <DragCard v-if="visible" :width="cardWidth" :height="cardHeight" :left="cardLeft" :top="cardTop" :zIndex="100"
    :marginTop="20" :title="t('3D头皮配准结果')" :draggable="false" @close="closeModal">

    <div class="card-body">
      <Helmet ref="helmetRef" :coregId="props.coregId" />
    </div>

  </DragCard>
</template>

<script lang="ts" setup>

import DragCard from '@/views/reviewMeg/parts/DragCard.vue'
import Helmet from './Helmet.vue'

const { t } = useI18n()

const props = defineProps({
  coregId: {
    type: String,
    default: '',
  },
})

const helmetRef = ref(null)

const cardWidth = ref(600)
const cardHeight = ref(600)
const cardLeft = ref(270)
const cardTop = ref(90)

const visible = ref<boolean>(false)

// 显示弹窗
async function showModal(record: {}) {
  // 如果已经打开，就不再请求接口
  if (!visible.value) {
    visible.value = true

    nextTick(() => {
      helmetRef.value.getData(record) // 获取头盔数据
    })
  }
}

// 关闭弹窗
function closeModal() {
  visible.value = false
}

function changePosition(direction: 'x' | 'y' | 'z', num: number) {
  helmetRef.value?.changePosition(direction, num)
}
function rotatePosition(direction: 'x' | 'y' | 'z', num: number) {
  helmetRef.value?.rotatePosition(direction, num)
}

// 暴露方法
defineExpose({
  visible,
  showModal,
  changePosition,
  rotatePosition,
  closeModal,
})

</script>

<style lang="less" scoped>
.card-body {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
}
</style>
