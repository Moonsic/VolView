<template>

  <div class="main-page">

    <div class="page-top-tab" v-if="true">
      <SwitchTab :tab="3" :megId="megId" :subjectId="subjectId" />

      <div class="flex-between">
        <div class="flex-start">
          <SelectPatient :megId="megId" :subjectId="subjectId" @change="changePatientList" />

          <UploadData :megId="megId" :subjectId="subjectId" :widthSmall="widthSmall"
            @uploadFileSuccess="uploadFileSuccess" />

          <!-- 只有预处理后的文件才设置旋转 -->
          <a-space class="mr8 rotate-buttons" v-if="curNiiFileType === 'processedNiiFile'">
            <!-- <a-divider type="vertical" class="m0" /> -->
            <a-button class="light-primary-btn" v-if="!showRotateCom" type="primary" size="small" shape="round"
              @click="setRotateView(true)">
              <RotateRightOutlined />
              <span v-if="!widthSmall">{{ t('设置旋转') }}</span>
            </a-button>
            <a-button v-if="showRotateCom" type="default" size="small" shape="round" @click="setRotateView(false)">
              {{ t('退出旋转') }}
            </a-button>
            <a-button v-if="showRotateCom" class="light-primary-btn" type="primary" size="small" shape="round"
              :loading="loading" :disabled="angleX === 0 && angleY === 0 && angleZ === 0" @click="saveRotateView">
              <IconSave />
              {{ t('保存旋转') }}
            </a-button>

            <a-space v-if="showRotateCom">

              <div class="flex-start">
                <span class="mr4">X:</span>
                <a-input-number v-model:value="angleX" class="input-number" placeholder="X" :step="1"
                  @change="changeAngle('X')" />
                <span class="unit">°</span>
              </div>
              <div class="flex-start">
                <span class="mr4">Y:</span>
                <a-input-number v-model:value="angleY" class="input-number" placeholder="Y" :step="1"
                  @change="changeAngle('Y')" />
                <span class="unit">°</span>
              </div>
              <div class="flex-start">
                <span class="mr4">Z:</span>
                <a-input-number v-model:value="angleZ" class="input-number" placeholder="Z" :step="1"
                  @change="changeAngle('Z')" />
                <span class="unit">°</span>
              </div>

            </a-space>

          </a-space>


          <a-space>
            <!-- <a-divider type="vertical" class="m0" /> -->
            <a-button class="light-primary-btn" v-if="!showCoreg" type="primary" size="small" shape="round"
              @click="onCoregResult()">
              <IconSearch />
              <span v-if="!widthSmall">{{ t('查看配准结果') }}</span>
            </a-button>
            <a-button v-if="showCoreg" type="default" size="small" shape="round" @click="cancelShowCoreg()">
              {{ t('退出配准') }}
            </a-button>
            <!-- <a-button class="light-primary-btn" v-if="showCoreg" type="primary" size="small" shape="round"
              :loading="saveCoregLoading" :disabled="isNoChangePosition" @click="saveCorgeResult()">
              <IconSave />
              保存配准结果
            </a-button> -->
          </a-space>

        </div>

        <a-space>


          <!-- <a-button type="default" size="small" shape="round" :disabled="!curNiiFilePath"
            @click="getCenter()">
            获取中心点
          </a-button> -->

          <!-- <a-button v-if="showWhiteLine" type="default" size="small" shape="round" :disabled="!showRotateCom || !curNiiFilePath"
            @click="setShowWhiteLine(false)">
            隐藏白线
          </a-button>
          <a-button v-if="!showWhiteLine" type="default" size="small" shape="round" :disabled="!showRotateCom || !curNiiFilePath"
            @click="setShowWhiteLine(true)">
            显示白线
          </a-button>

          <a-button v-if="showResliceCursorLine" type="default" size="small" shape="round" :disabled="!curNiiFilePath"
            @click="setShowResliceCursorLine(false)">
            隐藏线
          </a-button>
          <a-button v-if="!showResliceCursorLine" type="default" size="small" shape="round" :disabled="!curNiiFilePath"
            @click="setShowResliceCursorLine(true)">
            显示线
          </a-button> -->

          <div class="flex-start">
            <span v-if="!widthSmall">{{ t('邻域范围') }}：</span>
            <a-input-number class="input-100" v-model:value="nearValue" :min="0.1" :step="0.1" size="small"
              placeholder="" addon-after="mm" @change="changeNearValue" />
          </div>

          <!-- <a-button v-if="showResliceCursor" type="default" size="small" shape="round" :disabled="!curNiiFilePath"
            @click="setShowResliceCursor(false)">
            隐藏十字线&滑动条
          </a-button>
          <a-button v-if="!showResliceCursor" type="default" size="small" shape="round" :disabled="!curNiiFilePath"
            @click="setShowResliceCursor(true)">
            显示十字线&滑动条
          </a-button>
          <a-button type="default" size="small" shape="round" :disabled="!curNiiFilePath" @click="resetView()">
            回到中心点
          </a-button> -->

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
          <NiiFileList ref="niiFileListRef" :megId="megId" :subjectId="subjectId" @getCurData="getCurNiiFile" />
          <div class="bg-gray-line"></div>
          <ProcessedNiiFileList ref="processedNiiFileListRef" :megId="megId" :subjectId="subjectId"
            @getCurData="getCurProcessedNiiFile" />
          <div class="bg-gray-line"></div>
          <DicomFileList ref="dicomFileListRef" :megId="megId" :subjectId="subjectId" />
          <div class="bg-gray-line"></div>
        </div>
      </div>
      <div class="page-center" ref="rightRef">

        <VolView ref="volviewRef" class="widthP100" @getWindowLevel="getWindowLevel" />


        <SelectAngle v-if="showRotateCom" ref="selectAngleX" class="select-angle-x" direction="X"
          @change="changeAngleX" />
        <SelectAngle v-if="showRotateCom" ref="selectAngleY" class="select-angle-y" direction="Y"
          @change="changeAngleY" />
        <SelectAngle v-if="showRotateCom" ref="selectAngleZ" class="select-angle-z" direction="Z"
          @change="changeAngleZ" />


        <div class="change-position-list" v-if="showCoreg">
          <div class="item">
            <span class="title">X :</span>
            <MinusCircleFilled class="icon" @click="changePosition('x', -1)" />
            <span class="value">{{ offsetX }}</span>
            <PlusCircleFilled class="icon" @click="changePosition('x', 1)" />
          </div>
          <div class="item">
            <span class="title">Y :</span>
            <MinusCircleFilled class="icon" @click="changePosition('y', -1)" />
            <span class="value">{{ offsetY }}</span>
            <PlusCircleFilled class="icon" @click="changePosition('y', 1)" />
          </div>
          <div class="item">
            <span class="title">Z :</span>
            <MinusCircleFilled class="icon" @click="changePosition('z', -1)" />
            <span class="value">{{ offsetZ }}</span>
            <PlusCircleFilled class="icon" @click="changePosition('z', 1)" />
          </div>
          <div class="item">
            <span class="title">θx :</span>
            <MinusCircleFilled class="icon" @click="rotatePosition('x', -1)" />
            <span class="value">{{ rotateX }}°</span>
            <PlusCircleFilled class="icon" @click="rotatePosition('x', 1)" />
          </div>
          <div class="item">
            <span class="title">θy :</span>
            <MinusCircleFilled class="icon" @click="rotatePosition('y', -1)" />
            <span class="value">{{ rotateY }}°</span>
            <PlusCircleFilled class="icon" @click="rotatePosition('y', 1)" />
          </div>
          <div class="item">
            <span class="title">θz :</span>
            <MinusCircleFilled class="icon" @click="rotatePosition('z', -1)" />
            <span class="value">{{ rotateZ }}°</span>
            <PlusCircleFilled class="icon" @click="rotatePosition('z', 1)" />
          </div>
          <a-button class="mt8" type="primary" ghost size="small" shape="round" :disabled="isNoChangePosition"
            @click="saveCorgeResult">{{ t('保存配准结果') }}</a-button>
          <a-button class="button-3d" type="link" size="small" @click="openCoreg3DModal">{{ t('查看3D头皮配准结果') }}</a-button>
        </div>


        <div class="line-mark" v-if="showRotateCom && isDragging"></div>

        <div class="line-list" v-if="showRotateCom && showWhiteLine">
          <div class="line line1" ref="line1Ref" :style="{ top: line1Y - rect?.top + 'px' }"></div>
          <div class="line line2" ref="line2Ref" :style="{ left: line2X - rect?.left + 'px' }"></div>
          <div class="line line3" ref="line3Ref" :style="{ top: line3Y - rect?.top + 'px' }"></div>
          <div class="line line4" ref="line4Ref" :style="{ left: line4X - rect?.left + 'px' }"></div>
          <div class="line line5" ref="line5Ref" :style="{ top: line5Y - rect?.top + 'px' }"></div>
          <div class="line line6" ref="line6Ref" :style="{ left: line6X - rect?.left + 'px' }"></div>

          <div class="point point1" ref="point1Ref"
            :style="{ left: point1X - rect?.left + 'px', top: point1Y - rect?.top + 'px' }"></div>
          <div class="point point2" ref="point2Ref"
            :style="{ left: point2X - rect?.left + 'px', top: point2Y - rect?.top + 'px' }"></div>
          <div class="point point3" ref="point3Ref"
            :style="{ left: point3X - rect?.left + 'px', top: point3Y - rect?.top + 'px' }"></div>
        </div>

      </div>

      <VolViewSide v-show="showSide" :disabled="curNiiFilePath" :subjectId="subjectId" :showSliceBox="false"
        :windowNew="windowNew" :levelNew="levelNew" :minNew="minNew" :maxNew="maxNew" @switchFunction="switchFunction"
        @setShowResliceCursor="setShowResliceCursor" @restartView="restartView" @resetView="resetView"
        @changeWindow="changeWindow" @changeLevel="changeLevel">
      </VolViewSide>

    </div>


  </div>


  <!-- 3D页面弹窗 -->
  <Coreg3DModal ref="coreg3DModalRef" :coregId="coregId" />

  <!-- 配准弹窗 -->
  <CoregModal ref="coregModalRef" :megId="megId" :subjectId="subjectId" @success="getTaskStatus" />

</template>

<script lang="ts" setup>
import { useDraggable, useWindowSize } from '@vueuse/core'

import { message } from 'ant-design-vue'
import { debounce } from '@u/utils'
import SwitchTab from '@c/SwitchTab.vue'
import SelectPatient from '@c/SelectPatient.vue'
import VolViewSide from '@c/VolViewSide.vue'

import UploadData from './UploadData.vue'
import NiiFileList from './NiiFileList.vue'
import ProcessedNiiFileList from './ProcessedNiiFileList.vue'
import DicomFileList from './DicomFileList.vue'
import SelectAngle from './SelectAngle.vue'
import VolView from '@c/VolView.vue'

import CoregModal from './modal/CoregModal.vue'
import Coreg3DModal from './modal/Coreg3DModal.vue'

import {
  rotateNiiMgzApi,
  getNiiFileStreamApi, // 3. 获取结构像的2D图像
  getCoregHeadShapePointsApi, // 27 获取显示在结构像3d图上的头皮点
  saveManualCoregResultApi,   // 10. 获取配准结果3d展示数据
} from '@/api/sl'
import {
  getTaskStatusApi,  // 5. 获取患者任务状态
  getMegTypeApi, // 14. 获取患者megType，megin还是opm64
} from '@/api/subject'


// import { get } from '@/api/axios/request'
// onMounted(() => {
//   setTimeout(() => {
//     getTestList()
//   },3000)
// })
// function getTestList() {
//   get('/static/src_pos_lps.mrk.json').then(res => {
//     const allData = res.markups[0].controlPoints || []
//     console.log('allData :>> ', allData);
//     const list:any[] = []
//     allData.forEach((item: any) => {
//       list.push(item.position ? item.position : [])
//     })
//     const obj = {
//     '#f00': list || []
//     }
//     volviewRef.value.setPointsColorArrow(obj, 1)
//   })
// }


const { t } = useI18n()

const { width: windowWidth } = useWindowSize()
// const widthBig = computed(() => windowWidth.value > 1900)
const widthSmall = computed(() => windowWidth.value <= 1670)

// 修改患者
function changePatientList(record: any) {
  subjectId.value = record.subjectId
  megId.value = record.megId
  document.title = `${t('结构像复核')} | ${megId.value}`
  megType.value = ''
  nextTick(() => {
    niiFileListRef.value.getData()
    processedNiiFileListRef.value.getData()
    dicomFileListRef.value.onReload()
    niiFileListRef.value.cancelSelect()
    processedNiiFileListRef.value.cancelSelect()

    // 把结构像的数据都清空掉
    volviewRef.value.clear()
    // 清空当前结构像相关
    curNiiFile.value = {} // 当前选中Nii文件的路径
    curNiiFilePath.value = '' // 当前选中Nii文件的路径
    curNiiFileType.value = '' // 当前选中Nii文件的路径的类型
    // 清空旋转相关
    showRotateCom.value = false
    showWhiteLine.value = false
    showResliceCursor.value = true
    showResliceCursorLine.value = true
    angleX.value = 0
    angleY.value = 0
    angleZ.value = 0
    // 清空配准相关
    showCoreg.value = false
    allPoints = []

  })
}


const route = useRoute()
const router = useRouter()
const megId = ref<string>(String(route.query.megId || ''))
const subjectId = ref<string>(String(route.query.subjectId || ''))
document.title = `${t('结构像复核')} | ${megId.value}`

// 从开始溯源跳转过来，立即开始配准
const showCoregResult = ref<boolean>(Boolean(route.query.showCoregResult))

onMounted(() => {

  const local_nearValue = localStorage.getItem('nearValue')
  nearValue.value = local_nearValue ? Number(local_nearValue) : 2.6


  if (showCoregResult.value) {
    onCoregResult()

    // 把route的showCoregResult清除
    router.push({
      path: 'reviewMri',
      query: {
        subjectId: subjectId.value,
        megId: megId.value,
      }
    })

  }
})

const niiFileListRef = ref(null)
const processedNiiFileListRef = ref(null)
const dicomFileListRef = ref(null)
const volviewRef = ref(null)

const selectAngleX = ref(null)
const selectAngleY = ref(null)
const selectAngleZ = ref(null)


const curNiiFile = ref<any>({}) // 当前选中Nii文件的路径
const curNiiFilePath = ref<string>('') // 当前选中Nii文件的路径
const curNiiFileType = ref<string>('') // 当前选中Nii文件的路径的类型

interface INiiFile {
  filePath: string
  is_fsprep: boolean
  lastModified: string
  name: string
  size: number
  type: number
  fileUrl?: string
  fsprepNiiFilePath?: string
  fsprepNiiFileName?: string
}

// 点击了某选中Nii文件，获取nii数据，展示三维切片
async function getCurNiiFile(item: INiiFile) {
  volviewRef.value.clearPoints()
  curNiiFile.value = item
  curNiiFileType.value = 'niiFile'
  curNiiFilePath.value = item.filePath
  volviewRef.value.setUrl(item.name, item.fileUrl) // test.nii，因为本来就是nii文件，所以直接用item.name
  processedNiiFileListRef.value.cancelSelect()

  // 清空旋转相关
  showRotateCom.value = false
  angleX.value = 0
  angleY.value = 0
  angleZ.value = 0
  // 清空配准相关
  showCoreg.value = false
  allPoints = []


  // 旧的写法1，获取到url，再获取blob，没必要，现在直接把url给volview。
  // const params = {
  //   filePath: curNiiFilePath.value,
  //   mgz: 0  // 0:nii, 1:mgz
  // }
  // // 现在的写法，先获取文件地址，前端再获取文件流，data为文件地址url，然后再把url转成blob
  // const { code, data }  = await getNiiFileStreamApi(params)
  // if (code === 200) {
  //   const blob = await getUrlBlob(data)
  //   console.log('blob', blob)
  //   volviewRef.value.setBlob(item.name, blob) // test.nii，因为本来就是nii文件，所以直接用item.name
  // }


  // 旧的写法2，之前直接从接口获取文件流。
  // const res: any = await getNiiFileStreamApi(params)
  // const blob = new Blob([res], { type: '' })
}

// 预处理后的文件
function getCurProcessedNiiFile(item: INiiFile) {
  curNiiFile.value = item
  curNiiFileType.value = 'processedNiiFile'
  curNiiFilePath.value = item.fsprepNiiFilePath
  // console.log('第1次setUrl :>> ')
  volviewRef.value.setUrl(item.fsprepNiiFileName, item.fileUrl) // test.nii，因为本来就是nii文件，所以直接用item.name
  niiFileListRef.value.cancelSelect()
  // nextTick必须加，不然setRotateView里有关volviewRef的会报错
  // 这里加setTimeout是因为在测试8080的volview时，不加的话，volviewRef.value?.rotate(angle, 0)会报错，正式的时候其实可以去掉
  // setTimeout(() => {
  setRotateView(false)
  // }, 1000)
}

// 上传数据成功，刷选患者数据列表
function uploadFileSuccess() {
  niiFileListRef.value.getData()
  processedNiiFileListRef.value.getData()
  dicomFileListRef.value.onReload()
}


const showRotateCom = ref(false) // 显示旋转组件

// 是否显示旋转组件
function setRotateView(bool: boolean) {
  showRotateCom.value = bool
  setShowWhiteLine(bool) // 显示白线
  setShowResliceCursorLine(!bool) // 不显示十字线的线
  changeAngleY(0)
  changeAngleX(0)
  changeAngleZ(0)
  // 如果展示旋转组件，就把查看配准结果取消掉
  if (bool) {
    cancelShowCoreg()
  }
}

const loading = ref(false) // 保存旋转按钮loading

// 保存角度
async function saveRotateView() {

  if (angleX.value === 0 && angleY.value === 0 && angleZ.value === 0) {
    return
  }
  const params = {
    fsprepNiiFilePath: curNiiFilePath.value,
    x: angleX.value,
    y: angleY.value,
    z: angleZ.value,
  }
  loading.value = true
  const { code, msg } = await rotateNiiMgzApi(params)
  loading.value = false
  if (code === 200) {
    message.success(msg)
    // volviewRef.value.clear()
    // processedNiiFileListRef.value.clickItem(curNiiFile.value) // 重新获取新的fileUrl
    getNewUrl()
  }
}

// 点击
async function getNewUrl() {
  // 现在url不能保存下来，因为会保存旋转，url就是旧的url了，
  // 没有blob，调接口获取nii的blob
  const params = {
    filePath: curNiiFile.value.niiFilePath,
    mgz: 1  // 0:nii, 1:mgz
  }
  // 现在的写法，先获取文件地址，前端再获取文件流，data为文件地址url，然后再把url转成blob
  const { code, data } = await getNiiFileStreamApi(params)
  if (code === 200) {
    curNiiFile.value.fileUrl = data
    volviewRef.value.setUrl(curNiiFile.value.fsprepNiiFileName, data) // test.nii，因为本来就是nii文件，所以直接用item.name
    showRotateCom.value = false
    changeAngleY(0)
    changeAngleX(0)
    changeAngleZ(0)
  }

}


const angleX = ref<number>(0); // 记录当前旋转角度
const angleY = ref<number>(0); // 记录当前旋转角度
const angleZ = ref<number>(0); // 记录当前旋转角度


function changeAngleX(angle: number) {
  angleX.value = angle
  volviewRef.value?.rotate(angle, 1) // 1表示绕x轴旋转
}

function changeAngleY(angle: number) {
  angleY.value = angle
  volviewRef.value?.rotate(angle, 0) // 0表示绕y轴旋转
}

function changeAngleZ(angle: number) {
  angleZ.value = angle
  volviewRef.value?.rotate(angle, 2) // 2表示绕z轴旋转
}

// 加载结构像
function restartView() {
  // volviewRef.value.setUrl(curNiiFileName.value, curNiiFileUrl.value)
  // slNiiFileListRef.value.cancelSelect()
}

function resetView() {
  volviewRef.value.resetView()
}


// 修改角度
function changeAngle(type: string) {
  if (type === 'X') {
    changeAngleX(angleX.value)
    selectAngleX.value.setData(angleX.value)
  } else if (type === 'Y') {
    changeAngleY(angleY.value)
    selectAngleY.value.setData(angleY.value)
  } else if (type === 'Z') {
    changeAngleZ(angleZ.value)
    selectAngleZ.value.setData(angleZ.value)
  }
}

const coregId = ref<string>('')
const showCoreg = ref(false) // 是否显示3D页面


// 点击查看溯源结果按钮
async function onCoregResult() {

  if (curNiiFilePath.value) {
    // setTimeout(() => {
    setRotateView(false) // 关闭旋转组件
    // }, 1000)
  }

  // 先获取状态看有没有配准id
  getTaskStatus(() => {
    // 有配准
    if (coregId.value) {

      // 如果当前已经有加载的预处理结构像，就直接获取头皮点
      if (curNiiFileType.value === 'processedNiiFile' && curNiiFilePath.value) {
        getCoregHeadShapePoints()
        setTimeout(() => {
          showCoreg.value = true
        }, 300)
      } else {
        const haveData = processedNiiFileListRef.value.clickFirstItem()
        if (haveData) {
          getCoregHeadShapePoints()
          setTimeout(() => {
            showCoreg.value = true
          }, 300)
        }
      }
    } else {
      onCoreg()
    }
  })

}

// 获取状态
async function getTaskStatus(cb?: () => void) {
  const params = {
    subjectId: subjectId.value,
    megId: megId.value,
  }
  const { code, data } = await getTaskStatusApi(params)
  if (code === 200) {
    coregId.value = data['coregId']
    cb && cb()
  }
}


const coregModalRef = ref(null)
// 点击配准按钮
function onCoreg() {
  coregModalRef.value.showModal()
}


// 取消
function cancelShowCoreg() {
  showCoreg.value = false
  volviewRef.value?.clearPoints()
  allPoints = []
  coreg3DModalRef.value?.closeModal()
}

let allPoints: any[] = [] // 记录所有的点
let allPointsObj: any = {} // 记录所有的点
let head_fiducials_pts_before: any = {}
// let head_fiducials_pts: any = {}
// let head_fiducials_pts_obj: any = {}
// 获取显示在结构像3d图上的头皮点
async function getCoregHeadShapePoints() {
  // console.log('进入getCoregHeadShapePoints :>> ');
  resetPosition()

  const params = {
    coregId: coregId.value,
  }
  const { code, data } = await getCoregHeadShapePointsApi(params)
  if (code === 200) {

    allPoints = data.head_points || []
    head_fiducials_pts_before = JSON.parse(JSON.stringify(data.head_fiducials_pts)) // 3个点
    // head_fiducials_pts = data.head_fiducials_pts // 3个点
    // // head_fiducials_pts = { "LPA": { "color": [ 255, 0, 0 ], "point": [ -77.86, -3.49, 12.53 ] }, "NAS": { "color": [ 0, 255, 0 ], "point": [ -2.32, 0.57, -77.41 ] }, "RPA": { "color": [ 0, 0, 255 ], "point": [ 75.79, -12.22, 12.68 ] } }

    // // 3个基准点
    // head_fiducials_pts_obj = {
    //   '#f00': [data.head_fiducials_pts.LPA],
    //   '#0f0': [data.head_fiducials_pts.NAS],
    //   '#00f': [data.head_fiducials_pts.RPA],
    // }
    // console.log('obj :>> ', head_fiducials_pts_obj);

    allPointsObj = {
      '#ec2ccc': allPoints || [],
      '#f00': [data.head_fiducials_pts.LPA],
      '#0f0': [data.head_fiducials_pts.NAS],
      '#00f': [data.head_fiducials_pts.RPA],
    }
    // console.log('allPointsObj :>> ', allPointsObj);
    setPoints()
  }
}

const megType = ref<string>('')

// 'megin'或'opm64'
async function getMegType() {
  const { code, data } = await getMegTypeApi({ megId: megId.value })
  if (code === 200) {
    megType.value = data || 'megin'
  }
}

// 在volviewRef上画点了
async function setPoints() {
  // console.log('548 setPoints :>> ',  new Date().getTime(),volviewRef.value.volviewLoaded);
  volviewRef.value.setNearValue(nearValue.value)

  // 没有MEG类型就先获取MEG类型
  if (!megType.value) {
    await getMegType()
  }
  // 画点半径
  const radius = megType.value === 'megin' ? 2.6 : 1
  volviewRef.value.setPointsColorArrow(allPointsObj, radius)
}


const offsetX = ref<number>(0)
const offsetY = ref<number>(0)
const offsetZ = ref<number>(0)
const rotateX = ref<number>(0)
const rotateY = ref<number>(0)
const rotateZ = ref<number>(0)

// 是否没有做任何修改
const isNoChangePosition = computed(() => {
  return offsetX.value === 0 && offsetY.value === 0 && offsetZ.value === 0 && rotateX.value === 0 && rotateY.value === 0 && rotateZ.value === 0
})

// 修改所有点的位置
// mri_fiducials_pts是立方体 是不动的
function changePosition(direction: 'x' | 'y' | 'z', num: number) {

  if (direction === 'x') {
    offsetX.value += num
    Object.entries(allPointsObj).forEach((item: any) => {
      const [key, value] = item
      allPointsObj[key] = value.map((point: any[]) => {
        return [point[0] + num, point[1], point[2]]
      })
    })

  }
  if (direction === 'y') {
    offsetY.value += num
    Object.entries(allPointsObj).forEach((item: any) => {
      const [key, value] = item
      allPointsObj[key] = value.map((point: any[]) => {
        return [point[0], point[1] + num, point[2]]
      })
    })
  }
  if (direction === 'z') {
    offsetZ.value += num
    Object.entries(allPointsObj).forEach((item: any) => {
      const [key, value] = item
      allPointsObj[key] = value.map((point: any[]) => {
        return [point[0], point[1], point[2] + num]
      })
    })
  }
  debouncedSetPoints()

  if (coreg3DModalRef.value.visible) {
    coreg3DModalRef.value.changePosition(direction, num)
  }
}

// 使用防抖包装，500毫秒内连续触发只执行最后一次
const debouncedSetPoints = debounce(() => {
  setPoints()
}, 500)


// 旋转所有点的位置
function rotatePosition(direction: 'x' | 'y' | 'z', num: number) {
  if (direction === 'x') {
    rotateX.value += num
    Object.entries(allPointsObj).forEach((item: any) => {
      const [key, value] = item
      allPointsObj[key] = value.map((point: any[]) => {
        return onRotateX(point, num)
      })
    })
  }
  if (direction === 'y') {
    rotateY.value += num
    Object.entries(allPointsObj).forEach((item: any) => {
      const [key, value] = item
      allPointsObj[key] = value.map((point: any[]) => {
        return onRotateY(point, num)
      })
    })
  }
  if (direction === 'z') {
    rotateZ.value += num
    Object.entries(allPointsObj).forEach((item: any) => {
      const [key, value] = item
      allPointsObj[key] = value.map((point: any[]) => {
        return onRotateZ(point, num)
      })
    })
  }
  debouncedSetPoints()

  if (coreg3DModalRef.value.visible) {
    coreg3DModalRef.value.rotatePosition(direction, num)
  }

}


// 绕X轴旋转
function onRotateX([x, y, z]: number[], degree: number) {
  const radians = degree * Math.PI / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return [
    x,
    y * cos - z * sin,
    y * sin + z * cos
  ];
}

// 绕Y轴旋转
function onRotateY([x, y, z]: number[], degree: number) {
  const radians = degree * Math.PI / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return [
    x * cos + z * sin,
    y,
    -x * sin + z * cos
  ];
}

// 绕Z轴旋转
function onRotateZ([x, y, z]: number[], degree: number) {
  const radians = degree * Math.PI / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return [
    x * cos - y * sin,
    x * sin + y * cos,
    z
  ];
}

const saveCoregLoading = ref(false) // 保存配准结果按钮loading

// 保存配准结果
async function saveCorgeResult() {
  const params = {
    coregId: coregId.value,
    offsetX: offsetX.value,
    offsetY: offsetY.value,
    offsetZ: offsetZ.value,
    rotateX: rotateX.value,
    rotateY: rotateY.value,
    rotateZ: rotateZ.value,
    headFiducialsPts: {
      LPA: allPointsObj['#f00'][0],
      NAS: allPointsObj['#0f0'][0],
      RPA: allPointsObj['#00f'][0],
    },                                               // 之后的坐标
    headFiducialsPtsOrigin: {
      LPA: head_fiducials_pts_before?.LPA,
      NAS: head_fiducials_pts_before?.NAS,
      RPA: head_fiducials_pts_before?.RPA,
    },                                               // 之前的坐标
  }
  // console.log('params :>> ', params);
  saveCoregLoading.value = true
  const { code, msg } = await saveManualCoregResultApi(params)
  saveCoregLoading.value = false
  if (code === 200) {
    message.success(msg)
    // volviewRef.value?.clearPoints()
    getCoregHeadShapePoints()
    // processedNiiFileListRef.value.clickItem(curNiiFile.value) // 重新获取新的fileUrl
    // getNewUrl()
  }
}

// 获取新数据前要清空
function resetPosition() {
  offsetX.value = 0
  offsetY.value = 0
  offsetZ.value = 0
  rotateX.value = 0
  rotateY.value = 0
  rotateZ.value = 0
}

const nearValue = ref(2.6)
function changeNearValue(e: number) {
  // console.log('e,nearValue.value :>> ', e,nearValue.value);
  localStorage.setItem('nearValue', String(nearValue.value))
  volviewRef.value.setNearValue(nearValue.value)
}




// A 项目中的脚本
window.addEventListener('message', (event) => {
  // 这里接收到来自 B 项目的3D的截图
  if (event.data.type === 'rotateAngles') {
    const rotateAngles = event.data.value
    angleX.value = -rotateAngles.x
    angleY.value = -rotateAngles.y
    angleZ.value = -rotateAngles.z
  }
});


// 展示十字线
const showResliceCursor = ref(true)

function setShowResliceCursor(value: boolean) {
  showResliceCursor.value = value
  volviewRef.value.setShowResliceCursor(value)
}

// 展示线
const showResliceCursorLine = ref(true)

function setShowResliceCursorLine(value: boolean) {
  showResliceCursorLine.value = value
  volviewRef.value.setShowResliceCursorLine(value)
}

// 展示白线
const showWhiteLine = ref(false)

function setShowWhiteLine(value: boolean) {
  showWhiteLine.value = value
}

// 获取中心点
function getCenter() {
  volviewRef.value.getCenter()
}

const rightRef = ref(null)
const rect = ref(null)
const isDragging = ref(false)

onMounted(() => {
  rect.value = rightRef.value.getBoundingClientRect();
  // 根据页面大小自动响应图表大小
  window.onresize = () => resize()
})

onUnmounted(() => {
  window.onresize = null
})

// 根据页面大小自动响应
function resize() {
  rect.value = rightRef.value.getBoundingClientRect();
}

const minMargin = 5

const line1Ref = ref(null)
const { y: line1Y } = useDraggable(line1Ref, {
  initialValue: { x: 0, y: rect.value?.top },
  onStart: () => {
    isDragging.value = true
  },
  onEnd: () => {
    isDragging.value = false
  },
  onMove: ({ y }) => {
    if (y < rect.value?.top + minMargin) {
      line1Y.value = rect.value?.top + minMargin
    }
    if (y > rect.value?.top + rect.value?.height / 2 - minMargin * 2) {
      line1Y.value = rect.value?.top + rect.value?.height / 2 - minMargin * 2
    }
    point1Y.value = line1Y.value
  }
})

const line2Ref = ref(null)
const { x: line2X } = useDraggable(line2Ref, {
  initialValue: { x: rect.value?.left, y: 0 },
  onStart: () => {
    isDragging.value = true
  },
  onEnd: () => {
    isDragging.value = false
  },
  onMove: ({ x }) => {
    if (x < rect.value?.left + minMargin) {
      line2X.value = rect.value?.left + minMargin
    }
    if (x > rect.value?.left + rect.value?.width / 2 - minMargin * 2) {
      line2X.value = rect.value?.left + rect.value?.width / 2 - minMargin * 2
    }
    point1X.value = line2X.value
  }
})

const line3Ref = ref(null)
const { y: line3Y } = useDraggable(line3Ref, {
  initialValue: { x: rect.value?.width, y: rect.value?.top },
  onStart: () => {
    isDragging.value = true
  },
  onEnd: () => {
    isDragging.value = false
  },
  onMove: ({ y }) => {
    if (y < rect.value?.top + minMargin) {
      line3Y.value = rect.value?.top + minMargin
    }
    if (y > rect.value?.top + rect.value?.height / 2 - minMargin * 2) {
      line3Y.value = rect.value?.top + rect.value?.height / 2 - minMargin * 2
    }
    point2Y.value = line3Y.value
  }
})

const line4Ref = ref(null)
const { x: line4X } = useDraggable(line4Ref, {
  initialValue: { x: rect.value?.left + rect.value?.width / 2, y: 0 },
  onStart: () => {
    isDragging.value = true
  },
  onEnd: () => {
    isDragging.value = false
  },
  onMove: ({ x }) => {
    if (x < rect.value?.left + rect.value?.width / 2 + minMargin) {
      line4X.value = rect.value?.left + rect.value?.width / 2 + minMargin
    }
    if (x > rect.value?.left + rect.value?.width - minMargin * 2) {
      line4X.value = rect.value?.left + rect.value?.width - minMargin * 2
    }
    point2X.value = line4X.value
  }
})


const line5Ref = ref(null)
const { y: line5Y } = useDraggable(line5Ref, {
  initialValue: { x: 0, y: rect.value?.top + rect.value?.height },
  onStart: () => {
    isDragging.value = true
  },
  onEnd: () => {
    isDragging.value = false
  },
  onMove: ({ y }) => {
    if (y < rect.value?.top + rect.value?.height / 2 + minMargin) {
      line5Y.value = rect.value?.top + rect.value?.height / 2 + minMargin
    }
    if (y > rect.value?.top + rect.value?.height - minMargin * 2) {
      line5Y.value = rect.value?.top + rect.value?.height - minMargin * 2
    }
    point3Y.value = line5Y.value
  }
})

const line6Ref = ref(null)
const { x: line6X } = useDraggable(line6Ref, {
  initialValue: { x: rect.value?.left, y: rect.value?.top + rect.value?.height },
  onStart: () => {
    isDragging.value = true
  },
  onEnd: () => {
    isDragging.value = false
  },
  onMove: ({ x }) => {
    if (x < rect.value?.left + minMargin) {
      line6X.value = rect.value?.left + minMargin
    }
    if (x > rect.value?.left + rect.value?.width / 2 - minMargin * 2) {
      line6X.value = rect.value?.left + rect.value?.width / 2 - minMargin * 2
    }
    point3X.value = line6X.value
  }
})


const point1Ref = ref(null)
const { x: point1X, y: point1Y } = useDraggable(point1Ref, {
  initialValue: { x: rect.value?.left, y: rect.value?.top },
  onStart: () => {
    isDragging.value = true
  },
  onEnd: () => {
    isDragging.value = false
  },
  onMove: ({ x, y }) => {
    if (x < rect.value?.left + minMargin) {
      point1X.value = rect.value?.left + minMargin
    }
    if (x > rect.value?.left + rect.value?.width / 2 - minMargin * 2) {
      point1X.value = rect.value?.left + rect.value?.width / 2 - minMargin * 2
    }
    if (y < rect.value?.top + minMargin) {
      point1Y.value = rect.value?.top + minMargin
    }
    if (y > rect.value?.top + rect.value?.height / 2 - minMargin * 2) {
      point1Y.value = rect.value?.top + rect.value?.height / 2 - minMargin * 2
    }
    point1X.value = point1X.value + 5
    point1Y.value = point1Y.value + 5
    line1Y.value = point1Y.value
    line2X.value = point1X.value
  }
})


const point2Ref = ref(null)
const { x: point2X, y: point2Y } = useDraggable(point2Ref, {
  initialValue: { x: rect.value?.left + rect.value?.width / 2, y: rect.value?.top + rect.value?.height / 2 },
  onStart: () => {
    isDragging.value = true
  },
  onEnd: () => {
    isDragging.value = false
  },
  onMove: ({ x, y }) => {
    if (x < rect.value?.left + rect.value?.width / 2 + minMargin) {
      point2X.value = rect.value?.left + rect.value?.width / 2 + minMargin
    }
    if (x > rect.value?.left + rect.value?.width - minMargin * 2) {
      point2X.value = rect.value?.left + rect.value?.width - minMargin * 2
    }
    if (y < rect.value?.top + minMargin) {
      point2Y.value = rect.value?.top + minMargin
    }
    if (y > rect.value?.top + rect.value?.height / 2 - minMargin * 2) {
      point2Y.value = rect.value?.top + rect.value?.height / 2 - minMargin * 2
    }
    point2X.value = point2X.value + 5
    point2Y.value = point2Y.value + 5
    line3Y.value = point2Y.value
    line4X.value = point2X.value
  }
})


const point3Ref = ref(null)
const { x: point3X, y: point3Y } = useDraggable(point3Ref, {
  initialValue: { x: rect.value?.left, y: rect.value?.top },
  onStart: () => {
    isDragging.value = true
  },
  onEnd: () => {
    isDragging.value = false
  },
  onMove: ({ x, y }) => {
    if (x < rect.value?.left + minMargin) {
      point3X.value = rect.value?.left + minMargin
    }
    if (x > rect.value?.left + rect.value?.width / 2 - minMargin * 2) {
      point3X.value = rect.value?.left + rect.value?.width / 2 - minMargin * 2
    }

    if (y < rect.value?.top + rect.value?.height / 2 + minMargin) {
      point3Y.value = rect.value?.top + rect.value?.height / 2 + minMargin
    }
    if (y > rect.value?.top + rect.value?.height - minMargin * 2) {
      point3Y.value = rect.value?.top + rect.value?.height - minMargin * 2
    }
    point3X.value = point3X.value + 5
    point3Y.value = point3Y.value + 5
    line5Y.value = point3Y.value
    line6X.value = point3X.value
  }
})


// 右侧功能栏
const showSide = ref(true)
function clickShowSide() {
  showSide.value = !showSide.value
}

const curFunction = ref('Close')

function switchFunction(value: string) {
  curFunction.value = value
  volviewRef.value.dragFunction(value)
}


const windowNew = ref(0)
const levelNew = ref(0)
const maxNew = ref(0)
const minNew = ref(0)

function getWindowLevel(windowLevel: any) {
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


// 结构像弹窗
const coreg3DModalRef = ref(null)

// 点击溯源定位按钮，打开结构像弹窗
async function openCoreg3DModal() {
  if (!coregId.value) {
    return message.info(t('请先进行配准'))
  }
  // 打开3D页面
  coreg3DModalRef.value.showModal({
    offsetX: offsetX.value,
    offsetY: offsetY.value,
    offsetZ: offsetZ.value,
    rotateX: rotateX.value,
    rotateY: rotateY.value,
    rotateZ: rotateZ.value,
  })
}


</script>

<style lang="less" scoped>
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


  .rotate-buttons {

    .unit {
      transform: translateY(-8px);
      margin-left: 2px;
    }

    .input-number {
      width: 70px;
    }

  }

  .input-100 {
    width: 100px;
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
      height: 100%;
      position: relative;

      .select-angle-y {
        position: absolute;
        top: 5px;
        left: 5px;
        z-index: 99;
      }

      .select-angle-x {
        position: absolute;
        top: 5px;
        left: calc(50% + 5px);
        z-index: 99;
      }

      .select-angle-z {
        position: absolute;
        top: calc(50% + 5px);
        left: 5px;
        z-index: 99;
      }



      .change-position-list {
        position: absolute;
        top: calc(50% + 10px);
        left: calc(50% + 10px);
        z-index: 99;
        color: rgba(255, 255, 255, 0.89);

        .item {
          margin-bottom: 4px;
          display: flex;

          .title {
            width: 25px;
            margin-right: 8px;
            text-align: right;
          }

          .value {
            width: 30px;
            margin: 0 4px;
            text-align: center;
          }

          .icon {
            color: rgba(255, 255, 255, 0.2);

            &:hover {
              color: rgba(255, 255, 255, 0.38);
            }
          }
        }
      }
    }
  }

}

.line-mark {
  width: 100%;
  height: 100%;
  position: absolute;
}

@border-style: 2px solid rgba(200, 200, 200, 0.6);



.line {
  position: absolute;
  // background: rgba(255, 255, 255, 0.2);

  // .point {
  //   position: absolute;
  //   width: 10px;
  //   height: 10px;
  //   background: rgba(255, 255, 255, 1);
  //   border-radius: 20px;
  // }
}

.line1,
.line3,
.line5 {
  width: 50%;
  height: 1px;
  border-top: @border-style;
  cursor: s-resize;

  // .point {
  //   right: 40px;
  //   transform: translateY(-50%);

  //   &:hover {
  //     transform: translateY(-50%) scale(1.2);
  //   }
  // }
}

.line2,
.line4,
.line6 {
  height: 50%;
  width: 1px;
  border-left: @border-style;
  cursor: w-resize;

  // .point {
  //   top: 30px;
  //   transform: translateX(-50%);

  //   &:hover {
  //     transform: translateX(-50%) scale(1.2);
  //   }
  // }
}

.line1 {
  top: 25%;
  left: 0;
}

.line2 {
  left: 25%;
  top: 0;
}

.line3 {
  top: 25%;
  left: 50%;
}

.line4 {
  left: 75%;
  top: 0;
}

.line5 {
  top: 75%;
  left: 0;
}

.line6 {
  left: 25%;
  top: 50%;
}


.point {
  position: absolute;
  cursor: pointer;
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 20px;
  transform: translate(-38%, -40%);

  &.point1 {
    top: 25%;
    left: 25%;
  }

  &.point2 {
    top: 25%;
    left: 75%;
  }

  &.point3 {
    top: 75%;
    left: 25%;
  }
}

.button-3d.ant-btn {
  display: block;
  font-size: 12px;
  padding-inline-start: 0;
  padding-inline-end: 0;
}
</style>
