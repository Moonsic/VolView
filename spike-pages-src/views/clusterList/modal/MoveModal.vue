<template>
  <a-modal :width="840" v-model:open="visible" :confirm-loading="loading"
    :title="`移动 ${modalContent.spikeTime}（${modalContent.className}）`" :maskClosable="false" :destroyOnClose="true"
    @ok="modalOk" @cancel="modalCancel">

    <div class="move-page">

      <div class="list">
        <div class="item" v-for="(item, index) in tableData" :key="index"
          :class="{ active: item.className === curItem.className }" @click="clickItem(item)">
          <div class="img-box">
            <img :src="item.thumbImg" alt="">
          </div>
          <div>{{ item.className }}</div>

        </div>
        <div class="add-box" title="添加分组" @click="addItem">
          <PlusOutlined />
        </div>
      </div>
      <div class="right">
        <div class="item" v-show="curItem.thumbImg">
          <div class="img-box">
            <img :src="curItem.thumbImg" alt="" @click.stop="previewBigImg(curItem)">
          </div>
          <div>{{ curItem.className }}</div>
        </div>
      </div>

    </div>

  </a-modal>

  <a-modal v-model:open="addVisible" title="添加分组" okText="确定" cancelText="取消" :maskClosable="false"
    :destroyOnClose="true" @ok="addModalOk" @cancel="addModalCancel">
    <a-form ref="formRef" :model="form" :rules="rules" :labelCol="{ span: 7 }" :wrapperCol="{ span: 13 }">
      <a-form-item class="mt16 mb16" label="分组名称" name="newName">
        <a-input v-model:value="form.newName" placeholder="请输入" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { previewImg } from '@u/preview'
import { useClusterStore } from '@/store/cluster'

import {
  getOrgAvgMapApi, // 16. 获取每类平均图的原图
  updateSpikeClassApi, // 19.  移动的接口和示例
} from '@/api/meg'

const props = defineProps({
  subjectId: {
    type: String,
    default: '',
  },
  megId: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['success', 'close'])

const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const tableData = ref<any[]>([])
const curItem = ref<any>({})


interface IModalContent {
  id?: string
  [key: string]: any
}
const modalContent = ref<IModalContent>({})

const clusterStore = useClusterStore()

// 显示弹窗
function showModal(record: any) {
  visible.value = true
  // 直接从分页接口拿数据
  modalContent.value = { ...record }

  tableData.value = clusterStore.folderList?.filter(item => item.className !== 'badcase' && item.className !== record.className) || []

}

// 点击选择分组
function clickItem(item: { className: string }) {
  if (curItem.value.className === item.className) {
    curItem.value = {}
  } else {
    curItem.value = item
  }
}


// 确定弹窗
async function modalOk() {
  if (!curItem.value.className) {
    return
  }
  const params = {
    subjectId: props.subjectId,
    subjectName: props.megId,
    newClassName: curItem.value.className,
    taskId: modalContent.value.taskId,
    spikeTime: modalContent.value.spikeTime,
    oldClassName: modalContent.value.className,
  }
  loading.value = true
  const { code, msg } = await updateSpikeClassApi(params)
  loading.value = false
  if (code === 200) {
    message.success(msg)
    emit('success')
    modalCancel()
  }
}

// 取消弹窗
function modalCancel() {
  visible.value = false
  loading.value = false
  curItem.value = {}
  emit('close')
}

// 暴露方法
defineExpose({
  showModal
})


// 查看大图
async function previewBigImg(item: any) {
  // 如果已经获取过大图了，直接展示，否则请求
  if (item.bigImg) {
    previewImg(item.bigImg)
    return false
  }
  const params = {
    subjectId: props.subjectId,
    taskId: item.taskId,
    className: item.className,
  }
  const { code, data } = await getOrgAvgMapApi(params)
  if (code === 200) {
    item.bigImg = `data:image/png;base64,${data.org_map}`
    previewImg(item.bigImg)
  }

}

let classNameList: string[] = [] // className的列表，用于新分组是否重名
// 添加新分组弹窗
function addItem() {
  addVisible.value = true
  classNameList = clusterStore.folderList.map(item => item.className)
}

const addVisible = ref<boolean>(false)
const formRef = ref(null)
const form = reactive({
  newName: null,
})
const rules = {
  newName: [
    { required: true, message: '请填写分组名称' },
    {
      validator: (rule: any, value: string, callback: (arg0?: string) => void) => {
        if (classNameList.includes(value)) {
          callback('已有同名分组')
        } else {
          callback()
        }
      },
    }
  ],
}
// 确定弹窗
async function addModalOk() {
  formRef.value.validate().then(async (values: any) => {
    curItem.value = {
      className: values.newName,
      thumbImg: ''
    }
    tableData.value.push(curItem.value)
    addModalCancel()
    modalOk()
  })
}

// 取消弹窗
function addModalCancel() {
  addVisible.value = false
  formRef.value.resetFields()
}

</script>
<style lang="less" scoped>
.move-page {
  display: flex;
  justify-content: space-between;

  .right {
    width: 230px;
    display: inline-block;
    vertical-align: top;
    overflow: hidden;
    border: var(--border-card);
    border-radius: 14px;
  }
}

.list {
  width: 540px;
  height: 500px;
  margin-right: 16px;
  font-size: 16px;
  color: var(--color-t2);
  overflow: auto;

  // display: flex;
  // justify-content: start;
  // flex-wrap: wrap;
}


.list .item,
.right .item {
  width: 100px;
  cursor: pointer;
  position: relative;
  padding: 6px 6px 3px 6px;
  margin: 4px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  border-radius: 6px;
  vertical-align: top;
  border-radius: 10px;
  border: var(--border-card);
  background: var(--color-primary-005);

  >div {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .img-box {
    width: 92px;
    height: 92px;
    border-radius: 3px;

    img {
      width: 100%;
      border-radius: 3px;
    }
  }

  &:hover {
    background: var(--hover-bg-gray);
  }

  &.active {
    color: #fff;
    background: var(--color-primary);
  }


}

.add-box {
  width: 100px;
  height: 126px;
  cursor: pointer;
  position: relative;
  margin: 4px;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  border: var(--border-card);
  vertical-align: top;
}

.right .item {
  width: 220px;
  cursor: default;

  &:hover {
    background: var(--color-primary-005);
  }

  >.img-box {
    width: auto;
    height: auto;
    margin-bottom: 3px;
    img {
      cursor: zoom-in;
    }
  }
}
</style>