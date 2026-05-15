<!-- 散点图 -->
<template>
  <div>
    <fx-scatter-chart :chartOption="chartOption" :extraOption="extraOption" />
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
      { name: '1', value: 8 },
      { name: '2', value: 7 },
      { name: '3', value: 8 },
      { name: '4', value: 9 },
      { name: '5', value: 8 },
      { name: '6', value: 1 },
      { name: '6', value: 3 },
      { name: '6', value: 5 },
      { name: '6', value: 7 },
      { name: '6', value: 7 },
      { name: '7', value: 4 },

      { name: '1', value: 2 },
      { name: '2', value: 2 },
      { name: '3', value: 3 },
      { name: '4', value: 4 },
      { name: '5', value: 5 },
      { name: '6', value: 6 },
      { name: '7', value: 7 },

    ]
    chartOption.value.seriesData = data
  })
}

// 初始化图表
function initChart() {
  chartOption.value = {
    type: 'scatter',
    xAxis: 'name',
    yAxis: 'value',
    yAxisName: '(个)',
    barMaxWidth: 15,
    seriesData: [],
    symbolSize: [2, 4, 6, 8, 10, 12, 14, 16, 18],
  }

  extraOption.value = {
    // series: [
    //   {
    //     itemStyle: {
    //       borderRadius: [10, 10, 0, 0] // 圆角
    //     }
    //   },
    // ],
  }
}

</script>

<style lang="less" scoped>

</style>