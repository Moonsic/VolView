<template>
  <div class="volview-page">
    <!-- <iframe ref="iframeRef" src="/static/volview-dist/index.html" frameborder="0" width="100%" height="100%"></iframe> -->
    <iframe ref="iframeRef" src="http://localhost:8088/" frameborder="0" width="100%" height="100%"></iframe>
  </div>
</template>

<script lang="ts" setup>

// 取消默认的浏览器自带右键
window.oncontextmenu = (e) => {
  e.preventDefault()
}

const iframeRef = ref(null)
const volviewReady = ref(false)
const volviewLoaded = ref(false)

// 暴露方法
defineExpose({
  volviewLoaded,
  clear,
  setUrl,
  setPosition,
  setPoints,
  setPointsColorArrow,
  clearPoints,
  getScreenshot,
  getScreenshotSingle,
  rotate,
  resetView,
  setNearValue,
  setShowResliceCursor,
  setShowResliceCursorLine,
  getCenter,
  dragFunction,
  changeWindow,
  changeLevel,
  addLayer,
  deleteLayer,
  setLayerColormap,
  setLayerOpacity,
  getLayerColormapPresets,
  refreshLayerAppearance
})

const emit = defineEmits([
  'getImageMetadata',
  'getSliceCenter',
  'getWindowLevel',
  'getLayerColormapPresets',
  'layerAppearanceChanged'
])

// 组件挂载时添加监听
onMounted(() => {
  // console.log('组件挂载 :>> ')
  window.addEventListener('message', eventListener)
});


// 组件卸载时移除监听
onBeforeUnmount(() => {
  // console.log('组件卸载 :>> ')
  clear()
  if (eventListener) {
    window.removeEventListener('message', eventListener)
    // console.log('🗑 已移除事件监听')
  }
});

function eventListener(event: { data: { type: string; value: any; } }) {
  // console.log('38 Received message:', event.data)
  // volview加载出来，可以使用postMessage了
  if (event.data.type === 'volviewReady') {
    console.log('volview ready')
    volviewReady.value = true
    getLayerColormapPresets()
    if (curFilePath && curUrl) {
      volviewLoaded.value = false // 先设置为false，等volviewLoaded后再设置为true
      iframeRef.value?.contentWindow.postMessage({
        type: 'file',
        filePath: curFilePath,
        fileUrl: curUrl,
        pageType: curPageType,
      }, '*')
    }
  }
  // 结构像加载出来了，可以画点了
  if (event.data.type === 'volviewLoaded') {
    console.log('file loaded')
    volviewLoaded.value = true
    iframeRef.value?.contentWindow.postMessage({
      type: 'clearPoints',
    }, '*')
    // console.log('status :>> ', setPointsStatus, setPositionStatus)


    // 定位和画点是2个不同的状态
    if (setPointsStatus === 'waitingSetPointsColorArrow') {
      // console.log('setPointsStatus 来这了？:>> ', setPointsStatus)
      setPointsStatus = ''
      setPointsColorArrow(allPointsObj, ballRadius)
    }

    if (setPositionStatus === 'waitingSetPosition') {
      setPositionStatus = ''
      setPosition(curPosition)
    }
  }

  // 结构像加载出来了，可以画点了
  if (event.data.type === 'getCenter') {
    const center: number[] = event.data.value
    console.log('当前中心点', center)
  }

  // centerObj.sliceList就是3个视图的切片
  if (event.data.type === 'getSliceCenter') {
    const centerObj: number[] = JSON.parse(event.data.value)
    // console.log('当前中心点 getSliceCenter', centerObj)
    emit('getSliceCenter', centerObj)
  }

  // 结构像的信息
  if (event.data.type === 'getImageMetadata') {
    const imageMetadata: any = JSON.parse(event.data.value)
    // console.log('当前结构像数据', imageMetadata)
    emit('getImageMetadata', imageMetadata)
  }

  if (event.data.type === 'getWindowLevel') {
    const windowLevel: any = JSON.parse(event.data.value)
    // console.log('当前明暗度', windowLevel) //GGG
    emit('getWindowLevel', {
      window: parseFloat(windowLevel.width.toFixed(2)),
      level: parseFloat(windowLevel.level.toFixed(2)),
      max: windowLevel.max,
      min: windowLevel.min,
    })
  }

  if (event.data.type === 'volviewLayerColormapPresets') {
    emit('getLayerColormapPresets', event.data.presets || [])
  }

  if (event.data.type === 'volviewLayerAppearanceChanged') {
    emit('layerAppearanceChanged', event.data)
  }

}


// 清除结构像和所有的点
function clear() {
  // console.log('清除结构像和所有的点 :>> ')
  // 发送给iframe内的B项目
  const iframe: any = iframeRef.value
  if (iframe) {
    iframe.contentWindow.postMessage({
      type: 'clear',
    }, '*')
  }
}

let curFilePath = '' // 当前的文件路径
let curUrl = ''   // 当前的文件url
let curPageType = ''   // 当前的文件url

// 设置Url，这样就不用URL.createObjectURL了，解决内存泄露的问题。
function setUrl(filePath: string, url: any, pageType: string) {
  // console.log('setUrl :>> ', filePath, url, pageType);
  curFilePath = filePath
  curUrl = url
  curPageType = pageType
  // 如果已经加载完了，就直接发送消息；没有就等volviewReady
  if (volviewReady.value) {
    // 发送给iframe内的B项目
    const iframe: any = iframeRef.value
    if (iframe) {
      volviewLoaded.value = false // 先设置为false，等volviewLoaded后再设置为true
      // 如果先打印postMessage，再打印VolView_V20250313就不会出现
      iframe.contentWindow.postMessage({
        type: 'file',
        filePath: filePath,
        fileUrl: url,
        pageType: pageType,
      }, '*')
    }
  }


}

function addLayer(filePath: string, url: any) {
  // console.log('addLayer :>> ', filePath, url);
  // 发送给iframe内的B项目
  const iframe: any = iframeRef.value
  if (iframe) {
    iframe.contentWindow.postMessage({
      type: 'addLayer',
      filePath: filePath,
      fileUrl: url,
    }, '*')
  }
}

function deleteLayer(filePath: string, url: any) {
  // console.log('addLayer :>> ', filePath, url);
  // 发送给iframe内的B项目
  const iframe: any = iframeRef.value
  if (iframe) {
    iframe.contentWindow.postMessage({
      type: 'deleteLayer',
      filePath: filePath,
      fileUrl: url,
    }, '*')
  }
}

function setLayerColormap(preset: string, mappingRange?: number[]) {
  const iframe: any = iframeRef.value
  if (iframe) {
    iframe.contentWindow.postMessage({
      type: 'setLayerColormap',
      preset,
      mappingRange,
    }, '*')
  }
}

function setLayerOpacity(opacity: number) {
  const iframe: any = iframeRef.value
  if (iframe) {
    iframe.contentWindow.postMessage({
      type: 'setLayerOpacity',
      opacity,
    }, '*')
  }
}

function getLayerColormapPresets() {
  const iframe: any = iframeRef.value
  if (iframe) {
    iframe.contentWindow.postMessage({
      type: 'getLayerColormapPresets',
    }, '*')
  }
}

function refreshLayerAppearance() {
  const iframe: any = iframeRef.value
  if (iframe) {
    iframe.contentWindow.postMessage({
      type: 'refreshLayerAppearance',
    }, '*')
  }
}

let curPosition: number[] = [] // 当前设置定位的位置
let setPositionStatus = ''
// 设置定位
function setPosition(array: number[]) {
  curPosition = array || []
  // 结构像没加载出来，设置定位也没有用，因为还没有postMessage，点都传不过去
  if (!volviewLoaded.value) {
    setPositionStatus = 'waitingSetPosition'
    return
  }

  // 发送给iframe内的B项目
  const iframe: any = iframeRef.value
  if (iframe) {
    iframe.contentWindow.postMessage({
      type: 'setPosition',
      position: JSON.stringify(array), // 改成这个统一，会好些。
      // change: false, // 默认false表示直接使用值，在volview内部不再转化。之前是需要转换的。
    }, '*')
  }
}


// 设置所有球体
function setPoints(positionList: number[][] = [], radius: number = 2.6) {

  // 解决一个bug，如果先全部消除，再增加1个点时，点数量从0变成1时，没法及时显示出点，所以始终要有一个点在图上
  if (!positionList.length) {
    positionList.push([1000, 1000, 1000])
  }
  // console.log('String(positionList) :>> ', JSON.stringify(positionList));

  // 发送给iframe内的B项目
  const iframe: any = iframeRef.value
  if (iframe) {
    iframe.contentWindow.postMessage({
      type: 'setPoints',
      positionList: JSON.stringify(positionList),
      radius: radius
    }, '*')
  }
}

// // 设置所有球体，带颜色的
// function setPointsColor(obj: any, radius: number = 2.6) {

//   let haveData = false
//   Object.values(obj).forEach((value: any) => {
//     if (value.length) {
//       haveData = true
//     }
//   })
//   // 如果没有数据，则直接清空
//   if (!haveData) {
//     return setPoints([])
//   }

//   // 发送给iframe内的B项目
//   const iframe: any = iframeRef.value
//   if (iframe) {
//     iframe.contentWindow.postMessage({
//       type: 'setPointsColor',
//       positionList: JSON.stringify(obj),
//       radius:  radius
//     }, '*')
//   }
// }


// 清空所有球体
function clearPoints() {
  // 发送给iframe内的B项目
  const iframe: any = iframeRef.value
  // console.log('clearPoints iframe :>> ', iframe);
  if (iframe) {
    iframe.contentWindow.postMessage({
      type: 'clearPoints',
    }, '*')
  }
}


let allPointsObj = {}
let setPointsStatus = ''
let ballRadius = 2.6 // 存起来，因为上面setPointsColorArrow会用到

// 设置所有球体，带颜色的，带箭头的
function setPointsColorArrow(obj: any, radius: number = 2.6) {
  ballRadius = radius

  // console.log('setPointsColorArrow :>> ', new Date().getTime());
  allPointsObj = obj
  // 结构像没加载出来，画点也没有用，因为还没有postMessage，点都传不过去
  if (!volviewLoaded.value) {
    setPointsStatus = 'waitingSetPointsColorArrow'
    // console.log('没有加载出来。打印status :>> ',setPointsStatus);
    return
  }
  // console.log('有了 :>> ',setPointsStatus);

  let haveData = false
  Object.values(obj).forEach((value: any) => {
    if (value.length) {
      haveData = true
    }
  })
  // 如果没有数据，则直接清空
  if (!haveData) {
    return clearPoints()
  }

  // 发送给iframe内的B项目
  const iframe: any = iframeRef.value
  if (iframe) {
    iframe.contentWindow.postMessage({
      type: 'setPointsColorArrow',
      positionList: JSON.stringify(obj),
      radius: radius
    }, '*')
  }
}


// 获取截图
function getScreenshot() {
  // 发送给iframe内的B项目
  const iframe = iframeRef.value
  if (iframe) {
    iframe.contentWindow.postMessage({
      type: 'screenshot',
    }, '*')
  }
}

// 获取单个的截图
function getScreenshotSingle(view: string, index: number) {
  // 发送给iframe内的B项目
  const iframe = iframeRef.value
  if (iframe) {
    iframe.contentWindow.postMessage({
      type: 'screenshotSingle',
      view: view,
      index: index,
    }, '*')
  }

}



function changeWindow(value: number) {
  // 发送给iframe内的B项目
  const iframe: any = iframeRef.value
  if (iframe) {
    iframe.contentWindow.postMessage({
      type: 'changeWindow',
      value: value
    }, '*')
  }
}

function changeLevel(value: number) {
  // 发送给iframe内的B项目
  const iframe: any = iframeRef.value
  if (iframe) {
    iframe.contentWindow.postMessage({
      type: 'changeLevel',
      value: value
    }, '*')
  }
}

// 鼠标左键拖拽功能
function dragFunction(value: boolean) {
  // 发送给iframe内的B项目
  const iframe: any = iframeRef.value
  if (iframe) {
    iframe.contentWindow.postMessage({
      type: 'dragFunction',
      value: value
    }, '*')
  }
}


// 获取中心点
function getCenter() {
  // 发送给iframe内的B项目
  const iframe: any = iframeRef.value
  if (iframe) {
    iframe.contentWindow.postMessage({
      type: 'getCenter',
    }, '*')
  }
}


// 设置显示或隐藏十字线的线
function setShowResliceCursorLine(value: boolean) {
  // 发送给iframe内的B项目
  const iframe: any = iframeRef.value
  if (iframe) {
    iframe.contentWindow.postMessage({
      type: 'setShowResliceCursorLine',
      value: value
    }, '*')
  }
}

// 设置显示或隐藏十字线&滑动条
function setShowResliceCursor(value: boolean) {
  // 发送给iframe内的B项目
  const iframe: any = iframeRef.value
  if (iframe) {
    iframe.contentWindow.postMessage({
      type: 'setShowResliceCursor',
      value: value
    }, '*')
  }
}

// 设置附近的点
function setNearValue(nearValue: number) {
  // 发送给iframe内的B项目
  const iframe: any = iframeRef.value
  if (iframe) {
    iframe.contentWindow.postMessage({
      type: 'setNearValue',
      nearValue: nearValue || 2.6
    }, '*')
  }
}


// 重置视角到中心点
function resetView() {
  // 发送给iframe内的B项目
  const iframe: any = iframeRef.value
  if (iframe) {
    iframe.contentWindow.postMessage({
      type: 'resetView',
    }, '*')
  }
}

// type 第几个图，从0开始
// type 0表示绕y轴旋转
// type 1表示绕x轴旋转
// type 2表示绕z轴旋转
function rotate(angle: number, type: number) {
  // 发送给iframe内的B项目
  const iframe: any = iframeRef.value
  // console.log('iframe :>> ', iframe);

  if (iframe) {
    // 8080跨域iframe.contentDocument是没有的，是null，但/static/volview-dist/index.html是有的。
    // console.log('iframe.contentDocument :>> ', iframe.contentDocument)
    // console.log('iframe.contentWindow :>> ', iframe.contentWindow)
    // console.log('iframe.contentWindow?.document :>> ', iframe.contentWindow?.document)
    const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document
    // console.log('iframeDocument :>> ', iframeDocument)

    // 获取所有vtk-container类的元素
    const elementsToRotate = iframeDocument.querySelectorAll('.vtk-container')
    // console.log('elementsToRotate :>> ', elementsToRotate)
    // 遍历元素并添加旋转样式类，同时设置旋转角度
    elementsToRotate.forEach((element: any, index: number) => {
      if (index === type) {
        element.style.transform = `rotate(${angle}deg)`
      }
    })

  }
}


// // 最新：现在不用这个方法，改用setUrl
// // 设置Blob。现在能获取到URL，这里再转化成url，重复了，改用setUrl。
// function setBlob(filePath: string, blob: any) {
//   const fileUrl = URL.createObjectURL(blob)
//   // 发送给iframe内的B项目
//   const iframe: any = iframeRef.value
//   if (iframe) {
//     iframe.contentWindow.postMessage({
//       type: 'file',
//       filePath: filePath,
//       fileUrl: fileUrl
//     }, '*')
//   }
// }


</script>

<style lang="less" scoped>
.volview-page {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  overflow: hidden;
  background: #424242;
}
</style>
