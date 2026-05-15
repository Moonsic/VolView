<template>
  <a-modal :width="1000" v-model:open="visible" :title="t('模板管理')" :maskClosable="false" :destroyOnClose="true" :footer="null"
    @ok="modalCancel" @cancel="modalCancel">
    <a-table class="table" rowKey="id" size="small" :columns="tableColumns" :data-source="props.templateList"
      :pagination="false" :scroll="{ x: true, y: 600 }">
      <template #bodyCell="{ record, column }">
        <template v-if="column.dataIndex === 'template_data'">

          <div class="item">
            <div class="label">主 诉：</div>
            <div>{{ record.template_data.complaint }}</div>
          </div>
          <div class="item">
            <div class="label">服药情况：</div>
            <div>{{ record.template_data.medication }}</div>
          </div>
          <div class="item">
            <div class="label">检查状态：</div>
            <div>{{ record.template_data.checkState }}</div>
          </div>
          <div class="item">
            <div class="label">脑磁图所见：</div>
            <div>{{ record.template_data.megFindings }}</div>
          </div>
          <div class="item">
            <div class="label">印象：</div>
            <div>{{ record.template_data.conclusion }}</div>
          </div>
          <div class="item">
            <div class="label">备注：</div>
            <div>{{ record.template_data.notes }}</div>
          </div>
          <div class="item">
            <div class="label">分析者：</div>
            <div>{{ record.template_data.analyst }}</div>
          </div>
          <div class="item">
            <div class="label">报告医生：</div>
            <div>{{ record.template_data.reportDoctor }}</div>
          </div>
        </template>

        <template v-if="column.dataIndex === 'operation'">
          <a-space>
            <a href="javascript:;" @click.stop="onDelete(record)">{{ t('删除') }}</a>
          </a-space>
        </template>

      </template>
    </a-table>
  </a-modal>
</template>

<script lang="ts" setup>
import { message, Modal } from 'ant-design-vue'
import {
  deleteReportTemplateApi // 13. 保存报告模板列表
} from '@/api/report'

const { t } = useI18n()

const props = defineProps({
  templateList: {
    type: Array,
    default: () => [],
  }
})

const emit = defineEmits(['success'])


const visible = ref<boolean>(false)

const tableColumns = [
  {
    title: t('模板名称'),
    dataIndex: 'template_name',
    width: 120,
  },
  {
    title: t('模板信息'),
    dataIndex: 'template_data',
  },
  {
    title: t('操作'),
    dataIndex: 'operation',
    width: 70,
  }
]


// 显示弹窗
function showModal() {
  visible.value = true
}

// 删除
function onDelete(record: any) {
  Modal.confirm({
    title: t('删除'),
    content: `确认删除【${record.template_name}】？`,
    okType: 'danger',
    okText: t('删除'),
    async onOk() {
      const params = {
        id: record.id,
      }
      const { code, msg } = await deleteReportTemplateApi(params)
      if (code === 200) {
        message.success(msg)
        emit('success')
      }
    },
  })
}

// 取消弹窗
function modalCancel() {
  visible.value = false
}

// 暴露方法
defineExpose({
  visible,
  showModal
})

</script>

<style lang="less" scoped>
.item {
  display: flex;
  padding: 4px;
  border: var(--border-card);

  &:not(:first-child) {
    border-top: none;
  }

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }

  .label {
    width: 100px;
    text-align: right;
  }

  >div:not(:first-child) {
    flex: 1;
  }
}
</style>