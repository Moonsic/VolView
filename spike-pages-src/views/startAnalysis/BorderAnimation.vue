<template>
  <LottieAnimation class="border-animation" :class="props.type" :animation-data="animationData" :auto-play="true"
    :loop="true" :speed="0.5" />
</template>

<script lang="ts" setup>
import { LottieAnimation } from "lottie-web-vue"
import smallBorder from '@a/animation/smallBorder.json' // 引入动画JSON文件
import bigBorder from '@a/animation/bigBorder.json' // 引入动画JSON文件
import shortBorder from '@a/animation/shortBorder.json' // 引入动画JSON文件
import border200168 from '@a/animation/border200168.json' // 引入动画JSON文件
// import leftBorder from '@a/animation/leftBorder.json' // 引入动画JSON文件
// import rightBorder from '@a/animation/rightBorder.json' // 引入动画JSON文件
// import leftBorder from '@a/animation/hLeftBorder.json' // 引入动画JSON文件
// import rightBorder from '@a/animation/hRightBorder.json' // 引入动画JSON文件

const props = defineProps({
  type: {
    type: String,
    default: 'small', // small,big,left,right,short
  },
})

const animationData = computed(() => {
  return {
    'small': smallBorder,
    'big': bigBorder,
    'short': shortBorder,
    'square': border200168,
    // 'left': leftBorder,
    // 'right': rightBorder,
  }[props.type]
})

</script>

<style lang="less" scoped>
.border-animation {
  position: absolute;
  transform-origin: center;

  &.small {
    width: 192px;
    height: 52px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1.14);
  }

  &.big {
    width: 192px;
    height: 84px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1.06);
  }

  &.square {
    width: 200px;
    height: 168px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1.03);
    z-index: -1; // 否则盖住内容无法点击
  }

  &.left {
    top: 170px;
    left: 245px;
  }

  &.right {
    top: 61px;
    left: 724px
  }

  &.short {
    right: -52px;
    top: 50%;
    transform: translateY(-50%) rotate(-90deg);
  }

}
</style>
