<template>
  <a-modal v-model:open="visible" :confirm-loading="loading" :title="t('导出溯源定位结果')" :maskClosable="false"
    :destroyOnClose="true" @ok="modalOk" @cancel="modalCancel">

    <!-- <div class="text-center mb32">已勾选 {{ allSelectedList.length }} 个点，是否确认导出？</div> -->
    <div class="text-center mb32">{{ t('已勾选 {name} 个点，是否确认导出？', { name: allSelectedList.length }) }}</div>

    <a-form class="form-list" ref="formRef" :model="form" :rules="rules" :labelCol="{ span: 11 }"
      :wrapperCol="{ span: 6 }">

      <a-form-item :label="t('坐标点大小')" name="radius">
        <a-input-number class="input" v-model:value="form.radius" :placeholder="t('请输入')" :min="0" :step="1" size="large" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { message, type FormInstance } from 'ant-design-vue'

import {
  exportNiiWithSlCoordApi, // 21. 导出
} from '@/api/sl'

const { t } = useI18n()

const props = defineProps({
  megId: {
    type: String,
    default: '',
  },
  subjectId: {
    type: String,
    default: '',
  },
})

// 弹窗相关
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)

interface IModalContent {
  id?: string
  [key: string]: any
}
const modalContent = ref<IModalContent>({})

const formRef = ref<FormInstance>()
const form = reactive<any>({
  radius: 2, // 坐标点大小
})

const rules = {
}

const allSelectedList = ref<number[][]>([])

// 显示弹窗
function showModal(record: any, list: number[][]) {
  // console.log('record :>> ', record);
  visible.value = true
  modalContent.value = { ...record }
  allSelectedList.value = list || []
}


// 确定弹窗
async function modalOk() {
  formRef.value.validate().then(async values => {
    const params: any = {
      megId: props.megId,
      radius: form.radius,
      niiFilePath: modalContent.value.niiFilePath,
      slCoordsChecked: allSelectedList.value,
    }
    // console.log('params :>> ', params);
    loading.value = true
    const { code, msg } = await exportNiiWithSlCoordApi(params)
    loading.value = false
    if (code === 200) {
      message.success(msg)
      modalCancel()
    }
  })
}

// 取消弹窗
function modalCancel() {
  visible.value = false
  loading.value = false
  modalContent.value = {}
  allSelectedList.value = []
}

// 暴露方法
defineExpose({
  showModal,
})

</script>

<style lang="less" scoped>
.form-list {

  .ant-form-item {
    margin-bottom: 16px;
  }

  .ant-checkbox-group {
    flex-direction: column;
    margin-top: 6px;
  }

  .ant-radio-group {
    display: inline-flex;
    flex-direction: column;
    margin-top: 6px;
  }

}
</style>