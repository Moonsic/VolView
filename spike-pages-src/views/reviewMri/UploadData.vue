<template>
  <div class="upload-button mr16">
    <div class="flex-start">
      <a-upload class="mr8" v-model:file-list="fileList" name="file" :accept="curUploadTypeContent"
        :before-upload="beforeUploadFile">
        <a-button class="light-primary-btn" type="primary" size="small" shape="round" :title="curUploadType === 'NIFTI' ? t('NIFTI：请上传 .nii、.nii.gz 格式的文件'):t('DICOM：请上传 zip 格式的压缩包')">
          <IconUpload />
          <span v-if="!widthSmall">{{ t('上传数据') }}</span>
        </a-button>
      </a-upload>

      <a-segmented class="segmented" v-model:value="curUploadType" :options="uploadTypeList" />

      <div class="ml8 color-t5" v-if="curUploadType === 'DICOM'">
        <a-popover placement="bottom" trigger="click">
          <QuestionCircleOutlined class="question-icon" :title="t('上传格式')" />
          <template #content>
            <div class="mt4 mb8">{{ t('DICOM：请上传 zip 格式的压缩包') }}</div>

            <pre>
<span class="text-bold"><IconFolder class="mr4" :style="{ color: 'var(--color-folder)' }" />slices</span>（{{ t('需要将切片保存到slices目录中') }}）
    |----- slice-01
    |----- slice-02
    |----- .......
</pre>
          </template>
        </a-popover>
      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { getFileSuffix } from '@u/utils'

import { useUploadStore } from '@/store/upload'

const { t } = useI18n()

const uploadStore = useUploadStore()

const props = defineProps({
  megId: {
    type: String,
    default: '',
  },
  subjectId: {
    type: String,
    default: '',
  },
  widthSmall: {
    type: Boolean,
    default: false,
  },
})

const fileList = ref([])

const curUploadType = ref('NIFTI')
const uploadTypeList = ref([
  { label: 'NIFTI', value: 'NIFTI' },
  { label: 'DICOM', value: 'DICOM' },
])

const curUploadTypeContent = computed(() => {
  return {
    'NIFTI': '.nii,.gz', // .nii.gz在MAC上不能选择
    'DICOM': '.zip',
  }[curUploadType.value]
})

// 上传单个文件
function beforeUploadFile(file: File) {
  const fullName = file.name

  const suffix = getFileSuffix(fullName) // test.nii，得到的是gz，而不是nii.gz，所以不能匹配
  // const niiList = ['nii', 'nii.gz']
  const dicomList = ['zip']

  let filePath: string = null
  let fileType: number = null

  if (fullName.endsWith('.nii') || fullName.endsWith('.nii.gz')) {
    filePath = `${props.megId}/anat/${fullName}`
    fileType = 3
  } else if (dicomList.includes(suffix)) {
    filePath = `${props.megId}/anat/dicom/${fullName}`
    fileType = 2
  } else {
    message.error('请上传nifti或dicom文件')
    // setTimeout必须要加
    setTimeout(() => {
      fileList.value = [] // 清空文件
    })
    return
  }

  uploadStore.addUploadingList({
    file: file,
    fileType: fileType, // 1：患者数据集   2：DICOM文件  3：NIFTI文件  4：脑电图文件   5：脑磁图文件
    filePath: filePath,
    fileName: fullName,
    subjectId: props.subjectId,
  })
  // setTimeout必须要加
  setTimeout(() => {
    fileList.value = [] // 清空文件
  })

  return false
}

</script>

<style lang="less" scoped>
.upload-button {
  position: relative;

  .question-icon {
    transform: translateY(1px);
  }

  .segmented {
    padding: 2px;
    border-radius: 20px;
    background: var(--color-primary-01);

    :deep(.ant-segmented-item) {
      padding: 0 8px;
      border-radius: 20px;

      // &.ant-segmented-item-selected {
      //   // background: var(--color-primary-005);
      //   // outline: 1px solid var(--color-primary);
      //   // color: #fff;
      //   // outline: 1px solid var(--color-primary-04);
      //   &:hover {
      //   }
      // }

      .ant-segmented-item-label {
        padding: 0 5px;
        min-height: 28px;
        line-height: 28px;
      }

    }

    // :deep(.ant-segmented-thumb) {
    //   // border: 1px solid var(--color-primary);
    // }

  }

}
</style>
