<!-- 地图+自写列表 -->
<template>
  <div class="chart-wrap">
    <fx-map-echart v-if="showMap" :geoJson='geoJson' :mapOption='mapOption'
      mapName='china' :functionList='mapFunctionList'></fx-map-echart>

    <div class='legend-list'>
      <div class='item' v-for='(item, index) in mapLegend' :key='index'>
        <span class='color' :style="{ background: item.color }"></span>
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { get } from '@/api/axios/request'

const showMap = ref<boolean>(false) // 配置参数
const geoJson = ref<any>({}) // 配置参数
const mapOption = ref<any>({}) // 配置参数


const mapFunctionList = {
  mapClick: (e: any) => {
    console.log('e :>> ', e);
  }
} // 扩展属性


const mapLegend = ref([
  { color: 'rgb(67,255,155)', name: '非常好 75-100%' },
  { color: 'rgb(241,158,25)', name: '较好 50-75%' },
  { color: 'rgb(247,254,39)', name: '一般 25-50%' },
  { color: 'rgb(236,100,98)', name: '非常差 0-25%' }
])

getGeoJson()

function getGeoJson() {
  get('/static/map/china.json').then(res => {
    geoJson.value = res.data
    showMap.value = true
  })
}

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
      { name: '黑龙江', value: 0 },
      { name: '吉林', value: 0 },
      { name: '辽宁', value: 0 },
      { name: '河北', value: 0 },
      { name: '北京', value: 0 },
      { name: '天津', value: 0 },
      { name: '山东', value: 0 },
      { name: '江苏', value: 0 },
      { name: '浙江', value: 0 },
      { name: '福建', value: 0 },
      { name: '广东', value: 0 },
      { name: '广西', value: 0 },
      { name: '云南', value: 0 },
      { name: '西藏', value: 0 },
      { name: '新疆', value: 0 },
      { name: '内蒙古', value: 0 },
      { name: '河南', value: 0 },
      { name: '宁夏', value: 0 },
      { name: '青海', value: 0 },
      { name: '甘肃', value: 0 },
      { name: '陕西', value: 0 },
      { name: '山西', value: 0 },
      { name: '四川', value: 0 },
      { name: '重庆', value: 0 },
      { name: '贵州', value: 0 },
      { name: '湖南', value: 0 },
      { name: '湖北', value: 0 },
      { name: '安徽', value: 0 },
      { name: '江西', value: 0 },
      { name: '台湾', value: 0 },
      { name: '香港', value: 0 },
      { name: '澳门', value: 0 },
      { name: '海南', value: 0 },
      { name: '上海', value: 0 },
    ]

    data.forEach(item => {
      item.value = Math.floor(Math.random() * 100)
    })
    const max = Math.max(...data.map(item => item.value))
    const min = Math.min(...data.map(item => item.value))

    mapOption.value.series[0].data = data
    mapOption.value.visualMap.max = max
    mapOption.value.visualMap.min = min
  })
}

// 初始化图表
function initChart() {
  mapOption.value = {}
  mapOption.value = {
    visualMap: {
      show: false,
      type: 'piecewise',
      min: 0,
      max: 1,
      pieces: [
        {min: 75, max: 100, label: '非常好 75-100%', color: 'rgb(67,255,155)'},
        {min: 50, max: 75, label: '较好 50-75%', color: 'rgb(241,158,25)'},
        {min: 25, max: 50, label: '一般 25-50%', color: '#F1E134'},
        {min: 0, max: 25, label: '非常差 0-25%', color: '#E57261'},
      ],
    },
    tooltip: {
      show: true,
      trigger: 'item',
      confine: true, //tooltip始终在内
      backgroundColor: 'rgba(18,68,181,0.9)',
      borderColor: '#ffb956',
      formatter: (p: any) => {
        if (!p.data) {
          return ''
        }
        let { name, value } = p.data
        const content = `
          <div style="font-size: 14px;margin:4px 0;">
            <div style="color: #F7DB2A;font-size: 18px;margin-bottom:10px;">${name}</div>
            <div style="margin-top:5px;">
              <span style="color: #c5e3ff;margin-right:8px;">好评率</span>
              <span style="color: #ffcf5d;">${value} %</span>
            </div>
          </div>
        `
        return content
      }
    },
    series: [
      {
        name: '分布',
        type: 'map',
        map: 'china',
        top: 10,
        bottom: -90,
        left: '15%',
        borderWidth: 0,
        label: { // 文字
          show: false,
          color: '#fff',
        },
        itemStyle: {
          borderColor: '#6CF7FC',
          borderWidth: 1,
          shadowBlur: 0,
          shadowColor: 'rgba(1,109,191,.86)',
          shadowOffsetY: 2,
          shadowOffsetX: 0,
        },
        //对应的鼠标悬浮效果
        emphasis: {
          label: {
            show: true,
            color: '#fff',
          },
          itemStyle: {
            areaColor: 'rgba(4,162,231, 1)',
          },
        },
        data: []
      }
    ]
  }
}

</script>

<style lang="less" scoped>
.chart-wrap {
  position: relative;

  .legend-list {
    position: absolute;
    right: 20px;
    bottom: 10px;
    color: #fff;

    .item {
      margin-bottom: 4px;
      display: flex;
      align-items: center;

      .color {
        width: 12px;
        height: 12px;
        border-radius: 2px;
        margin-right: 8px;
      }
    }
  }
}
</style>