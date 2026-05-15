<!-- 菜单切换 -->
<template>
  <div class="table">
    <SwitchMenu :list="tabList" :value="tab" :itemWidth="44" @change="changeTab"></SwitchMenu>
    <div class="content">

    </div>
  </div>
</template>

<script lang="ts" setup>

// 菜单
const tab = ref('Month')
const tabList = [
  { label: '月', value: 'Month' },
  { label: '年', value: 'Year' },
  { label: '总', value: 'All' }
]

const list = ref<any[]>([]) // 列表

onMounted(() => {
  init()
})

function init() {
  tab.value = tabList[0].value
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
      { name: '户政', value: 198 },
      { name: '驾驶证', value: 123 },
      { name: '网安', value: 99 },
      { name: '边防', value: 69 },
      { name: '治安', value: 45 },
      { name: '港务', value: 43 },
    ]
    list.value = data || []
  })
}

</script>

<style lang="less" scoped>
.table {
  display: flex;
  flex-direction: column;
  font-size: 16px;
  >.content {
    flex: 1;
    position: relative;
    border: 1px solid yellow;
  }

}
</style>