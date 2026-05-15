<!-- 菜单切换+图表 -->
<template>
  <div class="chart-wrap">
    <SwitchMenu class="switch-menu" :list="tabList" :value="tab" :itemWidth="44" @change="changeTab"></SwitchMenu>
    <fx-bar-chart :chartOption="chartOption" :extraOption="extraOption" />
  </div>
</template>

<script lang="ts" setup>

// 菜单
const tab = ref('')
const tabList = [
  { label: '月', value: 'Month' },
  { label: '年', value: 'Year' },
  { label: '总', value: 'All' }
]

const chartOption = ref<IChartOption>({}) // 配置参数
const extraOption = ref<any>({}) // 扩展属性

onMounted(() => {
  init()
})

function init() {
  tab.value = tabList[0].value
  initChart()
  getData()
}

function changeTab(e: string) {
  tab.value = e
  getData()
}

// 获取数据
function getData() {
  // console.log('tab.value :>> ', tab.value)
  setTimeout(() => {
    const data = [
      { name: "户政", value: 198 },
      { name: "驾驶证", value: 123 },
      { name: "网安", value: 99 },
      { name: "边防", value: 169 },
      { name: "治安", value: 145 },
      { name: "港务", value: 143 },
    ]
    chartOption.value.seriesData = data
  })
}


// 初始化图表
function initChart() {
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
      top: '22%'
    },
  }
}


</script>

<style lang="less" scoped>

.chart-wrap {
  position: relative;
  .switch-menu {
    position: absolute;
    top: 6px;
    right: 16px;
    z-index: 99;
  }
}

</style>