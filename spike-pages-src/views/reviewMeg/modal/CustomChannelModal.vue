<template>
  <a-modal :width="800" :zIndex="2000" v-model:open="visible" :confirm-loading="loading" :title="modalTitle"
    :maskClosable="false" :destroyOnClose="true" @ok="modalOk" @cancel="modalCancel">

    <a-form ref="formRef" :model="form" :rules="rules" :labelCol="{ span: 8 }" :wrapperCol="{ span: 11 }">
      <a-form-item class="mb16" :label="t('通道集合名称')" name="name">
        <a-input v-model:value="form.name" :placeholder="t('请填写')" />
      </a-form-item>
    </a-form>


    <div class="search-box">

      <div class="left">
        <div class="flex-between mb4">
          <div class="flex-start mb8">
            {{ t('已选通道') }}：( {{ form.chNames.length }} )
            <close-circle-filled class="delete-icon ml8" v-if="form.chNames.length" :title="t('清空')"
              @click="deleteAllChNames" />
          </div>
        </div>
        <div class="select-list" :class="{ 'select-list-higher': customChannelList.length }">
          <div v-for="(item, index) in form.chNames" :key="index" class="item"
            :class="{ active: !!form.chNames.includes(item) }" @click="clickChName(item)">
            {{ item }}
          </div>
          <div v-if="showRedText" class="red-text color-red">{{ t('请选择通道') }}</div>
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

        <!-- 自定义通道集合 -->
        <div class="given-box" v-if="customChannelList.length">
          <div class="given-list flex-center flex-wrap mb4">
            <div class="title">{{ t('自定义通道集合') }}：</div>
            <div v-for="(item, index) in props.customChannelList" :key="index" class="given-item mb4"
              @click="clickCustomChannelList(item)">
              {{ item.listName }}
            </div>
          </div>
        </div>


        <!-- 结果框 -->
        <div class="result-box">
          <div class="flex-between mb4">
            <span class="mr4"> {{ resultTitle }} ： </span>
            <a-checkbox v-model:checked="selectAllResult" @change="changeSelectAllResult">{{ t('全选') }}</a-checkbox>
          </div>
          <div class="result-list" :style="{ height: props.megType === 'megin' ? '373px' : '394px' }">
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
import { PropType } from 'vue'
import { message, type FormInstance } from 'ant-design-vue'

import { useOpmStore } from '@/store/opm'
const opmStore = useOpmStore()

import {
  addCustomChannelApi, // 添加、修改自定义通道集合列表
} from '@/api/meg'

const { t } = useI18n()

const props = defineProps({
  customChannelList: {
    type: Array as PropType<{ listName: string }[]>,
    default: () => [],
  },
  megType: {
    type: String,
    default: 'megin',
  },
})

// 两种方法都可以，但computed更简洁
// const customChannelNameList = ref<string[]>([])
// watch(() => props.customChannelList, () => {
//   customChannelNameList.value = props.customChannelList.map(item=>item.listName)
// },{immediate:true})

// 名称的集合
const customChannelNameList = computed(() => {
  return props.customChannelList.map(item => item.listName)
})

const emit = defineEmits(['success'])

const formRef = ref<FormInstance>()

const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const modalType = ref<string>('')

interface IModalContent {
  [key: string]: any
}

const modalContent = ref<IModalContent>({})

// 数据
interface IForm {
  name: number
  chNames: string[]
}

const form = reactive<IForm>({
  name: null, // 通道集合名称
  chNames: [] // 通道集合
})

const rules = {
  name: [
    { required: true, message: t('请填写通道集合名称') },
    {
      validator: (rule: any, value: string, callback: (arg0?: string) => void) => {
        if (modalType.value === 'add') {
          if (customChannelNameList.value.includes(value)) {
            callback(t('已有同名的通道集合名称'))
          } else {
            callback()
          }
        }
        if (modalType.value === 'edit') {
          if (customChannelNameList.value.filter((item: any) => item !== modalContent.value.listName).includes(value)) {
            callback(t('已有同名的通道集合名称'))
          } else {
            callback()
          }
        }
      },
    }
  ],
}


// 弹窗标题
const modalTitle = computed(() => {
  return {
    add: t('添加自定义通道集合'),
    edit: t('修改自定义通道集合'),
  }[modalType.value]
})

// 显示弹窗
function showModal(type: string, record: any) {
  visible.value = true
  modalType.value = type || ''
  modalContent.value = { ...record }
  nextTick(() => {
    if (type === 'edit') {
      form.name = record.listName || ''
      form.chNames = record.channelList || []
    }
  })
}

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
        { label: 'EOG/ECG', value: 'EOG/ECG', type: 'search' },
        { label: 'GFP', value: 'GFP', type: 'search' },
      ]
      newAllChannelList = [...allChannelList.value, 'EOG', 'ECG', 'GFP']

    } else {
      givenListValue = '**'
      givenListValueLength = 3

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


  })
}, { immediate: true })


let newAllChannelList = [...allChannelList.value, 'EOG', 'ECG', 'GFP']    // 2个模式下数据不一样。所以单独搞一个变量

const searchChannel = ref<string>('')       // 搜索内容
const resultTitle = ref<string>(t('全部通道'))
const allResultList = ref([...newAllChannelList])  // 搜索结果
const selectAllResult = ref<boolean>(false)     // 全选

// 快捷搜索
const givenList = ref([
  { label: t('以1结尾'), value: givenListValue + '1', type: 'search' },
  { label: t('以2结尾'), value: givenListValue + '2', type: 'search' },
  { label: t('以3结尾'), value: givenListValue + '3', type: 'search' },
  { label: 'EOG/ECG', value: 'EOG/ECG', type: 'search' },
  { label: 'GFP', value: 'GFP', type: 'search' },
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

    // 单独的一种情况，只在多窗口模式下，搜索EOG/ECG/GFP
    if (searchChannel.value === 'EOG/ECG') {
      allResultList.value.push('EOG', 'ECG')
      return
    }
    if (searchChannel.value === 'GFP') {
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
    showRedText.value = false
  }
  selectAllResult.value = false
}

// 点击全选
function changeSelectAllResult() {
  if (selectAllResult.value) {
    form.chNames = [...new Set([...form.chNames, ...allResultList.value])]
    changeSort()
    // 如果点击了全选，让form.chNames有值，就把红色提示去掉
    if (form.chNames.length) {
      showRedText.value = false
    }
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

// 点击了自定义通道集合
function clickCustomChannelList(item: any) {
  form.chNames = [...item.channelList]
  searchChannel.value = ''
  onSearchChannel()
}

const showRedText = ref<boolean>(false) // 没有选择通道的红色提示词

// 确定弹窗
function modalOk() {
  formRef.value.validate().then(async values => {
    if (!form.chNames.length) {
      showRedText.value = true
      return false
    }

    // 最新：可以只有GFP
    // // 有GFP，必须要有MEG
    // const hasGFP = form.chNames.includes('GFP')
    // const hasMEGChannel = form.chNames.some((channel: string) => channel.startsWith('MEG'))
    // if (hasGFP && !hasMEGChannel) {
    //   return message.error('必须至少选择一个MEG数据通道计算GFP')
    // }

    const params: any = {
      userId: JSON.parse(localStorage.getItem('userInfo') || '{}')?.id, // 用户id
      listName: values.name, // 集合名称
      channelList: form.chNames,// 通道集合
      // brainArea   : string,   // 脑区(非必传)
    }
    if (modalType.value === 'edit') {
      params.id = modalContent.value.id
    }
    loading.value = true
    const { code, msg } = await addCustomChannelApi(params)
    loading.value = false
    if (code === 200) {
      message.success(msg)
      // message.success(modalType.value === 'edit' ? '编辑成功' : '新增成功')
      emit('success')
      modalCancel()
    }
  })
}

// 取消弹窗
function modalCancel() {
  visible.value = false
  loading.value = false
  formRef.value.resetFields()
  form.chNames = []
  searchChannel.value = ''
  resultTitle.value = t('全部通道')
  allResultList.value = [...newAllChannelList]
  selectAllResult.value = false
}

// 暴露方法
defineExpose({
  showModal
})

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