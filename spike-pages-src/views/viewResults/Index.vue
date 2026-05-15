<template>
  <div class="main-page">
    <div class="page-top-tab">

      <SwitchTab :tab="5" :megId="megId" :subjectId="subjectId" />

      <div class="flex-between">

        <div class="flex-start">
          <SelectPatient :megId="megId" :subjectId="subjectId" @change="changePatientList" />

          <a-space>

            <!-- <a-input-number class="input-100" v-model:value="valueX" size="small" placeholder=""  />
          <a-input-number class="input-100" v-model:value="valueY" size="small" placeholder=""  />
          <a-input-number class="input-100" v-model:value="valueZ" size="small" placeholder=""  />
          <a-button type="primary" size="small" @click="add">
            确定位置
          </a-button> -->

            <a-button class="light-primary-btn" type="primary" size="small" shape="round" :disabled="!curCoregId"
              @click="goReviewMegPage">
              <span class="anticon">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 15" fill="none">
                  <path
                    d="M12.8334 7.639V11.139C12.8334 12.4277 11.7887 13.4723 10.5001 13.4723H3.50008C2.21142 13.4723 1.16675 12.4277 1.16675 11.139V4.139C1.16675 2.85033 2.21142 1.80566 3.50008 1.80566H7.00008M9.15046 2.9856C9.15046 2.9856 9.15046 3.81994 9.9848 4.65428C10.8191 5.48862 11.6535 5.48862 11.6535 5.48862M5.34031 9.96624L7.09242 9.71594C7.34516 9.67984 7.57937 9.56273 7.75989 9.38221L12.4878 4.65428C12.9486 4.19349 12.9486 3.44639 12.4878 2.9856L11.6535 2.15126C11.1927 1.69047 10.4456 1.69047 9.9848 2.15126L5.25687 6.87919C5.07635 7.05971 4.95924 7.29392 4.92314 7.54666L4.67284 9.29877C4.61721 9.68813 4.95095 10.0219 5.34031 9.96624Z"
                    stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
                </svg>
              </span>
              {{ t('发起手动标注棘波') }}
            </a-button>

            <a-button class="light-primary-btn" type="primary" size="small" shape="round" :disabled="!curCoregId"
              @click="exportResult">
              <span class="anticon">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 14" fill="none">
                  <path d="M12.2499 5.25L12.2499 1.75M12.2499 1.75L8.74992 1.75M12.2499 1.75L5.83325 8.16666"
                    stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                  <path
                    d="M7 2.91699H4.08C2.79318 2.91699 1.75 3.96017 1.75 5.24699V9.92033C1.75 11.2071 2.79318 12.2503 4.08 12.2503H8.75333C10.0402 12.2503 11.0833 11.2071 11.0833 9.92033V7.00033"
                    stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              {{ t('导出溯源定位结果') }}
            </a-button>

            <a-button class="light-primary-btn" type="primary" size="small" shape="round" :disabled="!curCoregId"
              @click="goToReportPage('general')">
              <IconFile />
              {{ t('创建临床报告') }}
            </a-button>

            <a-space>
              <a-button class="light-primary-btn" v-if="!showScreenshot" type="primary" size="small" shape="round"
                @click="onScreenshot()">
                <!-- <IconSearch /> -->
                <span class="anticon">

                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6.37596 5.58397C6.1462 5.92862 6.23933 6.39427 6.58397 6.62404C6.92862 6.8538 7.39427 6.76067 7.62404 6.41603L6.37596 5.58397ZM8.40627 3.8906L9.0303 4.30662L8.40627 3.8906ZM15.5937 3.8906L16.2178 3.47457L15.5937 3.8906ZM16.376 6.41603C16.6057 6.76067 17.0714 6.8538 17.416 6.62404C17.7607 6.39427 17.8538 5.92862 17.624 5.58397L16.376 6.41603ZM14.25 13.5C14.25 14.7426 13.2426 15.75 12 15.75V17.25C14.0711 17.25 15.75 15.5711 15.75 13.5H14.25ZM12 15.75C10.7574 15.75 9.75 14.7426 9.75 13.5H8.25C8.25 15.5711 9.92893 17.25 12 17.25V15.75ZM9.75 13.5C9.75 12.2574 10.7574 11.25 12 11.25V9.75C9.92893 9.75 8.25 11.4289 8.25 13.5H9.75ZM12 11.25C13.2426 11.25 14.25 12.2574 14.25 13.5H15.75C15.75 11.4289 14.0711 9.75 12 9.75V11.25ZM7.62404 6.41603L9.0303 4.30662L7.78223 3.47457L6.37596 5.58397L7.62404 6.41603ZM10.0704 3.75H13.9296V2.25H10.0704V3.75ZM14.9697 4.30662L16.376 6.41603L17.624 5.58397L16.2178 3.47457L14.9697 4.30662ZM13.9296 3.75C14.3476 3.75 14.7379 3.95888 14.9697 4.30662L16.2178 3.47457C15.7077 2.70953 14.8491 2.25 13.9296 2.25V3.75ZM9.0303 4.30662C9.26214 3.95888 9.65243 3.75 10.0704 3.75V2.25C9.1509 2.25 8.29226 2.70953 7.78223 3.47457L9.0303 4.30662ZM6 6.75H18V5.25H6V6.75ZM21.25 10V17H22.75V10H21.25ZM18 20.25H6V21.75H18V20.25ZM2.75 17V10H1.25V17H2.75ZM6 20.25C4.20507 20.25 2.75 18.7949 2.75 17H1.25C1.25 19.6234 3.37665 21.75 6 21.75V20.25ZM21.25 17C21.25 18.7949 19.7949 20.25 18 20.25V21.75C20.6234 21.75 22.75 19.6234 22.75 17H21.25ZM18 6.75C19.7949 6.75 21.25 8.20507 21.25 10H22.75C22.75 7.37665 20.6234 5.25 18 5.25V6.75ZM6 5.25C3.37665 5.25 1.25 7.37665 1.25 10H2.75C2.75 8.20507 4.20507 6.75 6 6.75V5.25Z"
                      fill="currentColor" />
                  </svg>
                </span>
                <span>{{ t('进入截图模式') }}</span>
              </a-button>
              <a-button v-if="showScreenshot" type="default" size="small" shape="round" @click="cancelShowScreenshot()">
                {{ t('退出截图模式') }}
              </a-button>
            </a-space>

          </a-space>
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
          <CoregResultSelect ref="coregResultSelectRef" :megId="megId" :coregId="coregId" @getCurData="getCurCoreg" />
          <!-- <div class="bg-gray-line"></div> -->

          <SourceResultList ref="sourceResultListRef" :subjectId="subjectId" @getCurData="getCurClickPoint"
            @getCurSelectedList="getCurSelectedListFromFirstList" />
          <div class="bg-gray-line"></div>

          <SourceLocationResultList ref="sourceLocationResultListRef" :subjectId="subjectId"
            @getCurData="getCurClickPoint" @getCurSelectedList="getCurSelectedListFromSecondList" />
          <div class="bg-gray-line"></div>

          <SlNiiFileList ref="slNiiFileListRef" :megId="megId" :subjectId="subjectId"
            @getCurData="getCurCoregWidthUrl" />
          <div class="bg-gray-line"></div>


        </div>
      </div>
      <div class="page-center">
        <VolView ref="volviewRef" @getImageMetadata="getImageMetadata" @getSliceCenter="getSliceCenter"
          @getWindowLevel="getWindowLevel" />


        <div class="screenshot-box list-1" v-if="showScreenshot">
          <div class="flex-end">
            <div class="save-button" @click="saveDipoleOverviewScreenshot('coronal')">{{ t('保存') }}</div>
          </div>
          <div class="screenshot-list" v-if="coronalPlaneList.length">
            <div class="item" v-for="(item, index) in coronalPlaneList" :key="index">
              <div class="img-wrap">
                <img :src="item.img" alt="" @click="previewImg(item.img)">
              </div>
              <div class="info flex-between">
                <div>{{ item.slice }}</div>
                <div class="change-button" @click="clickItemCoronal(index)">{{ t('替换') }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="screenshot-box list-2" v-if="showScreenshot">
          <div class="flex-end">
            <div class="save-button" @click="saveDipoleOverviewScreenshot('sagittal')">{{ t('保存') }}</div>
          </div>
          <div class="screenshot-list" v-if="sagittalPlaneList.length">
            <div class="item" v-for="(item, index) in sagittalPlaneList" :key="index">
              <div class="img-wrap">
                <img :src="item.img" alt="" @click="previewImg(item.img)">
              </div>
              <div class="info flex-between">
                <div>{{ item.slice }}</div>
                <div class="change-button" @click="clickItemSagittal(index)">{{ t('替换') }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="screenshot-box list-3" v-if="showScreenshot">

          <div class="flex-end">
            <div class="save-button" @click="saveDipoleOverviewScreenshot('axial')">{{ t('保存') }}</div>
          </div>
          <div class="screenshot-list" v-if="axialPlaneList.length">
            <div class="item" v-for="(item, index) in axialPlaneList" :key="index">
              <div class="img-wrap">
                <img :src="item.img" alt="" @click="previewImg(item.img)">
              </div>
              <div class="info flex-between">
                <div>{{ item.slice }}</div>
                <div class="change-button" @click="clickItemAxial(index)">{{ t('替换') }}</div>
              </div>
            </div>
          </div>
        </div>





      </div>

      <VolViewSide v-show="showSide" :disabled="curCoregId" :subjectId="subjectId" :imageMetadata="imageMetadata"
        :planeOrigin="planeOrigin" :sliceDomain="sliceDomain" :sliceList="sliceList" :showSliceBox="true"
        :windowNew="windowNew" :levelNew="levelNew" :minNew="minNew" :maxNew="maxNew" @switchFunction="switchFunction"
        @setShowResliceCursor="setShowResliceCursor" @restartView="restartView" @resetView="resetView"
        @changeWindow="changeWindow" @changeLevel="changeLevel">
      </VolViewSide>


    </div>
  </div>

  <!-- 导出溯源定位结果弹窗 -->
  <ExportResultModal ref="exportResultModalRef" :megId="megId" :subjectId="subjectId" :coregId="curCoregId" />

</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { previewImg } from '@u/preview'

import { getFileNameAndSuffix, convertToBase64 } from '@u/utils'

import SwitchTab from '@c/SwitchTab.vue'
import SelectPatient from '@c/SelectPatient.vue'
import VolViewSide from '@c/VolViewSide.vue'

import CoregResultSelect from './CoregResultSelect.vue'
import SlNiiFileList from './SlNiiFileList.vue'

import SourceResultList from './SourceResultList.vue'
import SourceLocationResultList from './SourceLocationResultList.vue'

import VolView from '@c/VolView.vue'

import ExportResultModal from './modal/ExportResultModal.vue'

import {
  getNiiFileStreamApi, // 3. 获取结构像的2D图像
} from '@/api/sl'

import {
  getGeneralReportDataApi, // 2. 获取通用报告数据
  saveDipoleOverviewScreenshotApi, // 15. 保存新的截图
} from '@/api/report'

const { t } = useI18n()

// 修改患者
function changePatientList(record: any) {
  subjectId.value = record.subjectId
  megId.value = record.megId
  document.title = `${t('结果查看')} | ${megId.value}`
  curCoregId.value = ''
  coregId.value = ''
  showScreenshot.value = false

  nextTick(() => {
    volviewRef.value?.clear()
    coregResultSelectRef.value.getData()
    slNiiFileListRef.value.getData()
    slNiiFileListRef.value.cancelSelect()
    sourceResultListRef.value.setData(curCoregId.value)
    sourceLocationResultListRef.value.setData(curCoregId.value)
  })
}

const route = useRoute()
const megId = ref<string>(String(route.query.megId || ''))
const subjectId = ref<string>(String(route.query.subjectId || ''))
const coregId = ref<string>(String(route.query.coregId || ''))
document.title = `${t('结果查看')} | ${megId.value}`

if (!megId.value) {
  message.info(t('请先选择患者'))
}

const coregResultSelectRef = ref(null)
const slNiiFileListRef = ref(null)
const sourceResultListRef = ref(null)
const sourceLocationResultListRef = ref(null)
const volviewRef = ref(null)

const curCoreg = ref<any>({}) // 当前配准结果
const curCoregId = ref<string>('') // 当前配准结果id
const curNiiFilePath = ref<string>('') // 当前结构像路径
const curNiiFileUrl = ref<string>('')  // 当前结构像路径的url地址
const curNiiFileName = ref<string>('') // 当前结构像路径的Name

const router = useRouter()

// 点击了某配准结果，获取nii数据，展示三维切片，获取溯源定位结果列表
async function getCurCoreg(record: any) {
  // console.log('curCoreg :>> ', record);

  curCoreg.value = record
  curCoregId.value = record.id
  curNiiFilePath.value = record.niiFilePath

  // 每次切换，把url改一下，下次刷新页面就不是旧的url了
  router.push({
    path: 'viewResults',
    query: {
      megId: megId.value,
      subjectId: subjectId.value,
      coregId: record.id,
    }
  })

  // 每次切换，2个列表都要更新数据
  sourceResultListRef.value.setData(curCoregId.value)
  sourceLocationResultListRef.value.setData(curCoregId.value)

  // // 想nextTick延时再请求接口，不知道有没有效果，这里nextTick只有4ms
  nextTick(async () => {
    const params = {
      filePath: curNiiFilePath.value,
      mgz: 1  // 0:nii, 1:mgz
    }
    const { code, data } = await getNiiFileStreamApi(params)
    if (code === 200) {
      const [name, suffix] = getFileNameAndSuffix(curNiiFilePath.value) // [name: 'test', suffix:'nii'] = sub-01/anat/test.nii
      curNiiFileName.value = name + '.mgz'
      curNiiFileUrl.value = data
      restartView()
    }
  })

}

// 点击，带溯源定位结构像列表
async function getCurCoregWidthUrl(record: any) {
  volviewRef.value.setUrl(record.fsprepNiiFileName, record.fsprepNiiUrl)
}

// 加载结构像
function restartView() {
  volviewRef.value.setUrl(curNiiFileName.value, curNiiFileUrl.value)
  slNiiFileListRef.value.cancelSelect()
}

function resetView() {
  volviewRef.value.resetView()
}


// 获取下载的文件
// 从D:\github\VolView\src\utils\fetch.ts 103行 学来的
function getFileFromRes(res: any, fileName: string) {
  const blob = new Blob([res], { type: '' })
  return new File([blob], 'new-' + fileName)
}

// 点击了结果列表某点
function getCurClickPoint(position: number[]) {
  volviewRef.value.setPosition(position)
}

// 勾选了第一个列表的点要和第二个列表的点合并一起画出来
function getCurSelectedListFromFirstList(obj: any) {
  const sencondList = sourceLocationResultListRef.value.curSelectedList
  const allObj = mergeObjects(obj, sencondList)
  volviewRef.value.setPointsColorArrow(allObj)
}

// 勾选了第二个列表的点要和第一个列表的点合并一起画出来
function getCurSelectedListFromSecondList(obj: any) {
  const firstList = sourceResultListRef.value.curSelectedList
  const allObj = mergeObjects(obj, firstList)
  volviewRef.value.setPointsColorArrow(allObj)
}

// 勾选了结果列表某点
function getCurSelectedList(obj: any) {
  volviewRef.value.setPointsColorArrow(obj)
}

// 合并两个对象的数组
function mergeObjects(obj1: any, obj2: any) {
  const result: any = {}
  // 获取所有唯一键（合并两个对象的键）
  const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)])
  for (const key of allKeys) {
    // 获取两个对象中该键的值（如果不存在则为空数组）
    const arr1 = obj1[key] || []
    const arr2 = obj2[key] || []
    // 直接合并数组（不去重）
    result[key] = [...arr1, ...arr2]
    // // 合并两个数组并去重
    // const mergedArray = [...new Set([...arr1, ...arr2])]
    // // 将结果存入新对象
    // result[key] = mergedArray
  }
  return result
}

// 发起手动标注棘波
function goReviewMegPage() {
  router.push({
    path: 'reviewMeg',
    query: {
      subjectId: subjectId.value,
      megId: megId.value,
      coregId: curCoregId.value,
      niiFilePath: curNiiFilePath.value,
      fifFilePath: curCoreg.value.fifFilePath,
    }
  })
}

// 导出溯源定位结果弹窗
const exportResultModalRef = ref(null)
// 导出溯源定位结果
function exportResult() {
  // 勾选的点列表
  const allSelectedList1 = sourceResultListRef.value.getSelectedData()
  const allSelectedList2 = sourceLocationResultListRef.value.getSelectedData()

  const allSelectedList = [...allSelectedList1, ...allSelectedList2]
  if (!allSelectedList.length) {
    message.info(t('请先勾选要导出的溯源定位结果'))
    return
  }
  exportResultModalRef.value.showModal(curCoreg.value, allSelectedList)
}

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




// 计算距离是要获取点和切片新的坐标，再计算距离，一个4维矩阵计算公式，万里教我的
function getNewPosition(position: number[]) {

  const worldToIndex = imageMetadata.value.worldToIndex
  const spacing = imageMetadata.value.spacing

  const x = worldToIndex[0] * position[0] +
    worldToIndex[4] * position[1] +
    worldToIndex[8] * position[2] +
    worldToIndex[12] * 1

  const y = worldToIndex[1] * position[0] +
    worldToIndex[5] * position[1] +
    worldToIndex[9] * position[2] +
    worldToIndex[13] * 1

  const z = worldToIndex[2] * position[0] +
    worldToIndex[6] * position[1] +
    worldToIndex[10] * position[2] +
    worldToIndex[14] * 1

  // 计算切片不用步长，计算距离需要步长
  return [
    x,
    y,
    z,
    // x * spacing[0],
    // y * spacing[1],
    // z * spacing[2],
  ] // 万里说的新的写法，算距离的时候y和z对调，并乘上步长
}

function goToReportPage(type: string) {
  router.push({
    path: 'clinicalReports',
    query: {
      subjectId: subjectId.value,
      megId: megId.value,
      type: type,
    }
  })
}

const showScreenshot = ref(false) // 是否显示截图模式
const coronalPlaneList = ref([]) //
const sagittalPlaneList = ref([]) //
const axialPlaneList = ref([]) //

// 点击进入截图模式
async function onScreenshot() {
  showScreenshot.value = true
  getGeneralReportData()
  volviewRef.value?.setShowResliceCursor(false)
}


// 取消
function cancelShowScreenshot() {
  showScreenshot.value = false
  coronalPlaneList.value = []
  sagittalPlaneList.value = []
  axialPlaneList.value = []
  volviewRef.value?.setShowResliceCursor(true)
}

async function getGeneralReportData(onlyView?: string) {

  if (onlyView === 'coronal') {
    coronalPlaneList.value = []
  } else if (onlyView === 'sagittal') {
    sagittalPlaneList.value = []
  } else if (onlyView === 'axial') {
    axialPlaneList.value = []
  }

  const params = {
    subjectId: subjectId.value,
    isOnlyDipoleOverview: true, // 是否只返回脑部信息
  }
  const { code, data } = await getGeneralReportDataApi(params)
  if (code === 200) {
    const { coronal_plane, sagittal_plane, axial_plane } = data?.inter_dipole_overview || {}
    // 定义通用的映射函数
    const mapPlane = (planeData: any[]) => {
      return planeData?.map((item: any) => ({
        img: item.fig,
        slice: item.slice_num,
        changed: false,
      })) || []
    }
    // 根据 onlyView 参数决定赋值行为
    if (onlyView === 'coronal') {
      coronalPlaneList.value = mapPlane(coronal_plane)
    } else if (onlyView === 'sagittal') {
      sagittalPlaneList.value = mapPlane(sagittal_plane)
    } else if (onlyView === 'axial') {
      axialPlaneList.value = mapPlane(axial_plane)
    } else {
      // 如果 onlyView 不在指定范围内，则默认全部赋值（兼容旧逻辑）
      coronalPlaneList.value = mapPlane(coronal_plane)
      sagittalPlaneList.value = mapPlane(sagittal_plane)
      axialPlaneList.value = mapPlane(axial_plane)
    }

  }
}
// coronal  sagittal axial
function clickItemCoronal(index: number) {
  volviewRef.value?.getScreenshotSingle('coronal', index)
}
function clickItemSagittal(index: number) {
  volviewRef.value?.getScreenshotSingle('sagittal', index)
}
function clickItemAxial(index: number) {
  volviewRef.value?.getScreenshotSingle('axial', index)
}


const curSliceCoronal = ref(0)
const curSliceSagittal = ref(0)
const curSliceAxial = ref(0)
// A 项目中的脚本
window.addEventListener('message', async (event) => {
  // // 验证 event.origin 是否是你期望的源
  // if (event.origin !== 'http://b.example.com') return; // 假设 B 项目的源是 http://b.example.com

  // console.log('Received message:', event.data);

  if (event.data.type === 'getSliceCenter') {
    const centerObj: any = JSON.parse(event.data.value)
    const sliceList = centerObj.sliceList || []
    curSliceCoronal.value = sliceList.ObliqueCoronal
    curSliceSagittal.value = sliceList.ObliqueSagittal
    curSliceAxial.value = sliceList.ObliqueAxial
  }

  // 这里接收到来自 B 项目3个切片的截图
  if (event.data.type === 'screenshotSingle') {
    const view = event.data.view
    const index = event.data.index
    const screenshot = await adjustToSquare(event.data.screenshot) // 改成正方形图片

    if (view === 'coronal') {
      coronalPlaneList.value[index].img = screenshot
      coronalPlaneList.value[index].slice = curSliceCoronal.value
      coronalPlaneList.value[index].changed = true
    }
    if (view === 'sagittal') {
      sagittalPlaneList.value[index].img = screenshot
      sagittalPlaneList.value[index].slice = curSliceSagittal.value
      sagittalPlaneList.value[index].changed = true
    }
    if (view === 'axial') {
      axialPlaneList.value[index].img = screenshot
      axialPlaneList.value[index].slice = curSliceAxial.value
      axialPlaneList.value[index].changed = true
    }
  }
});

async function saveDipoleOverviewScreenshot(view: string) {
  let targetList = []
  let key = ''
  if (view === 'coronal') {
    targetList = coronalPlaneList.value
    key = 'coronalPlane'
  }
  if (view === 'sagittal') {
    targetList = sagittalPlaneList.value
    key = 'sagittalPlane'
  }
  if (view === 'axial') {
    targetList = axialPlaneList.value
    key = 'axialPlane'
  }

  let newList: any[] = []
  targetList.forEach((item: any, index: number) => {
    // 只上传修改的截图
    if (item.changed) {
      newList.push({
        sliceNum: item.slice,
        figInd: index,
        figData: item.img,
      })
    }
  })
  if (!newList.length) {
    return message.info(t('截图未更新'))
  }

  const promises = newList.map(async (item) => {
    if (typeof item.figData === 'string' && item.figData.startsWith('http://')) {
      item.figData = await convertToBase64(item.figData)
    }
  })
  await Promise.all(promises)

  const params: any = {
    subjectId: subjectId.value,
    screenshotInfo: {
      [key]: newList
    }  // 截图信息
  }
  const { code, msg } = await saveDipoleOverviewScreenshotApi(params)
  if (code === 200) {
    message.success(msg)
    getGeneralReportData(view) // 更新局部视图
  }
}


/**
 * 调整图片为正方形（高度不变）
 * @param {string} base64Image - 原始Base64图片
 * @param {number} [quality=1] - 图片质量 (0-1)
 * @returns {Promise<string>} 调整后的Base64图片
 */
async function adjustToSquare(base64Image: string, quality = 1) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        // 获取原始尺寸
        const originalWidth = img.width;
        const originalHeight = img.height;

        // 设置新尺寸：高度不变，宽度等于高度（正方形）
        const newHeight = originalHeight;
        const newWidth = newHeight; // 正方形

        // 创建Canvas处理图片
        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;

        const ctx = canvas.getContext('2d');

        // 填充背景色
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 计算绘制位置（居中）
        const scale = newHeight / originalHeight;
        const scaledWidth = originalWidth * scale;

        // 计算x坐标（居中）
        let x = 0;
        if (scaledWidth < newWidth) {
          // 如果缩放后宽度小于新宽度，居中显示
          x = (newWidth - scaledWidth) / 2;
        } else {
          // 如果缩放后宽度大于新宽度，居中裁剪
          const cropWidth = newWidth / scale;
          x = (originalWidth - cropWidth) / 2;
          ctx.drawImage(
            img,
            x, 0, cropWidth, originalHeight,
            0, 0, newWidth, newHeight
          );
          // 获取新的Base64图片
          const newBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(newBase64);
          return;
        }

        // 绘制图片
        ctx.drawImage(img, x, 0, scaledWidth, newHeight);

        // 获取新的Base64图片
        const newBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(newBase64);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = (error) => {
      reject(new Error('图片加载失败'));
    };

    img.src = base64Image;
  });
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



.screenshot-box {
  position: absolute;

  &.list-1 {
    top: calc(50% - 133px);
    right: calc(50% + 4px);
  }

  &.list-2 {
    top: calc(50% - 133px);
    right: calc(0% + 4px);
  }

  &.list-3 {
    top: calc(100% - 133px);
    right: calc(50% + 4px);
  }

  .save-button {
    padding: 2px 5px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.2);
    color: #ccc;
    width: 40px;
    text-align: center;
    font-size: 12px;
    margin-right: 2px;
    margin-bottom: 4px;
    cursor: pointer;

    &:hover {
      background: rgba(255, 255, 255, 0.4);
      color: #fff;
    }
  }

  .screenshot-list {
    display: flex;
    color: #ccc;
    font-size: 10px;

    .item {
      border: 1px solid #666;
      border-right: none;
      width: 75px;
      height: 103px;
      text-align: center;
      background: #000;

      &:last-child {
        border-right: 1px solid #666;
      }

      .img-wrap {
        width: 100%;
        height: 80px;
        margin-bottom: 2px;
        display: flex;
        align-content: center;
        justify-content: center;
        align-items: center;
        overflow: hidden;

        img {
          height: 100%;
          cursor: zoom-in;

        }
      }

      .info {
        padding: 0 6px;

        .change-button {
          padding: 1px 8px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.2);
          color: #ccc;
          // width: 40px;
          text-align: center;
          font-size: 10px;
          cursor: pointer;

          &:hover {
            background: rgba(255, 255, 255, 0.3);
          }
        }
      }

    }
  }
}
</style>
