<!-- 滚动表格 -->
<template>
  <div class="chart-wrap p8" ref="chartRef">
    <fx-scroll-board v-if="showTable" :config="config" :width="width" :height="height" />
  </div>
</template>

<script lang="ts" setup>

const width = ref('100%') // 宽
const height = ref(100) // 高
const chartRef = ref(null)
const showTable = ref(false)

const config = ref({
   //表头数据
  header: [
    {
      dataIndex: 'name',
      title: '企业名称',
      align: 'center',
      width: '40%',
    },
    {
      dataIndex: 'code',
      title: '企业信用代码',
      align: 'center',
      width: '30%',
    },
    {
      dataIndex: 'reason',
      title: '列入原因',
      align: 'center',
      width: '30%',
    }
  ],
  //表数据
  data: [],
  rowNum: 5, //表行数
  headerBg: 'linear-gradient(90deg, #2260e2, rgba(32, 68, 144, 0.66) 100%)',  //表头背景色
  rowBg: '#003B51', //表格背景色
  headerColor: '#c5e3ff',//表格字颜色
  oddRowBg: '#022F84', //奇数行背景色
  evenRowBg: '#062B79', //偶数行背景色
  color: '#c5e3ff',
  waitTime: 2000, //轮播时间间隔 ms
  headerHeight: 42, //表头高度
  showIndex: true, //显示行号
  indexHeader: '', //行号表头
  indexRadius: '50%',
  carousel: 'page', // 'single' | 'page'
  hoverPause: true //悬浮暂停轮播
})

onMounted(() => {
  init()
})

function init() {
  height.value = chartRef.value.getBoundingClientRect().height * 1920 / window.innerWidth - 16
  showTable.value = true
  getData()
}

// 获取数据
function getData() {
  setTimeout(() => {
    const data = [
      { id: 1, name: 'XX科技有限公司', code: '34081272312312', reason: '老赖' },
      { id: 2, name: 'XX有限责任公司', code: '34081272876349', reason: '老赖' },
      { id: 3, name: 'XX公司', code: '34081272311231', reason: '经营异常' },
      { id: 4, name: 'XX股份有限公司', code: '34081223123123', reason: '经营异常' },
      { id: 5, name: 'XX集团', code: '34081272317611', reason: '严重失信' },
      { id: 6, name: 'XX科技有限公司', code: '34081272312312', reason: '老赖' },
      { id: 7, name: 'XX有限责任公司', code: '34081272876349', reason: '老赖' },
      // { id: 3, name: 'XX公司', code: '34081272311231', reason: '经营异常' },
      // { id: 4, name: 'XX股份有限公司', code: '34081223123123', reason: '经营异常' },
      // { id: 5, name: 'XX集团', code: '34081272317611', reason: '严重失信' },
    ]
    config.value.data = data || []
  })
}

</script>

<style lang="less" scoped></style>