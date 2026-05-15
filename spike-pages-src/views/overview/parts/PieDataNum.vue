<!-- 环形饼状图+右侧列表 -->
<template>
  <a-card :title="title">
    <div class="chart-wrap">
      <div class="left-chart">
        <MyPieChart :chartConfig="chartConfig" :chartOption="chartOption" />
      </div>
      <div class="right-list">
        <div class="item" v-for="(item, index) in pieList" :key="index">
          <div class="color" :style="{ backgroundColor: item.color }"></div>
          <div class="name">{{ item.name }}</div>
          <div class="value">
            <span class="num">{{ item.numUnit }}</span>
            <!-- <span class="unit">{{ item.unit }}</span> -->
          </div>
          <div class="per">{{ item.per }}</div>
        </div>
      </div>
    </div>
  </a-card>

</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import MyPieChart from '@c/echarts/pie/Index.vue'
import { formatFileSize } from '@u/utils'

const { t } = useI18n()

const chartConfig = ref<IChartOption>({}) // 配置参数
const chartOption = ref<any>({}) // 扩展属性
const pieList = ref<any[]>([]) // 数据

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  allData: {
    type: Array as PropType<any[]>,
  },
  colorList: {
    type: Array as PropType<string[]>,
  },
})

let first = true // 第一次进入，则不执行watch props.colorList 里内容

watch(() => props.allData, () => {
  // console.log('watch allData :>> ');
  initChart()
  getData()
})

watch(() => props.colorList, () => {
  if (first) {
    first = false
    return
  }
  // console.log('watch colorList :>> ');

  initChart()
  getData()
})

// 获取数据
function getData() {
  const data: any[] = props.allData

  const sum = data.reduce((sum, obj) => sum + obj.value, 0)
  const sumUnit = formatFileSize(sum)

  const list: any[] = []
  data && data.forEach((item, index) => {
    // item.numUnit = formatFileSize(item.value)
    list.push({
      name: item.name,
      num: item.value,
      numUnit:  item.numUnit,
      color: props.colorList[index],
      per: sum === 0 ? '0%' : (item.value / sum * 100).toFixed(2) + '%', // 要判断总数是0的情况，否则 就变成NaN%了。
    })
  })
  pieList.value = list

  chartOption.value.title.subtext = `${sumUnit}`
  chartConfig.value.seriesData = data

}

// 初始化图表
function initChart() {
  const colorT2 = getComputedStyle(document.documentElement).getPropertyValue('--color-t2')
  const colorT4 = getComputedStyle(document.documentElement).getPropertyValue('--color-t4')
  chartConfig.value = {
    type: 'pie',
    xAxis: 'name',
    yAxis: 'value',
    color: props.colorList,
    loop: true,
    tooltipTheme: 'light',
    seriesData: [],
  }
  chartOption.value = {
    tooltip: {
      confine: false, // 是否将 tooltip 框限制在图表的区域内。
    },
    title: {
      text: t('总大小'),
      subtext: '',
      left: '48%',
      top: '42%',
      textAlign: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: '400',
        color: colorT4,
      },
      subtextStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colorT2
      }
    },
    legend: {
      show: false,
    },
    series: [
      {
        radius: ['45%', '70%'], // 半径
        tooltip: {
            trigger: 'item',
            formatter: function (params: any) {
              const target: any = props.allData.find((item:any)=>item.name === params.name)
              return `${params.marker}<span style="margin-right:16px;">${params.name}</span> <span style="font-weight: bold;"> ${target.numUnit}</span>`;
            }
          }
      },
    ],
  }
}

</script>

<style lang="less" scoped>

:deep(.ant-card-head) {
  border: none;
  font-size: 22px;
  font-weight: 600;
  padding-top: 24px;
}

.chart-wrap {
  display: flex;
  overflow: hidden;
  height: 480px;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  >.left-chart {
    width: 280px;
    height: 280px;
    margin-right: 16px;
  }

  >.right-list {
    width: 100%;
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    .item {
      min-width: 350px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: var(--border);

      .color {
        width: 12px;
        height: 12px;
        border-radius: 12px;
        margin-right: 16px;
      }

      .name {
        flex: 1;
        font-size: 16px;
      }

      .value {
        font-size: 16px;
        text-align: right;
        color: var(--color-gray);
        .num {
          margin-right: 4px;
          font-size: 16px;
          // font-weight: bold;
          // color: #07cd53;
        }
      }

      .per {
        width: 100px;
        font-size: 16px;
        text-align: right;
        // color: #F57F17; // 比--color-orange-6 深一点
      }
    }
  }
}
</style>