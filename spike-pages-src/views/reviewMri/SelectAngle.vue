<template>
  <div class="select-angle-page">
    <div class="big-circle" @mousedown="startDragging" @mouseup="stopDragging"
      @mousemove="handleMouseMoveWhileDragging">
      <div class="zero-circle" @click="setZero"></div>
      <div class="long-line" :style="{ transform: `rotate(${selectedAngle}deg)` }"></div>
      <div class="line1"></div>
      <div class="line2"></div>
      <div class="small-circle"></div>
      <div class="center-circle"></div>
    </div>
    <div class="angle-value">{{ selectedAngle }}°</div>
    <div class="direction-value">{{ props.direction }}</div>
  </div>
</template>

<script lang="ts" setup>

const props = defineProps({
  direction: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['change']);

// 用于存储当前选择的角度
const selectedAngle = ref(0);
// 用于引用要旋转的目标元素
const targetElementRef = ref(null);
// 标记是否正在拖动
const isDragging = ref(false);

// 根据点击位置计算角度的函数，调整为以0度在上方为基准
const selectAngle = (event: any) => {
  const rect = event.target.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const clickX = event.clientX;
  const clickY = event.clientY;


  // 计算鼠标位置与圆心的距离
  const distanceToCenter = Math.sqrt(
    Math.pow(clickX - centerX, 2) + Math.pow(clickY - centerY, 2)
  );

  // 设置圆环的内半径和外半径（这里假设圆环宽度为20px，可根据需要调整）
  const innerRadius = 80 * 2 * 0.15; // 这里的80就是大圆环的半径，下面css改的话，这里也要改
  const outerRadius = Math.min(rect.width, rect.height) / 2;


  // 只有当鼠标位置在圆环区域内（距离在内外半径之间）时才进行角度计算
  if (!(distanceToCenter >= innerRadius && distanceToCenter <= outerRadius)) {
    return
  }

  // 使用反正切函数计算角度，并转换为度，调整为0度在上方的坐标系
  let angle = Math.atan2(clickY - centerY, clickX - centerX);
  angle = (angle * (180 / Math.PI) + 90) % 360;
  selectedAngle.value = parseFloat(angle.toFixed(2));

  // 将选择的角度应用到目标元素上使其旋转
  if (targetElementRef.value) {
    targetElementRef.value.style.transform = `rotate(${selectedAngle.value}deg)`;
  }

  emit('change', selectedAngle.value)
};

// 鼠标按下开始拖动的函数
const startDragging = (event: any) => {
  isDragging.value = true;
  selectAngle(event);
};

// 鼠标松开停止拖动的函数
const stopDragging = () => {
  isDragging.value = false;
};

// 在拖动过程中处理鼠标移动的函数
const handleMouseMoveWhileDragging = (event: any) => {
  if (isDragging.value) {
    selectAngle(event);
  }
};

// 点击0度时重置角度
const setZero = () => {
  selectedAngle.value = 0
  emit('change', selectedAngle.value)
}


// 暴露方法
defineExpose({
  setData
})

function setData(angle: number) {
  selectedAngle.value = angle
}
</script>

<style lang="less" scoped>
.select-angle-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  cursor: pointer;
}

@radius: 80px;

.big-circle {
  width: @radius * 2;
  height: @radius * 2;
  border-radius: 50%;
  background-color: rgba(120, 120, 120, 0.4);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}


.small-circle {
  width: @radius * 0.6;
  height: @radius * 0.6;
  border-radius: 50%;
  background-color: rgba(200, 200, 200, 0.1);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  cursor: not-allowed;
}

.center-circle {
  width: @radius * 0.15;
  height: @radius * 0.15;
  border-radius: 50%;
  // background-color: rgba(10, 10, 10, 0.8);
  background-color: rgba(240, 240, 240, 0.8);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  cursor: not-allowed;
}

.zero-circle {
  width: @radius * 0.1;
  height: @radius * 0.1;
  border-radius: 50%;
  background-color: rgba(240, 240, 240, 0.3);
  color: #fff;
  font-size: 12px;
  position: absolute;
  left: 50%;
  top: 0;
  transform: translate(-50%, -50%);
  &:hover {
    transform: translate(-50%, -50%) scale(1.5);
  }
}

.long-line {
  width: 2px;
  height: @radius * 0.7;
  margin-top: -@radius * 0.7;
  margin-left: -1px;
  background-color: rgba(240, 240, 240, 0.8);
  position: absolute;
  left: 50%;
  top: 50%;
  transform-origin: bottom center;
}

.angle-value {
  margin-top: 10px;
  color: #fff;
  position: absolute;
  bottom: 10px;
  z-index: -1;
  font-size: 12px;
}


.direction-value {
  margin-top: 10px;
  color: #fff;
  position: absolute;
  top: -12px;
  left: 0px;
  z-index: -1;
  font-size: 12px;
}

.line1 {
  width: @radius * 2;
  height: 1px;
  background-color: rgba(20, 20, 20, 0.6);
  // border: 1px dashed rgba(20, 20, 20, 0.8);

  position: absolute;
  z-index: -1;
}

.line2 {
  width: 1px;
  height: @radius * 2;
  background-color: rgba(20, 20, 20, 0.6);
  // border: 1px dashed rgba(20, 20, 20, 0.8);
  position: absolute;
  z-index: -1;
}
</style>