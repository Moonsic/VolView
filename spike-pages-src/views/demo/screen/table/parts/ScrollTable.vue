<!-- 表格 -->
<template>
  <ScrollTable :config="config" />
</template>

<script lang="ts" setup>

const config: any = ref({
  // 表头
  columns: [
    {
      dataIndex: 'index',
      title: '序号',
      width: '10%',
    },
    {
      dataIndex: 'name',
      title: '企业名称',
      width: '30%',
    },
    {
      dataIndex: 'code',
      title: '企业信用代码',
      width: '30%',
    },
    {
      dataIndex: 'reason',
      title: '列入原因',
      width: '30%',
      customRender: ({ text, record, index }: { text: string, record: any, index: number }) => {
        return `<span style="color: #FF7F80">${text}</span>`
      },
    }
  ],
  data: [], // 表数据
  rowNum: 5, // 一页行数
  scroll: true, // 是否滚动
  scrollType: 'num', // 滚动类型,'num'：根据滚动数量（默认），'page'：翻页，则scrollNum失效
  scrollNum: 2, // 滚动行数
  scrollSpeed: 1000, // 滚动速度
  waitTime: 3000, // 轮播时间间隔 ms
  space: 8, // 间距
  showHeader: true, // 显示表头
  headerHeight: 42, // 表头高度
  headerBg: 'linear-gradient(90deg, #2260e2, rgba(32, 68, 144, 0.66))',  //表头背景色
  fontSize: '16px', // 表格字体大小
  color: '#c5e3ff', // 表格颜色
  headerColor: '#c5e3ff', // 表头颜色
  rowBg: '#062B79', //表格背景色
  hoverBg: '#124ab1', // 表格hover颜色
  oddRowBg: '#022F84', //奇数行背景色
  evenRowBg: '#062B79', //偶数行背景色
})

onMounted(() => {
  init()
})

function init() {
  getData()
}

// 获取数据
function getData() {
  setTimeout(() => {
    const data = [
      { id: 1, name: 'XX科技有限公司1', code: '34081272312312', reason: '老赖' },
      { id: 2, name: 'XX有限责任公司2', code: '34081272876349', reason: '老赖' },
      { id: 3, name: 'XX公司3', code: '34081272311231', reason: '经营异常' },
      { id: 4, name: 'XX股份有限公司4', code: '34081223123123', reason: '经营异常' },
      { id: 5, name: 'XX集团5', code: '34081272317611', reason: '严重失信' },
      { id: 6, name: 'XX科技有限公司6', code: '34081272312312', reason: '老赖' },
      { id: 7, name: 'XX有限责任公司7', code: '34081272876349', reason: '老赖' },
      // { id: 8, name: 'XX公司8', code: '34081272311231', reason: '经营异常' },
      // { id: 9, name: 'XX股份有限公司9', code: '34081223123123', reason: '经营异常' },
      // { id: 10, name: 'XX集团10', code: '34081272317611', reason: '严重失信' },
    ]
    config.value.data = data
  })
}

</script>

<style lang="less" scoped>

</style>