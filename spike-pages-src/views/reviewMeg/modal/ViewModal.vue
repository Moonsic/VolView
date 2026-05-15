<template>
  <DragCard v-if="visible" class="drag-modal" ref="dragCardRef" :width="cardWidth" :height="cardHeight" :left="cardLeft"
    :top="cardTop" :zIndex="zIndex" :marginTop="marginTop" type="reviewMegViewModal" @close="closeModal">
    <div class="card-body">
      <div class="left">

        <div class="tree-list">
          <div class="list-title flex-between">
            {{ t('时刻点列表') }}
            <!-- <IconReload class="text-12 cursor-pointer" :title="t('加载结构像')" @click="restartView" /> -->
          </div>
          <div v-for="(value, key, index) in treeData" :key="index" class="item"
            :class="`item-${value.locMethodValue}`">
            <div class="title flex-between">
              <div class="flex-start text-ellipsis">
                <a-checkbox class="mr2 scale08" v-model:checked="value.select" @change="changeSelect(key)"></a-checkbox>
                <span class="name">{{ key }}</span>
              </div>
              <div @click="clickTitle(key)">
                <IconDown class="down-icon" :style="{ transform: value.showChild ? '' : 'rotate(-90deg)' }" />
              </div>
            </div>

            <div v-if="value.showChild" class="sub-list">
              <div v-for="(position, time) in value.children" :key="time" class="sub-item">
                <div class="title flex-between" :class="{ active: curData === position?.id }"
                  @click.stop="clickItem(position)">
                  <div class="text-ellipsis">
                    <!-- 开始position为空，position.select会报错，所以加上v-if -->
                    <a-checkbox class="mr2 scale08" v-if="position" v-model:checked="position.select"
                      @change="changeSelect(key, time)" @click.stop></a-checkbox>
                    <span>{{ time }}</span>
                  </div>
                  <div class="flex-center">
                    <a-popover overlayClassName="view-modal-popover" placement="right" :title="`${time}`">
                      <IconMore class="more-icon text-12 mr4" />
                      <template #content>
                        <div class="item-popover">
                          <div><span>gof：</span><span>{{ position?.gof }}</span></div>
                          <div><span>ori：</span><span>{{ position?.ori[0] }}</span></div>
                          <div><span>pos：</span><span>{{ position?.pos[0] }}</span></div>
                        </div>
                      </template>
                    </a-popover>
                    <LoadingOutlined v-if="!position" />
                    <IconDelete v-if="position" class="icon-delete" @click.stop="deleteItem(key, time)" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div class="menu-button" :class="[allData.length && !buttonLoading ? 'bg-blue' : 'bg-disabled']"
          @click="onSave">
          <span v-if="buttonLoading">{{ t('保存中') }}...</span>
          <span v-else>{{ t('保存为棘波时刻点') }}</span>
        </div>
        <!-- <div class="menu-button" :class="[allData.length && !buttonLoading ? 'bg-red' : 'bg-disabled']"
          @click="onBatchDelete">
          <span>批量删除</span>
        </div> -->
        <a-popconfirm :title="t('确认批量删除？')" placement="right" :ok-text="t('确定')" :cancel-text="t('取消')"
          @confirm="onBatchDelete">
          <div class="menu-button" :class="[allData.length && !buttonLoading ? 'bg-red' : 'bg-disabled']">
            <span>{{ t('批量删除') }}</span>
          </div>
        </a-popconfirm>
      </div>

      <div class="right">
        <VolViewSideTop @switchFunction="switchFunction" @setShowResliceCursor="setShowResliceCursor"
          @restartView="restartView" @resetView="resetView">
        </VolViewSideTop>
        <VolView ref="volviewRef" />
      </div>
    </div>

    <!-- 配准弹窗 -->
    <CoregModal ref="coregModalRef" :megId="props.megId" :subjectId="props.subjectId" />


  </DragCard>

</template>

<script lang="ts" setup>
import { message, Modal } from 'ant-design-vue'
import { Button } from 'ant-design-vue' // 确保导入Button组件

import { locMethodList } from '@u/data' // 算法列表

import { getFileNameAndSuffix } from '@u/utils'

import DragCard from '../parts/DragCard.vue'
import VolView from '@c/VolView.vue'
import CoregModal from './CoregModal.vue'
import VolViewSideTop from '@/components/VolViewSideTop.vue'

import {
  getNiiFileStreamApi, // 3. 获取结构像的2D图像
  quickSlApi, // 8. 快捷溯源定位
} from '@/api/sl'

import {
  addManualSpikeBatchApi, // 21. 批量新增手动标注的棘波时刻点
} from '@/api/meg'

const { t } = useI18n()

const props = defineProps({
  niiFilePath: {
    type: String,
    default: '',
  },
  fifFilePath: {
    type: String,
    default: '',
  },
  brainRegion: {
    type: String,
    default: '',
  },
  chNames: {
    type: Array,
    default: [],
  },
  locMethod: {
    type: String,
    default: '',
  },
  megId: {
    type: String,
    default: '',
  },
  subjectId: {
    type: String,
    default: '',
  },
  autoSl: {
    type: Number,
    default: 0,
  },
})


const emit = defineEmits(['success'])

// 弹窗可拖动
const dragCardRef = ref(null)
const coregModalRef = ref(null)

function getPositionSize() {
  return dragCardRef.value.getPositionSize()
}

const cardWidth = ref(130 + 2 + 2 + 600) // 120是左侧列表，40是左侧工具栏，22是Reset图标占的宽度20+2个边，左侧工具栏和Reset图标占的宽度都去掉了
const cardHeight = ref(600)
const cardLeft = ref(270)
const cardTop = ref(94)
const zIndex = ref<number>(0) // 卡片层级，用于拖拽时始终在最上方
const marginTop = 20

// 设置层级z-index
function setZIndex(value: number) {
  zIndex.value = Number(value + 100)
}

const visible = ref<boolean>(false)
const treeData = reactive<{ [k: string]: { showChild: boolean; select: boolean; locMethodValue: string; children: any } }>({
  // "sLORETA": { "showChild": true, "children": { "42.513": { "pos": [ [ 83, 118, 143 ] ], "gof": [ -899095.4375 ], "ori": [ [ -0.7194, 0.5085, 0.4732 ] ], "coord_frame": "mri_voxel", "id": "sloreta42.513" }, "42.945": { "pos": [ [ 133, 133, 163 ] ], "gof": [ -546257.125 ], "ori": [ [ -0.6709, 0.2738, 0.6891 ] ], "coord_frame": "mri_voxel", "id": "sloreta42.945" }, "42.963": { "pos": [ [ 138, 133, 178 ] ], "gof": [ -543385.875 ], "ori": [ [ 0.8156, -0.2162, 0.5366 ] ], "coord_frame": "mri_voxel", "id": "sloreta42.963" } }, "select": true },
  // "dSPM": { "showChild": true, "children": { "43.421": { "pos": [ [ 108, 88, 143 ] ], "gof": [ 0.5274 ], "ori": [ [ 0.5101, 0.2578, 0.8206 ] ], "coord_frame": "mri_voxel", "id": "dspm43.421" }, "42.79": { "pos": [ [ 93, 118, 128 ] ], "gof": [ 0.3756 ], "ori": [ [ -0.1467, 0.3179, 0.9367 ] ], "coord_frame": "mri_voxel", "id": "dspm42.79" }, "44.347": { "pos": [ [ 143, 73, 108 ] ], "gof": [ 0.4465 ], "ori": [ [ -0.6883, -0.6966, -0.2025 ] ], "coord_frame": "mri_voxel", "id": "dspm44.347" } }, "select": true },
  // "Dipole fitting": { "showChild": true, "children": { "43.508": { "pos": [ [ 123, 123, 133 ] ], "gof": [ 0.4703 ], "ori": [ [ 0.0828, 0.8741, 0.4786 ] ], "coord_frame": "mri_voxel", "id": "dip43.508" } }, "select": true },
})


// 所有选中的数据
const allData = computed(() => {
  let list: { time: string, select: boolean, position: any, locMethodLabel: string }[] = []
  Object.keys(treeData).forEach((key: string) => {
    const value: any = treeData[key]
    Object.keys(value.children).forEach((sub: string) => {
      const subValue: any = value.children[sub]
      // 因为在请求接口前就把时间加上去了，此时subValue=null,所以subValue要加?.
      if (subValue?.select) {
        list.push({
          time: sub,
          select: subValue.select, // 这里是子节点的select，不是父节点的select
          position: subValue,
          locMethodLabel: key,
        })
      }
    })
  })
  return list
});


const curData = ref<string>('')

const volviewRef = ref(null)
const curNiiFileUrl = ref<string>('')     // 当前结构像路径的Url
const curNiiFileName = ref<string>('') // 当前结构像路径的Name

// 显示弹窗
async function showModal(zIndexValue: number, cardParams: any, cb?: () => {}) {
  visible.value = true
  zIndex.value = Number(zIndexValue + 100)

  // 如果有卡片大小位置信息，就设置
  if (cardParams) {
    cardWidth.value = cardParams.cardWidth
    cardHeight.value = cardParams.cardHeight - marginTop
    cardLeft.value = cardParams.cardLeft
    cardTop.value = cardParams.cardTop
  }

  // 想nextTick延时再请求接口，不知道有没有效果，这里nextTick只有40ms
  // 在这里效果还挺好的，说明nextTick有点效果
  nextTick(async () => {
    const params = {
      filePath: props.niiFilePath,
      mgz: 1 // 0:nii, 1:mgz
    }

    const { code, data } = await getNiiFileStreamApi(params)
    if (code === 200) {
      // const [name, suffix] = getFileNameAndSuffix(props.niiFilePath) // [name: 'test', suffix:'nii'] = sub-01/anat/test.nii
      // 因为不在强制mgz了，所以props.niiFilePath可能是nii，而data是mgz，curNiiFileName.value要和data匹配，所以必须getFileNameAndSuffix(data)
      const [name, suffix] = getFileNameAndSuffix(data) // [name: 'test', suffix:'nii'] = sub-01/anat/test.nii
      curNiiFileName.value = name + '.' + suffix // 这里不能再强制mgz了，因为有的时候没有mgz给我的是nii，那我只能用nii
      curNiiFileUrl.value = data

      // 这个200ms的setTimeout不能少，否则setUrl就失效了
      setTimeout(() => {
        restartView()
        cb && cb()
      }, 200)
    }
  })
}


// 加载结构像
function restartView() {
  volviewRef.value.setUrl(curNiiFileName.value, curNiiFileUrl.value)
}

// 默认勾选
const defaultSelect = computed(() => {
  return props.autoSl === 0 ? true : false
})

// 设置时间数据
async function setTimeData(time: string, coregId: string, channels: string[], position: any) {

  if (!coregId) {
    coregModalRef.value.showModal(t('当前患者尚未进行配准，请先进行配准'))
    return
  }

  const locMethodLabel = locMethodList.find(f => f.value === props.locMethod)?.label
  const locMethodValue = locMethodList.find(f => f.value === props.locMethod)?.value

  // 不包含加入，包含更新，使用obj的方式会自动去重
  // 先把时间加上去，出现loading效果，如果接口失败再删掉
  if (!treeData[locMethodLabel]) {
    treeData[locMethodLabel] = {
      showChild: true,
      select: defaultSelect.value,
      locMethodValue: locMethodValue,
      children: {},
    }
  }
  treeData[locMethodLabel].children[time] = null

  // 如果有位置，说明是左侧算法或手动列表点击过来的，就不用请求接口了
  if (position) {
    position.id = props.locMethod + time // id用于赋值给curData
    position.channels = channels || [] // channels要存下来，保存时要传
    position.select = defaultSelect.value
    treeData[locMethodLabel].children[time] = position

    if (defaultSelect.value) {
      setPositionList()   // 新加的点默认勾上，所以要马上和其他勾选的点一起画出来
    } else {
      // 自动溯源，就不勾选
      clearSetPositionList()
    }
    clickItem(position) // 新加的点马上定位位置
    return
  }

  const params = {
    fifFilePath: props.fifFilePath,
    coregId: coregId,
    timePointList: [time],
    returnCoord: 1, //  1 返回坐标， 2 返回溯源定位图片
    locMethod: props.locMethod,
    channels: channels || [], // 只用于幅度值折线图溯源定位时，把选中的通道名称带过来。
  }
  const { code, data, msg } = await quickSlApi(params)
  if (code === 200) {
    if (data.is_success) {
      const position: any = data.result[props.locMethod] || {}
      position.id = props.locMethod + time // id用于赋值给curData
      position.channels = channels || [] // channels要存下来，保存时要传

      position.select = defaultSelect.value
      treeData[locMethodLabel].children[time] = position

      if (defaultSelect.value) {
        setPositionList()   // 新加的点默认勾上，所以要马上和其他勾选的点一起画出来
      } else {
        // 自动溯源，就不勾选
        clearSetPositionList()
      }
      clickItem(position) // 新加的点马上定位位置
    } else {
      message.error(msg) // '溯源定位失败'
      delete treeData[locMethodLabel].children[time]
    }
  } else {
    // '溯源定位失败'或者是'请先进行前向处理'等
    delete treeData[locMethodLabel].children[time]
  }

}

// 点击溯源算法，触发展开收起
function clickTitle(key: string | number) {
  treeData[key].showChild = !treeData[key].showChild
}

// 点击时刻点
async function clickItem(position: any) {
  curData.value = position.id
  if (position) {
    volviewRef.value.setPosition(position.pos[0]) // [153, 138, 153]
  }
}

// 删除时刻点
async function deleteItem(key: string, time: string) {
  delete treeData[key].children[time]
  setPositionList()
}

// 把勾选的批量删除
function onBatchDelete() {
  for (const key in treeData) {
    const children = treeData[key].children // 这是对象
    Object.keys(children).forEach((sub: string) => {
      if (treeData[key].children[sub].select) {
        delete treeData[key].children[sub]
      }
    })
  }
  setPositionList()
}
// 修改勾选
function changeSelect(key: string | number, time?: string) {
  // console.log('key,time :>> ', key,time);
  // console.log('treeData :>> ', treeData);

  // 第一层
  if (key && !time) {
    // 第一层决定第二层是全选还是全不选
    Object.keys(treeData[key].children).forEach((sub: string) => {
      treeData[key].children[sub].select = treeData[key].select
    })
  }

  // const value = treeData[key].children[time]
  // treeData[key].select = value
  // treeData[key].children[time].select =!treeData[key].children[time].select

  setPositionList()
}

// 设置所有球体
function setPositionList() {

  // console.log('allData.value :>> ', allData.value);

  // 带箭头颜色
  const allObj: any = {}
  allData.value.forEach(item => {
    if (item.select && item.position && item.position.pos) {
      if (!allObj[item.locMethodLabel]) {
        allObj[item.locMethodLabel] = []
      }
      allObj[item.locMethodLabel].push([item.position.pos[0], item.position.ori[0]])
    }
  })

  // console.log('treeData :>> ', treeData);
  // console.log('allObj :>> ', allObj);

  const obj = {
    '#f00': allObj['Dipole fitting'] || [],
    '#fd0': allObj.dSPM || [],
    '#0f0': allObj.sLORETA || [],
    '#0cf': allObj.wMNE || [],
    '#f0f': allObj.beamformer || [],
  }
  // console.log('obj :>> ', obj);

  volviewRef.value.setPointsColorArrow(obj)
}

// 把勾选和画的点都取消
function clearSetPositionList() {
  Object.keys(treeData).forEach((key: string) => {
    const value: any = treeData[key]
    value.select = false
    Object.keys(value.children).forEach((sub: string) => {
      const subValue: any = value.children[sub]
      subValue.select = false
    })
  })
  // 结构像里也要清空点位
  volviewRef.value?.clearPoints()
}

const buttonLoading = ref<boolean>(false) // 点击保存后2秒内不允许再次点击

// 保存弹窗
async function onSave() {
  if (!allData.value.length || buttonLoading.value) {
    return
  }

  const pList: any[] = []
  const spikeTimeList: any[] = []
  allData.value.forEach(item => {
    if (item.select) {
      // 不包含加入
      const timeList = spikeTimeList.map(m => m.startTime)
      if (!timeList.includes(item.time)) {
        spikeTimeList.push({
          startTime: item.time,
          slCoord: {
            pos: item.position.pos,
            gof: item.position.gof,
            ori: item.position.ori,
            status: item.position.status,
          },
          spikeType: 6,  // 棘波类型 // 先传‘其他’
          channels: item.position.channels || []
        })

        pList.push(h('div', {
          class: 'item',
        }, `${item.time}`))
      }
    }
  })


  Modal.confirm({
    title: t('是否保存为棘波时刻点？'),
    content: () => [
      // h('p', {
      //   class: 'mt16 mb24',
      // }, `是否保存为棘波时刻点？`),
      h('div', { class: 'manual-delete-confirm-modal mb16' }, pList),
      h('div', { class: 'text-right' }, [
        h(Button, {
          type: 'primary',
          class: 'mr8',
          onClick: () => onSaveReuqest(true, async () => Modal.destroyAll()),
        }, { default: () => t('保存并清空当前列表') }),
        h(Button, {
          type: 'primary',
          class: 'mr8',
          onClick: () => onSaveReuqest(false, async () => Modal.destroyAll()),
        }, { default: () => t('保存') }),
        h(Button, {
          type: 'default',
          onClick: () => Modal.destroyAll(),
        }, { default: () => t('取消') }),
      ]),
    ],
    footer: null,
  })
}


// 保存接口
async function onSaveReuqest(isClear: boolean = false, cb?: () => {}) {

  // 点击保存后2秒内不允许再次点击，因为有弹窗的存在，这个实际也没有什么用了
  buttonLoading.value = true
  setTimeout(() => {
    buttonLoading.value = false
  }, 2000)

  const spikeTimeList: any[] = []
  allData.value.forEach(item => {
    // 不包含加入
    const timeList = spikeTimeList.map(m => m.startTime)
    if (!timeList.includes(item.time)) {
      spikeTimeList.push({
        startTime: item.time,
        slCoord: {
          pos: item.position.pos,
          gof: item.position.gof,
          ori: item.position.ori,
          status: item.position.status,
        },
        spikeType: 6,  // 棘波类型 // 先传‘其他’
        channels: item.position.channels || []
      })
    }
  })

  const params: any = {
    fifFilePath: props.fifFilePath,
    niiFilePath: props.niiFilePath,     // 棘波开始时间, 以字符串形式传递
    brainArea: props.brainRegion || '', // 脑区，本来是null，改成''
    channels: props.chNames.join(','),  // 当前展示的是哪些通道的脑磁图，以逗号隔开。如果同时存在脑区和通道的话，以通道为准
    spikeTimeList: spikeTimeList,       // 当前展示的是哪些通道的脑磁图，以逗号隔开。如果同时存在脑区和通道的话，以通道为准
    subjectId: props.subjectId,
  }

  const { code, msg } = await addManualSpikeBatchApi(params)
  if (code === 200) {
    message.success(msg)
    if (isClear) {
      // 清空对象
      Object.keys(treeData).forEach(key => {
        delete treeData[key]
      });
      setPositionList()
    }
    cb && cb()
  }
}

// const spikeTimeList = [
//   {
//     "startTime": "36.87",
//     "spikeType": 4,
//     "slCoord": {
//       "pos": [
//         [
//           -0.010000000201673992,
//           -0.07500000601608861,
//           0.024999999247993968
//         ]
//       ],
//       "gof": [
//         0.4245825409889221
//       ],
//       "ori": [
//         [
//           0.5547771940395441,
//           -0.011855633102682187,
//           0.8319144841492692
//         ]
//       ]
//     }
//   }]



// 关闭弹窗
function closeModal() {
  visible.value = false
  curData.value = ''
  // 清空对象
  Object.keys(treeData).forEach(key => {
    delete treeData[key]
  })
}

// 清空数据，切换患者数据列表式要清空结构像的点位数据
function clearTimeData() {
  curData.value = ''
  // 清空对象
  Object.keys(treeData).forEach(key => {
    delete treeData[key]
  })
  // 结构像里也要清空点位
  volviewRef.value?.clearPoints()
}

// 暴露方法
defineExpose({
  visible,
  showModal,
  setTimeData,
  setZIndex,
  getPositionSize,
  clearTimeData
})


// 右侧功能栏
const curFunction = ref('close')

function switchFunction(value: string) {
  curFunction.value = value
  volviewRef.value.dragFunction(value)
}

// 显示十字线&滑动条
const showResliceCursor = ref(true)
function setShowResliceCursor(value: boolean) {
  showResliceCursor.value = value
  volviewRef.value.setShowResliceCursor(value)
}

function resetView() {
  volviewRef.value.resetView()
}

</script>

<style lang="less">
.ant-popover.view-modal-popover {

  .ant-popover-content {
    overflow: hidden;
    box-shadow: 0px 12px 20px 0px rgba(0, 0, 0, 0.20);
  }

  .ant-popover-title {
    margin: 0;
    padding: 12px 12px;
    font-size: 14px;
    font-weight: 500;
    color: #fff;
    background: var(--color-title-bg-blue);

    &:before {
      content: '';
      display: inline;
      border-left: 4px solid rgba(255, 255, 255, 0.50);
      border-right: 4px solid rgba(255, 255, 255, 0.50);
      border-radius: 2px;
      margin-right: 8px;
    }
  }
}
</style>


<style lang="less" scoped>
// checkbox 暗色背景
:deep(.ant-checkbox-wrapper) {
  .ant-checkbox {
    .ant-checkbox-inner {
      border: 1px solid rgba(255, 255, 255, 0.20);
      border-radius: 4px;
      background-color: transparent;
    }
  }
}

// 定义颜色变量
@dip: #FF2C3B;
@dSPM: #FF8400;
@sLORETA: #23CB23;
@wMNE: #22AEFF;
@beamformer: #FF28BF;
@badcase: #852DFF;

// 创建一个mixin来定义样式规则
.color-theme(@color) {

  >.title {
    background-color: fade(@color, 10%);

    .name {
      color: @color;
    }
  }

  .checkbox-all {
    background: fade(@color, 10%);
  }

  .sub-list {
    .sub-item {
      .sub-list {
        .sub-item {
          .alg-title {
            background: fade(@color, 2%);
          }

          .sub-list {
            .sub-item {
              &:nth-of-type(2n) {
                background: fade(@color, 2%);
              }
            }
          }
        }
      }
    }
  }

  :deep(.ant-checkbox-wrapper) {
    &:hover {
      .ant-checkbox-inner {
        border-color: @color;
      }
    }

    &.ant-checkbox-wrapper-checked:not(.ant-checkbox-wrapper-disabled) {
      .ant-checkbox-inner {
        background-color: @color;
        border-color: @color;
      }

      .ant-checkbox-checked:not(.ant-checkbox-disabled):after {
        border-color: @color;
      }
    }
  }
}

// 手动为每种颜色应用样式
.item-dip {
  .color-theme(@dip);
}

.item-dSPM {
  .color-theme(@dSPM);
}

.item-sLORETA {
  .color-theme(@sLORETA);
}

.item-wMNE {
  .color-theme(@wMNE);
}

.item-beamformer {
  .color-theme(@beamformer);
}

.item-badcase {
  .color-theme(@badcase);
}





.card-body {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  background: #424242;

  .left {
    width: 130px;
    min-width: 120px;
    height: 100%;
    display: inline-block;
    vertical-align: top;
    background: #17181B;
    color: #ddd;
    display: flex;
    flex-direction: column;

    .menu-button {
      width: 125px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      color: #fff;
      margin: 0 2px 3px 2px;
      border-radius: 2px;
      cursor: pointer;
      font-size: 12px;
    }

  }

  .right {
    width: calc(100% - 120px);
    height: 100%;
    display: inline-block;
    vertical-align: top;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
}


.tree-list {
  flex: 1;
  overflow: auto;

  >.list-title {
    padding: 5px 6px;
    border-bottom: 1px solid #222;
  }

  .item {

    >.title {
      height: 30px;
      padding: 0 5px 0 3px;
      border-bottom: 1px solid #222;
      cursor: pointer;

      .down-icon {
        color: rgba(255, 255, 255, 0.54);
        font-size: 12px;
      }

    }



    .sub-list {

      .sub-item {

        .title {
          height: 30px;
          padding: 0 6px 0 20px;
          border-bottom: 1px solid #222;
          cursor: pointer;


          // 先hover
          &:hover {
            background: #222;
            color: #fff;

            .more-icon,
            .icon-delete {
              display: block;
            }
          }

          // 再选中
          &.active {
            background: #1a1a1a;
            color: #fff;
          }

          .icon-delete {
            font-size: 12px;
            color: #aaa;
            display: none;
          }

          .more-icon {
            display: none;
          }

        }
      }
    }

  }
}



.item-popover {

  >div {
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    span:first-child {
      color: var(--color-gray);
      margin-right: 24px;
    }
  }
}
</style>
