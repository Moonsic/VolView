<template>

  <DetailList :column="4" :detailList="detailList" :labelStyle="{padding:'16px',textAlign: 'right', width: '100px'}"></DetailList>

</template>

<script lang="ts" setup>
import { genderList } from '@u/data'
import DetailList from '@c/DetailList.vue'

const { t } = useI18n()

const props = defineProps({
  detail: {
    type: Object,
    default: () => {},
  },
})

interface IDetailList {
  label: string
  key: string
  value?: any
  options?: { label: string, value: string | number}[]
  type?: string
  format?: string
}

const detailList = ref<IDetailList[]>([
  { label: t('患者编号'), key: 'megId' },
  { label: t('姓名'), key: 'subjectName' },
  { label: t('性别'), key: 'gender', options: genderList },
  { label: t('出生日期'), key: 'birthDate', type: 'date', format: 'YYYY-MM' },
  { label: t('扫描日期'), key: 'scanDate', type: 'date', format: 'YYYY-MM' },
])

watch(() => props.detail, () => {
  setDetail()
})

// 设置数据
function setDetail() {
  detailList.value.forEach(item => {
    item.value = props.detail[item.key]
  })
}

</script>