<!-- 南丁格尔玫瑰图饼状图+右侧列表 -->
<template>
  <div class="chart-wrap">
    <div class="left-chart">
      <fx-pie-chart :chartOption="chartOption" :extraOption="extraOption" />
    </div>
    <div class="right-list">
      <div class="item" v-for="(item, index) in pieList" :key="index">
        <div class="color" :style="{ backgroundColor: item.color }"></div>
        <div class="name">{{ item.name }}</div>
        <div class="value">
          <span class="num">{{ item.num }}</span>
          <span class="unit">{{ item.unit }}</span>
        </div>
        <div class="per">{{ item.per }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

const chartOption = ref<IChartOption>({}) // 配置参数
const extraOption = ref<any>({}) // 扩展属性
const colorList = ['#7EFBFF', '#0ABAFF', '#10FFC9', '#EBBE43', '#D7F64B', '#FF4F8B']
const pieList = ref<any[]>([]) // 数据

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
    const data: any[] = [
      { name: '蜀山区', value: 1001 },
      { name: '庐阳区', value: 920 },
      { name: '包河区', value: 1231 },
      { name: '瑶海区', value: 710 },
      { name: '高新区', value: 610 },
      { name: '滨湖区', value: 350 },
    ]
    let sum = data.reduce((sum, obj) => sum + obj.value, 0)
    chartOption.value.seriesData = data
    extraOption.value.title.subtext = `${sum}`

    const list: any[] = []
    data && data.map((item, index) => {
      list.push({
        name: item.name,
        num: item.value,
        unit: '个',
        color: colorList[index],
        per: (item.value / sum * 100).toFixed(2) + '%',
      })
    })
    pieList.value = list

  })
}

// 初始化图表
function initChart() {
  chartOption.value = {
    type: 'PIE_NIGHTINGALE',
    xAxis: 'name',
    yAxis: 'value',
    color: colorList,
    loop: true,
    seriesData: [],
  }
  extraOption.value = {
    title: {
      text: '总量',
      subtext: '1888人',
      left: '48%',
      top: '40%',
      textAlign: 'center',
      textStyle: {
        fontSize: 16,
        color: '#78d9ff'
      },
      subtextStyle: {
        fontSize: 18,
        color: '#78d9ff'
      }
    },
    legend: {
      show: false,
    },
    series: [
      {
        radius: ['30%', '70%'], // 半径
      },
      {
        radius: ['76%', '78%'], // 半径
        color: ['#2A6AA1']
      },
    ],
  }
}

</script>

<style lang="less" scoped>
.chart-wrap {
  display: flex;
  overflow: hidden;

  >.left-chart {
    width: 300px;
  }

  >.right-list {
    height: 100%;
    flex: 1;
    padding-right: 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;

    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 5px 0;

      .color {
        width: 12px;
        height: 12px;
        border-radius: 12px;
        margin-right: 10px;
      }

      .name {
        flex: 1;
        font-size: 16px;
      }

      .value {
        font-size: 16px;
        text-align: right;

        .num {
          margin-right: 4px;
          font-size: 16px;
          font-weight: bold;
          color: #5dff9a;
        }
      }

      .per {
        width: 80px;
        font-size: 16px;
        font-weight: bold;
        text-align: right;
        color: #ffcf5d;
      }
    }
  }
}
</style>