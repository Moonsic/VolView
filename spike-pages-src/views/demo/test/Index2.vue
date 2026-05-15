<template>
  <div ref="container" class="container" @mousedown="startSelection" @mousemove="handleMouseMove" @mouseup="endSelection">
    <div v-for="(block, index) in blocks" :key="index" class="block" :style="getBlockStyle(block)" @click="toggleBlock(index)">
      {{ block.id }}
    </div>
    <div v-if="isDragging" class="selection-box" :style="getSelectionBoxStyle()"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';

const container = ref<HTMLDivElement | null>(null);
const isSelecting = ref(false);
const isDragging = ref(false);
const startX = ref(0);
const startY = ref(0);
const endX = ref(0);
const endY = ref(0);

interface Block {
  id: number;
  x: number;
  y: number;
  selected: boolean;
}

const blockWidth = 40; // 固定小方块的宽度为 40px
const blockHeight = 30; // 固定小方块的高度为 30px

const blocks = reactive<Block[]>(Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  x: Math.floor(Math.random() * 560), // 随机生成 x 坐标，确保在容器内
  y: Math.floor(Math.random() * 370), // 随机生成 y 坐标，确保在容器内
  selected: false,
})));

let rafId: number | null = null;

function startSelection(event: MouseEvent) {
  if (!container.value) return;

  const rect = container.value.getBoundingClientRect();
  startX.value = event.clientX - rect.left;
  startY.value = event.clientY - rect.top;
  endX.value = startX.value;
  endY.value = startY.value;
  isSelecting.value = true;
  isDragging.value = false; // 初始状态下不认为是在拖动

  // 短暂延迟判断是否为拖动操作
  setTimeout(() => {
    if (isSelecting.value && !isDragging.value) {
      isDragging.value = true;
    }
  }, 100); // 100ms 延迟，可以根据需要调整
}

function selecting(event: MouseEvent) {
  if (!container.value || !isSelecting.value) return;

  const rect = container.value.getBoundingClientRect();
  endX.value = event.clientX - rect.left;
  endY.value = event.clientY - rect.top;

  // Update selection during dragging
  const selectionRect = getBoundingClientRect(startX.value, startY.value, endX.value, endY.value);

  blocks.forEach((block) => {
    const blockRect = getBoundingClientRect(block.x, block.y, block.x + blockWidth, block.y + blockHeight);
    block.selected = intersects(selectionRect, blockRect);
  });

  isDragging.value = true; // 开始拖动后设置为true
}

function handleMouseMove(event: MouseEvent) {
  if (!isSelecting.value) return;

  if (rafId !== null) {
    cancelAnimationFrame(rafId);
  }

  rafId = requestAnimationFrame(() => {
    selecting(event);
  });
}

function endSelection() {
  if (!isSelecting.value) return;

  isSelecting.value = false;
  isDragging.value = false; // 结束选择后重置拖动状态
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

function toggleBlock(index: number) {
  if (!isDragging.value) {
    blocks[index].selected = !blocks[index].selected;
  }
  isDragging.value = false; // 结束选择后重置拖动状态
}

function getBlockStyle(block: Block) {
  return {
    left: `${block.x}px`,
    top: `${block.y}px`,
    backgroundColor: block.selected ? '#aaffaa' : '#ffffff',
    border: block.selected ? '2px solid #00ff00' : '1px solid #000000',
  };
}

function getSelectionBoxStyle() {
  const rect = getBoundingClientRect(startX.value, startY.value, endX.value, endY.value);
  return {
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
  };
}

function getBoundingClientRect(x1: number, y1: number, x2: number, y2: number) {
  const minX = Math.min(x1, x2);
  const minY = Math.min(y1, y2);
  const maxX = Math.max(x1, x2);
  const maxY = Math.max(y1, y2);
  return {
    left: minX,
    top: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

function intersects(rect1: any, rect2: any) {
  return (
    rect1.left <= rect2.left + rect2.width &&
    rect1.left + rect1.width >= rect2.left &&
    rect1.top <= rect2.top + rect2.height &&
    rect1.top + rect1.height >= rect2.top
  );
}
</script>

<style scoped>
.container {
  position: relative;
  width: 600px;
  height: 400px;
  background-color: #f0f0f0;
  margin: 50px auto;
  overflow: hidden;
}

.block {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
  width: 40px;
  height: 30px;
}

.selection-box {
  position: absolute;
  border: 2px dashed #0000ff;
  background: rgba(0, 0, 255, 0.1);
  pointer-events: none;
}
</style>



