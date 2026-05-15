<template>
  <a-spin :spinning="loading">
    <div class="list" id="clusterList">
      <div class="item" v-for="(item, index) in tableData" :key="index" :class="{ active: item.spikeTime === curItem.spikeTime }"
        @contextmenu="contextMenu(item, $event)">
        <div>
          <img :src="item.thumbImg" alt="" @click.stop="previewBigImg(item)">
          <!-- <img :src="item.thumbImg" alt=""> -->
        </div>
        <div>{{ item.spikeTime }}</div>
      </div>
      <div class="flex-center" v-if="tableData.length>0 && isAllData">到底了</div>
      <div class="flex-center mt32" v-if="!tableData.length && !loading">暂无数据</div>
    </div>
  </a-spin>

  <div class="context-menu-modal" v-show="showMenuModal" @click="closeModal">
    <div class="context-menu" :style="{ top: modalTop + 'px', left: modalLeft + 'px' }">
      <div class="item" @click.stop="onMove">移动</div>
      <div class="item" @click.stop="onDelete">删除</div>
    </div>
  </div>

  <!-- 详情弹窗 -->
  <MoveModal ref="moveModalRef" :subjectId="subjectId" :megId="megId" @success="successModal" @close="closeModal"  />
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

const moveModalRef = ref(null)

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
const subjectId = ref<string>(String(route.query.subjectId|| ''))

const tableData = ref<any[]>([])
const isAllData = ref<boolean>(false)
const loading = ref<boolean>(false)
const total = ref<number>(0)
const pageNum = ref<number>(1)
const pageSize = ref<number>(12)

const curFolder = ref<any>({})

// 点击左侧列表后
function selectFolder(res: any) {
  console.log('selectFolder :>> ', res);
  curFolder.value = res
  onSearch()
}

// 查询
function onSearch() {
  pageNum.value = 1
  pageSize.value = 12
  tableData.value = []
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
    console.log('到底了，不再请求 :>> ');
    return
  }
  const params = {
    subjectId: subjectId.value,
    taskId: curFolder.value.taskId,
    className: curFolder.value.className,
    pageNum: pageNum.value,
    pageSize: pageSize.value,
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
        figPath: item.fig_path,
        spikeTime: item.spike_time,
        thumbImg: `data:image/png;base64,${item.spike_fig}`,
        taskId: item.task_id,
        className: curFolder.value.className
      }
    })

    if (tableData.value.length >= total.value) {
      console.log('到底了，不再请求 :>> ');
      isAllData.value = true
      return
    }

    tableData.value = [
      ...tableData.value, ...newData
    ]
  }

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
  confirmDeleteModal('删除', `确定删除【${record.spikeTime}】吗？`, () => {
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
    newClassName : 'badcase',
    taskId: curItem.value.taskId,
    spikeTime: curItem.value.spikeTime,
    oldClassName : curFolder.value.className,
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
  tableData.value = tableData.value.filter(f=>f.spikeTime !== curItem.value.spikeTime)
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
    item.bigImg =  `data:image/png;base64,${data.org_map}`
    previewImg(item.bigImg)
  }

}

</script>

<style  lang="less" scoped>
.list {
  font-size: 16px;
  color: var(--color-t2);
  background: #fff;
  height: calc(100vh - 70px - 16px - 16px - 16px);
  overflow: scroll;

  .item {
    width: 220px;
    // height: 220px;
    cursor: pointer;
    position: relative;
    padding: 4px;
    margin: 8px;
    display: inline-flex;
    flex-wrap: wrap;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);
    // border: 1px solid #ddd;
    border-radius: 2px;

    >div {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 100%;
        padding: 1px;
        border-radius: 6px;
      }
    }

    &:hover {
      background: rgba(8, 97, 255, 0.3);
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
      border-radius: 8px;
    }

    &.active {
      color: #fff;
      background: rgba(8, 97, 255);
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
      border-radius: 8px;
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
  width: 100px;
  background: #fff;
  overflow: hidden;
  cursor: pointer;
  position: absolute;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
  border-radius: 6px;
  padding: 4px;

  .item {
    width: 100%;
    height: 30px;
    line-height: 30px;
    padding-left: 8px;
    cursor: pointer !important;
    position: relative;
    display: flex;
    align-items: center;

    .point {
      width: 9px;
      height: 9px;
      border-radius: 9px;
      border: 1px solid;
      display: inline-block;
    }

    &:hover {
      background: #e6efff;
      // background: rgb(245, 245, 245);
      background: #f5f5f5;
      color: var(--color-primary);
      border-radius: 4px;
    }

  }

}
</style>