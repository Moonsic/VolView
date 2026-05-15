<template>

  <a-button class="widthP100 flex-center long-text-button" type="default" size="small" @click="showModal()">

    <span class="anticon">
      <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 20 20" fill="none">
        <path
          d="M12.0028 7.99662L15.666 4.33341M4.33268 15.6667L7.99588 12.0036M12.0028 12.0035L15.666 15.6667M4.33268 4.33341L7.99588 7.99661M7.16602 2.91675H12.8327C15.1799 2.91675 17.0827 4.81954 17.0827 7.16675V12.8334C17.0827 15.1806 15.1799 17.0834 12.8327 17.0834H7.16602C4.81881 17.0834 2.91602 15.1806 2.91602 12.8334V7.16675C2.91602 4.81954 4.81881 2.91675 7.16602 2.91675ZM12.8327 10.0001C12.8327 11.5649 11.5642 12.8334 9.99935 12.8334C8.43454 12.8334 7.16602 11.5649 7.16602 10.0001C7.16602 8.43527 8.43454 7.16675 9.99935 7.16675C11.5642 7.16675 12.8327 8.43527 12.8327 10.0001Z"
          stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
      </svg>
    </span>

    {{ t('坏通道管理') }}
  </a-button>

  <a-modal :width="800" v-model:open="visible" :confirm-loading="loading" :title="t('坏通道管理')" :maskClosable="false"
    :destroyOnClose="true" :ok-text="t('保存')" @ok="modalOk" @cancel="modalCancel">
    <div class="search-box">

      <div class="left">
        <div class="flex-between mb4">
          <div class="flex-start mb8">
            {{ t('已选通道') }}：( {{ form.chNames.length }} )
            <close-circle-filled class="delete-icon ml8" v-if="form.chNames.length" :title="t('清空')"
              @click="deleteAllChNames" />
          </div>
        </div>
        <div class="select-list">
          <div v-for="(item, index) in form.chNames" :key="index" class="item"
            :class="{ active: !!form.chNames.includes(item) }" @click="clickChName(item)">
            {{ item }}
          </div>
        </div>
      </div>

      <div class="right">

        <div class="pt8 pb8 flex-start">

          <a-input class="input-search widthP100" v-model:value="searchChannel" allowClear :placeholder="t('搜索')"
            @pressEnter="onSearchChannel">
            <template #suffix>
              <IconSearch style="color: var(--color-t5)" @click="onSearchChannel" />
            </template>
          </a-input>

        </div>

        <!-- 快捷选中 -->
        <div class="given-box">
          <div class="given-list flex-center mb4">
            <div class="title">{{ t('快捷选中') }}：</div>
            <div v-for="(item, index) in givenSelectList" :key="index" class="given-item" @click="clickGivenList(item)">
              {{ item.label }}
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

        <!-- 结果框 -->
        <div class="result-box">
          <div class="flex-between mb4">
            <span class="mr4"> {{ resultTitle }} ： </span>
            <a-checkbox v-model:checked="selectAllResult" @change="changeSelectAllResult">{{ t('全选') }}</a-checkbox>
          </div>
          <div class="result-list" :style="{ height: props.megType === 'megin' ? '373px' : '398px' }">
            <div v-for="(item, index) in allResultList" :key="index" class="item"
              :class="{ active: !!form.chNames.includes(item) }" @click="clickChName(item)">
              {{ item }}
            </div>
          </div>
        </div>

      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'

import { useOpmStore } from '@/store/opm'
const opmStore = useOpmStore()

import {
  getBadChannelApi,
  addBadChannelApi,
  deleteBadChannelApi
} from '@/api/meg'

const { t } = useI18n()

const props = defineProps({
  filePath: {
    type: String,
    default: '',
  },
  subjectId: {
    type: String,
    default: '',
  },
  megType: {
    type: String,
    default: 'megin',
  },
})


const allChannelListByName = computed(() => opmStore.allChannelListByName)
const allChannelList = computed(() => opmStore.allChannelList)

let givenListValue = '***'
let givenListValueLength = 4

watch(() => props.megType, () => {
  nextTick(() => {
    if (props.megType === 'megin') {
      givenListValue = '***'
      givenListValueLength = 4
      // 快捷搜索
      givenList.value = [
        { label: t('以1结尾'), value: givenListValue + '1', type: 'search' },
        { label: t('以2结尾'), value: givenListValue + '2', type: 'search' },
        { label: t('以3结尾'), value: givenListValue + '3', type: 'search' },
      ]
    } else {
      givenListValue = '**'
      givenListValueLength = 3
      // 快捷搜索
      givenList.value = [
        { label: t('以1结尾'), value: givenListValue + '1', type: 'search' },
        { label: t('以2结尾'), value: givenListValue + '2', type: 'search' },
        { label: t('以3结尾'), value: givenListValue + '3', type: 'search' },
      ]
    }
    newAllChannelList = [...allChannelList.value]
    allResultList.value = [...newAllChannelList] // 搜索结果

  })
}, { immediate: true })


const emit = defineEmits(['success'])

const visible = ref<boolean>(false)
const loading = ref<boolean>(false)

// 数据
interface IForm {
  chNames: string[]
}

const form = reactive<IForm>({
  chNames: [] // 坏通道
})

// 显示弹窗
function showModal() {
  visible.value = true
  getBadChannel()
}

let lastBadChannelList: string[] = []

// 获取
async function getBadChannel() {
  const params = {
    fifFilePath: props.filePath, // 文件路径
    subjectId: props.subjectId,
  }
  const { code, data } = await getBadChannelApi(params)
  if (code === 200) {
    lastBadChannelList = JSON.parse(JSON.stringify(data || []))
    form.chNames = data || []
  }
}

let newAllChannelList = [...allChannelList.value]    // 坏通道里没有'EOG', 'ECG', 'GFP'

const searchChannel = ref<string>('')       // 搜索内容
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

// 点击预设通道
function clickGivenList(item: any) {
  if (item.type == 'select') {
    form.chNames = [...allChannelListByName.value[item.label]] // 这里必须要加[...]，否则再点击快捷选中中的脑区，会去随便点击的几个也加上去
  }
  searchChannel.value = item.value
  onSearchChannel()
}

// 点击搜索或按下回车键时的回调，会触发方法，并会阻止useKeyUp()事件
function onSearchChannel() {

  allResultList.value = []
  selectAllResult.value = false
  // 如果有搜索内容
  if (searchChannel.value) {
    resultTitle.value = t('搜索结果')

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
              if (item[index + 3] !== m) { // 去掉MEG,所以index+3
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
  if (form.chNames.includes(item)) {
    form.chNames = form.chNames.filter((f: string) => f !== item)
  } else {
    form.chNames.push(item)
    changeSort()
  }
  selectAllResult.value = false
}

// 点击全选
function changeSelectAllResult() {
  if (selectAllResult.value) {
    form.chNames = [...new Set([...form.chNames, ...allResultList.value])]
    changeSort()
  } else {
    const list: string[] = []
    form.chNames.forEach((item: string) => {
      if (!allResultList.value.includes(item)) {
        list.push(item)
      }
    })
    form.chNames = list
  }
}

// 让顺序符合allChannelList的顺序
function changeSort() {
  const list: string[] = []
  newAllChannelList.forEach(f => {
    if (form.chNames.includes(f)) {
      list.push(f)
    }
  })
  form.chNames = list
}

// 删除所有通道
function deleteAllChNames() {
  form.chNames = []
  selectAllResult.value = false
}

// 确定弹窗
async function modalOk() {

  // 新增的坏通道列表
  const newBadChannelList = form.chNames.filter(item => !lastBadChannelList.includes(item))
  // 要删除的坏通道列表
  const deleteBadChannelList = lastBadChannelList.filter(item => !form.chNames.includes(item))

  if (!newBadChannelList.length && !deleteBadChannelList.length) {
    return message.info(t('未做任何修改'))
  }

  loading.value = true

  if (deleteBadChannelList.length) {
    await turnToGoodChannel(deleteBadChannelList)
  }
  if (newBadChannelList.length) {
    await turnToBadChannel(newBadChannelList)
  }
  loading.value = false

  message.success(t('保存成功'))
  emit('success')
  modalCancel()
}

// 变成坏通道
async function turnToBadChannel(chNameList: string[]) {
  const params = {
    fifFilePath: props.filePath, // 文件路径
    subjectId: props.subjectId,
    channelNames: chNameList
  }
  const { code, msg } = await addBadChannelApi(params)
  if (code === 200) {
  }
}

// 变成好通道（删除坏通道标记）
async function turnToGoodChannel(chNameList: string[]) {
  const params = {
    fifFilePath: props.filePath, // 文件路径
    subjectId: props.subjectId,
    channelNames: chNameList
  }
  const { code, msg } = await deleteBadChannelApi(params)
  if (code === 200) {
  }
}


// 取消弹窗
function modalCancel() {
  visible.value = false
  loading.value = false
  form.chNames = []
  searchChannel.value = ''
  resultTitle.value = t('全部通道')
  allResultList.value = [...newAllChannelList]
  selectAllResult.value = false
}
</script>

<style lang="less" scoped>
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
    height: 463px;
    margin-right: 16px;
    padding: 4px 0 0 4px;
    overflow-y: auto;
    font-size: 12px;
    color: var(--color-t2);
    border-radius: 4px;
    border: var(--border-card);
    position: relative;

    &::-webkit-scrollbar {
      width: 2px;
    }

    &.select-list-higher {
      height: 488px;
    }

    .red-text {
      position: absolute;
      top: 5px;
      left: 5px;
      z-index: 9;
      font-size: 14px;
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