<template>
  <div>
    <!-- <a-space class="mb16">
      <a-button @click="onRefresh">清空</a-button>
      <a-button @click="setData">填入数据</a-button>
    </a-space> -->
    <!-- <p v-for="(item, index) in list" :key="item">{{ item }}</p> -->
    <p>{{ menu }}</p>
  </div>
</template>
<script lang="ts" setup>

// 已有的全部数据
const allList = []
for (let i = 0; i < 2000; i++) {
  allList.push({ id: i, name: `张三${i}` })
}

let list = reactive([])


function onRefresh() {
  list.length = 0
}
function setData() {
}

setData()

// 树，根据orderId，排序
let menu = [
  {
    value: 12, label: '数据1', children: [
      { value: 122, label: '数据11' },
      { value: 12, label: '数据12' }
    ]
  },
  { value: 20, label: '数据2' },
  { value: 30, label: '数据3' },
  { value: 4, label: '数据4' },
  { value: 5, label: '数据5' },
]
// sortTree(menu)
// console.log('menu :>> ', menu);

import { sortTreeByKey } from '@/utils/utils'
sortTreeByKey(menu,'value')
console.log('menu :>> ', menu);

interface ITree {
  orderId: number
  children?: ITree[] | null
}
// 树，递归，排序
function sortTree(data: ITree[]) {
  data.sort((a, b) => a.orderId - b.orderId)
  data.forEach(item => {
    if (Array.isArray(item.children)) {
      sortTree(item.children)
    }
  })
}

</script>
<style lang="less" scoped>

</style>