<template>
  <div ref="pageRef" id="report-page">
    开始
    <a-button @click="setPosition()">postMessage</a-button>
    <IconDownload class="text-18 cursor-pointer" title="下载" @click="onDownload()" />
    <div class="page">
      <iframe ref="iframeRef" src="http://localhost:8080" frameborder="0" width="100%" height="100%"></iframe>
    </div>
    结束
  </div>
  <div id="page2">
    新的开始
    <img :src="screenshot3D" />
    screenshotList:
    <template v-for="item in screenshotList">
      <img :src="item" />
    </template>
    新的结束
  </div>
</template>

<script setup>

import html2pdf from 'html2pdf.js'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const pageRef = ref(null)
const iframeRef = ref(null)
const screenshot3D = ref(null)
const screenshotList = ref([])

// 下载
function onDownload(id) {
  const element = document.getElementById(id);
  const opt = {
    margin: 0.5,
    filename: `demo.pdf`,
    pagebreak: {
      before: '.page-break', // 根据 .page-break这个class类分页
    },
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      // imageTimeout: 5000, // 设置图像加载的超时时间为30秒
    },
    jsPDF: {
      unit: 'in', // in英寸
      format: 'A4',
      orientation: 'portrait'
    }
  };

  html2pdf().from(element).set(opt).save();
}

// 设置定位
function setPosition() {
  const number = Math.round(Math.random() * 100)
  // 发送给iframe内的B项目
  const iframe = iframeRef.value
  if (iframe) {
    iframe.contentWindow.postMessage({
      type: 'screenshot',
      number: String(number),
    }, '*')
  }
}

// A 项目中的脚本
window.addEventListener('message', (event) => {
  // // 验证 event.origin 是否是你期望的源
  // if (event.origin !== 'http://b.example.com') return; // 假设 B 项目的源是 http://b.example.com

  console.log('Received message:', event.data);


  if (event.data.type === 'screenshot3D') {
    // 这里接收到了来自 B 项目的截图
    const screenshot = event.data.screenshot;
    screenshot3D.value = screenshot

    nextTick(()=>{

      // onDownload('page2')
      // const element = document.getElementById('page2');

      // // 使用 html2canvas 生成 A 项目的截图
      // html2canvas(element).then((canvas) => {
      //   const screenshotFromA = canvas.toDataURL();

      //   // 合并两张截图
      //   mergeScreenshots(screenshotFromA, screenshotFromB);
      // });
    })
  }
  if (event.data.type === 'screenshotList') {
    // 这里接收到了来自 B 项目的截图
    const screenshot = event.data.screenshot;
    screenshotList.value.push(screenshot)

    nextTick(()=>{

      // onDownload('page2')
      // const element = document.getElementById('page2');

      // // 使用 html2canvas 生成 A 项目的截图
      // html2canvas(element).then((canvas) => {
      //   const screenshotFromA = canvas.toDataURL();

      //   // 合并两张截图
      //   mergeScreenshots(screenshotFromA, screenshotFromB);
      // });
    })
  }
});

function mergeScreenshots(screenshotA, screenshotB) {
  // 这里你可以使用一个图像处理库，例如 jsPDF 和 FileSaver.js
  // 创建一个新的 PDF 文档
  var doc = new jsPDF();

  // 将截图添加到 PDF 文档中
  doc.addImage(screenshotA, 'JPEG', 0, 0); // A 项目的截图
  doc.addImage(screenshotB, 'JPEG', 0, doc.internal.pageSize.getHeight()); // B 项目的截图，放置在 A 项目截图下方

  // 保存 PDF 文件
  doc.save('screenshot.pdf');
}


</script>
<style lang="less" scoped>

#report-page {
  border: 8px solid #ddd;
  background: #f0f0f0;
}
.page {
  width: 100%;
  height: 600px;
  border-radius: 4px;
  border: 8px solid #faa;
  background: #afa;
}
</style>