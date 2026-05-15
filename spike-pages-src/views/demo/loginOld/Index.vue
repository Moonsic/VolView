<template>
  <div class="login-page">
    <div class="top">
      <!-- <img :src="logo" alt=""> -->
      <span>{{ SYSTEM_NAME }}</span>
    </div>
    <!-- <div class="center" :style="{ backgroundImage: `url(${login_bg})` }"> -->
    <div class="center">
      <div class="box">
        <Account />
      </div>
    </div>
    <div class="bottom">
      <div>{{ COPY_RIGHT }}</div>
    </div>

  </div>
</template>

<script lang="ts" setup>
// import login_bg from '@img/logo.png'
import Account from './Account.vue'

import { SYSTEM_NAME, COPY_RIGHT } from '@/utils/config'

</script>

<style lang="less" scoped>
.login-page {
  height: 100vh;
  background: #224981;

  >.top {
    width: 100%;
    height: 64px;
    padding-left: 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    // background-color: #fff;
    // box-shadow: 0 1px 12px 0 rgba(0, 0, 0, 0.16);

    >img {
      width: 50px;
      height: 50px;
      margin-right: 16px;
    }

    >span {
      font-size: 22px;
      color: #fff;
      font-weight: 600;
    }
  }

  >.center {
    height: calc(100vh - 64px - 125px);
    min-height: 460px;
    background-size: calc(88vh - 64px - 125px);
    background-position: 15% center;
    background-repeat: no-repeat;
    position: relative;

    .box {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 999;
      width: 450px;
      height: 450px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0px 12px 24px 0px rgba(0, 61, 170, 0.11);
      overflow: hidden;
    }
  }

  >.bottom {
    width: 100%;
    color: #ccc;
    // background-color: #000;
    text-align: center;
    position: fixed;
    bottom: 0;
    z-index: 999;

    >div:first-child {
      padding: 20px 0;
      margin: 0 40px;
      // border-bottom: 1px solid #333;
    }

    >div:last-child {
      padding: 20px;
    }
  }
}
</style>