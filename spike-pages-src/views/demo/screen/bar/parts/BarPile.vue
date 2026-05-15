<!-- 堆叠条形图 -->
<template>
  <div>
    <fx-bar-chart :chartOption="chartOption" :extraOption="extraOption" />
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
      { name: '2011', low: 272, common: 286, higher: 253, high: 194 },
      { name: '2012', low: 392, common: 267, higher: 276, high: 101 },
      { name: '2013', low: 372, common: 162, higher: 152, high: 98 },
      { name: '2014', low: 312, common: 180, higher: 132, high: 100 },
      { name: '2015', low: 374, common: 163, higher: 162, high: 76 },
      { name: '2016', low: 300, common: 134, higher: 122, high: 65 },
      { name: '2017', low: 412, common: 175, higher: 112, high: 66 },
      { name: '2018', low: 382, common: 165, higher: 112, high: 34 },
      { name: '2019', low: 375, common: 152, higher: 122, high: 21 },
      { name: '2020', low: 423, common: 189, higher: 132, high: 18 },
      { name: '2021', low: 411, common: 231, higher: 112, high: 21 },
    ]
    let chartData: any[] = []
    data && data.map(item => {
      chartData.push(
        { type: '低风险', name: item.name, value: item.low },
        { type: '一般信用风险', name: item.name, value: item.common },
        { type: '较高信用风险', name: item.name, value: item.higher },
        { type: '高风险', name: item.name, value: item.high },
      )
    })
    chartOption.value.seriesData = chartData
  })
}

// 初始化图表
function initChart() {
  chartOption.value = {
    type: 'bar',
    legend: 'type',
    xAxis: 'name',
    yAxis: 'value',
    yAxisName: '(个)',
    barMaxWidth: 15,
    color: [
      ['#02F5AD', '#0B9267'], // 绿
      ['#43BDFF', '#026FFF'], // 蓝
      ['#F9EB71', '#F8D800'], // 黄
      ['#F6AE8D', '#E4645E'], // 红
      ['#F5BE42', '#EC6755'], // 橙
      ['#CE9FFC', '#7367F0'], // 紫
      ['#EBA9E4', '#D74ECF'], // 粉
    ],
    loop: true,
    seriesData: [],
  }
  extraOption.value = {
    legend: {
      show: true,
      icon: 'roundRect',
      itemWidth: 14,
      itemHeight: 4,
    },
    series: [
      {
        stack: 'total', // 数据堆叠
      },
      {
        stack: 'total', // 数据堆叠
      },
      {
        stack: 'total', // 数据堆叠
      },
      {
        stack: 'total', // 数据堆叠
      },
    ],
  }
}

</script>

<style lang="less" scoped>

</style>