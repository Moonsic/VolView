<template>
  <div class="view-page" :style="{ maxWidth: cardWidth + 'px', height: cardHeight + 'px' }">
    <div class="left">
        <img v-if="props.leftScreenshot" :src="props.leftScreenshot" alt="" />
    </div>
    <div class="right">
      <div class="img-list">

        <!-- <div class="item" v-for="(item,index) in props.screenshotList" :key="index">
          <img :src="item" alt="" />
        </div> -->

        <div class="item" v-if="props.screenshotList[0]">
          <img :src="props.screenshotList[0]" alt="" />
        </div>
        <div class="item" v-if="props.screenshotList[1]">
          <img :src="props.screenshotList[1]" alt="" />
        </div>
        <div class="item" v-if="props.screenshotList[2]">
          <img :src="props.screenshotList[2]" alt="" />
        </div>
        <div class="item" v-if="props.screenshot3D">
          <img :src="props.screenshot3D" alt="" />
        </div>
      </div>
    </div>

  </div>

</template>

<script lang="ts" setup>

const props = defineProps({
  leftScreenshot: {
    type: String,
    default: '',
  },
  screenshot3D: {
    type: String,
    default: '',
  },
  screenshotList: {
    type: Array as PropType<string[]>,
    default: [],
  },
})

const cardWidth = ref(240 + 2 + 2 + 600) // 724: 240（原来是120）是左侧列表，40是左侧工具栏，22是Reset图标占的宽度20+2个边，左侧工具栏和Reset图标占的宽度都去掉了
const cardHeight = ref(540) // 原来是600


</script>

<style lang="less" scoped>
.view-page {
  margin: 0 auto;
  margin-top: 16px; // 本身small-title就有margin-bottom:30px,这个值在页面并没有效果，但在pdf里有效果，因为之前打印的pdf这里的顶部会跑到第一页底部去，所以现在拉开一点距离
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  background: #17181B;

  .left {
    width: 240px;
    min-width: 240px;
    height: 100%;
    display: inline-block;
    vertical-align: top;
    color: #ddd;
    overflow-y: scroll;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .right {
    width: calc(100% - 240px);
    height: 100%;
    display: inline-block;
    vertical-align: top;
    position: relative;
    overflow: hidden;
  }
}

.img-list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;

  .item {
    width: 50%;
    height: 50%; // 这里是高度的一半，高度改变时，这里也要修改
    padding: 1px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
