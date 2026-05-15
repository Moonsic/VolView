<template>
  <a-modal :width="590" v-model:open="visible" :confirm-loading="loading" :title="t('聚类结果溯源定位')" :maskClosable="false"
    :destroyOnClose="true" @ok="modalOk" @cancel="modalCancel">
    <div class="list">
      <div class="item" v-for="(item, index) in tableData" :key="index"
        :class="{ active: !!selectedList.includes(item.className) }" @click="clickItem(item)">
        <!-- <div class="img-box">
          <img :src="item.thumbImg" alt="" @click.stop="previewBigImg(item)">
        </div> -->
        <div>{{ item.className }}</div>
      </div>
    </div>
    <a-form class="form-list mt24" ref="formRef" :model="form" :rules="rules">
      <a-form-item :label="t('选择溯源算法')" name="locMethod">
        <a-checkbox-group v-model:value="form.locMethod" name="locMethod" :options="newLocMethodList" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { message, type FormInstance } from 'ant-design-vue'

import { previewImg } from '@u/preview'

import { locMethodList } from '@u/data' // 算法列表

import {
  getClusterListApi, // 15.  获取聚类列表
  getOrgAvgMapApi, // 16. 获取每类平均图的原图
} from '@/api/meg'

import {
  startSourceLocationApi // 6. 开始进行溯源定位
} from '@/api/sl'

const { t } = useI18n()

const props = defineProps({
  subjectId: {
    type: String,
    default: '',
  },
  coregId: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['success'])

// 弹窗相关
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const tableData = ref<any[]>([])
const selectedList = ref<string[]>([])

const formRef = ref<FormInstance>()
const form = reactive<any>({
  locMethod: [], // 算法，这个页面用多选， 默认选中所有
})

// 新的算法列表，加上不可选择
const newLocMethodList = locMethodList.map((item: any) => {
  // form.locMethod.push(item.value) // 不再默认选中所有
  return {
    ...item,
    disabled: true
  }
})

const rules = {
  locMethod: [
    { required: false, message: t('请选择溯源算法') },
  ]
}


// 设置算法
function setAlg(alg: string) {
  form.locMethod = [alg]
}

// 显示弹窗
function showModal() {
  visible.value = true
  getData()
}

const clusterTaskId = ref<string>('')

// 获取聚类列表文件夹数据
async function getData() {
  const params = {
    subjectId: props.subjectId,
  }
  const { code, data } = await getClusterListApi(params)
  if (code === 200) {
    const newData = data.clusters_list.map((item: any) => {
      selectedList.value.push(item.class_name) // 默认先选中所有聚类
      return {
        className: item.class_name,
        spikesNum: item.spikes_num,
        // thumbImg: item.avg_fig ? `data:image/png;base64,${item.avg_fig}` : null,
        taskId: data.task_id
      }
    })
    clusterTaskId.value = data.task_id
    // 最新：保留badcase
    tableData.value = newData || []
  }

}

// 点击，不包含加入，包含去掉
function clickItem(item: { className: string }) {
  if (selectedList.value.includes(item.className)) {
    selectedList.value = selectedList.value.filter((f: string) => f !== item.className)
  } else {
    selectedList.value.push(item.className)
  }
}

// 让顺序符合tableData的顺序
function changeSort() {
  const list: string[] = []
  tableData.value.forEach((f: any) => {
    if (selectedList.value.includes(f.className)) {
      list.push(f.className)
    }
  })
  selectedList.value = list
}


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
    item.bigImg = data?.org_map ? `data:image/png;base64,${data.org_map}` : null
    previewImg(item.bigImg)
  }
}


// 确定弹窗
async function modalOk() {
  if (!selectedList.value.length) {
    return message.info(t('请选择聚类列表'))
  }
  formRef.value.validate().then(async values => {
    changeSort() // 让顺序符合tableData的顺序

    const params = {
      coregId: props.coregId,
      clusterTaskId: clusterTaskId.value,
      classList: selectedList.value,
      subjectId: props.subjectId,
      locMethod: form.locMethod,
    }
    loading.value = true
    const { code, msg } = await startSourceLocationApi(params)
    loading.value = false
    if (code === 200) {
      message.success(msg)
      emit('success')
      modalCancel()
    }
  })
}

// 取消弹窗
function modalCancel() {
  visible.value = false
  loading.value = false
  selectedList.value = []
}

// 暴露方法
defineExpose({
  showModal,
  setAlg
})

</script>

<style lang="less" scoped>
.list {
  // width: 540px;
  max-height: 500px;
  font-size: 16px;
  color: var(--color-t2);
  overflow: auto;

  .item {
    width: 100px;
    cursor: pointer;
    position: relative;
    padding: 16px 2px;
    margin: 4px;
    display: inline-flex;
    flex-wrap: wrap;
    border-radius: 10px;
    border: var(--border-card);
    background: var(--color-primary-005);

    >div {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      word-break: break-all;
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

}

.form-list {

  .ant-form-item {
    margin-bottom: 8px;
  }

}
</style>