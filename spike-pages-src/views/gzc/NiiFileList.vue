<template>
  <div class="list-page">
    <div class="list-title flex-between">
      <div class="flex">
        {{ t('共注册结果列表') }}
        <IconReload class="reload-icon ml8" :title="t('刷新')" @click="onReload" />
      </div>
      <IconDown class="down-icon" :style="{ transform: showList ? '' : 'rotate(-90deg)' }" @click="clickMenu" />
    </div>
    <div class="list" v-if="showList">

      <NoData :loading="loading" v-if="!tableData.length" />

      <div v-for="(item, index) in tableData" :key="index" class="item"
        :class="{ active: curData.filePath === item.filePath }">
        <div class="long-name">
          {{ item.name }}
        </div>

        <div class="flex-center cursor-pointer">
          <!-- 修改点：根据是否在数组中显示不同的图标 -->
          <!-- 选中状态 -->
          <IconCheckboxActive class="check-icon-active" v-if="isChecked(item)"
            @click.stop="checkItem(item)" />
          <!-- 未选中状态：可以选择显示空心图标，或者完全隐藏。这里为了演示清晰，未选中时不显示图标，或者你可以放一个灰色的IconCheck -->
          <IconCheckbox class="check-icon" v-if="!isChecked(item)" @click.stop="checkItem(item)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { confirmDeleteModal } from '@u/modal'

import {
  getNiiFileListApi,
  getNiiFileStreamApi,
} from '@/api/sl'

import {
  getCoregResultApi,
} from '@/api/coreg'

import { getFileListApi, deleteFileApi } from '@/api/file'

import { useUploadStore } from '@/store/upload'

const { t } = useI18n()

const uploadStore = useUploadStore()

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

const emit = defineEmits(['getCurData', 'addLayer', 'deleteLayer', 'reload'])

defineExpose({
  getData,
  cancelSelect,
  changePatient,
  getCheckedList // 暴露获取已选列表的方法，方便父组件调用
})

interface INiiFile {
  filePath: string
  // is_fsprep: boolean
  // lastModified: string
  // name: string
  // size: number
  // type: number
  fileUrl?: string
}

const showList = ref<boolean>(true)
const tableData = ref<INiiFile[]>([])
const loading = ref<boolean>(false)
const curData = ref<any>({})
const requestVersion = ref(0)

// --- 修改点：多选状态管理 ---
const checkedList = ref<INiiFile[]>([])

const clickMenu = () => {
  showList.value = !showList.value
}

onMounted(() => {
  getData(true)
})

function changePatient() {
  onReload(true)
  cancelSelect()
}

async function onReload(first: boolean = false) {
  showList.value = true
  tableData.value = []
  checkedList.value = []
  requestVersion.value += 1
  emit('reload')
  getData(first)
}

// async function getDataOld(first: boolean = false) {
//   const params = {
//     megId: props.megId,
//     // foldName: `${props.megId}/anat`,
//   }
//   loading.value = true
//   // const { code, data } = await getNiiFileListApi(params)

//   // const { code, data } = await getCoregResultApi(params)
//   const { code, data } = await getFileListApi(params)
//   loading.value = false
//   if (code === 200) {
//     console.log('data :>> ', data);
//     const list = ['T1', 'T2', 'PET', 'CT', 'MASK', 'LT_HEMI', 'RT_HEMI']

//     //     // 3. 核心处理逻辑：按照 standardOrder 的顺序提取，如果存在则加入新数组
//     tableData.value = list
//       .filter(key => data.hasOwnProperty(key)) // 检查键是否存在
//       .map(key => ({
//         id: key,
//         name: key,
//         filePath: key,
//         fileUrl: data[key]
//       }));


//     // tableData.value = data || []

//     console.log('tableData.value :>> ', tableData.value);
//     if (first && tableData.value.length) {
//       clickItem(tableData.value[0], 'getCurData')
//     }
//   }
// }

async function getData(first: boolean = false, foldName?: string) {
  const currentRequestVersion = requestVersion.value
  const params = {
    foldName: foldName || `derivatives/coreg/${props.megId}`,
    subjectId: props.subjectId,
    pageNum: 1,
    pageSize: 10000, // 这里不分页，查所有
  }
  loading.value = true
  const { code, data } = await getFileListApi(params)
  if (currentRequestVersion !== requestVersion.value) {
    return
  }
  loading.value = false
  if (code === 200) {
    // 只保留nii文件的
    // tableData.value = data.records?.filter((item: any) => item.filePath.endsWith('.nii')) || []
    // if (first && tableData.value.length) {
    //   clickItem(tableData.value[0], 'getCurData')
    // }

    const folderList = data.records?.filter((item: any) => item.name.endsWith('/')) || []
    if (folderList.length) {
      await Promise.all(
        folderList.map((item: any) =>
          getData(false, item.filePath)
        )
      )
    } else {
      // 只保留nii文件的，有的是.nii.gz文件，用includes
      const niiList = data.records?.filter((item: any) => item.filePath.endsWith('.nii')) || []
      // 改成追加
      tableData.value.push(...niiList)
    }

  }
}

// 点击条目（仅用于设置当前激活项，不影响勾选，或者你可以选择在这里也切换勾选）
// 根据你的需求 "再点击就是取消勾选"，我们将主要交互放在 checkItem 上
async function clickItem(item: INiiFile, type: string) {
  curData.value = item

  if (item.fileUrl) {
    emit('getCurData', item)
  } else {
    const params = {
      filePath: item.filePath,
      mgz: 0
    }
    const { code, data } = await getNiiFileStreamApi(params)
    if (code === 200) {
      item.fileUrl = data
      if (type === 'getCurData') {
        emit('getCurData', item)
      }
      if (type === 'addLayer') {
        emit('addLayer', item)
      }
    }
  }
}

// 最新：永远只有一个勾选
// --- 修改点：勾选/取消勾选逻辑 ---
function checkItem(item: any) {
  // 2. 切换勾选状态
  const index = checkedList.value.findIndex(i => i.filePath === item.filePath)
  if (index > -1) {
    // 已存在，移除（取消勾选）
    // checkedList.value.splice(index, 1)
    checkedList.value = [] // 只有一个勾选，所以直接置空
    emit('deleteLayer', item)
  } else {
    // 不存在，添加（勾选）
    // checkedList.value.push(item)
    checkedList.value = [item]// 只有一个勾选
    clickItem(item, 'addLayer')
  }
  // console.log('item :>> ', item);
}

// 辅助函数：判断是否已勾选
function isChecked(item: any) {
  return checkedList.value.some(i => i.filePath === item.filePath)
}

// 暴露获取当前勾选列表的方法
function getCheckedList() {
  return checkedList.value
}

function onDelete(record: any) {
  confirmDeleteModal(t('删除'), t('modal.confirmDelete', { name: record.name }), () => {
    onDeleteRequest(record.filePath)
  })
}

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

function cancelSelect() {
  curData.value = {}
  checkedList.value = []
}

</script>

<style lang="less" scoped>
.list-title {
  color: #fff;
  background: var(--color-title-bg-blue);
}

.list {
  width: 100%;
  max-height: 392px;
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
    border-radius: 4px;
    background: var(--color-primary-003);

    // &:nth-child(1) {
    //   background: var(--active-bg-blue);
    // }

    // &:hover {
    //   background: var(--hover-bg-blue);
    // }

    // &.active {
    //   background: var(--active-bg-blue);
    // }

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

.check-icon {
  font-size: 18px;
}

.check-icon-active {
  font-size: 18px;
}
</style>
