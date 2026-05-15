<!-- 数据库访问类型 -->
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
    backgroundColor: "transparent",
    color: colorList,
    type: "PIE_NIGHTINGALE",
    xAxis: 'name',
    yAxis: 'value',
    seriesData: [],
  }
  let width = 100
  extraOption.value = {
    title: {
      show: true,
      // text: "{a|} \n \n {x|办结时间}",
      x: "center",
      y: "center",
      textStyle: {
        rich: {
          a: {
            height: 30,
          },
          x: {
            fontSize: 16,
            color: "#fff",
          },
        },
      },
    },
    legend: {
      show: true,
      top: "20%",
      right: "5%",
      width: 100,
      icon: "circle",
      textStyle: {
        color: "#78d9ff",
        fontSize: 16,
      },
    },
    tooltip: {
      show: true,
      trigger: 'item',
      confine: true,
    },
    series: [
      {
        radius: ["30%", width], // 半径
        itemStyle: {
          // borderWidth:0,
          // borderWidth: 2, //设置border的宽度有多大,必须同时设置borderColor
          // borderColor: "#042775",
        },
        emphasis: {
          label: {
            show: false //从外面指向的线
          }
        },
        clockwise: false, //是否顺时针（默认true）
      },
      {
        radius: [width + 7, width + 10], // 半径
        color: ['#2A6AA1']
      },
    ],
  }
}

</script>

<style lang="less" scoped>

</style>