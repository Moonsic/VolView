<template>

  <NoData :loading="loading" text="暂无分组" height="300px" v-if="!tableData.length" />

  <div class="list" id="clusterFolder">
    <div class="item" v-for="(item, index) in tableData" :key="index"
      :class="{ active: item.className === curItem.className }" @click="clickItem(item)">
      <div class="left">
        <div class="text-ellipsis-2 break-all text-bold">
          {{ item.className }}
        </div>
        <div class="text-ellipsis mb4">
          <span class="text-14"> 数量： </span>
          {{ item.spikesNum }}
        </div>
      </div>
      <div class="img-box">
        <img :src="item.thumbImg" alt="" @click.stop="previewBigImg(item)">
        <!-- <img :src="item.thumbImg" alt="" @click.stop="previewImg(item.thumbImg)"> -->
      </div>
    </div>
  </div>

  <!-- <div class="list" id="clusterFolder">
    <div class="item3" v-for="(item, index) in tableData" :key="index"
      @click="clickItem(item)">
      <div :class="{ active: item.id === curItem.id }">
        <div class="left">
          <div class="text-ellipsis-2 break-all text-bold">
            {{ item.className }}
          </div>
          <div class="text-ellipsis mb4">
            <span class="text-14"> 数量： </span>
            {{ item.spikesNum }}
          </div>
        </div>
        <div class="img-box">
          <img :src="item.thumbImg" alt="" @click.stop="previewImg(item.thumbImg)">
        </div>
      </div>
    </div>
  </div> -->
</template>

<script lang="ts" setup>
// import { throttle } from '@u/utils'
import { previewImg } from '@u/preview'
import { useClusterStore } from '@/store/cluster'

import {
  getClusterListApi, // 15.  获取聚类列表
  getOrgAvgMapApi, // 16. 获取每类平均图的原图
} from '@/api/meg'


// 暴露方法
defineExpose({
  refreshFolderList,
})

const emit = defineEmits(['setFolderList', 'selectFolder'])


const route = useRoute()
const subjectId = ref<string>(String(route.query.subjectId || ''))

const tableData = ref<any[]>([])
const loading = ref<boolean>(false)
const curItem = ref<any>({})


getData(true)

// 获取数据
async function getData(first: boolean = false) {
  const params = {
    subjectId: subjectId.value,
  }
  loading.value = true
  const { code, data } = await getClusterListApi(params)
  loading.value = false
  if (code === 200) {
    const newData = data.clusters_list.map((item: any) => {
      return {
        className: item.class_name,
        spikesNum: item.spikes_num,
        thumbImg: item.avg_fig ? `data:image/png;base64,${item.avg_fig}` : null,
        taskId: data.task_id
      }
    })
    tableData.value = newData || []

    // // 如果原来有列表，说明之前是从刷新列表来的
    // if (tableData.value.length) {
    //   // 这一步会把整个item换掉，所以所有的大图都消失了，不用担心大图没更新
    //   tableData.value.forEach((item: any, index: number) => {
    //     const target = newData.find((f: any) => f.className === item.className)
    //     console.log('target :>> ', target);
    //     tableData.value[index] = target
    //   })
    // } else {
    //   // 第一次进页面
    //   tableData.value = newData || []
    // }



    // 在调用聚类算法弹窗中需要
    const clusterStore = useClusterStore()
    clusterStore.setFolderList(tableData.value)

    // 默认选中第一个
    if (first && tableData.value.length) {
      clickItem(tableData.value[0])
    }
  }

}

// {
//     "classes_num": 3,
//     "clusters_list": [
//         {
//             "class_name": "badcase",
//             "spikes_num": 14,
//             "avg_fig": ""
//         },
//         {
//             "class_name": "cls0",
//             "spikes_num": 6,
//             "avg_fig": ""
//         },
//         {
//             "class_name": "cls1",
//             "spikes_num": 6,
//             "avg_fig": ""
//         },
//     ],
//     "task_id": "8eb36b1a-bc1d-11ee-81db-3cecefaf2582"
// }

// 刷新列表
function refreshFolderList() {
  getData()
}

// 点击
function clickItem(item: { id: number }) {
  curItem.value = item
  emit('selectFolder', item)
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
    className: item.className,
  }
  const { code, data } = await getOrgAvgMapApi(params)
  if (code === 200) {
    item.bigImg = `data:image/png;base64,${data.org_map}`
    previewImg(item.bigImg)
  }
}


</script>

<style lang="less" scoped>
.list {
  width: 100%;
  height: calc(100% - 46px - 4px - 4px);
  font-size: 16px;
  margin-top: 4px;
  color: var(--color-t2);
  overflow: auto;
  overflow-y: overlay;
  position: relative;

  &::-webkit-scrollbar {
    width: 2px;
  }

  .item {
    margin-bottom: 8px;
    padding: 8px;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    border-radius: 10px;
    border: var(--border-card);
    background: var(--color-bg);

    .left {
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      >div {
        width: 112px;
      }
    }

    .img-box {
      width: 80px;
      height: 80px;

      img {
        width: 100%;
        border-radius: 6px;
        cursor: zoom-in;

        &:hover {
          outline: 2px solid rgba(8, 97, 255, 0.4);
        }
      }
    }

    // 先hover
    &:hover {
      color: #fff;
      background: var(--color-primary);
    }

    // 再选中
    &.active {
      color: #fff;
      background: var(--color-primary);
    }
  }

}
</style>