<!-- 多个雷达图 -->
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
      { type: '张三', name: '语文', value: 88 },
      { type: '张三', name: '数学', value: 72 },
      { type: '张三', name: '英语', value: 82 },
      { type: '张三', name: '文科', value: 91 },
      { type: '张三', name: '理科', value: 81 },
      { type: '张三', name: '文体', value: 55 },

      { type: '李四', name: '语文', value: 60 },
      { type: '李四', name: '数学', value: 92 },
      { type: '李四', name: '英语', value: 72 },
      { type: '李四', name: '文科', value: 61 },
      { type: '李四', name: '理科', value: 98 },
      { type: '李四', name: '文体', value: 65 },
    ]
    chartOption.value.seriesData = data
  })
}

// 初始化图表
function initChart() {
  chartOption.value = {
    type: 'radar',
    legend: 'type',
    xAxis: 'name',
    yAxis: 'value',
    seriesData: [],
    min: 0,
    max: 100,
    color: ['#B075FF', '#95FFFD'],
    areaColor: ['rgba(114, 172, 209, 1)', 'rgba(114, 172, 209, 0.8)', 'rgba(114, 172, 209, 0.6)', 'rgba(114, 172, 209, 0.4)'],
  }
  extraOption.value = {
    legend: {
      x: 'right',
      icon: 'roundRect',
      itemWidth: 14,
      itemHeight: 4,
    },
  }
}

</script>

<style lang="less" scoped>

</style>