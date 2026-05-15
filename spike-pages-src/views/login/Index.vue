<template>
  <div class="login-page" :style="{ backgroundImage: `url(${login_bg})` }">

    <div class="center">

      <div class="bg"></div>

      <div class="left">
        <div class="top">
          <IconLogoColor class="logo" />
          <span class="title">{{ SYSTEM_NAME }}</span>
        </div>
        <div class="down">
          <video ref="myVideo" loop autoplay muted>
            <source :src="video" type="video/mp4">
          </video>
        </div>
      </div>
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
import login_bg from './img/login_bg.png'
import video from './img/video.mp4'
import Account from './Account.vue'

import { SYSTEM_NAME, COPY_RIGHT } from '@/utils/config'

const { t } = useI18n()

</script>

<style lang="less" scoped>
.login-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  backdrop-filter: blur(25px);


  >.center {
    width: 80%;
    height: calc(100vh - 200px);
    min-height: 460px;
    position: relative;
    border-radius: 40px;
    background: rgba(3, 14, 26, 0.75);
    box-shadow: -15px 50px 40px 0px rgba(0, 0, 0, 0.20);
    display: flex;
    overflow: hidden;

    position: relative;

    // 背景放一个模糊的黑色矩形
    .bg {
      position: absolute;
      top: 150px;
      bottom: 0;
      left: 0;
      right: 80px;
      z-index: -1;
      border-radius: 40px;
      background: #030E1A;
      filter: blur(100px);
    }


    .left {
      width: 56%;
      background: #000003;

      .top {
        width: 100%;
        height: 60px;
        margin-top: 40px;
        padding-left: 50px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        color: #fff;

        .logo {
          font-size: 44px;
          margin-right: 16px;
        }

        .title {
          font-size: 28px;
        }
      }

      .down {
        width: 100%;
        height: calc(100% - 100px); //height60 + marginTop40 = 100

        video {
          width: 100%;
          height: 100%;
        }
      }

    }


    .box {
      width: 44%;
      display: flex;
      justify-content: center;
      align-self: center;
    }
  }

  >.bottom {
    width: 100%;
    color: #ddd;
    text-align: center;
    position: fixed;
    bottom: 20px;
  }
}
</style>