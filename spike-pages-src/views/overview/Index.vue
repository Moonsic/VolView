<template>
  <div class="overview-page">

    <div class="hello">
      Hello {{ userName }}
      <span class="inline-block">👋🏻</span>
    </div>
    <div class="hello-sub"> {{ timeText }}</div>

    <DataView :allData="allData" @setFinishedPipelineSubjectNum="setFinishedPipelineSubjectNum" />

    <div class="card-list">

      <PieDataNum class="card" :title="t('数据大小')" :allData="dataNumList" :colorList="dataNumColorList" />
      <PieGender class="card" :title="t('性别占比')" :allData="genderList" :colorList="genderColorList" />
      <!-- <PieGender class="card" title="患者是否进行棘波检测占比" :allData="detectedList" :colorList="yesNoColorList" /> -->
      <PieGender class="card" :title="t('溯源比例')" :allData="finishedList" :colorList="yesNoColorList" />
      <!-- <PieGender class="card" title="患者是否进行一键溯源占比" :allData="finishedList" :colorList="yesNoColorList" /> -->

      <!-- <Table class="card widthP100" title="患者棘波点数量统计列表" :allData="spikeNumList" /> -->

      <!-- <AreaBar /> -->
    </div>
  </div>

  <a-back-top class="back-top-btn" />

</template>

<script lang="ts" setup>

import { formatFileSize } from '@u/utils'

import { indexPageApi } from '@/api/statistics'
import DataView from './parts/DataView.vue'
import PieGender from './parts/PieGender.vue'
import PieDataNum from './parts/PieDataNum.vue'
// import PieGender2 from './parts/PieGender2.vue'
// import Table from './parts/Table.vue'

// import AreaBar from './parts/AreaBar.vue'

import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/store/theme'

const { t } = useI18n()

const { isDarkMode } = storeToRefs(useThemeStore())
watch(isDarkMode, () => {
  // console.log('object :>> ', isDarkMode.value);
  nextTick(() => {
    if (isDarkMode.value) {
      dataNumColorList.value = ['#2e71de', '#eed78a'] // 蓝、黄
      genderColorList.value = ['#2e71de', '#f499c1'] // 蓝、粉
      yesNoColorList.value = ['#2e71de', '#2e426b'] // 蓝、灰
    } else {
      dataNumColorList.value = ['#235cac', '#FFE079'] // 蓝、黄
      genderColorList.value = ['#235cac', '#FF8EBF'] // 蓝、粉
      yesNoColorList.value = ['#235cac', '#C5D7FA'] // 蓝、灰
    }
  })
}, { immediate: true })


const allData = ref<any>({})
const genderList = ref<any[]>([
  { name: t('男性'), value: null },
  { name: t('女性'), value: null },
])

const detectedList = ref<any[]>([])
const finishedList = ref<any[]>([])
const spikeNumList = ref<any[]>([])
const dataNumList = ref<any[]>([
  { name: 'MEG', value: null },
  { name: 'T1W', value: null },
])

const dataNumColorList = ref<string[]>(['#235cac', '#FFE079']) // 蓝、黄
const genderColorList = ref<string[]>(['#235cac', '#FF8EBF']) // 蓝、粉
const yesNoColorList = ref<string[]>(['#235cac', '#C5D7FA']) // 蓝、灰

onMounted(() => {
  getData()
})

// 获取数据
async function getData() {
  const { code, data } = await indexPageApi({})
  if (code === 200) {
    allData.value = data || {}
    dataNumList.value = [
      { name: 'MEG', value: data.totalMegSize, numUnit: formatFileSize(data.totalMegSize) },
      { name: 'T1W', value: data.totalT1WSize, numUnit: formatFileSize(data.totalT1WSize) },
    ]
    genderList.value = [
      { name: t('男性'), value: data.gender.man },
      { name: t('女性'), value: data.gender.women },
    ]

    const totalFinishedPipelineNum = data.totalFinishedPipelineNum
    const totalUnfinishedPipelineNum = data.totalUnfinishedPipelineNum
    finishedList.value = [
      { name: t('已溯源'), value: totalFinishedPipelineNum },
      { name: t('待溯源'), value: totalUnfinishedPipelineNum },
    ]

    // detectedList.value = [
    //   { name: '是', value: data.detected.yesNum },
    //   { name: '否', value: data.detected.noNum },
    // ]
    // 最下面的表格现在没了，先注释掉
    // spikeNumList.value = data.spikeNumList || []
  }
}


// 新的第三个图表，从另一个接口拿数据，再等总人数的数据，再并在一起
async function setFinishedPipelineSubjectNum(num: number) {
  // 定义一个异步函数来获取subjectNum，避免递归风险，采用Promise等待合适数据
  const getSubjectNum = async (): Promise<number> => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (Object.keys(allData.value).length) {
          resolve(allData.value.subjectNum);
          clearInterval(interval);
        }
      }, 300) // 可以根据实际情况调整轮询间隔
    })
  }
  const subjectNum = await getSubjectNum()
  finishedList.value = [
    { name: t('是'), value: num },
    { name: t('否'), value: subjectNum - num },
  ]
}


const userName = ref<string>('')
const timeText = ref<string>('')

getUserInfo()

function getUserInfo() {
  // 如果没有登录信息，就跳转到登录页面
  const user = localStorage.getItem('userInfo')
  if (user) {
    userName.value = JSON.parse(user).name
  }
}

getTime()
function getTime() {
  const now = new Date();
  const hours = now.getHours()
  let greeting
  if (hours >= 0 && hours < 12) {
    greeting = "Good Morning"
  } else if (hours >= 12 && hours < 18) {
    greeting = "Good Afternoon"
  } else {
    greeting = "Good Evening"
  }
  timeText.value = greeting
}

</script>

<style lang="less" scoped>
@space: 20px; // 间距

.overview-page {
  position: relative; // TODO：必须加，否则就会被背景图片挡住，之后要研究一下为什么
  margin-top: -320px;
}

.hello {
  color: #FFF;
  font-size: 54px;
  font-weight: 600;
  margin-bottom: 10px;
  margin-left: 8px;
}

.hello-sub {
  color: #FFF;
  font-size: 24px;
  font-weight: 300;
  margin-bottom: 60px;
  margin-left: 8px;
}

.dark {

  .hello,
  .hello-sub {
    color: rgba(255, 255, 255, 0.9);
  }
}

.card-list {
  display: flex;
  flex-wrap: wrap;

  .card {
    width: calc((100% - @space * 2) / 3);

    margin-right: @space;
    margin-bottom: @space;
    overflow: hidden;

    &:nth-of-type(3n) {
      margin-right: 0;
    }

    &.widthP100 {
      width: 100%;
      margin-right: 0;
    }
  }
}
</style>
