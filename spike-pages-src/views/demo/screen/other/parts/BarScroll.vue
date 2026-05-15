<!-- 基础柱状图 -->
<template>
  <div class="chart-wrap" ref="chartRef">
    <fx-bar-chart :chartOption="chartOption" :extraOption="extraOption" :width="width" />
  </div>
</template>

<script lang="ts" setup>

const chartOption = ref<IChartOption>({}) // 配置参数
const extraOption = ref<any>({}) // 扩展属性
const width = ref<string | number>('100%') // 宽
const chartRef = ref(null)

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
      { name: '蜀山区', value: 10000 },
      { name: '庐阳区', value: 9200 },
      { name: '包河区', value: 9231 },
      { name: '瑶海区', value: 7100 },
      { name: '高新区', value: 6100 },
      { name: '滨湖区', value: 5350 },
      { name: '蜀山区1', value: 5001 },
      { name: '庐阳区1', value: 4920 },
      { name: '包河区1', value: 4231 },
      { name: '瑶海区1', value: 3710 },

      { name: '高新区1', value: 3610 },
      { name: '滨湖区1', value: 3350 },
      { name: '蜀山区2', value: 3001 },
      { name: '庐阳区2', value: 2920 },
      { name: '包河区2', value: 2231 },
      { name: '瑶海区2', value: 1710 },
      { name: '高新区2', value: 1610 },
      { name: '滨湖区2', value: 1350 },
      { name: '蜀山区3', value: 1001 },
      { name: '庐阳区3', value: 920 },
      { name: '包河区3', value: 823 },
      { name: '瑶海区3', value: 710 },
      { name: '高新区3', value: 610 },
      { name: '滨湖区3', value: 350 },
    ]
    const length = data.length
    const num = 10 // 几行开始滚动
    if (length >= num) {
      // 宽度100% - left20 - right20 - y轴宽度48 / num = 每一个柱子占的宽度， * length 后，再加上88
      width.value = ((chartRef.value.getBoundingClientRect().width * 1920 / window.innerWidth) - 88) / num * length + 88
    }
    chartOption.value.seriesData = data
  })
}

// 初始化图表
function initChart() { - 6
  chartOption.value = {
    type: 'bar',
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
    grid: {
      left: 20,
      right: 20,
    }
  }
}

</script>

<style lang="less" scoped>
.chart-wrap {
  width: 611px;
  height: 100%;
  overflow-x: auto;

  &::-webkit-scrollbar {
    width: 0px;
    height: 6px;
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(88,159,245,0.6);
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(88,159,245,0.8);
  }

}
</style>