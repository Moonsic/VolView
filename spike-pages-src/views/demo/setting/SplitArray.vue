<template>
  <div>
    <a-space class="mb16">
      <a-button @click="onRefresh">清空</a-button>
      <a-button @click="setData">填入数据</a-button>
    </a-space>
    <p>一个数组，分成每个长度为num的多个小数组</p>

    <a-row class="row" v-for="(item, index) in list" :key="index">
      <a-col class="col" v-for="(item2, index2) in item" :key="index2">
        {{ item2.name }}
      </a-col>
    </a-row>


  </div>
</template>
<script setup>

// 已有的全部数据
const allList = []
for (let i = 0; i < 30; i++) {
  allList.push({ id: i, name: `张三${i}` })
}

const list = ref([])

function onRefresh() {
  list.value.length = 0
}
function setData() {
  list.value = splitGroup(allList, 8)
}

setData()


// array: 传入数组，size:每个小数据的长度
function splitGroup(array, size) {
  const newArray = []
  for (let i = 0; i < Math.ceil(array.length / size); i++) {
    let start = i * size
    let end = start + size
    newArray.push(array.slice(start, end))
  }
  return newArray
}


</script>
<style lang="less" scoped>
.col {
  width: 60px;
  height: 60px;
  margin-right: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>