<template>
  <a-upload v-model:file-list="fileList" name="file" accept=".nii,.gz" :before-upload="beforeUploadFile"
    :title="t('请上传nifti文件')">
    <a-button class="light-primary-btn" type="primary" size="small" shape="round">
      <IconUpload />
      <span v-if="!widthSmall">{{ title }}</span>
    </a-button>
  </a-upload>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { getFileSuffix } from '@u/utils'

import { useUploadStore } from '@/store/upload'

const { t } = useI18n()

const uploadStore = useUploadStore()

const props = defineProps({
  type: {
    type: String,
    default: '',
  },
  widthSmall: {
    type: Boolean,
    default: false,
  },
  megId: {
    type: String,
    default: '',
  },
  subjectId: {
    type: String,
    default: '',
  },
})

const title = computed(() => {
  return t('上传') + props.type.toUpperCase()
})

const foldName = computed(() => {
  return {
    'mri': 'anat',
    'pet': 'pet',
    'ct': 'ct',
  }[props.type]
})

const fileList = ref([]) // 当前选中文件

// 上传单个文件
function beforeUploadFile(file: File) {
  const fullName = file.name
  const filePath = `${props.megId}/${foldName.value}/${fullName}`
  const suffix = getFileSuffix(fullName) // test.nii，得到的是gz，而不是nii.gz，所以不能匹配
  const acceptList = ['nii', 'gz']

  if (!acceptList.includes(suffix)) {
    message.error(t('请上传nifti文件'))
    // setTimeout必须要加
    setTimeout(() => {
      fileList.value = [] // 清空文件
    })
    return
  }

  uploadStore.addUploadingList({
    file: file,
    fileType: 3, // 1：患者数据集   2：DICOM文件  3：NIFTI文件  4：脑电图文件   5：脑磁图文件
    filePath: filePath,
    fileName: fullName,
    subjectId: props.subjectId,
    isFromCoreg: true, // 共注册页面的3个上传，就不会调预处理接口
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
