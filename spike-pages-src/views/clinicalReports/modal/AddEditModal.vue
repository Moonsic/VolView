<template>
  <a-modal :width="700" v-model:open="visible" :confirm-loading="loading" :title="modalTitle" :maskClosable="false"
    :destroyOnClose="true" @ok="modalOk" @cancel="modalCancel">
    <a-form ref="formRef" :model="form" :rules="rules" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
      <a-form-item :label="t('模板名称')" name="templateName">
        <a-input v-model:value="form.templateName" allowClear :placeholder="t('请输入')" size="large" />
      </a-form-item>

      <div class="template-content">

        <div class="item">
          <div class="label">主 诉：</div>
          <div>
            <a-textarea v-model:value="templateData.complaint" allowClear :placeholder="t('请输入')" :auto-size="{ minRows: 2 }" />
          </div>
        </div>
        <div class="item">
          <div class="label">服药情况：</div>
          <div>
            <a-textarea v-model:value="templateData.medication" allowClear :placeholder="t('请输入')" :auto-size="{ minRows: 2 }" />
          </div>
        </div>
        <div class="item">
          <div class="label">检查状态：</div>
          <div>
            <a-textarea v-model:value="templateData.checkState" allowClear :placeholder="t('请输入')" :auto-size="{ minRows: 2 }" />
          </div>
        </div>
        <div class="item">
          <div class="label">脑磁图所见：</div>
          <div>
            <a-textarea v-model:value="templateData.megFindings" allowClear :placeholder="t('请输入')" :auto-size="{ minRows: 2 }" />
          </div>
        </div>
        <div class="item">
          <div class="label">印象：</div>
          <div>
            <a-textarea v-model:value="templateData.conclusion" allowClear :placeholder="t('请输入')" :auto-size="{ minRows: 2 }" />
          </div>
        </div>
        <div class="item">
          <div class="label">备注：</div>
          <div>
            <a-textarea v-model:value="templateData.notes" allowClear :placeholder="t('请输入')" :auto-size="{ minRows: 2 }" />
          </div>
        </div>
        <div class="item">
          <div class="label">分析者：</div>
          <div>
            <a-input v-model:value="templateData.analyst" allowClear :placeholder="t('请输入')" />
          </div>
        </div>
        <div class="item">
          <div class="label">报告医生：</div>
          <div>
            <a-input v-model:value="templateData.reportDoctor" allowClear :placeholder="t('请输入')"  />
          </div>
        </div>
      </div>

    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { message, type FormInstance } from 'ant-design-vue'
import {
  saveReportTemplateApi // 13. 保存报告模板列表
} from '@/api/report'

const { t } = useI18n()

const emit = defineEmits(['success'])

const formRef = ref<FormInstance>()

const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const modalType = ref<string>('')

const form = reactive<any>({
  templateName: null,
  id: null,
})

const templateData = ref<any>({})

const rules = {
  templateName: [
    { required: true, message: t('请填写模板名称') },
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
function showModal(type: string, templateObj: any) {
  visible.value = true
  modalType.value = type || ''

  nextTick(() => {
    form.templateName = templateObj.templateName
    form.id = templateObj.id
    templateData.value = templateObj.templateData
    // Object.keys(form).forEach(item => {
    //   form[item] = modalContent.value[item]
    // })
  })
}

// 确定弹窗
function modalOk() {
  formRef.value.validate().then(async values => {
    const params: any = {
      ...values,
      templateData: templateData.value,
      userId: JSON.parse(localStorage.getItem('userInfo') || '{}')?.id, // 用户id
    }
    loading.value = true
    if (modalType.value === 'add') {
      formSubmit(await saveReportTemplateApi(params))
    }
    if (modalType.value === 'edit') {
      params.id = form.id
      formSubmit(await saveReportTemplateApi(params))
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

</script>

<style lang="less" scoped>
:deep(.ant-form-item) {
  .ant-form-item-label>label {
    height: 38px;
  }
}

.template-content {
  margin: 0 20px;

  .item {
    display: flex;
    padding: 6px;
    border: var(--border-card);

    &:not(:first-child) {
      border-top: none;
    }

    &:first-child {
      border-radius: 8px 8px 0 0;
    }

    &:last-child {
      border-radius: 0 0 8px 8px;
    }

    .label {
      width: 100px;
      text-align: right;
    }

    >div:not(:first-child) {
      flex: 1;
    }
  }
}
</style>