<template>
  <div class="big-screen">

    <div class="top-row">
      <div class="left-col">
        <div>
          <TitleBg title="基础饼状图" />
          <Pie />
        </div>
      </div>
      <div class="center-col">
        <div>
          <TitleBg title="环形饼状图" />
          <PieDoughnut />
        </div>
      </div>
      <div class="right-col">
        <div>
          <TitleBg title="南丁格尔玫瑰图饼状图" />
          <PieRose />
        </div>
      </div>
    </div>

    <div class="center-row">
      <div class="left-col">
        <div>
          <TitleBg title="双环状图" />
          <PieRingDouble />
        </div>
      </div>
      <div class="center-col">
        <div>
          <TitleBg title="环形饼状图+右侧列表" />
          <PieDoughnutList />
        </div>
      </div>
      <div class="right-col">
        <div>
          <TitleBg title="南丁格尔玫瑰图饼状图+右侧列表" />
          <PieRoseLiist />
        </div>
      </div>
    </div>

    <div class="bottom-row">
      <div class="left-col">
        <div>
          <TitleBg title="指示线饼状图" />
          <PieLine />
        </div>
      </div>
      <div class="center-col">
        <div>
          <TitleBg title="" />
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
import Pie from './parts/Pie.vue'
import PieDoughnut from './parts/PieDoughnut.vue'
import PieDoughnutList from './parts/PieDoughnutList.vue'
import PieRose from './parts/PieRose.vue'
import PieRoseLiist from './parts/PieRoseLiist.vue'
import PieRingDouble from './parts/PieRingDouble.vue'
import PieLine from './parts/PieLine.vue'

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
