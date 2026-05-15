<template>
  <div class="main-page">
    <div class="page-top">

      <div class="flex-start">

        <Back class="page-back" :title="t('共注册')" />

        <SelectPatient class="mr16" :megId="megId" :subjectId="subjectId" @change="changePatientList" />
        <a-space>

          <!-- <a-input-number class="input-100" v-model:value="valueX" size="small" placeholder=""  />
          <a-input-number class="input-100" v-model:value="valueY" size="small" placeholder=""  />
          <a-input-number class="input-100" v-model:value="valueZ" size="small" placeholder=""  />
          <a-button type="primary" size="small" @click="add">
            确定位置
          </a-button> -->

          <a-button class="light-primary-btn" type="primary" size="small" shape="round" @click="onAdd">
            <span class="anticon">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 15" fill="none">
                <path
                  d="M12.8334 7.639V11.139C12.8334 12.4277 11.7887 13.4723 10.5001 13.4723H3.50008C2.21142 13.4723 1.16675 12.4277 1.16675 11.139V4.139C1.16675 2.85033 2.21142 1.80566 3.50008 1.80566H7.00008M9.15046 2.9856C9.15046 2.9856 9.15046 3.81994 9.9848 4.65428C10.8191 5.48862 11.6535 5.48862 11.6535 5.48862M5.34031 9.96624L7.09242 9.71594C7.34516 9.67984 7.57937 9.56273 7.75989 9.38221L12.4878 4.65428C12.9486 4.19349 12.9486 3.44639 12.4878 2.9856L11.6535 2.15126C11.1927 1.69047 10.4456 1.69047 9.9848 2.15126L5.25687 6.87919C5.07635 7.05971 4.95924 7.29392 4.92314 7.54666L4.67284 9.29877C4.61721 9.68813 4.95095 10.0219 5.34031 9.96624Z"
                  stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
              </svg>
            </span>
            {{ t('发起共注册') }}
          </a-button>

          <UploadData :megId="megId" :subjectId="subjectId" type="mri" @uploadFileSuccess="uploadFileSuccess" />
          <UploadData :megId="megId" :subjectId="subjectId" type="pet" @uploadFileSuccess="uploadFileSuccess" />
          <UploadData :megId="megId" :subjectId="subjectId" type="ct" @uploadFileSuccess="uploadFileSuccess" />

        </a-space>

        <!-- <a-space>
          <a-button class="light-primary-btn" v-if="!showCoreg" type="primary" size="small" shape="round"
            @click="onCoregResult()">
            <IconSearch />
            <span>{{ t('查看配准结果') }}</span>
          </a-button>
          <a-button v-if="showCoreg" type="default" size="small" shape="round" @click="cancelShowCoreg()">
            {{ t('退出配准') }}
          </a-button>
          <IconSave />
          保存配准结果
          </a-button>
        </a-space> -->

      </div>

      <div class="flex-between">

        <div class="flex-start">
        </div>

        <a-space>
          <a-button size="small" shape="round" :title="showSide ? t('收起') : t('展开')" @click="clickShowSide">
            <template #icon>
              <!-- <MenuUnfoldOutlined v-if="showSide" />
              <MenuFoldOutlined v-if="!showSide" /> -->
              <SettingOutlined />
            </template>
          </a-button>

        </a-space>
      </div>

    </div>
    <div class="page-bottom">


      <div class="page-left">

        <div class="scroll">

          <ProcessedNiiFileList ref="processedNiiFileListRef" :megId="megId" :subjectId="subjectId"
            @getCurData="getCurCoregWidthUrlFromProecessed" />

          <NiiFileList ref="niiFileListRef" :megId="megId" :subjectId="subjectId" @getCurData="getCurCoregWidthUrl"
            @addLayer="addLayer" @deleteLayer="deleteLayer" @reload="clearLayerOnly" />

        </div>
      </div>
      <div class="page-center">
        <VolView ref="volviewRef" @getImageMetadata="getImageMetadata" @getSliceCenter="getSliceCenter"
          @getWindowLevel="getWindowLevel" @getLayerColormapPresets="getLayerColormapPresets"
          @layerAppearanceChanged="onLayerAppearanceChanged" />
      </div>

      <VolViewSide v-show="showSide" :disabled="curNiiFilePath" :subjectId="subjectId" :imageMetadata="imageMetadata"
        :planeOrigin="planeOrigin" :sliceDomain="sliceDomain" :sliceList="sliceList" :showSliceBox="false"
        :windowNew="windowNew" :levelNew="levelNew" :minNew="minNew" :maxNew="maxNew" @switchFunction="switchFunction"
        @setShowResliceCursor="setShowResliceCursor" @restartView="restartView" @resetView="resetView"
        @changeWindow="changeWindow" @changeLevel="changeLevel">

        <div class="bg-color mb8">
          <div class="text-bold mb8">{{ t('共注册叠加层') }}：</div>

          <div class="mb8">{{ t('颜色映射') }}：</div>
          <a-select class="select-style2 widthP100 mb12" v-model:value="layerColormap" :disabled="!curNiiFilePath"
            show-search :filter-option="filterColormapOption" popupClassName="select-colormap-dropdown"
            @change="handleLayerColormapChange">
            <a-select-option v-for="(item) in layerColormapOptions" :value="item.value" :key="item.value"
              :label="item.label">
              <div class="flex-start">
                <div class="colormap-bar" :style="{ background: item.palette }"></div>
                <div>{{ item.label }}</div>
              </div>
            </a-select-option>
            <!-- <template #option="{ label, palette }">
              <div class="colormap-option">
                <div class="colormap-bar" :style="{ background: palette }"></div>
                <span>{{ label }}</span>
              </div>
            </template>
            <template #label="{ label, palette }">
              <div class="colormap-option">
                <div class="colormap-bar" :style="{ background: palette }"></div>
                <span>{{ label }}</span>
              </div>
            </template> -->
          </a-select>

          <div class="mb8">{{ t('透明度') }}：{{ layerOpacity }}%</div>
          <a-slider v-model:value="layerOpacity" :min="1" :max="100" :disabled="!curNiiFilePath"
            @change="handleLayerOpacityChange" />
        </div>

      </VolViewSide>


    </div>
  </div>

  <!-- 发起共注册弹窗 -->
  <AddModal ref="addModalRef" :megId="megId" :subjectId="subjectId" />

</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { debounce } from '@u/utils'

import SelectPatient from '@c/SelectPatient.vue'
import VolViewSide from '@c/VolViewSide.vue'
import VolView from '@c/VolView.vue'
import NiiFileList from './NiiFileList.vue'
import UploadData from './UploadData.vue'
import AddModal from './modal/AddModal.vue'

import ProcessedNiiFileList from '../reviewMri/ProcessedNiiFileList.vue'

import {
  getNiiFileStreamApi, // 3. 获取结构像的2D图像
} from '@/api/sl'

import { useWebSocketStore } from '@/store/websocket'
const webSocketStore = useWebSocketStore()

const { t } = useI18n()

const router = useRouter()

const processedNiiFileListRef = ref(null)

// 有gzcId，代表共注册任务结束，需要刷新列表。
watch(() => webSocketStore.lastReceivedMessage, (newValue: any) => {
  // console.log('通知内容 :>> ', newValue);
  if (newValue.type === 'multimodal_coreg_success') {
    // window.location.reload()
    router.replace({
      path: 'multiImageCoreg',
      query: {
        subjectId: subjectId.value,
        megId: megId.value,
      }
    })
    setTimeout(() => {
      window.location.reload()
    })
    // hardResetCurrentPageState()
    // processedNiiFileListRef.value.getData()
    // processedNiiFileListRef.value.cancelSelect()
    // nextTick(() => {
    //   niiFileListRef.value.changePatient()
    // })
  }
})


// 修改患者
function changePatientList(record: any) {
  subjectId.value = record.subjectId
  megId.value = record.megId
  document.title = `${t('共注册')} | ${megId.value}`
  curCoreg.value = {}
  curCoregId.value = ''
  curNiiFilePath.value = ''
  curNiiFileUrl.value = ''
  curNiiFileName.value = ''
  router.replace({
    path: 'multiImageCoreg',
    query: {
      subjectId: subjectId.value,
      megId: megId.value,
    }
  })
  setTimeout(() => {
    window.location.reload()
  })
  return
  nextTick(() => {
    hardResetCurrentPageState()
    processedNiiFileListRef.value.getData()
    processedNiiFileListRef.value.cancelSelect()
    niiFileListRef.value.changePatient()

    //     // 清空配准相关
    // showCoreg.value = false
    // allPoints = []
  })
}

const route = useRoute()
const megId = ref<string>(String(route.query.megId || ''))
const subjectId = ref<string>(String(route.query.subjectId || ''))
document.title = `${t('共注册')} | ${megId.value}`

if (!megId.value) {
  message.info(t('请先选择患者'))
}

// 上传数据成功，刷选患者数据列表
function uploadFileSuccess() {
  // console.log('上传数据成功');
}

const niiFileListRef = ref(null)
const volviewRef = ref(null)

const LAYER_COLORMAP_STORAGE_KEY = 'gzcLayerColormap'
const LAYER_OPACITY_STORAGE_KEY = 'gzcLayerOpacity'

const layerColormap = ref(localStorage.getItem(LAYER_COLORMAP_STORAGE_KEY) || 'PET-rainbow')
const layerOpacity = ref(Number(localStorage.getItem(LAYER_OPACITY_STORAGE_KEY) || 60))
const layerColormapPresets = ref<any[]>([])
const layerColormapOptions = computed(() =>
  layerColormapPresets.value
)

setTimeout(() => {
  console.log('layerColormapOptions :>> ', layerColormapOptions.value);
  const labelList = layerColormapOptions.value.map((item) => item.label)
  console.log('labelList :>> ', labelList);
}, 3000)


const curCoreg = ref<any>({}) // 当前配准结果
const curCoregId = ref<string>('') // 当前配准结果id
const curNiiFilePath = ref<string>('') // 当前结构像路径
const curNiiFileUrl = ref<string>('')  // 当前结构像路径的url地址
const curNiiFileName = ref<string>('') // 当前结构像路径的Name

// // 点击了某配准结果，获取nii数据，展示三维切片，获取溯源定位结果列表
// async function getCurCoreg(record: any) {
//   // console.log('curCoreg :>> ', record);

//   curCoreg.value = record
//   curCoregId.value = record.id
//   curNiiFilePath.value = record.niiFilePath

//   // 每次切换，把url改一下，下次刷新页面就不是旧的url了
//   router.push({
//     path: 'multiImageCoreg',
//     query: {
//       megId: megId.value,
//       subjectId: subjectId.value,
//     }
//   })

//   // 每次切换，2个列表都要更新数据
//   // sourceResultListRef.value.setData(curCoregId.value)

//   // // 想nextTick延时再请求接口，不知道有没有效果，这里nextTick只有4ms

//   nextTick(async () => {
//     const params = {
//       filePath: curNiiFilePath.value,
//       mgz: 1  // 0:nii, 1:mgz
//     }
//     const { code, data } = await getNiiFileStreamApi(params)
//     if (code === 200) {
//       const [name, suffix] = getFileNameAndSuffix(curNiiFilePath.value) // [name: 'test', suffix:'nii'] = sub-01/anat/test.nii
//       curNiiFileName.value = name + '.mgz'
//       curNiiFileUrl.value = data
//       restartView()
//     }
//   })

// }


// 点击预处理后的文件列表，带溯源定位结构像列表
async function getCurCoregWidthUrlFromProecessed(record: any) {
  // console.log('record :>> ', record);
  curCoreg.value = record
  curCoregId.value = record.id
  curNiiFilePath.value = record.fsprepNiiFilePath
  curNiiFileUrl.value = record.fsprepNiiUrl
  curNiiFileName.value = record.fsprepNiiFileName
  volviewRef.value.setUrl(record.fsprepNiiFileName, record.fsprepNiiUrl, 'gzc') // test.nii，因为本来就是nii文件，所以直接用item.name
  syncLayerAppearance()
}



// 点击，带溯源定位结构像列表
async function getCurCoregWidthUrl(record: any) {
  console.log('record :>> ', record);
  curCoreg.value = record
  curCoregId.value = record.id
  curNiiFilePath.value = record.filePath
  curNiiFileUrl.value = record.fileUrl
  curNiiFileName.value = record.name
  volviewRef.value.setUrl(record.name, record.fileUrl, 'gzc') // test.nii，因为本来就是nii文件，所以直接用item.name
  syncLayerAppearance()
}

// 加载结构像
function restartView() {
  volviewRef.value.setUrl(curNiiFileName.value, curNiiFileUrl.value, 'gzc')
  niiFileListRef.value.cancelSelect()
  syncLayerAppearance()
}

function resetView() {
  volviewRef.value.resetView()
}


async function addLayer(record: any) {
  volviewRef.value.addLayer(record.name, record.fileUrl)
  syncLayerAppearance()
}

async function deleteLayer(record: any) {
  volviewRef.value.deleteLayer(record.name, record.fileUrl)
}

function clearCurrentViewState() {
  volviewRef.value?.clear()
  niiFileListRef.value?.cancelSelect()
  layerColormap.value = layerColormap.value || 'PET-rainbow'
  layerOpacity.value = layerOpacity.value || 60
}

function clearLayerOnly() {
  const checkedList = niiFileListRef.value?.getCheckedList?.() || []
  checkedList.forEach((item: any) => {
    volviewRef.value?.deleteLayer(item.name, item.fileUrl)
  })
  niiFileListRef.value?.cancelSelect()
}

function hardResetCurrentPageState() {
  clearCurrentViewState()
  curCoreg.value = {}
  curCoregId.value = ''
  curNiiFilePath.value = ''
  curNiiFileUrl.value = ''
  curNiiFileName.value = ''
}

function syncLayerAppearance() {
  volviewRef.value?.setLayerColormap(layerColormap.value)
  volviewRef.value?.setLayerOpacity(layerOpacity.value)
  volviewRef.value?.refreshLayerAppearance()
}

function handleLayerColormapChange(value: string) {
  layerColormap.value = value
  localStorage.setItem(LAYER_COLORMAP_STORAGE_KEY, value)
  volviewRef.value?.setLayerColormap(value)
  volviewRef.value?.refreshLayerAppearance()
}

const handleLayerOpacityChange = debounce((value: number) => {
  layerOpacity.value = value
  localStorage.setItem(LAYER_OPACITY_STORAGE_KEY, String(value))
  volviewRef.value?.setLayerOpacity(value)
}, 10)

function getLayerColormapPresets(presets: any[]) {
  layerColormapPresets.value = presets || []
  const valueList = layerColormapPresets.value.map((item: any) => item.value)
  if (!valueList.includes(layerColormap.value)) {
    layerColormap.value = layerColormapPresets.value[0]?.value || 'PET-rainbow'
    localStorage.setItem(LAYER_COLORMAP_STORAGE_KEY, layerColormap.value)
  }
}

function filterColormapOption(input: string, option: any) {
  return String(option?.label || '')
    .toLowerCase()
    .includes(input.toLowerCase())
}

function onLayerAppearanceChanged(event: any) {
  if (event?.success === false) {
    message.error(event.message || t('叠加层设置失败'))
  }
}

onMounted(() => {
  nextTick(() => {
    volviewRef.value?.getLayerColormapPresets()
  })
})



// 发起共注册弹窗
const addModalRef = ref(null)
// 发起共注册
function onAdd() {
  addModalRef.value.showModal(curCoreg.value)
}



const showCoreg = ref(false) // 是否显示3D页面


// // 点击查看溯源结果按钮
// async function onCoregResult() {

//   if (curNiiFilePath.value) {
//     // setTimeout(() => {
//     setRotateView(false) // 关闭旋转组件
//     // }, 1000)
//   }

//   // 先获取状态看有没有配准id
//   getTaskStatus(() => {
//     // 有配准
//     if (coregId.value) {

//       // 如果当前已经有加载的预处理结构像，就直接获取头皮点
//       if (curNiiFileType.value === 'processedNiiFile' && curNiiFilePath.value) {
//         getCoregHeadShapePoints()
//         setTimeout(() => {
//           showCoreg.value = true
//         }, 300)
//       } else {
//         const haveData = processedNiiFileListRef.value.clickFirstItem()
//         if (haveData) {
//           getCoregHeadShapePoints()
//           setTimeout(() => {
//             showCoreg.value = true
//           }, 300)
//         }
//       }
//     } else {
//       onCoreg()
//     }
//   })

// }










// 显示十字线&滑动条
const showResliceCursor = ref(true)
function setShowResliceCursor(value: boolean) {
  showResliceCursor.value = value
  volviewRef.value.setShowResliceCursor(value)
}

// const valueX = ref(0)
// const valueY = ref(0)
// const valueZ = ref(0)
// function add() {
//   const obj = {
//     '#f00': [[[
//       valueX.value,
//       valueY.value,
//       valueZ.value,
//     ], [0, 0, 1]]],
//   }
//   volviewRef.value.setPointsColorArrow(obj)
// }



// 右侧功能栏
const showSide = ref(true)
function clickShowSide() {
  showSide.value = !showSide.value
}

const curFunction = ref('close')

function switchFunction(value: string) {
  curFunction.value = value
  volviewRef.value.dragFunction(value)
}

const imageMetadata = ref()
function getImageMetadata(obj: string) {
  imageMetadata.value = obj
  console.log('结构像信息 :>> ', obj);
}
const planeOrigin = ref()
const sliceDomain = ref()
const sliceList = ref()

function getSliceCenter(obj: any) {
  // console.log('getSliceCenter :>> ', obj);
  planeOrigin.value = obj.planeOrigin
  sliceDomain.value = obj.sliceDomain
  sliceList.value = obj.sliceList


  // console.log('slice :>> ', obj.sliceList['ObliqueCoronal']);


  // console.log('planeOrigin :>> ', obj);
  // console.log('planeOrigin new :>> ', getNewPosition(obj.planeOrigin));


  // const slice = imageMetadata.value.dimensions[2] * (planeOrigin.value[1] - sliceDomain.value.min) / (sliceDomain.value.max - sliceDomain.value.min)
  // console.log('slice391 :>> ', slice);

}

const windowNew = ref(0)
const levelNew = ref(0)
const maxNew = ref(0)
const minNew = ref(0)

function getWindowLevel(windowLevel: any) {
  // console.log('windowLevel :>> ', windowLevel); GGG
  windowNew.value = windowLevel.window
  levelNew.value = windowLevel.level
  maxNew.value = windowLevel.max
  minNew.value = windowLevel.min
}

function changeWindow(value: number) {
  windowNew.value = value
  volviewRef.value.changeWindow(windowNew.value)
}

function changeLevel(value: number) {
  levelNew.value = value
  volviewRef.value.changeLevel(levelNew.value)
}



</script>

<style lang="less">
// 改变下拉框打开时的选项样式
.ant-select-dropdown.select-patient-dropdown {
  // display: block !important; // 测试的时候把这个打开就行了
  padding: 4px 2px 4px 4px; // 让滚动条有边距

  .ant-select-item-option {
    padding: 4px 8px;

    .option-item {
      white-space: normal;
      word-break: break-all;

      &::before {
        content: '';
        display: inline-block;
        width: 6px;
        height: 6px;
        margin-right: 5px;
        border-radius: 50%;
        transform: translateY(-2px);
      }

      &.tag-red::before {
        background: var(--color-red);
      }

      &.tag-green::before {
        background: var(--color-green);
      }

      &.tag-yellow::before {
        background: var(--color-yellow);
      }

      &.tag-gray::before {
        background: var(--color-t5);
      }
    }
  }


  // 下拉框的滚动条要显示出来，否则数据太多滑的太麻烦
  .rc-virtual-list-holder {
    padding-right: 2px; // 让滚动条有边距

    &::-webkit-scrollbar {
      width: 8px;
    }
  }

}
</style>


<style lang="less" scoped>
// 必须要加上 :getPopupContainer="(triggerNode: any) => triggerNode.parentNode"，否则会在body下，无法生效
:deep(.select-colormap-dropdown) {

  .ant-select-item-option-content {
    white-space: normal;
    line-height: 1;
  }
}

@margin: 12px; // margin

// 页面根class
.main-page {
  padding: @margin;
  background: var(--color-page-bg);

  .bg-gray-line {
    background: var(--color-bg);
    width: 100%;
    height: 6px;
  }

  .page-bottom {
    display: flex;
    height: calc(100vh - 58px - 12px - @margin - @margin);
    min-height: calc(100vh - 58px - 12px - @margin - @margin);
    position: relative;

    .page-left {
      width: 240px;
      min-width: 240px;
      margin-right: 12px;
      background: var(--color-bg);
      border-radius: 8px;
      overflow: hidden;
      border: var(--border-card);

      .scroll {
        height: calc(100%);
        overflow: auto;
      }
    }

    .page-center {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: relative;

    }

  }

}

.colormap-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.colormap-bar {
  width: 24px;
  min-width: 24px;
  height: 14px;
  margin-right: 8px;
  border-radius: 2px;
}
</style>
