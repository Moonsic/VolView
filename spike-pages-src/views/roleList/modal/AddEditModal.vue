<template>
  <a-modal v-model:open="visible" :confirm-loading="loading" :title="modalTitle" :maskClosable="false"
    :destroyOnClose="true" @ok="modalOk" @cancel="modalCancel">
    <a-form ref="formRef" :model="form" :rules="rules" :labelCol="{ span: 6 }" :wrapperCol="{ span: 15 }">
      <a-form-item class="mt16 mb16" :label="t('角色名称')" name="roleName">
        <a-input v-model:value="form.roleName" allowClear :placeholder="t('请输入')" size="large" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { message, type FormInstance } from 'ant-design-vue'
import { addApi, editApi } from '@/api/role'
const { t } = useI18n()

const emit = defineEmits(['success'])

const formRef = ref<FormInstance>()

const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const modalType = ref<string>('')

interface IModalContent {
  id?: string
  [key: string]: any
}
const modalContent = ref<IModalContent>({})

// 数据
interface IForm {
  id?: string
  roleName: string
}

const form = reactive<IForm>({
  roleName: null,
})

const rules = {
  roleName: [
    { required: true, message: t('请填写角色名称') },
    { min: 2, max: 40, message: t('长度需要在2到40之间') },
  ],
}

// 弹窗标题
const modalTitle = computed(() => {
  return {
    add: t('新增'),
    edit: t('修改'),
  }[modalType.value]
})

// 显示弹窗
function showModal(type: string, record: IForm) {
  visible.value = true
  modalType.value = type || ''
  // 直接从分页接口拿数据
  modalContent.value = { ...record }
  nextTick(() => {
    formRef.value.resetFields()
    if (type === 'edit') {
      Object.keys(form).forEach(item => {
        form[item] = modalContent.value[item]
      })
    }
  })
}

// 确定弹窗
async function modalOk() {
  formRef.value.validate().then(async values => {
    const params: IAnyObject = {
      ...values,
    }
    loading.value = true
    if (modalType.value === 'add') {
      formSubmit(await addApi(params))
    }
    if (modalType.value === 'edit') {
      params.id = modalContent.value.id
      formSubmit(await editApi(params))
    }
  })
}

// 提交新增、修改
function formSubmit(res: IRes) {
  loading.value = false
  const { code, msg } = res
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
  formRef.value.resetFields()
}

// 暴露方法
defineExpose({
  showModal
})

</script>

<style lang="less" scoped>
:deep(.ant-form-item) {
  .ant-form-item-label > label {
    height: 38px;
  }
}
</style>