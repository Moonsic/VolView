<template>
  <div class="big-screen">

    <div class="top-row">
      <div class="left-col">
        <div>
          <TitleBg title="数字+单位" />
          <NumUnit />
        </div>
      </div>
      <div class="center-col">
        <div>
          <TitleBg title="数据总览" />
          <DataView />
        </div>
      </div>
      <div class="right-col">
        <div>
          <TitleBg title="处理数字" />
          <DataViewDealNum />

        </div>
      </div>
    </div>

    <div class="center-row">
      <div class="left-col">
        <div>
          <TitleBg title="菜单切换" />
          <MenuContent />
        </div>
      </div>
      <div class="center-col">
        <div>
          <TitleBg title="菜单切换+图表" />
          <MenuChart />
        </div>
      </div>
      <div class="right-col">
        <div>
          <TitleBg title="flex布局" />
          <Flex34 />
        </div>
      </div>
    </div>

    <div class="bottom-row">
      <div class="left-col">
        <div>
          <TitleBg title="基本信息" />
          <BaseInfo />
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
import BaseInfo from './parts/BaseInfo.vue'
import DataView from './parts/DataView.vue'
import DataViewDealNum from './parts/DataViewDealNum.vue'
import MenuContent from './parts/MenuContent.vue'
import MenuChart from './parts/MenuChart.vue'
import Flex34 from './parts/Flex34.vue'
import NumUnit from './parts/NumUnit.vue'

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
