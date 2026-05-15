<!-- 柱线混合图 -->
<template>
  <div>
    <fx-bar-line-chart :chartOption="chartOption" :extraOption="extraOption" />
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
      { time: '01:00', name: '蜀山区', bar1: 10, bar2: 20, line1: 1501, line2: 1001 },
      { time: '02:00', name: '庐阳区', bar1: 30, bar2: 10, line1: 1201, line2: 1301 },
      { time: '03:00', name: '包河区', bar1: 100, bar2: 10, line1: 1701, line2: 1501 },
      { time: '04:00', name: '瑶海区', bar1: 10, bar2: 60, line1: 1901, line2: 1801 },
      { time: '05:00', name: '高新区', bar1: 70, bar2: 10, line1: 1501, line2: 1201 },
      { time: '06:00', name: '滨湖区', bar1: 10, bar2: 40, line1: 1201, line2: 1501 },
    ]

    let chartData: any[] = []
    data && data.map(item => {
      chartData.push(
        { type: '输入量', name: item.name, value: item.bar1 },
        { type: '输出量', name: item.name, value: item.bar2 },
        { type: '输入速率', name: item.name, value: item.line1 },
        { type: '输出速率', name: item.name, value: item.line2 },
      )
    })
    chartOption.value.seriesData = chartData

  })
}

// 初始化图表
function initChart() {
  chartOption.value = {
    type: 'barLine',
    legend: 'type',
    xAxis: 'name',
    yAxis: 'value',
    yAxisName: ['(量)', '(速率)'],
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
    loop: true,
    seriesData: [],
  }
  extraOption.value = {
    series: [
      { type: 'bar' },
      { type: 'bar' },
      { type: 'line', yAxisIndex: 1 },
      { type: 'line', yAxisIndex: 1 }
    ]
  }
}

</script>

<style lang="less" scoped>

</style>