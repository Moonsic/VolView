<template>
  <a-modal :width="800" :zIndex="2001" v-model:open="visible" :confirm-loading="loading" :title="modalTitle"
    :maskClosable="false" :destroyOnClose="true" @ok="modalOk" @cancel="modalCancel">

    <a-form class="form-list flex-end" ref="formRef" :model="form" :rules="rules">
      <a-form-item class="mr32" :label="t('自定义通道或导联集合名称')" name="name">
        <a-input v-model:value="form.name" placeholder="请填写" />
      </a-form-item>
      <a-form-item>
        <a-select class="select-width" v-model:value="comb" :options="props.combList" :placeholder="t('请选择')"
          @change="changeComb" :getPopupContainer="(triggerNode: any) => triggerNode.parentNode" />
      </a-form-item>
    </a-form>



    <div class="search-box">

      <div class="left">
        <div class="flex-between mb4">
          <div class="flex-start mb8">
            {{ t('已选通道/组合') }}：( {{ form.chNames.length }} )
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

        <!-- 自定义通道集合 -->
        <div class="given-box" v-if="customChannelList.length">
          <div class="given-list flex-center flex-wrap mb4">
            <div class="title">{{ t('自定义通道或导联集合') }}：</div>
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
          <div class="result-list">
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

import {
  addCustomChannelApi, // 添加、修改自定义通道集合列表
} from '@/api/meg'

const { t } = useI18n()

const props = defineProps({
  customChannelList: {
    type: Array as PropType<{ listName: string }[]>,
    default: () => [],
  },
  allChannelList: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  combList: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
})

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
    { required: true, message: t('请填写集合名称') },
    {
      validator: (rule: any, value: string, callback: (arg0?: string) => void) => {
        if (modalType.value === 'add') {
          if (customChannelNameList.value.includes(value)) {
            callback(t('已有同名的集合名称'))
          } else {
            callback()
          }
        }
        if (modalType.value === 'edit') {
          if (customChannelNameList.value.filter((item: any) => item !== modalContent.value.listName).includes(value)) {
            callback(t('已有同名的集合名称'))
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
    add: t('添加自定义通道或导联集合'),
    edit: t('修改自定义通道或导联集合'),
  }[modalType.value]
})

// 显示弹窗
function showModal(type: string, record: any) {
  visible.value = true
  modalType.value = type || ''
  modalContent.value = { ...record }
  allResultList.value = JSON.parse(JSON.stringify(props.allChannelList))
  comb.value = 'channel'

  nextTick(() => {
    if (type === 'edit') {
      form.name = record.listName || ''
      form.chNames = record.channelList || []
    }
  })
}


// 下拉单选框
const comb = ref<string>('channel')
// const combList = ref<any>([
//   { label: '脑电通道', value: 'channel' },
// ])
function changeComb(value: string) {
  form.chNames = []
  selectAllResult.value = false
  if (value === 'channel') {
    resultTitle.value = t('全部通道')
    allResultList.value = JSON.parse(JSON.stringify(props.allChannelList))
  } else {
    resultTitle.value = t('全部组合')
    const target = props.combList.find((f: any) => f.value === value)
    allResultList.value = target.combinationList
  }
}

const resultTitle = ref<string>(t('全部通道'))
const allResultList = ref([])  // 搜索结果
const selectAllResult = ref<boolean>(false)     // 全选


// 选择某个通道
function clickChName(item: string) {
  if (form.chNames.includes(item)) {
    form.chNames = form.chNames.filter((f: string) => f !== item)
  } else {
    form.chNames.push(item)
    // 不加nextTick会导致没全选上
    nextTick(() => {
      changeSort()
    })
    showRedText.value = false
  }
  selectAllResult.value = false
}

// 点击全选
function changeSelectAllResult() {
  if (selectAllResult.value) {
    form.chNames = [...new Set([...form.chNames, ...allResultList.value])]
    // 不加nextTick会导致没全选上
    nextTick(() => {
      changeSort()
    })
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
  allResultList.value.forEach(f => {
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
}

const showRedText = ref<boolean>(false) // 没有选择通道的红色提示词

// 确定弹窗
function modalOk() {
  formRef.value.validate().then(async values => {
    if (!form.chNames.length) {
      showRedText.value = true
      return false
    }

    const params: any = {
      userId: JSON.parse(localStorage.getItem('userInfo') || '{}')?.id, // 用户id
      listName: values.name, // 集合名称
      channelList: form.chNames,// 通道集合
      type: 1 // 0表示fif通道集合，1表示fif_eeg通道集合，2表示eeg通道集合
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
  resultTitle.value = t('全部通道')
  allResultList.value = []
  selectAllResult.value = false

}

// 暴露方法
defineExpose({
  showModal
})

</script>

<style lang="less" scoped>

.form-list {
  .ant-form-item {
    margin-bottom: 24px;
  }
}


.select-width {
  min-width: 160px;
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
    height: 350px;
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
      height: 395px;
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