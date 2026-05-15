<template>
  <div>
    <a-space class="mb16">
      <a-button @click="onRefresh">清空</a-button>
      <a-button @click="setData">填入数据</a-button>
    </a-space>
    <p v-for="(item, index) in list" :key="item">{{ item }}</p>
  </div>
</template>
<script setup>

// 已有的全部数据
const allList = []
for (let i = 0; i < 2000; i++) {
  allList.push({ id: i, name: `张三${i}` })
}

let list = reactive([])


function onRefresh() {
  list.length = 0
}
import { bigDataBatchToList } from '@/utils/utils'
function setData() {
  bigDataBatchToList(list,allList,500)
  // setTimeoutLoop(500)
}

setData()


function setTimeoutLoop(num) {
  let index = 0
  const fn = () => {
    if (index >= allList.length / num) {
      return false
    }
    for (let i = num * index; i < num * (index + 1); i++) {
      if (allList[i]) {
        list.push(allList[i])
      }
    }
    index++
    console.log('index :>> ', index);
    if (num * index < allList.length) {
      setTimeout(() => {
        fn()
      }, 500)
    }
  }
  fn()
}




// // const splitList  = splitGroup(allList,500) // 得到：[[1,2,3],[4,5]]

// let index = 0

// console.log('splitList :>> ', splitList)

// // asyncLoop(index)

// function asyncLoop(index) {
//   if(index<splitList.length){
//     for (let item of splitList[index]) {
//         list.push(item)
//     }
//     console.log('list :>> ', list);
//     setTimeout(()=>{
//       index=index+1
//       asyncLoop(index)
//     },1000)
//   }
// }

// //array: 传入数组，size:每个小数据的长度
// function splitGroup(array, size) {
//   let newArray = []
//   for (let i = 0; i < Math.ceil(array.length / size); i++) {
//     let start = i * size
//     let end = start + size
//     newArray.push(array.slice(start, end))
//   }
//   return newArray
// }

// function loopData(data) {
//   const list = []
//   for (let i = 0; i < data.length; i++) {
//     list.push(i)
//   }
//   return list
// }

// console.log('list',list)

</script>
<style lang="less" scoped>
</style>