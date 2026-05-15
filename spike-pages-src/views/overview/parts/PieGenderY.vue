<!-- 环形饼状图+右侧列表 -->
<template>
  <a-card :title="title">
    <!-- <a-card title="性别占比图"> -->
    <div class="chart-wrap">
      <div class="left-chart">
        <div class="chart" ref="chartRef"></div>
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
  </a-card>

</template>

<script lang="ts" setup>
import { PropType } from 'vue'

import { ECharts, EChartsOption, init } from 'echarts'

let chart: ECharts = null
const chartRef = ref(null)

const pieList = ref<any[]>([]) // 数据

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  allData: {
    type: Array,
    default: () => [],
  },
  colorList: {
    type: Array as PropType<string[]>,
    default: () => ['#026FFF', '#FF4F8B', '#00aa00'],
  },
})

watch(() => props.allData, () => {
  initChart()
  getData()
})



// onMounted(() => {
//   chart = init(chartRef.value as HTMLElement)
//   initChart()

//   // // 添加定时器，每隔5秒重新渲染图表
//   // interval = setInterval(() => {
//   //   chart.clear()
//   //   initChart()
//   //   getData()
//   // }, 5000)
// })

// 获取数据
function getData() {
  setTimeout(() => {
    const data: any[] = props.allData
    // const data: any[] = [
    //   { name: '男性', value: 1001 },
    //   { name: '女性', value: 920 },
    // ]
    // console.log('data :>> ', data);
    let sum = data.reduce((sum, obj) => sum + obj.value, 0)
    // chartOption.value.seriesData = data
    // extraOption.value.title.subtext = `${sum}`

    const list: any[] = []
    data && data.map((item, index) => {
      list.push({
        name: item.name,
        num: item.value,
        unit: '人',
        color: props.colorList[index],
        per: (item.value / sum * 100).toFixed(2) + '%',
      })
    })
    pieList.value = list

    chart.setOption({
      title: {
        subtext: sum,
      },
      series: [{
        data: data
      }]
    })

  })
}

// 初始化图表
function initChart() {
  chart = init(chartRef.value as HTMLElement)
  chart.setOption(CHART_OPTION);
}

// 把配置和数据放这里
const CHART_OPTION: any = {
  title: {
    text: '总人数',
    subtext: '',
    left: '48%',
    top: '39%',
    textAlign: 'center',
    textStyle: {
      fontSize: 15,
      color: '#333'
    },
    subtextStyle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333'
    }
  },
  legend: {
    show: false,
  },
  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'], // 半径
      data: [
        // {
        //   "name": "是",
        //   "value": 12
        // },
        // {
        //   "name": "否",
        //   "value": 6
        // }
      ]
    },
  ],
}

</script>

<style lang="less" scoped>
// :deep(.ant-card-body) {
//   padding: 16px;
// }
.chart {
  width: 100%;
  height: 100%;
}

.chart-wrap {
  display: flex;
  overflow: hidden;
  height: 200px;

  >.left-chart {
    width: 240px;
    height: 198px;
    margin-right: 16px;
  }

  >.right-list {
    height: 100%;
    flex: 1;
    padding-right: 24px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;

    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 12px 0;

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
          // color: #07cd53;
        }
      }

      .per {
        width: 100px;
        font-size: 16px;
        font-weight: bold;
        text-align: right;
        // color: #ea0;
        color: #F57F17;
      }
    }
  }
}
</style>