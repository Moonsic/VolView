<!-- 现在的403页面在indexPage.ts中 -->
<template>
  <div class="page-403">
    <img class="img" :src="img403" alt="">
    <div class="text">{{ t('抱歉，您没有权限访问该页面。') }}</div>
    <!-- <a-button type="primary" @click="onReturn">返回首页</a-button> -->
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import img403 from '@img/404/403.png'

const { t } = useI18n()

const router = useRouter()

//返回首页
function onReturn() {
  router.push('/index')
}

</script>
<style lang="less" scoped>
.page-403 {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .img {
    margin-top: 60px;
  }

}
</style>