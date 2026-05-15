<!--
 * @Description  : 返回组件，通常在详情页返回到列表页面时使用
-->
<template>

  <a-tooltip :placement="placement">
    <template #title> {{ props.title }} </template>
    <QuestionCircleOutlined class="cursor-pointer" :style="{ color: props.color }" />
  </a-tooltip>

</template>

<script lang="ts" setup>

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: 'var(--color-t4)',
  },
  placement: {
    type: String,
    default: 'top',
  },
})

</script>

<style lang="less" scoped></style>