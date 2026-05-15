<template>
  <a-modal v-model:open="visible" :confirm-loading="loading" :title="modalTitle" :maskClosable="false"
    :destroyOnClose="true" @ok="modalOk" @cancel="modalCancel">
    <a-form ref="formRef" :model="form" :rules="rules" :labelCol="{ span: 6 }" :wrapperCol="{ span: 15 }">
      <a-form-item :label="t('姓名')" name="name">
        <a-input v-model:value="form.name" allowClear :placeholder="t('请输入')" size="large" />
      </a-form-item>
      <a-form-item :label="t('账号')" name="account">
        <a-input v-model:value="form.account" allowClear :placeholder="t('请输入')" size="large" />
      </a-form-item>
      <a-form-item :label="t('密码')" name="password">
        <a-input-password v-model:value="form.password" allowClear :placeholder="t('请输入')" autocomplete="new-password"
          size="large" />
      </a-form-item>
      <a-form-item :label="t('性别')" name="gender">
        <a-radio-group v-model:value="form.gender" :options="genderList" optionType="button" button-style="solid"
          size="large" />
      </a-form-item>
      <a-form-item :label="t('角色')" name="roleId">
        <a-select v-model:value="form.roleId" :options="props.roleList" :fieldNames="{ label: 'roleName', value: 'id' }"
          allowClear :placeholder="t('请选择')" size="large" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { message, type FormInstance } from 'ant-design-vue'
import md5 from 'js-md5'
import { addApi, editApi } from '@/api/user'
import { genderList } from '@u/data'
const { t } = useI18n()
const emit = defineEmits(['success'])

interface IRole {
  id: string
  roleName: string
  createTime: string
}

const props = defineProps({
  roleList: {
    type: Array as PropType<IRole[]>,
    default: () => [],
  },
})

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
  name: string
  account: string
  password: string
  gender: 1 | 2
  roleId: string
}

const form = reactive<IForm>({
  name: null,
  account: null,
  password: null,
  gender: null,
  roleId: null,
})

const rules = reactive({
  name: [
    { required: true, message: t('请填写姓名') },
    { min: 2, max: 40, message: t('长度需要在2到40之间') },
  ],
  account: [
    { required: true, message: t('请填写登录账号') },
    { min: 6, max: 40, message: t('长度需要在6到40之间') },
  ],
  password: [
    { required: true, message: t('请填写登录密码') },
    {
      min: 8, max: 40, pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[-!@#$%^&*()_+|~=`{}[\]:";'<>?,.\/])[A-Za-z\d-!@#$%^&*()_+|~=`{}[\]:";'<>?,.\/]{8,}$/,
      message: t('密码长度8位以上，至少包含字母、数字和特殊字符'), trigger: 'blur'
    },
  ],
  gender: [{ required: true, message: t('请选择性别') }],
  roleId: [{ required: true, message: t('请选择角色') }],
})

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
  modalContent.value = { ...record }
  nextTick(() => {
    formRef.value.resetFields()
    if (type === 'edit') {
      Object.keys(form).forEach(item => {
        form[item] = modalContent.value[item]
      })
      form.password = null
    }
    // 密码在新增时必填，编辑时非必填
    rules.password[0].required = type === 'add'

  })
}

// 确定弹窗
async function modalOk() {
  formRef.value.validate().then(async values => {
    const params: IAnyObject = {
      ...values,
      passwordMD5: values.password ? md5(values.password) : null
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