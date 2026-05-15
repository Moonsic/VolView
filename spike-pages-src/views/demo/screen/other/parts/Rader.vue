<!-- 雷达图 -->
<template>
  <div>
    <fx-radar-chart :chartOption="chartOption" :extraOption="extraOption" />
  </div>
</template>

<script lang="ts" setup>

const chartOption = ref<IChartOption>({}) // 配置参数
const extraOption = ref<any>({}) // 扩展属性

onMounted(() => {
  init()
})

function init() {
  initChart()
  getData()
}

// 获取数据
function getData() {
  setTimeout(() => {
    const data = [
      { name: '语文', value: 60 },
      { name: '数学', value: 92 },
      { name: '英语', value: 82 },
      { name: '文科', value: 91 },
      { name: '理科', value: 61 },
      { name: '文体', value: 95 },
    ]
    chartOption.value.seriesData = data
  })
}

// 初始化图表
function initChart() {
  chartOption.value = {
    type: 'radar',
    xAxis: 'name',
    yAxis: 'value',
    seriesData: [],
    min: 0,
    max: 100,
    color: '#43BDFF',
    areaColor: '#295cae',
  }
}

</script>

<style lang="less" scoped>

</style>