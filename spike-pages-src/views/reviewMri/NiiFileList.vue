<template>
  <div class="list-page">
    <div class="list-title flex-between">
      <div class="flex">
        {{ t('NIFTI文件列表') }}
        <IconReload class="reload-icon ml8" :title="t('刷新')" @click="onReload" />
      </div>
      <IconDown class="down-icon" :style="{ transform: showList ? '' : 'rotate(-90deg)' }" @click="clickMenu" />
    </div>
    <div class="list" v-if="showList">

      <NoData :loading="loading" v-if="!tableData.length" />

      <div v-for="(item, index) in tableData" :key="index" class="item"
        :class="{ active: curData.filePath === item.filePath }" @click="clickItem(item)">
        <!-- <div class="text-ellipsis">
          <span :title="item.name">{{ item.name }}</span>
        </div> -->
        <div class="long-name">
          {{ item.name }}
        </div>
        <div class="flex-center">
          <IconDelete class="more-icon color-t5 mr8" :title="t('删除')" @click.stop="onDelete(item)" />

          <IconCheckActive class="check-icon-active" v-if="curCheckItem.filePath === item.filePath"
            @click.stop="checkItem(item)" />
          <IconCheck class="check-icon" v-else :title="item.is_fsprep ? t('再次预处理') : t('预处理')"
            :style="{ color: item.is_fsprep ? 'var(--color-t2)' : 'var(--color-green)' }"
            @click.stop="checkItem(item)" />

        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { message, Modal } from 'ant-design-vue'
import { confirmDeleteModal } from '@u/modal'

import {
  getNiiFileListApi, // 2. 获取结构像文件列表
  getNiiFileStreamApi, // 3. 获取结构像的2D图像
  startFsprepApi,    // 13. 开始对结构像进行预处理
} from '@/api/sl'

import { deleteFileApi } from '@/api/file'


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
})

interface INiiFile {
  filePath: string
  is_fsprep: boolean
  lastModified: string
  name: string
  size: number
  type: number
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
  getData(true)
})

// 刷新
async function onReload() {
  showList.value = true
  tableData.value = []
  getData()
}

// 获取数据
async function getData(first: boolean = false) {
  const params = {
    foldName: `${props.megId}/anat`,
  }
  loading.value = true
  const { code, data } = await getNiiFileListApi(params)
  loading.value = false
  if (code === 200) {
    tableData.value = data || []
    // 默认选中第一个
    if (first && tableData.value.length) {
      // clickItem(tableData.value[0])
    }
  }
}

// {
//     "filePath": "sub-01/anat/sub01_T1.nii",
//     "name": "sub01_T1.nii",
//     "type": 1,
//     "lastModified": "2024-01-11 16:23:16",
//     "size": 16777568,
//     "is_fsprep": true
// }

// 点击
async function clickItem(item: INiiFile) {
  curData.value = item

  // 如果有blob，直接使用，不再重新调接口。
  if (item.fileUrl) {
    emit('getCurData', item)
  } else {
    // 没有blob，调接口获取nii的blob
    const params = {
      filePath: item.filePath,
      mgz: 0  // 0:nii, 1:mgz
    }
    // 现在的写法，先获取文件地址，前端再获取文件流，data为文件地址url，然后再把url转成blob
    const { code, data } = await getNiiFileStreamApi(params)
    if (code === 200) {
      item.fileUrl = data
      emit('getCurData', item)
    }
  }

}



const curCheckItem = ref<any>({})     // 当前正在检测的数据

// 检测
async function checkItem(item: any) {
  curCheckItem.value = item

  const title = item.is_fsprep ? t('再次发起预处理') : t('发起预处理')
  // const contentText = item.is_fsprep ? `【${item.name}】已经发起过预处理，重新进行预处理会删除其对应的配准、前向处理、以及溯源定位结果，是否再次发起预处理？` : `是否对【${item.name}】发起预处理？`
  const contentText = item.is_fsprep ?
    t(`【{name}】已经发起过预处理，重新进行预处理会删除其对应的配准、前向处理、以及溯源定位结果，是否再次发起预处理？`, { name: item.name })
    :
    t(`是否对【{name}】发起预处理？`, { name: item.name })

  Modal.confirm({
    title: title,
    content: h('span', { class: 'break-all' }, contentText),
    // okType: 'danger',
    // autoFocusButton: null,
    onOk: async () => {
      const params = {
        filePath: item.filePath,
        subjectId: props.subjectId,
      }
      const { code, msg } = await startFsprepApi(params)
      if (code === 200) {
        message.success(msg)
        getData()
      }
      curCheckItem.value = {}
    },
    onCancel() {
      curCheckItem.value = {}
    }
  })

}

// 删除
function onDelete(record: any) {
  confirmDeleteModal(t('删除'), t('modal.confirmDelete', { name: record.name }), () => {
    onDeleteRequest(record.filePath)
  })
}

// 请求删除
async function onDeleteRequest(filePath: string) {
  const params = {
    subjectId: '',
    filePath: filePath
  }
  const { code, msg } = await deleteFileApi(params)
  if (code === 200) {
    message.success(msg)
    getData()
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
  background: var(--color-title-bg-blue);
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

      .more-icon {
        display: block;
      }
    }

    // 再选中
    &.active {
      background: var(--active-bg-blue);
    }

    .more-icon {
      display: none;
    }

    >div {
      text-align: center;

      &:nth-child(1) {
        width: 100%;
        padding-right: 4px;
        text-align: left;
        word-break: break-all;
      }
    }

  }

}

.dark .list .item.active {
  border: var(--border-card);
}
</style>
