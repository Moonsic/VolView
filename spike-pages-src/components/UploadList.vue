<template>

  <a-popover overlayClassName="upload-list-popover" v-model:open="showUploadPopover" placement="topRight"
    trigger="click" :title="t('上传列表')">

    <a-float-button :badge="{ count: uploadingList.length + tableData.length }"
      :style="{ bottom: '80px', right: '16px', 'zIndex': 1000 }">
      <template #icon>
        <span class="anticon color-blue">
          <svg v-if="!isDarkMode" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32" fill="none">
            <path
              d="M21.3337 29.3333H8.00033C5.05481 29.3333 2.66699 26.9455 2.66699 24V7.99999C2.66699 5.05447 5.05481 2.66666 8.00033 2.66666H24.0003C26.9458 2.66666 29.3337 5.05447 29.3337 7.99999V17.3333"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            <path
              d="M10.667 2.66666H21.3337V12.781C21.3337 13.9689 19.8975 14.5638 19.0575 13.7238L16.9431 11.6095C16.4224 11.0888 15.5782 11.0888 15.0575 11.6095L12.9431 13.7238C12.1032 14.5638 10.667 13.9689 10.667 12.781V2.66666Z"
              stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
            <path
              d="M29.333 23.4477L27.6091 21.7239C27.0885 21.2032 26.2442 21.2032 25.7235 21.7239L23.9997 23.4477M26.6663 29.3333V22.1144"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>

          <svg v-if="isDarkMode" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M22.667 2.66663H24.0003C26.9458 2.66663 29.3337 5.05444 29.3337 7.99996V16C29.3337 17.4727 28.1398 18.6666 26.667 18.6666H20.0003C18.5276 18.6666 17.3337 19.8605 17.3337 21.3333V26.6666C17.3337 28.1394 16.1398 29.3333 14.667 29.3333H8.00033C5.05481 29.3333 2.66699 26.9455 2.66699 24V7.99996C2.66699 5.05444 5.05481 2.66663 8.00033 2.66663H9.33366H10.667H21.3337H22.667ZM10.667 10.1143V4.66663H21.3337V10.1143C21.3337 11.3022 19.8975 11.8971 19.0575 11.0571L16.9431 8.94277C16.4224 8.42207 15.5782 8.42207 15.0575 8.94277L12.9431 11.0572C12.1032 11.8971 10.667 11.3022 10.667 10.1143ZM26.2743 24.2482L25.3147 23.2826V28.327C25.3147 28.8827 24.867 29.3333 24.3147 29.3333C23.7624 29.3333 23.3147 28.8827 23.3147 28.327V23.2826L22.3551 24.2482C21.9646 24.6412 21.3314 24.6412 20.9409 24.2482C20.5504 23.8553 20.5504 23.2181 20.9409 22.8251L22.6648 21.0903C23.576 20.1734 25.0534 20.1734 25.9646 21.0903L27.6885 22.8251C28.079 23.2181 28.079 23.8553 27.6885 24.2482C27.2979 24.6412 26.6648 24.6412 26.2743 24.2482Z"
              fill="currentColor" />
          </svg>
        </span>
      </template>
    </a-float-button>

    <template #content>
      <div class="popover-content">


        <IconReload class="reload-icon ml8" :title="t('刷新')" @click.stop="getData" />

        <div class="no-data" v-if="!uploadingList.length && !tableData.length">
          <svg v-if="!isDarkMode" xmlns="http://www.w3.org/2000/svg" width="128" height="108" viewBox="0 0 128 108"
            fill="none">
            <g clip-path="url(#clip0_372_15297)">
              <path
                d="M64.1002 107.5C93.8002 107.5 118 83.4 118 53.8C117.9 24.1 93.8002 0 64.1002 0C34.3002 0 10.2002 24.1 10.2002 53.7C10.2002 83.4 34.3002 107.5 64.1002 107.5Z"
                fill="#F1F3F9" stroke="#D6DCE8" stroke-width="2" />
              <path
                d="M121.2 60.6C121.2 72.1 111.9 81.4 100.3 81.4C100.1 81.4 98.4 81.4 85.9 81.4C77.2 81.4 63.3 81.4 41.1 81.4H30.5C16.6 81.7 5.5 70.6 5.5 57.2C5.5 43.7 16.7 32.5 30.8 33.2C42.9 -4.6 98.3 0.700001 103 39.8C113.4 41.1 121.2 49.9 121.2 60.6Z"
                fill="white" stroke="#D6DCE8" stroke-width="2" />
              <path d="M102.7 39.9C101.9 39.8 101.1 39.8 100.3 39.8C96.2 39.8 92.3 41 89 43.1" fill="white" />
              <path d="M102.7 39.9C101.9 39.8 101.1 39.8 100.3 39.8C96.2 39.8 92.3 41 89 43.1" stroke="#D6DCE8"
                stroke-width="2" />
              <path d="M30.8 33.2C29.6 36.8 29 40.6 29 44.6C29 46.2 29.1 47.7 29.3 49.2" fill="white" />
              <path d="M30.8 33.2C29.6 36.8 29 40.6 29 44.6C29 46.2 29.1 47.7 29.3 49.2" stroke="#D6DCE8"
                stroke-width="2" stroke-linejoin="bevel" />
              <path
                d="M50.6995 58.8C54.5995 56.3 59.1995 54.9 64.0995 54.9C77.4995 54.9 88.3995 65.7 88.3995 79.1C88.3995 92.5 77.4995 103.3 64.0995 103.3C50.6995 103.3 39.7995 92.5 39.7995 79.1C39.5995 70.6 43.9995 63.2 50.6995 58.8Z"
                fill="#D6DCE8" stroke="#AAB2C5" stroke-width="2" />
              <path
                d="M68.6044 80.32L68.6194 80.33L68.6354 80.35C69.8904 81.46 71.8954 81.52 73.1074 80.3C74.2974 79.11 74.2974 77.08 73.1074 75.89L66.3794 69.16C66.0794 68.73 65.6544 68.47 65.2514 68.32C64.8114 68.16 64.3364 68.1 63.9004 68.1C63.4234 68.1 62.9594 68.27 62.6274 68.44C62.2834 68.61 61.9374 68.85 61.6924 69.09L54.9654 75.82C54.5434 76.11 54.2874 76.53 54.1374 76.89C53.9714 77.3 53.9004 77.73 53.9004 78.1C53.9004 78.9 54.2374 79.65 54.8924 80.3L54.9134 80.33L54.9354 80.35C56.1884 81.46 58.1884 81.52 59.4004 80.31L60.8004 78.96V87.6C60.8004 89.35 62.2474 90.8 64.0004 90.8C65.7524 90.8 67.2004 89.35 67.2004 87.6V78.96L68.6044 80.32Z"
                fill="white" stroke="#AAB2C5" stroke-width="2" />
              <path
                d="M118.9 35C121.164 35 123 33.16 123 30.9C123 28.63 121.164 26.8 118.9 26.8C116.635 26.8 114.8 28.63 114.8 30.9C114.8 33.16 116.635 35 118.9 35Z"
                fill="#F1F3F9" />
              <path
                d="M124.9 19C126.446 19 127.7 17.74 127.7 16.2C127.7 14.65 126.446 13.4 124.9 13.4C123.353 13.4 122.1 14.65 122.1 16.2C122.1 17.74 123.353 19 124.9 19Z"
                fill="#F1F3F9" />
              <path
                d="M11.5002 28.2C13.0462 28.2 14.3002 26.94 14.3002 25.4C14.3002 23.85 13.0462 22.6 11.5002 22.6C9.9532 22.6 8.7002 23.85 8.7002 25.4C8.7002 26.94 9.9532 28.2 11.5002 28.2Z"
                fill="#F1F3F9" />
              <path
                d="M5.2 89.8C8.071 89.8 10.4 87.47 10.4 84.6C10.4 81.73 8.071 79.4 5.2 79.4C2.328 79.4 0 81.73 0 84.6C0 87.47 2.328 89.8 5.2 89.8Z"
                fill="#F1F3F9" />
            </g>
            <defs>
              <clipPath id="clip0_372_15297">
                <rect width="127.7" height="107.5" fill="white" />
              </clipPath>
            </defs>
          </svg>

          <svg v-if="isDarkMode" xmlns="http://www.w3.org/2000/svg" width="128" height="111" viewBox="0 0 128 111"
            fill="none">
            <path
              d="M64.1002 108.5C93.8002 108.5 118 84.4 118 54.8C117.9 25.1 93.8002 1 64.1002 1C34.3002 1 10.2002 25.1 10.2002 54.7C10.2002 84.4 34.3002 108.5 64.1002 108.5Z"
              fill="#2D2E31" />
            <path
              d="M121.2 60.6001C121.2 72.1001 111.9 81.4001 100.3 81.4001C100.1 81.4001 98.4 81.4001 85.9 81.4001C77.2 81.4001 63.3 81.4001 41.1 81.4001H30.5C16.6 81.7001 5.5 70.6001 5.5 57.2001C5.5 43.7001 16.7 32.5001 30.8 33.2001C42.9 -4.59992 98.3 0.700085 103 39.8001C113.4 41.1001 121.2 49.9001 121.2 60.6001Z"
              fill="#48494C" stroke="#232426" stroke-width="2" />
            <path d="M102.7 39.9C101.9 39.8 101.1 39.8 100.3 39.8C96.2 39.8 92.3 41 89 43.1" fill="#48494C" />
            <path d="M102.7 39.9C101.9 39.8 101.1 39.8 100.3 39.8C96.2 39.8 92.3 41 89 43.1" stroke="#232426"
              stroke-width="2" />
            <path d="M30.8 33.2C29.6 36.8 29 40.6 29 44.6C29 46.2 29.1 47.7 29.3 49.2" fill="#48494C" />
            <path d="M30.8 33.2C29.6 36.8 29 40.6 29 44.6C29 46.2 29.1 47.7 29.3 49.2" stroke="#232426" stroke-width="2"
              stroke-linejoin="bevel" />
            <path
              d="M50.6995 58.7999C54.5995 56.2999 59.1995 54.8999 64.0995 54.8999C77.4995 54.8999 88.3995 65.6999 88.3995 79.0999C88.3995 92.4999 77.4995 103.3 64.0995 103.3C50.6995 103.3 39.7995 92.4999 39.7995 79.0999C39.5995 70.5999 43.9995 63.1999 50.6995 58.7999Z"
              fill="#3C3C3F" stroke="#1E1F21" stroke-width="2" />
            <path
              d="M68.6044 80.3201L68.6194 80.3301L68.6354 80.3501C69.8904 81.4601 71.8954 81.5201 73.1074 80.3001C74.2974 79.1101 74.2974 77.0801 73.1074 75.8901L66.3794 69.1601C66.0794 68.7301 65.6544 68.4701 65.2514 68.3201C64.8114 68.1601 64.3364 68.1001 63.9004 68.1001C63.4234 68.1001 62.9594 68.2701 62.6274 68.4401C62.2834 68.6101 61.9374 68.8501 61.6924 69.0901L54.9654 75.8201C54.5434 76.1101 54.2874 76.5301 54.1374 76.8901C53.9714 77.3001 53.9004 77.7301 53.9004 78.1001C53.9004 78.9001 54.2374 79.6501 54.8924 80.3001L54.9134 80.3301L54.9354 80.3501C56.1884 81.4601 58.1884 81.5201 59.4004 80.3101L60.8004 78.9601V87.6001C60.8004 89.3501 62.2474 90.8001 64.0004 90.8001C65.7524 90.8001 67.2004 89.3501 67.2004 87.6001V78.9601L68.6044 80.3201Z"
              fill="#48494C" />
            <path
              d="M118.9 35C121.164 35 123 33.16 123 30.9C123 28.63 121.164 26.8 118.9 26.8C116.635 26.8 114.8 28.63 114.8 30.9C114.8 33.16 116.635 35 118.9 35Z"
              fill="#3C3C3F" />
            <path
              d="M124.9 18.9999C126.446 18.9999 127.7 17.7399 127.7 16.1999C127.7 14.6499 126.446 13.3999 124.9 13.3999C123.353 13.3999 122.1 14.6499 122.1 16.1999C122.1 17.7399 123.353 18.9999 124.9 18.9999Z"
              fill="#3C3C3F" />
            <path
              d="M11.5 28.2001C13.046 28.2001 14.3 26.9401 14.3 25.4001C14.3 23.8501 13.046 22.6001 11.5 22.6001C9.95295 22.6001 8.69995 23.8501 8.69995 25.4001C8.69995 26.9401 9.95295 28.2001 11.5 28.2001Z"
              fill="#3C3C3F" />
            <path
              d="M5.2 89.7999C8.071 89.7999 10.4 87.4699 10.4 84.5999C10.4 81.7299 8.071 79.3999 5.2 79.3999C2.328 79.3999 0 81.7299 0 84.5999C0 87.4699 2.328 89.7999 5.2 89.7999Z"
              fill="#3C3C3F" />
          </svg>
          <span class="mt16">{{ t('暂无上传文件') }}</span>
        </div>


        <div class="uploading-list list">
          <div class="item" v-for="(item, index) in uploadingList" :key="index">
            <div class="flex">
              <span class="name text-ellipsis" :title="item.fileName">{{ item.fileName }}</span>
              <span>【{{ getFileTypeLabel(item.fileType)?.label }}】</span>
            </div>
            <div class="progress flex-between">
              <a-progress :percent="item.progress" size="small" status="active" strokeColor="var(--color-primary)"
                trailColor="var(--color-primary-03)" />
            </div>
            <div class="bottom text-12">
              <!-- <div v-if="item.status === 'md5' && item.md5Pro">
                <ReloadOutlined spin class="color-blue mr4" />正在验证md5： {{ item.md5Pro }}
              </div> -->

              <div v-if="item.status === 'md5'">
                <ReloadOutlined spin class="color-blue mr4" />{{ t('正在验证md5') }}
              </div>

              <div class="flex-start" v-if="item.status === 'uploading'">
                {{ t('正在上传') }}
                <LottieAnimation class="ml8" style="width:20px; height: 18px;" :animation-data="loadingJson" :auto-play="true" :loop="true" :speed="1" />
              </div>
              <div v-if="item.status === 'success'" class="color-green">{{ t('上传成功') }}</div>
            </div>

          </div>
        </div>

        <!-- <div>未上传完成列表</div> -->
        <div class="upload-fail-list list">
          <div class="item" v-for="(item, index) in tableData" :key="index">
            <div class="flex">
              <span class="name text-ellipsis" :title="item.fileName">{{ item.fileName }}</span>
              <span>【{{ getFileTypeLabel(item.fileType)?.label }}】</span>
            </div>

            <div class="progress flex-between">
              <a-progress :percent="item.progress" size="small" strokeColor="var(--color-red)"
                trailColor="var(--color-red-02)" />
            </div>

            <div class="bottom flex-between text-12">
              <div class="color-red">{{ t('上传中断') }}</div>

              <div class="bottom-right flex-start">
                <a-upload class="upload" v-model:file-list="item.fileList" name="file" :accept="item.accept"
                  :before-upload="file => beforeUploadFile(file, item)">
                  <div class="flex-start text-12">
                    <IconUpload class="text-14 mr8" :title="t('继续上传')" />
                    {{ t('继续上传') }}
                  </div>
                </a-upload>

                <a-popconfirm :title="t('确认删除？')" placement="right" :ok-text="t('确定')" :cancel-text="t('取消')" @confirm="onDelete(item)">
                  <div class="flex-start text-12">
                    <IconDelete class="text-12 mr8" :title="t('删除')" />
                    {{ t('删除') }}
                  </div>
                </a-popconfirm>

              </div>

            </div>


          </div>
        </div>
      </div>

    </template>
  </a-popover>



</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { LottieAnimation } from "lottie-web-vue"
import { getFileSuffix } from '@u/utils'
import loadingJson from '@a/animation/loading.json' // 引入动画JSON文件
import { storeToRefs } from 'pinia'
import {
  getUploadingFileListApi,  // 5. 获取未上传完成的文件列表
  deleteUploadingFileApi    // 6. 删除未上传完成的文件
} from '@/api/fileChunk'

import { useUploadStore } from '@/store/upload'
import { useThemeStore } from '@/store/theme'

const { t } = useI18n()
const { isDarkMode } = storeToRefs(useThemeStore())

const uploadStore = useUploadStore()



// console.log('uploadStore :>> ', uploadStore);

// pinia的storeToRefs，具有响应式
const { showUploadPopover, uploadingList } = storeToRefs(uploadStore)


// watch(() => uploadStore.uploadingList, (newItems, oldItems) => {
//   // 当数组变化时，这里的代码会被执行
//   console.log('数组变化了', newItems)
// },{ deep: true })


// 点击了继续上传
function beforeUploadFile(file: File, record: any) {
  // console.log('file :>> ', file);
  // console.log('record :>> ', record);

  const fullName = file.name
  // const suffix = getFileSuffix(fullName) // test.nii，得到的是gz，而不是nii.gz，所以不能匹配
  // const acceptList = ['zip']
  // if (!acceptList.includes(suffix)) {
  //   message.error('请上传压缩包文件')
  //   return
  // }

  uploadStore.addUploadingList({
    file: file,
    fileType: record.fileType,
    filePath: record.filePath,
    fileName: record.fileName,
  })
  tableData.value = tableData.value.filter((item) => item.fileName !== fullName)
  // setTimeout必须要加
  setTimeout(() => {
    record.fileList = []
    // tableData.value = tableData.value.filter((item) => item.fileName !== file.name)
    tableData.value.forEach((item) => {
      item.fileList = []
    })
  })


  return false
}


const showIcon = ref<boolean>(false)
const tableData = ref<any[]>([]) // 未上传完成的文件列表
const loading = ref<boolean>(false)

getData()

// 获取列表数据
async function getData() {
  loading.value = true
  const { code, data } = await getUploadingFileListApi({})
  loading.value = false
  if (code === 200) {
    const fileNameList = uploadingList.value.map(item => item.fileName)
    const list: any[] = []
    data.records?.forEach((item: any) => {
      // 刷新未完成列表时，会有和正在上传的列表一样的，要过滤掉
      if (!fileNameList.includes(item.fileName)) {
        const obj = getFileTypeLabel(item.fileType)
        list.push({
          ...item,
          fileList: [],
          fileTypeLabel: obj.label,
          accept: obj.accept,
          progress: parseFloat((item.chunkIndex / item.chunkNum * 100).toFixed(0)),
        })
      }

    })
    tableData.value = list || []
    // tableData.value = [...list,...list,...list,...list,...list,]
    showIcon.value = list.length > 0 ? true : false

  }
}

// // {
// //     "filePath": "sub-01\\eeg\\sub01_EP_5__02_raw_tsss02.fif",
// //     "fileMd5": "77242631f3917e210ad06455963b09a3",
// //     "fileName": "sub01_EP_5__02_raw_tsss02.fif",
// //     "chunkIndex": 45,
// //     "chunkNum": 342
// // }

function getFileTypeLabel(fileType: number) {
  return {
    1: { label: t('数据集'), accept: '.zip' },
    2: { label: t('DICOM文件'), accept: '.zip' },
    3: { label: t('NIFTI文件'), accept: '.nii,.gz' },
    4: { label: t('脑电图文件'), accept: '.edf' },
    5: { label: t('脑磁图文件'), accept: '.fif' },
    6: { label: t('数据集'), accept: '*' },
  }[fileType] || {}
}


// 删除未上传完成的文件
async function onDelete(item: any) {
  const params = {
    filePath: item.filePath,
    fileMd5: item.fileMd5,
  }
  const { code, msg } = await deleteUploadingFileApi(params)
  if (code === 200) {
    message.success(msg)
    getData()
  }
}
</script>


<style lang="less">
.ant-popover.upload-list-popover {

  .ant-popover-title {
    margin: 0 16px;
    padding: 16px 0;
    font-size: 16px;
    font-weight: 500;
    // color: var(--color-t2);

    &:before {
      content: '';
      display: inline;
      border-left: 4px solid var(--color-modal-title-before);
      border-right: 4px solid var(--color-modal-title-before);
      border-radius: 2px;
      margin-right: 16px;
    }
  }
}

// 悬浮按钮加个边框
.ant-float-btn-default .ant-float-btn-body {
  border: 1px solid var(--color-primary-02);
}
</style>


<style lang="less" scoped>
.popover-content {
  width: 500px;
  height: 530px;
  padding-right: 1px;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 2px;
  }

  .no-data {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 150px;
  }
}


.list {
  width: 100%;
  font-size: 14px;

  .item {
    width: 100%;
    padding: 12px; // 小于8px会有横向滚动条
    margin-bottom: 12px;
    cursor: pointer;
    border-radius: 8px;
    background: var(--color-primary-005);

    .name {
      max-width: calc(100% - 120px);
    }

    .progress {
      margin-right: 4px;
    }

    .bottom {
      color: var(--color-gray);

      .bottom-right {
        margin-right: 36px;
        color: var(--color-primary);
        font-size: 12px;

        .ant-upload-wrapper {
          color: var(--color-primary);
        }
      }


      .upload {
        margin-right: 24px;
        transform: translateY(1px);
      }
    }

  }

}

.upload-fail-list {
  .item {
    background: var(--color-red-005);
  }
}

.reload-icon {
  position: absolute;
  top: 22px;
  left: 110px;
  z-index: 999;
  font-size: 14px;
  color: var(--color-primary);
}
</style>
