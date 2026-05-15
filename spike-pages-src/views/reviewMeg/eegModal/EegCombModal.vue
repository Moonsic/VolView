<template>
  <a-modal :width="738" :zIndex="2001" v-model:open="visible" :confirm-loading="loading" :title="modalTitle"
    :maskClosable="false" :destroyOnClose="true" :okText="okText" @ok="modalOk" @cancel="modalCancel">

    <a-form class="flex-end" ref="formRef" :model="form" :rules="rules">
      <a-form-item class="mr16" :label="t('导联组合名称')" name="name">
        <a-input v-model:value="form.name" :placeholder="t('请填写')" />
      </a-form-item>
      <a-form-item>
        <div class="flex-center">

          <a-select class="select-width mr8" v-model:value="comb"
            :options="props.combList.filter(item => item.value !== 'channel')" allowClear :placeholder="t('请选择')"
            @change="changeComb" :getPopupContainer="(triggerNode: any) => triggerNode.parentNode" />
          <a-button class="mr8 button-width" v-if="modalType === 'add'" size="small" :title="t('修改导联组合')"
            :disabled="comb == null" @click="editComb">
            <EditOutlined />
          </a-button>
          <a-button v-if="modalType === 'edit'" size="small" @click="cancelEditComb">
            {{ t('取消修改') }}
          </a-button>
          <a-button class="button-width" v-if="modalType === 'add' && comb == null" size="small" :title="t('删除导联组合')"
            :disabled="comb == null">
            <IconDelete />
          </a-button>
          <a-popconfirm :title="`${t('确认删除')}【${props.combList?.find(item => item.value === comb)?.label}】？`" :zIndex="2002"
            placement="right" :ok-text="t('确定')" :cancel-text="t('取消')" @confirm="deleteComb">
            <a-button class="button-width" v-if="modalType === 'add' && comb != null" size="small" :title="t('删除导联组合')"
              :disabled="comb == null">
              <IconDelete />
            </a-button>
          </a-popconfirm>
        </div>

      </a-form-item>
    </a-form>


    <div class="search-box">

      <div class="left">
        <div class="flex-between mb4">
          <div class="flex-start">
            {{ t('已选组合') }}：( {{ form.chNames.length }} )
            <close-circle-filled class="delete-icon ml8" v-if="form.chNames.length" :title="t('清空')"
              @click="deleteAllChNames" />
          </div>
        </div>
        <div class="select-list">
          <div v-for="(item, index) in form.chNames" :key="index" class="item">
            <div>{{ item[0]?.value }}</div>
            <div>{{ item[1]?.value }}</div>
            <IconDelete class="icon-delete" @click="deleteChName(index)" />
          </div>
          <div v-if="showRedText" class="red-text color-red">{{ t('请选择组合') }}</div>
        </div>
      </div>

      <div class="right">

        <div class="result-box">
          <div class="flex-between mb4">
            <span class="mr4">{{ t('全部通道') }} ： </span>
          </div>
          <div class="result-list">
            <div v-for="(item, index) in allResultList" :key="index" class="item" @click="clickChName(item)">
              {{ item.label }}
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
  getEegChannelNamesApi,     // 38.  获取脑磁中的脑电通道集合
  saveLeadCombinationApi,    // 39.  保存导联组合
  deleteLeadCombinationApi,   // 42.  删除导联组合
} from '@/api/meg'

const { t } = useI18n()

const props = defineProps({
  customChannelList: {
    type: Array as PropType<{ listName: string }[]>,
    default: () => [],
  },
  // allChannelList: {
  //   type: Array as PropType<string[]>,
  //   default: () => [],
  // },
  combList: {
    type: Array as PropType<any[]>,
    default: () => [],
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


// 名称的集合
const customChannelNameList = computed(() => {
  return props.customChannelList.map(item => item.listName)
})

const emit = defineEmits(['success'])

const formRef = ref<FormInstance>()

const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const modalType = ref<string>('add')

interface IModalContent {
  [key: string]: any
}

const modalContent = ref<IModalContent>({})

// 数据
interface IForm {
  id: string
  name: string
  chNames: any[]
}

const form = reactive<IForm>({
  id: null, // 导联组合id（修改时才用）
  name: null, // 导联组合名称
  chNames: [] // 导联组合
})

const rules = {
  name: [
    { required: true, message: t('请填写导联组合名称') },
    {
      validator: (rule: any, value: string, callback: (arg0?: string) => void) => {
        if (modalType.value === 'add') {
          if (props.combList.map(item => item.label).includes(value)) {
            callback(t('已有同名的导联组合名称'))
          } else {
            callback()
          }
        }
        if (modalType.value === 'edit') {
          if (props.combList.filter((item: any) => item.label !== value).map(item => item.label).includes(value)) {
            callback(t('已有同名的导联组合名称'))
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
    add: t('构建导联组合'),
    edit: t('修改导联组合'),
  }[modalType.value]
})
const okText = computed(() => {
  return {
    add: t('构建'),
    edit: t('修改'),
  }[modalType.value]
})



// 显示弹窗
function showModal(type: string, record: any) {
  visible.value = true
  modalType.value = type || 'add'
  modalContent.value = { ...record }
  // allResultList.value = JSON.parse(JSON.stringify(props.allChannelList))
  comb.value = null
  getEegChannelNames()
  nextTick(() => {
    if (type === 'edit') {
      form.name = record.listName || ''
      form.chNames = record.channelList || []
    }
  })
}

const comb = ref<string>(null)

function changeComb(value: string) {
  form.chNames = []
  allResultList.value = JSON.parse(JSON.stringify(allChannelList))
  if (value) {
    const target = props.combList.find((f: any) => f.value === value)

    Object.entries(target.combination).forEach(([key, value]) => {
      form.chNames.push([
        { value: key },
        { value: value },
      ])

      // 从右侧数据中移除已选择的数据
      // allResultList.value = allResultList.value.filter((i) => i.value !== key && i.value !== value);

    })
  }
}
let allChannelList: any[] = []

// 38.  获取脑磁中的脑电通道集合
async function getEegChannelNames() {
  const params = {
    subjectId: props.subjectId,
    fifFilePath: props.fifFilePath,
  }
  const { code, data } = await getEegChannelNamesApi(params)
  if (code === 200) {
    const list: any[] = []
    data && Object.entries(data).forEach(([key, value]) => {
      if (value) {
        list.push({ label: `${value} (${key})`, value: value })
      }
    })
    allChannelList = JSON.parse(JSON.stringify(list))
    allResultList.value = list || []
  }
}


const allResultList = ref([])  // 搜索结果

// 选择某个通道
function clickChName(item: any) {

  // 查找左侧最后一组数据
  let lastGroup: any = form.chNames[form.chNames.length - 1];
  if (!lastGroup || lastGroup.length === 2) {
    // 如果没有最后一组数据或者最后一组数据已满，创建新的一组
    form.chNames.push([item]);
  } else {
    // 否则，将数据添加到最后一组的第二个位置
    lastGroup.push(item);
  }

  // // 从右侧数据中移除已选择的数据
  // allResultList.value = allResultList.value.filter((i) => i.value !== item.value)

  comb.value = null
  showRedText.value = false
}


// 删除左侧一组数据的处理函数
function deleteChName(index: number) {
  const group = form.chNames[index];
  // 将该组数据添加回右侧数据列表
  allResultList.value = [...allResultList.value, ...group];
  // 从左侧数据列表中移除该组数据
  form.chNames.splice(index, 1);
  comb.value = null
  changeSortRight()
};


// 让顺序符合allChannelList的顺序
function changeSortRight() {
  const list: string[] = []
  allChannelList.forEach(f => {
    if (allResultList.value.map(item => item.value).includes(f.value)) {
      list.push(f)
    }
  })
  allResultList.value = [...list]
}

// 删除所有通道
function deleteAllChNames() {
  form.chNames = []
  allResultList.value = JSON.parse(JSON.stringify(allChannelList))
}

const showRedText = ref<boolean>(false) // 没有选择通道的红色提示词

// 点击修改
function editComb() {
  modalType.value = 'edit'
  changeComb(comb.value)
  const target = props.combList.find((f: any) => f.value === comb.value)
  form.name = target.label
  form.id = target.value
}

// 点击取消修改
function cancelEditComb() {
  modalType.value = 'add'
  form.name = ''
  form.id = ''
}


// 删除
async function deleteComb() {
  const params: any = {
    id: comb.value, //  导联组合id
  }
  loading.value = true
  const { code, msg } = await deleteLeadCombinationApi(params)
  loading.value = false
  if (code === 200) {
    message.success(msg)
    comb.value = null
    modalType.value = 'add'
    deleteAllChNames()
    emit('success')
  }
}



// 确定弹窗
function modalOk() {
  formRef.value.validate().then(async values => {
    if (!form.chNames.length) {
      showRedText.value = true
      return false
    }

    if (form.chNames[form.chNames.length - 1].length !== 2) {
      message.info(t('导联组合请补充完整'))
      return false
    }

    // 改成数组的方式，因为对象key相同的会被覆盖
    const combination = form.chNames.map((item: any) => {
      return `${item[0].value}-${item[1].value}`
    })

    const params: any = {
      combinationName: values.name, //  导联组合名称
      combination: [...new Set(combination)],// 导联组合（去重）
    }

    if (modalType.value === 'edit') {
      params.id = form.id
    }

    loading.value = true
    const { code, msg } = await saveLeadCombinationApi(params)
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
  allResultList.value = []
  comb.value = null
  modalType.value = 'add'
}

// 暴露方法
defineExpose({
  showModal
})

</script>

<style lang="less" scoped>
.select-width {
  min-width: 150px;
}

.button-width {
  width: 32px;
}

.search-box {
  z-index: 9999;
  min-height: 360px;
  display: flex;


  .left {
    width: 250px;
    margin-right: 16px;
    border-right: 1px dashed var(--color-border);

    .delete-icon {
      font-size: 14px;
      color: var(--color-t6);
      transform: translateY(1px);

      &:hover {
        color: var(--color-primary);
      }
    }
  }

  .right {
    width: 495px;
  }

  :deep(.input-search) {

    .ant-input-affix-wrapper {
      border-radius: 4px;
      border: var(--border-card);
      background: var(--color-bg);
    }
  }


  .select-list {
    height: 466px;
    margin-right: 16px;
    overflow-y: auto;
    font-size: 12px;
    color: var(--color-t2);
    border-radius: 4px;
    border: var(--border-card);
    position: relative;

    &::-webkit-scrollbar {
      width: 2px;
    }

    .red-text {
      position: absolute;
      top: 5px;
      left: 5px;
      z-index: 9;
      font-size: 14px;
    }

    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 4px;
      padding: 6px 10px 6px 6px;
      position: relative;
      border-radius: 4px;
      background: var(--color-primary-005);

      &.active {
        color: var(--color-primary);
        background: var(--color-bg-blue);
      }

      &:hover {
        background: var(--color-primary-01);

      }

      div {
        width: 40%;
        height: 30px;
        line-height: 30px;
        padding-left: 10px;
        background: var(--color-primary-02);
        border-radius: 4px;
      }

      .icon-delete {
        cursor: pointer;

        color: var(--color-t4);

        &:hover {
          color: var(--color-primary);
        }

      }
    }
  }


  .result-list {
    height: 466px;
    overflow-y: auto;
    font-size: 12px;
    color: var(--color-t2);
    padding: 4px 0 0 4px;
    border-radius: 4px;
    border: var(--border-card);

    &::-webkit-scrollbar {
      width: 2px;
    }

    .item {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 106px;
      height: 30px;
      line-height: 30px;
      margin-right: 4px;
      margin-bottom: 4px;
      cursor: pointer;
      position: relative;
      border-radius: 4px;
      background: var(--color-primary-005);

      &.active {
        color: var(--color-primary);
        background: var(--color-bg-blue);
      }

      &:hover {
        background: var(--color-primary-02);

        color: var(--color-primary);
      }
    }
  }


}
</style>