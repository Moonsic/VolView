<template>
  <a-popover placement="bottomRight">
    <!-- :open="true" trigger="click" -->
    <a-button size="small">

      <!-- <span class="inline-block color-t6 ml4">请选择</span>
      <IconDown class="ml4" :style="{ fontSize: '12px', color: 'var(--color-t6)', transform: 'translateY(-1px)' }" /> -->

      <span> {{ chNames[0] }} </span>
      <span class="inline-block color-t6 ml4" v-if="!chNames.length">{{ t('脑电通道') }}</span>
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
              {{ t('已选通道/组合') }}：( {{ chNames.length }} )
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

          <div class="pt8 pb8 flex-end">

            <a-button class="ml8" size="small" @click="openEegCombList">
              <PlusOutlined />
              {{ t('构建导联组合') }}
            </a-button>

            <a-select class="ml8" style="width: 120px;" v-model:value="comb" :options="combList" :placeholder="t('请选择')" @change="changeComb"
              :getPopupContainer="(triggerNode: any) => triggerNode.parentNode" />
            <!-- <a-button class="ml8" size="small" @click="editCustomChannelList">
              <EditOutlined />
            </a-button> -->



            <!-- <a-button class="ml8" size="small" @click="openCustomChannelList">
              <PlusOutlined />
              自定义通道或导联窗口
            </a-button> -->
            <a-button class="ml8" type="primary" size="small" @click="addNewCard">
              <PlusOutlined />
              {{ t('添加窗口') }}
            </a-button>
          </div>


          <!-- 自定义通道集合 -->
          <div class="given-box" v-if="customChannelList.length">
            <div class="given-list flex-center flex-wrap mb4">
              <div class="title">{{ t('自定义通道或导联集合') }}：</div>
              <div v-for="(item, index) in customChannelList" :key="index" class="given-item mb4"
                :class="{ 'given-item-edit': isEditCustomChannelList }" @click="clickCustomChannelList(item)">
                {{ item.listName }}

                <span v-if="isEditCustomChannelList">
                  <EditOutlined class="color-blue text-12 mr4" @click.stop="editCustomChannel(item)" />
                  <IconDelete class="color-blue text-11" @click.stop="deleteCustomChannel(item)" />
                </span>

              </div>

              <div v-if="customChannelList.length" class="given-item edit-button mb4" title="编辑自定义通道或导联集合"
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
            <div class="result-list">
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

  <!-- 导联组合的增改弹窗 -->
  <EegCombModal ref="eegCombModalRef" :customChannelList="customChannelList" :combList="combList" :subjectId="subjectId"
    :fifFilePath="fifFilePath" @success="getEEgLeadCombination" />


  <!-- 自定义通道集合的增改弹窗 -->
  <EegCustomChannelModal ref="customChannelModalRef" :customChannelList="customChannelList" :combList="combList"
    :allChannelList="allChannelList" @success="getCustomChannelList" />


</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { message } from 'ant-design-vue'

import { arraysAreEqual } from '@u/utils'

import EegCombModal from './EegCombModal.vue'
import EegCustomChannelModal from './EegCustomChannelModal.vue'

import {
  getCustomChannelListApi,    // 获取自定义通道集合列表
  deleteCustomChannelApi,     // 删除自定义通道集合列表
  getEegChannelNamesApi,     // 38.  获取脑磁中的脑电通道集合
  getEEgLeadCombinationApi,  // 40.  查询导联组合
} from '@/api/meg'

const { t } = useI18n()

const props = defineProps({
  chNames: {
    type: Array as PropType<string[]>,
    default: [],
  },
  subjectId: {
    type: String,
    default: '',
  },
  fifFilePath: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:chNames', 'addNewCard', 'setEegCustomChannelList', 'setEegCombList', 'stopEnter'])


const chNames = computed({
  get() {
    return props.chNames
  },
  set(newValue) {
    emit('update:chNames', newValue)
  }
})


const allChannelList = ref([])

// 再获取左侧fif后再执行，执行代码在Index.vue里
// 38.  获取脑磁中的脑电通道集合
async function getEegChannelNames() {
  const params = {
    subjectId: props.subjectId,
    fifFilePath: props.fifFilePath,
  }
  const { code, data } = await getEegChannelNamesApi(params)
  if (code === 200) {
    const list: string[] = Object.values(data) || []
    allChannelList.value = JSON.parse(JSON.stringify(list))
    allResultList.value = list || []
  }
}


// 下拉单选框
const comb = ref<string>('channel')
const combList = ref<any>([
  { label: t('脑电通道'), value: 'channel' },
])
function changeComb(value: string) {
  chNames.value = []
  selectAllResult.value = false
  if (value === 'channel') {
    resultTitle.value = t('全部通道')
    allResultList.value = JSON.parse(JSON.stringify(allChannelList.value))
  } else {
    resultTitle.value = t('全部组合')
    const target = combList.value.find((f: any) => f.value === value)
    allResultList.value = target.combination
  }
}

onMounted(() => {
  nextTick(() => {
    getEEgLeadCombination()
    getCustomChannelList() // 打开页面时要获取一下
  })
})

const eegCombList = ref<any>([]) // 只包含组合的列表

// 40.  查询导联组合 下拉单选框
async function getEEgLeadCombination() {
  const { code, data } = await getEEgLeadCombinationApi({})
  if (code === 200) {
    const list: any[] = []

    data?.map((item: any) => {
      list.push({
        label: item.combination_name,
        value: item.id,
        combination: item.combination,
      })
    })

    eegCombList.value = list

    combList.value = [{ label: t('脑电通道'), value: 'channel' }, ...list]

    emit('setEegCombList', list) // 多窗口eeg要用

  }
}


const resultTitle = ref<string>(t('全部通道'))
const allResultList = ref([])  // 搜索结果
const selectAllResult = ref<boolean>(false)     // 全选


// 选择某个通道
function clickChName(item: string) {
  if (chNames.value.includes(item)) {
    chNames.value = chNames.value.filter((f: string) => f !== item)
  } else {
    chNames.value.push(item)
    // 不加nextTick会导致没全选上
    nextTick(() => {
      changeSort()
    })
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
  allResultList.value.forEach(f => {
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



// 构建导联组合弹窗
const eegCombModalRef = ref(null)

// 打开自定义通道集合的弹窗
function openEegCombList() {
  eegCombModalRef.value.showModal('add')
}


// 自定义通道集合的弹窗
const customChannelModalRef = ref(null)
const customChannelList = ref<any[]>([])


// 获取自定义通道集合，onMounted和添加了新的集合时，重新获取
async function getCustomChannelList() {

  // customChannelList.value = [
  //   {id: '11', listName: '自定义1', list: ['MEG0111','MEG0411','MEG0623','MEG0722']},
  //   {id: '22', listName: '自定义2', list: ['MEG0412','MEG0632','MEG0821']},
  //   {id: '33', listName: '自定义3', list: ['MEG0133','MEG0222']},
  //   {id: '44', listName: '自定义4', list: ['MEG0122','MEG0212']},
  // ]

  const params = {
    userId: JSON.parse(localStorage.getItem('userInfo') || '{}')?.id, // 用户id
    type: 1 // 0表示fif通道集合，1表示fif_eeg通道集合，2表示eeg通道集合
  }
  const { code, data } = await getCustomChannelListApi(params)
  if (code === 200) {
    customChannelList.value = data || []
    emit('setEegCustomChannelList', customChannelList.value) // 多窗口eeg要用

  }
}

// 打开自定义通道集合的弹窗
function openCustomChannelList() {
  customChannelModalRef.value.showModal('add')
}

// 点击了自定义通道集合
function clickCustomChannelList(item: any) {
  chNames.value = [...item.channelList]
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

  let listName = '' // 脑区或集合名称

  // 匹配是否是某个导联的全部数组
  const targetComb = eegCombList.value.find((item: any) => {
    return arraysAreEqual(item.combination, chNames.value)
  })
  if (targetComb) {
    listName = targetComb.label
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

  emit('addNewCard', listName, comb.value === 'channel' ? 'eegChannel' : 'eegComb')
}

// 暴露方法
defineExpose({
  deleteAllChNames,
  getEegChannelNames,
})

</script>

<style lang="less" scoped>
.delete-all-icon {
  color: var(--color-t6);

  &:hover {
    color: var(--color-t3);
  }
}


.search-box {
  z-index: 9999;
  min-height: 360px;
  display: flex;

  .left {
    width: 165px;
    margin-right: 16px;
    border-right: 1px dashed var(--color-border);

    .delete-icon {
      font-size: 14px;
      color: var(--color-t6);
      transform: translateY(2px);

      &:hover {
        color: var(--color-primary);
      }
    }
  }

  .right {
    width: 568px;
  }

  .allmode-input-search {
    width: 350px;
  }

  :deep(.input-search) {

    .ant-input-affix-wrapper {
      border-radius: 4px;
      border: var(--border-card);
      background: var(--color-bg);
    }
  }

  .given-list {

    .title {
      font-size: 12px;
      color: var(--color-t5);
    }

    &.quick-select-list {
      .right {
        width: 440px;
      }

      .given-item {
        padding: 1px 1px;
        text-align: center;

        &:nth-child(2n+1) {
          width: 44px;
        }

        &:nth-child(2n) {
          width: 56px;
          margin-right: 6px;
        }

        &:nth-child(8),
        &:nth-child(16) {
          margin-right: 2px;
        }
      }

    }

    .given-item {
      font-size: 12px;
      margin-right: 2px;
      padding: 1px 6px;
      border-radius: 4px;
      color: var(--color-t5);
      cursor: pointer;
      border-radius: 4px;
      background: var(--color-bg-gray);

      &:hover {
        color: var(--color-primary);
        background: var(--color-bg-blue);
      }

      &:active {
        transform: scale(0.95);
      }

      &.edit-button {

        &:hover {
          background: var(--color-bg);
          outline: var(--border-card);
        }
      }

      &.given-item-edit {
        background: var(--color-bg);
        border: var(--border-card);
      }

    }
  }

  .select-list {
    height: 413px;
    margin-right: 16px;
    padding: 4px 0 0 4px;
    overflow-y: auto;
    font-size: 12px;
    color: var(--color-t2);
    border-radius: 4px;
    border: var(--border-card);

    &::-webkit-scrollbar {
      width: 2px;
    }

    &.select-list-higher {
      height: 444px;
    }
  }


  .result-list {
    height: 373px;
    overflow-y: auto;
    font-size: 12px;
    color: var(--color-t2);
    padding: 4px 0 0 4px;
    border-radius: 4px;
    border: var(--border-card);

    &::-webkit-scrollbar {
      width: 2px;
    }
  }


  .item {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 66px;
    margin-right: 4px;
    margin-bottom: 4px;
    cursor: pointer;
    position: relative;
    border-radius: 4px;

    &.active {
      color: var(--color-primary);
      background: var(--color-bg-blue);
    }

    &:hover {
      color: var(--color-primary);
    }
  }
}
</style>
