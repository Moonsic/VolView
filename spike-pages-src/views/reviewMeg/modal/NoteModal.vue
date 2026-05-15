<template>
  <a-modal :width="600" v-model:open="visible" :confirm-loading="loading" :title="t('添加备注')" :maskClosable="false"
    :destroyOnClose="true" :okText="t('保存')" @ok="modalOk" @cancel="modalCancel">
    <div class="page">
      <div class="left">
        <div class="title">{{ t('列表') }}</div>
        <div class="menu-list">
          <div class="item" v-for="(item, index) in spikeList" :key="index" :class="{ active: item.id === curItem.id }"
            @click="clickItem(item)">
            {{ item.startTime }}
            <span class="point" v-if="item.newNote !== item.note"></span>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="title">{{ curItem.startTime }}</div>
        <div class="textarea-box">
          <a-textarea v-model:value="curItem.newNote" :placeholder="t('请输入备注')" :auto-size="{ minRows: 12 }" />
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { message, Modal } from 'ant-design-vue'

import {
  getSpikeNoteApi, // 49. 获取时刻点备注
  updateSpikeNoteApi // 50.  设置时刻点备注
} from '@/api/meg'

const { t } = useI18n()

const props = defineProps({
  subjectId: {
    type: String,
    default: '',
  },
  fifFilePath: {
    type: String,
    default: '',
  },
  isManual: {
    type: Boolean,
    default: false,
  }
})


const emit = defineEmits(['success'])

const visible = ref<boolean>(false)
const loading = ref<boolean>(false)


// 左侧菜单 value为string比较好，方便url跳转
const spikeList = ref<any[]>([])
const curItem = ref<any>({})
// 显示弹窗
function showModal(record: any) {
  console.log('record :>> ', record);
  visible.value = true
  spikeList.value = []
  curItem.value = {
    id: record.id,
    startTime: props.isManual ? record.startTime : record.spikeTime, // 2个列表的字段是不一样的
    note: '',        // 原始备注
    newNote: '',      // 修改后的备注
  }
  getSpikeList()
}


async function getSpikeList() {
  const params = {
    fifFilePath: props.fifFilePath,
    subjectId: props.subjectId,
    isManual: props.isManual,
  }
  const { code, data } = await getSpikeNoteApi(params)
  if (code === 200) {
    // 处理API数据，保持响应式
    // 确保note、newNote都是字符串
    data?.forEach((item: any) => {
      item.note = item.note || '' // 确保为字符串
      item.newNote = item.note
    })
    spikeList.value = data || []

    const target = spikeList.value.find(item => item.id === curItem.value.id)
    if (target) {
      curItem.value = target
    } else {

      // 按照数字顺序插入新的 curItem
      const insertIndex = spikeList.value.findIndex(
        item => parseFloat(item.startTime) > parseFloat(curItem.value.startTime)
      )

      if (insertIndex === -1) {
        // 放在列表最后
        spikeList.value.push(curItem.value)
        curItem.value = spikeList.value[spikeList.value.length - 1]
      } else {
        // 插入到正确位置
        spikeList.value.splice(insertIndex, 0, curItem.value)
        curItem.value = spikeList.value[insertIndex]
      }

    }
  } else {
    spikeList.value.unshift(curItem.value)
    curItem.value = spikeList.value[0]
  }
}


// 点击
function clickItem(item: any) {
  curItem.value = item
}

// 确定弹窗
async function modalOk() {
  const spikeTimeList = spikeList.value.filter(item => item.newNote !== item.note).map(item => {
    return {
      id: item.id,
      note: item.newNote,
    }
  })
  if (spikeTimeList.length === 0) {
    message.info(t('未修改任何备注'))
    return
  }

  const params = {
    isManual: props.isManual,
    spikeTimeList: spikeTimeList
  }
  loading.value = true
  const { code, msg } = await updateSpikeNoteApi(params)
  loading.value = false
  if (code === 200) {
    message.success(msg)
    emit('success')
    realModalCancel()
  }

}

// 取消弹窗
function modalCancel() {
  const spikeTimeList = spikeList.value.filter(item => item.newNote !== item.note).map(item => {
    return {
      id: item.id,
      note: item.newNote,
    }
  })
  // 阻止原始模态框关闭
  visible.value = true

  if (spikeTimeList.length === 0) {
    realModalCancel()
  } else {
    Modal.confirm({
      title: t('提示'),
      content: t('是否放弃已修改的备注？'),
      okText: t('是'),
      cancelText: t('否'),
      okType: 'danger',
      wrapClassName: 'note-confirm-modal', // 添加自定义类名
      onOk() {
        realModalCancel()
      },
      onCancel() {
      }
    })
  }

}
// 取消弹窗
function realModalCancel() {
  visible.value = false
  loading.value = false
  spikeList.value = []
  curItem.value = {}
}

// 暴露方法
defineExpose({
  visible,
  showModal
})

</script>

<style>
/* 全局样式 - 调整 Modal.confirm 的位置 */
.note-confirm-modal .ant-modal {
  top: 25% !important;
}
</style>

<style lang="less" scoped>
.page {
  display: flex;
  min-height: 322px;
  max-height: 480px;
  position: relative;

  .title {
    font-size: 16px;
    font-weight: 500;
    padding: 8px 0 8px 12px;
  }

  .left {
    width: 130px;
    margin-right: 8px;
    overflow: hidden;
    display: inline-block;
    vertical-align: top;
    background: var(--color-bg-gray);
    border-radius: 4px;

    .menu-list {
      width: 100%;
      height: calc(100% - 50px);
      color: var(--color-t2);
      background: var(--color-bg-gray);
      overflow: auto;

      .item {
        margin: 1px 8px;
        padding: 3px 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;

        // 先hover
        &:hover {
          background: var(--hover-bg-blue);
          border-radius: 4px;
        }

        // 再选中
        &.active {
          background: var(--active-bg-blue);
          border-radius: 4px;
        }

        .point {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--color-green);
        }

      }
    }
  }

  .right {
    flex: 1;
    display: inline-block;
    vertical-align: top;
    position: relative;
    overflow: hidden;
    background: var(--color-bg-gray);
    border-radius: 4px;
    overflow: auto;

    .textarea-box {
      padding: 0 8px 8px;
      height: calc(100% - 42px);

      .ant-input {
        height: 100% !important;
      }
    }
  }
}
</style>