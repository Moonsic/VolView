<template>
  <a-popover placement="bottomRight">
    <!-- :open="true" -->
    <a-button size="small">
      <span> {{ chNames[0] }} </span>
      <span class="inline-block color-t6 ml4" v-if="!chNames.length">{{ t('脑磁通道') }}</span>
      <span v-if="chNames.length > 1">... ({{ chNames.length }})</span>
      <close-circle-filled class="delete-all-icon ml4" v-if="chNames.length"
        :style="{ fontSize: '12px', transform: 'translateY(-1px)' }" @click="deleteAllChNames" />
      <IconDown class="ml4" v-if="!chNames.length"
        :style="{ fontSize: '12px', color: 'var(--color-t6)', transform: 'translateY(-1px)' }" />
    </a-button>
    <!-- 这个空标签的存在可以让popover的位置不受按钮宽度变化而改变，不能删 -->
    <div></div>

    <template #content>
      <div class="search-box">

        <div class="left">
          <div class="flex-between mb4">
            <div class="flex-start mb8">
              {{ t('已选通道') }}：( {{ chNames.length }} )
              <close-circle-filled class="delete-icon ml8" v-if="chNames.length" :title="t('清空')" @click="deleteAllChNames" />
            </div>

          </div>
          <div class="select-list" :class="{ 'select-list-higher': customChannelList.length }">
            <div v-for="(item, index) in chNames" :key="index" class="item"
              :class="{ active: !!chNames.includes(item) }" @click="clickChName(item)">
              {{ item }}
            </div>
          </div>
        </div>

        <div class="right">

          <div class="pt8 pb8 flex-start">

            <a-input class="input-search" :class="[!isAllMode ? 'widthP100' : 'allmode-input-search']"
              v-model:value="searchChannel" allowClear :placeholder="t('搜索')" @pressEnter="onSearchChannel">
              <template #suffix>
                <IconSearch style="color: var(--color-t5)" @click="onSearchChannel" />
              </template>
            </a-input>

            <a-button class="ml8" v-if="isAllMode" size="small" @click="openCustomChannelList">
              <PlusOutlined />
              {{ t('自定义通道集合') }}
            </a-button>
            <a-button class="ml8" v-if="isAllMode" type="primary" size="small" @click="addNewCard">
              <PlusOutlined />
              {{ t('添加窗口') }}
            </a-button>
          </div>

          <!-- 快捷选中 -->
          <div class="given-box">
            <div class="given-list quick-select-list flex-center mb4">
              <div class="title">{{ t('快捷选中') }}：</div>
              <div class="flex-start flex-wrap right">
                <div v-for="(item, index) in givenSelectList" :key="index" class="given-item mb4"
                  @click="clickGivenList(item)">
                  {{ item.label }}
                </div>
              </div>
            </div>
          </div>

          <!-- 快捷搜索 -->
          <!-- <div class="given-box">
            <div class="given-list flex-center mb4">
              <div class="title">快捷搜索：</div>
              <div v-for="(item, index) in givenList" :key="index" class="given-item" @click="clickGivenList(item)">
                {{ item.label }}
              </div>
            </div>
          </div> -->

          <!-- 自定义通道集合 -->
          <div class="given-box" v-if="customChannelList.length">
            <div class="given-list flex-center flex-wrap mb4">
              <div class="title">{{ t('自定义通道集合') }}：</div>
              <div v-for="(item, index) in customChannelList" :key="index" class="given-item mb4"
                :class="{ 'given-item-edit': isEditCustomChannelList }" @click="clickCustomChannelList(item)">
                {{ item.listName }}

                <span v-if="isEditCustomChannelList">
                  <EditOutlined class="color-blue text-12 mr4" @click.stop="editCustomChannel(item)" />
                  <IconDelete class="color-blue text-11" @click.stop="deleteCustomChannel(item)" />
                </span>

              </div>

              <div v-if="customChannelList.length" class="given-item edit-button mb4" title="编辑自定义通道集合"
                @click="editCustomChannelList">
                <EditOutlined class="mr4" :style="{ fontSize: '12px' }" />
                <span v-if="isEditCustomChannelList">{{ t('取消编辑') }}</span>
                <span v-else>{{ t('编辑') }}</span>
              </div>
            </div>
          </div>


          <!-- 结果框 -->
          <div class="result-box">
            <div class="flex-between mb4">
              <span class="mr4"> {{ resultTitle }} ： </span>
              <a-checkbox v-model:checked="selectAllResult" @change="changeSelectAllResult">{{ t('全选') }}</a-checkbox>
            </div>
            <div class="result-list" :style="{ height: props.megType === 'megin' ? '373px' : '420px' }">
              <div v-for="(item, index) in allResultList" :key="index" class="item"
                :class="{ active: !!chNames.includes(item) }" @click="clickChName(item)">
                {{ item }}
              </div>
            </div>
          </div>

        </div>
      </div>
    </template>
  </a-popover>
  <!-- 自定义通道集合的增改弹窗 -->
  <CustomChannelModal ref="customChannelModalRef" :customChannelList="customChannelList" :megType="props.megType"
    :customChannelNameList="customChannelList.map(item => item.listName)" @success="getCustomChannelList" />

</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { message } from 'ant-design-vue'
import { arraysAreEqual } from '@u/utils'

import CustomChannelModal from './CustomChannelModal.vue'

import {
  getCustomChannelListApi,    // 获取自定义通道集合列表
  deleteCustomChannelApi,     // 删除自定义通道集合列表
} from '@/api/meg'


import { useOpmStore } from '@/store/opm'
const opmStore = useOpmStore()

const { t } = useI18n()

const props = defineProps({
  chNames: {
    type: Array as PropType<string[]>,
    default: [],
  },
  isAllMode: {
    type: Boolean,
    default: false,
  },
  megType: {
    type: String,
    default: 'megin',
  },
})

const allChannelList = computed(() => opmStore.allChannelList)
const allChannelListByName = computed(() => opmStore.allChannelListByName16)

let givenListValue = '***'
let givenListValueLength = 4

// opm64 gfp可以有，另外两个没有
watch(() => [props.isAllMode, props.megType], () => {
  nextTick(() => {

    if (props.megType === 'megin') {
      givenListValue = '***'
      givenListValueLength = 4
    } else {
      givenListValue = '**'
      givenListValueLength = 3
    }

    if (props.isAllMode) {
      if (props.megType === 'megin') {
        // 快捷搜索
        givenList.value = [
          { label: t('以1结尾'), value: givenListValue + '1', type: 'search' },
          { label: t('以2结尾'), value: givenListValue + '2', type: 'search' },
          { label: t('以3结尾'), value: givenListValue + '3', type: 'search' },
          { label: 'EOG/ECG', value: 'EOG/ECG', type: 'search' },
          { label: 'GFP', value: 'GFP', type: 'search' },
        ]
        newAllChannelList = [...allChannelList.value, 'EOG', 'ECG', 'GFP']
      } else {
        // 快捷搜索
        givenList.value = [
          { label: t('以1结尾'), value: givenListValue + '1', type: 'search' },
          { label: t('以2结尾'), value: givenListValue + '2', type: 'search' },
          { label: t('以3结尾'), value: givenListValue + '3', type: 'search' },
          { label: 'GFP', value: 'GFP', type: 'search' },
        ]
        newAllChannelList = [...allChannelList.value, 'GFP']
      }
      allResultList.value = [...newAllChannelList] // 搜索结果
    } else {
      newAllChannelList = [...allChannelList.value]
      allResultList.value = [...newAllChannelList] // 搜索结果
      // 快捷搜索
      givenList.value = [
        { label: t('以1结尾'), value: givenListValue + '1', type: 'search' },
        { label: t('以2结尾'), value: givenListValue + '2', type: 'search' },
        { label: t('以3结尾'), value: givenListValue + '3', type: 'search' },
      ]
    }
  })
}, { immediate: true })


const emit = defineEmits(['update:chNames', 'addNewCard', 'stopEnter', 'setCustomChannelList'])


const chNames = computed({
  get() {
    return props.chNames
  },
  set(newValue) {
    emit('update:chNames', newValue)
  }
})


let newAllChannelList = [...allChannelList.value]    // 2个模式下数据不一样。所以单独搞一个变量

const searchChannel = ref<string>('')           // 搜索内容
const resultTitle = ref<string>(t('全部通道'))
const allResultList = ref([...newAllChannelList])  // 搜索结果
const selectAllResult = ref<boolean>(false)     // 全选

// 快捷搜索
const givenList = ref([
  { label: t('以1结尾'), value: '***1', type: 'search' },
  { label: t('以2结尾'), value: '***2', type: 'search' },
  { label: t('以3结尾'), value: '***3', type: 'search' },
])

// 快捷选中
const givenSelectList = computed(() => {
  return Object.keys(allChannelListByName.value).map(item => {
    return {
      label: item,
      value: '',
      type: 'select',
    }
  })
})


// 点击快捷搜索和快捷选中
function clickGivenList(item: any) {
  if (item.type == 'select') {
    chNames.value = [...allChannelListByName.value[item.label]] // 这里必须要加[...]，否则再点击快捷选中中的脑区，会去随便点击的几个也加上去
  }
  searchChannel.value = item.value
  onSearchChannel()
}

// 点击搜索或按下回车键时的回调，会触发方法，并会阻止useKeyUp()事件
function onSearchChannel() {

  emit('stopEnter')

  allResultList.value = []
  selectAllResult.value = false
  // 如果有搜索内容
  if (searchChannel.value) {
    resultTitle.value = t('搜索结果')

    // 单独的一种情况，只在多窗口模式下，搜索EOG/ECG/GFP
    if (searchChannel.value === 'EOG/ECG' && props.isAllMode) {
      allResultList.value.push('EOG', 'ECG')
      return
    }
    if (searchChannel.value === 'GFP' && props.isAllMode) {
      allResultList.value.push('GFP')
      return
    }

    // 把搜索内容根据分号分割成数组，复杂的情况：*1*3;1*0*;Meg1；222
    const searchList = searchChannel.value.split(/[;；]/g).filter(m => m)
    searchList.forEach((m, i) => {
      searchList[i] = m.toUpperCase() // 转大写
    })
    newAllChannelList.map((item: string) => {
      searchList.forEach((f: string) => {
        // 如果有*号，*1*3
        if (f.includes('*') && f.length === givenListValueLength) {
          let flag = true
          f.split('').forEach((m: string, index: number) => {
            if (m !== '*') {
              if (item[index + 3] !== m) { // 去掉MEG,所以index+3, 3是'MEG'的长度
                flag = false
              }
            }
          })
          if (flag) {
            allResultList.value.push(item)
          }
        } else {
          // 如果没有*号
          if (item.includes(f)) {
            allResultList.value.push(item)
          }
        }
      })
    })
  } else {
    // 点击清空
    resultTitle.value = t('全部通道')
    selectAllResult.value = false
    allResultList.value = [...newAllChannelList]
  }
}

// 选择某个通道
function clickChName(item: string) {
  if (chNames.value.includes(item)) {
    chNames.value = chNames.value.filter((f: string) => f !== item)
  } else {
    chNames.value.push(item)
    changeSort()
  }
  selectAllResult.value = false
}

// 点击全选
function changeSelectAllResult() {
  if (selectAllResult.value) {
    chNames.value = [...new Set([...chNames.value, ...allResultList.value])]
    // 不加nextTick会导致没全选上
    nextTick(() => {
      changeSort()
    })
  } else {
    const list: string[] = []
    chNames.value.forEach((item: string) => {
      if (!allResultList.value.includes(item)) {
        list.push(item)
      }
    })
    chNames.value = list
  }

}

// 让顺序符合allChannelList的顺序
function changeSort() {
  const list: string[] = []
  newAllChannelList.forEach(f => {
    if (chNames.value.includes(f)) {
      list.push(f)
    }
  })
  chNames.value = [...list]
}

// 删除所有通道
function deleteAllChNames() {
  chNames.value = []
  selectAllResult.value = false
}


// 自定义通道集合的弹窗
const customChannelModalRef = ref(null)
const customChannelList = ref<any[]>([])

onMounted(() => {
  getCustomChannelList() // 打开页面时要获取一下
})

// 获取自定义通道集合，onMounted和添加了新的集合时，重新获取
async function getCustomChannelList() {

  // customChannelList.value = [
  //   {id: '11', name: '自定义1', list: ['MEG0111','MEG0411','MEG0623','MEG0722']},
  //   {id: '22', name: '自定义2', list: ['MEG0412','MEG0632','MEG0821']},
  //   {id: '33', name: '自定义3', list: ['MEG0133','MEG0222']},
  //   {id: '44', name: '自定义4', list: ['MEG0122','MEG0212']},
  // ]

  const params = {
    userId: JSON.parse(localStorage.getItem('userInfo') || '{}')?.id, // 用户id
    type: 0
  }
  const { code, data } = await getCustomChannelListApi(params)
  if (code === 200) {
    customChannelList.value = data || []
    emit('setCustomChannelList', customChannelList.value) // 多窗口要用
  }
}

// 打开自定义通道集合的弹窗
function openCustomChannelList() {
  customChannelModalRef.value.showModal('add')
}


// 点击了自定义通道集合
function clickCustomChannelList(item: any) {
  chNames.value = [...item.channelList]
  searchChannel.value = ''
  onSearchChannel()
}


const isEditCustomChannelList = ref(false)

function editCustomChannelList() {
  isEditCustomChannelList.value = !isEditCustomChannelList.value
}

function editCustomChannel(item: any) {
  customChannelModalRef.value.showModal('edit', item)
}
async function deleteCustomChannel(item: any) {
  const params = {
    id: item.id,
  }
  const { code, msg } = await deleteCustomChannelApi(params)
  if (code === 200) {
    message.success(msg)
    getCustomChannelList()
  }
}


// 多窗口模式下添加窗口
async function addNewCard() {


  // 最新：可以只有GFP
  // // 有GFP，必须要有MEG
  // const hasGFP = form.chNames.includes('GFP')
  // const hasMEGChannel = form.chNames.some((channel: string) => channel.startsWith('MEG'))
  // if (hasGFP && !hasMEGChannel) {
  //   return message.error('必须至少选择一个MEG数据通道计算GFP')
  // }

  let listName = '' // 脑区或集合名称

  // 新的写法，找到匹配项后停止循环
  // 脑区，第一种方法用 for of，更灵活
  // for (const [key, value] of Object.entries(allChannelListByName)) {
  //   if (arraysAreEqual(value, form.chNames)) {
  //     listName = key
  //     break
  //   }
  // }

  // 脑区，第二种方法用 find，更简洁
  const target = Object.entries(allChannelListByName.value).find(([key, value]) => {
    return arraysAreEqual(value, chNames.value)
  })
  // console.log('entry',entry)
  if (target) {
    listName = target[0]
  }

  // 如果没有，再试试自定义脑区集合，用 find
  if (!listName) {
    const targetCustom = customChannelList.value.find(item => {
      return arraysAreEqual(item.channelList, chNames.value)
    })
    if (targetCustom) {
      listName = targetCustom.listName
    }
  }

  emit('addNewCard', listName, 'meg')
}

// 暴露方法
defineExpose({
  deleteAllChNames,
})

</script>

<style lang="less" scoped>
@import '../style/index.less';
</style>
