<template>
  <IconWait class="icon color-t4" v-if="props.type === -2" />

  <span class="anticon icon color-red" v-if="props.type === -1">
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="34" r="2" fill="#E2655E" />
      <path
        d="M23.9999 18.6007V27.6007M10.1902 40.2008H37.8098C41.0002 40.2008 43.0168 36.8587 41.4674 34.1391L27.6576 9.89944C26.0634 7.10123 21.9366 7.10123 20.3424 9.89944L6.53257 34.1391C4.98319 36.8587 6.99983 40.2008 10.1902 40.2008Z"
        stroke="#E2655E" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </span>

  <span class="anticon icon color-green" v-if="props.type === 1">
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48" fill="none">
      <circle cx="24.0003" cy="24.0003" r="22.2757" fill="#CBFEB4" fill-opacity="0.2" />
      <circle cx="23.9992" cy="23.9992" r="18.8839" fill="#ABF78A" fill-opacity="0.2" />
      <circle cx="24.0008" cy="24.0008" r="15.077" fill="#14280B" fill-opacity="0.2" />
      <circle cx="24.0008" cy="24.0008" r="15.077" fill="#60CD2F" />
      <path d="M15.5391 26.0832L20.8401 30.3703C20.9808 30.4841 21.1858 30.4689 21.3082 30.3356L31.7246 18.9941"
        stroke="white" stroke-width="3.77143" stroke-linecap="round" />
    </svg>
  </span>

  <LottieAnimation v-if="props.type === 0" class="border-animation" :animation-data="animationData" :auto-play="true"
    :loop="true" :speed="1.5" />

  <!-- <IconCheck class="icon color-blue" v-if="props.type === 0" /> -->

</template>

<script lang="ts" setup>
import { LottieAnimation } from "lottie-web-vue"
import success from '@a/animation/success.json' // 引入动画JSON文件
import going from '@a/animation/going.json' // 引入动画JSON文件

const props = defineProps({
  type: {
    type: Number,
    default: -2,
  },
})

// '-2': 'status-no-start', // 灰
//     '-1': 'status-error', // 红
//     '0': 'status-going', // 黄
//     '1': 'status-success', // 绿

const animationData = computed(() => {
  return {
    '1': success,
    '0': going,
  }[props.type]
})

</script>

<style lang="less" scoped>
.icon {
  font-size: 48px;
}

.border-animation {
  width: 100px;
  height: 70px;
}
</style>
