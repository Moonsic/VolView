<template>
  <div class="screen-index" :style="{ transform: `scale(${ratio})` }">
    <div class="screen-head">
      <div class="back-home text-gradient" @click="backHome">返回首页</div>
      <div class="head-title text-gradient">数据可视化大屏</div>
      <div class="time text-gradient">{{ nowTime }}</div>

      <div class="nav-list">

        <div class="left-list">
          <fx-border-angle-title class="nav-item" :active="item.value === $route.path" v-for="item in leftList"
            :key="item.value">
            <router-link :to="item.value">
              {{ item.name }}
            </router-link>
          </fx-border-angle-title>
        </div>
        <div class="right-list">
          <fx-border-angle-title class="nav-item" :active="item.value === $route.path" v-for="item in rightList"
            :key="item.value">
            <router-link :to="item.value">
              {{ item.name }}
            </router-link>
          </fx-border-angle-title>
        </div>
      </div>

    </div>

    <div class="screen-body" v-if="showBody">
      <router-view></router-view>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { formatDate } from '@u/utils'

// 缩放比例
const ratio = ref(1)
// showBody解决首次进入页面chartRef.value.getBoundingClientRect()不正确的问题
const showBody = ref<boolean>(false)
// 右上角时间
const nowTime = ref<string>('')
const timerNowTime = ref<any>(null)

const leftList = ref<any>([
  { name: '柱状图', value: '/screen/bar' },
  { name: '折线图', value: '/screen/line' },
  { name: '饼状图', value: '/screen/pie' },
  { name: '其他图', value: '/screen/other' },
])

const rightList = ref<any>([
  { name: '地图', value: '/screen/map' },
  { name: '表格', value: '/screen/table' },
  { name: '列表', value: '/screen/list' },
  { name: '例子', value: '/screen/example' },
])


const route = useRoute()
const router = useRouter()
if (route.name === 'screen') {
  router.push({ path: '/screen/bar' })
}


onMounted(() => {
  initScale()
  window.onresize = () => {
    initScale()
  }
  showBody.value = true

  getNowTime()
  timerNowTime.value = setInterval(getNowTime, 1000)
})

onBeforeUnmount(() => {
  clearTimeout(timerNowTime.value)
})

// 屏幕缩放
function initScale() {
  ratio.value = window.innerWidth / 1920
}

// 获取时间
function getNowTime() {
  nowTime.value = formatDate(new Date(), 'YYYY-MM-DD hh:mm:ss')
}

// 返回首页
function backHome() {
  window.location.href = `${window.location.origin}/index`;
}

</script>

<style lang="less" scoped>
.screen-index {
  width: 1920px;
  height: 1080px;
  overflow: hidden;
  transform-origin: 0 0;
  position: relative;
  color: #c5e3ff; // 暗点
  background-color: #01226E;

  a {
    color: #daedff; // 亮点
  }

  .screen-head {
    width: 100%;
    height: 118px;
    margin-bottom: 8px;
    background-image: url(../../assets/images/screen/headBg1.png);
    background-size: 1590px 124px;
    background-repeat: no-repeat;
    background-position: center top;
    position: relative;

    // 文字渐变
    .text-gradient {
      background: linear-gradient(180deg, #f2fdff, #58bfff, #58bfff);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .back-home {
      position: absolute;
      left: 33px;
      top: 24px;
      z-index: 999;
      font-size: 16px;
      font-weight: 600;
      letter-spacing: 1px;
      cursor: pointer;

      &:hover {
        color: #c5e3ff;
      }
    }

    .head-title {
      position: absolute;
      top: 15px;
      left: 50%;
      z-index: 999;
      transform: translateX(-50%);
      font-size: 40px;
      font-weight: 400;
      letter-spacing: 4px;
    }

    .time {
      position: absolute;
      top: 25px;
      right: 33px;
      z-index: 999;
    }
  }

  .nav-list {
    position: relative;
    height: 115px;
    flex: 1;
    padding: 64px 32px 0;
    display: flex;
    justify-content: space-between;

    .left-list {
      .nav-item {
        margin-right: 20px;
      }
    }

    .right-list {
      .nav-item {
        margin-left: 20px;
      }
    }

    .nav-item {
      display: inline-block;
      font-size: 18px;
      text-align: center;
      letter-spacing: 2px;
      width: 151px;
      height: 44px;
      line-height: 44px;
      cursor: pointer;

      a {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }

  .screen-body {
    position: relative;
    height: 954px;
    overflow: hidden;
  }
}
</style>
