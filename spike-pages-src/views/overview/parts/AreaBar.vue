<template>
  <a-card>
    <div class="chart" ref="chartRef"></div>
  </a-card>
</template>

<script lang="ts" setup>

import { ECharts, EChartsOption, init } from 'echarts'

let chart: ECharts
let interval: number | null = null

const chartRef: Ref<HTMLElement | null> = ref(null)

onMounted(() => {
  chart = init(chartRef.value as HTMLElement)
  initChart()
  getData()

  // // 添加定时器，每隔5秒重新渲染图表
  // interval = setInterval(() => {
  //   chart.clear()
  //   initChart()
  //   getData()
  // }, 5000)
})

// // 卸载组件时清除定时器
// onUnmounted(() => {
//   interval && clearInterval(interval)
// })


function initChart() {
  const option: EChartsOption = {
    // color: [
    //       // ["#43BDFF", "#026FFF"],
    //       // ["#FEC359", "#FEC359"],
    //       // ["#55E7F2", "#55E7F2"],
    //       // ["#0099FF", "#0099FF"],
    //     ],
    grid: {
      top: 30,
      bottom: 30,
      left: 60,
      right: 30,
    },
    // xAxis: {
    //   type: 'category'
    // },
    xAxis: [
      {
        type: 'category',
        axisLabel: {
          interval: 0,
          // rotate: 30,//倾斜
          color: "#78d9ff",
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "#295cae",
            width: 1,
            type: "solid",
          },
        }, //x轴线的颜色以及宽度
      },
    ],
    yAxis: [
      {
        name: '(个)',
        nameTextStyle: {
          //y轴上方单位的颜色
          color: "#78d9ff",
        },
        axisLabel: {
          color: "#78d9ff",
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "#295cae",
            width: 1,
            type: "solid",
          },
        }, //Y轴线的颜色以及宽度
        splitLine: {
          //网格线
          lineStyle: {
            type: "dashed", //设置网格线类型 dotted：虚线   solid:实线
            width: 1,
            color: "#285CAE",
          },
          show: true, //隐藏或显示
        },
      },
    ],
    series: [
      {
        type: 'bar'
      }
    ]
  }
  chart.setOption(option)
}

function getData() {
  const option: EChartsOption = {
    xAxis: {
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260]
      }
    ]
  }
  chart.setOption(option)
}



</script>

<style scoped>
.chart {
  width: 800px;
  height: 300px;
}
</style>