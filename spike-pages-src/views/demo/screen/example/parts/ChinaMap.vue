<!-- 地图-简单tooltip -->
<template>
  <div>
    <fx-map-echart v-if="showMap" :geoJson='geoJson' :mapOption='mapOption'
      mapName='china' :functionList='mapFunctionList'></fx-map-echart>
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
    const data = [
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
      item.value = Math.floor(Math.random() * 1000)
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
      show: true,
      min: 0,
      max: 1,
      itemWidth: 10,
      itemHeight: 60,
      left: '23%',
      text: ['高', '低'],
      inRange: {
        color: ['#e0ffff', '#006edd'],
      },
    },
    tooltip: {
      show: true,
      trigger: 'item',
      confine: true, //tooltip始终在内
      backgroundColor: 'rgba(18,68,181,0.96)',
      borderColor: 'transparent',
      padding: [8, 10],
      formatter: (p: any) => {
        if (!p.data) {
          return ''
        }
        return `
        <div>
          <span style="color: #c5e3ff">${p.name}：</span>
          <span style="color: #ffcf5d">${p.data.value}</span>
        </div>
      `
      }
    },
    series: [
      {
        name: '分布',
        type: 'map',
        map: 'china',
        top: 10,
        bottom: -220,
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

</style>