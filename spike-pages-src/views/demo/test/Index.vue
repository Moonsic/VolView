<template>
  <div ref="container" class="container" @mousedown="startSelection" @mousemove="selecting" @mouseup="endSelection">
    <div v-for="(block, index) in blocks" :key="index" class="block" :style="getBlockStyle(block)" @click="toggleBlock(index)">
      {{ block.id }}
    </div>
    <div v-if="isSelecting" class="selection-box" :style="getSelectionBoxStyle()"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue';

const container = ref(null);
const isSelecting = ref(false);
const startX = ref(0);
const startY = ref(0);
const endX = ref(0);
const endY = ref(0);

interface Block {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  selected: boolean;
}

const blocks = reactive<Block[]>([
  { id: 1, x: 50, y: 50, width: 40, height: 40, selected: false },
  { id: 2, x: 150, y: 50, width: 40, height: 40, selected: false },
  { id: 3, x: 250, y: 50, width: 40, height: 40, selected: false },
  { id: 4, x: 350, y: 50, width: 40, height: 40, selected: false },
  { id: 5, x: 450, y: 50, width: 40, height: 40, selected: false },
  { id: 6, x: 50, y: 150, width: 40, height: 40, selected: false },
  { id: 7, x: 150, y: 150, width: 40, height: 40, selected: false },
  { id: 8, x: 250, y: 150, width: 40, height: 40, selected: false },
  { id: 9, x: 350, y: 150, width: 40, height: 40, selected: false },
  { id: 10, x: 450, y: 150, width: 40, height: 40, selected: false },
  { id: 11, x: 50, y: 250, width: 40, height: 40, selected: false },
  { id: 12, x: 150, y: 250, width: 40, height: 40, selected: false },
  { id: 13, x: 250, y: 250, width: 40, height: 40, selected: false },
  { id: 14, x: 350, y: 250, width: 40, height: 40, selected: false },
  { id: 15, x: 450, y: 250, width: 40, height: 40, selected: false },
  { id: 16, x: 50, y: 350, width: 40, height: 40, selected: false },
  { id: 17, x: 150, y: 350, width: 40, height: 40, selected: false },
  { id: 18, x: 250, y: 350, width: 40, height: 40, selected: false },
  { id: 19, x: 350, y: 350, width: 40, height: 40, selected: false },
  { id: 20, x: 450, y: 350, width: 40, height: 40, selected: false },
]);

function startSelection(event: MouseEvent) {
  if (!container.value) return;

  const rect = container.value.getBoundingClientRect();
  startX.value = event.clientX - rect.left;
  startY.value = event.clientY - rect.top;
  endX.value = startX.value;
  endY.value = startY.value;
  isSelecting.value = true;
}

function selecting(event: MouseEvent) {
  if (!container.value || !isSelecting.value) return;

  const rect = container.value.getBoundingClientRect();
  endX.value = event.clientX - rect.left;
  endY.value = event.clientY - rect.top;

  // Update selection during dragging
  const selectionRect = getBoundingClientRect(startX.value, startY.value, endX.value, endY.value);

  blocks.forEach((block) => {
    const blockRect = getBoundingClientRect(block.x, block.y, block.x + block.width, block.y + block.height);
    block.selected = intersects(selectionRect, blockRect);
  });
}

function endSelection() {
  if (!isSelecting.value) return;

  isSelecting.value = false;
}

function toggleBlock(index: number) {
  blocks[index].selected = !blocks[index].selected;
}

function getBlockStyle(block: Block) {
  return {
    left: `${block.x}px`,
    top: `${block.y}px`,
    width: `${block.width}px`,
    height: `${block.height}px`,
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
  width: 600px; /* Set your desired width */
  height: 400px; /* Set your desired height */
  background-color: #f0f0f0;
  margin: 50px auto; /* Center the container horizontally and add some top margin */
  overflow: hidden;
}

.block {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
}

.selection-box {
  position: absolute;
  border: 2px dashed #0000ff;
  background: rgba(0, 0, 255, 0.1);
  pointer-events: none; /* Make sure the selection box does not interfere with mouse events */
}
</style>



