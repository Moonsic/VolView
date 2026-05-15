<template>
  <div class="big-screen">

    <div class="top-row">
      <div class="left-col">
        <div>
          <TitleBg title="表格" />
          <DemoTable />
        </div>
      </div>
      <div class="center-col">
        <div>
          <TitleBg title="滚动表格" />
          <TableSimpleScroll />
        </div>
      </div>
      <div class="right-col">
        <div>
          <TitleBg title="滚动表格组件" />
          <ScrollTable />
        </div>
      </div>
    </div>

    <div class="center-row">
      <div class="left-col">
        <div>
          <TitleBg title="进度条" />
          <TableNoHead />
        </div>
      </div>
      <div class="center-col">
        <div>
          <TitleBg title="彩色进度条" />
          <ProcessList />
        </div>
      </div>
      <div class="right-col">
        <div>
          <TitleBg title="进度条" />
          <ProcessColor />
        </div>
      </div>
    </div>

    <div class="bottom-row">
      <div class="left-col">
        <div>
          <TitleBg title="原来的滚动表格组件" />
          <ScrollBoard />
        </div>
      </div>
      <div class="center-col">
        <div>
          <TitleBg title="轮播" />
          <Carousel />
        </div>
      </div>

      <div class="right-col">
        <div>
          <TitleBg title="企业地区分布" />
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>

import TitleBg from '../parts/TitleBg.vue'
import DemoTable from './parts/DemoTable.vue'
import TableSimpleScroll from './parts/TableSimpleScroll.vue'
import ScrollBoard from './parts/ScrollBoard.vue'

import TableNoHead from './parts/TableNoHead.vue'
import ScrollTable from './parts/ScrollTable.vue'

import ProcessList from './parts/ProcessList.vue'
import ProcessColor from './parts/ProcessColor.vue'

import Carousel from './parts/Carousel.vue'

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
