<template>
  <div class="big-screen">

    <div class="top-row">
      <div class="left-col">
        <div>
          <NumUnit />
        </div>
        <div>
          <TitleBg title="基础柱状图" />
          <LineArea />
        </div>
        <div>
          <TitleBg title="基础柱状图" />
          <Bar />
        </div>
      </div>
      <div class="center-col">
        <div>
          <ChinaMap />
        </div>
        <div>
          <TitleBg title="基础柱状图" />
          <LineMuitiple />
        </div>
      </div>
      <div class="right-col">
        <div>
          <TitleBg title="堆叠柱状图" />
          <Pie />
        </div>
        <div>
          <TitleBg title="基础柱状图" />
          <ProcessList />
        </div>
        <div>
          <TitleBg title="基础柱状图" />
          <ScrollTable />
        </div>

      </div>
    </div>

    <!-- <div class="center-row">
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
    </div> -->

  </div>
</template>

<script lang="ts" setup>

import TitleBg from '../parts/TitleBg.vue'

import LineArea from '../line/parts/LineArea.vue'
import LineMuitiple from '../line/parts/LineMuitiple.vue'
import ChinaMap from './parts/ChinaMap.vue'
import Bar from '../bar/parts/Bar.vue'
import Pie from '../pie/parts/Pie.vue'
import ScrollTable from '../table/parts/ScrollTable.vue'
import ProcessList from '../table/parts/ProcessList.vue'
import NumUnit from '../list/parts/NumUnit.vue'

</script>

<style lang="less" scoped>
.left-col>div,
.center-col>div,
.right-col>div {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #05297d;
  // background: #0a2c7a;
  // border: 1px solid #589FF5;
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
    display: flex;
    margin-bottom: 8px;

    .left-col {
      flex: 1;
      margin-right: 4px;

      >div:nth-child(1) {
        height: 310px;
        margin-bottom: 8px;
      }
      >div:nth-child(2) {
        height: 310px;
        margin-bottom: 8px;
      }
      >div:nth-child(3) {
        height: 310px;
        margin-bottom: 8px;
      }
    }

    .center-col {
      flex: 2;
      margin-left: 4px;
      margin-right: 4px;

      >div:nth-child(1) {
        height: 628px;
        margin-bottom: 8px;
        background: transparent;
      }
      >div:nth-child(2) {
        height: 310px;
      }
    }

    .right-col {
      flex: 1;
      margin-left: 4px;

      >div:nth-child(1) {
        height: 310px;
        margin-bottom: 8px;
      }
      >div:nth-child(2) {
        height: 310px;
        margin-bottom: 8px;
      }
      >div:nth-child(3) {
        height: 310px;
        margin-bottom: 8px;
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
