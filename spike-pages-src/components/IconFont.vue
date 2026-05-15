<template>
  <svg :class="'icon ' + props.iconClass">
    <use :xlink:href="'#icon-' + props.type" :style="{ fill: props.color }"></use>
  </svg>
  <!-- <use :xlink:href="'#icon-' + props.type" :style="{ fill: props.hoverColor ? props.hoverColor : props.color }" ></use> -->
  <!-- <use :href="iconUrl" :style="{ fill: hover ? 'purple' : 'gray' }" @mouseover="hover = true" @mouseout="hover = false"></use> -->
</template>

<script lang="ts" setup>

const props = defineProps({
  type: {
    type: String,
    default: '',
  },
  iconClass: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: '',
  },
  hoverColor: {
    type: String,
    default: '',
  },
})

</script>

<style lang="less" scoped>
/*自定义单组件样式*/
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.icon svg {
  width: 100%;
  height: 100%;
}
</style>