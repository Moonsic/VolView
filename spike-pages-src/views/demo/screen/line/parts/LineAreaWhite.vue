<!-- 面积折线图 -->
<template>
  <div>
    <fx-line-chart :chartOption="chartOption" :extraOption="extraOption" />
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
      { name: '蜀山区', value: 1800 },
      { name: '庐阳区', value: 1920 },
      { name: '包河区', value: 1631 },
      { name: '瑶海区', value: 1710 },
      { name: '高新区', value: 1610 },
      { name: '滨湖区', value: 1750 },
      { name: '蜀山区1', value: 1600 },
      { name: '庐阳区1', value: 1920 },
      { name: '包河区1', value: 1623 },
      { name: '瑶海区1', value: 1710 },
      { name: '高新区1', value: 1610 },
      { name: '滨湖区1', value: 1750 },
    ]
    chartOption.value.seriesData = data
  })
}

// 初始化图表
function initChart() {
  chartOption.value = {
    type: 'lineArea',
    xAxis: 'name',
    yAxis: 'value',
    yAxisName: '(个)',
    color: [
      ['#588EDD', '#026FFF'],
      ['#FEC359', '#FEC359'],
      ['#55E7F2', '#55E7F2'],
      ['#0099FF', '#0099FF'],
    ],
    areaColor: [
      ['#43BDFF', '#fff'],
      ['#FEC359', '#FEC359'],
      ['#55E7F2', '#55E7F2'],
      ['#0099FF', '#0099FF'],
    ],
    theme: 'light',
    showLabel: true,
    smooth: false,
    loop: true,
    seriesData: [],
  }
  extraOption.value = {
    yAxis: [{
      min: 1500
    }]
  }
}

</script>

<style lang="less" scoped>

</style>