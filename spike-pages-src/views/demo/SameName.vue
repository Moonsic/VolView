<template>
  <a-space direction="vertical">
    <p> list </p>
    <p>{{ list }}</p>
    <p> itemList </p>
    <p>{{ itemList }}</p>
    <p> nameList </p>
    <p>{{ nameList }}</p>
    <p> idList </p>
    <p>{{ idList }}</p>
  </a-space>
</template>
<script setup>

let list = [
  { id: 1, name: '张三', age: 18 },
  { id: 2, name: '李四', age: 20 },
  { id: 3, name: '王五', age: 25 },
  { id: 4, name: '李四', age: 28 },
  { id: 4, name: '李四', age: 29 },
]

let itemList = []
let nameList = []
let idList = []
list.forEach(item => {
  if (!nameList.includes(item.name)) {
    itemList.push(item)
    nameList.push(item.name)
    idList.push(item.id)
  } else {
    console.log('重名的名字 :>> ', item.name)
  }
})

console.log('itemList', itemList, nameList)

</script>
<style lang="less" scoped>
</style>