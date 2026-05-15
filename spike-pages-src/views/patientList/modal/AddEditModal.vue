<template>
  <a-modal v-model:open="visible" :confirm-loading="loading" :title="modalTitle" :maskClosable="false"
    :destroyOnClose="true" @ok="modalOk" @cancel="modalCancel">
    <a-form ref="formRef" :model="form" :rules="rules" :labelCol="{ span: 7 }" :wrapperCol="{ span: 15 }">
      <a-form-item :label="t('患者编号')" name="megId">
        <a-input v-model:value="form.megId" allowClear :placeholder="t('请输入')" size="large" />
      </a-form-item>
      <a-form-item :label="t('姓名')" name="subjectName">
        <a-input v-model:value="form.subjectName" allowClear :placeholder="t('请输入')" size="large" />
      </a-form-item>
      <a-form-item :label="t('性别')" name="gender">
        <a-radio-group v-model:value="form.gender" :options="genderList" optionType="button" button-style="solid"
          size="large" />
      </a-form-item>
      <a-form-item :label="t('出生日期')" name="birthDate">
        <!-- <a-month-picker v-model:value="form.birthDate" placeholder="请选择年月" allowClear :format="birthDateFormat"
          valueFormat="YYYY-MM" size="large" /> -->
        <a-date-picker v-model:value="form.birthDate" :placeholder="t('请选择日期')" allowClear :format="birthDateFormat"
          valueFormat="YYYY-MM-DD" size="large" />
      </a-form-item>
      <a-form-item :label="t('影像扫描日期')" name="scanDate">
        <a-month-picker v-model:value="form.scanDate" :placeholder="t('请选择年月')" allowClear format="YYYY-MM"
          valueFormat="YYYY-MM" size="large" />
      </a-form-item>
      <a-form-item :label="t('脑磁检查时间')" name="megCheckTime">
        <!-- <a-month-picker v-model:value="form.megCheckTime" placeholder="请选择年月" allowClear format="YYYY-MM"
          valueFormat="YYYY-MM" size="large" /> -->
        <a-date-picker v-model:value="form.megCheckTime" :placeholder="t('请选择日期')" allowClear format="YYYY-MM-DD"
          valueFormat="YYYY-MM-DD" size="large" />
      </a-form-item>
      <a-form-item :label="t('脑磁检查类型')" name="megCheckType">
        <a-auto-complete v-model:value="form.megCheckType" :options="setOptions(megCheckTypeList)" :placeholder="t('请选择或输入')"
          :defaultActiveFirstOption="false" :filter-option="filterOption" allowClear size="large" />
      </a-form-item>
      <a-form-item :label="t('致痫灶位置')" name="epilepticLocation">
        <a-auto-complete v-model:value="form.epilepticLocation" :options="setOptions(epilepticLocationList)"
          :placeholder="t('请选择或输入')" :defaultActiveFirstOption="false" :filter-option="filterOption" allowClear
          size="large" />
      </a-form-item>
      <a-form-item :label="t('复核状态')" name="checked">
        <div class="checked-box">
          <!-- <a-switch class="switch-checked" v-model:checked="form.checked" />
          <span class="ml8">{{ form.checked ? '已复核' : '未复核' }}</span> -->
          <a-switch class="switch-checked" v-model:checked="form.checked">
            <template #checkedChildren>{{ t('已复核') }}</template>
            <template #unCheckedChildren>{{ t('未复核') }}</template>
          </a-switch>
        </div>

      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { message, type FormInstance } from 'ant-design-vue'
import { addSubjectApi } from '@/api/subject'
import { genderList } from '@u/data'
import { calculateAge } from '@u/utils'

const { t } = useI18n()

const emit = defineEmits(['success'])

const formRef = ref<FormInstance>()

const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const modalType = ref<string>('')

interface IModalContent {
  subjectId?: string
  [key: string]: any
}
const modalContent = ref<IModalContent>({})

// 数据
interface IForm {
  subjectId: string
  subjectName: string
  megId: string
  gender: number
  birthDate: string
  scanDate: string
  megCheckType: string
  epilepticLocation: string
  megCheckTime: string
  checked: boolean
}

const form = reactive<IForm>({
  subjectId: null,
  subjectName: null,
  megId: null,
  gender: null,
  birthDate: null,
  scanDate: null,
  megCheckTime: null,
  megCheckType: t('癫痫'),
  epilepticLocation: null,
  checked: false,
})

const rules = {
  megId: [
    { required: true, message: t('请填写患者编号') },
    { min: 3, max: 40, message: t('长度需要在3到40之间') },
  ],
  // gender: [
  //   { required: true, message: t('请选择性别') },
  // ]
}

// 弹窗标题
const modalTitle = computed(() => {
  return {
    add: t('新增'),
    edit: t('修改'),
  }[modalType.value]
})

// 计算年龄，今年之后负数的的不显示
const birthDateFormat = computed(() => {
  if (!form.birthDate) {
    return ''
  } else {
    const age = calculateAge(form.birthDate)
    return age > 0 ? `YYYY-MM-DD（${age}岁）` : ''
  }
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

      if (form.birthDate?.length === 7) {
        form.birthDate = form.birthDate + '-01'
      }
      // /^\d{4}-\d{2}$/.test(form.birthDate)
      // /^\d{4}-(0[1-9]|1[0-2])$/.test(form.birthDate)
      //       if (/^\d{4}-\d{2}$/.test(form.birthDate)) {
      //   // 匹配"1990-05"格式
      // }
    }
  })
}

// 确定弹窗
function modalOk() {
  formRef.value.validate().then(async values => {
    const params = {
      ...values,
      checked: form.checked ? 1 : 0,
    }
    loading.value = true
    if (modalType.value === 'add') {
      formSubmit(await addSubjectApi(params))
    }
    if (modalType.value === 'edit') {
      params.subjectId = modalContent.value.subjectId
      formSubmit(await addSubjectApi(params))
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
  visible,
  showModal
})

const megCheckTypeList = [t('癫痫'), t('精神科'), t('痴呆')]
const epilepticLocationList = [t('颞叶内侧'), t('颞叶外侧'), t('额叶'), t('顶叶')]

function filterOption(input: string, option: any) {
  return option.label
  // return input ? false: true
  // return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
}

function setOptions(list: any[]) {
  return list.map(item => {
    return {
      label: item,
      value: item,
    }
  })
}

</script>

<style lang="less" scoped>
:deep(.ant-form-item) {
  .ant-form-item-label>label {
    height: 38px;
  }
}

.checked-box {
  display: flex;
  align-items: center;
  transform: translateY(3px);
}

:deep(.switch-checked) {

  &.ant-switch-checked {
    background-color: var(--color-green);

    &:hover:not(.ant-switch-disabled) {
      background-color: var(--color-green-dark);
    }
  }
}
</style>