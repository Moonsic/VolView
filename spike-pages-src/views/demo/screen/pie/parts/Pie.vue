<!-- 基础饼状图 -->
<template>
  <div>
    <fx-pie-chart :chartOption="chartOption" :extraOption="extraOption" />
  </div>
</template>

<script lang="ts" setup>

const chartOption = ref<IChartOption>({}) // 配置参数
const extraOption = ref<any>({}) // 扩展属性
const colorList = ['#7EFBFF', '#0ABAFF', '#10FFC9', '#EBBE43', '#D7F64B', '#FF4F8B']

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
    type: 'pie',
    xAxis: 'name',
    yAxis: 'value',
    color: colorList,
    loop: true,
    seriesData: [],
  }
  extraOption.value = {
    legend: {
      width: 100,
      top: 'middle',
      right: '20%',
      itemGap: 16,
      // textStyle: {
      //   color: '#78d9ff',
      //   fontSize: 16,
      // },
    },
    series: [
      {
        center: ['35%', '50%'], // 位置
      },
    ],
  }
}

</script>

<style lang="less" scoped>

</style>