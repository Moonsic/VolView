<template>
  <div class="list-page">
    <div class="list-title flex-between">
      <div class="flex">
        {{ t('预处理后的NIFTI文件列表') }}
        <IconReload class="reload-icon ml8" :title="t('刷新')" @click="onReload" />
      </div>
      <IconDown class="down-icon" :style="{ transform: showList ? '' : 'rotate(-90deg)' }" @click="clickMenu" />
    </div>
    <div class="list" v-if="showList">

      <NoData :loading="loading" v-if="!tableData.length" />

      <div v-for="(item, index) in tableData" :key="index" class="item"
        :class="{ active: curData.fsprepNiiFilePath === item.fsprepNiiFilePath }" @click="clickItem(item)">
        <!-- <div class="text-ellipsis">
          <span :title="item.fsprepNiiFilePath">{{ item.fsprepNiiFilePath }}</span>
        </div> -->
        <div class="long-name">
          {{ item.fsprepNiiFilePath }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'

import {
  getFsprepNiiFileListApi, // 2. 获取结构像文件列表
  getNiiFileStreamApi, // 3. 获取结构像的2D图像
} from '@/api/sl'

import { useUploadStore } from '@/store/upload'

const { t } = useI18n()
const uploadStore = useUploadStore()
// 当最新上传成功的文件变化时，刷新列表
// 1：患者数据集   2：DICOM文件  3：NIFTI文件  4：脑电图文件   5：脑磁图文件
watch(() => uploadStore.lastUploadedFile, (newValue: any) => {
  if (newValue.fileType === 3) {
    getData()
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

const emit = defineEmits(['getCurData'])

// 暴露方法
defineExpose({
  getData,
  cancelSelect,
  clickItem,
  clickFirstItem
})

interface INiiFile {
  niiFilePath: string
  fsprepNiiFilePath: string
  fsprepNiiFileName: string
  fsprepNiiFileSize: number
  fileUrl?: string
}

const showList = ref<boolean>(true)
const tableData = ref<INiiFile[]>([]) // 列表
const loading = ref<boolean>(false)
const curData = ref<any>({})

// 点击标题
function clickMenu() {
  showList.value = !showList.value
}

onMounted(() => {
  getData()
})

// 刷新
async function onReload() {
  showList.value = true
  tableData.value = []
  getData()
}

// 获取数据
async function getData() {
  const params = {
    megId: `${props.megId}`,
    subjectId: `${props.subjectId}`,
  }
  loading.value = true
  const { code, data } = await getFsprepNiiFileListApi(params)
  loading.value = false
  if (code === 200) {
    tableData.value = data || []
    // 默认展示第一个结构像
    if (data.length) {
      clickItem(data[0])
    }
  }
}

// "niiFilePath":"sub-01/anat/sub-001 T1w.nii"
// "fsprepNiiFilePath":"fsprep/sub-01/sub-001_T1w/mri/T1.mgz"
// "fsprepNiiFileName":"T1.mgz"
// "fsprepNiiFileSize":5467576

// 点击
async function clickItem(item: INiiFile) {
  curData.value = item

  // 现在url不能保存下来，因为会保存旋转，url就是旧的url了，
  // 没有blob，调接口获取nii的blob
  const params = {
    filePath: item.niiFilePath,
    mgz: 1  // 0:nii, 1:mgz
  }
  // 现在的写法，先获取文件地址，前端再获取文件流，data为文件地址url，然后再把url转成blob
  const { code, data } = await getNiiFileStreamApi(params)
  if (code === 200) {
    item.fileUrl = data
    emit('getCurData', item)
  }
}


// 点击第一个
function clickFirstItem() {
  if (tableData.value.length) {
    return true
  } else {
    message.info(t('预处理后的NIFITI文件列表为空'))
    return false
  }
}

// 取消选中
function cancelSelect() {
  curData.value = {}
}

</script>

<style lang="less" scoped>
.list-title {
  color: #fff;
  background: var(--color-title-bg-green);
}

.list {
  width: 100%;
  max-height: 392px; // 392正好放7个
  overflow-y: scroll;
  overflow-y: overlay;
  font-size: 14px;

  &::-webkit-scrollbar {
    width: 2px;
  }

  .item {
    height: auto;
    min-height: 40px;
    margin: 8px;
    padding: 6px 8px;
    display: flex;
    align-items: center;
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

    .long-name {
      width: 100%;
      word-break: break-all;
    }

  }

}

.dark .list .item.active {
  border: var(--border-card);
}
</style>
