<!-- 多个柱状图 -->
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
      { name: '蜀山区', successNum: 10, errorNum: 17 },
      { name: '庐阳区', successNum: 18, errorNum: 10 },
      { name: '包河区', successNum: 15, errorNum: 12 },
      { name: '瑶海区', successNum: 15, errorNum: 12 },
    ]
    let chartData: any[] = []
    data && data.map(item => {
      chartData.push(
        { type: '正常', name: item.name, value: item.successNum },
        { type: '异常', name: item.name, value: item.errorNum },
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
      ['#43BDFF', '#026FFF'], // 蓝
      ['#CE9FFC', '#7367F0'], // 紫
      ['#02F5AD', '#0B9267'], // 绿
      ['#F9EB71', '#F8D800'], // 黄
      ['#F6AE8D', '#E4645E'], // 红
      ['#F5BE42', '#EC6755'], // 橙
      ['#EBA9E4', '#D74ECF'], // 粉
    ],
    showLabel: true,
    borderRadius: [10, 10, 0, 0], // 圆角
    loop: true,
    seriesData: [],
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