<template>
  <div class="list-page">
    <div class="list-title flex-between">
      <div class="flex">
        {{ t('溯源定位结果列表') }}
        <IconReload class="reload-icon ml4" v-if="coregId" :title="t('刷新')" @click="onReload" />
      </div>
      <IconDown class="down-icon" :style="{ transform: showList ? '' : 'rotate(-90deg)' }" @click="clickMenu" />
    </div>

    <div class="tree-list" v-if="showList">

      <div class="pt8 pl8 pr8" v-if="Object.keys(treeData).length">
        <a-input-number class="widthP100" v-model:value="threshold" ref="thresholdRef" :placeholder="t('gof阈值')" :min="0"
          :step="0.1" @blur="blurThreshold" @pressEnter="pressEnterThreshold" />
      </div>

      <NoData :loading="loading" v-if="!Object.keys(treeData).length" />

      <div v-for="(value, key, index) in treeData" :key="index" class="item" :class="`item-${value.locMethodValue}`">
        <div class="bg-gray-line"></div>

        <div class="title flex-between">
          <div class="flex-start text-ellipsis">
            <a-checkbox class="mr2 scale08" v-model:checked="value.select" @change="changeSelect(key)"></a-checkbox>
            <span class="name text-bold">{{ value.locMethodLabel }}</span>
            <a-checkbox class="checkbox-all scale08" v-model:checked="value.selectAllAlg"
              @change="changeAllSelect(key, 'alg')">{{ t('算法') }}</a-checkbox>
            <a-checkbox class="checkbox-all checkbox-manual scale08" v-model:checked="value.selectAllManual"
              @change="changeAllSelect(key, 'manual')">{{ t('手动') }}</a-checkbox>
          </div>
          <div @click.stop="clickTitle(key)">
            <IconDown class="down-icon" :style="{ transform: value.showChild ? '' : 'rotate(-90deg)' }" />
          </div>
        </div>

        <div class="sub-list no-cluster-list" v-if="value.showChild">

          <div v-for="(fifValue, fif) in value.list" :key="fif" class="sub-item">
            <div class="title flex-between cls-title">
              <div class="text-ellipsis">
                <a-checkbox class="mr2 scale08" v-model:checked="fifValue.select"
                  @change="changeSelect(key, '', fif)"></a-checkbox>
                <span :title="fif">{{ fif }}</span>
              </div>
              <div @click.stop="clickTitle(key, '', fif)">
                <IconDown class="down-icon" :style="{ transform: fifValue.showChild ? '' : 'rotate(-90deg)' }" />
              </div>
            </div>


            <div class="sub-list" v-if="fifValue.showChild">
              <div class="sub-item">
                <div class="title flex-between alg-title">
                  <div class="text-ellipsis">
                    <a-checkbox class="mr2 scale08" v-model:checked="fifValue.selectAlg"
                      @change="changeSelect(key, '', fif, 'alg')"></a-checkbox>
                    <span class="text-12">{{ t('算法检测棘波列表') }}({{ fifValue.alg.length }})</span>
                  </div>
                  <div v-if="fifValue.alg.length" @click.stop="clickTitle(key, '', fif, 'alg')">
                    <IconDown class="down-icon" :style="{ transform: fifValue.showAlgChild ? '' : 'rotate(-90deg)' }" />
                  </div>
                </div>

                <div class="sub-list" v-if="fifValue.showAlgChild">
                  <div v-for="(item) in fifValue.alg" :key="item" class="sub-item">
                    <div class="title flex-between time-title" :class="{ active: curData.pos === item?.pos }"
                      @click="clickItem(item)">
                      <div class="text-ellipsis">
                        <a-checkbox class="mr2 scale08" v-model:checked="item.select" @change="getAllSelectedList"
                          @click.stop></a-checkbox>
                        <span>{{ item.time_stamp }}</span>
                      </div>
                      <div class="flex-center">
                        <a-popover placement="right" :title="`${item.time_stamp}`">
                          <IconMore class="more-icon text-16" />
                          <template #content>
                            <div class="item-popover">
                              <div><span>gof：</span><span>{{ item?.gof }}</span></div>
                              <div><span>ori：</span><span>{{ item?.ori }}</span></div>
                              <div><span>pos：</span><span>{{ item?.pos }}</span></div>
                            </div>
                          </template>
                        </a-popover>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <div class="sub-item">
                <div class="title flex-between alg-title">
                  <div class="text-ellipsis">
                    <a-checkbox class="mr2 scale08" v-model:checked="fifValue.selectManual"
                      @change="changeSelect(key, '', fif, 'manual')"></a-checkbox>
                    <span class="text-12">{{ t('手动标注棘波列表') }}({{ fifValue.manual.length }})</span>
                  </div>
                  <div v-if="fifValue.manual.length" @click.stop="clickTitle(key, '', fif, 'manual')">
                    <IconDown class="down-icon"
                      :style="{ transform: fifValue.showManualChild ? '' : 'rotate(-90deg)' }" />
                  </div>
                </div>

                <div class="sub-list" v-if="fifValue.showManualChild">
                  <div v-for="(item) in fifValue.manual" :key="item" class="sub-item">
                    <div class="title flex-between time-title" :class="{ active: curData.pos === item?.pos }"
                      @click="clickItem(item)">
                      <div class="text-ellipsis">
                        <a-checkbox class="mr2 scale08" v-model:checked="item.select" @change="getAllSelectedList"
                          @click.stop></a-checkbox>
                        <span>{{ item.time_stamp }}</span>
                      </div>
                      <div class="flex-center">
                        <a-popover placement="right" :title="`${item.time_stamp}`">
                          <IconMore class="more-icon text-16" />
                          <template #content>
                            <div class="item-popover">
                              <div><span>gof：</span><span>{{ item?.gof }}</span></div>
                              <div><span>ori：</span><span>{{ item?.ori }}</span></div>
                              <div><span>pos：</span><span>{{ item?.pos }}</span></div>
                            </div>
                          </template>
                        </a-popover>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="sub-item" v-if="value.locMethodValue === 'dip' && fifValue.megin.length">
                <div class="title flex-between alg-title">
                  <div class="text-ellipsis">
                    <a-checkbox class="mr2 scale08" v-model:checked="fifValue.selectMegin"
                      @change="changeSelect(key, '', fif, 'megin')"></a-checkbox>
                    <span class="text-12">{{ t('megin标注列表') }}({{ fifValue.megin.length }})</span>
                  </div>
                  <div v-if="fifValue.megin.length" @click.stop="clickTitle(key, '', fif, 'megin')">
                    <IconDown class="down-icon"
                      :style="{ transform: fifValue.showMeginChild ? '' : 'rotate(-90deg)' }" />
                  </div>
                </div>

                <div class="sub-list" v-if="fifValue.showMeginChild">
                  <div v-for="(item) in fifValue.megin" :key="item" class="sub-item">
                    <div class="title flex-between time-title" :class="{ active: curData.pos === item?.pos }"
                      @click="clickItem(item)">
                      <div class="text-ellipsis">
                        <a-checkbox class="mr2 scale08" v-model:checked="item.select" @change="getAllSelectedList"
                          @click.stop></a-checkbox>
                        <span>{{ item.time_stamp }}</span>
                      </div>
                      <div class="flex-center">
                        <a-popover placement="right" :title="`${item.time_stamp}`">
                          <IconMore class="more-icon text-16" />
                          <template #content>
                            <div class="item-popover">
                              <div><span>gof：</span><span>{{ item?.gof }}</span></div>
                              <div><span>ori：</span><span>{{ item?.ori }}</span></div>
                              <div><span>pos：</span><span>{{ item?.pos }}</span></div>
                            </div>
                          </template>
                        </a-popover>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { locMethodList } from '@u/data' // 算法列表
import { getFileSuffix } from '@u/utils'

import {
  getSourceLocationResultListApi, // 4. 获取定位结果列表
} from '@/api/sl'

const { t } = useI18n()

const props = defineProps({
  subjectId: {
    type: String,
    default: '',
  },
})

const showList = ref<boolean>(false)

// 点击标题
function clickMenu() {
  showList.value = !showList.value
}

const treeData = ref<any>({}) // 列表
const loading = ref<boolean>(false)
const curData = ref<any>({})
const coregId = ref<string>('')

// 如果没有id，就把列表清空（修改患者时才会传空id）
function setData(id: string) {
  if (!id) {
    coregId.value = id
    treeData.value = {}
    curData.value = {}
  } else {
    coregId.value = id
    treeData.value = {}
    getData()
  }
}

// 刷新
function onReload() {
  treeData.value = {}
  showList.value = true
  getData()
}

// 获取数据
async function getData() {
  const params = {
    coregId: coregId.value,
    subjectId: props.subjectId,
  }
  loading.value = true
  const { code, data } = await getSourceLocationResultListApi(params)
  loading.value = false
  if (code === 200) {
    const newData = JSON.parse(JSON.stringify(data))
    setTreeData(newData)
  }
}

function setTreeData(newData: any) {
  const { cluster_loc_method = [], dip_center_point = [] } = newData // 要给默认为空数组，否则后面的includes方法报错

  treeData.value = {}

  const tree: any = {}
  Object.keys(newData).forEach((key: string) => {
    if (!['is_cluster', 'cluster_loc_method', 'dip_center_point'].includes(key)) {
      tree[key] = { ...newData[key] }
      tree[key]['is_cluster'] = cluster_loc_method.includes(key)
    }
  })

  const valueList = ['is_cluster', 'locMethodLabel', 'locMethodValue', 'list', 'select', 'showChild', 'selectAllAlg', 'selectAllManual', 'selectAllMegin', 'selectResult']

  Object.keys(tree).forEach((key: string) => {
    const value: any = tree[key]

    value.locMethodLabel = locMethodList.find(f => f.value === key)?.label
    value.locMethodValue = key
    value.list = {}
    value.select = false
    value.selectAllAlg = false
    value.selectAllManual = false
    value.showChild = true

    // is_cluster 不同，数据结构也不同
    // 有聚类溯源结果，多一层 cls，在聚类溯源定位结果列表里才有
    // 无聚类溯源结果，少了一层 cls（当前列表）
    Object.keys(value).forEach((fif: string) => {

      const fifValue: any = value[fif]

      if (!valueList.includes(fif)) {

        fifValue.list = {}
        fifValue.select = false
        fifValue.selectAlg = false
        fifValue.selectManual = false
        fifValue.selectMegin = false
        fifValue.showChild = true
        fifValue.showAlgChild = false
        fifValue.showManualChild = false
        fifValue.showMeginChild = false

        if (!fifValue.alg) {
          fifValue.alg = []
        }
        if (!fifValue.manual) {
          fifValue.manual = []
        }
        if (!fifValue.megin) {
          fifValue.megin = []
        }
        fifValue.alg?.forEach((item: any) => {
          item.select = false
        })
        fifValue.manual?.forEach((item: any) => {
          item.select = false
        })
        fifValue.megin?.forEach((item: any) => {
          item.select = false
        })
        const newfif = getFileSuffix(fif, '/')
        value.list[newfif] = { ...fifValue }

        delete value[fif]
      }

    })

  })

  treeData.value = { ...tree }

  Object.keys(treeData.value).forEach(key => {
    const value = treeData.value[key];

    Object.keys(value.list).forEach(fif => {
      const fifValue = value.list[fif];

      // 保存原始数据
      fifValue.algAll = [...fifValue.alg];
      fifValue.manualAll = [...fifValue.manual];
      fifValue.meginAll = [...fifValue.megin];

      // 初始化显示数据为原始数据
      fifValue.alg = [...fifValue.alg];
      fifValue.manual = [...fifValue.manual];
      fifValue.megin = [...fifValue.megin];
    });
  })


  // 没有数据就展示暂无数据
  if (!Object.keys(treeData.value).length) {
    showList.value = true
  } else {
    nextTick(() => {
      // 默认选中dip所有点
      treeData.value['dip'].select = true
      changeSelect('dip')
      // 有dip_center_point，就默认定位dip的中心点
      if (dip_center_point.length) {
        emit('getCurData', dip_center_point)
      }
    })
  }



}

// 点击
// 溯源定位结果列表展示溯源定位算法输出结果的文件名称，
// 当我们鼠标左键选中某个结果文件的时候，
// 页面右侧以三维灰度图像的方式展示溯源定位结果
async function clickItem(item: any) {
  // console.log('item :>> ', item);
  curData.value = item
  const position = item?.pos
  // 有的slCoord没有数据
  if (position) {
    emit('getCurData', position)
  }

}


// 点击溯源算法，触发展开收起
function clickTitle(key: any, cls?: any, fif?: any, algManual?: string) {
  // console.log(' key, cls, fif, algManual :>> ', key, cls, fif, algManual)

  if (algManual) {
    if (algManual === 'alg') {
      treeData.value[key].list[fif].showAlgChild = !treeData.value[key].list[fif].showAlgChild
    }
    if (algManual === 'manual') {
      treeData.value[key].list[fif].showManualChild = !treeData.value[key].list[fif].showManualChild
    }
    if (algManual === 'megin') {
      treeData.value[key].list[fif].showMeginChild = !treeData.value[key].list[fif].showMeginChild
    }
  } else if (fif) {
    treeData.value[key].list[fif].showChild = !treeData.value[key].list[fif].showChild
  } else {
    treeData.value[key].showChild = !treeData.value[key].showChild
  }

}


// 勾选
function changeSelect(key: any, cls?: any, fif?: any, algManual?: string) {
  // console.log('changeSelect :>> ', key, cls, fif, algManual)

  if (algManual) {
    if (algManual === 'alg') {
      const fifValue = treeData.value[key].list[fif]
      const { selectAlg } = fifValue
      // 同时更新原始数组和过滤数组（使用同一引用）
      fifValue.alg?.forEach((item: any) => item.select = selectAlg)
      fifValue.algAll?.forEach((item: any) => item.select = selectAlg)
    }
    if (algManual === 'manual') {
      const fifValue = treeData.value[key].list[fif]
      const { selectManual } = fifValue
      // 同时更新原始数组和过滤数组（使用同一引用）
      fifValue.manual?.forEach((item: any) => item.select = selectManual)
      fifValue.manualAll?.forEach((item: any) => item.select = selectManual)
    }
    if (algManual === 'megin') {
      const fifValue = treeData.value[key].list[fif]
      const { selectMegin } = fifValue
      // 同时更新原始数组和过滤数组（使用同一引用）
      fifValue.megin?.forEach((item: any) => item.select = selectMegin)
      fifValue.meginAll?.forEach((item: any) => item.select = selectMegin)
    }

  } else if (fif) {
    const fifValue = treeData.value[key].list[fif]
    const { select } = fifValue
    fifValue.selectAlg = select
    fifValue.selectManual = select
    fifValue.selectMegin = select

    fifValue.alg?.forEach((item: any) => item.select = select)
    fifValue.algAll?.forEach((item: any) => item.select = select)
    fifValue.manual?.forEach((item: any) => item.select = select)
    fifValue.manualAll?.forEach((item: any) => item.select = select)
    fifValue.megin?.forEach((item: any) => item.select = select)
    fifValue.meginAll?.forEach((item: any) => item.select = select)


  } else {
    treeData.value[key].selectAllAlg = false
    treeData.value[key].selectAllManual = false
    treeData.value[key].selectAllMegin = false
    const { select, list } = treeData.value[key]
    Object.keys(list).forEach((fif: string) => {
      const fifValue: any = list[fif]
      fifValue.select = select
      fifValue.selectAlg = select
      fifValue.selectManual = select
      fifValue.selectMegin = select

      fifValue.alg?.forEach((item: any) => item.select = select)
      fifValue.algAll?.forEach((item: any) => item.select = select)
      fifValue.manual?.forEach((item: any) => item.select = select)
      fifValue.manualAll?.forEach((item: any) => item.select = select)
      fifValue.megin?.forEach((item: any) => item.select = select)
      fifValue.meginAll?.forEach((item: any) => item.select = select)

    })
  }

  getAllSelectedList()

}

// 勾选所有算法或者所有手动
function changeAllSelect(key: any, algManual: string) {
  // console.log('changeAllSelect :>> ', key, algManual)

  treeData.value[key].select = false
  if (algManual === 'alg') {
    const { selectAllAlg: select, list } = treeData.value[key]
    treeData.value[key].selectAllManual = false
    treeData.value[key].selectAllMegin = false
    Object.keys(list).forEach((fif: string) => {
      const fifValue: any = list[fif]
      fifValue.select = false
      fifValue.selectAlg = select
      fifValue.selectManual = false
      fifValue.selectMegin = false

      fifValue.alg?.forEach((item: any) => item.select = select)
      fifValue.algAll?.forEach((item: any) => item.select = select)
      fifValue.manual?.forEach((item: any) => item.select = false)
      fifValue.manualAll?.forEach((item: any) => item.select = false)
      fifValue.megin?.forEach((item: any) => item.select = false)
      fifValue.meginAll?.forEach((item: any) => item.select = false)

    })
  }
  if (algManual === 'manual') {
    const { selectAllManual: select, list } = treeData.value[key]
    treeData.value[key].selectAllAlg = false
    treeData.value[key].selectAllMegin = false
    Object.keys(list).forEach((fif: string) => {
      const fifValue: any = list[fif]
      fifValue.select = false
      fifValue.selectAlg = false
      fifValue.selectManual = select
      fifValue.selectMegin = false
      fifValue.alg?.forEach((item: any) => {
        item.select = false
      })
      fifValue.manual?.forEach((item: any) => {
        item.select = select
      })
      fifValue.megin?.forEach((item: any) => {
        item.select = false
      })

      fifValue.alg?.forEach((item: any) => item.select = false)
      fifValue.algAll?.forEach((item: any) => item.select = false)
      fifValue.manual?.forEach((item: any) => item.select = select)
      fifValue.manualAll?.forEach((item: any) => item.select = select)
      fifValue.megin?.forEach((item: any) => item.select = false)
      fifValue.meginAll?.forEach((item: any) => item.select = false)

    })
  }

  getAllSelectedList()

}

// 改成带有方向箭头的
function getAllSelectedList() {
  return getAllSelectedListWithArrow()
}

const curSelectedList = ref({})

function getAllSelectedListWithArrow() {
  const allObj: any = {}

  Object.keys(treeData.value).forEach((key: string) => {
    const value: any = treeData.value[key]

    // 算法和手动和megin不同的颜色
    allObj[value.locMethodValue + '_alg'] = []
    allObj[value.locMethodValue + '_manual'] = []
    allObj[value.locMethodValue + '_megin'] = []


    Object.keys(value.list).forEach((fif: string) => {
      const fifValue: any = value.list[fif]
      fifValue.alg?.forEach((item: any) => {
        if (item.select && item.pos) {
          allObj[value.locMethodValue + '_alg'].push(item.pos ? [item.pos, item.ori] : [])
        }
      })
      fifValue.manual?.forEach((item: any) => {
        if (item.select && item.pos) {
          allObj[value.locMethodValue + '_manual'].push(item.pos ? [item.pos, item.ori] : [])
        }
      })
      fifValue.megin?.forEach((item: any) => {
        if (item.select && item.pos) {
          allObj[value.locMethodValue + '_megin'].push(item.pos ? [item.pos, item.ori] : [])
        }
      })
    })

  })

  const obj = {
    '#f00': allObj.dip_alg || [], // 红f00
    '#FF1493': allObj.dip_manual || [],  // DeepPink
    '#fff': allObj.dip_megin || [], // 白fff

    '#fd0': allObj.dSPM_alg || [],  // 黄fd0
    '#FFA500': allObj.dSPM_manual || [],  // Orange

    '#0f0': allObj.sLORETA_alg || [], // 绿0f0
    '#3CB371': allObj.sLORETA_manual || [],  // SpringGreen

    '#0cf': allObj.wMNE_alg || [],  // 蓝0cf
    '#0000FF': allObj.wMNE_manual || [], // DoderBlue

    '#f0f': allObj.beamformer_alg || [], // 粉f0f
    '#a0f': allObj.beamformer_manual || [], // 紫a0f
  }

  curSelectedList.value = obj

  emit('getCurSelectedList', obj)

}

// 拿到所有的勾选数据，用于导出溯源定位结果
function getSelectedData() {
  const allSelectedList: number[][] = []

  Object.keys(treeData.value).forEach((key: string) => {
    const value: any = treeData.value[key]

    Object.keys(value.list).forEach((fif: string) => {
      const fifValue: any = value.list[fif]
      fifValue.alg?.forEach((item: any) => {
        if (item.select && item.pos) {
          allSelectedList.push(item.pos)
        }
      })
      fifValue.manual?.forEach((item: any) => {
        if (item.select && item.pos) {
          allSelectedList.push(item.pos)
        }
      })
      fifValue.megin?.forEach((item: any) => {
        if (item.select && item.pos) {
          allSelectedList.push(item.pos)
        }
      })
    })
  })
  return allSelectedList
}



const threshold = ref(null)
const thresholdRef = ref(null)
let enter = false // 按了enter键

// 修改阈值
function blurThreshold() {
  if (enter) {
    enter = false
  } else {
    filterGof()
  }
}

// 在算法检测棘波列表的阈值输入框按下Enter键，会触发它的getData()方法，并会阻止useKeyUp()事件
function pressEnterThreshold() {
  enter = true
  filterGof()
  thresholdRef.value.blur()
}

function filterGof() {
  const thresholdValue = parseFloat(threshold.value) || 0; // 如果为空或无效则视为0

  Object.keys(treeData.value).forEach(key => {
    const value = treeData.value[key];

    Object.keys(value.list).forEach(fif => {
      const fifValue = value.list[fif];


      // 从原始数据过滤
      fifValue.alg = fifValue.algAll.filter((item: any) =>
        thresholdValue === 0 || item?.gof >= thresholdValue
      );

      fifValue.manual = fifValue.manualAll.filter((item: any) =>
        thresholdValue === 0 || item?.gof >= thresholdValue
      );

      fifValue.megin = fifValue.meginAll.filter((item: any) =>
        thresholdValue === 0 || item?.gof >= thresholdValue
      );

      // 不需要重置选择状态，因为原始数据的选择状态已经保留
      // 更新复选框状态
      fifValue.selectAlg = fifValue.alg.length > 0 &&
        fifValue.alg.every((item: any) => item.select);
      fifValue.selectManual = fifValue.manual.length > 0 &&
        fifValue.manual.every((item: any) => item.select);
      fifValue.selectMegin = fifValue.megin.length > 0 &&
        fifValue.megin.every((item: any) => item.select);

    });
  });

  getAllSelectedList()
}


const emit = defineEmits(['getCurData', 'getCurSelectedList'])

// 暴露方法
defineExpose({
  curSelectedList,
  setData,
  getSelectedData,
})

</script>

<style lang="less" scoped>
:deep(.ant-checkbox-wrapper) {
  .ant-checkbox {
    .ant-checkbox-inner {
      border: 1px solid var(--color-t6);
      border-radius: 4px;
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

.list-page>.list-title {
  color: #fff;
  background: var(--color-title-bg-green);
}


.tree-list {
  height: calc(100% - 32px);
  overflow: auto;

  .down-icon {
    color: var(--color-t4);
    font-size: 12px;
  }

  .checkbox-all {
    padding-left: 4px;
    border-radius: 4px;
    color: var(--color-gray);

    &.checkbox-manual {
      margin-left: -8px;
    }
  }

  :deep(.checkbox-all) {
    .ant-checkbox+span {
      padding-inline-start: 4px;
      padding-inline-end: 4px;
    }
  }

  .item {

    >.title {
      height: 40px;
      padding: 0 6px 0 3px;
      font-size: 13px;
      // border-bottom: var(--border);

    }

    .sub-list {

      .sub-item {

        .title {
          height: 30px;
          padding: 0 6px 0 20px;
          // border-bottom: var(--border);

          // 先hover
          &:hover {
            background: var(--hover-bg-blue);

            .more-icon {
              display: block;
            }
          }

          // 再选中
          &.active {
            background: var(--active-bg-blue);
          }

          .more-icon {
            display: none;
          }

          &.cls-title {
            padding-left: 20px;
          }

          &.result-title {
            padding-left: 40px;
            cursor: pointer;
          }

          &.fif-title {
            padding-left: 40px;
          }

          &.alg-title {
            padding-left: 60px;
          }

          &.time-title {
            padding-left: 80px;
            height: 28px;
            font-size: 13px;
            cursor: pointer;
          }

        }
      }


      &.no-cluster-list {
        .alg-title {
          padding-left: 40px !important;
        }

        .time-title {
          padding-left: 60px !important;
        }
      }
    }

  }

}
</style>
