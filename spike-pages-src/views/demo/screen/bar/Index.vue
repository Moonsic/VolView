<template>
  <div class="big-screen">

    <div class="top-row">
      <div class="left-col">
        <div>
          <TitleBg title="基础柱状图" />
          <Bar />
        </div>
      </div>
      <div class="center-col">
        <div>
          <TitleBg title="多个柱状图" />
          <BarMultiple />
        </div>
      </div>
      <div class="right-col">
        <div>
          <TitleBg title="堆叠柱状图" />
          <BarPile />
        </div>
      </div>
    </div>

    <div class="center-row">
      <div class="left-col">
        <div>
          <TitleBg title="背景柱状图" />
          <BarBg />
        </div>
      </div>
      <div class="center-col">
        <div>
          <TitleBg title="横向柱状图" />
          <BarTransverse />
        </div>
      </div>
      <div class="right-col">
        <div>
          <TitleBg title="双向柱状图" />
          <BarLevels />
        </div>
      </div>
    </div>

    <div class="bottom-row">
      <div class="left-col">
        <div>
          <TitleBg title="覆盖柱状图" />
          <BarFold />
        </div>
      </div>
      <div class="center-col">
        <div>
          <TitleBg title="格子柱状图" />
          <BarPictorial />
        </div>
      </div>

      <div class="right-col">
        <div>
          <TitleBg title="白色主题的基础柱状图" />
          <BarWhite />
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>

import TitleBg from '../parts/TitleBg.vue'
import Bar from './parts/Bar.vue'
import BarMultiple from './parts/BarMultiple.vue'
import BarPile from './parts/BarPile.vue'
import BarBg from './parts/BarBg.vue'
import BarTransverse from './parts/BarTransverse.vue'
import BarLevels from './parts/BarLevels.vue'
// import BarScroll from './parts/BarScroll.vue'
// import BarTransverseScroll from './parts/BarTransverseScroll.vue'
import BarWhite from './parts/BarWhite.vue'
import BarPictorial from './parts/BarPictorial.vue'
import BarFold from './parts/BarFold.vue'

</script>

<style lang="less" scoped>
.left-col>div,
.center-col>div,
.right-col>div {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid #589FF5;
  // box-shadow: 0 0 8px #40a1f7 inset;
  >div:not(.title-bg) {
    flex: auto;
  }
  >.title-bg {
    flex: none;
  }
}

.big-screen {
  padding: 0 32px;

  .top-row {
    height: 310px;
    display: flex;
    margin-bottom: 8px;

    .left-col {
      flex: 1;
      margin-right: 4px;

      >div:nth-child(1) {
        // height: 310px;
      }
    }

    .center-col {
      flex: 1;
      margin-left: 4px;
      margin-right: 4px;

      >div:nth-child(1) {
        // height: 310px;
      }
    }

    .right-col {
      flex: 1;
      margin-left: 4px;

      >div:nth-child(1) {
        // height: 310px;
      }

    }
  }

  .center-row {
    height: 310px;
    display: flex;
    margin-bottom: 8px;

    .left-col {
      flex: 1;
      margin-right: 4px;

      >div:nth-child(1) {
        // height: 310px;
      }
    }

    .center-col {
      flex: 1;
      margin-left: 4px;
      margin-right: 4px;

      >div:nth-child(1) {
        // height: 310px;
      }
    }

    .right-col {
      flex: 1;
      margin-left: 4px;

      >div:nth-child(1) {
        // height: 310px;
      }
    }
  }

  .bottom-row {
    height: 310px;
    display: flex;

    .left-col {
      flex: 1;
      margin-right: 4px;

      >div:nth-child(1) {
        // height: 310px;
      }
    }

    .center-col {
      flex: 1;
      margin-left: 4px;
      margin-right: 4px;

      >div:nth-child(1) {
        // height: 310px;
      }
    }

    .right-col {
      flex: 1;
      margin-left: 4px;

      >div:nth-child(1) {
        // height: 310px;
      }
    }
  }
}</style>
