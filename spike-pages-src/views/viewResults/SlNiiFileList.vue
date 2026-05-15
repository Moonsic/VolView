<template>
  <div class="list-page">
    <div class="list-title flex-between">
      <div class="flex">
        {{ t('溯源坐标导出结果') }}
        <IconReload class="reload-icon ml8" :title="t('刷新')" @click="onReload" />
      </div>
      <IconDown class="down-icon" :style="{ transform: showList ? '' : 'rotate(-90deg)' }" @click="clickMenu" />
    </div>
    <div class="list" v-if="showList">

      <NoData :loading="loading" v-if="!tableData.length" />

      <div v-for="(item, index) in tableData" :key="index" class="item"
        :class="{ active: curData.fsprepNiiFileName === item.fsprepNiiFileName }" @click="clickItem(item)">
        <div class="long-name">
          {{ item.fsprepNiiFileName }}
        </div>
        <div>
          <IconDownload class="icon-download" title="下载" @click.stop="onDownload(item)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import { downloadFile } from '@u/utils'
import { downloadFilesApi } from '@/api/file'

import {
  getFsprepNiiFileListApi, // 2. 获取结构像文件列表
} from '@/api/sl'

const { t } = useI18n()

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
})

interface INiiFile {
  niiFilePath: string
  fsprepNiiFilePath: string
  fsprepNiiFileName: string
  fsprepNiiFileSize: number
  fileUrl?: string
}

const showList = ref<boolean>(false)
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
    niiType: 2,
  }
  loading.value = true
  const { code, data } = await getFsprepNiiFileListApi(params)
  loading.value = false
  if (code === 200) {
    tableData.value = data || []
  }
}

// "niiFilePath":"sub-01/anat/sub-001_T1w.nii"
// "fsprepNiiFilePath":"fsprep/sub-01/sub-001_T1w/mri/T1.mgz"
// "fsprepNiiFileName":"T1.mgz"
// "fsprepNiiFileSize":5467576
// "fsprepNiiUrl": "http://..."

// 点击
async function clickItem(item: INiiFile) {
  curData.value = item
  emit('getCurData', item)
}

// 取消选中
function cancelSelect() {
  curData.value = {}
}


// 下载文件
async function onDownload(record: any) {
  const params = {
    foldName: record.fsprepNiiFilePath
  }
  // console.log('record :>> ', record);
  const res: any = await downloadFilesApi(params)
  // console.log('res :>> ', res); // 正确的打印应该是 Blob {size: 1813, type: 'application/octet-stream'} ，而不是数据流，说明blob出问题了，受到了mock.js的影响
  downloadFile(res, res.headers['content-disposition'].split('=')[1])
  // downloadFile(res, 'text.nii')
}


</script>

<style lang="less" scoped>
.list-title {
  color: #fff;
  background: var(--color-title-bg-pinkpurple);
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
      padding-right: 4px;
      word-break: break-all;
    }

    .icon-download {
      &:hover {
        color: var(--color-primary);
      }
    }

  }

}

.dark .list .item.active {
  border: var(--border-card);
}
</style>
