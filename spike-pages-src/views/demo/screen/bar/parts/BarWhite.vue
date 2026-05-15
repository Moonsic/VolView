<!-- 基础柱状图 -->
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
      { name: '蜀山区', value: 1001 },
      { name: '庐阳区', value: 920 },
      { name: '包河区', value: 1231 },
      { name: '瑶海区', value: 710 },
      { name: '高新区', value: 610 },
      { name: '滨湖区', value: 350 },
    ]
    chartOption.value.seriesData = data
  })
}

// 初始化图表
function initChart() {
  chartOption.value = {
    type: 'bar',
    xAxis: 'name',
    yAxis: 'value',
    yAxisName: '(个)',
    barMaxWidth: 15,
    color: [
      ['#026FFF', '#026FFF'],
      ['#FEC359', '#FEC359'],
      ['#55E7F2', '#55E7F2'],
      ['#0099FF', '#0099FF'],
    ],
    theme: 'light',
    showLabel: true,
    borderRadius: [10, 10, 0, 0], // 圆角
    loop: true,
    seriesData: [],
  }
  extraOption.value = {}
}

</script>

<style lang="less" scoped>

</style>