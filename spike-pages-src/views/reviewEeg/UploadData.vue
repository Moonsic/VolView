<template>
  <a-upload v-model:file-list="fileList" name="file" accept=".edf" :before-upload="beforeUploadFile" :title="t('请上传 edf 文件')">
    <a-button class="light-primary-btn" type="primary" size="small" shape="round">
      <IconUpload />
      <span v-if="!widthSmall">{{ t('上传数据') }}</span>
    </a-button>
  </a-upload>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { getFileSuffix } from '@u/utils'

import { useUploadStore } from '@/store/upload'
const uploadStore = useUploadStore()

const { t } = useI18n()

const props = defineProps({
  foldName: {
    type: String,
    default: '',
  },
  widthSmall: {
    type: Boolean,
    default: false,
  },
})

const fileList = ref([]) // 当前选中文件

// 上传单个文件
function beforeUploadFile(file: File) {
  const fullName = file.name
  const filePath = `${props.foldName}/${fullName}`
  const suffix = getFileSuffix(fullName) // test.nii，得到的是gz，而不是nii.gz，所以不能匹配
  const acceptList = ['edf']
  if (!acceptList.includes(suffix)) {
    message.error(t('请上传脑电图文件'))
    return
  }

  uploadStore.addUploadingList({
    file: file,
    fileType: 4, // 1：患者数据集   2：DICOM文件  3：NIFTI文件  4：脑电图文件   5：脑磁图文件
    filePath: filePath,
    fileName: fullName,
  })
  // setTimeout必须要加
  setTimeout(() => {
    fileList.value = [] // 清空文件
  })
  return false
}

const emit = defineEmits(['uploadFileSuccess'])

// 完成上传
function finishedUpload() {
  emit('uploadFileSuccess')
}

</script>

<style lang="less" scoped></style>
