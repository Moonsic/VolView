
// let oldList = [
//   { id: 1, name: '张三', age: 18 },
//   { id: 2, name: '李四', age: 20 },
//   { id: 3, name: '王五', age: 25 },
//   { id: 4, name: '李四', age: 25 },
// ]
// console.log(oldList)

// 2小时30分钟转化成 2.5
// 不能没有“小时”两个字，不能有除了“小时分钟”其他的字。
// const a = '2小时30分钟'
// if(a?.includes('小时')){
//   let b = a.replace('小时',',').replace('分钟','').split(',')
//   let [hour,min] = b
//   console.log('b :>> ', b)
//   console.log('hour,min :>> ', hour,min)
//   let c = min/60
//   console.log('c :>> ', c);
//   let d = parseFloat((Number(hour) + Number(c)).toFixed(2))
//   console.log('d :>> ', d);
// } else if(a?.includes('分钟')) {
//   let min = a.replace('分钟','')
//   console.log('min :>> ',min)
//   let c = min/60
//   console.log('c :>> ', c);
//   let d = parseFloat(Number(c).toFixed(2))
//   console.log('d d:>> ', d);
// } else {
//   console.log('dd d:>> ', null);
// }



// let changeList = [
//   {id:1,name:'张三',age:0},
//   {id:3,name:'王五',age:0},
//   {id:4,name:'赵六',age:0},
//   {id:5,name:'王二',age:0},
// ]

// // 用changeList去改变oldList，删除不要的，添加新的，没变的保留数据，得到newList
// function changeOriginalList(oldList,changeList){
//   return changeList.map(item=>{
//     let target = oldList.find(f=>f.id===item.id)
//     return target || item
//   })
// }
// let newList = changeOriginalList(oldList,changeList)
// console.log('newList :>> ', newList);


// let tableList = JSON.stringify(changeList)
// let tableList2 = 'changeList.sss'
// console.log('object :>> ', typeof tableList);
// console.log('object :>> ', typeof JSON.parse(tableList));
// console.log('object2 :>> ', typeof tableList2);
// if(typeof JSON.parse(tableList) === 'object'){

// }
