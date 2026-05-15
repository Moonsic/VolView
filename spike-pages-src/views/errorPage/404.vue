<template>
  <div class="page-404">
    <img class="img" :src="img404" alt="">
    <div class="text">{{ t('抱歉，您所访问的页面不存在。') }}</div>
    <a-button type="primary" @click="onReturn">{{ t('返回首页') }}</a-button>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import img404 from '@img/404/404.png'

const { t } = useI18n()

const router = useRouter()

//返回首页
function onReturn() {
  router.push('/index')
}

</script>
<style lang="less" scoped>
.page-404 {
  height: 100vh;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;

  .img {
    margin-top: 40px;
  }

  .text {
    margin-bottom: 40px;
  }
}
</style>