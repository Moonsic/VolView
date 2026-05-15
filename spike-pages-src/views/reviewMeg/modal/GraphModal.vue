<template>

  <DragCard v-if="visible" ref="dragCradRef" :width="cardWidth" :height="cardHeight" :left="cardLeft" :top="cardTop"
    :zIndex="zIndex" :marginTop="marginTop" :title="`${t('拓扑图')}（${graphTime}）`" @close="closeModal">

    <a-spin :spinning="!graphImg" style="height: 300px;">
      <img class="img" :src="graphImg" alt="" draggable="false" @click.stop="previewImg(graphImg)">
    </a-spin>

  </DragCard>

</template>

<script lang="ts" setup>
import { previewImg } from '@u/preview'
import DragCard from '../parts/DragCard.vue'

import {
  getTopoGraphApi, // 获取拓扑图的接口
} from '@/api/meg'

const { t } = useI18n()

const emit = defineEmits(['success'])

const cardWidth = ref(400)
const cardHeight = ref(400)
const cardLeft = ref(335)
const cardTop = ref(110)
const zIndex = ref<number>(2) // 卡片层级，用于拖拽时始终在最上方
const marginTop = 20

const visible = ref<boolean>(false)
const graphImg = ref<string>(null)
const graphTime = ref<number>(null)

// 显示弹窗
async function showModal(record: any) {
  visible.value = true
  graphTime.value = record.curTime

  const params = {
    timeSec: String(record.curTime), // 以字符串形式传递
    filePath: record.filePath,       // 文件路径
    subjectId: record.subjectId
  }
  const { code, data } = await getTopoGraphApi(params)
  if (code === 200) {
    graphImg.value = `data:image/png;base64,${data}`
  }
}

// 关闭弹窗
function closeModal() {
  graphImg.value = null
  graphTime.value = null
  visible.value = false
}

// 暴露方法
defineExpose({
  visible,
  showModal
})

</script>

<style lang="less" scoped>
.img {
  width: 100%;
  height: 100%;
  display: block;
  cursor: zoom-in;
}
</style>
