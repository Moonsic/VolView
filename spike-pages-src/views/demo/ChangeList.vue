<template>
  <div>
    <!-- <a-space class="mb16">
      <a-button @click="onRefresh">清空</a-button>
      <a-button @click="setData">填入数据</a-button>
    </a-space> -->
    <p> oldList:</p>
    <p>{{ oldList }}</p>
    <p> changeList: </p>
    <p>{{ changeList }}</p>
    <p> => newList: </p>
    <p>{{ newList }}</p>
  </div>
</template>
<script setup>


let list = reactive([])

function onRefresh() {
  list.length = 0
}
function setData() {
}

setData()


const oldList = [
  { id: 1, name: '张三', age: 18 },
  { id: 2, name: '李四', age: 20 },
  { id: 3, name: '王五', age: 25 },
]

const changeList = [
  { id: 1, name: '张三', age: 0 },
  { id: 3, name: '王五', age: 0 },
  { id: 4, name: '赵六', age: 0 },
  { id: 5, name: '王二', age: 0 },
]

// 用changeList去改变oldList，删除不要的，添加新的，没变的保留数据，得到newList
function changeOriginalList(oldList, changeList) {
  return changeList.map(item => {
    const target = oldList.find(f => f.id === item.id)
    return target || item
  })
}
const newList = changeOriginalList(oldList, changeList)
console.log('newList :>> ', newList);

</script>
<style lang="less" scoped>
</style>