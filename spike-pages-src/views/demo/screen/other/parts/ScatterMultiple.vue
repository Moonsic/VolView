<!-- 多个散点图 -->
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
      { type: '张三', name: '1', value: 8 },
      { type: '张三', name: '2', value: 7 },
      { type: '张三', name: '3', value: 8 },
      { type: '张三', name: '4', value: 9 },
      { type: '张三', name: '5', value: 8 },
      { type: '张三', name: '6', value: 1 },
      { type: '张三', name: '6', value: 3 },
      { type: '张三', name: '6', value: 5 },
      { type: '张三', name: '6', value: 7 },
      { type: '张三', name: '6', value: 7 },
      { type: '张三', name: '7', value: 4 },

      { type: '李四', name: '1', value: 2 },
      { type: '李四', name: '2', value: 2 },
      { type: '李四', name: '3', value: 3 },
      { type: '李四', name: '4', value: 4 },
      { type: '李四', name: '5', value: 5 },
      { type: '李四', name: '6', value: 6 },
      { type: '李四', name: '7', value: 7 },

    ]
    chartOption.value.seriesData = data
  })
}

// 初始化图表
function initChart() {
  chartOption.value = {
    type: 'scatter',
    legend: 'type',
    xAxis: 'name',
    yAxis: 'value',
    yAxisName: '(个)',
    barMaxWidth: 15,
    seriesData: [],
    // color: ['#FB0F00', '#2F63F9'],
    // symbolSize: [2, 4, 6, 8, 10, 12, 14, 16, 18],
    symbolSize: [10,10],
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