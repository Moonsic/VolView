<template>
  <DragCard v-if="visible" :width="cardWidth" :height="cardHeight" :left="cardLeft" :top="cardTop" :zIndex="100"
    :marginTop="20" :title="t('配准结果')" :draggable="false" @close="closeModal">

    <div class="card-body">
      <Helmet ref="helmetRef" :coregId="props.coregId" />
    </div>

  </DragCard>
</template>
<!-- 工程师版本能看到这个3D头盔弹窗，不能删 -->
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
const cardLeft = ref(652)
const cardTop = ref(110)

const visible = ref<boolean>(false)

// 显示弹窗
async function showModal() {
  // 如果已经打开，就不再请求接口
  if (!visible.value) {
    visible.value = true

    nextTick(() => {
      helmetRef.value.getData() // 获取头盔数据
    })
  }
}

// 关闭弹窗
function closeModal() {
  visible.value = false
}

// 暴露方法
defineExpose({
  showModal
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
