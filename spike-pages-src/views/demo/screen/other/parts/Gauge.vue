<!-- 仪表盘 -->
<template>
  <div>
    <fx-gauge-chart :chartOption="chartOption" :extraOption="extraOption" />
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
      { type: '应急局', name: '庐阳区', value: 50 },
    ]
    chartOption.value.seriesData = data
  })
}

// 初始化图表
function initChart() {
  chartOption.value = {
    type: 'gauge',
    legend: 'type',
    xAxis: 'name',
    yAxis: 'value',
    seriesData: [],
    color: [
      [0.2, 'red'],
      [0.4, '#F88168'],
      [0.6, '#FBF76B'],
      [0.8, '#7AD4DF'],
      [1, '#70C27E'],
    ],
  }

  extraOption.value = {
    tooltip: {
      formatter: '{a} <br/>{b} : {c}%'
    },
    series: [{
      name: '进度',
      type: 'gauge',
      progress: {
        show: true
      },
      data: [{
        value: 10,
        name: '庐阳区',
        color: '#fff'
      }],
      splitNumber: 10, // 刻度数量
      // 指针
      pointer: {
        width: 6,
        length: '50%'
      },
      // 刻度样式
      axisTick: {
        lineStyle: {
          color: '#fff'
        }
      },
      // 刻度标签
      axisLabel: {
        color: '#fff',
        lineStyle: {
          color: '#fff'
        }
      },
      // 仪表盘指针样式
      itemStyle: {
        color: '#08B0FF'
      },
      // 分割线
      splitLine: {
        length: 10,
        lineStyle: {
          width: 2,
          color: '#fff',
        },
      },
      // 文字
      title: {
        color: '#c5e3ff',
        fontSize: 18,
      },
      // 数值
      detail: {
        color: '#06abff',
        fontSize: 24,
        offsetCenter: [0, '48%'],//偏移位置
      }
    }]
  }
}

</script>

<style lang="less" scoped>

</style>