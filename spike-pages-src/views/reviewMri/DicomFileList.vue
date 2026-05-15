<template>
  <div class="list-page">
    <div class="list-title flex-between">
      <div class="flex">
        {{ t('DICOM文件列表') }}
        <IconReload class="reload-icon ml8" :title="t('刷新')" @click="onReload" />

        <span class="anticon reload-icon ml8" :title="t('将DICOM转化为NIFTI格式')" @click="transformDicomToNii">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 14" fill="none">
            <path
              d="M10.4999 1.16699H3.49992C2.21125 1.16699 1.16658 2.21166 1.16658 3.50033V10.5003C1.16658 11.789 2.21126 12.8337 3.49992 12.8337H10.4999C11.7886 12.8337 12.8333 11.789 12.8333 10.5003V3.50033C12.8333 2.21166 11.7886 1.16699 10.4999 1.16699Z"
              stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M8.16659 4.66699L9.33325 5.83366L4.66658 5.83366" stroke="currentColor" stroke-width="1.2"
              stroke-linecap="round" stroke-linejoin="round" />
            <path d="M5.83341 9.33301L4.66675 8.16634L9.33342 8.16634" stroke="currentColor" stroke-width="1.2"
              stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>

      </div>
      <IconDown class="down-icon" :style="{ transform: showList ? '' : 'rotate(-90deg)' }" @click="clickMenu" />
    </div>
    <div class="list" v-if="showList">

      <NoData :loading="loading" v-if="!tableData.length" />

      <div class="item" v-for="(item, index) in tableData" :key="index">
        <div class="title flex-between" :class="{ active: curData.filePath === item.filePath }"
          @click="clickItem(item)">
          <!-- type：1 文件，2 文件夹 -->
          <div class="flex-start text-ellipsis">
            <IconFolder class="mr8 text-18" v-if="item.type === 2" :style="{ color: 'var(--color-folder)' }" />
            <span>{{ item.name }}</span>
          </div>
          <div v-if="item.type === 2">
            <IconDown class="down-icon color-gray" :style="{ transform: item.showChild ? '' : 'rotate(-90deg)' }" />
          </div>
        </div>

        <div v-if="item.showChild" class="sub-list">
          <div v-for="sub in item.children" :key="sub.name" class="sub-item">

            <div class="title flex-between" :title="sub.name" @click.stop="clickItem(sub)">
              <div class="text-ellipsis">
                <IconFolder class="mr8 text-18" v-if="sub.type === 2" :style="{ color: 'var(--color-folder)' }" />
                <span>{{ sub.name }}</span>
              </div>
              <!-- <div v-if="sub.type === 2">
                <IconDown class="down-icon" :style="{ transform: sub.showChild ? '' : 'rotate(-90deg)' }" />
              </div> -->
            </div>

            <!-- <div v-if="sub.showChild" class="third-list">
              <div v-for="third in sub.children" :key="third.name" class="third-item">
                <div class="title flex-between">
                  <div class="text-ellipsis">
                    <IconFolder class="mr8 text-18" v-if="third.type === 2" :style="{ color: 'var(--color-folder)' }" />
                    <span>{{ third.name }}</span>
                  </div>
                </div>
              </div>
            </div> -->

          </div>
        </div>

      </div>



    </div>
  </div>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'

import {
  getFileListApi, // 获取结构像文件列表
} from '@/api/file'

import {
  transformDicomToNiiApi    // 24. 将Dicom转化为nii格式
} from '@/api/meg'


import { useUploadStore } from '@/store/upload'

const { t } = useI18n()

const uploadStore = useUploadStore()
// 当最新上传成功的文件变化时，刷新列表
// 1：患者数据集   2：DICOM文件  3：NIFTI文件  4：脑电图文件   5：脑磁图文件
watch(() => uploadStore.lastUploadedFile, (newValue: any) => {
  if (newValue.fileType === 2) {
    onReload()
  }
})

const props = defineProps({
  megId: {
    type: String,
    default: '',
  },
  subjectId: {
    type: String,
    default: '',
  },
})

// 暴露方法
defineExpose({
  onReload,
})

const showList = ref<boolean>(true)
const tableData = ref<any[]>([]) // 列表
const loading = ref<boolean>(false)
const curData = ref<any>({})
const FOLD_NAME = computed(() => `${props.megId}/anat/dicom`) // 文件夹名称

// 点击标题
function clickMenu() {
  showList.value = !showList.value
}

onMounted(() => {
  onReload()
})

interface IForm {
  name: string
  filePath: string
  type: number
  lastModified?: number
  size?: number
  showChild?: boolean
  children?: []
}

// 刷新
async function onReload() {
  showList.value = true
  tableData.value = []
  loading.value = true
  tableData.value = await getData(FOLD_NAME.value)
  loading.value = false
}

// 获取数据，要加上默认的文件夹名称FOLD_NAME，因为文件上传成功后会调用getData，不能没有filePath
async function getData(filePath: string = FOLD_NAME.value): Promise<any[]> {
  const params = {
    foldName: filePath,
    subjectId: '',
    pageNum: 1,
    pageSize: 10000, // 这里不分页，查所有
  }
  return new Promise(async resolve => {
    const { code, data } = await getFileListApi(params)
    if (code === 200) {
      // 文件夹在上，文件在下
      const folderList: IForm[] = []
      const fileList: IForm[] = []
      data.records?.forEach((item: IForm) => {
        item.showChild = false
        if (item.type === 1) {
          fileList.push(item)
        }
        if (item.type === 2) {
          item.children = []
          folderList.push(item)
        }
      })
      resolve([...folderList, ...fileList])
    } else {
      resolve([])
    }
  })

}

// {
//     "filePath": "sub-01/anat/sub01_T1.nii",
//     "name": "sub01_T1.nii",
//     "type": 1,
//     "lastModified": "2024-01-16 15:02:20",
//     "size": 16777568
// }


// 点击
// <!-- type：1 文件，2 文件夹 -->
async function clickItem(item: any) {
  curData.value = item

  item.showChild = !item.showChild
  if (item.type === 2 && !item.children.length) {
    item.children = await getData(item.filePath)
  }
}

// 将Dicom转化为NIFTI格式
async function transformDicomToNii() {
  tableData.value.forEach(async item => {
    const params = {
      dicomFilePath: item.filePath,  // 文件路径
      subjectId: props.subjectId,
    }
    const { code } = await transformDicomToNiiApi(params)
    if (code === 200) {
      message.success(`${item.name} ${t('转化为Nifti格式成功')}`)
    }
  })
}

</script>

<style lang="less" scoped>
.list-page {
  position: relative;

  >.list-title {
    position: sticky;
    top: 0;
    color: #fff;
    background: var(--color-title-bg-purple);
  }
}


.list {
  width: 100%;
  max-height: 500px;
  overflow-y: scroll;
  overflow-y: overlay;
  font-size: 14px;

  &::-webkit-scrollbar {
    width: 2px;
  }

  .item {
    width: 100%;

    >.title {
      width: calc(100% - 16px);
      height: 38px;
      margin: 8px;
      padding: 0 8px;
      cursor: pointer;
      border-radius: 4px;
      background: var(--color-primary-003);

      // 先hover
      &:hover {
        background: var(--hover-bg-blue);
      }

      // 再选中
      &.active {
        background: var(--active-bg-blue);
      }

    }

    .sub-list {
      color: var(--color-t3);
      background: var(--color-bg);

      .sub-item {

        .title {
          height: 36px;
          margin: 0 8px 0 20px;
          padding: 0 8px;
          border-bottom: var(--border);

          &.active {
            border-radius: 4px;
            background: var(--hover-bg-blue);
          }

          &:hover {
            border-radius: 4px;
            background: var(--hover-bg-blue);
          }
        }

        // .third-list {
        //   color: var(--color-t3);
        //   background: var(--color-bg);

        //   .third-item {
        //     position: relative;

        //     >.title {
        //       padding-left: 40px;

        //       &.active {
        //         background: #e6efff;
        //       }

        //       &:hover {
        //         background: var(--hover-bg-blue);
        //       }
        //     }
        //   }
        // }

      }
    }

  }

}
</style>
