<template>
  <a-spin :spinning="loading">
    <div id="clusterList" class="all-list">
      <div class="item-box" v-for="(item, index) in newTableData" :key="index">
        <div class="title">{{ item.filePath }}</div>
        <div class="list">
          <div class="item" v-for="(item2) in item.subList" :key="item2.spikeTime"
            :class="{ active: item2.spikeTime === curItem.spikeTime }" @contextmenu="contextMenu(item2, $event)">
            <div>
              <img :src="item2.thumbImg" alt="" @click.stop="previewBigImg(item2)">
            </div>
            <div class="time">{{ item2.spikeTime }}</div>
          </div>
        </div>
      </div>
      <!-- 数量太少的话，就没必要展示到底了，超过21个展示到底了 -->
      <div class="flex-center mt8 mb8" v-if="tableData.length >= 21 && isAllData">到底了</div>
      <div class="item-box no-data-box flex-center" v-if="!tableData.length && !loading">暂无数据</div>
    </div>
  </a-spin>

  <div class="context-menu-modal" v-show="showMenuModal" @click="closeModal">
    <div class="context-menu" :style="{ top: modalTop + 'px', left: modalLeft + 'px' }">
      <div class="item" @click.stop="onMove">
        <span class="anticon mr8">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" fill="none">
            <path
              d="M14 11.9995L8.54152 14.4255C8.19676 14.5787 7.80324 14.5787 7.45848 14.4255L2 11.9995M14 8.66619L8.54152 11.0922C8.19676 11.2454 7.80324 11.2454 7.45848 11.0922L2 8.66619M2.5259 5.26247L7.40372 7.70138C7.77909 7.88906 8.22092 7.88907 8.59629 7.70138L13.4741 5.26247C13.9655 5.01679 13.9655 4.31559 13.4741 4.0699L8.59629 1.631C8.22092 1.44331 7.77909 1.44331 7.40372 1.631L2.5259 4.0699C2.03454 4.31559 2.03454 5.01679 2.5259 5.26247Z"
              stroke="currentColor" stroke-width="1.2" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </span>
        移动
      </div>
      <div v-if="curFolder.className !== 'badcase'" class="item item-delete" @click.stop="onDelete">
        <IconDelete class="mr8" />
        删除
      </div>
    </div>
  </div>

  <!-- 详情弹窗 -->
  <MoveModal ref="moveModalRef" :subjectId="subjectId" :megId="megId" @success="successModal" @close="closeModal" />
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { throttle } from '@u/utils'
import { confirmDeleteModal } from '@u/modal'
import { previewImg } from '@u/preview'

import {
  getClusterSpikesApi, // 16.  点击每一个类，请求获取该类的棘波时刻点的所有时刻点还有图
  getOrgSpikeMapApi, // 18. 获取单个棘波时刻点的原图
  updateSpikeClassApi, // 19.  移动的接口和示例
} from '@/api/meg'

import MoveModal from './modal/MoveModal.vue'

// 取消默认的浏览器自带右键
window.oncontextmenu = (e) => {
  e.preventDefault()
}

// 暴露方法
defineExpose({
  selectFolder,
})


const route = useRoute()
const megId = ref<string>(String(route.query.megId || ''))
const subjectId = ref<string>(String(route.query.subjectId || ''))

const tableData = ref<any[]>([])
const newTableData = ref<any[]>([])

const isAllData = ref<boolean>(false)
const loading = ref<boolean>(false)
const total = ref<number>(0)
const pageNum = ref<number>(1)
const pageSize = ref<number>(10)

const curFolder = ref<any>({})
const moveModalRef = ref(null)

// 点击左侧列表后
function selectFolder(res: any) {
  curFolder.value = res
  onSearch()
}

// 查询
function onSearch() {
  pageNum.value = 1
  pageSize.value = 10
  tableData.value = []
  newTableData.value = []
  isAllData.value = false
  getData()
}

let el: HTMLElement = null

onMounted(() => {
  nextTick(() => {
    el = document.getElementById('clusterList')
    if (!el) return
    el.addEventListener("scroll", throttle(scrollFn, 1000)) // 做节流处理
  })
})

onUnmounted(() => {
  el.removeEventListener("scroll", scrollFn, false)
})

// 滚动触底加载
function scrollFn(e: any) {
  const clientHeight = e.target.clientHeight // 可视区域 813
  const scrollHeight = e.target.scrollHeight // 滚动文档总高度 4000
  const scrollTop = e.target.scrollTop       // 已滚动的高度 0
  // 说明马上就要触底了
  if (scrollTop + clientHeight >= scrollHeight - 800) {
    getData()
  }
}


// 获取数据
async function getData() {

  if (isAllData.value) {
    return
  }

  if (!curFolder.value.taskId) {
    return
  }


  const params = {
    subjectId: subjectId.value,
    taskId: curFolder.value.taskId,
    className: curFolder.value.className,
    // pageNum: pageNum.value,
    // pageSize: pageSize.value,
  }
  // 当还没有数据的时候，才开启一次loading
  if (!tableData.value.length) {
    loading.value = true
  }
  const { code, data } = await getClusterSpikesApi(params)
  loading.value = false
  if (code === 200) {
    total.value = data.spikes_num || 0

    const newData = data.spikes_list.map((item: any) => {
      return {
        filePath: item.file_path, // 根据路径分类
        figPath: item.fig_path,
        spikeTime: item.spike_time,
        thumbImg: `data:image/png;base64,${item.spike_fig}`,
        taskId: item.task_id,
        className: curFolder.value.className
      }
    })

    tableData.value = [
      ...tableData.value, ...newData
    ]

    setNewTableData() // 设置新的数组结构

    if (tableData.value.length >= total.value) {
      isAllData.value = true
      return
    }

  }

}

// 设置新的数组结构
function setNewTableData() {
  const list: { filePath: string, subList: any[] }[] = []
  const pathList: string[] = []

  tableData.value.forEach(item => {
    if (pathList.includes(item.filePath)) {
      list.find((f: any) => f.filePath === item.filePath)?.subList.push(item)
    } else {
      pathList.push(item.filePath)
      list.push({
        filePath: item.filePath,
        subList: [item]
      })
    }
  })
  newTableData.value = list
}

const modalTop = ref<number>(0)           // 右键弹窗的位置top
const modalLeft = ref<number>(0)          // 右键弹窗的位置left
const showMenuModal = ref<boolean>(false) // 显示右键弹窗

const curItem = ref<any>({})           // 右键弹窗的位置top

function contextMenu(item: any, $event: any) {
  curItem.value = item
  const { clientX, clientY } = $event
  // 获取右键弹窗的位置并显现
  modalLeft.value = clientX
  modalTop.value = clientY
  showMenuModal.value = true
}

// 关闭右键菜单
function closeModal() {
  showMenuModal.value = false
  curItem.value = {}
}


// 移动
async function onMove() {
  showMenuModal.value = false
  moveModalRef.value.showModal(curItem.value)
}

const emit = defineEmits(['refreshFolderList'])

// 删除
async function onDelete() {
  showMenuModal.value = false
  const record = curItem.value
  confirmDeleteModal('删除', `确定将【${record.spikeTime}】移入badcase中？`, () => {
    onDeleteRequest()
  })
}

// 请求删除
async function onDeleteRequest() {
  if (!curItem.value.className) {
    return
  }
  const params = {
    subjectId: subjectId.value,
    subjectName: megId.value,
    newClassName: 'badcase',
    taskId: curItem.value.taskId,
    spikeTime: curItem.value.spikeTime,
    oldClassName: curFolder.value.className,
  }
  const { code, msg } = await updateSpikeClassApi(params)
  if (code === 200) {
    message.success(msg)
    successModal() // 刷新列表
  }
}

// 刷新列表
function successModal() {
  emit('refreshFolderList')
  tableData.value = tableData.value.filter(f => f.spikeTime !== curItem.value.spikeTime)
  setNewTableData()
  curItem.value = {}
}


// 查看大图
async function previewBigImg(item: any) {
  // 如果已经获取过大图了，直接展示，否则请求
  if (item.bigImg) {
    previewImg(item.bigImg)
    return false
  }
  const params = {
    subjectId: subjectId.value,
    taskId: item.taskId,
    spikeTime: item.spikeTime,
  }
  const { code, data } = await getOrgSpikeMapApi(params)
  if (code === 200) {
    if (data) {
      item.bigImg = `data:image/png;base64,${data.org_map}`
      previewImg(item.bigImg)
    } else {
      message.error('图片已失效')
    }
  }

}

</script>

<style lang="less" scoped>
.all-list {
  // height: calc(100vh - 70px - 16px - 16px - 16px);
  height: calc(100vh - 58px - 16px - 230px - 12px);
  overflow: scroll;

  .item-box {
    margin-bottom: 16px;
    border-radius: 18px;
    background: var(--color-bg);
    box-shadow: var(--box-shadow);
    border: var(--border-card);
    overflow: hidden;

    .title {
      margin: 0 16px 16px;
      padding: 16px 0;
      font-size: 16px;
      border-bottom: var(--border);

      &:before {
        content: '';
        display: inline;
        border-left: 4px solid var(--color-modal-title-before);
        border-right: 4px solid var(--color-modal-title-before);
        border-radius: 2px;
        margin-right: 16px;
      }
    }

    &.no-data-box {
      height: 100%;
      color: var(--color-t5);
      margin-bottom: 0;
    }
  }
}

.list {
  font-size: 16px;
  color: var(--color-t2);
  background: var(--color-bg);
  padding-left: 16px;
  padding-bottom: 16px;


  .item {
    width: 220px;
    cursor: pointer;
    position: relative;
    padding: 4px;
    margin: 8px;
    display: inline-flex;
    flex-wrap: wrap;
    border-radius: 10px;
    border: var(--border-card);
    background: var(--color-primary-005);

    >div {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 6px;

      img {
        width: 100%;
        border-radius: 6px;
        cursor: zoom-in;

        &:hover {
          outline: 1px solid var(--color-primary-02);
        }
      }
    }

    .time {
      padding-bottom: 6px;
    }

    &:hover {
      background: var(--hover-bg-gray);
      box-shadow: 0px 6px 18px 0px rgba(0, 0, 0, 0.10)
    }

    &.active {
      color: #fff;
      background: var(--color-primary);
      box-shadow: 0px 6px 18px 0px rgba(0, 0, 0, 0.10)
    }
  }
}


.context-menu-modal {
  // background: #e6efff7a;
  // background-color: rgba(0, 0, 0, 0.2);
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 999;
}

.context-menu {
  width: 128px;
  overflow: hidden;
  cursor: pointer;
  position: absolute;
  padding: 4px;
  border-radius: 20px;
  background: var(--color-bg);
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.10);
  font-size: 15px;

  .item {
    width: 100%;
    height: 44px;
    line-height: 44px;
    padding-left: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    border-radius: 18px;

    &:hover {
      color: var(--color-primary);
      background: var(--color-primary-01);
    }

    &.item-delete {
      &:hover {
        color: #FD655D;
        background: rgba(253, 101, 93, 0.10);
      }
    }
  }

}
</style>