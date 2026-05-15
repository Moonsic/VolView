<template>
  <a-modal
    :title="t('详情')"
    v-model:open="visible"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <a-spin :spinning="loading">
      <DetailList :column="1" :detailList="detailList"></DetailList>
    </a-spin>

    <template #footer>
      <a-button type="primary" @click="modalCancel"> {{ t('返回') }}</a-button>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import { genderList } from '@u/data'
import DetailList from '@c/DetailList.vue'
const { t } = useI18n()

// 数据
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const modalContent = ref<IAnyObject>({})

interface IDetailList {
  label: string
  key: string
  value?: any
  options?: { label: string, value: string | number}[]
  type?: string
  format?: string
}

const detailList = ref<IDetailList[]>([
  { label: t('姓名'), key: 'name' },
  { label: t('账号'), key: 'account' },
  { label: t('密码'), key: 'password' },
  { label: t('性别'), key: 'gender', options: genderList },
  { label: t('角色'), key: 'roleName' },
  { label: t('创建时间'), key: 'createTime', type: 'date' },
])

// 显示弹窗
function showModal(record: { id: string }) {
  visible.value = true
  modalContent.value = record || {}
  detailList.value.forEach(item => {
    item.value = modalContent.value[item.key]
  })
}

// 取消弹窗
function modalCancel() {
  visible.value = false
  loading.value = false
}

// 暴露方法
defineExpose({
  showModal
})

</script>