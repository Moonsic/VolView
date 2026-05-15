// 获取数据
// async function getData(first: boolean = false) {
  // setTimeout(() => {
  //   const data = [
  //     { id: 1, name: '数据1', num: '1' },
  //     { id: 2, name: '数据2', num: '2' },
  //     { id: 3, name: '数据3', num: '3' },
  //     { id: 4, name: '数据4', num: '4' },
  //     { id: 5, name: '数据5', num: '5' },
  //     { id: 6, name: '数据6', num: '6' },
  //     { id: 7, name: '数据7', num: '7' },
  //     { id: 8, name: '数据8', num: '8' },
  //     { id: 9, name: '数据9', num: '9' },
  //     { id: 10, name: '数据10', num: '10' },
  //   ]
  //   tableData.value = data || []
  //   total.value = data.length || 0
  // })
// }

// 获取数据
// function getData2() {
//   setTimeout(() => {
//     const data = [
//       { id: 1, spikeTime: '数据1', brainRegion: 'RT', positive: 0 },
//       { id: 2, spikeTime: '数据2', brainRegion: 'RT', positive: 1 },
//       { id: 3, spikeTime: '数据3', brainRegion: 'RT', positive: 1 },
//       { id: 4, spikeTime: '数据4', brainRegion: 'RT', positive: 1 },
//       { id: 5, spikeTime: '数据5', brainRegion: 'RT', positive: 0 },
//       { id: 6, spikeTime: '数据6', brainRegion: 'RT', positive: 1 },
//       { id: 7, spikeTime: '数据7', brainRegion: 'RT', positive: 0 },
//       { id: 8, spikeTime: '数据8', brainRegion: 'RT', positive: 0 },
//       { id: 9, spikeTime: '数据9', brainRegion: 'RT', positive: 1 },
//       { id: 10, spikeTime: '数据10', brainRegion: 'RT', positive: 0 },
//     ]
//     tableData.value = data || []
//     total.value = data.length || 0
//   })
// }



// const launchIntoFullscreen  = () => {
//   // 获取包含你要全屏的元素的引用
//   var element = document.documentElement;
//   // 在不同的浏览器中调用不同的方法以请求全屏
//   if (element.requestFullscreen) {
//     element.requestFullscreen();
//   } else if (element.mozRequestFullScreen) { // Firefox
//     element.mozRequestFullScreen();
//   } else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
//     element.webkitRequestFullscreen();
//   } else if (element.msRequestFullscreen) { // IE/Edge
//     element.msRequestFullscreen();
//   }
// }
// launchIntoFullscreen()