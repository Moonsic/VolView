<template>
  <div class="view-page" :style="{ maxWidth: cardWidth + 'px', height: cardHeight + 'px' }">
    <div class="left" id="report-left">

      <SourceResultList ref="sourceResultListRef" @getCurData="getCurTimePoint"
        @getCurSelectedList="getCurSelectedList" />

      <SourceLocationResultList ref="sourceLocationResultListRef" @getCurData="getCurTimePoint"
        @getCurSelectedList="getCurSelectedList" />



    </div>
    <div class="right">
      <VolView ref="volviewRef" />
    </div>

    <a-button class="reset-btn" type="default" size="small" shape="round" @click="restartView">
      加载结构像
    </a-button>
  </div>

</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'
import html2canvas from 'html2canvas'

import { getFileNameAndSuffix } from '@u/utils'
import SourceResultList from './SourceResultList.vue'
import SourceLocationResultList from './SourceLocationResultList.vue'

import VolView from '@c/VolView.vue'

import {
  getNiiFileStreamApi, // 3. 获取结构像的2D图像
} from '@/api/sl'


const props = defineProps({
  nii_file_path: {
    type: String,
    default: '',
  },
  source_location_pts: {
    type: Object,
    default: {},
  },
  cluster_source_location_pts: {
    type: Object,
    default: {},
  },
})

// nii文件
watch(() => props.nii_file_path, () => {

  sourceResultListRef.value.setData(props.source_location_pts)
  sourceLocationResultListRef.value.setData(props.cluster_source_location_pts)

  niiFilePath.value = props.nii_file_path
  // 想nextTick延时再请求接口，不知道有没有效果，nextTick一般是20ms-120ms
  nextTick(() => {
    getData()
  })
})

const emit = defineEmits(['getLeftScreenshot'])

// 暴露方法
defineExpose({
  getScreenshot,
  restartView,
})

const cardWidth = ref(240 + 2 + 2 + 600) // 724: 240（原来是120）是左侧列表，40是左侧工具栏，22是Reset图标占的宽度20+2个边，左侧工具栏和Reset图标占的宽度都去掉了
const cardHeight = ref(540) // 原来是600

const sourceResultListRef = ref(null)
const sourceLocationResultListRef = ref(null)
const volviewRef = ref(null)


const niiFilePath = ref<string>('')
const curNiiFileUrl = ref<string>('')  // 当前结构像路径的url地址
const curNiiFileName = ref<string>('') // 当前结构像路径的Name

// 显示弹窗
async function getData() {
  if (!niiFilePath.value) {
    return message.info('请先选择NIFTI文件')
  }
  const params = {
    filePath: niiFilePath.value,
    mgz: 1  // 0:nii, 1:mgz
  }
  const { code, data } = await getNiiFileStreamApi(params)
  if (code === 200) {
    const [name, suffix] = getFileNameAndSuffix(niiFilePath.value) // [name: 'test', suffix:'nii'] = sub-01/anat/test.nii
    curNiiFileName.value = name + '.mgz'
    curNiiFileUrl.value = data
    volviewRef.value.setUrl(name + '.mgz', data)
  }
}

// 加载结构像
function restartView() {
  volviewRef.value.setUrl(curNiiFileName.value, curNiiFileUrl.value)
}

// 点击了列表某时刻点
function getCurTimePoint(position: number[]) {
  volviewRef.value.setPosition(position)
}

// 勾选了列表某些时刻点
function getCurSelectedList(obj: any) {
  volviewRef.value.setPointsColorArrow(obj)
}

// 获取截图
function getScreenshot() {
  volviewRef.value.getScreenshot()

  // 使用 html2canvas 生成左侧列表的截图
  const element = document.getElementById('report-left')
  html2canvas(element, {
    scale: 2, // 默认是 1，可以尝试更高的数值如 2 或者 3
    logging: true
  }).then((canvas) => {
    const leftScreenshot = canvas.toDataURL()
    emit('getLeftScreenshot', leftScreenshot)
  })

}

</script>

<style lang="less" scoped>
.view-page {
  margin: 0 auto;
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  background: #17181B;

  .left {
    width: 220px;
    min-width: 220px;
    height: 100%;
    display: inline-block;
    vertical-align: top;
    color: #ddd;
    background: #17181B; // 这个要加，否则截图时背景颜色变成白色
    overflow-y: scroll;
  }

  .right {
    width: calc(100% - 220px);
    height: 100%;
    display: inline-block;
    vertical-align: top;
    position: relative;
    overflow: hidden;
  }

  .reset-btn {
    position: absolute;
    top: -46px;
    right: 0;
    height: 32px;
    color: rgba(0, 0, 0, 0.88);
    background-color: #ffffff;
    border-color: #d9d9d9;

    &:hover {
      color: var(--color-primary);
      border-color: var(--color-primary);
    }
  }
}

</style>
