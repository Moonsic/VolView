<template>
  <div class="list-page">
    <div class="list-title flex-between">
      <div class="flex">
        聚类溯源定位结果列表
      </div>
      <IconDown class="down-icon" :style="{ transform: showList ? '' : 'rotate(-90deg)' }" @click="clickMenu" />
    </div>


    <div class="tree-list" v-if="showList">

      <div v-for="(value, key, index) in treeData" :key="index" class="item" :class="`item-${value.locMethodValue}`">
        <div class="bg-gray-line"></div>

        <div class="title flex-between">
          <div class="flex-start text-ellipsis">
            <a-checkbox class="mr2 scale08" v-model:checked="value.select" @change="changeSelect(key)"></a-checkbox>
            <span class="name text-bold">{{ value.locMethodLabel }}</span>
            <a-checkbox class="checkbox-all scale08" v-model:checked="value.selectAllAlg"
              @change="changeAllSelect(key, 'alg')">算法</a-checkbox>
            <a-checkbox class="checkbox-all checkbox-manual scale08" v-model:checked="value.selectAllManual"
              @change="changeAllSelect(key, 'manual')">手动</a-checkbox>
          </div>
          <div @click.stop="clickTitle(key)">
            <IconDown class="down-icon" :style="{ transform: value.showChild ? '' : 'rotate(-90deg)' }" />
          </div>
        </div>


        <div class="sub-list" v-if="value.is_cluster && value.showChild">

          <div v-for="(clsValue, cls) in value.list" :key="cls" class="sub-item">
            <div class="title flex-between cls-title">
              <div class="text-ellipsis">
                <a-checkbox class="mr4 scale08" v-model:checked="clsValue.select"
                  @change="changeSelect(key, cls)"></a-checkbox>
                <IconFolder class="mr4" />
                <span v-if="cls === 'badcase'" class="text-bold" :style="{ color: '#852DFF' }">{{ cls }}</span>
                <span v-else class="text-bold">{{ cls }}</span>
              </div>
              <div @click.stop="clickTitle(key, cls)">
                <IconDown class="down-icon" :style="{ transform: clsValue.showChild ? '' : 'rotate(-90deg)' }" />
              </div>
            </div>

            <div class="sub-list" v-if="clsValue.showChild">
              <div class="title flex-between result-title" :class="{ active: curData.pos === clsValue.sl_result?.pos }" v-if="clsValue.sl_result?.pos"
                @click="clickItem(clsValue.sl_result)">
                <div class="text-ellipsis">
                  <a-checkbox class="mr2 scale08" v-model:checked="clsValue.selectResult" @change="getAllSelectedList"
                    @click.stop></a-checkbox>
                  <span> {{ cls }}</span>
                </div>
                <div class="flex-center">
                  <a-popover placement="right" :title="`${cls}`">
                    <IconMore class="more-icon text-16" />
                    <template #content>
                      <div class="item-popover">
                        <div><span>gof：</span><span>{{ clsValue.sl_result?.gof }}</span></div>
                        <div><span>ori：</span><span>{{ clsValue.sl_result?.ori }}</span></div>
                        <div><span>pos：</span><span>{{ clsValue.sl_result?.pos }}</span></div>
                      </div>
                    </template>
                  </a-popover>
                </div>
              </div>
              <div v-for="(fifValue, fif) in clsValue.spikes" :key="fif" class="sub-item">
                <div class="title flex-between fif-title">
                  <div class="text-ellipsis">
                    <a-checkbox class="mr2 scale08" v-model:checked="fifValue.select"
                      @change="changeSelect(key, cls, fif)"></a-checkbox>
                    <span :title="fif">{{ fif }}</span>
                  </div>
                  <div @click.stop="clickTitle(key, cls, fif)">
                    <IconDown class="down-icon"
                      :style="{ transform: fifValue.showChild ? '' : 'rotate(-90deg)' }" />
                  </div>
                </div>


                <div class="sub-list" v-if="fifValue.showChild">
                  <div class="sub-item">
                    <div class="title flex-between alg-title">
                      <div class="text-ellipsis">
                        <a-checkbox class="mr2 scale08" v-model:checked="fifValue.selectAlg"
                          @change="changeSelect(key, cls, fif, 'alg')"></a-checkbox>
                        <span class="text-12">算法检测棘波列表({{ fifValue.alg.length }})</span>
                      </div>
                      <div v-if="fifValue.alg.length" @click.stop="clickTitle(key, cls, fif, 'alg')">
                        <IconDown class="down-icon"
                          :style="{ transform: fifValue.showAlgChild ? '' : 'rotate(-90deg)' }" />
                      </div>
                    </div>

                    <div class="sub-list" v-if="fifValue.showAlgChild">
                      <div v-for="(item) in fifValue.alg" :key="item" class="sub-item">
                        <div class="title flex-between time-title" :class="{ active: curData.pos === item?.pos }"
                          @click="clickItem(item)">
                          <div class="text-ellipsis">
                            <a-checkbox class="mr2 scale08" v-model:checked="item.select"
                              @change.stop="getAllSelectedList" @click.stop></a-checkbox>
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
                          @change="changeSelect(key, cls, fif, 'manual')"></a-checkbox>
                        <span class="text-12">手动标注列表({{ fifValue.manual.length }})</span>
                      </div>
                      <div v-if="fifValue.manual.length" @click.stop="clickTitle(key, cls, fif, 'manual')">
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
                </div>
              </div>
            </div>
          </div>
        </div>


        <div class="sub-list no-cluster-list" v-if="!value.is_cluster && value.showChild">

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
                    <span class="text-12">算法检测棘波列表({{ fifValue.alg.length }})</span>
                  </div>
                  <div v-if="fifValue.alg.length" @click.stop="clickTitle(key, '', fif, 'alg')">
                    <IconDown class="down-icon"
                      :style="{ transform: fifValue.showAlgChild ? '' : 'rotate(-90deg)' }" />
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
                    <span class="text-12">手动标注列表({{ fifValue.manual.length }})</span>
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
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="bg-gray-line"></div>
  </div>
</template>

<script lang="ts" setup>
import { locMethodList } from '@u/data' // 算法列表
import { getFileSuffix } from '@u/utils'

const emit = defineEmits(['getCurData', 'getCurSelectedList'])

// 暴露方法
defineExpose({
  setData,
})


const showList = ref<boolean>(false)

// 点击标题
function clickMenu() {
  showList.value = !showList.value
}

const treeData = ref<any>({}) // 列表
const curData = ref<any>({})


// 获取数据
async function setData(data: any) {
  // console.log('data :>> ', data)
  const newData = JSON.parse(JSON.stringify(data))
  setTreeData(newData)
}

function setTreeData(newData: any) {
  const { cluster_loc_method = [] } = newData // 要给默认为空数组，否则后面的includes方法报错

  treeData.value = {}

  const tree: any = {}

  // 比起上一个，就多了一个 && cluster_loc_method.includes(key) 代码，把不是cluster_loc_method的不展示

  Object.keys(newData).forEach((key: string) => {
    if (!['is_cluster', 'cluster_loc_method'].includes(key) && cluster_loc_method.includes(key)) {
      tree[key] = { ...newData[key] }
      tree[key]['is_cluster'] = cluster_loc_method.includes(key)
    }
  })

  const valueList = ['is_cluster', 'locMethodLabel', 'locMethodValue', 'list', 'select', 'showChild', 'selectAllAlg', 'selectAllManual', 'selectResult']

  // is_cluster 不同，数据结构也不同

  Object.keys(tree).forEach((key: string) => {
    const value: any = tree[key]

    value.locMethodLabel = locMethodList.find(f => f.value === key)?.label
    value.locMethodValue = key
    value.list = {}
    value.select = false
    value.selectAllAlg = false
    value.selectAllManual = false
    value.showChild = true

    // 有聚类溯源结果，多一层 cls
    if (value.is_cluster) {
      Object.keys(value).forEach((cls: string) => {
        const clsValue: any = value[cls]
        if (!valueList.includes(cls)) {

          clsValue.select = false
          clsValue.selectResult = false
          clsValue.showChild = true

          Object.keys(clsValue.spikes).forEach((fif: string) => {

            const fifValue: any = clsValue.spikes[fif]

            if (!valueList.includes(fif)) {

              fifValue.list = {}
              fifValue.select = false
              fifValue.selectAlg = false
              fifValue.selectManual = false
              fifValue.showChild = true
              fifValue.showAlgChild = false
              fifValue.showManualChild = false

              if (!fifValue.alg) {
                fifValue.alg = []
              }
              if (!fifValue.manual) {
                fifValue.manual = []
              }
              fifValue.alg?.forEach((item: any) => {
                item.select = false
              })
              fifValue.manual?.forEach((item: any) => {
                item.select = false
              })

              const newfif = getFileSuffix(fif, '/')
              clsValue.spikes[newfif] = { ...fifValue }

              delete clsValue.spikes[fif]
            }

          })


          value.list[cls] = { ...clsValue }

          delete tree[key][cls]
        }

      })
    }


    // 无聚类溯源结果，少了一层 cls
    if (!value.is_cluster) {

      Object.keys(value).forEach((fif: string) => {

        const fifValue: any = value[fif]

        if (!valueList.includes(fif)) {

          fifValue.list = {}
          fifValue.select = false
          fifValue.selectAlg = false
          fifValue.selectManual = false
          fifValue.showChild = true
          fifValue.showAlgChild = false
          fifValue.showManualChild = false

          if (!fifValue.alg) {
            fifValue.alg = []
          }
          if (!fifValue.manual) {
            fifValue.manual = []
          }
          fifValue.alg?.forEach((item: any) => {
            item.select = false
          })
          fifValue.manual?.forEach((item: any) => {
            item.select = false
          })

          const newfif = getFileSuffix(fif, '/')
          value.list[newfif] = { ...fifValue }

          delete value[fif]
        }

      })
    }

  })

  treeData.value = { ...tree }


  // console.log('treeData.value :>> ', treeData.value)
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

  if (treeData.value[key].is_cluster) {
    if (algManual) {
      if (algManual === 'alg') {
        treeData.value[key].list[cls].spikes[fif].showAlgChild = !treeData.value[key].list[cls].spikes[fif].showAlgChild
      }
      if (algManual === 'manual') {
        treeData.value[key].list[cls].spikes[fif].showManualChild = !treeData.value[key].list[cls].spikes[fif].showManualChild
      }
    } else if (fif) {
      treeData.value[key].list[cls].spikes[fif].showChild = !treeData.value[key].list[cls].spikes[fif].showChild
    } else if (cls) {
      treeData.value[key].list[cls].showChild = !treeData.value[key].list[cls].showChild
    } else {
      treeData.value[key].showChild = !treeData.value[key].showChild
    }
  }

  if (!treeData.value[key].is_cluster) {
    if (algManual) {
      if (algManual === 'alg') {
        treeData.value[key].list[fif].showAlgChild = !treeData.value[key].list[fif].showAlgChild
      }
      if (algManual === 'manual') {
        treeData.value[key].list[fif].showManualChild = !treeData.value[key].list[fif].showManualChild
      }
    } else if (fif) {
      treeData.value[key].list[fif].showChild = !treeData.value[key].list[fif].showChild
    } else {
      treeData.value[key].showChild = !treeData.value[key].showChild
    }
  }

}

// 勾选
function changeSelect(key: any, cls?: any, fif?: any, algManual?: string) {
  // console.log('changeSelect :>> ', key, cls, fif, algManual)

  if (treeData.value[key].is_cluster) {
    if (algManual) {
      if (algManual === 'alg') {
        const fifValue = treeData.value[key].list[cls].spikes[fif]
        const { selectAlg } = fifValue
        fifValue.alg?.forEach((item: any) => {
          item.select = selectAlg
        })
      }
      if (algManual === 'manual') {
        const fifValue = treeData.value[key].list[cls].spikes[fif]
        const { selectManual } = fifValue
        fifValue.manual?.forEach((item: any) => {
          item.select = selectManual
        })
      }
    } else if (fif) {
      const fifValue = treeData.value[key].list[cls].spikes[fif]
      const { select } = fifValue
      fifValue.selectAlg = select
      fifValue.selectManual = select
      fifValue.alg?.forEach((item: any) => {
        item.select = select
      })
      fifValue.manual?.forEach((item: any) => {
        item.select = select
      })

    } else if (cls) {
      const { select, spikes } = treeData.value[key].list[cls]
      treeData.value[key].list[cls].selectResult = select
      Object.keys(spikes).forEach((fif: string) => {
        const fifValue: any = spikes[fif]
        fifValue.select = select
        fifValue.selectAlg = select
        fifValue.selectManual = select
        fifValue.alg?.forEach((item: any) => {
          item.select = select
        })
        fifValue.manual?.forEach((item: any) => {
          item.select = select
        })
      })

    } else {
      treeData.value[key].selectAllAlg = false
      treeData.value[key].selectAllManual = false
      const { select, list } = treeData.value[key]
      Object.keys(list).forEach((cls: string) => {
        const clsValue: any = list[cls]
        clsValue.select = select
        clsValue.selectResult = select
        Object.keys(clsValue.spikes).forEach((fif: string) => {
          const fifValue: any = clsValue.spikes[fif]
          fifValue.select = select
          fifValue.selectAlg = select
          fifValue.selectManual = select
          fifValue.alg?.forEach((item: any) => {
            item.select = select
          })
          fifValue.manual?.forEach((item: any) => {
            item.select = select
          })
        })
      })
    }

    getAllSelectedList()
  }

  if (!treeData.value[key].is_cluster) {
    if (algManual) {
      if (algManual === 'alg') {
        const fifValue = treeData.value[key].list[fif]
        const { selectAlg } = fifValue
        fifValue.alg?.forEach((item: any) => {
          item.select = selectAlg
        })
      }
      if (algManual === 'manual') {
        const fifValue = treeData.value[key].list[fif]
        const { selectManual } = fifValue
        fifValue.manual?.forEach((item: any) => {
          item.select = selectManual
        })
      }
    } else if (fif) {
      const fifValue = treeData.value[key].list[fif]
      const { select } = fifValue
      fifValue.selectAlg = select
      fifValue.selectManual = select
      fifValue.alg?.forEach((item: any) => {
        item.select = select
      })
      fifValue.manual?.forEach((item: any) => {
        item.select = select
      })
    } else {
      treeData.value[key].selectAllAlg = false
      treeData.value[key].selectAllManual = false
      const { select, list } = treeData.value[key]
      Object.keys(list).forEach((fif: string) => {
        const fifValue: any = list[fif]
        fifValue.select = select
        fifValue.selectAlg = select
        fifValue.selectManual = select
        fifValue.alg?.forEach((item: any) => {
          item.select = select
        })
        fifValue.manual?.forEach((item: any) => {
          item.select = select
        })
      })
    }

    getAllSelectedList()

  }

}

// 勾选所有算法或者所有手动
function changeAllSelect(key: any, algManual: string) {
  // console.log('changeAllSelect :>> ', key, algManual)

  if (treeData.value[key].is_cluster) {
    treeData.value[key].select = false
    if (algManual === 'alg') {
      const { selectAllAlg: select, list } = treeData.value[key]
      treeData.value[key].selectAllManual = false
      Object.keys(list).forEach((cls: string) => {
        const clsValue: any = list[cls]
        clsValue.select = false
        clsValue.selectResult = false
        Object.keys(clsValue.spikes).forEach((fif: string) => {
          const fifValue: any = clsValue.spikes[fif]
          fifValue.select = false
          fifValue.selectAlg = select
          fifValue.selectManual = false
          fifValue.alg?.forEach((item: any) => {
            item.select = select
          })
          fifValue.manual?.forEach((item: any) => {
            item.select = false
          })
        })
      })
    }
    if (algManual === 'manual') {
      const { selectAllManual: select, list } = treeData.value[key]
      treeData.value[key].selectAllAlg = false
      Object.keys(list).forEach((cls: string) => {
        const clsValue: any = list[cls]
        clsValue.select = false
        clsValue.selectResult = false
        Object.keys(clsValue.spikes).forEach((fif: string) => {
          const fifValue: any = clsValue.spikes[fif]
          fifValue.select = false
          fifValue.selectAlg = false
          fifValue.selectManual = select
          fifValue.alg?.forEach((item: any) => {
            item.select = false
          })
          fifValue.manual?.forEach((item: any) => {
            item.select = select
          })
        })
      })
    }

    getAllSelectedList()
  }

  if (!treeData.value[key].is_cluster) {
    treeData.value[key].select = false
    if (algManual === 'alg') {
      const { selectAllAlg: select, list } = treeData.value[key]
      treeData.value[key].selectAllManual = false
      Object.keys(list).forEach((fif: string) => {
        const fifValue: any = list[fif]
        fifValue.select = false
        fifValue.selectAlg = select
        fifValue.selectManual = false
        fifValue.alg?.forEach((item: any) => {
          item.select = select
        })
        fifValue.manual?.forEach((item: any) => {
          item.select = false
        })
      })
    }
    if (algManual === 'manual') {
      const { selectAllManual: select, list } = treeData.value[key]
      treeData.value[key].selectAllAlg = false
      Object.keys(list).forEach((fif: string) => {
        const fifValue: any = list[fif]
        fifValue.select = false
        fifValue.selectAlg = false
        fifValue.selectManual = select
        fifValue.alg?.forEach((item: any) => {
          item.select = false
        })
        fifValue.manual?.forEach((item: any) => {
          item.select = select
        })
      })
    }

    getAllSelectedList()

  }

}

// 改成带有方向箭头的
function getAllSelectedList() {
  return getAllSelectedListWithArrow()
}



function getAllSelectedListWithArrow() {
  const badcaseList: any[] = []
  const allObj: any = {}

  Object.keys(treeData.value).forEach((key: string) => {
    const value: any = treeData.value[key]

    allObj[value.locMethodValue] = []

    if (value.is_cluster) {

      Object.keys(value.list).forEach((cls: string) => {

        const clsValue: any = value.list[cls]

        if (clsValue.selectResult && clsValue.sl_result.pos) {
          if (cls === 'badcase') {
            badcaseList.push(clsValue.sl_result.pos ? [clsValue.sl_result.pos, clsValue.sl_result.ori] : [])
          } else {
            allObj[value.locMethodValue].push(clsValue.sl_result.pos ? [clsValue.sl_result.pos, clsValue.sl_result.ori] : [])
          }
        }

        Object.keys(clsValue.spikes).forEach((fif: string) => {
          const fifValue: any = clsValue.spikes[fif]
          fifValue.alg?.forEach((item: any) => {
            if (item.select && item.pos) {
              if (cls === 'badcase') {
                badcaseList.push(item.pos ? [item.pos, item.ori] : [])
              } else {
                allObj[value.locMethodValue].push(item.pos ? [item.pos, item.ori] : [])
              }
            }
          })
          fifValue.manual?.forEach((item: any) => {
            if (item.select && item.pos) {
              if (cls === 'badcase') {
                badcaseList.push(item.pos ? [item.pos, item.ori] : [])
              } else {
                allObj[value.locMethodValue].push(item.pos ? [item.pos, item.ori] : [])
              }
            }
          })
        })
      })

    }
    if (!value.is_cluster) {

      Object.keys(value.list).forEach((fif: string) => {
        const fifValue: any = value.list[fif]
        fifValue.alg?.forEach((item: any) => {
          if (item.select && item.pos) {
            allObj[value.locMethodValue].push(item.pos ? [item.pos, item.ori] : [])
          }
        })
        fifValue.manual?.forEach((item: any) => {
          if (item.select && item.pos) {
            allObj[value.locMethodValue].push(item.pos ? [item.pos, item.ori] : [])
          }
        })
      })

    }

  })

  const obj = {
    '#f00': allObj.dip || [],
    '#fd0': allObj.dSPM || [],
    '#0f0': allObj.sLORETA || [],
    '#0cf': allObj.wMNE || [],
    '#f0f': allObj.beamformer || [],
    '#fff': badcaseList,
  }

  emit('getCurSelectedList', obj)

}

</script>

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








.list-page {
  position: relative;
  color: #ddd;
  background: #17181B;

  >.list-title {
    color: #ddd;
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

.bg-gray-line {
  background: #222;
}


.tree-list {
  height: calc(100% - 51px);
  overflow-y: scroll;
  overflow-y: overlay;

  .down-icon {
    color: rgba(255, 255, 255, 0.54);
    font-size: 12px;
  }

  .checkbox-all {
    color: #aaa;
    padding-left: 4px;
    border-radius: 4px;

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
      padding: 0 5px 0 3px;
      font-size: 13px;
      border-bottom: 1px solid #222;
      font-size: 13px;

    }



    .sub-list {

      .sub-item {

        .title {
          height: 30px;
          padding: 0 6px 0 20px;
          border-bottom: 1px solid #222;
          font-size: 12px;

          // 先hover
          &:hover {
            background: var(--hover-bg-blue);

            .more-icon,
            .icon-delete {
              display: block;
            }
          }

          // 再选中
          &.active {
            background: var(--active-bg-blue);
          }

          .icon-delete {
            font-size: 12px;
            color: #aaa;
            display: none;
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
