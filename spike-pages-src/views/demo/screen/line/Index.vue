<template>
  <div class="big-screen">

    <div class="top-row">
      <div class="left-col">
        <div>
          <TitleBg title="基础折线图" />
          <Line />
        </div>
      </div>
      <div class="center-col">
        <div>
          <TitleBg title="面积折线图" />
          <LineArea />
        </div>
      </div>
      <div class="right-col">
        <div>
          <TitleBg title="多个折线图" />
          <LineMuitiple />
        </div>
      </div>
    </div>

    <div class="center-row">
      <div class="left-col">
        <div>
          <TitleBg title="圆点折线图" />
          <LineCircle />
        </div>
      </div>
      <div class="center-col">
        <div>
          <TitleBg title="白色主题的面积折线图" />
          <LineAreaWhite />
        </div>
      </div>
      <div class="right-col">
        <div>
          <TitleBg title="" />
        </div>
      </div>
    </div>

    <div class="bottom-row">
      <div class="left-col">
        <div>
          <TitleBg title="柱线混合图" />
          <BarLine />
        </div>
      </div>
      <div class="center-col">
        <div>
          <TitleBg title="白色主题的柱线混合图" />
          <BarLineWhite />
        </div>
      </div>

      <div class="right-col">
        <div>
          <TitleBg title="" />
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>

import TitleBg from '../parts/TitleBg.vue'
import Line from './parts/Line.vue'
import LineArea from './parts/LineArea.vue'
import LineMuitiple from './parts/LineMuitiple.vue'
import LineCircle from './parts/LineCircle.vue'
import LineAreaWhite from './parts/LineAreaWhite.vue'
import BarLine from './parts/BarLine.vue'
import BarLineWhite from './parts/BarLineWhite.vue'

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
