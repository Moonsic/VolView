<template>
  <a-modal v-model:open="visible" :width="420" :confirm-loading="loading" :title="t('生成报告')" :okText="t('确定')" :cancelText="t('取消')"
    :maskClosable="false" :destroyOnClose="true" @ok="modalOk" @cancel="modalCancel">
    <a-form class="form-list mb16" ref="formRef" :model="form" :rules="rules">
      <a-form-item label="" name="mainClassSpikesType" style="margin-left: 60px;">
        <div class="mb24">{{ t('发作间期偶极子总览图棘波时刻点选择') }}：</div>
        <a-checkbox-group v-model:value="form.mainClassSpikesType" :options="mainClassSpikesTypeList" />
      </a-form-item>

      <a-form-item class="mt24" label="" name="isReuseSlicesSet" style="margin-left: 60px;">
        <a-checkbox v-model:checked="form.isReuseSlicesSet">{{ t('临床报告结构像层复用') }}</a-checkbox>
        <div class="color-blue mt8 text-13 mr32">{{ t('提示: 结果查看页面如果修改了结构像层，需要勾选【临床报告结构像层复用】') }}</div>
      </a-form-item>

    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { message, type FormInstance } from 'ant-design-vue'

import {
  generateReportDataApi,// 9. 新报告数据接口，这个是新报告数据生成接口，调用会自动生成通用报告数据和个性化报告数据（目前支持三博和华西）
} from '@/api/report'

const { t } = useI18n()

const props = defineProps({
  subjectId: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['success'])

// 弹窗相关
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)

const formRef = ref<FormInstance>()
const form = reactive<any>({
  mainClassSpikesType: ['alg', 'manual'], // 棘波点溯源算法算法，这个用多选
  isReuseSlicesSet: false,
})

const rules = {
  mainClassSpikesType: [
    { required: true, message: t('请至少选择一个') },
  ],
}

// 算法列表
const mainClassSpikesTypeList = [
  { label: t('算法时刻点'), value: 'alg' },
  { label: t('手动标注时刻点'), value: 'manual' },
]

// 显示弹窗 点击按钮先检测是否已经调用过
async function showModal() {
  visible.value = true
}

// 确定弹窗
async function modalOk() {
  formRef.value.validate().then(async values => {
    const params = {
      subjectId: props.subjectId,
      userId: JSON.parse(localStorage.getItem('userInfo') || '{}')?.id, // 用户id
      mainClassSpikesType: form.mainClassSpikesType.length === 2 ? 'both' : form.mainClassSpikesType[0],
      isReuseSlicesSet: form.isReuseSlicesSet,
    }
    loading.value = true
    const { code, msg } = await generateReportDataApi(params)
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
  formRef.value.resetFields()
}

// 暴露方法
defineExpose({
  showModal
})

</script>

<style lang="less" scoped>
.form-list {

  .ant-form-item {
    margin-bottom: 8px;
  }

}
</style>
