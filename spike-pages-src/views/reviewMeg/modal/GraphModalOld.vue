<template>
  <div v-if="visible" class="drag-modal" ref="modalRef" :style="modalStyle">
    <div class="modal-title flex-between" ref="titleRef">
      <span> 拓扑图（{{ graphTime }}）</span>
      <close-outlined class="text-12" @click="closeModal" />
    </div>
    <a-spin :spinning="!graphImg" style="height: 200px;">
      <img class="img" :src="graphImg" alt="" draggable="false" @click.stop="previewImg(graphImg)">
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
import { useDraggable } from '@vueuse/core'
import { previewImg } from '@u/preview'

import {
  getTopoGraphApi, // 获取拓扑图的接口
} from '@/api/meg'

const emit = defineEmits(['success'])

// 弹窗可拖动
const modalRef = ref(null)
const titleRef = ref(null)

const { style: modalStyle } = useDraggable(titleRef, {
  initialValue: { x: 330, y: 120 }, // 弹窗的位置，图表区域内左侧
})

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
  showModal
})

</script>

<style lang="less" scoped>
.drag-modal {
  position: fixed;
  z-index: 999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  max-width: 400px;
  min-width: 224px;
  min-height: 254px;
  background: var(--color-bg);

  .modal-title {
    height: 30px;
    padding: 0 8px;
    font-weight: 600;
    border-bottom: var(--border);
    cursor: move;
  }

  .img {
    min-width: 224px;
    display: block;
    cursor: zoom-in;
  }
}
</style>

