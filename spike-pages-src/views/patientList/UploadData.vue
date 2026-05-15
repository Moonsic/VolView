<template>
  <!-- <a-upload v-model:file-list="fileList" name="file" accept=".zip" :before-upload="beforeUploadFile">
    <a-button type="primary">
      <IconUpload />上传患者数据集
    </a-button>
  </a-upload> -->

  <a-dropdown>
    <a-button type="primary">
      <IconUpload />
      {{ t('上传患者数据集') }}
      <IconDown />
    </a-button>
    <template #overlay>
      <a-menu>
        <a-menu-item key="1">
          <a-upload v-model:file-list="fileList" name="file" accept=".zip" :before-upload="beforeUploadFile">
            <div>{{ t('上传压缩包') }}（.zip）</div>
          </a-upload>
        </a-menu-item>
        <a-menu-item key="2">
          <a-upload v-model:file-list="directoryList" name="folder" directory :before-upload="beforeUploadFolder">
            <div>{{ t('上传文件夹') }}</div>
          </a-upload>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { getFileSuffix } from '@u/utils'

import { useUploadStore } from '@/store/upload'

import {
  isMegIdExsitApi, // 10. 传要上传文件夹的目录， 用来判断是否存在同名的患者目录
} from '@/api/subject'

const { t } = useI18n()

const uploadStore = useUploadStore()

const fileList = ref([]) // 当前选中文件
const directoryList = ref([]) // 当前选中文件

// 上传单个文件
function beforeUploadFile(file: File) {
  const fullName = file.name
  const filePath = `${fullName}`
  const suffix = getFileSuffix(fullName)
  const acceptList = ['zip']
  if (!acceptList.includes(suffix)) {
    message.error(t('请上传压缩包文件'))
    return
  }

  uploadStore.addUploadingList({
    file: file,
    fileType: 1, // 1：患者数据集   2：DICOM文件  3：NIFTI文件  4：脑电图文件   5：脑磁图文件
    filePath: filePath,
    fileName: fullName,
  })
  // setTimeout必须要加
  setTimeout(() => {
    fileList.value = [] // 清空文件
  })
  return false
}


// 上传文件夹
let fileListNum = 0
let sucessListNum = 0
let startFlag = false


async function beforeUploadFolder(_file: File, fileList: any[]) {

  // console.log('beforeUploadFolder :>> ', _file,fileList);

  fileListNum = fileList.length

  if (!startFlag) {
    startFlag = true

    const directoryName = fileList[0].webkitRelativePath.split('/')[0]
    const isExsit = await isMegIdExsit(directoryName)

    // 如果存在同名患者目录，则不进行上传
    if (isExsit) {
      return
    }

    fileList?.forEach((item) => {
      uploadSingleFile(item)
    })
  }
  // setTimeout必须要加
  setTimeout(() => {
    directoryList.value = [] // 清空文件
  })
  return false
}


function uploadSingleFile(file: File) {

  const fullName = file.name
  const filePath = file.webkitRelativePath

  uploadStore.addUploadingList({
    file: file,
    fileType: 6, // 1：患者数据集   2：DICOM文件  3：NIFTI文件  4：脑电图文件   5：脑磁图文件，6：患者文件夹
    filePath: filePath,
    fileName: fullName,
  })
}

async function isMegIdExsit(name: string) {
  return new Promise(async (resolve, reject) => {
    const params = {
      megId: name
    }
    const { code, data } = await isMegIdExsitApi(params)
    startFlag = false
    if (code === 200) {
      if (data === true) {
        message.error(t('该患者已存在'))
        resolve(true)
      } else {
        // message.info(`开始上传${name}`)
        resolve(false)
      }
    }
  })

}


const emit = defineEmits(['uploadFileSuccess'])

// 完成上传
function finishedUpload() {
  emit('uploadFileSuccess')
}

</script>

<style lang="less" scoped>
:deep(.ant-upload-wrapper .ant-upload-select) {
  width: 100%;
}
</style>
