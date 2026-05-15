<template>
  <!-- <div class="list-page">
    <div class="list-title flex-between">
      <span>选择配准结果</span>
    </div>
    <div class="flex-center p8 pb12">
      <a-select class="flex-1 widthP100 select-style" v-model:value="form.curCoregId" placeholder="请先选择配准结果"
        @change="changeCoreg" :getPopupContainer="(triggerNode: any) => triggerNode.parentNode">
        <a-select-option v-for="(item) in tableData" :value="item.id" :key="item.id">
          <div class="option-item">{{ item.fifFilePath }}</div>
          <div class="option-item">{{ item.niiFilePath }}</div>
        </a-select-option>
      </a-select>
    </div>
  </div> -->
<div></div>
</template>
<!-- 这个页面虽然没有html内容，但引用到了，所以不能删除 -->
<script lang="ts" setup>
import { message } from 'ant-design-vue'

import {
  getCoregResultListApi, // 1. 获取配准结果列表
} from '@/api/sl'

const { t } = useI18n()

const props = defineProps({
  megId: {
    type: String,
    default: '',
  },
  coregId: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['getCurData'])

// 暴露方法
defineExpose({
  getData,
})

const tableData = ref<any[]>([]) // 列表

const curCoreg = ref<any>({}) // 当前配准结果

const form = reactive<any>({
  curCoregId: null,  // 配准结果 string
})

onMounted(() => {
  getData()
})

// 获取数据
async function getData() {
  // megId不能为空
  if (!props.megId) {
    return
  }
  const params = {
    megId: props.megId,
  }
  const { code, data } = await getCoregResultListApi(params)
  if (code === 200) {
    tableData.value = data || []
    curCoreg.value = tableData.value.find(f => f.id === props.coregId)

    if (curCoreg.value) {
      form.curCoregId = curCoreg.value.id
      emit('getCurData', curCoreg.value)
    } else {
      form.curCoregId = null // 切换患者时要清空它
      // message.info('请先选择配准结果')

      if (tableData.value.length) {
        curCoreg.value = tableData.value[0]
        form.curCoregId = curCoreg.value.id
        emit('getCurData', curCoreg.value)
      } else {
        message.info(t('请先选择配准结果'))
      }
    }
  }
}

// {
//     "id": "51b94386-ba9e-11ee-a7d8-32c50bfc0160",
//     "fifFilePath": "sub-01/meg/sub-001_task-resting-01.fif",
//     "niiFilePath": "sub-01/anat/sub-001_T1w.nii",
//     "time": "2024-01-24 17:52:44",
//     "coregResultPath": "/output/coregistration/sub-01/51b94386-ba9e-11ee-a7d8-32c50bfc0160/coreg-trans.fif"
// }


// 修改配准结果
function changeCoreg(e: string) {
  form.curCoregId = e
  curCoreg.value = tableData.value.find(f => f.id === e)
  emit('getCurData', curCoreg.value)
}

</script>

<style lang="less" scoped>
.list-title {
  color: #fff;
  background: var(--color-title-bg-blue);
}

// 必须要加上 :getPopupContainer="(triggerNode: any) => triggerNode.parentNode"，否则会在body下，无法生效
:deep(.select-style) {
  .ant-select-selector {
    height: auto !important;
    min-height: 50px !important; // 想让内容很长是掉下来，但height 默认为114px，修改不了，难搞
    padding: 4px 0 4px 6px;
    font-size: 13px;

    background: var(--color-primary-005) !important; // 背景要加!important
    border: var(--border-transparent);

    .ant-select-selection-item {
      line-height: 22px !important;
      white-space: normal;
      word-break: break-all;

      &::after {
        display: none;
      }
    }

    .ant-select-selection-placeholder {
      line-height: 44px;
    }
  }

  // 改变下拉框打开时的选项样式
  .ant-select-dropdown {

    // display: block !important; // 测试的时候把这个打开就行了
    .ant-select-item-option {
      padding: 6px 4px;
      font-size: 12px;

      .option-item {
        white-space: normal;
        word-break: break-all;
      }
    }

    // .ant-select-item-option-active {
    // }
    // .ant-select-item-option-selected {
    // }
  }
}
</style>
