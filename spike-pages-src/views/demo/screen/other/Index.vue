<template>
  <div class="big-screen">

    <div class="top-row">
      <div class="left-col">
        <fx-border-angle>
          <TitleBg title="雷达图" />
          <Rader />
        </fx-border-angle>
      </div>
      <div class="center-col">
        <fx-border-angle>
          <TitleBg title="多个雷达图" />
          <RaderMultiple />
        </fx-border-angle>
      </div>
      <div class="right-col">
        <fx-border-angle>
          <TitleBg title="散点图" />
          <Scatter />
        </fx-border-angle>
      </div>
    </div>

    <div class="center-row">
      <div class="left-col">
        <fx-border-eight>
          <TitleBg title="多个散点图" />
          <ScatterMultiple />
        </fx-border-eight>
      </div>
      <div class="center-col">
        <fx-border-common>
          <TitleBg title="仪表盘" />
          <Gauge />
        </fx-border-common>
      </div>
      <div class="right-col">
        <fx-border-angle>
          <TitleBg title="" />
        </fx-border-angle>
      </div>
    </div>

    <div class="bottom-row">
      <div class="left-col">
        <fx-border-line>
          <TitleBg title="横向滚动柱状图" />
    <BarScroll />
        </fx-border-line>
      </div>
      <div class="center-col">
        <fx-border-angle-title>
          <TitleBg title="竖向滚动柱状图" />
    <BarTransverseScroll />
        </fx-border-angle-title>
      </div>

      <div class="right-col">
        <fx-border-angle>
          <TitleBg title="" />
        </fx-border-angle>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>

import TitleBg from '../parts/TitleBg.vue'
import Rader from './parts/Rader.vue'
import RaderMultiple from './parts/RaderMultiple.vue'

import Scatter from './parts/Scatter.vue'
import ScatterMultiple from './parts/ScatterMultiple.vue'

import Gauge from './parts/Gauge.vue'

import BarScroll from './parts/BarScroll.vue'
import BarTransverseScroll from './parts/BarTransverseScroll.vue'

</script>

<style lang="less" scoped>
.left-col>div,
.center-col>div,
.right-col>div {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  // border: 1px solid #589FF5;
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
